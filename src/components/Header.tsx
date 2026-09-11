import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "../data/content";
import { cn } from "../utils/cn";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#accueil");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lightweight scroll-spy to highlight the current section in the nav.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur shadow-[0_1px_0_0_rgba(0,0,0,0.06)]" : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        style={{ background: "#0e1f30", color: "#fff" }}
      >
        Aller au contenu principal
      </a>

      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
        <a href="#accueil" aria-label="FEL DRONE — Accueil">
          <Logo />
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-[13px] font-medium tracking-wide text-[#3a3f47] transition-colors hover:text-[#0e1f30]",
                active === link.href && "text-[#0e1f30]",
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#b4823c] transition-transform duration-300",
                  active === link.href && "scale-x-100",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contact"
            className="inline-flex items-center border border-[#0e1f30] px-5 py-2.5 text-[13px] font-medium tracking-wide text-[#0e1f30] transition-colors hover:bg-[#0e1f30] hover:text-white"
          >
            Demander une expertise
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center p-2 text-[#0e1f30] lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-[72px] z-40 flex flex-col bg-white transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav aria-label="Navigation mobile" className="flex flex-1 flex-col gap-1 px-6 pt-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-[#e4e2dd] py-4 text-lg font-medium text-[#12151a]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-[#e4e2dd] px-6 py-6">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center bg-[#0e1f30] px-5 py-3.5 text-sm font-medium tracking-wide text-white"
          >
            Demander une expertise
          </a>
        </div>
      </div>
    </header>
  );
}
