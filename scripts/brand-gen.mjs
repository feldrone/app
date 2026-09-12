#!/usr/bin/env node
/**
 * FELDRONE — brand lab, in-repo (identity v6.0).
 *
 * Single geometry source for the entire identity system. Every brand file
 * (public/brand/*.svg, public/favicon.svg) and the React lockup data
 * (src/brand/brandmark.ts) are EMITTED from the table below — never
 * hand-edited (docs/BRAND.md § Updating). Regeneration is deterministic:
 * stable path order, fixed number formatting, one source of truth.
 *
 * v4 → geometry provenance pass (byte-stable emission).
 * v5 → 3° forward lean + corrected mark→word optical gap.
 * v5.1 → favicon optical size. v5.2 → one-word FELDRONE (two weights).
 * v6.0 → REDESIGN per client specification of 2026-09-13 (supersedes the
 *   "no redesign" rule of v5): the mark is now a unified F/D counter
 *   monogram on a strict 136 × 160 grid, module 4u, one stroke weight
 *   (T = 24) for the whole identity. Zero literal drone parts, zero dots:
 *   rotors, spars, skid, apertures, gold hubs and the 3° lean retire.
 *   The wordmark keeps the v5.2 one-word FELDRONE construction but moves
 *   to a SINGLE unified weight (10u) — the light 6.5u half violated the
 *   new "no hairline parts below 24 px" rule. The symbol is pure even-odd
 *   geometry (true through-holes): monochrome-first, flawless on any
 *   ground, no masks anywhere in the system anymore.
 *
 * Usage:
 *   node scripts/brand-gen.mjs          # write all files
 *   node scripts/brand-gen.mjs --check  # verify files are in sync (exit 1)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ── The mark: FD merged monogram (grid 136 × 160, module 4u) ──────────── */
/*
  Outer boundary — a flat-shouldered D: stem face at x 0, top edge runs to the
  bowl tangent at x 56, the right side is a true semicircle r 80 centred
  (56, 80), bottom edge mirrors the top. Counter (the window) is the same
  construction inset by T = 24: r 56, square shoulders at (24, 24)/(24, 136).
  The F is the shared ink: the D's stem IS the F stem, the D's top edge IS the
  F's top arm, and a free-floating mid arm (y 60..84, the 40/60 window split,
  crossbar 8u above centre like the retired gantry mark) completes the letter.
  The arm's tip is a 16u airfoil wedge that stops 7u short of the bowl wall:
  the negative-space channel keeps the counter ONE connected region (no B or
  P read at any size) and lets any ground flow through the mark.
  All coordinates integers on the 4u grid; every arc radius a multiple of 8.
*/
const GRID = { w: 136, h: 160 };
const T = 24; // single stroke weight of the whole system
const CX = 56, R = 80, RI = 56; // bowl centre x, outer/inner radii
const ARM = { y0: 60, y1: 84, tip: 104, chisel: 16 };

const RING_D =
  `M0 0H${CX}A${R} ${R} 0 0 1 ${CX} ${GRID.h}H0Z` +
  `M${T} ${T}H${CX}A${RI} ${RI} 0 0 1 ${CX} ${GRID.h - T}H${T}Z`;
const armD = (tip) =>
  `M${T} ${ARM.y0}H${tip - ARM.chisel}L${tip} ${(ARM.y0 + ARM.y1) / 2}L${tip - ARM.chisel} ${ARM.y1}H${T}Z`;
const ARM_D = armD(ARM.tip);

const INK = { light: "#0e1f30", dark: "#fbfaf8", monoBlack: "#000000", monoWhite: "#ffffff" };
const ACCENT = { light: "#b4823c", dark: "#c6934a" }; // site token only — no colour inside the logo

/* ── Wordmark: FELDRONE, one word, one weight (10u on the 64 cap grid) ─── */
/* Ink edges are unchanged from v5.2 (arm ends 38.5/31.5/32.5, D bowl ink 55,
   O ring ink 66, N ink 42, R leg ink 47.5) — at unified 10u the centrelines
   shift to ink-edge −/+ 5. Advances are the v5.2 kerning table: 14.5u inside
   FEL, 14u elsewhere, 10u around the round O. */

