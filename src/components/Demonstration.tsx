import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { demonstrationItems } from "../data/content";

/**
 * V10 Demonstration — example deliverables
 * Every placeholder clearly says "Exemple de démonstration — non issu d'une mission client"
 * No fictional work presented as real client project.
 * Includes truthful projects area: "Premières réalisations à venir"
 */
export default function Demonstration() {
  return (
    <section
      id="demonstration"
      aria-labelledby="demonstration-heading"
      className="bg-paper py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          id="demonstration-heading"
          eyebrow="Démonstration"
          title="À quoi ressemble un livrable ?"
          lede="Quatre exemples de démonstration — non issus d'une mission client. Chaque visuel est un placeholder documenté, pas un projet client."
          className="mb-14 lg:mb-20"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {demonstrationItems.map((item, i) => (
            <Reveal key={item.slug} delay={i * 80}>
              <article className="flex h-full flex-col border border-line bg-white p-7">
                <div className="mb-4 flex items-center justify-between">
                  <span className="bg-navy-900 px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.18em] text-white uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
                    Démo
                  </span>
                </div>
                <h3 className="font-display text-[18px] font-medium tracking-tight text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                  {item.desc}
                </p>
                <p className="mt-4 border-t border-line pt-4 text-[11.5px] leading-snug text-mute">
                  Exemple de démonstration — non issu d&apos;une mission client. À compléter
                  selon capteur et mission. Sur devis.
                </p>
                <div className="mt-6 flex h-28 items-center justify-center border border-dashed border-line-strong bg-paper">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-mute">
                    Média à fournir
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Projects — truthful */}
        <Reveal delay={160}>
          <div className="mt-16 border border-line bg-white p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-[16px] font-semibold tracking-tight text-navy-900">
                Projets
              </h3>
              <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-signal-600">
                Transparence
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
              Premières réalisations à venir. Nous ne présentons aucun nom de client, aucun
              projet, aucun résultat, aucun témoignage ou statistique sans base vérifiable.
              Cette section sera alimentée uniquement avec des missions réelles et autorisées.
            </p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-mute">
              À compléter — aucun projet fictif présenté comme réel.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
