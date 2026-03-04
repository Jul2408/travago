'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';

export default function RegisterCandidatPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setAuth } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        ville: '',
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
            const response = await axiosInstance.post('users/register/candidate/', {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
                location: formData.ville
            });

            // Backend already logged the user in via session
            const userData = response.data;
            setAuth(userData, userData.token, userData.refresh);
            window.location.href = '/dashboard/candidat';
        } catch (err: any) {
            const errorData = err.response?.data;
            if (errorData) {
                // If it's a detail field
                if (errorData.detail) {
                    setError(errorData.detail);
                } else {
                    // Collect all field errors
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
                        Créez votre profil candidat
                    </h2>
                    <p className="text-gray-600">
                        Trouvez l'emploi de vos rêves en quelques clics
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
                        {/* Name Fields */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Prénom
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="Jean"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="Dupont"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nom d'utilisateur
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-sans"
                                    placeholder="jeandupont77"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Ce nom sera visible par les entreprises (ex: jeandupont77).</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Adresse email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="jean.dupont@email.com"
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
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white font-sans"
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
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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
                                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                J'accepte les{' '}
                                <Link href="/cgv" className="text-blue-600 hover:text-blue-700 font-medium font-sans">
                                    conditions générales d'utilisation
                                </Link>
                                {' '}et la{' '}
                                <Link href="/confidentialite" className="text-blue-600 hover:text-blue-700 font-medium font-sans">
                                    politique de confidentialité
                                </Link>
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Créer mon compte
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Vous avez déjà un compte ?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold font-sans">
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
