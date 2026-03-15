"use client";

import React from "react";
import { motion } from "framer-motion";
import { FolderSearch, BellOff, Briefcase, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    actionOnClick?: () => void;
    illustration?: "search" | "notification" | "job" | "general";
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    actionOnClick,
    illustration = "general",
}: EmptyStateProps) {
    const renderIcon = () => {
        if (icon) return icon;
        switch (illustration) {
            case "notification":
                return <BellOff size={48} className="text-blue-500 opacity-50" />;
            case "job":
                return <Briefcase size={48} className="text-blue-500 opacity-50" />;
            case "search":
                return <FolderSearch size={48} className="text-blue-500 opacity-50" />;
            default:
                return <FolderSearch size={48} className="text-blue-500 opacity-50" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 w-full"
        >
            <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-inner relative">
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full animate-pulse-slow"></div>
                {renderIcon()}
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                {title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mb-8 leading-relaxed">
                {description}
            </p>

            {actionLabel &&
                (actionHref ? (
                    <Link
                        href={actionHref}
                        className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                    >
                        {actionLabel} <ArrowRight size={16} className="ml-2" />
                    </Link>
                ) : (
                    <button
                        onClick={actionOnClick}
                        className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                    >
                        {actionLabel} <Plus size={16} className="ml-2" />
                    </button>
                ))}
        </motion.div>
    );
}
