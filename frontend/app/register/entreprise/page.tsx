'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Building2, Phone, ArrowRight, Eye, EyeOff, MapPin, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';

export default function RegisterEntreprisePage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setAuth } = useAuthStore();

    const [formData, setFormData] = useState({
        companyName: '',
        username: '',
        secteur: '',
        taille: '',
        email: '',
        phone: '',
        ville: '',
        siteWeb: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('users/register/company/', {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                company_name: formData.companyName,
                phone: formData.phone,
                city: formData.ville
            });

            // Backend already logged the user in via session
            const userData = response.data;
            setAuth(userData, userData.token, userData.refresh);
            window.location.href = '/dashboard/entreprise';
        } catch (err: any) {
            const errorData = err.response?.data;
            if (errorData) {
                if (errorData.detail) {
                    setError(errorData.detail);
                } else {
                    const messages = Object.values(errorData).flat();
                    setError(messages[0] as string || 'Une erreur est survenue lors de l\'inscription.');
                }
            } else if (err.request) {
                setError(`Le serveur ne répond pas. (Network Error: ${err.message})`);
            } else {
                setError(`Erreur de configuration: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-3 mb-6">
                        <div className="relative w-[60px] h-[60px]">
                            <Image
                                src="/logo.jpeg"
                                alt="Travago Logo"
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-left">
                                TRAVAGO
                            </h1>
                            <p className="text-xs text-cyan-600 font-medium text-left">Un clic tout emplois</p>
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Créez votre compte entreprise
                    </h2>
                    <p className="text-gray-600">
                        Trouvez les meilleurs talents pour votre équipe
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Name */}
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nom de l'entreprise
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                                    placeholder="TechCorp SARL"
                                    required
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nom d'utilisateur (Handle)
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors font-sans"
                                    placeholder="techcorp_official"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Ce nom servira d'identifiant public pour l'entreprise.</p>
                        </div>

                        {/* Secteur & Taille */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="secteur" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Secteur d'activité
                                </label>
                                <select
                                    id="secteur"
                                    value={formData.secteur}
                                    onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors appearance-none bg-white font-sans"
                                    required
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="Informatique">Informatique & Tech</option>
                                    <option value="Finance">Finance & Banque</option>
                                    <option value="Commerce">Commerce & Vente</option>
                                    <option value="Santé">Santé</option>
                                    <option value="Education">Éducation</option>
                                    <option value="BTP">BTP & Construction</option>
                                    <option value="Industrie">Industrie</option>
                                    <option value="Transport">Transport & Logistique</option>
                                    <option value="Tourisme">Tourisme & Hôtellerie</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="taille" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Taille de l'entreprise
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        id="taille"
                                        value={formData.taille}
                                        onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors appearance-none bg-white font-sans"
                                        required
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="1-10">1-10 employés</option>
                                        <option value="11-50">11-50 employés</option>
                                        <option value="51-200">51-200 employés</option>
                                        <option value="201-500">201-500 employés</option>
                                        <option value="500+">500+ employés</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email professionnel
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                                    placeholder="contact@entreprise.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone & Ville */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Téléphone
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                                        placeholder="6 XX XX XX XX"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="ville" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ville
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        id="ville"
                                        value={formData.ville}
                                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors appearance-none bg-white font-sans"
                                        required
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="Douala">Douala</option>
                                        <option value="Yaoundé">Yaoundé</option>
                                        <option value="Bafoussam">Bafoussam</option>
                                        <option value="Garoua">Garoua</option>
                                        <option value="Bamenda">Bamenda</option>
                                        <option value="Maroua">Maroua</option>
                                        <option value="Ngaoundéré">Ngaoundéré</option>
                                        <option value="Bertoua">Bertoua</option>
                                        <option value="Limbé">Limbé</option>
                                        <option value="Kribi">Kribi</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Site Web */}
                        <div>
                            <label htmlFor="siteWeb" className="block text-sm font-semibold text-gray-700 mb-2">
                                Site web (optionnel)
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="url"
                                    id="siteWeb"
                                    value={formData.siteWeb}
                                    onChange={(e) => setFormData({ ...formData, siteWeb: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                                    placeholder="https://www.entreprise.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-1 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                J'accepte les{' '}
                                <Link href="/cgv" className="text-cyan-600 hover:text-cyan-700 font-medium font-sans">
                                    conditions générales d'utilisation
                                </Link>
                                {' '}et la{' '}
                                <Link href="/confidentialite" className="text-cyan-600 hover:text-cyan-700 font-medium font-sans">
                                    politique de confidentialité
                                </Link>
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center group font-sans ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Créer mon compte entreprise
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Vous avez déjà un compte ?{' '}
                            <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold font-sans">
                                Connectez-vous
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back Links */}
                <div className="flex justify-between mt-6 text-sm">
                    <Link href="/register" className="text-gray-600 hover:text-gray-900 font-sans">
                        ← Changer de type de compte
                    </Link>
                    <Link href="/" className="text-gray-600 hover:text-gray-900 font-sans">
                        Retour à l'accueil
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
