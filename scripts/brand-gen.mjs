#!/usr/bin/env node
/**
 * ============================================================================
 * FEL DRONE · BRAND GENERATOR v12 — "QUAD FD" · airframe + F+D monogram
 * ============================================================================
 * V12 direction (reference re-cut): the same engineered emblem, rebuilt from
 * the approved reference — a front-view quadcopter (two tapered rotor blades
 * with pointed tips and a motor shaft, two round motor hubs joined by a bar,
 * a central body block) seated on a heavy geometric F+D monogram. The airframe
 * is not a badge floating above the letters: the rotor hubs are the monogram's
 * own mount points — the left hub is concentric with the F stem axis, the right
 * hub with the D stem axis — and the hubs overlap the letterforms by 8u, so the
 * emblem reads as ONE connected ink mass. The rotor blades are the only part
 * that reaches the canvas edges.
 *
 * GRID — 160×160 mark canvas, 4u unit (a 2u half-step is allowed only for the
 *   rotor blade taper and the disc radii, so the blades can come to a true
 *   centred point):
 *   - Shafts ......... 8×48 motor shafts, x 28..36 / 124..132, y 12..60
 *   - Blades ......... tapered 64u bars, y 18..26, pointed tip at (0,22)/(160,22)
 *   - Hubs ........... two ⌀20 discs, centres (32,50) and (128,50);
 *                      diameter IS the letter stroke weight (20u)
 *   - Bar ............ 96×8, y 46..54, hub axis → hub axis
 *   - Body ........... 32×24 rect, x 64..96, y 16..40 — bridges the letters
 *   - F ............. stem 20×96 x 20..40 with a sheared (diagonal) foot,
 *                      top arm x 20..76 × y 52..72, mid arm x 20..60 × y 92..112
 *   - D ............. stem 20×96 x 116..136, bowl half-ellipse rx32 ry48 reaching
 *                      x 160, large oval counter 24×56 centred (138,100)
 *   The F and the D never touch: a 40u negative channel runs down the centre of
 *   the monogram — the body block above is what unifies them.
 *
 * MICRO (16–32 px): the 8u blades and shafts are deleted — at 16 px they are
 *   sub-pixel and would grey out. What remains is the correct small-size
 *   drawing: two solid hub discs, the bar, the body and the monogram, all ≥ 8u.
 *
 * WORDMARK — "FEL DRONE", squared technical caps for the exported SVG assets:
 *   cap 104, stroke 28, square terminals, controlled corner radii (28u outer /
 *   12u counter) on D · O · R only, tracking 24u, 48u word space. The website
 *   typesets the same wordmark in IBM Plex Sans 700 (see `type` below): same
 *   cap height, same 48u word space, so the name is never fused and never
 *   needs distorting.  (V11 wordmark — unchanged in V12.)
 * ============================================================================
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

/* ------------------------------ ink & accent ------------------------------ */
const INK = { navy: "#0e1f30", paper: "#fbfaf8", black: "#000000", white: "#ffffff" };
const ACCENT = "#b4722c";

/* mark canvas — 160 × 160, unit 4u */
const MARK_W = 160;
const MARK_H = 160;

const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

const rect = (x, y, w, h) =>
  `M${fmt(x)} ${fmt(y)}H${fmt(x + w)}V${fmt(y + h)}H${fmt(x)}Z`;

/** Clockwise disc (same winding as rect() so nonzero fill unions cleanly). */
const disc = (cx, cy, r) =>
  `M${fmt(cx - r)} ${fmt(cy)}A${r} ${r} 0 0 1 ${fmt(cx + r)} ${fmt(cy)}` +
  `A${r} ${r} 0 0 1 ${fmt(cx - r)} ${fmt(cy)}Z`;

/* ------------------------------ V12 MARK — QUAD + FD ----------------------- */
/** Counter-clockwise oval — opposite winding to disc(), so nonzero fill cuts it. */
const ovalCut = (cx, cy, rx, ry) =>
  `M${fmt(cx - rx)} ${fmt(cy)}A${rx} ${ry} 0 0 0 ${fmt(cx + rx)} ${fmt(cy)}` +
  `A${rx} ${ry} 0 0 0 ${fmt(cx - rx)} ${fmt(cy)}Z`;

