import type { Locale } from "@/lib/i18n";

export type EducationEntry = {
  title: string;
  institutionType: string;
  institution: string;
  logo: string;
  logoAlt: string;
  description: string;
};

const educationByLocale: Record<Locale, EducationEntry[]> = {
  en: [
    {
      title: "Bachelor's Degree in Business Administration",
      institutionType: "University Degree",
      institution: "Universidad Rey Juan Carlos",
      logo: "/education-logos/urjc.png",
      logoAlt: "Universidad Rey Juan Carlos logo",
      description:
        "Academic foundation in business management, organizational processes, finance, and operational decision-making.",
    },
    {
      title: "Higher Technician in Network Systems Administration (ASIR)",
      institutionType: "Higher Technical Qualification",
      institution: "Universidad Europea",
      logo: "/education-logos/universidad-europea.svg",
      logoAlt: "Universidad Europea logo",
      description:
        "Technical training in systems administration, infrastructure fundamentals, and IT support environments.",
    },
    {
      title: "University certificate studies in Cybersecurity, Artificial Intelligence and Big Data",
      institutionType: "University Continuing Studies",
      institution: "Universidad Europea",
      logo: "/education-logos/universidad-europea.svg",
      logoAlt: "Universidad Europea logo",
      description:
        "Complementary studies to strengthen analytical and digital capabilities applied to operations contexts.",
    },
  ],
  es: [
    {
      title: "Grado en Administracion y Direccion de Empresas",
      institutionType: "Titulo Universitario",
      institution: "Universidad Rey Juan Carlos",
      logo: "/education-logos/urjc.png",
      logoAlt: "Logotipo Universidad Rey Juan Carlos",
      description:
        "Base academica en gestion empresarial, procesos organizativos, finanzas y toma de decisiones operativas.",
    },
    {
      title: "Tecnico Superior en Administracion de Sistemas en Red (ASIR)",
      institutionType: "Titulacion Tecnica Superior",
      institution: "Universidad Europea",
      logo: "/education-logos/universidad-europea.svg",
      logoAlt: "Logotipo Universidad Europea",
      description:
        "Formacion tecnica en administracion de sistemas, fundamentos de infraestructura y entornos de soporte TI.",
    },
    {
      title: "Estudios universitarios en Ciberseguridad, Inteligencia Artificial y Big Data",
      institutionType: "Formacion Universitaria Complementaria",
      institution: "Universidad Europea",
      logo: "/education-logos/universidad-europea.svg",
      logoAlt: "Logotipo Universidad Europea",
      description:
        "Estudios complementarios para reforzar capacidades analiticas y digitales aplicadas a entornos operativos.",
    },
  ],
};

export function getEducationEntries(locale: Locale): EducationEntry[] {
  return educationByLocale[locale];
}

// Backward compatibility
export const educationEntries = educationByLocale.en;
