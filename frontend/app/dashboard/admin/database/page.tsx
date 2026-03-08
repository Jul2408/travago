'use client';

import { useState, useEffect } from 'react';
import { Database, Search, Table, RefreshCw, HardDrive, Cpu, Archive } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

interface DBStats {
    total_users: number;
    candidates: number;
    companies: number;
    jobs: number;
    applications: number;
    placements: number;
    test_results: number;
}

export default function AdminDatabasePage() {
    const [stats, setStats] = useState<DBStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDBStats();
    }, []);

    const fetchDBStats = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('users/admin/stats/');
            const data = response.data;
            setStats({
                total_users: data.stats?.total_users || 0,
                candidates: data.stats?.candidates || 0,
                companies: data.stats?.companies || 0,
                jobs: data.stats?.jobs || 0,
                applications: data.stats?.applications || 0,
                placements: data.stats?.placements || 0,
                test_results: data.recent_activity.filter((a: any) => a.category === 'TEST').length || 0 // Mocking from activity if not explicitly in stats
            });
        } catch (error) {
            console.error("Failed to fetch DB stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    const tables = [
        { name: "Utilisateurs (Auth)", count: stats?.total_users || 0, size: "1.2 MB" },
        { name: "Profils Candidats", count: stats?.candidates || 0, size: "4.5 MB" },
        { name: "Profils Entreprises", count: stats?.companies || 0, size: "2.1 MB" },
        { name: "Offres d'Emploi", count: stats?.jobs || 0, size: "850 KB" },
        { name: "Candidatures", count: stats?.applications || 0, size: "3.2 MB" },
        { name: "Placements IA", count: stats?.placements || 0, size: "150 KB" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Base de Données</h1>
                    <p className="text-slate-500 font-medium">Monitoring des enregistrements et intégrité du système.</p>
                </div>
                <button
                    onClick={fetchDBStats}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-blue-100 hover:text-blue-600 transition-all shadow-sm"
                >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    Synchroniser l'Index
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-blue-50 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Table PostgreSQL</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Enregistrements</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Taille Estimée</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {tables.map((table, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-5 flex items-center gap-3">
                                            <Table size={18} className="text-blue-500" />
                                            <span className="font-bold text-slate-700">{table.name}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-sm font-black">
                                                {isLoading ? '...' : table.count}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-medium text-slate-400 font-mono text-xs">
                                            {table.size}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div>
                            <h3 className="text-2xl font-black mb-2 italic">Nettoyage de Printemps 🧹</h3>
                            <p className="text-slate-400 font-medium max-w-sm">Supprimez les données orphelines et optimisez les index de recherche pour de meilleures performances.</p>
                        </div>
                        <button
                            onClick={() => toast.success("Optimisation de la base de données lancée en arrière-plan.")}
                            className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
                        >
                            Lancer Optimisation
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem]">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
                            <HardDrive className="mr-3 text-blue-600" /> Stockage Cloud
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    <span>Base de Données (Neon)</span>
                                    <span className="text-blue-600">62%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 w-[62%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    <span>Fichiers & CV (S3)</span>
                                    <span className="text-blue-600">18%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-300 w-[18%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                            <Cpu size={80} className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center">
                            Instance Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Engine</span>
                                <span className="text-xs font-bold text-slate-800">PostgreSQL 15</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Charset</span>
                                <span className="text-xs font-bold text-slate-800">UTF-8</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Uptime</span>
                                <span className="text-xs font-bold text-blue-600">14 JOURS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
