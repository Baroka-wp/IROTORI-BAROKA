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
  description?: string;
  coverImage?: string;
  downloadUrl?: string;
  price: number; // en centimes (0 = gratuit)
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Note de lecture
export interface Note {
  id: string;
  title: string;
  slug: string;
  content: string;
  bookTitle?: string;
  author?: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Type union pour le routing
export type ContentItem = Reflexion | Video | Ebook | Note;

// Helper pour vérifier le prix
export function formatPrice(priceInCents: number): string {
  if (priceInCents === 0) return "Gratuit";
  return `${(priceInCents / 100).toFixed(2)} €`;
}
