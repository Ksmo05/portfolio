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
    "Portfolio presenting experience in operations support, reporting, data follow-up, process coordination and practical digital initiatives.",
  path: "/",
});

export default async function HomePage() {
  const latestPosts = (await getAllPosts()).slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="page-shell space-y-0 py-10 md:py-14">
      <section className="grid items-center gap-12 py-16 md:gap-16 md:py-24 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="animate-fade-up">
          <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">
            {siteConfig.name} · {siteConfig.location}
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white md:text-7xl md:leading-[0.96]">
            Operations, data and digital support professional focused on process improvement, reporting and practical AI.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-2xl md:leading-9">
            Corporate operations, process coordination, dashboards and digital workflows with a practical business focus.
          </p>
          <p className="text-muted mt-6 max-w-2xl text-base leading-8 md:text-lg">{shortBio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/experience" className="button-primary rounded-full px-5 py-3 text-sm font-semibold">
              View Experience
            </Link>
            <Link href="/professional-profile" className="button-secondary rounded-full px-5 py-3 text-sm font-semibold">
              Professional Profile
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="mx-auto w-fit rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))] p-2 shadow-[0_30px_80px_-36px_rgba(2,6,23,0.95)]">
            <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border border-white/14 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),rgba(15,23,42,0.45))] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:h-64 md:w-64">
              <Image
                src="/logo-csm.png"
                alt="Carlos San Miguel portfolio logo"
                width={320}
                height={320}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </div>
          <div className="section-shell rounded-[2rem] p-8">
            <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">Tools used in daily work</p>
            <p className="text-muted mt-4 text-sm leading-6">
              SAP, Qlik Sense and Excel support my work in operations, reporting follow-up and process visibility.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tools.map((tool) => (
                <div key={tool.slug} className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-3">
                  <div className="flex h-16 items-center justify-center rounded-[1rem] border border-white/8 bg-white/[0.03]">
                    <Image src={tool.logo} alt={`${tool.name} logo`} width={48} height={48} className="h-12 w-12 object-contain" />
                  </div>
                  <span className="mt-3 block text-xs font-medium text-slate-200">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <SectionHeader
          eyebrow="Experience"
          title="Professional Experience Snapshot"
          description="Experience across operations support, procurement workflows, reporting and process coordination."
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

      <section className="section-shell-muted rounded-[2rem] px-6 py-20 md:px-8">
        <SectionHeader
          eyebrow="Key Areas"
          title="Operations, data and digital focus"
          description="Core areas that define my current profile in corporate environments and practical digital work."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {["Operations", "Procurement support", "Reporting", "KPI / Dashboards", "Digital workflows"].map((capability) => (
            <article key={capability} className="card-surface-soft rounded-[1.35rem] p-5 text-sm font-medium text-slate-200">
              {capability}
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-24">
        <SectionHeader
          eyebrow="Projects"
          title="Applied Digital Projects"
          description="Selected initiatives that show how I use digital tools, structured information and practical AI to support communication and efficiency."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="section-shell-muted rounded-[2rem] px-6 py-20 md:px-8">
        <SectionHeader
          eyebrow="Education"
          title="Academic Background"
          description="Education that supports a business-oriented view of operations, data and digital tools."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {educationEntries.map((entry) => (
            <article key={entry.title} className="card-surface-soft rounded-[1.6rem] p-6">
              <div className="flex h-16 items-center justify-center rounded-[1rem] border border-white/8 bg-white p-3 shadow-sm">
                <Image src={entry.logo} alt={entry.logoAlt} width={180} height={36} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="eyebrow-label mt-4 text-[0.72rem] font-semibold uppercase">{entry.institutionType}</p>
              <p className="mt-2 text-sm font-medium text-slate-300">{entry.institution}</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{entry.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-24">
        <SectionHeader
          eyebrow="Interests"
          title="Current areas of interest"
          description="Topics that connect my professional experience with practical digital improvement."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="card-surface-soft rounded-[1.6rem] p-6">
            <p className="text-xl text-slate-300">OPS</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Operations and business processes</h3>
            <p className="text-muted mt-3 text-sm leading-6">
              I am interested in how clearer processes, better coordination and structured follow-up improve day-to-day execution.
            </p>
          </article>
          <article className="card-surface-soft rounded-[1.6rem] p-6">
            <p className="text-xl text-slate-300">DATA</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Data analysis and dashboards</h3>
            <p className="text-muted mt-3 text-sm leading-6">
              Dashboards, reporting and KPI tracking help make information easier to read and more useful for operational decisions.
            </p>
          </article>
          <article className="card-surface-soft rounded-[1.6rem] p-6">
            <p className="text-xl text-slate-300">TOOLS</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Digital tools and productivity</h3>
            <p className="text-muted mt-3 text-sm leading-6">
              I explore digital tools that help organize information, improve productivity and support smoother workflows.
            </p>
          </article>
          <article className="card-surface-soft rounded-[1.6rem] p-6">
            <p className="text-xl text-slate-300">AI</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Practical uses of AI</h3>
            <p className="text-muted mt-3 text-sm leading-6">
              My interest in AI is practical: better writing support, information organization and more efficient workflows in everyday work.
            </p>
          </article>
        </div>
      </section>

      <section className="py-24 md:py-28">
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
