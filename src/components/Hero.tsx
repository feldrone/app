import { ArrowRight, PhoneCall } from "lucide-react";
import Reveal from "./Reveal";
import { company, sectors } from "../data/content";
import { heroImage } from "../lib/images";

/**
 * First viewport: who we are, what we do, why trust us, what to do next.
 * Asymmetric editorial split (7/5). Trust comes from operational scope —
 * never from registry numbers, capital figures or administrative plates,
 * which do not belong in a marketing layout.
 */
export default function Hero() {
  return (
    <section id="accueil" aria-label="Présentation de FEL DRONE" className="relative overflow-hidden bg-paper pb-20 pt-[calc(var(--header-h)+4.5rem)] lg:pb-24 lg:pt-[calc(var(--header-h)+7rem)]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-x-10 gap-y-16 px-6 lg:grid-cols-12 lg:px-12">
        {/* Text column — intentionally asymmetric (7/12) */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="mb-7 flex items-start gap-3">
              <span className="mt-2 h-px w-8 shrink-0 bg-signal-600" aria-hidden="true" />
              <p className="max-w-md text-[13.5px] leading-relaxed text-ink-soft sm:text-[14.5px]">
                Spécialiste en maintenance, diagnostic, calibration et prestations
                de services par drone.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-[2.45rem] leading-[1.06] font-medium tracking-[-0.015em] text-navy-900 sm:text-[3.1rem] lg:text-[3.6rem]">
              Des drones professionnels,
              <br className="hidden sm:block" /> exploités comme des aéronefs.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              {company.legalName} vend, loue, assure la maintenance et opère des flottes de
              drones professionnels depuis {company.city}. Une discipline d'exécution
              inspirée de l'aviation, appliquée à l'agriculture, au BTP, à l'industrie et à
              la sécurité civile.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="group inline-flex w-full items-center justify-center gap-2.5 bg-navy-900 px-8 py-4 text-[14px] font-medium tracking-wide text-white shadow-[0_18px_36px_-18px_rgba(14,31,48,0.7)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-navy-800 hover:shadow-[0_22px_40px_-18px_rgba(14,31,48,0.75)] active:translate-y-px sm:w-auto"
              >
                Demander un devis
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href="#services"
                className="inline-flex w-full items-center justify-center border border-line-strong bg-white px-8 py-4 text-[14px] font-medium tracking-wide text-navy-900 transition-[border-color,background-color] duration-200 hover:border-navy-900 hover:bg-paper active:translate-y-px sm:w-auto"
              >
                Découvrir nos services
              </a>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <a
              href={`tel:${company.phoneHref}`}
              className="mt-9 inline-flex items-center gap-2.5 text-[14px] font-medium text-ink-soft transition-colors hover:text-navy-900"
            >
              <PhoneCall size={15} className="text-signal-600" aria-hidden="true" />
              {company.phone} — ligne directe
            </a>
          </Reveal>
        </div>

        {/* Image column — 5/12, full-height portrait crop */}
        <div className="relative lg:col-span-5">
          <Reveal delay={120}>
            <figure className="relative">
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-navy-900 sm:aspect-[4/3] lg:aspect-[4/5] lg:h-full lg:min-h-[540px]">
                <img
                  src={heroImage.src}
                  srcSet={heroImage.srcSet}
                  sizes={heroImage.sizes}
                  width={heroImage.width}
                  height={heroImage.height}
                  alt={heroImage.alt}
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" aria-hidden="true" />
              </div>
            </figure>
          </Reveal>
        </div>
      </div>

      {/* Application fields rail — capability data, not a card grid */}
      <Reveal delay={200}>
        <div className="mx-auto mt-24 max-w-[1400px] border-t border-line px-6 lg:px-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-9 py-12 sm:grid-cols-4">
            {sectors.map((sector) => (
              <div key={sector.label} className="border-l border-line pl-5">
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
                  {sector.label}
                </dt>
                <dd className="mt-2 text-[15px] font-semibold leading-snug tracking-tight text-navy-900">
                  {sector.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
