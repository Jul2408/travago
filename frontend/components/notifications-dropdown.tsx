'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    link?: string;
}

export default function NotificationsDropdown() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastNotifId, setLastNotifId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        let isMounted = true;
        let interval: NodeJS.Timeout;

        const load = async () => {
            if (isAuthenticated && isMounted) {
                await fetchNotifications(isMounted);
                // Polling every 10 seconds
                interval = setInterval(() => fetchNotifications(isMounted), 10000);
            }
        };

        load();

        return () => {
            isMounted = false;
            if (interval) clearInterval(interval);
        };
    }, [isAuthenticated]);

    const playNotificationSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log("Audio play blocked by browser. User interaction required first."));
        } catch (error) {
            console.error("Error playing notification sound:", error);
        }
    };

    const fetchNotifications = async (isMounted: boolean = true) => {
        try {
            const response = await axiosInstance.get('notifications/');
            if (!isMounted) return;

            const newNotifs = response.data.results || response.data;

            // Check for new notifications to play sound
            if (lastNotifId !== null && newNotifs.length > 0) {
                const latestId = newNotifs[0].id;
                const unread = newNotifs.filter((n: any) => !n.is_read);
                if (latestId > lastNotifId && unread.length > 0) {
                    playNotificationSound();
                }
            }

            if (newNotifs.length > 0) {
                setLastNotifId(newNotifs[0].id);
            }

            setNotifications(newNotifs);
        } catch (err) {
            // Silently fail for cancellations or nav errors
            if (isMounted) console.error('Failed to fetch notifications', err);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await axiosInstance.patch(`notifications/${id}/`, { is_read: true });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const handleNotificationClick = async (n: Notification) => {
        if (!n.is_read) {
            await markAsRead(n.id);
        }
        if (n.link) {
            setIsOpen(false);
            router.push(n.link);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full ring-2 ring-white shadow-lg animate-in fade-in zoom-in duration-300">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-x-4 mt-3 md:absolute md:inset-auto md:right-0 md:mt-3 md:w-80 bg-white rounded-2xl shadow-2xl border border-blue-50 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-blue-50 flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-sm">Notifications</h3>
                        {unreadCount > 0 && <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucune notification</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-blue-50 hover:bg-slate-50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-sm font-black ${!n.is_read ? 'text-blue-900' : 'text-slate-900'}`}>{n.title}</h4>
                                            {n.link && <ExternalLink size={10} className="text-blue-400" />}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">
                                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p
                                        className={`text-xs text-slate-500 font-medium leading-relaxed transition-all ${expandedId === n.id ? '' : 'line-clamp-2'}`}
                                        onClick={(e) => {
                                            if (n.message.length > 60) {
                                                e.stopPropagation();
                                                setExpandedId(expandedId === n.id ? null : n.id);
                                            }
                                        }}
                                    >
                                        {n.message}
                                        {n.message.length > 60 && expandedId !== n.id && (
                                            <span className="text-blue-500 ml-1 font-black text-[10px] uppercase cursor-pointer hover:underline">...Lire plus</span>
                                        )}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full py-3 bg-slate-50 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 transition-colors">
                        Voir toutes les notifications
                    </button>
                </div>
            )}
        </div>
    );
}

