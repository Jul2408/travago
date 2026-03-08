'use client';

import {
    Users,
    Briefcase,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    DollarSign,
    ShieldAlert,
    Globe,
    Server,
    CreditCard,
    MoreHorizontal,
    Search,
    Database,
    Lock,
    FileText,
    Target,
    History,
    CheckCircle,
    Terminal
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface AdminStats {
    stats: {
        total_users: number;
        active_users: number;
        candidates: number;
        companies: number;
        jobs: number;
        applications: number;
        placements: number;
        total_credits: number;
        total_revenue: number;
        pending_volume: number;
        registration_trends: { month: string; count: number }[];
        pending_candidates: number;
        pending_companies: number;
    };
    recent_activity: ActivityItem[];
}

interface ActivityItem {
    id: string;
    text: string;
    subtext: string;
    type: 'info' | 'warning' | 'error' | 'success';
    time: string;
    category: string;
}

export default function AdminDashboardPage() {
    const [mounted, setMounted] = useState(false);
    const [data, setData] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('users/admin/stats/');
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    const stats = data?.stats;

    // Calculate max for chart scaling
    const maxRegistrations = Math.max(...(stats?.registration_trends?.map(t => t.count) || [10]));

    const statCards = [
        {
            label: "Membres de la Communauté",
            value: stats?.total_users || 0,
            change: "Total Base",
            isPositive: true,
            icon: <Users className="text-blue-600" />,
            sub: `${stats?.active_users || 0} comptes actifs`,
            href: "/dashboard/admin/users"
        },
        {
            label: "Talents & Recruteurs",
            value: (stats?.candidates || 0) + (stats?.companies || 0),
            change: "Répartition",
            isPositive: true,
            icon: <Briefcase className="text-emerald-600" />,
            sub: `${stats?.candidates || 0} Cand. / ${stats?.companies || 0} Entr.`,
            href: "/dashboard/admin/candidates"
        },
        {
            label: "Volume d'Affaires",
            value: `${((stats?.total_revenue || 0)).toLocaleString()} FCFA`,
            change: "Revenu Réel",
            isPositive: true,
            icon: <DollarSign className="text-emerald-600" />,
            sub: `${(stats?.pending_volume || 0).toLocaleString()} FCFA en attente`,
            href: "/dashboard/admin/finances"
        },
        {
            label: "Placements IA",
            value: stats?.placements || 0,
            change: "Sync Temps Réel",
            isPositive: true,
            icon: <Activity className="text-purple-600" />,
            sub: "Matching automatisé actif",
            href: "/dashboard/admin/placements"
        },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-slate-50 -mx-8 -mt-8 p-10 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Admin Core V2</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connecté à la Production</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight italic uppercase">Tableau de Bord Supervision</h1>
                    <p className="text-slate-500 font-medium">Pilotage centralisé des flux, de la croissance et de la validation des talents.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchStats}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                    >
                        {isLoading ? <Activity size={16} className="animate-spin" /> : <Activity size={16} />}
                        Sync
                    </button>
                    <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        <Globe size={16} />
                        Voir Site
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Link
                        key={i}
                        href={stat.href}
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:translate-y--1 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                {stat.icon}
                            </div>
                            <div className="text-[10px] font-black px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg uppercase tracking-widest">
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-800 mb-1">{isLoading ? '...' : stat.value}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{stat.label}</div>
                        <div className="text-[10px] font-bold text-slate-400 italic">{stat.sub}</div>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Trends & Activity */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Charts Section */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-blue-50 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Croissance Inscriptions</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">6 derniers mois</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Total
                                </span>
                            </div>
                        </div>

                        <div className="flex items-end justify-between gap-2 h-48 mb-4">
                            {isLoading ? (
                                <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl"></div>
                            ) : (
                                stats?.registration_trends?.map((t, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                        <div className="relative w-full flex justify-center items-end h-full">
                                            <div
                                                className="w-4/5 bg-blue-500 rounded-t-xl transition-all group-hover:bg-blue-600 group-hover:w-full relative shadow-lg shadow-blue-500/10"
                                                style={{ height: `${(t.count / (maxRegistrations || 1)) * 100}%`, minHeight: '4px' }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {t.count}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.month}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-blue-50 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-800 flex items-center">
                                <History className="mr-3 text-blue-600" /> Journal Système
                            </h3>
                            <Link href="/dashboard/admin/security" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Voir tout</Link>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl"></div>
                                ))
                            ) : !data?.recent_activity?.length ? (
                                <p className="text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest">Aucune activité</p>
                            ) : (
                                data.recent_activity.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 group">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                            item.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                                item.type === 'error' ? 'bg-red-100 text-red-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            <ShieldAlert size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {formatDistanceToNow(new Date(item.time), { addSuffix: true, locale: fr })}
                                                </span>
                                                <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 rounded uppercase text-slate-500">{item.category}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase">{item.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Pending Verifications Widget */}
                    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-800 flex items-center">
                                <ShieldAlert className="mr-3 text-amber-500" /> À Valider
                            </h3>
                            <Link href="/dashboard/admin/candidates" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Voir tout</Link>
                        </div>
                        <div className="space-y-4">
                            <Link href="/dashboard/admin/candidates?status=PENDING" className="flex items-center justify-between p-4 bg-amber-50/50 hover:bg-amber-50 rounded-2xl transition-all border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm font-black">
                                        {stats?.pending_candidates || 0}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Candidats en attente</span>
                                </div>
                                <ArrowUpRight size={14} className="text-amber-500" />
                            </Link>

                            <Link href="/dashboard/admin/companies" className="flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-50 rounded-2xl transition-all border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm font-black">
                                        {stats?.pending_companies || 0}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Entreprises à certifier</span>
                                </div>
                                <ArrowUpRight size={14} className="text-blue-500" />
                            </Link>
                        </div>
                    </div>

                    {/* Heatmap Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-slate-800 shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mt-16 -mr-16"></div>
                        <h3 className="text-lg font-black mb-6 italic flex items-center gap-2">
                            Santé Système
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        </h3>
                        <div className="space-y-5">
                            {[
                                { label: "Disponibilité API", val: 99.9, color: "bg-blue-500" },
                                { label: "Indexation IA", val: 87, color: "bg-emerald-500" },
                                { label: "Charge Storage", val: 24, color: "bg-purple-500" },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-1.5">
                                        <span>{s.label}</span>
                                        <span className="text-white">{s.val}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
                            <ShieldAlert className="mr-3 text-blue-600" /> Actions Immédiates
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <Link href="/dashboard/admin/candidates" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-emerald-500" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Vérifier les Profils en Attente</span>
                                </div>
                                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                            </Link>
                            <Link href="/dashboard/admin/finances" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-2xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="text-blue-500" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Voir les Derniers Paiements</span>
                                </div>
                                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                            </Link>
                        </div>
                    </div>

                    {/* Support Card */}
                    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
                        <h3 className="text-lg font-black mb-4 uppercase italic">Besoin d'aide ?</h3>
                        <p className="text-sm font-medium text-blue-100 mb-6 uppercase tracking-tight">Consultez le guide de gestion ou contactez le support technique pour toute intervention complexe.</p>
                        <button
                            onClick={() => toast.info('Ouverture de la documentation technique...')}
                            className="w-full py-4 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                        >
                            Documentation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
