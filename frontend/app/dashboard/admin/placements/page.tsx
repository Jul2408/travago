'use client';

import { useState, useEffect } from 'react';
import { Search, Briefcase, Target, Building2, MapPin, Calendar, MoreHorizontal, Activity } from 'lucide-react';

import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JobOffer {
    id: number;
    slug: string;
    title: string;
    company_detail?: { name: string };
    location: string;
    contract_type: string;
    is_active: boolean;
    created_at: string;
    applications_count: number;
}

interface PlacementRequest {
    id: number;
    title: string;
    company_name?: string;
    status: string;
    progress: number;
    created_at: string;
}

export default function AdminPlacementsPage() {
    const [jobs, setJobs] = useState<JobOffer[]>([]);
    const [placements, setPlacements] = useState<PlacementRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'jobs' | 'placements'>('jobs');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [jobsRes, placementsRes] = await Promise.all([
                axiosInstance.get('users/admin/jobs/'),
                axiosInstance.get('users/admin/placements/')
            ]);

            setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data.results || []));
            setPlacements(Array.isArray(placementsRes.data) ? placementsRes.data : (placementsRes.data.results || []));
        } catch (error) {
            console.error("Failed to fetch placement data", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white -mx-8 -mt-8 p-10 border-b border-slate-100">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">Marché & Opérations</h1>
                    <p className="text-slate-500 font-medium">Supervision des offres d'emploi et des demandes de placement IA.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Offres Actives</div>
                        <div className="text-xl font-black text-blue-600">{jobs.filter(j => j.is_active).length}</div>
                    </div>
                    <div className="bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">IA Matchings</div>
                        <div className="text-xl font-black text-purple-600">{placements.length}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-fit shadow-inner">
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-400 hover:text-blue-600'}`}
                >
                    Offres d'Emploi ({jobs.length})
                </button>
                <button
                    onClick={() => setActiveTab('placements')}
                    className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'placements' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-400 hover:text-blue-600'}`}
                >
                    Placements Assistés ({placements.length})
                </button>
            </div>

            {activeTab === 'jobs' ? (
                <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Offre / Poste</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recruteur</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Engagement</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-20 text-center"><Activity className="animate-spin mx-auto text-blue-600" /></td></tr>
                                ) : jobs.length === 0 ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-slate-300 font-black uppercase italic text-xl">Aucune donnée</td></tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-800 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{job.title}</div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                                    <MapPin size={10} /> {job.location} • {job.contract_type}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3 font-bold text-slate-600 uppercase text-xs italic">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                        <Building2 size={16} />
                                                    </div>
                                                    {job.company_detail?.name || 'Inconnue'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                                    <span className="text-xs font-black text-blue-600">{job.applications_count}</span>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Apps</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {job.is_active ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest">En Ligne</span>
                                                    </div>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[9px] font-black uppercase tracking-widest">Archivé</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Link href={`/jobs/${job.slug}`} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Details</Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <div className="col-span-full text-center py-20 text-slate-400 font-medium">Chargement des placements...</div>
                    ) : placements.length === 0 ? (
                        <div className="col-span-full text-center py-40 border-4 border-dashed border-slate-50 rounded-[3rem]">
                            <Target size={60} className="mx-auto text-slate-100 mb-6" />
                            <div className="text-slate-300 font-black uppercase italic text-2xl">Aucun placement IA actif</div>
                        </div>
                    ) : (
                        placements.map((p) => (
                            <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Target size={120} className="text-blue-600" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="px-4 py-1.5 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-purple-500/20">
                                            IA MATCHING ENGINE
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 flex items-center gap-1.5 uppercase">
                                            <Calendar size={14} /> {format(new Date(p.created_at), 'dd MMM yyyy', { locale: fr })}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-3 truncate group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter">{p.title}</h3>
                                    <div className="flex items-center gap-3 mb-10 text-xs font-black text-slate-400 uppercase tracking-widest italic">
                                        <Building2 size={16} className="text-slate-300" /> {p.company_name || 'Partenaire Stratégique'}
                                    </div>

                                    <div className="space-y-3 mb-10">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">Score de Précision IA</span>
                                            <span className="text-blue-600">{p.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'SOURCING' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'SOURCING' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
                                            {p.status}
                                        </div>
                                        <Link href={`/dashboard/admin/placements/${p.id}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:tracking-[0.2em] transition-all italic border-b-2 border-transparent hover:border-blue-600 pb-1">Analyser Matches</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
