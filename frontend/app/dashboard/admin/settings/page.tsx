'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, AlertTriangle, ShieldCheck, DollarSign, Wrench } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface SystemSetting {
    id: number;
    key: string;
    value: any;
    description: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axiosInstance.get('users/admin/settings/');
            // Handle both paginated (with results) and non-paginated (simple array) responses
            const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSetting = async (id: number, newValue: any) => {
        try {
            await axiosInstance.patch(`users/admin/settings/${id}/`, { value: newValue });
            setMessage({ type: 'success', text: "Paramètre mis à jour avec succès !" });
            fetchSettings();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: "Erreur lors de la mise à jour." });
        }
    };

    const getIcon = (key: string) => {
        if (key.includes('price')) return <DollarSign className="text-emerald-500" />;
        if (key.includes('maintenance')) return <Wrench className="text-amber-500" />;
        return <Settings className="text-blue-500" />;
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white -mx-8 -mt-8 p-10 border-b border-slate-100">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">Configuration Système</h1>
                    <p className="text-slate-500 font-medium">Pilotez les paramètres critiques de la plateforme en temps réel.</p>
                </div>
            </div>

            {message && (
                <div className={`p-6 rounded-3xl font-black uppercase tracking-widest text-xs border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 uppercase italic flex items-center gap-3">
                        <ShieldCheck className="text-blue-600" /> Paramètres Actifs
                    </h3>

                    {isLoading ? (
                        <div className="p-10 text-center text-slate-400 font-bold uppercase italic">Chargement...</div>
                    ) : (
                        settings.map((s) => (
                            <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                            {getIcon(s.key)}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-800 uppercase italic tracking-tighter">{s.key.replace(/_/g, ' ')}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">{s.description}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {typeof s.value === 'boolean' ? (
                                        <button
                                            onClick={() => handleUpdateSetting(s.id, !s.value)}
                                            className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${s.value ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 text-slate-400 hover:bg-emerald-500 hover:text-white'}`}
                                        >
                                            {s.value ? 'DÉSACTIVER (MAINTENANCE ON)' : 'ACTIVER'}
                                        </button>
                                    ) : (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="number"
                                                defaultValue={s.value}
                                                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 font-black text-slate-800 focus:outline-none focus:border-blue-300 transition-all"
                                                id={`input-${s.id}`}
                                            />
                                            <button
                                                onClick={() => {
                                                    const val = (document.getElementById(`input-${s.id}`) as HTMLInputElement).value;
                                                    const numVal = parseFloat(val);
                                                    if (!isNaN(numVal)) {
                                                        handleUpdateSetting(s.id, numVal);
                                                    } else {
                                                        setMessage({ type: 'error', text: "Veuillez entrer un nombre valide." });
                                                        setTimeout(() => setMessage(null), 3000);
                                                    }
                                                }}
                                                className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all shadow-xl"
                                            >
                                                <Save size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10 text-center py-10">
                        <AlertTriangle size={60} className="text-amber-400 mx-auto mb-6 animate-pulse" />
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-amber-400">Zone de Danger</h3>
                        <p className="text-slate-400 font-bold text-sm uppercase leading-relaxed mb-10">
                            Toute modification ici affecte instantanément l'économie et l'accessibilité de la plateforme. Manipulez avec précaution.
                        </p>
                        <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-xl text-left">
                            <h4 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldCheck size={16} /> Protocoles de sécurité
                            </h4>
                            <ul className="space-y-3 text-[10px] font-bold text-slate-300 uppercase italic">
                                <li>• Les changements de prix sont immédiats.</li>
                                <li>• Le mode maintenance déconnecte les utilisateurs non-admins.</li>
                                <li>• Chaque modification est auditée dans le journal système.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
