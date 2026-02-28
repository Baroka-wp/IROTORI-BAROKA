'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Project } from '@/lib/utils';

export default function ProjetsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('/api/projects?status=completed');
      const data = await res.json();
      setProjects(data.data || []);
    };
    fetchProjects();

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else if (page.startsWith('post/')) {
      router.push(`/${page}`);
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar user={null} theme={theme} onToggleTheme={toggleTheme} onNavigate={navigate} />

      <main className="min-h-[calc(100vh-200px)]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
