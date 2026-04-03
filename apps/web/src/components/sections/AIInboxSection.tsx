"use client";

import { useState, type FormEvent } from "react";
import SectionHeader from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/i18n";
import { CONTACT_FORM_SOURCE, postInboxPayload, type InboxSuccessResponse } from "@/lib/aiInbox";

type AIInboxSectionProps = {
  locale: Locale;
};

type SubmissionState = {
  priority: string;
  category: string;
  language: string;
  reply_text: string;
};

function isSubmissionState(value: InboxSuccessResponse["message"]): value is SubmissionState {
  return Boolean(
    value &&
      typeof value.priority === "string" &&
      typeof value.category === "string" &&
      typeof value.language === "string" &&
      typeof value.reply_text === "string",
  );
}

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const copy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    name: string;
    email: string;
    company: string;
    message: string;
    required: string;
    optional: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    networkError: string;
    analysis: string;
    priority: string;
    category: string;
    language: string;
    reply: string;
  }
> = {
  en: {
    eyebrow: "Contact Form",
    title: "Contact form",
    description: "Share an idea, project, collaboration request or question. Your message is sent through the live backend and analyzed automatically.",
    name: "Name",
    email: "Email",
    company: "Company",
    message: "Message",
    required: "Required",
    optional: "Optional",
    submit: "Send message",
    submitting: "Sending...",
    success: "Your message was sent successfully.",
    error: "The contact form could not process your message right now. Please try again in a moment.",
    networkError: "The contact service is not reachable right now. Please try again in a moment.",
    analysis: "AI routing summary",
    priority: "Priority",
    category: "Category",
    language: "Language",
    reply: "Reply suggestion",
  },
  es: {
    eyebrow: "Formulario de contacto",
    title: "Formulario de contacto",
    description: "Comparte una idea, proyecto, propuesta de colaboracion o consulta. Tu mensaje se envia a traves del backend activo y se analiza automaticamente.",
    name: "Nombre",
    email: "Email",
    company: "Empresa",
    message: "Mensaje",
    required: "Obligatorio",
    optional: "Opcional",
    submit: "Enviar mensaje",
    submitting: "Enviando...",
    success: "Tu mensaje se ha enviado correctamente.",
    error: "El formulario no ha podido procesar tu mensaje ahora mismo. Intentalo de nuevo en unos minutos.",
    networkError: "El servicio de contacto no esta disponible ahora mismo. Intentalo de nuevo en unos minutos.",
    analysis: "Resumen del enrutado IA",
    priority: "Prioridad",
    category: "Categoria",
    language: "Idioma",
    reply: "Respuesta sugerida",
  },
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export default function AIInboxSection({ locale }: AIInboxSectionProps) {
  const text = copy[locale];
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionState | null>(null);
  const inputClassName =
    "w-full rounded-[1.35rem] border border-slate-200/80 bg-white/80 px-4 py-3.5 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const payload = {
      name: form.name,
      email: form.email.trim() || null,
      company: form.company.trim() || null,
      message: form.message,
      source: CONTACT_FORM_SOURCE,
    };

    try {
      const { response, data, rawText } = await postInboxPayload<InboxSuccessResponse>(payload);
      console.debug("[AIInboxSection] submit response", {
        status: response.status,
        ok: response.ok,
        body: rawText,
      });

      if (!response.ok) {
        console.error("[AIInboxSection] backend returned non-2xx response", {
          status: response.status,
          data,
          rawText,
        });
        throw new Error(data?.detail || text.error);
      }

      if (response.status !== 201 && response.status !== 200) {
        console.error("[AIInboxSection] unexpected success status", response.status);
        throw new Error(text.error);
      }

      if (!data?.ok) {
        console.error("[AIInboxSection] response missing ok=true", {
          data,
          rawText,
        });
        throw new Error(text.error);
      }

      const responseMessage = data.message;

      if (!isSubmissionState(responseMessage)) {
        console.error("[AIInboxSection] successful response missing valid message payload", {
          data,
          rawText,
        });
        throw new Error(text.error);
      }

      setResult({
        priority: responseMessage.priority,
        category: responseMessage.category,
        language: responseMessage.language,
        reply_text: responseMessage.reply_text,
      });
      setForm(initialForm);
    } catch (submissionError) {
      console.error("[AIInboxSection] submission failed", {
        error: submissionError,
        payload,
      });
      const message =
        submissionError instanceof TypeError ||
        (submissionError instanceof Error &&
          (
            submissionError.message === "Failed to fetch" ||
            submissionError.message === "invalid-json-response" ||
            submissionError.message === "missing-inbox-api-url"
          ))
          ? text.networkError
          : submissionError instanceof Error
            ? submissionError.message
            : text.error;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="py-24">
      <div className="rounded-[2.2rem] border border-sky-200/80 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.2),transparent_26%),linear-gradient(135deg,rgba(240,249,255,0.96),rgba(255,255,255,0.94)_44%,rgba(236,254,255,0.96))] p-8 shadow-[0_38px_120px_-34px_rgba(14,116,144,0.45)] backdrop-blur dark:border-sky-900/50 dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,23,42,0.94)_42%,rgba(8,47,73,0.92))] md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.description} />
            <div className="mt-8 grid gap-4">
              <article className="rounded-[1.6rem] border border-white/70 bg-white/70 p-5 shadow-[0_18px_50px_-30px_rgba(14,116,144,0.35)] dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-cyan-300">Live routing</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Messages go to the same production inbox flow used by the chatbot, dashboard, and email alerts.
                </p>
              </article>
              <article className="rounded-[1.6rem] border border-white/70 bg-white/70 p-5 shadow-[0_18px_50px_-30px_rgba(14,116,144,0.35)] dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-cyan-300">Professional review</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Priority, category, language, and reply guidance are generated automatically after submission.
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/88 p-6 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.4)] dark:border-slate-700/80 dark:bg-slate-950/82 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-cyan-300">Inbox channel</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Professional inquiries, project opportunities, and collaboration requests.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live backend
              </span>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {text.name} <span className="text-sky-600 dark:text-sky-300">({text.required})</span>
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    required
                    className={inputClassName}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {text.email} <span className="text-slate-400 dark:text-slate-500">({text.optional})</span>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className={inputClassName}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {text.company} <span className="text-slate-400 dark:text-slate-500">({text.optional})</span>
                </span>
                <input
                  type="text"
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  className={inputClassName}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {text.message} <span className="text-sky-600 dark:text-sky-300">({text.required})</span>
                </span>
                <textarea
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  required
                  minLength={12}
                  rows={6}
                  className={`${inputClassName} min-h-[9rem] resize-y`}
                />
              </label>

              <div className="flex flex-wrap items-center gap-4 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[linear-gradient(135deg,#0f172a,#0f766e)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[linear-gradient(135deg,#22d3ee,#0f172a)]"
                >
                  {isSubmitting ? text.submitting : text.submit}
                </button>
                <div className="min-h-[1.5rem] flex-1">
                  {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
                  {!error && result ? <p className="text-sm text-emerald-600 dark:text-emerald-300">{text.success}</p> : null}
                  {!error && !result ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your message is analyzed and routed after submission.</p>
                  ) : null}
                </div>
              </div>
            </form>

            {result ? (
              <div className="mt-8 rounded-[1.8rem] border border-sky-200/80 bg-sky-50/85 p-6 shadow-[0_18px_55px_-35px_rgba(14,116,144,0.4)] dark:border-sky-900/60 dark:bg-sky-950/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{text.analysis}</p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Submission processed
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <article className="rounded-[1.3rem] border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">{text.priority}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{result.priority}</p>
                  </article>
                  <article className="rounded-[1.3rem] border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">{text.category}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{result.category}</p>
                  </article>
                  <article className="rounded-[1.3rem] border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">{text.language}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{result.language}</p>
                  </article>
                </div>
                <div className="mt-4 rounded-[1.3rem] border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">{text.reply}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{result.reply_text}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
