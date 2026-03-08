'use client';

import {
    Briefcase,
    MapPin,
    Clock,
    CheckCircle2,
    Search,
    Filter,
    ChevronRight,
    MessageSquare,
    ShieldCheck,
    XCircle,
    Info,
    Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

interface JobApplication {
    id: number;
    job_offer_detail: {
        id: number;
        title: string;
        slug: string;
        location: string;
        salary_range: string;
        company_detail: {
            name: string;
        }
    };
    status: string;
    matching_score: number;
    applied_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bgClass: string; textClass: string; borderClass: string; icon: React.ReactNode }> = {
    PENDING: {
        label: 'En attente', color: 'blue',
        bgClass: 'bg-blue-50', textClass: 'text-blue-700', borderClass: 'border-blue-100',
        icon: <Clock size={14} />
    },
    AI_REVIEW: {
        label: 'Analyse IA', color: 'purple',
        bgClass: 'bg-purple-50', textClass: 'text-purple-700', borderClass: 'border-purple-100',
        icon: <Zap size={14} />
    },
    SHORTLISTED: {
        label: 'Retenu ✓', color: 'green',
        bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-100',
        icon: <CheckCircle2 size={14} />
    },
    REJECTED: {
        label: 'Non retenu', color: 'red',
        bgClass: 'bg-red-50', textClass: 'text-red-700', borderClass: 'border-red-100',
        icon: <XCircle size={14} />
    },
    PLACED: {
        label: 'Placé 🎉', color: 'indigo',
        bgClass: 'bg-indigo-50', textClass: 'text-indigo-700', borderClass: 'border-indigo-100',
        icon: <ShieldCheck size={14} />
    },
};

export default function CandidaturesPage() {
    const [candidatures, setCandidatures] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchCandidatures();
    }, []);

    const fetchCandidatures = async () => {
        try {
            const response = await axiosInstance.get('jobs/my-applications/');
            setCandidatures(response.data.results || response.data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredApps = candidatures.filter(app =>
        app.job_offer_detail?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_offer_detail?.company_detail?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!mounted) return null;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes Candidatures</h1>
                    <p className="text-slate-500 font-medium">Suivez l'état de vos demandes d'emploi en temps réel.</p>
                </div>
                {!isLoading && (
                    <div className="flex space-x-2">
                        <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center space-x-4 shadow-sm">
                            <div className="text-center">
                                <div className="text-xl font-black text-slate-900 leading-none">{candidatures.length}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Totales</div>
                            </div>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="text-center">
                                <div className="text-xl font-black text-blue-600 leading-none">
                                    {candidatures.filter(c => c.status !== 'REJECTED').length}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Actives</div>
                            </div>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="text-center">
                                <div className="text-xl font-black text-emerald-600 leading-none">
                                    {candidatures.filter(c => c.status === 'SHORTLISTED' || c.status === 'PLACED').length}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Retenues</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une entreprise ou un poste..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm flex items-center hover:bg-slate-100 transition-all">
                    <Filter size={18} className="mr-2" /> Filtrer
                </button>
            </div>

            {/* Candidatures List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    <div className="flex items-start space-x-5 lg:w-1/3">
                                        <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-3 w-2/3" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex gap-8 justify-around">
                                        <Skeleton className="h-10 w-20 rounded-xl" />
                                        <Skeleton className="h-10 w-24 rounded-xl" />
                                    </div>
                                    <div className="lg:w-1/4 flex justify-end gap-3">
                                        <Skeleton className="h-12 w-12 rounded-2xl" />
                                        <Skeleton className="h-12 w-32 rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredApps.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                            <Briefcase size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Aucune candidature</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">
                            {searchTerm ? 'Aucun résultat pour cette recherche.' : 'Explorez les offres pour postuler aux emplois qui vous correspondent.'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href="/dashboard/candidat/offres"
                                className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-[2rem] font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 inline-flex items-center gap-2"
                            >
                                Explorer les offres <ChevronRight size={16} />
                            </Link>
                        )}
                    </div>
                ) : (
                    filteredApps.map((app) => {
                        const statusInfo = STATUS_MAP[app.status] || {
                            label: app.status, color: 'slate',
                            bgClass: 'bg-slate-50', textClass: 'text-slate-700', borderClass: 'border-slate-100',
                            icon: <Info size={14} />
                        };
                        const score = app.matching_score || 0;

                        return (
                            <div key={app.id} className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    {/* Company Logo & Info */}
                                    <div className="flex items-start space-x-5 lg:w-1/3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all overflow-hidden flex-shrink-0 font-black text-lg">
                                            {app.job_offer_detail?.company_detail?.name?.substring(0, 2).toUpperCase() || '??'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tighter leading-tight">
                                                {app.job_offer_detail?.title || 'Poste inconnu'}
                                            </h3>
                                            <p className="text-slate-500 font-bold text-sm">{app.job_offer_detail?.company_detail?.name}</p>
                                            <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                                                <span className="flex items-center"><MapPin size={11} className="mr-1 text-blue-400" /> {app.job_offer_detail?.location}</span>
                                                <span className="flex items-center"><Clock size={11} className="mr-1 text-blue-400" /> {new Date(app.applied_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Match Score + Status */}
                                    <div className="flex items-center justify-between lg:justify-around flex-1 gap-6 border-y lg:border-y-0 lg:border-x border-slate-50 py-6 lg:py-0 lg:px-6">
                                        {/* Match IA */}
                                        <div className="text-center flex flex-col items-center gap-2">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match IA</div>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className={`px-4 py-2 rounded-xl text-sm font-black ring-4 ${score >= 70 ? 'bg-emerald-600 text-white ring-emerald-50' : score >= 40 ? 'bg-blue-600 text-white ring-blue-50' : 'bg-slate-200 text-slate-700 ring-slate-50'}`}>
                                                    {score}%
                                                </div>
                                                <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-blue-500' : 'bg-slate-400'}`} style={{ width: `${score}%` }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="text-center flex flex-col items-center gap-2">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</div>
                                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusInfo.bgClass} ${statusInfo.textClass} ${statusInfo.borderClass}`}>
                                                {statusInfo.icon}
                                                <span>{statusInfo.label}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end space-x-3 lg:w-auto">
                                        <Link
                                            href="/dashboard/candidat/messages"
                                            className="p-4 bg-slate-50 text-slate-600 rounded-[1.5rem] hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                            title="Envoyer un message"
                                        >
                                            <MessageSquare size={20} />
                                        </Link>
                                        <Link
                                            href={`/dashboard/candidat/offres/${app.job_offer_detail?.slug}`}
                                            className="bg-slate-900 text-white px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center hover:bg-blue-600 transition-all shadow-lg shadow-slate-100"
                                        >
                                            Consulter <ChevronRight size={16} className="ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
