'use client';
import { motion } from 'framer-motion';

interface SpiritProps {
  color?: string;
  size?: number;
  eyes?: 'normal' | 'squint' | 'wide' | 'mad';
  carrying?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function Spirit({
  color = '#00ffff',
  size = 24,
  eyes = 'normal',
  carrying,
  className = '',
  delay = 0
}: SpiritProps) {

  // Dynamic styles based on color prop
  const glowStyle = {
    backgroundColor: color,
    boxShadow: `0 0 10px ${color}, 0 0 20px ${color}33`, // Inner glow + outer haze
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Carrying Item */}
      {carrying && (
        <motion.div
          className="mb-1 text-white font-bold font-mono"
          animate={{ y: [0, -3, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.5,
            ease: "easeInOut",
            delay: delay
          }}
        >
          {carrying}
        </motion.div>
      )}

      {/* Body */}
      <motion.div
        style={{
          width: size,
          height: size * 1.125, // 24x27 ratio
          ...glowStyle
        }}
        className="relative rounded-[2px] flex justify-center items-start pt-[6px]"
        animate={{
          y: [0, -5, 0], // Bobbing
          rotate: [0, -5, 5, 0] // Waddle
        }}
        transition={{
          repeat: Infinity,
          duration: 0.5,
          ease: "linear",
          delay: delay
        }}
      >
        {/* Eyes Container */}
        <div className="flex gap-[3px]">
            {/* Left Eye */}
            <div className={`bg-white transition-all duration-300 shadow-sm ${
                eyes === 'mad' ? 'h-[6px] w-[5px] rotate-12 rounded-sm' :
                eyes === 'squint' ? 'h-[3px] w-[5px] mt-[3px] rounded-sm' :
                'h-[10px] w-[6px] rounded-[1px]'
            }`} />

            {/* Right Eye */}
            <div className={`bg-white transition-all duration-300 shadow-sm ${
                eyes === 'mad' ? 'h-[6px] w-[5px] -rotate-12 rounded-sm' :
                eyes === 'squint' ? 'h-[3px] w-[5px] mt-[3px] rounded-sm' :
                'h-[10px] w-[6px] rounded-[1px]'
            }`} />
        </div>
      </motion.div>
    </div>
  );
}
