import type { Locale } from "@/lib/i18n";

type LocalizedString = Record<Locale, string>;
type LocalizedStringArray = Record<Locale, string[]>;

type ExperienceEntryLocalized = {
  company: LocalizedString;
  role: LocalizedString;
  period: string;
  logo: string;
  logoAlt: LocalizedString;
  summary: LocalizedString;
  responsibilities: LocalizedStringArray;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  logo: string;
  logoAlt: string;
  summary: string;
  responsibilities: string[];
};

type SnapshotEntryLocalized = {
  company: LocalizedString;
  logo: string;
  logoAlt: LocalizedString;
  description: LocalizedString;
};

export type SnapshotEntry = {
  company: string;
  logo: string;
  logoAlt: string;
  description: string;
};

const entries: ExperienceEntryLocalized[] = [
  {
    company: { en: "RPC", es: "RPC" },
    role: { en: "Operations & Business Support Consultant", es: "Consultor de Operaciones y Soporte de Negocio" },
    period: "2025 - Present",
    logo: "/company-logos/rpc.svg",
    logoAlt: { en: "RPC logo", es: "Logotipo RPC" },
    summary: {
      en: "Current consulting work supporting Purchasing and Aftersales processes, with a focus on SAP user support, KPI follow-up, reporting and process coordination in business environments connected to BMW.",
      es: "Trabajo actual de consultoria dando soporte a procesos de Purchasing y Aftersales, con foco en soporte a usuarios de SAP, seguimiento de KPI, reporting y coordinacion de procesos en entornos de negocio vinculados a BMW.",
    },
    responsibilities: {
      en: [
        "Support users with SAP incidents related to purchasing processes.",
        "Prepare recurring reports and KPI follow-up for operational teams.",
        "Review process execution to keep work aligned with internal guidelines.",
        "Monitor dealership-related performance and campaign participation data.",
        "Create and organize web content and training materials for internal learning initiatives.",
      ],
      es: [
        "Dar soporte a usuarios con incidencias SAP relacionadas con procesos de compras.",
        "Preparar reporting recurrente y seguimiento de KPI para equipos operativos.",
        "Revisar la ejecucion de procesos para mantener el trabajo alineado con directrices internas.",
        "Hacer seguimiento de datos de rendimiento y participacion de concesionarios en campanas.",
        "Crear y organizar contenido web y materiales formativos para iniciativas internas de aprendizaje.",
      ],
    },
  },
  {
    company: { en: "Endesa", es: "Endesa" },
    role: { en: "Back Office Operations", es: "Operaciones Back Office" },
    period: "2025",
    logo: "/company-logos/endesa.svg",
    logoAlt: { en: "Endesa logo", es: "Logotipo Endesa" },
    summary: {
      en: "Operations support focused on documentation management and financial validation workflows in solar financing.",
      es: "Soporte operativo enfocado en gestion documental y validacion financiera en procesos de financiacion solar.",
    },
    responsibilities: {
      en: [
        "Documentation management for solar installation financing",
        "Customer financial validation processes",
        "Coordination between teams",
        "Use of Salesforce for incident and process management",
      ],
      es: [
        "Gestion documental para financiacion de instalaciones solares",
        "Procesos de validacion financiera de clientes",
        "Coordinacion entre equipos",
        "Uso de Salesforce para gestion de incidencias y procesos",
      ],
    },
  },
  {
    company: { en: "Ayuntamiento de Madrid", es: "Ayuntamiento de Madrid" },
    role: { en: "Administrative Procurement Support", es: "Soporte Administrativo en Contratacion" },
    period: "2022 - 2025",
    logo: "/company-logos/madrid-city-council.svg",
    logoAlt: { en: "Ayuntamiento de Madrid logo", es: "Logotipo Ayuntamiento de Madrid" },
    summary: {
      en: "Administrative procurement support with strong documentation control and process coordination.",
      es: "Soporte en contratacion administrativa con foco en control documental y coordinacion de procesos.",
    },
    responsibilities: {
      en: [
        "Public procurement processes",
        "Contract documentation",
        "Procurement platform management",
        "Administrative coordination",
      ],
      es: [
        "Procesos de contratacion publica",
        "Documentacion contractual",
        "Gestion de plataforma de contratacion",
        "Coordinacion administrativa",
      ],
    },
  },
  {
    company: { en: "Openbank", es: "Openbank" },
    role: { en: "Banking Customer Support", es: "Soporte al Cliente Bancario" },
    period: "2021 - 2022",
    logo: "/company-logos/openbank-icon.png",
    logoAlt: { en: "Openbank logo", es: "Logotipo Openbank" },
    summary: {
      en: "Operational banking support for customer service and regulated process execution.",
      es: "Soporte bancario operativo orientado a atencion al cliente y ejecucion de procesos regulados.",
    },
    responsibilities: {
      en: [
        "Customer support for banking products",
        "Fraud alerts and KYC processes",
        "Operational banking assistance",
      ],
      es: [
        "Soporte a clientes en productos bancarios",
        "Alertas de fraude y procesos KYC",
        "Asistencia operativa bancaria",
      ],
    },
  },
  {
    company: { en: "Movistar Prosegur Alarmas", es: "Movistar Prosegur Alarmas" },
    role: { en: "Technical Support Operations", es: "Operaciones de Soporte Tecnico" },
    period: "2019 - 2020",
    logo: "/company-logos/movistar-prosegur-alarmas-official.png",
    logoAlt: { en: "Movistar Prosegur Alarmas logo", es: "Logotipo Movistar Prosegur Alarmas" },
    summary: {
      en: "Technical support operations with service coordination and field appointment management.",
      es: "Operaciones de soporte tecnico con coordinacion de servicio y gestion de citas de campo.",
    },
    responsibilities: {
      en: [
        "Technical support operations",
        "Alarm system troubleshooting",
        "Appointment coordination for technical visits",
      ],
      es: [
        "Operaciones de soporte tecnico",
        "Resolucion de incidencias en sistemas de alarma",
        "Coordinacion de citas para visitas tecnicas",
      ],
    },
  },
];

