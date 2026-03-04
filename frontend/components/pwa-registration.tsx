'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
    useEffect(() => {
        // Disable PWA in development to prevent ChunkLoadErrors
        if (process.env.NODE_ENV === 'development') {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (let registration of registrations) {
                        registration.unregister();
                        console.log('Service Worker unregistered (Development Mode)');
                    }
                });
            }
            return;
        }

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('SW registered: ', registration);
                    },
                    (registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    }
                );
            });
        }
    }, []);

    return null;
}
