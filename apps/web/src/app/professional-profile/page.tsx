import type { Metadata } from "next";
import SectionHeader from "@/components/sections/SectionHeader";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Professional Profile | Carlos San Miguel",
  description:
    "Structured professional profile presenting experience in operations, data, process support and digital projects.",
  path: "/professional-profile",
});

export default function ProfessionalProfilePage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-6 py-14 md:py-20">
      <SectionHeader
        eyebrow="Professional Profile"
        title="Operations, Data & Digital Projects"
        description="A professional profile focused on operations, data, digital tools and practical uses of technology."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          I work in operations and consulting environments supporting Purchasing and Aftersales processes, with experience in data analysis, vendor management and KPI tracking using tools such as SAP, Qlik Sense and Excel.
        </p>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Alongside my professional work, I explore digital tools, web content and AI-assisted workflows through personal projects. I am especially interested in how technology can improve processes, productivity and information management.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">Focus Areas</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
          {[
            "Operations and business processes",
            "Purchasing and vendor coordination",
            "Data analysis and KPI dashboards",
            "Process digitalization",
            "Digital tools and web content",
            "Practical uses of AI for productivity",
          ].map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">Professional Context</h2>
        <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          <li>Consulting support for Purchasing and Aftersales processes</li>
          <li>Data tracking, KPI follow-up and reporting in business environments</li>
          <li>Experience across automotive consulting, energy operations, public procurement and banking support</li>
          <li>Personal interest in digital tools, web content and practical AI workflows</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">Education</h2>
        <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          <li>Bachelor&apos;s Degree in Business Administration</li>
          <li>Higher Technician in Network Systems Administration (ASIR)</li>
          <li>University studies in Cybersecurity, Artificial Intelligence and Big Data</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-700 dark:bg-slate-800/60">
        <h2 className="text-xl font-semibold">Positioning</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          This portfolio presents a profile built around operations, data, process improvement and personal digital projects, with a practical interest in how technology can support everyday work.
        </p>
      </section>
    </div>
  );
}

