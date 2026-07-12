'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Zap, Target, ShieldCheck, CheckCircle2, Lock, 
  UserCheck, Briefcase, ChevronRight, PlayCircle, Star, Sparkles, Cpu, FileText, Quote
} from 'lucide-react';
import { TypewriterEffect } from '@/components/typewriter-effect';

/* =========================================
   1. HERO SECTION
   ========================================= */
export function HeroSection() {
  return (
    <section className="relative pt-44 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[90vw] max-w-[800px] h-[400px] bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full -z-10 mt-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 bg-white dark:bg-blue-900/20 px-5 py-2 rounded-full border border-blue-100 dark:border-blue-800/30 mb-8 shadow-xl shadow-blue-500/5 dark:shadow-none"
      >
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping mr-1"></div>
        <Zap size={14} className="text-blue-600 dark:text-blue-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Matching IA v2.5.0 Actif</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl sm:text-7xl lg:text-[7.5rem] font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85] mb-8"
      >
        L'Élite du<br />
        <TypewriterEffect 
          words={['Recrutement.', 'Placement IA.', 'Talent.', 'Sourcing.']} 
          className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-400" 
        /><br />
        Par Intelligence.
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium italic max-w-3xl mx-auto mb-12 leading-relaxed"
      >
        Nous ne sommes pas un simple site d'offres d'emploi. Nous sommes l'agence de chasse de tête automatisée du Cameroun. Confiez-nous vos exigences, notre IA vous ramène le candidat parfait, profil vérifié.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
      >
        <Link href="/register/entreprise" className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-600/30 dark:shadow-blue-900/40 transition-all flex items-center justify-center group active:scale-95">
          Je Recrute du Talent <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
        </Link>
        <Link href="/register/candidat" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none rounded-[2rem] font-black text-xs uppercase tracking-widest hover:border-blue-300 dark:hover:border-slate-700 transition-all text-center active:scale-95">
          Trouver un emploi Premium
        </Link>
      </motion.div>
    </section>
  );
}

/* =========================================
   1.5 INFINITE MARQUEE SECTION
   ========================================= */
