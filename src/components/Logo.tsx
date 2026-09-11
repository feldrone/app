import { cn } from "../utils/cn";

/**
 * Original wordmark + geometric mark for FEL DRONE.
 * The mark is a minimal delta form — evoking both a wing and an aerial
 * viewpoint — rendered in a single flat tone so it stays legible at any
 * size and never competes with the deep-navy / signal accent system.
 */
export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  const ink = dark ? "#fbfaf8" : "#0e1f30";
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 5 L34 32 L20 25.5 L6 32 Z" fill={ink} />
        <path d="M20 5 L20 25.5 L34 32 Z" fill={ink} fillOpacity="0.45" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[15px] font-semibold tracking-[0.14em]"
          style={{ color: ink }}
        >
          FEL DRONE
        </span>
        <span
          className="mt-1 text-[9px] font-medium tracking-[0.28em] uppercase"
          style={{ color: dark ? "rgba(251,250,248,0.6)" : "#8a8f98" }}
        >
          El Tarf · Algérie
        </span>
      </span>
    </span>
  );
}
