import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Book,
  FileText,
  Video,
  Library,
  Plus,
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Users,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  Target
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userEmail?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'reflexions', label: 'Réflexions', icon: FileText },
  { id: 'videos', label: 'Webinaire', icon: Video },
  { id: 'ebooks', label: 'Livres', icon: Library },
  { id: 'projects', label: 'Projets', icon: Target },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose, onLogout, userEmail }) => (
  <>
    {/* Mobile overlay */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
    </AnimatePresence>

    {/* Sidebar */}
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--bg-color)] border-r border-[var(--border-color)] transform transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h1 className="text-lg font-medium text-[#6B1A2A]">Admin</h1>
          <button onClick={onClose} className="md:hidden text-[var(--text-color)]">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || currentPage.startsWith(`${item.id}/`);
            
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#6B1A2A] text-white'
                    : 'text-[var(--text-color)]/70 hover:bg-[var(--card-bg)]'
                }`}
              >
                <Icon size={18} />
                {item.label}
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-[var(--border-color)] space-y-1">
          {userEmail && (
            <div className="px-4 py-3 mb-2 text-xs text-[var(--text-color)]/40 border border-[var(--border-color)] rounded-lg">
              {userEmail}
            </div>
          )}
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-color)]/70 hover:bg-[var(--card-bg)] rounded-lg transition-colors"
          >
            <Home size={18} />
            Voir le site
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  </>
);

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm text-green-500">
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-3xl font-medium text-[var(--text-color)] mb-1">{value}</h3>
    <p className="text-sm text-[var(--text-color)]/60">{title}</p>
  </div>
);

interface ContentTableProps {
  title: string;
  items: any[];
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
  columns: string[];
}

export const ContentTable: React.FC<ContentTableProps> = ({ title, items, onEdit, onDelete, columns }) => (
  <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
      <h3 className="text-lg font-medium text-[var(--text-color)]">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[var(--bg-color)]">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)]/60 uppercase tracking-wider">
                {col}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color)]/60 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {items.length > 0 ? (
            items.map((item: any) => (
              <tr key={item.id} className="hover:bg-[var(--bg-color)]/50 transition-colors">
                <td className="px-6 py-4 text-sm text-[var(--text-color)]">
                  <span className="font-medium">{item.title}</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'published'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {item.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-color)]/60">
                  {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(item.slug)}
                      className="p-2 text-[#6B1A2A] hover:bg-[#6B1A2A]/10 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item.slug)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-[var(--text-color)]/40">
                Aucun contenu pour le moment
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
