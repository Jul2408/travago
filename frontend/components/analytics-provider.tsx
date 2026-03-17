'use client';

// ─── Travago Analytics Provider ───────────────────────────────────────────────
// Utilise PostHog pour tracker les événements clés sans PII sensibles.
// Ne s'active QUE si l'utilisateur a accepté les cookies analytics (bannière RGPD).
//
// SETUP:
//   1. Créez un compte gratuit sur https://posthog.com
//   2. Créez un projet et copiez votre "Project API Key"
//   3. Ajoutez la variable dans Vercel: NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
//   4. (Optionnel) Ajoutez aussi: NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
//      pour les serveurs EU (recommandé pour conformité RGPD)

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';
const GDPR_STORAGE_KEY = 'travago_gdpr_consent';

// Helper global pour tracker les événements depuis n'importe quel composant
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture(eventName, {
            ...properties,
            platform: 'travago_web',
            timestamp: new Date().toISOString(),
        });
    }
};

// Helper pour identifier l'utilisateur après login
export const identifyUser = (userId: string | number, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.identify(String(userId), traits);
    }
};

// Helper pour reset à la déconnexion
export const resetAnalytics = () => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.reset();
    }
};

function initPostHog() {
    if (!POSTHOG_KEY || typeof window === 'undefined') return;
    if ((window as any).__posthog_initialized) return;

    // Chargement dynamique du SDK PostHog (léger ~35kb)
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.innerHTML = `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('${POSTHOG_KEY}', {
            api_host: '${POSTHOG_HOST}',
            capture_pageview: false,
            persistence: 'localStorage+cookie',
            autocapture: false,
            disable_session_recording: true,
            loaded: function(ph) {
                if (location.hostname === 'localhost') ph.opt_out_capturing();
            }
        });
    `;
    document.head.appendChild(script);
    (window as any).__posthog_initialized = true;
}

export default function AnalyticsProvider() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Vérifier le consentement RGPD avant d'initialiser
        const consent = localStorage.getItem(GDPR_STORAGE_KEY);
        if (consent) {
            const parsed = JSON.parse(consent);
            if (parsed.analytics) {
                initPostHog();
            }
        }

        // Exposer la fonction d'init pour la bannière RGPD
        (window as any).initAnalytics = initPostHog;
    }, []);

    // Tracker les changements de page (SPA page views)
    useEffect(() => {
        if (typeof window === 'undefined' || !(window as any).posthog) return;
        (window as any).posthog.capture('$pageview', {
            '$current_url': window.location.href,
            path: pathname,
        });
    }, [pathname, searchParams]);

    return null; // Composant purement fonctionnel, pas de rendu
}
