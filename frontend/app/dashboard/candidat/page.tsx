'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FileText,
    MessageSquare,
    TrendingUp,
    Eye,
    Target,
    Zap,
    CheckCircle2,
    ArrowUpRight,
    Briefcase,
    Award,
    ShieldCheck,
    FolderCheck,
    Clock,
    AlertCircle,
    ChevronRight,
    Loader2,
    BadgeCheck,
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth-store';
import axiosInstance from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardCandidatPage() {
    const { user, fetchUser } = useAuthStore();
    const [candidatures, setCandidatures] = useState<any[]>([]);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [conversations, setConversations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        refreshData();
    }, []);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchUser(), // Get latest scores and documents
                fetchCandidatures(),
                fetchConversations()
            ]);
        } catch (err) {
            console.error('Error refreshing dashboard data', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCandidatures = async () => {
        try {
            const response = await axiosInstance.get('jobs/my-applications/');
            setCandidatures(response.data.results || response.data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        }
    };

    const fetchConversations = async () => {
        try {
            const response = await axiosInstance.get('chat/');
            setConversations(response.data.results || response.data);
        } catch (err) {
            console.error('Failed to fetch conversations', err);
        }
    };

    // Using real score from profile if available, otherwise fallback to 0 or mock
    const placabilityScore = user?.candidate_profile?.placability_score ?? 0;
    const isVerified = user?.candidate_profile?.is_verified ?? false;

    const roadmapSteps = [
        { id: 1, label: 'Profil de Base', status: user?.candidate_profile?.title ? 'completed' : 'active', desc: 'Identité et expérience' },
        { id: 2, label: 'Documents KYC', status: user?.candidate_profile?.reliability_score && user.candidate_profile.reliability_score >= 50 ? 'completed' : 'active', desc: 'CNI et Diplômes certifiés' },
        { id: 3, label: 'Vérification Admin', status: isVerified ? 'completed' : 'pending', desc: 'Validation par l\'équipe Travago' },
        { id: 4, label: 'Éligibilité Placement', status: isVerified ? 'completed' : 'pending', desc: 'Accès au réseau premium' },
    ];

    const criticalActions = [
        ...((!user?.candidate_profile?.reliability_score || user.candidate_profile.reliability_score < 50) ? [{
            title: "Uploader votre CNI",
            desc: "Requis pour la vérification d'identité avant tout placement.",
            icon: <ShieldCheck className="text-blue-600" />,
            btn: "Vérifier mon identité",
            href: "/dashboard/candidat/documents"
        }] : []),
        ...(!isVerified ? [{
            title: "Obtenir le badge Certifié",
            desc: "Boostez votre visibilité de 300% avec le badge Travago Certified.",
            icon: <Award className="text-purple-600" />,
            btn: "Voir mon statut",
            href: "/dashboard/candidat/certifs"
        }] : []),
        ...(user?.candidate_profile && !user.candidate_profile.cv ? [{
            title: "Compléter votre CV",
            desc: "Un CV complet multiplie par 3 vos chances de matching.",
            icon: <FileText className="text-orange-600" />,
            btn: "Éditer mon profil",
            href: "/dashboard/candidat/profil"
        }] : [])
    ].slice(0, 2); // Keep only 2 main actions

    if (!mounted) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-10">
            {/* Top Section: Placability & Roadmap */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* 1. Score de Placabilité (The HERO metric) */}
                <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 text-center flex flex-col items-center">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-100 mb-8">Indice de Placabilité</h3>

                        <div className="relative w-44 h-44 mb-6 mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-blue-400/30" strokeWidth="12" stroke="currentColor" fill="transparent" r="80" cx="88" cy="88" />
                                <circle className="text-white" strokeWidth="12" strokeDasharray={502} strokeDashoffset={502 - (502 * placabilityScore) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="80" cx="88" cy="88" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black">{placabilityScore}%</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">Prêt au placement</span>
                            </div>
                        </div>

                        {isVerified ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40 mb-4 transition-all">
                                <BadgeCheck size={14} /> Profil Certifié Travago ✓
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-blue-100 text-[10px] font-black uppercase tracking-widest mb-4 transition-all">
                                <Lock size={12} /> Certification en attente
                            </div>
                        )}

                        <p className="text-xs font-bold text-blue-50 max-w-[200px] leading-relaxed">
                            {isVerified
                                ? "Votre profil est validé ! Vous êtes maintenant visible par nos partenaires."
                                : "Complétez vos documents pour atteindre 90% et être prioritaire."}
                        </p>
                    </div>
                </div>

                {/* 2. Roadmap / Chemin vers l'emploi */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-blue-50 dark:border-slate-800 transition-colors">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center">
                        <TrendingUp className="mr-3 text-blue-600 dark:text-blue-400" />
                        Votre chemin vers le placement
                    </h3>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100 hidden sm:block"></div>

                        <div className="space-y-8">
                            {roadmapSteps.map((step, idx) => (
                                <div key={idx} className="relative flex items-center group">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center z-10 transition-all ${step.status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-100' :
                                        step.status === 'active' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/20 animate-pulse' :
                                            'bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-800'
                                        }`}>
                                        {step.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="font-black">{idx + 1}</span>}
                                    </div>
                                    <div className="ml-6">
                                        <h4 className={`text-lg font-black leading-none mb-1 ${step.status === 'pending' ? 'text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}>
                                            {step.label}
                                        </h4>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{step.desc}</p>
                                    </div>
                                    {step.status === 'active' && (
                                        <Link
                                            href={step.id === 2 ? "/dashboard/candidat/documents" : step.id === 3 ? "/dashboard/candidat/certifs" : "/dashboard/candidat/profil"}
                                            className="ml-auto hidden sm:flex items-center text-blue-600 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform"
                                        >
                                            Continuer <ChevronRight size={16} className="ml-1" />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Critical Actions */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {criticalActions.map((action, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-950 rounded-[2rem] p-5 sm:p-8 border border-blue-50 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-900/20 transition-all">
                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 sm:space-x-0">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center shrink-0">
                                {action.icon}
                            </div>
                            <div className="flex-1 font-sans">
                                <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{action.title}</h4>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">{action.desc}</p>
                                <Link
                                    href={action.href}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
                                >
                                    {action.btn}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section: Specific Modules Portfolio */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* 1. Document Verification Status */}
                <div className="bg-white dark:bg-slate-950 rounded-[2rem] p-5 sm:p-8 shadow-sm border border-blue-50 dark:border-slate-800 flex flex-col transition-colors">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center">
                        <FolderCheck className="mr-3 text-blue-600 dark:text-blue-400" />
                        Documents KYC
                    </h3>
                    <div className="space-y-4 flex-1">
                        {user?.candidate_profile?.documents && user.candidate_profile.documents.length > 0 ? (
                            user.candidate_profile.documents.map((doc: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {doc.document_type === 'CNI' ? 'CNI / Passeport' :
                                            doc.document_type === 'DIPLOMA' ? 'Diplôme' :
                                                doc.document_type === 'CERTIFICATE' ? 'Certificat' : 'Autre'}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${doc.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                        doc.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {doc.status === 'VERIFIED' ? 'Vérifié' :
                                            doc.status === 'PENDING' ? 'En attente' : 'Rejeté'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-slate-400 dark:text-slate-500 font-medium text-sm">
                                Aucun document soumis.
                            </div>
                        )}

                        {(!user?.candidate_profile?.documents?.some((d: any) => d.document_type === 'CNI')) && (
                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                                <span className="text-sm font-bold text-red-700 dark:text-red-400">CNI / Passeport</span>
                                <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">Manquant</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Certification Status */}
                <div className="bg-white dark:bg-slate-950 rounded-[2rem] p-5 sm:p-8 shadow-sm border border-blue-50 dark:border-slate-800 flex flex-col transition-colors">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center">
                        <Award className="mr-3 text-purple-600 dark:text-purple-400" />
                        Badge de Confiance
                    </h3>
                    <div className="space-y-4 flex-1">
                        <div className={`p-5 rounded-2xl border flex flex-col items-center text-center ${isVerified ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isVerified ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                                {isVerified ? <BadgeCheck size={24} /> : <Lock size={24} />}
                            </div>
                            <span className={`text-sm font-black uppercase tracking-widest ${isVerified ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {isVerified ? 'Profil Certifié' : 'Certification Restreinte'}
                            </span>
                            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                                {isVerified
                                    ? "Votre identité et vos compétences ont été validées par admin."
                                    : "Validez votre identité et vos diplômes pour débloquer votre badge."}
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard/candidat/certifs" className="mt-8 text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-widest flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 py-3 rounded-xl hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-all shadow-sm">
                        Voir les détails <ChevronRight size={14} className="ml-1" />
                    </Link>
                </div>

                {/* 3. Messages / Conversations */}
                <div className="bg-white dark:bg-slate-950 rounded-[2rem] p-5 sm:p-8 shadow-sm border border-blue-50 dark:border-slate-800 flex flex-col transition-colors">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center">
                        <MessageSquare className="mr-3 text-green-600 dark:text-green-400" />
                        Messages Récents
                    </h3>
                    <div className="space-y-4 flex-1">
                        {conversations.length > 0 ? conversations.slice(0, 3).map((conv: any, i: number) => (
                            <div key={i} className="flex items-center space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-700 dark:text-green-500 font-black text-xs">
                                    {conv.other_participant?.username?.substring(0, 2).toUpperCase() || '??'}
                                </div>
                                <div className="flex-1 min-w-0 font-sans">
                                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">{conv.other_participant?.username}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{conv.last_message?.content || 'Pas de message'}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-6 text-slate-400 dark:text-slate-500 font-medium text-sm">
                                Pas de messages récents.
                            </div>
                        )}
                    </div>
                    <Link href="/dashboard/candidat/messages" className="mt-8 text-green-600 dark:text-green-400 font-black text-xs uppercase tracking-widest flex items-center justify-center bg-green-50 dark:bg-green-900/20 py-3 rounded-xl hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-all shadow-sm">
                        Ouvrir la messagerie
                    </Link>
                </div>

                {/* 4. Placement History / Requests (Full Width) */}
                <div className="bg-white dark:bg-slate-950 rounded-[2rem] p-5 sm:p-8 shadow-sm border border-blue-50 dark:border-slate-800 lg:col-span-3 transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center">
                            <Briefcase className="mr-3 text-blue-600 dark:text-blue-400" />
                            État de vos Placements
                        </h3>
                        <Link href="/dashboard/candidat/candidatures" className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest hover:underline">Voir tout</Link>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="w-12 h-12 rounded-xl dark:bg-slate-800" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-3/4 dark:bg-slate-800" />
                                            <Skeleton className="h-3 w-1/2 dark:bg-slate-800" />
                                        </div>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                                        <Skeleton className="h-4 w-16 dark:bg-slate-800" />
                                        <Skeleton className="h-4 w-24 dark:bg-slate-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : candidatures.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {candidatures.slice(0, 3).map((app: any) => (
                                <div key={app.id} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800 hover:border-blue-100 dark:hover:border-blue-900/50 transition-all">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center text-slate-900 dark:text-white font-black text-xs border border-slate-100 dark:border-slate-800 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-all font-sans">
                                            {app.job_offer_detail?.company_detail?.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="font-sans">
                                            <h4 className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[150px]">{app.job_offer_detail?.title}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{app.job_offer_detail?.company_detail?.name}</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{app.status}</span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white">Matching: {app.matching_score}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
                                <Clock size={32} />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Pas de placement en cours</h4>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
                                Augmentez votre <span className="text-blue-600 dark:text-blue-400 font-bold">score de placabilité</span> pour être suggéré automatiquement aux entreprises premium.
                            </p>
                            <Link
                                href="/dashboard/candidat/certifs"
                                className="inline-block px-6 py-3 bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-800 rounded-xl font-black text-xs uppercase tracking-widest hover:border-blue-600 dark:hover:border-blue-400 transition-all text-center shadow-sm"
                            >
                                Voir mon statut de certification
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Help / Footer Notice */}
            <div className="bg-blue-900/5 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-[2rem] p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-200">
                        Votre dossier est actuellement en cours d'analyse par notre algorithme de placement. Mettez à jour vos documents pour accélérer le processus.
                    </p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 text-right">
                    <a href="mailto:support@travago.ci" className="text-blue-600 dark:text-blue-400 font-black text-[10px] sm:text-xs uppercase tracking-widest hover:underline">Support Travago</a>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">Travago Placement System v2.1</span>
                </div>
            </div>
        </div>
    );
}
