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
    name: "Carlos San Miguel Ortega",
    title: "Carlos San Miguel Ortega | Operations & Business Support Specialist",
    description:
      "Professional portfolio focused on purchasing processes, reporting, dealer network performance, and business support.",
    url: "https://carlossanmiguelortega.com",
    position:
      "Operations & Business Support Specialist focused on purchasing processes, reporting, and dealer network performance.",
    location: "Madrid, Spain",
    linkedin: "https://www.linkedin.com/in/carlossanmiguelortega",
    keywords: [
      "digital operations",
      "purchasing operations",
      "operational reporting",
      "KPI dashboards",
      "vendor management",
      "business support",
    ],
  },
  es: {
    name: "Carlos San Miguel Ortega",
    title: "Carlos San Miguel Ortega | Especialista en Operaciones y Soporte de Negocio",
    description:
      "Portfolio profesional centrado en procesos de compras, reporting, rendimiento de red de concesionarios y soporte de negocio.",
    url: "https://carlossanmiguelortega.com",
    position:
      "Especialista en Operaciones y Soporte de Negocio enfocado en procesos de compras, reporting y rendimiento de red de concesionarios.",
    location: "Madrid, Espana",
    linkedin: "https://www.linkedin.com/in/carlossanmiguelortega",
    keywords: [
      "operaciones digitales",
      "operaciones de compras",
      "reporting operativo",
      "cuadros de mando KPI",
      "gestion de proveedores",
      "soporte de negocio",
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
    "Digital Operations",
    "Purchasing Operations",
    "Business Support",
    "Data Analysis and Reporting",
    "Operational Coordination",
    "KPI Dashboards and Reporting Systems",
    "Vendor Management",
    "Purchase Order Coordination",
    "Documentation Control",
    "Cross-Team Process Follow-up",
  ],
  es: [
    "Operaciones Digitales",
    "Operaciones de Compras",
    "Soporte de Negocio",
    "Analisis de Datos y Reporting",
    "Coordinacion Operativa",
    "Cuadros de Mando KPI y Sistemas de Reporting",
    "Gestion de Proveedores",
    "Coordinacion de Ordenes de Compra",
    "Control Documental",
    "Seguimiento de Procesos entre Equipos",
  ],
};

export const toolStack = ["SAP", "Qlik Sense", "Coupa", "Excel", "Outlook", "Salesforce", "Jira"];

const profileHighlightsByLocale: Record<Locale, string[]> = {
  en: [
    "Operational projects connected with BMW business operations through RPC",
    "Energy sector operations (Endesa solar financing processes)",
    "Public administration procurement processes",
    "Banking customer support environments",
  ],
  es: [
    "Proyectos operativos vinculados con operaciones de negocio de BMW a traves de RPC",
    "Operaciones del sector energetico (procesos de financiacion solar en Endesa)",
    "Procesos de contratacion publica en administracion",
    "Entornos de soporte al cliente en banca",
  ],
};

const servicesByLocale: Record<Locale, string[]> = {
  en: [
    "Purchasing operations and vendor management coordination",
    "Operational reporting and KPI dashboard support",
    "Data analysis using Qlik Sense and Excel",
    "Purchase order tracking and supplier communication",
    "Documentation control and process follow-up",
    "Business support across operational teams",
  ],
  es: [
    "Coordinacion de operaciones de compras y gestion de proveedores",
    "Soporte de reporting operativo y cuadros de mando KPI",
    "Analisis de datos con Qlik Sense y Excel",
    "Seguimiento de ordenes de compra y comunicacion con proveedores",
    "Control documental y seguimiento de procesos",
    "Soporte de negocio en equipos operativos",
  ],
};

const shortBioByLocale: Record<Locale, string> = {
  en: "This portfolio presents professional experience across operational projects related to purchasing support, dealership performance monitoring, and training content development.",
  es: "Este portfolio presenta experiencia profesional en proyectos operativos relacionados con soporte de compras, seguimiento del rendimiento de concesionarios y desarrollo de contenido formativo.",
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

// Backward compatibility for non-localized legacy routes
export const siteConfig = siteConfigs.en;
export const navLinksLegacy = navLinks.map((item) => ({ href: item.href, label: item.label.en }));
export const coreSkills = coreSkillsByLocale.en;
export const profileHighlights = profileHighlightsByLocale.en;
export const services = servicesByLocale.en;
export const shortBio = shortBioByLocale.en;
