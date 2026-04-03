"use client";

import type { RefObject } from "react";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import QuickActions from "@/components/chat/QuickActions";
import type { ChatMessageRecord, QuickAction } from "@/components/chat/types";

type ChatWindowProps = {
  assistantName: string;
  closeLabel: string;
  emptyStateLabel: string;
  inputPlaceholder: string;
  introLabel: string;
  isLoading: boolean;
  isOpen: boolean;
  messages: ChatMessageRecord[];
  onChangeInput: (value: string) => void;
  onClose: () => void;
  onReset: () => void;
  onSelectQuickAction: (action: QuickAction) => void;
  onSubmit: () => void;
  quickActions: QuickAction[];
  resetLabel: string;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  showQuickActions: boolean;
  statusLabel: string;
  typingLabel: string;
  value: string;
};

export default function ChatWindow({
  assistantName,
  closeLabel,
  emptyStateLabel,
  inputPlaceholder,
  introLabel,
  isLoading,
  isOpen,
  messages,
  onChangeInput,
  onClose,
  onReset,
  onSelectQuickAction,
  onSubmit,
  quickActions,
  resetLabel,
  scrollContainerRef,
  showQuickActions,
  statusLabel,
  typingLabel,
  value,
}: ChatWindowProps) {
  return (
    <div
      className={`pointer-events-none absolute bottom-20 right-0 w-[min(100vw-1.5rem,24rem)] origin-bottom-right transition duration-200 sm:bottom-24 ${
        isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <section className="pointer-events-auto overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[0_32px_120px_-40px_rgba(15,23,42,0.5)] backdrop-blur-xl">
        <header className="border-b border-slate-200/80 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                <p className="truncate text-sm font-semibold text-slate-900">{assistantName}</p>
              </div>
              <p className="mt-1 text-xs text-slate-500">{statusLabel}</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onReset}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label={resetLabel}
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
                  <path
                    d="M4 4v5h5M20 20v-5h-5M19 9a7 7 0 0 0-12-2M5 15a7 7 0 0 0 12 2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label={closeLabel}
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
                  <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div ref={scrollContainerRef} className="max-h-[min(60vh,30rem)] min-h-[24rem] space-y-4 overflow-y-auto px-4 py-4">
          {showQuickActions ? (
            <>
              <div className="rounded-[1.6rem] border border-slate-200/80 bg-slate-50 px-4 py-4">
                <p className="text-sm font-medium text-slate-900">{introLabel}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{emptyStateLabel}</p>
              </div>
              <QuickActions actions={quickActions} disabled={isLoading} onSelect={onSelectQuickAction} />
            </>
          ) : null}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading ? (
            <div className="flex justify-start">
              <div className="rounded-[1.4rem] rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5" aria-label={typingLabel} role="status">
                  <span className="chat-dot h-2 w-2 rounded-full bg-slate-300" />
                  <span className="chat-dot h-2 w-2 rounded-full bg-slate-300 [animation-delay:0.15s]" />
                  <span className="chat-dot h-2 w-2 rounded-full bg-slate-300 [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <ChatInput disabled={isLoading} onChange={onChangeInput} onSubmit={onSubmit} placeholder={inputPlaceholder} value={value} />
      </section>
    </div>
  );
}
