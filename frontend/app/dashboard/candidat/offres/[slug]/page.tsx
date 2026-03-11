'use client';

import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    ChevronLeft,
    Zap,
    CheckCircle2,
    Loader2,
    Calendar,
    Target,
    Building2,
    ShieldCheck,
    MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface JobOffer {
    id: number;
    title: string;
    slug: string;
    description: string;
    missions: string;
    requirements: string;
    location: string;
    contract_type: string;
    salary_range: string | null;
    sector: string;
    experience_level: string;
    company: number;
    company_detail: {
        id: number;
        name: string;
        logo: string | null;
        sector: string;
        city: string;
    };
    required_skills: string[];
    is_ia_boosted: boolean;
    created_at: string;
}

export default function JobDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [offer, setOffer] = useState<JobOffer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        fetchJobDetail();
    }, [slug]);

    const fetchJobDetail = async () => {
        try {
            const response = await axiosInstance.get(`jobs/offers/${slug}/`);
            setOffer(response.data);

            // Check if already applied
            const appsRes = await axiosInstance.get('jobs/my-applications/');
            const apps = appsRes.data.results || appsRes.data;
            const alreadyApplied = apps.some((a: any) => a.job_offer_detail.slug === slug);
            setHasApplied(alreadyApplied);
        } catch (err) {
            console.error('Failed to fetch job detail', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        if (!offer) return;
        setIsApplying(true);
        try {
            await axiosInstance.post(`jobs/offers/${offer.slug}/apply/`);
            setHasApplied(true);
            toast.success(`Succès ! Votre candidature pour "${offer.title}" a été transmise avec succès.`);
        } catch (err: any) {
            console.error('Failed to apply', err);
            toast.error(err.response?.data?.detail || 'Une erreur est survenue.');
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-slate-900 mb-4">Offre introuvable</h2>
                <button onClick={() => router.back()} className="text-blue-600 font-bold hover:underline">
                    Retourner aux opportunités
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 overflow-x-hidden">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-colors group"
                >
                    <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Retour aux offres
                </button>
                <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                        Réf: #{offer.id}628
                    </span>
                    {offer.is_ia_boosted && (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-blue-100">
                            <Zap size={12} className="mr-1 fill-white" /> IA Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Main Header Card */}
            <div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-xl shadow-blue-500/5 border border-blue-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10"></div>

                <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                    {/* Logo */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-2 border-white shadow-xl relative overflow-hidden shrink-0">
                        {offer.company_detail.logo ? (
                            <Image
                                src={getImageUrl(offer.company_detail.logo) || ''}
                                alt={offer.company_detail.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Building2 size={48} className="text-slate-300" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="text-blue-600 font-black text-sm uppercase tracking-wider">{offer.company_detail.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                            <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{offer.company_detail.sector}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none mb-6 tracking-tighter uppercase whitespace-normal break-words">{offer.title}</h1>

                        <div className="flex flex-wrap gap-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">
                            <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic">
                                <MapPin size={16} className="mr-2 text-blue-500" /> {offer.location}
                            </div>
                            <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic">
                                <Clock size={16} className="mr-2 text-blue-500" /> {offer.contract_type}
                            </div>
                            <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic">
                                <DollarSign size={16} className="mr-2 text-blue-500" /> {offer.salary_range || 'Salaire à discuter'}
                            </div>
                        </div>
                    </div>

                    {/* Action Block */}
                    <div className="w-full md:w-auto flex flex-col gap-4">
                        {hasApplied ? (
                            <div className="bg-green-50 text-green-600 p-8 rounded-[2.5rem] border border-green-100 text-center flex flex-col items-center">
                                <CheckCircle2 size={40} className="mb-3" />
                                <div className="text-[10px] font-black uppercase tracking-widest mb-1">Candidature envoyée</div>
                                <div className="text-xs font-bold opacity-70 italic">En attente de réponse du recruteur.</div>
                                <Link
                                    href="/dashboard/candidat/candidatures"
                                    className="mt-4 text-green-700 font-black text-[10px] uppercase tracking-widest hover:underline"
                                >
                                    Suivre mon dossier
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                disabled={isApplying}
                                className="px-12 py-6 bg-blue-600 text-white rounded-[2.2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center min-w-[200px]"
                            >
                                {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>Postuler<Zap size={18} className="ml-3 fill-white" /></>
                                )}
                            </button>
                        )}
                        <Link
                            href="/dashboard/candidat/messages"
                            className="px-12 py-5 bg-slate-50 text-slate-600 rounded-[2.2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 flex items-center justify-center"
                        >
                            <MessageSquare size={16} className="mr-2" /> Contacter RH
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left: Main details */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Description */}
                    <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                                <Briefcase size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest bg-blue-50 px-6 py-2 rounded-2xl">Description du poste</h2>
                        </div>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap px-4 italic">
                            {offer.description}
                        </div>
                    </section>

                    {/* Missions */}
                    <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                                <Target size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest bg-indigo-50 px-6 py-2 rounded-2xl">Missions principales</h2>
                        </div>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap px-4 italic">
                            {offer.missions}
                        </div>
                    </section>

                    {/* Requirements */}
                    <section className="bg-blue-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 blur-3xl opacity-20"></div>
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                <ShieldCheck size={24} className="text-blue-300" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest">Profil recherché</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-blue-100 font-medium leading-relaxed whitespace-pre-wrap px-4 italic">
                            {offer.requirements}
                        </div>
                    </section>
                </div>

                {/* Right: Sidebar Metadata */}
                <div className="space-y-8">
                    {/* IA Insights */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50 overflow-hidden">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center">
                            <Zap size={16} className="mr-2 text-blue-600" /> Analyse IA Match
                        </h3>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matching Score</div>
                                <div className="text-2xl font-black text-blue-600">85%</div>
                            </div>

                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]" style={{ width: '85%' }}></div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Compétences clés identifiées</p>
                                <div className="flex flex-wrap gap-2">
                                    {(offer.required_skills || []).map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100 italic">
                                            {skill}
                                        </span>
                                    ))}
                                    {(!offer.required_skills || offer.required_skills.length === 0) && (
                                        <span className="text-xs text-slate-400 italic">Analyse en cours...</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Company */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 italic">À propos de l'entreprise</h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100 shadow-sm relative overflow-hidden">
                                    {offer.company_detail.logo ? (
                                        <Image
                                            src={getImageUrl(offer.company_detail.logo) || ''}
                                            alt={offer.company_detail.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Building2 size={24} />
                                    )}
                                </div>
                                <div>
                                    <div className="font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{offer.company_detail.name}</div>
                                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{offer.company_detail.city}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => toast.info(`Visite du profil de ${offer.company_detail.name}...`)}
                                className="w-full bg-white text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:border-blue-500 transition-all italic"
                            >
                                Voir la page entreprise
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 group">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                                    <Calendar size={14} className="mr-2" /> Publiée le
                                </div>
                                <div className="text-xs font-black text-slate-900">{new Date(offer.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                                    <Zap size={14} className="mr-2" /> Vues
                                </div>
                                <div className="text-xs font-black text-slate-900">124</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                                    <CheckCircle2 size={14} className="mr-2" /> Postulants
                                </div>
                                <div className="text-xs font-black text-slate-900">18</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
