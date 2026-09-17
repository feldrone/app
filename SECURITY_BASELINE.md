# FEL DRONE — Security Baseline (R1–R10 + R14)

Scope of this baseline: the deployed marketing site (Vercel) and the quote
request API (`api/*.js` + `lib/quote-core.mjs`). The baseline is
**additive and non-invasive**: no UI, branding, fonts, routes or product
logic changes, no new dependencies, services, database or auth system.

## In-scope items

| ID | Item | Where | Notes |
| -- | ---- | ----- | ----- |
| R1 | RFC 9116 security contact | `public/.well-known/security.txt` | `Contact: mail:`, `Expires`, `Canonical`. Served at `/.well-known/security.txt`. |
| R2 | Content-Security-Policy — **REPORT-ONLY** | `vercel.json` → headers | `Content-Security-Policy-Report-Only` only. **Invariant: there is no enforcing `Content-Security-Policy` header anywhere.** The single-file build needs `unsafe-inline` (script/style); fonts from Google Fonts, photos from Pexels, the contact map embed from `www.google.com` are allow-listed. |
| R3 | HSTS | `vercel.json` → headers | `Strict-Transport-Security: max-age=31536000; includeSubDomains`. |
| R4 | MIME sniffing disabled | `vercel.json` + `lib/quote-core.mjs` `json()` | `X-Content-Type-Options: nosniff` on the site and on every API response (pre-existing on the API). |
| R5 | Clickjacking protection | `vercel.json` + CSP | `X-Frame-Options: DENY` and `frame-ancestors 'none'` (report-only). |
| R6 | Referrer leakage | `vercel.json` + `lib/quote-core.mjs` `json()` | `Referrer-Policy: no-referrer` on the site and on every API response (pre-existing on the API). |
| R7 | Browser feature lockdown | `vercel.json` → headers | `Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=()`. |
| R8 | Persistence integrity | `lib/quote-core.mjs` | `redisStore.save()`, `setStatus()` (and `list()`) **reject every non-2xx Upstash REST response**. A persistence failure returns **503** — intake never answers a false 201, the admin route never a false 200/404. Regression tests in `scripts/test-api.mjs` (mock Upstash answering 500). |
| R9 | API hardening (enforced, pre-existing) | `lib/quote-core.mjs` | Strict `SITE_ORIGIN` CORS allow-list, `Cache-Control: no-store`, 32 KB body cap (413), control-char/`<>` sanitisation, honeypot, rate limits. Now enforced in CI (R10). |
| R10 | CI security gate | `.github/workflows/deploy.yml` | The build job runs the full validation suite (typecheck, brand, API tests, i18n, build) and a security-gate step asserting: security.txt present with a mail contact, report-only CSP present, **no enforcing CSP**, R3–R7 headers present, R8 reject marker present. |

## Out of scope (explicitly excluded)

- **R11** — excluded from this baseline.
- **R12** — excluded from this baseline.
- **R13** — excluded from this baseline.

Exclusion is a deliberate boundary: anything outside R1–R10 + R14 must not
be smuggled into this change set.

## Documentation gate (R14)

- This file (`SECURITY_BASELINE.md`) — what the baseline is and why.
- `SECURITY_HARDENING_GATE_B.md` — how the baseline is verified before it may be published.
- `docs/BACKEND.md` — API-side behaviour documented (R8 503 contract).

## Changed files (complete list — nothing else)

```
M .github/workflows/deploy.yml
M api/quote-requests.js
M vercel.json
M docs/BACKEND.md
A SECURITY_BASELINE.md
M lib/quote-core.mjs
M scripts/test-api.mjs
A SECURITY_HARDENING_GATE_B.md
A public/.well-known/security.txt
```