const GLYPHS = [
  "M5 64 V0 H33.5 M5 29.5 H26.5", // F
  "M33.5 0 H5 V64 H33.5 M5 29.5 H27.5", // E
  "M5 0 V64 H33.5", // L
  "M5 0 V64 M5 0 H18 A32 32 0 0 1 18 64 H5", // D
  "M5 64 V0 H21.5 A16.875 16.875 0 0 1 21.5 33.75 H5 M21.5 33.75 L42.5 64", // R
  "M5 32 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0", // O
  "M5 64 V0 L37 64 V0", // N
  "M33.5 0 H5 V64 H33.5 M5 29.5 H27.5", // E
];
const ADV = [0, 53, 106, 158.5, 227.5, 285, 361, 417]; // advances (pre-scale)
const WORD_INK_RIGHT = 455.5;
const W_SCALE = 1.03125;
const W_STROKE = 10;

const LOCKUP_X0 = 134; // mark right ink 118.8 → gap 15.2u ≈ the 14.4u letter rhythm
const H_LOCKUP = { canvas: [628, 128], markT: [23.6, 8], markScale: 0.7, glyphY: 31 };
// Stacked: mark and word each centred on 258.5; vertical rhythm 8 / 31 / 9.4.
const STACKED = { canvas: [517, 236], markT: [210.9, 8], markScale: 0.7, glyphY: 156, glyphX0: 23.63 };
// Favicon keeps the v5.1 optical rule (mark fills 45u of the 64u chip) and
// gains one simplification: the arm stops at x 96 (channel 7u → 15.4u) so the
// counter reads wide-open at 16 px. Same geometry otherwise, no extra parts.
const FAVICON = { canvas: 64, chipRx: 14, t: [12.875, 9.5], scale: 0.28125, armTip: 96 };

/* ── Formatting rules (fixed in v4 for byte-stable output) ─────────────── */
const n = (x) => String(x); // plain shortest decimal
const n3 = (x) => x.toFixed(3); // mark translations
const f4 = (x) => x.toFixed(4); // stacked glyph offsets

/* ── Emitters ───────────────────────────────────────────────────────────── */

const markBody = (ink) =>
  `<path fill="${ink}" fill-rule="evenodd" d="${RING_D}"/><path fill="${ink}" d="${ARM_D}"/>`;

const glyphGroup = (xOf, y, ink, scaleTransform = true) =>
  `<g fill="none" stroke="${ink}" stroke-width="${n(W_STROKE)}" stroke-linecap="butt" stroke-linejoin="miter">${GLYPHS.map(
    (d, i) =>
      `<path transform="translate(${xOf(i)} ${n(y)})${scaleTransform ? ` scale(${n(W_SCALE)})` : ""}" d="${d}"/>`,
  ).join("")}</g>`;

const lockupX = (i) => n(LOCKUP_X0 + ADV[i] * W_SCALE);
const stackedX = (i) => f4(STACKED.glyphX0 + ADV[i] * W_SCALE);
const wordX = (i) => n(ADV[i]);

