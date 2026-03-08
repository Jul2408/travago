'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth-store';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Plus,
    BarChart3,
    Cpu,
    Coins,
    Target,
    Zap,
    ArrowUpRight,
    Award,
    ShieldCheck,
    Filter,
    TrendingUp,
    ChevronRight,
    Search,
    UserCheck,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardEntreprisePage() {
    const { user, fetchUser } = useAuthStore();
    const [stats, setStats] = useState({
        activePlacements: 0,
        matches: 0,
        credits: user?.credits || 0,
        certifiedTalents: 0
    });
    const [recentPlacements, setRecentPlacements] = useState<any[]>([]);
    const [eliteTalents, setEliteTalents] = useState<any[]>([]);
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
                fetchUser(),
                fetchDashboardStats(),
                fetchRecentPlacements(),
                fetchEliteTalents(),
                fetchConversations()
            ]);
        } catch (err) {
            console.error('Error refreshing recruiter dashboard', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await axiosInstance.get('users/company/stats/');
            const data = response.data;

            setStats({
                activePlacements: data.stats.total_placements || 0,
                matches: data.stats.total_applications || 0,
                credits: data.stats.credits || 0,
                certifiedTalents: data.stats.certified_talents_count || 0
            });
        } catch (err) {
            console.error('Failed to fetch dashboard stats', err);
        }
    };

    const fetchRecentPlacements = async () => {
        try {
            const response = await axiosInstance.get('placements/');
            const placements = response.data.results || response.data;
            if (Array.isArray(placements)) {
                setRecentPlacements(placements.slice(0, 3));
            } else {
                setRecentPlacements([]);
            }
        } catch (err) {
            console.error('Failed to fetch recent placements', err);
            setRecentPlacements([]);
        }
    };

    const fetchEliteTalents = async () => {
        try {
            const response = await axiosInstance.get('users/candidates/?limit=10&ordering=-placability_score');
            const talents = response.data.results || response.data;
            if (Array.isArray(talents)) {
                const elite = talents.filter((t: any) => t.placability_score >= 80).slice(0, 3);
                setEliteTalents(elite.length > 0 ? elite : talents.slice(0, 3));
            } else {
                setEliteTalents([]);
            }
        } catch (err) {
            console.error('Failed to fetch elite talents', err);
            setEliteTalents([]);
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

    if (!mounted) return null;

    return (
        <div className="space-y-6 sm:space-y-10">
            {/* 1. Placement IA Hero Section */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center px-4 py-1.5 bg-blue-500/30 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
                            Système de Placement Travago
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black mb-6 leading-[1.1]">Trouvez le candidat parfait sans lever le petit doigt.</h3>
                        <p className="text-blue-100 font-medium text-lg leading-relaxed mb-10 max-w-lg">
                            Dites-nous quel poste vous souhaitez pourvoir, et notre système s'occupe du reste : sourcing, curation de talents, et vérification des certifications.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/dashboard/entreprise/offres/nouvelle" className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-white text-blue-700 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
                                <Zap size={18} className="mr-2" /> Lancer un placement
                            </Link>
                            <Link href="/dashboard/entreprise/candidats" className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-blue-600/50 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600/70 transition-all flex items-center justify-center">
                                <Search size={18} className="mr-2" /> Chercher des talents
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:grid grid-cols-2 gap-6">
                        {
                            isLoading
                                ? [1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] space-y-3">
                                        <div className="w-6 h-6 bg-white/20 rounded" />
                                        <div className="h-8 bg-white/20 rounded w-2/3" />
                                        <div className="h-3 bg-white/10 rounded w-full" />
                                    </div>
                                ))
                                : [
                                    { label: "Talents Certifiés", val: `${stats.certifiedTalents}`, icon: <ShieldCheck className="text-blue-200" /> },
                                    { label: "Missions de Chasse IA", val: `${stats.activePlacements}`, icon: <TrendingUp className="text-blue-200" /> },
                                    { label: "Matches Débloqués", val: `${stats.matches}`, icon: <Target className="text-blue-200" /> },
                                    { label: "Budget Placements", val: `${stats.credits}`, icon: <Zap className="text-blue-200" /> },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[2rem]">
                                        <div className="mb-4">{stat.icon}</div>
                                        <div className="text-2xl font-black leading-none mb-1">{stat.val}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-200">{stat.label}</div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* 2. Suivi de Placements IA (Essential) */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-blue-50 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
                                <Cpu className="mr-3 text-blue-600 shrink-0" /> <span className="truncate">Chasses IA</span>
                            </h3>
                            <Link href="/dashboard/entreprise/placement" className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline whitespace-nowrap">Gérer tout</Link>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-5 sm:p-8 bg-slate-50 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 flex items-center justify-between">
                                            <div className="space-y-3 flex-1">
                                                <Skeleton className="h-6 w-1/3" />
                                                <Skeleton className="h-4 w-1/4" />
                                            </div>
                                            <Skeleton className="h-10 w-24 rounded-xl" />
                                        </div>
                                    ))}
                                </div>
                            ) : recentPlacements.length === 0 ? (
                                <div className="p-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Briefcase size={32} />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 mb-2">Aucun placement actif</h4>
                                    <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto mb-6">
                                        Lancez votre première mission de chasse IA assistée par Travago dès maintenant.
                                    </p>
                                    <Link href="/dashboard/entreprise/placement" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                        Lancer une chasse IA
                                    </Link>
                                </div>
                            ) : (
                                recentPlacements.map((p) => (
                                    <div key={p.id} className="group p-5 sm:p-8 bg-slate-50 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <h4 className="text-lg sm:text-xl font-black text-slate-900 truncate leading-tight" title={p.title}>{p.title}</h4>
                                                    <span className="shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest">
                                                        {p.is_ia_boosted ? 'Automatisé' : 'Standard'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-1.5 "></div>
                                                        {p.status_display || p.status}
                                                    </div>
                                                    <div className="h-3 w-px bg-slate-200"></div>
                                                    <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest truncate">
                                                        {p.matches?.length || 0} Talents Matchés
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href={`/dashboard/entreprise/placement/${p.id}`} className="w-full sm:w-auto px-5 py-3 bg-white border border-blue-100 text-blue-600 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm text-center">
                                                Voir la Shortlist
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                        {/* Messages Module */}
                        <div className="bg-white rounded-[2rem] p-5 sm:p-8 border border-blue-50 shadow-sm flex flex-col">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
                                <MessageSquare className="mr-3 text-green-600" />
                                Messages Récents
                            </h3>
                            <div className="space-y-4 flex-1">
                                {isLoading ? (
                                    [1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center space-x-3 p-3">
                                            <Skeleton className="w-10 h-10 rounded-lg" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-3 w-1/2" />
                                                <Skeleton className="h-2 w-1/3" />
                                            </div>
                                        </div>
                                    ))
                                ) : conversations.length > 0 ? conversations.slice(0, 3).map((conv: any, i: number) => (
                                    <div key={i} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-100">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-black text-xs">
                                            {conv.other_participant?.username?.substring(0, 2).toUpperCase() || '??'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-black text-slate-900 truncate">{conv.other_participant?.username}</div>
                                            <div className="text-[10px] text-slate-500 truncate">{conv.last_message?.content || 'Pas de message'}</div>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300" />
                                    </div>
                                )) : (
                                    <div className="text-center py-6 text-slate-400 font-medium text-xs">
                                        Aucune conversation active.
                                    </div>
                                )}
                            </div>
                            <Link href="/dashboard/entreprise/messages" className="mt-8 text-green-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center bg-green-50 py-3 rounded-xl hover:bg-green-600 hover:text-white transition-all">
                                Toutes les discussions
                            </Link>
                        </div>

                        {/* Credits & Stats */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-white p-5 sm:p-8 rounded-[2rem] border border-blue-50 shadow-sm flex items-center space-x-4 sm:space-x-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-[1rem] sm:rounded-2xl flex items-center justify-center shrink-0">
                                    <Users size={24} />
                                </div>
                                <div>
                                    {isLoading ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-12" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.matches}</div>
                                            <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest leading-tight">Candidatures reçues</div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-5 sm:p-8 rounded-[2rem] border border-orange-50 shadow-sm flex items-center justify-between font-black">
                                <div className="flex items-center space-x-4 sm:space-x-6">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 text-orange-600 rounded-[1rem] sm:rounded-2xl flex items-center justify-center shrink-0">
                                        <Coins size={24} />
                                    </div>
                                    <div>
                                        {isLoading ? (
                                            <div className="space-y-2">
                                                <Skeleton className="h-6 w-12" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.credits}</div>
                                                <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest leading-tight">Crédits de Placement</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Link href="/dashboard/entreprise/credits" className="p-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-600 hover:text-white transition-all">
                                    <Plus size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Talents Elite Spotlight (Essential) */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-blue-50 shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-slate-900 flex items-center">
                            <UserCheck className="mr-3 text-blue-600" /> Talents Elite
                        </h3>
                        <Link href="/dashboard/entreprise/candidats" className="p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>

                    <div className="space-y-6 flex-1">
                        {isLoading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="p-4 sm:p-6 rounded-[1.5rem] bg-slate-50 border border-slate-50 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-12 h-12 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-3 w-1/3" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-1.5 w-full rounded-full" />
                                </div>
                            ))
                        ) : eliteTalents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 opacity-60">
                                <UserCheck size={32} className="text-slate-300" />
                                <p className="text-slate-400 text-xs font-medium max-w-[200px]">Aucun talent 'Elite' détecté pour l'instant.</p>
                            </div>
                        ) : (
                            eliteTalents.map((c) => {
                                const name = c.user_detail?.username || 'Candidat';
                                return (
                                    <Link href={`/dashboard/entreprise/candidats/${c.id}`} key={c.id} className="block group p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-slate-50 border border-slate-50 hover:bg-white hover:border-blue-100 transition-all cursor-pointer">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-slate-900 shadow-sm border border-slate-100 overflow-hidden relative group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-800 transition-all">
                                                    {c.photo ? (
                                                        <Image src={getImageUrl(c.photo) || ''} alt={name} fill className="object-cover" />
                                                    ) : (
                                                        name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <h4 className="font-black text-slate-900 text-sm truncate" title={name}>{name}</h4>
                                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest truncate">{c.title || 'Talent Certifié'}</p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <div className="text-[10px] font-black text-blue-600 mb-1">{c.placability_score}% Match</div>
                                                    <div className="text-[8px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full inline-block">Vérifié</div>
                                                </div>
                                            </div>
                                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${c.placability_score}%` }} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>

                    <p className="mt-8 text-[11px] font-medium text-slate-500 text-center leading-relaxed">
                        Ces candidats ont des profils certifiés et ont leurs diplômes vérifiés à 100% par nos experts.
                    </p>
                    <Link href="/dashboard/entreprise/candidats" className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all text-center block">
                        Explorer tous les talents
                    </Link>
                </div>
            </div>
        </div>
    );
}
