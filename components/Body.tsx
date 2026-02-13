export default function Body() {
  return (
    <main className="pt-32 pb-12 px-4 max-w-5xl mx-auto min-h-screen">
       <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
         {[...Array(6)].map((_, i) => (
           <div key={i} className="break-inside-avoid border border-white/60 rounded-sm p-6 hover:border-white transition-all bg-black/50 backdrop-blur-sm group hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
             <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-2">
               <h3 className="text-xs font-bold uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">
                 Module_0{i + 1}
               </h3>
               <span className="text-[10px] text-white/40 font-mono">ID: {`MOD_${(i + 1).toString().padStart(3, '0')}`}</span>
             </div>

             <p className="text-[10px] leading-relaxed text-white/70 font-mono mb-4">
               LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA. UT ENIM AD MINIM VENIAM.
             </p>

             <div className="flex gap-2 opacity-50">
               <div className="h-1 w-8 bg-white/40" />
               <div className="h-1 w-4 bg-white/20" />
               <div className="h-1 w-12 bg-white/10" />
             </div>
           </div>
         ))}
       </div>
    </main>
  );
}
