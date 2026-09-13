import { cn } from "../utils/cn";
import { BRAND, type BrandLockup } from "../brand/brandmark";

/**
 * FELDRONE — identity lockups v7.2 “THE CLEARANCE”, rendered from the
 * brand-lab geometry table (scripts/brand-gen.mjs → src/brand/brandmark.ts;
 * docs/BRAND.md). No path data is hand-coded in this component.
 *
 * The mark is three solid rectilinear blocks — a slab and two shelves — and
 * the F is the clearance they leave between them: a negative-relief letter,
 * the instrument of the trade (fit, calibration, precision), never a drone
 * part. One grid (4u unit, 32u module), ink = void at every scale, and 45°
 * as the only non-right angle: the shelves’ chamfers and the D/O/R bowl
 * cuts are the same grammar, so symbol and wordmark read as one system.
 * Flat fills, even-odd counters, integer coordinates — no strokes, no
 * gradients, no frames; any ground carries it.
 *
 * Tiers: MASTER (these lockups, ≥ 64 px incl. the header/footer renders),
 * COMPACT (the symbol alone at 40–64 px), MICRO (16–32 px: chamfers
 * deleted — see public/favicon.svg and fel-drone-symbol-micro.svg). The
 * wordmark is never shown below COMPACT. Mobile gets the STACKED build
 * automatically; the horizontal lockup ships a 32u mark→word clearance
 * (≥ 24u floor), so the pairing can never fuse.
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
