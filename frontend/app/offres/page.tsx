'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    MapPin,
    Briefcase,
    Clock,
    Filter,
    ChevronRight,
    Zap,
    Building2,
    Calendar,
    ArrowRight,
    Loader2
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import { trackEvent } from '@/components/analytics-provider';

// Générateur de placeholder blur base64 pour les images (Core Web Vitals)
const BLUR_DATA_URL = "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoIAAgAAkA4JZQCdAEO/gHOAAD++Mu6FLpqHJExFkLrkjf4AA==";

export default function PublicJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        contract_type: '',
        experience_level: '',
        location: ''
    });

    // Infinite scroll: ref sur le sentinel
    const sentinelRef = useRef<HTMLDivElement>(null);

    const fetchJobs = useCallback(async (pageNum: number, reset: boolean = false) => {
        if (pageNum === 1) setIsLoading(true);
        else setIsFetchingMore(true);

        try {
            const params = new URLSearchParams();
            if (filters.contract_type) params.append('contract_type', filters.contract_type);
            if (filters.experience_level) params.append('experience_level', filters.experience_level);
            if (filters.location) params.append('location', filters.location);
            if (searchTerm) params.append('search', searchTerm);
            params.append('page', String(pageNum));
            params.append('page_size', '10');

            const response = await axiosInstance.get(`jobs/offers/?${params.toString()}`);

            // Supporte la pagination DRF (results + count + next)
            const data = response.data.results ?? response.data;
            const results = Array.isArray(data) ? data : [];
            const hasNext = !!response.data.next;

            setJobs(prev => reset || pageNum === 1 ? results : [...prev, ...results]);
            setHasMore(hasNext);

            // Analytics: Track search only on first page and if term exists
            if (pageNum === 1 && searchTerm) {
                trackEvent('job_search', {
                    term: searchTerm,
                    results_count: response.data.count || results.length,
                    filters: filters
                });
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [filters, searchTerm]);

    // Reset quand les filtres changent
    useEffect(() => {
        setPage(1);
        setJobs([]);
        setHasMore(true);
        fetchJobs(1, true);
    }, [filters, searchTerm]);

    // Intersection Observer pour l'infinite scroll
    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore && !isLoading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchJobs(nextPage);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, isFetchingMore, isLoading, page, fetchJobs]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero / Header */}
            <header className="bg-white border-b border-slate-100 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic mb-6">
                            Trouvez votre futur <br />
                            <span className="text-blue-600">dans l'excellence.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium italic">
                            Explorez les meilleures opportunités au Cameroun, validées et certifiées par Travago.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-blue-50 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Intitulé du poste, entreprise..."
                                className="w-full pl-16 pr-6 py-5 bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-px bg-slate-100 h-10 self-center hidden md:block"></div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Ville (ex: Douala)"
                                className="w-full pl-16 pr-6 py-5 bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder:text-slate-400"
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            />
                        </div>
                        <button className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                            Rechercher
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1 space-y-10">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                                <Filter size={18} className="mr-2 text-blue-600" /> Filtres
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Type de contrat</label>
                                    <select
                                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest outline-none focus:border-blue-500 transition-all text-slate-700"
                                        onChange={(e) => setFilters({ ...filters, contract_type: e.target.value })}
                                    >
                                        <option value="">Tous les types</option>
                                        <option value="CDI">CDI</option>
                                        <option value="CDD">CDD</option>
                                        <option value="FREELANCE">Freelance</option>
                                        <option value="STAGE">Stage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Niveau d'expérience</label>
                                    <select
                                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest outline-none focus:border-blue-500 transition-all text-slate-700"
                                        onChange={(e) => setFilters({ ...filters, experience_level: e.target.value })}
                                    >
                                        <option value="">Tous les niveaux</option>
                                        <option value="JUNIOR">Junior (0-2 ans)</option>
                                        <option value="INTERMEDIATE">Intermédiaire (2-5 ans)</option>
                                        <option value="SENIOR">Senior (5-10 ans)</option>
                                        <option value="EXPERT">Expert (10+ ans)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* IA Boost Notice */}
                        <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/20 blur-2xl rounded-full"></div>
                            <Zap className="text-blue-500 mb-6" size={32} />
                            <h4 className="text-xl font-black italic mb-4">Matching IA Premium</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                                Connectez-vous pour voir votre score d'adéquation avec chaque offre.
                            </p>
                            <Link href="/login" className="block text-center py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">
                                Connexion
                            </Link>
                        </div>
                    </aside>

                    {/* Jobs List with Infinite Scroll */}
                    <div className="lg:col-span-3 space-y-6">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-44 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"></div>
                            ))
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-blue-50">
                                <p className="text-slate-400 font-medium italic">Aucune offre ne correspond à votre recherche.</p>
                            </div>
                        ) : (
                            <>
                                {jobs.map((job, index) => (
                                    <motion.div
                                        key={`${job.id}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                        className="group bg-white p-8 rounded-[3rem] border border-slate-100 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-900/5 transition-all relative overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center relative z-10">
                                            {/* Company Logo avec blurDataURL pour Core Web Vitals */}
                                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center p-0 shadow-lg shadow-blue-900/5 border border-slate-50 overflow-hidden relative group-hover:scale-105 transition-transform duration-500 shrink-0">
                                                {job.company_detail?.logo ? (
                                                    <Image
                                                        src={getImageUrl(job.company_detail.logo)}
                                                        alt={job.company_detail.name}
                                                        fill
                                                        className="object-cover"
                                                        placeholder="blur"
                                                        blurDataURL={BLUR_DATA_URL}
                                                        sizes="96px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                                        <Building2 className="text-slate-200" size={32} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                                                        {job.contract_type}
                                                    </span>
                                                    <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                        {job.experience_level}
                                                    </span>
                                                    {job.is_ia_boosted && (
                                                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                                            <Zap size={10} className="fill-white" /> IA Verified
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-3xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tighter uppercase leading-none">
                                                    {job.title}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] italic">
                                                    <span className="flex items-center text-slate-900 not-italic">
                                                        <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
                                                            <Building2 size={12} className="text-blue-500" />
                                                        </span>
                                                        {job.company_detail?.name || 'Entreprise'}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <MapPin size={14} className="mr-2 text-slate-300" /> {job.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar size={14} className="mr-2 text-slate-300" /> {new Date(job.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {job.required_skills && job.required_skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-6">
                                                        {job.required_skills.slice(0, 4).map((skill: string, i: number) => (
                                                            <span key={i} className="text-[9px] font-bold text-slate-400 bg-slate-100/50 px-2.5 py-1 rounded-md uppercase tracking-tighter border border-slate-50">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-full md:w-auto pt-8 md:pt-0 border-t md:border-none border-slate-50 flex items-center gap-4">
                                                <div className="hidden xl:flex flex-col items-end mr-4">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Salaire Est.</span>
                                                    <span className="text-lg font-black text-emerald-600 italic tracking-tighter uppercase">{job.salary_range || 'Confid.'}</span>
                                                </div>
                                                <Link
                                                    href={`/offres/${job.slug}`}
                                                    onClick={() => trackEvent('job_offer_click', {
                                                        job_id: job.id,
                                                        job_title: job.title,
                                                        company: job.company_detail?.name
                                                    })}
                                                    className="flex-1 md:flex-none px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group/btn"
                                                >
                                                    S'informer <ArrowRight size={16} className="ml-3 group-hover/btn:translate-x-2 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-600/10 transition-colors"></div>
                                    </motion.div>
                                ))}

                                {/* Sentinel pour l'Infinite Scroll */}
                                <div ref={sentinelRef} className="py-4 flex justify-center">
                                    {isFetchingMore && (
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Loader2 size={20} className="animate-spin text-blue-500" />
                                            <span className="text-sm font-bold uppercase tracking-widest">Chargement...</span>
                                        </div>
                                    )}
                                    {!hasMore && jobs.length > 0 && (
                                        <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">— Fin des résultats —</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
