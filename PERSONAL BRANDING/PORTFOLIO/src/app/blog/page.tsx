import type { Metadata } from "next";
import BlogFilter from "@/components/blog/BlogFilter";
import SectionHeader from "@/components/sections/SectionHeader";
import { getAllPostMeta, getBlogFilters } from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Articles on operational reporting, KPI dashboards, purchasing coordination, vendor management, and business process execution.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = getAllPostMeta();
  const { tags, categories } = await getBlogFilters();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
      <SectionHeader
        eyebrow="Knowledge Hub"
        title="Operations and Reporting Blog"
        description="Practical articles for professionals improving operational visibility, KPI communication, and process coordination across business teams."
      />
      <BlogFilter posts={posts} tags={tags} categories={categories} />
    </div>
  );
}
