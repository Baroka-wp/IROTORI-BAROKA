import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Book, FileText, PlayCircle } from 'lucide-react';
import { formatDate, Reflexion, Video, Ebook } from '../../lib/utils';

interface ContentListPageProps {
  type: 'reflexion' | 'video' | 'notes' | 'library';
  title?: string;
  items: (Reflexion | Video | Ebook)[];
  onNavigate: (page: string) => void;
}

const reflexionSubcategories = [
  { id: 'all', name: 'Toutes' },
  { id: 'spiritualite', name: 'Spiritualité' },
  { id: 'entrepreneurial', name: 'Entrepreneurial/MindSet' },
  { id: 'management', name: 'Management' },
  { id: 'education', name: 'Éducation' },
];

export const ContentListPage: React.FC<ContentListPageProps> = ({ type, title, items, onNavigate }) => {
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1920&h=1080"
            alt="Library"
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
              <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
                {displayTitle}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light max-w-[600px] mx-auto">
                Des ressources pour transformer votre vie
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ebookItems.length > 0 ? (
              ebookItems.map((ebook) => (
                <article
                  key={ebook.id}
                  role="link"
                  tabIndex={0}
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1A2A] focus-visible:ring-offset-2"
                  onClick={() => onNavigate(`post/${ebook.slug}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(`post/${ebook.slug}`); } }}
                >
                  {ebook.coverImage ? (
                    <img src={ebook.coverImage} alt={ebook.title} className="w-full h-80 object-cover" />
                  ) : (
                    <div className="w-full h-80 bg-[var(--bg-color)] flex items-center justify-center">
                      <Book size={64} className="text-[var(--text-color)]/20" />
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors mb-3">
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
                      <span className={`text-lg font-medium ${ebook.price === 0 ? 'text-green-500' : 'text-[#6B1A2A]'}`}>
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
              <p className="text-[var(--text-color)]/40 font-light italic col-span-full text-center py-20">Aucun livre disponible pour le moment.</p>
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
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden"
          >
            <img
              src="https://res.cloudinary.com/baroka/image/upload/v1772315789/austin-distel-VCFxt2yT1eQ-unsplash_jkhvxq.jpg"
              alt="Vidéos"
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
                <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
                  {displayTitle}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 font-light max-w-[600px] mx-auto">
                  Des webinaires sur des sujets divers <br /> (Ingenierie web | IA | Technologie | spirituels )
                </p>
              </motion.div>
            </div>
          </motion.div>

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
                      <h3 className="text-2xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors">
                        {playlistName}
                      </h3>
                      <ArrowRight size={24} className="text-[var(--text-color)]/40 group-hover:text-[#6B1A2A] transition-colors" />
                    </div>
                    <p className="text-sm text-[var(--text-color)]/40 mt-4">
                      {getVideoCountForPlaylist(playlistName)} vidéo(s)
                    </p>
                  </motion.button>
                ))
              ) : (
                <p className="text-[var(--text-color)]/40 font-light italic col-span-full text-center py-20">
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1920&h=1080"
            alt={videoPlaylist}
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
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 pb-32">
          {loading ? (
            <p className="text-center py-8 text-[var(--text-color)]/40">Chargement...</p>
          ) : videoItems.length === 0 ? (
            <p className="text-[var(--text-color)]/40 font-light italic text-center py-8">
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
                  onClick={() => onNavigate(`post/${video.slug}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(`post/${video.slug}`); } }}
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
                    <h3 className="text-xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors mb-2 line-clamp-2 leading-snug">
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
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1920&h=1080"
          alt="Réflexions"
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
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
              {displayTitle}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-[600px] mx-auto">
              Principes et structures pour clarifier votre pensée
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-[680px] mx-auto px-4 pb-32">
        {/* Subcategory filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {reflexionSubcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className={`px-6 py-3 text-sm rounded-full transition-colors ${selectedSubcategory === sub.id
                ? 'bg-[#6B1A2A] text-white'
                : 'bg-[var(--card-bg)] text-[var(--text-color)]/60 hover:text-[#6B1A2A] border border-[var(--border-color)]'
                }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {postsBySubcategory.length > 0 ? (
            postsBySubcategory.map((reflexion) => (
              <article key={reflexion.id} role="link" tabIndex={0} className="group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1A2A] focus-visible:ring-offset-2 rounded-sm" onClick={() => onNavigate(`post/${reflexion.slug}`)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(`post/${reflexion.slug}`); } }}>
                <p className="text-sm text-[var(--text-color)]/40 font-light mb-2">{formatDate(reflexion.createdAt)}</p>
                <h3 className="text-3xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors leading-snug">
                  {reflexion.title}
                </h3>
              </article>
            ))
          ) : (
            <p className="text-[var(--text-color)]/40 font-light italic">Aucune réflexion dans cette catégorie.</p>
          )}
        </div>
      </div>
    </div>
  );
};
