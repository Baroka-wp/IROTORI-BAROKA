'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`w-full ${heightClass} relative overflow-hidden`}>

      {/* Skeleton shimmer — visible tant que l'image n'est pas chargée */}
      <div
        className={`absolute inset-0 hero-skeleton transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Image principale — next/image génère WebP + srcSet + cache 1 an */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        onLoad={() => setLoaded(true)}
        className={`object-cover grayscale brightness-[0.4] contrast-125 scale-105 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Gradient de bas de page */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-color)]" />

      {/* Contenu centré — apparaît après l'image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
