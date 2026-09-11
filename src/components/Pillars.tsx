import { pillars } from "../data/content";
import Reveal from "./Reveal";
import { cn } from "../utils/cn";

export default function Pillars() {
  return (
    <section id="poles" aria-labelledby="poles-heading" className="bg-[#fbfaf8] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 max-w-2xl lg:mb-24">
          <Reveal>
            <p className="mb-5 flex items-center gap-3 text-[12px] font-medium tracking-[0.24em] text-[#6b7280] uppercase">
              <span className="h-px w-8 bg-[#b4823c]" aria-hidden="true" />
              Nos 4 pôles
            </p>
            <h2 id="poles-heading" className="font-display text-3xl font-semibold tracking-tight text-[#0e1f30] sm:text-4xl">
              Quatre activités indissociables, une seule exigence.
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-[#3a3f47]">
              Commerce, location, maintenance et prestations de services forment un ensemble
              cohérent : nous maîtrisons l'appareil du premier achat jusqu'à la donnée livrée sur
              le terrain.
            </p>
          </Reveal>
        </div>

        <div className="divide-y divide-[#e4e2dd] border-t border-[#e4e2dd]">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title}>
              <article
                className={cn(
                  "grid grid-cols-1 items-center gap-8 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20",
                )}
              >
                <div
                  className={cn(
                    "lg:col-span-6",
                    i % 2 === 1 ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e1f30]">
                    <img
                      src={pillar.image}
                      alt={pillar.imageAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className={cn("lg:col-span-6", i % 2 === 1 ? "lg:order-1" : "lg:order-2")}>
                  <span className="font-display text-sm font-medium text-[#b4823c]">{pillar.index}</span>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#0e1f30] sm:text-[1.75rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-[#3a3f47]">
                    {pillar.summary}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[14.5px] text-[#12151a]">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b4823c]" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
