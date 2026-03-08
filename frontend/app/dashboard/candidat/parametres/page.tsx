'use client';

import { useState, useEffect } from 'react';
import {
    Shield,
    Bell,
    Lock,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export default function CandidateSettingsPage() {
    const [mounted, setMounted] = useState(false);

    // Notification toggles — purely UI (no backend endpoint for this yet)
    const [notifications, setNotifications] = useState([
        { id: 1, label: "Alerte Match IA", desc: "Notification dès qu'une offre correspond à 90%+ de votre profil.", enabled: true },
        { id: 2, label: "Rapports de Test", desc: "Recevez vos scores dès que l'IA a fini l'analyse.", enabled: true },
        { id: 3, label: "Statut Candidature", desc: "Soyez prévenu dès qu'un recruteur ouvre votre dossier.", enabled: true },
    ]);

    // Password State
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleNotification = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordError('');
        setPasswordSuccess(false);

        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
            setSavingPassword(false);
            return;
        }

        if (passwordData.new_password.length < 8) {
            setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
            setSavingPassword(false);
            return;
        }

        try {
            await axiosInstance.post('users/password/change/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setPasswordSuccess(true);
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            toast.success('Mot de passe mis à jour avec succès !');
            setTimeout(() => setPasswordSuccess(false), 4000);
        } catch (error: any) {
            console.error('Error changing password:', error);
            const errData = error.response?.data;
            if (errData?.old_password) {
                setPasswordError(errData.old_password[0]);
            } else if (errData?.new_password) {
                setPasswordError(errData.new_password[0]);
            } else if (errData?.detail) {
                setPasswordError(errData.detail);
            } else {
                setPasswordError("Erreur lors du changement de mot de passe.");
            }
            toast.error('Impossible de changer le mot de passe.');
        } finally {
            setSavingPassword(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paramètres Compte</h1>
                <p className="text-slate-500 font-medium">Gérez votre sécurité et vos préférences de notifications.</p>
            </div>

            {/* Security Section */}
            <form onSubmit={handlePasswordSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 leading-tight">Sécurité</h2>
                        <p className="text-sm font-medium text-slate-500">Mettez à jour votre mot de passe pour protéger votre compte.</p>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ancien mot de passe</label>
                            <input
                                type="password"
                                value={passwordData.old_password}
                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
                                <input
                                    type="password"
                                    value={passwordData.confirm_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    </div>

                    {passwordError && (
                        <div className="text-red-600 text-xs font-bold bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-2">
                            <AlertCircle size={16} className="shrink-0" />
                            {passwordError}
                        </div>
                    )}

                    {passwordSuccess && (
                        <div className="text-emerald-700 text-xs font-bold bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-2">
                            <CheckCircle2 size={16} className="shrink-0" />
                            Mot de passe mis à jour avec succès !
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="flex items-center space-x-2 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-100 disabled:opacity-50"
                        >
                            {savingPassword ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
                            <span>Mettre à jour le mot de passe</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Notifications Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 leading-tight">Préférences d'Alerte</h2>
                        <p className="text-sm font-medium text-slate-500">Contrôlez comment vous souhaitez être informé.</p>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="flex items-center justify-between py-2">
                            <div className="max-w-md">
                                <div className="text-sm font-black text-slate-900 mb-1">{notif.label}</div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{notif.desc}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleNotification(notif.id)}
                                className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${notif.enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                                aria-label={`Toggle ${notif.label}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notif.enabled ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    ))}
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2 border-t border-slate-50">
                        Les notifications en temps réel sont gérées via votre cloche de notifications.
                    </p>
                </div>
            </div>
        </div>
    );
}
