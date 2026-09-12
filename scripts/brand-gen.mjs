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
 * (mark→“F” gap matched to the internal letter rhythm).
 * v5.2 → wordmark unification + mark optical weight: “FEL DRONE” becomes
 * the single word FELDRONE (FEL bold 12u / DRONE light 6.5u on one ink-locked
 * grid, kerning-tight L→D junction, no word space), and the mark's spars go
 * 24u → 26u so the icon balances the light-weight half of the wordmark.
 * Concept, proportions, grid and the 3° lean are untouched. To amend: change
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
  // v5.2 optical-weight pass: spars 24u -> 26u (+8%) so the mark balances the
  // two-weight wordmark (bold FEL / light DRONE) without going bulky. Ink
  // outline is preserved exactly — growth is inward on shared edges: mast
  // grows right (36..62), top bar down (24..50), sensor spar centred on its
  // 96u axis (83..109), skid grows up (144..170). Discs, apertures and hubs
  // untouched; canvas 168x180 unchanged, so the favicon optical size needs
  // no re-tune.
  mark: [
    { t: "rect", x: 36, y: 24, w: 26, h: 134 },
    { t: "rect", x: 36, y: 24, w: 98, h: 26 },
    { t: "rect", x: 60, y: 83, w: 54, h: 26 },
    { t: "rect", x: 24, y: 144, w: 72, h: 26, rx: 4 },
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

/* ── Wordmark glyph table (monoline, two-weight, 64 cap grid) ─────────────
   v5.2: one unified word FELDRONE — no word space. Contrast comes from
   weight alone, one construction family: every glyph sits on the same
   ink-locked grid (bar centre-lines at 0 / 29.5 / 64, left ink edge at 0,
   right ink edges preserved), so FEL (W_BOLD) and DRONE (W_LIGHT) share
   cap line, baseline and module. Kerning: uniform 14u centre-line gaps
   (the 15u lockup rhythm), tightened to 10u around the round O, and the
   L→D weight junction at 14u — present but seamless.
   Path builder: stem x = S/2, bar right = inkEdge − S/2. */

const W_BOLD = 12; // FEL — semi-bold/bold optical weight
const W_LIGHT = 6.5; // DRONE — light/thin, still holds at 32px+
const B = (stem, barR, mid) => `M${stem} 64 V0 H${barR} M${stem} 29.5 H${mid}`; // F
const E = (stem, barR, mid) => `M${barR} 0 H${stem} V64 H${barR} M${stem} 29.5 H${mid}`;
const L = (stem, barR) => `M${stem} 0 V64 H${barR}`;

const GLYPHS = [
  // weight, path, advance (centre-line units)
  [W_BOLD, B(6, 32.5, 25.5), 0], // F — arms ink to 38.5 / 31.5
  [W_BOLD, E(6, 32.5, 26.5), 53], // E — arms ink to 38.5 / 32.5
  [W_BOLD, L(6, 32.5), 106], // L
  [W_LIGHT, "M3.25 0 V64 M3.25 0 H19.75 A32 32 0 0 1 19.75 64 H3.25", 158.5], // D — bowl ink 55
  [
    W_LIGHT,
    "M3.25 64 V0 H18.25 A17.75 17.75 0 0 1 18.25 35.5 H3.25 M18.25 35.5 L44.25 64",
    227.5,
  ], // R — leg ink 47.5
  [
    W_LIGHT,
    "M3.25 32 a29.75 29.75 0 1 0 59.5 0 a29.75 29.75 0 1 0 -59.5 0",
    285,
  ], // O — ring ink 0..66, optically reduced
  [W_LIGHT, "M3.25 64 V0 L38.75 64 V0", 361], // N — ink 0..42
  [W_LIGHT, E(3.25, 35.25, 29.25), 417], // E — closes the word
];
const WORDMARK_ADV = GLYPHS.map((g) => g[2]);
const WORDMARK_W = GLYPHS.map((g) => g[0]);
const WORDMARK_PATHS = GLYPHS.map((g) => g[1]);
const WORD_INK_RIGHT = 455.5; // final E right ink edge, centre-line units
// v5.2: W_SCALE kept — 14u gaps project to the 14.4u ≈ 15u lockup rhythm.
const W_SCALE = 1.03125;
// v5: mark rides 4u right (lean rebalance), wordmark pulled left so the
// mark→“F” optical gap (≈15u) sits at the same rhythm as the internal
// letter gaps — one unified lockup, not two elements.
// v5.2: one unified word is 24u shorter, so the canvas closes in on it:
// word right ink 608.7 + margin mirrors the mark's 23.6 left ink margin.
const H_LOCKUP = { canvas: [632, 128], markT: [13.0, 1], markScale: 0.7, glyphY: 31 };
// Skewed mark's ink centre shifts right; recentre it over the wordmark axis.
// Stacked: word ink width 469.7 centred on 517 → x0 = (517 − 469.7)/2.
const STACKED = { canvas: [517, 218], markT: [197.4, 1], markScale: 0.7, glyphY: 150, glyphX0: 23.63 };
// Favicon = OPTICAL SIZE of the mark, not a mathematical downscale (v5.1):
// the mark fills 45u of the 64u chip (+14% mass vs the lockup projection) and
// the rotor-1 aperture widens 6u→8.5u so the cut-out survives AA at 16 px.
// The small rotor 2 keeps no aperture at chip scale — at ≤16 px a 1 px hole
// reads as noise; solid disc + drilled big disc preserves the two-rotor DNA.
// Same geometry otherwise: proportions, 3° lean, weights, clear space ≥1 spar.
const FAVICON = { canvas: 64, chipRx: 14, t: [7.16, 7.97], scale: 0.27 };
const FAV_HOLES = [{ cx: 134, cy: 36, r: 8.5 }];

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

// per-glyph stroke weight rides on each <path> so the FEL/DRONE contrast
// survives in every consumer (svg files, geo board, React data module).
const glyphGroup = (xOf, y, ink, scaleTransform = true) =>
  `<g fill="none" stroke="${ink}" stroke-linecap="butt" stroke-linejoin="miter">${WORDMARK_PATHS.map(
    (d, i) =>
      `<path stroke-width="${n(WORDMARK_W[i])}" transform="translate(${xOf(i)} ${n(y)})${scaleTransform ? ` scale(${n(W_SCALE)})` : ""}" d="${d}"/>`,
  ).join("")}</g>`;

// v5 optical spacing: the mark→“F” gap (≈15u) matches the internal letter
// rhythm, not a detached island. Unchanged in v5.2 (one word, same axis).
const LOCKUP_X0 = 139;
const lockupX = (i) => n(LOCKUP_X0 + WORDMARK_ADV[i] * W_SCALE);
const stackedX = (i) => f4(STACKED.glyphX0 + WORDMARK_ADV[i] * W_SCALE);
const wordX = (i) => n(WORDMARK_ADV[i]);

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
    '<text x="8" y="152" font-family="DejaVu Sans" font-size="11" fill="#7c8798">grid 4u · spar 26u · 3° forward lean · rotor 1 = ⌀52 on spar axis · rotor 2 = ⌀42 on mid axis · skid 72 × 26 · one word FELDRONE: FEL 12u / DRONE 6.5u stroke, 14u rhythm, O kerned tight at 10u</text>';
  const mark = `<g transform="${markTransform(H_LOCKUP)}">${maskDef(id)}${markGroup(id, GEO.ink.light, GEO.accent.light)}</g>`;
  return svgDoc(`0 0 679 162`, grid + mark + glyphGroup(lockupX, H_LOCKUP.glyphY, GEO.ink.light) + construction + caption);
};

