'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, User, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CandidateProfile {
    id: number;
    user_detail: {
        email: string;
        username: string;
        first_name: string;
        last_name: string;
    };
    title: string;
    location: string;
    is_verified: boolean;
    placability_score: number;
    reliability_score: number;
    created_at: string;
}

export default function AdminCandidatesPage() {
    const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await axiosInstance.get('users/admin/candidate-profiles/');
            const data = response.data;
            setCandidates(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error("Failed to fetch candidates", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.user_detail.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.user_detail.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ? true :
            statusFilter === 'verified' ? candidate.is_verified : !candidate.is_verified;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profils Candidats</h1>
                    <p className="text-slate-500 font-medium">Validation et supervision des talents de la plateforme ({filteredCandidates.length}).</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Chercher un candidat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                </div>

                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-blue-600'}`}
                    >
                        Tous
                    </button>
                    <button
                        onClick={() => setStatusFilter('verified')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === 'verified' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-emerald-600'}`}
                    >
                        Vérifiés
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === 'pending' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-amber-600'}`}
                    >
                        En attente
                    </button>
                </div>

                <div className="hidden lg:block">
                    <div className="px-4 py-3 bg-blue-50 text-blue-800 rounded-xl font-bold text-sm">
                        Total: {filteredCandidates.length}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-blue-50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidat</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Titre / Job</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score Matching</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-medium">Chargement...</td></tr>
                            ) : filteredCandidates.length === 0 ? (
                                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-medium">Aucun candidat trouvé.</td></tr>
                            ) : (
                                filteredCandidates.map((candidate) => (
                                    <tr key={candidate.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black">
                                                    {candidate.user_detail.username.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{candidate.user_detail.username}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{candidate.user_detail.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-600">
                                            {candidate.title || 'Non renseigné'}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${candidate.placability_score > 70 ? 'bg-emerald-500' : candidate.placability_score > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${candidate.placability_score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-black text-slate-700">{candidate.placability_score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {candidate.is_verified ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                                                    <CheckCircle size={12} /> Vérifié
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase">
                                                    <XCircle size={12} /> En attente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link
                                                href={`/dashboard/admin/candidates/${candidate.id}`}
                                                className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                Voir Profil
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
