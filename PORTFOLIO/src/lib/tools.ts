export type Tool = {
  slug: string;
  title: string;
  description: string;
  status: "Core Platform" | "Daily Tool";
  features: string[];
};

export const tools: Tool[] = [
  {
    slug: "sap",
    title: "SAP",
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
    title: "Qlik Sense",
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
    slug: "coupa",
    title: "Coupa",
    description:
      "Supports purchasing workflow management, approvals, and supplier-related coordination.",
    status: "Daily Tool",
    features: [
      "Procurement workflow support",
      "Approval flow visibility",
      "Vendor process coordination",
    ],
  },
  {
    slug: "excel",
    title: "Excel",
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
    title: "Outlook",
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
    title: "Salesforce",
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
    title: "Jira",
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
