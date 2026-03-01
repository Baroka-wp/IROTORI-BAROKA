'use client';

import React from 'react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  imageSrc: string;
  imageAlt: string;
  /** Tailwind height classes. Default: 'h-[40vh] md:h-[50vh]' */
  heightClass?: string;
  children: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  imageSrc,
  imageAlt,
  heightClass = 'h-[40vh] md:h-[50vh]',
  children,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5 }}
    className={`w-full ${heightClass} relative overflow-hidden`}
  >
    <img
      src={imageSrc}
      alt={imageAlt}
      className="w-full h-full object-cover grayscale brightness-[0.4] contrast-125 scale-105"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-color)]" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="space-y-6 max-w-4xl"
      >
        {children}
      </motion.div>
    </div>
  </motion.div>
);
