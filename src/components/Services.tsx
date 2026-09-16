import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { services } from "../data/content";
import { requestQuote } from "../utils/quote";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { cn } from "../utils/cn";

/**
 * V10 Services — seven poles, three primary (topographie, suivi, maintenance)
 * Primary cards larger, secondary quieter (vente, location).
 * No prices, truthful wording: sur devis, tarification selon la mission, étude selon le besoin.
 * Vente and Location quieter than main blocks per spec.
 */
export default function Services() {
  const primary = services.filter((s) => s.priority === "primary");
  const secondary = services.filter((s) => s.priority === "secondary");

  return (
    <section id="services" aria-labelledby="services-heading" className="bg-paper py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          id="services-heading"
          eyebrow="Nos services"
          title="Sept pôles, trois priorités — le reste sur devis."
          lede="Topographie & photogrammétrie, suivi & inspection de chantier, maintenance & diagnostic drone en priorité. Thermographie, agriculture, vente, location en appui — chaque mission cadrée par devis, tarification selon la mission, étude selon le besoin."
          className="mb-14 lg:mb-20"
        />

        {/* Primary — larger, visually prioritized */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {primary.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 90} className="md:col-span-1">
              <ServiceCard service={service} primary />
            </Reveal>
          ))}
        </div>

        {/* Secondary — quieter */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {secondary.map((service, i) => (
            <Reveal key={service.slug} delay={i * 70} className="">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 max-w-3xl text-[12.5px] leading-relaxed text-mute">
            Aucun prix affiché, aucun modèle, capteur, autonomie, précision ou certification
            inventé. Les mentions &quot;À compléter&quot; signalent les informations non
            vérifiées. Sur devis, tarification selon la mission, étude selon le besoin.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  primary = false,
}: {
  service: (typeof services)[number];
  primary?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `service-steps-${service.slug}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden border bg-white transition-[box-shadow,transform,border-color] duration-300 ease-out",
        primary
          ? "border-line hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_48px_-28px_rgba(14,31,48,0.35)]"
          : "border-line/80 hover:border-line-strong",
      )}
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-navy-900">
        <img
          src={service.image.src}
          srcSet={service.image.srcSet}
          sizes="(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw"
          width={service.image.width}
          height={service.image.height}
          alt={service.image.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full scale-[1.001] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute top-4 left-4 bg-white/95 px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.18em] text-navy-900 uppercase">
          {service.index} — {service.tag}
        </span>
        {primary && (
          <span className="absolute top-4 right-4 bg-signal-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
            Priorité
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7 lg:p-7">
        <h3
          className={cn(
            "font-display leading-tight font-medium tracking-tight text-navy-900",
            primary ? "text-[1.35rem]" : "text-[1.15rem]",
          )}
        >
          {service.title}
        </h3>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">{service.intro}</p>

        <ul className="mt-4 space-y-1.5" aria-label={`Ce que couvre ${service.title.toLowerCase()}`}>
          {service.points.map((point) => (
            <li key={point} className="flex items-baseline gap-2.5 text-[12.5px] leading-snug text-ink">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-signal-600" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-5 inline-flex min-h-10 w-fit items-center gap-1.5 border-b border-transparent py-1 text-[11.5px] font-semibold tracking-wide text-navy-700 uppercase transition-colors hover:border-navy-700 hover:text-navy-900"
        >
          Comment ça fonctionne ?
          <ChevronDown size={12} className={cn("transition-transform duration-300", open && "rotate-180")} aria-hidden="true" />
        </button>
        <div
          id={panelId}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
            open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <ol className="overflow-hidden" role="list">
            {service.steps.map((step, idx) => (
              <li key={step} className="flex gap-3 py-[4px] text-[12.5px] leading-snug text-ink-soft first:pt-0 last:pb-0">
                <span className="w-4 shrink-0 font-display text-[11px] font-semibold text-signal-600 tabular-nums">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => requestQuote(service.title)}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-[12.5px] font-medium tracking-wide transition-[background-color,transform,box-shadow] duration-200 active:translate-y-px sm:w-auto",
              primary
                ? "bg-navy-900 text-white shadow-[0_12px_24px_-16px_rgba(14,31,48,0.6)] hover:bg-navy-800"
                : "border border-line-strong bg-white text-navy-900 hover:border-navy-900 hover:bg-paper",
            )}
          >
            {service.cta.label}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
