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
      "Portfolio focused on operations support, process coordination, reporting, data follow-up and practical digital initiatives.",
    url: "https://carlossanmiguelortega.com",
    position:
      "Operations, data and digital support professional with experience in corporate processes, reporting and practical AI workflows.",
    location: "Madrid, Spain",
    linkedin: "https://www.linkedin.com/in/carlossanmiguelortega",
    keywords: [
      "operations",
      "procurement support",
      "reporting",
      "KPI dashboards",
      "process coordination",
      "digital workflows",
      "practical AI",
    ],
  },
  es: {
    name: "Carlos San Miguel",
    title: "Carlos San Miguel | Operaciones, Datos y Proyectos Digitales",
    description:
      "Portfolio centrado en soporte operativo, coordinacion de procesos, reporting, seguimiento de datos e iniciativas digitales practicas.",
    url: "https://carlossanmiguelortega.com",
    position:
      "Profesional de operaciones, datos y soporte digital con experiencia en procesos corporativos, reporting y flujos practicos de IA.",
    location: "Madrid, Espana",
    linkedin: "https://www.linkedin.com/in/carlossanmiguelortega",
    keywords: [
      "operaciones",
      "soporte a compras",
      "reporting",
      "dashboards KPI",
      "coordinacion de procesos",
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
    "Qlik Sense",
    "Excel",
    "Soporte a workflows",
    "Herramientas digitales",
    "IA aplicada a productividad",
  ],
};

export const toolStack = ["SAP", "Qlik Sense", "Microsoft Excel", "Microsoft Outlook", "Salesforce"];

const profileHighlightsByLocale: Record<Locale, string[]> = {
  en: [
    "Corporate support for Purchasing and Aftersales processes",
    "Automotive, energy, public administration and banking environments",
    "Operational coordination, documentation control and reporting follow-up",
    "Practical use of digital tools to improve visibility and productivity",
  ],
  es: [
    "Soporte corporativo para procesos de Purchasing y Aftersales",
    "Entornos de automocion, energia, administracion publica y banca",
    "Coordinacion operativa, control documental y seguimiento de reporting",
    "Uso practico de herramientas digitales para mejorar visibilidad y productividad",
  ],
};

const servicesByLocale: Record<Locale, string[]> = {
  en: [
    "Operations support and business process follow-up",
    "Procurement coordination, SAP support and incident handling",
    "Reporting, KPI tracking and dashboard-oriented analysis",
    "Documentation control and information organization",
    "Digital tools and practical AI for day-to-day productivity",
    "Structured support for corporate teams and business workflows",
  ],
  es: [
    "Soporte a operaciones y seguimiento de procesos de negocio",
    "Coordinacion de compras, soporte SAP y gestion de incidencias",
    "Reporting, seguimiento de KPI y analisis orientado a dashboards",
    "Control documental y organizacion de la informacion",
    "Herramientas digitales e IA practica para la productividad diaria",
    "Soporte estructurado para equipos corporativos y workflows de negocio",
  ],
};

const shortBioByLocale: Record<Locale, string> = {
  en: "Operations, data and digital support professional with experience in corporate environments, reporting, process coordination and practical uses of AI to improve productivity and information flows.",
  es: "Profesional de operaciones, datos y soporte digital con experiencia en entornos corporativos, reporting, coordinacion de procesos y usos practicos de la IA para mejorar la productividad y los flujos de informacion.",
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

