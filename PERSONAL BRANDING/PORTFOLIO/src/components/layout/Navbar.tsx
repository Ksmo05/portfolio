"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocale, type Locale } from "@/lib/i18n";
import { getNavLinks, getSiteConfig } from "@/lib/site";

const labels: Record<Locale, { language: string }> = {
  en: { language: "Language" },
  es: { language: "Idioma" },
};

export default function Navbar() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const navLinks = getNavLinks(locale);
  const siteConfig = getSiteConfig(locale);

  const getSwitchHref = (target: Locale) => withLocale(target, pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="max-w-[16rem] text-xs font-semibold tracking-wide text-slate-900 dark:text-slate-100 sm:max-w-none sm:text-sm">
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <div className="inline-flex items-center rounded-full border border-slate-300 bg-white p-0.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900">
            <span className="sr-only">{labels[locale].language}</span>
            <Link
              href={getSwitchHref("en")}
              className={`rounded-full px-2.5 py-1 transition ${locale === "en" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 dark:text-slate-300"}`}
            >
              EN
            </Link>
            <Link
              href={getSwitchHref("es")}
              className={`rounded-full px-2.5 py-1 transition ${locale === "es" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 dark:text-slate-300"}`}
            >
              ES
            </Link>
          </div>
        </div>
      </div>

      <nav aria-label="Mobile" className="mx-auto flex w-full max-w-6xl gap-4 overflow-x-auto px-6 pb-4 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={`mobile-${link.href}`}
            href={link.href}
            className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
