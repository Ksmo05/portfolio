import type { Metadata } from "next";
import SectionHeader from "@/components/sections/SectionHeader";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Professional Profile | Carlos San Miguel",
  description:
    "Structured professional profile presenting experience in operations support, reporting, process coordination and practical digital tools.",
  path: "/professional-profile",
});

export default function ProfessionalProfilePage() {
  return (
    <div className="page-shell max-w-5xl space-y-12 py-14 md:py-20">
      <SectionHeader
        eyebrow="Professional Profile"
        title="Operations, Data & Practical Digital Support"
        description="A professional profile focused on corporate operations, reporting, process support and practical uses of digital tools."
      />

      <section className="section-shell rounded-[2rem] p-7 md:p-8">
        <h2 className="text-2xl font-semibold text-white">About</h2>
        <p className="text-muted mt-4 leading-7">
          I work in corporate and consulting environments supporting operations, Purchasing and Aftersales processes. My experience includes SAP support, reporting follow-up, incident handling, coordination and KPI visibility using tools such as SAP, Qlik Sense and Excel.
        </p>
        <p className="text-muted mt-3 leading-7">
          Alongside my professional work, I explore digital tools and practical AI workflows through personal initiatives focused on communication, information organization and productivity. My interest is applied and business-oriented rather than purely technical.
        </p>
      </section>

      <section className="section-shell rounded-[2rem] p-7 md:p-8">
        <h2 className="text-2xl font-semibold text-white">Focus Areas</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
          {[
            "Operations and business processes",
            "Procurement support and workflow coordination",
            "Reporting, data follow-up and KPI dashboards",
            "Documentation control and structured support",
            "Digital tools for communication and productivity",
            "Practical uses of AI for productivity",
          ].map((item) => (
            <li key={item} className="card-surface-soft rounded-[1.2rem] px-4 py-3">{item}</li>
          ))}
        </ul>
      </section>

      <section className="section-shell rounded-[2rem] p-7 md:p-8">
        <h2 className="text-2xl font-semibold text-white">Professional Context</h2>
        <ul className="text-muted mt-4 space-y-2 leading-7">
          <li>Support for Purchasing and Aftersales processes in a corporate environment linked to BMW</li>
          <li>Experience in reporting, SAP support, process follow-up and issue coordination</li>
          <li>Background across automotive, energy operations, public procurement, banking support and technical operations</li>
          <li>Practical interest in digital tools and AI to improve productivity and information flows</li>
        </ul>
      </section>

      <section className="section-shell rounded-[2rem] p-7 md:p-8">
        <h2 className="text-2xl font-semibold text-white">Education</h2>
        <ul className="text-muted mt-4 space-y-2 leading-7">
          <li>Bachelor&apos;s Degree in Business Administration</li>
          <li>Higher Technician in Network Systems Administration (ASIR)</li>
          <li>University studies in Cybersecurity, Artificial Intelligence and Big Data</li>
        </ul>
      </section>

      <section className="section-shell-muted rounded-[2rem] p-7 md:p-8">
        <h2 className="text-xl font-semibold text-white">Positioning</h2>
        <p className="text-muted mt-3 text-sm leading-7">
          This portfolio presents a profile built around operations, reporting, process support and practical digital improvement, with AI used as a tool for productivity rather than as the center of the profile.
        </p>
      </section>
    </div>
  );
}

