# FEL DRONE — corporate website

SARL FEL DRONE (El Tarf, Algérie): vente, location, maintenance et prestations
de services par drone professionnel.

## Stack

- Vite 7 + React 19 + TypeScript (strict)
- Tailwind CSS 4 — design tokens in `src/index.css` (`@theme`)
- No UI framework, no animation library: interactions are ~50 lines of
  hand-rolled IntersectionObserver (`src/components/Reveal.tsx`)
- Single-file production build (`vite-plugin-singlefile`)

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve dist/ (host allowlist: *.e2b.app, see vite.config.ts)
npm run pages:sync # after build: write the single-file bundle to ./index.html
                   # (the entry GitHub Pages' branch source serves under /app/)
```

## GitHub Pages deployment

- `base: "/app/"` in `vite.config.ts` matches the Pages project path.
- Pages currently deploys **branch `main` / root**. The repo-root `index.html`
  is therefore the *built* single-file bundle (generated — never edited by
  hand); the Vite source template lives in `template.html` (`npm run dev`
  opens `/template.html`).
- `.github/workflows/deploy.yml` builds on every push to `main`, refreshes
  the generated root `index.html` + `favicon.svg` (commit `[skip ci]`), and
  additionally uploads `dist/` as a Pages artifact — so the site also works
  out of the box if the Pages source is ever switched to "GitHub Actions".
```

## Content & imagery — how to change them

| What to change                  | Where                          |
| ------------------------------- | ------------------------------ |
| Legal identity, contacts         | `src/data/content.ts`          |
| Leadership entries (1..N)       | `src/data/content.ts → team`   |
| Services (cards, workflows, CTAs) | `src/data/content.ts → services` |
| FAQ entries                       | `src/data/content.ts → faq`      |
| Quote API (backend)               | `api/` + `lib/quote-core.mjs` (see `docs/BACKEND.md`) |
| Photography (source & crops)    | `src/lib/images.ts`            |
| Logo mark & wordmark            | `src/components/Logo.tsx` + `public/favicon.svg` |
| Identity rules, lockups, palette  | `docs/BRAND.md` + `public/brand/`    |
| Image licensing inventory       | `docs/IMAGES.md`               |

The identity is the engineered "Gantry F" system (mark, wordmark, lockups)
introduced in the 2026 brand redesign — geometry, usage rules and the full
asset manifest live in **[`docs/BRAND.md`](docs/BRAND.md)**; ready-to-use SVGs
in `public/brand/`. `src/components/Logo.tsx` embeds the primary horizontal
lockup as pure vector paths, and `public/favicon.svg` is the symbol on a navy
chip. If the brand supplies a newer master, replace the path data in those
two files (plus `public/brand/`) — no layout changes are needed.


Factual rules for this site:

- **Only company-supplied data is published.** No testimonials, no client
  logos, no statistics, no awards unless the company provides them.
- **No administrative or financial data in the marketing UI.** Share
  capital, registry dates and similar fields live in `content.ts` as
  internal records and are never rendered; the RC number appears solely in
  the discreet "Mentions légales" block (footer link), outside the
  marketing flow.
- **Drone imagery only.** Every aviation visual must show real professional
  UAVs, operators or workshops — never manned aircraft, cockpits, airports
  or military hardware (see `docs/IMAGES.md`).

## Notes

- Photography is hotlinked from the Pexels CDN with server-side crops
  (`auto=compress`, `fit=crop`, explicit `w`/`h`) — to move to self-hosted
  optimized files, change the URL builders in `src/lib/images.ts` only.
- The contact form has **no backend** by design: it validates, then opens
  the visitor's mail client with a prefilled `mailto:` draft. The UI states
  this explicitly.
- Print: the whole page prints as a clean document — chrome, photos and
  interactive UI are hidden and page-break rules keep headings with their
  content (see `src/index.css` under `@media print`).
- SEO head (title, OG, canonical, JSON-LD Organization) lives in
  `index.html`; adjust the domain there and in `public/robots.txt` +
  `public/sitemap.xml` when the final hostname is decided.

## Quote-request API (backend)

The contact form posts to `POST /api/quote` — Vercel serverless functions in
`api/` sharing one dependency-free core (`lib/quote-core.mjs`): server-side
validation + sanitisation, per-IP rate limiting, a honeypot, persistent
records (Upstash Redis when configured, in-memory for dev) and best-effort
email notification to the company via Resend. A private, token-guarded
`GET/PATCH /api/quote-requests` powers triage today and a future admin
dashboard later.

```bash
npm run dev      # site — vite proxies /api to the local API
npm run dev:api  # same handlers over node:http (:8787)
npm run test:api # 10-case end-to-end suite
```

Required environment variables are documented in `.env.example` and
`docs/BACKEND.md` (deployment, security notes, request schema). No secrets
are committed and the frontend never imports backend code. Without an API
(e.g. the GitHub Pages deployment) the form detects it and offers a
prefilled mailto fallback — it never pretends a message was sent.

For Vercel hosting, `vercel.json` builds with `VITE_BASE=/` so the bundle
serves at the domain root (GitHub Pages keeps the `/app/` base).
