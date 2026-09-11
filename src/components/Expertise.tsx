import { ShieldCheck, Cpu, Compass } from "lucide-react";
import Reveal from "./Reveal";

const principles = [
  {
    icon: ShieldCheck,
    title: "Discipline aéronautique",
    text: "Chaque mission est planifiée et supervisée selon les standards exigeants de l'aviation militaire.",
  },
  {
    icon: Cpu,
    title: "Ingénierie logicielle",
    text: "Automatisation, systèmes embarqués et outils numériques développés en interne pour fiabiliser chaque opération.",
  },
  {
    icon: Compass,
    title: "Précision de terrain",
    text: "Une exécution rigoureuse, du diagnostic à la restitution des données, quel que soit le secteur d'application.",
  },
];

export default function Expertise() {
  return (
    <section id="expertise" aria-labelledby="expertise-heading" className="bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Image — offset, editorial framing */}
          <div className="lg:col-span-5 lg:col-start-1">
            <Reveal className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0e1f30]">
                <img
                  src="/images/heritage-cockpit.jpg"
                  alt="Tableau de bord d'un poste de pilotage, symbole de la rigueur aéronautique"
                  className="h-full w-full object-cover grayscale"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-[12px] text-[#6b7280]">
                Une culture de la précision héritée de l'aviation habitée.
              </p>
            </Reveal>
          </div>

          {/* Text column */}
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-[12px] font-medium tracking-[0.24em] text-[#6b7280] uppercase">
                <span className="h-px w-8 bg-[#b4823c]" aria-hidden="true" />
                L'Expertise
              </p>
              <h2 id="expertise-heading" className="font-display text-3xl font-semibold tracking-tight text-[#0e1f30] sm:text-4xl">
                Deux exigences réunies : la sécurité aérienne et l'ingénierie moderne.
              </h2>
              <p className="mt-6 text-[16px] leading-relaxed text-[#3a3f47]">
                FEL DRONE est née de la rencontre entre une discipline opérationnelle forgée dans
                l'aviation militaire et une maîtrise fine des technologies embarquées. Cette double
                compétence structure notre manière de vendre, d'exploiter et d'entretenir chaque
                appareil : rien n'est laissé à l'approximation.
              </p>
            </Reveal>

            <dl className="mt-12 space-y-8">
              {principles.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <div className="flex gap-5 border-t border-[#e4e2dd] pt-6">
                    <p.icon size={20} className="mt-0.5 shrink-0 text-[#b4823c]" aria-hidden="true" />
                    <div>
                      <dt className="font-display text-[16px] font-medium text-[#0e1f30]">{p.title}</dt>
                      <dd className="mt-1.5 text-[15px] leading-relaxed text-[#3a3f47]">{p.text}</dd>
                    </div>
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
