import { Printer } from "lucide-react";
import { company, team } from "../data/content";
import Reveal from "./Reveal";

/**
 * Dossier administratif — presented as a formal corporate document.
 * Print-friendly (see @media print in index.css): navigation, buttons and
 * decorative chrome are hidden, and typography switches to a document-like
 * register when printed.
 */
export default function Dossier() {
  return (
    <section id="dossier" aria-labelledby="dossier-heading" className="bg-[#fbfaf8] py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="mb-5 flex items-center gap-3 text-[12px] font-medium tracking-[0.24em] text-[#6b7280] uppercase">
              <span className="h-px w-8 bg-[#b4823c]" aria-hidden="true" />
              Informations légales
            </p>
            <h2 id="dossier-heading" className="font-display text-3xl font-semibold tracking-tight text-[#0e1f30] sm:text-4xl">
              Dossier administratif
            </h2>
          </Reveal>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 border border-[#d8d5cd] px-5 py-3 text-[13px] font-medium tracking-wide text-[#0e1f30] transition-colors hover:border-[#0e1f30]"
          >
            <Printer size={15} />
            Imprimer le dossier
          </button>
        </div>

        <Reveal>
          <div className="dossier-print border border-[#e4e2dd] bg-white p-8 shadow-[0_20px_50px_-30px_rgba(14,31,48,0.25)] sm:p-12">
            <div className="flex flex-col justify-between gap-6 border-b border-[#e4e2dd] pb-8 sm:flex-row sm:items-start">
              <div>
                <p className="font-display text-xl font-semibold text-[#0e1f30]">{company.legalName}</p>
                <p className="mt-1 text-[13.5px] text-[#3a3f47]">
                  {company.addressLine1}, {company.addressLine2}, {company.country}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[11px] font-medium tracking-[0.14em] text-[#6b7280] uppercase">Registre de commerce</p>
                <p className="font-display text-[15px] font-semibold text-[#0e1f30]">
                  N° {company.rc} — {company.rcDate}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-medium tracking-[0.14em] text-[#6b7280] uppercase">Forme juridique</dt>
                <dd className="mt-1.5 text-[15px] text-[#12151a]">Société à Responsabilité Limitée (SARL)</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium tracking-[0.14em] text-[#6b7280] uppercase">Capital social</dt>
                <dd className="mt-1.5 text-[15px] text-[#12151a]">{company.capital}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium tracking-[0.14em] text-[#6b7280] uppercase">Siège social</dt>
                <dd className="mt-1.5 text-[15px] text-[#12151a]">
                  {company.addressLine1}, {company.addressLine2}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium tracking-[0.14em] text-[#6b7280] uppercase">Contact officiel</dt>
                <dd className="mt-1.5 text-[15px] text-[#12151a]">{company.email}</dd>
                <dd className="text-[15px] text-[#12151a]">{company.phone}</dd>
              </div>
            </dl>

            <div className="border-t border-[#e4e2dd] py-8">
              <dt className="text-[11px] font-medium tracking-[0.14em] text-[#6b7280] uppercase">Activités enregistrées</dt>
              <dd className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-[15px] text-[#12151a] sm:grid-cols-2">
                <p>— Commerce de gros et détail en drones et accessoires</p>
                <p>— Location d'aéronefs télépilotés</p>
                <p>— Maintenance, diagnostic et calibration</p>
                <p>— Prestations de services par drone</p>
              </dd>
            </div>

            <div className="border-t border-[#e4e2dd] pt-8">
              <dt className="text-[11px] font-medium tracking-[0.14em] text-[#6b7280] uppercase">Direction</dt>
              <dd className="mt-3 space-y-1.5 text-[15px] text-[#12151a]">
                {team.map((member) => (
                  <p key={member.name}>
                    {member.name} — {member.role}
                  </p>
                ))}
              </dd>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 text-[13px] text-[#6b7280]">
          Document à titre informatif. Pour toute vérification officielle, se référer au registre
          de commerce N° {company.rc}.
        </p>
      </div>
    </section>
  );
}
