'use client';
import { motion, Variants } from 'framer-motion';

export type SpiritBehavior = 'idle' | 'carry' | 'blocker' | 'fixer' | 'cheer' | 'typing';
export type SpiritMood = 'calm' | 'working' | 'panic';

interface SpiritProps {
  mood?: SpiritMood;
  behavior?: SpiritBehavior;
  size?: number; // Base width, height will be scaled
  carrying?: React.ReactNode;
  className?: string;
  delay?: number;
}

const COLORS = {
  calm: '#00FFFF',
  working: '#00FF00',
  panic: '#FF4500'
};

const MOOD_GLOW = {
  calm: '0 0 10px #00FFFF, 0 0 20px rgba(0, 255, 255, 0.2)',
  working: '0 0 15px #00FF00, 0 0 25px rgba(0, 255, 0, 0.3)',
  panic: '0 0 20px #FF4500, 0 0 30px rgba(255, 69, 0, 0.4)'
};

export default function Spirit({
  mood = 'calm',
  behavior = 'idle',
  size = 24,
  carrying,
  className = '',
  delay = 0
}: SpiritProps) {

  const color = COLORS[mood];
  const glow = MOOD_GLOW[mood];

  // -- Animation Variants --

  // Body Movement (Bounce / Shake)
  const bodyVariants: Variants = {
    idle: {
      y: [0, -2, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut", delay }
    },
    carry: {
      y: [0, -2, 0],
      rotate: [0, -2, 2, 0], // Waddle
      transition: { repeat: Infinity, duration: 0.5, ease: "linear", delay }
    },
    blocker: {
      x: [-2, 2, -2],
      y: [0, -1, 0],
      transition: { repeat: Infinity, duration: 0.2, delay }
    },
    fixer: {
      y: [0, 1, 0],
      transition: { repeat: Infinity, duration: 0.15, delay }
    },
    cheer: {
      y: [0, -15, 0],
      rotate: [0, 360, 0],
      transition: { duration: 0.6, times: [0, 0.5, 1], ease: "backOut", delay }
    },
    typing: {
        x: [-1, 1, -1],
        transition: { repeat: Infinity, duration: 0.1, delay }
    }
  };

  // Eyes (Blink / Squint)
  const eyeVariants: Variants = {
    idle: {
      scaleY: [1, 1, 0.1, 1, 1], // Occasional blink
      transition: { repeat: Infinity, duration: 4, times: [0, 0.9, 0.92, 0.94, 1], delay }
    },
    carry: {
      scaleY: 1
    },
    blocker: {
      scaleY: 0.4, // Squint
      transition: { duration: 0.2 }
    },
    fixer: {
      scaleY: 1 // Focused
    },
    cheer: {
      scaleY: [1, 0.2, 1], // Happy squint
      transition: { duration: 0.3 }
    },
    typing: {
        scaleY: 1
    }
  };

  // Arms
  const leftArmVariants: Variants = {
    idle: { rotate: 0 },
    carry: { rotate: -150, y: -2, x: 2 }, // Up holding something
    blocker: {
        rotate: [-20, 40, -20],
        transition: { repeat: Infinity, duration: 0.2 }
    },
    fixer: {
        rotate: [-45, 0, -45], // Hammering motion
        transition: { repeat: Infinity, duration: 0.2 }
    },
    cheer: { rotate: -150, y: -2 }, // High five
    typing: {
        y: [0, 2, 0],
        transition: { repeat: Infinity, duration: 0.1, delay: 0 }
    }
  };

  const rightArmVariants: Variants = {
    idle: { rotate: 0 },
    carry: { rotate: 150, y: -2, x: -2 }, // Up holding something
    blocker: {
        rotate: [20, -40, 20],
        transition: { repeat: Infinity, duration: 0.2 }
    },
    fixer: { rotate: 45 }, // Steady
    cheer: { rotate: 150, y: -2 },
    typing: {
        y: [0, 2, 0],
        transition: { repeat: Infinity, duration: 0.1, delay: 0.05 }
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-end ${className}`} style={{ width: size, height: size * 1.5 }}> {/* Container includes space for item */}

      {/* Carried Item */}
      {carrying && (
        <motion.div
          className="absolute -top-4 z-10 font-bold font-mono text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
          animate={behavior === 'carry' ? { y: [0, -1, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {carrying}
        </motion.div>
      )}

      {/* Main Body Group */}
      <motion.div
        className="relative"
        animate={behavior}
        variants={bodyVariants}
      >
        {/* Left Arm */}
        <motion.div
            className="absolute -left-[4px] top-[10px] w-[4px] h-[7px] bg-inherit rounded-sm origin-top-right"
            style={{ backgroundColor: color }}
            animate={behavior}
            variants={leftArmVariants}
        />

        {/* Right Arm */}
        <motion.div
            className="absolute -right-[4px] top-[10px] w-[4px] h-[7px] bg-inherit rounded-sm origin-top-left"
            style={{ backgroundColor: color }}
            animate={behavior}
            variants={rightArmVariants}
        />

        {/* Legs */}
        <div className="absolute -bottom-[6px] left-[4px] w-[4px] h-[7px] bg-inherit rounded-sm" style={{ backgroundColor: color }} />
        <div className="absolute -bottom-[6px] right-[4px] w-[4px] h-[7px] bg-inherit rounded-sm" style={{ backgroundColor: color }} />

        {/* Torso */}
        <div
          style={{
            width: size,
            height: size * 1.125, // 24x27 approx
            backgroundColor: color,
            boxShadow: glow
          }}
          className="relative rounded-[2px] flex justify-center items-center pt-1"
        >
           {/* Eyes */}
           <div className="flex gap-[4px]">
              <motion.div
                className="w-[4px] h-[10px] bg-white rounded-[1px]"
                animate={behavior}
                variants={eyeVariants}
              />
              <motion.div
                className="w-[4px] h-[10px] bg-white rounded-[1px]"
                animate={behavior}
                variants={eyeVariants}
              />
           </div>
        </div>
      </motion.div>
    </div>
  );
}
