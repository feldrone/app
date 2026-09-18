# FEL DRONE — Corporate Identity Full PDF · Verification Report

Generated: 2026-09-18 · Branch: `brand/corporate-stamp` · Rendered build: 9571478

## Artifact

| Item | Value |
|---|---|
| File | `public/brand-review/corporate-identity/exports/FEL-DRONE-Corporate-Identity-Full.pdf` |
| Pages | 13 (A4 portrait) |
| Size (bytes) | 951923 |
| SHA-256 | `4c978777592dbff42c19a7fdbf2f74dbbceeeb1c60ae36d15cdb6f1720aea86a` |
| Format | Real PDF (ReportLab), vector stamps/mark/lockup/layout; 600 dpi PNGs only for displacement-filtered inked masters; invoice reference rendered from the validated FACTURE PDF |
| Embedded fonts | Lexend 700/600 · IBM Plex Sans 400/500/600 · IBM Plex Sans Arabic 400 (RTL, shaped via arabic_reshaper + python-bidi) · DejaVu 2-glyph subset (→, ≥ only — the Plex latin subsets lack these glyphs) |
| Deterministic | Yes — `invariant=1`; re-running `generate.py` reproduces the identical SHA-256 |

## Reproduction

```bash
python3 public/brand-review/corporate-identity/generate.py
```

Inputs committed alongside: `fonts/` (7 TTFs), `assets/` (4 inked 600 dpi PNGs + 300 dpi invoice reference), mark path extracted at run time from `src/brand/brandmark.ts` (single source of truth, byte-identical, fill-rule:evenodd).

## Gates (all PASS)

| Gate | Result |
|---|---|
| PDF parser opens + integrity (PyMuPDF) | PASS |
| Exact page count = 13 | PASS |
| Full text extraction, every page | PASS (13/13, no blank pages; min page 61 words) |
| GRAN (case-insensitive) in extracted text | 0 |
| GRAN in raw file bytes | 0 |
| GRAN in all decompressed content streams | 0 |
| Old stamp address form (previous arc wording) | 0 — stamp arcs are `150 LOGEMENTS, COMMUNE AÏN EL ASSEL` / `RC 36/00-0683602B26 · WILAYA D'EL TARF`; “Cité 150 Logements B…” appears only as the repo-verified value in the §02 field table and in the letter mock header, exactly as in the preview source |
| Every page rendered (150 dpi) | PASS (13/13) |
| Every page visually inspected | PASS (13/13 — no missing/clipped/overlapping/broken elements, correct ordering, spacing, margins; no blank pages) |
| Company name | A = SARL FEL DRONE (Lexend 700 bold); B/C = FEL DRONE — no substitute text, no special value |
| Logo geometry | C2 STADIUM-D unchanged (byte-identical mark path, evenodd, F+D counters preserved) |
| French accents | Correct throughout (À COMPLÉTER, AÏN, ÉRIE, …) |
| Arabic | Both preview strings present, shaped (letter-joined, RTL), embedded Plex Arabic; text layer carries presentation forms |

## Completeness checklist — preview section → PDF

| PREVIEW SECTION | PDF PAGE(S) | PRESENT | VISUALLY VERIFIED |
|---|---|---|---|
| Header (kicker, H1 “Official Corporate Stamp / Cachet — Design Family”, sub, DRAFT badge, branch/base/build meta, company identity, invoice banner reference) | 1 (banner reference also §08, p13) | YES | YES |
| 01 Approved Logo — unchanged source (symbol, lockup 1157×176, mono, integrity statement) | 2 | YES | YES |
| 02 Legal-Information Analysis — Algeria (headline finding, 5-source table, 10-row field classification, language decision incl. 2 Arabic strings) | 3–4 | YES | YES |
| 03 Stamp Concepts — rendered (A classic, A rsvd NIF/NIS, B, C — vector, captions A1/A2/B1/C1, draft note) | 5–6 | YES | YES |
| 03 Per-concept review sheet (A/B/C × Structure/Size/Typography/Manufacturing/Advantages/Risks/Status) | 6–7 | YES | YES |
| 04 Physical-Size Simulation — every concept at 30 / 40 / 45 / 50 mm, true scale | 8 | YES | YES |
| 05 Ink Simulation — 5.1 digital master, 5.2 inked, 5.3 navy presentation, 5.4 A2 inked, 5.5 B inked + captions | 9–10 | YES | YES |
| 06 Document Simulation — invoice (A 45 mm), quotation (B 50 mm), letter (A 45 mm), technical report (C 30 mm) + captions, SIMULATION tags | 11 | YES | YES |
| 07 Manufacturing Constraints — 10-row table + not-touched + review protocol | 12 | YES | YES |
| 08 Invoice Template — Reference (FACTURE) — cachet & signature zone + rendered A4 reference | 13 | YES | YES |

**Preview sections: 8 (+header) · Reproduced: 8 (+header) · Missing: 0**

## Text-layer note (special glyphs)

“→” and “≥” are drawn from the embedded 2-glyph DejaVu subset (the IBM Plex Sans latin subsets do not contain these codepoints; rendering them from Plex would produce .notdef boxes). They are visually verified on pages 1, 7, 12. In the extracted text layer they appear as whitespace-joined tokens (extraction artifact of the subset font); visual rendering is the authoritative record.

## Scope confirmation

- Only this directory added; no production website/route/API/security change; `main` untouched; PR not merged; DRAFT until human approval.
- The FACTURE template PDF (`public/brand-review/invoice/exports/FEL-DRONE-Facture-Template.pdf`) is separate and unchanged; it is referenced here as the §08 component.
