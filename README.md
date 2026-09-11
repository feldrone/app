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
```

## Content & imagery — how to change them

| What to change                  | Where                          |
| ------------------------------- | ------------------------------ |
| Legal identity, contacts, RC    | `src/data/content.ts`          |
| Leadership entries (1..N)       | `src/data/content.ts → team`   |
| Business poles                  | `src/data/content.ts → pillars`|
| Photography (source & crops)    | `src/lib/images.ts`            |
| Image licensing inventory       | `docs/IMAGES.md`               |

Factual rule for this site: **only company-supplied, registry-backed data is
published.** No testimonials, no client logos, no statistics, no awards
unless the company provides them.

## Notes

- Photography is hotlinked from the Pexels CDN with server-side crops
  (`auto=compress`, `fit=crop`, explicit `w`/`h`) — to move to self-hosted
  optimized files, change the URL builders in `src/lib/images.ts` only.
- The contact form has **no backend** by design: it validates, then opens
  the visitor's mail client with a prefilled `mailto:` draft. The UI states
  this explicitly.
- Print: the dossier section is the only section printed; letterhead and
  page-break rules live in `src/index.css` under `@media print`.
- SEO head (title, OG, canonical, JSON-LD Organization) lives in
  `index.html`; adjust the domain there and in `public/robots.txt` +
  `public/sitemap.xml` when the final hostname is decided.
