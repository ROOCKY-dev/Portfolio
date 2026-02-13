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
    warning: 'WORKING',
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
        {/* Background Orb - Floating in Top-Left */}
        <div className="fixed top-0 left-0 w-[400px] h-[400px] z-0 pointer-events-none -translate-x-1/4 -translate-y-1/4 opacity-80 mix-blend-screen">
            <StatusOrb />
        </div>

        <header className="fixed top-0 left-0 w-full flex items-start justify-between p-6 sm:p-8 z-30 pointer-events-none font-mono text-xs">

          {/* Left: Console Overlay (Floating over Orb) */}
          <div className="flex flex-col gap-2 mt-8 ml-8 sm:mt-12 sm:ml-12 pointer-events-auto backdrop-blur-[2px] rounded-lg p-2 bg-black/20 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full inline-block shadow-[0_0_8px_currentColor] ${dotColor[status]} ${status === 'critical' ? 'animate-pulse' : ''}`} />
                <span className={`${statusColor[status]} font-bold tracking-widest text-sm transition-colors duration-1000`}>
                    {statusText[status]}
                </span>
            </div>

            <div className="text-[10px] text-white/50 uppercase tracking-wider flex flex-col gap-0.5">
                <span>System: Online</span>
                <span>Latency: 12ms</span>
            </div>
          </div>

          {/* Right: User Console Details */}
          <div className="flex flex-col items-end gap-4 pointer-events-auto">
             <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-white/70">
                    <Terminal size={12} className="text-cyan-400" />
                    <span className="font-bold tracking-wide text-white">$ whoami</span>
                </div>
                <span className="text-white/90 font-bold text-sm">ROOCKYdev</span>
             </div>

             <div className="flex flex-col items-end gap-1 text-[10px] text-white/50">
                <div className="flex items-center gap-1.5">
                    <Activity size={10} />
                    <span>$ cat status.txt</span>
                    <span className="text-cyan-400 font-mono animate-pulse ml-1">
                        {status === 'critical' ? '"PANIC!"' : status === 'warning' ? '"Compiling..."' : '"Ready"'}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <AlertTriangle size={10} />
                    <span>Errors:</span>
                    <span className={`font-bold transition-all duration-300 ${errorCount > 0 ? 'text-red-500 scale-110' : 'text-white'}`}>
                        {errorCount}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Cpu size={10} />
                    <span>Task: Portfolio_V2</span>
                </div>
            </div>
          </div>
        </header>
    </>
  );
}
