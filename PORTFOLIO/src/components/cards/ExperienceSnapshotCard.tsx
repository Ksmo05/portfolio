import Image from "next/image";

type ExperienceSnapshotCardProps = {
  company: string;
  logo: string;
  logoAlt: string;
  description: string;
};

export default function ExperienceSnapshotCard({ company, logo, logoAlt, description }: ExperienceSnapshotCardProps) {
  const isOpenbank = company.toLowerCase().includes("openbank");

  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className={isOpenbank ? "flex items-center justify-center w-14 h-14" : "flex items-center justify-center w-16 h-12"}>
          <Image src={logo} alt={logoAlt} width={120} height={56} className={isOpenbank ? "object-contain" : "object-contain max-h-10 md:max-h-12"} />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{company}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </article>
  );
}
