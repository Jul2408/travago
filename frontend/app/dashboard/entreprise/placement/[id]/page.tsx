'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Cpu,
    Target,
    ShieldCheck,
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    Zap,
    CheckCircle2,
    XCircle,
    Download,
    Eye,
    Star
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

export default function PlacementDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [placement, setPlacement] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPlacementDetail();
    }, [id]);

    const fetchPlacementDetail = async () => {
        try {
            const response = await axiosInstance.get(`placements/${id}/`);
            setPlacement(response.data);
        } catch (err) {
            console.error("Failed to fetch placement detail", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-20 text-center text-slate-400 italic">Analyse des matches IA...</div>;
    if (!placement) return <div className="p-20 text-center text-red-500 font-black">Placement introuvable.</div>;

    return (
        <div className="space-y-10">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">ID #{placement.id}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{placement.status}</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{placement.title}</h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Download size={18} /> Exporter Rapport
                    </button>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 blur-3xl rounded-full -mt-20 -mr-20"></div>
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Description du Besoin</h3>
                            <p className="text-slate-700 font-medium leading-relaxed italic">{placement.description}</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-slate-50">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Statut Recherche</div>
                                <div className="text-sm font-black text-blue-600 uppercase italic">Active / {placement.status}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Candidats Analyse</div>
                                <div className="text-sm font-black text-slate-800">Base de Talents Certifiés Travago</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Précision Matching</div>
                                <div className="text-sm font-black text-emerald-600">Haute Fidélité IA</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full mb--16 mr--16"></div>
                    <Cpu size={40} className="text-blue-500 mb-8" />
                    <h3 className="text-2xl font-black italic mb-4 tracking-tight">Analyse Algorithmique en cours...</h3>
                    <div className="space-y-6">
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 animate-pulse" style={{ width: `${placement.progress}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            {placement.progress}% de la base de données analysée
                        </p>
                    </div>
                </div>
            </div>

            {/* Matches Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase italic">
                        <Zap className="text-blue-600" /> Sélection Travago Elite ({placement.matches_detail?.length || 0})
                    </h2>
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        Meilleurs Profils Détectés
                    </span>
                </div>

                <div className="grid xl:grid-cols-2 gap-8">
                    {placement.matches_detail?.length === 0 ? (
                        <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center">
                            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Recherche des meilleurs talents en cours...</p>
                        </div>
                    ) : (
                        placement.matches_detail?.map((candidate: any, i: number) => (
                            <div key={candidate.id} className="group bg-white rounded-[3rem] p-10 border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all relative overflow-hidden">
                                <div className="absolute top-8 right-8 w-16 h-16 bg-blue-50/50 rounded-full flex items-center justify-center text-blue-600 font-black italic">
                                    #{i + 1}
                                </div>
                                <div className="flex gap-8 items-start">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 relative shrink-0">
                                        {candidate.photo ? (
                                            <Image src={getImageUrl(candidate.photo)} alt="" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200"><Cpu size={40} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-100">Vérifié</span>
                                            {candidate.placability_score > 80 && (
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-100 flex items-center gap-1">
                                                    <Star size={8} fill="currentColor" /> Elite
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter">
                                            {candidate.title || "Expert Travago"}
                                        </h4>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {candidate.location || "Cameroun"}</span>
                                            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Documents OK</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-10">
                                    <div className="p-6 bg-slate-50 group-hover:bg-blue-50/50 rounded-2xl border border-transparent group-hover:border-blue-100 transition-all">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Score Matching IA</div>
                                        <div className="text-2xl font-black text-blue-600 italic">{candidate.placability_score || 85}%</div>
                                    </div>
                                    <div className="p-6 bg-slate-50 group-hover:bg-blue-50/50 rounded-2xl border border-transparent group-hover:border-blue-100 transition-all text-right">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Expérience</div>
                                        <div className="text-2xl font-black text-slate-900 italic">{candidate.experience_years}+ Ans</div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <Link href={`/dashboard/entreprise/candidats/${candidate.id}`} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg group-hover:shadow-blue-200">
                                        Consulter Dossier <Eye size={18} className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Guaranteed Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center">
                        <ShieldCheck size={40} className="text-blue-100" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tight">Protection Recruit-Trust</h4>
                        <p className="text-blue-50/80 font-medium">Tous ces profils ont été vérifiés physiquement par nos équipes.</p>
                    </div>
                </div>
                <button className="px-10 py-5 bg-white text-blue-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                    Demander une interview assistée
                </button>
            </div>
        </div>
    );
}
