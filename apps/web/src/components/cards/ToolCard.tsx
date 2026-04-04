import Image from "next/image";
import SkillBadge from "@/components/sections/SkillBadge";
import type { Tool } from "@/lib/tools";

type ToolCardProps = {
  tool: Tool;
};

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="card-surface rounded-[1.75rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04]">
            <Image src={tool.logo} alt={`${tool.name} logo`} width={48} height={48} className="w-12 h-12 object-contain" />
          </div>
          <SkillBadge label={tool.name} />
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-slate-100">
          {tool.status}
        </span>
      </div>
      <p className="text-muted mt-4 text-sm leading-6">{tool.description}</p>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-200">
        {tool.features.map((feature) => (
          <li key={feature}>- {feature}</li>
        ))}
      </ul>
    </article>
  );
}
