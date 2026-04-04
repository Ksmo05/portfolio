"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { sendChatMessage } from "@/lib/aiInbox";
import { getLocaleFromPathname, type Locale } from "@/lib/i18n";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type QuickAction = {
  id: string;
  label: string;
  prompt: string;
};

type ChatCopy = {
  title: string;
  status: string;
  welcome: string;
  helper: string;
  placeholder: string;
  openLabel: string;
  closeLabel: string;
  resetLabel: string;
  sendingLabel: string;
  fallbackError: string;
  quickActions: QuickAction[];
};

const STORAGE_PREFIX = "portfolio-chat-widget";

const copy: Record<Locale, ChatCopy> = {
  en: {
    title: "Carlos AI Assistant",
    status: "Usually replies instantly",
    welcome:
      "Hi, I can help you explore Carlos' profile, experience, projects and ways to get in touch.",
    helper: "Start with a suggested question or write your own message.",
    placeholder: "Write your message...",
    openLabel: "Open chat",
    closeLabel: "Close chat",
    resetLabel: "Restart conversation",
    sendingLabel: "Carlos AI Assistant is typing...",
    fallbackError:
      "I can't connect to the assistant right now. Please try again in a moment or use the contact page.",
    quickActions: [
      {
        id: "projects",
        label: "View projects",
        prompt: "Show me Carlos' most relevant projects and explain how they relate to operations, data and practical AI.",
      },
      {
        id: "about",
        label: "About",
        prompt: "Tell me about Carlos' professional profile, experience and main strengths in operations and business support.",
      },
      {
        id: "fit",
        label: "Profile fit",
        prompt: "What type of role or team would be a good fit for Carlos based on his background?",
      },
      {
        id: "contact",
        label: "Contact",
        prompt: "I would like to contact Carlos to discuss an opportunity or project.",
      },
    ],
  },
  es: {
    title: "Carlos AI Assistant",
    status: "Normalmente responde al instante",
    welcome:
      "Hola, puedo ayudarte a descubrir el perfil de Carlos, su experiencia, sus proyectos y las formas de contacto.",
    helper: "Empieza con una sugerencia o escribe tu propio mensaje.",
    placeholder: "Escribe tu mensaje...",
    openLabel: "Abrir chat",
    closeLabel: "Cerrar chat",
    resetLabel: "Reiniciar conversacion",
    sendingLabel: "Carlos AI Assistant esta escribiendo...",
    fallbackError:
      "No puedo conectar con el asistente ahora mismo. Intentalo de nuevo en unos segundos o usa la pagina de contacto.",
    quickActions: [
      {
        id: "projects",
        label: "Ver proyectos",
        prompt: "Muestrame los proyectos mas relevantes de Carlos y explica como se relacionan con operaciones, datos e IA practica.",
      },
      {
        id: "about",
        label: "Sobre mi",
        prompt: "Cuentame el perfil profesional de Carlos, su experiencia y sus puntos fuertes en operaciones y soporte de negocio.",
      },
      {
        id: "fit",
        label: "Encaje",
        prompt: "Que tipo de rol o equipo encajaria bien con Carlos segun su trayectoria?",
      },
      {
        id: "contact",
        label: "Contactar",
        prompt: "Quiero contactar con Carlos para hablar de una oportunidad o proyecto.",
      },
    ],
  },
};

