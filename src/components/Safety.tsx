import Reveal from "./Reveal";

const commitments = [
  {
    figure: "Classe 3",
    label: "Télépilotes certifiés",
    detail: "Chaque mission est opérée par un télépilote titulaire d'une certification professionnelle Classe 3.",
  },
  {
    figure: "100%",
    label: "Missions planifiées",
    detail: "Aucun vol n'est engagé sans plan de vol formalisé et validation préalable des conditions d'opération.",
  },
  {
    figure: "Militaire",
    label: "Référentiel de supervision",
    detail: "La flotte est exploitée sous une supervision aéronautique héritée des standards de l'aviation militaire.",
  },
];

export default function Safety() {
  return (
    <section aria-labelledby="safety-heading" className="relative overflow-hidden bg-[#0e1f30] py-28 text-white lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-[12px] font-medium tracking-[0.24em] text-[#c6934a] uppercase">
                <span className="h-px w-8 bg-[#c6934a]" aria-hidden="true" />
                Sécurité &amp; conformité
              </p>
              <h2 id="safety-heading" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                La sécurité aérienne n'est pas une option, c'est un socle.
              </h2>
              <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-white/70">
                Notre direction des opérations aériennes applique à chaque mission civile la même
                rigueur de planification, de vérification et de supervision qu'en aviation
                militaire. Aucun vol n'est improvisé.
              </p>
            </Reveal>

            <dl className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-6">
              {commitments.map((item, i) => (
                <Reveal key={item.label} delay={i * 90}>
                  <div className="border-t border-white/15 pt-5">
                    <dt className="font-display text-2xl font-semibold text-white">{item.figure}</dt>
                    <dd className="mt-2 text-[13px] font-medium tracking-wide text-[#c6934a]">{item.label}</dd>
                    <dd className="mt-2 text-[13.5px] leading-relaxed text-white/60">{item.detail}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={100} className="relative h-full">
              <div className="relative aspect-[4/5] w-full overflow-hidden lg:h-full lg:min-h-[420px]">
                <img
                  src="/images/safety-cockpit.jpg"
                  alt="Tableau de bord d'avion, symbole de la rigueur des procédures de vol"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1622]/70 via-[#0a1622]/10 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
