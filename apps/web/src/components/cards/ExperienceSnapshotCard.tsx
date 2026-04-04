import Image from "next/image";

type ExperienceSnapshotCardProps = {
  company: string;
  logo: string;
  logoAlt: string;
  description: string;
};

export default function ExperienceSnapshotCard({ company, logo, logoAlt, description }: ExperienceSnapshotCardProps) {
  const normalizedCompany = company.toLowerCase();
  const isOpenbank = normalizedCompany.includes("openbank");
  const isMovistarProsegur = normalizedCompany.includes("movistar prosegur alarmas");

  return (
    <article className="card-surface-soft rounded-[1.5rem] p-5 transition hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_30px_70px_-46px_rgba(2,6,23,1)]">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04]">
          <Image
            src={logo}
            alt={logoAlt}
            width={120}
            height={56}
            className={isOpenbank ? "object-contain w-10 h-10" : isMovistarProsegur ? "object-contain max-h-10 md:max-h-12" : "object-contain max-h-10 md:max-h-12"}
          />
        </div>
        <h3 className="text-base font-semibold text-white">{company}</h3>
      </div>
      <p className="text-muted mt-4 text-sm leading-6">{description}</p>
    </article>
  );
}