function makeMessage(role: ChatRole, content: string, id?: string): ChatMessage {
  return {
    id: id ?? `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

function withWhatsAppCta(content: string, whatsappUrl: string | null) {
  if (!whatsappUrl || content.includes(whatsappUrl)) {
    return content;
  }
  return `${content}\n${whatsappUrl}`;
}

function getInitialMessages(locale: Locale) {
  return [makeMessage("assistant", copy[locale].welcome, `assistant-welcome-${locale}`)];
}

const urlPattern = /(https?:\/\/[^\s]+)/g;

function getWhatsAppCtaLabel(locale: Locale) {
  return locale === "es" ? "Abrir conversacion en WhatsApp" : "Open WhatsApp chat";
}

function renderMessageContent(content: string, locale: Locale): ReactNode[] {
  const lines = content.split("\n");

  return lines.flatMap((line, lineIndex) => {
    const parts = line.split(urlPattern);
    const nodes = parts.map((part, partIndex) => {
      if (!part) return null;

      if (urlPattern.test(part)) {
        urlPattern.lastIndex = 0;
      }

      if (part.startsWith("http://") || part.startsWith("https://")) {
        let hostname = "";
        try {
          hostname = new URL(part).hostname.toLowerCase();
        } catch {
          hostname = "";
        }

        if (hostname === "wa.me" || hostname.endsWith(".wa.me")) {
          return (
            <a
              key={`link-${lineIndex}-${partIndex}`}
              href={part}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 hover:text-white"
            >
              {getWhatsAppCtaLabel(locale)}
            </a>
          );
        }

        return (
          <a
            key={`link-${lineIndex}-${partIndex}`}
            href={part}
            target="_blank"
            rel="noreferrer noopener"
            className="break-all text-cyan-200 underline decoration-cyan-300/50 underline-offset-4 hover:text-white"
          >
            {part}
          </a>
        );
      }

      return <span key={`text-${lineIndex}-${partIndex}`}>{part}</span>;
    });

    if (lineIndex < lines.length - 1) {
      nodes.push(<br key={`br-${lineIndex}`} />);
    }

    return nodes;
  }).filter(Boolean) as ReactNode[];
}

export default function ChatWidget() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const text = copy[locale];
  const storageKey = `${STORAGE_PREFIX}:${locale}`;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages(locale));

  const showQuickActions = messages.length <= 1 && messages.every((message) => message.role !== "user");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // Ignore invalid persisted state and restore a clean conversation.
    }

    setMessages(getInitialMessages(locale));
  }, [locale, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [inputValue]);

  async function handleSend(message: string) {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    const history = [...messages, { id: "pending-user", role: "user" as const, content: trimmed }]
      .slice(-6)
      .map(({ role, content }) => ({ role, content }));

    setMessages((current) => [...current, makeMessage("user", trimmed)]);
    setInputValue("");
    setIsLoading(true);
    setIsOpen(true);

    try {
      const result = await sendChatMessage(trimmed, history, locale);
      const assistantMessage = withWhatsAppCta(result.reply, result.whatsappUrl);
      if (result.whatsappHandoff && result.whatsappUrl) {
        console.debug("[ChatWidget] chat CTA rendered", {
          whatsappHandoff: result.whatsappHandoff,
          whatsappUrl: result.whatsappUrl,
        });
      }
      setMessages((current) => [...current, makeMessage("assistant", assistantMessage)]);
    } catch {
      setMessages((current) => [...current, makeMessage("assistant", text.fallbackError)]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessages(getInitialMessages(locale));
    setInputValue("");
    setIsLoading(false);
    window.localStorage.removeItem(storageKey);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section className="mb-3 flex h-[min(78vh,42rem)] w-[min(calc(100vw-1rem),26rem)] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,8,23,0.98))] shadow-[0_34px_120px_-28px_rgba(2,8,23,0.72)] backdrop-blur-xl">
          <header className="border-b border-white/10 bg-white/[0.03] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <path
                        d="M7 16.5L4 19V6.75C4 5.784 4.784 5 5.75 5h12.5C19.216 5 20 5.784 20 6.75v8.5c0 .966-.784 1.75-1.75 1.75H7Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-[0.01em] text-white">{text.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                      <p className="truncate text-xs text-slate-300">{text.status}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">Ask about experience, projects, profile fit, or open a direct contact conversation.</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label={text.resetLabel}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                    <path
                      d="M4 4v5h5M20 20v-5h-5M19 9a7 7 0 0 0-12-2M5 15a7 7 0 0 0 12 2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={text.closeLabel}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                    <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(15,23,42,0.32),rgba(15,23,42,0.18))] px-4 py-4">
            <div className="space-y-3.5">
              {showQuickActions ? (
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" />
                    Guided prompts
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6 text-white">{text.welcome}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{text.helper}</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {text.quickActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        disabled={isLoading}
                        onClick={() => void handleSend(action.prompt)}
                        className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-100 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.9)] ${
                      message.role === "user"
                        ? "rounded-br-md bg-[linear-gradient(135deg,#22d3ee,#0f172a_80%)] text-white"
                        : "rounded-bl-md border border-white/10 bg-white/[0.06] text-slate-100"
                    }`}
                  >
                    <div
                      className={`mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                        message.role === "user" ? "text-cyan-100/80" : "text-slate-400"
                      }`}
                    >
                      {message.role === "user" ? "You" : "Assistant"}
                    </div>
                    <span className="whitespace-pre-wrap">
                      {renderMessageContent(message.content, locale)}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-[1.4rem] rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5" aria-label={text.sendingLabel} role="status">
                        <span className="h-2 w-2 rounded-full bg-cyan-300 animate-[pulse_1.2s_ease-in-out_infinite]" />
                        <span className="h-2 w-2 rounded-full bg-cyan-300/80 animate-[pulse_1.2s_ease-in-out_0.15s_infinite]" />
                        <span className="h-2 w-2 rounded-full bg-cyan-300/60 animate-[pulse_1.2s_ease-in-out_0.3s_infinite]" />
                      </div>
                      <span>{text.sendingLabel}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950/60 p-3">
            <div className="flex items-end gap-2 rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                disabled={isLoading}
                placeholder={text.placeholder}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend(inputValue);
                  }
                }}
                className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled={isLoading || !inputValue.trim()}
                onClick={() => void handleSend(inputValue)}
                className="rounded-[1.2rem] bg-[linear-gradient(135deg,#22d3ee,#0891b2)] px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {locale === "es" ? "Enviar" : "Send"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={text.openLabel}
        className="ml-auto flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.95),rgba(15,23,42,0.95))] text-white shadow-[0_24px_80px_-24px_rgba(8,145,178,0.9)] transition hover:scale-[1.02] hover:brightness-110"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M7 16.5L4 19V6.75C4 5.784 4.784 5 5.75 5h12.5C19.216 5 20 5.784 20 6.75v8.5c0 .966-.784 1.75-1.75 1.75H7Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
