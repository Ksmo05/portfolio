import type { Metadata } from "next";
import ToolCard from "@/components/cards/ToolCard";
import SectionHeader from "@/components/sections/SectionHeader";
import { buildMetadata } from "@/lib/metadata";
import { tools } from "@/lib/tools";

export const metadata: Metadata = buildMetadata({
  title: "Tools",
  description:
    "Core tools used in daily operations work across purchasing workflows, KPI reporting, and business support.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
      <SectionHeader
        eyebrow="Operational Toolset"
        title="Daily Tools for Operations and Reporting"
        description="Platforms used for purchasing coordination, KPI tracking, supplier communication, and structured business support execution."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
