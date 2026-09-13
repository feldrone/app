#!/usr/bin/env node
/**
 * FELDRONE — brand lab, in-repo (identity v7.0 "THE VANE").
 *
 * Single geometry source for the entire identity system. Every brand file
 * (public/brand/*.svg, public/favicon.svg) and the React lockup data
 * (src/brand/brandmark.ts) are EMITTED from the table below — never
 * hand-edited (docs/BRAND.md § Updating). Regeneration is deterministic:
 * stable path order, integer-only coordinates, one source of truth.
 *
 * History: v4 provenance · v5 lean · v5.1/5.2 favicon + one word ·
 * v6.0/6.1 FD counter monogram (client pass of 2026-09-13).
 *
 * v7.0 → FULL REDESIGN per client brief of 2026-09-13 ("imagine FELDRONE
 * as a brand founded today; do not improve the old logo"). The mark is a
 * proprietary F built from the one instrument every pilot reads before
 * committing to flight — the windsock: the top arm is a tapered cone with
 * a flat top edge and a rising underside (the vane at rest reads as a
 * letter first, as an instrument second); the mid arm is a shorter,
 * lighter airflow bar; the stem is the mast. No circles, no frames, no
 * aircraft parts, no gradient, no ornament. One weight language: every
 * terminal is cut square, the only diagonals in the system are the two
 * cone undersides (mark + the word's F, which is literally the mark set
 * in the word). The wordmark is custom-drawn: cap 72u, stem 12u, single
 * weight, 45° chamfers on the D and O bowls (altimeter-glass counters),
 * a 14u diagonal R leg, a shortened E midarm, and hand-tuned kerning
 * (16u at the two round-letter pairs, 18u elsewhere). Monochrome first:
 * the whole system is one flat polygon set — it works in black, white,
 * on ink, on paper, at 16 px, before any colour is ever applied.
 *
 * Usage:
 *   node scripts/brand-gen.mjs          # write all files
 *   node scripts/brand-gen.mjs --check  # verify files are in sync (exit 1)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ── The mark: THE VANE — windsock F (icon canvas 136 × 160, all integers) ─
  Stem (mast)      x 16..40 · y 20..140            (24u wide, 120u tall)
  Cone (top arm)   top edge flat y 20, tip x 120   (base 32u → tip 12u)
                   underside rises 20u over 80u (14°) into a square-cut open end
  Airflow bar      x 40..96 · y 80..96              (16u tall — lighter than the mast)
  Ink box 104 × 120, margins 16/16/20/20. Single clockwise ring, no holes:
  the negative space between cone and bar is the sky the mark flies in. */
const GRID = { w: 136, h: 160 };
const MARK_PTS = [
  [16, 20], [120, 20], [120, 32], [40, 52], [40, 80],
  [96, 80], [96, 96], [40, 96], [40, 140], [16, 140],
];

/* ── Wordmark: FELDRONE — custom monoline-grotesque, cap 72u, stem 12u ────
  The F carries the mark's wedge (tip 12u = the system's own stroke weight);
  E/D/R/O/N are calm, square and chamfered. One ring per glyph; counters are
  even-odd holes. Kerning is hand-set (gaps below), total ink width 484u. */
const CAP = 72;
const T = 12;

// [glyph, width, outline polygon(s)] — polygons as point lists; first = outer.
const G_F = { w: 44, poly: [ [[0,0],[44,0],[44,12],[12,24],[12,40],[36,40],[36,52],[12,52],[12,72],[0,72]] ] };
const G_E = { w: 44, poly: [ [[0,0],[44,0],[44,12],[12,12],[12,30],[38,30],[38,42],[12,42],[12,60],[44,60],[44,72],[0,72]] ] };
const G_L = { w: 40, poly: [ [[0,0],[12,0],[12,60],[40,60],[40,72],[0,72]] ] };
const G_D = { w: 48, poly: [ [[0,0],[36,0],[48,12],[48,60],[36,72],[0,72]],
                            [[12,12],[30,12],[36,18],[36,54],[30,60],[12,60]] ] };
const G_R = { w: 44, poly: [ [[0,0],[32,0],[44,12],[44,24],[34,36],[44,72],[30,72],[20,36],[12,36],[12,72],[0,72]],
                            [[12,12],[32,12],[32,24],[12,24]] ] };
const G_O = { w: 48, poly: [ [[12,0],[36,0],[48,12],[48,60],[36,72],[12,72],[0,60],[0,12]],
                            [[18,12],[30,12],[36,18],[36,54],[30,60],[18,60],[12,54],[12,18]] ] };
const G_N = { w: 48, poly: [ [[0,0],[12,0],[36,44],[36,0],[48,0],[48,72],[36,72],[12,28],[12,72],[0,72]] ] };

