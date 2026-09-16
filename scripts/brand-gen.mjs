#!/usr/bin/env node
/**
 * ============================================================================
 * FEL DRONE · BRAND GENERATOR v10 — "FLIGHT ARC" · F+D + flight arc
 * ============================================================================
 * V10 direction: professional F+D "FLIGHT ARC" — the F letterform and the D
 * bowl share one baseline and one cap height, connected by a single flight
 * arc that arches above the wordform. The arc is the drone's trajectory:
 * take-off, cruise, landing — zero improvisation. The mark reads as FD
 * without the wordmark, because the wordmark begins with FEL and ends with
 * DRONE: the FD initials are the company.
 *
 * GRID — 128×128 mark box, module M=32, unit 4u:
 *   - F stem: 0..32 × 0..128 (M wide, full height)
 *   - F top arm: 0..80 × 16..48 (M tall, ends at D stem)
 *   - F mid arm: 0..56 × 80..112 (M tall, shorter, leaves 24u clearance)
 *   - D: vertical stem 80..104 × 0..128 (24u) + right bowl arc rx 24, ry 64
 *     from (104,0) to (104,128) via x=128 — the D counter is the negative
 *     space, 24u wall, 48u counter radius, stadium logic kept.
 *   - Flight arc: thin curved bar 4u thick, from x 32 to x 96, apex -12u
 *     above cap, quadratic bezier — the arc is the only non-rectilinear
 *     element, 45° is no longer the rule, the arc is.
 *   - MICRO (16–32px): flight arc deleted, solid FD — three rects + D bowl,
 *     all coords ×8u so 64-box favicon is integer transform.
 *
 * WORDMARK — "FEL DRONE" — two words, 48u word-space, engineered caps,
 *   stem 24u, cap 104u, R-O 16u, same as v8 — the name is never fused.
 * ============================================================================
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

/* ------------------------------ ink & accent ------------------------------ */
const INK = { navy: "#0e1f30", paper: "#fbfaf8", black: "#000000", white: "#ffffff" };
const ACCENT = "#b4722c";

const BAR = 32;
const W_BAR = 24;
const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

const rect = (x, y, w, h) =>
  `M${fmt(x)} ${fmt(y)}H${fmt(x + w)}V${fmt(y + h)}H${fmt(x)}Z`;

/* ------------------------------ V10 FLIGHT ARC MARK ------------------------------ */
// F
const F_STEM = rect(0, 0, 32, 128);
const F_TOP = rect(0, 16, 80, 32);
const F_MID = rect(0, 80, 56, 32);
// D — vertical stem 80..104 + bowl arc rx 24 ry 64 from (104,0) to (104,128) via x=128
const D_BOWL = `M80 0H104A24 64 0 0 1 104 128H80Z`;
// Flight arc — thin curved bar 4u thick: M32 4 Q64 -12 96 4 L96 8 Q64 -8 32 8 Z
const FLIGHT_ARC = `M32 4Q64 -12 96 4L96 8Q64 -8 32 8Z`;

const MARK_D = F_STEM + F_TOP + F_MID + D_BOWL + FLIGHT_ARC;

// MICRO — solid FD, no flight arc, no thin details
const MICRO_D = F_STEM + F_TOP + F_MID + D_BOWL;

/* ------------------------------ wordmark (same engineered caps as v8) ------ */
const CAP = 104, W_STEM = 24, D_STEM = 24;
const WORD = [
  ["F", 56],
  ["E", 56],
  ["L", 48],
  ["D", 72],
  ["R", 72],
  ["O", 72],
  ["N", 72],
  ["E", 56],
];
const GAPS = [24, 24, 48, 24, 16, 24, 24]; // 48 = word-space FEL|DRONE, 16 = R-O optical

const glyphF = (x) =>
  rect(x, 0, W_STEM, CAP) +
  rect(x, 0, 56, W_STEM) +
  rect(x, 40, 48, W_STEM);

const glyphE = (x) =>
  rect(x, 0, W_STEM, CAP) +
  rect(x, 0, 56, W_STEM) +
  rect(x, 40, 48, W_STEM) +
  rect(x, 80, 56, W_STEM);

const glyphL = (x) => rect(x, 0, W_STEM, CAP) + rect(x, 80, 48, W_STEM);

