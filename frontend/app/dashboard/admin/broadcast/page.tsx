'use client';

import { useState } from 'react';
import { Megaphone, Send, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import axiosInstance from '@/lib/axios';

export default function BroadcastPage() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("Voulez-vous vraiment envoyer ce message à TOUTE la communauté ?")) return;

        setIsSending(true);
        setStatus(null);
        try {
            await axiosInstance.post('notifications/broadcast/', {
                title,
                message,
                link: link || undefined
            });
            setStatus({ type: 'success', msg: 'Le message a été envoyé avec succès à tous les membres.' });
            setTitle('');
            setMessage('');
            setLink('');
        } catch (error: any) {
            console.error("Broadcast failed", error);
            setStatus({ type: 'error', msg: error.response?.data?.error || "Une erreur est survenue lors de l'envoi." });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200">
                    <Megaphone size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Diffusion Communautaire</h1>
                    <p className="text-slate-500 font-medium tracking-tight italic">Envoyez une annonce importante à tous les membres de Travago.</p>
                </div>
            </div>

            {status && (
                <div className={`p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-black uppercase text-xs tracking-widest">{status.msg}</span>
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <form onSubmit={handleSend} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre de l'annonce</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Nouvelle fonctionnalité IA disponible !"
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contenu du message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Décrivez votre annonce ici..."
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all h-40 resize-none"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lien optionnel (ex: /offres)</label>
                                <input
                                    type="text"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="/dashboard/candidat/offres"
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSending}
                            className="w-full px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200 disabled:opacity-50"
                        >
                            {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            Diffuser à la communauté
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 rounded-[3rem] p-8 text-white space-y-6 shadow-2xl shadow-slate-200">
                        <div className="flex items-center gap-3">
                            <Info size={20} className="text-blue-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Conseils de diffusion</h3>
                        </div>
                        <ul className="space-y-4 text-xs font-bold text-slate-400">
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                Soyez concis et percutant dans vos titres.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                Utilisez les liens pour guider les membres vers une action précise.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                Attention : ce message sera envoyé à TOUS les membres inscrits.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 rounded-[3rem] p-8 border border-blue-100 space-y-4">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Aperçu Notification</h3>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
                            <h4 className="text-sm font-black text-slate-900 mb-1">{title || 'Titre de votre annonce'}</h4>
                            <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{message || 'Contenu de votre message...'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
