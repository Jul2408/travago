'use client';

import {
    Cpu,
    Zap,
    Target,
    ShieldCheck,
    ChevronRight,
    Clock,
    Plus,
    Search,
    Award,
    CheckCircle2,
    ArrowUpRight,
    X,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlacementIAPage() {
    const [activePlacements, setActivePlacements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget_credits: 250
    });

    useEffect(() => {
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('placements/');
            const data = response.data.results !== undefined ? response.data.results : response.data;
            setActivePlacements(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch placements", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await axiosInstance.post('placements/', formData);
            setShowModal(false);
            setFormData({ title: '', description: '', budget_credits: 250 });
            fetchPlacements();
        } catch (err) {
            console.error("Failed to create placement", err);
            alert("Erreur lors de la création du placement. Vérifiez vos crédits.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Pilotage des Placements IA</h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">Suivez l'avancement de vos chasses automatisées en temps réel.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs sm:text-sm flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                    <Plus size={18} className="mr-2 text-white" /> Lancer une nouvelle chasse
                </button>
            </div>

            {/* AI Status Card - Deep Blue */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-10">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-[2rem] border border-white/20 flex items-center justify-center shrink-0">
                        <Cpu size={32} className="text-blue-200 animate-pulse sm:w-12 sm:h-12" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tight">Algorithme Travago v2.5</h3>
                        <p className="text-blue-100/80 text-sm sm:text-base font-medium max-w-xl">
                            Le moteur de placement analyse actuellement <span className="text-white font-black underline">5,842 profils certifiés</span>.
                            Précision de matching garantie : <span className="text-white font-black">98.4%</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Placement List */}
            <div className="grid lg:grid-cols-2 gap-8">
                {isLoading ? (
                    <div className="col-span-2 text-center py-20 text-slate-400">
                        <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                        Chargement des placements...
                    </div>
                ) : activePlacements.length === 0 ? (
                    <div className="col-span-2 text-center py-20 bg-slate-50 rounded-[3rem] border border-blue-50">
                        <p className="text-slate-500 font-medium italic">Aucun placement actif.</p>
                    </div>
                ) : (
                    activePlacements.map((placement) => (
                        <div key={placement.id} className="group bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-blue-50 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all">
                            <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-2">{placement.title}</h3>
                                    <div className="flex items-center space-x-3">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                            {placement.status}
                                        </span>
                                        <div className="flex items-center text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                                            {placement.progress === 100 ? 'Analyse terminée' : 'Recherche IA en cours'}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                    <Target size={28} />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <span>Progression Algorithmique</span>
                                        <span className="text-blue-600 font-black">{placement.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${placement.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="p-4 sm:p-5 bg-blue-50 rounded-2xl border border-blue-100">
                                        <div className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Dossiers Matchés</div>
                                        <div className="text-xl sm:text-2xl font-black text-blue-700">{placement.matches?.length || 0}</div>
                                    </div>
                                    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Engagé</div>
                                        <div className="text-xs sm:text-sm font-black text-slate-900 truncate">{placement.budget_credits} Crédits</div>
                                    </div>
                                </div>

                                <Link href={`/dashboard/entreprise/placement/${placement.id}`} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg">
                                    Voir la sélection IA <ChevronRight size={18} className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}

                {/* Grid placeholder/Trigger */}
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border-2 border-dashed border-blue-100 p-6 sm:p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-blue-50/10 hover:border-blue-400 transition-all"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-[1.5rem] sm:rounded-3xl flex items-center justify-center text-blue-200 mb-6 group-hover:text-blue-600 group-hover:bg-blue-100 transition-all shrink-0">
                        <Plus size={32} className="sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tight">Lancer une nouvelle recherche</h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-xs mb-8 sm:mb-10 leading-relaxed italic">
                        Notre IA définit les critères, valide les diplômes et vous présente le <span className="text-blue-600 font-bold">Top 3</span>.
                    </p>
                    <span className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-white border border-blue-100 text-blue-600 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest group-hover:border-blue-600 group-hover:shadow-xl transition-all">
                        Lancer l'Agent IA
                    </span>
                </button>
            </div>

            {/* Modal de création */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2rem] sm:rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black italic text-slate-800 uppercase tracking-tight">Nouvelle Mission IA</h2>
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Protocole automatisé</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm shrink-0">
                                    <X size={20} className="sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Titre du poste recherché</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ex: Senior Fullstack Developer (Node/React)"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-5 font-bold text-sm outline-none transition-all"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Besoin détaillé (IA contextuelle)</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Décrivez les compétences clés, le contexte du projet..."
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-5 font-bold text-sm outline-none transition-all"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="p-4 sm:p-6 bg-blue-50 rounded-[1.5rem] sm:rounded-[2rem] border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                                <Zap size={20} className="sm:w-6 sm:h-6" />
                                            </div>
                                            <div>
                                                <div className="text-[9px] sm:text-[10px] font-black text-blue-900 uppercase tracking-widest">Coût Mission</div>
                                                <div className="text-lg sm:text-xl font-black text-blue-600">250 Crédits</div>
                                            </div>
                                        </div>
                                        <p className="text-[9px] sm:text-[10px] font-bold text-blue-400 uppercase italic text-left sm:text-right max-w-[200px] sm:max-w-[150px]">
                                            Inclut KYC et matching algorithmique v2.5
                                        </p>
                                    </div>
                                </div>

                                <button
                                    disabled={isCreating}
                                    type="submit"
                                    className="w-full py-5 sm:py-6 bg-slate-900 text-white rounded-[1.5rem] sm:rounded-[2rem] font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2 sm:gap-3"
                                >
                                    {isCreating ? <Loader2 className="animate-spin" /> : <Target size={20} />}
                                    Confirmer et Lancer la Recherche
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Help/Notice */}
            <div className="p-6 sm:p-8 bg-blue-50 border border-blue-100 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 text-blue-900">
                <ShieldCheck size={28} className="text-blue-600 shrink-0 sm:w-8 sm:h-8" />
                <p className="text-xs sm:text-sm font-medium leading-relaxed italic">
                    <strong>Garantie Travago :</strong> Tous les candidats présentés dans la section "Matches IA" ont un profil certifié, des documents d'identité validés et une fiabilité vérifiée à 100%.
                </p>
            </div>
        </div>
    );
}
