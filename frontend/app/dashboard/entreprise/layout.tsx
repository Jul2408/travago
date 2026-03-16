'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    MessageSquare,
    Settings,
    BarChart3,
    Cpu,
    Coins,
    Bell,
    Menu,
    X,
    ShieldCheck,
    Search,
    Building2,
    Power,
    LogOut
} from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import AuthGuard from '@/components/auth-guard';
import NotificationsDropdown from '@/components/notifications-dropdown';
import { ThemeToggle } from '@/components/theme-toggle';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';

export default function BusinessDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        setMounted(true);
        if (isAuthenticated) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 20000); // Check every 20s
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const fetchUnreadCount = async () => {
        try {
            const res = await axiosInstance.get('chat/unread_total/');
            setUnreadMessages(res.data.unread_count || 0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    interface MenuItem {
        icon: ReactNode;
        label: string;
        href: string;
        badge?: string | number;
    }

    const menuItems: MenuItem[] = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', href: '/dashboard/entreprise' },
        { icon: <Cpu size={20} />, label: 'Placement IA', href: '/dashboard/entreprise/placement' },
        { icon: <Users size={20} />, label: 'Base de Talents', href: '/dashboard/entreprise/candidats' },
        { icon: <Briefcase size={20} />, label: 'Mes Offres', href: '/dashboard/entreprise/offres' },
        { icon: <BarChart3 size={20} />, label: 'Statistiques', href: '/dashboard/entreprise/stats' },
        { icon: <MessageSquare size={20} />, label: 'Messages', href: '/dashboard/entreprise/messages', badge: unreadMessages > 0 ? unreadMessages : undefined },
        { icon: <Coins size={20} />, label: 'Budget & Crédits', href: '/dashboard/entreprise/credits' },
        { icon: <Settings size={20} />, label: 'Paramètres', href: '/dashboard/entreprise/parametres' },
    ];

    return (
        <AuthGuard allowedRoles={['COMPANY']}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar - Recruiter Blue Theme */}
                <aside className={`fixed top-0 left-0 z-50 w-72 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-white dark:bg-slate-900 border-r border-blue-50 dark:border-slate-800 shadow-sm overflow-y-auto overflow-x-hidden custom-scrollbar transition-colors`}>
                    <div className="min-h-full px-6 py-8 flex flex-col">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 mb-10 pl-2">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo.jpeg"
                                    alt="Travago Logo"
                                    fill
                                    className="rounded-xl object-cover shadow-sm ring-2 ring-blue-50"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-black bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-tighter leading-none">
                                    TRAVAGO
                                </h1>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mt-1">Espace Recruteur</p>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="space-y-1.5 mb-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-4 font-sans">Pilotage</p>
                            {menuItems.map((item, idx) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
                                            }`}
                                    >
                                        <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'} transition-colors mr-3`}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                        {item.badge && (
                                            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full ring-2 ring-white font-black animate-in fade-in zoom-in duration-300 bg-red-600 text-white shadow-lg shadow-red-200">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Credits Shortcut */}
                        <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 mb-6 font-black">
                            <div className="flex items-center justify-between text-[10px] text-blue-400 uppercase tracking-widest mb-2">
                                <span>Crédits Recrutement</span>
                                <Coins size={14} />
                            </div>
                            <div className="text-xl text-blue-700 leading-none mb-4">{mounted ? (user?.credits || 0) : '...'}</div>
                            <Link href="/dashboard/entreprise/credits" className="block text-center py-2 bg-blue-600 text-white rounded-xl text-[10px] hover:bg-blue-700 transition-colors uppercase tracking-widest shadow-lg shadow-blue-100">
                                Acheter plus
                            </Link>
                        </div>

                        {/* Logout */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-bold text-sm transition-all w-full group"
                            >
                                <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="md:ml-72 flex flex-col min-h-screen overflow-x-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-blue-50 dark:border-slate-800 sticky top-0 z-30 transition-colors">
                        <div className="px-4 md:px-8 py-5">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="md:hidden p-2 text-blue-600 bg-blue-50 rounded-xl"
                                >
                                    <Menu size={24} />
                                </button>
                                <div className="hidden md:block">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Espace Recrutement 💼</h2>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        title="Déconnexion"
                                    >
                                        <Power size={20} />
                                    </button>
                                    <ThemeToggle />
                                    <NotificationsDropdown />
                                    <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>
                                    <div className="flex items-center space-x-3 pl-2 group cursor-pointer" onClick={() => router.push('/dashboard/entreprise/parametres')}>
                                        <div className="text-right hidden sm:block">
                                            <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-w-[100px]">
                                                {mounted ? (user?.company_profile?.name || user?.username || 'Recruteur') : <span className="invisible">Recruteur</span>}
                                            </div>
                                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Espace Entreprise</div>
                                        </div>
                                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-blue-100 dark:border-blue-900/30 group-hover:ring-2 group-hover:ring-blue-600 transition-all flex items-center justify-center bg-blue-50 dark:bg-slate-800">
                                            {mounted && user?.photo ? (
                                                <Image
                                                    src={getImageUrl(user.photo)}
                                                    alt="Avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-blue-700 font-black uppercase text-xs">
                                                    {mounted ? (user?.company_profile?.name?.substring(0, 2) || user?.username?.substring(0, 2) || 'EN') : '...'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="p-3 sm:p-6 md:p-8 flex-1 w-full max-w-7xl mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
