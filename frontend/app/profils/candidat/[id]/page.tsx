'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Mail, MapPin, Briefcase, Calendar, CheckCircle, Shield, Star, Award, Zap, ArrowLeft } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

interface CandidateDetail {
    id: number;
    user_detail: {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        photo: string | null;
    };
    title: string;
    location: string;
    bio: string;
    is_verified: boolean;
    placability_score: number;
    reliability_score: number;
    skills: string[];
    experience: Array<{
        company: string;
        role: string;
        period: string;
        desc: string;
    }>;
}

export default function PublicCandidateProfile() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await axiosInstance.get(`users/candidates/${id}/`);
                setCandidate(response.data);
            } catch (error) {
                console.error("Failed to fetch candidate profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    if (isLoading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest">Chargement du profil...</div>;
    if (!candidate) return <div className="h-screen flex items-center justify-center font-black text-red-500 uppercase tracking-widest">Profil introuvable</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Transparent Header Navigation */}
            <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-slate-900 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-black uppercase text-xs tracking-widest">Retour</span>
                </Link>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                    <span className="text-blue-600 font-black italic tracking-tighter text-xl">TRAVAGO.</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-white rounded-[4rem] shadow-2xl shadow-blue-500/5 overflow-hidden border border-blue-50">
                    {/* Hero Section */}
                    <div className="bg-slate-900 h-64 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                        <div className="absolute -bottom-20 left-12 w-40 h-40 rounded-[3rem] bg-gradient-to-br from-blue-500 to-blue-700 p-1.5 shadow-2xl overflow-hidden">
                            <div className="w-full h-full rounded-[2.8rem] bg-white flex items-center justify-center text-5xl font-black text-blue-600 relative overflow-hidden">
                                {candidate.user_detail.photo ? (
                                    <Image
                                        src={getImageUrl(candidate.user_detail.photo)}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="opacity-20"><User size={80} /></div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-28 px-12 pb-16">
                        <div className="grid lg:grid-cols-3 gap-16">
                            {/* Left Column: Main Info */}
                            <div className="lg:col-span-2 space-y-12">
                                <div>
                                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-3 flex items-center gap-4">
                                        {candidate.user_detail.first_name} {candidate.user_detail.last_name}
                                        {candidate.is_verified && (
                                            <div className="bg-blue-600 text-white p-1 rounded-full shadow-lg shadow-blue-200">
                                                <CheckCircle size={28} fill="currentColor" />
                                            </div>
                                        )}
                                    </h1>
                                    <p className="text-2xl font-bold text-blue-600 tracking-tight italic">
                                        {candidate.title || 'Expert non spécifié'}
                                    </p>
                                    <div className="flex items-center gap-4 mt-6">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-600 font-black text-[10px] uppercase tracking-widest">
                                            <MapPin size={14} className="text-blue-500" />
                                            {candidate.location || 'Non localisé'}
                                        </div>
                                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">
                                            Disponible Immédiatement
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] italic">À Propos</h2>
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed italic">
                                        {candidate.bio || "Aucune description n'a été ajoutée à ce profil."}
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] italic">Compétences Clés</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {candidate.skills?.map((skill, i) => (
                                            <span key={i} className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs text-slate-600 shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all cursor-default">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] italic">Expériences</h2>
                                    <div className="space-y-6">
                                        {candidate.experience?.length > 0 ? candidate.experience.map((exp, i) => (
                                            <div key={i} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">{exp.role}</h3>
                                                        <p className="text-blue-500 font-black text-sm uppercase tracking-widest">{exp.company}</p>
                                                    </div>
                                                    <span className="px-4 py-1.5 bg-white rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">{exp.period}</span>
                                                </div>
                                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{exp.desc}</p>
                                            </div>
                                        )) : (
                                            <p className="text-slate-400 font-bold italic">Aucune expérience renseignée.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Sidebar Stats */}
                            <div className="space-y-8">
                                <div className="p-8 bg-slate-900 rounded-[3rem] text-white space-y-8 shadow-2xl shadow-blue-500/10">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Scores de Confiance</h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span>Placabilité</span>
                                                <span className="text-blue-400">{candidate.placability_score}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${candidate.placability_score}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span>Fiabilité</span>
                                                <span className="text-emerald-400">{candidate.reliability_score}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${candidate.reliability_score}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-800">
                                        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                                <Zap size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Matching Score</p>
                                                <p className="text-xl font-black italic">ELITE TALENT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-blue-600 rounded-[3rem] text-white text-center space-y-6 shadow-xl shadow-blue-200">
                                    <h3 className="text-xl font-black tracking-tighter italic">Recruter ce talent ?</h3>
                                    <p className="text-xs font-bold text-blue-100 leading-relaxed">
                                        Utilisez vos crédits pour entrer en contact avec ce candidat et accéder à son CV complet.
                                    </p>
                                    <Link href="/dashboard/entreprise/offres" className="block w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                        Contacter maintenant
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
