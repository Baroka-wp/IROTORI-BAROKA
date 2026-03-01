import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProjectsGrid } from '@/components/pages/ProjectsGrid';
import { getCurrentUser } from '@/lib/auth';
import { getPublishedProjects } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Projets — IROTORI BAROKA',
  description: 'Ce sur quoi je travaille actuellement.',
};

export default async function ProjetsPage() {
  const [user, projects] = await Promise.all([
    getCurrentUser(),
    getPublishedProjects(),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-200px)]">
        <ProjectsGrid projects={projects} />
      </main>
      <Footer />
    </div>
  );
}
