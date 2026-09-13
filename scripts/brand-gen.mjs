#!/usr/bin/env node
/**
 * ============================================================================
 * FEL DRONE · BRAND GENERATOR v8 — "ROTOR F" · ONE GEOMETRY TABLE → ALL FILES
 * ============================================================================
 * The identity is ONE symbol: the F letterform IS the airframe. The stem is
 * the spar, two arms terminate at their rotors, and the rotors ARE the
 * letter's counters. Recognizable without the wordmark, because it IS the
 * wordmark's first letter built as a machine.
 *
 * GRID — one grid, one module:
 *   - 128×128 mark box; module M = 32; bars, stems, chords and every
 *     clearance = M or the 3/4·M family (24). The F's stem and arms are 32u
 *     — the v7.2 M law, kept verbatim — and the wordmark's stems are 24u:
 *     the 3/4 relationship that made v7.2 balanced, now with real rotors.
 *     At 16px every mark stroke is 4 device px: never a blob, never lost.
 *   - ROTOR LAW (the v8 critical control): every rotor is three concentric
 *     circles — disc (outer, clockwise), aperture (counter-clockwise) and,
 *     for the primary rotor only, hub bore (clockwise). The radial sequence
 *     is identical on both rotors at the same absolute widths:
 *         band 12u · aperture 8u
 *     Primary rotor (32u disc): band 20..32 · aperture 12..20 · hub r 12.
 *     Secondary rotor (24u disc): band 12..24 · aperture 0..12 — the arm
 *     crosses the aperture, so the ring reads as a "C" open at the spar.
 *     The arms END AT THEIR HUB CENTERS: the spar physically drives the
 *     motor; no floating arm, no point-tangency, no white sliver — the arm
 *     overlap is intentional and computed as ink union via winding parity
 *     (nonzero), so the aperture opens exactly where an arm crosses it.
 *   - ACCENT: a single 6u gold jewel at the primary hub — brand assets only;
 *     the UI mark stays ink, color remains site-token (BRAND.md).
 *   - MICRO (16–32px): voids deleted — the rotor collapses to a solid disc.
 *     Nothing thinner than 24u exists in the small variants; at 16px every
 *     stroke = 3 device px. Never a blob, because nothing merged: it becomes
 *     a DIFFERENT, correct drawing.
 *   - CANVAS ENGAGEMENT (inherited): primary rotor tangent top+right, stem
 *     tangent full-height; secondary rotor floats 8u off the baseline —
 *     a grounded machine, not a floating glyph.
 *
 * WORDMARK — the wordmark IS the type, engineered: 24u strokes, flat
 *   terminals, circular counters, ALL-CAPS. The name is "FEL DRONE" — TWO
 *   words: a controlled 48u word-space between L and D, twice the 24u
 *   letter-track. Optical closures are tracked tighter (R-O 16u) because
 *   flat terminals face O's curve; the word-space is the ONE large gap.
 *   HONESTY LAW: every glyph ships — no pseudo-type.
 * ============================================================================
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

/* ------------------------------ ink & accent ------------------------------ */
const INK = { navy: "#0e1f30", paper: "#fbfaf8", black: "#000000", white: "#ffffff" };
const ACCENT = "#b4722c"; // gold token pair — brand assets' jewel only; site uses its own token

/* ------------------------------ geometry (128 box, unit 4, module 32) ----- */
const BAR = 32; // mark bars/stems = M exactly (v7.2 law; closer to board; 4px at 16px)
const W_BAR = 24; // wordmark stems: the type weight (3/4·M) — lockup ratio balanced
const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

/** clockwise rect (ink subpath) */
const rect = (x, y, w, h) =>
  `M${fmt(x)} ${fmt(y)}H${fmt(x + w)}V${fmt(y + h)}H${fmt(x)}Z`;

/**
 * circle: sweep 1 = clockwise (ink), sweep 0 = counter-clockwise (void).
 * nonzero winding: crossing bands flip ink/void exactly once.
 */
