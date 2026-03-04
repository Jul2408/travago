'use client';

import { Activity } from 'lucide-react';

export default function DefaultAdminPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                <Activity size={40} className="text-blue-600" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-slate-800 mb-2">Fonctionnalité en Développement</h1>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                    Cette section de l'administration est en cours de construction. Elle sera disponible très prochainement.
                </p>
            </div>
            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
                Retour au Tableau de Bord
            </button>
        </div>
    );
}
