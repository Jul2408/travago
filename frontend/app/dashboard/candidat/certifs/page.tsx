'use client';

import { useState, useEffect } from 'react';
import {
    Award,
    ShieldCheck,
    FileText,
    Calendar,
    BadgeCheck,
    Lock,
    AlertCircle,
    ChevronRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

interface CandidateProfile {
    is_verified: boolean;
    placability_score: number;
    reliability_score: number;
    title: string | null;
    documents: Array<{ id: number; document_type: string; status: string }>;
}

export default function CandidateCertifsPage() {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<CandidateProfile | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const profileRes = await axiosInstance.get('users/profile/candidate/');
            setProfile(profileRes.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    const isVerified = profile?.is_verified === true;
    const verifiedDocs = profile?.documents?.filter(d => d.status === 'VERIFIED') || [];
    const pendingDocs = profile?.documents?.filter(d => d.status === 'PENDING') || [];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes Certifications</h1>
                    <p className="text-slate-500 font-medium">Votre statut de certification officielle Travago et vos titres de compétences validés.</p>
                </div>
            </div>

            {/* ── BLOC PRINCIPAL : Badge Certifié Travago ─────────────────── */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : isVerified ? (
                /* ── ÉTAT VALIDÉ ── */
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-300/30">
                    {/* Glow effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        {/* Badge Icon */}
                        <div className="shrink-0 flex flex-col items-center">
                            <div className="relative">
                                <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                                    <BadgeCheck size={72} className="text-white drop-shadow-lg" />
                                </div>
                                {/* Pulse ring */}
                                <div className="absolute inset-0 rounded-[3rem] border-2 border-blue-400/30 animate-ping"></div>
                            </div>
                            <div className="mt-4 px-5 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-widest">
                                Profil Certifié
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-6">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                Validé par l'Équipe Travago
                            </div>
                            <h2 className="text-4xl font-black leading-tight mb-4">
                                {profile?.title || 'Talent Certifié'}<br />
                                <span className="text-blue-400">Travago Certified ✓</span>
                            </h2>
                            <p className="text-slate-400 font-medium leading-relaxed max-w-lg mb-8">
                                Votre identité, vos diplômes et vos compétences ont été vérifiés et validés par les équipes Travago. Les entreprises partenaires voient votre badge de confiance en priorité.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Score Dossier', value: `${profile?.placability_score || 0}%`, color: 'text-blue-400' },
                                    { label: 'Score Fiabilité', value: `${profile?.reliability_score || 0}%`, color: 'text-indigo-400' },
                                    { label: 'Docs Vérifiés', value: verifiedDocs.length, color: 'text-emerald-400' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ── ÉTAT EN ATTENTE / NON VALIDÉ ── */
                <div className="bg-white rounded-[3rem] border-2 border-dashed border-amber-200 p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -translate-y-32 translate-x-32 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                        {/* Lock Icon */}
                        <div className="shrink-0">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-amber-50 border-2 border-amber-100 flex items-center justify-center">
                                <Lock size={48} className="text-amber-500" />
                            </div>
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 rounded-full text-amber-700 text-[10px] font-black uppercase tracking-widest mb-4">
                                <AlertCircle size={12} />
                                En attente de validation
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-3">
                                Certification <span className="text-amber-500">non encore accordée</span>
                            </h2>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-lg mb-6">
                                L'équipe Travago examine votre dossier. Une fois tous vos documents KYC vérifiés, vous recevrez votre badge <strong>Travago Certified</strong> qui boostera votre visibilité auprès des recruteurs.
                            </p>

                            {/* Progress steps */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                {[
                                    { step: '1', label: 'Dépôt des documents', done: (profile?.documents?.length || 0) > 0 },
                                    { step: '2', label: 'Vérification admin', done: verifiedDocs.length > 0 },
                                    { step: '3', label: 'Badge Certifié accordé', done: isVerified },
                                ].map((s) => (
                                    <div key={s.step} className={`flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 border ${s.done ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${s.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {s.done ? <ShieldCheck size={14} /> : s.step}
                                        </div>
                                        <span className={`text-xs font-bold ${s.done ? 'text-emerald-700' : 'text-slate-500'}`}>{s.label}</span>
                                    </div>
                                ))}
                            </div>

                            {pendingDocs.length > 0 && (
                                <p className="text-xs text-amber-600 font-bold flex items-center gap-2 mb-4">
                                    <AlertCircle size={14} />
                                    {pendingDocs.length} document(s) en attente de vérification par l'admin.
                                </p>
                            )}

                            <Link
                                href="/dashboard/candidat/documents"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                            >
                                <FileText size={14} /> Gérer mes documents <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
