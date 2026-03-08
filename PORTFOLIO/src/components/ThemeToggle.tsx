"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const shouldUseDark =
      storedTheme === "dark" ||
      (storedTheme === null && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const currentlyDark = document.documentElement.classList.contains("dark");

    if (currentlyDark) {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
      setIsDark(false);
      return;
    }

    document.documentElement.classList.add("dark");
    window.localStorage.setItem("theme", "dark");
    setIsDark(true);
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "\u2600\uFE0F" : "\u{1F319}"}
    </button>
  );
}
