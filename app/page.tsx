'use client';

import Header from '@/components/Header';
import Body from '@/components/Body';
import LightManager from '@/components/LightManager';
import { OrbProvider } from '@/components/orb/OrbContext';
// import { MinionProvider } from '@/components/spirits/MinionContext';
// import MinionSpawner from '@/components/spirits/MinionSpawner';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const OrbControls = dynamic(() => import('@/components/orb/OrbControls'), { ssr: false });
// const LoadingSequence = dynamic(() => import('@/components/spirits/LoadingSequence'), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent scroll during loading
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Simulating load complete since we removed the LoadingSequence for now
    const loadTimer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(loadTimer);
  }, [isLoading]);

  if (!isMounted) return null; // Avoid hydration mismatch for client-heavy app

  return (
    <OrbProvider>
      {/* <MinionProvider> */}
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative">
          <AnimatePresence mode='wait'>
            {isLoading && (
               // <LoadingSequence key="loader" onComplete={() => setIsLoading(false)} />
               <div key="simple-loader" className="fixed inset-0 bg-black z-50 flex items-center justify-center text-white/20 font-mono text-xs animate-pulse">
                   INITIALIZING...
               </div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          {/* <MinionSpawner /> */}
          <LightManager />
          <Header />
          <Body />
          <OrbControls />
        </div>
      {/* </MinionProvider> */}
    </OrbProvider>
  );
}
