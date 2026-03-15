import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function PageSkeleton({ type = "dashboard" }: { type?: "dashboard" | "list" | "detail" }) {
    if (type === "dashboard") {
        return (
            <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row gap-6 mb-8 justify-between items-start md:items-end">
                    <div className="space-y-4 w-full max-w-sm">
                        <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
                        <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <Skeleton className="h-12 w-40 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-40 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-40 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-40 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="space-y-6">
                    <Skeleton className="h-8 w-48 bg-slate-200 dark:bg-slate-700" />
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
                        <Skeleton className="h-24 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
                        <Skeleton className="h-24 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
                    </div>
                </div>
            </div>
        );
    }

    if (type === "list") {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-80 w-full rounded-[3rem] bg-slate-100 dark:bg-slate-800" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-10 animate-in fade-in duration-500">
            <Skeleton className="h-10 w-64 bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-96 w-full rounded-[3rem] bg-slate-100 dark:bg-slate-800" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-3/4 bg-slate-100 dark:bg-slate-800/50" />
                <Skeleton className="h-6 w-full bg-slate-100 dark:bg-slate-800/50" />
                <Skeleton className="h-6 w-5/6 bg-slate-100 dark:bg-slate-800/50" />
            </div>
        </div>
    );
}
