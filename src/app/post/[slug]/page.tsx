'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PostPage } from '@/components/pages/Post';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    params.then(p => {
      setSlug(p.slug);
    });

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, [params]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  if (!slug) return null;

  return (
    <div className="min-h-screen">
      <Navbar user={null} theme={theme} onToggleTheme={toggleTheme} onNavigate={navigate} />
      <main className="min-h-[calc(100vh-200px)]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <PostPage slug={slug} />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
