import { cn } from "../utils/cn";
import { BRAND } from "../brand/brandmark";

/**
 * FELDRONE — identity lockup v6.0, rendered from the brand-lab geometry
 * table (scripts/brand-gen.mjs → src/brand/brandmark.ts; docs/BRAND.md).
 * No path data is hand-coded in this component: to amend the mark, change
 * the table once and run `npm run brand:gen`.
 *
 * The mark is a unified F/D counter monogram on a strict 136 × 160 grid:
 * a flat-shouldered D ring (bowl r 80 / counter r 56, module 4u) in which
 * the shared stem and top edge are simultaneously the F — closed by a free
 * mid arm whose chiselled tip stops 7u short of the bowl wall. That
 * negative-space channel is the merge: the counter stays ONE connected
 * region (no B or P read), any ground flows through the mark, and the F
 * projects through the D. One stroke weight (T = 24) across symbol and
 * wordmark; the wordmark is the single word FELDRONE (10u on the 64 cap
 * grid). No dots, no literal drone parts, no masks — the counter is a true
 * even-odd through-hole, so the lockup is flawless in pure monochrome on
 * any ground by construction.
 */
export default function Logo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const ink = dark ? BRAND.colors.dark : BRAND.colors.light;
  return (
    <svg
      viewBox={`0 0 ${BRAND.lockup.width} ${BRAND.lockup.height}`}
      role="img"
      aria-label="FELDRONE"
      focusable="false"
      className={cn("h-[30px] w-auto shrink-0 lg:h-[34px]", className)}
    >
      <g transform={BRAND.lockup.markTransform}>
        <path fill={ink} fillRule="evenodd" d={BRAND.ring} />
        <path fill={ink} d={BRAND.arm} />
      </g>
      <g
        fill="none"
        stroke={ink}
        strokeWidth={BRAND.lockup.strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        {BRAND.glyphs.map((g) => (
          <path
            key={g.x}
            transform={`translate(${g.x} ${g.y}) scale(${BRAND.lockup.glyphScale})`}
            d={g.d}
          />
        ))}
      </g>
    </svg>
  );
}
