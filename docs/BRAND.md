# FELDRONE — Identity system

**v7.2 “THE CLEARANCE”** — critical correction of 2026-09-13. The mark no
longer depicts anything: the F is **negative relief** — three solid blocks
whose clearance *is* the letter. One grid, one angle, equal ink and air.
One geometry source — `scripts/brand-gen.mjs` — emits every brand file and
the React lockup data; nothing downstream is hand-drawn.

---

## Why v7.2 exists (problems closed)

| # | Client problem | Resolution |
|---|----------------|------------|
| 1 | windsock/rotor read too literal | all reference deleted — the mark is a pure clearance fit; the aviation read is second-layer only |
| 2 | no real grid | unit **g = 4u**, module **M = 32u**; every emitted coordinate is a multiple of 8u; the mark is 4M×4M edge-to-edge |
| 3 | symbol crushed the wordmark | word stem 12u → **24u** (cap 104u = 13g); mark coverage capped at exactly **50 % ink**; lockup is baseline-anchored (word baseline = mark ink bottom) |
| 4 | two geometries (sharp symbol / softer word) | **45° is the only non-right angle in the system**: 16u shelf chamfers (mark), 24u/8u bowl chamfers (D, O, R); N’s structural diagonal is the single, documented exception |
| 5 | favicon fused | real **MASTER / COMPACT / MICRO** tier system (below) — micro deletes exactly one thing: the chamfers |
| 6 | word dies at small size | the wordmark is never rendered below COMPACT; 16–32 px = symbol only |
| 7 | direction = F + flight + precision + geometry | the F emerges from the void (brief option B), like a machined fit |
| 8 | no new clichés | no wings, birds, rockets, mountains, globes, shields, radars, circuits, frames — three rectangles, one law |
| 9/10 | recognition + industry positioning | tests below; the story is calibration hardware, not “drone videos” |

## The mark

Slab A (x 0..32, full height) is the wall; shelves B and C (x 64..128,
32u tall, stacked with a 32u gap) close the two arms. The **vertical
channel x 32..64 is the stem; the horizontal gaps that open to the right
edge are the arms** — every channel, every bar, every counter in the whole
identity measures a multiple of the same 32u module, and in the mark
**ink = air: exactly 50 %**. The shelves carry one gesture each: a 16u 45°
chamfer flaring the waist of the mid arm — the fit opens where the air
accelerates. A second look reveals the aviation register (airflow through a
constrained passage); the first look is simply a proprietary letterform.

Construction table (icon canvas 128 × 128, all integers, 8u grid):

| Part | Geometry |
|------|----------|
| Slab A | `M0 0H32V128H0Z` |
| Shelf B | `M64 32H128V64H80L64 48Z` (chamfer 16u, 45°) |
| Shelf C | `M64 112L80 96H128V128H64Z` (chamfer 16u, 45°) |
| Voids | stem channel 32u wide · arms 32u tall · all openings 32u |

## Wordmark — “FELDRONE”

Custom-drawn, one word, one weight: **cap 104u (13g), stem 24u (6g)** —
the step-up gives the type true presence against the solid mark. The
counters are exactly **24u deep = the wall thickness**: the type keeps the
mark’s “ink = air” law. Arms and bars: F/E mid arms at y 40..64
(optically raised, as typographic crossbars must be), shortened to 48u vs
the 56u full arms. D/O/R bowls take the system’s only cut — **45°, 24u
outer, 8u inner** — N keeps the one structural diagonal (76°, perpendicular
thickness 23.3u ≈ T). Kerning: 24u everywhere, one optical closure to
**16u at R-O**. The wordmark’s F is the negative-F of the mark turned to
ink: same two arms, same proportions. Width 664u, all advances on the grid.

## Responsive logo system (tiers)

| Tier | Build | Sizes |
|------|-------|-------|
| **MASTER** | lockups (horizontal / stacked), full geometry incl. chamfers | ≥ 64 px: web, documents, vehicles, presentations, large format |
| **COMPACT** | mark alone (master geometry) | 40–64 px: equipment, small marking, social avatars |
| **MICRO** | mark with **chamfers deleted** — three squared blocks, nothing else changes | 16–32 px: favicon, app icon, engraving, battery labels |
| wordmark | never rendered below COMPACT (16–32 px = symbol only) | — |

At 16 px every feature is ≥ 3 px and the F-channel stays open (verified on
rasters: per-row block runs 1→2 with a 11 px open navy run through the
channel). The wordmark is simply not shown — per brief.

## Lockups

