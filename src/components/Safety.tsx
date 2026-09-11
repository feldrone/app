import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { safetyImage } from "../lib/images";

/**
 * Operational standards — the single intentional dark band on the page,
 * used as a register change, not as an aesthetic. Claims here are kept
 * strictly at the level the company's own positioning supports: certified
 * remote pilots, plan-before-fly, structured supervision. Imagery is UAV
 * ground operations; no manned-aircraft visuals anywhere.
 */
const standards = [
  {
    n: "S.1",
    label: "Compétence certifiée",
    detail:
      "Chaque mission est opérée par un télépilote titulaire d'une certification professionnelle.",
  },
  {
    n: "S.2",
    label: "Plan de vol systématique",
    detail:
      "Aucun vol n'est engagé sans plan formalisé et validation préalable des conditions d'opération.",
  },
  {
    n: "S.3",
    label: "Supervision aéronautique",
    detail:
      "La flotte est exploitée sous supervision aéronautique : protocoles, check-lists et traçabilité à chaque sortie.",
  },
];

export default function Safety() {
  return (
    <section
      id="securite"
      aria-labelledby="safety-heading"
      className="relative overflow-hidden bg-navy-900 py-28 text-white lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHeading
              id="safety-heading"
              eyebrow="Sécurité & normes d'exploitation"
              tone="navy"
              title="La sécurité aérienne n'est pas une option. C'est le socle."
              lede="Notre direction des opérations applique à chaque mission une rigueur égale à celle des opérations aériennes : planification, vérification, supervision. Aucun vol n'est improvisé."
            />

            <dl className="mt-12">
              {standards.map((item, i) => (
                <Reveal key={item.n} delay={i * 90}>
                  <div className="grid grid-cols-[4.25rem_1fr] gap-x-6 border-t border-white/15 py-6">
                    <dt className="font-display text-[15px] font-medium tracking-wide text-signal-500">
                      {item.n}
                    </dt>
                    <dd>
                      <p className="text-[15.5px] font-semibold tracking-tight text-white">{item.label}</p>
                      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/70">{item.detail}</p>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={100} className="h-full">
              <figure className="relative h-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden lg:h-full lg:min-h-[420px]">
                  <img
                    src={safetyImage.src}
                    srcSet={safetyImage.srcSet}
                    sizes={safetyImage.sizes}
                    width={safetyImage.width}
                    height={safetyImage.height}
                    alt={safetyImage.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <figcaption className="absolute bottom-5 left-5 right-5 text-[12.5px] leading-snug text-white/80">
                  Contrôle pré-vol au sol : le geste le plus important est celui qui précède
                  le décollage.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
