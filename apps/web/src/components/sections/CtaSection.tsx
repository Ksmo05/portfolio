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
    <section className="section-shell relative overflow-hidden rounded-[2rem] p-8 md:p-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(191,219,254,0.16),transparent_55%)]" />
      <h3 className="relative text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">{title}</h3>
      <p className="text-muted relative mt-4 max-w-2xl text-base leading-7">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="button-primary rounded-full px-5 py-2.5 text-sm font-medium"
        >
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link
            href={secondaryHref}
            className="button-secondary rounded-full px-5 py-2.5 text-sm font-medium"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

