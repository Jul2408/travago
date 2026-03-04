'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, History, User, Lock, Eye, AlertTriangle, Terminal } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityItem {
    id: string;
    text: string;
    subtext: string;
    type: 'info' | 'warning' | 'error' | 'success';
    time: string;
    category: string;
}

export default function AdminSecurityPage() {
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axiosInstance.get('users/admin/stats/');
            setActivity(response.data.recent_activity || []);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sécurité & Journaux</h1>
                    <p className="text-slate-500 font-medium">Historique complet des actions administratives (audit trail).</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center">
                        <Shield className="mr-2" size={14} /> WAF Actif
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: "Tentatives Login", val: "0", color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Modifs Admin", val: activity.length, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Alertes Critiques", val: "0", color: "text-red-600", bg: "bg-red-50" },
                    { label: "IP Bloquées", val: "12", color: "text-slate-600", bg: "bg-slate-50" },
                ].map((s, i) => (
                    <div key={i} className={`p-6 rounded-3xl ${s.bg} border-2 border-white shadow-sm`}>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</div>
                        <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-sm relative overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-800 flex items-center">
                        <Terminal className="mr-3 text-slate-800" /> Audit Trail (Django LogEntry)
                    </h3>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Consignation temps réel
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Utilisateur</th>
                                <th className="px-8 py-4">Action</th>
                                <th className="px-8 py-4">Objet / Module</th>
                                <th className="px-8 py-4">Horodatage</th>
                                <th className="px-8 py-4 text-right">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-10 text-center font-bold text-slate-400">Scan des journaux...</td></tr>
                            ) : activity.length === 0 ? (
                                <tr><td colSpan={5} className="p-10 text-center font-bold text-slate-400">Aucun log de sécurité.</td></tr>
                            ) : (
                                activity.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">
                                                    {log.text.split(':')[0].substring(0, 2)}
                                                </div>
                                                <span className="font-bold text-slate-700">{log.text.split(':')[0]}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${log.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                                    log.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                                                        log.type === 'error' ? 'bg-red-50 text-red-600' :
                                                            'bg-blue-50 text-blue-600'
                                                }`}>
                                                {log.text.split(':')[1]?.trim().split(' ')[0] || 'ACTION'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-bold text-slate-800">{log.text.split(' : ')[1]?.split(' ').slice(1).join(' ') || log.text}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">{log.subtext}</div>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-bold text-slate-400">
                                            {formatDistanceToNow(new Date(log.time), { addSuffix: true, locale: fr })}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm">
                                                <Eye size={16} />
                                            </button>
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
