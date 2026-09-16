# FEL DRONE — Identity system

**v12 "QUAD FD"** — one engineered emblem: a **front-view quadcopter** (two
tapered rotor blades with pointed tips and a motor shaft, two round motor hubs
joined by a bar, a central body block) seated on a heavy geometric **F+D
monogram**. The drone is not a badge floating above the letters — the rotor hubs
are the monogram's own mount points (the left hub is concentric with the F stem
axis, the right hub with the D stem axis) and they overlap the letterforms, so
the emblem reads as a single connected ink mass. Under it, the **FEL DRONE**
wordmark — unchanged since v11.

One geometry source — `scripts/brand-gen.mjs` — emits every brand file and the
React lockup data; nothing downstream is hand-drawn. `npm run brand:check`
gates CI and the Vercel build command: if a committed asset drifts from the
generator, the build fails.

> History: **v8 "ROTOR F"** remains as recovery point `f5b29cc`, **v10 "FLIGHT
> ARC"** is the original production identity (commit `5283f627`) and **v11
> "QUAD FD"** is the identity v12 replaced — the v12 symbol is the approved
> reference re-cut, not a new direction. `docs/brand-board-v8.png` is the v8
> board and is kept as a record. None of them is modified by v12 work; the
> **wordmark and its metrics are frozen** (see below).

---

## The mark — construction v12 (canvas 160×160, 4u grid, 2u half-step)

| Part | Geometry |
|------|----------|
| Left motor shaft | `rect(28, 12, 8, 48)` — x 28..36, y 12..60, over the left hub |
| Right motor shaft | `rect(124, 12, 8, 48)` — mirrored |
| Left rotor blade | `M0 22L40 18H64V26H40Z` — 64u tapered bar, true centred point at (0, 22) |
| Right rotor blade | mirrored — pointed tip at (160, 22) |
| Left motor hub | disc ⌀20, centre (32, 50) — **concentric with the F stem axis** |
| Right motor hub | disc ⌀20, centre (128, 50) — on the D stem axis |
| Airframe bar | `rect(32, 46, 96, 8)` — y 46..54, hub axis → hub axis |
| Central body | `rect(64, 16, 32, 24)` — x 64..96, y 16..40, centred on x = 80 |
| F | sheared stem `M20 52H40V148L20 120Z`; top arm `rect(20, 52, 56, 20)` (ends x 76); mid arm `rect(20, 92, 40, 20)` (ends x 60) |
| D | stem `rect(116, 52, 20, 96)`; bowl `M116 52H128A32 48 0 0 1 128 148H116Z` — half-ellipse rx32 ry48 reaching x 160 |
| D counter | oval 24×56 centred (138, 100), cut counter-clockwise so nonzero fill opens it |

**Airframe law.** Shaft ▸ blade over hub ▸ bar ▸ body, on the 4u grid: a pair of
⌀20 hubs joined by an 8u bar, carrying a 32×24 body between the letters. The hub
diameter **is** the letter stroke weight (⌀20 = the F stem width = the D stem
width), and the hubs overlap the letterforms by 8u (the letters start at y 52,
the hubs reach y 60) — that overlap is what makes the emblem one object instead
of two stacked ones. The rotor blades are the only ink that reaches the canvas
edges, so the mark is optically symmetrical about x = 80 (blades 0..64 and
96..160 balance exactly).

**Negative space.** The F and the D never touch: a 40u channel runs down the
centre of the monogram — the F top arm ends at x 76 and the D stem starts at
x 116. The body block above is what unifies them. The D counter is a 24×56 oval
— a large, clean negative form, half the bowl height.

**Ink behaviour.** The letters are joined to the airframe through the hubs (one
connected mass); the blades and shafts sit on the same axes. The emblem is
square (160×160) so it can be used alone as an avatar plate or an app mark.

## Tiers

| Tier | Size | Drawing |
|------|------|---------|
| MASTER | ≥ 40 px | Full emblem + wordmark (header, footer, documents) |
| COMPACT | 24–40 px | Emblem alone |
| MICRO | 16–32 px | **Different drawing**: the rotor blades and motor shafts are deleted (sub-pixel at that size) — hubs, bar, body and monogram remain, all ≥ 8u |

