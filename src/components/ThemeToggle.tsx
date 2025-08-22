"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded border bg-gray-100 dark:bg-gray-800 dark:text-white"
            aria-label="Toggle dark mode"
        >
            {theme === "dark" ? "🌙 Mode sombre" : "☀️ Mode clair"}
        </button>
    );
}