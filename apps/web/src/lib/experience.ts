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
    role: { en: "Purchasing & Procurement Operations Consultant", es: "Consultor de Operaciones de Purchasing y Procurement" },
    period: "2025 - Present",
    logo: "/company-logos/rpc.svg",
    logoAlt: { en: "RPC logo", es: "Logotipo RPC" },
    summary: {
      en: "Current role managing purchasing operations across Spain and Portugal, with responsibility for KPI monitoring, supplier governance, SAP and Coupa support, compliance follow-up and process optimization in a BMW-related business environment.",
      es: "Rol actual gestionando operaciones de purchasing en Espana y Portugal, con responsabilidad sobre seguimiento de KPI, supplier governance, soporte en SAP y Coupa, compliance y optimizacion de procesos en un entorno de negocio vinculado a BMW.",
    },
    responsibilities: {
      en: [
        "Independently manage Purchasing IB operations across Spain and Portugal.",
        "Monitor KPI, reporting and operational analytics through Qlik Sense and Excel.",
        "Support supplier governance, audits, ICS controls and procurement compliance tasks.",
        "Provide SAP and Coupa operational support to buyers, suppliers and business units.",
        "Coordinate process execution, issue resolution and purchasing workflow optimization.",
      ],
      es: [
        "Gestionar de forma autonoma operaciones de Purchasing IB en Espana y Portugal.",
        "Realizar seguimiento de KPI, reporting y analitica operativa con Qlik Sense y Excel.",
        "Dar soporte a supplier governance, auditorias, controles ICS y tareas de procurement compliance.",
        "Prestar soporte operativo en SAP y Coupa a buyers, suppliers y business units.",
        "Coordinar ejecucion de procesos, resolucion de incidencias y optimizacion de workflows de compras.",
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
      en: "Back-office operations support focused on documentation, validation and coordination in solar financing workflows.",
      es: "Soporte de back office enfocado en documentacion, validacion y coordinacion en workflows de financiacion solar.",
    },
    responsibilities: {
      en: [
        "Review and manage documentation required for solar financing processes.",
        "Support customer validation steps and structured back-office checks.",
        "Coordinate follow-up between teams involved in each case.",
        "Use Salesforce to register incidents, updates and process status.",
      ],
      es: [
        "Revisar y gestionar la documentacion necesaria para procesos de financiacion solar.",
        "Dar soporte a pasos de validacion de clientes y controles estructurados de back office.",
        "Coordinar el seguimiento entre los equipos implicados en cada caso.",
        "Utilizar Salesforce para registrar incidencias, actualizaciones y estado del proceso.",
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
      en: "Administrative support in public procurement, with a focus on documentation control, coordination and process follow-up.",
      es: "Soporte administrativo en contratacion publica, con foco en control documental, coordinacion y seguimiento de procesos.",
    },
    responsibilities: {
      en: [
        "Support administrative tasks linked to public procurement procedures.",
        "Review and manage contract and tender documentation.",
        "Work with procurement platforms and required process records.",
        "Coordinate documentation and follow-up across administrative steps.",
      ],
      es: [
        "Dar soporte a tareas administrativas vinculadas a procedimientos de contratacion publica.",
        "Revisar y gestionar documentacion contractual y de licitaciones.",
        "Trabajar con plataformas de contratacion y registros requeridos del proceso.",
        "Coordinar documentacion y seguimiento entre las distintas fases administrativas.",
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
      en: "Operational banking support focused on customer service, issue handling and regulated process execution.",
      es: "Soporte bancario operativo enfocado en atencion al cliente, gestion de incidencias y ejecucion de procesos regulados.",
    },
    responsibilities: {
      en: [
        "Assist customers with queries related to banking products and processes.",
        "Manage operational tasks linked to fraud alerts and KYC checks.",
        "Support regulated banking workflows with attention to accuracy and response times.",
      ],
      es: [
        "Atender consultas de clientes relacionadas con productos y procesos bancarios.",
        "Gestionar tareas operativas vinculadas a alertas de fraude y controles KYC.",
        "Dar soporte a workflows bancarios regulados con atencion a la precision y los tiempos de respuesta.",
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
      en: "Technical support operations role combining incident handling, service coordination and field visit scheduling.",
      es: "Rol de soporte tecnico-operativo que combinaba gestion de incidencias, coordinacion de servicio y programacion de visitas de campo.",
    },
    responsibilities: {
      en: [
        "Support day-to-day technical operations related to alarm service incidents.",
        "Help resolve customer issues and coordinate the appropriate response.",
        "Organize appointments and follow-up for technician visits.",
      ],
      es: [
        "Dar soporte a la operativa diaria relacionada con incidencias del servicio de alarmas.",
        "Ayudar a resolver incidencias de clientes y coordinar la respuesta adecuada.",
        "Organizar citas y seguimiento para visitas de tecnicos.",
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
      en: "Purchasing operations, KPI reporting, SAP and Coupa support, and supplier governance follow-up.",
      es: "Operaciones de purchasing, reporting KPI, soporte SAP y Coupa, y seguimiento de supplier governance.",
    },
  },
  {
    company: { en: "Endesa", es: "Endesa" },
    logo: "/company-logos/endesa.svg",
    logoAlt: { en: "Endesa logo", es: "Logotipo Endesa" },
    description: {
      en: "Documentation validation and coordination in solar financing operations.",
      es: "Validacion documental y coordinacion en operaciones de financiacion solar.",
    },
  },
  {
    company: { en: "Ayuntamiento de Madrid", es: "Ayuntamiento de Madrid" },
    logo: "/company-logos/madrid-city-council.svg",
    logoAlt: { en: "Ayuntamiento de Madrid logo", es: "Logotipo Ayuntamiento de Madrid" },
    description: {
      en: "Administrative support for public procurement processes.",
      es: "Soporte administrativo para procesos de contratacion publica.",
    },
  },
  {
    company: { en: "Openbank", es: "Openbank" },
    logo: "/company-logos/openbank-icon.png",
    logoAlt: { en: "Openbank logo", es: "Logotipo Openbank" },
    description: {
      en: "Operational banking support and customer process handling.",
      es: "Soporte bancario operativo y gestion de procesos de cliente.",
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

