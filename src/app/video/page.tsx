'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContentListPage } from '@/components/pages/ContentList';
import { Video } from '@/lib/utils';

export default function VideoPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch('/api/videos?status=published');
      const data = await res.json();
      setVideos(data.data || []);
    };
    fetchVideos();

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

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

  return (
    <div className="min-h-screen">
      <Navbar user={null} theme={theme} onToggleTheme={toggleTheme} onNavigate={navigate} />
      <main className="min-h-[calc(100vh-200px)]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <ContentListPage type="video" title="Webinaire" items={videos} onNavigate={navigate} />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
