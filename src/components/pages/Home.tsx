'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ContentSection } from '../../components/ui/ContentSection';
import { Newsletter } from '../../components/ui/Newsletter';
import { SocialLink } from '../../components/ui/Button';
import { HeroSection } from '../../components/ui/HeroSection';

export const HomePage: React.FC = () => {
  const router = useRouter();

  const reflexionFeatures = [
    { number: "01", title: "Clarifier votre pensée", description: "Identifier les croyances et schémas qui vous limitent" },
    { number: "02", title: "Reprendre le contrôle", description: "Retrouver votre attention et votre capacité d'action" },
    { number: "03", title: "Avancer concrètement", description: "Passer de la réflexion à l'exécution" },
  ];

  const ebookFeatures = [
    { number: "01", title: "Se fixer des objectifs", description: "Définir des objectifs clairs et réalisables" },
    { number: "02", title: "Structurer", description: "Construire un système personnel de principes et d'habitudes pour atteindre ses objectifs" },
    { number: "03", title: "Une mentalité de croissance", description: "Développer une mentalité de croissance pour atteindre ses objectifs" },
    { number: "04", title: "Surmonter les échecs", description: "Identifier les échecs et les surmonter pour atteindre ses objectifs" },
  ];

  const videoFeatures = [
    { number: "01", title: "Philosophie", description: "Clarifier des concepts philosophiques et leurs applications pratiques" },
    { number: "02", title: "Spiritualité", description: "Réflexions sur le sens, la conscience et l'intériorité" },
    { number: "03", title: "MindSet", description: "Développement personnel et reconstruction mentale" },
  ];

  return (
    <div className="space-y-32 pb-32">
      <HeroSection
        imageSrc="/hero.jpg"
        imageAlt="Clarity and Focus"
        heightClass="h-[50vh] md:h-[70vh]"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-[0.3em] font-medium rounded-full mb-4">
          <a
            href="https://fr.wikipedia.org/wiki/Le_Mat"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            Le Mat
          </a>
        </div>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
          IROTORI BAROKA
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light tracking-widest uppercase">
          Why not ?
        </p>
      </HeroSection>

      {/* Introduction Section */}
      <section className="max-w-[680px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10 text-xl text-[var(--text-color)]/70 font-light leading-relaxed"
        >
          <p className="text-3xl font-light text-[var(--text-color)] leading-snug">
            L'inaction est le fruit d'un esprit confus.
          </p>
          <div className="space-y-6 border-l-2 border-[#6B1A2A] pl-8 italic text-2xl">
            <p className="font-medium text-[var(--text-color)] text-3xl tracking-tight">
              La clarté mentale est le point de départ de toute transformation.
            </p>
          </div>
          <div className="space-y-6 pt-4">
            <p className="text-2xl">
              Je vous aide à retrouver la clarté mentale et passer à l'action dans vos projets et votre vie.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Content Sections */}
      <ContentSection
        title="Mes réflexions"
        description="Des principes et structures pour clarifier votre pensée et reprendre le contrôle."
        ctaLabel="Lire les réflexions"
        ctaAction={() => router.push('/reflexion')}
        features={reflexionFeatures}
      />

      <ContentSection
        title="Mon E-book"
        description="Une méthode complète pour sortir de la stagnation et reconstruire votre discipline, étape par étape."
        ctaLabel="Voir le livre"
        ctaAction={() => router.push('/library')}
        features={ebookFeatures}
      />

      <ContentSection
        title="Mes Vidéos"
        description="Des webinaires et formations live sur les thématiques philosophiques, spirituelles et développement personnel."
        ctaLabel="Voir les vidéos"
        ctaAction={() => router.push('/video')}
        features={videoFeatures}
      />

      {/* About & Social Section */}
      <section className="bg-[#6B1A2A] text-white py-0 px-4">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-16">
            <div className="space-y-10">
              <h2 className="text-5xl md:text-7xl font-light leading-[0.9] tracking-tighter">
                Irotori Baroka
              </h2>
              <p className="text-xl uppercase tracking-widest opacity-60">
                Ingénieur | Formateur | Entrepreneur
              </p>
              <p className="text-lg md:text-2xl text-white/90 font-light leading-relaxed">
                J'aime créer des solutions technologiques et rendre les choses complexes plus simples et claires.
              </p>
            </div>

            <div className="pt-12 space-y-6 border-t border-white/20">
              <p className="text-sm uppercase tracking-widest opacity-60">Me suivre</p>
              <div className="flex gap-6">
                <SocialLink name="Facebook" url="https://www.facebook.com/baroka.irotori.5/" />
                <SocialLink name="X.com" url="https://x.com/IrotoriB" />
                <SocialLink name="LinkedIn" url="https://www.linkedin.com/in/baroka/" />
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-[450px] mx-auto md:ml-auto">
            <img
              src="https://res.cloudinary.com/baroka/image/upload/f_webp,q_auto,w_450/v1772299484/PHOTO-2026-01-14-17-25-43-removebg-preview_kuprif.png"
              alt="Irotori Baroka"
              width={450}
              height={600}
              loading="lazy"
              decoding="async"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <div className="max-w-[680px] mx-auto px-4 pb-2">
        <Newsletter />
      </div>
    </div>
  );
};
