"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10 border border-slate-100 rounded-xl bg-slate-50 relative overflow-hidden animate-pulse"></div>;
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-800 transition-all flex items-center justify-center relative overflow-hidden group"
            title="Basculer le thème"
        >
            <div className="relative z-10">
                {theme === 'dark' ? (
                    <Moon size={20} className="fill-blue-500/20 text-blue-400 group-hover:rotate-[-10deg] transition-transform duration-300" />
                ) : (
                    <Sun size={20} className="fill-yellow-500/20 text-yellow-500 group-hover:rotate-90 transition-transform duration-500" />
                )}
            </div>
        </button>
    );
}
