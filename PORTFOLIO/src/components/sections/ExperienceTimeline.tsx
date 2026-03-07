import Image from "next/image";
import type { ExperienceEntry } from "@/lib/experience";

type ExperienceTimelineProps = {
  entries: ExperienceEntry[];
};

export default function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <div className="space-y-6">
      {entries.map((entry, index) => (
        <article key={`${entry.company}-${entry.period}`} className="relative rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
          {index < entries.length - 1 ? (
            <span className="absolute left-9 top-24 hidden h-[calc(100%+1.5rem)] w-px bg-slate-200 dark:bg-slate-700 md:block" aria-hidden="true" />
          ) : null}

          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex items-center gap-3 md:w-72 md:flex-shrink-0">
              <div className="flex h-16 w-32 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800">
                <Image src={entry.logo} alt={entry.logoAlt} width={120} height={56} className="h-11 w-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">{entry.period}</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{entry.company}</h3>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.role}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.summary}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
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
