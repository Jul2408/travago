'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Mail, MapPin, Briefcase, Calendar, CheckCircle, XCircle, ArrowLeft, Shield, Star, Award, Zap, FileText } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

interface CandidateDetail {
    id: number;
    user_detail: {
        id: number;
        email: string;
        username: string;
        first_name: string;
        last_name: string;
        is_active: boolean;
        photo: string | null;
        test_results: Array<{
            id: number;
            test_detail: { title: string; category: string };
            score: number;
            completed_at: string;
        }>;
    };
    title: string;
    location: string;
    bio: string;
    is_verified: boolean;
    placability_score: number;
    reliability_score: number;
    created_at: string;
    skills: string[];
    documents: Array<{
        id: number;
        document_type: string;
        file: string;
        status: string;
        rejection_reason?: string;
    }>;
    applications: Array<{
        id: number;
        job_offer_detail: { title: string; company_detail: { name: string } };
        status: string;
        matching_score: number;
        applied_at: string;
    }>;
}

export default function CandidateDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCandidate();
    }, [id]);

    const fetchCandidate = async () => {
        try {
            const response = await axiosInstance.get(`users/admin/candidate-profiles/${id}/`);
            setCandidate(response.data);
        } catch (error) {
            console.error("Failed to fetch candidate", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVerify = async () => {
        if (!candidate) return;
        const action = candidate.is_verified ? 'unverify' : 'verify';
        try {
            const response = await axiosInstance.post(`users/admin/candidate-profiles/${id}/${action}/`);
            setCandidate(response.data);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const toggleUserStatus = async () => {
        if (!candidate) return;
        try {
            const userId = candidate.user_detail.id;
            await axiosInstance.post(`users/admin/users/${userId}/toggle_status/`);
            fetchCandidate(); // Refresh data
        } catch (error) {
            console.error("Failed to toggle user status", error);
        }
    };

    const verifyDocument = async (docId: number) => {
        if (!confirm("Confirmer la validation de ce document ?")) return;
        try {
            await axiosInstance.post(`users/documents/${docId}/verify/`);
            fetchCandidate();
            toast.success("Document validé avec succès.");
        } catch (error) {
            console.error("Failed to verify document", error);
            toast.error("Erreur lors de la validation.");
        }
    };

    const rejectDocument = async (docId: number) => {
        const reason = prompt("Veuillez saisir le motif du rejet (sera envoyé au candidat) :");
        if (!reason) return;

        try {
            await axiosInstance.post(`users/documents/${docId}/reject/`, { reason });
            fetchCandidate();
            toast.success("Document rejeté et candidat notifié.");
        } catch (error) {
            console.error("Failed to reject document", error);
            toast.error("Erreur lors du rejet.");
        }
    };

    if (isLoading) return <div className="p-10 text-center font-black animate-pulse text-slate-400">CHARGEMENT DU PROFIL TALENT...</div>;
    if (!candidate) return <div className="p-10 text-center font-black text-red-500">CANDIDAT NON TROUVÉ.</div>;

    const getAppStatusBadge = (status: string) => {
        switch (status) {
            case 'PLACED': return 'bg-emerald-100 text-emerald-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Retour à la liste
            </button>

            <div className="bg-white rounded-[3rem] border border-blue-50 shadow-xl overflow-hidden">
                {/* Header Profile */}
                <div className="bg-slate-900 h-48 relative">
                    <div className="absolute -bottom-16 left-12 w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl">
                        <div className="w-full h-full rounded-[2.2rem] bg-white flex items-center justify-center text-4xl font-black text-blue-600 relative overflow-hidden">
                            {candidate.user_detail.photo ? (
                                <Image
                                    src={getImageUrl(candidate.user_detail.photo)}
                                    alt="Talent"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="opacity-20"><User size={64} /></div>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-6 right-12 flex gap-3">
                        <button
                            onClick={toggleVerify}
                            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${candidate.is_verified ? 'bg-red-50 text-red-600 shadow-red-200 hover:bg-red-100' : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'}`}
                        >
                            {candidate.is_verified ? 'Révoquer Validation' : 'Valider le Profil'}
                        </button>
                    </div>
                </div>

                <div className="mt-20 px-12 pb-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2 flex items-center gap-3">
                                    {candidate.user_detail.first_name} {candidate.user_detail.last_name}
                                    {candidate.is_verified && <CheckCircle className="text-blue-500" size={28} />}
                                </h1>
                                <p className="text-xl font-bold text-slate-400 italic">@{candidate.user_detail.username} • {candidate.title || 'Expert non spécifié'}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact & Localisation</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-600 font-bold overflow-hidden">
                                            <Mail size={16} className="text-blue-500 shrink-0" /> <span className="truncate">{candidate.user_detail.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-bold">
                                            <MapPin size={16} className="text-blue-500 shrink-0" /> {candidate.location || 'Distanciel'}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Meta Données System</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                            <Calendar size={16} className="text-blue-500 shrink-0" /> Inscription: {new Date(candidate.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
                                            <Shield size={16} className="shrink-0" /> Status: {candidate.is_verified ? 'VALIDÉ' : 'EN ATTENTE'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Biographie Expert</h3>
                                <div className="text-slate-500 font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    {candidate.bio || "Ce candidat n'a pas encore rédigé sa biographie professionnelle. Le profil est en cours de complétion."}
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center">
                                        <Briefcase className="mr-2 text-blue-600" size={20} /> Candidatures
                                    </h3>
                                    <div className="space-y-3">
                                        {!candidate.applications?.length ? (
                                            <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold text-xs uppercase italic border-2 border-dashed border-slate-100">Aucune candidature</div>
                                        ) : (
                                            candidate.applications.map(app => (
                                                <div key={app.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="font-bold text-slate-800 text-sm truncate">{app.job_offer_detail.title}</div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{app.job_offer_detail.company_detail.name}</div>
                                                    <div className="flex justify-between items-center">
                                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${getAppStatusBadge(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                        <span className="text-[10px] font-black text-blue-600 italic">Score: {app.matching_score}%</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center">
                                    <Award className="mr-2 text-amber-500" size={20} /> Résultats aux Tests IA
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {!candidate.user_detail.test_results?.length ? (
                                        <div className="col-span-2 p-6 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold text-xs uppercase italic border-2 border-dashed border-slate-100">Aucun test passé</div>
                                    ) : (
                                        candidate.user_detail.test_results.map(result => (
                                            <div key={result.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all flex justify-between items-center group">
                                                <div>
                                                    <div className="font-black text-slate-800 text-sm italic">{result.test_detail.title}</div>
                                                    <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{result.test_detail.category}</div>
                                                    <div className="text-[9px] text-slate-400 mt-1 uppercase font-bold">Complété le {new Date(result.completed_at).toLocaleDateString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xl font-black italic ${result.score >= 80 ? 'text-emerald-500' : 'text-blue-600'}`}>
                                                        {result.score}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center">
                                    <FileText className="mr-2 text-indigo-600" size={20} /> Documents & CV
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {!candidate.documents?.length ? (
                                        <div className="col-span-2 p-6 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold text-xs uppercase italic">Aucun document</div>
                                    ) : (
                                        candidate.documents.map(doc => (
                                            <div key={doc.id} className={`p-4 rounded-2xl border transition-all group relative ${doc.status === 'VERIFIED' ? 'bg-emerald-50 border-emerald-100' : doc.status === 'REJECTED' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${doc.status === 'VERIFIED' ? 'bg-white text-emerald-600 border-emerald-200' : doc.status === 'REJECTED' ? 'bg-white text-red-600 border-red-200' : 'bg-slate-50 text-slate-400'}`}>
                                                            <FileText size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-[10px] text-slate-700 uppercase tracking-widest truncate max-w-[150px]" title={doc.document_type}>{doc.document_type}</div>
                                                            <div className={`text-[9px] font-bold uppercase ${doc.status === 'VERIFIED' ? 'text-emerald-600' : doc.status === 'REJECTED' ? 'text-red-500' : 'text-amber-500'}`}>
                                                                {doc.status === 'VERIFIED' ? 'Vérifié' : doc.status === 'REJECTED' ? 'Rejeté' : 'En Attente'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {doc.status === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => verifyDocument(doc.id)}
                                                                    className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                                    title="Valider"
                                                                >
                                                                    <CheckCircle size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => rejectDocument(doc.id)}
                                                                    className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                    title="Rejeter"
                                                                >
                                                                    <XCircle size={14} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {doc.status === 'REJECTED' && (
                                                    <div className="mt-2 text-[9px] text-red-500 font-medium bg-white p-2 rounded-lg border border-red-100">
                                                        Motif: {doc.rejection_reason}
                                                    </div>
                                                )}

                                                <a
                                                    href={getImageUrl(doc.file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full text-center py-2 mt-2 bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 transition-all"
                                                >
                                                    Voir le Fichier
                                                </a>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform">
                                    <Zap size={150} className="text-blue-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center relative z-10">
                                    <Star className="mr-3 text-amber-500" /> Score Profil
                                </h3>
                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            <span>Qualité du Dossier</span>
                                            <span className="text-blue-600">{candidate.placability_score}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${candidate.placability_score}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            <span>Fiabilité (Docs)</span>
                                            <span className="text-indigo-600">{candidate.reliability_score}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${candidate.reliability_score}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl">
                                <h3 className="text-lg font-black mb-6 flex items-center">
                                    <Shield className="mr-3 text-blue-400" /> Administration
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        Envoyer Message
                                    </button>
                                    <button
                                        onClick={toggleUserStatus}
                                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${candidate.user_detail.is_active ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20'}`}
                                    >
                                        {candidate.user_detail.is_active ? 'Suspendre Compte' : 'Réactiver Compte'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
