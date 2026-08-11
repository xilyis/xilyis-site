
import React, { useRef, useState, useEffect, memo } from 'react';
import { X, Info, Cpu, Activity, Database } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ExhibitItem {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  technicalDetails: { process: string; tools: string[]; metrics: string; };
}

const EXHIBITS_DATA: ExhibitItem[] = [
  { id: 'EX_01', title: 'LATENT_STRUCTURE_A', category: 'NEURAL_TOPOLOGY', description: 'PROCEDURAL EXTRACTION OF SPATIAL DATA.', longDescription: 'Synthesizing machine logic with human expression through refined digital artifacts.', technicalDetails: { process: 'Generated via StyleGAN3 backbone.', tools: ['PyTorch', 'Blender'], metrics: '4.2M Iterations' } },
  { id: 'EX_02', title: 'SYNTHETIC_SOMATIC', category: 'BIOMORPHIC_AI', description: 'ARTIFICIAL MUSCLE FIBER RENDERING.', longDescription: 'An exploration of biological forms interpreted through recursive algorithmic constraints.', technicalDetails: { process: 'Simulated dynamics processed via RNN.', tools: ['Houdini', 'TensorFlow'], metrics: '0.89 Coefficient' } },
  { id: 'EX_03', title: 'DIGITAL_ETHER_V04', category: 'ATMOSPHERIC_SIM', description: 'NOISE-BASED LIGHT SCATTERING.', longDescription: 'Capturing the transition from biological intent to silicon-based logic.', technicalDetails: { process: 'Volumetric ray-marching.', tools: ['GLSL', 'Cinema 4D'], metrics: '1024 Samples' } }
];

