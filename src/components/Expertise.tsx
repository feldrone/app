import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { controlImage } from "../lib/images";

/**
 * Capability statement — two disciplines, one standard of execution.
 * Numbered editorial rows instead of icon cards; the grayscale shot of a
 * ground station in the field anchors the discipline claim visually — the
 * operator's hands, not an aircraft type, carry the credibility.
 */
const principles = [
  {
    n: "01",
    title: "Discipline aéronautique",
    text: "Chaque mission est planifiée, briefée et supervisée selon les standards d'exigence de l'aviation — la nôtre et celle de nos clients.",
  },
  {
    n: "02",
    title: "Ingénierie embarquée",
    text: "Automatisation, systèmes embarqués et outils numériques développés en interne pour fiabiliser chaque opération de bout en bout.",
  },
  {
    n: "03",
    title: "Précision de terrain",
    text: "Du diagnostic à la restitution des données, une exécution rigoureuse, quel que soit le secteur d'application.",
  },
];

export default function Expertise() {
  return (
    <section id="expertise" aria-labelledby="expertise-heading" className="bg-white py-32 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Image — offset, editorial framing with a drawn border */}
          <div className="lg:col-span-5 lg:col-start-1">
            <Reveal>
              <figure className="lg:mr-10">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-navy-900">
                  <img
                    src={controlImage.src}
                    srcSet={controlImage.srcSet}
                    sizes={controlImage.sizes}
                    width={controlImage.width}
                    height={controlImage.height}
                    alt={controlImage.alt}
                    className="h-full w-full object-cover grayscale"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="mt-4 max-w-xs text-[13px] leading-relaxed text-mute">
                  La station de contrôle avant chaque mission : check-list, briefing,
                  collégialité, refus de l'improvisation.
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Text column */}
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <SectionHeading
              id="expertise-heading"
              eyebrow="L'expertise"
              title={
                <>
                  Deux disciplines réunies : la sécurité aérienne et l'ingénierie moderne.
                </>
              }
              lede="FEL DRONE réunit une discipline opérationnelle héritée des standards de l'aviation et une maîtrise fine des systèmes embarqués. Cette double culture structure notre manière de vendre, d'exploiter et de maintenir chaque drone : rien n'est laissé à l'approximation."
            />

            <dl className="mt-12">
              {principles.map((p, i) => (
                <Reveal key={p.n} delay={i * 90}>
                  <div className="grid grid-cols-[3.5rem_1fr] gap-x-6 border-t border-line py-7">
                    <dt className="font-display text-[22px] font-semibold text-signal-600">{p.n}</dt>
                    <dd>
                      <p className="text-[16.5px] font-semibold tracking-tight text-navy-900">{p.title}</p>
                      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
