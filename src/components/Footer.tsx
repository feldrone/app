import { company, navLinks } from "../data/content";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0a1622] text-white/70">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark />
            <p className="mt-6 max-w-xs text-[13.5px] leading-relaxed text-white/50">
              Vente, location, maintenance et prestations de services par drone. Rigueur
              aéronautique, précision technologique.
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <p className="text-[11px] font-medium tracking-[0.16em] text-white/40 uppercase">Navigation</p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[13.5px] text-white/70 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#dossier" className="text-[13.5px] text-white/70 hover:text-white">
                  Dossier administratif
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[11px] font-medium tracking-[0.16em] text-white/40 uppercase">Coordonnées</p>
            <address className="mt-5 space-y-2.5 text-[13.5px] not-italic text-white/70">
              <p>
                {company.addressLine1}
                <br />
                {company.addressLine2}
                <br />
                {company.country}
              </p>
              <p>
                <a href={`mailto:${company.email}`} className="hover:text-white">
                  {company.email}
                </a>
              </p>
              <p>
                <a href={`tel:${company.phoneHref}`} className="hover:text-white">
                  {company.phone}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-[12.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {company.legalName}. Tous droits réservés.</p>
          <p>
            RC N° {company.rc} du {company.rcDate} · Capital social {company.capital}
          </p>
        </div>
      </div>
    </footer>
  );
}
