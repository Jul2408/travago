import type { Metadata } from "next";
import "./globals.css";
import PWARegistration from "@/components/pwa-registration";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'Travago - Recrutement Intelligent au Cameroun',
  description: 'La première plateforme de placement IA au Cameroun. Trouvez des candidats qualifiés ou décrochez l\'emploi de vos rêves en quelques secondes.',
  keywords: ['emploi', 'recrutement', 'Cameroun', 'travail', 'placement', 'IA', 'douala', 'yaoundé'],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-192.png",
    shortcut: "/logo-192.png",
    apple: "/logo-192.png",
  },
  openGraph: {
    title: 'Travago - Recrutement Intelligent au Cameroun',
    description: 'Trouvez votre prochain emploi ou recrutez les meilleurs talents avec l\'IA.',
    url: 'https://travago-eta.vercel.app',
    siteName: 'Travago',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <PWARegistration />
        {children}
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}
