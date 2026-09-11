import { ArrowUp } from "lucide-react";
import { company, navLinks } from "../data/content";
import Logo from "./Logo";

/**
 * Corporate footer — quiet, dense with the useful facts only:
 * identity, navigation, legal register line, contact. No newsletter mock,
 * no social icons we cannot back, no filler.
 */
export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo dark />
            <p className="mt-6 max-w-xs text-[13.5px] leading-relaxed text-white/50">
              Vente, location, maintenance et prestations de services par drone. Rigueur
              aéronautique, précision technologique.
            </p>
          </div>

          <nav aria-label="Navigation de pied de page" className="lg:col-span-3 lg:col-start-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">Plan du site</p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[13.5px] text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#dossier" className="text-[13.5px] text-white/70 transition-colors hover:text-white">
                  Dossier administratif
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">Coordonnées</p>
            <address className="mt-5 space-y-2.5 text-[13.5px] leading-relaxed not-italic text-white/70">
              <p>
                {company.addressLine1}
                <br />
                {company.addressLine2}
                <br />
                {company.country}
              </p>
              <p>
                <a href={`mailto:${company.email}`} className="transition-colors hover:text-white">
                  {company.email}
                </a>
              </p>
              <p>
                <a href={`tel:${company.phoneHref}`} className="transition-colors hover:text-white">
                  {company.phone}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[12.5px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. Tous droits réservés.
          </p>
          <p>
            RC N° {company.rc} du {company.rcDate} · Capital social {company.capital}
          </p>
          <a
            href="#main"
            className="inline-flex items-center gap-2 self-start text-white/50 transition-colors hover:text-white sm:self-auto"
          >
            Haut de page
            <ArrowUp size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
