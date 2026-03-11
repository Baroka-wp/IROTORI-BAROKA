import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ number, title, description }) => (
  <div className="flex items-start gap-6 p-8 bg-[var(--bg-color)] border border-[var(--border-color)] group hover:border-[#6B1A2A]/30 transition-colors">
    <span className="text-3xl font-light text-[var(--brand-text)]/60 group-hover:text-[var(--brand-text)] transition-colors">{number}</span>
    <div>
      <h3 className="text-2xl font-medium text-[var(--text-color)] mb-2">{title}</h3>
      <p className="text-lg text-[var(--text-color)]/70 font-light">{description}</p>
    </div>
  </div>
);

interface ContentSectionProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaAction: () => void;
  features: FeatureCardProps[];
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  description,
  ctaLabel,
  ctaAction,
  features,
}) => (
  <section className="py-32 border-y border-[var(--border-color)] bg-[var(--card-bg)]/30">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-10">
        <h2 className="text-5xl md:text-6xl font-light text-[var(--brand-text)] leading-[0.9] tracking-tighter">
          {title}
        </h2>
        <p className="text-2xl text-[var(--text-color)]/70 font-light leading-relaxed max-w-[500px]">
          {description}
        </p>
        <button
          onClick={ctaAction}
          className="inline-flex items-center gap-4 bg-[#6B1A2A] text-white px-10 py-4 font-medium hover:opacity-90 transition-opacity text-xl group"
        >
          {ctaLabel} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  </section>
);
