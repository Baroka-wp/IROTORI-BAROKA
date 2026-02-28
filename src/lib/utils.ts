import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export type PostType = "blog" | "model" | "ebook" | "note" | "quote" | "video";

export interface Post {
  id: string;
  title: string;
  slug: string;
  type: PostType;
  content: string;
  status: "draft" | "published";
  tags?: string;
  description?: string;
  coverImage?: string;
  downloadUrl?: string;
  videoUrl?: string;
  playlist?: string;
  createdAt: string;
  updatedAt: string;
}
