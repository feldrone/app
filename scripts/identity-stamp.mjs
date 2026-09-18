#!/usr/bin/env node
/**
 * FEL DRONE — Corporate stamp (cachet) generator — identity Phase 2 (DRAFT).
 *
 * Single geometry source for the review concepts in
 * public/brand-review/stamp/assets/. Mirrors the project convention of
 * scripts/brand-gen.mjs: every stamp SVG is generated, never hand-drawn, and
 * the approved C2 STADIUM-D mark is embedded UNCHANGED (extracted from the
 * generated src/brand/brandmark.ts, which itself is gated by brand:check).
 *
 * Usage:
 *   node scripts/identity-stamp.mjs          # regenerate assets + MANIFEST.json
 *   node scripts/identity-stamp.mjs --check  # verify page inline copies match assets
 *
 * Company values are extracted character-for-character from
 * src/data/company.ts (the repo's single source of company identity).
 * If a value is missing the script FAILS — nothing is ever fabricated.
 *
 * Geometry units: viewBox 10 units = 1 mm (Concept A: 45 mm master,
 * B: 50 mm, C: 30 mm). Minimum stamped stroke 0.4 mm; no element below it.
 * Manufacturing master is monochrome black; the navy variant is presentation.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/brand-review/stamp/assets");
const pagePath = join(root, "public/brand-review/stamp/index.html");

/* ── Sources of truth (extracted, never retyped) ──────────────────────────── */
const markTs = readFileSync(join(root, "src/brand/brandmark.ts"), "utf8");
const markMatch = markTs.match(/mark:\s*"([^"]+)"/);
if (!markMatch) throw new Error("C2 mark path not found in src/brand/brandmark.ts");
const MARK = markMatch[1]; // approved V12 symbol — unchanged

const companyTs = readFileSync(join(root, "src/data/company.ts"), "utf8");
const pick = (key) => {
  const m = companyTs.match(new RegExp(`${key}:\\s*"([^"]+)"`));
  if (!m) throw new Error(`company field "${key}" not found in src/data/company.ts — refusing to fabricate`);
  return m[1];
};
const C = {
  legalName: pick("legalName"), // "SARL FEL DRONE"
  shortName: pick("shortName"), // "FEL DRONE"
  rc: pick("rc"), // "36/00-0683602B26" — character for character
  city: pick("city"), // "El Tarf"
  addressLine2: pick("addressLine2"), // "Commune de Aïn El Assel, Wilaya d'El Tarf"
};
/* Headquarters address (approved by the company, human review 2026-09-18):
   "150 LOGEMENTS, COMMUNE D'AÏN EL ASSEL, WILAYA D'EL TARF"
   (Arabic source: حي 150 مسكن، بلدية عين العسل، ولاية الطارف).
   The street segment "150 Logements" is intentionally narrower than
   company.ts addressLine1 ("Cité 150 Logements B"): the stamp carries
   district + commune + wilaya only — no additional address information.
   Commune/wilaya remain extracted from company.ts, typeset uppercase. */
const AW = C.addressLine2.replace(/^Commune de\s+/i, "").toUpperCase(); // "AÏN EL ASSEL, WILAYA D'EL TARF"
const [COMMUNE, WILAYA] = AW.split(", ");
const STREET = "150 LOGEMENTS"; // human-approved 2026-09-18 (حي 150 مسكن)
const ADDRESS_ARC_1 = `${STREET}, COMMUNE ${COMMUNE}`; // "150 LOGEMENTS, COMMUNE AÏN EL ASSEL"
const ADDRESS_ARC_2 = WILAYA; // "WILAYA D'EL TARF"
const STAMP_ADDRESS = `${STREET}, COMMUNE ${COMMUNE}, ${WILAYA}`;
const CITY_ARC = `${C.city} — ALGÉRIE`.toUpperCase();
const RC_LINE = `RC ${C.rc}`;
/* Concept A top-arc text: "GRAN" — company-requested name text, human review
   2026-09-18 (replaces the legal-name rendering in A's name-arc text area
   only; B/C keep "FEL DRONE"; all other legal/data lines unchanged). */
