import type { Locale } from "@/lib/i18n";

type LocalizedString = Record<Locale, string>;
type LocalizedStringArray = Record<Locale, string[]>;

type ProjectEntry = {
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  tags: LocalizedStringArray;
  overview: LocalizedString;
  keyActivities: LocalizedStringArray;
  tools: LocalizedStringArray;
  operationalImpact: LocalizedString;
  imageSrc: string;
  imageAlt: LocalizedString;
  videoSrc?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  overview: string;
  keyActivities: string[];
  tools: string[];
  operationalImpact: string;
  imageSrc: string;
  imageAlt: string;
  videoSrc?: string;
};

const projectEntries: ProjectEntry[] = [
  {
    slug: "purchasing-operations-support-bmw-project",
    title: {
      en: "Purchasing Operations Support - BMW Project",
      es: "Soporte de Operaciones de Compras - Proyecto BMW",
    },
    summary: {
      en: "Operational support for BMW purchasing processes through RPC, with SAP incident handling, process monitoring, and structured reporting.",
      es: "Soporte operativo a procesos de compras de BMW a traves de RPC, con gestion de incidencias SAP, seguimiento de procesos y reporting estructurado.",
    },
    tags: {
      en: ["Purchasing Operations", "SAP Support", "Procurement Reporting"],
      es: ["Operaciones de Compras", "Soporte SAP", "Reporting de Compras"],
    },
    overview: {
      en: "This project supports the purchasing operations department in a BMW-related consulting engagement managed through RPC. The role is centered on operational coordination, SAP user support, and continuous monitoring of purchasing workflows to keep execution aligned with BMW procurement standards.",
      es: "Este proyecto da soporte al departamento de operaciones de compras en un entorno de consultoria relacionado con BMW y gestionado a traves de RPC. El rol se centra en coordinacion operativa, soporte a usuarios de SAP y seguimiento continuo de los flujos de compras para mantener la ejecucion alineada con los estandares de compras de BMW.",
    },
    keyActivities: {
      en: [
        "Support internal users with SAP-related purchasing issues.",
        "Manage operational requests linked to vendor management and purchasing workflows.",
        "Generate and present quarterly and biannual operational reports.",
        "Monitor purchasing activity and audit process execution against BMW procurement guidelines.",
        "Support the purchasing department in maintaining process transparency and reporting accuracy.",
      ],
      es: [
        "Dar soporte a usuarios internos con incidencias de compras en SAP.",
        "Gestionar solicitudes operativas vinculadas a gestion de proveedores y flujos de compras.",
        "Generar y presentar informes operativos trimestrales y semestrales.",
        "Supervisar la actividad de compras y auditar la ejecucion del proceso segun las directrices de BMW.",
        "Apoyar al departamento de compras en transparencia de proceso y precision del reporting.",
      ],
    },
    tools: {
      en: ["SAP", "Excel", "Qlik Sense", "Coupa", "Outlook"],
      es: ["SAP", "Excel", "Qlik Sense", "Coupa", "Outlook"],
    },
    operationalImpact: {
      en: "Improved operational visibility in purchasing workflows, faster SAP user issue resolution, and stronger procurement monitoring through structured reporting.",
      es: "Mejor visibilidad operativa en los flujos de compras, resolucion mas agil de incidencias SAP y mayor control de compras mediante reporting estructurado.",
    },
    imageSrc: "/projects/purchasing-operations-dashboard.svg",
    imageAlt: {
      en: "BMW purchasing operations dashboard with supplier KPIs, purchase order tracking, and process monitoring.",
      es: "Dashboard de operaciones de compras BMW con KPIs de proveedores, seguimiento de ordenes y monitorizacion de procesos.",
    },
  },
  {
    slug: "dealership-performance-incentive-program-bmw-network",
    title: {
      en: "Dealership Performance & Incentive Program - BMW Network",
      es: "Rendimiento de Concesionarios e Incentivos - Red BMW",
    },
    summary: {
      en: "Operational reporting and dealership coordination to increase participation in BMW accessory and tyre incentive campaigns.",
      es: "Reporting operativo y coordinacion con concesionarios para aumentar la participacion en campanas de incentivos de accesorios y neumaticos BMW.",
    },
    tags: {
      en: ["Dealership Performance", "Incentive Programs", "Sales Reporting"],
      es: ["Rendimiento de Concesionarios", "Programas de Incentivos", "Reporting Comercial"],
    },
    overview: {
      en: "This project supports BMW network initiatives aimed at increasing accessory and tyre sales through targeted incentive campaigns. The work combines performance monitoring, dealership communication, and data-backed proposals to improve campaign adoption.",
      es: "Este proyecto da soporte a iniciativas de la red BMW orientadas a incrementar ventas de accesorios y neumaticos mediante campanas de incentivos. El trabajo combina seguimiento de rendimiento, comunicacion con concesionarios y propuestas basadas en datos para mejorar la adopcion de campanas.",
    },
    keyActivities: {
      en: [
        "Monitor accessory and tyre sales data across dealerships.",
        "Prepare reports highlighting performance trends and opportunity areas.",
        "Contact dealerships to discuss active promotional initiatives.",
        "Present data-driven proposals to increase participation in incentive campaigns.",
        "Track dealership engagement and campaign adoption progress.",
      ],
      es: [
        "Monitorizar datos de ventas de accesorios y neumaticos en concesionarios.",
        "Preparar informes con tendencias de rendimiento y areas de oportunidad.",
        "Contactar concesionarios para revisar iniciativas promocionales activas.",
        "Presentar propuestas basadas en datos para aumentar participacion en campanas.",
        "Hacer seguimiento de engagement de concesionarios y adopcion de campanas.",
      ],
    },
    tools: {
      en: ["Excel", "Qlik Sense", "CRM tools", "Reporting dashboards"],
      es: ["Excel", "Qlik Sense", "Herramientas CRM", "Dashboards de reporting"],
    },
    operationalImpact: {
      en: "Improved visibility of dealership performance, stronger engagement with the dealership network, and increased participation in accessory and tyre campaigns.",
      es: "Mayor visibilidad del rendimiento de concesionarios, mejor relacion con la red comercial y aumento de participacion en campanas de accesorios y neumaticos.",
    },
    imageSrc: "/projects/dealership-showroom.jpg",
    imageAlt: {
      en: "Dealership performance dashboard with campaign KPIs, trend charts, and incentive monitoring panels.",
      es: "Dashboard de rendimiento de concesionarios con KPIs de campanas, graficos de tendencia y paneles de incentivos.",
    },
    videoSrc: "/videos/portfolio-introduction.mp4",
  },
  {
    slug: "rpc-partner-academy-training-content-development",
    title: {
      en: "RPC Partner Academy - Training Content Development",
      es: "RPC Partner Academy - Desarrollo de Contenido Formativo",
    },
    summary: {
      en: "Structured development of training materials and web content for RPC Partner Academy online and in-person programs.",
      es: "Desarrollo estructurado de materiales formativos y contenido web para programas online y presenciales de RPC Partner Academy.",
    },
    tags: {
      en: ["Training Content", "Learning Operations", "Documentation"],
      es: ["Contenido Formativo", "Operaciones de Formacion", "Documentacion"],
    },
    overview: {
      en: "This project supports content creation for RPC Partner Academy, which delivers training courses for partners and professionals in both online and in-person formats. The focus is on structuring learning content so materials are clear, reusable, and aligned with training delivery needs.",
      es: "Este proyecto da soporte a la creacion de contenidos para RPC Partner Academy, que imparte formaciones para partners y profesionales en formato online y presencial. El foco esta en estructurar contenidos para que los materiales sean claros, reutilizables y alineados con las necesidades de imparticion.",
    },
    keyActivities: {
      en: [
        "Create structured web content for training courses.",
        "Prepare course materials for in-person and online sessions.",
        "Organize training modules and documentation for educational use.",
        "Support the content architecture of the academy training platform.",
      ],
      es: [
        "Crear contenido web estructurado para cursos de formacion.",
        "Preparar materiales para sesiones presenciales y online.",
        "Organizar modulos formativos y documentacion para uso educativo.",
        "Apoyar la arquitectura de contenidos de la plataforma de la academia.",
      ],
    },
    tools: {
      en: ["Content management systems", "Documentation tools", "Learning platform interfaces"],
      es: ["Sistemas de gestion de contenidos", "Herramientas de documentacion", "Interfaces de plataformas de aprendizaje"],
    },
    operationalImpact: {
      en: "Improved clarity and organization of training materials, better participant learning experience, and stronger documentation support for both online and in-person delivery.",
      es: "Mayor claridad y organizacion de materiales formativos, mejor experiencia de aprendizaje para participantes y soporte documental mas solido para formacion online y presencial.",
    },
    imageSrc: "/projects/rpc-partner-academy-meeting.png",
    imageAlt: {
      en: "Corporate training session in a business meeting environment with participants and presentation context.",
      es: "Sesion de formacion corporativa en entorno de reunion de negocio con participantes y contexto de presentacion.",
    },
  },
];

export function getProjects(locale: Locale = "en"): Project[] {
  return projectEntries.map((entry) => ({
    slug: entry.slug,
    title: entry.title[locale],
    summary: entry.summary[locale],
    tags: entry.tags[locale],
    overview: entry.overview[locale],
    keyActivities: entry.keyActivities[locale],
    tools: entry.tools[locale],
    operationalImpact: entry.operationalImpact[locale],
    imageSrc: entry.imageSrc,
    imageAlt: entry.imageAlt[locale],
    videoSrc: entry.videoSrc,
  }));
}

export function getProjectBySlug(localeOrSlug: Locale | string, slugArg?: string) {
  const locale = slugArg ? (localeOrSlug as Locale) : "en";
  const slug = slugArg ?? (localeOrSlug as string);
  return getProjects(locale).find((project) => project.slug === slug);
}

export const projects = getProjects("en");
