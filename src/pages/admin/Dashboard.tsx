import React, { useState, useEffect } from 'react';
import { Sidebar, StatCard, ContentTable } from '../../components/admin/Sidebar';
import { ContentEditor } from '../../components/admin/ContentEditor';
import { LoginPage } from './Login';
import { BarChart3, FileText, Video, Library, Book, Plus, Menu, Target } from 'lucide-react';
import { Reflexion, Video as VideoType, Ebook, Project } from '../../lib/utils';

type ContentType = 'reflexion' | 'video' | 'ebook' | 'project';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // Contenu
  const [reflexions, setReflexions] = useState<Reflexion[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Editor
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorType, setEditorType] = useState<ContentType>('reflexion');
  const [editingSlug, setEditingSlug] = useState<string | undefined>();
  const [editingData, setEditingData] = useState<any>(null);

  const fetchContent = async () => {
    try {
      const [reflexionsRes, videosRes, ebooksRes, projectsRes] = await Promise.all([
        fetch('/api/reflexions').then(r => r.json()),
        fetch('/api/videos').then(r => r.json()),
        fetch('/api/ebooks').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
      ]);

      setReflexions(reflexionsRes.data || []);
      setVideos(videosRes.data || []);
      setEbooks(ebooksRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (data.user) {
        setUser(data.user);
        await fetchContent();
      }
      setAuthLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = () => {
    checkAuth();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setReflexions([]);
    setVideos([]);
    setEbooks([]);
    setProjects([]);
    setCurrentPage('dashboard');
  };

  const handleSave = async (data: any) => {
    const endpoint = `/api/${editorType}s${editingSlug ? `/${editingSlug}` : ''}`;
    const method = editingSlug ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setEditorOpen(false);
      setEditingSlug(undefined);
      setEditingData(null);
      fetchContent();
    } else {
      const error = await res.json();
      alert(`Erreur: ${error.error || 'Erreur inconnue'}`);
    }
  };

  const handleDelete = async (type: ContentType, slug: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return;

    const res = await fetch(`/api/${type}/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      fetchContent();
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  const openEditor = (type: ContentType, slug?: string) => {
    setEditorType(type);
    setEditingSlug(slug);
    setEditingData(null); // ContentEditor will fetch its own data
    setEditorOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#6B1A2A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--text-color)]/40">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Stats
  const stats = {
    reflexions: reflexions.length,
    videos: videos.length,
    ebooks: ebooks.length,
    projects: projects.length,
    published: [
      ...reflexions.filter(r => r.status === 'published'),
      ...videos.filter(v => v.status === 'published'),
      ...ebooks.filter(e => e.status === 'published'),
      ...projects.filter(p => p.status === 'completed'),
    ].length,
  };

  const renderContent = () => {
    if (currentPage === 'dashboard') {
      return (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Réflexions"
              value={stats.reflexions}
              icon={FileText}
              color="bg-blue-500"
            />
            <StatCard
              title="Webinaires"
              value={stats.videos}
              icon={Video}
              color="bg-red-500"
            />
            <StatCard
              title="Livres"
              value={stats.ebooks}
              icon={Library}
              color="bg-green-500"
            />
            <StatCard
              title="Projets"
              value={stats.projects}
              icon={Target}
              color="bg-purple-500"
            />
            <StatCard
              title="Publiés"
              value={stats.published}
              icon={BarChart3}
              trend="+12%"
              color="bg-[#6B1A2A]"
            />
          </div>

          {/* Recent content tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentTable
              title="Dernières réflexions"
              items={reflexions.slice(0, 5)}
              onEdit={(slug) => openEditor('reflexion', slug)}
              onDelete={(slug) => handleDelete('reflexion', slug)}
              columns={['Titre', 'Statut', 'Date']}
            />
            <ContentTable
              title="Dernières vidéos"
              items={videos.slice(0, 5)}
              onEdit={(slug) => openEditor('video', slug)}
              onDelete={(slug) => handleDelete('video', slug)}
              columns={['Titre', 'Statut', 'Date']}
            />
          </div>
        </div>
      );
    }

    if (currentPage === 'reflexions') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-[var(--text-color)]">Réflexions</h2>
            <button
              onClick={() => openEditor('reflexion')}
              className="flex items-center gap-2 bg-[#6B1A2A] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Nouvelle réflexion
            </button>
          </div>
          <ContentTable
            title="Toutes les réflexions"
            items={reflexions}
            onEdit={(slug) => openEditor('reflexion', slug)}
            onDelete={(slug) => handleDelete('reflexion', slug)}
            columns={['Titre', 'Statut', 'Date']}
          />
        </div>
      );
    }

    if (currentPage === 'videos') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-[var(--text-color)]">Vidéos</h2>
            <button
              onClick={() => openEditor('video')}
              className="flex items-center gap-2 bg-[#6B1A2A] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Nouvelle vidéo
            </button>
          </div>
          <ContentTable
            title="Toutes les vidéos"
            items={videos}
            onEdit={(slug) => openEditor('video', slug)}
            onDelete={(slug) => handleDelete('video', slug)}
            columns={['Titre', 'Statut', 'Date']}
          />
        </div>
      );
    }

    if (currentPage === 'ebooks') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-[var(--text-color)]">Livres</h2>
            <button
              onClick={() => openEditor('ebook')}
              className="flex items-center gap-2 bg-[#6B1A2A] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Nouveau livre
            </button>
          </div>
          <ContentTable
            title="Tous les livres"
            items={ebooks}
            onEdit={(slug) => openEditor('ebook', slug)}
            onDelete={(slug) => handleDelete('ebook', slug)}
            columns={['Titre', 'Statut', 'Date']}
          />
        </div>
      );
    }

    if (currentPage === 'projects') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-[var(--text-color)]">Projets</h2>
            <button
              onClick={() => openEditor('project')}
              className="flex items-center gap-2 bg-[#6B1A2A] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Nouveau projet
            </button>
          </div>
          <ContentTable
            title="Tous les projets"
            items={projects}
            onEdit={(slug) => openEditor('project', slug)}
            onDelete={(slug) => handleDelete('project', slug)}
            columns={['Titre', 'Statut', 'Date']}
          />
        </div>
      );
    }

    return <div className="text-[var(--text-color)]/40">Page en construction</div>;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        userEmail={user?.email}
      />

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-[var(--text-color)]"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-[var(--text-color)]/60 hidden md:block">
              {user?.email}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Editor modal */}
      {editorOpen && (
        <ContentEditor
          type={editorType}
          slug={editingSlug}
          initialData={editingData}
          onSave={handleSave}
          onCancel={() => {
            setEditorOpen(false);
            setEditingSlug(undefined);
            setEditingData(null);
          }}
        />
      )}
    </div>
  );
}
