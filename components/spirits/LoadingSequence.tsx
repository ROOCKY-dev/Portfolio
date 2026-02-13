'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spirit from './Spirit';

export default function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  const letters = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];
  const [stage, setStage] = useState<'entering' | 'cheering' | 'igniting'>('entering');

  useEffect(() => {
    // Stage 1: Entering (0s - 2.5s) handled by layout animation

    // Stage 2: Cheer (2.5s)
    const cheerTimer = setTimeout(() => {
        setStage('cheering');
    }, 2800); // Give them a moment to arrive and settle

    // Stage 3: Ignite (4.3s)
    const igniteTimer = setTimeout(() => {
        setStage('igniting');
    }, 4300);

    // Stage 4: Complete (5.0s) - allows white flash to max out
    const completeTimer = setTimeout(() => {
        onComplete();
    }, 5000);

    return () => {
        clearTimeout(cheerTimer);
        clearTimeout(igniteTimer);
        clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
        exit={{ opacity: 0 }} // Fade out the white screen to reveal app
        transition={{ duration: 1.5, ease: "easeInOut" }}
    >
        {/* Minions Container */}
        <div className="flex items-end gap-1 sm:gap-2 md:gap-4 relative z-10 pb-10">
            {letters.map((letter, i) => (
                <MinionItem
                    key={i}
                    letter={letter}
                    index={i}
                    stage={stage}
                />
            ))}
        </div>

        {/* Ignition Flash Overlay */}
        <motion.div
            className="absolute inset-0 bg-white z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'igniting' ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
        />

        {/* Loading Bar (Optional context) */}
        <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/10 rounded-full overflow-hidden z-0"
            animate={{ opacity: stage === 'igniting' ? 0 : 1 }}
        >
             <motion.div
                className="h-full bg-green-500 shadow-[0_0_10px_#00ff00]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
             />
        </motion.div>
    </motion.div>
  );
}

function MinionItem({ letter, index, stage }: { letter: string, index: number, stage: string }) {
    // Calculate delays for staggered walking start?
    // Or just all walk together.
    // "Enter Stage Left" implies they might come in a line.

    const isCheering = stage === 'cheering' || stage === 'igniting';

    return (
        <motion.div
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{
                duration: 2.5,
                ease: "circOut", // Slow down as they arrive
                delay: index * 0.15 // Staggered arrival
            }}
            className="relative"
        >
            <Spirit
                mood="working" // Green for "building"
                behavior={isCheering ? 'cheer' : 'carry'}
                carrying={
                    <span className="text-xl sm:text-2xl font-black tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                        {letter}
                    </span>
                }
                size={24}
                delay={index * 0.1} // Staggered animation cycles
            />
        </motion.div>
    );
}
