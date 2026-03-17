'use client';

import {
    Briefcase,
    MapPin,
    Clock,
    CheckCircle2,
    Eye,
    Search,
    Filter,
    ChevronRight,
    ArrowUpRight,
    MessageSquare,
    Loader2,
    ShieldCheck,
    XCircle,
    Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { EmptyState } from '@/components/empty-state';
import { PageSkeleton } from '@/components/page-skeleton';

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

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'PENDING': return { label: 'Nouvelle', color: 'blue', icon: <Clock size={14} /> };
            case 'AI_REVIEW': return { label: 'Analyse IA', color: 'purple', icon: <Info size={14} /> };
            case 'SHORTLISTED': return { label: 'En Revue', color: 'green', icon: <CheckCircle2 size={14} /> };
            case 'INTERVIEW': return { label: 'Entretien', color: 'purple', icon: <MessageSquare size={14} /> };
            case 'REJECTED': return { label: 'Refusé', color: 'red', icon: <XCircle size={14} /> };
            case 'PLACED': return { label: 'Embauché', color: 'indigo', icon: <ShieldCheck size={14} /> };
            default: return { label: status, color: 'slate', icon: <Info size={14} /> };
        }
    };

    const filteredApps = candidatures.filter(app =>
        app.job_offer_detail?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_offer_detail?.company_detail?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!mounted || isLoading) {
        return (
            <div className="pt-8">
                <PageSkeleton type="list" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Mes Candidatures</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Suivez l'état de vos demandes d'emploi en temps réel.</p>
                </div>
                <div className="flex space-x-2 font-sans">
                    <div className="px-6 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-4 shadow-sm transition-colors">
                        <div className="text-center">
                            <div className="text-xl font-black text-slate-900 dark:text-white leading-none">{candidatures.length}</div>
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Totales</div>
                        </div>
                        <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                        <div className="text-center">
                            <div className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none">
                                {candidatures.filter(c => c.status !== 'REJECTED' && c.status !== 'PLACED').length}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Actives</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une entreprise ou un poste..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all font-sans"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm flex items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <Filter size={18} className="mr-2" /> Statut
                    </button>
                    <button className="px-6 py-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm flex items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        Récentes
                    </button>
                </div>
            </div>

            {/* Candidatures List */}
            <div className="space-y-4">
                {
                    filteredApps.length === 0 ? (
                        <EmptyState
                            title="Aucune candidature"
                            description={searchTerm ? "Aucun résultat pour cette recherche." : "Commencez par explorer les offres pour postuler aux emplois qui vous correspondent."}
                            illustration="job"
                            actionLabel={!searchTerm ? "Explorer les offres" : undefined}
                            actionHref={!searchTerm ? "/dashboard/candidat/offres" : undefined}
                        />
                    ) : (
                        filteredApps.map((app) => {
                            const statusInfo = getStatusInfo(app.status);
                            return (
                                <div key={app.id} className="group bg-white dark:bg-slate-950 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/10 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                        {/* Logo & Info */}
                                        <div className="flex items-start space-x-5 lg:w-1/3">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-all overflow-hidden flex-shrink-0 font-black text-xl italic">
                                                {app.job_offer_detail?.company_detail?.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tighter decoration-blue-500 underline-offset-4 decoration-2">{app.job_offer_detail?.title}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 font-bold font-sans">{app.job_offer_detail?.company_detail?.name}</p>
                                                <div className="flex items-center space-x-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 whitespace-nowrap font-sans">
                                                    <span className="flex items-center"><MapPin size={12} className="mr-1 text-blue-400 dark:text-blue-500" /> {app.job_offer_detail?.location}</span>
                                                    <span className="flex items-center"><Clock size={12} className="mr-1 text-blue-400 dark:text-blue-500" /> {new Date(app.applied_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Match */}
                                        <div className="flex items-center justify-between lg:justify-around flex-1 gap-6 border-y lg:border-y-0 lg:border-x border-slate-50 dark:border-slate-800 py-6 lg:py-0">
                                            <div className="text-center flex flex-col items-center">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 whitespace-nowrap">Match IA</div>
                                                <div className="px-4 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl text-sm font-black ring-4 ring-blue-50 dark:ring-blue-900/20">
                                                    {app.matching_score}%
                                                </div>
                                            </div>
                                            <div className="text-center flex flex-col items-center">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Statut</div>
                                                <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-${statusInfo.color}-50 dark:bg-${statusInfo.color}-900/20 text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400 border border-${statusInfo.color}-100 dark:border-${statusInfo.color}-900/30`}>
                                                    {statusInfo.icon}
                                                    <span>{statusInfo.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end space-x-3 lg:w-1/4">
                                            <Link
                                                href="/dashboard/candidat/messages"
                                                className="p-4 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-[1.5rem] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 shadow-sm"
                                            >
                                                <MessageSquare size={20} />
                                            </Link>
                                            <Link
                                                href={`/dashboard/candidat/offres/${app.job_offer_detail?.slug}`}
                                                className="bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg shadow-slate-100 dark:shadow-none font-sans"
                                            >
                                                Consulter <ChevronRight size={18} className="ml-2" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )
                }
            </div >
        </div >
    );
}
