import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const CTAButton: React.FC<CTAButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  const baseClasses = "inline-flex items-center gap-4 px-10 py-4 font-medium transition-all text-xl group";
  
  const variantClasses = {
    primary: "bg-[#6B1A2A] text-white hover:opacity-90 transition-opacity",
    secondary: "bg-white text-[var(--brand-text)] hover:gap-8",
    outline: "border border-[#6B1A2A] text-[var(--brand-text)] hover:bg-[#6B1A2A] hover:text-white",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      {label} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
    </button>
  );
};

interface SocialLinkProps {
  name: string;
  url: string;
}

export const SocialLink: React.FC<SocialLinkProps> = ({ name, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-2xl font-light hover:opacity-80 transition-opacity"
  >
    {name}
  </a>
);

interface SectionTitleProps {
  children: React.ReactNode;
  variant?: 'large' | 'medium' | 'small';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, variant = 'large' }) => {
  const variantClasses = {
    large: "text-5xl md:text-6xl font-light text-[var(--brand-text)] leading-[0.9] tracking-tighter",
    medium: "text-3xl md:text-4xl font-light",
    small: "text-xl uppercase tracking-widest opacity-60",
  };

  return (
    <h2 className={variantClasses[variant]}>
      {children}
    </h2>
  );
};
