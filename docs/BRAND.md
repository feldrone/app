# FEL DRONE — Identity system

**v8 “ROTOR F”** — production integration of 2026-09-14. Client authorized the
drone+F identity of the reference board and required it re-engineered as a
superior vector system — not a trace, not a paste. The mark is ONE symbol: the
F letterform built as a machine. The stem is the spar; the top and mid arms run
to their hub centers and drive two rotors; **the rotors are the counters of
the letter**. It reads without the wordmark because it is the wordmark's first
letter. One geometry source — `scripts/brand-gen.mjs` — emits every brand
file and the React lockup data; nothing downstream is hand-drawn.

---

## Why v8 exists (problems closed)

| # | Problem in the reference / old builds | Resolution |
|---|----------------------------------------|------------|
| 1 | traced board mark: point-tangencies and 4u slivers at arm↔ring junctions | arms terminate **at the hub centers**; the apertures open exactly where a spar crosses (nonzero winding, computed) — zero accidental tangency, zero sliver |
| 2 | one drawing for all sizes → blob below 24 px | real tiers: **MICRO deletes the voids** (solid rotors), a different correct drawing, never a shrunken MASTER |
| 3 | equal stacked rotors tangent each other | unequal rotors (⌀ 64u / 48u) on the same radial law; clearance 12.4u ≥ 8u floor |
| 4 | “FELDRONE” one-word lockups | **FEL DRONE, two words**: a controlled 48u word-space (2× the 24u track) — the name is never fused, the type never renamed |
| 5 | generic wordmark type in the reference | the engineered v7.2 glyph table is kept: cap 104u, stem 24u, circular counters — bowls now true stadiums (24u walls everywhere) |
| 6 | old logo files still shipping | all v7.2-era asset names (`fel-drone-symbol*`, `fel-drone-horizontal*`, `fel-drone-icon-64*`, `fel-drone-stacked-mono-*`) are **deleted**; `public/brand/` holds only the 15 v8 files below |
| 7 | hand-edited SVGs drift | `npm run brand:check` (CI gate) fails on any byte of drift between generator and files |

## The mark — construction (canvas 128×128, grid g = 4u, module M = 32u)

| Part | Geometry |
|------|----------|
| Stem (spar) | `x 0..32, y 0..128` — M wide, full height |
| Top arm | `y 16..48, x 0..96` — M tall, ends at hub A center |
| Mid arm | `y 80..112, x 0..72` — M tall, ends at hub B center |
| Rotor A (primary) | disc ⌀ 64u at (96, 32); **grounded**: tangent to top and right canvas edges |
| Rotor B (secondary) | disc ⌀ 48u at (72, 96); floats 8u off the floor |
| Radial law | both rotors: **band 12u · aperture 8u** · A adds hub bore r 12u (ink again) |
| Accent (brand assets only) | gold jewel r 6u concentric with hub A — one dot, never on the web UI |

**The rotor law is the critical control.** Each rotor is three concentric
circles wound for nonzero fill: disc CW (+1), aperture CCW (−1), hub bore CW
(+1). Consequences, all verified numerically: the aperture becomes a “C” that
opens exactly where the spar passes through it; the hub reads as a bolt head
inside the M-tall arm band; no Boolean can produce a tangent or a sliver,
because none is geometrically reachable. Ink = 1 connected component at every
size 16–512px; four background enclosures by law (two aperture halves per
split rotor… A×2, B×1, corner pocket ×1 from the engagement tangent).

The F is readable in three ways at once — letterform, quadrotor silhouette,
corner-locked mark block — and in no way does it read as an airplane, a wing,
a cockpit or a badge. Flat vector, monochrome by construction: no gradients,
no 3D, no glow, no shields, no hexagons, no circuitry.

## Wordmark — “FEL DRONE”

Custom-drawn geometric caps: **cap 104u (26g), stem 24u (3/4·M)** — the v7.2
type weight, kept. All-CAPS: `F E L ␣ D R O N E` (widths 56·56·48 · 72·72·72·72·56).
The D/O/R bowls are **stadium constructions**: outer radius 36u with straight
midsection, counters offset exactly 24u inward (counter radius 12u) — walls
uniform 24u on all four sides of every bowl, the mark's own module family.
R carries a true half-disc bowl (to y 72) and a **detached diagonal leg** —
the 8u+ channel between bowl and leg is chosen, not accidental. Tracking 24u
everywhere with two controls: **R-O optical closure 16u** (flat leg facing O's
curve) and the **48u word-space** between FEL and DRONE. Total width 688u,
every advance on the grid. Kerning is arithmetic, not keyboard.

## Lockups

| Lockup | Canvas | Law |
|--------|--------|-----|
| HORIZONTAL | 880×160 | mark 128u at inset 16 (tangent top/right), word baseline = mark ink bottom +12u optical; clearance mark→word = 32u |
| STACKED | 720×296 | mark centered above word, 32u air both ways, margins 16u — mobile header/footer render this automatically |
| WEBSIZE UI | 30–34px header | `Logo.tsx` renders BRAND data inline (single path, `fillRule="nonzero"` — the site twin of the SVG files, byte-derived from the same table) |

## Responsive tiers

- **MASTER** ≥ 64px — full rotors, apertures, hub. Horizontal lockup.
- **COMPACT** 40–64px — the symbol alone; the M-weight bars keep it open.
- **MICRO** 16–32px — **a different drawing**: voids deleted, solid rotor
  discs, stem and arms 32u → 4 device px at 16px. All coordinates ×8u so the
  64-box favicon chip is an integer transform (`scale(0.375)`).
- The wordmark is never rendered below COMPACT. 16px = symbol only.

## Color

Ink `#0e1f30` · paper `#fbfaf8` · mono black/white for print, decals, plates.
Gold `#b4722c` is the site accent token; in brand assets it appears **once** —
the hub jewel on the two `*-accent` files. Monochrome first was the design
process, and every file above renders correctly with the color layer deleted.

## Files

`public/brand/`: `fel-drone-{mark, mark-mono, mark-accent, lockup,
lockup-inverse, lockup-accent, stacked, stacked-inverse, wordmark,
favicon, favicon-mono, favicon-inverse, favicon-32, favicon-32-mono,
geo}.svg` + `public/favicon.svg` (root `favicon.svg` synced at build).
Generated by `npm run brand:gen`; CI enforces `npm run brand:check`.

## Usage rules

1. Never redraw, never outline, never add effects. Scale the file.
2. Clearspace = 16u (= the canvas margin) on all sides; minimum sizes per tier.
3. Vehicle/plate/embroidery: `mark-mono` (black or white). Never the jewel.
4. The name is FEL DRONE (two words). Never “FELDRONE”, never a new name.
5. Amine Fellah's roster line is approved copy: his telecontrol certification
   sentence ships as written, never rewritten for layout.
