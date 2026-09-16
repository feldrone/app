import { cn } from "../utils/cn";
import { BRAND, type BrandLockup } from "../brand/brandmark";

/**
 * FEL DRONE — V12 "QUAD FD" lockups (reference-derived symbol).
 *
 * The emblem is one drawing, generated from a single geometry source
 * (scripts/brand-gen.mjs → src/brand/brandmark.ts). A front-view quadcopter —
 * two rotor blades over two round motor hubs, joined by two arms to a small
 * central body — is seated on a heavy geometric F+D monogram. The rotor hubs
 * are the monogram's own mount points (the left hub is concentric with the F
 * stem axis, the right one rides the D stem axis) and the airframe overlaps the
 * letterforms, so the emblem reads as ONE engineered symbol: FEL, DRONE,
 * aviation, technology — recognisable as a mark at 26 px, legible as a lockup
 * in the header.
 *
 * The wordmark is typeset in the project's real typeface, IBM Plex Sans 700 —
 * a technical grotesque with squared terminals that matches the reference's
 * geometric, engineering character. It is never distorted: each word is set at
 * the measured advance for a 104u cap height and the 48u word space is the
 * brand's own, so the name can never fuse into "FELDRONE". The exported SVG
 * assets keep the vector construction of the same letterforms for print
 * (see public/brand/ and docs/BRAND.md).
 *
 * Tiers: MASTER (these lockups, ≥ 40 px), COMPACT (the emblem alone),
 * MICRO (16–32 px favicon: the 8u blades are deleted — sub-pixel at that size —
 * and the drawing falls back to hubs, body and monogram).
 */
const { type } = BRAND;

function Wordmark({
  felX,
  droneX,
  baseline,
  ink,
}: {
  felX: number;
  droneX: number;
  baseline: number;
  ink: string;
}) {
  const common = {
    y: baseline,
    fill: ink,
    fontFamily: "var(--font-wordmark, 'IBM Plex Sans')",
    fontWeight: 700,
    fontSize: type.size,
    lengthAdjust: "spacing" as const,
  };
  return (
    <>
      <text x={felX} {...common} textLength={type.fel}>
        FEL
      </text>
      <text x={droneX} {...common} textLength={type.drone}>
        DRONE
      </text>
    </>
  );
}

function Lockup({ spec, ink, className }: { spec: BrandLockup; ink: string; className?: string }) {
  const stacked = spec.wordX === type.stackFelX;
  return (
    <svg
      viewBox={`0 0 ${spec.w} ${spec.h}`}
      role="img"
      aria-label="FEL DRONE"
      focusable="false"
      // The lockup is a Latin brand mark: it must lay out left-to-right even
      // when the page is RTL (Arabic ships the very same lockup — the logo is
      // never mirrored, so the mark keeps reading F→D in every language).
      style={{ direction: "ltr" }}
      className={cn("w-auto shrink-0", className)}
    >
      <g fill={ink} fillRule="nonzero">
        <g transform={`translate(${spec.markX} ${spec.markY})`}>
          <path d={BRAND.mark} />
        </g>
      </g>
      <Wordmark
        felX={stacked ? type.stackFelX : type.felX}
        droneX={stacked ? type.stackDroneX : type.droneX}
        baseline={spec.baseline}
        ink={ink}
      />
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
      <Lockup spec={BRAND.stacked} ink={ink} className={cn("block h-[46px] sm:hidden", className)} />
      <Lockup spec={BRAND.lockup} ink={ink} className={cn("hidden h-[30px] sm:block", className)} />
    </>
  );
}
