import Image from "next/image";

type ExperienceSnapshotCardProps = {
  company: string;
  logo: string;
  logoAlt: string;
  description: string;
};

export default function ExperienceSnapshotCard({ company, logo, logoAlt, description }: ExperienceSnapshotCardProps) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-32 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800">
          <Image src={logo} alt={logoAlt} width={120} height={56} className="h-11 w-full object-contain" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{company}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </article>
  );
}
