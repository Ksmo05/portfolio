"use client";

import Image from "next/image";
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
    <header className="sticky top-0 z-50 border-b border-white/6 bg-[rgba(12,14,31,0.98)] backdrop-blur-2xl">
      <div className="page-shell flex items-center justify-between py-5">
        <Link href={`/${locale}`} className="flex items-center gap-3 text-slate-100">
          <span className="flex items-center justify-center">
            <Image
              src="/logo-csm-brand.png"
              alt="Carlos San Miguel portfolio logo"
              width={60}
              height={60}
              className="h-10 w-10 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] sm:h-12 sm:w-12"
            />
          </span>
          <span className="max-w-[18rem] text-base font-semibold leading-[1.03] tracking-[-0.03em] text-white sm:max-w-none sm:text-[1.08rem]">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.025] px-2 py-2 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/[0.12] text-white"
                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white focus-visible:bg-white/[0.08] focus-visible:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
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
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={`mobile-${link.href}`}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                isActive
                  ? "border-cyan-200/35 bg-cyan-300/15 text-white"
                  : "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
