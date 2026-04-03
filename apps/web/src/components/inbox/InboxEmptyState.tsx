"use client";

type Props = {
  lang: "en" | "es";
};

export default function InboxEmptyState({ lang }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center">
      <p className="text-sm font-medium text-white">
        {lang === "es" ? "Todavia no hay mensajes en el inbox." : "There are no inbox messages yet."}
      </p>
      <p className="mt-2 text-sm text-white/60">
        {lang === "es"
          ? "Cuando empiecen a llegar, apareceran aqui con prioridad, categoria, fecha, idioma y lead score."
          : "When new messages arrive, they will appear here with priority, category, date, language, and lead score."}
      </p>
    </div>
  );
}
