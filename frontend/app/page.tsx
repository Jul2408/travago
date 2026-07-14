import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, Zap, Target, ShieldCheck, CheckCircle2, Lock, Clock, Coins, 
  Briefcase, Search, Star, MessageSquare, FileText, ChevronRight, MapPin,
  Mail, Phone, Linkedin, Facebook, Twitter, Instagram
} from 'lucide-react';
import LandingNavbar from '@/components/landing-navbar';
import { getImageUrl } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travago - Recrutez l\'Élite. Trouvez des Opportunités Uniques.',
  description: 'Première plateforme de placement au Cameroun boostée à l\'Intelligence Artificielle. Un match parfait en 24h.',
};

// Safe data fetching to prevent ECONNREFUSED from crashing the dev server
async function getJobOffers() {
  try {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/';
    const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl : `${rawApiUrl}/`;

    // AbortController to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

    const res = await fetch(`${API_URL}jobs/offers/`, { 
      next: { revalidate: 60 },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const text = await res.text();
    if (!text) return [];

    const data = JSON.parse(text);
    return Array.isArray(data.results) ? data.results.slice(0, 3) : (Array.isArray(data) ? data.slice(0, 3) : []);
  } catch (error) {
    console.error("Failed to fetch jobs SSR. Make sure Django is running on port 8000.", error);
    return [];
  }
}

// Client Component Wrapper for animations
import { HeroSection, FeatureSection, HowItWorksSection, PricingSection, StatsSection, InfiniteMarquee, SuccessStoriesSection } from '@/app/page-client-components';

export default async function Home() {
  const offers = await getJobOffers();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-200 selection:text-blue-900 transition-colors flex flex-col overflow-x-hidden">
      <LandingNavbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <HeroSection />

        {/* INFINITE ANIMATED TEXT */}
        <InfiniteMarquee />

        {/* STATS SECTION */}
        <StatsSection />

        {/* HOW IT WORKS SECTION (Detailed instructions) */}
        <HowItWorksSection />

        {/* FEATURE SECTION (AI capabilities highlighting) */}
        <FeatureSection />

        {/* 3. LATEST JOB OFFERS (Server Fetched) */}
        <section className="py-12 md:py-32 bg-white dark:bg-slate-950 px-6 lg:px-12 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-full h-1/2 bg-slate-50 dark:bg-slate-900/50 rounded-bl-[100px] -z-10"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 dark:border-blue-900/30">
                  Le marché caché
                </div>
                <h2 className="text-2xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
                  Nos Dernières<br />Opportunités.
                </h2>
              </div>
              <Link href="/register/candidat" className="flex items-center text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-6 py-3 rounded-full transition-all group">
                Voir tout le catalogue <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {offers.length > 0 ? (
                offers.map((offer: any) => (
                  <div key={offer.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-transform flex flex-col group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center p-2 relative overflow-hidden group-hover:scale-105 transition-transform shadow-sm">
                        {offer.company_detail?.logo ? (
                          <Image src={getImageUrl(offer.company_detail.logo)} alt={offer.company_detail.name} fill className="object-cover" />
                        ) : (
                          <Briefcase size={28} className="text-slate-400" />
                        )}
                      </div>
                      {offer.is_ia_boosted && (
                        <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                          <Zap size={12} className="mr-1.5" /> IA Boost
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3 leading-tight group-hover:text-blue-600 transition-colors">{offer.title}</h3>
                    
                    <div className="flex flex-col gap-2 mb-8">
                      <div className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400">
                        <Briefcase size={14} className="mr-2" />
                        {offer.company_detail?.name || 'Entreprise Confidentielle'}
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400">
                        <MapPin size={14} className="mr-2 text-red-400" />
                        {offer.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                        <Clock size={12} /> {offer.contract_type}
                      </span>
                      <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        <Coins size={12} /> {offer.salary_range || 'Confidentiel'}
                      </span>
                    </div>

                    <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
                      <Link href={`/login?callbackUrl=/dashboard/candidat/offres/${offer.slug || offer.id}`} className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                        Déposer ma candidature <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 md:py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2">Patientez...</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">Notre intelligence artificielle analyse actuellement de nouvelles opportunités. Créez un compte pour être notifié en premier.</p>
                  <Link href="/register/candidat" className="inline-block mt-8 px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
                    S'inscrire maintenant
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <PricingSection />

        {/* SUCCESS STORIES SECTION */}
        <SuccessStoriesSection />
      </main>

      {/* DETAILED PROFESSIONAL FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-24 pb-12 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
        {/* Footer Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40vw] max-w-[500px] h-[200px] bg-blue-600/10 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-12 lg:gap-8 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center space-x-3 group mb-6">
                <div className="relative w-12 h-12 bg-white rounded-xl overflow-hidden ring-4 ring-white/10 group-hover:scale-105 transition-transform">
                  <Image src="/logo.jpeg" alt="Travago Logo" fill className="object-cover" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase">TRAVAGO</div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 font-black mt-1">L'Excellence IA</p>
                </div>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                Travago révolutionne le recrutement au Cameroun en connectant les meilleurs talents aux entreprises les plus exigeantes grâce à une Intelligence Artificielle de pointe.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all transform hover:-translate-y-1"><Linkedin size={18} /></a>
                <a href="#" className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all transform hover:-translate-y-1"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all transform hover:-translate-y-1"><Facebook size={18} /></a>
                <a href="#" className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all transform hover:-translate-y-1"><Instagram size={18} /></a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-6">Candidats</h4>
              <ul className="space-y-4">
                <li><Link href="/register/candidat" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center"><ChevronRight size={14} className="mr-1" /> Créer un profil</Link></li>
                <li><Link href="#comment-ca-marche" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center"><ChevronRight size={14} className="mr-1" /> Comment ça marche ?</Link></li>
                <li><Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center"><ChevronRight size={14} className="mr-1" /> Consulter les offres</Link></li>
                <li><Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center"><ChevronRight size={14} className="mr-1" /> Accéder au Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-6">Entreprises</h4>
              <ul className="space-y-4">
                <li><Link href="/register/entreprise" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center"><ChevronRight size={14} className="mr-1" /> Inscrire mon entreprise</Link></li>
                <li><Link href="#pricing" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center"><ChevronRight size={14} className="mr-1" /> Tarifs & Crédits</Link></li>
                <li><Link href="#recrutement-ia" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center"><ChevronRight size={14} className="mr-1" /> Solutions Sourcing IA</Link></li>
                <li><Link href="#contact" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center"><ChevronRight size={14} className="mr-1" /> Contacter les ventes</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-6">Contact & Support</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin size={16} className="text-blue-600 dark:text-blue-500 mr-3 shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-400 text-sm leading-tight">Akwa, Douala<br />Cameroun</span>
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="text-blue-600 dark:text-blue-500 mr-3 shrink-0" />
                  <a href="tel:+237657948848" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">+237 600 00 00 00</a>
                </li>
                <li className="flex items-center">
                  <Mail size={16} className="text-blue-600 dark:text-blue-500 mr-3 shrink-0" />
                  <a href="mailto:contact@travago.cm" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">contact@travago.cm</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} TRAVAGO SA. Tous Droits Réservés.
            </p>
            <div className="flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Link href="/confidentialite" className="hover:text-blue-400 transition-colors">Politique de Confidentialité</Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
