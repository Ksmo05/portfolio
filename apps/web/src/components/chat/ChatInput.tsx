"use client";

import { useEffect, useRef } from "react";

type ChatInputProps = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
};

export default function ChatInput({ disabled = false, onChange, onSubmit, placeholder, value }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  return (
    <div className="border-t border-slate-200/80 bg-white/90 px-4 pb-4 pt-3">
      <div className="flex items-end gap-3 rounded-[1.6rem] border border-slate-200 bg-white px-3 py-3 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
        <textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          rows={1}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          className="max-h-40 min-h-[24px] flex-1 resize-none bg-transparent text-[15px] leading-6 text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          disabled={disabled || !value.trim()}
          onClick={onSubmit}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          aria-label="Enviar mensaje"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M5 12h12M13 4l8 8-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

