'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Landmark, CheckCircle, Globe, Phone } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

interface CompanyProfile {
    id: number;
    user_detail: {
        email: string;
        username: string;
    };
    name: string;
    sector: string;
    city: string;
    is_verified: boolean;
    created_at: string;
}

export default function AdminCompaniesPage() {
    const [companies, setCompanies] = useState<CompanyProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axiosInstance.get('users/admin/company-profiles/');
            const data = response.data;
            setCompanies(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.city?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ? true :
            statusFilter === 'verified' ? company.is_verified : !company.is_verified;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profils Entreprises</h1>
                    <p className="text-slate-500 font-medium">Supervision des recruteurs et partenaires ({filteredCompanies.length}).</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Chercher une entreprise..."
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
                        Total: {filteredCompanies.length}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-blue-50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entreprise</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteur / Ville</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-medium">Chargement...</td></tr>
                            ) : filteredCompanies.length === 0 ? (
                                <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-medium">Aucune entreprise trouvée.</td></tr>
                            ) : (
                                filteredCompanies.map((company) => (
                                    <tr key={company.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                                                    <Landmark size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{company.name || company.user_detail.username}</div>
                                                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                                        <Globe size={10} /> {company.user_detail.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-bold text-slate-700">{company.sector || 'Secteur non défini'}</div>
                                            <div className="text-xs text-slate-400 font-bold uppercase">{company.city || 'Ville non définie'}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {company.is_verified ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                                                    <CheckCircle size={12} /> Partenaire Vérifié
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase">
                                                    Vérification Requise
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link
                                                href={`/dashboard/admin/companies/${company.id}`}
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
