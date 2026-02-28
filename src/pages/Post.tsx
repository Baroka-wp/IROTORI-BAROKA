import React, { useState, useEffect } from 'react';
import { formatDate, Post } from '../lib/utils';

interface PostPageProps {
  slug: string;
}

export const PostPage: React.FC<PostPageProps> = ({ slug }) => {
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
