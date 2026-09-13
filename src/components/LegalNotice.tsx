import { company, activities } from "../data/content";

/**
 * Legal notices — the single, deliberate place where company registry
 * information appears. It is NOT part of the marketing flow: no section
 * hero treatment, no cards, no data printed as decoration. It exists
 * because a French-locale corporate site is expected to identify its
 * legal entity, and it is reachable from the footer.
 *
 * Share capital is intentionally absent: financial data is internal.
 */
function Term({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-mute">
        {term}
      </dt>
      <dd className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{children}</dd>
    </div>
  );
}

export default function LegalNotice() {
  return (
    <section
      id="mentions-legales"
      aria-labelledby="legal-heading"
      className="scroll-mt-24 border-t border-line bg-paper py-14 lg:py-16"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <h2
          id="legal-heading"
          className="text-[12px] font-semibold uppercase tracking-[0.2em] text-navy-900"
        >
          Mentions légales
        </h2>

        <dl className="mt-7 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <Term term="Dénomination">{company.legalName}</Term>
          <Term term="Forme juridique">Société à Responsabilité Limitée (SARL)</Term>
          <Term term="Registre de commerce">N° {company.rc}</Term>
          <Term term="Siège social">
            {company.addressLine1}, {company.addressLine2}, {company.country}
          </Term>
          {company.gerant && <Term term="Gérant">{company.gerant}</Term>}
          <Term term="Contact">
            <a href={`mailto:${company.email}`} className="transition-colors hover:text-navy-900">
              {company.email}
            </a>
            <br />
            <a href={`tel:${company.phoneHref}`} className="transition-colors hover:text-navy-900">
              {company.phone}
            </a>
          </Term>
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-mute">
              Activités déclarées
            </dt>
            <dd className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              {activities.length > 1
                ? `${activities.slice(0, -1).join(", ")} et ${activities[activities.length - 1]}`
                : activities[0]}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
