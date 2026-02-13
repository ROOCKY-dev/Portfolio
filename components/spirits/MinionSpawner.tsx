'use client';

import { useMinions } from './MinionContext';
import { AnimatePresence, motion } from 'framer-motion';
import Spirit from './Spirit';
import { useState, useEffect } from 'react';

export default function MinionSpawner() {
  const { minions } = useMinions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small timeout to defer state update
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence mode="popLayout">
            {minions.map(minion => (
                <motion.div
                    key={minion.id}
                    initial={{ opacity: 0, scale: 0, x: minion.x, y: minion.y }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: minion.x,
                        y: minion.y,
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0,
                        transition: { duration: 0.3 }
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="absolute top-0 left-0"
                >
                    <Spirit
                        mood={minion.mood}
                        behavior={minion.behavior}
                        size={24}
                        tooltip={minion.tooltip}
                    />
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
  );
}
