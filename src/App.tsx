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
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { cn, formatDate, Post } from './lib/utils';
import Editor from './components/Editor';

// --- Components ---

const Navbar = ({ user, theme, onToggleTheme, onNavigate }: { user: any, theme: string, onToggleTheme: () => void, onNavigate: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reflexionOpen, setReflexionOpen] = useState(false);

  const navItems = [
    { name: 'Vidéo', path: 'video', icon: FileText },
    { name: 'Notes de lecture', path: 'notes', icon: Book },
    { name: 'Réflexion', path: 'reflexion', icon: Brain, hasSubmenu: true },
    { name: 'Library', path: 'library', icon: Library },
  ];

  const reflexionSubItems = [
    { name: 'Spiritualité', path: 'reflexion/spiritualite' },
    { name: 'Entrepreneuriat', path: 'reflexion/entrepreneuriat' },
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
        <p>A window into my mind.</p>
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
      <h3 className="text-2xl font-medium mb-2 text-[#6B1A2A]">Join the inner circle</h3>
      <p className="text-[var(--text-color)]/60 font-light mb-6 leading-relaxed text-lg">
        Occasional updates on new mental models, deep dives, and curated library additions. No noise, just signal.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#6B1A2A] text-white px-6 py-2 text-base hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && <p className="text-sm text-green-500 mt-2">You're on the list.</p>}
      {status === 'error' && <p className="text-sm text-red-500 mt-2">Something went wrong.</p>}
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
        A window into my mind.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-[var(--text-color)]/60 font-light mt-6 max-w-[500px] leading-relaxed"
      >
        Exploring mental s, philosophy, and the intersection of technology and humanity.
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
  const filteredPosts = posts.filter(p => p.type === type || type === 'all');
  const displayTitle = title || (type === 'all' ? 'Archive' : type.charAt(0).toUpperCase() + type.slice(1));

  // Library page with cover images and download links
  if (type === 'ebook') {
    return (
      <div className="py-20">
        <h1 className="text-5xl font-light mb-16 text-[#6B1A2A]">{displayTitle}</h1>
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
    );
  }

  // Video page with playlists
  if (type === 'video') {
    // Group videos by playlist
    const playlists = filteredPosts.reduce((acc, post) => {
      const playlistName = post.playlist || 'Autres vidéos';
      if (!acc[playlistName]) acc[playlistName] = [];
      acc[playlistName].push(post);
      return acc;
    }, {} as Record<string, Post[]>);

    return (
      <div className="py-20">
        <h1 className="text-5xl font-light mb-16 text-[#6B1A2A]">{displayTitle}</h1>
        {Object.entries(playlists).map(([playlistName, playlistPosts]) => (
          <div key={playlistName} className="mb-16">
            <h2 className="text-2xl font-light text-[#6B1A2A] mb-8">{playlistName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlistPosts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#6B1A2A] transition-colors"
                  onClick={() => onNavigate(`post/${post.slug}`)}
                >
                  {post.coverImage ? (
                    <div className="relative">
                      <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <ArrowRight size={20} className="text-[#6B1A2A] ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-[var(--bg-color)] flex items-center justify-center">
                      <FileText size={48} className="text-[var(--text-color)]/20" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-base font-light text-[var(--text-color)] group-hover:text-[#6B1A2A] transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-sm text-[var(--text-color)]/60 line-clamp-2">
                        {post.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <p className="text-[var(--text-color)]/40 font-light italic">Nothing here yet.</p>
        )}
      </div>
    );
  }

  return (
    <div className="py-20">
      <h1 className="text-5xl font-light mb-16 text-[#6B1A2A]">{displayTitle}</h1>
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
  );
};

const PostPage = ({ slug, onNavigate }: { slug: string, onNavigate?: (p: string) => void }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

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
      // YouTube
      const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
      // Google Drive (preview)
      if (url.includes('drive.google.com')) {
        const fileId = url.split('/d/')[1]?.split('/')[0];
        if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
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
            <iframe
              src={embedUrl}
              title={post.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : post.videoUrl ? (
          <a
            href={post.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full aspect-video bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg flex items-center justify-center mb-8 hover:border-[#6B1A2A] transition-colors"
          >
            <div className="text-center">
              <ArrowRight size={48} className="mx-auto mb-4 text-[#6B1A2A]" />
              <p className="text-[var(--text-color)]">Voir la vidéo</p>
            </div>
          </a>
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
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      onRefresh();
    }
  };

  return (
    <div className="py-20">
      <div className="flex items-center justify-between mb-16">
        <h1 className="text-4xl font-light text-[#6B1A2A]">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex border border-[var(--border-color)]">
            <button
              onClick={() => setView('list')}
              className={cn(
                "px-3 py-1.5 text-sm transition-colors",
                view === 'list' ? "bg-[#6B1A2A] text-white" : "text-[var(--text-color)]/60 hover:text-[#6B1A2A]"
              )}
            >
              Liste
            </button>
            <button
              onClick={() => setView('table')}
              className={cn(
                "px-3 py-1.5 text-sm transition-colors border-l border-[var(--border-color)]",
                view === 'table' ? "bg-[#6B1A2A] text-white" : "text-[var(--text-color)]/60 hover:text-[#6B1A2A]"
              )}
            >
              Tableau
            </button>
          </div>
          <button
            onClick={() => onNavigate('admin/new')}
            className="flex items-center gap-2 bg-[#6B1A2A] text-white px-4 py-2 text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> New Content
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--text-color)]/20 transition-colors">
              <div>
                <h3 className="font-medium text-base text-[var(--text-color)]">{post.title}</h3>
                <p className="text-sm text-[var(--text-color)]/40 font-light">{post.type} • {post.status} • {formatDate(post.createdAt)}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate(`admin/edit/${post.slug}`)}
                  className="text-sm text-[#6B1A2A] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-sm text-red-500/60 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-[var(--border-color)]">
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
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--card-bg)]/50">
                  <td className="px-4 py-3 text-[var(--text-color)]">{post.title}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-color)]/60">
                    <span className="px-2 py-1 bg-[var(--card-bg)] text-xs uppercase tracking-wider rounded-sm">{post.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={cn(
                      "px-2 py-1 text-xs uppercase tracking-wider rounded-sm",
                      post.status === 'published' ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                    )}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-color)]/60">{formatDate(post.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onNavigate(`admin/edit/${post.slug}`)}
                        className="text-sm text-[#6B1A2A] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-sm text-red-500/60 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminEditorPage = ({ slug, onNavigate, onRefresh }: { slug?: string, onNavigate: (p: string) => void, onRefresh: () => void }) => {
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
              <option value="entrepreneuriat">Entrepreneuriat</option>
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
              <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Playlist</label>
              <input
                type="text"
                value={playlist}
                onChange={(e) => setPlaylist(e.target.value)}
                placeholder="Nom de la playlist"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
              />
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
    if (path === '/reflexion/entrepreneuriat') return 'reflexion/entrepreneuriat';
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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

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
      'reflexion/entrepreneuriat': '/reflexion/entrepreneuriat',
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
    if (currentPage === 'reflexion/entrepreneuriat') return <ContentListPage type="model" title="Entrepreneuriat" posts={posts.filter(p => p.status === 'published' && p.tags?.includes('entrepreneuriat'))} onNavigate={setCurrentPage} />;
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
      return <AdminEditorPage onNavigate={setCurrentPage} onRefresh={fetchPosts} />;
    }

    if (currentPage.startsWith('admin/edit/')) {
      if (!user) return <LoginPage onLogin={() => { fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user)); setCurrentPage(currentPage); }} />;
      const slug = currentPage.split('/')[2];
      return <AdminEditorPage slug={slug} onNavigate={setCurrentPage} onRefresh={fetchPosts} />;
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
