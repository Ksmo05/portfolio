import Image from "next/image";
import SkillBadge from "@/components/sections/SkillBadge";
import type { Tool } from "@/lib/tools";

type ToolCardProps = {
  tool: Tool;
};

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-white/5 border border-white/10">
            <Image src={tool.logo} alt={`${tool.name} logo`} width={48} height={48} className="w-12 h-12 object-contain" />
          </div>
          <SkillBadge label={tool.name} />
        </div>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">
          {tool.status}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{tool.description}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {tool.features.map((feature) => (
          <li key={feature}>- {feature}</li>
        ))}
      </ul>
    </article>
  );
}
