"use client";

type ChatLauncherProps = {
  isOpen: boolean;
  onClick: () => void;
  label: string;
};

export default function ChatLauncher({ isOpen, onClick, label }: ChatLauncherProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-label={label}
      onClick={onClick}
      className="group flex h-16 w-16 items-center justify-center rounded-[1.7rem] border border-slate-900/10 bg-white text-slate-900 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-26px_rgba(15,23,42,0.52)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10"
    >
      <span className="relative flex h-7 w-7 items-center justify-center">
        <span
          className={`absolute inset-0 transition duration-200 ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
            <path
              d="M7 16.5L4 19V6.75C4 5.784 4.784 5 5.75 5h12.5C19.216 5 20 5.784 20 6.75v8.5c0 .966-.784 1.75-1.75 1.75H7Z"
              className="stroke-current"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M8 10h8M8 13h5" className="stroke-current opacity-70" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <span
          className={`absolute inset-0 transition duration-200 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
            <path d="M7 7l10 10M17 7L7 17" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </span>
      <span className="absolute -top-2 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-400 shadow-sm" aria-hidden="true" />
    </button>
  );
}

