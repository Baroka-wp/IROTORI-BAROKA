import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Types de contenu
export type ReflexionTag = "spiritualite" | "entrepreneurial" | "management" | "education";
export type VideoTag = "philosophie" | "spiritualite" | "mindset";
export type ContentStatus = "draft" | "published";
export type ProjectStatus = "in_progress" | "completed" | "archived";
export type ProjectCategory = "tech" | "business" | "social" | "education" | "other";

// Réflexion
export interface Reflexion {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags?: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Vidéo
export interface Video {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  playlist?: string;
  tags?: string;
  resume?: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// E-book
export interface Ebook {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  coverImage?: string;
  downloadUrl?: string;
  price: number; // en FCFA (0 = gratuit)
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Projet
export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  longDescription?: string;
  coverImage?: string;
  websiteUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  technologies?: string;
  category?: ProjectCategory;
  teamMembers?: string;
  partners?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Helper pour le statut d'un projet
export function getProjectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'in_progress': return 'En cours';
    case 'completed': return 'Terminé';
    case 'archived': return 'Archivé';
    default: return status;
  }
}

// Helper pour la catégorie d'un projet
export function getProjectCategoryLabel(category?: ProjectCategory | string): string {
  if (!category) return 'Autre';
  const labels: Record<string, string> = {
    tech: 'Technologie',
    business: 'Business',
    social: 'Social',
    education: 'Éducation',
    other: 'Autre',
  };
  return labels[category] || category;
}
