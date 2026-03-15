import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export type LocalizedLabel = {
  en: string;
  es: string;
};

export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
  position: string;
  location: string;
  linkedin: string;
  keywords: string[];
};

const siteConfigs: Record<Locale, SiteConfig> = {
  en: {
    name: "Carlos San Miguel",
    title: "Carlos San Miguel | Operations, Data & Digital Projects",
    description:
      "Portfolio focused on operations, purchasing support, data analysis, KPI tracking and personal digital projects.",
    url: "https://carlossanmiguelortega.com",
    position:
      "Operations and data professional supporting Purchasing and Aftersales processes while exploring digital tools and practical AI workflows.",
    location: "Madrid, Spain",
    linkedin: "https://www.linkedin.com/in/carlossanmiguelortega",
    keywords: [
      "operations",
      "purchasing",
      "data analysis",
      "KPI dashboards",
      "process digitalization",
      "digital projects",
    ],
  },
  es: {
    name: "Carlos San Miguel",
    title: "Carlos San Miguel | Operaciones, Datos y Proyectos Digitales",
    description:
      "Portfolio centrado en operaciones, soporte a compras, analisis de datos, seguimiento de KPI y proyectos digitales personales.",
    url: "https://carlossanmiguelortega.com",
    position:
      "Profesional de operaciones y datos dando soporte a procesos de Purchasing y Aftersales mientras explora herramientas digitales y flujos practicos de IA.",
    location: "Madrid, Espana",
    linkedin: "https://www.linkedin.com/in/carlossanmiguelortega",
    keywords: [
      "operaciones",
      "compras",
      "analisis de datos",
      "dashboards KPI",
      "digitalizacion de procesos",
      "proyectos digitales",
    ],
  },
};

const navLinks: Array<{ href: string; label: LocalizedLabel }> = [
  { href: "/", label: { en: "Home", es: "Inicio" } },
  { href: "/experience", label: { en: "Experience", es: "Experiencia" } },
  { href: "/projects", label: { en: "Projects", es: "Proyectos" } },
  { href: "/education", label: { en: "Education", es: "Formacion" } },
  { href: "/professional-profile", label: { en: "Professional Profile", es: "Perfil Profesional" } },
  { href: "/blog", label: { en: "Blog", es: "Blog" } },
];

const coreSkillsByLocale: Record<Locale, string[]> = {
  en: [
    "Operations",
    "Purchasing",
    "Data management",
    "Data analysis",
    "KPI / Dashboards",
    "SAP",
    "Qlik Sense",
    "Excel",
    "Process digitalization",
    "Digital tools",
    "Web content",
    "AI for productivity",
  ],
  es: [
    "Operaciones",
    "Compras",
    "Gestion de datos",
    "Analisis de datos",
    "KPI / Dashboards",
    "SAP",
    "Qlik Sense",
    "Excel",
    "Digitalizacion de procesos",
    "Herramientas digitales",
    "Contenido web",
    "IA aplicada a productividad",
  ],
};

export const toolStack = ["SAP", "Qlik Sense", "Microsoft Excel", "Microsoft Outlook", "Salesforce"];

const profileHighlightsByLocale: Record<Locale, string[]> = {
  en: [
    "Consulting support for Purchasing and Aftersales processes",
    "Automotive and dealership-related business environments",
    "Energy operations and documentation workflows",
    "Public procurement and banking support experience",
  ],
  es: [
    "Soporte de consultoria para procesos de Purchasing y Aftersales",
    "Entornos de negocio vinculados a automocion y red de concesionarios",
    "Operaciones energeticas y flujos documentales",
    "Experiencia en contratacion publica y soporte bancario",
  ],
};

const servicesByLocale: Record<Locale, string[]> = {
  en: [
    "Operations and business process support",
    "Purchasing coordination and vendor follow-up",
    "Data analysis, KPI tracking and dashboards",
    "Process digitalization and information organization",
    "Digital tools, web content and practical AI workflows",
    "Productivity improvement in day-to-day business environments",
  ],
  es: [
    "Soporte a operaciones y procesos de negocio",
    "Coordinacion de compras y seguimiento de proveedores",
    "Analisis de datos, seguimiento de KPI y dashboards",
    "Digitalizacion de procesos y organizacion de la informacion",
    "Herramientas digitales, contenido web y flujos practicos de IA",
    "Mejora de la productividad en entornos de trabajo reales",
  ],
};

const shortBioByLocale: Record<Locale, string> = {
  en: "Operations and data professional supporting Purchasing and Aftersales processes while exploring digital tools, web content and practical AI applications through personal projects.",
  es: "Profesional de operaciones y datos dando soporte a procesos de Purchasing y Aftersales mientras explora herramientas digitales, contenido web y aplicaciones practicas de IA a traves de proyectos personales.",
};

export function getLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export function getSiteConfig(locale: Locale): SiteConfig {
  return siteConfigs[locale];
}

export function getNavLinks(locale: Locale) {
  return navLinks.map((item) => ({ href: `/${locale}${item.href}`, label: item.label[locale] }));
}

export function getCoreSkills(locale: Locale) {
  return coreSkillsByLocale[locale];
}

export function getProfileHighlights(locale: Locale) {
  return profileHighlightsByLocale[locale];
}

export function getServices(locale: Locale) {
  return servicesByLocale[locale];
}

export function getShortBio(locale: Locale) {
  return shortBioByLocale[locale];
}

export function t(locale: Locale, text: LocalizedLabel) {
  return text[locale];
}

export const siteConfig = siteConfigs.en;
export const navLinksLegacy = navLinks.map((item) => ({ href: item.href, label: item.label.en }));
export const coreSkills = coreSkillsByLocale.en;
export const profileHighlights = profileHighlightsByLocale.en;
export const services = servicesByLocale.en;
export const shortBio = shortBioByLocale.en;

