'use client';

import {
    ChevronLeft, Users, Zap, Search, LayoutGrid, List,
    MoreVertical, MessageSquare, Eye, Loader2,
    Calendar, CheckCircle2, XCircle, Clock, ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Application {
    id: number;
    candidate_detail: {
        id: number;
        user_detail?: {
            id: number;
            email: string;
            username: string;
            first_name?: string;
            last_name?: string;
        };
        title: string;
        location: string;
        is_verified: boolean;
        placability_score: number;
        photo?: string;
    };
    status: string;
    matching_score: number;
    applied_at: string;
}

const STAGES = [
    { id: 'PENDING', label: 'Nouvelles', color: 'bg-blue-500' },
    { id: 'SHORTLISTED', label: 'En Revue', color: 'bg-indigo-500' },
    { id: 'INTERVIEW', label: 'Entretien', color: 'bg-purple-500' },
    { id: 'PLACED', label: 'Embauché', color: 'bg-green-500' },
    { id: 'REJECTED', label: 'Refusé', color: 'bg-red-500' },
];

export default function PipelinePage() {
    const params = useParams();
    const slug = params.slug as string;
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        if (slug) fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`jobs/my-applications/?job_offer__slug=${slug}`);
            setApplications(response.data.results || response.data);
        } catch (err) {
            console.error('Failed to fetch pipeline data', err);
        } finally {
            setIsLoading(false);
        }
    };

    const moveCandidate = async (appId: number, newStatus: string) => {
        setIsUpdating(appId);
        try {
            await axiosInstance.patch(`jobs/my-applications/${appId}/update_status/`, { status: newStatus });
            setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));

            if (newStatus === 'PLACED') {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 4000);
            }

            toast.success(`Candidat déplacé vers : ${STAGES.find(s => s.id === newStatus)?.label}`);
        } catch (err) {
            toast.error("Erreur lors du déplacement du candidat.");
        } finally {
            setIsUpdating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-8 relative">
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-xl"></div>
                        <motion.div
                            initial={{ scale: 0.5, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center text-center relative z-20 border border-blue-100"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-200">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">Contrat Signé ! 🎉</h2>
                            <p className="text-slate-500 font-bold max-w-xs">Félicitations ! Vous venez de clore un placement avec succès.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Link
                        href={`/dashboard/entreprise/offres/${slug}`}
                        className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100"
                    >
                        <ChevronLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Pipeline de Recrutement</h1>
                        <p className="text-sm text-slate-500 font-medium">Glissez les candidats pour changer leur étape de recrutement.</p>
                    </div>
                </div>
            </div>

            {/* Pipeline Columns */}
            <div className="flex-1 overflow-x-auto pb-10 custom-scrollbar">
                <div className="flex gap-6 min-w-max h-full px-2">
                    {STAGES.map((stage) => {
                        const stageApps = applications.filter(app => app.status === stage.id);
                        return (
                            <div key={stage.id} className="w-80 flex flex-col bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50 group/column">
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${stage.color} shadow-lg shadow-current/20`}></div>
                                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">{stage.label}</h3>
                                        <span className="bg-white px-2.5 py-1 rounded-full text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm">
                                            {stageApps.length}
                                        </span>
                                    </div>
                                    <button className="text-slate-300 hover:text-slate-600">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>

                                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
                                    <AnimatePresence mode="popLayout">
                                        {stageApps.map((app) => {
                                            const fullName = app.candidate_detail.user_detail?.first_name
                                                ? `${app.candidate_detail.user_detail.first_name} ${app.candidate_detail.user_detail.last_name || ''}`
                                                : app.candidate_detail.user_detail?.email || 'Talent';

                                            return (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    key={app.id}
                                                    className={`bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative ${isUpdating === app.id ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="relative w-10 h-10 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm">
                                                                {app.candidate_detail.photo ? (
                                                                    <Image src={getImageUrl(app.candidate_detail.photo)} alt="" fill className="object-cover" />
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full font-black text-blue-600 text-xs">
                                                                        {fullName.substring(0, 2).toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-xs font-black text-slate-900 truncate tracking-tight">{fullName}</h4>
                                                                <p className="text-[9px] font-bold text-slate-400 truncate uppercase mt-0.5">{app.candidate_detail.title || 'Candidat'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                                                            <Zap size={14} fill="currentColor" />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                                        <div className="flex items-center text-[10px] font-black text-blue-600">
                                                            <span className="mr-1">{app.matching_score}% Match</span>
                                                        </div>

                                                        {/* Stage Quick Switcher */}
                                                        <div className="flex items-center space-x-1">
                                                            {STAGES.filter(s => s.id !== app.status).map(s => (
                                                                <button
                                                                    key={s.id}
                                                                    onClick={() => moveCandidate(app.id, s.id)}
                                                                    title={`Déplacer vers ${s.label}`}
                                                                    className={`w-6 h-6 rounded-lg ${s.color} opacity-0 group-hover:opacity-100 hover:scale-125 transition-all flex items-center justify-center text-white`}
                                                                >
                                                                    <ArrowRight size={12} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {isUpdating === app.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-3xl z-10">
                                                            <Loader2 size={24} className="text-blue-600 animate-spin" />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {stageApps.length === 0 && (
                                        <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl group-hover/column:border-blue-100 transition-colors">
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Vide</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
