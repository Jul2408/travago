'use client';

import { useState, useEffect } from 'react';

import {
    Coins,
    CreditCard,
    History,
    Zap,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    ShoppingBag,
    CheckCircle2,
    DollarSign,
    ArrowDownLeft,
    ArrowUpRight as ArrowUp
} from 'lucide-react';

import { useAuthStore } from '@/lib/store/auth-store';
import axiosInstance from '@/lib/axios';

export default function CreditsPage() {
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);


    const packs = [
        {
            name: "Pack Découverte",
            credits: 200,
            price: "15,000 FCFA",
            popular: false,
            features: ["Accès à 5 profils Elite", "Tests IA Basiques", "Validité 30 jours"]
        },
        {
            name: "Pack Croissance RH",
            credits: 1000,
            price: "60,000 FCFA",
            popular: true,
            features: ["Accès à 25 profils Elite", "Placement IA Assisté", "Analyses Prédictives", "Validité Illimitée"]
        },
        {
            name: "Pack Enterprise Plus",
            credits: 5000,
            price: "250,000 FCFA",
            popular: false,
            features: ["Accès Illimité Elite", "Chasseur IA Dédié", "Vérification KYC Prioritaire", "Accès API"]
        }
    ];

    // Payment State
    const [selectedPack, setSelectedPack] = useState<typeof packs[0] | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'OM' | 'MOMO'>('OM');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPolling, setIsPolling] = useState(false);

    const [transactions, setTransactions] = useState<any[]>([]);
    const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const [paymentMode, setPaymentMode] = useState<'TEST' | 'LIVE' | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axiosInstance.get('users/transactions/');
            setTransactions(res.data.results || res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const downloadCSV = () => {
        if (transactions.length === 0) return alert("Aucune transaction à exporter.");

        const headers = ["Référence", "Date", "Description", "Montant (FCFA)", "Statut"];
        const rows = transactions.map(tr => [
            tr.reference,
            new Date(tr.created_at).toLocaleString('fr-FR'),
            tr.description,
            tr.amount,
            tr.status
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `factures_travago_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePayment = async () => {
        if (!phoneNumber) return alert("Veuillez entrer un numéro de téléphone.");
        if (!selectedPack) return;

        setIsProcessing(true);
        setValidationMessage(null);

        try {
            const response = await axiosInstance.post('users/transactions/initiate_payment/', {
                amount: parseInt(selectedPack.price.replace(/\D/g, '')),
                credits: selectedPack.credits,
                payment_method: paymentMethod,
                phone_number: phoneNumber
            });

            const { message, transaction_id, mode } = response.data;

            setValidationMessage(message);
            setCurrentTransactionId(transaction_id);
            setPaymentMode(mode);
            setIsPolling(true);

            // Start polling for completion
            pollTransactionStatus(transaction_id);

        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Erreur lors de l'initiation du paiement.";
            alert(errorMsg);
            setIsProcessing(false);
        }
    };

    const handleSimulateSuccess = async () => {
        if (!currentTransactionId) return;

        try {
            await axiosInstance.post(`users/transactions/${currentTransactionId}/simulate_success/`);
            // The polling will pick it up, or we can manually trigger it
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la simulation.");
        }
    };

    const pollTransactionStatus = async (txId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await axiosInstance.get(`users/transactions/${txId}/check_status/`);
                if (res.data.status === 'COMPLETED') {
                    clearInterval(interval);
                    setIsProcessing(false);
                    setIsPolling(false);
                    setSelectedPack(null);
                    setCurrentTransactionId(null);
                    setValidationMessage(null);
                    alert("✅ Paiement validé avec succès ! Vos crédits ont été ajoutés.");
                    // Refresh data
                    fetchTransactions();
                    window.location.reload();
                } else if (res.data.status === 'FAILED') {
                    clearInterval(interval);
                    setIsProcessing(false);
                    setIsPolling(false);
                    alert("❌ Le paiement a échoué ou a été annulé.");
                }
            } catch (err) {
                console.error(err);
                // Keep polling if it's just a network error
            }
        }, 3000);

        // Stop polling after 2 minutes
        setTimeout(() => {
            clearInterval(interval);
            if (isPolling) {
                setIsPolling(false);
                setIsProcessing(false);
                alert("Le délai d'attente est dépassé. Si vous avez bien payé, vos crédits apparaîtront bientôt.");
            }
        }, 120000);
    };

    if (!mounted) return null;

    return (
        <div className="space-y-12 pb-20 text-slate-900 relative">
            {/* Payment Modal */}
            {selectedPack && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900">
                                {isPolling ? 'Attente de Validation' : 'Paiement Sécurisé'}
                            </h3>
                            <button
                                onClick={() => {
                                    if (isPolling) {
                                        if (confirm("Le paiement est en cours. Voulez-vous vraiment fermer cette fenêtre ?")) {
                                            setSelectedPack(null);
                                            setIsPolling(false);
                                            setIsProcessing(false);
                                        }
                                    } else {
                                        setSelectedPack(null);
                                    }
                                }}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <ArrowUp size={20} className="rotate-45" />
                            </button>
                        </div>

                        {!isPolling ? (
                            <>
                                <div className="mb-8">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pack sélectionné</div>
                                    <div className="flex justify-between items-baseline">
                                        <div className="text-lg font-black text-slate-800">{selectedPack.name}</div>
                                        <div className="text-lg font-black text-blue-600">{selectedPack.price}</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setPaymentMethod('OM')}
                                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'OM' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}
                                        >
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-xs">OM</div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Orange Money</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('MOMO')}
                                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'MOMO' ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100 hover:border-yellow-200'}`}
                                        >
                                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-black text-xs">MoMo</div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Mobile Money</span>
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Numéro de Téléphone</label>
                                        <input
                                            type="tel"
                                            placeholder="6XX XX XX XX"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full px-4 py-4 bg-slate-50 border-none rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-300"
                                        />
                                        <p className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                                            <ShieldCheck size={12} className="text-emerald-500" /> Paiement chiffré et sécurisé par notre partenaire.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? 'Initiation...' : 'Payer Maintenant'}
                                        {!isProcessing && <ArrowUpRight size={16} />}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 space-y-6">
                                <div className="relative inline-block">
                                    <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Zap size={32} className="text-blue-600 animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                                        {validationMessage}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 animate-pulse">
                                        Attente de confirmation USSD...
                                    </p>
                                </div>

                                {paymentMode === 'TEST' && (
                                    <div className="pt-4 border-t border-slate-100 mt-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Zone de Test Développeur</p>
                                        <button
                                            onClick={handleSimulateSuccess}
                                            className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Simuler la réussite du paiement
                                        </button>
                                    </div>
                                )}

                                <p className="text-[11px] font-medium text-slate-400">
                                    Veuillez ne pas fermer cette fenêtre. Nous détectons automatiquement la réussite de votre paiement.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Budget & Crédits</h1>
                    <p className="text-slate-500 font-medium">Investissez dans les meilleurs talents pour votre croissance.</p>
                </div>

                {/* Solde Card - Deep Blue */}
                <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 border border-blue-400 flex items-center justify-between min-w-[380px] relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 mb-2">Solde de Placement Total</div>
                        <div className="text-5xl font-black mb-1">{user?.credits || 0}</div>
                        <div className="text-xs font-bold text-blue-100 flex items-center">
                            <Zap size={14} className="mr-1 text-orange-400 fill-orange-400" /> Crédits Travago actifs
                        </div>
                    </div>
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
                        <Coins size={40} className="text-white" />
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
                </div>
            </div>

            {/* Credit Packs */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black tracking-tight">Recharger mon compte</h2>
                    <div className="flex items-center space-x-4">
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200">
                            Mode Simulation
                        </span>
                        <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            <span>Paiement OM / MoMo</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {packs.map((pack, idx) => (
                        <div key={idx} className={`relative bg-white rounded-[3rem] p-10 border-2 transition-all hover:shadow-2xl hover:scale-[1.02] flex flex-col ${pack.popular ? 'border-blue-600 shadow-xl z-10' : 'border-blue-50 shadow-sm'}`}>
                            {pack.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
                                    Plus Populaire
                                </div>
                            )}
                            <div className="text-center mb-10">
                                <h3 className={`text-xl font-black mb-4 ${pack.popular ? 'text-blue-600' : 'text-slate-900'}`}>{pack.name}</h3>
                                <div className="flex items-center justify-center mb-2">
                                    <span className="text-5xl font-black text-slate-900">{pack.credits}</span>
                                    <span className="ml-2 text-sm text-slate-400 font-bold uppercase tracking-widest">Crédits</span>
                                </div>
                                <div className="text-slate-900 font-black text-2xl">{pack.price}</div>
                            </div>

                            <ul className="space-y-5 mb-12 flex-1 pt-6 border-t border-slate-50">
                                {pack.features.map((f, i) => (
                                    <li key={i} className="flex items-start text-sm font-bold text-slate-600">
                                        <CheckCircle2 size={18} className="text-blue-600 mr-3 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setSelectedPack(pack)}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center transition-all ${pack.popular ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-100'}`}
                            >
                                <ShoppingBag size={18} className="mr-3" /> Commander le pack
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transactions History - Simplified Blue Theme */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-blue-50 overflow-hidden mt-16">
                <div className="p-8 border-b border-blue-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xl font-black tracking-tight flex items-center text-slate-900">
                        <History size={24} className="mr-3 text-blue-600" /> Historique de Facturation
                    </h3>
                    <button
                        onClick={downloadCSV}
                        className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all border border-blue-100"
                    >
                        Télécharger les factures (.CSV)
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50/30">
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-blue-400">Réf Transaction</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-blue-400">Date et Heure</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-blue-400">Désignation</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-blue-400 text-right">Variation</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-blue-400 text-right">Statut IA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">Aucune transaction pour le moment.</td>
                                </tr>
                            ) : (
                                transactions.map((tr) => (
                                    <tr key={tr.id} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="p-6 text-sm font-black text-slate-900">{tr.reference}</td>
                                        <td className="p-6 text-sm font-bold text-slate-500">{new Date(tr.created_at).toLocaleString('fr-FR')}</td>
                                        <td className="p-6 text-sm font-black text-slate-700">{tr.description}</td>
                                        <td className={`p-6 text-sm font-black text-right ${tr.transaction_type === 'DEPOSIT' ? 'text-green-600' : 'text-blue-600'}`}>
                                            <span className="flex items-center justify-end">
                                                {tr.transaction_type === 'DEPOSIT' ? (
                                                    <span className="flex items-center">
                                                        <ArrowUp size={14} className="mr-1" />
                                                        {tr.amount > 0 ? `${tr.amount} FCFA` : `+${tr.credits_amount} Cr.`}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <ArrowDownLeft size={14} className="mr-1" />
                                                        {tr.credits_amount} Cr.
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${tr.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                tr.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                    'bg-red-50 text-red-700 border border-red-100'
                                                }`}>
                                                {tr.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assistance Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center space-x-6 text-center md:text-left">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                        <DollarSign size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-blue-900 leading-tight mb-2">Besoin d'un devis personnalisé ?</h4>
                        <p className="text-sm font-medium text-blue-700 leading-relaxed">
                            Pour les recrutements massifs ou les besoins grands groupes, contactez notre équipe commerciale.
                        </p>
                    </div>
                </div>
                <a
                    href="mailto:contact@travago.ci?subject=Demande de Devis Personnalisé"
                    className="px-10 py-5 bg-white text-blue-600 border-2 border-blue-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-blue-600 transition-all shadow-sm"
                >
                    Contacter un conseiller
                </a>
            </div>
        </div>
    );
}
