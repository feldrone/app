import { ArrowRight, PhoneCall } from "lucide-react";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="accueil" aria-label="Introduction" className="relative overflow-hidden bg-[#fbfaf8] pt-32 lg:pt-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* Text column — intentionally asymmetric (7/12) */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <Reveal>
            <p className="mb-6 flex items-center gap-3 text-[12px] font-medium tracking-[0.24em] text-[#6b7280] uppercase">
              <span className="h-px w-8 bg-[#b4823c]" aria-hidden="true" />
              Vente · Location · Maintenance · Services
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-[2.5rem] leading-[1.08] font-semibold tracking-tight text-[#0e1f30] sm:text-[3.25rem] lg:text-[3.75rem]">
              L'excellence aéronautique au service des technologies de demain.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-[#3a3f47]">
              SARL FEL DRONE conçoit, exploite et entretient des flottes de drones professionnels
              depuis El Tarf. Une rigueur héritée de l'aviation militaire, appliquée à l'agriculture,
              au BTP, à l'industrie et à la sécurité civile.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 bg-[#0e1f30] px-7 py-4 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-[#15304a]"
              >
                Demander une expertise
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#poles"
                className="inline-flex items-center justify-center gap-2 border border-[#d8d5cd] px-7 py-4 text-[14px] font-medium tracking-wide text-[#0e1f30] transition-colors hover:border-[#0e1f30]"
              >
                Découvrir nos activités
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <a
              href={`tel:${"+213661613399"}`}
              className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-[#3a3f47] hover:text-[#0e1f30]"
            >
              <PhoneCall size={15} className="text-[#b4823c]" />
              +213 6 61 61 33 99 — Ligne directe
            </a>
          </Reveal>
        </div>

        {/* Image column — 5/12, full-bleed to the right edge on desktop */}
        <div className="relative lg:col-span-5">
          <Reveal delay={120} className="relative h-full">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0e1f30] sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              <img
                src="/images/hero-drone.jpg"
                alt="Drone professionnel agricole en vol sous un ciel spectaculaire"
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1622]/50 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 left-6 hidden max-w-[220px] border border-[#e4e2dd] bg-white px-5 py-4 shadow-[0_10px_30px_-15px_rgba(14,31,48,0.35)] sm:block">
              <p className="text-[11px] tracking-[0.16em] text-[#6b7280] uppercase">Immatriculation</p>
              <p className="mt-1 font-display text-[15px] font-semibold text-[#0e1f30]">RC N° 776099</p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Facts strip — editorial, not a card grid */}
      <Reveal delay={200}>
        <div className="mx-auto mt-20 max-w-[1400px] border-t border-[#e4e2dd] px-6 lg:px-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-4">
            {[
              { label: "Siège social", value: "El Tarf, Algérie" },
              { label: "Capital social", value: "1 000 000 DA" },
              { label: "Registre de commerce", value: "N° 776099" },
              { label: "Pilotes", value: "Certifiés Classe 3" },
            ].map((fact) => (
              <div key={fact.label} className="border-l border-[#e4e2dd] pl-5">
                <dt className="text-[11px] font-medium tracking-[0.14em] text-[#6b7280] uppercase">{fact.label}</dt>
                <dd className="mt-2 font-display text-[17px] font-medium text-[#0e1f30]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
