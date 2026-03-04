'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Target,
    Plus,
    X,
    Save,
    Loader2,
    CheckCircle2,
    ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

const CONTRACT_TYPES = [
    { value: 'CDI', label: 'CDI' },
    { value: 'CDD', label: 'CDD' },
    { value: 'FREELANCE', label: 'Freelance' },
    { value: 'STAGE', label: 'Stage' },
    { value: 'ALTERNANCE', label: 'Alternance' },
];

const EXPERIENCE_LEVELS = [
    { value: 'STAGIAIRE', label: 'Stagiaire / Étudiant' },
    { value: 'JUNIOR', label: 'Junior (0-2 ans)' },
    { value: 'INTERMEDIATE', label: 'Intermédiaire (2-5 ans)' },
    { value: 'SENIOR', label: 'Sénior (5-10 ans)' },
    { value: 'EXPERT', label: 'Expert (10+ ans)' },
];

const SECTORS = [
    { value: 'TECH', label: 'Informatique / Tech' },
    { value: 'FINANCE', label: 'Finance / Banque' },
    { value: 'HEALTH', label: 'Santé / Médical' },
    { value: 'CONSTRUCTION', label: 'BTP / Construction' },
    { value: 'AGRICULTURE', label: 'Agriculture' },
    { value: 'TRANSPORT', label: 'Transport / Logistique' },
    { value: 'ADMIN', label: 'Administration / RH' },
];

export default function NewOfferPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        sector: 'TECH',
        contract_type: 'CDI',
        experience_level: 'INTERMEDIATE',
        location: '',
        salary_range: '',
        description: '',
        missions: '',
        requirements: '',
        required_skills: [] as string[]
    });

    const [skillInput, setSkillInput] = useState('');

    const addSkill = () => {
        if (skillInput.trim() && !formData.required_skills.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                required_skills: [...formData.required_skills, skillInput.trim()]
            });
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({
            ...formData,
            required_skills: formData.required_skills.filter(s => s !== skill)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axiosInstance.post('jobs/offers/', formData);
            router.push('/dashboard/entreprise/offres');
        } catch (err) {
            console.error('Failed to create job offer', err);
            alert('Erreur lors de la création de l\'offre. Veuillez vérifier les champs.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/entreprise/offres"
                    className="group flex items-center text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors"
                >
                    <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    Retour aux offres
                </Link>
            </div>

            <div className="bg-white rounded-[3rem] p-12 border border-blue-50 shadow-2xl shadow-blue-500/5">
                <div className="flex items-center space-x-6 mb-12">
                    <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-200">
                        <Plus size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nouvelle Offre d'Emploi</h1>
                        <p className="text-slate-500 font-medium">Définissez vos besoins et laissez l'IA trouver vos futurs talents.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* General Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Intitulé du poste</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all"
                                placeholder="ex: Développeur Full-Stack Senior"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Secteur d'activité</label>
                            <select
                                value={formData.sector}
                                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all"
                            >
                                {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Type de contrat</label>
                            <select
                                value={formData.contract_type}
                                onChange={e => setFormData({ ...formData, contract_type: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all"
                            >
                                {CONTRACT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Niveau d'expérience</label>
                            <select
                                value={formData.experience_level}
                                onChange={e => setFormData({ ...formData, experience_level: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all"
                            >
                                {EXPERIENCE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Lieu</label>
                            <div className="relative">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all"
                                    placeholder="ex: Douala / Remote"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Fourchette de salaire (Optionnel)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={formData.salary_range}
                                onChange={e => setFormData({ ...formData, salary_range: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all"
                                placeholder="ex: 500k - 800k CFA / mois"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description du poste</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all resize-none"
                                placeholder="Présentez brièvement le poste et votre équipe..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Missions & Responsabilités</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.missions}
                                onChange={e => setFormData({ ...formData, missions: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all resize-none"
                                placeholder="Listez les principales tâches..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Profil recherché & Prérequis</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.requirements}
                                onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all resize-none"
                                placeholder="Diplômes, expériences spécifiques..."
                            />
                        </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Compétences clés (IA Matching)</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                            {formData.required_skills.map((skill, i) => (
                                <span key={i} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center border border-blue-100">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all"
                                placeholder="Ajouter une compétence (ex: React, SQL, Management)"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col md:flex-row gap-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center">
                                    <Save className="mr-3" size={20} /> Publier l'offre
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Enregistrer en brouillon
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
