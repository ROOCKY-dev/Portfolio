'use client';

import { motion } from 'framer-motion';

export default function SpotlightCard({
    children,
    className = ''
}: {
    children: React.ReactNode,
    className?: string
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-8 shadow-2xl transition-colors duration-500 hover:border-white/20 ${className}`}
    >
      {/* Dynamic Global Spotlight Layer */}
      {/* Uses CSS variables set by LightManager for performance */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100 sm:opacity-100"
        style={{
          background: `radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.1),
            transparent 40%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