const svgDoc = (viewBox, body) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${body}\n</svg>\n`;

const markTransform = ({ markT, markScale }) =>
  `translate(${n3(markT[0])} ${n3(markT[1])}) scale(${n(markScale)})`;

const inkFor = (variant) =>
  variant === "inverted" ? INK.dark : variant === "mono-black" ? INK.monoBlack : variant === "mono-white" ? INK.monoWhite : INK.light;

const lockupSvg = (kind, variant) => {
  const spec = kind === "horizontal" ? H_LOCKUP : STACKED;
  const ink = inkFor(variant);
  const bg =
    variant === "inverted"
      ? `<rect width="${n(spec.canvas[0])}" height="${n(spec.canvas[1])}" fill="${INK.light}"/>`
      : "";
  const xOf = kind === "horizontal" ? lockupX : stackedX;
  const inner =
    `<g transform="${markTransform(spec)}">${markBody(ink)}</g>` + glyphGroup(xOf, spec.glyphY, ink);
  return svgDoc(`0 0 ${n(spec.canvas[0])} ${n(spec.canvas[1])}`, bg + inner);
};

const symbolSvg = (variant) => {
  const ink = inkFor(variant);
  const bg = variant === "inverted" ? `<rect width="${n(GRID.w)}" height="${n(GRID.h)}" fill="${INK.light}"/>` : "";
  return svgDoc(`0 0 ${n(GRID.w)} ${n(GRID.h)}`, bg + markBody(ink));
};

// Construction sheet: the lockup with its generator rules drawn under it.
const geoSvg = () => {
  const g = (inner) => `<g transform="${markTransform(H_LOCKUP)}">${inner}</g>`;
  const construction = g(
    `<g fill="none" stroke="#d67d2e" stroke-width="1" opacity="0.85"><circle cx="${n(CX)}" cy="${n(GRID.h / 2)}" r="${n(R)}"/><circle cx="${n(CX)}" cy="${n(GRID.h / 2)}" r="${n(RI)}"/><line x1="0" y1="${n(ARM.y0)}" x2="${n(GRID.w)}" y2="${n(ARM.y0)}"/><line x1="0" y1="${n((ARM.y0 + ARM.y1) / 2)}" x2="${n(GRID.w)}" y2="${n((ARM.y0 + ARM.y1) / 2)}"/><line x1="0" y1="${n(ARM.y1)}" x2="${n(GRID.w)}" y2="${n(ARM.y1)}"/><line x1="${n(T)}" y1="0" x2="${n(T)}" y2="${n(GRID.h)}"/><line x1="${n(CX)}" y1="0" x2="${n(CX)}" y2="${n(GRID.h)}"/></g>`,
  );
  const grid = `<g stroke="#b9c2cf" stroke-width="1" fill="none"><line x1="0" y1="8" x2="${n(H_LOCKUP.canvas[0])}" y2="8"/><line x1="0" y1="120" x2="${n(H_LOCKUP.canvas[0])}" y2="120"/><line x1="0" y1="128" x2="${n(H_LOCKUP.canvas[0])}" y2="128"/></g>`;
  const caption =
    '<text x="8" y="152" font-family="DejaVu Sans" font-size="11" fill="#7c8798">grid 136 × 160 · module 4u · T = 24 one weight · bowl r 80 / r 56 centred (56, 80) · arm y 60..84, tip 104, 16u chisel, 7u channel · word 10u / 64 cap, kerning 14.5 / 14 / 10</text>';
  const mark = g(markBody(INK.light));
  return svgDoc(
    `0 0 679 162`,
    grid + mark + glyphGroup(lockupX, H_LOCKUP.glyphY, INK.light) + construction + caption,
  );
};

// Standalone wordmark: viewBox frames the full ink box (8u breathing).
const wordmarkSvg = (ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 471.5 80">\n  <g fill="none" stroke="${ink}" stroke-width="${n(W_STROKE)}" stroke-linecap="butt" stroke-linejoin="miter" transform="translate(8 8)">\n${GLYPHS.map(
    (d, i) => `    <path transform="translate(${wordX(i)} 0)" d="${d}"/>`,
  ).join("\n")}\n  </g>\n</svg>\n`;

const faviconSvg = () => {
  const { canvas, chipRx, t, scale, armTip } = FAVICON;
  return svgDoc(
    `0 0 ${n(canvas)} ${n(canvas)}`,
    `<rect width="${n(canvas)}" height="${n(canvas)}" rx="${n(chipRx)}" fill="${INK.light}"/><g transform="translate(${n3(t[0])} ${n3(t[1])}) scale(${n(scale)})"><path fill="${INK.dark}" fill-rule="evenodd" d="${RING_D}"/><path fill="${INK.dark}" d="${armD(armTip)}"/></g>`,
  );
};

