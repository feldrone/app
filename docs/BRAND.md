# FELDRONE — Identity system

**v7.0 “THE VANE”** — full redesign per the client brief of 2026-09-13
(« imagine FELDRONE as a brand founded today; do not improve the old logo »).
One geometry source — `scripts/brand-gen.mjs` — emits every brand file and
the React lockup data. Nothing here is hand-drawn downstream.

---

## Research note (brief §1)

Principles observed across DJI, Skydio, Autel, Parrot, Zipline, Wing,
AeroVironment, Quantum Systems, Wingtra, Freefly — studied for *quality
level*, never copied:

- the category leaders are **wordmark-first**; a symbol only earns its
  place when it is one idea, instantly readable;
- the strongest symbols in the field are **letters made dynamic**
  (Zipline’s Z of two arrows) — the letter IS the gesture;
- one weight, flat terminals, generous counters; colour is applied later
  and never carries the form;
- every mark must self-clean at 16 px: no hairline details, no enclosed
  gaps below ~2 px at render size;
- aviation credibility comes from **instrument discipline** (alignment,
  chamfers, consistent cut angles), not from aircraft silhouettes.

## The five concepts (brief §12)

| # | Concept | Idea | Verdict |
|---|---------|------|---------|
| 01 | Minimal Aerospace “APX” | F from three ascending bars | bars read as a menu glyph; stacked-bar marks are crowded territory — rejected |
| 02 | F Monogram, continuous line | one unbroken stroke drawing the F | repeats the retired v6 device; the return path needs 2u channels that die at 16 px — rejected |
| 03 | Flight / Trajectory | ascending rhombic track as crossbar | pretty, forgettable; reads as generic “growth chart” — rejected |
| 04 | Engineering / Precision | F built from dimension lines and ticks | ticks < 2u at favicon size — fails brief §10 — rejected |
| 05 | **Abstract Signature “THE VANE”** | **the F is a windsock**: mast stem, tapered cone top arm, airflow bar | winner — one idea, instrument-grade meaning, letter-first silhouette |

Winner scoring (brief §12 rubric): originality 13/15 · memorisation 14/15 ·
professionalism 9/10 · aviation 10/10 · technology 8/10 · B2B 10/10 ·
international 9/10 · scalability 9/10 · timelessness 9/10.

## The mark — “THE VANE”

A proprietary **F** seen at the moment wind commits: the top arm is a
**windsock cone** — flat top edge, one underside rising 20u over 80u (~14°),
a square-cut open end; the mid arm is a shorter, lighter **airflow bar**; the
stem is the **mast**. A windsock is the one instrument every pilot reads
before go/no-go — it makes FELDRONE’s mark say *conditions mastered, flight
cleared*: maintenance, diagnostic, calibration, safety. It is not a drone
clip-art, not wings, not a shield, not a globe, and it is not an F inside a
frame. The letter reads first; the instrument rewards the second look; the
tapered arm is the one-second memorable feature.

The wordmark’s own F carries the same wedge at type scale — the symbol is
the letter, the letter is the symbol.

### Geometry — the specification table (v7.0)

All coordinates integer, on a 136 × 160 icon canvas (ink 104 × 120,
margins 16/16/20/20). One clockwise ring, zero holes, zero transforms
inside the icon.

| Part | Coordinates (local units) |
|------|---------------------------|
| Mast stem | x 16..40 · y 20..140 (24u wide) |
| Cone top arm | (16,20)→(120,20)→(120,32)→(40,52): base 32u → tip 12u |
| Airflow bar | x 40..96 · y 80..96 (16u tall, 56u long) |
| Cone↔bar sky gap | 28u at the stem face |
| Ring | `M16 20L120 20L120 32L40 52L40 80L96 80L96 96L40 96L40 140L16 140Z` |

Rules: minimum standalone feature ≥ 12u on the 160 canvas (silhouette cuts
— the cone tip — may sit at 12u because they never isolate); all terminals
square-cut; the only diagonals in the mark are the cone undersides.

## Wordmark — “FELDRONE”

Custom monoline-grotesque, one word, one weight. Cap 72u, stem 12u
(ratio 0.167 — technical, not neon). D and O bowls are **45° chamfered at
12u outer / 6u inner** (altimeter-glass counters, walls never below 12.7u);
R’s leg is a 14u diagonal launched from the bowl underside; E’s mid arm is
shortened to 38u; the F is the mark set to type (tip 12u = the system’s own
stroke weight). Kerning hand-set: 18u default, **16u at R-O and O-N**
(round-to-round optical closure). Total ink 484u. Glyph outlines are filled
single rings with even-odd counters — no stroke rendering exists anywhere
in the system anymore.

## Lockups

| Lockup | Canvas | Rhythm |
|--------|--------|--------|
| Horizontal (primary) | 648 × 160 | mark ink 16..120 · **28u clear space** (≥ 24u floor — the v6.1 “DFELDRONE” misread can never recur) · word x 148..632, cap centred y 44..116 |
| Stacked (mobile / avatar) | 516 × 248 | mark centred y 16..136 · 24u · word centred y 160..232 |

