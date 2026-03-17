'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectivityBanner() {
    const [isOffline, setIsOffline] = useState(false);
    const [showBackOnline, setShowBackOnline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            setShowBackOnline(true);
            setTimeout(() => setShowBackOnline(false), 3000);
        };
        const handleOffline = () => {
            setIsOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check
        if (!navigator.onLine) setIsOffline(true);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] flex justify-center p-4 pointer-events-none"
                >
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-white/10 backdrop-blur-md pointer-events-auto">
                        <div className="bg-red-500 p-1.5 rounded-lg animate-pulse">
                            <WifiOff size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Mode Hors-Ligne</span>
                            <span className="text-[10px] font-bold text-slate-400 leading-none">Connexion perdue. Les offres en cache sont disponibles.</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {showBackOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] flex justify-center p-4 pointer-events-none"
                >
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-white/10 backdrop-blur-md pointer-events-auto">
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <Wifi size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Retour en ligne !</span>
                            <span className="text-[10px] font-bold text-blue-100 leading-none">Votre connexion a été rétablie.</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