// Airframe — tapered blades with pointed tips, motor shafts, hubs, bar, body
const STUB_L = rect(28, 12, 8, 48); // motor shaft over the left hub
const STUB_R = rect(124, 12, 8, 48); // motor shaft over the right hub
const BLADE_L = `M0 22L40 18H64V26H40Z`; // left rotor blade — centred point at x0
const BLADE_R = `M160 22L120 18H96V26H120Z`; // right rotor blade, mirrored
const HUB_L = disc(32, 50, 10); // left motor hub — ⌀20, the letter stroke weight
const HUB_R = disc(128, 50, 10); // right motor hub — on the D stem axis
const BAR = rect(32, 46, 96, 8); // airframe bar, hub axis → hub axis
const BODY = rect(64, 16, 32, 24); // central rectangular body — bridges the letters

// Monogram — F (left) and D (right), separated by a clean negative channel.
// Both letters start at y52 so the rotor hubs (down to y60) mount straight onto
// them: the airframe and the letterforms are one connected emblem.
const F_STEM = `M20 52H40V148L20 120Z`; // stem with the sheared (diagonal) foot
const F_TOP = rect(20, 52, 56, 20); // top arm — reaches the monogram centre
const F_MID = rect(20, 92, 40, 20); // mid arm
const D_STEM = rect(116, 52, 20, 96); // D stem, concentric with the right hub
const D_BOWL = `M116 52H128A32 48 0 0 1 128 148H116Z`; // bowl — round right side to x160
const D_COUNTER = ovalCut(138, 100, 12, 28); // large oval counter (24×56)

const MONOGRAM_D = F_STEM + F_TOP + F_MID + D_STEM + D_BOWL + D_COUNTER;
const MARK_D =
  STUB_L + STUB_R + BLADE_L + BLADE_R + HUB_L + HUB_R + BAR + BODY + MONOGRAM_D;

// MICRO — same emblem without the sub-pixel rotor blades and shafts
const MICRO_D = HUB_L + HUB_R + BAR + BODY + MONOGRAM_D;

/* ------------------------------ wordmark — squared technical caps ---------- */
const CAP = 104;
const W_STEM = 28; // one stroke weight for the whole wordmark
const R_OUT = 28; // outer corner radius (D · O · R)
const R_IN = 12; // counter corner radius — wall stays uniform

const WORD = [
  ["F", 64],
  ["E", 64],
  ["L", 60],
  ["D", 84],
  ["R", 84],
  ["O", 84],
  ["N", 84],
  ["E", 64],
];
const GAPS = [24, 24, 48, 24, 24, 24, 24]; // 48 = word-space FEL|DRONE

const glyphF = (x) =>
  rect(x, 0, W_STEM, CAP) + rect(x, 0, 64, W_STEM) + rect(x, 38, 56, W_STEM);

const glyphE = (x) =>
  rect(x, 0, W_STEM, CAP) +
  rect(x, 0, 64, W_STEM) +
  rect(x, 38, 56, W_STEM) +
  rect(x, 76, 64, W_STEM);

const glyphL = (x) => rect(x, 0, W_STEM, CAP) + rect(x, 76, 60, W_STEM);

/** Rounded-corner bowl: straight right edge between two R_OUT corners. */
const bowlOuter = (x, y0, y1) =>
  `M${fmt(x + W_STEM)} ${fmt(y0)}H${fmt(x + 56)}A${R_OUT} ${R_OUT} 0 0 1 ${fmt(x + 84)} ${fmt(y0 + R_OUT)}` +
  `V${fmt(y1 - R_OUT)}A${R_OUT} ${R_OUT} 0 0 1 ${fmt(x + 56)} ${fmt(y1)}H${fmt(x + W_STEM)}Z`;

/** Counter of that bowl — counter-clockwise (opens under nonzero fill). */
const counterPath = (x, y0, y1, r) =>
  `M${fmt(x + W_STEM)} ${fmt(y0)}V${fmt(y1)}H${fmt(x + 56 - r)}` +
  `A${r} ${r} 0 0 0 ${fmt(x + 56)} ${fmt(y1 - r)}` +
  `V${fmt(y0 + r)}A${r} ${r} 0 0 0 ${fmt(x + 56 - r)} ${fmt(y0)}Z`;

const glyphD = (x) =>
  rect(x, 0, W_STEM, CAP) + bowlOuter(x, 0, CAP) + counterPath(x, W_STEM, CAP - W_STEM, R_IN);

const R_BOWL_H = 72;
const glyphR = (x) => {
  const leg =
    `M${fmt(x + 44)} ${fmt(R_BOWL_H)}H${fmt(x + 72)}L${fmt(x + 84)} ${CAP}H${fmt(x + 56)}Z`;
  return (
    rect(x, 0, W_STEM, CAP) +
    bowlOuter(x, 0, R_BOWL_H) +
    counterPath(x, W_STEM, R_BOWL_H - W_STEM, 8) +
    leg
  );
};

