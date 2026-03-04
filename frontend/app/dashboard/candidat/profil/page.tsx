'use client';

import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Languages,
    Award,
    Plus,
    Edit3,
    Camera,
    Save,
    Trash2,
    CheckCircle2,
    X,
    Loader2,
    Upload,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';
import { getImageUrl } from '@/lib/utils';

interface Experience {
    company: string;
    role: string;
    period: string;
    desc: string;
}

interface ProfileData {
    id: number;
    user: number;
    first_name: string;
    last_name: string;
    user_detail?: {
        first_name: string;
        last_name: string;
        username: string;
    };
    photo: string | null;
    title: string | null;
    bio: string | null;
    cv: string | null;
    experience_years: number;
    experience: Experience[];
    skills: string[];
    location: string | null;
    phone: string | null;
    placability_score: number;
    reliability_score: number;
    is_verified: boolean;
}

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editData, setEditData] = useState({
        username: user?.username || '',
        title: '',
        bio: '',
        location: '',
        phone: '',
        experience_years: 0,
        skills: [] as string[],
        experience: [] as Experience[]
    });

    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('users/profile/candidate/');
            const data = response.data;
            setProfile({
                ...data,
                first_name: data.user_detail?.first_name || user?.first_name || '',
                last_name: data.user_detail?.last_name || user?.last_name || ''
            });
            setEditData({
                username: user?.username || '',
                title: data.title || '',
                bio: data.bio || '',
                location: data.location || '',
                phone: data.phone || '',
                experience_years: data.experience_years || 0,
                skills: data.skills || [],
                experience: data.experience || []
            });
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to fetch profile', err);
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Update Profile
            const profileResponse = await axiosInstance.patch('users/profile/candidate/', {
                title: editData.title,
                bio: editData.bio,
                location: editData.location,
                phone: editData.phone,
                experience_years: editData.experience_years,
                skills: editData.skills,
                experience: editData.experience
            });

            // 2. Update User (Username)
            const userResponse = await axiosInstance.patch('users/me/', {
                username: editData.username
            });

            setProfile({ ...profile, ...profileResponse.data } as ProfileData);
            setIsEditing(false);

            // Update global auth store
            if (user) {
                updateUser({
                    ...userResponse.data,
                    photo: profileResponse.data.photo,
                    candidate_profile: {
                        ...user.candidate_profile!,
                        ...profileResponse.data
                    }
                });
            }
        } catch (err) {
            console.error('Failed to save profile', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setIsSaving(true);
        try {
            const response = await axiosInstance.patch('users/profile/candidate/', formData);
            const updatedProfile = { ...profile, photo: response.data.photo } as ProfileData;
            setProfile(updatedProfile);

            // Update global auth store
            if (user) {
                updateUser({
                    ...user,
                    photo: response.data.photo,
                    candidate_profile: {
                        ...user.candidate_profile!,
                        photo: response.data.photo
                    }
                });
            }
        } catch (err: any) {
            console.error('Failed to upload photo', err);
            alert(`Erreur lors de l'envoi de la photo: ${err.response?.data?.detail || err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
            setEditData({ ...editData, skills: [...editData.skills, newSkill.trim()] });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setEditData({ ...editData, skills: editData.skills.filter(s => s !== skillToRemove) });
    };

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Profile Header */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-blue-500/5 border border-blue-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>

                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Avatar Section */}
                    <div className="relative group">
                        <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-blue-400 rounded-[3rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl relative overflow-hidden border-4 border-white">
                            {profile?.photo ? (
                                <Image
                                    src={getImageUrl(profile.photo) || ''}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="p-8 opacity-20">
                                    <User size={80} />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all group-hover:bg-blue-600"
                        >
                            <Camera size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                        {profile?.first_name} {profile?.last_name}
                                    </h1>
                                    {profile?.is_verified && (
                                        <div className="bg-blue-50 text-blue-600 p-1 rounded-full border border-blue-100">
                                            <ShieldCheck size={20} fill="currentColor" className="text-white" />
                                        </div>
                                    )}
                                </div>
                                {isEditing ? (
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-black text-slate-400">@</span>
                                            <input
                                                type="text"
                                                value={editData.username}
                                                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                                className="px-4 py-1.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl font-bold text-slate-700 outline-none transition-all text-sm"
                                                placeholder="votre_username"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="w-full max-w-md px-4 py-2 bg-blue-50/50 border-2 border-transparent focus:border-blue-500 rounded-xl font-bold text-blue-700 outline-none transition-all"
                                            placeholder="Titre de votre profil (ex: Développeur React)"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">@{user?.username}</p>
                                        <p className="text-xl font-bold text-blue-600 tracking-tight">
                                            {profile?.title || 'Titre non défini'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-3 justify-center md:justify-start">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                                            Enregistrer
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center shadow-lg shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all"
                                    >
                                        <Edit3 className="mr-2" size={18} /> Modifier mon CV
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-50">
                                    <Mail size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                    <p className="text-sm font-bold text-slate-700 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-50">
                                    <Phone size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.phone}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                            className="w-full bg-transparent font-bold text-sm text-slate-700 border-b border-blue-200 focus:border-blue-500 outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-slate-700">{profile?.phone || 'Non défini'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-50">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localisation</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.location}
                                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                            className="w-full bg-transparent font-bold text-sm text-slate-700 border-b border-blue-200 focus:border-blue-500 outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-slate-700">{profile?.location || 'Cameroun'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Summary & Skills */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Bio / Summary */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">À propos de moi</h3>
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <User size={16} />
                            </div>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={editData.bio}
                                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                rows={6}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl font-medium text-slate-600 outline-none transition-all resize-none"
                                placeholder="Décrivez votre parcours et vos ambitions..."
                            />
                        ) : (
                            <p className="text-slate-600 font-medium leading-relaxed">
                                {profile?.bio || 'Aucun résumé défini. Cliquez sur le bouton "Modifier mon CV" pour ajouter une présentation.'}
                            </p>
                        )}
                    </div>

                    {/* Skills Section */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Compétences</h3>
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Zap size={16} />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                                    placeholder="Ex: React"
                                />
                                <button
                                    onClick={addSkill}
                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {(isEditing ? editData.skills : (profile?.skills || [])).map(skill => (
                                <div
                                    key={skill}
                                    className="group px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-50/30 text-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-wider border border-blue-100 flex items-center"
                                >
                                    {skill}
                                    {isEditing && (
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="ml-2 text-blue-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {!isEditing && (!profile?.skills || profile.skills.length === 0) && (
                                <p className="text-slate-400 text-xs font-medium">Aucune compétence listée</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Experience */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Expérience & Parcours</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.experience_years || 0} Ans d'expérience cumulés</p>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => setEditData({
                                        ...editData,
                                        experience: [
                                            ...editData.experience,
                                            { company: 'Nouvelle Entreprise', role: 'Poste occupé', period: '2024 - Présent', desc: 'Description de vos missions...' }
                                        ]
                                    })}
                                    className="flex items-center px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group"
                                >
                                    <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" /> Ajouter une étape
                                </button>
                            )}
                        </div>

                        <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-blue-100 before:via-slate-50 before:to-transparent">
                            {(isEditing ? editData.experience : profile?.experience || []).length > 0 ? (
                                (isEditing ? editData.experience : profile?.experience || []).map((job, idx) => (
                                    <div key={idx} className="relative pl-14 group">
                                        <div className="absolute left-[1.15rem] top-1.5 w-[0.85rem] h-[0.85rem] rounded-full bg-white border-4 border-blue-500 shadow-sm z-10 scale-125 group-hover:scale-150 transition-transform"></div>
                                        <div className="p-6 rounded-[2rem] border border-transparent hover:border-slate-100 hover:bg-slate-50/30 transition-all relative">
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <input
                                                            type="text"
                                                            value={job.role}
                                                            onChange={(e) => {
                                                                const newExp = [...editData.experience];
                                                                newExp[idx].role = e.target.value;
                                                                setEditData({ ...editData, experience: newExp });
                                                            }}
                                                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-blue-500 outline-none"
                                                            placeholder="Poste"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={job.period}
                                                            onChange={(e) => {
                                                                const newExp = [...editData.experience];
                                                                newExp[idx].period = e.target.value;
                                                                setEditData({ ...editData, experience: newExp });
                                                            }}
                                                            className="w-full sm:w-40 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-blue-600 focus:border-blue-500 outline-none text-center"
                                                            placeholder="Période"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={job.company}
                                                        onChange={(e) => {
                                                            const newExp = [...editData.experience];
                                                            newExp[idx].company = e.target.value;
                                                            setEditData({ ...editData, experience: newExp });
                                                        }}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-blue-600 focus:border-blue-500 outline-none"
                                                        placeholder="Entreprise"
                                                    />
                                                    <textarea
                                                        value={job.desc}
                                                        onChange={(e) => {
                                                            const newExp = [...editData.experience];
                                                            newExp[idx].desc = e.target.value;
                                                            setEditData({ ...editData, experience: newExp });
                                                        }}
                                                        rows={2}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 focus:border-blue-500 outline-none resize-none"
                                                        placeholder="Description..."
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newExp = editData.experience.filter((_, i) => i !== idx);
                                                            setEditData({ ...editData, experience: newExp });
                                                        }}
                                                        className="text-red-500 font-bold text-[10px] uppercase tracking-widest hover:underline"
                                                    >
                                                        Supprimer cette étape
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                        <h4 className="font-black text-slate-900 text-xl">{job.role}</h4>
                                                        <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase bg-blue-50 px-3 py-1 rounded-lg">{job.period}</span>
                                                    </div>
                                                    <p className="text-blue-600 font-bold text-sm mb-4">{job.company}</p>
                                                    <p className="text-slate-600 font-medium text-sm leading-relaxed">{job.desc}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="pl-14 py-8">
                                    <p className="text-slate-400 font-medium italic">Aucune expérience renseignée. Cliquez sur "Modifier" pour en ajouter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

