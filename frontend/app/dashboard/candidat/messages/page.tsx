'use client';

import { Search, Send, MoreVertical, Phone, Video, Search as SearchIcon, Paperclip, Smile, Loader2 } from 'lucide-react';
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

export default function MessagesPage() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchConversations();
        // Poll for new conversations every 10s
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
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

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-12rem)] bg-white rounded-[2.5rem] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-12rem)] bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex">
            {/* Sidebar: Chat List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col">
                <div className="p-6 border-b border-slate-50">
                    <h2 className="text-xl font-black text-slate-900 mb-4">Messages</h2>
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher une conversation..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-slate-400 text-sm font-medium">Aucune conversation trouvée.</p>
                        </div>
                    ) : (
                        conversations.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedConversation(chat)}
                                className={`p-6 flex items-center space-x-4 cursor-pointer transition-all hover:bg-slate-50 ${selectedConversation?.id === chat.id ? 'bg-blue-50/50 border-r-4 border-blue-600' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center font-black text-blue-700 border border-blue-200 flex-shrink-0 overflow-hidden relative">
                                        {chat.other_participant?.photo ? (
                                            <Image
                                                src={getImageUrl(chat.other_participant.photo)}
                                                alt="Avatar"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span>{(chat.other_participant?.username || chat.other_participant?.email).charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-black text-slate-900 truncate">
                                            {(() => {
                                                const other = chat.other_participant;
                                                if (other.role === 'COMPANY') return other.company_profile?.name || other.username || other.email;
                                                if (other.first_name || other.last_name) return `${other.first_name || ''} ${other.last_name || ''}`.trim();
                                                return other.username || other.email.split('@')[0];
                                            })()}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            {chat.last_message ? new Date(chat.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-500 truncate">{chat.last_message?.content || 'Démarrez la conversation'}</p>
                                        {chat.unread_count > 0 && (
                                            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
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

            {/* Chat Content */}
            <div className="flex-1 flex flex-col bg-slate-50/30">
                {!selectedConversation ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-50">
                        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6">
                            <MessageSquare className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Sélectionnez une discussion</h3>
                        <p className="text-sm font-medium text-slate-500">Choisissez une conversation dans la liste pour commencer à échanger.</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold relative overflow-hidden">
                                    {selectedConversation.other_participant?.photo ? (
                                        <Image
                                            src={getImageUrl(selectedConversation.other_participant.photo)}
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span>{(selectedConversation.other_participant?.username || selectedConversation.other_participant?.email).substring(0, 2).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 leading-tight">
                                        {(() => {
                                            const other = selectedConversation.other_participant;
                                            if (other.role === 'COMPANY') return other.company_profile?.name || other.username || other.email;
                                            if (other.first_name || other.last_name) return `${other.first_name || ''} ${other.last_name || ''}`.trim();
                                            return other.username || other.email.split('@')[0];
                                        })()}
                                    </h3>
                                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">En ligne</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Phone size={20} /></button>
                                <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Video size={20} /></button>
                                <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages.length === 0 && (
                                <div className="text-center py-10 opacity-30">
                                    <p className="text-sm font-black uppercase tracking-widest">Aucun message</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-md p-5 rounded-[2rem] shadow-sm ${msg.sender === user?.id
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                                        }`}>
                                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                        <p className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${msg.sender === user?.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
                            <div className="flex items-center space-x-4">
                                <button type="button" className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Paperclip size={20} /></button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Écrire un message..."
                                        disabled={isSending}
                                        className="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                                    />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-all">
                                        <Smile size={20} />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSending || !newMessage.trim()}
                                    className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

// Dummy icon for empty state
function MessageSquare(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}
