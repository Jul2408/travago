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
  Check,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { TypewriterEffect } from '@/components/typewriter-effect';
import { FolderClickAnimation } from '@/components/folder-animation';

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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await axiosInstance.get('jobs/offers/');
      const data = res.data.results || res.data;
      setOffers(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (error) {
      console.error("Failed to fetch offers", error);
    } finally {
      setLoadingOffers(false);
    }
  };

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    const handleScroll = () => setScrolled(window.scrollY > 50);

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowInstallGuide(true);
      return;
    }

    if (!deferredPrompt) {
      alert("L'application est déjà installée ou votre navigateur ne supporte pas l'installation automatique. Vous pouvez l'ajouter à l'écran d'accueil manuellement via le menu du navigateur.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const faqData = [
    { q: "Qu'est-ce que le Match Score IA ?", a: "C'est un score de 0 à 100 calculé par notre algorithme v2.5 qui analyse les compétences, l'expérience et la compatibilité culturelle du candidat avec votre offre." },
    { q: "Comment les diplômes sont-ils vérifiés ?", a: "Notre équipe RH effectue une vérification KYC manuelle et numérique auprès des institutions académiques camerounaises et internationales." },
    { q: "Puis-je utiliser Orange Money pour payer ?", a: "Oui, nous intégrons nativement Orange Money et MTN MoMo pour une recharge instantanée de vos crédits de recrutement." },
    { q: "Combien de temps prend un placement ?", a: "En moyenne, notre Agent IA identifie les 3 meilleurs profils en moins de 48 heures ouvrables." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden transition-colors">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 z-[100] origin-left" style={{ scaleX }} />

      {/* 1. Header Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-blue-50 dark:border-slate-800 py-4 shadow-xl shadow-blue-900/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10 shadow-xl rounded-xl overflow-hidden ring-2 ring-white">
              <Image src="/logo.jpeg" alt="Travago Logo" fill className="object-cover" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase">TRAVAGO</div>
              <p className="text-[8px] uppercase tracking-[0.3em] text-blue-600 font-black mt-1">Smart AI Placement</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-10">
            {['Process', 'Solutions', 'IA Lab', 'Pricing', 'FAQ'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item}</Link>
            ))}
            <div className="h-4 w-px bg-slate-200"></div>
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <Smartphone size={14} />
              <span>Installer l'App</span>
            </button>
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Connexion</Link>
            <Link href="/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white hover:shadow-2xl transition-all">S'inscrire</Link>
            <ThemeToggle />
          </div>

          <div className="flex items-center space-x-4 lg:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(true)} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
              <Menu size={24} />
            </button>
          </div>
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
            className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col"
          >
            {/* Mobile Menu Header */}
            <div className="p-8 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg">
                  <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">TRAVAGO</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl active:scale-90 transition-transform"
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
                      className="block text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center justify-center space-x-3 w-full bg-blue-600 text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Smartphone size={20} />
                  <span>Installer l'Application</span>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/login"
                    className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 active:scale-95 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Menu Footer - Version info instead of redundant buttons */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center">
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest text-center">Travago v1.0.2</p>
              <p className="text-[8px] text-gray-300 uppercase tracking-[0.2em] mt-1 text-center font-black">Powered by Smart AI Placement</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 lg:px-12 bg-white dark:bg-slate-950 flex items-center min-h-[90vh] overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/30 mb-8">
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">L'Excellence augmentée par l'algorithme v2.5</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-5xl sm:text-6xl lg:text-[6.5rem] font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter mb-8 sm:mb-10 uppercase transition-all">
              <TypewriterEffect words={["Recrutez", "Postulez", "Matchez"]} className="text-blue-600 dark:text-blue-400 italic" /> au <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 italic">Cameroun</span> <br /> sans effort.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg sm:text-2xl text-slate-500 dark:text-slate-400 mb-12 max-w-xl font-medium leading-relaxed italic">
              Travago fusionne l'expertise RH et l'IA pour identifier, certifier et matcher les meilleurs profils avec les meilleures opportunités.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 w-full">
              <Link href="/register/entreprise" className="w-full sm:w-auto px-8 sm:px-12 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] font-black text-sm sm:text-lg uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 shadow-2xl transition-all flex items-center justify-center group">
                Recruter <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/register/candidat" className="w-full sm:w-auto px-8 sm:px-12 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] font-black text-sm sm:text-lg uppercase tracking-widest hover:border-blue-600 dark:hover:border-blue-500 transition-all flex items-center justify-center">
                Je postule
              </Link>
            </div>

            {/* Added Folder Animation and APK download button in Hero for mobile accessibility */}
            <div className="lg:hidden mt-8 w-full">
              <div className="mb-12 scale-[0.95] sm:scale-100 origin-center">
                <FolderClickAnimation />
              </div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="relative hidden lg:block">
            <FolderClickAnimation />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-600/10 blur-[60px] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* 3. Detailed Journey Section (Connection Steps) */}
      <section id="process" className="py-24 sm:py-40 bg-slate-50 dark:bg-slate-900 overflow-hidden px-6 lg:px-12 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Comment ça marche ?</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic mt-6">Un parcours fluide de l'inscription au placement final.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Recruiters */}
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-950 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border border-blue-50 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-none">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center"><Building2 size={32} /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Espace Recruteur</h3>
                  <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Simplifiez vos chasses</p>
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
                    <div className="shrink-0 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100 dark:border-slate-800">{i + 1}</div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tighter mb-1">{item.step}</h4>
                      <p className="text-slate-500 dark:text-slate-400 font-medium italic text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* For Candidates */}
            <motion.div {...fadeInUp} className="bg-slate-900 dark:bg-slate-950 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] text-white shadow-2xl dark:border dark:border-slate-800">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-[1.5rem] flex items-center justify-center"><UserCheck size={32} /></div>
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
      <section id="ialab" className="py-24 sm:py-40 px-6 lg:px-12 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeInUp}>
            <div className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Moteur de Confiance</div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-8 leading-tight">La Science du <br /> <span className="text-blue-600 dark:text-blue-400 underline">Bon Profil</span>.</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400"><FileSearch size={24} /></div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase">Vérification Multi-Dimmensionnelle</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium italic text-sm">Nous ne lisons pas seulement les CV. Nous vérifions l'authenticité des diplômes, les compétences techniques et la fiabilité comportementale.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-600 dark:text-cyan-400"><Zap size={24} /></div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase">Célérité Algorithmique</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium italic text-sm">Gagnez des semaines de sourcing. Notre base est auto-classée par IA pour vous présenter instantanément le segment Elite.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded-xl text-white"><ShieldCheck size={24} /></div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase">Zéro Risque KYC</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium italic text-sm">Tout candidat portant le badge "Certifié" possède une identité vérifiée à 100%, éliminant les fraudes au recrutement.</p>
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
                <div key={i} className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-100/50 dark:shadow-none hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group">
                  <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 dark:bg-${card.color}-900/20 mb-6 flex items-center justify-center text-${card.color}-600 dark:text-${card.color}-400 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                    <Check size={20} />
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{card.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.label}</div>
                </div>
              ))}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/30 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* 5. Featured Job Offers Section */}
      <section id="solutions" className="py-24 sm:py-40 bg-slate-50 dark:bg-slate-900 overflow-hidden px-6 lg:px-12 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Opportunités Live</div>
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">Dernières offres <br /> de placement.</h2>
            </div>
            <Link href="/register/candidat" className="flex items-center text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 group hover:text-slate-900 dark:hover:text-white transition-colors">
              Voir tout le catalogue <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-6 text-[10px] font-black uppercase opacity-30 animate-pulse">
            <ArrowRight size={12} className="rotate-180" /> Glissez pour explorer <ArrowRight size={12} />
          </div>

          {loadingOffers ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 h-64 animate-pulse border border-slate-100 dark:border-slate-800"></div>
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
              <p className="text-slate-400 font-bold italic uppercase tracking-widest">Recherche de nouvelles pépites en cours...</p>
            </div>
          ) : (
            <div
              className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 flex overflow-x-auto pb-10 pt-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
              {offers.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-none hover:border-blue-500/30 dark:hover:border-blue-900/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all relative overflow-hidden flex flex-col h-full min-w-[85vw] md:min-w-0 snap-center"
                >
                  {/* Glass Header Decor */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-600/5 to-cyan-500/5 dark:from-blue-600/10 dark:to-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:from-blue-600/10 group-hover:to-cyan-500/10 dark:group-hover:from-blue-600/20 dark:group-hover:to-cyan-500/20 transition-colors"></div>

                  <div className="p-8 flex flex-col h-full relative z-10">
                    {/* Top Row: Logo & Status */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-900/5 dark:shadow-none border border-slate-50 dark:border-slate-800 overflow-hidden relative group-hover:scale-110 transition-transform duration-500">
                        {offer.company_detail?.logo ? (
                          <Image src={getImageUrl(offer.company_detail.logo)} alt={offer.company_detail.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                            <Building2 size={24} className="text-slate-300 dark:text-slate-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {offer.is_ia_boosted && (
                          <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-blue-500/20 border border-blue-400/30 dark:border-blue-500/30">
                            <Zap size={10} className="mr-1 fill-white" /> IA Boost
                          </div>
                        )}
                        <span className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-700">
                          Réf #{offer.id}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                          {offer.sector || 'Sénior'}
                        </span>
                        <div className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(offer.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors decoration-blue-500 underline-offset-4 decoration-2">
                        {offer.title}
                      </h3>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 italic">
                          <p className="truncate shrink-0">{offer.company_detail?.name || 'Entreprise Partenaire'}</p>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                          <p className="truncate">{offer.location}</p>
                        </div>

                        {/* Tags / Info */}
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 italic">
                            <Clock size={12} className="text-blue-500" /> {offer.contract_type}
                          </div>
                          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 italic">
                            <Coins size={12} className="text-emerald-500" /> {offer.salary_range || 'Confis.'}
                          </div>
                        </div>

                        {/* Needed Skills Mockup for visual density */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {offer.required_skills?.slice(0, 3).map((skill: string, i: number) => (
                            <span key={i} className="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700 uppercase tracking-tighter">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 mt-auto">
                      <Link
                        href={offer.slug ? `/login?callbackUrl=/dashboard/candidat/offres/${offer.slug}` : '/login'}
                        className="flex items-center justify-between w-full py-5 px-8 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-slate-900/10 dark:shadow-blue-900/20 active:scale-95 group/btn"
                      >
                        <span>Postuler à l'offre</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Recruiter Advantage Section */}
      <section className="py-24 sm:py-40 bg-slate-900 text-white relative overflow-hidden px-6 lg:px-12 text-left">
        <div className="absolute left-0 bottom-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <div className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Pour les Entreprises</div>
            <h2 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] mb-10">Recrutez <br /> sans effort <br /> avec l'IA.</h2>
            <p className="text-blue-100/60 text-lg mb-12 max-w-lg font-medium leading-relaxed italic">
              "Ne perdez plus de temps à trier des CV. Notre IA v2.5 fait le travail pour vous et vous présente uniquement le Top 3 des talents certifiés."
            </p>
            <div className="space-y-6">
              {[
                { label: "Placement Automatisé", desc: "Configuration en 2 min, résultats en 48h." },
                { label: "Candidats Vérifiés", desc: "KYC complet et documents certifiés." },
                { label: "Matching Algorithmique", desc: "Score de compatibilité précis à 95%." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Check size={14} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wider">{item.label}</h4>
                    <p className="text-xs text-blue-100/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-1 shadow-2xl shadow-blue-900/40">
            <div className="bg-slate-900 rounded-[2.9rem] p-8 sm:p-12 overflow-hidden relative">
              <div className="flex items-center justify-between mb-12">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Dashboard Travago IA</div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 animate-pulse">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl"></div>
                      <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="h-4 w-12 bg-green-500/20 rounded-full"></div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-blue-600"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Match Score</div>
                    <div className="text-3xl font-black">98%</div>
                  </div>
                  <div className="p-6 bg-blue-600 rounded-2xl">
                    <div className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Status</div>
                    <div className="text-xl font-black">PRÊT</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 sm:py-40 bg-slate-50 dark:bg-slate-900 px-6 lg:px-12 text-left transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none mb-6 sm:mb-8">Tarifs <br /> Crédits.</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic mb-12">Une monnaie unique pour un recrutement premium et sans friction.</p>
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
                <div key={i} className={`p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-2 bg-white dark:bg-slate-950 transition-all relative ${plan.featured ? 'border-blue-600 shadow-2xl scale-100 sm:scale-105 z-10 dark:shadow-none' : 'border-slate-100 dark:border-slate-800 shadow-sm mt-4 sm:mt-0 dark:shadow-none'}`}>
                  {plan.featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">Solution Elite</div>}
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">{plan.title}</h3>
                  <div className="text-4xl font-black text-blue-600 mb-6 italic tracking-tight">{plan.credits}</div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 text-xs italic leading-relaxed">{plan.desc}</p>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center text-[10px] font-black uppercase text-slate-900 dark:text-white italic">
                        <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 mr-2 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register/entreprise" className={`block w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-center ${plan.featured ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 dark:bg-slate-800 text-white'}`}>Commencer</Link>
                </div>
              ))}
            </div>
          </div>

          <div id="faq" className="mt-40 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic text-center mb-12">Questions Fréquentes</h2>
            {faqData.map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden transition-all shadow-sm dark:shadow-none">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-8 flex items-center justify-between text-left group">
                  <span className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">{item.q}</span>
                  <ChevronDown size={20} className={`text-slate-400 dark:text-slate-500 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div initial={false} animate={{ height: activeFaq === i ? 'auto' : 0, opacity: activeFaq === i ? 1 : 0 }} className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-medium italic text-sm">
                  {item.a}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="footer-bg italic dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 sm:py-32">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <Image src="/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                <span className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">TRAVAGO</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic max-w-sm leading-relaxed mb-10">
                La plateforme de placabilité augmentée au Cameroun. Fusion de l'intelligence artificielle et de l'expertise RH.
              </p>
              <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                <Link href="#" className="hover:text-slate-900 dark:hover:text-white">LinkedIn</Link>
                <Link href="#" className="hover:text-slate-900 dark:hover:text-white">Twitter (X)</Link>
                <Link href="#" className="hover:text-slate-900 dark:hover:text-white">Instagram</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-slate-100 mb-8">Navigation</h4>
              <ul className="space-y-4 font-bold text-slate-500 dark:text-slate-400 text-sm">
                <li><Link href="#process">Comment ça marche</Link></li>
                <li><Link href="#solutions">Solutions Entreprises</Link></li>
                <li><Link href="#pricing">Crédits de Placement</Link></li>
                <li><Link href="/register/candidat">Espace Talent</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-slate-100 mb-8">Contact Direct</h4>
              <p className="text-slate-900 dark:text-white font-black text-sm uppercase italic mb-3 underline decoration-blue-500 decoration-2">Douala, Cameroun</p>
              <a
                href="https://wa.me/237657948848"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-900/30 p-6 rounded-3xl flex items-center space-x-4 mb-3 transition-all group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                  <Smartphone className="text-white" size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">WhatsApp Direct</div>
                  <div className="text-slate-900 dark:text-white text-sm font-black italic">+237 657 948 848</div>
                </div>
              </a>
              <p className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase italic font-mono">contact@travago.cm</p>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[9px] italic">&copy; 2026 TRAVAGO SA. Tous droits réservés.</p>
            <div className="flex items-center space-x-8 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Confidentialité</Link>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Mentions Légales</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* iOS Install Guide Modal */}
      <AnimatePresence>
        {showInstallGuide && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowInstallGuide(false)}
                className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                  <Smartphone size={40} />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 italic">Installer sur iPhone</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic leading-relaxed">
                    Pour installer Travago sur votre iPhone ou iPad, suivez ces étapes :
                  </p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">1</div>
                    <p className="text-xs font-black uppercase text-slate-900 dark:text-white italic">Appuyez sur le bouton <span className="text-blue-600 dark:text-blue-400">Partager</span> en bas du navigateur.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">2</div>
                    <p className="text-xs font-black uppercase text-slate-900 dark:text-white italic">Faites défiler et appuyez sur <span className="text-blue-600 dark:text-blue-400">Sur l'écran d'accueil</span>.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">3</div>
                    <p className="text-xs font-black uppercase text-slate-900 dark:text-white italic">Appuyez sur <span className="text-blue-600 dark:text-blue-400">Ajouter</span> en haut à droite.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInstallGuide(false)}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                >
                  J'ai compris
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
