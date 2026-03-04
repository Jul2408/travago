'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Landmark, ArrowUpRight, ArrowDownRight, Users, Briefcase, CreditCard } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface FinanceStats {
    total_credits: number;
    credits_by_role: {
        CANDIDATE: number;
        COMPANY: number;
    };
}

export default function AdminFinancePage() {
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            const response = await axiosInstance.get('users/admin/stats/');
            const data = response.data.stats;

            setStats({
                total_credits: data.total_credits || 0,
                credits_by_role: {
                    CANDIDATE: data.credits_by_role?.CANDIDATE || 0,
                    COMPANY: data.credits_by_role?.COMPANY || 0
                }
            });
        } catch (error) {
            console.error("Failed to fetch finance stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white -mx-8 -mt-8 p-10 border-b border-slate-100">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">Flux Financiers & Crédits</h1>
                    <p className="text-slate-500 font-medium">Monitoring de la monnaie interne (₺) et des portefeuilles utilisateurs.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                    <button className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-white text-slate-900 shadow-sm border border-slate-200">
                        Vue Globale
                    </button>
                    <button className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                        Revenus
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group border border-slate-800 shadow-2xl">
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                        <DollarSign size={200} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/40">
                            <Landmark size={28} />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 whitespace-nowrap">Trésorerie Plateforme (TOTALE)</div>
                        <div className="text-5xl font-black italic tracking-tighter mb-4">
                            {isLoading ? '...' : stats?.total_credits.toLocaleString()} <span className="text-xl text-blue-400">₺</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-500/20">Sync Real-time</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-sm hover:shadow-xl transition-all">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <Users size={28} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Volume Talent / Candidats</div>
                    <div className="text-3xl font-black text-slate-800 tracking-tight">
                        {isLoading ? '...' : stats?.credits_by_role.CANDIDATE.toLocaleString()} <span className="text-sm">₺</span>
                    </div>
                    <p className="mt-4 text-xs font-bold text-slate-400 italic">Total des portefeuilles talents actifs.</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-sm hover:shadow-xl transition-all font-sans">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <Briefcase size={28} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Volume Entreprises</div>
                    <div className="text-3xl font-black text-slate-800 tracking-tight">
                        {isLoading ? '...' : stats?.credits_by_role.COMPANY.toLocaleString()} <span className="text-sm">₺</span>
                    </div>
                    <p className="mt-4 text-xs font-bold text-slate-400 italic">Crédits pré-chargés par les recruteurs.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-sm p-10">
                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center uppercase italic">
                        <CreditCard className="mr-3 text-blue-600" /> Transactions Récentes (Journal)
                    </h3>
                    <div className="space-y-4">
                        {[
                            { id: 1, type: "Achat Crédits", user: "Enterprise Alpha", amount: "+5,000", status: "Confirmé", date: "Aujourd'hui" },
                            { id: 2, type: "Frais Matching IA", user: "Candidat Digital", amount: "-150", status: "Débité", date: "Aujourd'hui" },
                            { id: 3, type: "Boost Annonce Premium", user: "Global Recruitment", amount: "-500", status: "Confirmé", date: "Hier" },
                        ].map(t => (
                            <div key={t.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${t.amount.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {t.amount.startsWith('+') ? '$' : '₺'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase italic">{t.type}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">{t.user} • {t.date}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-black ${t.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-900'}`}>{t.amount}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-sm p-10 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                    <h3 className="text-xl font-black text-slate-800 mb-8 italic uppercase tracking-tighter">Performance financière 💹</h3>
                    <div className="space-y-8">
                        {[
                            { label: "Vente de Crédits", val: 65, color: "bg-blue-600", amount: "1.2M ₺" },
                            { label: "Commissions IA", val: 20, color: "bg-purple-600", amount: "450k ₺" },
                        ].map((r, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                                    <span className="text-slate-400">{r.label}</span>
                                    <span className="text-slate-800">{r.amount}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                    <div className={`h-full ${r.color} rounded-full transition-all duration-1000`} style={{ width: `${r.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">Prévisionnel 30 jours</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase italic">
                            Croissance stable estimée de <span className="text-blue-600">+12%</span> par rapport au trimestre précédent.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
