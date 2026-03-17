'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Building2, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4 transition-colors duration-500">
            <div className="max-w-6xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center space-x-3 mb-8">
                        <Image
                            src="/logo.jpeg"
                            alt="Travago Logo"
                            width={60}
                            height={60}
                            className="rounded-full"
                        />
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                TRAVAGO
                            </h1>
                            <p className="text-xs text-cyan-600 font-medium">Un clic tout emplois</p>
                        </div>
                    </Link>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Créez votre compte
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-slate-400">
                        Choisissez le type de compte qui vous correspond
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Candidat Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link href="/register/candidat">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl dark:shadow-blue-900/10 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer group h-full">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <UserCircle className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                                    Je cherche un emploi
                                </h3>

                                <p className="text-gray-600 dark:text-slate-400 mb-6 text-center">
                                    Créez votre profil candidat et accédez à des milliers d'offres d'emploi
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {[
                                        'Créez votre CV en ligne',
                                        'Postulez en un clic',
                                        'Recevez des alertes emploi',
                                        'Suivez vos candidatures',
                                        'Messagerie avec recruteurs'
                                    ].map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Créer mon compte candidat
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Entreprise Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/register/entreprise">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl dark:shadow-blue-900/10 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-500 dark:hover:border-cyan-400 cursor-pointer group h-full">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                                    Je recrute
                                </h3>

                                <p className="text-gray-600 dark:text-slate-400 mb-6 text-center">
                                    Créez votre compte entreprise et trouvez les meilleurs talents
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {[
                                        'Publiez vos offres d\'emploi',
                                        'Accédez à des candidats qualifiés',
                                        'Gérez vos candidatures',
                                        'Statistiques détaillées',
                                        'Équipe multi-utilisateurs'
                                    ].map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center justify-center text-cyan-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Créer mon compte entreprise
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-gray-600 dark:text-slate-400">
                        Vous avez déjà un compte ?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold transition-colors">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
