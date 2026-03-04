'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { api } from '@/lib/api';
import {
    Building2,
    Mail,
    Phone,
    Shield,
    Bell,
    Lock,
    CreditCard,
    Trash2,
    ChevronRight,
    Globe,
    CheckCircle2,
    Camera,
    Save,
    MapPin,
    Briefcase,
    AlignLeft,
    Loader2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function EnterpriseSettingsPage() {
    const { user, updateUser } = useAuthStore();

    // Notifications State
    const [notifications, setNotifications] = useState([
        { id: 1, label: "Match IA Instantané", desc: "Notification dès qu'un candidat à haut score est détecté.", enabled: true },
        { id: 2, label: "Rapports hebdomadaires", desc: "Analyse de performance de vos offres actives.", enabled: true },
        { id: 3, label: "Alertes de crédit bas", desc: "Soyez prévenu quand votre solde passe sous 100 crédits.", enabled: true },
    ]);

    // Profile Form State
    const [loading, setLoading] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [successProfile, setSuccessProfile] = useState(false);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [profileData, setProfileData] = useState({
        name: '',
        sector: '',
        description: '',
        website: '',
        address: '',
        city: '',
        phone: '',
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize Profile Data
    useEffect(() => {
        setMounted(true);
        if (user?.company_profile) {
            setProfileData({
                name: user.company_profile.name || '',
                sector: user.company_profile.sector || '',
                description: user.company_profile.description || '',
                website: user.company_profile.website || '',
                address: user.company_profile.address || '',
                city: user.company_profile.city || '',
                phone: user.company_profile.phone || '',
            });
            if (user.company_profile.logo) {
                setLogoPreview(getImageUrl(user.company_profile.logo));
            }
        }
    }, [user]);

    const toggleNotification = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setSuccessProfile(false);

        try {
            const data = new FormData();
            Object.entries(profileData).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (logo) {
                data.append('logo', logo);
            }

            await api.patch('/users/profile/company/', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Update auth store
            const updatedUserResponse = await api.get('/users/me/');
            updateUser(updatedUserResponse.data);

            setSuccessProfile(true);
            setTimeout(() => setSuccessProfile(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setSavingProfile(false);
        }
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

        try {
            await api.post('/users/password/change/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setPasswordSuccess(true);
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (error: any) {
            console.error('Error changing password:', error);
            if (error.response?.data?.old_password) {
                setPasswordError(error.response.data.old_password[0]);
            } else {
                setPasswordError("Erreur lors du changement de mot de passe.");
            }
        } finally {
            setSavingPassword(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paramètres Entreprise</h1>
                <p className="text-slate-500 font-medium">Gérez votre profil recruteur, vos préférences et la sécurité de votre équipe.</p>
            </div>

            {/* 1. EDIT PROFILE SECTION */}
            <form onSubmit={handleProfileSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-tight">Profil Entreprise</h2>
                            <p className="text-sm font-medium text-slate-500">Informations publiques visibles par les candidats.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Logo Upload */}
                    <div className="flex items-center gap-8">
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center relative">
                                {logoPreview ? (
                                    <Image src={logoPreview || ''} alt="Logo" fill className="object-cover" />
                                ) : (
                                    <Building2 className="text-blue-200" size={32} />
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl cursor-pointer hover:bg-blue-700 transition-all shadow-md border-2 border-white">
                                <Camera size={14} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                            </label>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-slate-500 mb-2">Logo de l'entreprise</div>
                            <div className="text-xs text-slate-400">Recommandé: 500x500px, PNG ou JPG.</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de l'entreprise</label>
                            <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secteur d'activité</label>
                            <input
                                type="text"
                                name="sector"
                                value={profileData.sector}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            name="description"
                            value={profileData.description}
                            onChange={handleProfileChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Web</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="url"
                                    name="website"
                                    value={profileData.website}
                                    onChange={handleProfileChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ville</label>
                            <input
                                type="text"
                                name="city"
                                value={profileData.city}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse</label>
                            <input
                                type="text"
                                name="address"
                                value={profileData.address}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${successProfile
                                ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                                : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200'
                                }`}
                        >
                            {savingProfile ? <Loader2 className="animate-spin" size={16} /> : successProfile ? <CheckCircle2 size={16} /> : <Save size={16} />}
                            <span>{successProfile ? 'Enregistré !' : 'Enregistrer les modifications'}</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* 2. SECURITY (PASSWORD) SECTION */}
            <form onSubmit={handlePasswordSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-tight">Sécurité & Connexion</h2>
                            <p className="text-sm font-medium text-slate-500">Mettez à jour votre mot de passe.</p>
                        </div>
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
                                />
                            </div>
                        </div>
                    </div>

                    {passwordError && (
                        <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 flex items-center">
                            <Shield size={14} className="mr-2" />
                            {passwordError}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={savingPassword}
                            className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${passwordSuccess
                                ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                                : 'bg-slate-900 text-white hover:bg-red-600 shadow-xl shadow-slate-200'
                                }`}
                        >
                            {savingPassword ? <Loader2 className="animate-spin" size={16} /> : passwordSuccess ? <CheckCircle2 size={16} /> : <Lock size={16} />}
                            <span>{passwordSuccess ? 'Mot de passe modifié !' : 'Changer le mot de passe'}</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* 3. NOTIFICATIONS */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-tight">Alertes IA & Recrutement</h2>
                            <p className="text-sm font-medium text-slate-500">Recevez des mises à jour sur vos placements IA.</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="flex items-center justify-between">
                            <div className="max-w-md">
                                <div className="text-sm font-black text-slate-900 mb-1">{notif.label}</div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{notif.desc}</p>
                            </div>
                            <button
                                onClick={() => toggleNotification(notif.id)}
                                className={`w-12 h-6 rounded-full transition-all relative ${notif.enabled ? 'bg-cyan-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notif.enabled ? 'right-1 shadow-sm' : 'left-1'}`}></div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subscriptions / Formula */}
            <div className="bg-indigo-50 rounded-[2.5rem] border border-indigo-100 overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Formule Actuelle</div>
                            <div className="text-xl font-black text-indigo-900 leading-none">Placement Assisté</div>
                        </div>
                    </div>
                    <Link href="/dashboard/entreprise/credits" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-center">
                        Changer de formule
                    </Link>
                </div>
            </div>
        </div>
    );
}