/** Data module consumed by src/components/Logo.tsx — one source, no drift. */
const brandmarkTs = `/** GENERATED by scripts/brand-gen.mjs — do not edit by hand (npm run brand:gen). */\nexport type BrandGlyph = { d: string; x: string; y: number };\n\nexport type BrandData = {\n  canvas: { w: number; h: number };\n  lockup: {\n    width: number;\n    height: number;\n    markTransform: string;\n    glyphY: number;\n    glyphScale: number;\n    strokeWidth: number;\n  };\n  colors: {\n    light: string;\n    dark: string;\n    monoBlack: string;\n    monoWhite: string;\n  };\n  ring: string;\n  arm: string;\n  glyphs: BrandGlyph[];\n};\n\nexport const BRAND: BrandData = ${JSON.stringify(
  {
    canvas: { w: GRID.w, h: GRID.h },
    lockup: {
      width: H_LOCKUP.canvas[0],
      height: H_LOCKUP.canvas[1],
      markTransform: markTransform(H_LOCKUP),
      glyphY: H_LOCKUP.glyphY,
      glyphScale: W_SCALE,
      strokeWidth: W_STROKE,
    },
    colors: { ...INK },
    ring: RING_D,
    arm: ARM_D,
    glyphs: GLYPHS.map((d, i) => ({ d, x: lockupX(i), y: H_LOCKUP.glyphY })),
  },
  null,
  2,
)};\n`;

/* ── File plan ──────────────────────────────────────────────────────────── */

const FILES = {
  "public/favicon.svg": faviconSvg(),
  "public/brand/fel-drone-symbol.svg": symbolSvg("ink"),
  "public/brand/fel-drone-symbol-inverted.svg": symbolSvg("inverted"),
  "public/brand/fel-drone-symbol-mono-black.svg": symbolSvg("mono-black"),
  "public/brand/fel-drone-symbol-mono-white.svg": symbolSvg("mono-white"),
  "public/brand/fel-drone-horizontal.svg": lockupSvg("horizontal", "ink"),
  "public/brand/fel-drone-horizontal-inverted.svg": lockupSvg("horizontal", "inverted"),
  "public/brand/fel-drone-horizontal-mono-black.svg": lockupSvg("horizontal", "mono-black"),
  "public/brand/fel-drone-horizontal-mono-white.svg": lockupSvg("horizontal", "mono-white"),
  "public/brand/fel-drone-stacked.svg": lockupSvg("stacked", "ink"),
  "public/brand/fel-drone-stacked-inverted.svg": lockupSvg("stacked", "inverted"),
  "public/brand/fel-drone-stacked-mono-black.svg": lockupSvg("stacked", "mono-black"),
  "public/brand/fel-drone-stacked-mono-white.svg": lockupSvg("stacked", "mono-white"),
  "public/brand/fel-drone-horizontal-geo.svg": geoSvg(),
  "public/brand/fel-drone-wordmark.svg": wordmarkSvg(INK.light),
  "public/brand/fel-drone-wordmark-white.svg": wordmarkSvg(INK.dark),
  "src/brand/brandmark.ts": brandmarkTs,
};

if (!fs.existsSync(path.join(ROOT, "src/brand"))) fs.mkdirSync(path.join(ROOT, "src/brand"));

const check = process.argv.includes("--check");
let dirty = 0;
for (const [rel, content] of Object.entries(FILES)) {
  const abs = path.join(ROOT, rel);
  const current = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
  if (current === content) continue;
  if (check) {
    console.error(`out of sync: ${rel}`);
    dirty++;
  } else {
    fs.writeFileSync(abs, content);
    console.log(`wrote ${rel}`);
  }
}
if (check) {
  console.log(dirty ? `${dirty} file(s) out of sync` : "brand files in sync with scripts/brand-gen.mjs");
  process.exit(dirty ? 1 : 0);
}
