import Image from "next/image";
import type { ExperienceEntry } from "@/lib/experience";

type ExperienceTimelineProps = {
  entries: ExperienceEntry[];
};

export default function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <div className="space-y-6">
      {entries.map((entry, index) => (
        <article key={`${entry.company}-${entry.period}`} className="card-surface relative rounded-[1.8rem] p-6 md:p-7">
          {index < entries.length - 1 ? (
            <span className="absolute left-9 top-24 hidden h-[calc(100%+1.5rem)] w-px bg-white/10 md:block" aria-hidden="true" />
          ) : null}

          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex items-center gap-3 md:w-72 md:flex-shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04]">
                <Image
                  src={entry.logo}
                  alt={entry.logoAlt}
                  width={120}
                  height={56}
                  className={
                    entry.company.toLowerCase().includes("openbank")
                      ? "object-contain w-10 h-10"
                      : entry.company.toLowerCase().includes("movistar prosegur alarmas")
                        ? "object-contain max-h-10 md:max-h-12"
                        : "object-contain max-h-10 md:max-h-12"
                  }
                />
              </div>
              <div>
                <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">{entry.period}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{entry.company}</h3>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-200">{entry.role}</p>
              <p className="text-muted mt-3 text-sm leading-6">{entry.summary}</p>
              <ul className="text-muted mt-5 space-y-2 text-sm leading-6">
                {entry.responsibilities.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
