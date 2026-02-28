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
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  PlayCircle,
  Target,
  ArrowUpRight
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
        <p>VOLUNTARIAT - VIA - VICTORIA</p>
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
    <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-10 my-20">
      <h3 className="text-2xl font-medium mb-4 text-[#6B1A2A]">Newsletter</h3>
      <p className="text-[var(--text-color)]/70 font-light mb-8 leading-relaxed text-lg">
        Recevez des idées essentielles pour renforcer votre clarté mentale et votre capacité d'action.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#6B1A2A] text-white px-8 py-3 text-base font-medium hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : "S'inscrire"}
        </button>
      </form>
      {status === 'success' && <p className="text-sm text-green-500 mt-3">Bienvenue. Vous recevrez bientôt nos réflexions.</p>}
      {status === 'error' && <p className="text-sm text-red-500 mt-3">Une erreur est survenue. Veuillez réessayer.</p>}
    </section>
  );
};

const FeatureCard = ({ title, description, icon: Icon, onClick, label }: { title: string, description: string, icon: any, onClick: () => void, label: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 flex flex-col h-full group cursor-pointer transition-all hover:border-[#6B1A2A]/30"
    onClick={onClick}
  >
    <div className="text-[#6B1A2A] mb-6">
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-2xl font-medium text-[#6B1A2A] mb-3">{title}</h3>
    <p className="text-[var(--text-color)]/60 font-light leading-relaxed mb-8 flex-grow text-lg">
      {description}
    </p>
    <div className="flex items-center gap-2 text-[#6B1A2A] font-medium group-hover:gap-4 transition-all text-lg">
      {label} <ArrowRight size={20} />
    </div>
  </motion.div>
);

// --- Pages ---

const HomePage = ({ onNavigate }: { onNavigate: (p: string) => void }) => (
  <div className="space-y-32 pb-32">
    {/* Hero Image - Full Width */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden"
    >
      <img
        src="https://res.cloudinary.com/baroka/image/upload/v1772294086/ali-ahmadi-pWT8BptTET0-unsplash_plej4w.jpg"
        alt="Clarity and Focus"
        className="w-full h-full object-cover grayscale brightness-[0.4] contrast-125 scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-color)]" />

      {/* Overlay Content for Hero Image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-[0.3em] font-medium rounded-full mb-4">
            <a
              href="https://fr.wikipedia.org/wiki/Le_Mat"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              Le Mat
            </a>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white whitespace-nowrap">
            IROTORI BAROKA
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-light tracking-tight">
            Pourquoi Pas ?
          </p>
        </motion.div>
      </div>
    </motion.div>

    {/* Main Content Sections */}
    <div className="space-y-32">
      {/* Introduction Section */}
      <section className="max-w-[680px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10 text-xl text-[var(--text-color)]/70 font-light leading-relaxed"
        >
          <p className="text-3xl font-light text-[var(--text-color)] leading-snug">
            Je pense que la clarté est le point de départ de toute transformation.

          </p>
          <div className="space-y-6 border-l-2 border-[#6B1A2A] pl-8 italic text-2xl">
            <p>Vous pensez beaucoup, mais vous avancez peu.</p>
            <p>Vous ressentez qu'il y a plus pour vous, mais vous restez bloqué.</p>
            <p>Vous attendez le bon moment, sans jamais être certain.</p>
          </div>
          <div className="space-y-6 pt-4">
            <p className="text-2xl">
              Je vous aide à retrouver la clarté et passer à l'action.
            </p>

          </div>
        </motion.div>
      </section>

      {/* reflexions Section */}
      <section className="py-32 border-y border-[var(--border-color)] bg-[var(--card-bg)]/30">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-6xl font-light text-[#6B1A2A] leading-[0.9] tracking-tighter">
              Mes réflexions
            </h2>
            <p className="text-2xl text-[var(--text-color)]/70 font-light leading-relaxed max-w-[500px]">
              Des principes et structures pour clarifier votre pensée et reprendre le contrôle.
            </p>
            <button
              onClick={() => onNavigate('reflexion')}
              className="inline-flex items-center gap-4 bg-[#6B1A2A] text-white px-10 py-4 font-medium hover:opacity-90 transition-opacity text-xl group"
            >
              Lire les réflexions <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {[
                { number: "01", title: "Clarifier votre pensée", description: "Identifier les croyances et schémas qui vous limitent" },
                { number: "02", title: "Reprendre le contrôle", description: "Retrouver votre attention et votre capacité d'action" },
                { number: "03", title: "Avancer concrètement", description: "Passer de la réflexion à l'exécution" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6 p-8 bg-[var(--bg-color)] border border-[var(--border-color)] group hover:border-[#6B1A2A]/30 transition-colors"
                >
                  <span className="text-3xl font-light text-[#6B1A2A]/30 group-hover:text-[#6B1A2A] transition-colors">{item.number}</span>
                  <div>
                    <h3 className="text-2xl font-medium text-[var(--text-color)] mb-2">{item.title}</h3>
                    <p className="text-lg text-[var(--text-color)]/60 font-light">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* E-book Section */}
      <section className="py-32 border-y border-[var(--border-color)] bg-[var(--card-bg)]/30">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-6xl font-light text-[#6B1A2A] leading-[0.9] tracking-tighter">
              Mon E-book
            </h2>
            <p className="text-2xl text-[var(--text-color)]/70 font-light leading-relaxed max-w-[500px]">
              Une méthode complète pour sortir de la stagnation et reconstruire votre discipline, étape par étape.
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="inline-flex items-center gap-4 bg-[#6B1A2A] text-white px-10 py-4 font-medium hover:opacity-90 transition-opacity text-xl group"
            >
              Voir le livre <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {[
                { number: "01", title: "Comprendre", description: "Les fondements de la clarté mentale et les obstacles invisibles" },
                { number: "02", title: "Structurer", description: "Construire un système personnel de principes et d'habitudes" },
                { number: "03", title: "Agir", description: "Passer de la théorie à la pratique avec des exercices concrets" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6 p-8 bg-[var(--bg-color)] border border-[var(--border-color)] group hover:border-[#6B1A2A]/30 transition-colors"
                >
                  <span className="text-3xl font-light text-[#6B1A2A]/30 group-hover:text-[#6B1A2A] transition-colors">{item.number}</span>
                  <div>
                    <h3 className="text-2xl font-medium text-[var(--text-color)] mb-2">{item.title}</h3>
                    <p className="text-lg text-[var(--text-color)]/60 font-light">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-32 border-y border-[var(--border-color)] bg-[var(--card-bg)]/30">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-6xl font-light text-[#6B1A2A] leading-[0.9] tracking-tighter">
              Mes Vidéos
            </h2>
            <p className="text-2xl text-[var(--text-color)]/70 font-light leading-relaxed max-w-[500px]">
              Des webinaires et formations live sur les thématiques philosophiques, spirituelles et développement personnel.
            </p>
            <button
              onClick={() => onNavigate('video')}
              className="inline-flex items-center gap-4 bg-[#6B1A2A] text-white px-10 py-4 font-medium hover:opacity-90 transition-opacity text-xl group"
            >
              Voir les vidéos <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {[
                { number: "01", title: "Philosophie", description: "Explorer des concepts philosophiques de facon abordable et pratique" },
                { number: "02", title: "Spiritualité", description: "Réflexions sur le sens, la conscience et l'intériorité" },
                { number: "03", title: "MindSet", description: "Transformation mentale et reconstruction" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6 p-8 bg-[var(--bg-color)] border border-[var(--border-color)] group hover:border-[#6B1A2A]/30 transition-colors"
                >
                  <span className="text-3xl font-light text-[#6B1A2A]/30 group-hover:text-[#6B1A2A] transition-colors">{item.number}</span>
                  <div>
                    <h3 className="text-2xl font-medium text-[var(--text-color)] mb-2">{item.title}</h3>
                    <p className="text-lg text-[var(--text-color)]/60 font-light">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* About & Social Section */}
      <section className="bg-[#6B1A2A] text-white py-32 px-4">
        <div className="max-w-[800px] mx-auto space-y-16">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-7xl font-light leading-[0.9] tracking-tighter">
              Comment je me définis ?
            </h2>
            <p className="text-xl uppercase tracking-widest opacity-60">
              Ingénieur | Educateur | Entrepreneur
            </p>
            <blockquote className="text-xl md:text-2xl italic text-white/80 font-light leading-relaxed border-l border-white/20 pl-8 max-w-2xl">
              "J'aime créer des solutions et rendre les choses complexes simples et claires."
            </blockquote>

          </div>

          <div className="pt-12 space-y-6 border-t border-white/20">
            <p className="text-sm uppercase tracking-widest opacity-60">Me suivre</p>
            <div className="flex gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-light hover:opacity-80 transition-opacity flex items-center gap-3"
              >
                Facebook
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-light hover:opacity-80 transition-opacity flex items-center gap-3"
              >
                X.com
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-light hover:opacity-80 transition-opacity flex items-center gap-3"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[680px] mx-auto px-4 pb-32">
        <Newsletter />
      </div>

    </div>
  </div>
);

const ContentListPage = ({ type, title, posts, onNavigate }: { type: string, title?: string, posts: Post[], onNavigate: (p: string) => void }) => {
  const [videoPlaylist, setVideoPlaylist] = useState<string>('');
  const [videoPosts, setVideoPosts] = useState<Post[]>([]);
  const [videoPlaylists, setVideoPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Load video playlists on mount
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

  const filteredPosts = posts.filter(p => p.type === type || type === 'all');
  const displayTitle = title || (type === 'all' ? 'Archive' : type.charAt(0).toUpperCase() + type.slice(1));

  // Subcategories for Reflexion
  const subcategories = [
    { id: 'all', name: 'Toutes' },
    { id: 'spiritualite', name: 'Spiritualité' },
    { id: 'entrepreneurial', name: 'Entrepreneurial/MindSet' },
    { id: 'management', name: 'Management' },
    { id: 'education', name: 'Éducation' },
  ];

  // Filter posts by subcategory for Reflexion
  const postsBySubcategory = type === 'model' && selectedSubcategory !== 'all'
    ? posts.filter(p => p.type === 'model' && p.tags?.includes(selectedSubcategory))
    : posts.filter(p => p.type === 'model');

  // Library page with cover images and download links
  if (type === 'ebook') {
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

  // Video page with playlists
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

  // Notes page
  if (type === 'note') {
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

  // Reflexion page with subcategories
  return (
    <div>
      <div className="border-b border-[#6B1A2A]/20 py-6 mb-12">
        <div className="max-w-[680px] mx-auto px-4">
          <h1 className="text-base md:text-lg font-normal text-[#6B1A2A] mb-4">{displayTitle}</h1>
          {type === 'model' && (
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-colors ${selectedSubcategory === sub.id
                    ? 'bg-[#6B1A2A] text-white'
                    : 'bg-[var(--card-bg)] text-[var(--text-color)]/60 hover:text-[#6B1A2A] border border-[var(--border-color)]'
                    }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-[680px] mx-auto px-4 pb-20">
        <div className="space-y-16">
          {type === 'model' ? (
            postsBySubcategory.length > 0 ? (
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
            )
          ) : filteredPosts.length > 0 ? (
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

const PostPage = ({ slug }: { slug: string }) => {
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

  if (loading) return <div className="py-20 text-center font-light text-[var(--text-color)]/40">Chargement...</div>;
  if (!post) return <div className="py-20 text-center font-light text-[var(--text-color)]/40">Contenu non trouvé.</div>;

  return (
    <article className="max-w-[680px] mx-auto px-4 py-20">
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
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      onRefresh();
    }
  };

  return (
    <div className="max-w-[680px] mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-16">
        <h1 className="text-4xl font-light text-[#6B1A2A]">Dashboard</h1>
        <button
          onClick={() => onNavigate('admin/new')}
          className="flex items-center gap-2 bg-[#6B1A2A] text-white px-4 py-2 text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Content
        </button>
      </div>

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
    </div>
  );
};

const AdminEditorPage = ({ slug, onNavigate, onRefresh }: { slug?: string, onNavigate: (p: string) => void, onRefresh: () => void }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<string>('blog');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(!!slug);

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
          setLoading(false);
        });
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slugified = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const data = { title, slug: slugified, type, content, status, tags };

    const url = slug ? `/api/posts/${slug}` : '/api/posts';
    const method = slug ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      onRefresh();
      onNavigate('admin');
    }
  };

  if (loading) return <div className="py-20 text-center text-[var(--text-color)]/40">Loading...</div>;

  return (
    <div className="max-w-[680px] mx-auto px-4 py-20">
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
            <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
            >
              <option value="blog">Blog Post</option>
              <option value="note">Note</option>
              <option value="model">Mental Model</option>
              <option value="ebook">Ebook</option>
              <option value="quote">Quote</option>
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

        <div className="space-y-2">
          <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm uppercase tracking-widest text-[var(--text-color)]/40">Content</label>
          <Editor content={content} onChange={setContent} />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="px-6 py-2 text-base font-light text-[var(--text-color)] hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#6B1A2A] text-white px-8 py-2 text-base hover:opacity-90 transition-colors"
          >
            Save Content
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
  const [currentPage, setCurrentPage] = useState('home');
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setCurrentPage('home');
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const renderPage = () => {
    if (currentPage === 'home') return <HomePage onNavigate={setCurrentPage} posts={posts.filter(p => p.status === 'published')} />;

    // Reflexion page with subcategories
    if (currentPage === 'reflexion') return <ContentListPage type="model" title="Réflexions" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion/spiritualite') return <ContentListPage type="model" title="Spiritualité" posts={posts.filter(p => p.status === 'published' && p.tags?.includes('spiritualite'))} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion/entrepreneurial') return <ContentListPage type="model" title="Entrepreneurial/MindSet" posts={posts.filter(p => p.status === 'published' && p.tags?.includes('entrepreneurial'))} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion/management') return <ContentListPage type="model" title="Management" posts={posts.filter(p => p.status === 'published' && p.tags?.includes('management'))} onNavigate={setCurrentPage} />;
    if (currentPage === 'reflexion/education') return <ContentListPage type="model" title="Éducation" posts={posts.filter(p => p.status === 'published' && p.tags?.includes('education'))} onNavigate={setCurrentPage} />;

    // Video page
    if (currentPage === 'video') return <ContentListPage type="video" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;

    // Notes page
    if (currentPage === 'notes') return <ContentListPage type="note" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;

    // Library page
    if (currentPage === 'library') return <ContentListPage type="ebook" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;

    if (currentPage.startsWith('post/')) {
      const slug = currentPage.split('/')[1];
      return <PostPage slug={slug} />;
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

      <main className="min-h-[calc(100vh-200px)]">
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
