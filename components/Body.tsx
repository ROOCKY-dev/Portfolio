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
    { name: 'Java' },
    { name: 'C++' },
    { name: 'Python' },
    { name: 'TypeScript' },
    { name: 'Next.js' },
    { name: 'React Three Fiber' },
    { name: 'Tailwind' },
    { name: 'Unity' },
    { name: 'Unreal Engine 5' },
    { name: 'Docker' },
    { name: 'Linux (Ubuntu)' },
    { name: 'Git' }
];

export default function Body() {
  return (
    <main className="relative z-10 pt-32 px-6 sm:px-12 max-w-7xl mx-auto pb-20 min-h-screen">

      {/* Section 1: The Terminal (About) */}
      <section className="mb-20 pointer-events-auto max-w-2xl">
        <SpotlightCard className="bg-black/40 backdrop-blur-md border-white/5 p-6 sm:p-8">
            <h2 className="text-xs font-mono text-cyan-400 mb-4 tracking-widest uppercase opacity-70">
                {`// SYSTEM_OVERVIEW`}
            </h2>
            <div className="font-mono text-sm sm:text-base space-y-2 text-white/80 leading-relaxed selection:bg-cyan-900 selection:text-cyan-100">
                <p>&gt; IDENTITY_VERIFIED: <span className="text-white font-bold">ROOCKYdev</span></p>
                <p>&gt; SYSTEM_ARCHITECT | FULL_STACK_ENGINEER | VOID_DWELLER</p>
                <p>&gt; CURRENT_STATUS: <span className="text-green-400">Building digital ecosystems.</span></p>
                <p>&gt; MISSION: Seeking scholarship opportunities in NL/DE/CN.</p>
                <p>&gt; ORIGIN: Yemen // CURRENT_BASE: Malaysia (UNITEN)</p>
            </div>
        </SpotlightCard>
      </section>

      {/* Section 2: The Arsenal (Tech Stack) */}
      <section className="mb-20 pointer-events-auto">
        <h2 className="text-xs font-mono text-white/50 mb-6 tracking-widest uppercase pl-2 border-l-2 border-cyan-500/30">
            {`// ARSENAL_DETECTED`}
        </h2>
        <div className="flex flex-wrap gap-4">
            {arsenal.map((tech) => (
                <SpotlightCard
                    key={tech.name}
                    className="bg-white/5 hover:bg-white/10 border-white/10 px-6 py-3 rounded-full transition-all cursor-default !p-3"
                >
                    <span className="text-xs font-mono text-white/70 group-hover:text-white transition-colors">
                        {tech.name}
                    </span>
                </SpotlightCard>
            ))}
        </div>
      </section>

      {/* Section 3: Operations (Projects) */}
      <section className="pointer-events-auto">
        <h2 className="text-xs font-mono text-white/50 mb-6 tracking-widest uppercase pl-2 border-l-2 border-orange-500/30">
            {`// ACTIVE_OPERATIONS`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
                <SpotlightCard key={i} className="bg-black/30 backdrop-blur-sm border-white/5 h-full flex flex-col justify-between hover:border-white/20 transition-colors">
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                                {project.title}
                            </h3>
                            <span className="text-[10px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                                {project.category}
                            </span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                            {project.desc}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tech.map(t => (
                            <span key={t} className="text-[10px] font-mono text-cyan-400/70 bg-cyan-900/10 px-2 py-1 rounded">
                                {t}
                            </span>
                        ))}
                    </div>
                </SpotlightCard>
            ))}
        </div>
      </section>

    </main>
  );
}