`public/favicon.svg` and `public/brand/fel-drone-favicon*.svg` are the MICRO
drawing on a 64u chip (radius 12, inset 8) — ink on navy for the default, and
mono/inverse builds for print and vehicles.

## Wordmark — "FEL DRONE"

Two builds of the same wordmark, one identity:

1. **Site (used in production UI)** — typeset in the project typeface,
   **IBM Plex Sans 700** (`src/brand/brandmark.ts → type`), at the measured
   advance for a **104u cap height** (size 148.57, Plex cap ratio 0.700):

   | Token | Value |
   |-------|-------|
   | cap height | 104u |
   | size | 148.57u |
   | "FEL" advance | 256u |
   | "DRONE" advance | 506u |
   | word space | 48u (the brand's own — the name is never fused) |
   | total | 810u, on grid |

   Each word is set as its own `<text>` with `textLength` fixed to those
   advances, so the two words can never collide and the internal spacing is
   exactly the type producer's cut. No CSS transform, no scaling, no distortions.

2. **Assets (exported SVGs)** — the same letterforms constructed as vector
   paths (uppercase, cap 104u, stroke 28u, square terminals, corner radii 28u
   outer / 12u counter on D · O · R, tracking 24u, 48u word space). These are
   self-contained: usable in print, embroidery and any tool without webfonts.

**Why IBM Plex Sans 700** — the reference wordmark is geometric, technical,
wide, with thick strokes, square-cut terminals and compact counters. IBM Plex
Sans is a technical grotesque built with those proportions (a single
superfamily that also exists in Arabic: `IBM Plex Sans Arabic`, used for the
العربية interface). It is loaded through Google Fonts today and documented in
`docs/I18N.md`.

## Lockups

| Lockup | Canvas | Law |
|--------|--------|-----|
| HORIZONTAL | 1034×160 | mark 160u at inset 16, 32u clearance to the wordmark, word baseline on mark optical centre + cap/2 |
| STACKED (mobile) | 842×328 | mark centred, 32u air, wordmark centred below |

`src/components/Logo.tsx` renders both from `BRAND` data — the mark path and the
typeset wordmark — so the header and footer are always the same drawing. The
lockup `<svg>` carries `direction: ltr` on purpose: the brand mark is Latin and
must not reorder inside the Arabic RTL layout.

## Colour

Ink **`#0e1f30`** (the site's deepest aviation navy — the logo colour on light
backgrounds), paper `#fbfaf8`, inverse `#fbfaf8` on navy grounds, mono black /
white for print and vehicle use, accent `#b4722c` reserved for the geometry
overlay only. No new brand colour was introduced in v11.

## Typography

- **UI / display:** IBM Plex Sans (400–700) + IBM Plex Sans Arabic — one
  superfamily, see `docs/I18N.md`.
- **Wordmark:** the same family at weight 700 — the brand's own voice. The body
  typography is not changed by the wordmark decision.

## Files

`public/brand/`: `fel-drone-{mark, mark-mono, mark-accent, lockup,
lockup-inverse, lockup-accent, stacked, stacked-inverse, wordmark, favicon,
favicon-mono, favicon-inverse, favicon-32, favicon-32-mono, mark-micro,
geo}.svg` + `public/favicon.svg` — all generated, all with a do-not-edit banner.

Regenerate after any geometry change:

```bash
npm run brand:gen    # writes every asset + src/brand/brandmark.ts
npm run brand:check  # fails if the committed files are out of sync
```

## Usage rules v11

1. Never redraw, never outline, never add effects, shadows or gradients. Scale the file.
2. Clear space = 16u on all sides. Do not crop the rotor blades.
3. Do not mirror the lockup, in any language, ever.
4. Below 40 px use the COMPACT/MICRO drawing instead of shrinking the blades.
5. Wordmark is "FEL DRONE" — two words. Never "FELDRONE".
6. Do not substitute another typeface for the wordmark and do not fake it with
   transforms: change `BRAND.type` in the generator instead.
7. Mono builds for vehicles, plates and embroidery; inverse for navy grounds.
8. The site renders the logo in `#0e1f30` on light grounds and `#fbfaf8` on
   navy — never a decorative colour.