const NAME_ARC_A = "GRAN";

/* Missing by design — DATA REQUIRED FROM COMPANY (never fabricated):
   NIF (DGI), NIS (ONS), AI (inspection des impôts), Arabic company name.
   Concept A reserves two short lines under the mark for NIF/NIS; the
   "-rsvd" variants render dotted placeholders, clearly not values.      */

/* ── SVG helpers ──────────────────────────────────────────────────────────── */
/* Typography: the company NAME (wordmark) is set in LEXEND — the approved
   FEL DRONE wordmark face (see src/brand/brandmark.ts, capRatio 0.7),
   weight 700 where the wordmark requires it. Legal/data lines (RC, address,
   city) stay in the approved body face IBM Plex Sans. */
const LEXEND = "'Lexend','IBM Plex Sans','Segoe UI',Arial,sans-serif";
const PLEX = "'IBM Plex Sans','Lexend','Segoe UI',Arial,sans-serif";
const LEX_CAP = 0.7; // Lexend cap ratio (brandmark.ts type.capRatio)
const PLEX_CAP = 0.65; // Plex Sans cap ratio
const INK = "#000000";
const NAVY = "#0e1f30"; // brand ink (brandmark.ts colors.light) — presentation only

/** 160° arc across the top (text upright, baseline on path, caps outward). */
const topArc = (c, r) =>
  `M ${(c - 0.9848 * r).toFixed(2)} ${(c - 0.1736 * r).toFixed(2)} A ${r} ${r} 0 0 1 ${(c + 0.9848 * r).toFixed(2)} ${(c - 0.1736 * r).toFixed(2)}`;
/** 160° arc across the bottom (text upright, caps toward centre). */
const bottomArc = (c, r) =>
  `M ${(c - 0.9848 * r).toFixed(2)} ${(c + 0.1736 * r).toFixed(2)} A ${r} ${r} 0 0 0 ${(c + 0.9848 * r).toFixed(2)} ${(c + 0.1736 * r).toFixed(2)}`;

/** font-size from desired cap height (mm units /10) for a given cap ratio. */
const fs = (cap, ratio = PLEX_CAP) => (cap / ratio).toFixed(2);

/** The approved mark centred on (c, cy) at the given scale of its 160 box.
    fill-rule:evenodd is REQUIRED — the C2 STADIUM-D outline's counters
    (the F structure) are expressed by crossing subpaths, exactly as the
    approved website rendering does (src/components/Logo.tsx uses
    fillRule="evenodd"). With the SVG default (nonzero) the counters fill
    and the mark collapses to a solid black block. */
const markAt = (c, cy, s) =>
  `<g fill="{ink}" fill-rule="evenodd" transform="translate(${(c - 80 * s).toFixed(2)} ${(cy - 74 * s).toFixed(2)}) scale(${s})"><path d="${MARK}"/></g>`;

const ring = (c, r, w) => `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="{ink}" stroke-width="${w}"/>`;
const dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="{ink}"/>`;

const arcText = (id, path, str, size, weight, spacing, fam = PLEX) =>
  `<path id="${id}" d="${path}" fill="none"/><text font-family="${fam}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" fill="{ink}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${str}</textPath></text>`;

const lineText = (x, y, str, size, weight, spacing, fam = PLEX) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="${fam}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" fill="{ink}">${str}</text>`;

/** Assemble a full SVG. opts: {size, c, ink, filter, title, body} */
const svg = (size, c, ink, filter, k, title, body) => {
  const f =
    filter === undefined
      ? ""
      : `<defs><filter id="ink-${k}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${7 + size}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.4"/></filter></defs>`;
  const inner = body.replaceAll("{ink}", ink);
  const group = filter === undefined ? inner : `<g filter="url(#ink-${k})" opacity="0.93">${inner}</g>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="${title}">