const ThumbnailCard = memo(({ item, isActive, onClick, isDarkMode }: { item: ExhibitItem; isActive: boolean; onClick: () => void; isDarkMode: boolean }) => {
  const activeBg = isDarkMode ? 'bg-white/10' : 'bg-black/10';
  const inactiveBg = isDarkMode ? 'bg-black/40' : 'bg-zinc-200/40';
  const borderColor = isDarkMode ? (isActive ? 'border-white/40' : 'border-white/50') : (isActive ? 'border-black/40' : 'border-black/5');
  const textColor = isDarkMode ? (isActive ? 'text-white' : 'text-zinc-600') : (isActive ? 'text-black' : 'text-zinc-400');

  return (
    <div 
      onClick={onClick} 
      data-exhibit-id={item.id} 
      className={`thumbnail-card snap-center aspect-square w-full border transition-all duration-500 cursor-pointer flex items-center justify-center relative overflow-hidden group ${borderColor} ${isActive ? activeBg : inactiveBg}`}
    >
      <span className={`text-[9px] md:text-[10px] tracking-[0.4em] font-mono transition-all duration-500 ${textColor} ${isActive ? 'scale-105 opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
        {item.id}
      </span>
      {isActive && <div className={`absolute top-1.5 right-1.5 w-1 h-1 shadow-[0_0_6px_rgba(255,255,255,0.6)] animate-pulse ${isDarkMode ? 'bg-white' : 'bg-black'}`} />}
    </div>
  );
});

interface ExhibitsProps { isDarkMode: boolean; }

const Exhibits: React.FC<ExhibitsProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeExhibit, setActiveExhibit] = useState<ExhibitItem>(EXHIBITS_DATA[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.exhibit-title-wrap', { opacity: 0, y: 20, duration: 1.2 })
      .from('.main-viewport', { opacity: 0, scale: 0.98, duration: 1.4 }, '-=1')
      .from('.thumbnail-card', { opacity: 0.3, y: 15, stagger: 0.08, duration: 0.8 }, '-=1.2');
  }, { scope: containerRef });



  return (
    <div ref={containerRef} className="w-full h-full flex flex-col lg:flex-row items-start justify-between relative px-6 md:px-12 lg:px-20 select-none overflow-hidden pt-10 pb-10 lg:py-0">
      
      {/* Left: Content and Viewport */}
      <div className="w-full lg:w-[60%] flex flex-col items-start relative z-10 lg:pt-[4vh] lg:pb-[4vh] min-h-0">
        <div className="mb-6 lg:mb-10 exhibit-title-wrap flex-shrink-0">
           <span className="text-[7px] tracking-[0.6em] opacity-25 uppercase font-black mb-2 block">ARCHIVE.EXB.SYS</span>
           <h2 className="text-[clamp(2rem,6vw,4.2rem)] font-[100] leading-none tracking-[0.15em] mb-4 uppercase">EXHIBITS</h2>
           <p className={`text-[9px] md:text-[10px] tracking-[0.3em] font-light leading-[1.8] opacity-40 uppercase max-w-md ${isDarkMode ? 'text-white' : 'text-black'}`}>
             {activeExhibit.longDescription}
           </p>
        </div>

        <div className={`main-viewport w-full lg:max-w-[512px] aspect-video border relative overflow-hidden shadow-2xl transition-colors duration-700 ${isDarkMode ? 'bg-black border-white/5' : 'bg-zinc-200 border-black/5'}`}>
          <div className="absolute bottom-6 left-6 text-left space-y-3 z-20">
            <span className="text-[8px] md:text-[9px] tracking-[0.5em] opacity-25 uppercase font-mono">{activeExhibit.id}</span>
            <h3 className="text-[16px] md:text-[20px] tracking-[0.3em] font-[200] uppercase">{activeExhibit.title}</h3>
            <button 
              onClick={() => setIsExpanded(true)} 
              className={`flex items-center gap-2 py-1.5 px-3 border transition-all text-[7px] tracking-[0.3em] uppercase font-bold ${
                isDarkMode ? 'border-white/10 hover:border-white/30 bg-white/5' : 'border-black/10 hover:border-black/30 bg-black/5'
              }`}
            >
              <Info size={10} strokeWidth={1.5} />
              <span>Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right: Thumbnails Feed */}
      <div className="w-full lg:w-[180px] h-auto lg:h-[65vh] flex items-center justify-end mt-10 lg:mt-0 lg:my-auto relative z-10 min-h-0">
        <div ref={feedRef} className="w-full h-full overflow-y-auto snap-y snap-mandatory custom-scrollbar pr-2 scrollbar-thin">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-5 lg:gap-8 pb-10">
            {EXHIBITS_DATA.map((item) => (
              <ThumbnailCard 
                key={item.id} 
                item={item} 
                isActive={activeExhibit.id === item.id} 
                onClick={() => setActiveExhibit(item)} 
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-16 bg-black/90 backdrop-blur-xl">
          <div ref={cardRef} className="w-full h-full max-w-[1100px] bg-black border border-white/10 flex flex-col lg:flex-row overflow-hidden relative">
            <button onClick={() => setIsExpanded(false)} className="absolute top-6 right-6 z-50 text-white/30 hover:text-white transition-all p-1.5 bg-white/5">
              <X size={16} />
            </button>
            <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-zinc-900/30 flex items-center justify-center p-10 text-center">
              <h2 className="text-[clamp(2rem,5vw,4rem)] font-[100] tracking-[0.15em] uppercase text-white">{activeExhibit.title}</h2>
            </div>
            <div className="w-full lg:w-1/2 h-full p-8 lg:p-14 space-y-12 overflow-y-auto custom-scrollbar">
              <section className="space-y-4">
                <span className="text-[7px] tracking-[0.4em] opacity-25 uppercase font-bold text-white">NARRATIVE_LOG</span>
                <p className="text-[10px] md:text-[11.5px] leading-[2] tracking-[0.12em] font-light opacity-50 uppercase text-white">{activeExhibit.longDescription}</p>
              </section>
              <section className="space-y-4">
                <span className="text-[7px] tracking-[0.4em] opacity-25 uppercase font-bold text-white">METRICS</span>
                <p className="text-[9px] font-mono opacity-60 tracking-widest text-white">{activeExhibit.technicalDetails.metrics} // {activeExhibit.technicalDetails.process}</p>
              </section>
              <section className="space-y-4">
                <span className="text-[7px] tracking-[0.4em] opacity-25 uppercase font-bold text-white">TOOLS</span>
                <div className="flex flex-wrap gap-3">
                  {activeExhibit.technicalDetails.tools.map(tool => (
                    <span key={tool} className="text-[8px] tracking-widest border border-white/10 px-2 py-1 opacity-40 text-white uppercase">{tool}</span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exhibits;
