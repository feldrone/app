#!/usr/bin/env node
/**
 * FEL DRONE — brand lab, in-repo (identity v5).
 *
 * Single geometry source for the entire identity system. Every brand file
 * (public/brand/*.svg, public/favicon.svg) and the React lockup data
 * (src/brand/brandmark.ts) are EMITTED from the table below — never
 * hand-edited (docs/BRAND.md § Updating). Regeneration is deterministic:
 * stable mask ids, fixed number formatting, one source of truth.
 *
 * v4 → geometry provenance pass (files byte-stable, look unchanged).
 * v5 → refinement pass: 3° forward lean on the mark only (subtle flight
 * cue, wordmark untouched) + corrected horizontal optical spacing
 * (mark→“F” gap matched to the internal letter rhythm). To amend: change
 * the table once, run npm run brand:gen.
 *
 * Usage:
 *   node scripts/brand-gen.mjs          # write all files
 *   node scripts/brand-gen.mjs --check  # verify files are in sync (exit 1 if not)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ── Geometry (design grid 4u, mark canvas 168 × 180) ─────────────────── */

/* v5 motion cue: a uniform 3° forward lean on the mark only (never the
   wordmark). Skew is applied to the whole mark group — discs, hubs and the
   mask apertures share it, so every cut-out stays concentric with its rotor.
   At header scale it reads as airspeed; at 16px it disappears gracefully. */
const LEAN_DEG = 3;
const LEAN = ` skewX(${-LEAN_DEG})`;

const GEO = {
  canvas: { w: 168, h: 180 },
  ink: { light: "#0e1f30", dark: "#fbfaf8", monoBlack: "#000000", monoWhite: "#ffffff" },
  accent: { light: "#b4823c", dark: "#c6934a" },
  // mast, forward spar, sensor spar, skid, rotor 1, rotor 2
  mark: [
    { t: "rect", x: 36, y: 24, w: 24, h: 134 },
    { t: "rect", x: 36, y: 24, w: 98, h: 24 },
    { t: "rect", x: 60, y: 84, w: 54, h: 24 },
    { t: "rect", x: 24, y: 146, w: 72, h: 24, rx: 4 },
    { t: "circle", cx: 134, cy: 36, r: 26 },
    { t: "circle", cx: 114, cy: 96, r: 21 },
  ],
  // rotor apertures: true cut-outs via mask (counters survive any ground)
  holes: [
    { cx: 134, cy: 36, r: 6 },
    { cx: 114, cy: 96, r: 4.75 },
  ],
  // the single brand accent — hub dots, never on the letters
  hubs: [
    { cx: 134, cy: 36, r: 5.5 },
    { cx: 114, cy: 96, r: 4.5 },
  ],
};

/* ── Wordmark glyph table (monoline, 9-unit stroke, 64 cap height) ─────── */

const GLYPHS = [
  "M4.5 64 V0 H34 M4.5 29.5 H27", // F
  "M34 0 H4.5 V64 H34 M4.5 29.5 H28", // E
  "M4.5 0 V64 H34", // L
  "M4.5 0 V64 M4.5 0 H21 A32 32 0 0 1 21 64 H4.5", // D
  "M4.5 64 V0 H20 A17.75 17.75 0 0 1 20 35.5 H4.5 M20 35.5 L43 64", // R
  "M3.5 32 a28.5 28.5 0 1 0 57 0 a28.5 28.5 0 1 0 -57 0", // O
  "M4.5 64 V0 L37.5 64 V0", // N
  "M34 0 H4.5 V64 H34 M4.5 29.5 H28", // E
];
// advance table in glyph space; lockups scale by W_SCALE
const WORDMARK_X = [0, 53, 106, 181, 253, 315, 390, 446.5];
const W_SCALE = 1.03125;
const W_STROKE = 9;
// v5: mark rides 4u right (lean rebalance), wordmark pulled left so the
// mark→“F” optical gap (≈15u) sits at the same rhythm as the 16u internal
// letter gaps — one unified lockup, not two elements. Canvas/viewBox kept
// at 659 × 128 so every embedding on the site reflows zero.
const H_LOCKUP = { canvas: [659, 128], markT: [13.0, 1], markScale: 0.7, glyphY: 31 };
// Skewed mark's ink centre shifts right; recentre it over the wordmark axis.
const STACKED = { canvas: [517, 218], markT: [197.4, 1], markScale: 0.7, glyphY: 150, glyphX0: 8 };
// Favicon: +1.12u x-translation re-centers the leaning mark in the chip.
const FAVICON = { canvas: 64, chipRx: 14, t: [11.27, 11.625], scale: 0.2375 };

/* ── Formatting rules (fixed in v4 for byte-stable output) ─────────────── */
const n = (x) => String(x); // plain shortest decimal
const n3 = (x) => x.toFixed(3); // mark translations
const f4 = (x) => x.toFixed(4); // stacked glyph offsets

/* ── Emitters ───────────────────────────────────────────────────────────── */

