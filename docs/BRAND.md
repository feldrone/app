# FEL DRONE — Identity system

> Status: v2.0 — brand identity redesign (2026-09). The earlier mark (shield +
> rotor mast supplied as legacy artwork) was replaced by an original, engineered
> identity system through a full concept, critique and refinement process.

## The mark — "Rotor F"

One construct, not an assemblage. The vertical mast and horizontal arms are the
letter **F**; the middle arm feeds directly into a **rotor disc** — the top
view of a spinning propeller — whose hub void the arm stops three units short
of touching. The top arm ends plumb with the disc's rim, closing the silhouette
along a single vertical line.

| Element          | Geometry (grid units)                                     |
| ---------------- | --------------------------------------------------------- |
| Unit weight      | **13** — mast width, both arms, ring wall, hub Ø, favicon |
| Half-unit        | 6.5 — machined gap (bar underside → disc rim) and hub r   |
| Mast             | x 16→29, y 8→104                                          |
| Top arm          | x 16→114.5 (flush with disc right rim)                    |
| Middle arm       | x 16→63.5 — tip stops 3 short of the hub void (66.5)      |
| Rotor disc       | Ø 61 outer / Ø 35 inner, centre (84, 58)                  |
| Hub              | Ø 13, concentric                                          |
| Canvas           | 132 × 112, margins 16/16/17/8                              |

**Why it is a drone mark and not an aviation cliché:** no wings, no shield,
no swoosh, no cockpit, no aircraft silhouette. Rotation is expressed through
the letter's own skeleton — the disc is *structurally load-bearing* for the F,
and removing it collapses the mark. Every line is justified by the 13-unit
system; nothing is decorative. The 3-unit clearance between the arm tip and
the hub void is the same "machined gap" language as precision instruments.

## Wordmark — "FEL DRONE"

Custom monoline geometry (not a typeset font): 9-unit stroke on a 64-unit cap
height, butt caps, miter joins. Letterforms are constructed from the same
family of parts as the mark: bars and true circles (`O` = full circle with
1-unit typographic overshoot, `D`/`R` bowls are concentric arcs). Tracking
14.5, word gap 22.

## Lockups

1. **Primary horizontal** — symbol, gap 30, wordmark; overall 679 × 128 canvas.
2. **Stacked** — centred symbol above wordmark (social avatars, signage).
3. **Symbol alone** — favicon, app icon, drone body, uniform, small prints.
4. **Geographic secondary** — horizontal + `EL TARF · ALGÉRIE`, *optional and
   removable*; never part of the primary lockup.

## Colour

Monochrome first. The identity must run in pure black or pure white anywhere.

| Token | Light surfaces | Dark surfaces |
| ----- | -------------- | ------------- |
| Ink   | `#0e1f30`      | `#fbfaf8`     |
| Hub accent (only colour in the mark) | `#b4823c` | `#c6934a` |

No gradients, no shadows, no 3D, no outlines, no tints of the mark. The gold
hub is the single brand accent and is always the hub dot — never the letters.

## Sizes & clear space

- Clear space on all sides: **one mast width (13 units)**, proportional.
- Horizontal lockup: minimum rendered height **24 px** (print: 8 mm).
- Symbol alone: minimum **14 px** (favicon ships at 16 px and holds).
- On photo or coloured grounds use the mono-white / mono-black versions;
  maintain contrast ≥ 4.5:1 against the ground.

## Real-world tests passed

![Application board](./brand-board.png)


Website header (34 px), 16 px favicon on light and dark browser chrome,
navy app icon, business-card white and navy, Instagram avatar (stacked),
vehicle-door single-colour decal (symbol), drone-body plate (symbol, white),
building signage band (horizontal, inverted).

## File manifest

```
public/favicon.svg                          navy chip, 16–512 px
public/brand/fel-drone-symbol.svg           ink (+ gold hub)
public/brand/fel-drone-symbol-inverted.svg  paper (+ gold hub)
public/brand/fel-drone-symbol-mono-black.svg
public/brand/fel-drone-symbol-mono-white.svg
public/brand/fel-drone-horizontal*.svg      4 variants (ink/inverted/mono black/white)
public/brand/fel-drone-stacked*.svg         4 variants
public/brand/fel-drone-wordmark(-white).svg letters only
public/brand/fel-drone-horizontal-geo.svg   optional geographic lockup
```

## Updating

The component `src/components/Logo.tsx`, the favicon and all brand files are
produced from one geometry source (the brand-lab generator keeps
`SYMBOL.paths` + glyph table as single source of truth). To amend the mark:
change the unit geometry once, re-emit SVGs + component — components never
hard-code paths.

## Prohibitions

- Do not redraw, re-proportion, rotate or mirror the mark.
- Do not add wings, globes, circuit traces, shields or aircraft.
- Do not colour the letters; do not place the ink version over low-contrast
  imagery without a plate.
- Do not use the geographic line in the primary lockup.
- Do not render the lockup below minimum sizes; use the symbol alone instead.
