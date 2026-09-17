/**
 * End-to-end smoke test for the quote API — boots the local dev server and
 * exercises: valid intake, validation errors, honeypot, rate limiting,
 * admin auth, status updates, and (baseline R8) non-2xx persistence failure
 * → 503, never a false 201/200. Run with `npm run test:api`.
 */
import http from "node:http";
import { spawn } from "node:child_process";

const PORT = 8791;
const BASE = `http://127.0.0.1:${PORT}`;
const env = {
  ...process.env,
  PORT: String(PORT),
  ADMIN_TOKEN: "test-admin-token",
  RATE_LIMIT_PER_MINUTE: "3",
  RATE_LIMIT_PER_DAY: "10",
  DEV_DATA_FILE: ".dev-data/test-quotes.ndjson",
};

const server = spawn("node", ["scripts/dev-api.mjs"], { env, stdio: ["ignore", "pipe", "pipe"] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = 0;
const check = (name, cond, extra = "") => {
  console.log(`${cond ? "✓" : "✗"} ${name}${cond ? "" : " — " + extra}`);
  if (!cond) failed++;
};

const post = (path, body, headers = {}) =>
  fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

try {
  await wait(700);

  // 1. valid request
  const good = await post("/api/quote", {
    name: "Karim Benali",
    phone: "+213 6 12 34 56 78",
    email: "karim@exemple.dz",
    service: "Inspection sur chantier",
    message: "Suivi d'avancement hebdomadaire d'un chantier R+4 à El Caliptous — besoin d'un devis.",
    website: "",
  });
  const goodJson = await good.json();
  check("valid request → 201 + id", good.status === 201 && goodJson.ok && goodJson.id, JSON.stringify(goodJson));

  // 2. invalid input
  const bad = await post("/api/quote", { name: "K", phone: "abc", service: "Voyage", message: "salut" });
  const badJson = await bad.json();
  check("invalid input → 400 + per-field errors", bad.status === 400 && badJson.fields?.phone && badJson.fields?.service && badJson.fields?.message, JSON.stringify(badJson));

  // 3. SQL/script injection is stripped, record still created
  const dirty = await post("/api/quote", {
    name: "Hacker <script>alert(1)</script>",
    phone: "0661223344",
    service: "Vente",
    message: "'; DROP TABLE quotes;-- besoin drone <img src=x onerror=alert(1)> ",
  });
  const dirtyJson = await dirty.json();
  const listed = await fetch(BASE + "/api/quote-requests", { headers: { Authorization: "Bearer test-admin-token" } });
  const listedJson = await listed.json();
  const stored = listedJson.requests?.find((r) => r.id === dirtyJson.id);
  check("injection attempt sanitized", Boolean(stored) && !stored.name.includes("<") && !stored.name.includes(">"), JSON.stringify(stored?.name));

  // 4. honeypot → fake success, nothing stored
  const before = listedJson.count;
  const bot = await post("/api/quote", { name: "Bot", phone: "0600000000", service: "Vente", message: "x".repeat(20), website: "http://spam.example" });
  const botJson = await bot.json();
  const after = await (await fetch(BASE + "/api/quote-requests", { headers: { Authorization: "Bearer test-admin-token" } })).json();
  check("honeypot bot → 201 but not stored", bot.status === 201 && botJson.ok && after.count === before /* honeypot stored nothing */, `before=${before} after=${after.count}`);

  // 5. rate limiting (limit = 3/min): this is request #4 in the window (good, bad?, dirty, bot)
  const limited = await post("/api/quote", { name: "Encore", phone: "0661223344", service: "Autre", message: "z".repeat(20) });
  check("rate limit → 429 after 3/min", limited.status === 429, "got " + limited.status);

  // 6. admin auth
  const anon = await fetch(BASE + "/api/quote-requests");
  check("admin list without token → 401", anon.status === 401);

  // 7. status update flow
  const patch = await fetch(BASE + "/api/quote-requests", {
    method: "PATCH",
    headers: { Authorization: "Bearer test-admin-token", "Content-Type": "application/json" },
    body: JSON.stringify({ id: goodJson.id, status: "in_review" }),
  });
  const patchJson = await patch.json();
  check("PATCH status → in_review persisted", patch.status === 200 && patchJson.request?.status === "in_review", JSON.stringify(patchJson));

  // 8. method + malformed handling
  const wrongMethod = await fetch(BASE + "/api/quote", { method: "GET" });
  check("GET /api/quote → 405", wrongMethod.status === 405);
  const malformed = await fetch(BASE + "/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" });
  check("malformed JSON → 400", malformed.status === 400);

  // 9. oversized body rejected
  const huge = await post("/api/quote", { name: "A".repeat(9000), phone: "0600000000", service: "Vente", message: "B".repeat(40000) });
  check("oversized payload → 400/413", huge.status === 400 || huge.status === 413, "got " + huge.status);

  // 10. R8 regression: non-2xx persistence (Upstash failure) → 503, never a
  // false 201/200. A mock Upstash REST proxy answers 500 to everything; a
  // second API instance is pointed at it.
  const MOCK_PORT = 8792;
  const FAIL_PORT = 8793;
  const mock = http.createServer((req, res) => {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "simulated upstash failure" }));
  });
  await new Promise((resolve) => mock.listen(MOCK_PORT, "127.0.0.1", resolve));
  const failingServer = spawn("node", ["scripts/dev-api.mjs"], {
    env: {
      ...process.env,
      PORT: String(FAIL_PORT),
      ADMIN_TOKEN: "test-admin-token",
      UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${MOCK_PORT}`,
      UPSTASH_REDIS_REST_TOKEN: "mock-token",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await wait(700);
  const failBase = `http://127.0.0.1:${FAIL_PORT}`;
  const failedIntake = await fetch(failBase + "/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test R8", phone: "0661223344", service: "Vente", message: "Régression R8 : persistance en échec, 503 attendu." }),
  });
  const failedIntakeJson = await failedIntake.json();
  check("R8: non-2xx persistence → 503, never false 201", failedIntake.status === 503 && failedIntakeJson.ok === false, `got ${failedIntake.status} ${JSON.stringify(failedIntakeJson)}`);
  const failedPatch = await fetch(failBase + "/api/quote-requests", {
    method: "PATCH",
    headers: { Authorization: "Bearer test-admin-token", "Content-Type": "application/json" },
    body: JSON.stringify({ id: "any-id", status: "in_review" }),
  });
  const failedPatchJson = await failedPatch.json();
  check("R8: admin PATCH on failing store → 503, never false 200", failedPatch.status === 503 && failedPatchJson.ok === false, `got ${failedPatch.status} ${JSON.stringify(failedPatchJson)}`);
  failingServer.kill("SIGTERM");
  mock.close();
} catch (err) {
  check("suite ran without exception", false, String(err));
} finally {
  server.kill("SIGTERM");
}

console.log(failed === 0 ? "\nALL API TESTS PASSED" : `\n${failed} TEST(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
