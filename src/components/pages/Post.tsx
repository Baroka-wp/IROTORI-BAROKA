'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Clock, Share2, Check } from 'lucide-react';
import { formatDate, Reflexion, Video, Ebook } from '../../lib/utils';
import { PrivateGroupCTA } from '../ui/PrivateGroupCTA';

interface PostDisplayProps {
  content: Reflexion | Video | Ebook;
}

// Calcule le temps de lecture estimé depuis du HTML
function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Bouton de partage (Web Share API + fallback copie)
function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    // Fallback clipboard — fonctionne sans permission "clipboard-write"
    let success = false;
    try {
      await navigator.clipboard.writeText(url);
      success = true;
    } catch {
      // execCommand fallback (browsers sans permission Clipboard API)
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      success = document.execCommand('copy');
      document.body.removeChild(ta);
    }
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Partager cet article"
      className="inline-flex items-center gap-2 text-sm text-[var(--text-color)]/60 hover:text-[var(--brand-text)] transition-colors"
    >
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      {copied ? 'Lien copié !' : 'Partager'}
    </button>
  );
}

// Bouton retour vers la liste
function BackButton({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="inline-flex items-center gap-2 text-sm text-[var(--text-color)]/60 hover:text-[var(--brand-text)] transition-colors mb-12 group"
    >
      <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </button>
  );
}

export const PostDisplay: React.FC<PostDisplayProps> = ({ content }) => {
  const isReflexion = 'content' in content && !('videoUrl' in content) && !('downloadUrl' in content);
  const isVideo = 'videoUrl' in content;
  const isEbook = 'downloadUrl' in content && 'price' in content;

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' as const },
  };

  // ─── Réflexion ──────────────────────────────────────────────────────────────
  if (isReflexion) {
    const reflexion = content as Reflexion;
    const minutes = readingTime(reflexion.content);

    return (
      <motion.article {...fadeUp} className="max-w-[680px] mx-auto px-4 py-16">
        <BackButton href="/reflexion" label="Toutes les réflexions" />

        <header className="mb-16">
          {/* Meta row: date · reading time · share */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-sm text-[var(--text-color)]/60 font-light uppercase tracking-widest">
              {formatDate(reflexion.createdAt)} · Réflexion
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--text-color)]/60">
                <Clock size={14} />
                {minutes} min de lecture
              </span>
              <ShareButton title={reflexion.title} />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-8 text-[var(--brand-text)]">
            {reflexion.title}
          </h1>

          {reflexion.tags && (
            <div className="flex gap-2 flex-wrap">
              {reflexion.tags.split(',').map(tag => (
                <span key={tag} className="text-xs uppercase tracking-wider px-2.5 py-1 bg-[var(--card-bg)] text-[var(--text-color)]/60 rounded-sm border border-[var(--border-color)]">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose max-w-none font-light leading-relaxed text-xl">
          <div dangerouslySetInnerHTML={{ __html: reflexion.content }} />
        </div>

        {/* Separator */}
        <div className="mt-20 mb-2 flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--border-color)]" />
          <span className="text-xs uppercase tracking-widest text-[var(--text-color)]/20">fin</span>
          <div className="flex-1 h-px bg-[var(--border-color)]" />
        </div>

        {/* CTA groupe privé */}
        <PrivateGroupCTA contentType="reflexion" />
      </motion.article>
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
      <motion.article {...fadeUp} className="max-w-[680px] mx-auto px-4 py-16">
        <BackButton href="/video" label="Tous les webinaires" />

        <header className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-sm text-[var(--text-color)]/60 font-light uppercase tracking-widest">
              {formatDate(video.createdAt)} · Vidéo
            </p>
            <ShareButton title={video.title} />
          </div>
          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6 text-[var(--brand-text)]">
            {video.title}
          </h1>
          {video.description && (
            <div className="prose max-w-none font-light leading-relaxed text-xl mb-6">
              <p>{video.description}</p>
            </div>
          )}
          {video.playlist && (
            <p className="text-sm text-[var(--brand-text)] mb-8">
              <span className="uppercase tracking-widest text-xs opacity-80">Playlist</span>
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
            <h3 className="text-xl font-medium text-[var(--brand-text)] mb-4">Résumé</h3>
            <div
              className="font-light leading-relaxed text-lg text-[var(--text-color)]/70"
              dangerouslySetInnerHTML={{ __html: video.resume }}
            />
          </div>
        )}

        <PrivateGroupCTA contentType="video" />
      </motion.article>
    );
  }

  // ─── E-book ─────────────────────────────────────────────────────────────────
  if (isEbook) {
    const ebook = content as Ebook;
    return (
      <motion.article {...fadeUp} className="max-w-[680px] mx-auto px-4 py-16">
        <BackButton href="/library" label="Tous les livres" />

        <header className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-sm text-[var(--text-color)]/60 font-light uppercase tracking-widest">
              {formatDate(ebook.createdAt)} · E-book
            </p>
            <ShareButton title={ebook.title} />
          </div>
          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-4 text-[var(--brand-text)]">
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
          <span className={`text-xl font-medium ${ebook.price === 0 ? 'text-green-500' : 'text-[var(--brand-text)]'}`}>
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
            <h3 className="text-2xl font-medium text-[var(--brand-text)] mb-4">Description</h3>
            <div dangerouslySetInnerHTML={{ __html: ebook.description }} />
          </div>
        )}

        <PrivateGroupCTA contentType="ebook" />
      </motion.article>
    );
  }

  return <div className="py-20 text-center">Type de contenu non supporté</div>;
};

// Rétro-compatibilité — alias vers PostDisplay
export const PostPage = PostDisplay;
