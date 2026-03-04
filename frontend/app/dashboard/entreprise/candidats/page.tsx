'use client';

import Link from 'next/link';
import {
    Users,
    Search,
    Filter,
    ChevronRight,
    MapPin,
    Award,
    Target,
    Briefcase,
    Star,
    Coins,
    CheckCircle2,
    ShieldCheck,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TalentsBasePage() {
    const [talents, setTalents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchTalents = async () => {
            try {
                setError(null);
                const response = await api.get('users/candidates/');
                // Handle both paginated and non-paginated responses
                const results = Array.isArray(response.data) ? response.data :
                    (response.data.results ? response.data.results : []);

                setTalents(results.map((t: any) => ({
                    id: t.id,
                    name: `${t.user_detail?.first_name || ''} ${t.user_detail?.last_name || 'Candidat'}`,
                    position: t.title || "Profil à compléter",
                    location: t.location || "Non spécifié",
                    score: `${t.placability_score || 0}/100`,
                    reliability: t.reliability_score >= 80 ? "Elite" : t.reliability_score >= 50 ? "High" : "Standard",
                    credits: 50,
                    skills: t.skills || [],
                    verified: t.is_verified,
                    photo: t.photo
                })));
            } catch (err: any) {
                console.error("Error fetching talents:", err);
                setError("Impossible de charger la base de talents. Vérifiez vos permissions.");
            } finally {
                setLoading(false);
            }
        };
        fetchTalents();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredTalents = talents.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.skills.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!mounted) return null;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Base de Talents IA</h1>
                    <p className="text-slate-500 font-medium">Accédez uniquement aux profils <span className="text-blue-600 font-black italic">Vérifiés et Certifiés</span> par Travago.</p>
                </div>
                <div className="flex space-x-2">
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-lg shadow-blue-100">
                        <ShieldCheck size={20} />
                        <span className="text-sm font-black uppercase tracking-widest leading-none">Confiance : Totale</span>
                    </div>
                </div>
            </div>

            {/* Premium Filters - Blue Theme */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-sm space-y-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Domaine technique, métier ou ville..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-8 py-4 ${showFilters ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'} rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center shrink-0`}
                        >
                            <Filter size={16} className="mr-2" /> {showFilters ? 'Masquer Filtres' : 'Filtres Avancés'}
                        </button>
                        <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 shrink-0">
                            Rechercher
                        </button>
                    </div>
                </div>
            </div>

            {showFilters && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="grid md:grid-cols-3 gap-6 pt-6 border-t border-slate-50"
                >
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localisation</label>
                        <select className="w-full p-3 bg-slate-50 rounded-xl border-none text-xs font-bold">
                            <option>Toutes les villes</option>
                            <option>Douala</option>
                            <option>Yaoundé</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score IA Minimum</label>
                        <input type="range" className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveau d'étude</label>
                        <select className="w-full p-3 bg-slate-50 rounded-xl border-none text-xs font-bold">
                            <option>Tout les niveaux</option>
                            <option>Bac +5</option>
                            <option>Doctorat</option>
                        </select>
                    </div>
                </motion.div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest self-center">Filtres rapides :</span>
                {['Top 5% Score', 'Douala', 'Bac+5 Vérifié', 'Disponible de suite'].map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSearchTerm(tag === 'Douala' ? 'Douala' : tag)}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black text-blue-700 transition-all uppercase tracking-widest border border-blue-100"
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Verified Talents List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-blue-50 shadow-sm">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Chargement des talents...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-red-50 shadow-sm">
                        <p className="text-red-500 font-bold">{error}</p>
                        <button onClick={() => window.location.reload()} className="text-blue-600 font-black text-xs uppercase underline mt-2">Réessayer</button>
                    </div>
                ) : filteredTalents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-blue-50 shadow-sm">
                        <p className="text-slate-400 font-bold">Aucun talent trouvé pour cette recherche.</p>
                        <button onClick={() => setSearchTerm('')} className="text-blue-600 font-black text-xs uppercase underline mt-2">Effacer les filtres</button>
                    </div>
                ) : (
                    filteredTalents.map((talent) => (
                        <div key={talent.id} className="group bg-white rounded-[2.5rem] p-10 border border-blue-50 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all relative overflow-hidden">
                            {talent.verified && (
                                <div className="absolute top-0 right-10 bg-blue-600 text-white px-6 py-2 rounded-b-2xl font-black text-[10px] uppercase tracking-widest flex items-center">
                                    <ShieldCheck size={12} className="mr-2" /> IA Verified
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                                {/* Profile Info */}
                                <div className="flex items-start space-x-6 lg:w-1/3">
                                    <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center font-black text-3xl text-blue-200 group-hover:shadow-lg transition-all overflow-hidden flex-shrink-0 border border-blue-100 shadow-sm relative">
                                        {talent.photo ? (
                                            <Image
                                                src={getImageUrl(talent.photo) || ''}
                                                alt={talent.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span>{talent.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">{talent.name}</h3>
                                        <p className="text-blue-600 font-bold text-sm mb-4">{talent.position}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {talent.skills.map((skill: string) => (
                                                <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* IA Certification Metrics */}
                                <div className="flex items-center justify-around flex-1 gap-8 border-y lg:border-y-0 lg:border-x border-slate-50 py-8 lg:py-0 text-center">
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">IA Match Score</div>
                                        <div className="text-3xl font-black text-blue-700">{talent.score}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Reliability</div>
                                        <div className="text-xl font-black text-green-600 flex items-center justify-center italic">
                                            {talent.reliability}
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Diplôme Vérifié</div>
                                        <CheckCircle2 className="mx-auto text-blue-600" size={24} />
                                    </div>
                                </div>

                                {/* Cost & Contact */}
                                <div className="flex items-center justify-between lg:justify-end gap-8 lg:w-1/4">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Débloquer (Crédits)</div>
                                        <div className="flex items-center justify-end text-blue-700 font-black text-xl">
                                            <Coins size={18} className="mr-2 text-orange-500" /> {talent.credits}
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/entreprise/candidats/${talent.id}`} className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 flex items-center">
                                        Voir profil <ChevronRight size={16} className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Empty Context Notice */}
            <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] flex items-center justify-between text-blue-900">
                <div className="flex items-center space-x-4">
                    <Star className="text-blue-600 animate-pulse" />
                    <p className="font-medium text-sm">
                        Vous ne voyez pas le profil qu'il vous faut ? Lancez un <span className="font-black underline italic">Placement IA Assisté</span> et nous chasserons pour vous.
                    </p>
                </div>
                <Link href="/dashboard/entreprise/placement" className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline whitespace-nowrap">Démarrer une chasse</Link>
            </div>
        </div >
    );
}
