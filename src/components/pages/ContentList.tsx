'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Book, Clock, FileText, PlayCircle } from 'lucide-react';
import { formatDate, Reflexion, Video, Ebook } from '../../lib/utils';
import { HeroSection } from '../ui/HeroSection';

interface ContentListPageProps {
  type: 'reflexion' | 'video' | 'notes' | 'library';
  title?: string;
  items: (Reflexion | Video | Ebook)[];
}

const reflexionSubcategories = [
  { id: 'all', name: 'Toutes' },
  { id: 'spiritualite', name: 'Spiritualité' },
  { id: 'entrepreneurial', name: 'Entrepreneurial/MindSet' },
  { id: 'management', name: 'Management' },
  { id: 'education', name: 'Éducation' },
];

export const ContentListPage: React.FC<ContentListPageProps> = ({ type, title, items }) => {
  const router = useRouter();
  const [videoPlaylist, setVideoPlaylist] = useState<string>('');
  const [videoItems, setVideoItems] = useState<Video[]>([]);
  const [videoPlaylists, setVideoPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Load video playlists on mount
  useEffect(() => {
    if (type === 'video') {
      const playlists = Array.from(
        new Set((items as Video[]).map(p => p.playlist).filter(Boolean))
      ) as string[];
      setVideoPlaylists(playlists);
      setVideoItems(items as Video[]);
    }
  }, [type, items]);

  // Get video count for a specific playlist
  const getVideoCountForPlaylist = (playlistName: string) => {
    const videoItems = items as Video[];
    return videoItems.filter(v => v.playlist === playlistName).length;
  };

  const handlePlaylistSelect = (playlistName: string) => {
    setLoading(true);
    setVideoPlaylist(playlistName);
    if (playlistName === 'all') {
      setVideoItems(items as Video[]);
      setLoading(false);
    } else {
      fetch(`/api/videos?status=published&playlist=${encodeURIComponent(playlistName)}`)
        .then(res => res.json())
        .then(data => {
          setVideoItems(data.data || []);
          setLoading(false);
        });
    }
  };

  const displayTitle = title || (type === 'video' ? 'Webinaire' : type.charAt(0).toUpperCase() + type.slice(1));

  // Filter by subcategory for reflexion page
  const reflexionItems = type === 'reflexion' ? items as Reflexion[] : [];
  const postsBySubcategory = selectedSubcategory !== 'all'
    ? reflexionItems.filter(p => p.tags?.includes(selectedSubcategory))
    : reflexionItems;

  // Library Page (Ebooks)
  if (type === 'library') {
    const ebookItems = items as Ebook[];
    
    return (
      <div className="space-y-32 pb-32">
        <HeroSection
          imageSrc="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1920&h=1080"
          imageAlt="Library"
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
            {displayTitle}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-[600px] mx-auto">
            Des ressources pour transformer votre vie
          </p>
        </HeroSection>

        <div className="max-w-6xl mx-auto px-4 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ebookItems.length > 0 ? (
              ebookItems.map((ebook) => (
                <article
                  key={ebook.id}
                  role="link"
                  tabIndex={0}
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1A2A] focus-visible:ring-offset-2"
                  onClick={() => router.push(`/post/${ebook.slug}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/post/${ebook.slug}`); } }}
                >
                  {ebook.coverImage ? (
                    <img src={ebook.coverImage} alt={ebook.title} className="w-full h-80 object-cover" />
                  ) : (
                    <div className="w-full h-80 bg-[var(--bg-color)] flex items-center justify-center">
                      <Book size={64} className="text-[var(--text-color)]/20" />
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-light text-[var(--text-color)] group-hover:text-[var(--brand-text)] transition-colors mb-3">
                      {ebook.title}
                    </h3>
                    {ebook.subtitle && (
                      <p className="text-base text-[var(--text-color)]/60 mb-4">{ebook.subtitle}</p>
                    )}
                    {ebook.shortDescription && (
                      <p className="text-sm text-[var(--text-color)]/60 line-clamp-3 mb-6 leading-relaxed">
                        {ebook.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
                      <span className={`text-lg font-medium ${ebook.price === 0 ? 'text-green-500' : 'text-[var(--brand-text)]'}`}>
                        {ebook.price === 0 ? 'Gratuit' : `${ebook.price} FCFA`}
                      </span>
                      {ebook.downloadUrl && (
                        <a
                          href={ebook.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 bg-[#6B1A2A] text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity rounded-lg"
                        >
                          <ArrowRight size={18} />
                          Télécharger
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-[var(--text-color)]/60 font-light italic col-span-full text-center py-20">Aucun livre disponible pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Video Page
  if (type === 'video') {
    if (!videoPlaylist) {
      return (
        <div className="space-y-32 pb-32">
          <HeroSection
            imageSrc="https://res.cloudinary.com/baroka/image/upload/v1772315789/austin-distel-VCFxt2yT1eQ-unsplash_jkhvxq.jpg"
            imageAlt="Vidéos"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
              {displayTitle}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-[600px] mx-auto">
              Des webinaires sur des sujets divers <br /> (Ingenierie web | IA | Technologie | spirituels )
            </p>
          </HeroSection>

          <div className="max-w-6xl mx-auto px-4 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoPlaylists.length > 0 ? (
                videoPlaylists.map((playlistName) => (
                  <motion.button
                    key={playlistName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handlePlaylistSelect(playlistName)}
                    className="group p-10 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg hover:border-[#6B1A2A] hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-light text-[var(--text-color)] group-hover:text-[var(--brand-text)] transition-colors">
                        {playlistName}
                      </h3>
                      <ArrowRight size={24} className="text-[var(--text-color)]/60 group-hover:text-[var(--brand-text)] transition-colors" />
                    </div>
                    <p className="text-sm text-[var(--text-color)]/60 mt-4">
                      {getVideoCountForPlaylist(playlistName)} vidéo(s)
                    </p>
                  </motion.button>
                ))
              ) : (
                <p className="text-[var(--text-color)]/60 font-light italic col-span-full text-center py-20">
                  Aucune playlist disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-32 pb-32">
        <HeroSection
          imageSrc="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1920&h=1080"
          imageAlt={videoPlaylist}
        >
          <button
            onClick={() => { setVideoPlaylist(''); setVideoItems([]); }}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Choisir une autre catégorie
          </button>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
            {videoPlaylist}
          </h1>
        </HeroSection>

        <div className="max-w-6xl mx-auto px-4 pb-32">
          {loading ? (
            <p className="text-center py-8 text-[var(--text-color)]/60">Chargement...</p>
          ) : videoItems.length === 0 ? (
            <p className="text-[var(--text-color)]/60 font-light italic text-center py-8">
              Aucune vidéo dans cette playlist.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videoItems.map((video) => (
                <article
                  key={video.id}
                  role="link"
                  tabIndex={0}
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1A2A] focus-visible:ring-offset-2"
                  onClick={() => router.push(`/post/${video.slug}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/post/${video.slug}`); } }}
                >
                  {video.thumbnail ? (
                    <div className="relative w-full">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-auto object-contain bg-black" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                          <PlayCircle size={64} className="text-[#6B1A2A]" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-[var(--bg-color)] flex items-center justify-center py-32">
                      <PlayCircle size={96} className="text-[var(--text-color)]/20" />
                    </div>
                  )}
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-light text-[var(--text-color)] group-hover:text-[var(--brand-text)] transition-colors mb-2 line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-[var(--text-color)]/60 line-clamp-3 leading-relaxed mb-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Reflexion Page with subcategories
  return (
    <div className="space-y-24 pb-32">
      <HeroSection
        imageSrc="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1920&h=1080"
        imageAlt="Réflexions"
      >
        <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
          {displayTitle}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light max-w-[600px] mx-auto">
          Principes et structures pour clarifier votre pensée
        </p>
      </HeroSection>

      <div className="max-w-[680px] mx-auto px-4 pb-32">
        {/* Subcategory filters */}
        <div className="flex flex-wrap gap-2 mb-14">
          {reflexionSubcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all duration-200 ${selectedSubcategory === sub.id
                ? 'bg-[#6B1A2A] text-white'
                : 'bg-[var(--card-bg)] text-[var(--text-color)]/70 hover:text-[var(--brand-text)] border border-[var(--border-color)]'
                }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Count */}
        {postsBySubcategory.length > 0 && (
          <p className="text-xs uppercase tracking-widest text-[var(--text-color)]/60 mb-10">
            {postsBySubcategory.length} réflexion{postsBySubcategory.length > 1 ? 's' : ''}
          </p>
        )}

        <div className="divide-y divide-[var(--border-color)]">
          {postsBySubcategory.length > 0 ? (
            postsBySubcategory.map((item, index) => {
              const reflexion = item as Reflexion;
              // Excerpt: strip HTML, take first 120 chars
              const rawText = reflexion.content
                ?.replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim() ?? '';
              const excerpt = rawText.length > 120 ? rawText.slice(0, 120).trimEnd() + '…' : rawText;
              // Reading time
              const words = rawText.split(' ').filter(Boolean).length;
              const minutes = Math.max(1, Math.ceil(words / 200));

              return (
                <motion.article
                  key={reflexion.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
                  role="link"
                  tabIndex={0}
                  className="group cursor-pointer py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1A2A] focus-visible:ring-offset-2 rounded-sm"
                  onClick={() => router.push(`/post/${reflexion.slug}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/post/${reflexion.slug}`); } }}
                >
                  {/* Top meta */}
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <span className="text-xs text-[var(--text-color)]/60 font-light uppercase tracking-wider">
                      {formatDate(reflexion.createdAt)}
                    </span>
                    <span className="text-[var(--text-color)]/20 text-xs">·</span>
                    <span className="flex items-center gap-1 text-xs text-[var(--text-color)]/60">
                      <Clock size={11} />
                      {minutes} min
                    </span>
                    {reflexion.tags && (
                      <>
                        <span className="text-[var(--text-color)]/20 text-xs">·</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {reflexion.tags.split(',').slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[var(--card-bg)] text-[var(--text-color)]/60 rounded-sm border border-[var(--border-color)]">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-light text-[var(--text-color)] group-hover:text-[var(--brand-text)] transition-colors duration-200 leading-snug mb-3">
                    {reflexion.title}
                  </h3>

                  {/* Excerpt */}
                  {excerpt && (
                    <p className="text-base text-[var(--text-color)]/70 font-light leading-relaxed mb-4 max-w-[560px]">
                      {excerpt}
                    </p>
                  )}

                  {/* Read more */}
                  <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--brand-text)]/0 group-hover:text-[var(--brand-text)]/80 transition-all duration-200">
                    Lire <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </motion.article>
              );
            })
          ) : (
            <p className="text-[var(--text-color)]/60 font-light italic py-12">Aucune réflexion dans cette catégorie.</p>
          )}
        </div>
      </div>
    </div>
  );
};
