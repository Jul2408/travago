'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  ArrowRight,
  Building2,
  UserCheck,
  Cpu,
  Target,
  Zap,
  ShieldCheck,
  MessageSquare,
  Globe,
  Smartphone,
  Users,
  Briefcase,
  Award,
  BarChart3,
  HeartHandshake,
  Menu,
  X,
  Star,
  Lock,
  Coins,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Fingerprint,
  QrCode,
  FileSearch,
  Check
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';

// Common Animation variants
const fadeInUp: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer: any = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const faqData = [
    { q: "Qu'est-ce que le Match Score IA ?", a: "C'est un score de 0 à 100 calculé par notre algorithme v2.5 qui analyse les compétences, l'expérience et la compatibilité culturelle du candidat avec votre offre." },
    { q: "Comment les diplômes sont-ils vérifiés ?", a: "Notre équipe RH effectue une vérification KYC manuelle et numérique auprès des institutions académiques camerounaises et internationales." },
    { q: "Puis-je utiliser Orange Money pour payer ?", a: "Oui, nous intégrons nativement Orange Money et MTN MoMo pour une recharge instantanée de vos crédits de recrutement." },
    { q: "Combien de temps prend un placement ?", a: "En moyenne, notre Agent IA identifie les 3 meilleurs profils en moins de 48 heures ouvrables." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 z-[100] origin-left" style={{ scaleX }} />

      {/* 1. Header Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-2xl border-b border-blue-50 py-4 shadow-xl shadow-blue-900/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10 shadow-xl rounded-xl overflow-hidden ring-2 ring-white">
              <Image src="/logo.jpeg" alt="Travago Logo" fill className="object-cover" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tighter text-slate-900 leading-none uppercase">TRAVAGO</div>
              <p className="text-[8px] uppercase tracking-[0.3em] text-blue-600 font-black mt-1">Smart AI Placement</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-10">
            {['Process', 'Solutions', 'IA Lab', 'Pricing', 'FAQ'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">{item}</Link>
            ))}
            <div className="h-4 w-px bg-slate-200"></div>
            <Link href="/travago.apk" download className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              <Smartphone size={14} />
              <span>Télécharger APK</span>
            </Link>
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors">Connexion</Link>
            <Link href="/register" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-2xl transition-all">S'inscrire</Link>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-3 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col"
          >
            {/* Mobile Menu Header */}
            <div className="p-8 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg">
                  <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900">TRAVAGO</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-90 transition-transform"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-2 mb-12">
                {['Process', 'Solutions', 'IA Lab', 'Pricing', 'FAQ'].map((label, idx) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={`#${label.toLowerCase().replace(' ', '')}`}
                      className="block text-4xl font-black text-slate-900 uppercase tracking-tighter hover:text-blue-600 transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <Link
                  href="/travago.apk"
                  download
                  className="flex items-center justify-center space-x-3 w-full bg-blue-50 text-blue-600 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest border border-blue-100 active:scale-95 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Smartphone size={20} />
                  <span>Télécharger APK</span>
                </Link>

                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/login"
                    className="flex items-center justify-center bg-slate-50 text-slate-900 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest border border-slate-100 active:scale-95 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center bg-slate-900 text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Menu Footer - Version info instead of redundant buttons */}
            <div className="p-8 border-t border-slate-100 flex flex-col items-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Travago v1.0.2</p>
              <p className="text-[8px] text-gray-300 uppercase tracking-[0.2em] mt-1 text-center font-black">Powered by Smart AI Placement</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 lg:px-12 bg-white flex items-center min-h-[90vh] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 mb-8">
              <Sparkles size={14} className="text-blue-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">L'Excellence augmentée par l'algorithme v2.5</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-5xl sm:text-6xl lg:text-[7rem] font-black text-slate-900 leading-[0.85] tracking-tighter mb-8 sm:mb-10">
              Recrutez au <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 italic">Cameroun</span> <br /> sans effort.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg sm:text-2xl text-slate-500 mb-16 max-w-xl font-medium leading-relaxed italic">
              Travago fusionne l'expertise RH et l'IA pour identifier, certifier et matcher les meilleurs profils avec vos besoins stratégiques.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 w-full">
              <Link href="/register/entreprise" className="w-full sm:w-auto px-8 sm:px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm sm:text-lg uppercase tracking-widest hover:bg-blue-600 shadow-2xl transition-all flex items-center justify-center group">
                Recruter <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/register/candidat" className="w-full sm:w-auto px-8 sm:px-12 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-[2rem] font-black text-sm sm:text-lg uppercase tracking-widest hover:border-blue-600 transition-all flex items-center justify-center">
                Je postule
              </Link>
            </div>
            {/* Added APK download button in Hero for mobile accessibility */}
            <div className="lg:hidden">
              <Link href="/travago.apk" download className="flex items-center justify-center space-x-3 w-full bg-blue-600 text-white py-6 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                <Smartphone size={24} />
                <span>Télécharger l'APK</span>
              </Link>
              <p className="text-center text-[10px] text-gray-400 mt-2 italic font-medium uppercase tracking-[0.2em]">Disponible pour Android - Version 1.0.2</p>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="relative hidden lg:block">
            <div className="relative z-10 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl ring-1 ring-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center"><Fingerprint size={24} /></div>
                  <div>
                    <div className="text-[10px] font-black uppercase opacity-50">IA Matching</div>
                    <div className="text-sm font-black italic">Analyse en temps réel</div>
                  </div>
                </div>
                <div className="text-xs font-black uppercase text-blue-400">92.4% Match</div>
              </div>
              <div className="space-y-6">
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 2, delay: 1 }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-lg font-black">Certifié</div>
                    <div className="text-[8px] uppercase tracking-widest opacity-40">KYC Status</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-lg font-black">Expert</div>
                    <div className="text-[8px] uppercase tracking-widest opacity-40">Niveau de fiabilité</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-600/10 blur-[60px] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* 3. Detailed Journey Section (Connection Steps) */}
      <section id="process" className="py-24 sm:py-40 bg-slate-50 overflow-hidden px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase italic">Comment ça marche ?</h2>
            <p className="text-lg text-slate-500 font-medium italic mt-6">Un parcours fluide de l'inscription au placement final.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Recruiters */}
            <motion.div {...fadeInUp} className="bg-white p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border border-blue-50 shadow-xl shadow-blue-900/5">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center"><Building2 size={32} /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Espace Recruteur</h3>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Simplifiez vos chasses</p>
                </div>
              </div>
              <div className="space-y-10">
                {[
                  { step: "1. Connexion Instantanée", desc: "Créez votre compte entreprise en 2 minutes. Accès immédiat au dashboard de pilotage." },
                  { step: "2. Rechargez vos Crédits", desc: "Achetez vos crédits via Orange Money/MTN MoMo pour lancer vos premières missions." },
                  { step: "3. Lancez l'Agent IA", desc: "Décrivez votre besoin. Notre Agent IA scanne 10k+ profils certifiés pour extraire le Top 3." },
                  { step: "4. Recrutement Réussi", desc: "Consultez les résultats, accédez aux CV vérifiés et lancez la discussion." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100">{i + 1}</div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg uppercase tracking-tighter mb-1">{item.step}</h4>
                      <p className="text-slate-500 font-medium italic text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* For Candidates */}
            <motion.div {...fadeInUp} className="bg-slate-900 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] text-white shadow-2xl">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-white text-slate-900 rounded-[1.5rem] flex items-center justify-center"><UserCheck size={32} /></div>
                <div>
                  <h3 className="text-2xl font-black text-white">Espace Candidat</h3>
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Propulsez votre talent</p>
                </div>
              </div>
              <div className="space-y-10">
                {[
                  { step: "1. Profil Augmenté", desc: "Inscrivez-vous et remplissez votre profil IA avec vos compétences et expériences." },
                  { step: "2. Certification KYC", desc: "Uploadez vos documents. Notre équipe valide votre profil sous 24h pour obtenir le badge Expert." },
                  { step: "3. Scoring de Talent", desc: "L'IA analyse votre placabilité et vous prépare pour les meilleures entreprises du pays." },
                  { step: "4. Opportunités Directes", desc: "Soyez matché avec des offres premium et recevez directement des propositions." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-black text-xs group-hover:bg-blue-500 group-hover:text-white transition-all border border-white/10 shadow-lg">{i + 1}</div>
                    <div>
                      <h4 className="font-black text-white text-lg uppercase tracking-tighter mb-1">{item.step}</h4>
                      <p className="text-slate-400 font-medium italic text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. IA Lab Section - Detailed Visuals */}
      <section id="ialab" className="py-24 sm:py-40 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeInUp}>
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Moteur de Confiance</div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter italic mb-8 leading-tight">La Science du <br /> <span className="text-blue-600 underline">Bon Profil</span>.</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><FileSearch size={24} /></div>
                <div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase">Vérification Multi-Dimmensionnelle</h4>
                  <p className="text-slate-500 font-medium italic text-sm">Nous ne lisons pas seulement les CV. Nous vérifions l'authenticité des diplômes, les compétences techniques et la fiabilité comportementale.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600"><Zap size={24} /></div>
                <div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase">Célérité Algorithmique</h4>
                  <p className="text-slate-500 font-medium italic text-sm">Gagnez des semaines de sourcing. Notre base est auto-classée par IA pour vous présenter instantanément le segment Elite.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900 rounded-xl text-white"><ShieldCheck size={24} /></div>
                <div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase">Zéro Risque KYC</h4>
                  <p className="text-slate-500 font-medium italic text-sm">Tout candidat portant le badge "Certifié" possède une identité vérifiée à 100%, éliminant les fraudes au recrutement.</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="relative">
            <div className="grid grid-cols-2 gap-6 relative z-10">
              {[
                { label: "Analyse Sémantique", value: "Actif", color: "blue" },
                { label: "Vérification KYC", value: "99.9%", color: "indigo" },
                { label: "Base Candidats", value: "10k+", color: "cyan" },
                { label: "Temps Moy. Match", value: "48h", color: "slate" }
              ].map((card, i) => (
                <div key={i} className="p-6 sm:p-8 bg-white border border-slate-100 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-100/50 hover:border-blue-200 transition-all group">
                  <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 mb-6 flex items-center justify-center text-${card.color}-600 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                    <Check size={20} />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1">{card.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.label}</div>
                </div>
              ))}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/30 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* 5. Simple Pricing & FAQ */}
      <section id="pricing" className="py-24 sm:py-40 bg-slate-50 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6 sm:mb-8">Tarifs <br /> Crédits.</h2>
              <p className="text-lg text-slate-500 font-medium italic mb-12">Une monnaie unique pour un recrutement premium et sans friction.</p>
              <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                <div className="relative z-10">
                  <Coins size={48} className="mb-6 opacity-30 group-hover:rotate-12 transition-transform" />
                  <h4 className="text-2xl font-black mb-2">Paiement USSD</h4>
                  <p className="text-blue-100 font-medium italic text-sm">Rechargez instantanément via Orange Money ou MTN MoMo.</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              {[
                { title: "Standard", credits: "50 Cr.", desc: "Débloquez l'accès complet aux coordonnées et documents d'un profil certifié.", features: ["Full CV & Documentation", "Chat direct illimité", "Contact téléphonique"] },
                { title: "Chasse IA", credits: "250 Cr.", desc: "Activez l'Agent IA pour chasser et valider le Top 3 des talents correspondant à votre besoin.", featured: true, features: ["Matching v2.5 Expert", "Rapport IA détaillé", "Validation KYC prioritaire"] }
              ].map((plan, i) => (
                <div key={i} className={`p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-2 bg-white transition-all relative ${plan.featured ? 'border-blue-600 shadow-2xl scale-100 sm:scale-105 z-10' : 'border-slate-100 shadow-sm mt-4 sm:mt-0'}`}>
                  {plan.featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">Solution Elite</div>}
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1">{plan.title}</h3>
                  <div className="text-4xl font-black text-blue-600 mb-6 italic tracking-tight">{plan.credits}</div>
                  <p className="text-slate-500 font-medium mb-10 text-xs italic leading-relaxed">{plan.desc}</p>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center text-[10px] font-black uppercase text-slate-900 italic">
                        <CheckCircle2 size={16} className="text-blue-600 mr-2 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register/entreprise" className={`block w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-center ${plan.featured ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-white'}`}>Commencer</Link>
                </div>
              ))}
            </div>
          </div>

          <div id="faq" className="mt-40 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic text-center mb-12">Questions Fréquentes</h2>
            {faqData.map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden transition-all shadow-sm">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-8 flex items-center justify-between text-left group">
                  <span className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight italic">{item.q}</span>
                  <ChevronDown size={20} className={`text-slate-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div initial={false} animate={{ height: activeFaq === i ? 'auto' : 0, opacity: activeFaq === i ? 1 : 0 }} className="px-8 pb-8 text-slate-500 font-medium italic text-sm">
                  {item.a}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="footer-bg italic">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 sm:py-32">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <Image src="/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-xl" />
                <span className="text-2xl font-black tracking-tighter uppercase">TRAVAGO</span>
              </div>
              <p className="text-slate-500 font-medium text-lg italic max-w-sm leading-relaxed mb-10">
                La plateforme de placabilité augmentée au Cameroun. Fusion de l'intelligence artificielle et de l'expertise RH.
              </p>
              <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-blue-600">
                <Link href="#" className="hover:text-slate-900">LinkedIn</Link>
                <Link href="#" className="hover:text-slate-900">Twitter (X)</Link>
                <Link href="#" className="hover:text-slate-900">Instagram</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Navigation</h4>
              <ul className="space-y-4 font-bold text-slate-500 text-sm">
                <li><Link href="#process">Comment ça marche</Link></li>
                <li><Link href="#solutions">Solutions Entreprises</Link></li>
                <li><Link href="#pricing">Crédits de Placement</Link></li>
                <li><Link href="/register/candidat">Espace Talent</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Contact Direct</h4>
              <p className="text-slate-900 font-black text-sm uppercase italic mb-3 underline decoration-blue-500 decoration-2">Douala, Cameroun</p>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center space-x-4 mb-3">
                <Smartphone className="text-blue-600" size={20} />
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support WhatsApp <br /> <span className="text-slate-900 text-xs italic tracking-normal">+237 6XX XXX XXX</span></div>
              </div>
              <p className="text-blue-600 font-black text-xs uppercase italic font-mono">contact@travago.cm</p>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] italic">&copy; 2026 TRAVAGO SA. Tous droits réservés.</p>
            <div className="flex items-center space-x-8 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
              <Link href="#" className="hover:text-blue-600">Confidentialité</Link>
              <Link href="#" className="hover:text-blue-600">Mentions Légales</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
