'use client';

import Header from '@/components/Header';
import Body from '@/components/Body';
import LightManager from '@/components/LightManager';
import { OrbProvider } from '@/components/orb/OrbContext';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const OrbControls = dynamic(() => import('@/components/orb/OrbControls'), { ssr: false });

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <OrbProvider>
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative">

          {/* Main Content */}
          <LightManager />
          <Header />
          <Body />
          <OrbControls />
        </div>
    </OrbProvider>
  );
}
