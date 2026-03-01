'use client';

import React from 'react';
import { formatDate, Reflexion, Video, Ebook } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';

interface PostDisplayProps {
  content: Reflexion | Video | Ebook;
}

export const PostDisplay: React.FC<PostDisplayProps> = ({ content }) => {
  // Détermine le type de contenu par duck-typing sur les champs
  const isReflexion = 'content' in content && !('videoUrl' in content) && !('downloadUrl' in content);
  const isVideo = 'videoUrl' in content;
  const isEbook = 'downloadUrl' in content && 'price' in content;

  // ─── Réflexion ──────────────────────────────────────────────────────────────
  if (isReflexion) {
    const reflexion = content as Reflexion;
    return (
      <article className="max-w-[680px] mx-auto px-4 py-20">
        <header className="mb-16">
          <p className="text-sm text-[var(--text-color)]/40 font-light mb-4 uppercase tracking-widest">
            {formatDate(reflexion.createdAt)} • Réflexion
          </p>
          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-8 text-[#6B1A2A]">
            {reflexion.title}
          </h1>
          {reflexion.tags && (
            <div className="flex gap-2 flex-wrap">
              {reflexion.tags.split(',').map(tag => (
                <span key={tag} className="text-xs uppercase tracking-wider px-2 py-1 bg-[var(--card-bg)] text-[var(--text-color)]/60 rounded-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="prose max-w-none font-light leading-relaxed text-xl">
          {/* Le contenu HTML est sanitisé à l'écriture dans les API routes (lib/sanitize.ts) */}
          <div dangerouslySetInnerHTML={{ __html: reflexion.content }} />
        </div>
      </article>
    );
  }

  // ─── Vidéo ──────────────────────────────────────────────────────────────────
  if (isVideo) {
    const video = content as Video;

    const getVideoEmbed = (url?: string): string | null => {
      if (!url) return null;
      const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
      if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`;
      const watchMatch = url.match(/[?&]v=([^?&]+)/);
      if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`;
      const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/);
      if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}?rel=0`;
      const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
      if (embedMatch) return url.includes('?') ? `${url}&rel=0` : `${url}?rel=0`;
      const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&]+)/);
      if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?rel=0`;
      const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
      if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      if (url.includes('drive.google.com') && url.includes('/preview')) return url;
      return null;
    };

    const embedUrl = getVideoEmbed(video.videoUrl);

    return (
      <article className="max-w-[680px] mx-auto px-4 py-20">
        <header className="mb-12">
          <p className="text-sm text-[var(--text-color)]/40 font-light mb-4 uppercase tracking-widest">
            {formatDate(video.createdAt)} • Vidéo
          </p>
          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6 text-[#6B1A2A]">
            {video.title}
          </h1>
          {video.description && (
            <div className="prose max-w-none font-light leading-relaxed text-xl mb-6">
              <p>{video.description}</p>
            </div>
          )}
          {video.playlist && (
            <p className="text-sm text-[#6B1A2A] mb-8">
              <span className="uppercase tracking-widest text-xs opacity-60">Playlist</span>
              <br />
              {video.playlist}
            </p>
          )}
        </header>

        {embedUrl ? (
          <div className="aspect-video mb-12 bg-[var(--bg-color)] rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            />
          </div>
        ) : video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-auto mb-12 rounded-lg" loading="lazy" />
        ) : null}

        {video.resume && (
          <div className="pt-8 border-t border-[var(--border-color)]">
            <h3 className="text-xl font-medium text-[#6B1A2A] mb-4">Résumé</h3>
            <div
              className="font-light leading-relaxed text-lg text-[var(--text-color)]/70"
              dangerouslySetInnerHTML={{ __html: video.resume }}
            />
          </div>
        )}
      </article>
    );
  }

  // ─── E-book ─────────────────────────────────────────────────────────────────
  if (isEbook) {
    const ebook = content as Ebook;
    return (
      <article className="max-w-[680px] mx-auto px-4 py-20">
        <header className="mb-12">
          <p className="text-sm text-[var(--text-color)]/40 font-light mb-4 uppercase tracking-widest">
            {formatDate(ebook.createdAt)} • E-book
          </p>
          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-4 text-[#6B1A2A]">
            {ebook.title}
          </h1>
          {ebook.subtitle && (
            <p className="text-2xl text-[var(--text-color)]/70 font-light mb-6">{ebook.subtitle}</p>
          )}
        </header>

        {ebook.coverImage && (
          <div className="mb-8">
            <img src={ebook.coverImage} alt={ebook.title} className="w-full h-auto rounded-lg" loading="lazy" />
          </div>
        )}

        <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--border-color)]">
          <span className={`text-xl font-medium ${ebook.price === 0 ? 'text-green-500' : 'text-[#6B1A2A]'}`}>
            {ebook.price === 0 ? 'Gratuit' : `${ebook.price} FCFA`}
          </span>
          {ebook.downloadUrl && (
            <a
              href={ebook.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#6B1A2A] text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity rounded-lg"
            >
              <ArrowRight size={18} />
              Télécharger
            </a>
          )}
        </div>

        {ebook.description && (
          <div className="prose max-w-none font-light leading-relaxed text-xl">
            <h3 className="text-2xl font-medium text-[#6B1A2A] mb-4">Description</h3>
            <div dangerouslySetInnerHTML={{ __html: ebook.description }} />
          </div>
        )}
      </article>
    );
  }

  return <div className="py-20 text-center">Type de contenu non supporté</div>;
};

// Rétro-compatibilité — alias vers PostDisplay
export const PostPage = PostDisplay;
