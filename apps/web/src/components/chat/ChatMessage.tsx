"use client";

import type { ChatMessageRecord } from "@/components/chat/types";

type ChatMessageProps = {
  message: ChatMessageRecord;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-[1.4rem] px-4 py-3 text-[15px] leading-6 shadow-sm ${
          isAssistant
            ? "rounded-bl-md border border-slate-200 bg-white text-slate-700"
            : "rounded-br-md bg-slate-900 text-white"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

