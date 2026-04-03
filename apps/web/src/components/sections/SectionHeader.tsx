type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}

