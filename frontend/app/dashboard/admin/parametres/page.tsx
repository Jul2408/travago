'use client';

import { useState, useEffect, useRef } from 'react';
import {
    User,
    Mail,
    Shield,
    Camera,
    Save,
    Loader2,
    CheckCircle2,
    Lock,
    AlertCircle
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

export default function AdminProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
    });

    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append('photo', file);

        setIsSaving(true);
        try {
            const response = await axiosInstance.patch('users/me/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser(response.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError("Erreur lors de l'envoi de la photo.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            const response = await axiosInstance.patch('users/me/', {
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
            });
            updateUser(response.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.username?.[0] || "Erreur lors de la mise à jour.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsSaving(true);
        setError('');
        try {
            await axiosInstance.post('users/password/change/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setSuccess(true);
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError("Erreur lors du changement de mot de passe.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">Mon Profil Administrateur</h1>
                <p className="text-slate-500 font-medium tracking-tight">Gérez vos informations personnelles et votre sécurité.</p>
            </div>

            {success && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4 text-emerald-600 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 size={24} />
                    <span className="font-black uppercase text-xs tracking-widest">Mise à jour effectuée avec succès !</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600">
                    <AlertCircle size={24} />
                    <span className="font-black uppercase text-xs tracking-widest">{error}</span>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center">
                        <div className="relative group mb-6">
                            <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center relative">
                                {user?.photo ? (
                                    <Image
                                        src={getImageUrl(user.photo)}
                                        alt="Admin Photo"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User size={48} className="text-slate-300" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-black transition-all border-2 border-white"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">@{user?.username}</h2>
                        <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest mt-3">
                            Administrateur
                        </span>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleProfileSubmit} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 uppercase italic">Informations Générales</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Non modifiable)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold opacity-50 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-100"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>

                    <form onSubmit={handlePasswordSubmit} className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-lg font-black uppercase italic">Sécurité du Compte</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Ancien mot de passe</label>
                                <input
                                    type="password"
                                    value={passwordData.old_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all text-white outline-none"
                                    required
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all text-white outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirm_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all text-white outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full md:w-auto px-12 py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-400 hover:text-white transition-all shadow-2xl"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                                Mettre à jour le mot de passe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