const WORD = [G_F, G_E, G_L, G_D, G_R, G_O, G_N, G_E];
const GAPS = [18, 18, 18, 18, 16, 18, 18]; // R-O and O-N optically tightened
const ADV = [0];
for (let i = 1; i < WORD.length; i++) ADV.push(ADV[i - 1] + WORD[i - 1].w + GAPS[i - 1]);
const WORD_W = ADV[ADV.length - 1] + WORD[WORD.length - 1].w; // 484

/* ── Lockups ───────────────────────────────────────────────────────────────
  Horizontal: mark ink right 120 → word starts 148 — a 28u clear space,
  above the ≥ 24u floor set by the v6.1 client correction (no “DFELDRONE”
  misread, ever). Everything on one integer grid: no scaling anywhere in
  the system. Stacked: mark ink centred above the word, 24u rhythm — the
  mobile / constrained-viewport build enforced by Logo.tsx. */
const H_LOCKUP = { canvas: [120 + 28 + WORD_W + 16, 160], wordX: 120 + 28, wordY: (160 - CAP) / 2 };
const STACKED = { canvas: [WORD_W + 32, 16 + 120 + 24 + CAP + 16] };
STACKED.markT = [(STACKED.canvas[0] - GRID.w) / 2, 16 - 20];
STACKED.wordX = (STACKED.canvas[0] - WORD_W) / 2;
STACKED.wordY = 16 + 120 + 24;

/* Favicon / SMALL ICON: the natively-simplified 64u cut (stem 10, cone
  13 → 5, airflow bar 8, gaps ≥ 10 — every feature ≥ 1.2 px at 16 px,
  the taper kept because it IS the silhouette). Chip = site ink. */
const FAVICON = { canvas: 64, chipRx: 14 };
const FAV_PTS = [
  [10, 8], [54, 8], [54, 13], [20, 21], [20, 31],
  [44, 31], [44, 39], [20, 39], [20, 56], [10, 56],
];

const INK = { light: "#0e1f30", dark: "#fbfaf8", monoBlack: "#000000", monoWhite: "#ffffff" };
const ACCENT = { light: "#b4823c", dark: "#c6934a" }; // site token only — no colour inside the logo

/* ── Formatting rules (integer-only since v7 — byte-stable by construction) ─ */
const n = (x) => String(x);
const polyD = (pts) => `M${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}Z`;
const ringD = (polys) => polys.map(polyD).join("");

const MARK_D = ringD([MARK_PTS]);
const FAV_D = ringD([FAV_PTS]);
const glyphD = (g) => ringD(g.poly);

