'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { SwitchCamera } from 'lucide-react';
// import { useMinions } from '@/components/spirits/MinionContext';

export default function LightManager() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
//   const { spawnDefenders } = useMinions();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement for flashlight
  const smoothX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const smoothY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  // Reveal radius animation
  const revealRadius = useMotionValue(0);

  useEffect(() => {
    // Set initial size
    const updateSize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Defer initial update to satisfy linter
    const timer = setTimeout(updateSize, 0);

    const handleResize = () => {
      updateSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const toggleReveal = () => {
    const newState = !isRevealed;
    setIsRevealed(newState);

    const maxDim = Math.max(windowSize.width, windowSize.height) * 1.5;
    const targetRadius = newState ? maxDim : 0;

    // Use EaseOut for "Fast start, slow finish"
    animate(revealRadius, targetRadius, {
      duration: 3, // Faster than 10s for responsiveness
      ease: "circOut", // Strong ease out
    });
  };

  const handleMouseEnter = () => {
      // Defenders disabled for Phase 3
  };

  // Switch Position: Fixed Top-Right (approx 80px from top, 50px from right)
  // Matched with CSS positioning
  const switchX = windowSize.width - 50;
  const switchY = 80;

  return (
    <>
      {/* Light Switch Button */}
      <button
        onClick={toggleReveal}
        onMouseEnter={handleMouseEnter}
        className="fixed top-20 right-4 z-50 p-2 border border-white/20 bg-black text-white hover:bg-white/10 hover:border-white transition-all rounded-sm flex items-center gap-2 group cursor-pointer"
        aria-label="Toggle Global Light"
      >
        <SwitchCamera size={16} className={isRevealed ? "text-cyan-400" : "text-white/50"} />
        <span className="text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block">
          {isRevealed ? "Darken" : "Illu-minate"}
        </span>
      </button>

      {/* The Darkness Overlay */}
      {/* pointer-events-none allows clicks through to content underneath */}
      <div
        className="fixed inset-0 z-40 bg-black pointer-events-none transition-colors duration-1000"
        style={{
          maskImage: 'url(#light-mask)',
          WebkitMaskImage: 'url(#light-mask)',
        }}
      />

      {/* SVG Mask Definition */}
      <svg className="fixed inset-0 pointer-events-none z-0 opacity-0 w-full h-full">
        <defs>
          <filter id="soft-blur">
            {/* Increase deviation for softer gradient edges */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>

           <filter id="global-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="100" />
          </filter>

          <mask id="light-mask">
            {/* White Rect = Opaque Overlay (Hidden Content) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />

            {/* Black Circle = Transparent Overlay (Revealed Content) */}

            {/* Flashlight Hole - Soft Radial Gradient */}
            {/* We use a circle with a blur filter to simulate gradient mask */}
            <motion.circle
              cx={smoothX}
              cy={smoothY}
              r="250" // Larger radius for falloff
              fill="black"
              filter="url(#soft-blur)"
              opacity={0.9} // Slight opacity to never fully reveal unless direct
            />

            {/* Global Reveal Hole - Bleeding Light */}
            <motion.circle
              cx={switchX}
              cy={switchY}
              r={revealRadius}
              fill="black"
              filter="url(#global-blur)" // Very soft edge for global light
            />
          </mask>
        </defs>
      </svg>
    </>
  );
}