// Standalone wordmark: viewBox now frames the full ink box (bold overshoot
// above the cap line included) — the v5.0 build cropped 4.5u off the bar
// terminals. 8u breathing all round; two weights via per-path stroke-width.
const wordmarkSvg = (ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 471.5 80">\n  <g fill="none" stroke="${ink}" stroke-linecap="butt" stroke-linejoin="miter" transform="translate(8 8)">\n${WORDMARK_PATHS.map(
    (d, i) => `    <path stroke-width="${n(WORDMARK_W[i])}" transform="translate(${wordX(i)} 0)" d="${d}"/>`,
  ).join("\n")}\n  </g>\n</svg>\n`;

const faviconSvg = () => {
  // Optical favicon construction (v5.1): dedicated FAV_HOLES mask — see the
  // FAVICON constants. Ink + apertures share the group transform, so the
  // cut-out stays concentric with its rotor under the 3° lean.
  const { canvas, chipRx, t, scale } = FAVICON;
  const favHoles = FAV_HOLES.map((h) => `<circle cx="${n(h.cx)}" cy="${n(h.cy)}" r="${n(h.r)}"/>`).join("");
  const favMask = `<defs><mask id="fv"><rect x="0" y="0" width="${n(GEO.canvas.w)}" height="${n(GEO.canvas.h)}" fill="#fff"/><g fill="#000">${favHoles}</g></mask></defs>`;
  return svgDoc(
    `0 0 ${n(canvas)} ${n(canvas)}`,
    `<rect width="${n(canvas)}" height="${n(canvas)}" rx="${n(chipRx)}" fill="${GEO.ink.light}"/><g transform="translate(${n3(t[0])} ${n3(t[1])}) scale(${n(scale)})${LEAN}">${favMask}${`<g fill="${GEO.ink.dark}" mask="url(#fv)">${MARK}</g>`}</g>`,
  );
};

/** Data module consumed by src/components/Logo.tsx — one source, no drift. */
const brandmarkTs = `/** GENERATED by scripts/brand-gen.mjs — do not edit by hand (npm run brand:gen). */
export type BrandRect = { t: "rect"; x: number; y: number; w: number; h: number; rx?: number };
export type BrandCircle = { t: "circle"; cx: number; cy: number; r: number };
export type BrandShape = BrandRect | BrandCircle;
export type BrandGlyph = { d: string; x: string; y: number; w: number };

export type BrandData = {
  canvas: { w: number; h: number };
  lockup: {
    width: number;
    height: number;
    markTransform: string;
    glyphY: number;
    glyphScale: number;
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
    },
    colors: { ...GEO.ink, accentLight: GEO.accent.light, accentDark: GEO.accent.dark },
    mark: GEO.mark,
    holes: GEO.holes.map(({ cx, cy, r }) => ({ t: "circle", cx, cy, r })),
    hubs: GEO.hubs.map(({ cx, cy, r }) => ({ t: "circle", cx, cy, r })),
    glyphs: WORDMARK_PATHS.map((d, i) => ({ d, x: lockupX(i), y: H_LOCKUP.glyphY, w: WORDMARK_W[i] })),
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
