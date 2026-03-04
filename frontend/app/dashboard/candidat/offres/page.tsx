'use client';

import { useState, useEffect } from 'react';
import {
    Briefcase,
    MapPin,
    Clock,
    Search,
    Filter,
    ChevronRight,
    Zap,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

interface JobOffer {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    contract_type: string;
    salary_range: string | null;
    company_name: string;
    company_logo: string | null;
    created_at: string;
    is_ia_boosted?: boolean;
}

export default function CandidateOffresPage() {
    const [offers, setOffers] = useState<JobOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await axiosInstance.get('jobs/offers/');
            // Handle pagination
            const results = response.data.results || response.data;
            setOffers(results);
        } catch (error) {
            console.error('Failed to fetch offers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOffers = offers.filter(o =>
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!mounted) return null;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Opportunités Elite</h1>
                    <p className="text-slate-500 font-medium">Découvrez les postes qui matchent le mieux avec votre profil IA.</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un poste, une entreprise..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <button className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center shrink-0">
                        <Filter size={16} className="mr-2" /> Filtres
                    </button>
                </div>
            </div>

            {/* Offers List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    </div>
                ) : filteredOffers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-blue-100">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-200 mx-auto mb-6">
                            <Briefcase size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Aucune offre trouvée</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">
                            Revenez plus tard ou ajustez vos filtres de recherche.
                        </p>
                    </div>
                ) : (
                    filteredOffers.map((offer) => (
                        <div key={offer.id} className="group bg-white rounded-[2.5rem] p-8 border border-blue-50 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                <div className="flex items-start space-x-6 lg:w-1/3">
                                    <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-400 border border-blue-100 shrink-0 relative overflow-hidden shadow-sm">
                                        {offer.company_logo ? (
                                            <Image
                                                src={getImageUrl(offer.company_logo)}
                                                alt={offer.company_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Briefcase size={32} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                                                {offer.company_name}
                                            </span>
                                            {offer.is_ia_boosted && (
                                                <Zap size={14} className="text-orange-400 fill-orange-400" />
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {offer.title}
                                        </h3>
                                        <div className="flex items-center space-x-4 mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center"><MapPin size={12} className="mr-1" /> {offer.location}</span>
                                            <span className="flex items-center"><Clock size={12} className="mr-1" /> {offer.contract_type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                        {offer.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-end lg:w-1/4">
                                    <Link
                                        href={`/dashboard/candidat/offres/${offer.slug}`}
                                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center"
                                    >
                                        Voir Détails <ChevronRight size={16} className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
