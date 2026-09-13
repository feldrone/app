#!/usr/bin/env node
/**
 * FELDRONE — brand lab, in-repo (identity v7.2 “THE CLEARANCE”).
 *
 * Single geometry source for the entire identity system. Every brand file
 * (public/brand/*.svg, public/favicon.svg) and the React lockup data
 * (src/brand/brandmark.ts) are EMITTED from the table below — never
 * hand-edited (docs/BRAND.md § Updating). Determinism: integer-only
 * coordinates on a 16u master grid, stable path order, one source.
 *
 * History: v6.x FD counter monogram · v7.0 “THE VANE” windsock-F ·
 * v7.2 CRITICAL CORRECTION per client brief of 2026-09-13: the windsock/
 * rotor read is retired, and the mark stops depicting anything at all.
 *
 * v7.2 THE SYSTEM — one grid, one angle, equal ink and air:
 *   · unit g = 8u, master module M = 32u; the icon canvas is 4M = 128u
 *     and the mark fills it edge to edge — no internal padding, the clear
 *     space lives in the lockups;
 *   · the mark is THREE solid rectilinear blocks (a slab and two shelves)
 *     and the F is the VOID they leave between them: the vertical channel
 *     is the stem, the gaps opening rightward are the two arms — every
 *     channel and every bar measures exactly M = 32u, so ink and air
 *     weigh the same; nothing in the mark is a drone part, a blade, a
 *     mast, a wing, a frame; it is a clearance fit — the instrument of the
 *     trade (calibration, maintenance, precision) read as a letter;
 *   · 45° is the ONLY non-right angle in the whole identity: the shelves
 *     carry a 16u (M/2) chamfer facing the mid arm, and the wordmark’s
 *     D, O and R bowls carry the same 45° cut at 24u — one grammar, two
 *     scales;
 *   · the wordmark steps UP in presence (cap 96u, stem 24u = the D/O/R
 *     counters are also exactly 24u — counters equal strokes, the type
 *     keeps the mark’s “ink = air” law); kerning 24u with one optical
 *     closure to 16u at R-O; the F of FELDRONE is the void-F materialised
 *     as ink: same two arms, same proportions, no wedges, no tapers;
 *   · responsive logo system (brief §5): MASTER (lockups, ≥64px incl. the
 *     chamfers), COMPACT (symbol alone, 40..64px, master geometry), MICRO
 *     (16..32px: the chamfers are DELETED, the three blocks square off —
 *     the only simplification the design ever needs, because at 16px a
 *     2px bevel is noise; the F-void is the signature and it always
 *     survives). The wordmark is never rendered below COMPACT (brief §6).
 *
 * Usage:
 *   node scripts/brand-gen.mjs          # write all files
 *   node scripts/brand-gen.mjs --check  # verify files are in sync (exit 1)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ── The mark: three blocks, one F-shaped clearance (canvas 128 × 128) ────
  Slab A  x 0..32  · y 0..128                       — the F’s spine wall
  Shelf B x 64..128 · y 32..64, lower-left 16u 45°   — closes the top arm
  Shelf C x 64..128 · y 96..128, upper-left 16u 45° — closes the mid arm
  Voids: stem channel x 32..64 (full height, opens at the baseline),
  top arm y 0..32 (x 64..128 to the edge), mid arm y 64..96 (x 64..128 to
  the edge) — every void exactly 32u. The chamfers flare the waist of the
  mid arm: the “air” accelerates through the fit. */
const GRID = { w: 128, h: 128 };
const MARK_D =
  "M0 0H32V128H0Z" +
  "M64 32H128V64H80L64 48Z" +
  "M64 112L80 96H128V128H64Z";
// MICRO cut (64 box and 128 square build): same law, chamfers removed.
const MARK_MICRO_128 =
  "M0 0H32V128H0Z" +
  "M64 32H128V64H64Z" +
  "M64 96H128V128H64Z";
const MICRO_64 = "M8 8H20V56H8Z" + "M32 20H56V32H32Z" + "M32 44H56V56H32Z";

const INK = { light: "#0e1f30", dark: "#fbfaf8", monoBlack: "#000000", monoWhite: "#ffffff" };
const ACCENT = { light: "#b4823c", dark: "#c6934a" }; // site token only — no colour inside the logo

/* ── Wordmark: FELDRONE — cap 96u, stem 24u, 45° chamfers 24u/void 8u ─────
  Every wall, bar and counter on the 8u grid; counters are exactly 24u
  deep — same as the strokes (the mark’s “ink = air” law, set in type). */
const CAP = 104; // 13g — cap 96 cannot seat three 24u walls and two 16u gaps on the grid; 104 can
const T = 24;
const G8 = (v) => { if (v % 8 !== 0) throw new Error(`off-grid: ${v}`); return v; };

