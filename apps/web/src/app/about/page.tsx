import Image from "next/image";
import type { Metadata } from "next";
import CtaSection from "@/components/sections/CtaSection";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import SectionHeader from "@/components/sections/SectionHeader";
import SkillBadge from "@/components/sections/SkillBadge";
import { experienceEntries } from "@/lib/experience";
import { buildMetadata } from "@/lib/metadata";
import {
  coreSkills,
  profileHighlights,
  services,
  siteConfig,
  toolStack,
} from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Carlos San Miguel",
  description:
    "Profile overview focused on operations, purchasing support, data analysis, KPI tracking and digital projects.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-14 px-6 py-14 md:py-20">
      <section className="grid items-center gap-10 md:grid-cols-[1fr_220px]">
        <div>
          <SectionHeader
            eyebrow="About"
            title="Carlos San Miguel"
            description={`${siteConfig.position} based in ${siteConfig.location}.`}
          />
          <p className="max-w-4xl text-base text-slate-600 dark:text-slate-300">
            I work in operations and consulting environments supporting Purchasing and Aftersales processes, with experience in data analysis, vendor management and KPI tracking using tools such as SAP, Qlik Sense and Excel.
          </p>
          <p className="mt-4 max-w-4xl text-base text-slate-600 dark:text-slate-300">
            Alongside my professional work, I explore digital tools, web content and AI-assisted workflows through personal projects. I am especially interested in how technology can improve processes, productivity and information management.
          </p>
        </div>
        <div className="mx-auto w-fit rounded-full bg-gradient-to-b from-slate-200 to-slate-300 p-1.5 dark:from-slate-700 dark:to-slate-600">
          <div className="h-52 w-52 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-slate-900">
            <Image
              src="/profile.jpg"
              alt="Professional portrait of Carlos San Miguel Ortega"
              width={320}
              height={320}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Professional Experience</h2>
        <div className="mt-5">
          <ExperienceTimeline entries={experienceEntries} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Current Context and Experience</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {profileHighlights.map((item) => (
            <p key={item} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Core Areas</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {coreSkills.map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Tools and Platforms</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {toolStack.map((tool) => (
            <SkillBadge key={tool} label={tool} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Focus Areas</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {services.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Education</h2>
        <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
          <li>Bachelor&apos;s Degree in Business Administration.</li>
          <li>Higher Technician in Network Systems Administration (ASIR).</li>
          <li>University certificate studies in Cybersecurity, Artificial Intelligence and Big Data.</li>
        </ul>
      </section>

      <CtaSection
        title="Portfolio Navigation"
        description="Explore the sections covering experience, projects and academic background from an operations, data and digital perspective."
        primaryLabel="Professional Profile"
        primaryHref="/professional-profile"
        secondaryLabel="View Education"
        secondaryHref="/education"
      />
    </div>
  );
}