<!-- GENERATED by scripts/identity-stamp.mjs — do not hand-edit. -->
<!-- ${title} — DRAFT, human review required. Mark: approved V12 C2 STADIUM-D, unchanged. -->
${f}<title>${title}</title>
${group}
</svg>
`;
};

/* ── Concept A — Classic Corporate (45 mm master) ───────────────────────────
   Double ring · company name GRAN top arc (Lexend 700 wordmark) ·
   address (district + commune) outer bottom arc, RC + wilaya inner bottom
   arc (Plex Sans legal lines) · separator dots · C2 mark centred at 0.88
   (+10 % vs 0.80, review 2026-09-18; NIF/NIS lines shifted +8u down to
   keep ≥ 0.8 mm clearance under the larger mark) ·
   (reserved NIF/NIS lines in -rsvd).
   Arc fits verified against real font advances: GRAN 27.2% of 160°,
   address 84.6%, RC·wilaya 78.1% — all lines ≥ 1.2 mm cap.               */
function conceptA(ink, filter, reserved, k) {
  const c = 225, s = 450;
  const body = [
    ring(c, 222, 6),
    ring(c, 152, 4),
    dot(c - 187, c, 5),
    dot(c + 187, c, 5),
    arcText(`${k}-top`, topArc(c, 178), NAME_ARC_A, fs(28, LEX_CAP), 700, 4, LEXEND),
    arcText(`${k}-bot1`, bottomArc(c, 214), ADDRESS_ARC_1, fs(15), 500, 0.5),
    arcText(`${k}-bot2`, bottomArc(c, 186), `${RC_LINE} · ${ADDRESS_ARC_2}`, fs(12), 500, 0.5),
    markAt(c, c, 0.93),
    ...(reserved
      ? [
          lineText(c, 316, "NIF ··········", fs(13), 500, 1.5),
          lineText(c, 340, "NIS ··········", fs(13), 500, 1.5),
        ]
      : []),
  ].join("\n");
  const t = `FEL DRONE cachet — Concept A Classic Corporate, 45 mm${reserved ? ", NIF/NIS slot reserved" : ""}`;
  return svg(s, c, ink, filter, k, t, body);
}

/* ── Concept B — Modern Corporate (50 mm master) ────────────────────────────
   Single ring · short name, wide tracking, top arc · RC bottom arc ·
   larger mark · city line under mark. More air, no secondary ring.        */
function conceptB(ink, filter, k) {
  const c = 250, s = 500;
  const body = [
    ring(c, 240, 5),
    arcText(`${k}-top`, topArc(c, 192), C.shortName.toUpperCase(), fs(40, LEX_CAP), 700, 10, LEXEND),
    arcText(`${k}-bot`, bottomArc(c, 226), RC_LINE, fs(22), 600, 4),
    markAt(c, c, 1),
    lineText(c, 352, CITY_ARC, fs(16), 500, 5),
  ].join("\n");
  return svg(s, c, ink, filter, k, "FEL DRONE cachet — Concept B Modern Corporate, 50 mm", body);
}

/* ── Concept C — Compact Official (30 mm master) ────────────────────────────
   Single ring · name top arc · RC bottom arc · mark only. Sized so every
   stroke stays ≥ 0.5 mm at 30 mm. No address (below legible minimum).     */
function conceptC(ink, filter, k) {
  const c = 150, s = 300;
  const body = [
    ring(c, 143, 5),
    arcText(`${k}-top`, topArc(c, 112), C.shortName.toUpperCase(), fs(26, LEX_CAP), 700, 4, LEXEND),
    arcText(`${k}-bot`, bottomArc(c, 131), RC_LINE, fs(16), 600, 1.5),
    markAt(c, c, 0.5),
  ].join("\n");
  return svg(s, c, ink, filter, k, "FEL DRONE cachet — Concept C Compact Official, 30 mm", body);
}

/* ── Emit ─────────────────────────────────────────────────────────────────── */
const files = {
  "concept-a-classic.svg": conceptA(INK, undefined, false, "a1"),
  "concept-a-classic-inked.svg": conceptA(INK, true, false, "a2"),
  "concept-a-classic-navy.svg": conceptA(NAVY, undefined, false, "a3"),
  "concept-a-classic-rsvd.svg": conceptA(INK, undefined, true, "a4"),
  "concept-a-classic-rsvd-inked.svg": conceptA(INK, true, true, "a5"),
  "concept-b-modern.svg": conceptB(INK, undefined, "b1"),
  "concept-b-modern-inked.svg": conceptB(INK, true, "b2"),
  "concept-b-modern-navy.svg": conceptB(NAVY, undefined, "b3"),
  "concept-c-compact.svg": conceptC(INK, undefined, "c1"),
  "concept-c-compact-inked.svg": conceptC(INK, true, "c2"),
};

if (process.argv.includes("--check")) {
  /* Verify the review page's inline copies are byte-identical to the assets
     (inline blocks sit between <!-- STAMP:<name>:BEGIN --> markers). */
  let page;
  try {
    page = readFileSync(pagePath, "utf8");
  } catch {
    console.log("review page not present yet — nothing to check");
    process.exit(0);
  }
  let failures = 0;
  let notInlined = [];
  for (const [name, content] of Object.entries(files)) {
    const inline = page.match(new RegExp(`<!-- STAMP:${name.replace(".", "\\.")}:BEGIN -->\\n([\\s\\S]*?)<!-- STAMP:${name.replace(".", "\\.")}:END -->`));
    if (!inline) {
      notInlined.push(name); // page may reference this asset via <img> only — fine
      continue;
    }
    // standalone = XML prolog + markup; inline = markup only (no prolog)
    const standaloneBody = content.replace(/^<\?xml[^>]*>\n/, "");
    if (inline[1].trim() !== standaloneBody.trim()) {
      console.error(`--check: inline copy of ${name} differs from generated asset`);
      failures++;
    }
  }
  if (failures) {
    console.error(`--check: ${failures} mismatch(es) — regenerate or resync`);
    process.exit(1);
  }
  if (notInlined.length) console.log(`--check: not inlined (img-referenced only): ${notInlined.join(", ")}`);
  console.log(`--check: all inlined copies match (${Object.keys(files).length - notInlined.length} verified)`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const manifest = {
  generatedBy: "scripts/identity-stamp.mjs",
  status: "DRAFT — human review required",
  mark: "approved V12 C2 STADIUM-D (src/brand/brandmark.ts, geometry unchanged)",
  markScales: { conceptA: 0.93, conceptB: 1, conceptC: 0.5 }, // review 2026-09-18 (final micro-adjustment)
  markFillRule: "evenodd — required to preserve the C2 counters (same rule as the approved website rendering, src/components/Logo.tsx)",
  typography: {
    wordmark: "Lexend 700 — approved FEL DRONE wordmark face (brandmark.ts type.capRatio 0.7)",
    legalLines: "IBM Plex Sans 500 — approved body face",
  },
  company: {
    legalName: C.legalName,
    shortName: C.shortName,
    rc: C.rc,
    city: C.city,
    address: STAMP_ADDRESS, // headquarters as shown on the stamp — approved by the company 2026-09-18 (Arabic: حي 150 مسكن، بلدية عين العسل، ولاية الطارف)
    nameArcA: "GRAN", // Concept A top-arc name text — company-requested 2026-09-18 (B/C keep "FEL DRONE")
  },
  dataRequiredFromCompany: ["NIF (DGI)", "NIS (ONS)", "AI (inspection des impôts)", "Arabic company name (no verified transliteration in repo)"],
  files: {},
};
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(outDir, name), content);
  manifest.files[name] = {
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}
writeFileSync(join(outDir, "MANIFEST.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`wrote ${Object.keys(files).length} stamp SVGs + MANIFEST.json to public/brand-review/stamp/assets/`);
for (const f of readdirSync(outDir).sort()) console.log("  " + f);