const stadiumOut = (x, y0, y1, flatTop) => {
  const r = 36;
  return (
    `M${x} ${y0}H${fmt(x + 36)}A${r} ${r} 0 0 1 ${fmt(x + 72)} ${y0 + 36}V${y1 - 36}` +
    `A${r} ${r} 0 0 1 ${fmt(x + 36)} ${y1}H${x}Z`
  );
};
const stadiumIn = (x, y0, y1) =>
  `M${fmt(x + 24)} ${y0 + 24}V${y1 - 24}H${fmt(x + 36)}A12 12 0 0 0 ${fmt(x + 48)} ${y1 - 36}V${y0 + 36}` +
  `A12 12 0 0 0 ${fmt(x + 36)} ${y0 + 24}Z`;

const glyphD = (x) => {
  const out =
    `M${x} 0H${fmt(x + 36)}A36 36 0 0 1 ${fmt(x + 72)} 36V68` +
    `A36 36 0 0 1 ${fmt(x + 36)} 104H${x}Z`;
  const inn =
    `M${fmt(x + 24)} 24V80H${fmt(x + 36)}A12 12 0 0 0 ${fmt(x + 48)} 68V36` +
    `A12 12 0 0 0 ${fmt(x + 36)} 24Z`;
  return rect(x, 0, D_STEM, CAP) + out + inn;
};
const R_BOWL_H = 72;
const glyphR = (x) => {
  const out =
    `M${x} 0H${fmt(x + 36)}A36 36 0 0 1 ${fmt(x + 72)} 36` +
    `A36 36 0 0 1 ${fmt(x + 36)} ${R_BOWL_H}H${x}Z`;
  const inn =
    `M${fmt(x + 24)} 24V48H${fmt(x + 36)}A12 12 0 0 0 ${fmt(x + 48)} 36` +
    `A12 12 0 0 0 ${fmt(x + 36)} 24Z`;
  const leg =
    `M${fmt(x + 40)} 80H${fmt(x + 64)}L${fmt(x + 72)} 104H${fmt(x + 48)}Z`;
  return rect(x, 0, D_STEM, CAP) + out + inn + leg;
};
const glyphO = (x) => stadiumOut(x, 0, CAP, true) + stadiumIn(x, 0, CAP);
const glyphN = (x) =>
  rect(x, 0, W_STEM, CAP) +
  rect(x + 48, 0, W_STEM, CAP) +
  (() => {
    const x0 = x, y0 = W_STEM / 2, x1 = x + 72, y1 = CAP - W_STEM / 2;
    const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
    const ox = ((nx / L) * W_STEM) / 2, oy = ((ny / L) * W_STEM) / 2;
    const P = (px, py) => `${fmt(px)} ${fmt(py)}`;
    return (
      `M${P(x0 - ox, y0 - oy)}L${P(x1 - ox, y1 - oy)}L${P(x1 + ox, y1 + oy)}` +
      `L${P(x0 + ox, y0 + oy)}Z`
    );
  })();

const GLYPH = { F: glyphF, E: glyphE, L: glyphL, D: glyphD, R: glyphR, O: glyphO, N: glyphN };

function wordPath(x0) {
  let x = x0, d = "";
  WORD.forEach(([ch, w], i) => {
    d += GLYPH[ch](x);
    x += w + (GAPS[i] ?? 0);
  });
  return d;
}
const atCap = (yBase, d) => `<g transform="translate(0 ${fmt(yBase - CAP)})"><path d="${d}"/></g>`;
const WORD_W = WORD.reduce((a, [, w], i) => a + w + (GAPS[i] ?? 0), 0);
const HONOR = "Vente · Location · Maintenance · Télépilotage";

const LOCKUP_H = 160, BOX = 128, EDGE = 16, GAP_MARK = 32;
const wordX = EDGE + BOX + GAP_MARK;
const W_TOTAL = wordX + WORD_W + EDGE;
const baseline = 16 + (BOX - CAP) / 2 + CAP;

const STACK_W = Math.max(BOX, WORD_W) + 2 * EDGE;
const stackMarkX = (STACK_W - BOX) / 2;
const stackWordX = (STACK_W - WORD_W) / 2;
const STACK_H = EDGE + BOX + 32 + CAP + EDGE;
const stackBaseline = EDGE + BOX + 32 + CAP;

