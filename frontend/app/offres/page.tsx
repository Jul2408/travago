'use client';

import { useState, useEffect } from 'react';
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
    ArrowRight
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function PublicJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        contract_type: '',
        experience_level: '',
        location: ''
    });

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.contract_type) params.append('contract_type', filters.contract_type);
            if (filters.experience_level) params.append('experience_level', filters.experience_level);
            if (filters.location) params.append('location', filters.location);

            const response = await axiosInstance.get(`jobs/offers/?${params.toString()}`);
            const data = response.data.results !== undefined ? response.data.results : response.data;
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
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
                                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
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
                            <Link href="/login" className="block text-center py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                Connexion
                            </Link>
                        </div>
                    </aside>

                    {/* Jobs List */}
                    <div className="lg:col-span-3 space-y-6">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-44 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"></div>
                            ))
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-blue-50">
                                <p className="text-slate-400 font-medium italic">Aucune offre ne correspond à votre recherche.</p>
                            </div>
                        ) : (
                            filteredJobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center p-4 border border-slate-100 group-hover:scale-110 transition-transform relative">
                                            {job.company_logo ? (
                                                <Image
                                                    src={getImageUrl(job.company_logo)}
                                                    alt={job.company_name}
                                                    fill
                                                    className="object-contain p-4"
                                                />
                                            ) : (
                                                <Building2 className="text-slate-300" size={32} />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                                    {job.contract_type}
                                                </span>
                                                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                                    {job.experience_level}
                                                </span>
                                                {job.is_ia_boosted && (
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center">
                                                        <Zap size={10} className="mr-1" /> IA MATCH READY
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors tracking-tight italic">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                <span className="flex items-center text-slate-900">
                                                    <Building2 size={14} className="mr-2 text-blue-600" /> {job.company_name}
                                                </span>
                                                <span className="flex items-center">
                                                    <MapPin size={14} className="mr-2" /> {job.location}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar size={14} className="mr-2" /> {new Date(job.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto pt-6 md:pt-0 border-t md:border-none border-slate-50">
                                            <Link
                                                href={`/offres/${job.slug}`}
                                                className="w-full md:w-auto px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                                            >
                                                Voir Détails <ArrowRight size={16} className="ml-2" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
