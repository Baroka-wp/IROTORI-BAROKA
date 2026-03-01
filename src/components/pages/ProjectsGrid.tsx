'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../../lib/utils';
import { HeroSection } from '../ui/HeroSection';

interface ProjectsGridProps {
  projects: Project[];
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const router = useRouter();

  return (
    <div className="space-y-32 pb-32">
      <HeroSection
        imageSrc="https://res.cloudinary.com/baroka/image/upload/v1772310408/dlxmedia-hu-ZrtsGzVW2vk-unsplash_wcmdrv.jpg"
        imageAlt="Projets"
      >
        <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
          Projets
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light max-w-[600px] mx-auto">
          Ce sur quoi je travaille actuellement
        </p>
      </HeroSection>

      <div className="max-w-6xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              // A1/A2 FIX : accessibilité clavier
              <article
                key={project.id}
                role="link"
                tabIndex={0}
                className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1A2A] focus-visible:ring-offset-2"
                onClick={() => router.push(`/post/${project.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/post/${project.slug}`); } }}
              >
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-64 object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-64 bg-[var(--bg-color)] flex items-center justify-center">
                    <div className="text-[var(--text-color)]/20">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
};
