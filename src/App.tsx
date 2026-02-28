import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/Home';
import { ContentListPage } from './pages/ContentList';
import { PostPage } from './pages/Post';
import AdminDashboard from './pages/admin/Dashboard';
import { Reflexion, Video, Ebook, Note } from './lib/utils';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Get initial page from URL
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.slice(1); // Remove leading /
      if (path.startsWith('admin')) return 'admin';
      if (path.startsWith('post/')) return path;
      if (path) return path;
    }
    return 'home';
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Contenu pour le site public
  const [reflexions, setReflexions] = useState<Reflexion[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  // Admin mode
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Check if current page is admin
    setIsAdminRoute(currentPage === 'admin' || currentPage.startsWith('admin/'));
  }, [currentPage]);

  // Fetch content for public pages
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [reflexionsRes, videosRes, ebooksRes, notesRes] = await Promise.all([
          fetch('/api/reflexions?status=published').then(r => r.json()),
          fetch('/api/videos?status=published').then(r => r.json()),
          fetch('/api/ebooks?status=published').then(r => r.json()),
          fetch('/api/notes?status=published').then(r => r.json()),
        ]);

        console.log('Fetched reflexions:', reflexionsRes.data);
        console.log('Fetched videos:', videosRes.data);
        console.log('Fetched ebooks:', ebooksRes.data);
        console.log('Fetched notes:', notesRes.data);

        setReflexions(reflexionsRes.data || []);
        setVideos(videosRes.data || []);
        setEbooks(ebooksRes.data || []);
        setNotes(notesRes.data || []);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  // Sync with browser URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      if (path.startsWith('admin')) {
        setCurrentPage('admin');
      } else if (path) {
        setCurrentPage(path);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page}`);
  };

  const renderPage = () => {
    // Admin routes
    if (currentPage === 'admin' || currentPage.startsWith('admin/')) {
      return <AdminDashboard />;
    }

    if (currentPage === 'home') return <HomePage onNavigate={navigate} />;

    // Reflexion page with subcategories
    if (currentPage === 'reflexion') {
      return <ContentListPage type="reflexion" title="Réflexions" items={reflexions} onNavigate={navigate} />;
    }

    // Video page
    if (currentPage === 'video') {
      return <ContentListPage type="video" title="Webinaire" items={videos} onNavigate={navigate} />;
    }

    // Library page (Livres)
    if (currentPage === 'library') {
      return <ContentListPage type="library" title="Livres" items={ebooks} onNavigate={navigate} />;
    }

    // Projets page (placeholder)
    if (currentPage === 'projets') {
      return (
        <div className="space-y-32 pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden"
          >
            <img
              src="https://res.cloudinary.com/baroka/image/upload/v1772310408/dlxmedia-hu-ZrtsGzVW2vk-unsplash_wcmdrv.jpg"
              alt="Projets"
              className="w-full h-full object-cover grayscale brightness-[0.4] contrast-125 scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-color)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-6 max-w-4xl"
              >
                <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white whitespace-nowrap">
                  Projets
                </h1>
                <p className="text-xl md:text-2xl text-white/90 font-light max-w-[600px] mx-auto">
                  Ce sur quoi je travaille actuellement
                </p>
              </motion.div>
            </div>
          </motion.div>
          <div className="max-w-[680px] mx-auto px-4 pb-32">
            <p className="text-center text-[var(--text-color)]/60 text-lg">
              Cette page est en cours de construction.
            </p>
          </div>
        </div>
      );
    }

    // Notes page (kept for backward compatibility)
    if (currentPage === 'notes') {
      return <ContentListPage type="notes" title="Notes de lecture" items={notes} onNavigate={navigate} />;
    }

    // Single post page
    if (currentPage.startsWith('post/')) {
      const slug = currentPage.split('/')[1];
      return <PostPage slug={slug} />;
    }

    return <div className="py-20 text-center">404 - Page not found</div>;
  };

  if (loading) return null;

  // Admin layout (no navbar/footer)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen font-sans selection:bg-[#6B1A2A]/20 selection:text-[#6B1A2A] transition-colors duration-300">
        {renderPage()}
      </div>
    );
  }

  // Public layout
  return (
    <div className="min-h-screen font-sans selection:bg-[#6B1A2A]/20 selection:text-[#6B1A2A] transition-colors duration-300">
      <Navbar user={null} theme={theme} onToggleTheme={toggleTheme} onNavigate={navigate} />

      <main className="min-h-[calc(100vh-200px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
