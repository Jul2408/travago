// Travago Service Worker — Stratégie hors-ligne robuste
const CACHE_NAME = 'travago-v4';
const STATIC_CACHE = 'travago-static-v4';
const API_BASE = '/api/';

const PRECACHED_URLS = [
    '/',
    '/manifest.json',
    '/logo-192.png',
    '/logo-512.png',
    '/dashboard/candidat',
    '/dashboard/candidat/offres',
    '/dashboard/candidat/profil',
    '/dashboard/candidat/candidatures',
    '/dashboard/entreprise',
];

// --- Install: Pre-cache static assets ---
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHED_URLS))
    );
});

// --- Activate: Clean up old caches ---
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((names) =>
                Promise.all(
                    names
                        .filter(n => n !== CACHE_NAME && n !== STATIC_CACHE)
                        .map(n => caches.delete(n))
                )
            )
        ])
    );
});

// --- Fetch: Smart routing strategy ---
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET & cross-origin requests
    if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
        return;
    }

    // Navigation requests => Network First, fallback to cache, then offline.html
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return caches.match(request).then(cached => {
                        return cached || caches.match('/offline.html');
                    });
                })
        );
        return;
    }

    // API calls => Network First, fall back to cache
    if (url.pathname.startsWith(API_BASE)) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Static assets (images, fonts, scripts) => Cache First
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (!response || response.status !== 200) return response;
                const clone = response.clone();
                caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
                return response;
            });
        })
    );
});

