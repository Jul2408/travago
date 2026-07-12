"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-blue-50 dark:border-slate-800 py-3 shadow-sm transition-colors">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative w-10 h-10 shadow-md rounded-xl overflow-hidden ring-2 ring-blue-50 dark:ring-slate-800 group-hover:scale-105 transition-transform">
                            <Image src="/logo.jpeg" alt="Travago Logo" fill className="object-cover" />
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase">TRAVAGO</div>
                            <p className="text-[7px] uppercase tracking-[0.3em] text-blue-600 font-black mt-1">Smart Placement</p>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center space-x-8">
                        <Link href="#recruteurs" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Entreprises</Link>
                        <Link href="#pricing" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Tarifs</Link>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
                        <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-blue-600 transition-colors">Connexion</Link>
                        <Link href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-95">S'inscrire</Link>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center space-x-4 lg:hidden">
                        <ThemeToggle />
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col transition-colors">
                    <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">TRAVAGO</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl active:scale-95 transition-transform"><X size={20} /></button>
                    </div>
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                        <Link href="#recruteurs" onClick={() => setMobileMenuOpen(false)} className="block text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Recrutement</Link>
                        <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Tarifs</Link>
                        <div className="pt-10 space-y-4">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest border border-slate-200 dark:border-slate-800 active:scale-95 transition-transform">Connexion</Link>
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-transform">Créer un compte</Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
