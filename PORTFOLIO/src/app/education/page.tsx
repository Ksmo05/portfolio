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
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14 md:py-20">
      <SectionHeader
        eyebrow="Academic Background"
        title="Education"
        description="Formal education and continuing studies that support structured operational thinking and analytical execution."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {educationEntries.map((entry) => (
          <article key={entry.title} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <div className="bg-white rounded-lg p-3 flex items-center justify-center h-16">
              <Image src={entry.logo} alt={entry.logoAlt} width={240} height={64} className="object-contain max-h-full max-w-full h-full w-auto" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">{entry.institutionType}</p>
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{entry.institution}</p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{entry.title}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{entry.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
