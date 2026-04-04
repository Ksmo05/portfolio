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
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(5,8,18,0.72)] backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between py-5">
        <Link href={`/${locale}`} className="max-w-[16rem] text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-100 sm:max-w-none sm:text-[0.78rem]">
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-2 py-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs font-semibold shadow-[0_14px_35px_-24px_rgba(15,23,42,0.9)]">
            <span className="sr-only">{labels[locale].language}</span>
            <Link
              href={getSwitchHref("en")}
              className={`rounded-full px-3 py-1.5 transition ${locale === "en" ? "bg-white text-slate-950" : "text-slate-400 hover:text-white"}`}
            >
              EN
            </Link>
            <Link
              href={getSwitchHref("es")}
              className={`rounded-full px-3 py-1.5 transition ${locale === "es" ? "bg-white text-slate-950" : "text-slate-400 hover:text-white"}`}
            >
              ES
            </Link>
          </div>
        </div>
      </div>

      <nav aria-label="Mobile" className="page-shell flex gap-3 overflow-x-auto pb-4 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={`mobile-${link.href}`}
            href={link.href}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-200"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
