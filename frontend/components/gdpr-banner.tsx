'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, X, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GDPR_STORAGE_KEY = 'travago_gdpr_consent';

export default function GdprBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(GDPR_STORAGE_KEY);
        if (!consent) {
            // Délai de 1.5s pour ne pas agresser l'utilisateur à l'arrivée
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem(GDPR_STORAGE_KEY, JSON.stringify({
            analytics: true,
            functional: true,
            timestamp: new Date().toISOString()
        }));
        setIsVisible(false);
        // Déclencher l'init des analytics après consentement
        if (typeof window !== 'undefined' && (window as any).initAnalytics) {
            (window as any).initAnalytics();
        }
    };

    const acceptEssential = () => {
        localStorage.setItem(GDPR_STORAGE_KEY, JSON.stringify({
            analytics: false,
            functional: true,
            timestamp: new Date().toISOString()
        }));
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed bottom-6 left-4 right-4 z-[200] mx-auto max-w-2xl"
                    role="dialog"
                    aria-label="Bannière de confidentialité RGPD"
                >
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 border border-slate-100 p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Shield size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Vos Données & Confidentialité</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Conformité RGPD</p>
                                </div>
                            </div>
                            <button
                                onClick={acceptEssential}
                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                                aria-label="Fermer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Travago collecte vos données personnelles (CV, expériences, coordonnées) uniquement pour vous mettre en relation avec des entreprises partenaires au Cameroun.
                            Vos données ne sont <strong>jamais revendues</strong> à des tiers. Vous pouvez demander leur suppression à tout moment.
                        </p>

                        {showDetails && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-4 space-y-2"
                            >
                                {[
                                    { name: 'Essentiels', desc: 'Authentification et sécurité (obligatoire)', required: true },
                                    { name: 'Analytics', desc: 'Amélioration du service via statistiques anonymes', required: false },
                                    { name: 'Matching IA', desc: 'Analyse de votre profil pour le placement automatisé', required: false },
                                ].map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div>
                                            <span className="text-xs font-black text-slate-900">{item.name}</span>
                                            <p className="text-[10px] text-slate-400">{item.desc}</p>
                                        </div>
                                        {item.required
                                            ? <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg uppercase">Requis</span>
                                            : <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">Opt-in</span>
                                        }
                                    </div>
                                ))}
                                <Link
                                    href="/confidentialite"
                                    className="flex items-center gap-1 text-[10px] text-blue-600 font-bold hover:underline mt-2"
                                    target="_blank"
                                >
                                    Politique de confidentialité complète <ExternalLink size={10} />
                                </Link>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                            <button
                                onClick={acceptAll}
                                className="w-full sm:w-auto flex-1 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                            >
                                Tout Accepter
                            </button>
                            <button
                                onClick={acceptEssential}
                                className="w-full sm:w-auto flex-1 px-8 py-4 bg-slate-100 text-slate-700 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Essentiels uniquement
                            </button>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-1 shrink-0"
                            >
                                Personnaliser <ChevronRight size={12} className={`transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
