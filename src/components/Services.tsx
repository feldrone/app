import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { services } from "../data/content";
import { requestQuote } from "../utils/quote";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { cn } from "../utils/cn";

/**
 * The five services — premium cards on one editorial grid. Three portrait
 * cards up top, two wider cards below, so the fifth never dangles. Each
 * card: real UAV photography (zoom-on-hover, never cropped awkwardly —
 * fixed 16/10 frame), a short precise claim, up to three proof points, an
 * expandable "Comment ça fonctionne" workflow, and one CTA that prefills
 * the quote form with the service already selected. No text walls: depth
 * lives behind the disclosure, not on the card face.
 */
export default function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-paper py-32 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          id="services-heading"
          eyebrow="Nos services"
          title="Cinq façons de travailler avec FEL DRONE."
          lede="Du premier achat à la donnée livrée sur le terrain : chaque service suit un processus clair, cadré par devis, sans zone grise."
          className="mb-16 lg:mb-24"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6 xl:gap-8">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={(i % 3) * 90}
              className={cn("md:col-span-1 xl:col-span-2", i === 4 && "md:col-span-2", i > 2 && "xl:col-span-3")}
            >
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const [open, setOpen] = useState(false);
  const panelId = `service-steps-${service.slug}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-line bg-white transition-[box-shadow,transform,border-color] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_48px_-28px_rgba(14,31,48,0.35)]",
      )}
    >
      {/* Photography — consistent 16/10 frame, quiet zoom on hover */}
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-navy-900">
        <img
          src={service.image.src}
          srcSet={service.image.srcSet}
          sizes="(max-width: 767px) 92vw, (max-width: 1279px) 45vw, (max-width: 1535px) 29vw, 31vw"
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
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-7 sm:p-8 lg:p-9">
        <h3 className="font-display text-[1.45rem] leading-tight font-medium tracking-tight text-navy-900">
          {service.title}
        </h3>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{service.intro}</p>

        <ul className="mt-5 space-y-1.5" aria-label={`Ce que couvre ${service.title.toLowerCase()}`}>
          {service.points.map((point) => (
            <li key={point} className="flex items-baseline gap-2.5 text-[13px] leading-snug text-ink">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-signal-600" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>

        {/* Workflow disclosure */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-6 inline-flex min-h-11 w-fit items-center gap-1.5 border-b border-transparent py-1 text-[12.5px] font-semibold tracking-wide text-navy-700 uppercase transition-colors hover:border-navy-700 hover:text-navy-900"
        >
          Comment ça fonctionne&nbsp;?
          <ChevronDown size={13} className={cn("transition-transform duration-300", open && "rotate-180")} aria-hidden="true" />
        </button>
        <div
          id={panelId}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
            open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <ol className="overflow-hidden" role="list">
            {service.steps.map((step, idx) => (
              <li key={step} className="flex gap-3 py-[5px] text-[13px] leading-snug text-ink-soft first:pt-0 last:pb-0">
                <span className="w-4 shrink-0 font-display text-[12px] font-semibold text-signal-600 tabular-nums">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA — one per card, primary rhythm */}
        <div className="mt-auto pt-7">
          <button
            type="button"
            onClick={() => requestQuote(service.title)}
            className="inline-flex w-full items-center justify-center gap-2 bg-navy-900 px-6 py-3.5 text-[13.5px] font-medium tracking-wide text-white shadow-[0_12px_24px_-16px_rgba(14,31,48,0.6)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-navy-800 active:translate-y-px sm:w-auto"
          >
            {service.cta.label}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
