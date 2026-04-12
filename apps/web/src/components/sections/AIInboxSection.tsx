"use client";

import { startTransition, useState, type FormEvent } from "react";
import SectionHeader from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/i18n";
import { CONTACT_FORM_SOURCE, postInboxPayload, type InboxSuccessResponse } from "@/lib/aiInbox";

type AIInboxSectionProps = {
  locale: Locale;
};

type SubmissionState = {
  reply_text: string;
  whatsapp_handoff?: boolean;
  whatsapp_url?: string;
};

function isSubmissionState(value: InboxSuccessResponse["message"]): value is SubmissionState {
  return Boolean(
    value &&
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
    submittingHint: string;
    success: string;
    error: string;
    networkError: string;
    analysis: string;
    reply: string;
    replyHint: string;
    idleHint: string;
    whatsappCta: string;
    whatsappHint: string;
  }
> = {
  en: {
    eyebrow: "Contact Form",
    title: "Contact form",
    description: "Share a professional inquiry, project context, collaboration request or question. You will receive a clear confirmation after sending your message.",
    name: "Name",
    email: "Email",
    company: "Company",
    message: "Message",
    required: "Required",
    optional: "Optional",
    submit: "Send message",
    submitting: "Sending...",
    submittingHint: "Saving your message and preparing your confirmation...",
    success: "Your message was sent successfully.",
    error: "The contact form could not process your message right now. Please try again in a moment.",
    networkError: "The contact service is not reachable right now. Please try again in a moment.",
    analysis: "Thanks, your message was sent",
    reply: "Reply suggestion",
    replyHint: "If helpful, you can use this reply as a starting point for a follow-up conversation.",
    idleHint: "You will see a confirmation here once your message has been processed.",
    whatsappCta: "Continue on WhatsApp",
    whatsappHint: "If you prefer a direct follow-up, you can continue the conversation on WhatsApp.",
  },
  es: {
    eyebrow: "Formulario de contacto",
    title: "Formulario de contacto",
    description: "Comparte una consulta profesional, contexto de proyecto, propuesta de colaboracion o pregunta. Recibiras una confirmacion clara despues del envio.",
    name: "Nombre",
    email: "Email",
    company: "Empresa",
    message: "Mensaje",
    required: "Obligatorio",
    optional: "Opcional",
    submit: "Enviar mensaje",
    submitting: "Enviando...",
    submittingHint: "Guardando tu mensaje y preparando la confirmacion...",
    success: "Tu mensaje se ha enviado correctamente.",
    error: "El formulario no ha podido procesar tu mensaje ahora mismo. Intentalo de nuevo en unos minutos.",
    networkError: "El servicio de contacto no esta disponible ahora mismo. Intentalo de nuevo en unos minutos.",
    analysis: "Gracias, tu mensaje se ha enviado",
    reply: "Respuesta sugerida",
    replyHint: "Si te ayuda, puedes usar esta respuesta como punto de partida para continuar la conversacion.",
    idleHint: "Aqui veras una confirmacion cuando tu mensaje se haya procesado.",
    whatsappCta: "Continuar por WhatsApp",
    whatsappHint: "Si prefieres un seguimiento directo, puedes continuar la conversacion por WhatsApp.",
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
    "w-full rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition duration-200 focus:border-sky-300 focus:ring-4 focus:ring-sky-400/10";

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

      startTransition(() => {
        setResult({
          reply_text: responseMessage.reply_text,
          whatsapp_handoff: responseMessage.whatsapp_handoff === true,
          whatsapp_url:
            typeof responseMessage.whatsapp_url === "string" && responseMessage.whatsapp_url
              ? responseMessage.whatsapp_url
              : undefined,
        });
        if (responseMessage.whatsapp_handoff === true && typeof responseMessage.whatsapp_url === "string") {
          console.debug("[AIInboxSection] form CTA rendered", {
            whatsappHandoff: true,
            whatsappUrl: responseMessage.whatsapp_url,
          });
        }
        setForm(initialForm);
      });
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
            submissionError.message === "missing-inbox-api-url" ||
            submissionError.message === "placeholder-inbox-api-url" ||
            submissionError.message === "inbox-timeout"
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
    <section className="py-24 md:py-28">
      <div className="section-shell relative overflow-hidden rounded-[2.2rem] p-8 md:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(191,219,254,0.18),transparent_55%)]" />
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.description} />
            <div className="section-shell-muted mt-8 rounded-[1.7rem] p-5">
              <p className="text-muted text-sm leading-6">
                {locale === "es"
                  ? "Usa este formulario para oportunidades profesionales, colaboraciones, contexto de proyecto o preguntas concretas."
                  : "Use this form for professional opportunities, collaborations, project context, or specific questions."}
              </p>
            </div>
          </div>

          <div className="card-surface rounded-[2rem] p-6 md:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    {text.name} <span className="text-sky-300">({text.required})</span>
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
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    {text.email} <span className="text-slate-500">({text.optional})</span>
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
                <span className="mb-2 block text-sm font-medium text-slate-200">
                    {text.company} <span className="text-slate-500">({text.optional})</span>
                </span>
                <input
                  type="text"
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  className={inputClassName}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                    {text.message} <span className="text-sky-300">({text.required})</span>
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

              <div className="flex flex-wrap items-center gap-4 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary rounded-full px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? text.submitting : text.submit}
                </button>
                <div className="min-h-[1.5rem] flex-1">
                  {error ? <p className="text-sm text-rose-300">{error}</p> : null}
                  {!error && result ? <p className="text-sm text-emerald-300">{text.success}</p> : null}
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 text-sm text-sky-200" role="status" aria-live="polite">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-300" />
                      <span>{text.submittingHint}</span>
                    </div>
                  ) : !error && !result ? (
                    <p className="text-sm text-slate-400">
                      {text.idleHint}
                    </p>
                  ) : null}
                </div>
              </div>
            </form>

            {result ? (
              <div className="section-shell-muted mt-8 rounded-[1.8rem] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{text.analysis}</p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {locale === "es" ? "Envio procesado" : "Submission processed"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text.replyHint}</p>
                <div className="card-surface-soft mt-4 rounded-[1.3rem] p-4">
                  <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">{text.reply}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{result.reply_text}</p>
                </div>
                {result.whatsapp_handoff && result.whatsapp_url ? (
                  <div className="card-surface-soft mt-4 rounded-[1.3rem] p-4">
                    <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">WhatsApp</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{text.whatsappHint}</p>
                    <a
                      href={result.whatsapp_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 hover:text-white"
                    >
                      {text.whatsappCta}
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
