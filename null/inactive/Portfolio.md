
import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Download, MapPin, Hash, ArrowLeft } from 'lucide-react';

interface PortfolioProps {
  isDarkMode: boolean;
}

const PROJECTS = [
  {
    id: 'FILE_01',
    client: 'AMANA_CAPITAL',
    role: 'PRODUCT_DESIGN',
    title: 'INSTITUTIONAL_DIGITAL_ASSETS',
    desc: 'Designed a SAMA-compliant platform bridging Islamic finance and blockchain RWA tokenization with a protocol-first aesthetic.',
    metric: 'COGNITIVE_LOAD_DOWN_52PCT',
    image: '/assets/portfolio/amana_1.png',
    folder: 'amana',
    tags: ['FINTECH', 'ISLAMIC_FINANCE', 'AI'],
    year: '2024',
    sector: 'FINTECH / WEB3',
    longDesc: 'A comprehensive overhaul of institutional trading interfaces, focusing on high-frequency data visualization and regulatory compliance within the GCC market. The system integrates real-time blockchain settlement layers with traditional fiat rails, reducing trade execution time by 40% while maintaining strict Sharia compliance protocols.',
    gallery: [
      { title: 'TOKENIZATION_FLOW', desc: 'User journey mapping for Real World Asset (RWA) onboarding.', image: '/assets/portfolio/amana_2.png' },
      { title: 'COMPLIANCE_DASHBOARD', desc: 'Real-time SAMA regulatory monitoring interface.', image: '/assets/portfolio/amana_3.png' },
      { title: 'TRADING_BLOTTER', desc: 'High-density order management system with minimal latency.', image: '/assets/portfolio/amana_4.png' },
      { title: 'ISLAMIC_FRAMEWORK', desc: 'Visualizing Murabaha and Sukuk structures.', image: '/assets/portfolio/amana_5.png' },
      { title: 'MOBILE_APPROVALS', desc: 'Biometric authorization flow for institutional transfers.', image: '/assets/portfolio/amana_6.png' },
      { title: 'DESIGN_SYSTEM', desc: 'Typography and color palette strictly adhering to accessibility standards.', image: '/assets/portfolio/amana_7.png' }
    ]
  },
  {
    id: 'FILE_02',
    client: 'AL_MIZAN_ADVISORY',
    role: 'UI_UX_DESIGN',
    title: 'WEALTH_ARCHITECTURE',
    desc: 'Repositioned GCC advisory firm as technical authority via dossier-style interface and AI Strategic Insight Engine.',
    metric: 'QUALIFIED_INQUIRIES_UP_3_2X',
    image: '/assets/portfolio/almizan_1.png',
    folder: 'almizan',
    tags: ['WEALTH_STRATEGY', 'GCC_MARKETS', 'AI'],
    year: '2023',
    sector: 'ADVISORY / AI',
    longDesc: 'Development of a "Digital Private Office" for high-net-worth individuals. The interface utilizes a dossier-style layout to present complex wealth structuring data. An integrated AI Insight Engine processes market signals to provide hyper-personalized investment memos, transforming the advisory relationship from reactive to proactive.',
    gallery: [
      { title: 'DOSSIER_INTERFACE', desc: 'Information architecture inspired by classified intelligence files.', image: '/assets/portfolio/almizan_2.png' },
      { title: 'AI_INSIGHT_WIDGET', desc: 'Natural language processing for market sentiment analysis.', image: '/assets/portfolio/almizan_3.png' },
      { title: 'PORTFOLIO_VISUALIZATION', desc: 'Tree-map generation for multi-asset allocation views.', image: '/assets/portfolio/almizan_4.png' },
      { title: 'CLIENT_ONBOARDING', desc: 'Streamlined KYC process reducing friction for HNWI clients.', image: '/assets/portfolio/almizan_5.png' },
      { title: 'REPORT_GENERATION', desc: 'Automated PDF synthesis for quarterly performance reviews.', image: '/assets/portfolio/almizan_6.png' },
      { title: 'DARK_MODE_THEME', desc: 'High-contrast aesthetic for low-light trading environments.', image: '/assets/portfolio/almizan_7.png' }
    ]
  },
  {
    id: 'FILE_03',
    client: 'VERIDIAN_DOCS',
    role: 'PRODUCT_ENGINEERING',
    title: 'TECHNICAL_CLARITY_SYSTEMS',
    desc: 'Built a CLI-like documentation platform for RegTech clients using border-driven grids and canvas-generated depth.',
    metric: 'ENTERPRISE_RETAINERS_CLOSED',
    image: '/assets/portfolio/veridian_1.png',
    folder: 'veridian',
    tags: ['REGTECH', 'DEVELOPER_TOOLS', 'SYSTEMS'],
    year: '2025',
    sector: 'SAAS / DEV_TOOLS',
    longDesc: 'A documentation platform designed for engineering teams in highly regulated industries. The UI mimics a Command Line Interface (CLI) to reduce context switching for developers, while offering powerful search and versioning capabilities. The aesthetic uses border-driven grids to establish hierarchy without visual clutter.',
    gallery: [
      { title: 'CLI_SEARCH_MODULE', desc: 'Command-palette style navigation for rapid documentation lookup.', image: '/assets/portfolio/veridian_2.png' },
      { title: 'API_REFERENCE', desc: 'Auto-generated swagger UI with interactive testing console.', image: '/assets/portfolio/veridian_3.png' },
      { title: 'VERSION_CONTROL_UI', desc: 'Visualizing diffs between regulatory compliance versions.', image: '/assets/portfolio/veridian_4.png' },
      { title: 'GRID_LAYOUT_SYSTEM', desc: 'Responsive grid architecture handling dense technical data.', image: '/assets/portfolio/veridian_5.png' },
      { title: 'INTERACTIVE_EXAMPLES', desc: 'Live code sandboxes embedded within regulatory guides.', image: '/assets/portfolio/veridian_6.png' },
      { title: 'CANVAS_DEPTH_MAP', desc: 'WebGL background effects representing data topology.', image: '/assets/portfolio/veridian_7.png' }
    ]
  }
];