| Lockup | Canvas | Rhythm |
|--------|--------|--------|
| Horizontal (primary) | 856 × 160 | pad 16u · mark ink 16..144 · **clearance 32u** (≥ 24u floor) · word x 176..840 · baseline-anchored: word baseline 144 = mark ink bottom, mark rises 24u above the cap line |
| Stacked (mobile / avatar) | 696 × 296 | pad 16u · mark 16..144 · gap 32u · word 176..280 |

## Colour

Monochrome first; colour is a garment.

| Token | Hex | Use |
|-------|-----|-----|
| Ink | `#0e1f30` | on light grounds |
| Paper | `#fbfaf8` | on navy |
| Mono black | `#000000` | print, decals |
| Mono white | `#ffffff` | vehicle, helmet, body |

Site tokens (navy/gold) stay untouched — gold never enters the logo. The
mark is structurally ground-independent: 50 % coverage stays 50 % inverted
(verified: mono-black and mono-white render at identical pixel mass @24).

## Clear space & minimum sizes

- clear space around lockups ≥ 32u (= one module, = the mark’s own bar);
- MASTER ≥ 64 px high; mark alone ≥ 24 px; MICRO owns 16–32 px;
- header renders: stacked < `sm`, horizontal ≥ `sm` at 30/34 px — both
  within their tier; never shrink a lockup below its tier, switch tier.

## Verified (raster + numeric)

- grid audit: every coordinate of mark, wordmark and both lockups is a
  multiple of 8u (0 exceptions); all diagonals are exact 45° except N;
- mark coverage exactly 8 192 / 16 384 px²;
- lockup channel x147..173: zero ink column at 34 px header render;
- stacked 32u rhythm band: zero ink at 44 px;
- favicon@16: rows carry 1–2 discrete blocks with the channel open (max
  empty run 11 px);
- mono @24 black ≡ white ≡ micro (±6 px of ink);
- brand emission is byte-deterministic (integer-only formatting);
- pages build determinism proven (two consecutive identical builds).

## File manifest (emitted by `npm run brand:gen`)

- `public/favicon.svg` — MICRO on the ink chip (rx 12u = one micro module)
- `public/brand/fel-drone-icon-64(-mono-black).svg` — MICRO deliverables
- `public/brand/fel-drone-symbol{,-inverted,-mono-black,-mono-white}.svg` — COMPACT/master mark
- `public/brand/fel-drone-symbol-micro{,-inverted}.svg` — the MICRO mark at 128
- `public/brand/fel-drone-{horizontal,stacked}*.svg` — lockups × 4 grounds
- `public/brand/fel-drone-horizontal-geo.svg` — construction sheet
- `public/brand/fel-drone-wordmark(-white).svg` — WORDMARK
- `src/brand/brandmark.ts` — data for `src/components/Logo.tsx`
- `docs/brand-board.png` — board (`node scripts/brand-board.mjs`)

## Updating

Edit `scripts/brand-gen.mjs` only → `npm run brand:gen`; CI guards with
`npm run brand:check` and a single-file build of `index.html` from the same
data. New geometry must keep: integer 8u multiples, 45°-only diagonals,
ink ≥ void everywhere. Never hand-edit the emitted files.

## Prohibitions (standing, client specs v6.0 → v7.2)

- no literal drone parts ever: rotors, blades, masts, airframes, top views;
- no generic aerospace props: wings, birds, planes, rockets, mountains,
  globes, shields, radars, circuits; no F inside a circle or square;
- no dots, gradients, shadows, outlines or colour inside the logo;
- no feature below one module pair (ink and air both stay ≥ 32u at master,
  ≥ 12u at the 64 favicon); 45° stays the only non-right angle;
- mark→word clearance never below 24u; stacked mandatory below `sm`;
- wordmark never below 40 px; never typeset FELDRONE in a stock font.

## Changelog

- **v7.2 (2026-09-13)** — CRITICAL correction per client brief: rotor read
  retired; “THE CLEARANCE” negative-relief F adopted (brief concept B +
  engineering calibration narrative); strict 4u/32u grid with integer-only
  emission; wordmark weight doubled (cap 104 / stem 24, counters = 24);
  baseline-anchored lockup; true MASTER/COMPACT/MICRO tier system with a
  purpose-built micro cut (chamfers deleted only); new micro deliverables;
  21 emitted files. Site UI, colours, copy, layout untouched.
- v7.0 (2026-09-13) — “THE VANE” windsock-F (superseded: direct rotor/
  instrument read rejected by client).
- v6.1 — ≥24u clearance rule + stacked mobile enforcement. v6.0 — FD
  counter monogram (full redesign of 2026-09-13 morning).
- v5.2 one-word FELDRONE · v5.1 favicon optical size · v5 3° lean ·
  v4 byte-stable emission.
