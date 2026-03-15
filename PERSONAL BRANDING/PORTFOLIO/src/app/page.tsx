import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/cards/BlogCard";
import ExperienceSnapshotCard from "@/components/cards/ExperienceSnapshotCard";
import ProjectCard from "@/components/cards/ProjectCard";
import SectionHeader from "@/components/sections/SectionHeader";
import { getAllPosts } from "@/lib/blog";
import { educationEntries } from "@/lib/education";
import { experienceSnapshot } from "@/lib/experience";
import { buildMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";
import { shortBio, siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata = buildMetadata({
  title: "Carlos San Miguel | Operations, Data & Digital Projects",
  description:
    "Portfolio presenting experience in operations, purchasing support, data analysis, KPI tracking and personal digital projects.",
  path: "/",
});

export default async function HomePage() {
  const latestPosts = (await getAllPosts()).slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-0 px-6 py-10 md:py-12">
      <section className="grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
            {siteConfig.name} · {siteConfig.location}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-6xl">
            Operations and data professional exploring digital projects, process optimization and practical applications of AI.
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-700 dark:text-slate-200">
            Purchasing, KPI tracking and digital tools with a practical business focus.
          </p>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{shortBio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/experience"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              View Experience
            </Link>
            <Link
              href="/professional-profile"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-600 dark:border-slate-600 dark:text-slate-200"
            >
              Professional Profile
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="mx-auto w-fit rounded-full bg-gradient-to-b from-slate-200 to-slate-300 p-1.5 dark:from-slate-700 dark:to-slate-600">
            <div className="h-52 w-52 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-slate-900">
              <Image
                src="/profile.jpg"
                alt="Professional portrait of Carlos San Miguel Ortega"
                width={320}
                height={320}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Tools used in daily work</p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              SAP, Qlik Sense and Excel are central to my work in operations, data follow-up and process visibility.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tools.map((tool) => (
                <div key={tool.slug} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-white/5 border border-white/10">
                    <Image src={tool.logo} alt={`${tool.name} logo`} width={48} height={48} className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <SectionHeader
          eyebrow="Experience"
          title="Professional Experience Snapshot"
          description="Experience across operations, purchasing support, KPI follow-up and process coordination."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {experienceSnapshot.map((item) => (
            <ExperienceSnapshotCard
              key={item.company}
              company={item.company}
              logo={item.logo}
              logoAlt={item.logoAlt}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-neutral-50 px-6 py-20 dark:bg-neutral-900">
        <SectionHeader
          eyebrow="Key Areas"
          title="Operations, data and digital focus"
          description="Core areas that define my current profile and the direction I am developing."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {[
            "Operations",
            "Purchasing",
            "Data analysis",
            "KPI / Dashboards",
            "Process digitalization",
          ].map((capability) => (
            <article key={capability} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {capability}
            </article>
          ))}
        </div>
      </section>

      <section className="py-20">
        <SectionHeader
          eyebrow="Projects"
          title="Personal Digital Projects"
          description="Personal and exploratory projects related to digital tools, web content, productivity and practical uses of AI."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-neutral-50 px-6 py-20 dark:bg-neutral-900">
        <SectionHeader
          eyebrow="Education"
          title="Academic Background"
          description="Education that supports a business-oriented view of operations, data and digital tools."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {educationEntries.map((entry) => (
            <article key={entry.title} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
              <div className="flex h-16 items-center justify-center rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <Image src={entry.logo} alt={entry.logoAlt} width={180} height={36} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">{entry.institutionType}</p>
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{entry.institution}</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{entry.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20">
        <SectionHeader
          eyebrow="Interests"
          title="Current areas of interest"
          description="Topics that connect my professional experience with my personal digital exploration."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <p className="text-xl">OPS</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Operations and business processes</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              I am interested in how clearer processes, better coordination and structured follow-up improve day-to-day execution.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <p className="text-xl">DATA</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Data analysis and dashboards</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Dashboards and KPI tracking help make information easier to read and more useful for operational decisions.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <p className="text-xl">TOOLS</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Digital tools and productivity</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              I explore digital tools that help organize information, improve productivity and make work more manageable.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <p className="text-xl">AI</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Practical uses of AI</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              My interest in AI is practical: content support, information organization and more efficient workflows in everyday work.
            </p>
          </article>
        </div>
      </section>

      <section className="py-24">
        <SectionHeader
          eyebrow="Blog"
          title="Latest Insights"
          description="Articles on dashboards, documentation, operations and practical uses of digital tools in business contexts."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}

