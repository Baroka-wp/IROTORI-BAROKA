'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HomePage } from '../components/pages/Home';
import { ContentListPage } from '../components/pages/ContentList';
import { PostPage } from '../components/pages/Post';
import AdminDashboard from '../components/pages/admin/Dashboard';
import { Reflexion, Video, Ebook, Project } from '../lib/utils';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [theme, setTheme] = useState<string>('dark');
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Contenu pour le site public
  const [reflexions, setReflexions] = useState<Reflexion[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Initialisation depuis l'URL
  useEffect(() => {
    const path = window.location.pathname.slice(1);
    if (path.startsWith('admin')) {
      setCurrentPage('admin');
    } else if (path.startsWith('post/')) {
      setCurrentPage(path);
    } else if (path) {
      setCurrentPage(path);
    } else {
      setCurrentPage('home');
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    setIsAdminRoute(currentPage === 'admin' || currentPage.startsWith('admin/'));
  }, [currentPage]);

  // Fetch content for public pages
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [reflexionsRes, videosRes, ebooksRes, projectsRes] = await Promise.all([
          fetch('/api/reflexions?status=published').then(r => r.json()),
          fetch('/api/videos?status=published').then(r => r.json()),
          fetch('/api/ebooks?status=published').then(r => r.json()),
          fetch('/api/projects?status=completed').then(r => r.json()),
        ]);

        setReflexions(reflexionsRes.data || []);
        setVideos(videosRes.data || []);
        setEbooks(ebooksRes.data || []);
        setProjects(projectsRes.data || []);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

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

    // Projets page
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
          <div className="max-w-6xl mx-auto px-4 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <article
                    key={project.id}
                    className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors"
                    onClick={() => navigate(`post/${project.slug}`)}
                  >
                    {project.coverImage ? (
                      <img src={project.coverImage} alt={project.title} className="w-full h-64 object-cover" />
                    ) : (
                      <div className="w-full h-64 bg-[var(--bg-color)] flex items-center justify-center">
                        <div className="text-[var(--text-color)]/20">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-gray-500/10 text-gray-500'
                        }`}>
                          {project.status === 'completed' ? 'Terminé' :
                           project.status === 'in_progress' ? 'En cours' : 'Archivé'}
                        </span>
                        {project.technologies && (
                          <span className="text-xs text-[var(--text-color)]/40">
                            {project.technologies.split(',')[0]}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors mb-2">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-[var(--text-color)]/60 line-clamp-3 mb-4">
                          {project.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {project.websiteUrl && (
                          <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-[#6B1A2A] hover:underline"
                          >
                            Site web
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-[#6B1A2A] hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-[var(--text-color)]/40 font-light italic col-span-full text-center py-20">
                  Aucun projet pour le moment.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Single post page
    if (currentPage.startsWith('post/')) {
      const slug = currentPage.split('/')[1];
      return <PostPage slug={slug} />;
    }

    return <div className="py-20 text-center">404 - Page not found</div>;
  };

  // Admin layout (no navbar/footer)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen">
        {renderPage()}
      </div>
    );
  }

  // Public layout
  return (
    <div className="min-h-screen">
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
