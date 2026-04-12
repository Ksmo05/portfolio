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
    slug: "personal-portfolio-website",
    title: {
      en: "Personal Portfolio Website",
      es: "Portfolio Personal",
    },
    summary: {
      en: "Personal portfolio designed to communicate my professional background in operations, reporting, digital workflows and practical uses of AI.",
      es: "Portfolio personal disenado para comunicar mi trayectoria profesional en operaciones, reporting, workflows digitales y usos practicos de la IA.",
    },
    tags: {
      en: ["Personal initiative", "Professional positioning", "Digital communication"],
      es: ["Iniciativa personal", "Posicionamiento profesional", "Comunicacion digital"],
    },
    overview: {
      en: "This project brings together experience, education and selected digital initiatives in a more structured format. The goal is to present a credible profile built around operations, data follow-up, process support and practical digital tools.",
      es: "Este proyecto reune experiencia, formacion e iniciativas digitales seleccionadas en un formato mas estructurado. El objetivo es presentar un perfil creible basado en operaciones, seguimiento de datos, soporte a procesos y herramientas digitales practicas.",
    },
    keyActivities: {
      en: [
        "Structure professional information with a clear corporate narrative.",
        "Organize bilingual content for experience, projects and education.",
        "Present digital initiatives as practical support for business workflows.",
        "Maintain the site as a communication tool for recruiters and professional contacts.",
      ],
      es: [
        "Estructurar la informacion profesional con una narrativa clara y corporativa.",
        "Organizar contenido bilingue para experiencia, proyectos y formacion.",
        "Presentar iniciativas digitales como apoyo practico a workflows de negocio.",
        "Mantener la web como herramienta de comunicacion para recruiters y contactos profesionales.",
      ],
    },
    tools: {
      en: ["Content structure", "Digital communication", "Workflow thinking"],
      es: ["Estructura de contenido", "Comunicacion digital", "Enfoque a workflows"],
    },
    operationalImpact: {
      en: "Creates a clearer professional presentation and helps explain how operations, data and digital tools connect in my profile.",
      es: "Aporta una presentacion profesional mas clara y ayuda a explicar como se conectan operaciones, datos y herramientas digitales en mi perfil.",
    },
    imageSrc: "/projects/personal-portfolio-website-reference.png",
    imageAlt: {
      en: "Illustrated personal portfolio concept showing before-and-after transformation, digital tools, and professional positioning.",
      es: "Concepto ilustrado de portfolio personal mostrando transformacion, herramientas digitales y posicionamiento profesional.",
    },
  },
  {
    slug: "ai-tools-for-content-and-productivity",
    title: {
      en: "AI Tools for Content and Productivity",
      es: "Herramientas de IA para Contenido y Productividad",
    },
    summary: {
      en: "Practical exploration of AI tools applied to writing support, information organization and day-to-day productivity.",
      es: "Exploracion practica de herramientas de IA aplicadas a apoyo en redaccion, organizacion de informacion y productividad del dia a dia.",
    },
    tags: {
      en: ["Practical AI", "Productivity", "Information workflows"],
      es: ["IA practica", "Productividad", "Flujos de informacion"],
    },
    overview: {
      en: "This project area focuses on practical uses of AI in everyday work. The emphasis is on using digital assistants to support content, organize information and simplify repetitive tasks in a realistic business context.",
      es: "Esta area de proyectos se centra en usos practicos de la IA en el trabajo diario. El enfoque esta en utilizar asistentes digitales para apoyar contenido, organizar informacion y simplificar tareas repetitivas en un contexto real de negocio.",
    },
    keyActivities: {
      en: [
        "Test AI tools for drafting, rewriting and summarizing recurring content.",
        "Explore ways to organize notes, documents and operational information.",
        "Assess simple workflow improvements that save time in day-to-day tasks.",
        "Translate experimentation into useful habits for productivity and coordination.",
      ],
      es: [
        "Probar herramientas de IA para redactar, reescribir y resumir contenido recurrente.",
        "Explorar formas de organizar notas, documentos e informacion operativa.",
        "Evaluar mejoras simples de workflow que ahorren tiempo en tareas del dia a dia.",
        "Trasladar la experimentacion a habitos utiles para productividad y coordinacion.",
      ],
    },
    tools: {
      en: ["AI tools", "Information workflows", "Productivity tools"],
      es: ["Herramientas de IA", "Flujos de informacion", "Herramientas de productividad"],
    },
    operationalImpact: {
      en: "Supports faster content work, clearer information handling and a more grounded use of AI in real business routines.",
      es: "Favorece un trabajo de contenido mas agil, una gestion de informacion mas clara y un uso mas realista de la IA en rutinas de negocio.",
    },
    imageSrc: "/projects/ai-tools-productivity-reference.png",
    imageAlt: {
      en: "Futuristic AI workstation showing content creation, automation, and productivity support workflows.",
      es: "Estacion de trabajo futurista de IA mostrando creacion de contenido, automatizacion y flujos de productividad.",
    },
  },
  {
    slug: "dashboards-kpi-and-data-analysis",
    title: {
      en: "Dashboards, KPI Tracking and Data Analysis",
      es: "Dashboards, KPI y Analisis de Datos",
    },
    summary: {
      en: "Practical work around dashboards, KPI tracking and data analysis to improve visibility in business environments.",
      es: "Trabajo practico alrededor de dashboards, seguimiento de KPI y analisis de datos para mejorar la visibilidad en entornos de negocio.",
    },
    tags: {
      en: ["Dashboards", "Reporting", "Operational analysis"],
      es: ["Dashboards", "Reporting", "Analisis operativo"],
    },
    overview: {
      en: "This project area reflects my interest in making operational information easier to read and use. It connects with reporting, follow-up and dashboard work that help teams monitor activity, detect issues and maintain visibility.",
      es: "Esta area de proyectos refleja mi interes por hacer que la informacion operativa sea mas facil de leer y utilizar. Se conecta con trabajo de reporting, seguimiento y dashboards que ayudan a los equipos a monitorizar actividad, detectar incidencias y mantener visibilidad.",
    },
    keyActivities: {
      en: [
        "Prepare and review KPI-oriented reporting views.",
        "Organize data to support clearer operational follow-up.",
        "Explore dashboard structures that help business teams read performance more easily.",
        "Use Excel and Qlik Sense as practical tools for analysis and visibility.",
      ],
      es: [
        "Preparar y revisar vistas de reporting orientadas a KPI.",
        "Organizar datos para facilitar un seguimiento operativo mas claro.",
        "Explorar estructuras de dashboard que ayuden a equipos de negocio a leer mejor el rendimiento.",
        "Utilizar Excel y Qlik Sense como herramientas practicas de analisis y visibilidad.",
      ],
    },
    tools: {
      en: ["Excel", "Qlik Sense", "Dashboards"],
      es: ["Excel", "Qlik Sense", "Dashboards"],
    },
    operationalImpact: {
      en: "Reinforces a practical approach to reporting and analysis, improving visibility over processes, results and follow-up needs.",
      es: "Refuerza un enfoque practico del reporting y el analisis, mejorando la visibilidad sobre procesos, resultados y necesidades de seguimiento.",
    },
    imageSrc: "/projects/purchasing-operations-dashboard.svg",
    imageAlt: {
      en: "Business dashboard with KPI indicators, trend charts and operational reporting panels.",
      es: "Dashboard de negocio con indicadores KPI, graficos de tendencia y paneles de reporting operativo.",
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

