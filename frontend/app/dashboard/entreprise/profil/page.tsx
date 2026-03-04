'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { api } from '@/lib/api';
import {
    Building2,
    Globe,
    MapPin,
    Phone,
    Mail,
    Camera,
    Save,
    Briefcase,
    AlignLeft,
    Loader2,
    CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

export default function EnterpriseProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        username: user?.username || '',
        sector: '',
        description: '',
        website: '',
        address: '',
        city: '',
        phone: '',
    });

    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (user?.company_profile) {
            setFormData({
                name: user.company_profile.name || '',
                username: user.username || '',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            // 1. Update Profile (multipart for logo)
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'username') data.append(key, value);
            });
            if (logo) {
                data.append('logo', logo);
            }

            await api.patch('/users/profile/company/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 2. Update User (Username)
            await api.patch('/users/me/', {
                username: formData.username
            });

            // Update auth store with new user data
            const updatedUserResponse = await api.get('/users/me/');
            updateUser(updatedUserResponse.data);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating company profile:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mon Profil Entreprise</h1>
                    <p className="text-slate-500 font-medium">Présentez votre entreprise pour attirer les meilleurs talents.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Logo & Basic Info */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 bg-blue-50 rounded-[2.5rem] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center relative">
                                    {logoPreview ? (
                                        <Image
                                            src={logoPreview || ''}
                                            alt="Logo Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Building2 className="text-blue-200" size={48} />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-2xl cursor-pointer hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 border-2 border-white">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de l'entreprise</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Ex: TechCorp Africa"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username (@)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                placeholder="votre_handle"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secteur d'activité</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="sector"
                                            value={formData.sector}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Technologie, BTP, Santé..."
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description de l'entreprise</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-4 top-4 text-slate-400" size={18} />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Racontez votre histoire et vos missions..."
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Web</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="https://www.votreentreprise.com"
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+237 ..."
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ville</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Douala, Yaoundé..."
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Ex: BP 123, Akwa..."
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 flex items-center justify-between gap-4">
                        <p className="text-xs font-medium text-slate-500 italic max-w-sm">
                            Certaines informations sont visibles par les candidats que vous approchez.
                        </p>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex items-center space-x-2 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${success
                                ? 'bg-green-600 text-white shadow-xl shadow-green-100'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100'
                                } disabled:opacity-50`}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Enregistrement...</span>
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle size={18} />
                                    <span>Enregistré !</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Enregistrer le profil</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
