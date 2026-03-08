'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { MapPin, Building2, Calendar, Clock, DollarSign, Briefcase, ChevronLeft, Send, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore } from '@/lib/store/auth-store';

interface JobOffer {
    id: number;
    title: string;
    description: string;
    company_detail?: {
        name: string;
        sector: string;
        description: string;
    };
    location: string;
    contract_type: string;
    experience_level: string;
    salary_range: string;
    required_skills: string[];
    is_active: boolean;
    created_at: string;
    ai_match_score?: number;
}

export default function JobDetailPage() {
    const params = useParams();
    const slug = params?.slug;
    const router = useRouter();
    const [job, setJob] = useState<JobOffer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const { user: authUser } = useAuthStore();

    useEffect(() => {
        if (slug) {
            fetchJob();
        }
    }, [slug]);

    const fetchJob = async () => {
        try {
            const response = await axiosInstance.get(`jobs/offers/${slug}/`);
            setJob(response.data);
            // Check if already applied (if API supports it, currently checking strictly by application error or separate call isn't implemented in this view, 
            // but the viewset 'apply' action handles the check. We can rely on that or add a check.)
        } catch (error) {
            console.error("Failed to fetch job", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        if (!job) return;
        setIsApplying(true);
        try {
            await axiosInstance.post(`jobs/offers/${slug}/apply/`);
            setHasApplied(true);
            toast.success("Candidature envoyée avec succès !");
        } catch (error: any) {
            if (error.response?.status === 400 && error.response?.data?.detail) {
                toast.error(error.response.data.detail);
                setHasApplied(true); // Assuming 400 means already applied
            } else {
                console.error("Failed to apply", error);
                toast.error("Erreur lors de la candidature. Veuillez réessayer.");
            }
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
                <Briefcase size={64} className="text-slate-300 mb-6" />
                <h1 className="text-2xl font-black text-slate-800 uppercase italic mb-2">Offre non trouvée</h1>
                <p className="text-slate-500 mb-8">Cette offre d'emploi n'existe pas ou a été archivée.</p>
                <button onClick={() => router.back()} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest mb-8"
                    >
                        <ChevronLeft size={16} className="mr-1" /> Retour
                    </button>

                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {job.contract_type}
                                </span>
                                {job.ai_match_score && (
                                    <span className="px-4 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                                        <BarChart2 size={12} />
                                        Match IA {job.ai_match_score}%
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase italic tracking-tighter mb-4">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500 uppercase">
                                <span className="flex items-center gap-2">
                                    <Building2 size={16} className="text-blue-500" />
                                    {job.company_detail?.name || 'Entreprise Confidentielle'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <MapPin size={16} className="text-emerald-500" />
                                    {job.location}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    Publié le {format(new Date(job.created_at), 'dd MMM yyyy', { locale: fr })}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {authUser?.role === 'CANDIDATE' ? (
                                <button
                                    onClick={handleApply}
                                    disabled={isApplying || hasApplied}
                                    className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 
                                        ${hasApplied
                                            ? 'bg-emerald-50 text-emerald-600 cursor-default'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
                                        } disabled:opacity-70 disabled:cursor-not-allowed`}
                                >
                                    {hasApplied ? 'Candidature Envoyée' : isApplying ? 'Envoi...' : 'Postuler Maintenant'}
                                    {!hasApplied && !isApplying && <Send size={16} />}
                                </button>
                            ) : (
                                <div className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                                    {authUser?.role === 'ADMIN' ? 'Vue Administrateur' : 'Connectez-vous pour postuler'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-6 flex items-center gap-3">
                            <Briefcase className="text-blue-600" /> Description du Poste
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                            {job.description}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-6 flex items-center gap-3">
                            <BarChart2 className="text-purple-600" /> Compétences Requises
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {job.required_skills?.map((skill, index) => (
                                <span key={index} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 shadow-sm">
                                    {skill}
                                </span>
                            )) || <p className="text-slate-400 italic">Non spécifié</p>}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 uppercase italic mb-6">Détails de l'offre</h3>

                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Salaire</div>
                                <div className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    <DollarSign size={20} className="text-emerald-500" />
                                    {job.salary_range || 'Non spécifié'}
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expérience</div>
                                <div className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    <Briefcase size={20} className="text-blue-500" />
                                    {job.experience_level}
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type de Contrat</div>
                                <div className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    <Clock size={20} className="text-purple-500" />
                                    {job.contract_type}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <h3 className="text-lg font-black uppercase italic mb-4 relative z-10">Matching IA</h3>
                        <p className="text-sm text-slate-400 font-medium mb-6 relative z-10">
                            Notre algorithme analyse la compatibilité de votre profil avec cette offre en temps réel.
                        </p>
                        {job.ai_match_score ? (
                            <div className="relative z-10">
                                <div className="flex justify-between text-xs font-black uppercase mb-2">
                                    <span className="text-emerald-400">Compatibilité</span>
                                    <span>{job.ai_match_score}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500" style={{ width: `${job.ai_match_score}%` }}></div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10 p-4 bg-white/5 rounded-xl text-xs font-bold text-center text-slate-300">
                                Connectez-vous en tant que candidat pour voir votre match.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
