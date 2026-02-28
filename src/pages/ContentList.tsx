import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Book, FileText, PlayCircle } from 'lucide-react';
import { formatDate, Reflexion, Video, Ebook, Note } from '../lib/utils';

interface ContentListPageProps {
  type: 'reflexion' | 'video' | 'notes' | 'library';
  title?: string;
  items: (Reflexion | Video | Ebook | Note)[];
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

  const displayTitle = title || type.charAt(0).toUpperCase() + type.slice(1);

  // Filter by subcategory for reflexion page
  const reflexionItems = type === 'reflexion' ? items as Reflexion[] : [];
  const postsBySubcategory = selectedSubcategory !== 'all'
    ? reflexionItems.filter(p => p.tags?.includes(selectedSubcategory))
    : reflexionItems;

  // Library Page (Ebooks)
  if (type === 'library') {
    const ebookItems = items as Ebook[];
    console.log('Library ebooks:', ebookItems);
    return (
      <div>
        <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
          <div className="max-w-[680px] mx-auto px-4">
            <h1 className="text-base md:text-lg font-normal text-[#6B1A2A]">{displayTitle}</h1>
          </div>
        </div>
        <div className="max-w-[680px] mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ebookItems.length > 0 ? (
              ebookItems.map((ebook) => (
                <article
                  key={ebook.id}
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors"
                  onClick={() => onNavigate(`post/${ebook.slug}`)}
                >
                  {ebook.coverImage ? (
                    <img src={ebook.coverImage} alt={ebook.title} className="w-full h-64 object-cover" />
                  ) : (
                    <div className="w-full h-64 bg-[var(--bg-color)] flex items-center justify-center">
                      <Book size={48} className="text-[var(--text-color)]/20" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors mb-2">
                      {ebook.title}
                    </h3>
                    {ebook.subtitle && (
                      <p className="text-sm text-[var(--text-color)]/60 mb-2">{ebook.subtitle}</p>
                    )}
                    {ebook.shortDescription && (
                      <p className="text-sm text-[var(--text-color)]/60 line-clamp-3 mb-4">
                        {ebook.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${ebook.price === 0 ? 'text-green-500' : 'text-[#6B1A2A]'}`}>
                        {ebook.price === 0 ? 'Gratuit' : `${ebook.price} FCFA`}
                      </span>
                      {ebook.downloadUrl && (
                        <a
                          href={ebook.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 text-sm text-[#6B1A2A] hover:underline"
                        >
                          <ArrowRight size={14} />
                          Télécharger
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-[var(--text-color)]/40 font-light italic col-span-full">Nothing here yet.</p>
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
        <div>
          <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
            <div className="max-w-[680px] mx-auto px-4">
              <h1 className="text-base md:text-lg font-normal text-[#6B1A2A] mb-2">{displayTitle}</h1>
              <p className="text-sm text-[var(--text-color)]/60">Quelle catégorie vous intéresse ?</p>
            </div>
          </div>
          <div className="max-w-[680px] mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoPlaylists.length > 0 ? (
                videoPlaylists.map((playlistName) => (
                  <motion.button
                    key={playlistName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handlePlaylistSelect(playlistName)}
                    className="group p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg hover:border-[#6B1A2A] hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors">
                        {playlistName}
                      </h3>
                      <ArrowRight size={20} className="text-[var(--text-color)]/40 group-hover:text-[#6B1A2A] transition-colors" />
                    </div>
                    <p className="text-sm text-[var(--text-color)]/40 mt-2">
                      {items.length} vidéo(s)
                    </p>
                  </motion.button>
                ))
              ) : (
                <p className="text-[var(--text-color)]/40 font-light italic col-span-full text-center py-8">
                  Aucune playlist disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
          <div className="max-w-[680px] mx-auto px-4">
            <button
              onClick={() => { setVideoPlaylist(''); setVideoItems([]); }}
              className="inline-flex items-center gap-2 text-sm text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Choisir une autre catégorie
            </button>
            <h2 className="text-xl font-light text-[#6B1A2A]">{videoPlaylist}</h2>
          </div>
        </div>
        <div className="max-w-[680px] mx-auto px-4 pb-20">
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
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors flex flex-col"
                  onClick={() => onNavigate(`post/${video.slug}`)}
                >
                  {video.thumbnail ? (
                    <div className="relative w-full">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-auto object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <PlayCircle size={48} className="text-[#6B1A2A]" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-[var(--bg-color)] flex items-center justify-center py-20">
                      <PlayCircle size={64} className="text-[var(--text-color)]/20" />
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

  // Notes Page
  if (type === 'notes') {
    const noteItems = items as Note[];
    return (
      <div>
        <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
          <div className="max-w-[680px] mx-auto px-4">
            <h1 className="text-base md:text-lg font-normal text-[#6B1A2A]">{displayTitle}</h1>
          </div>
        </div>
        <div className="max-w-[680px] mx-auto px-4 pb-20">
          <div className="space-y-16">
            {noteItems.length > 0 ? (
              noteItems.map((note) => (
                <article key={note.id} className="group cursor-pointer" onClick={() => onNavigate(`post/${note.slug}`)}>
                  <p className="text-sm text-[var(--text-color)]/40 font-light mb-2">{formatDate(note.createdAt)}</p>
                  <h3 className="text-3xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors leading-snug">
                    {note.title}
                  </h3>
                  {note.bookTitle && (
                    <p className="text-sm text-[var(--text-color)]/60 mt-1">
                      À propos de : {note.bookTitle}{note.author ? ` par ${note.author}` : ''}
                    </p>
                  )}
                </article>
              ))
            ) : (
              <p className="text-[var(--text-color)]/40 font-light italic">Nothing here yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Reflexion Page with subcategories
  return (
    <div>
      <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
        <div className="max-w-[680px] mx-auto px-4">
          <h1 className="text-base md:text-lg font-normal text-[#6B1A2A] mb-4">{displayTitle}</h1>
          <div className="flex flex-wrap gap-2">
            {reflexionSubcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                  selectedSubcategory === sub.id
                    ? 'bg-[#6B1A2A] text-white'
                    : 'bg-[var(--card-bg)] text-[var(--text-color)]/60 hover:text-[#6B1A2A] border border-[var(--border-color)]'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[680px] mx-auto px-4 pb-20">
        <div className="space-y-16">
          {postsBySubcategory.length > 0 ? (
            postsBySubcategory.map((reflexion) => (
              <article key={reflexion.id} className="group cursor-pointer" onClick={() => onNavigate(`post/${reflexion.slug}`)}>
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
