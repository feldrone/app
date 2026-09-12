/**
 * Cross-component handshake for the quote flow: service cards and hero CTAs
 * prefill the contact form with the chosen service, then bring it into view.
 * Uses a CustomEvent so no state library is needed; harmless no-op if the
 * form is not mounted (it is a static section, so it always is).
 */
export const PREFILL_EVENT = "fel:prefill-service";

export function requestQuote(serviceLabel: string) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: serviceLabel }));
  const el = document.getElementById("contact");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // Focus the name field once the scroll settles — focus lands after motion.
  window.setTimeout(
    () => {
      document.getElementById("quote-form")?.querySelector<HTMLInputElement>("#quote-name")?.focus({ preventScroll: true });
    },
    reduce ? 0 : 520,
  );
}
