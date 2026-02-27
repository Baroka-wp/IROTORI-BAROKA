import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Book,
  Brain,
  FileText,
  Library,
  Quote,
  Plus,
  Settings,
  LogOut,
  ChevronDown,
  ArrowLeft,
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  Eye,
  LayoutList,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  Video,
  AlignLeft
} from 'lucide-react';
import { cn, formatDate, Post } from './lib/utils';
import Editor from './components/Editor';

// --- Components ---

const Navbar = ({ user, theme, onToggleTheme, onNavigate }: { user: any, theme: string, onToggleTheme: () => void, onNavigate: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reflexionOpen, setReflexionOpen] = useState(false);

  const navItems = [
    { name: 'Réflexions', path: 'reflexion', icon: Brain, hasSubmenu: true },
    { name: 'Vidéos', path: 'video', icon: FileText },
    { name: 'Notes de lecture', path: 'notes', icon: Book },
    { name: 'Library', path: 'library', icon: Library },
  ];

  const reflexionSubItems = [
    { name: 'Spiritualité', path: 'reflexion/spiritualite' },
    { name: 'Entrepreneurial/MindSet', path: 'reflexion/entrepreneurial' },
    { name: 'Management', path: 'reflexion/management' },
    { name: 'Éducation', path: 'reflexion/education' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-[680px] mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="text-[#6B1A2A] font-medium text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          IROTORI BAROKA
        </button>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            item.hasSubmenu ? (
              <div key={item.path} className="relative">
                <button
                  onClick={() => setReflexionOpen(!reflexionOpen)}
                  className="text-sm font-light text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors flex items-center gap-1"
                >
                  {item.name}
                  <ChevronDown size={14} className={`transition-transform ${reflexionOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {reflexionOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 bg-[var(--bg-color)] border border-[var(--border-color)] py-2 min-w-[180px] shadow-lg"
                    >
                      {reflexionSubItems.map((sub) => (
                        <button
                          key={sub.path}
                          onClick={() => { onNavigate(sub.path); setReflexionOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm font-light text-[var(--text-color)]/60 hover:text-[#6B1A2A] hover:bg-[var(--card-bg)] transition-colors"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className="text-sm font-light text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors"
              >
                {item.name}
              </button>
            )
          ))}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-[var(--text-color)]/40 hover:text-[#6B1A2A] transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user && (
            <button
              onClick={() => onNavigate('admin')}
              className="p-1.5 text-[var(--text-color)]/40 hover:text-[#6B1A2A] transition-colors"
            >
              <Settings size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-[var(--text-color)]/40"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="text-[var(--text-color)]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[var(--bg-color)] border-b border-[var(--border-color)] px-4 py-6 space-y-4"
          >
            {navItems.map((item) => (
              item.hasSubmenu ? (
                <div key={item.path} className="space-y-2">
                  <button
                    onClick={() => setReflexionOpen(!reflexionOpen)}
                    className="block w-full text-left text-lg font-light text-[var(--text-color)] flex items-center justify-between"
                  >
                    {item.name}
                    <ChevronDown size={16} className={`transition-transform ${reflexionOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {reflexionOpen && (
                    <div className="pl-4 space-y-2 border-l border-[var(--border-color)]">
                      {reflexionSubItems.map((sub) => (
                        <button
                          key={sub.path}
                          onClick={() => { onNavigate(sub.path); setIsOpen(false); }}
                          className="block w-full text-left text-base font-light text-[var(--text-color)]/80 hover:text-[#6B1A2A]"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.path}
                  onClick={() => { onNavigate(item.path); setIsOpen(false); }}
                  className="block w-full text-left text-lg font-light text-[var(--text-color)]"
                >
                  {item.name}
                </button>
              )
            ))}
            {user && (
              <button
                onClick={() => { onNavigate('admin'); setIsOpen(false); }}
                className="block w-full text-left text-lg font-light text-[#6B1A2A]"
              >
                Admin Dashboard
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="max-w-[680px] mx-auto px-4 py-20 border-t border-[var(--border-color)] mt-20">
    <div className="flex flex-col md:flex-row justify-between gap-8 text-[var(--text-color)]/40 text-sm font-light">
      <div>
        <p>© {new Date().getFullYear()} IROTORI BAROKA</p>
        <p>Une fenêtre sur mon esprit.</p>
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:text-[#6B1A2A] transition-colors">RSS</a>
        <a href="#" className="hover:text-[#6B1A2A] transition-colors">Twitter</a>
        <a href="#" className="hover:text-[#6B1A2A] transition-colors">Email</a>
      </div>
    </div>
  </footer>
);

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 my-16">
      <h3 className="text-2xl font-medium mb-2 text-[#6B1A2A]">Rejoignez le cercle intérieur</h3>
      <p className="text-[var(--text-color)]/60 font-light mb-6 leading-relaxed text-lg">
        Mises à jour occasionnelles sur les nouveaux modèles mentaux, analyses approfondies, et ajouts curatoriaux à la bibliothèque. Pas de bruit, que du signal.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="email@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#6B1A2A] text-white px-6 py-2 text-base hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : "S'inscrire"}
        </button>
      </form>
      {status === 'success' && <p className="text-sm text-green-500 mt-2">Vous êtes inscrit.</p>}
      {status === 'error' && <p className="text-sm text-red-500 mt-2">Une erreur est survenue.</p>}
    </section>
  );
};

// --- Pages ---

const HomePage = ({ onNavigate, posts }: { onNavigate: (p: string) => void, posts: Post[] }) => (
  <div className="space-y-20">
    <header className="py-20">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-6xl font-light tracking-tight leading-tight text-[#6B1A2A]"
      >
        Une fenêtre sur mon esprit.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-[var(--text-color)]/60 font-light mt-6 max-w-[500px] leading-relaxed"
      >
        Exploration des modèles mentaux, de la philosophie, et de l'intersection entre la technologie et l'humanité.
      </motion.p>
    </header>

    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[var(--text-color)]/40 font-medium">Latest Thinking</h2>
        <button
          onClick={() => onNavigate('blog')}
          className="text-sm font-medium text-[#6B1A2A] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </button>
      </div>
      <div className="space-y-12">
        {posts.slice(0, 3).map((post) => (
          <article key={post.id} className="group cursor-pointer" onClick={() => onNavigate(`post/${post.slug}`)}>
            <p className="text-sm text-[var(--text-color)]/40 font-light mb-2">{formatDate(post.createdAt)} — {post.type}</p>
            <h3 className="text-3xl font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors leading-snug">
              {post.title}
            </h3>
          </article>
        ))}
      </div>
    </section>

    <Newsletter />
  </div>
);

const ContentListPage = ({ type, title, posts, onNavigate }: { type: string, title?: string, posts: Post[], onNavigate: (p: string) => void }) => {
  const [videoPlaylist, setVideoPlaylist] = useState<string>('');
  const [videoPosts, setVideoPosts] = useState<Post[]>([]);
  const [videoPlaylists, setVideoPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load video playlists on mount
  useEffect(() => {
    if (type === 'video') {
      // Get playlists from initial posts
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

  const filteredPosts = posts.filter(p => p.type === type || type === 'all');
  const displayTitle = title || (type === 'all' ? 'Archive' : type.charAt(0).toUpperCase() + type.slice(1));

  // Library page with cover images and download links
  if (type === 'ebook') {
    return (
      <div>
        {/* Banner */}
        <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
          <div className="max-w-[680px] mx-auto px-4">
            <h1 className="text-base md:text-lg font-normal text-[#6B1A2A]">{displayTitle}</h1>
          </div>
        </div>
        {/* Content */}
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

  // Video page with playlists - Show playlist selection first
  if (type === 'video') {
    // If no playlist selected, show playlist cards
    if (!videoPlaylist) {
      return (
        <div>
          {/* Banner */}
          <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
            <div className="max-w-[680px] mx-auto px-4">
              <h1 className="text-base md:text-lg font-normal text-[#6B1A2A] mb-2">{displayTitle}</h1>
              <p className="text-sm text-[var(--text-color)]/60">Quelle catégorie vous intéresse ?</p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-[680px] mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoPlaylists.length > 0 ? (
                videoPlaylists.map((playlistName) => (
                  <button
                    key={playlistName}
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
                  </button>
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

    // Playlist selected, show videos
    return (
      <div>
        {/* Banner with back button and playlist info */}
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

        {/* Content */}
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

  return (
    <div>
      {/* Banner */}
      <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
        <div className="max-w-[680px] mx-auto px-4">
          <h1 className="text-base md:text-lg font-normal text-[#6B1A2A]">{displayTitle}</h1>
        </div>
      </div>
      {/* Content */}
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
};

const PostPage = ({ slug, onNavigate }: { slug: string, onNavigate?: (p: string) => void }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="py-20 text-center font-light text-[var(--text-color)]/40">Reading...</div>;
  if (!post) return <div className="py-20 text-center font-light text-[var(--text-color)]/40">Not found.</div>;

  // Video page with player
  if (post.type === 'video') {
    const getVideoEmbed = (url: string) => {
      if (!url) return null;
      // YouTube - multiple formats
      const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
      }
      // Google Drive (preview)
      if (url.includes('drive.google.com')) {
        const fileId = url.split('/d/')[1]?.split('/')[0];
        if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      // If it's already a YouTube embed URL, use it directly
      if (url.includes('youtube.com/embed/')) {
        return url + '?autoplay=1&rel=0';
      }
      return null;
    };

    const embedUrl = post.videoUrl ? getVideoEmbed(post.videoUrl) : null;

    return (
      <article className="py-20">
        <div className="mb-8">
          <button
            onClick={() => onNavigate?.('video')}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux Vidéos
          </button>
        </div>
        <div className="mb-8">
          {post.playlist && (
            <p className="text-sm text-[#6B1A2A] uppercase tracking-widest mb-2">{post.playlist}</p>
          )}
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-4 text-[#6B1A2A]">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-lg text-[var(--text-color)]/80 leading-relaxed">
              {post.description}
            </p>
          )}
        </div>
        {embedUrl ? (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-8">
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#6B1A2A] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <iframe
              src={embedUrl}
              title={post.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setVideoLoaded(true)}
            />
          </div>
        ) : post.videoUrl ? (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-8 flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-[var(--text-color)]/60 mb-4">Lien vidéo non supporté</p>
              <a
                href={post.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#6B1A2A] hover:underline"
              >
                Ouvrir dans un nouvel onglet
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        ) : null}
        {post.content && (
          <div className="prose max-w-none font-light leading-relaxed text-xl">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}
      </article>
    );
  }

  // Ebook page with cover and download
  if (post.type === 'ebook') {
    return (
      <article className="py-20">
        <div className="mb-8">
          <button
            onClick={() => onNavigate?.('library')}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors"
          >
            <ArrowLeft size={16} />
            Retour à la Library
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-1">
            {post.coverImage ? (
              <img src={post.coverImage} alt={post.title} className="w-full rounded-lg shadow-lg" />
            ) : (
              <div className="w-full aspect-[3/4] bg-[var(--card-bg)] rounded-lg flex items-center justify-center">
                <Book size={64} className="text-[var(--text-color)]/20" />
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-[var(--text-color)]/40 font-light mb-4 uppercase tracking-widest">
              {formatDate(post.createdAt)} • Ebook
            </p>
            <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6 text-[#6B1A2A]">
              {post.title}
            </h1>
            {post.description && (
              <p className="text-lg text-[var(--text-color)]/80 leading-relaxed mb-8">
                {post.description}
              </p>
            )}
            {post.downloadUrl && (
              <a
                href={post.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#6B1A2A] text-white px-8 py-3 text-base hover:opacity-90 transition-opacity rounded-lg"
              >
                <ArrowRight size={18} />
                Télécharger
              </a>
            )}
          </div>
        </div>
        {post.content && (
          <div className="prose max-w-none font-light leading-relaxed text-xl">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}
      </article>
    );
  }

  // Determine back navigation based on type
  const backPath = post.type === 'model' ? 'reflexion' : post.type === 'note' ? 'notes' : post.type === 'video' ? 'video' : 'home';
  const backLabel = post.type === 'model' ? 'Retour aux Réflexions' : post.type === 'note' ? 'Retour aux Notes de lecture' : post.type === 'video' ? 'Retour aux Vidéos' : 'Retour';

  return (
    <article className="py-20">
      <div className="mb-8">
        <button
          onClick={() => onNavigate?.(backPath)}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </button>
      </div>
      <header className="mb-16">
        <p className="text-sm text-[var(--text-color)]/40 font-light mb-4 uppercase tracking-widest">
          {formatDate(post.createdAt)} • {post.type}
        </p>
        <h1 className="text-5xl md:text-6xl font-light leading-tight mb-8 text-[#6B1A2A]">
          {post.title}
        </h1>
        {post.tags && (
          <div className="flex gap-2">
            {post.tags.split(',').map(tag => (
              <span key={tag} className="text-xs uppercase tracking-wider px-2 py-1 bg-[var(--card-bg)] text-[var(--text-color)]/60 rounded-sm">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose max-w-none font-light leading-relaxed text-xl">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
};

const AdminDashboard = ({ onNavigate, posts, onRefresh }: { onNavigate: (p: string) => void, posts: Post[], onRefresh: () => void }) => {
  const [view, setView] = useState<'list' | 'table'>('list');
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      onRefresh();
    }
  };

  // Filter posts
  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={14} className="inline mr-1" />;
      case 'note': return <Book size={14} className="inline mr-1" />;
      case 'model': return <Brain size={14} className="inline mr-1" />;
      case 'ebook': return <Library size={14} className="inline mr-1" />;
      default: return <FileText size={14} className="inline mr-1" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Vidéo';
      case 'note': return 'Note';
      case 'model': return 'Réflexion';
      case 'ebook': return 'Ebook';
      default: return type;
    }
  };

  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[var(--border-color)]">
        <h1 className="text-3xl font-light text-[#6B1A2A] mb-4">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-color)]/40" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-md appearance-none cursor-pointer hover:border-[var(--text-color)]/40 transition-colors"
            >
              <option value="all">Toutes catégories</option>
              <option value="video">Vidéo</option>
              <option value="note">Note de lecture</option>
              <option value="model">Réflexion</option>
              <option value="ebook">Ebook</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-[var(--border-color)] rounded-md overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={cn(
                "px-3 py-2 flex items-center gap-2 text-sm transition-colors",
                view === 'list' ? "bg-[#6B1A2A] text-white" : "bg-[var(--card-bg)] text-[var(--text-color)]/60 hover:text-[#6B1A2A]"
              )}
            >
              <LayoutList size={14} />
              <span className="hidden sm:inline">Liste</span>
            </button>
            <button
              onClick={() => setView('table')}
              className={cn(
                "px-3 py-2 flex items-center gap-2 text-sm transition-colors border-l border-[var(--border-color)]",
                view === 'table' ? "bg-[#6B1A2A] text-white" : "bg-[var(--card-bg)] text-[var(--text-color)]/60 hover:text-[#6B1A2A]"
              )}
            >
              <Eye size={14} />
              <span className="hidden sm:inline">Tableau</span>
            </button>
          </div>

          {/* New Content Button */}
          <button
            onClick={() => onNavigate('admin/new')}
            className="flex items-center gap-2 bg-[#6B1A2A] text-white px-4 py-2 text-sm hover:opacity-90 transition-opacity rounded-md shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nouveau</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#6B1A2A]/10 rounded-md">
              <FileText size={18} className="text-[#6B1A2A]" />
            </div>
            <span className="text-2xl font-light text-[var(--text-color)]">{posts.length}</span>
          </div>
          <p className="text-xs text-[var(--text-color)]/40 uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-md">
              <Eye size={18} className="text-green-600" />
            </div>
            <span className="text-2xl font-light text-[var(--text-color)]">{posts.filter(p => p.status === 'published').length}</span>
          </div>
          <p className="text-xs text-[var(--text-color)]/40 uppercase tracking-wider">Publiés</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-md">
              <AlignLeft size={18} className="text-yellow-600" />
            </div>
            <span className="text-2xl font-light text-[var(--text-color)]">{posts.filter(p => p.status === 'draft').length}</span>
          </div>
          <p className="text-xs text-[var(--text-color)]/40 uppercase tracking-wider">Brouillons</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#6B1A2A]/10 rounded-md">
              <Video size={18} className="text-[#6B1A2A]" />
            </div>
            <span className="text-2xl font-light text-[var(--text-color)]">{filteredPosts.length}</span>
          </div>
          <p className="text-xs text-[var(--text-color)]/40 uppercase tracking-wider">Filtrés</p>
        </div>
      </div>

      {/* Content List */}
      {view === 'list' ? (
        <div className="space-y-3">
          {paginatedPosts.map((post) => (
            <div
              key={post.id}
              className="group flex items-center justify-between p-4 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-lg hover:border-[#6B1A2A]/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={cn(
                  "p-2 rounded-md",
                  post.type === 'video' ? "bg-red-500/10 text-red-600" :
                    post.type === 'note' ? "bg-blue-500/10 text-blue-600" :
                      post.type === 'model' ? "bg-purple-500/10 text-purple-600" :
                        "bg-green-500/10 text-green-600"
                )}>
                  {getTypeIcon(post.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-base text-[var(--text-color)] truncate">{post.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--text-color)]/40">{getTypeLabel(post.type)}</span>
                    <span className="text-[var(--text-color)]/20">•</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      post.status === 'published' ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                    )}>
                      {post.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                    <span className="text-[var(--text-color)]/20">•</span>
                    <span className="text-xs text-[var(--text-color)]/40">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onNavigate(`admin/edit/${post.slug}`)}
                  className="p-2 text-[var(--text-color)]/40 hover:text-[#6B1A2A] hover:bg-[#6B1A2A]/10 rounded-md transition-colors"
                  title="Modifier"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-[var(--text-color)]/40 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--card-bg)] border-b border-[var(--border-color)]">
              <tr>
                <th className="text-left text-xs uppercase tracking-wider text-[var(--text-color)]/40 font-medium px-4 py-3">Titre</th>
                <th className="text-left text-xs uppercase tracking-wider text-[var(--text-color)]/40 font-medium px-4 py-3">Type</th>
                <th className="text-left text-xs uppercase tracking-wider text-[var(--text-color)]/40 font-medium px-4 py-3">Statut</th>
                <th className="text-left text-xs uppercase tracking-wider text-[var(--text-color)]/40 font-medium px-4 py-3">Date</th>
                <th className="text-right text-xs uppercase tracking-wider text-[var(--text-color)]/40 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--card-bg)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--text-color)] truncate max-w-xs">{post.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--card-bg)] text-xs uppercase tracking-wider rounded-md text-[var(--text-color)]/60">
                      {getTypeIcon(post.type)}
                      {getTypeLabel(post.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2.5 py-1 text-xs uppercase tracking-wider rounded-md",
                      post.status === 'published' ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                    )}>
                      {post.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-color)]/60">{formatDate(post.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigate(`admin/edit/${post.slug}`)}
                        className="p-1.5 text-[#6B1A2A]/60 hover:text-[#6B1A2A] hover:bg-[#6B1A2A]/10 rounded-md transition-colors"
                        title="Modifier"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[var(--border-color)]">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[var(--border-color)] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--card-bg)] hover:border-[#6B1A2A] transition-colors"
          >
            <ChevronLeft size={16} />
            Précédent
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md">
            <span className="text-sm text-[var(--text-color)]/60">Page</span>
            <span className="text-sm font-medium text-[#6B1A2A]">{currentPage}</span>
            <span className="text-sm text-[var(--text-color)]/60">sur</span>
            <span className="text-sm font-medium text-[#6B1A2A]">{totalPages}</span>
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[var(--border-color)] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--card-bg)] hover:border-[#6B1A2A] transition-colors"
          >
            Suivant
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <FileText size={48} className="mx-auto mb-4 text-[var(--text-color)]/20" />
          <p className="text-[var(--text-color)]/40 font-light">Aucun contenu trouvé.</p>
          <button
            onClick={() => { setFilter('all'); setCurrentPage(1); }}
            className="mt-4 text-sm text-[#6B1A2A] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

const AdminEditorPage = ({ slug, onNavigate, onRefresh, posts }: { slug?: string, onNavigate: (p: string) => void, onRefresh: () => void, posts: Post[] }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<string>('video');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [playlist, setPlaylist] = useState('');
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);

  // Get existing playlists from video posts
  const existingPlaylists = Array.from(
    new Set(posts.filter(p => p.type === 'video' && p.playlist).map(p => p.playlist))
  ).filter(Boolean) as string[];

  useEffect(() => {
    if (slug) {
      fetch(`/api/posts/${slug}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setType(data.type);
          setContent(data.content);
          setStatus(data.status);
          setTags(data.tags || '');
          setDescription(data.description || '');
          setCoverImage(data.coverImage || '');
          setDownloadUrl(data.downloadUrl || '');
          setVideoUrl(data.videoUrl || '');
          setPlaylist(data.playlist || '');
          setLoading(false);
        });
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slugified = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const data: any = {
      title,
      slug: slugified,
      type,
      content,
      status,
    };

    // Add fields based on type
    if (type === 'model') {
      data.tags = tags;
    } else if (type === 'ebook') {
      data.description = description;
      data.coverImage = coverImage;
      data.downloadUrl = downloadUrl;
    } else if (type === 'video') {
      data.description = description;
      data.coverImage = coverImage;
      data.videoUrl = videoUrl;
      data.playlist = playlist;
    } else {
      data.tags = tags;
    }

    const url = slug ? `/api/posts/${slug}` : '/api/posts';
    const method = slug ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('API Error:', error);
        alert('Error: ' + (error.error || 'Failed to save'));
        setSaving(false);
        return;
      }

      onRefresh();
      onNavigate('admin');
    } catch (err) {
      console.error('Submit Error:', err);
      alert('Error: ' + (err as Error).message);
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-[var(--text-color)]/40">Loading...</div>;

  return (
    <div className="py-20">
      <h1 className="text-4xl font-light mb-12 text-[#6B1A2A]">{slug ? 'Edit' : 'New'} Content</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-2xl font-light text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A]"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
            >
              <option value="video">Vidéo</option>
              <option value="note">Note de lecture</option>
              <option value="model">Réflexion</option>
              <option value="ebook">Ebook</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {type === 'model' && (
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Sous-catégorie</label>
            <select
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
            >
              <option value="">Sélectionner...</option>
              <option value="spiritualite">Spiritualité</option>
              <option value="entrepreneurial">Entrepreneurial/MindSet</option>
              <option value="management">Management</option>
              <option value="education">Éducation</option>
            </select>
          </div>
        )}

        {type !== 'model' && (
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
            />
          </div>
        )}

        {type === 'ebook' && (
          <>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Cover Image URL</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
              />
              {coverImage && (
                <img src={coverImage} alt="Preview" className="mt-2 max-w-[200px] rounded" />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Download Link (Google Drive)</label>
              <input
                type="url"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
              />
            </div>
          </>
        )}

        {type === 'video' && (
          <>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">
                Playlist
                <span className="text-[var(--text-color)]/40 font-normal ml-2">(optionnel - pour regrouper vos vidéos)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playlist}
                  onChange={(e) => setPlaylist(e.target.value)}
                  placeholder="Nom de la playlist (ex: Tutoriels, Conférences...)"
                  className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
                  list="playlist-suggestions"
                />
                <datalist id="playlist-suggestions">
                  {existingPlaylists.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                {playlist && (
                  <button
                    type="button"
                    onClick={() => setPlaylist('')}
                    className="px-3 text-sm text-[var(--text-color)]/40 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              {existingPlaylists.length > 0 && (
                <p className="text-xs text-[var(--text-color)]/40">
                  Playlists existantes : {existingPlaylists.join(', ')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Miniature (Cover Image URL)</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
              />
              {coverImage && (
                <img src={coverImage} alt="Preview" className="mt-2 max-w-[200px] rounded" />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Lien de la vidéo (YouTube / Drive)</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou https://drive.google.com/..."
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Content</label>
          <Editor content={content} onChange={setContent} />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="px-6 py-2 text-base font-light text-[var(--text-color)] hover:underline"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#6B1A2A] text-white px-8 py-2 text-base hover:opacity-90 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) onLogin();
    else setError('Invalid credentials');
  };

  return (
    <div className="py-40 max-w-[400px] mx-auto">
      <h1 className="text-4xl font-light mb-8 text-[#6B1A2A]">Admin Access</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full bg-[#6B1A2A] text-white py-2 text-base hover:opacity-90 transition-colors">
          Login
        </button>
      </form>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/admin') return 'admin';
    if (path === '/admin/new') return 'admin/new';
    if (path.startsWith('/admin/edit/')) return `admin/edit/${path.split('/')[3]}`;
    if (path.startsWith('/post/')) return `post/${path.split('/')[2]}`;
    if (path === '/video') return 'video';
    if (path === '/notes') return 'notes';
    if (path === '/reflexion') return 'reflexion';
    if (path === '/reflexion/spiritualite') return 'reflexion/spiritualite';
    if (path === '/reflexion/entrepreneurial') return 'reflexion/entrepreneurial';
    if (path === '/reflexion/management') return 'reflexion/management';
    if (path === '/reflexion/education') return 'reflexion/education';
    if (path === '/library') return 'library';
    // Handle short URLs like /transformation, /mon-article, etc.
    if (path.length > 1 && !path.startsWith('/admin') && !path.startsWith('/post/') && !path.startsWith('/reflexion/')) {
      return `post/${path.slice(1)}`;
    }
    return 'home';
  });
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Then check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const fetchPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  };

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Check auth
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user));

    // Fetch posts
    fetchPosts();
    setLoading(false);
  }, []);

  // Sync URL with currentPage
  useEffect(() => {
    const pathMap: Record<string, string> = {
      'home': '/',
      'video': '/video',
      'notes': '/notes',
      'reflexion': '/reflexion',
      'reflexion/spiritualite': '/reflexion/spiritualite',
      'reflexion/entrepreneurial': '/reflexion/entrepreneurial',
      'reflexion/management': '/reflexion/management',
      'reflexion/education': '/reflexion/education',
      'library': '/library',
      'admin': '/admin',
      'admin/new': '/admin/new',
    };
    let newPath = pathMap[currentPage];
    if (!newPath) {
      if (currentPage.startsWith('post/')) {
        const slug = currentPage.split('/')[1];
        // Use short URL format: /transformation instead of /post/transformation
        newPath = `/${slug}`;
      } else if (currentPage.startsWith('admin/edit/')) {
        const slug = currentPage.split('/')[2];
        newPath = `/admin/edit/${slug}`;
      }
    }
    if (newPath && window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  }, [currentPage]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setCurrentPage('home');
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const renderPage = () => {
    if (currentPage === 'home') return <HomePage onNavigate={setCurrentPage} posts={posts.filter(p => p.status === 'published')} />;
    if (currentPage === 'video') return <ContentListPage type="video" title="Vidéo" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    if (currentPage === 'notes') return <ContentListPage type="note" title="Notes de lecture" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion') return <ContentListPage type="model" title="Réflexion" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion/spiritualite') return <ContentListPage type="model" title="Spiritualité" posts={posts.filter(p => p.status === 'published' && p.tags?.includes('spiritualite'))} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion/entrepreneurial') return <ContentListPage type="model" title="Entrepreneurial/MindSet" posts={posts.filter(p => p.status === 'published' && (p.tags?.includes('entrepreneurial') || p.tags?.includes('entrepreneuriat')))} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion/management') return <ContentListPage type="model" title="Management" posts={posts.filter(p => p.status === 'published' && p.tags?.includes('management'))} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion/education') return <ContentListPage type="model" title="Éducation" posts={posts.filter(p => p.status === 'published' && p.tags?.includes('education'))} onNavigate={setCurrentPage} />;
    if (currentPage === 'library') return <ContentListPage type="ebook" title="Library" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;

    if (currentPage.startsWith('post/')) {
      const slug = currentPage.split('/')[1];
      return <PostPage slug={slug} onNavigate={setCurrentPage} />;
    }

    if (currentPage === 'admin') {
      if (!user) return <LoginPage onLogin={() => { fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user)); setCurrentPage('admin'); }} />;
      return <AdminDashboard onNavigate={setCurrentPage} posts={posts} onRefresh={fetchPosts} />;
    }

    if (currentPage === 'admin/new') {
      if (!user) return <LoginPage onLogin={() => { fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user)); setCurrentPage('admin/new'); }} />;
      return <AdminEditorPage onNavigate={setCurrentPage} onRefresh={fetchPosts} posts={posts} />;
    }

    if (currentPage.startsWith('admin/edit/')) {
      if (!user) return <LoginPage onLogin={() => { fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user)); setCurrentPage(currentPage); }} />;
      const slug = currentPage.split('/')[2];
      return <AdminEditorPage slug={slug} onNavigate={setCurrentPage} onRefresh={fetchPosts} posts={posts} />;
    }

    return <div>404</div>;
  };

  if (loading) return null;

  return (
    <div className="min-h-screen font-sans selection:bg-[#6B1A2A]/20 selection:text-[#6B1A2A] transition-colors duration-300">
      <Navbar user={user} theme={theme} onToggleTheme={toggleTheme} onNavigate={setCurrentPage} />

      <main className="max-w-[680px] mx-auto px-4 min-h-[calc(100vh-200px)]">
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
