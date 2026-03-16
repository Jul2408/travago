'use client';

import {
    Briefcase,
    Plus,
    Search,
    Filter,
    ChevronRight,
    Clock,
    CheckCircle2,
    Eye,
    Users,
    Zap,
    MapPin,
    AlertCircle,
    MoreVertical,
    Loader2,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface JobOffer {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    contract_type: string;
    salary_range: string | null;
    is_active: boolean;
    created_at: string;
    is_ia_boosted?: boolean;
    views_count?: number;
    applications_count?: number;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<JobOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            setError(null);
            const response = await axiosInstance.get('jobs/offers/');
            // Handle pagination
            const results = response.data.results || response.data;
            setOffers(results);
        } catch (err: any) {
            console.error('Failed to fetch offers', err);
            setError("Impossible de charger les offres. Vérifiez votre connexion ou vos permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOfferStatus = async (offerId: number, currentStatus: boolean) => {
        try {
            await axiosInstance.patch(`jobs/offers/${offerId}/`, { is_active: !currentStatus });
            setOffers(prev => prev.map(o => o.id === offerId ? { ...o, is_active: !currentStatus } : o));
            toast.success("Statut de l'offre modifié avec succès !");
        } catch (err) {
            console.error('Failed to toggle offer status', err);
            toast.error("Erreur lors de la modification du statut.");
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mes Offres & Besoins</h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">Gérez vos annonces et suivez les performances de vos recrutements.</p>
                </div>
                <Link
                    href="/dashboard/entreprise/offres/nouvelle"
                    className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs sm:text-sm flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none"
                >
                    <Plus size={18} className="mr-2" /> Créer une offre
                </Link>
            </div>

            {/* Quick Summary Filters */}
            <div className="flex flex-wrap gap-4">
                {[
                    { label: "Toutes", count: offers.length, active: true },
                    { label: "Actives", count: offers.filter(o => o.is_active).length, active: false },
                    { label: "En pause", count: offers.filter(o => !o.is_active).length, active: false },
                ].map((f, i) => (
                    <button key={i} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${f.active ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                        {f.label} ({f.count})
                    </button>
                ))}
            </div>

            {/* Offers List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-950 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-blue-50 dark:border-slate-800 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-10">
                                    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:w-1/3">
                                        <Skeleton className="w-20 h-20 rounded-[2rem]" />
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-3 w-1/3" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex justify-around">
                                        <Skeleton className="h-12 w-16" />
                                        <Skeleton className="h-12 w-16" />
                                        <Skeleton className="h-12 w-16" />
                                    </div>
                                    <div className="lg:w-1/4 flex gap-3">
                                        <Skeleton className="h-12 w-12 rounded-2xl" />
                                        <Skeleton className="h-12 w-full rounded-[1.5rem]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-10 sm:py-20 bg-white dark:bg-slate-950 rounded-[2rem] sm:rounded-[2.5rem] border border-red-50 dark:border-red-900/20 shadow-sm">
                        <p className="text-red-500 dark:text-red-400 font-bold px-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase underline mt-4">Réessayer</button>
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-12 sm:py-20 bg-white dark:bg-slate-950 rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-blue-100 dark:border-slate-800 px-4">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-blue-200 dark:text-blue-800 mx-auto mb-6">
                            <Briefcase size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Aucune offre active</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                            Publiez votre premier besoin en moins de 2 minutes et laissez notre IA trouver les meilleurs talents.
                        </p>
                        <Link href="/dashboard/entreprise/offres/nouvelle" className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:shadow-2xl transition-all shadow-lg shadow-blue-100 dark:shadow-none inline-block">
                            Créer ma première offre
                        </Link>
                    </div>
                ) : (
                    offers.map((offer) => (
                        <div key={offer.id} className="group bg-white dark:bg-slate-950 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-blue-50 dark:border-slate-800 shadow-sm hover:shadow-2xl dark:hover:shadow-blue-900/10 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all relative overflow-hidden">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-10">
                                {/* Offer Core Info */}
                                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:w-1/3">
                                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-400 dark:text-blue-500 border border-blue-100 dark:border-blue-900/30 shrink-0 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-all">
                                        <Briefcase size={32} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 sm:space-x-3 mb-2">
                                            <button
                                                onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                                                className={`px-2.5 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity ${offer.is_active ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'}`}
                                            >
                                                {offer.is_active ? 'Actif (Clic pour pause)' : 'Pause (Clic pour activer)'}
                                            </button>
                                            {offer.is_ia_boosted && (
                                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">
                                                    IA Assisté
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tighter decoration-blue-500 underline-offset-4 decoration-2">{offer.title}</h3>
                                        <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans">
                                            <span className="flex items-center"><MapPin size={12} className="mr-1 text-blue-500" /> {offer.location}</span>
                                            <span className="flex items-center"><Clock size={12} className="mr-1 text-blue-500" /> {new Date(offer.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats & Matches */}
                                <div className="flex items-center justify-between sm:justify-around flex-wrap gap-4 sm:gap-8 border-y lg:border-y-0 lg:border-x border-slate-50 dark:border-slate-800 py-6 sm:py-8 lg:py-0 text-center flex-1 font-sans">
                                    <div className="w-1/3 sm:w-auto">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Vues IA</div>
                                        <div className="text-3xl font-black text-slate-900 dark:text-white">{offer.views_count || 0}</div>
                                    </div>
                                    <div className="w-1/3 sm:w-auto">
                                        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Candidats</div>
                                        <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                            {(offer.applications_count || 0) > 0 ? (
                                                <>{offer.applications_count} <Zap size={18} className="ml-2 text-orange-400 fill-orange-400" /></>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-600 text-xl italic uppercase font-medium">En attente</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Type</div>
                                        <div className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 uppercase">{offer.contract_type}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 sm:gap-6 lg:w-1/4">
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/dashboard/entreprise/offres/${offer.slug}`}
                                            className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30"
                                        >
                                            <Eye size={20} />
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm("Voulez-vous vraiment supprimer cette offre ?")) {
                                                    axiosInstance.delete(`jobs/offers/${offer.id}/`).then(() => fetchOffers());
                                                }
                                            }}
                                            className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                                        >
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                    <Link
                                        href={`/dashboard/entreprise/offres/${offer.slug}`}
                                        className="w-full sm:w-auto bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 px-6 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-slate-100 dark:shadow-none flex items-center justify-center shrink-0 font-sans"
                                    >
                                        Matches <ChevronRight size={16} className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Performance Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 shadow-2xl shadow-blue-200 dark:shadow-none">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/20 shrink-0">
                        <TrendingUp size={32} className="text-blue-300 sm:w-10 sm:h-10" />
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black mb-1">Boostez vos annonces</h3>
                        <p className="text-blue-100 font-medium text-sm sm:text-lg">
                            Les offres avec le badge <span className="font-black italic underline underline-offset-4">IA Assisté</span> reçoivent en moyenne <span className="text-white font-black">4x plus</span> de candidats qualifiés.
                        </p>
                    </div>
                </div>
                <button className="w-full sm:w-auto px-8 sm:px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center shrink-0">
                    Découvrir les formules <Zap size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );
}
