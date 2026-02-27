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

  const navItems = [
    { name: 'Blog', path: 'blog', icon: FileText },
    { name: 'Notes', path: 'notes', icon: Book },
    { name: 'Models', path: 'models', icon: Brain },
    { name: 'Library', path: 'library', icon: Library },
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
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="text-sm font-light text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors"
            >
              {item.name}
            </button>
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
              <button
                key={item.path}
                onClick={() => { onNavigate(item.path); setIsOpen(false); }}
                className="block w-full text-left text-lg font-light text-[var(--text-color)]"
              >
                {item.name}
              </button>
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
        Exploring mental models, philosophy, and the intersection of technology and humanity.
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

const ContentListPage = ({ type, posts, onNavigate }: { type: string, posts: Post[], onNavigate: (p: string) => void }) => {
  const filteredPosts = posts.filter(p => p.type === type || type === 'all');
  const title = type === 'all' ? 'Archive' : type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="py-20">
      <h1 className="text-5xl font-light mb-16 text-[#6B1A2A]">{title}</h1>
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

  if (loading) return <div className="py-20 text-center font-light text-[var(--text-color)]/40">Reading...</div>;
  if (!post) return <div className="py-20 text-center font-light text-[var(--text-color)]/40">Not found.</div>;

  return (
    <article className="py-20">
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
    <div className="py-20">
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
    if (currentPage === 'blog') return <ContentListPage type="blog" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    if (currentPage === 'notes') return <ContentListPage type="note" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
    if (currentPage === 'models') return <ContentListPage type="model" posts={posts.filter(p => p.status === 'published')} onNavigate={setCurrentPage} />;
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
