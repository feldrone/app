# FEL DRONE — Identity system

> Status: v3.0 — final identity pass (2026-09). The v2 “Rotor F” (letter +
> disc beside it) was retired because the disc read as a badge attached to the
> F rather than as structure. v3 rebuilds the mark from scratch: the letter F
> **is** the airframe — one skeleton, two simultaneous readings, no
> decoration. Developed over 12 explored concepts; every candidate was
> rejected until one survived black/white testing at 16 px.

## The mark — “Gantry F”

A twin-rotor UAV seen from above, constructed with lettering weights:

- the **stem** of the F is the fuselage spine (mast),
- the **top bar** is the forward spar, full length, ending on the axis of
  rotor 1 (the larger, forward disc),
- the **middle bar** is the sensor spar, shorter by F proportion, ending on
  the axis of rotor 2,
- the **foot** is the landing skid — it closes the letter like the serif foot
  of an engineered grotesque,
- both rotor discs are **drilled through** the spar: apertures are true
  cut-outs (mask), so the mark keeps its counters on any ground;
- a single gold hub dot marks each rotor — one accent, never on the letters.

**Engineering logic:** remove the discs and it is still a valid F; remove the
F logic and the airframe falls apart. No wings, no shield, no globe, no
aircraft outline, no drone clipped above or beside a letter.

### Geometry (design grid 4u, canvas 168 × 180)

| Element            | Geometry                                              |
| ------------------ | ----------------------------------------------------- |
| Spar/letter weight | **T = 24** (mast, both bars, skid height)              |
| Mast               | x 36→60, y 24→158 (top flush with the forward spar)   |
| Forward spar       | y 24→48, x 36→134 (ends at rotor 1 axis)              |
| Sensor spar        | y 84→108, x 60→114 (ends at rotor 2 axis)             |
| Rotor 1            | centre (134, 36), r 26; aperture r 6; hub r 5.5       |
| Rotor 2            | centre (114, 96), r 21; aperture r 4.75; hub r 4.5    |
| Skid               | x 24→96, y 146→170, rx 4                              |
| Ink box            | 136 × 160 (rotor 1 breaks the top line by design)    |

Rotor 1 sits at the optical apex; rotor 2 rides the mid-axis so the F cross
is the classic 40/60 split. Every dimension is a multiple of 4; T alone sets
the whole module.

## Wordmark — “FEL DRONE”

Unchanged from v2 (it survived critique): custom monoline geometry, 9-unit
stroke on a 64-unit cap height, butt caps, miter joins; constructed from the
same family of parts as the mark (bars and true circles). Tracking 14.5, word
gap 22. In lockups the wordmark starts 20u closer to the mark than in v2 to
match the narrower mark box.

## Lockups

1. **Primary horizontal** — symbol, gap, wordmark on a 659 × 128 canvas;
   the mark occupies the legacy 8→140 / 8→120 column, so page rhythm is
   unchanged from v2.
2. **Stacked** — centred symbol above wordmark, 517 × 218 (avatars, signage).
3. **Symbol alone** — favicon, app icon, drone body, uniform, print.
4. **Geographic secondary** (`-geo` files) — construction/grid view, for
   brand documentation and the wall plaque only; never part of primary use.

## Colour

Monochrome first; the identity must run in pure black or pure white anywhere.

| Token                             | Light surfaces | Dark surfaces |
| --------------------------------- | -------------- | ------------- |
| Ink                               | `#0e1f30`      | `#fbfaf8`     |
| Hub accent (only colour in mark)  | `#b4823c`      | `#c6934a`     |

No gradients, shadows, 3D, outlines, or tints of the mark. The gold hub is
the single brand accent and is always the hub dot — never the letters.

## Sizes & clear space

- Clear space on all sides: **one spar width (24u ≈ mark height ÷ 6.7)**,
  proportional — skid-to-whitespace rules apply as with any side bearing.
- Horizontal lockup: minimum rendered height **24 px** (print: 8 mm).
- Symbol alone: minimum **14 px**; apertures stay open at 16 px because they
  are cut-outs, not painted rings.
- On photo or coloured grounds use mono-white / mono-black; contrast ≥ 4.5:1.

## Real-world tests passed

![Application board](./brand-board.png)

Website header (34 px, and the symbol degrades cleanly at 24 px mobile),
16/32 px favicon on light and dark browser chrome, navy app-icon chip,
business-card white and navy, Instagram avatar (stacked), vehicle-door
single-colour decal (symbol), drone-body plate (symbol, white), building
signage band (horizontal, inverted). Black-ink 16 px print test on newsprint
simulated: skid joins but F and both apertures hold.

## File manifest

```
public/favicon.svg                          navy chip 64u, cut-out apertures
public/brand/fel-drone-symbol.svg           ink (+ gold hubs)
public/brand/fel-drone-symbol-inverted.svg  paper (+ gold hubs)
public/brand/fel-drone-symbol-mono-black.svg
public/brand/fel-drone-symbol-mono-white.svg
public/brand/fel-drone-horizontal*.svg      4 variants (ink/inverted/mono black/white)
public/brand/fel-drone-stacked*.svg         4 variants
public/brand/fel-drone-wordmark(-white).svg letters only (unchanged since v2)
public/brand/fel-drone-horizontal-geo.svg   construction/grid sheet
```

The root `favicon.svg` and `index.html` at repo root are **generated** build
artifacts for Pages (`npm run build && npm run pages:sync`) — never edit by
hand; edit `template.html` and `public/favicon.svg`.

## Updating

`src/components/Logo.tsx`, the favicon and every brand file come from one
geometry source (brand-lab `gen_final.js`: `GEO` + glyph table). To amend the
mark: change the unit geometry once, re-emit SVGs + component; components
never hard-code path data by hand.

## Prohibitions

- Do not redraw, re-proportion, rotate or mirror the mark.
- Do not add wings, globes, circuit traces, shields or aircraft.
- Do not colour the letters; do not place ink over low-contrast imagery
  without a plate.
- Do not use the geographic lockup as primary.
- Do not render the lockup below minimum sizes; drop to the symbol alone.
