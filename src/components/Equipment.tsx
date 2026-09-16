import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { equipmentCapabilities } from "../data/content";

/**
 * V10 Equipment / Capabilities — truthful, no invented specs
 * Unknown specifications clearly marked "À compléter"
 * Never invent drone models, sensors, flight times, accuracy, payloads, certifications
 */
export default function Equipment() {
  return (
    <section
      id="equipement"
      aria-labelledby="equipement-heading"
      className="bg-white py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading
              id="equipement-heading"
              eyebrow="Équipement"
              title="Capacités vérifiées, pas de catalogue inventé"
              lede="Seules les capacités vérifiées sont listées. Le reste est marqué À compléter — nous ne spéculons pas sur modèles, capteurs, autonomie ou précision."
            />
            <Reveal delay={120}>
              <p className="mt-8 max-w-md text-[13.5px] leading-relaxed text-mute">
                Aucun modèle de drone, aucun capteur, aucune autonomie, aucune précision ou
                certification n&apos;est inventé. Sur devis, étude selon le besoin.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-12">
              {equipmentCapabilities.map((group, gi) => (
                <Reveal key={group.category} delay={gi * 80}>
                  <div className="border-t border-line pt-8">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-navy-900">
                      {group.category}
                    </h3>
                    <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <div key={item.label} className="border-b border-line pb-4">
                          <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
                            {item.label}
                          </dt>
                          <dd className="mt-2 text-[14px] leading-snug text-ink-soft">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-12 bg-paper p-6 text-[13px] leading-relaxed text-ink-soft">
                <p className="font-medium text-navy-900">Média à fournir</p>
                <p className="mt-2">
                  Photos d&apos;atelier, fiches techniques vérifiées, certificats — À compléter.
                  Aucune image de drone jouet, aucun rendu 3D, aucune aviation habitée.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
