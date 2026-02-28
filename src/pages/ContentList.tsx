import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Book, FileText } from 'lucide-react';
import { formatDate, Post } from '../lib/utils';

interface ContentListPageProps {
  type: string;
  title?: string;
  posts: Post[];
  onNavigate: (page: string) => void;
}

const subcategories = [
  { id: 'all', name: 'Toutes' },
  { id: 'spiritualite', name: 'Spiritualité' },
  { id: 'entrepreneurial', name: 'Entrepreneurial/MindSet' },
  { id: 'management', name: 'Management' },
  { id: 'education', name: 'Éducation' },
];

export const ContentListPage: React.FC<ContentListPageProps> = ({ type, title, posts, onNavigate }) => {
  const [videoPlaylist, setVideoPlaylist] = useState<string>('');
  const [videoPosts, setVideoPosts] = useState<Post[]>([]);
  const [videoPlaylists, setVideoPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  useEffect(() => {
    if (type === 'video') {
      const playlists = Array.from(
        new Set(posts.filter(p => p.type === 'video').map(p => p.playlist).filter(Boolean))
      ) as string[];
      setVideoPlaylists(playlists);
    }
  }, [type, posts]);

  const handlePlaylistSelect = (playlistName: string) => {
    setLoading(true);
    setVideoPlaylist(playlistName);
    if (playlistName === 'all') {
      setVideoPosts(posts.filter(p => p.type === 'video'));
      setLoading(false);
    } else {
      fetch(`/api/posts?type=video&playlist=${encodeURIComponent(playlistName)}`)
        .then(res => res.json())
        .then(data => {
          setVideoPosts(data);
          setLoading(false);
        });
    }
  };

  const displayTitle = title || type.charAt(0).toUpperCase() + type.slice(1);

  // Filter posts by type
  const filteredPosts = posts.filter(p => {
    if (type === 'reflexion') return p.type === 'model';
    if (type === 'library') return p.type === 'ebook';
    return p.type === type;
  });

  // Filter by subcategory for reflexion page
  const postsBySubcategory = type === 'reflexion' && selectedSubcategory !== 'all'
    ? filteredPosts.filter(p => p.tags?.includes(selectedSubcategory))
    : filteredPosts;

  // Library Page
  if (type === 'library') {
    return (
      <div>
        <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
          <div className="max-w-[680px] mx-auto px-4">
            <h1 className="text-base md:text-lg font-normal text-[#6B1A2A]">{displayTitle}</h1>
          </div>
        </div>
        <div className="max-w-[680px] mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors"
                  onClick={() => onNavigate(`post/${post.slug}`)}
                >
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover" />
                  ) : (
                    <div className="w-full h-64 bg-[var(--bg-color)] flex items-center justify-center">
                      <Book size={48} className="text-[var(--text-color)]/20" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors mb-2">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-sm text-[var(--text-color)]/60 line-clamp-3 mb-4">
                        {post.description}
                      </p>
                    )}
                    {post.downloadUrl && (
                      <a
                        href={post.downloadUrl}
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
                      {posts.filter(p => p.type === 'video' && p.playlist === playlistName).length} vidéo(s)
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
              onClick={() => { setVideoPlaylist(''); setVideoPosts([]); }}
              className="inline-flex items-center gap-2 text-sm text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Choisir une autre catégorie
            </button>
            <h2 className="text-xl font-light text-[#6B1A2A]">{videoPlaylist}</h2>
          </div>
        </div>
        <div className="max-w-[680px] mx-auto px-4 pb-20">
          {videoPosts.length === 0 ? (
            <p className="text-[var(--text-color)]/40 font-light italic text-center py-8">
              Aucune vidéo dans cette playlist.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videoPosts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors flex flex-col"
                  onClick={() => onNavigate(`post/${post.slug}`)}
                >
                  {post.coverImage ? (
                    <div className="relative">
                      <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <ArrowRight size={28} className="text-[#6B1A2A] ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-[var(--bg-color)] flex items-center justify-center">
                      <FileText size={48} className="text-[var(--text-color)]/20" />
                    </div>
                  )}
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors mb-3 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-sm text-[var(--text-color)]/60 line-clamp-3 leading-relaxed">
                        {post.description}
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
    return (
      <div>
        <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
          <div className="max-w-[680px] mx-auto px-4">
            <h1 className="text-base md:text-lg font-normal text-[#6B1A2A]">{displayTitle}</h1>
          </div>
        </div>
        <div className="max-w-[680px] mx-auto px-4 pb-20">
          <div className="space-y-16">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article key={post.id} className="group cursor-pointer" onClick={() => onNavigate(`post/${post.slug}`)}>
                  <p className="text-sm text-[var(--text-color)]/40 font-light mb-2">{formatDate(post.createdAt)}</p>
                  <h3 className="text-3xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors leading-snug">
                    {post.title}
                  </h3>
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
            {subcategories.map((sub) => (
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
            postsBySubcategory.map((post) => (
              <article key={post.id} className="group cursor-pointer" onClick={() => onNavigate(`post/${post.slug}`)}>
                <p className="text-sm text-[var(--text-color)]/40 font-light mb-2">{formatDate(post.createdAt)}</p>
                <h3 className="text-3xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors leading-snug">
                  {post.title}
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
