'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Home,
    Briefcase,
    FileText,
    ShieldCheck,
    Bell,
    MessageSquare,
    Settings,
    LogOut,
    Award,
    Menu,
    X,
    FolderCheck,
    Zap,
    LayoutDashboard,
    User,
    Power
} from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth-store';
import AuthGuard from '@/components/auth-guard';
import NotificationsDropdown from '@/components/notifications-dropdown';

export default function CandidateDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', href: '/dashboard/candidat' },
        { icon: <FolderCheck size={20} />, label: 'Mes Documents (KYC)', href: '/dashboard/candidat/documents' },
        { icon: <Award size={20} />, label: 'Mes Certifications', href: '/dashboard/candidat/certifs' },
        { icon: <Zap size={20} />, label: 'Opportunités', href: '/dashboard/candidat/offres' },
        { icon: <User size={20} />, label: 'Mon Profil & CV', href: '/dashboard/candidat/profil' },
        { icon: <Briefcase size={20} />, label: 'État du Placement', href: '/dashboard/candidat/candidatures' },
        { icon: <MessageSquare size={20} />, label: 'Messages', href: '/dashboard/candidat/messages' },
        { icon: <Settings size={20} />, label: 'Paramètres', href: '/dashboard/candidat/parametres' },
    ];

    return (
        <AuthGuard allowedRoles={['CANDIDATE']}>
            <div className="min-h-screen bg-slate-50">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed top-0 left-0 z-50 w-72 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-white border-r border-blue-50 shadow-sm shadow-blue-500/5 overflow-y-auto overflow-x-hidden custom-scrollbar`}>
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
                                <h1 className="text-xl font-black bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent tracking-tighter">
                                    TRAVAGO
                                </h1>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mt-1">Personnel Placement</p>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="space-y-2 mb-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-4 font-sans">Menu Principal</p>
                            {menuItems.map((item, idx) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                                            : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                                            }`}
                                    >
                                        <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} transition-colors mr-3`}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                        {item.badge && (
                                            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ring-2 ring-white font-black ${isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Identity Status */}
                        <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <ShieldCheck className="text-blue-600" size={18} />
                                <span className="text-xs font-black text-blue-900 uppercase">Vérification</span>
                            </div>
                            <p className="text-[10px] font-bold text-blue-700 leading-tight mb-3">Complétez votre KYC pour être éligible au placement.</p>
                            <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-1000"
                                    style={{ width: `${mounted ? (user?.candidate_profile?.reliability_score || 0) : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Logout */}
                        <div className="pt-6 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all w-full group"
                            >
                                <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="md:ml-72 flex flex-col min-h-screen">
                    <header className="bg-white/80 backdrop-blur-md border-b border-blue-50 sticky top-0 z-30">
                        <div className="px-4 md:px-8 py-5">
                            <div className="flex items-center justify-between">
                                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-blue-600 bg-blue-50 rounded-xl">
                                    <Menu size={24} />
                                </button>
                                <div className="hidden md:block">
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Espace Candidat 👋</h2>
                                    <p className="text-sm font-medium text-slate-500 italic">"Votre carrière, notre priorité intelligente."</p>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        title="Déconnexion"
                                    >
                                        <Power size={20} />
                                    </button>
                                    <NotificationsDropdown />
                                    <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>
                                    <div className="flex items-center space-x-3 pl-2">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-sm font-black text-slate-900">{mounted ? (user?.username || 'Utilisateur') : '...'}</div>
                                            <div className="text-[10px] font-black text-green-600 uppercase tracking-widest">@En ligne</div>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 uppercase overflow-hidden relative border-2 border-white">
                                            {mounted && user?.photo ? (
                                                <Image
                                                    src={getImageUrl(user.photo) || ''}
                                                    alt="Avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span>{mounted ? (user?.username?.substring(0, 1).toUpperCase() || 'U') : 'U'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="p-3 sm:p-6 md:p-8 flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
