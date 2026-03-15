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
      en: "Personal portfolio developed to present my professional background, projects and interests in digital tools and emerging technologies.",
      es: "Portfolio personal desarrollado para presentar mi trayectoria profesional, proyectos e intereses en herramientas digitales y tecnologias emergentes.",
    },
    tags: {
      en: ["Personal project", "Web content", "Professional presentation"],
      es: ["Proyecto personal", "Contenido web", "Presentacion profesional"],
    },
    overview: {
      en: "This project brings together my professional experience, education and personal interests in a clearer and more structured way. The goal is to have a digital space that reflects my profile in operations, data and digital projects without overstating the technical side.",
      es: "Este proyecto reune mi experiencia profesional, formacion e intereses personales de forma mas clara y estructurada. El objetivo es contar con un espacio digital que refleje mi perfil en operaciones, datos y proyectos digitales sin sobredimensionar la parte tecnica.",
    },
    keyActivities: {
      en: [
        "Structure professional information with a clear business-oriented narrative.",
        "Organize bilingual content for experience, projects and education.",
        "Present digital interests in a realistic and professional way.",
        "Maintain the site as a practical communication and positioning tool.",
      ],
      es: [
        "Estructurar la informacion profesional con una narrativa clara y orientada a negocio.",
        "Organizar contenido bilingue para experiencia, proyectos y formacion.",
        "Presentar intereses digitales de forma realista y profesional.",
        "Mantener la web como una herramienta practica de comunicacion y posicionamiento.",
      ],
    },
    tools: {
      en: ["Web content", "Content structure", "Digital tools"],
      es: ["Contenido web", "Estructura de contenido", "Herramientas digitales"],
    },
    operationalImpact: {
      en: "Creates a more coherent professional presentation and helps communicate the link between operations, data and digital interests.",
      es: "Aporta una presentacion profesional mas coherente y ayuda a comunicar la relacion entre operaciones, datos e intereses digitales.",
    },
    imageSrc: "/projects/training-platform-real.png",
    imageAlt: {
      en: "Portfolio and digital content interface presented on a modern website layout.",
      es: "Interfaz de portfolio y contenido digital presentada en un sitio web moderno.",
    },
  },
  {
    slug: "ai-tools-for-content-and-productivity",
    title: {
      en: "AI Tools for Content and Productivity",
      es: "Herramientas de IA para Contenido y Productividad",
    },
    summary: {
      en: "Exploration of AI tools applied to content creation, information organization and productivity.",
      es: "Exploracion de herramientas de IA aplicadas a la creacion de contenido, organizacion de informacion y productividad.",
    },
    tags: {
      en: ["AI exploration", "Productivity", "Information workflows"],
      es: ["Exploracion de IA", "Productividad", "Flujos de informacion"],
    },
    overview: {
      en: "This line of personal work focuses on practical uses of AI in everyday tasks. The interest is not advanced engineering, but rather how digital assistants and AI-supported workflows can help write, organize information and speed up repetitive work.",
      es: "Esta linea de trabajo personal se centra en usos practicos de la IA en tareas cotidianas. El interes no esta en la ingenieria avanzada, sino en como asistentes digitales y flujos apoyados por IA pueden ayudar a escribir, organizar informacion y agilizar trabajo repetitivo.",
    },
    keyActivities: {
      en: [
        "Test AI tools for content drafting and editing.",
        "Explore ways to organize notes, documents and recurring information.",
        "Assess practical workflow improvements for day-to-day productivity.",
        "Translate experimentation into useful habits for professional work.",
      ],
      es: [
        "Probar herramientas de IA para redaccion y edicion de contenido.",
        "Explorar formas de organizar notas, documentos e informacion recurrente.",
        "Evaluar mejoras practicas de flujo de trabajo para la productividad diaria.",
        "Trasladar la experimentacion a habitos utiles para el trabajo profesional.",
      ],
    },
    tools: {
      en: ["AI tools", "Content workflows", "Productivity tools"],
      es: ["Herramientas de IA", "Flujos de contenido", "Herramientas de productividad"],
    },
    operationalImpact: {
      en: "Supports faster content work, clearer information management and a more practical view of AI in real business contexts.",
      es: "Favorece un trabajo de contenido mas agil, una mejor gestion de la informacion y una vision mas practica de la IA en contextos reales de negocio.",
    },
    imageSrc: "/projects/solar-financing-documentation-workflow.svg",
    imageAlt: {
      en: "Workflow diagram representing digital tools, information organization and AI-assisted productivity.",
      es: "Diagrama de flujo que representa herramientas digitales, organizacion de informacion y productividad asistida por IA.",
    },
  },
  {
    slug: "dashboards-kpi-and-data-analysis",
    title: {
      en: "Dashboards, KPI Tracking and Data Analysis",
      es: "Dashboards, KPI y Analisis de Datos",
    },
    summary: {
      en: "Interest in dashboards, KPI tracking and data analysis in business environments using tools such as Excel and Qlik Sense.",
      es: "Interes en el uso de dashboards, seguimiento de KPI y analisis de datos en entornos de negocio mediante herramientas como Excel y Qlik Sense.",
    },
    tags: {
      en: ["Dashboards", "KPI tracking", "Business analysis"],
      es: ["Dashboards", "Seguimiento de KPI", "Analisis de negocio"],
    },
    overview: {
      en: "This project area reflects my ongoing interest in making business information easier to read and use. It connects naturally with my professional work in operations, where data, dashboards and structured follow-up help improve visibility and decision-making.",
      es: "Esta area de proyectos refleja mi interes continuo por hacer que la informacion de negocio sea mas facil de leer y utilizar. Se conecta de forma natural con mi trabajo en operaciones, donde los datos, los dashboards y el seguimiento estructurado ayudan a mejorar visibilidad y toma de decisiones.",
    },
    keyActivities: {
      en: [
        "Build and review KPI-oriented reporting views.",
        "Organize data to support clearer operational follow-up.",
        "Explore practical dashboard structures for business teams.",
        "Use Excel and Qlik Sense as reference tools for analysis and visibility.",
      ],
      es: [
        "Construir y revisar vistas de reporting orientadas a KPI.",
        "Organizar datos para facilitar un seguimiento operativo mas claro.",
        "Explorar estructuras de dashboard practicas para equipos de negocio.",
        "Utilizar Excel y Qlik Sense como herramientas de referencia para analisis y visibilidad.",
      ],
    },
    tools: {
      en: ["Excel", "Qlik Sense", "Dashboards"],
      es: ["Excel", "Qlik Sense", "Dashboards"],
    },
    operationalImpact: {
      en: "Reinforces a practical approach to data analysis and supports better visibility over processes, results and improvement opportunities.",
      es: "Refuerza un enfoque practico del analisis de datos y ayuda a mejorar la visibilidad sobre procesos, resultados y oportunidades de mejora.",
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

