import type { Metadata } from "next";
import SectionHeader from "@/components/sections/SectionHeader";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Professional Profile | Carlos San Miguel Ortega",
  description:
    "Structured professional profile presenting experience, operational projects, and academic background.",
  path: "/professional-profile",
});

export default function ProfessionalProfilePage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-6 py-14 md:py-20">
      <SectionHeader
        eyebrow="Portfolio Purpose"
        title="Professional Profile"
        description="A structured presentation of experience, education, and operational capabilities."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">Professional Statement</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          This website presents an overview of my professional experience, operational projects, and academic background.
        </p>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          It serves as a structured representation of my work across business operations, purchasing coordination, reporting systems, and process-oriented environments.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">Professional Focus</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
          {[
            "Digital operations",
            "Purchasing operations",
            "Operational reporting and dashboards",
            "Vendor coordination",
            "Business support processes",
            "Documentation and operational control",
          ].map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">Industry Experience</h2>
        <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          <li>Automotive consulting projects</li>
          <li>Energy sector operations</li>
          <li>Public administration procurement</li>
          <li>Banking customer support operations</li>
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
        <h2 className="text-xl font-semibold">Disclaimer</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          This website is intended as a professional portfolio demonstrating experience, projects, and academic background rather than a direct contact channel.
        </p>
      </section>
    </div>
  );
}
