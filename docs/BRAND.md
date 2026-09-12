# FELDRONE — Identity system

> Status: **v6.0 — full redesign executed per the client brand specification
> of 2026-09-13** (`COMPLETE_LOGO_REDESIGN`, benchmark: industrial UAV).
> The mark is a **unified F/D counter monogram** on a strict **136 × 160**
> grid, module 4u, **one stroke weight (T = 24)** across symbol and wordmark.
> Zero literal drone parts, zero dots: the rotors, spars, skid, drilled
> apertures, gold hub accents and the 3° lean of the v3–v5 gantry mark are
> retired by instruction. The wordmark stays **one word, FELDRONE** (the
> v5.2 kerning table), now at a single unified 10u weight — the light 6.5u
> DRONE half violated the new "no hairline parts below 24 px" rule.
> Provenance holds: everything is emitted from `scripts/brand-gen.mjs` and
> `npm run brand:check` keeps the files honest.
>
> History: v2 "Rotor F" retired; v3 rebuilt the mark (the letter F **was**
> the airframe); v4 moved the brand lab in-repo; v5 added the 3° lean;
> v5.1 the favicon optical size; v5.2 the one-word lockup; v6.0 is the
> specified redesign. The superseded v5.2 system remains the immediate
> ancestors of every file in git history (`bae79cb`).

## The mark — “FD counter monogram”

One silhouette, two letters, merged through **negative space**:

- the outer form is a **flat-shouldered D**: a vertical stem face, straight
  top and bottom edges, and a true semicircular bowl (r 80, centred (56, 80))
  closing the right side;
- the **F is the shared ink**: the D's stem is also the F's stem, the D's
  top edge is also the F's top arm, and a **floating mid arm** (y 60→84)
  completes the letter — the classic 40/60 window split inherited from the
  gantry crossbar, sitting 8u above the geometric centre;
- the arm's tip is a **16u chisel point** aimed at the bowl and stopping
  **7.4u short of the inner wall**. That channel is the merge: the counter
  remains **one connected region** (no B or P can form at any size), any
  ground flows through the mark, and the arm reads as a vector of airflow —
  the motion cue of the retired lean, re-cast as geometry;
- the counter (the window) is the D construction inset by exactly T: inner
  bowl r 56, square shoulders at (24, 24) and (24, 136).

**Engineering logic:** every radius is a multiple of 8u; every coordinate is
on the 4u module; the ring is a single `fill-rule="evenodd"` path (a true
through-hole — the mark is monochrome-correct on **any** ground by
construction, no masks anywhere in the system). Remove the arm and it is a
perfectly valid D; remove the bowl and it is a perfectly valid F. No dots,
no propellers, no wings, no shield, no circuit ornaments, no clichés.

### Geometry — the specification table (v6.0)

Symbol grid **136 × 160**, unit module 4u, single weight T = 24:

| Element        | Geometry                                                         |
| -------------- | ---------------------------------------------------------------- |
| Ink box        | 136 × 160 exactly (0,0 → 136,160); canvas = ink box             |
| Stem           | x 0→24, y 0→160 (full-height rect = F stem = D stem)            |
| Top edge/arm   | y 0→24, x 0→56 (the D's flat shoulder **is** the F's top arm)   |
| Bottom edge    | y 136→160, x 0→56                                               |
| Bowl (outer)   | semicircle r **80**, centre (56, 80), from (56, 0) to (56, 160) |
| Counter (inner)| flat shoulders (24, 24)/(24, 136), semicircle r **56**, same centre; counter T = 24 throughout |
| Mid arm        | y 60→84 (T = 24), x 24→104; chisel: tip (104, 72), faces at (88, 60)/(88, 84) |
| Channel        | arm tip → inner wall at y 72: 111.4 − 104 = **7.4u**            |
| Windows        | upper 36u / lower 52u (40/60 split)                             |

Path data (the canonical strings emitted everywhere):