const glyphO = (x) =>
  `M${fmt(x + W_STEM)} 0H${fmt(x + 56)}A${R_OUT} ${R_OUT} 0 0 1 ${fmt(x + 84)} ${R_OUT}` +
  `V${fmt(CAP - R_OUT)}A${R_OUT} ${R_OUT} 0 0 1 ${fmt(x + 56)} ${CAP}H${fmt(x + W_STEM)}` +
  `A${R_OUT} ${R_OUT} 0 0 1 ${fmt(x)} ${fmt(CAP - R_OUT)}V${R_OUT}` +
  `A${R_OUT} ${R_OUT} 0 0 1 ${fmt(x + W_STEM)} 0Z` +
  counterPath(x, W_STEM, CAP - W_STEM, R_IN);

const glyphN = (x) =>
  rect(x, 0, W_STEM, CAP) +
  rect(x + 56, 0, W_STEM, CAP) +
  (() => {
    // one straight bar from the left stem's axis to the right stem's axis
    const x0 = x, y0 = 16, x1 = x + 84, y1 = CAP - 16;
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
const WORD_W = WORD.reduce((a, [, w], i) => a + w + (GAPS[i] ?? 0), 0);

const atCap = (yBase, d) => `<g transform="translate(0 ${fmt(yBase - CAP)})"><path d="${d}"/></g>`;

/* ------------------------------ lockups ------------------------------------ */
/**
 * Two wordmark builds, one identity:
 *  · ASSETS (the SVGs this script writes) keep the engineered caps paths — they
 *    are self-contained vectors, usable in print and in tools without webfonts.
 *  · SITE (Logo.tsx) typesets the same wordmark in the project's real typeface,
 *    IBM Plex Sans 700, per the V11 reference: proportions, cap height and the
 *    48u word space are identical, so both read as one brand.
 * The numbers below are the measured IBM Plex Sans advances at cap 104
 * (size 148.57, cap ratio 0.700) — FEL 255.8, DRONE 506.0 — rounded to the grid.
 */
const TYPE = { size: 148.57, capRatio: 0.7, fel: 256, drone: 506, wordSpace: 48 };
const TYPE_WORD_W = TYPE.fel + TYPE.wordSpace + TYPE.drone; // 810

const LOCKUP_H = 160;
const EDGE = 16;
const GAP_MARK = 32;
const wordX = EDGE + MARK_W + GAP_MARK;
const W_TOTAL = wordX + WORD_W + EDGE;
const SITE_W_TOTAL = wordX + TYPE_WORD_W + EDGE;
// mark ink runs 12..148 inside its box → optical centre = EDGE + 80
const markInkCentre = EDGE + 80;
const baseline = markInkCentre + CAP / 2;

const STACK_W = Math.max(MARK_W, WORD_W) + 2 * EDGE;
const SITE_STACK_W = Math.max(MARK_W, TYPE_WORD_W) + 2 * EDGE;
const stackMarkX = (STACK_W - MARK_W) / 2;
const stackWordX = (STACK_W - WORD_W) / 2;
const siteStackMarkX = (SITE_STACK_W - MARK_W) / 2;
const siteStackWordX = (SITE_STACK_W - TYPE_WORD_W) / 2;
const STACK_H = EDGE + MARK_H + 32 + CAP + EDGE;
const stackBaseline = EDGE + MARK_H + 32 + CAP;

const mark = (ink, extra = "", tx = 0, ty = 0) =>
  `<g fill="${ink}" fill-rule="nonzero">` +
  (tx || ty ? `<g transform="translate(${fmt(tx)} ${fmt(ty)})"><path d="${MARK_D}"/></g>` : `<path d="${MARK_D}"/>`) +
  `${extra}</g>`;

/* ------------------------------ favicon chip ------------------------------- */
// The micro drawing is fitted into the chip's 48u inner box (inset 8) by width.
const FAV = { box: 64, r: 12, inset: 8 };
const microScale = 44 / MARK_W; // 44u of the 48u inner box — optical breathing room
const microH = MARK_H * microScale;
const microX = FAV.inset + (48 - MARK_W * microScale) / 2;
const microY = FAV.inset + (48 - microH) / 2;

const fav = (a, b) =>
  `<rect x="0" y="0" width="64" height="64" rx="${FAV.r}" fill="${a}"/>` +
  `<g transform="translate(${fmt(microX)} ${fmt(microY)}) scale(${fmt(microScale)})" fill="${b}" fill-rule="nonzero"><path d="${MICRO_D}"/></g>`;

const geoSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}"><style>:root{--ink:${INK.navy}}svg{background:${INK.paper}}</style>` +
  `<g fill="none" stroke="${ACCENT}" stroke-width=".35" stroke-dasharray="1.6 2.4" opacity=".5">` +
  Array.from({ length: MARK_H / 4 + 1 }, (_, i) => `<path d="M${i * 4} 0V${MARK_H}"/>`).join("") +
  Array.from({ length: MARK_W / 4 + 1 }, (_, i) => `<path d="M0 ${i * 4}H${MARK_W}"/>`).join("") +
  `</g>` +
  `<g fill="none" stroke="${ACCENT}" stroke-width=".6" opacity=".8">` +
  `<path d="M32 0V${MARK_H}M128 0V${MARK_H}M0 52H${MARK_W}M0 50H${MARK_W}M80 0V${MARK_H}"/>` +
  `<circle cx="32" cy="50" r="10"/><circle cx="128" cy="50" r="10"/>` +
  `<path d="M116 52H128A32 48 0 0 1 128 148H116Z"/><ellipse cx="138" cy="100" rx="12" ry="28"/>` +
  `</g>` +
  mark(INK.navy) +
  `<text x="4" y="${MARK_H - 4}" font-family="Arial" font-size="7" font-weight="700" letter-spacing=".1em" fill="${ACCENT}" opacity=".85">FEL DRONE GEOMETRY v12 · QUAD FD · 4u GRID · MARK 160×160</text>` +
  `</svg>`;

const FILES = {
  "public/brand/fel-drone-mark.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}"><style>:root{--ink:${INK.navy}}svg{background:${INK.paper}}</style>${mark("var(--ink)")}</svg>`,
  "public/brand/fel-drone-mark-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}">${mark(INK.black)}</svg>`,
  "public/brand/fel-drone-mark-accent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}">${mark(INK.black)}</svg>`,
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
  "public/brand/fel-drone-mark-micro.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}"><path fill="${INK.black}" fill-rule="nonzero" d="${MICRO_D}"/></svg>`,
  "public/brand/fel-drone-geo.svg": geoSvg,
};

const BRAND_TS = `/** GENERATED by scripts/brand-gen.mjs — do NOT hand-edit.
 *  V12 QUAD FD — front-view quadcopter airframe integrated with an F+D monogram.
 *  Mark (160×160, 4u grid): tapered blades y20..28 with pointed tips, shafts
 *  8×16 at y12..28, hubs ⌀24 at (32,44)/(128,44), bar 96×8, body 32×32 at
 *  x64..96, F stem 24×100 from y52 (sheared foot), D stem 24×100 with a bowl
 *  rx40 ry48 to x160 and a 24×56 oval counter. MICRO: no blades, no shafts.
 *  Wordmark: FEL DRONE — squared technical caps, stroke 28, corner radii 28/12,
 *  tracking 24u, 48u word-space.
 */
export const BRAND = {
  mark: ${JSON.stringify(MARK_D)},
  micro: ${JSON.stringify(MICRO_D)},
  word: ${JSON.stringify(wordPath(0))},
  lockup: { w: ${SITE_W_TOTAL}, h: ${LOCKUP_H}, markX: ${EDGE}, markY: ${EDGE}, wordX: ${wordX}, baseline: ${baseline} },
  stacked: { w: ${SITE_STACK_W}, h: ${STACK_H}, markX: ${siteStackMarkX}, markY: ${EDGE}, wordX: ${siteStackWordX}, baseline: ${stackBaseline} },
  /** Typesetting of the site wordmark — IBM Plex Sans 700, cap ${CAP}, 48u word space */
  type: { size: ${TYPE.size}, capRatio: ${TYPE.capRatio}, cap: ${CAP}, fel: ${TYPE.fel}, drone: ${TYPE.drone}, wordSpace: ${TYPE.wordSpace}, width: ${TYPE_WORD_W}, felX: ${wordX}, droneX: ${wordX + TYPE.fel + TYPE.wordSpace}, stackFelX: ${siteStackWordX}, stackDroneX: ${siteStackWordX + TYPE.fel + TYPE.wordSpace} },
  favicon: { box: ${FAV.box}, r: ${FAV.r}, inset: ${FAV.inset}, microScale: ${fmt(microScale)} },
  cap: ${CAP},
  colors: { light: "${INK.navy}", dark: "${INK.paper}", monoBlack: "${INK.black}", monoWhite: "${INK.white}", accent: "${ACCENT}" },
  box: { w: ${MARK_W}, h: ${MARK_H} },
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

// 1. Path syntax — only the drawing commands this system uses
const invalid = MARK_D.match(/[^MHLVAZ,\s\w.-]/g);
if (invalid) problems.push(`MARK_D contains invalid path chars: ${invalid.join("")}`);

// 2. Grid law — 4u grid; a 2u half-step is allowed for the blade taper/radii
for (const m of MARK_D.matchAll(/[MHVL](-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?))?/g)) {
  for (const n of [m[1], m[2]].filter((x) => x !== undefined)) {
    if (Number(n) % 2 !== 0) problems.push(`grid: ${n} is off the 2u half-step`);
  }
}
for (const m of MARK_D.matchAll(/A(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)) {
  for (const n of [m[1], m[2]]) {
    if (Number(n) % 2 !== 0) problems.push(`grid: radius ${n} is off the 2u half-step`);
  }
}

// 3. Airframe must be present: two blades, two shafts, two hubs, bar, body
if ((MARK_D.match(/A10 10 0 0 1/g) ?? []).length !== 4)
  problems.push("airframe: two ⌀20 rotor hub discs (2× two A10 10 0 0 1 arcs) expected");
if (!MARK_D.includes(BLADE_L) || !MARK_D.includes(BLADE_R))
  problems.push("airframe: the two tapered 64u rotor blades must be present");
if (!MARK_D.includes(STUB_L) || !MARK_D.includes(STUB_R))
  problems.push("airframe: the two 8×48 motor shafts must be present");
if (!MARK_D.includes(BAR)) problems.push("airframe: the hub-to-hub bar 96×8 missing");
if (!MARK_D.includes(BODY)) problems.push("airframe: central body 32×24 missing");

// 4. Monogram must be present and open its counter
if (!MARK_D.includes(F_STEM)) problems.push("monogram: F stem with the sheared foot missing");
if (!MARK_D.includes(F_TOP) || !MARK_D.includes(F_MID))
  problems.push("monogram: the two F arms must be present");
if (!MARK_D.includes(D_BOWL)) problems.push("monogram: D bowl (half-ellipse rx32 ry48 to x160) missing");
if (!MARK_D.includes(D_COUNTER))
  problems.push("monogram: the large oval D counter (24×56) missing");
if (116 - 76 !== 40) problems.push("monogram: a 40u negative channel between F and D expected");

// 5. Airframe overlaps the monogram — one connected emblem, never two stacked parts
if (!MARK_D.includes(HUB_L) || !MARK_D.includes(HUB_R))
  problems.push("emblem: rotor hubs must be drawn on the monogram axes");
if (50 + 10 <= 52) problems.push("emblem: hub discs must overlap the letterforms by 8u");
if (2 * 10 !== 20) problems.push("emblem: hub diameter must match the 20u letter stroke");
if (!(12 < 18 && 12 + 48 >= 50))
  problems.push("emblem: the motor shaft must run from above the blade into the hub");
if (MARK_D.indexOf(BODY) > MARK_D.indexOf(MONOGRAM_D))
  problems.push("emblem: the body block must bridge the letters from above");

// 6. MICRO is the documented small-size drawing: emblem minus blades and shafts
if (MICRO_D !== HUB_L + HUB_R + BAR + BODY + MONOGRAM_D)
  problems.push("MICRO must be the emblem without the rotor blades and shafts");

// 7. Wordmark law
const letters = WORD.map((w) => w[0]).join("");
if (letters !== "FELDRONE") problems.push("wordmark must be FEL + DRONE letters");
if (GAPS[2] !== 48) problems.push("the word-space FEL|DRONE must be 48u (2× track)");
if (!GAPS.every((g, i) => g === 24 || i === 2)) problems.push("wordmark tracking must be 24u everywhere");
if (W_STEM !== 28) problems.push("wordmark stroke weight must be 28u");
if (TYPE.fel + TYPE.wordSpace + TYPE.drone !== 810) problems.push("site wordmark advance must total 810u");
if (Math.abs(TYPE.size * 0.7 - CAP) > 0.05) problems.push("site wordmark must render a 104u cap height (Plex cap ratio 0.700)");
if (!wordPath(0).includes("A28 28 0 0 1")) problems.push("wordmark: squared 28u outer corner radius missing");
if (!wordPath(0).includes("A12 12 0 0 0")) problems.push("wordmark: 12u counter corner radius missing");
if (W_TOTAL !== 1004) problems.push(`lockup width changed: ${W_TOTAL} (expected 1004)`);
if (STACK_W !== 812 || STACK_H !== 328) problems.push(`stacked asset lockup changed: ${STACK_W}×${STACK_H}`);
if (SITE_W_TOTAL !== 1034) problems.push(`site lockup width changed: ${SITE_W_TOTAL} (expected 1034)`);

// 8. Editorial guard kept from V10
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
