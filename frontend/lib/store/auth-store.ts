import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    photo?: string | null;
    role: 'CANDIDATE' | 'COMPANY' | 'ADMIN';
    is_candidate: boolean;
    is_company: boolean;
    candidate_profile?: {
        id: number;
        first_name: string;
        last_name: string;
        title: string | null;
        phone: string;
        location: string;
        photo: string | null;
        placability_score: number;
        reliability_score: number;
        is_verified: boolean;
        skills: string[];
        bio: string | null;
        cv: string | null;
        experience: any[];
        documents: any[];
    };
    company_profile?: {
        id: number;
        name: string;
        sector: string;
        city: string;
        phone: string;
        logo: string | null;
        is_verified: boolean;
        description: string | null;
        website: string | null;
        address: string | null;
    };
    credits: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string, refreshToken?: string) => void;
    setToken: (token: string) => void;
    updateUser: (user: User) => void;
    fetchUser: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token, refreshToken) => {
                localStorage.setItem('access_token', token);
                if (refreshToken) {
                    localStorage.setItem('refresh_token', refreshToken);
                }
                set({ user, token, isAuthenticated: true });
            },
            setToken: (token) => {
                localStorage.setItem('access_token', token);
                set({ token });
            },
            updateUser: (user) => {
                set({ user });
            },
            fetchUser: async () => {
                try {
                    // Dynamic import to avoid circular dependency issues if any arise in future
                    const axiosInstance = (await import('@/lib/axios')).default;
                    const response = await axiosInstance.get('users/me/');
                    set({ user: response.data });
                } catch (error) {
                    console.error('Failed to refresh user data', error);
                }
            },
            logout: async () => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                try {
                    const { resetAnalytics } = await import('@/components/analytics-provider');
                    resetAnalytics();
                } catch (e) {
                    // Ignore analytics import issues
                }

                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
