import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "../data/content";
import { cn } from "../utils/cn";

/**
 * Corporate header: fixed rail with a stable height (--header-h), quiet
 * borders instead of shadows, scroll-state tinting, IntersectionObserver
 * scroll-spy for the active section, and a full-height but uncluttered
 * mobile sheet (Escape closes it, body scroll locks while open).
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy — highlights the section currently in view.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Body scroll lock + Escape-to-close for the mobile sheet.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-line bg-white/95 backdrop-blur-sm"
          : "border-transparent bg-paper/80 backdrop-blur-[2px]",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-white"
      >
        Aller au contenu principal
      </a>

      <div className="mx-auto flex h-[var(--header-h)] max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <a href="#main" aria-label="FEL DRONE — retour en haut de page">
          <Logo />
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 lg:flex xl:gap-9">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "true" : undefined}
              className={cn(
                "relative py-1 text-[13px] font-medium tracking-wide text-ink-soft transition-colors hover:text-navy-900",
                active === link.href && "text-navy-900",
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute right-0 -bottom-0.5 left-0 h-px origin-left scale-x-0 bg-signal-600 transition-transform duration-300",
                  active === link.href && "scale-x-100",
                )}
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="group hidden items-center gap-2 bg-navy-900 px-5 py-2.5 text-[13px] font-medium tracking-wide text-white shadow-[0_12px_24px_-14px_rgba(14,31,48,0.7)] transition-[background-color,transform] duration-200 hover:bg-navy-800 active:translate-y-px lg:inline-flex"
        >
          Demander un devis
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>

        <button
          type="button"
          className="inline-flex items-center justify-center p-2.5 text-navy-900 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sheet — simple list, generous tap targets, no choreography */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 flex flex-col bg-white transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "invisible translate-x-full",
        )}
        inert={!open}
      >
        <nav aria-label="Navigation mobile" className="flex flex-col px-6 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4.5 text-[17px] font-medium text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto border-t border-line px-6 py-6">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 bg-navy-900 px-5 py-4.5 text-[15px] font-medium tracking-wide text-white transition-colors hover:bg-navy-800"
          >
            Demander un devis
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