const WORD = [
  { w: G8(56), poly: ["M0 0H56V24H24V40H48V64H24V104H0Z"] }, // F
  { w: G8(56), poly: ["M0 0H56V24H24V40H48V64H24V80H56V104H0Z"] }, // E
  { w: G8(48), poly: ["M0 0H24V80H48V104H0Z"] }, // L
  { w: G8(72), poly: ["M0 0H48L72 24V80L48 104H0Z", "M24 24H40L48 32V72L40 80H24Z"] }, // D
  { w: G8(72), poly: ["M0 0H48L72 24V48L48 72H40L72 104H48L24 80V104H0Z", "M24 24H48L56 32V40L48 48H24Z"] }, // R
  { w: G8(72), poly: ["M24 0H48L72 24V80L48 104H24L0 80V24L24 0Z", "M32 24H40L48 32V72L40 80H32L24 72V32L32 24Z"] }, // O
  { w: G8(72), poly: ["M0 0H24L48 80V0H72V104H48L24 24V104H0Z"] }, // N
  { w: G8(56), poly: ["M0 0H56V24H24V40H48V64H24V80H56V104H0Z"] }, // E
];
const GAPS = [24, 24, 24, 24, 16, 24, 24]; // single optical closure at R-O
const ADV = [0];
for (let i = 1; i < WORD.length; i++) ADV.push(ADV[i - 1] + WORD[i - 1].w + GAPS[i - 1]);
const WORD_W = ADV[ADV.length - 1] + WORD[WORD.length - 1].w; // 664

/* ── Lockups: pad 16u everywhere; mark→word clearance 32u (≥ 24u floor) ── */
const H_LOCKUP = { canvas: [16 + 128 + 32 + WORD_W + 16, 160], markT: "translate(16 16)", wordX: 176, wordY: 16 + 128 - CAP }; // baseline-anchored: word baseline = mark ink bottom, both on the 8u grid
const STACKED = {
  canvas: [WORD_W + 32, 16 + 128 + 32 + CAP + 16],
  wordX: 16,
  wordY: 16 + 128 + 32,
}; // 696 × 296
STACKED.markT = `translate(${(STACKED.canvas[0] - GRID.w) / 2} 16)`;

const FAVICON = { canvas: 64, chipRx: 12 }; // micro box 48u in the chip, ink module 12u; rx = one module

