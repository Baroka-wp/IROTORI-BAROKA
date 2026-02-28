import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { formatDate, Post } from '../../lib/utils';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  posts: Post[];
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, posts, onRefresh }) => {
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
          <div
            key={post.id}
            className="flex items-center justify-between p-4 border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--text-color)]/20 transition-colors"
          >
            <div>
              <h3 className="font-medium text-base text-[var(--text-color)]">{post.title}</h3>
              <p className="text-sm text-[var(--text-color)]/40 font-light">
                {post.type} • {post.status} • {formatDate(post.createdAt)}
              </p>
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
