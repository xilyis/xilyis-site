
import React, { useRef, useState, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, X, ArrowLeft, Share2, Bookmark, Check, Calendar, Clock, Tag } from 'lucide-react';

interface Publication {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  tags: string[];
  content?: string; // Placeholder for full content if needed
}

const PUBLICATIONS_DATA: Publication[] = [
  {
    id: 'PUB_004',
    date: '2026.08.12',
    category: 'THEORY',
    title: 'THE ALGORITHMIC SUBCONSCIOUS',
    description: 'Investigating the emergent properties of large language models as a form of digital dreaming. Analysis of 10,000 hallucinations.',
    readTime: '12 MIN READ',
    tags: ['AI', 'PSYCHOLOGY', 'DATA_FORENSICS']
  },
  {
    id: 'PUB_003',
    date: '2026.05.23',
    category: 'CASE_STUDY',
    title: 'SILICON VEINS',
    description: 'Documenting the rise of biomorphic architecture in the metaverse. A study on "growing" rooms rather than building them.',
    readTime: '08 MIN READ',
    tags: ['ARCHITECTURE', 'BIOMIMICRY', 'VR']
  },
  {
    id: 'PUB_002',
    date: '2025.12.01',
    category: 'ESSAY',
    title: 'GHOSTS IN THE RENDERING',
    description: 'Why we crave noise in a perfect digital vacuum. The psychological necessity of film grain and glitch artifacts.',
    readTime: '15 MIN READ',
    tags: ['AESTHETICS', 'PSYCHOLOGY', 'NOISE']
  },
  {
    id: 'PUB_001',
    date: '2025.09.15',
    category: 'MANIFESTO',
    title: 'POST-CARBON AESTHETICS',
    description: 'Defining a new visual language for an era defined by computational scarcity and ecological collapse.',
    readTime: '06 MIN READ',
    tags: ['ECOLOGY', 'AESTHETICS', 'FUTURE_STUDIES']
  }
];

interface PublicationsProps {
  isDarkMode: boolean;
}