const shape = (s) =>
  s.t === "rect"
    ? `<rect x="${n(s.x)}" y="${n(s.y)}" width="${n(s.w)}" height="${n(s.h)}"${s.rx ? ` rx="${n(s.rx)}"` : ""}/>`
    : `<circle cx="${n(s.cx)}" cy="${n(s.cy)}" r="${n(s.r)}"/>`;

const MARK = GEO.mark.map(shape).join("");
const HOLES = GEO.holes.map((c) => `<circle cx="${n(c.cx)}" cy="${n(c.cy)}" r="${n(c.r)}"/>`).join("");
const HUBS = GEO.hubs.map((c) => `<circle cx="${n(c.cx)}" cy="${n(c.cy)}" r="${n(c.r)}"/>`).join("");

const maskDef = (id, rectXY = true) =>
  `<defs><mask id="${id}"><rect ${rectXY ? 'x="0" y="0" ' : ""}width="${n(GEO.canvas.w)}" height="${n(GEO.canvas.h)}" fill="#fff"/><g fill="#000">${HOLES}</g></mask></defs>`;

const markGroup = (id, ink, accent) => {
  const hubs = accent ? `<g fill="${accent}">${HUBS}</g>` : "";
  return `<g fill="${ink}" mask="url(#${id})">${MARK}</g>${hubs}`;
};

const glyphGroup = (xOf, y, ink, scaleTransform = true) =>
  `<g fill="none" stroke="${ink}" stroke-width="${n(W_STROKE)}" stroke-linecap="butt" stroke-linejoin="miter">${GLYPHS.map(
    (d, i) =>
      `<path transform="translate(${xOf(i)} ${n(y)})${scaleTransform ? ` scale(${n(W_SCALE)})` : ""}" d="${d}"/>`,
  ).join("")}</g>`;

// v5 optical spacing: wordmark starts 11u earlier than v4 so the
// mark→“F” gap matches the internal letter rhythm, not a detached island.
const LOCKUP_X0 = 139;
const lockupX = (i) => n(LOCKUP_X0 + WORDMARK_X[i] * W_SCALE);
const stackedX = (i) => f4(STACKED.glyphX0 + WORDMARK_X[i] * W_SCALE);
const wordX = (i) => n(WORDMARK_X[i]);

const svgDoc = (viewBox, body) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${body}\n</svg>\n`;

const markTransform = ({ markT, markScale }) =>
  `translate(${n3(markT[0])} ${n3(markT[1])}) scale(${n(markScale)})${LEAN}`;

const lockupSvg = (kind, variant) => {
  const spec = kind === "horizontal" ? H_LOCKUP : STACKED;
  const ink =
    variant === "inverted" ? GEO.ink.dark : variant === "mono-black" ? GEO.ink.monoBlack : variant === "mono-white" ? GEO.ink.monoWhite : GEO.ink.light;
  const accent =
    variant === "inverted" ? GEO.accent.dark : variant === "ink" ? GEO.accent.light : null;
  const bg =
    variant === "inverted"
      ? `<rect width="${n(spec.canvas[0])}" height="${n(spec.canvas[1])}" fill="${GEO.ink.light}"/>`
      : "";
  const maskId = (kind === "horizontal" ? "hm" : "sm") + variantIndex(variant);
  const xOf = kind === "horizontal" ? lockupX : stackedX;
  const inner =
    `<g transform="${markTransform(spec)}">${maskDef(maskId)}${markGroup(maskId, ink, accent)}</g>` +
    glyphGroup(xOf, spec.glyphY, ink);
  return svgDoc(`0 0 ${n(spec.canvas[0])} ${n(spec.canvas[1])}`, bg + inner);
};

const symbolSvg = (variant) => {
  const ink =
    variant === "inverted" ? GEO.ink.dark : variant === "mono-black" ? GEO.ink.monoBlack : variant === "mono-white" ? GEO.ink.monoWhite : GEO.ink.light;
  const accent = variant === "inverted" || variant === "ink" ? (variant === "inverted" ? GEO.accent.dark : GEO.accent.light) : null;
  const bg = variant === "inverted" ? `<rect width="${n(GEO.canvas.w)}" height="${n(GEO.canvas.h)}" fill="${GEO.ink.light}"/>` : "";
  const id = "fm" + variantIndex(variant);
  // Standalone symbol carries the lean as its own group transform so the
  // mark, mask apertures and hubs skew as one construct (never separately).
  return svgDoc(
    `0 0 ${n(GEO.canvas.w)} ${n(GEO.canvas.h)}`,
    bg + `<g transform="${LEAN.trim()}">` + maskDef(id) + markGroup(id, ink, accent) + `</g>`,
  );
};

const variantIndex = (v) => ({ ink: 1, "mono-black": 2, "mono-white": 3, inverted: 4 }[v]);

const geoSvg = () => {
  const id = "hm9";
  // v5: spar axes are no longer horizontal (3° lean) — they are shown inside
  // the construction group; the canvas grid keeps only the lockup rules.
  const grid = `<g stroke="#b9c2cf" stroke-width="1" fill="none">${[8, 120, 128]
    .map((y) => `<line x1="0" y1="${n(y)}" x2="${n(H_LOCKUP.canvas[0])}" y2="${n(y)}"/>`)
    .join("")}</g>`;
  const construction = `<g fill="none" stroke="#d67d2e" stroke-width="1" opacity="0.85" transform="${markTransform(H_LOCKUP)}"><circle cx="134" cy="36" r="31"/><circle cx="114" cy="96" r="26"/><line x1="0" y1="36" x2="${n(GEO.canvas.w)}" y2="36"/><line x1="0" y1="96" x2="${n(GEO.canvas.w)}" y2="96"/><line x1="36" y1="0" x2="36" y2="${n(GEO.canvas.h)}"/><line x1="60" y1="0" x2="60" y2="${n(GEO.canvas.h)}"/><line x1="0" y1="146" x2="${n(GEO.canvas.w)}" y2="146"/><line x1="0" y1="170" x2="${n(GEO.canvas.w)}" y2="170"/></g>`;
  const caption =
    '<text x="8" y="152" font-family="DejaVu Sans" font-size="11" fill="#7c8798">grid 4u · spar 24u · 3° forward lean · rotor 1 = ⌀52 on spar axis · rotor 2 = ⌀42 on mid axis · skid 72 × 24 · mark→word gap matches the 15u internal letter rhythm</text>';
  const mark = `<g transform="${markTransform(H_LOCKUP)}">${maskDef(id)}${markGroup(id, GEO.ink.light, GEO.accent.light)}</g>`;
  return svgDoc(`0 0 679 162`, grid + mark + glyphGroup(lockupX, H_LOCKUP.glyphY, GEO.ink.light) + construction + caption);
};

const wordmarkSvg = (ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485 64">\n  <g fill="none" stroke="${ink}" stroke-width="${n(W_STROKE)}" stroke-linecap="butt" stroke-linejoin="miter">\n${GLYPHS.map(
    (d, i) => `    <path transform="translate(${wordX(i)} 0)" d="${d}"/>`,
  ).join("\n")}\n  </g>\n</svg>\n`;

