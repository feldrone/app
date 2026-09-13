import { cn } from "../utils/cn";
import { BRAND, type BrandLockup } from "../brand/brandmark";

/**
 * FELDRONE — identity lockups v7.0 "THE VANE", rendered from the brand-lab
 * geometry table (scripts/brand-gen.mjs → src/brand/brandmark.ts;
 * docs/BRAND.md). No path data is hand-coded in this component.
 *
 * The mark is a proprietary F built as a windsock seen at rest-to-wind:
 * a mast stem, a top arm that is a tapered cone (flat top edge, a single
 * rising underside, square-cut open end) and a shorter airflow bar. The
 * word's own F carries the identical wedge at 12u — the symbol is the
 * letter, the letter is the symbol. Everything is flat filled geometry on
 * an integer grid (one ring, even-odd counters); one weight language,
 * monochrome by construction, so any ground — paper, navy, black, white —
 * carries it without a single extra rule.
 *
 * The horizontal lockup keeps the ≥ 24u clear space between mark and word
 * (the build ships 28u); mobile / constrained viewports get the STACKED
 * build — mark centred above the word — so the risky side-by-side pairing
 * never renders below the sm breakpoint. Exactly one variant is in the
 * accessibility tree per viewport.
 */
function Lockup({ spec, ink, className }: { spec: BrandLockup; ink: string; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${spec.width} ${spec.height}`}
      role="img"
      aria-label="FELDRONE"
      focusable="false"
      className={cn("w-auto shrink-0", className)}
    >
      <g transform={spec.markTransform}>
        <path fill={ink} fillRule="evenodd" d={BRAND.mark} />
      </g>
      {spec.glyphs.map((g) => (
        <path
          key={`${spec.width}:${g.x}`}
          transform={`translate(${g.x} ${g.y})`}
          fill={ink}
          fillRule="evenodd"
          d={g.d}
        />
      ))}
    </svg>
  );
}

export default function Logo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const ink = dark ? BRAND.colors.dark : BRAND.colors.light;
  return (
    <>
      <Lockup spec={BRAND.stacked} ink={ink} className={cn("block h-[44px] sm:hidden", className)} />
      <Lockup spec={BRAND.lockup} ink={ink} className={cn("hidden h-[30px] sm:block lg:h-[34px]", className)} />
    </>
  );
}
