import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach the JWT access token to every outgoing request.
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token && token !== 'undefined' && token !== 'null') {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On 401, try to silently refresh the access token using the stored refresh token.
// If refresh also fails, log the user out.
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait in queue until the refresh is done
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

            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
                // No refresh token available → logout
                forceLogout();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}users/token/refresh/`, {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                localStorage.setItem('access_token', newAccessToken);

                // Also update the auth store token
                try {
                    const { useAuthStore } = await import('@/lib/store/auth-store');
                    useAuthStore.getState().setToken(newAccessToken);
                } catch {
                    // Store update is non-critical
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

        // Log non-401 errors for debugging
        if (error.response?.status === 403) {
            console.error('API 403 Forbidden:', error.config?.url, error.response?.data);
        } else if (error.response?.status !== 401) {
            console.error('API Error:', error.config?.url, error.response?.status, error.message);
        }

        return Promise.reject(error);
    }
);

function forceLogout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Clear the Zustand persisted state
    localStorage.removeItem('auth-storage');
    // Redirect to login page
    if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
    }
}

export default axiosInstance;
