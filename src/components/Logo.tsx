import { cn } from "../utils/cn";
import { BRAND, type BrandLockup } from "../brand/brandmark";

/**
 * FEL DRONE — identity lockups v8 “ROTOR F”, rendered from the brand
 * generator (scripts/brand-gen.mjs → src/brand/brandmark.ts; docs/BRAND.md).
 * No path data is hand-coded in this component.
 *
 * The mark is ONE symbol: the F letterform built as a machine. The stem is
 * the spar; the top and mid arms terminate at their hub centers and drive two
 * rotors — the primary rotor (⌀ 64u, grounded to the top and right edges) and
 * the secondary (⌀ 48u, floating 8u off the floor). Every rotor follows the
 * same radial law — band 12u, aperture 8u — so the counter of the F IS the
 * rotor: recognizable at any size without the wordmark, because the wordmark
 * begins with the same letter. Nonzero winding does the booleans: the arms
 * cross the apertures and open them as a "C" exactly where the spar meets the
 * motor; nothing tangents, nothing slivers, nothing floats.
 *
 * The site renders the mark in ink only — the gold hub jewel is a brand-asset
 * exclusive (fel-drone-mark-accent.svg); color inside the UI stays a site
 * token. Flat fills, integer grid, no strokes, no gradients, no frames.
 *
 * Tiers: MASTER (these lockups, ≥ 64 px incl. the header/footer renders),
 * COMPACT (the symbol alone at 40–64 px), MICRO (16–32 px: a DIFFERENT,
 * correct drawing — the apertures are deleted and the rotors render as solid
 * discs, so nothing pinches; see public/favicon.svg). Mobile gets the
 * STACKED build automatically; the horizontal lockup ships a 32u mark→word
 * clearance and a 48u word-space between FEL and DRONE, so the pairing can
 * never fuse.
 */
function Lockup({ spec, ink, className }: { spec: BrandLockup; ink: string; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${spec.w} ${spec.h}`}
      role="img"
      aria-label="FEL DRONE"
      focusable="false"
      className={cn("w-auto shrink-0", className)}
    >
      <g fill={ink} fillRule="nonzero">
        <path d={BRAND.mark} transform={`translate(${spec.markX} ${spec.markY})`} />
        <path d={BRAND.word} transform={`translate(${spec.wordX} ${spec.baseline - 104})`} />
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
