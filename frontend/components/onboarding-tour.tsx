'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Zap, Sparkles } from 'lucide-react';
import { trackEvent } from '@/components/analytics-provider';

interface TourStep {
    id: string;
    title: string;
    description: string;
    emoji: string;
    position?: 'center' | 'top-right' | 'bottom-left';
}

interface OnboardingTourProps {
    role: 'candidat' | 'entreprise';
}

const CANDIDAT_STEPS: TourStep[] = [
    {
        id: 'welcome',
        title: 'Bienvenue sur Travago ! 🎉',
        description: 'Nous allons vous faire une visite guidée de votre espace candidat. Cela prend moins de 2 minutes.',
        emoji: '👋',
        position: 'center',
    },
    {
        id: 'score',
        title: 'Votre Indice de Placabilité',
        description: 'Ce score de 0 à 100 mesure vos chances d\'être placé. Plus il est élevé, plus vous apparaissez en tête des résultats pour les recruteurs.',
        emoji: '📊',
        position: 'center',
    },
    {
        id: 'documents',
        title: 'Vos Documents KYC',
        description: 'Uploadez votre CNI et vos diplômes ici. Notre équipe les vérifie sous 48h. C\'est obligatoire pour être éligible au placement.',
        emoji: '📄',
        position: 'center',
    },
    {
        id: 'ia',
        title: 'L\'IA Travago Travaille Pour Vous',
        description: 'Notre algorithme analyse votre profil en continu et vous propose automatiquement aux entreprises partenaires. Vous n\'avez rien à faire !',
        emoji: '🤖',
        position: 'center',
    },
    {
        id: 'profil',
        title: 'Complétez Votre Profil',
        description: 'Un profil 100% complet (photo, bio, expériences, compétences) multiplie par 5 vos chances d\'être contacté. C\'est votre carte de visite digitale.',
        emoji: '✨',
        position: 'center',
    },
    {
        id: 'done',
        title: 'Vous êtes prêt ! 🚀',
        description: 'Commencez par compléter votre profil et uploader vos documents. L\'équipe Travago vous accompagne à chaque étape.',
        emoji: '🏆',
        position: 'center',
    },
];

const ENTREPRISE_STEPS: TourStep[] = [
    {
        id: 'welcome',
        title: 'Bienvenue, Recruteur ! 🎉',
        description: 'Voici votre espace de recrutement intelligent. Découvrons ensemble comment trouver les meilleurs talents au Cameroun.',
        emoji: '👋',
        position: 'center',
    },
    {
        id: 'credits',
        title: 'Vos Crédits de Recrutement',
        description: 'Chaque action (contact d\'un candidat, lancement d\'une analyse IA) consomme des crédits. Rechargez-les via Orange Money ou MTN MoMo.',
        emoji: '💰',
        position: 'center',
    },
    {
        id: 'offre',
        title: 'Publiez une Offre d\'Emploi',
        description: 'Remplissez les compétences requises et notre IA Matching v2.5 analysera automatiquement tous les candidats vérifiés pour vous proposer les 3 meilleurs profils.',
        emoji: '📝',
        position: 'center',
    },
    {
        id: 'ia_matching',
        title: 'Le Matching IA en Action',
        description: 'Notre algorithme calcule un score de compatibilité (0-100%) pour chaque candidat vs votre offre. Vous ne voyez que les profils pré-qualifiés.',
        emoji: '🤖',
        position: 'center',
    },
    {
        id: 'candidats',
        title: 'Explorez les Profils Certifiés',
        description: 'Tous nos candidats ont été vérifiés (CNI + Diplômes). Le badge "Certifié Travago" garantit l\'authenticité des informations.',
        emoji: '🏅',
        position: 'center',
    },
    {
        id: 'done',
        title: 'Lancez votre premier recrutement ! 🚀',
        description: 'Commencez par publier une offre ou parcourir les profils disponibles. Notre équipe est disponible pour vous accompagner.',
        emoji: '🎯',
        position: 'center',
    },
];

const STORAGE_KEY = 'travago_onboarding_done';

export default function OnboardingTour({ role }: OnboardingTourProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const steps = role === 'candidat' ? CANDIDAT_STEPS : ENTREPRISE_STEPS;
    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;
    const isFirst = currentStep === 0;

    useEffect(() => {
        const done = localStorage.getItem(`${STORAGE_KEY}_${role}`);
        if (!done) {
            // Lance le tour après 2.5s (laisser le dashboard charger)
            const t = setTimeout(() => setIsVisible(true), 2500);
            return () => clearTimeout(t);
        }
    }, [role]);

    const handleNext = () => {
        if (isLast) {
            handleFinish();
        } else {
            setCurrentStep(s => s + 1);
        }
    };

    const handlePrev = () => {
        setCurrentStep(s => s - 1);
    };

    const handleFinish = () => {
        localStorage.setItem(`${STORAGE_KEY}_${role}`, 'done');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-sm"
                        onClick={handleFinish}
                    />

                    {/* Tour Modal */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        className="fixed z-[301] inset-0 flex items-center justify-center p-6 pointer-events-none"
                    >
                        <div className="pointer-events-auto bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative border border-slate-100">
                            {/* Close button */}
                            <button
                                onClick={handleFinish}
                                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                                aria-label="Passer la visite guidée"
                            >
                                <X size={18} />
                            </button>

                            {/* Step indicator */}
                            <div className="flex items-center gap-2 mb-6">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-blue-600 w-8' : idx < currentStep ? 'bg-blue-200 w-4' : 'bg-slate-100 w-4'}`}
                                    />
                                ))}
                            </div>

                            {/* Emoji */}
                            <div className="text-6xl mb-6 text-center">{step.emoji}</div>

                            {/* Brand badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1.5 px-3 py-1. bg-blue-50 rounded-full border border-blue-100">
                                    <Sparkles size={10} className="text-blue-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                                        Visite Guidée · Étape {currentStep + 1}/{steps.length}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug mb-3">
                                {step.title}
                            </h2>
                            <p className="text-base text-slate-500 leading-relaxed mb-8 font-medium">
                                {step.description}
                            </p>

                            {/* Navigation */}
                            <div className="flex items-center gap-3">
                                {!isFirst && (
                                    <button
                                        onClick={handlePrev}
                                        className="flex items-center gap-2 px-5 py-4 bg-slate-100 text-slate-700 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        <ChevronLeft size={14} /> Préc.
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                                >
                                    {isLast ? (
                                        <>Commencer <Zap size={14} className="fill-white" /></>
                                    ) : (
                                        <>Suivant <ChevronRight size={14} /></>
                                    )}
                                </button>
                            </div>

                            {/* Skip */}
                            {!isLast && (
                                <button
                                    onClick={handleFinish}
                                    className="w-full mt-3 text-center text-[10px] font-bold text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-widest"
                                >
                                    Passer la visite guidée
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
