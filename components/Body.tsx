'use client';

import SpotlightCard from '@/components/SpotlightCard';

const projects = [
  {
    title: 'AetherFall',
    category: 'Minecraft Server Core',
    desc: 'Custom factions, economy, and death mechanics.',
    tech: ['Java', 'Spigot API', 'MySQL']
  },
  {
    title: 'Planetary Claim',
    category: 'MMO-RTS Concept',
    desc: 'Unity-based strategy game with AI-driven economy.',
    tech: ['Unity', 'C#', 'AI']
  },
  {
    title: 'AntiGravity',
    category: 'Portfolio V2',
    desc: 'A Next.js experiment in volumetric UI and lighting physics.',
    tech: ['Next.js', 'R3F', 'Tailwind']
  }
];

const arsenal = [
    'Java', 'C++', 'Next.js', 'React Three Fiber', 'Unity',
    'TypeScript', 'Tailwind', 'Docker', 'Git'
];

export default function Body() {
  return (
    <main className="relative z-10 pt-[35vh] px-6 sm:px-12 max-w-7xl mx-auto pb-40 min-h-screen pointer-events-none">
        {/* pt-[35vh] pushes content below the main Orb focus area */}

      <div className="pointer-events-auto space-y-32">

        {/* Section 1: Arsenal (Tech Stack) */}
        <section>
            <h2 className="text-xs font-mono text-white/40 mb-8 tracking-[0.2em] uppercase pl-2 border-l-2 border-cyan-500/30">
                {`// ARSENAL_DETECTED`}
            </h2>
            <div className="flex flex-wrap gap-3">
                {arsenal.map((tech) => (
                    <SpotlightCard
                        key={tech}
                        className="bg-white/5 border-white/5 px-0 py-0 rounded-full !p-0 overflow-hidden"
                    >
                        <span className="text-xs font-mono text-white/60 group-hover:text-cyan-400 transition-colors relative z-10 block px-6 py-2">
                            {tech}
                        </span>
                    </SpotlightCard>
                ))}
            </div>
        </section>

        {/* Section 2: Operations (Projects) - Masonry Layout */}
        <section>
            <h2 className="text-xs font-mono text-white/40 mb-8 tracking-[0.2em] uppercase pl-2 border-l-2 border-orange-500/30">
                {`// ACTIVE_OPERATIONS`}
            </h2>

            {/* Masonry Layout using CSS Columns */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {projects.map((project, i) => (
                    <div key={i} className="break-inside-avoid">
                        <SpotlightCard className="bg-black/20 backdrop-blur-md border-white/5 hover:border-white/20 transition-all duration-500">
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <span className="text-[9px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        {project.category}
                                    </span>
                                </div>
                                <p className="text-sm text-white/50 leading-relaxed font-light">
                                    {project.desc}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-6">
                                {project.tech.map(t => (
                                    <span key={t} className="text-[9px] font-mono text-cyan-400/60 bg-cyan-900/10 px-2 py-1 rounded">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </SpotlightCard>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </main>
  );
}