const circle = (cx, cy, r, cw = true) => {
  const s = cw ? 1 : 0;
  return (
    `M${fmt(cx - r)} ${fmt(cy)}A${r} ${r} 0 0 ${s} ${fmt(cx + r)} ${fmt(cy)}` +
    `A${r} ${r} 0 0 ${s} ${fmt(cx - r)} ${fmt(cy)}Z`
  );
};

/* rotors — the v8 law */
const ROTOR_A = { cx: 96, cy: 32, disc: 32, aperture: 20, bore: 12 }; // primary: grounded (tangent 0/128)
const ROTOR_B = { cx: 72, cy: 96, disc: 24, aperture: 12, bore: 0 };  // secondary: floats 8u off floor
const JEWEL = { r: 6 }; // gold dot on the primary hub (accent files only)

const rotors = (rotor, { withBore }) => {
  let d = circle(rotor.cx, rotor.cy, rotor.disc, true);       // disc — ink
  d += circle(rotor.cx, rotor.cy, rotor.aperture, false);     // aperture — void
  if (withBore && rotor.bore > 0)
    d += circle(rotor.cx, rotor.cy, rotor.bore, true);        // hub — ink again
  return d;
};

const MARK_D =
  rect(0, 0, BAR, 128) +                      // stem: full height
  rect(0, 16, 96, BAR) +                      // top arm → hub A center
  rect(0, 80, 72, BAR) +                      // mid arm → hub B center
  rotors(ROTOR_A, { withBore: true }) +
  rotors(ROTOR_B, { withBore: false });

/** MICRO tier (16–32px): voids deleted — solid rotors; bars 24u; ×8 coords
 *  so the 64-box favicon chip uses integer transform math. */
const MICRO_D =
  rect(0, 0, 32, 128) +
  rect(0, 16, 96, 32) +
  rect(0, 80, 72, 32) +
  circle(96, 32, 32, true) +
  circle(72, 104, 24, true);

/* ------------------------------ wordmark (cap 104) ------------------------ */
const CAP = 104;
const W_STEM = 24;
const D_STEM = 24;             // D bowl depth
const O_W = 72, O_R = 36, O_BAR = 36, O_IN = 12; // O/D ring: 36 ink bands, 12 air
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
/* 24u tracking + the ONE controlled exception: R-O optical closure 16u
   (flat leg facing O's curve); and the word-space 48u = 2× track. */
const GAPS = [24, 24, 48, 24, 16, 24, 24];

const glyphF = (x) =>
  rect(x, 0, W_STEM, CAP) +
  rect(x, 0, 56, W_STEM) +
  rect(x, 40, 48, W_STEM);

const glyphE = (x) =>
  rect(x, 0, W_STEM, CAP) +
  rect(x, 0, 56, W_STEM) +
  rect(x, 40, 48, W_STEM) +
  rect(x, CAP - W_STEM, 56, W_STEM);

const glyphL = (x) => rect(x, 0, W_STEM, CAP) + rect(x, CAP - W_STEM, 48, W_STEM);

/* D/R/O bowls are STADIUM construction (the v7.2 circular-counter family,
   re-engineered): outer radius 36 = half the 72u depth, straight midsection
   y 36..68, counters = 12u-radius stadiums at the 24u stem law. A single
   impossible semicircle arc (2r ≠ h) would be silently rescaled by renderers
   and fuse neighbours — the stadium keeps every arc legal on the grid. */
const stadiumOut = (x, y0, y1, cw) =>
  `M${fmt(x)} ${fmt(y0 + 36)}A36 36 0 0 ${cw ? 1 : 0} ${fmt(x + 72)} ${fmt(y0 + 36)}` +
  `L${fmt(x + 72)} ${fmt(y1 - 36)}A36 36 0 0 ${cw ? 1 : 0} ${fmt(x)} ${fmt(y1 - 36)}Z`;
