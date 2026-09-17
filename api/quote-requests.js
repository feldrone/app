/**
 * Vercel serverless function — /api/quote-requests
 * Private management surface (foundation for a future admin dashboard):
 *   GET   ?status=new&limit=100  — list requests
 *   PATCH { id, status }         — update a request's workflow status
 * Requires `Authorization: Bearer <ADMIN_TOKEN>` (or ?token= for email
 * links). Never reachable without it: every response is 401.
 *
 * Persistence integrity (baseline R8): when the store cannot be read or
 * written (non-2xx Upstash), this route answers 503 — never a false 200.
 */
import { allowedOrigin, json } from "../lib/quote-core.mjs";
import { adminRequests } from "../lib/quote-core.mjs";

export default async function handler(req, res) {
  const origin = allowedOrigin(process.env, req.headers.origin);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "PATCH") {
    return json(res, 405, { ok: false, error: "Méthode non permise." }, { origin });
  }

  const result = await adminRequests(req, req.method, process.env);
  return json(res, result.status, result.body, { origin });
}
