# FEL DRONE — Request API (backend)

Real backend for the public quote-request form. Vercel-native serverless
functions, zero npm dependencies, one shared core module that also runs
locally. The marketing site stays exactly as built — the form now speaks to
this API instead of a mailto.

## Endpoints

| Method | Route                | Public | Purpose                                        |
| ------ | -------------------- | ------ | ---------------------------------------------- |
| POST   | `/api/quote`         | ✅     | Submit a service request (the contact form)     |
| GET    | `/api/quote-requests`| 🔒     | List requests (`?status=new&limit=100`)         |
| PATCH  | `/api/quote-requests`| 🔒     | Update one request: `{ id, status }`            |

Admin routes require `Authorization: Bearer $ADMIN_TOKEN`. That token is the
**only** secret the API ever needs for private reads — it is designed so a
future private dashboard (Next.js, Retool, anything) is just a client of
these two routes.

## Request lifecycle

```
visitor → POST /api/quote
            ├─ honeypot filled?      → 201 fake-success, nothing stored
            ├─ rate limited (3/min,  → 429 with a clear French message
            │  10/day per IP)
            ├─ server validation +    → 400 { fields: {…} }
            │  sanitisation (control
            │  chars, <> stripped)
            ├─ store.save(record)     → id, name, phone, email, service,
            │                            message, status:"new", createdAt
            ├─ notifyCompany()        → Resend email to the company
            │                            (silently skipped if not set up)
            └─ 201 { ok, id }         → UI shows the reference
```

Record shape (document/DB):

```json
{
  "id": "uuid",
  "name": "…", "phone": "…", "email": "… or null",
  "service": "Vente | Location | Maintenance | Prestations de services | Inspection sur chantier | Autre",
  "message": "…",
  "status": "new",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601 (after PATCH)"
}
```

Statuses for the future dashboard: `new → in_review → scheduled → done → archived`.

## Storage drivers

| Env configured                     | Backend                                   | Notes                          |
| ---------------------------------- | ----------------------------------------- | ------------------------------ |
| `UPSTASH_REDIS_REST_URL` + `TOKEN` | Upstash Redis (hash `feldrone:quotes`)    | Recommended free tier         |
| —                                  | In-memory                                 | Dev only; resets on cold start |
| `DEV_DATA_FILE` (dev runner sets it) | `.dev-data/quotes.ndjson` on disk        | Never committed (`git-ignored`) |

**No passwords, no IPs, no visitor analytics are stored.** Phone/email/name
exist solely to answer the request. Redis values are JSON per request; the
admin route is the only reader.

## Email notifications

Set `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_TO` and intake immediately also
sends a plain-text notification (reference, contact, service, message) to
the company address. Failures never break intake (best-effort, logged
server-side). Without the vars, requests queue silently in the store — the
documented behaviour of the current deployment.

## Deploying on Vercel

1. Import the repo (it builds `dist/` with `VITE_BASE=/` via `vercel.json`).
2. Project Settings → Environment Variables → add:
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (Upstash → Redis → REST proxy)
   - `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_TO=contact.feldrone@gmail.com`
   - `ADMIN_TOKEN` (generate: `openssl rand -hex 24`)
   - `SITE_ORIGIN=https://www.feldrone.dz,https://feldrone.github.io` (comma list, CORS allow-list — same-origin calls need no entry)
3. Optional `RATE_LIMIT_PER_MINUTE` / `RATE_LIMIT_PER_DAY` overrides.
4. Redeploy. No secret is committed; `.env*` is git-ignored (`.env.example` documents the contract).

GitHub Pages keeps working untouched: without an API, the form detects the
missing endpoint and offers the prefilled **mailto fallback** — it never
fakes a successful send.

## Local development

```bash
npm run dev          # site (vite proxies /api → :8787)
npm run dev:api      # the same handlers over node:http
npm run test:api     # 10-case end-to-end suite (validation, bots, limits, auth)
```

## Security notes

- **Server-side validation is authoritative** (the browser mirror is UX only):
  enum-checked service, phone digit-count + charset, lengths, `<>`-stripped,
  control chars removed, 32 KB body cap (413 beyond).
- **Rate limiting**: fixed windows per client IP, 3/min + 10/day defaults.
- **CORS**: strict allow-list from `SITE_ORIGIN`; preflight only on the two
  routes; `Vary`-free because responses never carry cross-origin data to
  unknown callers.
- **Anti-abuse**: honeypot field (bots get a fake success), no timing oracle
  on admin token comparison in hot paths, `Cache-Control: no-store` on every
  API response, `X-Content-Type-Options: nosniff`.
- **Error handling**: 400 (with per-field map), 401, 404, 405, 413, 429, 503
  — all French-readable, never stack traces, never echo raw input.

## Admin dashboard (ready, not built)

`GET /api/quote-requests` + `PATCH {id,status}` are everything a private
dashboard needs: list with `status=new`, triage, archive. The UI can be a
standalone page behind Vercel Authentication later — no API changes required.