const snapshotEntries: SnapshotEntryLocalized[] = [
  {
    company: { en: "RPC", es: "RPC" },
    logo: "/company-logos/rpc.svg",
    logoAlt: { en: "RPC logo", es: "Logotipo RPC" },
    description: {
      en: "Consulting support for Purchasing and Aftersales processes, reporting and KPI follow-up.",
      es: "Soporte de consultoria para procesos de Purchasing y Aftersales, reporting y seguimiento de KPI.",
    },
  },
  {
    company: { en: "Endesa", es: "Endesa" },
    logo: "/company-logos/endesa.svg",
    logoAlt: { en: "Endesa logo", es: "Logotipo Endesa" },
    description: {
      en: "Solar financing documentation and operational coordination.",
      es: "Documentacion de financiacion solar y coordinacion operativa.",
    },
  },
  {
    company: { en: "Ayuntamiento de Madrid", es: "Ayuntamiento de Madrid" },
    logo: "/company-logos/madrid-city-council.svg",
    logoAlt: { en: "Ayuntamiento de Madrid logo", es: "Logotipo Ayuntamiento de Madrid" },
    description: {
      en: "Public procurement administration.",
      es: "Administracion de contratacion publica.",
    },
  },
  {
    company: { en: "Openbank", es: "Openbank" },
    logo: "/company-logos/openbank-icon.png",
    logoAlt: { en: "Openbank logo", es: "Logotipo Openbank" },
    description: {
      en: "Banking customer support operations.",
      es: "Operaciones de soporte al cliente bancario.",
    },
  },
];

export function getExperienceEntries(locale: Locale): ExperienceEntry[] {
  return entries.map((entry) => ({
    company: entry.company[locale],
    role: entry.role[locale],
    period: entry.period,
    logo: entry.logo,
    logoAlt: entry.logoAlt[locale],
    summary: entry.summary[locale],
    responsibilities: entry.responsibilities[locale],
  }));
}

export function getExperienceSnapshot(locale: Locale): SnapshotEntry[] {
  return snapshotEntries.map((entry) => ({
    company: entry.company[locale],
    logo: entry.logo,
    logoAlt: entry.logoAlt[locale],
    description: entry.description[locale],
  }));
}

export const experienceEntries = getExperienceEntries("en");
export const experienceSnapshot = getExperienceSnapshot("en");

