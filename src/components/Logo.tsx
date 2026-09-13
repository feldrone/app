import { cn } from "../utils/cn";
import { BRAND, type BrandLockup } from "../brand/brandmark";

/**
 * FELDRONE — identity lockups v6.1, rendered from the brand-lab geometry
 * table (scripts/brand-gen.mjs → src/brand/brandmark.ts; docs/BRAND.md).
 * No path data is hand-coded in this component.
 *
 * v6.1 enforces the client correction of 2026-09-13: the horizontal lockup
 * keeps a strict ≥ 24u clear space between the FD monogram and the word
 * (the 15.2u gap let the ring fuse optically with the leading F and the
 * lockup misread as “DFELDRONE”), and mobile / constrained viewports get
 * the STACKED build — symbol centred above the word — so the risky
 * side-by-side pairing never renders below the sm breakpoint. Exactly one
 * variant is in the accessibility tree per viewport.
 *
 * The mark: flat-shouldered D ring (bowl r 80 / counter r 56, module 4u)
 * whose shared stem, top edge and chiselled floating mid arm are
 * simultaneously the F; the 7.4u tip channel keeps the counter one
 * connected region and lets any ground flow through. One stroke weight
 * (T = 24) across symbol and word; FELDRONE is one word at 10u. No dots,
 * no masks, no colour inside the logo — monochrome-first by construction.
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
        <path fill={ink} fillRule="evenodd" d={BRAND.ring} />
        <path fill={ink} d={BRAND.arm} />
      </g>
      <g
        fill="none"
        stroke={ink}
        strokeWidth={spec.strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        {spec.glyphs.map((g) => (
          <path
            key={`${spec.width}:${g.x}`}
            transform={`translate(${g.x} ${g.y}) scale(${spec.glyphScale})`}
            d={g.d}
          />
        ))}
      </g>
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
