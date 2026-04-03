"use client";

import type { QuickAction } from "@/components/chat/types";

type QuickActionsProps = {
  actions: QuickAction[];
  disabled?: boolean;
  onSelect: (action: QuickAction) => void;
};

export default function QuickActions({ actions, disabled = false, onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-1 pt-1">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

