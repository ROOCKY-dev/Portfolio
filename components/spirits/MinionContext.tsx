'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useOrb } from '@/components/orb/OrbContext';
import { SpiritBehavior, SpiritMood } from './Spirit';

export type Minion = {
  id: string;
  x: number;
  y: number;
  behavior: SpiritBehavior;
  mood: SpiritMood;
  type: 'fixer' | 'defender'; // To distinguish
  tooltip?: string;
};

interface MinionContextType {
  minions: Minion[];
  spawnDefenders: (x: number, y: number) => void;
  clearMinions: () => void;
  mood: SpiritMood;
}

const MinionContext = createContext<MinionContextType | undefined>(undefined);

export function MinionProvider({ children }: { children: ReactNode }) {
  const { errorCount } = useOrb();
  const [minions, setMinions] = useState<Minion[]>([]);

  // Derive Mood
  const mood: SpiritMood = errorCount <= 20 ? 'calm' : errorCount <= 60 ? 'working' : 'panic';

  // Spawn Fixers based on Error Count
  useEffect(() => {
    // 1 minion per 4 errors, max 15
    const targetCount = Math.min(Math.floor(errorCount / 4), 15);

    // Use timeout to avoid "setState in effect" warning and defer update
    const timer = setTimeout(() => {
        setMinions(prev => {
            const currentFixers = prev.filter(m => m.type === 'fixer');
            const defenders = prev.filter(m => m.type === 'defender');

            if (currentFixers.length < targetCount) {
                // Add more fixers
                const needed = targetCount - currentFixers.length;
                const newFixers: Minion[] = [];

                // Safe window access
                const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
                const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

                for(let i=0; i<needed; i++) {
                    newFixers.push({
                        id: Math.random().toString(36).substr(2, 9),
                        x: Math.random() * (winWidth - 50), // Avoid edge
                        y: Math.random() * (winHeight - 50),
                        behavior: 'fixer', // Default behavior for fixers
                        mood: mood,
                        type: 'fixer'
                    });
                }
                return [...defenders, ...currentFixers, ...newFixers];

            } else if (currentFixers.length > targetCount) {
                // Remove excess fixers
                const keptFixers = currentFixers.slice(0, targetCount);
                return [...defenders, ...keptFixers];
            }

            // Update mood for existing fixers if changed
            const updatedFixers = currentFixers.map(m => ({ ...m, mood }));

            // Optimization: If no count change and no mood change (deep check?), avoid update?
            // But map returns new objects.
            // Let's rely on React to handle it.

            return [...defenders, ...updatedFixers];
        });
    }, 0);

    return () => clearTimeout(timer);
  }, [errorCount, mood]);

  const spawnDefenders = useCallback((x: number, y: number) => {
      setMinions(prev => {
          // If defenders already exist, don't spawn more (to avoid spam)
          if (prev.some(m => m.type === 'defender')) return prev;

          const count = 4;
          const radius = 60;
          const newDefenders: Minion[] = [];

          for(let i=0; i<count; i++) {
              const angle = (i / count) * Math.PI * 2;
              newDefenders.push({
                  id: 'def-' + Math.random().toString(36).substr(2, 9),
                  x: x + Math.cos(angle) * radius - 12, // Center adjustment
                  y: y + Math.sin(angle) * radius - 12,
                  behavior: 'blocker',
                  mood: 'panic',
                  type: 'defender',
                  tooltip: 'MY EYES! NO!'
              });
          }

          // Auto remove after 2.5 seconds
          setTimeout(() => {
             setMinions(current => current.filter(m => m.type !== 'defender'));
          }, 2500);

          return [...prev, ...newDefenders];
      });
  }, []);

  const clearMinions = useCallback(() => {
      // Trigger cheer behavior
      setMinions(prev => prev.map(m => ({
          ...m,
          behavior: 'cheer',
          mood: 'calm',
          tooltip: undefined // Clear tooltip if present
      })));
  }, []);

  return (
    <MinionContext.Provider value={{ minions, spawnDefenders, clearMinions, mood }}>
      {children}
    </MinionContext.Provider>
  );
}

export const useMinions = () => {
    const context = useContext(MinionContext);
    if (!context) throw new Error("useMinions must be used within MinionProvider");
    return context;
}
