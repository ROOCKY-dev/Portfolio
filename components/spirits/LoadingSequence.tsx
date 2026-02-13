'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spirit from './Spirit';

export default function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  const letters = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];
  // We use stages to control animation variants
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Start (0s) -> Enter animation runs automatically on mount

    // 2. Trigger Exit after they have arrived and paused (e.g., 3.5s total time)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3500);

    // 3. Complete after exit animation finishes (e.g., +2s)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex gap-2 sm:gap-4 relative h-32 items-end pb-8">
        <AnimatePresence>
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            // Use viewport units for SSR safety
            initial={{ x: '-100vw' }}
            animate={{
              x: isExiting ? '100vw' : 0,
            }}
            transition={{
              duration: 2.5,
              ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth landing
              delay: index * 0.1 // Staggered entry
            }}
          >
            <div className="flex flex-col items-center gap-2">
                <span className="text-white text-xs font-bold font-mono block mb-1">{letter}</span>
                <Spirit
                  color={index % 2 === 0 ? '#00ffff' : '#00ff88'}
                  // Offset the bounce animation so they wave
                  delay={index * 0.1}
                  size={20}
                />
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-cyan-500 box-shadow-[0_0_10px_currentColor]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 4.5, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}
