'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: ('CANDIDATE' | 'COMPANY' | 'ADMIN')[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const { isAuthenticated, user, token } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounting, setIsMounting] = useState(true);

    useEffect(() => {
        setIsMounting(false);
    }, []);

    useEffect(() => {
        if (isMounting) return;

        if (!isAuthenticated || !token) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }

        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            // Redirect to their own dashboard if they are on the wrong one
            if (user.role === 'CANDIDATE') {
                router.push('/dashboard/candidat');
            } else if (user.role === 'COMPANY') {
                router.push('/dashboard/entreprise');
            } else {
                router.push('/dashboard');
            }
        }
    }, [isAuthenticated, user, token, router, pathname, allowedRoles, isMounting]);

    if (isMounting || !isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Chargement sécurisé...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