No scaling, no transforms other than the stacked centre shift — the same
integer geometry serves the 16 px favicon and the 6 m hangar door.

## Colour

Monochrome-first by construction; colour is a garment, never structure.

| Token | Hex | Use |
|-------|-----|-----|
| Ink | `#0e1f30` | mark on light grounds (site `navy-900`) |
| Paper | `#fbfaf8` | reverse on navy |
| Mono black | `#000000` | print, decals, one-colour |
| Mono white | `#ffffff` | vehicle, helmet, body, dark signage |

Explored and rejected for the mark: electric blue (violates the site’s
navy+gold restraint and reads “consumer gadget”), orange (rescues nothing
that geometry doesn’t), gold (site UI accent only — `#b4823c` stays in the
interface, never inside the logo).

## Sizes & clear space

- Standalone symbol: **never below 24 px**; app icon / favicon use the
  native 64u simplified cut (stem 10, cone 13→5, bar 8, gaps ≥ 10 —
  every feature ≥ 1.2 px at 16 px; the taper is kept because it IS the
  silhouette).
- Favicon chip: 64 box, `rx 14`, ink ground + paper mark (browser favours
  square chips; radius mirrors the instrument bezel).
- Clear space all round: ≥ the airflow bar (16u at icon scale); lockup
  mark→word keeps its 28u minimum.
- Header builds (Logo.tsx): stacked < `sm`, horizontal ≥ `sm` (30/34 px).

## Real-world tests passed (brief §§9–11, verified on rasters)

- zero-ink scan proves a full 6 px clean channel mark→word at the 34 px
  header render (no optical fusion, ever);
- favicon@16 row-by-row scan: taper survives (ink right-edge steps
  12→10→6→4 px across the cone) and 12/16 rows carry the silhouette;
- mono-black vs mono-white @24: identical ink mass (184 px) — the mark
  holds on any ground with no extra rules;
- stacked: rows across the 24u rhythm band contain zero ink;
- memorisation: one unusual feature (tapered top arm) — recallable in a
  sketch after one second;
- print/engrave/cut-vinyl safe: solid single ring, no hairlines, no
  counters inside the mark; the word’s counters are the smallest features
  and they stay open.

## File manifest (emitted by `npm run brand:gen`)

- `public/favicon.svg` — app icon / favicon (chip + simplified cut)
- `public/brand/fel-drone-icon-64.svg` / `-mono-black.svg` — SMALL ICON
- `public/brand/fel-drone-symbol*.svg` — SYMBOL × {ink, inverted, mono black, mono white}
- `public/brand/fel-drone-horizontal*.svg` — PRIMARY lockup × 4 grounds
- `public/brand/fel-drone-stacked*.svg` — stacked × 4 grounds
- `public/brand/fel-drone-horizontal-geo.svg` — construction sheet
- `public/brand/fel-drone-wordmark(-white).svg` — WORDMARK
- `src/brand/brandmark.ts` — data consumed by `src/components/Logo.tsx`
- `docs/brand-board.png` — board, rendered by `node scripts/brand-board.mjs`

## Updating

Edit `scripts/brand-gen.mjs` only, then `npm run brand:gen`; CI guards with
`npm run brand:check` (sync) + build of `index.html` from the same data.
Keep every emitted number integer; never hand-edit `public/brand/*`,
`public/favicon.svg` or `src/brand/brandmark.ts`.

## Prohibitions (from client specs, standing)

- no drone-clip-art (top view, rotors, propellers, airframe, wings, globe,
  shield, circuit, rocket); no F inside a circle or square;
- no dots, decorative gradients, shadows or outlines inside the logo;
- no colour inside the logo (mono + ink/paper only);
- no hairline below 12u on the 160 icon grid; no sub-2px feature at 16 px;
- mark→word clear space never below 24u; stacked build mandatory below `sm`;
- the wordmark stays one word, one weight, custom glyphs — never typeset
  text in a stock font.

## Changelog

- **v7.0 (2026-09-13)** — full identity redesign per the client “from
  scratch” brief: “THE VANE” windsock-F replaces the FD counter monogram;
  wordmark rebuilt as custom filled glyphs (cap 72/stem 12, 45° chamfers,
  hand-kerned); zero strokes, zero scaling anywhere in the system; new
  SMALL ICON deliverables (`fel-drone-icon-64*`); header renders 28u
  mark→word clear space at 1:1. Site UI, colours, copy and layout untouched.
- v6.1 (2026-09-13) — ≥24u lockup gap rule + stacked mobile enforcement;
  footer/hero UX pass.
- v6.0 (2026-09-13) — FD counter monogram redesign (superseded by v7.0).
- v5.2 → one-word FELDRONE, two weights. · v5.1 favicon optical size.
- v5 — 3° lean + optical gap. · v4 — byte-stable emission.