const Portfolio: React.FC<PortfolioProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Entrance Animation for List View
  useGSAP(() => {
    if (!selectedProject) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo('.port-header-line', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'expo.out' })
        .fromTo('.port-identity', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=1.2')
        .fromTo('.port-bio', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
        .fromTo('.project-row', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.6');
    }
  }, { scope: containerRef, dependencies: [selectedProject] });

  // Entrance Animation for Detail View
  useGSAP(() => {
    if (selectedProject) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      // Ensure elements are visible at start of animation by using fromTo
      tl.fromTo('.case-fade-in', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 }
        )
        .fromTo('.case-line-reveal', 
          { scaleX: 0 }, 
          { scaleX: 1, duration: 1.2, ease: 'expo.out' }, '-=0.8'
        )
        .fromTo('.case-img-reveal', 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 }, '-=0.6'
        );
    }
  }, { scope: detailRef, dependencies: [selectedProject] });

  const handleOpenProject = (project: typeof PROJECTS[0]) => {
    // Animate out list view
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setSelectedProject(project);
          window.scrollTo(0, 0);
        }
      });
    } else {
      setSelectedProject(project);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    // Animate out detail view
    if (detailRef.current) {
      gsap.to(detailRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setSelectedProject(null);
          window.scrollTo(0, 0);
        }
      });
    } else {
      setSelectedProject(null);
      window.scrollTo(0, 0);
    }
  };

  // ===========================================
  // MINI CASE STUDY VIEW
  // ===========================================
  if (selectedProject) {
    return (
      <div key="detail-view" ref={detailRef} className="w-full max-w-[1300px] mx-auto pt-24 pb-24 px-6 md:px-12 relative min-h-screen">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-16 md:mb-24 pb-6 border-b border-current/10 case-line-reveal origin-left">
          <button 
            onClick={handleBack}
            className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity group py-2"
          >
            <ArrowLeft size={16} strokeWidth={1} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[8px] tracking-[0.4em] font-light uppercase">ARCHIVE</span>
          </button>
          
          <div className="hidden md:flex items-center gap-3 text-[7px] tracking-[0.2em] uppercase opacity-30 font-mono">
            <span>CASE STUDY</span>
            <span>/</span>
            <span>SYSTEM LOG {selectedProject.id.split('_')[1] || '00'}</span>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-24">
          
          {/* Header Block */}
          <div className="col-span-12 flex flex-col gap-6 mb-16 case-fade-in">
             <span className="text-[8px] tracking-[0.3em] opacity-40 uppercase font-mono block">
               {selectedProject.year} / SYSTEM ARCHITECTURE
             </span>
             <h1 className="text-[clamp(2rem,6vw,5.5rem)] font-[100] leading-[0.85] tracking-tight uppercase -ml-1 break-words">
               {selectedProject.title.replace(/_/g, ' ')}
             </h1>
          </div>

          {/* Meta Grid */}
          <div className="col-span-12 md:col-start-4 md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-24 case-fade-in">
             <div className="space-y-2 border-l border-current/10 pl-4 md:border-0 md:pl-0">
                <h4 className="text-[8px] tracking-[0.2em] opacity-40 uppercase mb-1">CLIENT</h4>
                <p className="text-[11px] tracking-[0.1em] font-medium uppercase">{selectedProject.client.replace(/_/g, ' ')}</p>
             </div>
             <div className="space-y-2 border-l border-current/10 pl-4 md:border-0 md:pl-0">
                <h4 className="text-[8px] tracking-[0.2em] opacity-40 uppercase mb-1">SECTOR</h4>
                <p className="text-[11px] tracking-[0.1em] font-medium uppercase">{selectedProject.sector}</p>
             </div>
             <div className="space-y-2 border-l border-current/10 pl-4 md:border-0 md:pl-0">
                <h4 className="text-[8px] tracking-[0.2em] opacity-40 uppercase mb-1">ROLE</h4>
                <p className="text-[11px] tracking-[0.1em] font-medium uppercase">{selectedProject.role.replace(/_/g, ' ')}</p>
             </div>
          </div>

          {/* Hero Image */}
          <div className="col-span-12 mb-24 case-img-reveal">
            <div className={`w-full aspect-[21/9] border border-current/10 flex items-center justify-center relative overflow-hidden group ${isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-100'}`}>
              
              {/* Geometric Fallback (Visible behind image or if image fails) */}
              <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20">
                 <div className="w-[120%] h-px bg-current/10 absolute rotate-12"></div>
                 <div className="w-[120%] h-px bg-current/10 absolute -rotate-12"></div>
                 <div className="w-[40%] h-[40%] border border-current/10 rounded-full flex items-center justify-center">
                    <div className="w-[60%] h-[60%] border border-current/10 rounded-full"></div>
                 </div>
              </div>

              {/* Grain Texture */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_filmgrain.png')] z-10 pointer-events-none"></div>
              
              <img 
                src={selectedProject.image} 
                alt="System Overview"
                // Added object-center to ensure cropping happens from the middle
                className="w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 relative z-20"
                onError={(e) => {
                  console.log("Failed to load hero:", (e.target as HTMLImageElement).src);
                }} 
              />
              <span className="absolute bottom-4 left-4 text-[7px] tracking-[0.2em] uppercase opacity-60 bg-black/80 px-2 py-1 backdrop-blur-sm text-white z-30">System Overview</span>
            </div>
          </div>

          {/* Description */}
          <div className="col-span-12 md:col-start-4 md:col-span-6 mb-24 case-fade-in">
            <p className="text-[11px] md:text-[13px] leading-[1.8] tracking-[0.05em] font-light opacity-80">
              {selectedProject.longDesc}
            </p>
          </div>

          {/* Mini Case Study Gallery - 6 Items */}
          <div className="col-span-12 mb-12 case-fade-in">
             <div className="flex items-center gap-4 opacity-20 mb-8">
                <span className="text-[7px] tracking-[0.4em] font-mono uppercase">CASE_LOGS</span>
                <div className="h-px flex-1 bg-current" />
             </div>
          </div>

          <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mb-24">
             {selectedProject.gallery.map((item, idx) => (
                <div key={idx} className="case-img-reveal flex flex-col gap-4">
                   <div className={`w-full aspect-[4/3] border border-current/10 relative overflow-hidden group ${isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-100'}`}>
                      <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_filmgrain.png')] z-20 pointer-events-none"></div>
                      
                      {/* Geometric Placeholder Art (Background Fallback) */}
                      <div className="absolute inset-0 flex items-center justify-center z-0">
                         <div className="w-full h-px bg-current/10 absolute top-1/4"></div>
                         <div className="w-full h-px bg-current/10 absolute bottom-1/4"></div>
                         <div className="h-full w-px bg-current/10 absolute left-1/4"></div>
                         <div className="h-full w-px bg-current/10 absolute right-1/4"></div>
                         
                         <div className={`w-16 h-16 border border-current/20 rounded-full flex items-center justify-center`}>
                            <div className="w-1 h-1 bg-current/40"></div>
                         </div>
                         
                         <span className="absolute bottom-2 right-2 text-[6px] tracking-[0.2em] opacity-20 font-mono">IMG_LOG_0{idx+1}</span>
                      </div>

                      {/* Actual Image - Loads on top of placeholder */}
                      <img 
                        src={item.image}
                        alt={item.title}
                        // Added object-center to ensure cropping happens from the middle
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 z-10"
                        onError={(e) => {
                          console.log("Failed to load gallery:", (e.target as HTMLImageElement).src);
                        }}
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-current/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                   </div>
                   
                   <div className="border-l border-current/10 pl-4">
                      <h5 className="text-[8px] tracking-[0.2em] font-bold uppercase mb-1.5">{item.title.replace(/_/g, ' ')}</h5>
                      <p className="text-[9px] leading-relaxed tracking-[0.05em] font-light opacity-60 max-w-[90%]">{item.desc}</p>
                   </div>
                </div>
             ))}
          </div>

        </section>

        {/* Footer for Case Study */}
        <footer className="pt-12 border-t border-current/10 flex justify-between items-end case-fade-in">
           <div>
              <span className="block text-[8px] tracking-[0.2em] opacity-30 mb-2">IXILIS ARCHIVE</span>
              <span className="block text-[8px] tracking-[0.2em] font-mono opacity-20">{selectedProject.id} // END OF LOG</span>
           </div>
           <button onClick={handleBack} className="text-[9px] tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 py-2">
              Back to Index <ArrowUpRight size={12} />
           </button>
        </footer>

      </div>
    );
  }

  // ===========================================
  // DEFAULT LIST VIEW
  // ===========================================
  return (
    <div key="list-view" ref={containerRef} className="w-full max-w-[1200px] mx-auto py-20 px-6 md:px-0 relative min-h-screen">
      
      {/* 01. HEADER IDENTITY BLOCK */}
      <header className="mb-32 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div className="port-identity space-y-2">
            <span className="block text-[7px] tracking-[0.4em] font-mono opacity-40 uppercase">
              IDENTITY_VERIFIED // [ C.FERREIRA ]
            </span>
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-[100] leading-[0.9] tracking-tight uppercase">
              SENIOR<br/>PRODUCT<br/>DESIGNER
            </h1>
          </div>
          
          <div className="port-bio max-w-md text-right mt-8 md:mt-0">
             <div className="flex flex-col items-end gap-1 mb-4 text-[7px] tracking-[0.3em] font-mono opacity-30">
                <span className="flex items-center gap-2">LOC: PORTLAND <MapPin size={8} /></span>
                <span className="flex items-center gap-2">ORG: IBM <Hash size={8} /></span>
             </div>
             <p className="text-[10px] md:text-[11px] leading-[1.8] tracking-[0.1em] font-light uppercase opacity-70">
               I design human-centered SaaS shaped by a lifelong curiosity for how people move through the world. Currently bridging design and technology at IBM.
             </p>
          </div>
        </div>
        
        <div className="port-header-line w-full h-px bg-current opacity-20 origin-left" />
        
        <div className="absolute top-full right-0 mt-2 flex gap-4">
           <button className="text-[7px] tracking-[0.3em] font-bold uppercase opacity-40 hover:opacity-100 flex items-center gap-2 transition-all">
             DOWNLOAD_CV <Download size={8} />
           </button>
        </div>
      </header>


      {/* 02. PROJECT INDEX */}
      <section className="space-y-24">
         <div className="flex items-center gap-4 opacity-20 mb-12">
            <span className="text-[7px] tracking-[0.4em] font-mono uppercase">ARCHIVE_INDEX</span>
            <div className="h-px flex-1 bg-current" />
         </div>

         {PROJECTS.map((proj, idx) => (
           <div 
             key={proj.id}
             onClick={() => handleOpenProject(proj)}
             onMouseEnter={() => setHoveredProject(proj.id)}
             onMouseLeave={() => setHoveredProject(null)}
             className="project-row group relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-b border-current/10 pb-16 last:border-0 cursor-pointer"
           >
              {/* ID Column */}
              <div className="md:col-span-1 pointer-events-none">
                 <span className="text-[7px] tracking-[0.3em] font-mono opacity-30 block mb-2">{proj.id}</span>
                 <span className="text-[7px] tracking-[0.3em] font-mono opacity-30 block">0{idx + 1}</span>
              </div>

              {/* Main Info */}
              <div className="md:col-span-4 z-10 relative pointer-events-none">
                 <div className="mb-6">
                    <span className="text-[8px] tracking-[0.2em] font-bold opacity-40 uppercase block mb-1">{proj.client.replace(/_/g, ' ')}</span>
                    <h2 className="text-[2rem] leading-[0.9] font-[200] uppercase tracking-wide group-hover:tracking-wider transition-all duration-500">
                      {proj.title.replace(/_/g, ' ')}
                    </h2>
                 </div>
                 <p className="text-[10px] leading-[1.8] tracking-[0.05em] font-light opacity-60 max-w-xs mb-6">
                   {proj.desc}
                 </p>
                 <div className="flex flex-wrap gap-2">
                    {proj.tags.map(tag => (
                      <span key={tag} className="text-[6px] border border-current/10 px-2 py-1 uppercase tracking-[0.2em] opacity-40 font-mono">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Visual Evidence (Image) */}
              <div className="md:col-span-7 relative h-[300px] md:h-[400px] w-full overflow-hidden border border-current/10 group-hover:border-current/30 transition-colors duration-500 pointer-events-none">
                 {/* Image */}
                 <div className={`w-full h-full relative ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                    <img 
                      src={proj.image}
                      alt={proj.title}
                      // Added object-center to ensure cropping happens from the middle
                      className="w-full h-full object-cover object-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      onError={(e) => {
                        console.log("Failed to load list image:", (e.target as HTMLImageElement).src);
                      }}
                    />
                    
                    {/* Fallback Text if Image Missing */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <span className="text-[6px] tracking-[0.5em] font-mono opacity-10 uppercase">VISUAL_DATA_MISSING</span>
                    </div>

                    {/* Overlay Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />
                 </div>

                 {/* Corner UI */}
                 <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-1">
                    <span className="text-[6px] tracking-[0.3em] font-mono opacity-100 bg-current text-white dark:text-black px-2 py-0.5 uppercase">
                      {proj.role.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[6px] tracking-[0.3em] font-mono opacity-50 uppercase">
                      METRIC: {proj.metric}
                    </span>
                 </div>
                 
                 {/* Interactive Cursor hint */}
                 <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
                    <span className="text-[8px] tracking-[0.2em] uppercase font-bold bg-black text-white px-2 py-1">OPEN CASE</span>
                    <ArrowUpRight size={20} strokeWidth={1} />
                 </div>
              </div>
           </div>
         ))}
      </section>

      {/* 03. FOOTER BIO DATA */}
      <section className="mt-40 border-t border-current/10 pt-20 pb-20">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <h3 className="text-[14px] font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-2">
                 <span className="w-2 h-2 bg-current" />
                 ORIGIN_DATA
               </h3>
               <div className="space-y-6 text-[10px] md:text-[11px] leading-[2] tracking-[0.05em] opacity-70 font-light uppercase">
                  <p>
                    BORN IN COPENHAGEN. RAISED AMONG ARCHIVES.
                  </p>
                  <p>
                    My work is driven by a belief that ethical and thoughtful design can make even the most technical systems more humane. Bridging the gap between the chaotic nature of human intuition and the rigid logic of machine intelligence.
                  </p>
               </div>
            </div>
            
            <div className="flex flex-col justify-between">
               <div className="grid grid-cols-2 gap-4 text-[8px] tracking-[0.2em] font-mono opacity-50 uppercase">
                  <div>
                     <span className="block opacity-30 mb-1">STATUS</span>
                     ACTIVE
                  </div>
                  <div>
                     <span className="block opacity-30 mb-1">EXPERIENCE</span>
                     8+ YEARS
                  </div>
                  <div>
                     <span className="block opacity-30 mb-1">FOCUS</span>
                     AI / SYSTEMS
                  </div>
                  <div>
                     <span className="block opacity-30 mb-1">CONTACT</span>
                     <a href="mailto:chris@example.com" className="hover:text-current hover:underline">EMAIL_ME</a>
                  </div>
               </div>
               
               <div className="mt-12 md:mt-0 text-right">
                  <span className="text-[10rem] leading-[0.7] font-[100] opacity-5 select-none pointer-events-none block translate-y-4">
                    CF
                  </span>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Portfolio;