const faviconSvg = () => {
  const { canvas, chipRx, t, scale } = FAVICON;
  return svgDoc(
    `0 0 ${n(canvas)} ${n(canvas)}`,
    `<rect width="${n(canvas)}" height="${n(canvas)}" rx="${n(chipRx)}" fill="${GEO.ink.light}"/><g transform="translate(${n3(t[0])} ${n3(t[1])}) scale(${n(scale)})${LEAN}">${maskDef("fv")}${`<g fill="${GEO.ink.dark}" mask="url(#fv)">${MARK}</g>`}</g>`,
  );
};

/** Data module consumed by src/components/Logo.tsx — one source, no drift. */
const brandmarkTs = `/** GENERATED by scripts/brand-gen.mjs — do not edit by hand (npm run brand:gen). */
export type BrandRect = { t: "rect"; x: number; y: number; w: number; h: number; rx?: number };
export type BrandCircle = { t: "circle"; cx: number; cy: number; r: number };
export type BrandShape = BrandRect | BrandCircle;
export type BrandGlyph = { d: string; x: string; y: number };

export type BrandData = {
  canvas: { w: number; h: number };
  lockup: {
    width: number;
    height: number;
    markTransform: string;
    glyphY: number;
    glyphScale: number;
    strokeWidth: number;
  };
  colors: {
    light: string;
    dark: string;
    monoBlack: string;
    monoWhite: string;
    accentLight: string;
    accentDark: string;
  };
  mark: BrandShape[];
  holes: BrandCircle[];
  hubs: BrandCircle[];
  glyphs: BrandGlyph[];
};

export const BRAND: BrandData = ${JSON.stringify(
  {
    canvas: { w: 168, h: 180 },
    lockup: {
      width: H_LOCKUP.canvas[0],
      height: H_LOCKUP.canvas[1],
      markTransform: markTransform(H_LOCKUP),
      glyphY: H_LOCKUP.glyphY,
      glyphScale: W_SCALE,
      strokeWidth: W_STROKE,
    },
    colors: { ...GEO.ink, accentLight: GEO.accent.light, accentDark: GEO.accent.dark },
    mark: GEO.mark,
    holes: GEO.holes.map(({ cx, cy, r }) => ({ t: "circle", cx, cy, r })),
    hubs: GEO.hubs.map(({ cx, cy, r }) => ({ t: "circle", cx, cy, r })),
    glyphs: GLYPHS.map((d, i) => ({ d, x: lockupX(i), y: H_LOCKUP.glyphY })),
  },
  null,
  2,
)};
`;

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
  "public/brand/fel-drone-wordmark.svg": wordmarkSvg(GEO.ink.light),
  "public/brand/fel-drone-wordmark-white.svg": wordmarkSvg(GEO.ink.dark),
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