const mark = (ink, extra = "", tx = 0, ty = 0) =>
  `<g fill="${ink}" fill-rule="nonzero">` +
  (tx || ty ? `<g transform="translate(${fmt(tx)} ${fmt(ty)})"><path d="${MARK_D}"/></g>` : `<path d="${MARK_D}"/>`) +
  `${extra}</g>`;

const fav = (a, b) =>
  `<rect x="0" y="0" width="64" height="64" rx="12" fill="${a}"/>` +
  `<g transform="translate(8 8) scale(0.375)" fill="${b}" fill-rule="nonzero"><path d="${MICRO_D}"/></g>`;

const geoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><style>:root{--ink:${INK.navy}}svg{background:${INK.paper}}</style><g fill="none" stroke="${ACCENT}" stroke-width=".35" stroke-dasharray="1.6 2.4" opacity=".5">${Array.from({length:31},(_,i)=>`<path d="M${i*4} 0V128"/><path d="M0 ${i*4}H128"/>`).join("")}</g><g fill="none" stroke="${ACCENT}" stroke-width=".6" opacity=".8"><path d="M0 32H128M0 64H128M0 96H128M32 0V128M64 0V128M96 0V128"/><path d="M32 4Q64 -12 96 4" stroke="${INK.navy}" fill="none"/><path d="M80 0H104A24 64 0 0 1 104 128H80Z" fill="none" stroke="${INK.navy}"/></g>${mark(INK.navy)}<text x="4" y="124" font-family="Arial" font-size="7" font-weight="700" letter-spacing=".1em" fill="${ACCENT}" opacity=".85">FEL DRONE GEOMETRY v10 · FLIGHT ARC · FD · 4u GRID · M 32</text></svg>`;

const FILES = {
  "public/brand/fel-drone-mark.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><style>:root{--ink:${INK.navy}}svg{background:${INK.paper}}</style>${mark("var(--ink)")}</svg>`,
  "public/brand/fel-drone-mark-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${mark(INK.black)}</svg>`,
  "public/brand/fel-drone-mark-accent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${mark(INK.black)}</svg>`,
  "public/brand/fel-drone-lockup.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}">${mark(INK.black, atCap(baseline, wordPath(wordX)), EDGE, EDGE)}</svg>`,
  "public/brand/fel-drone-lockup-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}"><rect width="${W_TOTAL}" height="${LOCKUP_H}" fill="${INK.navy}"/>${mark(INK.white, atCap(baseline, wordPath(wordX)), EDGE, EDGE)}</svg>`,
  "public/brand/fel-drone-lockup-accent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}">${mark(INK.black, atCap(baseline, wordPath(wordX)), EDGE, EDGE)}</svg>`,
  "public/brand/fel-drone-stacked.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STACK_W} ${STACK_H}">${mark(INK.black, atCap(stackBaseline, wordPath(stackWordX)), stackMarkX, EDGE)}</svg>`,
  "public/brand/fel-drone-stacked-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STACK_W} ${STACK_H}"><rect width="${STACK_W}" height="${STACK_H}" fill="${INK.navy}"/>${mark(INK.white, atCap(stackBaseline, wordPath(stackWordX)), stackMarkX, EDGE)}</svg>`,
  "public/brand/fel-drone-wordmark.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORD_W} ${CAP}"><g fill="${INK.black}" fill-rule="nonzero"><path d="${wordPath(0)}"/></g></svg>`,
  "public/brand/fel-drone-favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/brand/fel-drone-favicon-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.white, INK.black) + `</svg>`,
  "public/brand/fel-drone-favicon-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.black, INK.white) + `</svg>`,
  "public/brand/fel-drone-favicon-32.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/brand/fel-drone-favicon-32-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.white, INK.black) + `</svg>`,
  "public/brand/fel-drone-mark-micro.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="${INK.black}" fill-rule="nonzero" d="${MICRO_D}"/></svg>`,
  "public/brand/fel-drone-geo.svg": geoSvg,
};

