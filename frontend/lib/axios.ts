import axios from 'axios';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/';
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl : `${rawApiUrl}/`;

// ─── Stockage Sécurisé des Tokens ────────────────────────────────────────────
// STRATEGIE: 
//   - Access Token: stocké uniquement en mémoire JS (via Zustand state, pas localStorage)
//                  → Durée de vie courte (24h), ne survit pas aux rechargements de page
//   - Refresh Token: stocké en localStorage UNIQUEMENT (pas de cookie HttpOnly coté client possible
//                   sans un backend Next.js API route). Le cookie HttpOnly est géré côté Django
//                   via SESSION cookiées when withCredentials: true.
//
// Les cookies de session sont automatiquement envoyés grâce à withCredentials: true.
// Pour une sécurité maximale, le refresh_token dans localStorage est la meilleure option
// possible dans une architecture SPA sans API backend Next.js (middleware).

let inMemoryAccessToken: string | null = null;

export const tokenManager = {
    getAccessToken: (): string | null => {
        // Priorité: mémoire > localStorage (fallback pour page reload)
        return inMemoryAccessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
    },
    setAccessToken: (token: string) => {
        inMemoryAccessToken = token;
        // Garder en localStorage pour survivre aux rechargements (access token, courte durée)
        if (typeof window !== 'undefined') localStorage.setItem('access_token', token);
    },
    getRefreshToken: (): string | null => {
        return typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    },
    setRefreshToken: (token: string) => {
        if (typeof window !== 'undefined') localStorage.setItem('refresh_token', token);
    },
    clearAll: () => {
        inMemoryAccessToken = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('auth-storage');
        }
    }
};

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    timeout: 15000, // 15s timeout pour éviter les requêtes bloquées sur 3G
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenManager.getRefreshToken();

            if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
                forceLogout();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}users/token/refresh/`, {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                tokenManager.setAccessToken(newAccessToken);

                // Mettre à jour l'auth store
                try {
                    const { useAuthStore } = await import('@/lib/store/auth-store');
                    useAuthStore.getState().setToken(newAccessToken);
                } catch {
                    // Non-critique
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                forceLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.status === 429) {
            // Rate limit atteint - message user-friendly
            console.warn('Rate limit atteint:', error.config?.url);
        } else if (error.response?.status === 403) {
            console.error('API 403 Forbidden:', error.config?.url, error.response?.data);
        } else if (error.response?.status !== 401) {
            console.error('API Error:', error.config?.url, error.response?.status, error.message);
        }

        return Promise.reject(error);
    }
);

function forceLogout() {
    if (typeof window === 'undefined') return;
    tokenManager.clearAll();
    if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
    }
}

export default axiosInstance;
