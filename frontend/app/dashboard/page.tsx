'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

export default function DashboardRedirect() {
    // isLoading does not exist in our store, so we handle hydration check manually
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            if (user.role === 'CANDIDATE') {
                router.push('/dashboard/candidat');
            } else if (user.role === 'COMPANY') {
                router.push('/dashboard/entreprise');
            } else if (user.role === 'ADMIN') {
                router.push('/dashboard/admin');
            } else {
                // Fallback for unknown roles
                router.push('/');
            }
        }
    }, [user, isAuthenticated, router, mounted]);

    if (!mounted) {
        return null; // Or a simple loader
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Redirection en cours...</p>
            </div>
        </div>
    );
}