```
ring  M0 0H56A80 80 0 0 1 56 160H0Z M24 24H56A56 56 0 0 1 56 136H24Z   (evenodd)
arm   M24 60H88L104 72L88 84H24Z
arm-favicon (chip build, widened channel 15.4u)  M24 60H84L96 72L84 84H24Z
```

## Wordmark — “FELDRONE”

One word, one weight: the v5.2 ink-locked construction (cap centre-lines
0/29.5/64, arm ink edges 38.5 / 31.5 / 32.5, D bowl ink 55, R leg 47.5,
O ring 66, N 42) re-centred for a unified **10u** stroke — the same 64-unit
cap grid, the same family of parts as the mark (bars and true circles, butt
caps, miter joins). Kerning preserved from v5.2: 14.5u inside FEL, 14u at
the seams, 10u around the round O. No word space, no weight contrast, no
hairlines: at the 24 px lockup floor the lightest ink in the system is
10u × 1.03125 × (24/128) ≈ **1.9 px**.

## Lockups

1. **Primary horizontal** — symbol, gap, wordmark on a **628 × 128** canvas;
   the mark occupies x 23.6→118.8, y 8→120 (overhang above and below the
   word ink: 17.8u each — perfect optical centring), the wordmark begins at
   134 (mark→“F” gap 15.2u ≈ the 14.4u letter rhythm) and its ink ends at
   ≈603.8, mirroring the margins (23.6 / 24.2u).
2. **Stacked** — centred symbol above wordmark, **517 × 236**; mark and word
   share the axis at x 258.5 (word x₀ = 23.63), vertical rhythm
   8 / 120 → 150.8 (gap 30.8) → 227.2 / 236 (margin 8.8).
3. **Symbol alone** — app icon, drone body, uniform, print; never below
   24 px (the channel fuses at 14–16 px — that is what the favicon build is for).
4. **Geographic secondary** (`-geo` file) — construction/grid view for brand
   documentation only.

## Colour

Monochrome first — and now monochrome **only**: the mark carries no colour.

| Token            | Light surfaces | Dark surfaces |
| ---------------- | -------------- | ------------- |
| Ink              | `#0e1f30`      | `#fbfaf8`     |
| Mono reproduction | `#000000`     | `#ffffff`     |

The gold hubs are retired with the v5 mark (the spec forbids dots).
`#b4823c` / `#c6934a` remain **site UI accents** only (buttons, rules,
eyebrows) — never inside the logo. No gradients, shadows, 3D, outlines,
tints, or strokes over the silhouette.

## Sizes & clear space

- Clear space on all sides: **one stroke width (24u)** around any ink.
- Horizontal lockup: minimum rendered height **24 px** (print: 8 mm).
- Symbol alone: minimum **24 px**; the 7.4u channel holds AA from 24 px up
  (verified 14/16/24/32/48 — it fuses below 24, hence the floor).
- **Favicon = optical size, not a mathematical downscale (v5.1 rule kept).**
  In the 64u chip the mark fills 45u, centred (12.875, 9.5), scale 0.28125,
  rx 14, paper ink on navy; the arm tip pulls back 104 → 96 so the channel
  widens 7.4u → 15.4u and the counter stays visibly open at 16 px
  (≈1.9 px of ground through the mark). It is the same silhouette,
  same grid, one dimension simplified — no other variant carries this.
- On photo or coloured grounds use mono-white / mono-black; contrast ≥ 4.5:1.

## Real-world tests passed

- 16 → 512 px ladder, all four grounds (paper / navy / pure black / white):
  one connected mark, legible word at ≥ 24 px.
- Numeric probes on the 512 px render: stem band 68 px (= 24 × 0.7 × 4 ✓),
  arm ink to tip exactly 104u (canvas 96.4 → px 386 ✓), channel 20 px
  open ✓, mark spans px 32→480 (= canvas 8→120 ✓).
- One-colour invoice / watermark / laser-etch: the ring's even-odd hole and
  the 7.4u channel are true negative space — nothing to “fade”.
