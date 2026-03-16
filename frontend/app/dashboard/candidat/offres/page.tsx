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
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

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
    ai_match_score?: number;
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
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Opportunités Elite</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Découvrez les postes qui matchent le mieux avec votre profil IA.</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-[2.5rem] border border-blue-50 dark:border-slate-800 shadow-sm transition-colors">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un poste, une entreprise..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans"
                        />
                    </div>
                    <button className="px-8 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center shrink-0">
                        <Filter size={16} className="mr-2" /> Filtres
                    </button>
                </div>
            </div>

            {/* Offers List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 border border-blue-50 dark:border-slate-800 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    <div className="flex items-start space-x-6 lg:w-1/3">
                                        <Skeleton className="w-20 h-20 rounded-[2rem] shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                    <div className="lg:w-1/4 flex justify-end">
                                        <Skeleton className="h-14 w-40 rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredOffers.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-[3rem] border-2 border-dashed border-blue-100 dark:border-slate-800 transition-colors">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-blue-200 dark:text-blue-800 mx-auto mb-6">
                            <Briefcase size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Aucune offre trouvée</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                            Revenez plus tard ou ajustez vos filtres de recherche.
                        </p>
                    </div>
                ) : (
                    filteredOffers.map((offer) => (
                        <div key={offer.id} className="group bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 border border-blue-50 dark:border-slate-800 shadow-sm hover:shadow-2xl dark:hover:shadow-blue-900/10 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all relative overflow-hidden">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                <div className="flex items-start space-x-6 lg:w-1/3">
                                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-400 dark:text-blue-500 border border-blue-100 dark:border-blue-900/30 shrink-0 relative overflow-hidden shadow-sm">
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
                                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                                                {offer.company_name}
                                            </span>
                                            {offer.is_ia_boosted && (
                                                <Zap size={14} className="text-orange-400 fill-orange-400" />
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                            {offer.title}
                                        </h3>
                                        <div className="flex items-center space-x-4 mt-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            <span className="flex items-center"><MapPin size={12} className="mr-1" /> {offer.location}</span>
                                            <span className="flex items-center"><Clock size={12} className="mr-1" /> {offer.contract_type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {offer.description}
                                    </p>
                                    {offer.ai_match_score !== undefined && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${offer.ai_match_score}%` }} />
                                            </div>
                                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                                {offer.ai_match_score}% Match IA
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end lg:w-1/4">
                                    <Link
                                        href={`/dashboard/candidat/offres/${offer.slug}`}
                                        className="bg-slate-900 dark:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-slate-100 dark:shadow-none flex items-center"
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
