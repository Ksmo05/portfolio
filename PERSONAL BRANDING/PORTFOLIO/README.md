# Digital Operations + AI Portfolio (Next.js)

Professional portfolio website built with Next.js App Router, TypeScript, and Tailwind CSS.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Markdown blog (gray-matter + remark)

## Features

- Modern responsive portfolio design
- Dark/light mode toggle
- SEO metadata on all pages (titles, descriptions, Open Graph basics)
- Reusable components (navbar, footer, cards, CTA, section headers, skill badges)
- Projects listing + dynamic project detail pages
- Markdown blog with:
  - listing page
  - category/tag filters
  - reading time
  - dynamic article pages
  - related posts
- Tools page with mini tool concepts
- Functional local demo: AI Website Content Generator
- Contact page with simple interactive form

## Project Structure

```text
src/
  app/
    about/
    blog/
      [slug]/
    contact/
    projects/
      [slug]/
    tools/
      ai-website-content-generator/
    globals.css
    layout.tsx
    page.tsx
  components/
    blog/
    cards/
    layout/
    sections/
    tools/
    ContactForm.tsx
    ThemeToggle.tsx
  content/
    blog/
      *.md
  lib/
    blog.ts
    metadata.ts
    projects.ts
    site.ts
    tools.ts
```

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

[http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm run start
```

## Notes

- Update `src/lib/site.ts` with real personal email, LinkedIn URL, and production domain.
- Blog posts are stored in `src/content/blog/*.md`.
- The AI Website Content Generator is currently mocked and ready for future API integration.
