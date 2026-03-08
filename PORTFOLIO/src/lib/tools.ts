export type Tool = {
  slug: string;
  name: string;
  logo: string;
  description: string;
  status: "Core Platform" | "Daily Tool";
  features: string[];
};

export const tools: Tool[] = [
  {
    slug: "sap",
    name: "SAP",
    logo: "/tools/sap.svg",
    description:
      "Used for purchasing operations, purchase order tracking, and procurement process execution.",
    status: "Core Platform",
    features: [
      "Purchase order lifecycle visibility",
      "Procurement process control",
      "Operational follow-up support",
    ],
  },
  {
    slug: "qlik-sense",
    name: "Qlik Sense",
    logo: "/tools/qlik-sense.svg",
    description:
      "Used to build KPI dashboards and reporting views for operational decision support.",
    status: "Core Platform",
    features: [
      "KPI dashboard design",
      "Performance trend analysis",
      "Operational reporting views",
    ],
  },
  {
    slug: "excel",
    name: "Microsoft Excel",
    logo: "/tools/excel.svg",
    description:
      "Used for structured data analysis, KPI preparation, and operational tracking tables.",
    status: "Daily Tool",
    features: [
      "Data cleaning and analysis",
      "KPI tracking templates",
      "Operational reporting support",
    ],
  },
  {
    slug: "outlook",
    name: "Microsoft Outlook",
    logo: "/tools/outlook.svg",
    description:
      "Used for supplier communication, follow-up management, and stakeholder coordination.",
    status: "Daily Tool",
    features: [
      "Supplier communication",
      "Status follow-up",
      "Cross-team coordination",
    ],
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    logo: "/tools/salesforce.svg",
    description:
      "Used in operations environments that require case tracking and documentation follow-up.",
    status: "Daily Tool",
    features: [
      "Case and process tracking",
      "Documentation management support",
      "Workflow visibility",
    ],
  },
  {
    slug: "jira",
    name: "Jira",
    logo: "/tools/jira.svg",
    description:
      "Used for operational task tracking, workflow coordination, and process follow-up.",
    status: "Daily Tool",
    features: [
      "Task and workflow tracking",
      "Cross-team coordination",
      "Operational backlog visibility",
    ],
  },
];
