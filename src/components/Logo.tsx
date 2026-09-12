import { useId } from "react";
import { cn } from "../utils/cn";
import { BRAND, type BrandShape } from "../brand/brandmark";

/**
 * FEL DRONE — identity lockup v5, rendered from the brand-lab geometry table
 * (scripts/brand-gen.mjs → src/brand/brandmark.ts; docs/BRAND.md). No path
 * data is hand-coded in this component: to amend the mark, change the table
 * in the brand lab once and run `npm run brand:gen`.
 *
 * v5.2 unifies the wordmark to a single FELDRONE (FEL 12u bold / DRONE 6.5u
light on one ink-locked grid) and balances the mark's spars to 26u. v5's
3° forward lean stays on the MARK group only:
 * mark, mask apertures and hubs skew as one construct, so cut-outs stay
 * concentric and monochrome reproduction holds. The horizontal optical gap
 * between mark and “FEL” now matches the internal letter rhythm — one
 * unified lockup at every size, header 30 px down to favicon 16 px.
 *
 * The mark is one engineered construct, not an ornament: the letter F read
 * as a twin-rotor airframe seen from above. The vertical stem is the fuselage
 * spine, the two horizontal bars are rotor spars — forward spar (top bar,
 * full length) and sensor spar (middle bar, shorter) — each terminating in a
 * rotor disc whose centre is drilled through the spar. The foot is the
 * landing skid. One module rules the whole mark: the spar weight (26u)
 * balances the bold half of the wordmark, rotor 1 spans 2.0 spar widths, rotor 2
 * sits one spar below on the optical mid-axis. No wings, no shield, no drone clipped
 * beside an F: remove the discs and it is still an F; remove the F logic and
 * it falls apart as an airframe.
 *
 * Geometry matches public/brand/fel-drone-*.svg exactly because both are
 * emitted from the same source. Rotor apertures are true cut-outs (mask), so
 * the mark lands correctly on paper, navy, or photography.
 */
function Shape({ s }: { s: BrandShape }) {
  return s.t === "rect" ? (
    <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} />
  ) : (
    <circle cx={s.cx} cy={s.cy} r={s.r} />
  );
}

export default function Logo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const maskId = `felmark-${uid}`;
  const ink = dark ? BRAND.colors.dark : BRAND.colors.light;
  const accent = dark ? BRAND.colors.accentDark : BRAND.colors.accentLight;
  return (
    <svg
      viewBox={`0 0 ${BRAND.lockup.width} ${BRAND.lockup.height}`}
      role="img"
      aria-label="FEL DRONE"
      focusable="false"
      fill={ink}
      className={cn("h-[30px] w-auto shrink-0 lg:h-[34px]", className)}
    >
      <defs>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill="#fff" />
          <g fill="#000">
            {BRAND.holes.map((c) => (
              <Shape key={`${c.cx}:${c.cy}`} s={c} />
            ))}
          </g>
        </mask>
      </defs>
      <g transform={BRAND.lockup.markTransform}>
        <g fill={ink} mask={`url(#${maskId})`}>
          {BRAND.mark.map((s) => (
            <Shape key={JSON.stringify(s)} s={s} />
          ))}
        </g>
        <g fill={accent}>
          {BRAND.hubs.map((c) => (
            <Shape key={`${c.cx}:${c.cy}`} s={c} />
          ))}
        </g>
      </g>
      <g fill="none" stroke={ink} strokeLinecap="butt" strokeLinejoin="miter">
        {BRAND.glyphs.map((g) => (
          <path
            key={g.x}
            strokeWidth={g.w}
            transform={`translate(${g.x} ${g.y}) scale(${BRAND.lockup.glyphScale})`}
            d={g.d}
          />
        ))}
      </g>
    </svg>
  );
}
