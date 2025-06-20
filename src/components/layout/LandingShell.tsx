
import type { ReactNode } from 'react';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { LandingFooter } from '@/components/layout/LandingFooter';

interface LandingShellProps {
  children: ReactNode;
}

export function LandingShell({ children }: LandingShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* AnimatedBackgroundCubes component removed */}
      <LandingNavbar />
      <main className="flex-grow container mx-auto px-4">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
