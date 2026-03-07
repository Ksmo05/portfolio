import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/cards/BlogCard";
import ExperienceSnapshotCard from "@/components/cards/ExperienceSnapshotCard";
import ProjectCard from "@/components/cards/ProjectCard";
import SectionHeader from "@/components/sections/SectionHeader";
import SkillBadge from "@/components/sections/SkillBadge";
import { getAllPosts } from "@/lib/blog";
import { educationEntries } from "@/lib/education";
import { experienceSnapshot } from "@/lib/experience";
import { buildMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";
import { shortBio, siteConfig, toolStack } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Carlos San Miguel Ortega | Operations & Business Support Specialist",
  description:
    "Professional portfolio presenting experience, projects, education, and operational capabilities across purchasing processes, reporting, dealer network performance, and business support.",
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
            Operations &amp; Business Support Specialist
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-700 dark:text-slate-200">
            Purchasing Processes, Reporting and Dealer Network Performance
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
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Operational Tool Environment</p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Daily work combines procurement coordination, reporting discipline, and process follow-up across multi-team environments.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {toolStack.map((tool) => (
                <SkillBadge key={tool} label={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <SectionHeader
          eyebrow="Experience"
          title="Professional Experience Snapshot"
          description="Role-based experience across purchasing operations, reporting workflows, and operational coordination."
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
          eyebrow="Capabilities"
          title="Core Capabilities"
          description="Operational strengths developed through business support, purchasing coordination, and reporting execution."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {[
            "Purchasing Operations",
            "Operational Reporting",
            "Vendor Coordination",
            "Business Support Processes",
            "Operational Documentation",
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
          title="Featured Projects"
          description="Representative operational projects demonstrating reporting clarity, process discipline, and day-to-day business support execution."
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
          description="Education supporting business operations understanding, systems thinking, and analytical execution."
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
          eyebrow="Operational Thinking"
          title="Operational Thinking"
          description="How I approach operational challenges in business environments."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <p className="text-xl">📊</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Operational Visibility</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Dashboards and structured reporting create continuous visibility over performance signals, helping detect bottlenecks early and prioritize corrective actions.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <p className="text-xl">⚙️</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Process Clarity</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Clear workflows and practical documentation reduce ambiguity, improve consistency across teams, and lower operational friction in day-to-day execution.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <p className="text-xl">📈</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Data-Driven Engagement</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Data analysis supports more persuasive operational conversations, increasing alignment and participation in initiatives such as performance campaigns and process changes.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <p className="text-xl">🧠</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Structured Knowledge</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Well-structured training and documentation strengthen knowledge transfer, preserve operational know-how, and provide stability as teams and priorities evolve.
            </p>
          </article>
        </div>
      </section>

      <section className="py-24">
        <SectionHeader
          eyebrow="Blog"
          title="Latest Insights"
          description="Articles on reporting frameworks, purchasing coordination, operational metrics, and process documentation."
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
