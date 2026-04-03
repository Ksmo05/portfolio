import Link from "next/link";

type CtaSectionProps = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function CtaSection({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-50 to-cyan-50 p-8 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
      <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link
            href={secondaryHref}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 dark:border-slate-600 dark:text-slate-200"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

