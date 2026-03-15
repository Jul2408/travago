"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-100 dark:border-slate-800"
            >
                <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white dark:border-slate-900 shadow-lg">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                    Oops, notre IA a eu un moment d'inattention...
                </h2>

                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                    Une erreur inattendue s'est produite. Nos ingénieurs IA ont été notifiés et examinent le problème.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => reset()}
                        className="w-full flex items-center justify-center py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                    >
                        <RefreshCcw size={18} className="mr-2" /> Réessayer
                    </button>

                    <Link
                        href="/"
                        className="w-full flex items-center justify-center py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                        <Home size={18} className="mr-2" /> Retour à l'accueil
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
