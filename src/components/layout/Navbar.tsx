import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, Settings } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
}

interface NavbarProps {
  user: any;
  theme: string;
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
}

const navItems: NavItem[] = [
  { name: 'Réflexions', path: 'reflexion' },
  { name: 'Webinaire', path: 'video' },
  { name: 'Livres', path: 'library' },
  { name: 'Projets', path: 'projets' },
];

export const Navbar: React.FC<NavbarProps> = ({ user, theme, onToggleTheme, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-[680px] mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="text-[#6B1A2A] font-medium text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          IROTORI BAROKA
        </button>

        {/* Desktop Navigation */}
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

        {/* Mobile Navigation Toggle */}
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

      {/* Mobile Navigation Menu */}
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
