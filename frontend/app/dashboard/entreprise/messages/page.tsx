'use client';

import {
    Search, Send, MoreVertical, Phone, Video, Search as SearchIcon,
    Paperclip, Smile, Calendar, ExternalLink, ShieldCheck, Loader2,
    MessageSquare, ChevronLeft
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
    id: number;
    sender: number;
    sender_email: string;
    content: string;
    created_at: string;
}

interface Conversation {
    id: number;
    participants: number[];
    other_participant: {
        id: number;
        email: string;
        username: string;
        role: string;
        first_name?: string;
        last_name?: string;
        candidate_profile?: { id: number; photo?: string };
        company_profile?: { id: number; name?: string; logo?: string };
        photo: string | null;
    };
    last_message?: { content: string; created_at: string };
    unread_count: number;
}

export default function EnterpriseMessagesPage() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [showListOnMobile, setShowListOnMobile] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMounted(true);
        fetchConversations();
        // Poll for new conversations every 10s
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
            if (window.innerWidth < 768) {
                setShowListOnMobile(false);
            }
            // Poll for new messages every 5s
            const interval = setInterval(() => fetchMessages(selectedConversation.id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedConversation?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await axiosInstance.get('chat/');
            setConversations(response.data.results || response.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to fetch conversations', err);
            setIsLoading(false);
        }
    };

    const fetchMessages = async (id: number) => {
        try {
            const response = await axiosInstance.get(`chat/${id}/messages/`);
            setMessages(response.data.results || response.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || isSending) return;

        setIsSending(true);
        try {
            const response = await axiosInstance.post(`chat/${selectedConversation.id}/send_message/`, {
                content: newMessage
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
            setIsSending(false);
            fetchConversations();
        } catch (err) {
            console.error('Failed to send message', err);
            setIsSending(false);
        }
    };

    const filteredConversations = conversations.filter(chat => {
        const other = chat.other_participant;
        const name = other?.role === 'CANDIDATE'
            ? (other.first_name && other.last_name ? `${other.first_name} ${other.last_name}` : (other.username ? `@${other.username}` : other.email))
            : (other?.company_profile?.name || (other.username ? `@${other.username}` : other.email));
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-12rem)] bg-white rounded-[2.5rem] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)] bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-blue-50 overflow-hidden flex">
            {/* Sidebar: Candidate List */}
            <div className={`${showListOnMobile ? 'flex' : 'hidden'} md:flex w-full md:w-80 lg:w-96 border-r border-blue-50 flex flex-col`}>
                <div className="p-5 sm:p-8 border-b border-blue-50">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 sm:mb-6 uppercase tracking-tighter">Conversations</h2>
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Chercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 transition-all font-sans"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 font-medium">
                            Aucun résultat trouvé.
                        </div>
                    ) : (
                        filteredConversations.map((chat) => {
                            const other = chat.other_participant;
                            const photo = other?.photo;
                            const name = other?.role === 'CANDIDATE'
                                ? (other.first_name && other.last_name ? `${other.first_name} ${other.last_name}` : (other.username ? `@${other.username}` : other.email))
                                : (other?.company_profile?.name || (other.username ? `@${other.username}` : other.email));

                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedConversation(chat)}
                                    className={`p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 cursor-pointer transition-all hover:bg-blue-50/50 ${selectedConversation?.id === chat.id ? 'bg-blue-50/50 border-r-4 border-blue-600' : ''}`}
                                >
                                    <div className="relative shrink-0">
                                        {photo ? (
                                            <div className="w-11 h-11 sm:w-14 sm:h-14 relative rounded-xl sm:rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
                                                <Image
                                                    src={getImageUrl(photo) || ''}
                                                    alt={name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-blue-600 border border-blue-100 shadow-sm uppercase text-xs sm:text-base">
                                                {name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-black text-slate-900 truncate uppercase tracking-tighter">
                                                {name}
                                            </h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase">
                                                {chat.last_message ? new Date(chat.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">
                                            {other?.role === 'CANDIDATE' ? 'Candidat' : 'Recruteur'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-slate-500 truncate">{chat.last_message?.content || 'Démarrez la conversation'}</p>
                                            {chat.unread_count > 0 && (
                                                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black ring-2 ring-white">
                                                    {chat.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Content */}
            <div className={`${!showListOnMobile ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-slate-50/30`}>
                {!selectedConversation ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-50">
                        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6">
                            <MessageSquare className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 whitespace-nowrap">Sélectionnez un candidat</h3>
                        <p className="text-sm font-medium text-slate-500">Commencez l'entretien digital via notre interface sécurisée.</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="px-4 py-4 sm:p-6 bg-white border-b border-blue-50 flex items-center justify-between">
                            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                                <button
                                    onClick={() => setShowListOnMobile(true)}
                                    className="md:hidden p-2 text-blue-600 bg-blue-50 rounded-lg mr-2"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                {(() => {
                                    const other = selectedConversation.other_participant;
                                    const photo = other?.photo;
                                    const name = other?.role === 'CANDIDATE'
                                        ? (other.first_name && other.last_name ? `${other.first_name} ${other.last_name}` : (other.username ? `@${other.username}` : other.email))
                                        : (other?.company_profile?.name || (other.username ? `@${other.username}` : other.email));

                                    return (
                                        <>
                                            {photo ? (
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg shadow-blue-100">
                                                    <Image
                                                        src={getImageUrl(photo) || ''}
                                                        alt={name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-100 italic uppercase text-[10px] sm:text-sm">
                                                    {name.substring(0, 2)}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="flex items-center space-x-1 sm:space-x-2">
                                                    <h3 className="font-black text-slate-900 leading-tight uppercase tracking-tighter truncate text-xs sm:text-base">
                                                        {name}
                                                    </h3>
                                                    <ShieldCheck size={12} className="text-blue-600 shrink-0" />
                                                </div>
                                                <p className="text-[8px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none truncate font-sans">
                                                    {other?.role === 'CANDIDATE' ? 'Candidat Certifié' : 'Recruteur Partenaire'}
                                                </p>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <button
                                    onClick={() => setIsPlanningModalOpen(true)}
                                    className="px-2 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center"
                                >
                                    <Calendar size={12} className="sm:mr-2" /> <span className="hidden sm:inline">Planifier Entretien</span>
                                </button>
                                <button className="p-2 sm:p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all"><Phone size={18} /></button>
                                <button className="hidden sm:block p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-4 sm:space-y-8 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] sm:max-w-md p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm relative ${msg.sender === user?.id
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-700 rounded-bl-none border border-blue-50'
                                        }`}>
                                        <p className="text-xs sm:text-sm font-semibold leading-relaxed tracking-tight font-sans">{msg.content}</p>
                                        <p className={`text-[8px] sm:text-[10px] mt-2 sm:mt-3 font-black uppercase tracking-widest ${msg.sender === user?.id ? 'text-blue-200' : 'text-slate-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Recruiter Action Bar: Shortcuts */}
                        <div className="px-4 sm:px-10 py-3 bg-white border-t border-blue-50 flex items-center space-x-3 sm:space-x-4 overflow-x-auto custom-scrollbar">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Suggestions :</span>
                            {["Demander CV", "Entretien ?", "Score IA"].map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => setNewMessage(t)}
                                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSendMessage} className="p-4 sm:p-8 bg-white border-t border-blue-50">
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <button type="button" className="p-3 sm:p-4 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl sm:rounded-2xl transition-all"><Paperclip size={18} /></button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Message..."
                                        className="w-full pl-4 pr-10 sm:pl-6 sm:pr-14 py-3 sm:py-4.5 bg-slate-50 border-none rounded-xl sm:rounded-[2rem] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 transition-all font-sans"
                                    />
                                    <button type="button" className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-all">
                                        <Smile size={18} />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSending || !newMessage.trim()}
                                    className="p-3.5 sm:p-5 bg-blue-600 text-white rounded-xl sm:rounded-[2rem] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:-translate-y-0"
                                >
                                    {isSending ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            {/* Candidate Context Sidebar */}
            {selectedConversation && (
                <div className="hidden lg:flex w-72 bg-white border-l border-blue-50 flex-col p-8">
                    <div className="text-center mb-8 pb-8 border-b border-slate-50">
                        {(() => {
                            const other = selectedConversation.other_participant;
                            const photo = other?.photo;
                            const name = other?.role === 'CANDIDATE'
                                ? (other.first_name && other.last_name ? `${other.first_name} ${other.last_name}` : other.username || other.email.split('@')[0])
                                : (other?.company_profile?.name || other?.username || other?.email.split('@')[0]);

                            return (
                                <>
                                    {photo ? (
                                        <div className="w-24 h-24 relative rounded-[2.5rem] overflow-hidden border-2 border-white shadow-xl mx-auto mb-4">
                                            <Image
                                                src={getImageUrl(photo) || ''}
                                                alt={name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center font-black text-4xl text-blue-200 mx-auto mb-4 border-2 border-white shadow-xl italic uppercase">
                                            {name.substring(0, 2)}
                                        </div>
                                    )}
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter truncate">
                                        {name}
                                    </h4>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                        {other?.role === 'CANDIDATE' ? 'Candidat Certifié' : 'Recruteur Partenaire'}
                                    </p>
                                </>
                            );
                        })()}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Vérifications Travago</h5>
                            <div className="space-y-2">
                                {[
                                    { name: "Logic & IQ", score: "Vérifié", color: "text-green-600" },
                                    { name: "Documents", score: "Ok", color: "text-blue-600" }
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <span className="text-[10px] font-black text-blue-800">{c.name}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${c.color}`}>{c.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            {selectedConversation.other_participant?.candidate_profile?.id ? (
                                <Link
                                    href={`/dashboard/entreprise/candidats/${selectedConversation.other_participant.candidate_profile.id}`}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center"
                                >
                                    <ExternalLink size={14} className="mr-2" /> Dossier Candidat
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center cursor-not-allowed"
                                >
                                    <ExternalLink size={14} className="mr-2" /> Dossier Indisponible
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Planning Modal Placeholder */}
            {isPlanningModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900">Planifier un entretien</h3>
                            <button onClick={() => setIsPlanningModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={20} className="rotate-90" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-800">Candidat : {(() => {
                                    const other = selectedConversation?.other_participant;
                                    return other?.role === 'CANDIDATE' ? `${other.first_name} ${other.last_name}` : other?.username;
                                })()}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de l'entretien</label>
                                <input type="date" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Heure de l'entretien</label>
                                <input type="time" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>
                            <button
                                onClick={() => {
                                    toast.success("Entretien planifié ! Le candidat recevra une notification.");
                                    setIsPlanningModalOpen(false);
                                }}
                                className="w-full py-5 mt-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                            >
                                Confirmer la planification
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
