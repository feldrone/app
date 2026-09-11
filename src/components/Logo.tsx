import { cn } from "../utils/cn";

/**
 * FEL DRONE — official lockup (geometric mark + wordmark).
 *
 * The mark reproduces the supplied logo's geometry one-to-one in a 653×406
 * view-box: rotor blade with end caps, hub arm, central mast, and the FD
 * shield (full D bowl, counter void, and the diagonal F slot). Proportions
 * are intentionally untouched — this is the logo, not a redesign.
 *
 * Only the palette is adapted to the site's design tokens (see index.css):
 *   - light surfaces  → navy-900 ink, signal-600 hub rotors
 *   - dark footer     → paper ink, signal-500 hub rotors
 *
 * If the company ever supplies a master SVG, replace the three path
 * constants below (and public/favicon.svg) — no layout changes needed.
 */

/** Shield: D bowl outer profile + counter void (even-odd cut). */
const SHIELD =
  "M171 128 H415 A238 139 0 0 1 415 406 H232 L171 372 V314 H263 V271 L171 223 Z " +
  "M263 169 H330 A120 105 0 0 1 330 379 H263 Z";

/** Rotor assembly: blade, caps, hub arm, mast, stem. */
const ARMS =
  "M0 15 H597 V21 H0 Z " +
  "M103 0 H131 V15 H103 Z M448 0 H476 V15 H448 Z " +
  "M117 41 H269 V81 H117 Z M345 41 H462 V81 H345 Z " +
  "M269 31 H345 V81 H269 Z M291 15 H323 V31 H291 Z M287 81 H325 V128 H287 Z " +
  "M117 27 a30 30 0 1 0 0 60 a30 30 0 1 0 0 -60 Z " +
  "M462 27 a30 30 0 1 0 0 60 a30 30 0 1 0 0 -60 Z";

/** Hub rotors — the single place the signal accent touches the mark. */
const HUBS =
  "M117 27 a30 30 0 1 0 0 60 a30 30 0 1 0 0 -60 Z " +
  "M462 27 a30 30 0 1 0 0 60 a30 30 0 1 0 0 -60 Z";

export default function Logo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const ink = dark ? "#fbfaf8" : "#0e1f30";
  const accent = dark ? "#c6934a" : "#b4823c";
  return (
    <span className={cn("inline-flex select-none items-center gap-3", className)}>
      <svg viewBox="0 0 653 406" aria-hidden="true" focusable="false" className="h-[30px] w-auto shrink-0">
        <path d={SHIELD} fill={ink} fillRule="evenodd" />
        <path d={ARMS} fill={ink} />
        <path d={HUBS} fill={accent} />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="text-[15px] font-semibold tracking-[0.18em]"
          style={{ color: ink }}
        >
          FEL DRONE
        </span>
        <span
          className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.3em]"
          style={{ color: dark ? "rgba(251,250,248,0.55)" : "#6b7280" }}
        >
          El Tarf · Algérie
        </span>
      </span>
    </span>
  );
}