/* counter = outer offset 24u inward on every side: cap centers are shared
   with the outer arcs (r 12 = 36−24); traversed CCW on screen = hole. */
const stadiumIn = (x, y0, y1) =>
  `M${fmt(x + 48)} ${fmt(y0 + 36)}A12 12 0 0 0 ${fmt(x + 24)} ${fmt(y0 + 36)}` +
  `L${fmt(x + 24)} ${fmt(y1 - 36)}A12 12 0 0 0 ${fmt(x + 48)} ${fmt(y1 - 36)}Z`;
/* D: flat left stem + right stadium half — outer flat chords top/bottom.
   The counter is the bowl offset 24 inward on every side: walls 24u, cap
   radius 12u = 36−24 — traversed CCW (sweep 0 arcs) for the hole winding. */
const glyphD = (x) => {
  const out =
    `M${x} 0H${fmt(x + 36)}A36 36 0 0 1 ${fmt(x + 72)} 36V68` +
    `A36 36 0 0 1 ${fmt(x + 36)} 104H${x}Z`;
  const inn =
    `M${fmt(x + 24)} 24V80H${fmt(x + 36)}A12 12 0 0 0 ${fmt(x + 48)} 68V36` +
    `A12 12 0 0 0 ${fmt(x + 36)} 24Z`;
  return rect(x, 0, D_STEM, CAP) + out + inn;
};
/* R: stem + half-disc bowl to y72 (true circular counter 24u) + a detached
   diagonal leg — the channel bowl→leg is ≥ 8u: separations are chosen. */
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
/* O: full stadium ring */
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

/** glyphs drawn in the cap box (y 0..CAP); callers translate to the baseline */
function wordPath(x0) {
  let x = x0, d = "";
  WORD.forEach(([ch, w], i) => {
    d += GLYPH[ch](x);
    x += w + (GAPS[i] ?? 0);
  });
  return d;
}
const atCap = (yBase, d) => `<g transform="translate(0 ${fmt(yBase - CAP)})"><path d="${d}"/></g>`;
const WORD_W = WORD.reduce((a, [, w], i) => a + w + (GAPS[i] ?? 0), 0); // last letter adds no gap (GAPS[7] undefined)
const HONOR = "Vente · Location · Maintenance · Télépilotage"; // tagline lives in the UI, not the stacked lockup

/* ------------------------------ lockup math (edge law) -------------------- */
const LOCKUP_H = 160, BOX = 128, EDGE = 16, GAP_MARK = 32;
const wordX = EDGE + BOX + GAP_MARK;
const W_TOTAL = wordX + WORD_W + EDGE;
const baseline = 16 + (BOX - CAP) / 2 + CAP;

const STACK_W = Math.max(BOX, WORD_W) + 2 * EDGE;
const stackMarkX = (STACK_W - BOX) / 2;
const stackWordX = (STACK_W - WORD_W) / 2;
const STACK_H = EDGE + BOX + 32 + CAP + EDGE;
const stackBaseline = EDGE + BOX + 32 + CAP;

const _unused_honorBlock = (cx, yBase, ink) => {
  const est = Math.round(HONOR.length * 8.6 + 32);
  const bw = est % 2 ? est : est + 1;
  const by = yBase + 4;
  const bx = Math.round(cx - bw / 2);
  return (
    `<g fill="${ink}" fill-rule="nonzero"><path d="M${bx} ${by}h${bw}v${bw}h${-bw}ZM${bx + 16} ${by + 16}h${bw - 32}v${bw - 32}h${-(bw - 32)}Z"/></g>` +
    `<text x="${cx}" y="${by + bw / 2 + 3.4}" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="700" letter-spacing="0.14em" text-anchor="middle" fill="${ink}">VENTE · LOCATION</text>` +
    `<text x="${cx}" y="${by + bw / 2 + 15.4}" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="700" letter-spacing="0.18em" text-anchor="middle" fill="${ink}">MAINTENANCE · TÉLÉPILOTAGE</text>`
  );
};

