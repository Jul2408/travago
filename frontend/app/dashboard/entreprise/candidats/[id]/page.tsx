'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import {
    MapPin,
    Briefcase,
    Mail,
    Phone,
    Download,
    MessageSquare,
    CheckCircle2,
    ShieldCheck,
    Award,
    ChevronLeft,
    Loader2,
    GraduationCap,
    Clock,
    FileText,
    BadgeCheck,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CandidateProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [candidate, setCandidate] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchCandidate();
    }, [params.id]);

    const fetchCandidate = async () => {
        if (!params.id) return;
        try {
            const response = await api.get(`users/candidates/${params.id}/`);
            setCandidate(response.data);
        } catch (error) {
            console.error('Error fetching candidate:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlock = async () => {
        if (!candidate) return;
        if (!confirm(`Souhaitez-vous débloquer ce profil pour 50 crédits ?`)) return;

        setIsUnlocking(true);
        try {
            const response = await api.post(`users/candidates/${params.id}/unlock/`);
            toast.success(response.data.detail);
            // Update candidate state with unlocked data
            await fetchCandidate();
            // Optional: refresh user credits in global state if needed
            window.location.reload();
        } catch (error: any) {
            console.error('Failed to unlock candidate', error);
            const msg = error.response?.data?.detail || "Erreur lors du déblocage.";
            toast.error(msg);
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleStartChat = async () => {
        if (!candidate) return;
        if (!candidate.is_unlocked) {
            return toast.warning("Veuillez débloquer ce profil pour discuter avec le candidat.");
        }
        try {
            const response = await api.post('chat/start_conversation/', {
                user_id: candidate.user_detail?.id
            });
            // Redirect to messages with this conversation
            router.push('/dashboard/entreprise/messages');
        } catch (error) {
            console.error('Failed to start conversation', error);
            toast.error("Impossible de démarrer la conversation.");
        }
    };

    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-100px)] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-900">Candidat introuvable</h2>
                <Link href="/dashboard/entreprise/candidats" className="text-blue-600 hover:underline mt-4 inline-block">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    const fullName = `${candidate.user_detail?.first_name || ''} ${candidate.user_detail?.last_name || ''}`;

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Nav */}
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/entreprise/candidats" className="p-3 bg-white border border-blue-50 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Détails du Profil</h1>
                    <p className="text-slate-500 font-medium text-sm">Analysez les compétences et la fiabilité avant de recruter.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Main Identity Card */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-blue-50 shadow-sm text-center relative overflow-hidden group hover:shadow-xl transition-all">
                        {candidate.is_verified && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest flex items-center z-10">
                                <ShieldCheck size={12} className="mr-2" /> Certifié
                            </div>
                        )}

                        <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-4xl font-black text-blue-200 border-2 border-white shadow-lg overflow-hidden relative">
                            {candidate.photo ? (
                                <Image
                                    src={getImageUrl(candidate.photo) || ''}
                                    alt={fullName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                fullName.charAt(0)
                            )}
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-1">{fullName}</h2>
                        <p className="text-blue-600 font-bold mb-6 uppercase tracking-wide text-xs">{candidate.title || 'Poste non spécifié'}</p>

                        <div className="flex justify-center flex-wrap gap-2 mb-8">
                            {candidate.location && (
                                <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center">
                                    <MapPin size={12} className="mr-1" /> {candidate.location}
                                </span>
                            )}
                            <span className="px-3 py-1 bg-green-50 rounded-lg text-[10px] font-black uppercase text-green-600 tracking-widest flex items-center">
                                <CheckCircle2 size={12} className="mr-1" /> Dispo
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score IA</div>
                                <div className="text-2xl font-black text-blue-600">{candidate.placability_score}/100</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fiabilité</div>
                                <div className="text-2xl font-black text-green-600">{candidate.reliability_score >= 80 ? 'Elite' : 'Standard'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-lg">
                        <h3 className="text-lg font-black mb-6 flex items-center">
                            <Briefcase className="mr-2 text-blue-400" /> Actions Recruteur
                        </h3>
                        <div className="space-y-4">
                            {candidate.is_unlocked ? (
                                <>
                                    <button
                                        onClick={handleStartChat}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center shadow-lg shadow-blue-900/50"
                                    >
                                        <MessageSquare size={16} className="mr-2" /> Discuter maintenant
                                    </button>
                                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center border border-white/10">
                                        <Download size={16} className="mr-2" /> Télécharger CV
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleUnlock}
                                    disabled={isUnlocking}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center shadow-lg shadow-blue-900/50 gap-2"
                                >
                                    {isUnlocking ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <Lock size={16} />
                                    )}
                                    Débloquer pour 50 Crédits
                                </button>
                            )}
                            <div className="pt-4 border-t border-white/10 text-center">
                                <p className="text-[10px] text-slate-400 font-medium">
                                    {candidate.is_unlocked
                                        ? "Profil débloqué ✅"
                                        : "Coût de déblocage : 50 Crédits"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Bio & Skills */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-blue-50 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
                            <FileText className="mr-2 text-blue-600" /> Profil Professionnel
                        </h3>

                        <div className="mb-8">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Bio / Pitch</h4>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                {candidate.bio || "Ce candidat n'a pas encore ajouté de bio."}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Compétences Techniques</h4>
                            <div className="flex flex-wrap gap-2">
                                {candidate.skills && candidate.skills.length > 0 ? (
                                    candidate.skills.map((skill: string, idx: number) => (
                                        <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-100">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 text-sm italic">Aucune compétence listée.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Experience & Education */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-blue-50 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
                            <GraduationCap className="mr-2 text-blue-600" /> Parcours & Diplômes
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <h4 className="flex items-center text-xs font-black text-slate-900 uppercase tracking-widest mb-4">
                                    <Clock size={14} className="mr-2 text-slate-400" /> Expérience Professionnelle
                                </h4>
                                {candidate.experience && candidate.experience.length > 0 ? (
                                    <div className="space-y-4">
                                        {candidate.experience.map((exp: any, i: number) => (
                                            <div key={i} className="pl-4 border-l-2 border-blue-100">
                                                <div className="text-sm font-black text-slate-900">{exp.position}</div>
                                                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">{exp.company}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{exp.duration}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm italic">Aucune expérience renseignée.</p>
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <h4 className="flex items-center text-xs font-black text-slate-900 uppercase tracking-widest mb-4">
                                    <Award size={14} className="mr-2 text-slate-400" /> Vérification Diplômes
                                </h4>
                                <div className="space-y-3">
                                    {candidate.documents?.filter((d: any) => d.document_type === 'DIPLOMA').map((doc: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <span className="text-sm font-bold text-slate-700">Diplôme {i + 1}</span>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${doc.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {doc.status === 'VERIFIED' ? 'Vérifié' : 'En attente'}
                                            </span>
                                        </div>
                                    ))}
                                    {(!candidate.documents || !candidate.documents.some((d: any) => d.document_type === 'DIPLOMA')) && (
                                        <p className="text-slate-400 text-sm italic">Aucun diplôme soumis.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certification Status */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-blue-50 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
                            <ShieldCheck className="mr-2 text-emerald-600" /> Certification Travago
                        </h3>
                        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${candidate.is_verified ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-400'}`}>
                                {candidate.is_verified ? <BadgeCheck size={32} /> : <Lock size={32} />}
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className={`text-lg font-black tracking-tight ${candidate.is_verified ? 'text-emerald-900' : 'text-slate-500'}`}>
                                    {candidate.is_verified ? 'Candidat Certifié Travago' : 'Certification en cours'}
                                </h4>
                                <p className={`text-sm font-medium leading-relaxed max-w-md ${candidate.is_verified ? 'text-emerald-700' : 'text-slate-400'}`}>
                                    {candidate.is_verified
                                        ? "Ce profil a été validé manuellement par nos experts. Identité, diplômes et compétences confirmés à 100%."
                                        : "Les documents de ce candidat sont en cours d'analyse par notre équipe de validation."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
