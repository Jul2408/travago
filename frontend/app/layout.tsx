import type { Metadata } from "next";
import "./globals.css";
import PWARegistration from "@/components/pwa-registration";

export const metadata: Metadata = {
  title: "Travago - Excellence du Placement IA",
  description: "La plateforme de recrutement de nouvelle génération au Cameroun. Sourcing intelligent et certification de talents.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
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
      </body>
    </html>
  );
}
