import { pillars } from "../data/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { cn } from "../utils/cn";

/**
 * The four business poles — editorial alternating rows.
 * Each row pairs a large index, a serif title, the registered scope of the
 * activity and its concrete capabilities. Photography keeps one consistent
 * documentary framing; the offset rule marks the image like a plate legend.
 */
export default function Pillars() {
  return (
    <section id="poles" aria-labelledby="poles-heading" className="bg-paper py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          id="poles-heading"
          eyebrow="Nos quatre pôles"
          title="Quatre activités indissociables, une seule exigence."
          lede="Commerce, location, maintenance et prestations de services forment un ensemble cohérent : nous maîtrisons l'appareil du premier achat jusqu'à la donnée livrée sur le terrain."
          className="mb-14 lg:mb-20"
        />

        <div className="divide-y divide-line border-t border-line">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.index}>
              <article className="grid grid-cols-1 items-center gap-9 py-14 lg:grid-cols-12 lg:gap-12 lg:py-18">
                {/* Visual — alternate sides without churning the text order in the DOM */}
                <div className={cn("lg:col-span-6", i % 2 === 1 ? "lg:order-2 lg:pl-6" : "lg:order-1 lg:pr-6")}>
                  <figure className={cn("relative", i % 2 === 1 ? "lg:ml-6" : "lg:mr-6")}>
                    <span
                      className="absolute -bottom-3 right-3 -z-10 hidden h-full w-full border border-line-strong bg-white sm:block"
                      aria-hidden="true"
                    />
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-900">
                      <img
                        src={pillar.image.src}
                        srcSet={pillar.image.srcSet}
                        sizes={pillar.image.sizes}
                        width={pillar.image.width}
                        height={pillar.image.height}
                        alt={pillar.image.alt}
                        className="h-full w-full scale-[1.001] object-cover transition-transform duration-700 ease-out hover:scale-[1.045]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </figure>
                </div>

                {/* Text */}
                <div className={cn("lg:col-span-6", i % 2 === 1 ? "lg:order-1 lg:pr-10" : "lg:order-2 lg:pl-10")}>
                  <p className="flex items-baseline gap-4">
                    <span className="font-display text-[34px] leading-none font-medium text-signal-600">
                      {pillar.index}
                    </span>
                    <span className="h-px w-10 bg-line-strong" aria-hidden="true" />
                  </p>
                  <h3 className="mt-4 font-display text-[1.65rem] leading-tight font-medium tracking-tight text-navy-900 sm:text-[1.9rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-ink-soft">
                    {pillar.summary}
                  </p>
                  <ul className="mt-7 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2" aria-label={`Capacités — ${pillar.title}`}>
                    {pillar.points.map((point) => (
                      <li key={point} className="bg-white px-4.5 py-3.5 text-[13.5px] leading-snug font-medium text-ink">
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
