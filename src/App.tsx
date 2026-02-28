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
      return <ContentListPage type="video" title="Vidéos" items={videos} onNavigate={navigate} />;
    }

    // Notes page
    if (currentPage === 'notes') {
      return <ContentListPage type="notes" title="Notes de lecture" items={notes} onNavigate={navigate} />;
    }

    // Library page
    if (currentPage === 'library') {
      return <ContentListPage type="library" title="Library" items={ebooks} onNavigate={navigate} />;
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
