import { Printer } from "lucide-react";
import { company, team, activities } from "../data/content";
import Reveal from "./Reveal";

/**
 * Administrative dossier — presented as a formal corporate document.
 * One single source markup serves screen AND print: the print stylesheet
 * (index.css) renders only this section, strips the decorative chrome and
 * switches the type to a document register. All values mirror the
 * commercial-registry record supplied by the company.
 */
function Article({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-2 border-t border-line py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mute">
        Art. {n} — {title}
      </p>
      <div>{children}</div>
    </section>
  );
}

function Term({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">{term}</dt>
      <dd className="mt-1.5 text-[15px] leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

export default function Dossier() {
  return (
    <section id="dossier" aria-labelledby="dossier-heading" className="bg-paper py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] sm:text-[12px] text-mute">
              <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
              Informations légales
            </p>
            <h2
              id="dossier-heading"
              className="font-display text-[1.9rem] leading-tight font-medium tracking-tight text-navy-900 sm:text-[2.4rem]"
            >
              Dossier administratif
            </h2>
          </Reveal>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 border border-line-strong px-5 py-3 text-[13px] font-medium tracking-wide text-navy-900 transition-colors hover:border-navy-900"
          >
            <Printer size={15} aria-hidden="true" />
            Imprimer le dossier
          </button>
        </div>

        <Reveal>
          <div className="dossier-print border border-line bg-white px-7 py-8 shadow-[0_24px_60px_-40px_rgba(14,31,48,0.35)] sm:px-12 sm:py-12">
            {/* Print-only letterhead — hidden on screen */}
            <div className="print-only mb-7 flex items-end justify-between border-b border-black pb-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {company.legalName} — Dossier administratif
              </p>
              <p className="text-[11px]">Édité le {new Date().toLocaleDateString("fr-FR")}</p>
            </div>

            <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-start">
              <div>
                <p className="font-display text-xl font-semibold text-navy-900">{company.legalName}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                  {company.addressLine1}, {company.addressLine2}, {company.country}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
                  Registre de commerce
                </p>
                <p className="mt-1 font-display text-[15px] font-semibold text-navy-900">
                  N° {company.rc} — {company.rcDate}
                </p>
              </div>
            </div>

            <Article n="1" title="Identification">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <Term term="Dénomination sociale">{company.legalName}</Term>
                <Term term="Forme juridique">Société à Responsabilité Limitée (SARL)</Term>
                <Term term="Siège social">
                  {company.addressLine1},<br />
                  {company.addressLine2}, {company.country}
                </Term>
                <Term term="Enregistrement">RC N° {company.rc} du {company.rcDate}</Term>
              </dl>
            </Article>

            <Article n="2" title="Capital">
              <dl>
                <Term term="Capital social">{company.capital}</Term>
              </dl>
            </Article>

            <Article n="3" title="Activités enregistrées">
              <ul className="grid grid-cols-1 gap-x-8 gap-y-2 text-[15px] text-ink sm:grid-cols-2">
                {activities.map((a) => (
                  <li key={a} className="flex gap-2.5">
                    <span className="mt-[0.65em] h-1 w-1 shrink-0 bg-signal-600" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </Article>

            <Article n="4" title="Direction & partenaires">
              <dl className="space-y-2.5 text-[15px]">
                {team.map((m) => (
                  <div key={m.name} className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="font-medium text-ink">{m.name}</dt>
                    <span className="text-mute" aria-hidden="true">—</span>
                    <dd className="text-ink-soft">{m.role}</dd>
                  </div>
                ))}
              </dl>
            </Article>

            <Article n="5" title="Contact officiel">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <Term term="Téléphone">
                  <a href={`tel:${company.phoneHref}`} className="hover:text-navy-900">
                    {company.phone}
                  </a>
                </Term>
                <Term term="Courriel">
                  <a href={`mailto:${company.email}`} className="hover:text-navy-900">
                    {company.email}
                  </a>
                </Term>
              </dl>
            </Article>

            <p className="border-t border-line pt-6 text-[13px] leading-relaxed text-mute">
              Document établi à partir des mentions du registre du commerce —{" "}
              {company.city}, {company.country}. Pour toute vérification officielle, se
              référer au RC N° {company.rc}.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
