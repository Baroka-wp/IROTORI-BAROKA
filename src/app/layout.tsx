import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'IROTORI-BAROKA',
  description: 'Portfolio et blog personnel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="font-sans selection:bg-[#6B1A2A]/20 selection:text-[#6B1A2A] transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]">
        {children}
      </body>
    </html>
  );
}