export function InfiniteMarquee() {
  const items = [
    "VÉRIFICATION KYC STRICTE", "MATCHING PAR IA", "TALENTS CERTIFIÉS", 
    "SCORE DE PLACABILITÉ", "DIPLÔMES VÉRIFIÉS", "CHASSE IA ACTIVÉE",
    "ENTRETIENS EN 24H", "CONFIDENTIALITÉ 100%"
  ];
  return (
    <div className="py-6 sm:py-8 bg-blue-600 overflow-hidden flex whitespace-nowrap transform -skew-y-2 relative z-20 shadow-2xl border-y-4 border-blue-900/30 font-sans mt-10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 180 }}
        className="flex space-x-12 px-6 items-center"
      >
        {[...items, ...items, ...items].map((text, i) => (
          <span key={i} className="text-white font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-[0.2em] italic opacity-90 flex items-center">
            {text} <span className="mx-12 w-3 h-3 bg-blue-300 rounded-full"></span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* =========================================
   2. STATS SECTION
   ========================================= */
export function StatsSection() {
  return (
    <section className="py-12 border-t border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once:true }}>
          <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">10k+</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mt-2">Candidats Certifiés</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once:true }} transition={{ delay: 0.1 }}>
          <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">98%.</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mt-2">Précision du Match IA</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once:true }} transition={{ delay: 0.2 }}>
          <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">24h.</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mt-2">Temps de Placement Moyen</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once:true }} transition={{ delay: 0.3 }}>
          <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">100%.</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mt-2">Dossiers Vérifiés (KYC)</div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================
   3. HOW IT WORKS SECTION (Interactive Tabs)
   ========================================= */
export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'recruiter' | 'candidate'>('recruiter');

  return (
    <section id="comment-ca-marche" className="py-32 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Le Fonctionnement</h2>
          <p className="text-slate-500 font-medium italic">Un processus transparent, adapté à vos objectifs.</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-slate-950 p-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm flex">
            <button 
              onClick={() => setActiveTab('recruiter')}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'recruiter' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Je suis Recruteur
            </button>
            <button 
              onClick={() => setActiveTab('candidate')}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'candidate' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Je suis Candidat
            </button>
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'recruiter' && (
              <motion.div 
                key="recruiter"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {[
                  {
                    step: "01",
                    icon: <Target className="text-blue-600" size={32} />,
                    title: "Expression du Besoin IA",
                    desc: "Ouvrez une 'Chasse IA' en définissant vos critères exacts. L'algorithme scanne en temps réel notre base d'experts de +10 000 talents."
                  },
                  {
                    step: "02",
                    icon: <Cpu className="text-blue-600" size={32} />,
                    title: "Filtrage et Validation KYC",
                    desc: "L'IA ne sélectionne que les candidats dont les documents sont 100% authentifiés et certifiés. Seuls les profils matchant à >90% vous sont proposés."
                  },
                  {
                    step: "03",
                    icon: <CheckCircle2 className="text-blue-600" size={32} />,
                    title: "La Shortlist Élite Garantie",
                    desc: "Recevez votre top sélection confidentielle de talents avec leur 'Indice de Placabilité', et accédez aux candidats immédiatement prêts pour l'embauche."
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-transform relative overflow-hidden group">
                    <div className="text-[6rem] font-black text-slate-100 dark:text-slate-900 absolute -top-6 -right-2 z-0 tracking-tighter leading-none group-hover:text-blue-50 dark:group-hover:text-blue-900/20 transition-colors">{item.step}</div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'candidate' && (
              <motion.div 
                key="candidate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {[
                  {
                    step: "01",
                    icon: <FileText className="text-emerald-600" size={32} />,
                    title: "Importation IA de CV",
                    desc: "Commencez par la 'Roadmap de Base'. Uploadez votre CV et laissez l'intelligence artificielle extraire et structurer toute votre carrière automatiquement."
                  },
                  {
                    step: "02",
                    icon: <ShieldCheck className="text-emerald-600" size={32} />,
                    title: "Dossier KYC & Certifications",
                    desc: "La vérification administrative. Soumettez CNI et diplômes pour que l'équipe Travago valide manuellement votre identité et vous attribue le statut 'Certifié'."
                  },
                  {
                    step: "03",
                    icon: <Briefcase className="text-emerald-600" size={32} />,
                    title: "Score de Placabilité",
                    desc: "Atteignez un indice de placabilité parfait (100%). Plus votre score est élevé, plus l'IA vous propulse en priorité vers les offres du marché caché."
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-transform relative overflow-hidden group">
                    <div className="text-[6rem] font-black text-slate-100 dark:text-slate-900 absolute -top-6 -right-2 z-0 tracking-tighter leading-none group-hover:text-emerald-50 dark:group-hover:text-emerald-900/20 transition-colors">{item.step}</div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* =========================================
   4. FEATURE TEASER SECTION
   ========================================= */
export function FeatureSection() {
  return (
    <section id="recrutement-ia" className="py-32 bg-slate-900 dark:bg-slate-950 border-y border-slate-800 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center relative z-10">
        <div>
          <div className="inline-flex items-center px-4 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Technologie Propriétaire</div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.9] mb-8">
            Sourcing <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Chirurgical.</span>
          </h2>
          <p className="text-slate-400 font-medium italic text-lg leading-relaxed mb-10">
            Fini les piles de CVs non qualifiés. Travago attribue un « Placability Score » (Score de placement) unique à chaque profil, basé sur la pertinence, la fiabilité des documents (KYC) et la demande du marché.
          </p>
          
          <ul className="space-y-6">
            <li className="flex items-start">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 mr-4">
                <Sparkles className="text-blue-400" />
              </div>
              <div className="mt-1">
                <h4 className="text-white font-black uppercase text-sm mb-1 tracking-tight">Ciblage Contextuel</h4>
                <p className="text-xs text-slate-500">L'IA comprend les synonymes ! "Dev Frontend" matchera avec "React Engineer".</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 mr-4">
                <Lock className="text-blue-400" />
              </div>
              <div className="mt-1">
                <h4 className="text-white font-black uppercase text-sm mb-1 tracking-tight">Authenticité Garantie</h4>
                <p className="text-xs text-slate-500">Une équipe humaine vérifie les diplômes en amont. Vous avez la garantie de l'excellence.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Animated UI Mockup */}
        <div className="relative">
          <div className="bg-slate-800 p-8 rounded-[3rem] shadow-2xl relative border-4 border-slate-700/50">
            <div className="flex items-center justify-between mb-8">
              <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Analyse Profil Talent #T854</div>
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30 animate-pulse">Match: 98%</div>
            </div>

            <div className="relative group overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-700 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                   <UserCheck className="text-blue-400" size={28} />
                </div>
                <div>
                  <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-slate-800 rounded"></div>
                </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">
                      <span>Compétences Requises</span>
                      <span className="text-green-400">100% Match</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-full rounded-full"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">
                      <span>Vérification Diplômes</span>
                      <span className="text-green-400">Validé</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-full rounded-full"></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================
   5. PRICING SECTION
   ========================================= */
export function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-slate-50 dark:bg-slate-900 px-6 lg:px-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-900/30 shadow-sm">Tarifs Recruteurs</div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9] mb-6">
            L'Excellence <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Accessible.</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl mx-auto mb-10">L'Intelligence Artificielle travaille pour vous. Vous ne payez que le résultat. Aucun engagement caché.</p>
          
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-950 px-5 py-2.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-[#ff6600] rounded-lg flex items-center justify-center text-white font-black text-[10px]">OM</div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 dark:text-slate-400">Orange Money</span>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-950 px-5 py-2.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-[#ffcc00] rounded-lg flex items-center justify-center text-slate-900 font-black text-[10px]">MOMO</div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 dark:text-slate-400">MTN Mobile Money</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {[
            {
              title: "Déblocage Unitaire",
              price: "10 000",
              currency: "FCFA",
              subtitle: "/ talent ciblé",
              desc: "Parfait pour valider un profil spécifique que vous avez repéré dans notre base.",
              featured: false,
              features: ["Accès au numéro de téléphone", "Accès Complet au CV PDF", "Vue des Scores d'Authenticité KYC"]
            },
            {
              title: "Mission Standard",
              price: "20 000",
              currency: "FCFA",
              subtitle: "/ recherche IA",
              desc: "L'IA exécute une recherche globale sur tous nos candidats certifiés selon vos critères.",
              featured: true,
              badge: "Le Plus Populaire",
              features: ["Génération d'une Shortlist (3 Talents)", "Match IA Précis garanti >80%", "Priorité de Traitement des Dossiers"]
            },
            {
              title: "Chasse VIP",
              price: "30 000",
              currency: "FCFA",
              subtitle: "/ recrutement",
              desc: "Confiez l'intégralité du processus de sourcing à notre plateforme et nos experts.",
              featured: false,
              features: ["Chasse Approfondie (Top 10 Profils)", "Test de compétences poussé", "Assurance Remplacement (Si échec)"]
            }
          ].map((plan, i) => (
            <div key={i} className={`p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border-2 bg-white dark:bg-slate-950 transition-all relative flex flex-col h-full ${plan.featured ? 'border-blue-600 shadow-2xl shadow-blue-900/10 scale-100 lg:scale-[1.05] z-10 dark:shadow-none' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
              {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 font-black text-white px-6 py-1.5 rounded-full text-[10px] uppercase tracking-widest italic shadow-lg shadow-blue-600/30 whitespace-nowrap">{plan.badge}</div>}

              <h3 className={`text-2xl font-black uppercase tracking-tighter mb-4 italic ${plan.featured ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{plan.title}</h3>

              <div className="flex items-baseline mb-3">
                <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.price}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">{plan.currency}</div>
              </div>
              <div className="inline-block px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest text-slate-500 mb-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">{plan.subtitle}</div>

              <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 text-sm italic leading-relaxed flex-grow">{plan.desc}</p>

              <ul className="space-y-5 mb-10 mt-auto">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start text-[11px] font-black uppercase text-slate-900 dark:text-slate-200 italic leading-snug">
                    <CheckCircle2 size={16} className={`${plan.featured ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'} mr-3 shrink-0 flex-none`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register/entreprise" className={`block w-full py-5 rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-widest text-center transition-all ${plan.featured ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700' : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700'}`}>
                Acheter ce Pack
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================
   6. SUCCESS STORIES / TESTIMONIALS
   ========================================= */
export function SuccessStoriesSection() {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-950 px-6 lg:px-12 relative overflow-hidden transition-colors duration-300">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[100px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <Star size={12} className="mr-2 text-blue-600 dark:text-blue-400" /> Succès Prouvés
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9] mb-6">
            Ils ont fait <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">Match.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium italic max-w-2xl mx-auto mb-10">Ce sont les algorithmiques qui connectent, mais ce sont les humains qui accomplissent de grandes choses.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              role: "Responsable RH - FinTech",
              quote: "Auparavant, sifter 500 CVs me prenait une semaine pleine. Avec la fonctionnalité de 'Chasse IA' de Travago, l'algorithme a validé les diplômes (KYC) et m'a sorti un candidat à 98% de pertinence en 2 heures. C'est bluffant.",
              stats: "Temps gagné: 4 Jours",
            },
            {
              role: "Ingénieur Backend Embauché",
              quote: "Mon 'Indice de Placabilité' est monté à 100% après la certification administrative faite par Travago. Le lendemain, une licorne tech confidentielle me proposait un entretien. Je n'ai même pas eu besoin de postuler.",
              stats: "Placé en 24h",
            },
            {
              role: "Directeur Général",
              quote: "Le système de crédits à la demande (via Mobile Money) est parfait. Nous ne payons plus pour publier des annonces dans le vide, nous payons pour débloquer les coordonnées d'un candidat parfait sélectionné scrupuleusement par l'IA.",
              stats: "Match Parfait: Top 3",
            }
          ].map((story, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900/50 p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none hover:border-blue-300 dark:hover:border-blue-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group flex flex-col h-full">
              <Quote className="text-blue-500/30 mb-6 group-hover:text-blue-500 transition-colors" size={40} />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed mb-10 flex-grow">"{story.quote}"</p>
              
              <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-between items-end">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest">{story.role}</h4>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800/30">
                  {story.stats}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
