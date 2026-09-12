#!/usr/bin/env node
/**
 * FEL DRONE — application board renderer (identity v4).
 *
 * Regenerates docs/brand-board.png: an HTML-free vector composite that
 * embeds the SAME files the brand lab emits (public/brand/*.svg,
 * public/favicon.svg) via <image> hrefs, so the board can never drift from
 * the identity. Text-only font is Inter, prepared on the fly from
 * @fontsource/inter (woff2 → ttf for fontconfig/librsvg).
 *
 * Requires (dev-only, no package.json churn):
 *   npm i --no-save sharp @fontsource/inter wawoff2
 *
 * Usage:  node scripts/brand-board.mjs   # → docs/brand-board.png
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONT_DIR = process.env.BRAND_FONTS || path.join(os.tmpdir(), "boardfonts");

async function prepareFonts() {
  if (fs.existsSync(path.join(FONT_DIR, "Inter-Bold.ttf"))) return;
  let wawoff2, ffDir;
  try {
    wawoff2 = (await import("wawoff2")).default;
    ffDir = path.join(ROOT, "node_modules/@fontsource/inter/files");
    if (!fs.existsSync(ffDir)) throw new Error("no @fontsource/inter");
  } catch {
    console.error("font prep unavailable — run: npm i --no-save sharp @fontsource/inter wawoff2");
    process.exit(1);
  }
  fs.mkdirSync(FONT_DIR, { recursive: true });
  for (const [src, out] of [
    ["inter-latin-400-normal.woff2", "Inter-Regular.ttf"],
    ["inter-latin-500-normal.woff2", "Inter-Medium.ttf"],
    ["inter-latin-600-normal.woff2", "Inter-SemiBold.ttf"],
    ["inter-latin-700-normal.woff2", "Inter-Bold.ttf"],
  ]) {
    const ttf = await wawoff2.decompress(fs.readFileSync(path.join(ffDir, src)));
    fs.writeFileSync(path.join(FONT_DIR, out), Buffer.from(ttf));
  }
}

/* palette */
const BG = "#f8f7f4";
const PANEL = "#f6f3ee";
const BAR = "#ececE5";
const NAVY = "#0e1f30";
const SLATE = "#4a5568";
const TITLE = "#10263a";
const SUB = "#5b6a7d";
const LABEL = "#6b7787";
const INKLABEL = "#4b5866";
const FOOT = "#9aa5b1";

const W = 1600;
const H = 1800;
const M = 56;
const PW = W - 2 * M;

/**
 * Embed a brand file INLINED as a nested <svg> (librsvg-safe: no external
 * <image> resolution). The source file's inner markup is copied verbatim —
 * the board always shows the identity as emitted by the brand lab.
 */
function brandImg(href, x, y, h, w) {
  const src = fs.readFileSync(path.join(ROOT, href), "utf8");
  const vb = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(src);
  const [, vw, vh] = vb;
  const width = w ?? (h * Number(vw)) / Number(vh);
  const open = src.match(/<svg[^>]*>/)[0];
  const inner = src.slice(src.indexOf(open) + open.length, src.lastIndexOf("</svg>"));
  const attrs = `viewBox="${/viewBox="[^"]+"/.exec(open)[0].slice(9, -1)}" preserveAspectRatio="xMidYMid meet"`;
  return `<svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="${h.toFixed(1)}" ${attrs}>${inner}</svg>`;
}
function centered(href, boxX, boxY, boxW, boxH, h) {
  const src = fs.readFileSync(path.join(ROOT, href), "utf8");
  const vb = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(src);
  const w = (h * Number(vb[1])) / Number(vb[2]);
  return brandImg(href, boxX + (boxW - w) / 2, boxY + (boxH - h) / 2, h, w);
}

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const label = (x, y, t) =>
  `<text x="${x}" y="${y}" font-family="Inter" font-size="16" font-weight="600" letter-spacing="2.4" fill="${LABEL}">${esc(t)}</text>`;

const rect = (x, y, w, h, fill, r = 10) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;

/* ── layout ── */
let y = 0;
const parts = [];

// masthead
parts.push(`<text x="${M}" y="96" font-family="Inter" font-size="40" font-weight="700" fill="${TITLE}">${esc("FEL DRONE — identity system v4")}</text>`);
parts.push(
  `<text x="${M}" y="134" font-family="Inter" font-size="17" fill="${SUB}">${esc("the gantry F: stem = fuselage, bars = rotor spars, foot = landing skid \u00b7 single gold accent on the hubs \u00b7 monochrome first")}</text>`,
);
parts.push(
  `<text x="${M}" y="160" font-family="Inter" font-size="14" fill="${SUB}">${esc("v4 provenance \u2014 one geometry source: scripts/brand-gen.mjs emits every file on this board (npm run brand:check keeps them in sync)")}</text>`,
);

// primary horizontal lockup
y = 206;
parts.push(label(M, y, "PRIMARY — HORIZONTAL LOCKUP"));
const p1y = y + 20, p1h = 420;
parts.push(rect(M, p1y, PW, p1h, PANEL));
parts.push(brandImg("public/brand/fel-drone-horizontal.svg", M + (PW - 1240) / 2, p1y + (p1h - 240.9) / 2, 240.9, 1240));

