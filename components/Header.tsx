'use client';

import { Activity, AlertTriangle, Terminal, Cpu } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useOrb } from '@/components/orb/OrbContext';

// Dynamically import StatusOrb to avoid SSR issues with R3F
const StatusOrb = dynamic(() => import('@/components/orb/StatusOrb'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/50 animate-pulse" />
});

export default function Header() {
  const { status, errorCount } = useOrb();

  const statusText = {
    stable: 'OPERATIONAL',
    warning: 'STRESSED',
    critical: 'CRITICAL FAILURE'
  };

  // Simplified color logic
  const statusColor = {
    stable: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]',
    warning: 'text-orange-400 drop-shadow-[0_0_10px_rgba(255,165,0,0.6)]',
    critical: 'text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]'
  };

  const dotColor = {
      stable: 'bg-cyan-400',
      warning: 'bg-orange-400',
      critical: 'bg-red-500'
  };

  return (
    <>
        {/* Background Orb - Living Heart (3x Larger, Z-index 0) */}
        {/* Positioned deeper in top-left to float behind text */}
        <div className="fixed top-[-10%] left-[-10%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] z-0 pointer-events-none opacity-100 mix-blend-screen">
            <StatusOrb />
        </div>

        <header className="fixed top-0 left-0 w-full flex items-start justify-between p-6 sm:p-8 z-30 pointer-events-none font-mono text-xs">

          {/* Left: Identity & Mission (Overlaying the Orb) */}
          <div className="flex flex-col gap-4 mt-8 ml-4 sm:mt-12 sm:ml-12 pointer-events-auto backdrop-blur-[2px] rounded-lg p-4 bg-black/10 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] max-w-sm">

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

          {/* Right: Technical Metrics (Kept minimal) */}
          <div className="flex flex-col items-end gap-2 pointer-events-auto text-[10px] text-white/30 hidden sm:flex">
             <div className="flex items-center gap-1.5">
                <Cpu size={10} />
                <span>Next.js 15 / R3F / Tailwind</span>
             </div>
             <div className="flex items-center gap-1.5">
                <Activity size={10} />
                <span>Errors: <span className={errorCount > 0 ? "text-red-500" : "text-white/50"}>{errorCount}</span></span>
             </div>
          </div>
        </header>
    </>
  );
}
