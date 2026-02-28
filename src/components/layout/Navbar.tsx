import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X, Sun, Moon, Settings } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  hasSubmenu?: boolean;
}

interface SubNavItem {
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
  { name: 'Réflexions', path: 'reflexion', hasSubmenu: true },
  { name: 'Vidéos', path: 'video' },
  { name: 'Notes de lecture', path: 'notes' },
  { name: 'Library', path: 'library' },
];

const reflexionSubItems: SubNavItem[] = [
  { name: 'Spiritualité', path: 'reflexion/spiritualite' },
  { name: 'Entrepreneurial/MindSet', path: 'reflexion/entrepreneurial' },
  { name: 'Management', path: 'reflexion/management' },
  { name: 'Éducation', path: 'reflexion/education' },
];

export const Navbar: React.FC<NavbarProps> = ({ user, theme, onToggleTheme, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reflexionOpen, setReflexionOpen] = useState(false);

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
