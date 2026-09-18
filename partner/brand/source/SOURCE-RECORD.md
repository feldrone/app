# PARTNER LOGO — SOURCE RECORD (Phase 1 discovery)

Status: **AWAITING HUMAN VISUAL REVIEW** — do not treat as an approved identity master.

## What was found

The only third-party brand logo **visibly rendered on the existing FEL DRONE
website** is the **DJI mark printed on the drone body** in the *Vente*
("Pôle 01 — Commerce") service photograph. This was established by:

1. An exhaustive search of the implementation (working tree, full git
   history, built single-file app, all content/data files, all image/SVG
   references, `public/`, config, both `feldrone` sibling repos): **no
   partner logo asset exists** — not local, not code-generated, not a
   referenced remote logo URL. Every `logo` reference in the codebase is the
   FEL DRONE brand.
2. A visual inspection of every site photograph that could be retrieved:
   - **9182739 (Vente)** — DJI mark clearly visible on the drone body. ✅
   - **6165166 (Inspection / construction site)** — no visible branding.
   - Wind-farm operator imagery (hero-class scene) — no visible operator
     branding (site hero 28467369 itself could not be pixel-fetched from the
     build sandbox; see §Limitations). Pexels metadata names no operator or
     signage.

The logo is therefore **embedded inside a licensed stock photograph**, not a
logo asset (no vector, no colour spec, no clear-space definition exists in
the project).

## Source details (case: remote — image referenced by the website)

| Field | Value |
| --- | --- |
| Source type | **Remote** — licensed stock photo referenced by the site; logo mark is inside the photo pixels |
| Placement on site | Vente service ("Pôle 01 — Commerce"), image `serviceImages.vente` |
| In-repo reference | `src/lib/images.ts` → `vente: photo({ id: 9182739, ratio: [16, 10], … })` |
| Production URL (desktop) | `https://images.pexels.com/photos/9182739/pexels-photo-9182739.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&fit=crop` |
| Production URL (mobile srcSet) | `https://images.pexels.com/photos/9182739/pexels-photo-9182739.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop` |
| Asset (original) | Pexels photo **9182739** — "Close-up of DJI Mavic drone and controller on a textured surface at sunset" — Erik Mclean — 3648×5472 (2:3) |
| Pexels page | <https://www.pexels.com/photo/close-up-photo-of-a-dji-mavic-drone-9182739/> |
| License | Pexels License (free for commercial use, no attribution required, modification permitted) — per `docs/IMAGES.md` |
| Production crop | 16:10 center crop of the 2:3 original (`fit=crop`). The DJI mark sits at ≈27 % of the original's height — **at the top edge of the production crop**; it may be partially clipped as rendered on the live site. Flagged for visual confirmation. |

## Preserved copies (identical bytes)

| Path | Role | SHA-256 |
| --- | --- | --- |
| `partner/brand/source/partner-logo-evidence-vente-9182739.jpg` | Canonical evidence copy (isolated partner-brand source dir) | `5fdd4da8cb393d2f04a61e45223af699ce40d93dd1b59d6c494eba3f34f224c9` |
| `public/partner-brand-review/assets/partner-logo-evidence-vente-9182739.jpg` | Serving mirror for the static review page | `5fdd4da8cb393d2f04a61e45223af699ce40d93dd1b59d6c494eba3f34f224c9` |

Copy provenance: the exact Pexels CDN asset at `w=500` (same photo ID, same
source parameters family as the production reference), captured 2026-09-18
via search-image retrieval because the build sandbox blocks direct outbound
downloads (`SSL_ERROR_SYSCALL`). The original production file (1600 px crop /
3648×5472 master) was **not** substituted — the reference URL above remains
the production source of record.

## Limitations (recorded, not resolved)

- The mark is a small, perspective-tilted, photo-graded raster — **no
  geometry can be mechanically derived with verifiable accuracy** from this
  source. Any true logo variants (mono / reverse / lockup) would require
  redrawing the mark, which the partner mission explicitly forbids
  ("Do NOT create a new partner logo. Do NOT redesign it.").
- **Trademark note:** the mark is the registered trademark of DJI (a
  third-party equipment manufacturer), incidentally present in licensed
  stock photography. This record documents its presence only. It is **not**
  DJI's brand approval, and no partner identity system may be built around
  it without official asset files and rights clearance from the trademark
  holder.
- Site hero 28467369 (wind farm) could not be pixel-fetched in-sandbox;
  absence of branding there is based on Pexels metadata, not pixels.

## Next step

Human visual review at `/partner-brand-review/` (PR + live preview).
Confirmation required: is the DJI mark in the Vente photo the intended
"partner logo", or does the approved partner logo exist elsewhere (e.g. the
unfetched hero image or outside the project)? **No Phase 2 work starts
before that confirmation.**
