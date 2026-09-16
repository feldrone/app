/**
 * FEL DRONE — quote-request core (framework-free, dependency-free) — V10.
 *
 * Same module runs inside Vercel serverless functions (`api/*.js`) and in
 * the local dev server (`scripts/dev-api.mjs`). No secrets are imported
 * anywhere except via `process.env` at call time, so nothing can leak into
 * the frontend bundle (which never imports this file).
 *
 * V10: adds optional company, required wilaya (for new forms), preserves
 * backward compat with V8 payloads (without wilaya) — validation, sanitization,
 * honeypot, rate limiting, CORS, payload protection, durable storage,
 * admin protection, honest email status all preserved.
 */
import { randomUUID } from "node:crypto";
import fsNode from "node:fs";

export const SERVICES = [
  "Topographie & photogrammétrie",
  "Suivi & inspection de chantier",
  "Maintenance & diagnostic drone",
  "Thermographie",
  "Agriculture",
  "Vente",
  "Location",
  "Autre",
  // Legacy V8 values for backward compatibility
  "Maintenance",
  "Prestations de services",
  "Inspection sur chantier",
];

export const LIMITS = {
  name: 80,
  phone: 20,
  email: 120,
  company: 120,
  wilaya: 80,
  service: 60,
  message: 3000,
};

/** Control chars, angle brackets and null bytes have no business here. */
function clean(value, max) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function validateQuote(raw) {
  const errors = {};
  const src = raw && typeof raw === "object" ? raw : {};

  const message = clean(src.message, LIMITS.message);
  const value = {
    name: clean(src.name, LIMITS.name),
    phone: clean(src.phone, LIMITS.phone),
    email: src.email === undefined || src.email === null || src.email === "" ? null : clean(src.email, LIMITS.email),
    company: src.company === undefined || src.company === null || src.company === "" ? null : clean(src.company, LIMITS.company),
    wilaya: clean(src.wilaya ?? src.wilayaDuBesoin ?? "", LIMITS.wilaya),
    service: SERVICES.includes(String(src.service ?? "").trim()) ? String(src.service).trim() : "",
    message,
  };

  if (value.name.length < 2) errors.name = "Nom trop court (2 caractères minimum).";
  const phoneDigits = (value.phone.match(/\d/g) ?? []).length;
  if (!/^[+0-9][0-9 ().+/–-]{5,19}$/.test(value.phone) || phoneDigits < 8 || phoneDigits > 15)
    errors.phone = "Numéro de téléphone invalide.";
  if (value.email !== null && !/^[^\\s@]+@[^\\s@]+\.[^\\s@]{2,}$/.test(value.email))
    errors.email = "Format d'email invalide.";
  if (value.company !== null && value.company.length > LIMITS.company) errors.company = "Société trop longue.";
  // Wilaya required for V10 when field is present; allow legacy V8 payloads without wilaya for backward compat
  if (src.wilaya !== undefined || src.wilayaDuBesoin !== undefined) {
    if (value.wilaya.length < 2) errors.wilaya = "Wilaya du besoin trop courte (2 caractères minimum).";
  }
  if (!value.service) errors.service = "Service inconnu ou manquant.";
  if (value.message.length < 15) errors.message = "Message trop court (15 caractères minimum).";

  return { ok: Object.keys(errors).length === 0, errors, value };
}

/* ------------------------------------------------------------------ */
/* Storage — Upstash Redis when configured, file in dev, memory worst. */
/* ------------------------------------------------------------------ */

export function createStore(env = process.env) {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return redisStore(url, token, fetch);
  if (env.DEV_DATA_FILE) return fileStore(env.DEV_DATA_FILE);
  return memoryStore();
}

const KEY = "feldrone:quotes";

