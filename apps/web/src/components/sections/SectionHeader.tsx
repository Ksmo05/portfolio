type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12 max-w-3xl md:mb-14">
      {eyebrow ? (
        <p className="eyebrow-label mb-4 text-[0.72rem] font-semibold uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl md:leading-[1.02]">{title}</h2>
      {description ? <p className="text-muted mt-5 max-w-2xl text-[1.02rem] leading-7">{description}</p> : null}
    </div>
  );
}

