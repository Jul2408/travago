'use client';

import {
    Home,
    Settings,
    BarChart3,
    TrendingUp,
    Users,
    Eye,
    Target,
    Award,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatisticsPage() {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [activeRange, setActiveRange] = useState('30j');

    useEffect(() => {
        setMounted(true);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('users/company/stats/');
            setStats(response.data.stats);
        } catch (error) {
            console.error("Failed to fetch company stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToInsights = () => {
        const insightsElement = document.getElementById('insights-section');
        if (insightsElement) {
            insightsElement.scrollIntoView({ behavior: 'smooth' });
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
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-12 rounded-lg" />
                            </div>
                            <Skeleton className="h-12 w-20" />
                        </div>
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-1/3" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-10 rounded-xl" />
                                <Skeleton className="h-8 w-10 rounded-xl" />
                                <Skeleton className="h-8 w-10 rounded-xl" />
                            </div>
                        </div>
                        <Skeleton className="h-64 w-full rounded-[2rem]" />
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center space-y-6">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="w-48 h-48 rounded-full" />
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Skeleton className="h-20 rounded-2xl" />
                            <Skeleton className="h-20 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const mainStatsList = [
        { label: "Vues des offres", value: stats?.total_views || 0, trend: "+12.5%", isUp: true },
        { label: "Candidatures IA", value: stats?.total_applications || 0, trend: "+5.2%", isUp: true },
        { label: "Offres Actives", value: stats?.active_offers || 0, trend: "Stable", isUp: true },
        { label: "Crédits Restants", value: stats?.credits || 0, trend: "Budget", isUp: true },
    ];

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                    Statistiques & Performance
                    <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-widest border border-green-200">Données Réelles</span>
                </h1>
                <p className="text-slate-500 font-medium">Analysez l'efficacité de vos recrutements et l'impact de l'IA.</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStatsList.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                            <div className={`flex items-center text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.isUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholders */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Candidatures par score IA</h3>
                        <div className="flex space-x-2">
                            {['7j', '30j', '3m'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setActiveRange(t)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${t === activeRange ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-64 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-end justify-around px-8 pb-4 relative group">
                        {[40, 70, 45, 90, 65, 80, 55, 30, 85, 50].map((h, i) => (
                            <div key={i} className="w-4 bg-blue-600 rounded-t-lg transition-all duration-700 relative group-hover:bg-blue-700" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </div>
                        ))}
                        <div className="absolute inset-x-0 bottom-0 py-2 border-t border-slate-100 flex justify-around text-[8px] font-black text-slate-300 uppercase">
                            <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Qualité des Candidats (Moyenne)</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Basé sur 156 profils</p>

                    <div className="flex justify-center mb-10">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="80" cx="96" cy="96" />
                                <circle className="text-blue-600" strokeWidth="12" strokeDasharray={502} strokeDashoffset={502 - (502 * 88) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="80" cx="96" cy="96" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-slate-900">88.2</span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Score IA Global</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Top Qualité</div>
                            <div className="text-xl font-black text-slate-900">98%</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Fiabilité</div>
                            <div className="text-xl font-black text-green-600">Elite</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-1">
                        <div className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                            Conseil de l'IA Travago
                        </div>
                        <h3 className="text-2xl font-black mb-4">Optimisez vos titres d'offres</h3>
                        <p className="text-blue-100 font-medium text-lg leading-relaxed">
                            Nous avons remarqué que les offres portant la mention "Senior" ou "Lead" reçoivent 40% de matches IA de meilleure qualité ce mois-ci à Douala.
                        </p>
                    </div>
                    <button
                        onClick={scrollToInsights}
                        className="px-8 py-5 bg-white text-blue-600 rounded-2xl font-black hover:shadow-2xl transition-all flex items-center shrink-0"
                    >
                        Voir plus d'analyses <ChevronRight size={18} className="ml-2" />
                    </button>
                </div>
                <div id="insights-section"></div>
            </div>
        </div>
    );
}
