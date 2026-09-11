import { cn } from "../utils/cn";

/**
 * FEL DRONE lockup — delta mark + wordmark.
 * The mark's geometry (delta / wing / aerial-view form) is preserved from
 * the project's original identity file; it renders as a flat, single-tone
 * SVG so it stays crisp at any size and never competes with the
 * navy / signal system. No glow, no gradients, no effects.
 */
export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  const ink = dark ? "#fbfaf8" : "#0e1f30";
  const caption = dark ? "rgba(251,250,248,0.55)" : "#6b7280";
  return (
    <span className={cn("inline-flex select-none items-center gap-2.5", className)}>
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
        <path d="M20 5 L34 32 L20 25.5 L6 32 Z" fill={ink} />
        <path d="M20 5 L20 25.5 L34 32 Z" fill={ink} fillOpacity="0.45" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="text-[15px] font-semibold tracking-[0.16em]"
          style={{ color: ink }}
        >
          FEL DRONE
        </span>
        <span
          className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.3em]"
          style={{ color: caption }}
        >
          El Tarf · Algérie
        </span>
      </span>
    </span>
  );
}
