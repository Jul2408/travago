'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Landmark, Mail, MapPin, Briefcase, Calendar, CheckCircle, XCircle, ArrowLeft, Shield, Globe, Users, TrendingUp } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface CompanyDetail {
    id: number;
    user_detail: {
        email: string;
        username: string;
        is_active: boolean;
    };
    name: string;
    sector: string;
    city: string;
    description: string;
    is_verified: boolean;
    created_at: string;
    website: string;
    job_offers: Array<{
        id: number;
        title: string;
        contract_type: string;
        location: string;
        applications_count: number;
        created_at: string;
        is_active: boolean;
    }>;
}

export default function CompanyDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCompany();
    }, [id]);

    const fetchCompany = async () => {
        try {
            const response = await axiosInstance.get(`users/admin/company-profiles/${id}/`);
            setCompany(response.data);
        } catch (error) {
            console.error("Failed to fetch company", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVerify = async () => {
        if (!company) return;
        try {
            const response = await axiosInstance.patch(`users/admin/company-profiles/${id}/`, {
                is_verified: !company.is_verified
            });
            setCompany(response.data);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const toggleUserStatus = async () => {
        if (!company) return;
        try {
            await axiosInstance.post(`users/admin/users/${company.id}/toggle_status/`);
            fetchCompany(); // Refresh data
        } catch (error) {
            console.error("Failed to toggle user status", error);
        }
    };

    if (isLoading) return <div className="p-10 text-center font-black animate-pulse text-slate-400">ANALYSE DU PARTENAIRE...</div>;
    if (!company) return <div className="p-10 text-center font-black text-red-500">ENTREPRISE NON TROUVÉE.</div>;

    return (
        <div className="space-y-8 pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Retour au catalogue
            </button>

            <div className="bg-white rounded-[3rem] border border-blue-50 shadow-xl overflow-hidden">
                <div className="bg-slate-50 h-56 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="absolute -bottom-16 left-12 w-32 h-32 rounded-[2.5rem] bg-white border-4 border-white shadow-2xl flex items-center justify-center">
                        <Landmark size={48} className="text-slate-300" />
                    </div>
                    <div className="absolute bottom-6 right-12 flex gap-3">
                        <button
                            onClick={toggleVerify}
                            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${company.is_verified ? 'bg-red-50 text-red-600 shadow-red-200' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}
                        >
                            {company.is_verified ? 'Révoquer Certificat' : 'Accréditer Entreprise'}
                        </button>
                    </div>
                </div>

                <div className="mt-20 px-12 pb-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-4 flex items-center gap-4">
                                    {company.name || company.user_detail.username}
                                    {company.is_verified && <CheckCircle className="text-emerald-500" size={32} />}
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    <span className="px-5 py-2 bg-blue-50 text-blue-700 rounded-xl font-black text-[10px] uppercase tracking-widest">
                                        {company.sector || 'Secteur Indéfini'}
                                    </span>
                                    <span className="px-5 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={12} /> {company.city || 'Siège Social'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-800 italic">Vision & Missions</h3>
                                <div className="text-lg text-slate-500 font-medium leading-relaxed bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                    {company.description || "Cette entreprise n'a pas encore complété son manifeste professionnel. Les informations de base sont extraites du compte utilisateur principal."}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center">
                                    <Briefcase className="mr-3 text-blue-600" /> Offres d'Emploi & Recrutement
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {!company.job_offers?.length ? (
                                        <div className="col-span-2 p-10 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-400 font-black uppercase tracking-widest text-xs italic">
                                            Aucune offre publiée par ce partenaire
                                        </div>
                                    ) : (
                                        company.job_offers.map(offer => (
                                            <div key={offer.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                                                <div className="absolute top-0 right-0 p-2">
                                                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${offer.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                        {offer.is_active ? 'Active' : 'Close'}
                                                    </span>
                                                </div>
                                                <div className="font-bold text-slate-800 mb-1 truncate pr-10">{offer.title}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex gap-3">
                                                    <span>{offer.contract_type}</span>
                                                    <span>•</span>
                                                    <span>{offer.location}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-2">
                                                        <Users size={14} className="text-blue-500" />
                                                        <span className="text-xs font-black text-slate-700">{offer.applications_count} Candidats</span>
                                                    </div>
                                                    <div className="text-[9px] font-bold text-slate-400">{new Date(offer.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 ring-1 ring-slate-100 p-10 rounded-[2.5rem] bg-indigo-50/20">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Digital Presence</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-700 font-bold overflow-hidden">
                                            <Mail size={16} className="text-blue-500 shrink-0" /> <span className="truncate">{company.user_detail.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-700 font-bold">
                                            <Globe size={16} className="text-blue-500 shrink-0" /> {company.website || 'Official Site'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">System Registry</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-700 font-bold">
                                            <Calendar size={16} className="text-blue-500 shrink-0" /> Depuis: {new Date(company.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-3 text-emerald-600 font-bold">
                                            <Shield size={16} className="shrink-0" /> Accréditation: {company.is_verified ? 'OFFICIEL' : 'STANDBY'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={100} />
                                </div>
                                <h3 className="text-xl font-black mb-10 flex items-center">
                                    Performance Dashboard
                                </h3>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                                <Briefcase size={20} className="text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black italic">{company.job_offers?.length || 0}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase">Offres Actives</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                                <Users size={20} className="text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black italic">450+</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase">Candidats Matchés</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-white/10">
                                        <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                                            Export Rapport Data
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem]">
                                <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest text-center">Security Zone</h3>
                                <div className="space-y-2">
                                    <button className="w-full py-3 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase transition-all">
                                        Reset Password Link
                                    </button>
                                    <button
                                        onClick={toggleUserStatus}
                                        className={`w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all ${company.user_detail.is_active ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                    >
                                        {company.user_detail.is_active ? 'Ban Enterprise Account' : 'Reactive Enterprise Account'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
