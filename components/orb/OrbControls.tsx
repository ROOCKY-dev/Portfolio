'use client';

import { useOrb } from './OrbContext';
import { Settings, X } from 'lucide-react';
import { useState } from 'react';

export default function OrbControls() {
  const { errorCount, setErrorCount, status } = useOrb();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end font-mono">
      {isOpen && (
        <div className="bg-black border border-white/20 p-4 rounded-sm w-64 mb-2 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,0,0.1)]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase text-white/80">Dev Controls</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] uppercase text-white/50 block mb-2 flex justify-between">
                      <span>Error Count</span>
                      <span className="text-white">{errorCount}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        value={errorCount}
                        onChange={(e) => setErrorCount(Number(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    />
                </div>

                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/50 uppercase">System Status</span>
                    <span className={`font-bold uppercase tracking-wider ${
                        status === 'stable' ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]' :
                        status === 'warning' ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(255,165,0,0.5)]' :
                        'text-red-500 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]'
                    }`}>
                        {status}
                    </span>
                </div>
            </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full border transition-all duration-300 ${
            isOpen
            ? 'bg-white text-black border-white rotate-90'
            : 'bg-black/50 text-white/50 border-white/20 hover:text-white hover:border-white hover:bg-white/10'
        }`}
        aria-label="Open Developer Controls"
      >
        <Settings size={20} />
      </button>
    </div>
  );
}
