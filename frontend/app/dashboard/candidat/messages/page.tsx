'use client';

import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, Loader2, ChevronLeft, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';
import { getImageUrl } from '@/lib/utils';

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
        photo: string | null;
        first_name?: string;
        last_name?: string;
        company_profile?: { name: string };
    };
    last_message?: { content: string; created_at: string };
    unread_count: number;
}

function getDisplayName(participant: Conversation['other_participant']): string {
    if (!participant) return 'Inconnu';
    if (participant.role === 'COMPANY') {
        return participant.company_profile?.name || participant.username || participant.email?.split('@')[0] || 'Entreprise';
    }
    const full = `${participant.first_name || ''} ${participant.last_name || ''}`.trim();
    return full || participant.username || participant.email?.split('@')[0] || 'Candidat';
}

export default function MessagesPage() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [showChat, setShowChat] = useState(false); // Mobile: show chat panel or list panel
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
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

    const handleSelectConversation = (chat: Conversation) => {
        setSelectedConversation(chat);
        setShowChat(true); // On mobile, switch to chat view
    };

    const handleBackToList = () => {
        setShowChat(false);
        setSelectedConversation(null);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || isSending) return;

        setIsSending(true);
        try {
            const response = await axiosInstance.post(`chat/${selectedConversation.id}/send_message/`, {
                content: newMessage
            });
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
            fetchConversations();
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setIsSending(false);
        }
    };

    const filteredConversations = conversations.filter(c => {
        const name = getDisplayName(c.other_participant).toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-8rem)] bg-white rounded-[2.5rem] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex">

            {/* ─── Sidebar: Conversation List ─────────────────────────────────── */}
            {/* On mobile: visible only when showChat=false */}
            <div className={`
                flex-col border-r border-slate-100
                ${showChat ? 'hidden' : 'flex'} w-full
                md:flex md:w-80 lg:w-96
            `}>
                <div className="p-5 border-b border-slate-50 shrink-0">
                    <h2 className="text-xl font-black text-slate-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-10 text-center">
                            <MessageSquare size={40} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 text-sm font-medium">
                                {searchQuery ? 'Aucune conversation trouvée.' : 'Aucune conversation encore.'}
                            </p>
                        </div>
                    ) : (
                        filteredConversations.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectConversation(chat)}
                                className={`p-4 sm:p-5 flex items-center space-x-4 cursor-pointer transition-all hover:bg-slate-50 border-b border-slate-50/80 ${selectedConversation?.id === chat.id ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : ''}`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center font-black text-blue-700 overflow-hidden relative">
                                        {chat.other_participant?.photo ? (
                                            <Image
                                                src={getImageUrl(chat.other_participant.photo)}
                                                alt="Avatar"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span>{getDisplayName(chat.other_participant).charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <h4 className="font-black text-slate-900 truncate text-sm">
                                            {getDisplayName(chat.other_participant)}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-400 shrink-0">
                                            {chat.last_message
                                                ? new Date(chat.last_message.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-medium text-slate-500 truncate">
                                            {chat.last_message?.content || 'Démarrez la conversation'}
                                        </p>
                                        {chat.unread_count > 0 && (
                                            <span className="shrink-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                                                {chat.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ─── Chat Panel ─────────────────────────────────────────────────── */}
            {/* On mobile: visible only when showChat=true */}
            <div className={`
                flex-1 flex-col bg-slate-50/30
                ${showChat ? 'flex' : 'hidden'}
                md:flex
            `}>
                {!selectedConversation ? (
                    /* Empty state — desktop only */
                    <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center p-10 opacity-40">
                        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Sélectionnez une discussion</h3>
                        <p className="text-sm font-medium text-slate-500">Choisissez une conversation dans la liste pour commencer.</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-3">
                                {/* Back button — mobile only */}
                                <button
                                    onClick={handleBackToList}
                                    className="md:hidden p-2 text-slate-500 hover:text-blue-600 bg-slate-100 rounded-xl mr-1 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold overflow-hidden relative shrink-0">
                                    {selectedConversation.other_participant?.photo ? (
                                        <Image
                                            src={getImageUrl(selectedConversation.other_participant.photo)}
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span>{getDisplayName(selectedConversation.other_participant).charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-sm leading-tight">
                                        {getDisplayName(selectedConversation.other_participant)}
                                    </h3>
                                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En ligne</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                    <Phone size={18} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                    <Video size={18} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center py-12 opacity-30">
                                    <p className="text-xs font-black uppercase tracking-widest">Aucun message — dites bonjour ! 👋</p>
                                </div>
                            )}
                            {messages.map((msg) => {
                                const isMe = msg.sender === user?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] sm:max-w-md px-4 py-3 rounded-2xl shadow-sm ${isMe
                                                ? 'bg-blue-600 text-white rounded-br-sm'
                                                : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'
                                            }`}>
                                            <p className="text-sm font-medium leading-relaxed break-words">{msg.content}</p>
                                            <p className={`text-[10px] mt-1.5 font-bold uppercase tracking-widest ${isMe ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Bar */}
                        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button type="button" className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shrink-0">
                                    <Paperclip size={18} />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Écrire un message..."
                                        disabled={isSending}
                                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-all">
                                        <Smile size={18} />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSending || !newMessage.trim()}
                                    className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 shrink-0"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
