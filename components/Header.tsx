'use client';

import { Activity, Cpu, Sun } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useOrb } from '@/components/orb/OrbContext';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Dynamically import StatusOrb to avoid SSR issues with R3F
const StatusOrb = dynamic(() => import('@/components/orb/StatusOrb'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/50 animate-pulse" />
});

export default function Header() {
  const { status, errorCount } = useOrb();
  const [shake, setShake] = useState(0);

  const handleLightClick = () => {
      setShake(prev => prev + 1);
  };

  const dotColor = {
      stable: 'bg-cyan-400',
      warning: 'bg-orange-400',
      critical: 'bg-red-500'
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-start justify-between p-6 sm:p-8 z-30 pointer-events-none font-mono text-xs">

      {/* Left: Orb + Identity & Mission */}
      <div className="flex items-start gap-4 mt-8 ml-4 sm:mt-12 sm:ml-12 pointer-events-auto">
        {/* Orb Container */}
        <div className="w-24 h-24 flex-shrink-0 relative">
           <StatusOrb />
        </div>

        {/* Identity Panel */}
        <div className="flex flex-col gap-4 backdrop-blur-[2px] rounded-lg p-4 bg-black/10 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] max-w-sm">

            {/* Identity */}
            <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Identity</span>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                    ROOCKYdev
                </h1>
            </div>

            {/* Status */}
            <div className="flex flex-col">
                 <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Status</span>
                 <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor[status]} ${status === 'critical' ? 'animate-pulse' : ''} shadow-[0_0_8px_currentColor]`} />
                    <span className="text-white/90 font-medium">Building Digital Ecosystems</span>
                 </div>
            </div>

            {/* Mission */}
            <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Mission</span>
                <span className="text-cyan-400/90 font-medium">Scholarship Candidate (NL/DE/CN)</span>
            </div>
        </div>
      </div>

      {/* Right: Technical Metrics (Kept minimal) */}
          <div className="flex flex-col items-end gap-4 pointer-events-auto text-[10px] text-white/30 hidden sm:flex">

             {/* The Forbidden Light Switch */}
             <motion.button
                onClick={handleLightClick}
                animate={{ x: shake % 2 === 0 ? [0, -5, 5, -5, 5, 0] : [0, 5, -5, 5, -5, 0] }}
                key={shake} // Re-trigger animation on click
                transition={{ duration: 0.4 }}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-colors group relative"
                aria-label="Toggle Light Mode"
             >
                <Sun size={16} />
             </motion.button>

             <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-1.5">
                    <Cpu size={10} />
                    <span>Next.js 15 / R3F / Tailwind</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Activity size={10} />
                    <span>Errors: <span className={errorCount > 0 ? "text-red-500" : "text-white/50"}>{errorCount}</span></span>
                 </div>
             </div>
          </div>
        </header>
  );
}
