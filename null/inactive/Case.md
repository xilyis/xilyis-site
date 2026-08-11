
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ArrowRight, CornerDownRight } from 'lucide-react';

interface CaseData {
  id: string;
  index: string;
  type: string;
  date: string;
  client: string;
  title: string;
  description: string;
  visualLabel: string;
  longText: string;
}

const CASES: CaseData[] = [
  {
    id: 'CASE_001',
    index: '(001)',
    type: 'NEURAL_SYNTHESIS / SEMANTIC_MAPPING',
    date: 'FALL_SERIES_2026',
    client: 'PROPRIETARY_RESEARCH_LABS',
    title: 'CASE',
    visualLabel: 'VISUAL_SOURCE_01',
    description: 'AN ITERATIVE PROTOCOL FOCUSED ON THE TRANSLATION OF EMOTIONAL FREQUENCY INTO HIGH-FIDELITY SPATIAL STRUCTURES.',
    longText: 'RECURSIVE_ARCHIVE_LOG_01: FIELD DATA SUGGESTS A PERSISTENT CORRELATION BETWEEN LATENT DIMENSIONAL SHIFTS AND OBSERVED GEOMETRIC NOISE. SYSTEM ANALYSIS CONFIRMS 98% FIDELITY IN SEMANTIC TRANSLATION.'
  },
  {
    id: 'CASE_002',
    index: '(002)',
    type: 'KINETIC_TOPOLOGY / FLUID_DYNAMICS',
    date: 'WINTER_SERIES_2026',
    client: 'CHRONOS_ARCHIVE',
    title: 'FORM',
    visualLabel: 'VISUAL_SOURCE_02',
    description: 'EXPLORATIONS INTO THE PERSISTENCE OF FORM WITHIN TURBULENT ENVIRONMENTS.',
    longText: 'RECURSIVE_ARCHIVE_LOG_02: FLUID SIMULATIONS INDICATE EMERGENT TOPOLOGICAL STABILITY UNDER HIGH-STRESS CALCULATION. VISUAL MANIFESTATION OF TURBULENCE REMAINS WITHIN OPERATIONAL PARAMETERS.'
  },
  {
    id: 'CASE_003',
    index: '(003)',
    type: 'SPECTRAL_ECHOES / LIGHT_STUDY',
    date: 'SPRING_SERIES_2027',
    client: 'ETHER_FOUNDATION',
    title: 'VOID',
    visualLabel: 'VISUAL_SOURCE_03',
    description: "A DEEP-LAYER ANALYSIS OF LIGHT REFRACTION IN SYNTHETIC VACUUMS. VISUALIZING THE 'GHOSTING' EFFECT.",
    longText: 'RECURSIVE_ARCHIVE_LOG_03: PHOTON DECAY RATES WITHIN THE VOID CHAMBER HAVE EXCEEDED INITIAL PREDICTIONS. GHOSTING PHENOMENA ARE NOW MEASURABLE ACROSS THE ENTIRE VISIBLE SPECTRUM.'
  }
];

interface CaseProps {
  isDarkMode: boolean;
}

