'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building2, Mail, MapPin, Globe, Phone, CheckCircle, ArrowLeft, Briefcase, Users, LayoutDashboard, Search } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

interface CompanyDetail {
    id: number;
    name: string;
    sector: string;
    city: string;
    phone: string;
    logo: string | null;
    is_verified: boolean;
    description: string;
    website: string;
    address: string;
    created_at: string;
}

export default function PublicCompanyProfile() {
    const { id } = useParams();
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axiosInstance.get(`users/company-profiles/${id}/`);
                setCompany(response.data);
            } catch (error) {
                console.error("Failed to fetch company profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    if (isLoading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest">Chargement de l'entreprise...</div>;
    if (!company) return <div className="h-screen flex items-center justify-center font-black text-red-500 uppercase tracking-widest">Entreprise introuvable</div>;

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Nav */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-b border-slate-50">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-black uppercase text-[10px] tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Retour accueil</span>
                </Link>
                <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-900 font-black italic tracking-tighter text-xl">TRAVAGO<span className="text-blue-600">.</span></span>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Left: Identity Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8 sticky top-12 shadow-sm">
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="w-full h-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                    {company.logo ? (
                                        <Image
                                            src={getImageUrl(company.logo)}
                                            alt={company.name}
                                            fill
                                            className="object-contain p-4"
                                        />
                                    ) : (
                                        <Building2 size={48} className="text-slate-200" />
                                    )}
                                </div>
                                {company.is_verified && (
                                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl shadow-lg border-4 border-slate-50">
                                        <CheckCircle size={20} fill="currentColor" className="text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{company.name}</h1>
                                <p className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">{company.sector}</p>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-slate-200/50">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm border border-slate-100 transition-colors">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bureau</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{company.city}, {company.address || 'Adresse non spécifiée'}</p>
                                    </div>
                                </div>

                                {company.website && (
                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm border border-slate-100 transition-colors">
                                            <Globe size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Web</p>
                                            <p className="text-sm font-bold text-blue-600 truncate underline">{company.website}</p>
                                        </div>
                                    </a>
                                )}

                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 shadow-sm border border-slate-100 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{company.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                                <Mail size={18} />
                                Envoyer un message
                            </button>
                        </div>
                    </div>

                    {/* Right: Main Content */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Company Summary */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] italic flex items-center gap-4">
                                <span className="w-12 h-px bg-slate-200"></span>
                                Présentation de l'entreprise
                            </h2>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed italic">
                                {company.description || "Cette entreprise n'a pas encore ajouté de description détaillée."}
                            </p>
                        </div>

                        {/* Company Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-blue-50 rounded-[3rem] border border-blue-100 flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                                    <Briefcase size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Recrutements</p>
                                    <p className="text-2xl font-black text-slate-900 italic">25+ Offres</p>
                                </div>
                            </div>
                            <div className="p-8 bg-emerald-50 rounded-[3rem] border border-emerald-100 flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Équipe</p>
                                    <p className="text-2xl font-black text-slate-900 italic">Verify Partner</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Openings Placeholder */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Nos Opportunités</h2>
                                <Link href="/offres" className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all underline">
                                    Voir tout
                                    <Search size={14} />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">Développeur Fullstack Sénior</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CDI • {company.city} • Salaire Négociable</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-all">
                                        <ArrowLeft size={24} className="rotate-180" />
                                    </div>
                                </div>
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">Product Manager (Fintech)</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Freelance • Télétravail • Début ASAP</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-all">
                                        <ArrowLeft size={24} className="rotate-180" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="bg-slate-900 rounded-[4rem] p-16 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-slate-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">Rejoignez l'aventure {company.name}</h2>
                    <p className="max-w-xl mx-auto text-slate-400 font-bold text-lg leading-relaxed">
                        Prêt à faire passer votre carrière au niveau supérieur ? Postulez à nos offres exclusives sur Travago.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/dashboard/candidat/offres" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                            Voir toutes les offres
                        </Link>
                        <Link href="/register/candidate" className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                            Créer mon profil candidat
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
