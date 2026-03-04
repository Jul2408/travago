'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    Download,
    TrendingUp
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Transaction {
    id: number;
    reference: string;
    amount: number;
    credits_amount: number;
    transaction_type: string;
    payment_method: string;
    phone_number: string;
    status: string;
    created_at: string;
    user_detail?: {
        email: string;
        username: string;
    }
}

export default function AdminFinancesPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axiosInstance.get('users/admin/transactions/');
            // Handle pagination if present
            const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        totalRevenue: transactions
            .filter(t => t.status === 'COMPLETED')
            .reduce((acc, curr) => acc + Number(curr.amount), 0),
        pendingVolume: transactions
            .filter(t => t.status === 'PENDING')
            .reduce((acc, curr) => acc + Number(curr.amount), 0),
        completedCount: transactions.filter(t => t.status === 'COMPLETED').length,
        failRate: transactions.length > 0
            ? Math.round((transactions.filter(t => t.status === 'FAILED').length / transactions.length) * 100)
            : 0
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.reference.toLowerCase().includes(search.toLowerCase()) ||
            t.user_detail?.email.toLowerCase().includes(search.toLowerCase()) ||
            t.phone_number?.includes(search);
        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white -mx-8 -mt-8 p-10 border-b border-slate-100 italic">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">Flux Financiers</h1>
                    <p className="text-slate-500 font-medium">Contrôle des revenus et des transactions de crédits.</p>
                </div>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                    <Download size={18} />
                    Exporter (CSV)
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Revenu Total", val: `${stats.totalRevenue.toLocaleString()} FCFA`, icon: <DollarSign />, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12%" },
                    { label: "Volume en attente", val: `${stats.pendingVolume.toLocaleString()} FCFA`, icon: <Clock />, color: "text-amber-600", bg: "bg-amber-50", trend: "En cours" },
                    { label: "Paiements Réussis", val: stats.completedCount, icon: <CheckCircle2 />, color: "text-blue-600", bg: "bg-blue-50", trend: `${transactions.length} total` },
                    { label: "Taux d'échec", val: `${stats.failRate}%`, icon: <TrendingUp />, color: "text-red-600", bg: "bg-red-50", trend: "Global" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                            {stat.icon}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                        <div className={`text-2xl font-black ${stat.color} tracking-tighter mb-2 italic`}>{stat.val}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black py-0.5 px-2 bg-slate-50 rounded-full text-slate-400 uppercase">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="RECHERCHER RÉFÉRENCE, EMAIL OU NUMÉRO..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-16 pr-6 font-bold text-xs uppercase tracking-widest focus:ring-2 ring-blue-500/20 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${statusFilter === s
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                    }`}
                            >
                                {s === 'ALL' ? 'TOUS' : s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-10 py-6">Référence / Date</th>
                                <th className="px-10 py-6">Utilisateur</th>
                                <th className="px-10 py-6">Détails Paiement</th>
                                <th className="px-10 py-6 text-right">Montant</th>
                                <th className="px-10 py-6 text-center">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic">Analyse des flux financiers...</td></tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic">Aucune transaction trouvée.</td></tr>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="text-sm font-black text-slate-800 tracking-tighter uppercase mb-1">#{t.reference}</div>
                                            <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 font-black underline decoration-blue-100">
                                                <Clock size={10} />
                                                {format(new Date(t.created_at), 'dd MMM yyyy, HH:mm', { locale: fr })}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-sm font-black text-slate-900 leading-none mb-1">{t.user_detail?.username || 'Utilisateur'}</div>
                                            <div className="text-[10px] text-blue-400 lowercase italic">{t.user_detail?.email}</div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-white transition-colors">
                                                    {t.payment_method === 'OM' ? 'OM' : 'MO'}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-slate-800 uppercase tracking-tighter">{t.payment_method === 'OM' ? 'Orange Money' : 'MTN MoMo'}</div>
                                                    <div className="text-[10px] text-slate-400 font-black">{t.phone_number}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right font-black text-slate-900 italic tracking-tighter">
                                            {Number(t.amount).toLocaleString()} FCFA
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    t.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-red-50 text-red-600 border border-red-100'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
