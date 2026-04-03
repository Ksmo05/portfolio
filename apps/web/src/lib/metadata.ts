import type { Metadata } from "next";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/site";

export function buildMetadata({
  title,
  description,
  path = "",
  locale = defaultLocale,
}: {
  title: string;
  description: string;
  path?: string;
  locale?: Locale;
}): Metadata {
  const siteConfig = getSiteConfig(locale);
  const localizedPath = path.startsWith("/") ? path : `/${path}`;
  const absoluteUrl = `${siteConfig.url}/${locale}${localizedPath === "/" ? "" : localizedPath}`;

  return {
    title,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: absoluteUrl,
      languages: {
        en: `${siteConfig.url}/en${localizedPath === "/" ? "" : localizedPath}`,
        es: `${siteConfig.url}/es${localizedPath === "/" ? "" : localizedPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
