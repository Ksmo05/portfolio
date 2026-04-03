import { dashboardCopy, type DashboardLang } from "./inboxDashboardCopy";

export function getDashboardCopy(lang: DashboardLang) {
  return dashboardCopy[lang];
}

export function translatePriority(value: string, lang: DashboardLang) {
  const copy = dashboardCopy[lang];
  if (value === "low") return copy.low;
  if (value === "medium") return copy.medium;
  if (value === "high") return copy.high;
  return value;
}

export function translateCategory(value: string, lang: DashboardLang) {
  const copy = dashboardCopy[lang];
  if (value === "question") return copy.question;
  if (value === "project inquiry" || value === "project_inquiry" || value === "project inquiry") {
    return copy.projectInquiry;
  }
  if (value === "suggestion") return copy.suggestion;
  if (value === "bug report" || value === "bug_report") return copy.bugReport;
  if (value === "general feedback" || value === "general_feedback") return copy.generalFeedback;
  return value;
}

export function formatDashboardDate(value: string, lang: DashboardLang) {
  try {
    return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
