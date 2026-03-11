'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';

interface PrivateGroupCTAProps {
  contentType?: 'reflexion' | 'video' | 'ebook';
  relatedTitle?: string;
}

const messages: Record<string, { headline: string; subtext: string }> = {
  reflexion: {
    headline: 'Cette réflexion vous parle ?',
    subtext: 'Rejoignez mon groupe privé — un espace de clarté mentale, de ressources exclusives et d\'échanges profonds.',
  },
  video: {
    headline: 'Aller plus loin ensemble',
    subtext: 'Mon groupe privé donne accès à des sessions exclusives, du contenu avancé et une communauté engagée.',
  },
  ebook: {
    headline: 'Ce livre n\'est qu\'un début',
    subtext: 'Dans mon groupe privé, je partage des ressources avancées, des guides et des échanges directs.',
  },
};

export const PrivateGroupCTA: React.FC<PrivateGroupCTAProps> = ({
  contentType = 'reflexion',
}) => {
  const [dismissed, setDismissed] = useState(false);
  const { headline, subtext } = messages[contentType] || messages.reflexion;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mt-20 border border-[#6B1A2A]/20 bg-[var(--card-bg)] rounded-lg p-8 md:p-10"
        >
          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fermer"
            className="absolute top-4 right-4 text-[var(--text-color)]/20 hover:text-[var(--text-color)]/50 transition-colors"
          >
            <X size={16} />
          </button>

          {/* Accent line */}
          <div className="w-8 h-px bg-[#6B1A2A] mb-6" />

          <p className="text-xs uppercase tracking-widest text-[var(--brand-text)] mb-3 font-light">
            Groupe Privé
          </p>
          <h3 className="text-2xl md:text-3xl font-light text-[var(--text-color)] mb-4 leading-snug">
            {headline}
          </h3>
          <p className="text-base text-[var(--text-color)]/70 font-light leading-relaxed mb-8 max-w-[480px]">
            {subtext}
          </p>

          <a
            href="https://chat.whatsapp.com/VOTRE_LIEN_GROUPE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#6B1A2A] text-white px-7 py-3.5 rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all duration-150"
          >
            Rejoindre le groupe
            <ArrowRight size={16} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
