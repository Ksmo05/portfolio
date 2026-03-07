import { siJira, siQlik, siSap } from "simple-icons";

type SkillBadgeProps = {
  label: string;
};

type BrandIcon = {
  path: string;
  hex: string;
  title: string;
};

const toolIcons: Record<string, BrandIcon | undefined> = {
  SAP: siSap,
  "Qlik Sense": siQlik,
  Jira: siJira,
};

const fallbackInitials: Record<string, string> = {
  Coupa: "CP",
  Excel: "XL",
  Outlook: "OL",
  Salesforce: "SF",
};

function getInitials(label: string) {
  const fromMap = fallbackInitials[label];
  if (fromMap) {
    return fromMap;
  }

  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function SkillBadge({ label }: SkillBadgeProps) {
  const icon = toolIcons[label];
  const isFallbackTool = label in fallbackInitials;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      aria-label={icon || isFallbackTool ? `${label} logo` : label}
    >
      {icon ? (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-3.5 w-3.5"
            style={{ color: `#${icon.hex}` }}
          >
            <path d={icon.path} fill="currentColor" />
          </svg>
        </span>
      ) : isFallbackTool ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-semibold tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {getInitials(label)}
        </span>
      ) : null}
      <span>{label}</span>
    </span>
  );
}

