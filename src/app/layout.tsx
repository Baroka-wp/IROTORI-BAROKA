import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../index.css';

// next/font auto-héberge Inter — élimine la requête bloquante vers fonts.googleapis.com
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const siteUrl = 'https://irotoribaroka.com';
const siteName = 'IROTORI BAROKA';
const defaultTitle = 'IROTORI BAROKA — Plateforme de Clarté Mentale';
const defaultDescription =
  'Réflexions, vidéos, e-books et projets sur le développement personnel, la philosophie et la spiritualité. Par IROTORI BAROKA Emmanuel.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s — ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    'IROTORI BAROKA',
    'IROTORI BAROKA Emmanuel',
    'Baroka Emmanuel',
    'développement personnel',
    'clarté mentale',
    'spiritualité',
    'entrepreneuriat',
    'management',
    'e-book',
    'webinaire',
    'réflexions',
  ],
  authors: [{ name: 'IROTORI BAROKA Emmanuel', url: siteUrl }],
  creator: 'IROTORI BAROKA Emmanuel',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    creator: '@irotoribaroka',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
  },
};

// JSON-LD Person schema for name-based Google search
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'IROTORI BAROKA Emmanuel',
  alternateName: ['IROTORI BAROKA', 'Baroka Emmanuel'],
  url: siteUrl,
  description: defaultDescription,
  knowsAbout: [
    'Développement personnel',
    'Spiritualité',
    'Entrepreneuriat',
    'Management',
    'Philosophie',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data — améliore le référencement par nom */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${inter.className} font-sans selection:bg-[#6B1A2A]/20 selection:text-[#6B1A2A] transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]`}>
        {children}
      </body>
    </html>
  );
}