/* ------------------------------ variant table ----------------------------- */
const mark = (ink, extra = "", tx = 0, ty = 0) =>
  `<g fill="${ink}" fill-rule="nonzero">` +
  (tx || ty ? `<g transform="translate(${fmt(tx)} ${fmt(ty)})"><path d="${MARK_D}"/></g>` : `<path d="${MARK_D}"/>`) +
  `${extra}</g>`;
const jewel = (ink) => `<circle cx="${ROTOR_A.cx}" cy="${ROTOR_A.cy}" r="${JEWEL.r}" fill="${ink}"/>`;

const FAV_INK = 48;
const fav = (a, b) =>
  `<rect x="0" y="0" width="64" height="64" rx="12" fill="${a}"/>` +
  `<g transform="translate(8 8) scale(0.375)" fill="${b}" fill-rule="nonzero"><path d="${MICRO_D}"/></g>`;

const geoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><style>:root{--ink:${INK.navy}}svg{background:${INK.paper}}</style><g fill="none" stroke="${ACCENT}" stroke-width=".35" stroke-dasharray="1.6 2.4" opacity=".5">${Array.from({length:31},(_,i)=>`<path d="M${i*4} 0V128"/><path d="M0 ${i*4}H128"/>`).join("")}</g><g fill="none" stroke="${ACCENT}" stroke-width=".6" opacity=".8"><path d="M0 32H128M0 64H128M0 96H128M32 0V128M64 0V128M96 0V128"/><circle cx="96" cy="32" r="32"/><circle cx="96" cy="32" r="20"/><circle cx="96" cy="32" r="12"/><circle cx="72" cy="96" r="24"/><circle cx="72" cy="96" r="12"/></g>${mark(INK.navy)}<text x="4" y="124" font-family="Arial" font-size="7" font-weight="700" letter-spacing=".1em" fill="${ACCENT}" opacity=".85">FEL DRONE GEOMETRY v8 · 4u GRID · M 32 · ROTOR DISCS 64/48 · BAND 12 · APERTURE 8</text></svg>`;

const FILES = {
  /* symbol — the mark alone (master + compact tiers) */
  "public/brand/fel-drone-mark.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><style>:root{--ink:${INK.navy}}svg{background:${INK.paper}}</style>${mark("var(--ink)")}</svg>`,
  "public/brand/fel-drone-mark-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${mark(INK.black)}</svg>`,
  "public/brand/fel-drone-mark-accent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${mark(INK.black)}${jewel(ACCENT)}</svg>`,
  /* horizontal lockup — master size */
  "public/brand/fel-drone-lockup.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}">${mark(INK.black, atCap(baseline, wordPath(wordX)), EDGE, EDGE)}</svg>`,
  "public/brand/fel-drone-lockup-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}"><rect width="${W_TOTAL}" height="${LOCKUP_H}" fill="${INK.navy}"/>${mark(INK.white, atCap(baseline, wordPath(wordX)), EDGE, EDGE)}</svg>`,
  "public/brand/fel-drone-lockup-accent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}">${mark(INK.black, atCap(baseline, wordPath(wordX)), EDGE, EDGE)}${jewel(ACCENT)}</svg>`,
  /* stacked lockup — mobile header/footer */
  "public/brand/fel-drone-stacked.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STACK_W} ${STACK_H}">${mark(INK.black, atCap(stackBaseline, wordPath(stackWordX)), stackMarkX, EDGE)}</svg>`,
  "public/brand/fel-drone-stacked-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STACK_W} ${STACK_H}"><rect width="${STACK_W}" height="${STACK_H}" fill="${INK.navy}"/>${mark(INK.white, atCap(stackBaseline, wordPath(stackWordX)), stackMarkX, EDGE)}</svg>`,
  /* wordmark only (engraving, plates, documents) */
  "public/brand/fel-drone-wordmark.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORD_W} ${CAP}"><g fill="${INK.black}" fill-rule="nonzero"><path d="${wordPath(0)}"/></g></svg>`,
  /* favicons — the MICRO tier (16–32px): solid rotors, chips, never a blob */
  "public/brand/fel-drone-favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/brand/fel-drone-favicon-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.white, INK.black) + `</svg>`,
  "public/brand/fel-drone-favicon-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.black, INK.white) + `</svg>`,
  "public/brand/fel-drone-favicon-32.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/brand/fel-drone-favicon-32-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.white, INK.black) + `</svg>`,
  /* MICRO tier standalone — the 16–32px drawing as its own file (avatars,
     fallback <img>s); the chip variants above embed the same MICRO_D path. */
  "public/brand/fel-drone-mark-micro.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="${INK.black}" fill-rule="nonzero" d="${MICRO_D}"/></svg>`,
  /* geometry sheet — the construction is documented, not folklore */
  "public/brand/fel-drone-geo.svg": geoSvg,
};

