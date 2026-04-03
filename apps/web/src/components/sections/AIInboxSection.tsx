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
      <div className="rounded-[2rem] border border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 shadow-[0_30px_100px_-30px_rgba(14,116,144,0.38)] backdrop-blur dark:border-sky-900/50 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/70 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.description} />
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-lg dark:border-slate-700/80 dark:bg-slate-950/85 md:p-8">
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
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
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
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
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
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
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
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                />
              </label>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {isSubmitting ? text.submitting : text.submit}
                </button>
                {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
                {!error && result ? <p className="text-sm text-emerald-600 dark:text-emerald-300">{text.success}</p> : null}
              </div>
            </form>

            {result ? (
              <div className="mt-8 rounded-3xl border border-sky-200 bg-sky-50/80 p-6 dark:border-sky-900/60 dark:bg-sky-950/30">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{text.analysis}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <article className="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">{text.priority}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{result.priority}</p>
                  </article>
                  <article className="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">{text.category}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{result.category}</p>
                  </article>
                  <article className="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">{text.language}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{result.language}</p>
                  </article>
                </div>
                <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
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
