import React, { useState, useEffect } from 'react';
import Editor from '../../components/Editor';

interface AdminEditorPageProps {
  slug?: string;
  onNavigate: (page: string) => void;
  onRefresh: () => void;
}

export const AdminEditorPage: React.FC<AdminEditorPageProps> = ({ slug, onNavigate, onRefresh }) => {
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