- Sticker/embroidery: minimum feature = T = 24u = 10.7 % of mark height;
  at a 75 mm sticker that is 8 mm of ink — safe; the chisel tip is the only
  fine feature (16u face height → ≥ 1.5 mm at 25 mm patches, acceptable).
- Monochrome black/white files are single-path-fill — no masks in any
  emitted file (v5's mask machinery is gone).

## File manifest

```
scripts/brand-gen.mjs                           the brand lab: single geometry source
src/brand/brandmark.ts                            GENERATED data table (consumed by Logo.tsx)
public/favicon.svg                                navy chip 64u — optical small-size build
public/brand/fel-drone-symbol.svg               ink (pure monochrome)
public/brand/fel-drone-symbol-inverted.svg      paper on navy ground
public/brand/fel-drone-symbol-mono-black.svg
public/brand/fel-drone-symbol-mono-white.svg
public/brand/fel-drone-horizontal*.svg          4 variants (ink/inverted/mono black/white)
public/brand/fel-drone-stacked*.svg             4 variants
public/brand/fel-drone-wordmark(-white).svg     letters only — FELDRONE, one weight
public/brand/fel-drone-horizontal-geo.svg       construction/grid sheet
```

The root `favicon.svg` and `index.html` at repo root are **generated** build
artifacts for Pages (`npm run build && npm run pages:sync`) — never edit by
hand; edit `template.html` and `public/favicon.svg` (itself emitted by the
brand lab).

## Updating

`src/components/Logo.tsx`, the favicon and every brand file come from one
geometry source: the table at the top of `scripts/brand-gen.mjs`. To amend
the mark: change the unit geometry once, run `npm run brand:gen`, and every
SVG, the data table and the React lockup update together.
`npm run brand:check` fails CI if anything drifted. The board
(`docs/brand-board.png`) regenerates with `node scripts/brand-board.mjs`.

## Prohibitions (from the client spec, standing)

No drone-propeller forms · no circuit dots or board traces · no hairline
parts that fade below 24 px · no cliché tech symbols (waves, globes,
shields, wings, jets) · no separated multi-word spacing · no gradients,
3D, bevels, shadows, glows, metallic effects · no decorative flourishes ·
no extra letters, symbols or taglines · the brand word is **FELDRONE**,
never split. Mandatory: pure vector path consistency · monochrome-first
compliance (flawless B/W) · sharp geometric angles · industrial
engineering authority.

## Changelog

- **v6.0 (2026-09-13) — full redesign per client specification.** F/D merged
  counter monogram on the strict 136 × 160 grid (module 4u, T = 24, single
  even-odd path + chiselled arm), replacing the gantry-F airframe; all dots
  and colour accents removed from the logo; the wordmark keeps the v5.2
  one-word FELDRONE kerning at a unified 10u weight (no hairlines below the
  24 px floor); horizontal canvas 632 → 628 (mirrored margins), stacked
  517 × 218 → 517 × 236 (new optical-centre rhythm); favicon keeps the v5.1
  optical rule (45u in the 64u chip) with the channel widened 7.4u → 15.4u.
  Mask machinery deleted system-wide: every file is flat fill/stroke vector.
  The superseded v5.2 geometry lives in git history at `bae79cb`.
- **v5.2 (2026-09) — one-word lockup + mark optical weight.** “FEL DRONE”
  became FELDRONE (FEL 12u bold / DRONE 6.5u light, kerned L→D at 14u) and
  the gantry mark's spars went 24u → 26u. Superseded by v6.0.
- **v5.1 (2026-09) — favicon optical size.** Dedicated small-size chip
  build (bigger mass, widened aperture, micro-detail removed); A/B render QA
  at 16–64 px light and dark.
- **v5.0 (2026-09) — refinement pass.** 3° forward lean on the mark group;
  horizontal spacing corrected to the 15u rhythm; stacked re-centred.
- **v4.0 (2026-09) — provenance pass.** Brand lab moved in-repo; all brand
  SVGs, the favicon and the component data table emitted from one source.
- **v3.0 / v2.0.** The gantry-F airframe rebuild and the original rotor F.