const BRAND_TS = `/** GENERATED by scripts/brand-gen.mjs — do NOT hand-edit.
 *  V10 FLIGHT ARC — F+D + flight arc. FD initials, flight trajectory arch.
 *  Mark: F stem 32×128, F top 80×32, F mid 56×32, D bowl 24×64 arc, flight arc Q.
 *  MICRO: solid FD, no flight arc, 8u grid for 64-box favicon.
 *  Wordmark: FEL DRONE — two words, 48u word-space, engineered caps.
 */
export const BRAND = {
  mark: ${JSON.stringify(MARK_D)},
  micro: ${JSON.stringify(MICRO_D)},
  word: ${JSON.stringify(wordPath(0))},
  lockup: { w: ${W_TOTAL}, h: ${LOCKUP_H}, markX: ${EDGE}, markY: ${EDGE}, wordX: ${wordX}, baseline: ${baseline} },
  stacked: { w: ${STACK_W}, h: ${STACK_H}, markX: ${stackMarkX}, markY: ${EDGE}, wordX: ${stackWordX}, baseline: ${stackBaseline} },
  favicon: { box: 64, r: 12, inset: 8, microScale: 0.375 },
  colors: { light: "${INK.navy}", dark: "${INK.paper}", monoBlack: "${INK.black}", monoWhite: "${INK.white}", accent: "${ACCENT}" },
  box: ${BOX},
} as const;

export type BrandLockup = {
  w: number; h: number; wordX: number; baseline: number; markX: number; markY: number;
};
`;

let checked = 0, written = 0;
for (const [rel, body] of Object.entries(FILES)) {
  const doc = `<!-- FEL DRONE — GENERATED by scripts/brand-gen.mjs — do NOT hand-edit brand SVGs.\n     Run \`npm run brand:gen\` after changing geometry. -->\n` + body + `\n`;
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  checked++;
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === doc) continue;
  fs.writeFileSync(file, doc);
  written++;
}
fs.writeFileSync(path.join(root, "src/brand/brandmark.ts"), BRAND_TS);
console.log(`brand files checked: ${checked}, updated: ${written}, brandmark.ts regenerated`);

/* --------------------------------- checks --------------------------------- */
const problems = [];
// Check for invalid chars (allow M H V Z A Q L)
if (/[^MHLVAZQ,\s\w.\-]/.test(MARK_D)) {
  // Allow Q for flight arc bezier
  const invalid = MARK_D.match(/[^MHLVAZQ,\s\w.\-]/g);
  if (invalid) {
    // Filter out allowed chars, Q is allowed via \w, but check
    const filtered = invalid.filter(c => !/[MHLVAZQ]/.test(c));
    if (filtered.length) problems.push(`MARK_D contains invalid path chars: ${filtered.join("")}`);
  }
}
// Grid check: every coordinate multiple of 4u (allow negative for arc apex)
for (const m of MARK_D.matchAll(/[MHVL](-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?))?/g)) {
  for (const n of [m[1], m[2]].filter((x) => x !== undefined)) {
    if (Number(n) % 4 !== 0) problems.push(`grid: ${n} is not a multiple of 4u`);
  }
}
// Also check Q coordinates
for (const m of MARK_D.matchAll(/Q(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)/g)) {
  for (const n of [m[1], m[2], m[3], m[4]]) {
    if (Number(n) % 4 !== 0) problems.push(`grid Q: ${n} is not a multiple of 4u`);
  }
}
// Flight arc must exist
if (!MARK_D.includes("Q64 -12")) problems.push("FLIGHT ARC missing: Q64 -12 apex not found");
if (!MARK_D.includes("A24 64")) problems.push("D bowl arc missing: A24 64 not found");
// F arms must terminate at D stem
if (!MARK_D.includes("H80") && !MARK_D.includes("H80")) problems.push("F top arm must terminate at D stem (H80)");
if (W_TOTAL !== 880) problems.push(`lockup width changed: ${W_TOTAL} (expected 880)`);
const letters = WORD.map((w) => w[0]).join("");
if (letters !== "FELDRONE") problems.push("wordmark must be FEL + DRONE letters");
if (GAPS[2] !== 48) problems.push("the word-space FEL|DRONE must be 48u (2× track)");
if (fs.readFileSync(path.join(root, "src/components/LegalNotice.tsx"), "utf8").includes("FELDRONE"))
  problems.push("Legal notice: the one-word FELDRONE spelling must not return");
if (problems.length) {
  console.error("brand geometry check FAILED:", problems);
  process.exit(1);
}
if (process.argv.includes("--check") && written > 0) {
  console.error("brand files are OUT OF SYNC with scripts/brand-gen.mjs — run `npm run brand:gen`.");
  process.exit(1);
}