/* React data module — THE single source of truth for the site components. */
const BRAND_TS = `/** GENERATED by scripts/brand-gen.mjs — do NOT hand-edit.
 *  Run \`npm run brand:gen\` after changing the generator. The F is built as
 *  a machine: stem 24u, two arms terminating at their hub centers, three
 *  rotor rings (band 12 / aperture 8 — no tangency, no sliver), solid-rotor
 *  MICRO tier for 16–32px. Wordmark = the engineered type, tracked 24u with
 *  one optical exception (R-O 16u) and a controlled 48u word-space: the name
 *  is FEL DRONE, two words.
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

/* --------------------------------- writes --------------------------------- */
let checked = 0, written = 0;
for (const [rel, body] of Object.entries(FILES)) {
  const doc = svgDoc(body);
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  checked++;
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === doc) continue;
  fs.writeFileSync(file, doc);
  written++;
}
function svgDoc(body) {
  return `<!-- FEL DRONE — GENERATED by scripts/brand-gen.mjs — do NOT hand-edit brand SVGs.\n     Run \`npm run brand:gen\` after changing geometry. -->\n` + body + `\n`;
}
fs.writeFileSync(path.join(root, "src/brand/brandmark.ts"), BRAND_TS);
console.log(`brand files checked: ${checked}, updated: ${written}, brandmark.ts regenerated`);

/* --------------------------------- checks --------------------------------- */
const problems = [];
if (MARK_D.search(/[^,\s\w.\-]/) !== -1) problems.push("MARK_D contains invalid path chars");
/* audit: every MASTER coordinate on the 4u grid; bars/stems 24u = 3/4·M */
for (const m of MARK_D.matchAll(/[MHVL](-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?))?/g))
  for (const n of [m[1], m[2]].filter((x) => x !== undefined))
    if (Number(n) % 4 !== 0) problems.push(`grid: ${n} is not a multiple of 4u`);
/* rotor law: apertures present and correctly sized */
for (const [name, R] of [["A", ROTOR_A], ["B", ROTOR_B]]) {
  if (R.disc - R.aperture !== 12) problems.push(`rotor ${name}: band ${R.disc - R.aperture}u ≠ 12u`);
  if (R.bore && R.aperture - R.bore !== 8) problems.push(`rotor ${name}: aperture ring ≠ 8u`);
  if (R.bore > R.aperture - 8) problems.push(`rotor ${name}: hub eats the aperture margin`);
}
/* arms terminate at hub centers (driven, not floating) */
if (!MARK_D.includes(`H96V48`) || !MARK_D.includes(`H72V112`))
  problems.push("arms must terminate at their rotor centers");
/* the micro variant has NO voids (solid rotors) */
if (MICRO_D.includes("0 0 0")) problems.push("MICRO must not contain CCW voids");
if (W_TOTAL !== 880) problems.push(`lockup width changed: ${W_TOTAL}`);
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