function redisStore(url, token, fetchImpl) {
  const call = (...args) =>
    fetchImpl(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
  return {
    kind: "redis",
    async save(record) {
      await call("HSET", KEY, record.id, JSON.stringify(record));
    },
    async list(limit = 200) {
      const res = await call("HGETALL", KEY);
      if (!res.ok) throw new Error(`store:${res.status}`);
      const { result } = await res.json();
      const out = [];
      for (let i = 0; i < (result ?? []).length; i += 2) {
        try {
          out.push(JSON.parse(result[i + 1]));
        } catch {
          /* corrupted entry — skip, never leak */
        }
      }
      return out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
    },
    async setStatus(id, status) {
      const res = await call("HGET", KEY, id);
      if (!res.ok) return null;
      const { result } = await res.json();
      if (!result) return null;
      const record = { ...JSON.parse(result), status, updatedAt: new Date().toISOString() };
      await call("HSET", KEY, id, JSON.stringify(record));
      return record;
    },
  };
}

function memoryStore() {
  const data = new Map();
  return {
    kind: "memory",
    async save(record) {
      data.set(record.id, record);
    },
    async list(limit = 200) {
      return [...data.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
    },
    async setStatus(id, status) {
      const r = data.get(id);
      if (!r) return null;
      const next = { ...r, status, updatedAt: new Date().toISOString() };
      data.set(id, next);
      return next;
    },
  };
}

function fileStore(file) {
  const fs = () => fsNode;
  return {
    kind: "file",
    async save(record) {
      fs().appendFileSync(file, JSON.stringify(record) + "\n");
    },
    async list(limit = 200) {
      try {
        const lines = fs().readFileSync(file, "utf8").split("\n").filter(Boolean);
        return lines
          .map((l) => {
            try {
              return JSON.parse(l);
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          .slice(0, limit);
      } catch {
        return [];
      }
    },
    async setStatus(id, status) {
      const all = await this.list(10000);
      const target = all.find((r) => r.id === id);
      if (!target) return null;
      const updated = all.map((r) => (r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r));
      fs().writeFileSync(file, updated.map((r) => JSON.stringify(r)).join("\n") + "\n");
      return updated.find((r) => r.id === id);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Rate limiting — fixed windows; Redis when present, memory fallback. */
/* ------------------------------------------------------------------ */

export function createRateLimiter(env = process.env) {
  const perMinute = Number(env.RATE_LIMIT_PER_MINUTE ?? 3);
  const perDay = Number(env.RATE_LIMIT_PER_DAY ?? 10);
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    return {
      async check(ip) {
        const call = async (...args) => {
          const res = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });
          if (!res.ok) throw new Error(`rate:${res.status}`);
          return (await res.json()).result;
        };
        try {
          const minute = await call("INCR", `feldrone:rl:m:${ip}`, "EXPIRE", 61);
          const day = await call("INCR", `feldrone:rl:d:${ip}`, "EXPIRE", 86461);
          return minute <= perMinute && day <= perDay;
        } catch {
          return true;
        }
      },
    };
  }

  const hits = new Map();
  return {
    async check(ip) {
      const now = Date.now();
      let entry = hits.get(ip);
      if (!entry) hits.set(ip, (entry = { minute: [], day: [] }));
      entry.minute = entry.minute.filter((t) => now - t < 60_000);
      entry.day = entry.day.filter((t) => now - t < 86_400_000);
      if (entry.minute.length >= perMinute || entry.day.length >= perDay) return false;
      entry.minute.push(now);
      entry.day.push(now);
      return true;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Notification email — Resend REST, env-gated, never throws.          */
/* ------------------------------------------------------------------ */

export async function notifyCompany(record, env = process.env) {
  const key = env.RESEND_API_KEY;
  const to = env.NOTIFY_TO;
  const from = env.EMAIL_FROM;
  if (!key || !to || !from) return { sent: false, reason: "email-not-configured" };
  const text = [
    "Nouvelle demande reçue via feldrone.dz — V10",
    "",
    `Référence : ${record.id}`,
    `Nom      : ${record.name}`,
    `Téléphone: ${record.phone}`,
    `Société  : ${record.company ?? "—"}`,
    `Wilaya du besoin : ${record.wilaya || "—"}`,
    `Email    : ${record.email ?? "—"}`,
    `Service demandé : ${record.service}`,
    `Date     : ${record.createdAt}`,
    "",
    "Précisions utiles :",
    record.message,
    "",
    `Traiter la demande : API ${env.SITE_ORIGIN ?? "(déploiement)"}/api/quote-requests`,
  ].join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(","), subject: `Demande ${record.service} — ${record.name} — ${record.wilaya || ""}`, text }),
      signal: AbortSignal.timeout(6000),
    });
    return { sent: res.ok, reason: res.ok ? undefined : `resend:${res.status}` };
  } catch (err) {
    return { sent: false, reason: String(err?.name ?? err) };
  }
}

/* ------------------------------------------------------------------ */
/* HTTP plumbing shared by Vercel and the dev server.                  */
/* ------------------------------------------------------------------ */

export function json(res, status, body, { origin } = {}) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  send(res, status, JSON.stringify(body), headers);
}

export function send(res, status, payload, headers = {}) {
  if (res.headersSent) return;
  res.writeHead(status, headers);
  res.end(payload);
}

export function allowedOrigin(env, requestOrigin) {
  if (!requestOrigin) return null;
  const list = (env.SITE_ORIGIN ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return list.includes(requestOrigin) ? requestOrigin : null;
}

export function readJsonBody(req, maxBytes = 32 * 1024) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") return resolve(req.body);
    if (typeof req.text === "function") {
      req
        .text()
        .then((t) => resolve(t ? JSON.parse(t) : {}))
        .catch(reject);
      return;
    }
    let size = 0;
    let tooBig = false;
    const chunks = [];
    req.on("data", (c) => {
      if (tooBig) return;
      size += c.length;
      if (size > maxBytes) {
        tooBig = true;
        reject(Object.assign(new Error("payload_too_large"), { status: 413 }));
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      if (tooBig) return;
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch {
        reject(Object.assign(new Error("invalid_json"), { status: 400 }));
      }
    });
    req.on("error", (e) => {
      if (!tooBig) reject(e);
    });
  });
}

export function clientIp(req) {
  const fwd = req.headers?.["x-forwarded-for"] ?? req.headers?.["X-Forwarded-For"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress ?? "unknown";
}

let sharedStore = null;
let sharedLimiter = null;
export function getStore(env = process.env) {
  return (sharedStore ??= createStore(env));
}
export function getLimiter(env = process.env) {
  return (sharedLimiter ??= createRateLimiter(env));
}

export async function intakeQuote(req, env = process.env, services = { notify: notifyCompany }) {
  const store = services.store ?? getStore(env);
  const limiter = services.limiter ?? getLimiter(env);

  const ip = clientIp(req);
  let payload;
  try {
    payload = await readJsonBody(req, 32 * 1024);
  } catch (err) {
    return { status: err.status ?? 400, body: { ok: false, error: "Requête illisible." } };
  }

  if (typeof payload.website === "string" && payload.website !== "") {
    return { status: 201, body: { ok: true, id: randomUUID() } };
  }

  if (!(await limiter.check(ip))) {
    return { status: 429, body: { ok: false, error: "Trop de demandes récentes. Réessayez dans une minute." } };
  }

  const { ok, errors, value } = validateQuote(payload);
  if (!ok) return { status: 400, body: { ok: false, error: "Certains champs doivent être corrigés.", fields: errors } };

  const record = {
    id: randomUUID(),
    ...value,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  try {
    await store.save(record);
  } catch {
    return { status: 503, body: { ok: false, error: "Le service est momentanément indisponible. Merci de réessayer ou de nous appeler." } };
  }

  const mail = await notifyCompany(record, env).catch(() => ({ sent: false, reason: "notify-error" }));

  return {
    status: 201,
    body: { ok: true, id: record.id },
    debug: env.NODE_ENV === "production" ? undefined : { store: store.kind, email: mail },
  };
}

export async function adminRequests(req, method, env = process.env) {
  const token = (req.headers?.authorization ?? "").replace(/^Bearer\s+/i, "");
  const query = new URL(req.url ?? "/", "http://local");
  if (!env.ADMIN_TOKEN || (token !== env.ADMIN_TOKEN && query.searchParams.get("token") !== env.ADMIN_TOKEN)) {
    return { status: 401, body: { ok: false, error: "Non autorisé." } };
  }
  const store = getStore(env);
  if (method === "GET") {
    const limit = Math.min(500, Number(query.searchParams.get("limit") ?? 100));
    const statusFilter = query.searchParams.get("status");
    let list = await store.list(limit);
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    return { status: 200, body: { ok: true, count: list.length, requests: list } };
  }
  if (method === "PATCH") {
    let payload;
    try {
      payload = await readJsonBody(req, 4096);
    } catch {
      return { status: 400, body: { ok: false, error: "Requête illisible." } };
    }
    const allowed = ["new", "in_review", "scheduled", "done", "archived"];
    if (!payload.id || !allowed.includes(payload.status)) return { status: 400, body: { ok: false, error: "id et status requis." } };
    const updated = await store.setStatus(String(payload.id).slice(0, 64), payload.status);
    return updated
      ? { status: 200, body: { ok: true, request: updated } }
      : { status: 404, body: { ok: false, error: "Demande introuvable." } };
  }
  return { status: 405, body: { ok: false, error: "Méthode non permise." } };
}