/* ── Formatting: integers only — byte-stable by construction ────────────── */
const n = (x) => String(x);
const svgDoc = (viewBox, body) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${body}\n</svg>\n`;

const inkFor = (variant) =>
  variant === "inverted" ? INK.dark : variant === "mono-black" ? INK.monoBlack : variant === "mono-white" ? INK.monoWhite : INK.light;

const markBody = (ink, micro = false) =>
  `<path fill="${ink}" fill-rule="evenodd" d="${micro ? MARK_MICRO_128 : MARK_D}"/>`;

const lockupX = (i) => H_LOCKUP.wordX + ADV[i];
const stackedX = (i) => STACKED.wordX + ADV[i];

const glyphGroup = (xOf, y, ink) =>
  `<g fill="${ink}" fill-rule="evenodd">${WORD.map(
    (g, i) => `<path transform="translate(${n(xOf(i))} ${n(y)})" d="${g.poly.join(" ")}"/>`,
  ).join("")}</g>`;

const lockupSvg = (kind, variant) => {
  const ink = inkFor(variant);
  const spec = kind === "horizontal" ? H_LOCKUP : STACKED;
  const w = n(spec.canvas[0]);
  const h = n(spec.canvas[1]);
  const bg = variant === "inverted" ? `<rect width="${w}" height="${h}" fill="${INK.light}"/>` : "";
  const xOf = kind === "horizontal" ? lockupX : stackedX;
  const t = kind === "horizontal" ? H_LOCKUP.markT : spec.markT;
  return svgDoc(`0 0 ${w} ${h}`, `${bg}<g transform="${t}">${markBody(ink)}</g>${glyphGroup(xOf, spec.wordY, ink)}`);
};

const symbolSvg = (variant, micro = false) => {
  const ink = inkFor(variant);
  const bg = variant === "inverted" ? `<rect width="${n(GRID.w)}" height="${n(GRID.h)}" fill="${INK.light}"/>` : "";
  return svgDoc(`0 0 ${n(GRID.w)} ${n(GRID.h)}`, bg + markBody(ink, micro));
};

/* SMALL ICON / MICRO deliverables: chip = favicon artwork (navy ground,
   paper blocks, rx on the module grid); mono-black for light grounds. */
const iconSvg = (kind) => {
  const body = `<path fill="${kind === "mono-black" ? INK.monoBlack : INK.dark}" fill-rule="evenodd" d="${MICRO_64}"/>`;
  if (kind === "mono-black") return svgDoc("0 0 64 64", body);
  return svgDoc(`0 0 64 64`, `<rect width="64" height="64" rx="${n(FAVICON.chipRx)}" fill="${INK.light}"/>${body}`);
};

const faviconSvg = () => iconSvg("chip");

// Construction sheet: the lockup with its generator rules drawn under it.
const geoSvg = () => {
  const m = H_LOCKUP.markT;
  const construction =
    `<g transform="${m}"><g fill="none" stroke="#d67d2e" stroke-width="1" opacity="0.85">` +
    `<line x1="0" y1="32" x2="128" y2="32"/><line x1="0" y1="64" x2="128" y2="64"/>` +
    `<line x1="0" y1="96" x2="128" y2="96"/>` + // void rails
    `<line x1="32" y1="0" x2="32" y2="128"/><line x1="64" y1="0" x2="64" y2="128"/>` + // channel faces
    `<line x1="80" y1="64" x2="64" y2="48"/><line x1="64" y1="112" x2="80" y2="96"/>` + // 45° chamfers
    `</g></g>` +
    `<g fill="none" stroke="#d67d2e" stroke-width="1" opacity="0.85">` +
    `<line x1="0" y1="${n(H_LOCKUP.wordY)}" x2="${n(H_LOCKUP.canvas[0])}" y2="${n(H_LOCKUP.wordY)}"/>` + // cap line
    `<line x1="0" y1="${n(H_LOCKUP.wordY + CAP)}" x2="${n(H_LOCKUP.canvas[0])}" y2="${n(H_LOCKUP.wordY + CAP)}"/>` + // baseline
    `<line x1="176" y1="0" x2="176" y2="${n(H_LOCKUP.canvas[1])}"/>` + // word start
    `<line x1="${n(16 + 128)}" y1="0" x2="${n(16 + 128)}" y2="${n(H_LOCKUP.canvas[1])}"/>` + // mark right ink
    `</g>`;
  const grid = `<g stroke="#b9c2cf" stroke-width="1" fill="none"><line x1="0" y1="${n(H_LOCKUP.canvas[1])}" x2="${n(H_LOCKUP.canvas[0])}" y2="${n(H_LOCKUP.canvas[1])}"/></g>`;
  const caption =
    `<text x="8" y="184" font-family="DejaVu Sans" font-size="11" fill="#7c8798">grid g=8u · module M=32u · mark 4M square, ink = void = M · 45° only non-right angle (chamfers M/2 on the shelves, 24u/8u on D/O/R) · word cap 96 / stem 24 = counter depth 24 · kerning 24, R-O 16 · mark→word clearance 32 (≥ 24 floor) · MICRO deletes the chamfers and nothing else</text>`;
  return svgDoc(
    `0 0 ${n(H_LOCKUP.canvas[0])} 192`,
    grid + `<g transform="${m}">${markBody(INK.light)}</g>` + glyphGroup(lockupX, H_LOCKUP.wordY, INK.light) + construction + caption,
  );
};

// Standalone wordmark: viewBox frames the full ink box (8u breathing).
const wordmarkSvg = (ink) =>
  svgDoc(
    `0 0 ${n(WORD_W + 16)} ${n(CAP + 16)}`,
    `<g fill="${ink}" fill-rule="evenodd" transform="translate(8 8)">${WORD.map(
      (g, i) => `<path transform="translate(${n(ADV[i])} 0)" d="${g.poly.join(" ")}"/>`,
    ).join("")}</g>`,
  );

/** Data module consumed by src/components/Logo.tsx — one source, no drift. */
const lockupData = {
  width: H_LOCKUP.canvas[0],
  height: H_LOCKUP.canvas[1],
  markTransform: H_LOCKUP.markT,
  glyphs: WORD.map((g, i) => ({ d: g.poly.join(" "), x: lockupX(i), y: H_LOCKUP.wordY })),
};
const stackedData = {
  width: STACKED.canvas[0],
  height: STACKED.canvas[1],
  markTransform: STACKED.markT,
  glyphs: WORD.map((g, i) => ({ d: g.poly.join(" "), x: stackedX(i), y: STACKED.wordY })),
};

const brandmarkTs = `/** GENERATED by scripts/brand-gen.mjs — do not edit by hand (npm run brand:gen). */\nexport type BrandGlyph = { d: string; x: number; y: number };\n\nexport type BrandLockup = {\n  width: number;\n  height: number;\n  markTransform?: string;\n  glyphs: BrandGlyph[];\n};\n\nexport type BrandData = {\n  canvas: { w: number; h: number };\n  lockup: BrandLockup;\n  stacked: BrandLockup;\n  colors: {\n    light: string;\n    dark: string;\n    monoBlack: string;\n    monoWhite: string;\n  };\n  mark: string;\n};\n\nexport const BRAND: BrandData = ${JSON.stringify(
  {
    canvas: { w: GRID.w, h: GRID.h },
    lockup: lockupData,
    stacked: stackedData,
    colors: { ...INK },
    mark: MARK_D,
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
  "public/brand/fel-drone-symbol-micro.svg": symbolSvg("ink", true),
  "public/brand/fel-drone-symbol-micro-inverted.svg": symbolSvg("inverted", true),
  "public/brand/fel-drone-icon-64.svg": iconSvg("chip"),
  "public/brand/fel-drone-icon-64-mono-black.svg": iconSvg("mono-black"),
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
