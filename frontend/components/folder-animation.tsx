'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    MousePointer2,
    CheckCircle2,
    Code,
    Stethoscope,
    ChefHat,
    Truck,
    HardHat,
    Camera,
    Building2,
    Cpu,
    Brain,
    Zap,
    Mouse
} from 'lucide-react';
import { useState, useEffect } from 'react';

const PROFESSIONS = [
    { icon: Code, label: "Développeur", color: "bg-blue-500", x: -140, y: -90, delay: 0 },
    { icon: Stethoscope, label: "Santé", color: "bg-rose-500", x: 140, y: -80, delay: 0.1 },
    { icon: ChefHat, label: "Cuisine", color: "bg-orange-500", x: -120, y: 70, delay: 0.2 },
    { icon: Truck, label: "Logistique", color: "bg-emerald-500", x: 130, y: 90, delay: 0.3 },
    { icon: HardHat, label: "BTP/Génie", color: "bg-amber-500", x: 40, y: -130, delay: 0.15 },
    { icon: Camera, label: "Média", color: "bg-purple-500", x: -40, y: 130, delay: 0.4 },
    { icon: Building2, label: "Commerce", color: "bg-indigo-500", x: -180, y: 0, delay: 0.25 },
    { icon: Cpu, label: "Intelligence IA", color: "bg-cyan-500", x: 180, y: 10, delay: 0.35 },
];

export const FolderClickAnimation = () => {
    const [phase, setPhase] = useState<'idle' | 'moving' | 'clicked' | 'professions' | 'success'>('idle');

    useEffect(() => {
        const sequence = async () => {
            // Reset
            setPhase('idle');
            await new Promise(r => setTimeout(r, 1000));

            // Move to center text
            setPhase('moving');
            await new Promise(r => setTimeout(r, 1200));

            // Click
            setPhase('clicked');
            await new Promise(r => setTimeout(r, 400));

            // Explosion & Scan
            setPhase('professions');
            await new Promise(r => setTimeout(r, 4000));

            // Success
            setPhase('success');
            await new Promise(r => setTimeout(r, 2500));

            // Loop restart
            sequence();
        };

        sequence();
        return () => { };
    }, []);

    return (
        <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] flex items-center justify-center bg-slate-950 overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-all">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.12),transparent)]" />

            {/* Ambient Background Circles */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600 rounded-full blur-[100px]"
                />
            </div>

            {/* Central Slogan Box - The Target */}
            <motion.div
                animate={
                    phase === 'clicked' ? { scale: 0.9, backgroundColor: 'rgba(59, 130, 246, 0.2)' } :
                        phase === 'professions' || phase === 'success' ? { scale: 0.8, opacity: 0.5 } : { scale: 1 }
                }
                className="relative z-10 px-8 py-5 sm:px-12 sm:py-7 bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl transition-all"
            >
                <motion.div
                    animate={phase === 'idle' || phase === 'moving' ? { opacity: 1 } : { opacity: 0.3 }}
                    className="flex flex-col items-center"
                >
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2 opacity-60">Travago AI</div>
                    <div className="text-xl sm:text-3xl font-black text-white italic uppercase tracking-tighter whitespace-nowrap">
                        Un clic, tous emplois
                    </div>
                </motion.div>

                {/* Internal Scan Indicator */}
                <AnimatePresence>
                    {phase === 'professions' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-blue-600/10 rounded-[2rem] overflow-hidden"
                        >
                            <Brain size={48} className="text-blue-500 animate-pulse opacity-50" />
                            <motion.div
                                animate={{ top: ['-10%', '110%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-blue-500/20 to-transparent z-10"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Mouse Cursor Interaction */}
            <motion.div
                initial={{ x: 150, y: 150, opacity: 0 }}
                animate={
                    phase === 'moving' ? { x: 0, y: 0, opacity: 1 } :
                        phase === 'clicked' ? { x: 0, y: 0, opacity: 1, scale: 0.85 } :
                            { x: 150, y: 150, opacity: 0 }
                }
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                className="absolute z-50 pointer-events-none"
            >
                <div className="relative">
                    <MousePointer2 size={44} className="text-white fill-blue-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    {phase === 'clicked' && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 8, opacity: 0 }}
                            className="absolute top-0 left-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full blur-sm"
                        />
                    )}
                </div>
            </motion.div>

            {/* Exploding Jobs - Appears after click */}
            <AnimatePresence>
                {(phase === 'professions' || phase === 'success') && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        {PROFESSIONS.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                                animate={{
                                    x: job.x,
                                    y: job.y,
                                    scale: 1,
                                    opacity: 1,
                                    rotate: i % 2 === 0 ? 8 : -8
                                }}
                                exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                                transition={{
                                    type: "spring",
                                    damping: 20,
                                    stiffness: 120,
                                    delay: job.delay
                                }}
                                className="absolute left-1/2 top-1/2 -ml-16 -mt-10 sm:-ml-24 sm:-mt-14"
                            >
                                <div className="bg-slate-900/80 backdrop-blur-2xl p-3 sm:p-5 rounded-3xl border border-white/10 shadow-2xl flex items-center space-x-3 sm:space-x-5 min-w-[140px] sm:min-w-[200px] hover:scale-110 transition-transform">
                                    <div className={`w-10 h-10 sm:w-14 sm:h-14 ${job.color} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
                                        <job.icon size={22} className="sm:hidden" />
                                        <job.icon size={32} className="hidden sm:block" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[12px] sm:text-[15px] font-black text-white leading-tight uppercase tracking-tighter italic">{job.label}</div>
                                        <div className="flex items-center mt-1">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-2" />
                                            <div className="text-[8px] sm:text-[10px] font-bold text-blue-400 uppercase tracking-widest">Match Certifié</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* HUD Status Bar */}
            <AnimatePresence>
                {phase === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40"
                    >
                        <div className="bg-blue-600 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                            <Zap size={18} className="mr-3 fill-white" />
                            Recrutement Instantané Réussi
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scanning Overlay Effect */}
            {phase === 'professions' && (
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        initial={{ top: '10%' }}
                        animate={{ top: '90%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-10 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-50 shadow-[0_0_25px_rgba(59,130,246,1)]"
                    />
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-600/10 to-transparent opacity-50" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-blue-600/10 to-transparent opacity-50" />
                </div>
            )}
        </div>
    );
};
