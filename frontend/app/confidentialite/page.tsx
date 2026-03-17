import Link from 'next/link';
import type { Metadata } from 'next';
import { Shield, FileText, Eye, Lock, Trash2, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Politique de Confidentialité – Travago',
    description: 'Comment Travago collecte, utilise et protège vos données personnelles conformément au RGPD.',
};

export default function ConfidentialitePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-100 pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <Shield size={28} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Conformité RGPD</p>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Politique de Confidentialité</h1>
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium">
                        Dernière mise à jour : <strong>17 Mars 2026</strong>. Cette politique s'applique à tous les utilisateurs de la plateforme Travago.
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">

                {/* Section 1 */}
                <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><FileText size={20} className="text-blue-600" /></div>
                        <h2 className="text-xl font-black text-slate-900">1. Responsable du traitement</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                        <strong>Travago</strong> est responsable du traitement de vos données personnelles. Nous sommes une plateforme de recrutement et de placement professionnel opérant au Cameroun.<br /><br />
                        Contact : <a href="mailto:privacy@travago.cm" className="text-blue-600 hover:underline font-bold">privacy@travago.cm</a>
                    </p>
                </section>

                {/* Section 2 */}
                <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><Eye size={20} className="text-purple-600" /></div>
                        <h2 className="text-xl font-black text-slate-900">2. Données collectées</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { cat: 'Données d\'identité', items: 'Nom, prénom, email, numéro de téléphone, photo de profil.' },
                            { cat: 'Documents KYC', items: 'CNI, Passeport, Diplômes, Certificats professionnels (pour vérification d\'authenticité uniquement).' },
                            { cat: 'Données professionnelles', items: 'CV, expériences, compétences, formations, prétentions salariales.' },
                            { cat: 'Données d\'entreprise', items: 'Raison sociale, secteur d\'activité, offres d\'emploi publiées, contacts RH.' },
                            { cat: 'Données de navigation', items: 'Pages visitées, offres cliquées, temps passé (uniquement après consentement analytics).' },
                        ].map((item) => (
                            <div key={item.cat} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">{item.cat}</span>
                                <p className="text-sm text-slate-600">{item.items}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3 */}
                <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><Lock size={20} className="text-emerald-600" /></div>
                        <h2 className="text-xl font-black text-slate-900">3. Finalités et bases légales</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { base: 'Exécution du contrat', desc: 'Mise en relation candidats / entreprises, gestion du compte utilisateur, matching IA.' },
                            { base: 'Intérêt légitime', desc: 'Amélioration du service, détection de fraudes, sécurité de la plateforme.' },
                            { base: 'Consentement', desc: 'Analytics de navigation (PostHog), communications marketing, cookies non-essentiels.' },
                            { base: 'Obligation légale', desc: 'Conservation des factures de crédits, conformité fiscale camerounaise.' },
                        ].map((item) => (
                            <div key={item.base} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg uppercase tracking-widest h-fit mt-0.5 shrink-0">{item.base}</span>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 4 */}
                <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><Lock size={20} className="text-orange-600" /></div>
                        <h2 className="text-xl font-black text-slate-900">4. Sécurité des données</h2>
                    </div>
                    <ul className="space-y-3 text-slate-600 text-sm">
                        {[
                            'Chiffrement HTTPS/TLS pour toutes les communications.',
                            'Mots de passe hashés avec l\'algorithme bcrypt (jamais stockés en clair).',
                            'Authentification JWT avec tokens de courte durée (24h).',
                            'Accès aux documents KYC restreint aux administrateurs vérifiés.',
                            'Base de données hébergée sur Render (Oregon, USA) avec chiffrement au repos.',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Section 5 */}
                <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><Trash2 size={20} className="text-red-500" /></div>
                        <h2 className="text-xl font-black text-slate-900">5. Vos droits</h2>
                    </div>
                    <p className="text-slate-600 text-sm mb-6">Conformément au RGPD, vous disposez des droits suivants que vous pouvez exercer à tout moment :</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { right: 'Droit d\'accès', desc: 'Obtenir une copie de vos données.' },
                            { right: 'Droit de rectification', desc: 'Corriger vos données inexactes.' },
                            { right: 'Droit à l\'effacement', desc: 'Supprimer votre compte et toutes vos données.' },
                            { right: 'Droit d\'opposition', desc: 'Refuser le traitement pour certaines finalités.' },
                            { right: 'Droit à la portabilité', desc: 'Exporter vos données en format lisible.' },
                            { right: 'Droit de retrait', desc: 'Retirer votre consentement analytics à tout moment.' },
                        ].map((item) => (
                            <div key={item.right} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-1">{item.right}</span>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-700 font-medium">
                            Pour exercer ces droits, contactez-nous : <a href="mailto:privacy@travago.cm" className="font-black hover:underline">privacy@travago.cm</a>.
                            Nous répondons sous <strong>30 jours</strong>.
                        </p>
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Mail size={24} className="text-white" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-black mb-1">Une question sur vos données ?</h3>
                        <p className="text-slate-400 text-sm">Notre Délégué à la Protection des Données est disponible pour vous accompagner.</p>
                    </div>
                    <a href="mailto:privacy@travago.cm" className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shrink-0">
                        Nous contacter
                    </a>
                </section>

                <div className="text-center">
                    <Link href="/" className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </main>
        </div>
    );
}
