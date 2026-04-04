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
  "Microsoft Excel": "XL",
  "Microsoft Outlook": "OL",
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
      className="pill-chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium shadow-[0_14px_35px_-24px_rgba(15,23,42,0.95)]"
      aria-label={icon || isFallbackTool ? `${label} logo` : label}
    >
      {icon ? (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/8">
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
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/8 px-1 text-[10px] font-semibold tracking-wide text-slate-100">
          {getInitials(label)}
        </span>
      ) : null}
      <span>{label}</span>
    </span>
  );
}

