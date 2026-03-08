'use client';

import {
    BarChart3,
    TrendingUp,
    Users,
    Eye,
    Target,
    Award,
    ChevronRight,
    ArrowUpRight,
    Briefcase,
    Zap,
} from 'lucide-react';

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function StatisticsPage() {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
    const [topOffer, setTopOffer] = useState<any>(null);
    const [recentApps, setRecentApps] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('users/company/stats/');
            setStats(response.data.stats);
            setWeeklyTrend(response.data.weekly_trend || []);
            setTopOffer(response.data.top_offer || null);
            setRecentApps(response.data.recent_applications || []);
        } catch (error) {
            console.error("Failed to fetch company stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="space-y-10">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-4">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-12 w-20" />
                        </div>
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                        <Skeleton className="h-6 w-1/3 mb-8" />
                        <Skeleton className="h-64 w-full rounded-[2rem]" />
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                        <Skeleton className="h-6 w-1/2 mb-8 mx-auto" />
                        <Skeleton className="w-48 h-48 rounded-full mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    const mainStatsList = [
        {
            label: "Vues des offres",
            value: stats?.total_views ?? 0,
            icon: <Eye size={20} />,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            label: "Candidatures reçues",
            value: stats?.total_applications ?? 0,
            icon: <Users size={20} />,
            color: 'text-indigo-600 bg-indigo-50'
        },
        {
            label: "Offres Actives",
            value: stats?.active_offers ?? 0,
            icon: <Briefcase size={20} />,
            color: 'text-emerald-600 bg-emerald-50'
        },
        {
            label: "Crédits Restants",
            value: stats?.credits ?? 0,
            icon: <Zap size={20} />,
            color: 'text-orange-600 bg-orange-50'
        },
    ];

    const maxTrend = Math.max(...weeklyTrend.map((d) => d.count), 1);
    const avgMatchScore = stats?.avg_match_score ?? 0;

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                    Statistiques & Performance
                    <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-widest border border-green-200">Données Réelles</span>
                </h1>
                <p className="text-slate-500 font-medium mt-1">Analysez l'efficacité de vos recrutements en temps réel.</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStatsList.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Real Weekly Bar Chart */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Candidatures (7 derniers jours)</h3>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">Temps réel</span>
                    </div>
                    <div className="h-64 flex items-end justify-around px-4 pb-4 gap-2">
                        {weeklyTrend.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                <div className="text-[9px] font-black text-blue-600">{d.count > 0 ? d.count : ''}</div>
                                <div
                                    className="w-full bg-blue-600 rounded-t-lg transition-all duration-700 hover:bg-blue-700 min-h-[4px]"
                                    style={{ height: `${Math.max((d.count / maxTrend) * 200, 4)}px` }}
                                />
                                <div className="text-[9px] font-black text-slate-400 uppercase">{d.day}</div>
                            </div>
                        ))}
                    </div>
                    {weeklyTrend.every(d => d.count === 0) && (
                        <p className="text-center text-slate-400 text-xs font-medium mt-4">Aucune candidature cette semaine — publiez des offres pour commencer.</p>
                    )}
                </div>

                {/* Real Average AI Match Score */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Score Moyen des Candidats</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
                        Basé sur {stats?.total_applications ?? 0} candidature(s)
                    </p>

                    <div className="flex justify-center mb-8">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="80" cx="96" cy="96" />
                                <circle
                                    className={avgMatchScore >= 70 ? "text-emerald-500" : avgMatchScore >= 40 ? "text-blue-600" : "text-orange-400"}
                                    strokeWidth="12"
                                    strokeDasharray={502}
                                    strokeDashoffset={502 - (502 * Math.min(avgMatchScore, 100)) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="80"
                                    cx="96"
                                    cy="96"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-slate-900">{avgMatchScore}</span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Score IA Moyen</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Hauts Matches (≥80)</div>
                            <div className="text-xl font-black text-blue-700">{stats?.high_match_apps ?? 0}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Placements IA</div>
                            <div className="text-xl font-black text-slate-900">{stats?.total_placements ?? 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performing Offer */}
            {topOffer ? (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
                    <div className="flex items-center gap-6 text-center md:text-left flex-wrap">
                        <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-[1.5rem] flex items-center justify-center shrink-0">
                            <Award size={32} className="text-yellow-300" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Votre offre la plus populaire</div>
                            <h3 className="text-2xl font-black mb-1">{topOffer.title}</h3>
                            <p className="text-blue-100 font-medium">{topOffer.applications} candidature(s) reçue(s)</p>
                        </div>
                    </div>
                    <Link
                        href={`/dashboard/entreprise/offres/${topOffer.slug}`}
                        className="px-8 py-5 bg-white text-blue-600 rounded-2xl font-black hover:shadow-2xl transition-all flex items-center shrink-0 whitespace-nowrap"
                    >
                        Voir les candidats <ChevronRight size={18} className="ml-2" />
                    </Link>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-[2.5rem] p-10 text-center border border-slate-100">
                    <Briefcase size={40} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="font-black text-slate-900 text-xl mb-2">Pas encore de données</h3>
                    <p className="text-slate-500 font-medium mb-6">Publiez une offre pour voir vos statistiques de performance apparaître ici.</p>
                    <Link href="/dashboard/entreprise/offres/nouvelle" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg">
                        <Briefcase size={16} /> Créer une offre
                    </Link>
                </div>
            )}

            {/* Recent Applications */}
            {recentApps.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Dernières candidatures reçues</h3>
                    <div className="space-y-4">
                        {recentApps.map((app: any) => (
                            <div key={app.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm">
                                        {app.candidate_detail?.user_detail?.first_name || ''} {app.candidate_detail?.user_detail?.last_name || app.candidate_detail?.user_detail?.username || 'Candidat'}
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        {app.job_offer_detail?.title || '—'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${app.matching_score >= 80 ? 'bg-emerald-100 text-emerald-700' : app.matching_score >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {app.matching_score ?? 0}% match
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : app.status === 'SHORTLISTED' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
