import type { Metadata } from 'next';
import '../index.css';

// D5 FIX: métadonnées SEO complètes avec template de titre par page
export const metadata: Metadata = {
  metadataBase: new URL('https://irotoribaroka.com'),
  title: {
    default: 'IROTORI BAROKA — Plateforme de Clarté Mentale',
    template: '%s — IROTORI BAROKA',
  },
  description: 'Réflexions, vidéos, e-books et projets sur le développement personnel, la philosophie et la spiritualité.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'IROTORI BAROKA',
    title: 'IROTORI BAROKA — Plateforme de Clarté Mentale',
    description: 'Réflexions, vidéos, e-books et projets sur le développement personnel, la philosophie et la spiritualité.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IROTORI BAROKA — Plateforme de Clarté Mentale',
    description: 'Réflexions, vidéos, e-books et projets sur le développement personnel, la philosophie et la spiritualité.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      {/* P7 FIX: <link> dans <head> plutôt que @import CSS.
          preconnect élimine le DNS/TLS handshake des requêtes font,
          le stylesheet <link> se charge en parallèle sans bloquer le render. */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans selection:bg-[#6B1A2A]/20 selection:text-[#6B1A2A] transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]">
        {children}
      </body>
    </html>
  );
}