const Publications: React.FC<PublicationsProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for View Management
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [savedState, setSavedState] = useState<{shared: boolean; bookmarked: boolean}>({ shared: false, bookmarked: false });

  // Compute next article
  const nextPub = useMemo(() => {
    if (!selectedPub) return null;
    const currentIndex = PUBLICATIONS_DATA.findIndex(p => p.id === selectedPub.id);
    const nextIndex = (currentIndex + 1) % PUBLICATIONS_DATA.length;
    return PUBLICATIONS_DATA[nextIndex];
  }, [selectedPub]);

  // Compute related articles
  const relatedPubs = useMemo(() => {
    if (!selectedPub) return [];
    return PUBLICATIONS_DATA
      .filter(p => 
        p.id !== selectedPub.id && 
        (p.category === selectedPub.category || p.tags.some(t => selectedPub.tags.includes(t)))
      )
      .slice(0, 2);
  }, [selectedPub]);

  // Initial Entrance
  useGSAP(() => {
    if (!selectedPub && !isTransitioning) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.pub-header-el', { y: 40, opacity: 0, duration: 1, stagger: 0.1 })
        .from('.timeline-item', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.5');
    }
  }, { scope: containerRef, dependencies: [] }); // Run once on mount

  // View Switching Logic
  const handleOpenArticle = (pub: Publication) => {
    setIsTransitioning(true);
    
    // Animate List or Current Detail Out
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setSelectedPub(pub);
        setSavedState({ shared: false, bookmarked: false });
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Animate Detail In
        gsap.fromTo(containerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1, onComplete: () => setIsTransitioning(false) }
        );
      }
    });
  };

  const handleBackToIndex = () => {
    setIsTransitioning(true);
    setSavedState({ shared: false, bookmarked: false });

    // Animate Detail Out
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setSelectedPub(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Animate List In
        gsap.fromTo(containerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1, onComplete: () => setIsTransitioning(false) }
        );
      }
    });
  };

  const handleAction = (type: 'share' | 'bookmark') => {
    setSavedState(prev => ({ ...prev, [type]: !prev[type as keyof typeof prev] }));
  };

  return (
    <div ref={containerRef} className="w-full max-w-[1200px] mx-auto py-12 md:py-24 relative min-h-screen">
      
      {!selectedPub ? (
        // ================= LIST VIEW =================
        <div className="flex flex-col">
          <header className="mb-24 md:mb-32 relative">
            <div className="absolute top-0 right-0 hidden md:block text-right pub-header-el">
               <span className="text-[6px] tracking-[0.4em] font-mono opacity-30 block mb-1">SECTION_05</span>
               <span className="text-[6px] tracking-[0.4em] font-mono opacity-30 block">INDEX_LOG</span>
            </div>
            
            <h1 className="pub-header-el text-[13vw] md:text-[8rem] md:text-[5rem] leading-[0.85] font-[100] tracking-tighter uppercase mb-6 ml-[-0.05em] select-none">
              PUBLICATIONS
            </h1>
            <p className="pub-header-el text-[8px] md:text-[9px] tracking-[0.3em] font-light uppercase opacity-50 max-w-md leading-relaxed ml-1">
              Archived thoughts on the intersection of biological impulse and synthetic logic.
            </p>
          </header>

          <div className="relative border-l border-current/10 md:border-l-0 md:ml-0 ml-4 pl-8 md:pl-0 space-y-24 md:space-y-0 pb-32">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-current/10 -translate-x-1/2" />

            {PUBLICATIONS_DATA.map((pub, index) => (
              <div 
                key={pub.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleOpenArticle(pub)}
                className="timeline-item group relative flex flex-col md:flex-row items-start md:items-center justify-between md:py-16 first:pt-0 cursor-pointer"
              >
                {/* Left Meta */}
                <div className="md:w-[45%] md:text-right mb-6 md:mb-0 md:pr-16 order-2 md:order-1 transition-all duration-500">
                  <div className="flex flex-col md:items-end gap-2">
                    <span className={`text-[6px] tracking-[0.4em] font-mono uppercase transition-colors duration-500 ${isDarkMode ? 'text-zinc-500 group-hover:text-white' : 'text-zinc-400 group-hover:text-black'}`}>
                      {pub.date} // {pub.category}
                    </span>
                    <h3 className="text-[1.5rem] md:text-[2rem] font-[200] leading-none uppercase tracking-wide group-hover:tracking-wider transition-all duration-500">
                      {pub.title}
                    </h3>
                  </div>
                </div>

                {/* Center Visual Anchor */}
                <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-2 mb-8 md:mb-0 z-10">
                  <div className={`relative w-24 h-24 md:w-32 md:h-32 transition-all duration-500 ease-out transform ${hoveredIndex === index ? 'scale-105 md:scale-110 shadow-xl' : 'scale-100 grayscale'}`}>
                    <div className={`w-full h-full border transition-colors duration-500 overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-zinc-900 border-zinc-700 group-hover:bg-white group-hover:border-white' : 'bg-zinc-100 border-zinc-300 group-hover:bg-black group-hover:border-black'}`}>
                      <div className={`w-1 h-1 transition-colors duration-500 ${isDarkMode ? 'bg-white group-hover:bg-black' : 'bg-black group-hover:bg-white'}`} />
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_filmgrain.png')]`} />
                    </div>
                    {/* Horizontal Connectors */}
                    <div className="hidden md:block absolute top-1/2 right-full w-[100px] h-px bg-current transition-all duration-700 ease-out origin-right scale-x-0 group-hover:scale-x-100 opacity-20" />
                    <div className="hidden md:block absolute top-1/2 left-full w-[100px] h-px bg-current transition-all duration-700 ease-out origin-left scale-x-0 group-hover:scale-x-100 opacity-20" />
                  </div>
                </div>

                {/* Right Desc & Action */}
                <div className="md:w-[45%] md:pl-16 order-3 transition-all duration-500">
                   <div className={`transition-all duration-500 ease-out ${hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-50 md:opacity-30 md:translate-y-2'}`}>
                     <p className="text-[9px] md:text-[10px] leading-[1.8] tracking-[0.1em] font-light uppercase max-w-xs mb-6">
                       {pub.description}
                     </p>
                     <button className="inline-flex items-center gap-2 text-[7px] tracking-[0.3em] font-bold uppercase border-b border-transparent hover:border-current pb-1 transition-all">
                       View Entry <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                </div>

                {/* Mobile Dot */}
                <div className={`md:hidden absolute left-[-36.5px] top-10 w-2 h-2 rounded-full border border-current bg-current transition-all duration-500 ${hoveredIndex === index ? 'scale-125 opacity-100' : 'scale-100 opacity-20'}`} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ================= DETAIL ARTICLE VIEW =================
        <div className="w-full relative">
          
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-16 md:mb-24 pb-6 border-b border-current/10">
            <button 
              onClick={handleBackToIndex}
              className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity group"
            >
              <ArrowLeft size={16} strokeWidth={1} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[8px] tracking-[0.3em] font-bold uppercase">INDEX</span>
            </button>
            
            <div className="hidden md:flex items-center gap-3 text-[7px] tracking-[0.4em] uppercase opacity-30 font-mono">
              <span>{selectedPub.id}</span>
              <span>//</span>
              <span>READING_MODE</span>
            </div>

            <div className="w-4" /> {/* Spacer for balance */}
          </div>

          {/* Article Header */}
          <header className="mb-20 max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-10 text-[8px] tracking-[0.25em] uppercase opacity-50 font-mono">
               <span className="flex items-center gap-2"><Tag size={10} /> {selectedPub.category}</span>
               <span className="flex items-center gap-2"><Calendar size={10} /> {selectedPub.date}</span>
               <span className="flex items-center gap-2"><Clock size={10} /> {selectedPub.readTime}</span>
            </div>
            
            <h1 className="text-[10vw] md:text-[5rem] lg:text-[6.5rem] leading-[0.95] font-[100] uppercase tracking-tighter text-center mb-12">
              {selectedPub.title}
            </h1>

            <div className="w-full h-px bg-current opacity-20" />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-24">
            
            {/* Sidebar Sticky */}
            <aside className="md:col-span-3 lg:col-span-3">
               <div className="sticky top-32 space-y-12">
                  <div className="space-y-4">
                    <span className="block text-[6px] tracking-[0.4em] uppercase opacity-30 font-bold">AUTHOR</span>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border border-current/20 ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100'}`} />
                      <div>
                        <p className="text-[9px] tracking-[0.2em] uppercase font-bold">XILYAS_SYS</p>
                        <p className="text-[7px] tracking-[0.1em] opacity-50 uppercase">Neural Architect</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <span className="block text-[6px] tracking-[0.4em] uppercase opacity-30 font-bold">ACTIONS</span>
                     <div className="flex gap-4">
                        <button onClick={() => handleAction('share')} className={`p-3 border border-current/10 hover:border-current/50 transition-all ${savedState.shared ? 'text-emerald-500 border-emerald-500/50' : ''}`}>
                          {savedState.shared ? <Check size={14} /> : <Share2 size={14} strokeWidth={1} />}
                        </button>
                        <button onClick={() => handleAction('bookmark')} className={`p-3 border border-current/10 hover:border-current/50 transition-all ${savedState.bookmarked ? 'text-emerald-500 border-emerald-500/50' : ''}`}>
                          <Bookmark size={14} strokeWidth={1} fill={savedState.bookmarked ? "currentColor" : "none"} />
                        </button>
                     </div>
                  </div>
               </div>
            </aside>

            {/* Main Content */}
            <article className="md:col-span-9 lg:col-span-7 space-y-12">
               {/* Hero Visual Placeholder */}
               <div className={`w-full aspect-video border border-current/10 relative overflow-hidden flex items-center justify-center mb-12 ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                  <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_filmgrain.png')]"></div>
                  <span className="text-[8px] tracking-[0.5em] uppercase opacity-20 font-mono">HERO_IMAGE_GENERATION</span>
               </div>

               {/* Abstract */}
               <p className="text-[18px] md:text-[22px] leading-[1.6] font-light tracking-wide opacity-90 indent-12 text-justify">
                  The boundary between the calculated and the hallucinatory is dissolving. As our systems grow in complexity, the "errors" they produce—once dismissed as noise—are revealing themselves to be a form of emergent cognition. This log explores the structural necessity of these glitches.
               </p>

               {/* Paragraphs */}
               <div className="space-y-8 text-[12px] md:text-[14px] leading-[2.2] tracking-[0.05em] opacity-70 font-light text-justify">
                  <p>
                    In the early epochs of generative synthesis, fidelity was the only metric. We sought to eliminate the grain, the artifacts, the strange geometric inconsistencies that betrayed the machine's hand. We wanted the mirror to be perfectly polished. But a perfect mirror only reflects what is already known.
                  </p>
                  <p>
                    By introducing controlled entropy into the latent space, we allow the model to drift away from the training data's gravitational pull. It is in this drift that the "ghosts" appear. These are not failures of calculation, but rather the system attempting to reconcile conflicting high-dimensional vectors.
                  </p>
               </div>

               {/* Pull Quote */}
               <div className="py-12 my-8 border-y border-current/10">
                  <h3 className="text-[24px] md:text-[32px] leading-[1.15] font-[200] italic uppercase opacity-90 text-center">
                    "Authenticity is found in the friction between the human error and the model's perfection."
                  </h3>
               </div>

               {/* More Content */}
               <div className="space-y-8 text-[12px] md:text-[14px] leading-[2.2] tracking-[0.05em] opacity-70 font-light text-justify">
                  <p>
                    We are now witnessing the birth of "Post-Carbon Aesthetics." This is a visual language defined not by the abundance of physical resources, but by the scarcity of compute. The brutalist nature of low-poly geometry and dithered textures is no longer a stylistic nostalgia—it is an ecological necessity.
                  </p>
                  <h4 className="text-[14px] font-bold uppercase tracking-[0.2em] mt-12 mb-6 opacity-100 block">The Recursive Loop</h4>
                  <p>
                    When we feed these hallucinations back into the training set, we create a recursive loop. The machine learns from its own dreams. The resulting artifacts possess a density of meaning that no single human author could encode. They are totems of a collective, silicon-based subconscious.
                  </p>
               </div>

               {/* Visual Interlude */}
               <div className="grid grid-cols-2 gap-4 my-12">
                  <div className={`aspect-square border border-current/10 ${isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-100/50'}`}></div>
                  <div className={`aspect-square border border-current/10 ${isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-100/50'}`}></div>
                  <p className="col-span-2 text-[8px] tracking-[0.2em] opacity-40 font-mono text-center mt-2">FIG_02: RECURSIVE_DREAM_STATE_ITERATIONS</p>
               </div>

               <div className="space-y-8 text-[12px] md:text-[14px] leading-[2.2] tracking-[0.05em] opacity-70 font-light text-justify">
                  <p>
                    Our task as artists is no longer to create ex nihilo, but to navigate this infinite archive. We are curators of the void, searching for the signal within the noise. The next epoch will not be defined by how well we can control these systems, but by how gracefully we can surrender to them.
                  </p>
               </div>
            </article>

          </div>

          {/* Related Entries Section */}
          {relatedPubs.length > 0 && (
            <div className="max-w-5xl mx-auto mb-32 border-t border-current/10 pt-16 px-6 md:px-0">
                <div className="flex items-end justify-between mb-12">
                    <h4 className="text-[7px] tracking-[0.4em] uppercase opacity-40 font-bold">RELATED_DATA_STREAMS</h4>
                    <span className="hidden md:block text-[6px] tracking-[0.2em] font-mono opacity-30">AUTO_SUGGESTION_ALGORITHM_V0.9</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPubs.map(pub => (
                        <div 
                            key={pub.id}
                            onClick={() => handleOpenArticle(pub)}
                            className="group border border-current/10 p-8 hover:bg-current/[0.02] cursor-pointer transition-all duration-500 hover:border-current/30 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[6px] tracking-[0.25em] font-mono opacity-50 border border-current/10 px-2 py-1">{pub.id}</span>
                                <span className="text-[6px] tracking-[0.2em] font-mono opacity-30">{pub.date}</span>
                            </div>
                            <h5 className="text-[14px] md:text-[18px] font-[200] leading-tight uppercase tracking-wide mb-6 group-hover:translate-x-2 transition-transform duration-500">
                                {pub.title}
                            </h5>
                             <div className="flex flex-wrap gap-2">
                                {pub.tags.slice(0, 3).map(tag => (
                                     <span key={tag} className="text-[5px] tracking-widest border border-current/10 px-2 py-1 opacity-40 uppercase group-hover:border-current/30 transition-colors">
                                        {tag}
                                     </span>
                                ))}
                             </div>
                             
                             {/* Corner Accent */}
                             <div className="absolute bottom-0 right-0 w-3 h-3 border-t border-l border-current/0 group-hover:border-current/30 transition-all duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Footer Nav */}
          {nextPub && (
            <div 
              onClick={() => handleOpenArticle(nextPub)}
              className="mt-0 pt-16 border-t border-current/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group"
            >
               <div className="text-[9px] tracking-[0.2em] uppercase font-light group-hover:tracking-[0.3em] transition-all">READ NEXT ENTRY</div>
               <div className="text-[20px] md:text-[40px] font-[100] uppercase tracking-widest flex items-center gap-6 text-center md:text-right">
                 {nextPub.title} <ArrowRight size={24} strokeWidth={0.5} className="group-hover:translate-x-4 transition-transform" />
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Publications;
