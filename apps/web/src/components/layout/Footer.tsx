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
    <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{siteConfig.name}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{siteConfig.position}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{siteConfig.location}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{copy.nav}</p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{copy.profile}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-slate-900 dark:hover:text-white">
                {copy.linkedin}
              </a>
            </li>
            <li>{copy.note}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-6xl px-6">
        <p className="text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} {siteConfig.name}. {copy.rights}</p>
      </div>
    </footer>
  );
}