/* ── Emitters ───────────────────────────────────────────────────────────── */
const svgDoc = (viewBox, body) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${body}\n</svg>\n`;

const inkFor = (variant) =>
  variant === "inverted" ? INK.dark : variant === "mono-black" ? INK.monoBlack : variant === "mono-white" ? INK.monoWhite : INK.light;

const markBody = (ink) => `<path fill="${ink}" fill-rule="evenodd" d="${MARK_D}"/>`;

const glyphGroup = (xOf, y, ink) =>
  `<g fill="${ink}" fill-rule="evenodd">${WORD.map((g, i) => `<path transform="translate(${n(xOf(i))} ${n(y)})" d="${glyphD(g)}"/>`).join("")}</g>`;

const lockupX = (i) => H_LOCKUP.wordX + ADV[i];
const stackedX = (i) => STACKED.wordX + ADV[i];

const lockupSvg = (kind, variant) => {
  const ink = inkFor(variant);
  const spec = kind === "horizontal" ? H_LOCKUP : STACKED;
  const w = n(spec.canvas[0]);
  const h = n(spec.canvas[1]);
  const bg = variant === "inverted" ? `<rect width="${w}" height="${h}" fill="${INK.light}"/>` : "";
  const mark =
    kind === "horizontal"
      ? markBody(ink) // mark drawn in its native icon coords — zero transforms
      : `<g transform="translate(${n(STACKED.markT[0])} ${n(STACKED.markT[1])})">${markBody(ink)}</g>`;
  const xOf = kind === "horizontal" ? lockupX : stackedX;
  return svgDoc(`0 0 ${w} ${h}`, bg + mark + glyphGroup(xOf, spec.wordY, ink));
};

const symbolSvg = (variant) => {
  const ink = inkFor(variant);
  const bg = variant === "inverted" ? `<rect width="${n(GRID.w)}" height="${n(GRID.h)}" fill="${INK.light}"/>` : "";
  return svgDoc(`0 0 ${n(GRID.w)} ${n(GRID.h)}`, bg + markBody(ink));
};

/* SMALL ICON deliverables: chip = the favicon artwork (navy ground, paper
   mark); mono-black = transparent ground for light surfaces and print. */
const iconSvg = (kind) => {
  if (kind === "mono-black")
    return svgDoc(`0 0 64 64`, `<path fill="${INK.monoBlack}" fill-rule="evenodd" d="${FAV_D}"/>`);
  return svgDoc(
    `0 0 64 64`,
    `<rect width="64" height="64" rx="${n(FAVICON.chipRx)}" fill="${INK.light}"/><path fill="${INK.dark}" fill-rule="evenodd" d="${FAV_D}"/>`,
  );
};

const faviconSvg = () =>
  svgDoc(
    `0 0 ${n(FAVICON.canvas)} ${n(FAVICON.canvas)}`,
    `<rect width="${n(FAVICON.canvas)}" height="${n(FAVICON.canvas)}" rx="${n(FAVICON.chipRx)}" fill="${INK.light}"/><path fill="${INK.dark}" fill-rule="evenodd" d="${FAV_D}"/>`,
  );

// Construction sheet: the lockup with its generator rules drawn under it.
const geoSvg = () => {
  const g = (inner) => `<g>${inner}</g>`;
  const construction = g(
    `<g fill="none" stroke="#d67d2e" stroke-width="1" opacity="0.85">` +
      `<line x1="0" y1="20" x2="136" y2="20"/>` + // cone top / mark top
      `<line x1="0" y1="32" x2="136" y2="32"/>` + // cone tip underside
      `<line x1="0" y1="52" x2="136" y2="52"/>` + // cone base underside
      `<line x1="0" y1="80" x2="136" y2="80"/><line x1="0" y1="96" x2="136" y2="96"/>` + // airflow bar
      `<line x1="0" y1="140" x2="${n(H_LOCKUP.canvas[0])}" y2="140"/>` + // baseline of the mark
      `<line x1="40" y1="0" x2="40" y2="160"/><line x1="120" y1="0" x2="120" y2="160"/>` + // stem face / tip
      `<line x1="0" y1="${n(H_LOCKUP.wordY)}" x2="${n(H_LOCKUP.canvas[0])}" y2="${n(H_LOCKUP.wordY)}"/>` + // cap line
      `<line x1="0" y1="${n(H_LOCKUP.wordY + CAP)}" x2="${n(H_LOCKUP.canvas[0])}" y2="${n(H_LOCKUP.wordY + CAP)}"/>` + // baseline
      `<line x1="148" y1="0" x2="148" y2="160"/>` + // word start (28u gap)
      `</g>`,
  );
  const grid = `<g stroke="#b9c2cf" stroke-width="1" fill="none"><line x1="0" y1="160" x2="${n(H_LOCKUP.canvas[0])}" y2="160"/></g>`;
  const caption =
    `<text x="8" y="184" font-family="DejaVu Sans" font-size="11" fill="#7c8798">canvas 136 × 160 · integer grid · cone 32u→12u over 80u (14°) · airflow bar 16u · mark→word clear space 28u (≥ 24u floor) · word cap 72 / stem 12 · chamfers 45° 12u outer / 6u inner · kerning 18u, 16u at R-O and O-N</text>`;
  return svgDoc(
    `0 0 ${n(H_LOCKUP.canvas[0])} 192`,
    grid + markBody(INK.light) + glyphGroup(lockupX, H_LOCKUP.wordY, INK.light) + construction + caption,
  );
};

// Standalone wordmark: viewBox frames the full ink box (8u breathing).
const wordmarkSvg = (ink) =>
  svgDoc(
    `0 0 ${n(WORD_W + 16)} ${n(CAP + 16)}`,
    `<g fill="${ink}" fill-rule="evenodd" transform="translate(8 8)">${WORD.map((gl, i) => `<path transform="translate(${n(ADV[i])} 0)" d="${glyphD(gl)}"/>`).join("")}</g>`,
  );

/** Data module consumed by src/components/Logo.tsx — one source, no drift. */
const lockupData = {
  width: H_LOCKUP.canvas[0],
  height: H_LOCKUP.canvas[1],
  glyphs: WORD.map((gl, i) => ({ d: glyphD(gl), x: lockupX(i), y: H_LOCKUP.wordY })),
};
const stackedData = {
  width: STACKED.canvas[0],
  height: STACKED.canvas[1],
  markTransform: `translate(${n(STACKED.markT[0])} ${n(STACKED.markT[1])})`,
  glyphs: WORD.map((gl, i) => ({ d: glyphD(gl), x: stackedX(i), y: STACKED.wordY })),
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
