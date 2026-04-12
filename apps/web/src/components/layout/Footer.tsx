"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, type Locale } from "@/lib/i18n";
import { getNavLinks, getSiteConfig } from "@/lib/site";

const footerCopy: Record<Locale, { nav: string; profile: string; note: string; rights: string; linkedin: string }> = {
  en: {
    nav: "Navigation",
    profile: "Profile",
    note: "Structured professional portfolio focused on experience, projects, and education.",
    rights: "All rights reserved.",
    linkedin: "LinkedIn",
  },
  es: {
    nav: "Navegacion",
    profile: "Perfil",
    note: "Portfolio profesional estructurado enfocado en experiencia, proyectos y formacion.",
    rights: "Todos los derechos reservados.",
    linkedin: "LinkedIn",
  },
};

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const siteConfig = getSiteConfig(locale);
  const navLinks = getNavLinks(locale);
  const copy = footerCopy[locale];

  return (
    <footer className="border-t border-white/8 bg-[rgba(3,8,43,0.9)] py-16 backdrop-blur-xl">
      <div className="page-shell">
        <div className="section-shell rounded-[2rem] px-7 py-8 md:px-10 md:py-10">
          <div className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-slate-200">{siteConfig.name}</p>
          <p className="mt-4 text-sm leading-6 text-slate-300">{siteConfig.position}</p>
          <p className="mt-2 text-sm text-slate-500">{siteConfig.location}</p>
        </div>

        <div>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-slate-200">{copy.nav}</p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-300 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-slate-200">{copy.profile}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-white">
                {copy.linkedin}
              </a>
            </li>
            <li>{copy.note}</li>
          </ul>
        </div>
          </div>
          <div className="mt-10 border-t border-white/8 pt-5">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} {siteConfig.name}. {copy.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
