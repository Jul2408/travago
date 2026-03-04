'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Target, Building2, Calendar, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams } from 'next/navigation';

interface PlacementRequest {
    id: number;
    title: string;
    company_name?: string;
    status: string;
    progress: number;
    created_at: string;
    description?: string;
    requirements?: string;
}

export default function PlacementDetailPage() {
    const params = useParams();
    const id = params?.id;
    const [placement, setPlacement] = useState<PlacementRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPlacement();
        }
    }, [id]);

    const fetchPlacement = async () => {
        try {
            const response = await axiosInstance.get(`users/admin/placements/${id}/`);
            setPlacement(response.data);
        } catch (error) {
            console.error("Failed to fetch placement", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!placement) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-slate-800">Placement introuvable</h2>
                <Link href="/dashboard/admin/placements" className="text-blue-600 hover:underline mt-4 block">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <Link href="/dashboard/admin/placements" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm">
                <ArrowLeft size={16} className="mr-2" />
                Retour aux Placements
            </Link>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                IA Matching Engine
                            </span>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${placement.status === 'SOURCING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                {placement.status === 'SOURCING' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                {placement.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">
                            {placement.title}
                        </h1>
                        <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                            <span className="flex items-center gap-2">
                                <Building2 size={16} />
                                {placement.company_name || 'Entreprise Inconnue'}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={16} />
                                {format(new Date(placement.created_at), 'dd MMMM yyyy', { locale: fr })}
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl min-w-[300px]">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                            <span className="text-slate-500">Précision IA</span>
                            <span className="text-blue-600">{placement.progress}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                                style={{ width: `${placement.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wide">
                            Matching en cours d'analyse...
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                            <Target className="text-blue-600" size={20} />
                            Description du Poste
                        </h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {placement.description || "Aucune description fournie."}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                            <CheckCircle className="text-emerald-600" size={20} />
                            Pré-requis & Compétences
                        </h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {placement.requirements || "Aucun pré-requis spécifié."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