const Case: React.FC<CaseProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const activeCase = CASES[currentIndex];

  useGSAP(() => {
    if (!isDetailOpen) {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
      tl.from('.case-title', { opacity: 0, y: 20, duration: 1.5 })
        .from('.case-metadata-item', { opacity: 0, x: -10, stagger: 0.08 }, '-=1.2')
        .from('.case-visual-main', { opacity: 0, scale: 0.99, duration: 1.5 }, '-=1.3')
        .from('.case-visual-side', { opacity: 0, x: 10, stagger: 0.08 }, '-=1.3')
        .from('.case-desc', { opacity: 0, y: 5, duration: 1 }, '-=0.8')
        .from('.case-nav-strip', { opacity: 0, y: 10, duration: 1 }, '-=0.5');
    }
  }, { scope: containerRef, dependencies: [isDetailOpen] });

  const handleNext = () => transitionTo(currentIndex < CASES.length - 1 ? currentIndex + 1 : 0);
  const handlePrev = () => transitionTo(currentIndex > 0 ? currentIndex - 1 : CASES.length - 1);

  const transitionTo = (newIndex: number) => {
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 5,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentIndex(newIndex);
        gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      }
    });
  };

  const toggleDetail = (open: boolean) => {
    if (open) {
      setIsDetailOpen(true);
      gsap.fromTo(detailRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' });
    } else {
      gsap.to(detailRef.current, { opacity: 0, y: 30, duration: 0.4, ease: 'power2.in', onComplete: () => setIsDetailOpen(false) });
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative select-none">
      
      {/* Background Ambient Flare */}
      <div className={`absolute inset-0 pointer-events-none z-0 transition-colors duration-1000 ${isDarkMode ? 'bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.015)_0%,_transparent_60%)]' : 'bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,0.005)_0%,_transparent_60%)]'}`} />

      {/* Main Carousel View */}
      <div ref={contentRef} className={`w-full h-full flex flex-col relative z-10 px-4 md:px-0 max-h-[80vh] ${isDetailOpen ? 'hidden' : 'flex'}`}>
        <div className="flex-1 grid grid-cols-12 gap-8 lg:gap-14 items-center w-full max-w-[1340px] mx-auto min-h-0">
          
          {/* Left Visual */}
          <div className="col-span-12 lg:col-span-4 flex items-center justify-start min-h-0">
            <div className={`case-visual-main w-full aspect-[4/5] max-w-[min(380px,50vh)] border transition-colors duration-700 relative flex flex-col items-center justify-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <span className="text-[7px] md:text-[8px] tracking-[0.8em] opacity-25 uppercase font-medium text-center px-4 leading-relaxed">{activeCase.visualLabel}</span>
              <div className="absolute top-2 left-2 w-1 h-1 border-t border-l border-current opacity-20" />
              <div className="absolute bottom-2 right-2 w-1 h-1 border-b border-r border-current opacity-20" />
            </div>
          </div>

          {/* Center Text */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center min-h-0 py-4 lg:py-0">
            <div className="space-y-4 lg:space-y-6">
              <div className="space-y-2 lg:space-y-3 case-metadata">
                {[{ label: 'TYPE', value: activeCase.type }, { label: 'DATE', value: activeCase.date }, { label: 'CLIENT', value: activeCase.client }].map((item, idx) => (
                  <div key={idx} className="case-metadata-item space-y-0.5">
                    <span className="text-[5px] md:text-[5.5px] tracking-[0.3em] opacity-20 font-medium block uppercase font-inter">{item.label}:</span>
                    <span className="text-[6.5px] md:text-[8px] tracking-[0.12em] font-medium uppercase leading-tight">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="relative pt-3 lg:pt-4">
                <span className="absolute top-0 left-0 text-[5px] md:text-[5.5px] tracking-[0.4em] opacity-20 font-mono italic">{activeCase.index}</span>
                <h2 className="case-title text-[clamp(1.5rem,4.5vw,4.5rem)] font-[100] tracking-[0.1em] leading-[0.9] uppercase -ml-0.5">{activeCase.title}</h2>
                <div className="case-desc mt-4 lg:mt-6 max-w-[480px]">
                  <p className="text-[7px] md:text-[9.5px] leading-[1.8] tracking-[0.12em] font-[300] uppercase text-zinc-500 mb-6">{activeCase.description}</p>
                  
                  {/* Trigger for detailed view */}
                  <button 
                    onClick={() => toggleDetail(true)}
                    className={`group flex items-center gap-4 text-[7px] tracking-[0.4em] uppercase py-2 border-b border-current/10 hover:border-current transition-all ${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    <span>VIEW FULL CASE</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Frags */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-3 lg:gap-4 justify-center items-end h-full min-h-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`case-visual-side w-full max-w-[min(155px,18vh)] aspect-square border transition-colors duration-700 relative flex items-center justify-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <span className="text-[5px] md:text-[5.5px] tracking-[0.2em] font-mono opacity-10 uppercase">FRAG_00{currentIndex + 1}_{i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="case-nav-strip flex flex-row items-center justify-between w-full max-w-[1340px] mx-auto pt-8 pb-2 mt-auto border-t border-current/10">
          <button onClick={handlePrev} className="opacity-30 hover:opacity-100 transition-all duration-300 text-[6.5px] md:text-[7.5px] tracking-[0.5em] font-bold uppercase">← PREV</button>
          <div className="flex items-center gap-4 opacity-20">
            <div className="h-px w-10 md:w-24 bg-current" />
            <span className="text-[7.5px] md:text-[8.5px] tracking-[0.3em] font-mono whitespace-nowrap">0{currentIndex + 1} / 0{CASES.length}</span>
            <div className="h-px w-10 md:w-24 bg-current" />
          </div>
          <button onClick={handleNext} className="opacity-30 hover:opacity-100 transition-all duration-300 text-[6.5px] md:text-[7.5px] tracking-[0.5em] font-bold uppercase">NEXT →</button>
        </div>
      </div>

      {/* Detailed View Modal - Wireframe Interpretation */}
      {isDetailOpen && (
        <div ref={detailRef} className={`fixed inset-0 z-[100] w-full h-full overflow-y-auto ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-50 text-black'}`}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 relative">
            
            {/* Close UI */}
            <button 
              onClick={() => toggleDetail(false)}
              className="fixed top-8 right-8 z-[110] p-4 bg-current/5 hover:bg-current/10 transition-all border border-current/10 backdrop-blur-md"
            >
              <X size={20} strokeWidth={1} />
            </button>

            {/* Huge Title Section */}
            <div className="mb-32">
              <h1 className="text-[12vw] font-[100] tracking-[0.1em] leading-none uppercase">{activeCase.title}</h1>
              <div className="flex items-center gap-4 mt-6 opacity-40">
                <CornerDownRight size={14} />
                <span className="text-[8px] tracking-[0.5em] font-mono uppercase">{activeCase.id} // DETAILED_ARCHIVE</span>
              </div>
            </div>

            {/* Section 1: 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-40">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-8">
                  <div className={`aspect-square border border-current/10 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
                  <div className="grid grid-cols-3 gap-4 text-[7px] leading-relaxed tracking-wider font-light uppercase opacity-50">
                    <div>TEXTYOUR<br/>PARAGRAPH<br/>TEXTYOUR<br/>PARAGRAPH</div>
                    <div>TEXTYOUR<br/>PARAGRAPH<br/>TEXTYOUR<br/>PARAGRAPH</div>
                    <div>TEXTYOUR<br/>PARAGRAPH<br/>TEXTYOUR<br/>PARAGRAPH</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section 2: Large Visual + Heading */}
            <div className="grid grid-cols-12 gap-8 mb-40 items-start">
              <div className={`col-span-12 md:col-span-7 aspect-[16/9] border border-current/10 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
              <div className="col-span-12 md:col-span-5 pt-8">
                <h3 className="text-4xl font-light tracking-[0.2em] uppercase mb-8">HEADING</h3>
                <p className="text-[9px] leading-[2.2] tracking-[0.15em] font-light uppercase opacity-60">
                  {activeCase.longText}<br/><br/>
                  SYSTEM_DETERMINATION: OPTIMAL_FIDELITY_REACHED. NO_DEGRADATION_DETECTED. RECURSION_PROTOCOL_ACTIVE_001.
                </p>
              </div>
            </div>

            {/* Section 3: Vertical Text + Square */}
            <div className="grid grid-cols-12 gap-12 mb-40 items-end">
              <div className="col-span-12 md:col-span-8 flex flex-wrap gap-x-20 gap-y-12">
                {[1, 2, 3].map(i => (
                  <div key={i} className="text-[9px] leading-relaxed tracking-widest font-light uppercase opacity-40">
                    YOUR<br/>PARAGRAPH<br/>TEXTYOUR<br/>PARAGRAPH<br/>TEXTYOUR<br/>PARAGRAPH
                  </div>
                ))}
              </div>
              <div className={`col-span-12 md:col-span-4 aspect-square border border-current/10 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
            </div>

            {/* Section 4: Dual Wide Blocks */}
            <div className="grid grid-cols-2 gap-4 mb-40">
              <div className={`aspect-[4/3] border border-current/10 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
              <div className={`aspect-[4/3] border border-current/10 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
            </div>

            {/* Section 5: Complex Grid */}
            <div className="grid grid-cols-12 gap-6 h-[700px]">
              <div className={`col-span-3 h-full border border-current/10 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
              <div className="col-span-4 flex flex-col gap-6">
                <div className={`flex-1 border border-current/10 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
                <div className={`flex-1 border border-current/10 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
              </div>
              <div className="col-span-5 flex items-end justify-end">
                <div className="text-[9px] leading-relaxed tracking-[0.3em] font-light uppercase opacity-40 text-right">
                  YOUR<br/>PARAGRAPH<br/>TEXTYOUR<br/>PARAGRAPH<br/>TEXTYOUR<br/>PARAGRAPH
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Case;
