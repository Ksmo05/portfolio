import type { Metadata } from "next";
import Image from "next/image";
import SectionHeader from "@/components/sections/SectionHeader";
import { educationEntries } from "@/lib/education";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Education | Carlos San Miguel Ortega",
  description:
    "Academic background in business administration, systems administration, and university studies in cybersecurity, artificial intelligence, and big data.",
  path: "/education",
});

export default function EducationPage() {
  return (
    <div className="page-shell space-y-10 py-14 md:py-20">
      <SectionHeader
        eyebrow="Academic Background"
        title="Education"
        description="Formal education and continuing studies that support structured operational thinking and analytical execution."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {educationEntries.map((entry) => (
          <article key={entry.title} className="card-surface rounded-[1.6rem] p-6">
            <div className="flex h-16 items-center justify-center rounded-[1rem] bg-white p-3">
              <Image src={entry.logo} alt={entry.logoAlt} width={240} height={64} className="object-contain max-h-full max-w-full h-full w-auto" />
            </div>
            <p className="eyebrow-label mt-4 text-[0.72rem] font-semibold uppercase">{entry.institutionType}</p>
            <p className="mt-2 text-sm font-medium text-slate-300">{entry.institution}</p>
            <h2 className="mt-3 text-lg font-semibold text-white">{entry.title}</h2>
            <p className="text-muted mt-3 text-sm leading-6">{entry.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
