import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/Home';
import { ContentListPage } from './pages/ContentList';
import { PostPage } from './pages/Post';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminEditorPage } from './pages/admin/Editor';
import { LoginPage } from './pages/admin/Login';
import { Post } from './lib/utils';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const fetchPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user));

    fetchPosts();
    setLoading(false);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogin = async () => {
    const data = await fetch('/api/auth/me').then(res => res.json());
    setUser(data.user);
  };

  const renderPage = () => {
    if (currentPage === 'home') return <HomePage onNavigate={setCurrentPage} />;

    // Reflexion pages with subcategories
    if (currentPage === 'reflexion') {
      return <ContentListPage type="model" title="Réflexions" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    }
    if (currentPage.startsWith('reflexion/')) {
      const subcategory = currentPage.split('/')[1];
      const title = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
      return <ContentListPage type="model" title={title} posts={posts.filter(p => p.status === 'published' && p.tags?.includes(subcategory))} onNavigate={setCurrentPage} />;
    }

    // Video page
    if (currentPage === 'video') {
      return <ContentListPage type="video" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    }

    // Notes page
    if (currentPage === 'notes') {
      return <ContentListPage type="note" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    }

    // Library page
    if (currentPage === 'library') {
      return <ContentListPage type="ebook" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    }

    // Single post page
    if (currentPage.startsWith('post/')) {
      const slug = currentPage.split('/')[1];
      return <PostPage slug={slug} />;
    }

    // Admin pages
    if (currentPage === 'admin') {
      if (!user) return <LoginPage onLogin={() => { handleLogin(); setCurrentPage('admin'); }} />;
      return <AdminDashboard onNavigate={setCurrentPage} posts={posts} onRefresh={fetchPosts} />;
    }

    if (currentPage === 'admin/new') {
      if (!user) return <LoginPage onLogin={() => { handleLogin(); setCurrentPage('admin/new'); }} />;
      return <AdminEditorPage onNavigate={setCurrentPage} onRefresh={fetchPosts} />;
    }

    if (currentPage.startsWith('admin/edit/')) {
      if (!user) return <LoginPage onLogin={() => { handleLogin(); setCurrentPage(currentPage); }} />;
      const slug = currentPage.split('/')[2];
      return <AdminEditorPage slug={slug} onNavigate={setCurrentPage} onRefresh={fetchPosts} />;
    }

    return <div className="py-20 text-center">404 - Page not found</div>;
  };

  if (loading) return null;

  return (
    <div className="min-h-screen font-sans selection:bg-[#6B1A2A]/20 selection:text-[#6B1A2A] transition-colors duration-300">
      <Navbar user={user} theme={theme} onToggleTheme={toggleTheme} onNavigate={setCurrentPage} />

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
