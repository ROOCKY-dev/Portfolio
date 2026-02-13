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

  const statusColor = {
    stable: 'text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]',
    warning: 'text-green-400 drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]',
    critical: 'text-red-500 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]'
  };

  const dotColor = {
      stable: 'bg-cyan-400',
      warning: 'bg-green-400',
      critical: 'bg-red-500'
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm z-50 border-b border-white/20 font-mono text-xs">
      {/* Left: Orb & System Status */}
      <div className="w-1/3 flex items-center gap-4">
        {/* Orb Container: Rigid 1:1 Square */}
        <div className="w-12 h-12 min-w-[48px] border border-white/40 flex items-center justify-center relative overflow-hidden bg-black/50">
          <StatusOrb />
          <span className="absolute bottom-0.5 right-0.5 text-[6px] tracking-widest text-white/20 pointer-events-none">SYS</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-white/50 uppercase tracking-wider">System Status</span>
          <span className={`${statusColor[status]} font-bold flex items-center gap-1 transition-colors duration-500`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block shadow-[0_0_5px_currentColor]
              ${dotColor[status]}
              ${status === 'critical' ? 'animate-pulse' : ''}`}
            />
            {statusText[status]}
          </span>
        </div>
      </div>

      {/* Right: Console Details */}
      <div className="w-2/3 flex justify-end items-center gap-8 md:gap-12 text-[10px] text-white/70">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 mb-0.5 opacity-50">
            <Terminal size={10} />
            <span>$ whoami</span>
          </div>
          <span className="text-white font-bold tracking-wide">ROOCKYdev</span>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-1.5 mb-0.5 opacity-50">
            <Activity size={10} />
            <span>$ cat status.txt</span>
          </div>
          <span className="text-cyan-400 font-mono animate-pulse">
             {status === 'critical' ? '"PANIC!"' : status === 'warning' ? '"Fixing Bugs..."' : '"Compiling..."'}
          </span>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-1.5 mb-0.5 opacity-50">
            <AlertTriangle size={10} />
            <span>Error Count</span>
          </div>
          <span className={`font-bold transition-all duration-300 ${errorCount > 0 ? 'text-red-500 scale-110' : 'text-white'}`}>
            {errorCount}
          </span>
        </div>

        <div className="hidden lg:flex flex-col items-end">
          <div className="flex items-center gap-1.5 mb-0.5 opacity-50">
            <Cpu size={10} />
            <span>Task</span>
          </div>
          <span className="text-white">Portfolio_V1</span>
        </div>
      </div>
    </header>
  );
}
