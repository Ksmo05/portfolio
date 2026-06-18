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
    title: "Carlos San Miguel | Procurement Operations, KPI Reporting & Digital Workflows",
    description:
      "Portfolio focused on procurement operations, KPI reporting, process optimization, supplier governance and practical digital initiatives.",
    url: "https://carlossm.com",
    position:
      "Procurement operations consultant with experience in purchasing support, KPI reporting, process optimization and practical digital delivery.",
    location: "Madrid, Spain",
    linkedin: "https://www.linkedin.com/in/carlossanmiguelortega",
    keywords: [
      "procurement operations",
      "purchasing support",
      "reporting",
      "KPI dashboards",
      "process optimization",
      "supplier governance",
      "procurement compliance",
      "digital workflows",
      "practical AI",
    ],
  },
  es: {
    name: "Carlos San Miguel",
    title: "Carlos San Miguel | Procurement, KPI Reporting y Workflows Digitales",
    description:
      "Portfolio centrado en operaciones de compras, reporting KPI, optimizacion de procesos, supplier governance e iniciativas digitales practicas.",
    url: "https://carlossm.com",
    position:
      "Consultor de operaciones de compras con experiencia en soporte a purchasing, reporting KPI, optimizacion de procesos y entrega digital practica.",
    location: "Madrid, Espana",
    linkedin: "https://www.linkedin.com/in/carlossanmiguelortega",
    keywords: [
      "procurement",
      "compras",
      "reporting",
      "dashboards KPI",
      "optimizacion de procesos",
      "supplier governance",
      "compliance de compras",
      "flujos digitales",
      "IA practica",
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
    "Procurement support",
    "Process coordination",
    "Data follow-up",
    "Reporting",
    "KPI / Dashboards",
    "SAP",
    "Coupa",
    "Qlik Sense",
    "Excel",
    "Workflow support",
    "Digital tools",
    "AI for productivity",
  ],
  es: [
    "Operaciones",
    "Soporte a compras",
    "Coordinacion de procesos",
    "Seguimiento de datos",
    "Reporting",
    "KPI / Dashboards",
    "SAP",
    "Coupa",
    "Qlik Sense",
    "Excel",
    "Soporte a workflows",
    "Herramientas digitales",
    "IA aplicada a productividad",
  ],
};

export const toolStack = ["SAP", "Coupa", "Qlik Sense", "Microsoft Excel", "Salesforce"];

const profileHighlightsByLocale: Record<Locale, string[]> = {
  en: [
    "Purchasing and procurement operations across Spain and Portugal",
    "Automotive, energy, public administration and banking environments",
    "KPI monitoring, operational analytics and reporting follow-up",
    "Supplier governance, audits, ICS controls and practical digital improvement",
  ],
  es: [
    "Operaciones de purchasing y procurement en Espana y Portugal",
    "Entornos de automocion, energia, administracion publica y banca",
    "Seguimiento de KPI, analitica operativa y reporting",
    "Supplier governance, auditorias, controles ICS y mejora digital practica",
  ],
};

const servicesByLocale: Record<Locale, string[]> = {
  en: [
    "Purchasing support and procurement process follow-up",
    "SAP and Coupa operational support, issue handling and coordination",
    "Reporting, KPI tracking and operational analysis",
    "Documentation control and information organization",
    "Supplier governance, audits and procurement compliance support",
    "Digital tools and practical AI for day-to-day productivity",
  ],
  es: [
    "Soporte a purchasing y seguimiento de procesos de procurement",
    "Soporte operativo en SAP y Coupa, coordinacion y gestion de incidencias",
    "Reporting, seguimiento de KPI y analitica operativa",
    "Control documental y organizacion de la informacion",
    "Supplier governance, auditorias y soporte a compliance de compras",
    "Herramientas digitales e IA practica para la productividad diaria",
  ],
};

const shortBioByLocale: Record<Locale, string> = {
  en: "Procurement operations professional with experience in purchasing support, KPI reporting, supplier governance, process optimization and practical digital tools that improve productivity and decision-making.",
  es: "Profesional de operaciones de compras con experiencia en soporte a purchasing, reporting KPI, supplier governance, optimizacion de procesos y herramientas digitales practicas que mejoran productividad y toma de decisiones.",
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