// row 2 — inverted + stacked
y = p1y + p1h + 60; // 706
parts.push(label(M, y, "INVERTED (NAVY GROUND)"));
parts.push(label(800, y, "STACKED (AVATAR / SIGNAGE)"));
const p2y = y + 20, p2h = 300;
parts.push(rect(M, p2y, 700, p2h, PANEL)); // panel bg behind navy plate
const invH = (700 * 128) / 659;
parts.push(brandImg("public/brand/fel-drone-horizontal-inverted.svg", M, p2y + (p2h - invH) / 2, invH, 700));
parts.push(rect(800, p2y, 744, p2h, PANEL));
parts.push(centered("public/brand/fel-drone-stacked.svg", 800, p2y, 744, p2h, 230));

// row 3 — symbol variants
y = p2y + p2h + 60; // 1066
const tileW = (PW - 3 * 16) / 4; // 360
const tileX = (i) => M + i * (tileW + 16);
const tileH = 250;
parts.push(label(tileX(0), y, "SYMBOL — INK"));
parts.push(label(tileX(1), y, "SYMBOL — PAPER"));
parts.push(label(tileX(2), y, "MONO BLACK (PRINT, DECAL)"));
parts.push(label(tileX(3), y, "MONO WHITE (VEHICLE, BODY)"));
const p3y = y + 20;
parts.push(rect(tileX(0), p3y, tileW, tileH, PANEL));
parts.push(rect(tileX(1), p3y, tileW, tileH, NAVY));
parts.push(rect(tileX(2), p3y, tileW, tileH, PANEL));
parts.push(rect(tileX(3), p3y, tileW, tileH, SLATE));
parts.push(centered("public/brand/fel-drone-symbol.svg", tileX(0), p3y, tileW, tileH, 160));
parts.push(centered("public/brand/fel-drone-symbol-inverted.svg", tileX(1), p3y, tileW, tileH, tileH)); // navy bg = seamless bleed
parts.push(centered("public/brand/fel-drone-symbol-mono-black.svg", tileX(2), p3y, tileW, tileH, 160));
parts.push(centered("public/brand/fel-drone-symbol-mono-white.svg", tileX(3), p3y, tileW, tileH, 160));

// row 4 — favicon sizes
y = p3y + tileH + 60; // 1396
parts.push(label(M, y, "FAVICON & APPLICATION SIZES — APERTURES HOLD TO 16 PX"));
const barY = y + 20, barH = 170;
parts.push(rect(M, barY, PW, barH, BAR));
let cx = M + 44;
for (const size of [64, 48, 32, 24, 16]) {
  const cy = barY + (barH - size) / 2;
  parts.push(brandImg("public/favicon.svg", cx, cy, size, size));
  parts.push(
    `<text x="${cx + size + 12}" y="${barY + barH / 2 + 5}" font-family="Inter" font-size="15" fill="${INKLABEL}">${size}px</text>`,
  );
  cx += size + 12 + 46 + 28;
}
// standalone symbol at small sizes (no chip)
parts.push(brandImg("public/brand/fel-drone-symbol.svg", M + 900, barY + (barH - 24) / 2, 24, 24 * (168 / 180)));
parts.push(brandImg("public/brand/fel-drone-symbol.svg", M + 940, barY + (barH - 16) / 2, 16, 16 * (168 / 180)));
parts.push(
  `<text x="${M + 900}" y="${barY + barH - 18}" font-family="Inter" font-size="13" fill="${LABEL}">${esc("standalone \u2014 24 / 16")}</text>`,
);

// footer
parts.push(
  `<text x="${M}" y="${H - 44}" font-family="Inter" font-size="13" fill="${FOOT}">${esc("regenerated by scripts/brand-board.mjs from scripts/brand-gen.mjs output \u00b7 identity v4.0 \u00b7 2026-09 \u00b7 geometry frozen from v3.0")}</text>`,
);
parts.push(
  `<text x="${W - M}" y="${H - 44}" text-anchor="end" font-family="Inter" font-size="13" fill="${FOOT}">${esc("SARL FEL DRONE \u2014 El Tarf, Alg\u00e9rie")}</text>`,
);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${rect(0, 0, W, H, BG, 0)}
${parts.join("\n")}
</svg>
`;

await prepareFonts();
process.env.FONTCONFIG_FILE = (() => {
  const p = path.join(os.tmpdir(), "brand-board-fonts.conf");
  fs.writeFileSync(p, `<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig>\n  <dir>${FONT_DIR}</dir>\n  <cachedir>${path.join(os.tmpdir(), "brand-board-fc-cache")}</cachedir>\n</fontconfig>\n`);
  return p;
})();

const tmpSvg = path.join(os.tmpdir(), "brand-board.svg");
fs.writeFileSync(tmpSvg, svg);
const sharp = (await import("sharp")).default;
await sharp(tmpSvg, { limit: 2000 }).png().toFile(path.join(ROOT, "docs/brand-board.png"));
console.log("rendered docs/brand-board.png");
