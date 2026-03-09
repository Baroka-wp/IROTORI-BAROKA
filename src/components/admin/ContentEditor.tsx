import React, { useState, useEffect } from 'react';
import Editor from '../../components/Editor';
import ZenEditor from '../../components/ZenEditor';
import { X } from 'lucide-react';

interface ContentEditorProps {
  type: 'reflexion' | 'video' | 'ebook' | 'project';
  slug?: string;
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  type,
  slug,
  initialData,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState<string[]>([]);
  const [newPlaylist, setNewPlaylist] = useState('');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    shortDescription: '',
    description: '',
    content: '',
    resume: '',
    longDescription: '',
    tags: '',
    thumbnail: '',
    videoUrl: '',
    playlist: '',
    coverImage: '',
    downloadUrl: '',
    websiteUrl: '',
    githubUrl: '',
    demoUrl: '',
    price: 0,
    bookTitle: '',
    author: '',
    technologies: '',
    category: '',
    teamMembers: '',
    partners: '',
    status: 'draft',
  });

  // Fetch data if slug is provided
  useEffect(() => {
    if (slug) {
      const endpoint = `/api/${type}s/${slug}`;
      fetch(endpoint)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(data => {
          console.log('Fetched data for editing:', data);
          setFormData((prev) => ({
            ...prev,
            title: data.title || '',
            slug: data.slug || '',
            content: data.content || '',
            description: data.description || '',
            resume: data.resume || '',
            subtitle: data.subtitle || '',
            tags: data.tags || '',
            thumbnail: data.thumbnail || '',
            videoUrl: data.videoUrl || '',
            playlist: data.playlist || '',
            coverImage: data.coverImage || '',
            downloadUrl: data.downloadUrl || '',
            bookTitle: data.bookTitle || '',
            author: data.author || '',
            price: data.price || 0,
            status: data.status || 'draft',
          }));
        })
        .catch(err => {
          console.error('Error fetching data:', err);
        });
    }
  }, [slug, type]);

  // Fetch existing playlists for videos
  useEffect(() => {
    if (type === 'video') {
      fetch('/api/videos?status=published')
        .then(res => res.json())
        .then(data => {
          const uniquePlaylists = Array.from(
            new Set((data.data || []).map((v: any) => v.playlist).filter(Boolean))
          ) as string[];
          setPlaylists(uniquePlaylists);
        })
        .catch(err => console.error('Error fetching playlists:', err));
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data based on type
    const dataToSend: any = {
      title: formData.title,
      slug: formData.slug,
      status: formData.status,
    };

    // Add type-specific fields
    if (type === 'reflexion') {
      dataToSend.content = formData.content;
      dataToSend.tags = formData.tags;
    } else if (type === 'video') {
      dataToSend.description = formData.description;
      dataToSend.thumbnail = formData.thumbnail;
      dataToSend.videoUrl = formData.videoUrl;
      dataToSend.playlist = formData.playlist;
      dataToSend.tags = formData.tags;
      dataToSend.resume = formData.resume;
    } else if (type === 'ebook') {
      dataToSend.subtitle = formData.subtitle;
      dataToSend.shortDescription = formData.shortDescription;
      dataToSend.description = formData.description;
      dataToSend.coverImage = formData.coverImage;
      dataToSend.downloadUrl = formData.downloadUrl;
      dataToSend.price = formData.price;
    } else if (type === 'project') {
      dataToSend.description = formData.description;
      dataToSend.longDescription = formData.longDescription;
      dataToSend.coverImage = formData.coverImage;
      dataToSend.websiteUrl = formData.websiteUrl;
      dataToSend.githubUrl = formData.githubUrl;
      dataToSend.demoUrl = formData.demoUrl;
      dataToSend.status = formData.status;
      dataToSend.technologies = formData.technologies;
      dataToSend.category = formData.category;
      dataToSend.teamMembers = formData.teamMembers;
      dataToSend.partners = formData.partners;
    } else if (type === 'note') {
      dataToSend.content = formData.content;
      dataToSend.bookTitle = formData.bookTitle;
      dataToSend.author = formData.author;
    }

    try {
      await onSave(dataToSend);
    } catch (error) {
      console.error('Error saving:', error);
    }
    setLoading(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Auto-generate slug from title
    if (field === 'title' && !slug) {
      const slugified = value
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setFormData((prev) => ({ ...prev, slug: slugified }));
    }
  };

  const reflexionTags = ['spiritualite', 'entrepreneurial', 'management', 'education'];
  const videoTags = ['philosophie', 'spiritualite', 'mindset'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--bg-color)]">
            <h2 className="text-2xl font-medium text-[#6B1A2A]">
              {slug ? 'Modifier' : 'Créer'} {type === 'reflexion' ? 'Réflexion' : type === 'video' ? 'Vidéo' : type === 'ebook' ? 'E-book' : 'Note'}
            </h2>
            <button onClick={onCancel} className="text-[var(--text-color)]/60 hover:text-[var(--text-color)]">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Common fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                  placeholder="Titre du contenu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                  placeholder="mon-contenu"
                />
              </div>

              {/* Type-specific fields */}
              {type === 'ebook' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => updateField('subtitle', e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      placeholder="Sous-titre du livre"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        Prix (en FCFA)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                        placeholder="0"
                      />
                      <p className="text-xs text-[var(--text-color)]/40 mt-1">
                        {formData.price === 0 ? 'Gratuit' : `${formData.price} FCFA`}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        Lien de téléchargement
                      </label>
                      <input
                        type="url"
                        value={formData.downloadUrl}
                        onChange={(e) => updateField('downloadUrl', e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      URL de la couverture
                    </label>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => updateField('coverImage', e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      Description courte
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => updateField('shortDescription', e.target.value)}
                      rows={2}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      placeholder="Description courte pour la liste..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      Description détaillée
                    </label>
                    <Editor
                      content={formData.description}
                      onChange={(content) => updateField('description', content)}
                    />
                  </div>
                </>
              )}

              {type === 'project' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      Description courte
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={3}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      placeholder="Description courte du projet..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      Description détaillée
                    </label>
                    <Editor
                      content={formData.longDescription}
                      onChange={(content) => updateField('longDescription', content)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => updateField('websiteUrl', e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => updateField('githubUrl', e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        Lien de démo
                      </label>
                      <input
                        type="url"
                        value={formData.demoUrl}
                        onChange={(e) => updateField('demoUrl', e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        URL de la couverture
                      </label>
                      <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => updateField('coverImage', e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        Technologies
                      </label>
                      <input
                        type="text"
                        value={formData.technologies}
                        onChange={(e) => updateField('technologies', e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                        placeholder="React, Node.js, TypeScript..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        Catégorie
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => updateField('category', e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      >
                        <option value="">Sélectionner</option>
                        <option value="tech">Technologie</option>
                        <option value="business">Business</option>
                        <option value="social">Social</option>
                        <option value="education">Éducation</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      Membres de l'équipe
                    </label>
                    <input
                      type="text"
                      value={formData.teamMembers}
                      onChange={(e) => updateField('teamMembers', e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      placeholder="Jean Dupont, Marie Martin..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      Partenaires
                    </label>
                    <input
                      type="text"
                      value={formData.partners}
                      onChange={(e) => updateField('partners', e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      placeholder="Entreprise A, Organisation B..."
                    />
                  </div>
                </>
              )}

              {type === 'video' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        Playlist / Catégorie
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={showNewPlaylist ? '' : formData.playlist}
                          onChange={(e) => {
                            if (e.target.value === '__new__') {
                              setShowNewPlaylist(true);
                              setFormData({ ...formData, playlist: '' });
                            } else {
                              setShowNewPlaylist(false);
                              updateField('playlist', e.target.value);
                            }
                          }}
                          className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                        >
                          <option value="">Sélectionner une playlist</option>
                          {playlists.map((playlist) => (
                            <option key={playlist} value={playlist}>{playlist}</option>
                          ))}
                          <option value="__new__">+ Créer une nouvelle playlist</option>
                        </select>
                      </div>
                      {showNewPlaylist && (
                        <input
                          type="text"
                          value={formData.playlist}
                          onChange={(e) => updateField('playlist', e.target.value)}
                          className="w-full mt-2 bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                          placeholder="Nom de la nouvelle playlist"
                          autoFocus
                        />
                      )}
                      {playlists.length > 0 && !showNewPlaylist && formData.playlist && (
                        <p className="text-xs text-[var(--text-color)]/40 mt-1">
                          Playlist actuelle : {formData.playlist}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                        Tags
                      </label>
                      <select
                        value={formData.tags}
                        onChange={(e) => updateField('tags', e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      >
                        <option value="">Sélectionner</option>
                        {videoTags.map((tag) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      URL de la miniature
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => updateField('thumbnail', e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                      URL de la vidéo (YouTube)
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => updateField('videoUrl', e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </>
              )}

              {(type === 'reflexion' || type === 'video') && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg"
                    placeholder="Description courte..."
                  />
                </div>
              )}

              {type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                    Résumé détaillé
                  </label>
                  <Editor
                    content={formData.resume}
                    onChange={(content) => updateField('resume', content)}
                  />
                </div>
              )}

              {type === 'reflexion' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                    Contenu
                  </label>
                  <ZenEditor
                    content={formData.content}
                    onChange={(content) => updateField('content', content)}
                    placeholder="Commencez par un titre…"
                  />
                </div>
              )}

              {type === 'reflexion' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {reflexionTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const currentTags = formData.tags ? formData.tags.split(',') : [];
                          const newTags = currentTags.includes(tag)
                            ? currentTags.filter((t) => t !== tag)
                            : [...currentTags, tag];
                          updateField('tags', newTags.join(','));
                        }}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          formData.tags?.includes(tag)
                            ? 'bg-[#6B1A2A] text-white'
                            : 'bg-[var(--card-bg)] text-[var(--text-color)]/60 hover:text-[#6B1A2A]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                  Statut
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={(e) => updateField('status', e.target.value)}
                      className="text-[#6B1A2A] focus:ring-[#6B1A2A]"
                    />
                    <span className="text-sm text-[var(--text-color)]">Brouillon</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={(e) => updateField('status', e.target.value)}
                      className="text-[#6B1A2A] focus:ring-[#6B1A2A]"
                    />
                    <span className="text-sm text-[var(--text-color)]">Publié</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-base font-light text-[var(--text-color)] hover:underline"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#6B1A2A] text-white px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity disabled:opacity-50 rounded-lg"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
