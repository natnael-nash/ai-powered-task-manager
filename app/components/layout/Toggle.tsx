// app/components/theme-toggle.tsx
"use client";

import { MoonIcon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    const isDark = saved ? saved === "dark" : systemDark;

    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <button onClick={toggle} className="px-3 py-2 cursor-pointer">
      {dark ? <Sun className="w-5 h-4" /> : <MoonIcon className="w-5 h-4" />}
    </button>
  );
}
