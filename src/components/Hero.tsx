import { ArrowRight, PhoneCall } from "lucide-react";
import Reveal from "./Reveal";
import { company, facts } from "../data/content";
import { heroImage } from "../lib/images";

/**
 * First viewport: who we are, what we do, why trust us, what to do next.
 * Asymmetric editorial split (7/5), no marketing superlatives, legal
 * facts used as the trust signal instead of decorative badges.
 */
export default function Hero() {
  return (
    <section id="accueil" aria-label="Présentation de FEL DRONE" className="relative overflow-hidden bg-paper pt-[calc(var(--header-h)+3.5rem)] lg:pt-[calc(var(--header-h)+5rem)]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:gap-10 lg:px-12">
        {/* Text column — intentionally asymmetric (7/12) */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="mb-7 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-mute sm:text-[12px]">
              <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
              Vente · Location · Maintenance · Services
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-[2.45rem] leading-[1.06] font-medium tracking-[-0.015em] text-navy-900 sm:text-[3.1rem] lg:text-[3.6rem]">
              Des drones professionnels,
              <br className="hidden sm:block" /> exploités comme des aéronefs.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              {company.legalName} vend, loue, entretient et opère des flottes de drones
              professionnels depuis {company.city}. Une discipline d'exécution héritée de
              l'aviation, appliquée à l'agriculture, au BTP, à l'industrie et à la sécurité
              civile.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 bg-navy-900 px-7 py-4 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-navy-800"
              >
                Demander un devis
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href="#poles"
                className="inline-flex items-center justify-center border border-line-strong px-7 py-4 text-[14px] font-medium tracking-wide text-navy-900 transition-colors hover:border-navy-900"
              >
                Découvrir nos quatre pôles
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
              {/* Registration plate — legal identity used as visual anchor */}
              <figcaption className="absolute bottom-5 left-5 max-w-[230px] border border-white/25 bg-navy-950/70 px-5 py-4 backdrop-blur-[2px] sm:bottom-6 sm:left-6">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/70">
                  Registre de commerce
                </p>
                <p className="mt-1.5 font-display text-[15px] font-semibold text-white">
                  N° {company.rc} · Aïn El Assel
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>

      {/* Corporate facts strip — editorial data rail, not a card grid */}
      <Reveal delay={200}>
        <div className="mx-auto mt-20 max-w-[1400px] border-t border-line px-6 lg:px-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="border-l border-line pl-5">
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-[17px] font-semibold tracking-tight text-navy-900">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
