"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function subscribe() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function getThemeFromDocument(): Theme {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return "dark";
  }

  return "light";
}

export default function ThemeToggle() {
  const mounted = useMounted();
  const [theme, setTheme] = useState<Theme>(getThemeFromDocument);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(theme);

    try {
      window.localStorage.setItem("theme", theme);
    } catch {}
  }, [mounted, theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      Toggle theme
    </button>
  );
}
