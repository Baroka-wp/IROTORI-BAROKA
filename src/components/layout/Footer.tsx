import React from 'react';

export const Footer: React.FC = () => (
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
