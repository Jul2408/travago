'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Shield, Mail, Edit, XCircle } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    date_joined?: string; // Standard Django user model has date_joined, but serializer might not send it. admin_stats does.
    last_login?: string;
    candidate_profile?: { id: number };
    company_profile?: { id: number };
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchUsers = async (search?: string) => {
        try {
            setIsLoading(true);
            const params = search ? { search } : {};
            const response = await axiosInstance.get('users/admin/users/', { params });
            const data = response.data;
            const usersList = Array.isArray(data) ? data : (data.results || []);
            setUsers(usersList);
        } catch (error) {
            console.error("Failed to fetch users", error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Jamais';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-700';
            case 'COMPANY':
                return 'bg-blue-100 text-blue-700';
            case 'CANDIDATE':
                return 'bg-emerald-100 text-emerald-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'ADMIN';
            case 'COMPANY': return 'ENTREPRISE';
            case 'CANDIDATE': return 'CANDIDAT';
            default: return role;
        }
    };

    const getEditLink = (user: User) => {
        if (user.role === 'CANDIDATE' && user.candidate_profile) {
            return `/dashboard/admin/candidates/${user.candidate_profile.id}`;
        }
        if (user.role === 'COMPANY' && user.company_profile) {
            return `/dashboard/admin/companies/${user.company_profile.id}`;
        }
        return null;
    };

    const deleteUser = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return;
        try {
            await axiosInstance.delete(`users/admin/users/${id}/`);
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Erreur lors de la suppression");
        }
    };


    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestion de la Communauté</h1>
                    <p className="text-slate-500 font-medium">Suivi des comptes, rôles et permissions ({users.length} membres).</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => fetchUsers(searchTerm)}
                        className="px-4 py-3 bg-blue-50 text-blue-800 rounded-xl font-bold text-sm transition-all flex items-center justify-center hover:bg-blue-100"
                    >
                        Actualiser
                    </button>
                    <div className="px-4 py-3 bg-slate-100 text-slate-800 rounded-xl font-bold text-sm transition-all flex items-center justify-center">
                        Total: {users.length}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-blue-50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identité / Membre</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Rôle</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">État Statut</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500 font-bold italic">Recherche en cours...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500 font-bold italic">Aucun utilisateur correspondant.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-black text-sm uppercase">
                                                    {user.username.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">
                                                        {(user as any).first_name || (user as any).last_name
                                                            ? `${(user as any).first_name || ''} ${(user as any).last_name || ''}`.trim()
                                                            : user.username}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getRoleBadge(user.role)}`}>
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {user.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {getEditLink(user) ? (
                                                    <Link href={getEditLink(user)!} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Voir Profil">
                                                        <Edit size={16} />
                                                    </Link>
                                                ) : (
                                                    <button className="p-2 text-slate-200 cursor-not-allowed rounded-lg transition-all" title="Non modifiable" disabled>
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Supprimer Définitivement"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
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
