import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ArtifactsProps {
  isDarkMode: boolean;
  onNavigate?: (view: 'hero' | 'about' | 'artifacts' | 'contact') => void;
}

const Artifacts: React.FC<ArtifactsProps> = ({ isDarkMode, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEntry, setSelectedEntry] = useState(0);
  
  const entries = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1).padStart(2, '0'),
    label: `ENTRY ${String(i + 1).padStart(2, '0')}`,
    status: i === 0 ? 'ACTIVE' : `VER_${i}`,
    timestamp: `2024.${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}.${String(Math.floor(Math.random() * 31) + 1).padStart(2, '0')}`
  }));

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.from('.entry-title', { y: -20, duration: 0.8, clearProps: 'all' })
      .from('.entry-subtitle', { x: -15, duration: 0.6, clearProps: 'all' }, '-=0.5')
      .from('.entry-list-item', { x: -10, duration: 0.5, stagger: 0.08, clearProps: 'all' }, '-=0.3');
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`h-screen w-full overflow-hidden px-6 md:px-10 lg:px-16 py-8 md:py-10 flex flex-col ${isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>
      
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 mb-6">
        <div className="entry-subtitle text-[7px] md:text-[8px] tracking-[0.4em] uppercase opacity-60 mb-2">
          SUBTITLE // ARTIFACT_ARCHIVE
        </div>
        <h1 className="entry-title text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-[100] uppercase tracking-[0.05em] leading-none mb-3">
          MAIN TITLE
        </h1>
        <p className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase opacity-50 leading-relaxed max-w-md">
          Procedural extraction of latent space artifacts. Sequential indexing and metadata verification active.
        </p>
      </div>

      {/* Scrollable List Section (takes remaining space) */}
      <div className="flex-grow overflow-y-auto pr-2 mb-6 scrollbar-thin">
        <div className="space-y-1 max-w-xl pb-4">
          {entries.map((entry, i) => (
            <button
              key={i}
              onClick={() => setSelectedEntry(i)}
              className="entry-list-item w-full text-left transition-all duration-300 group"
            >
              <div className={`border transition-all duration-300 p-4 md:p-5 ${
                selectedEntry === i 
                  ? `${isDarkMode ? 'border-white' : 'border-black'} bg-transparent`
                  : `${isDarkMode ? 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/40' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-100/40'}`
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] md:text-[11px] tracking-[0.25em] font-mono ${
                    selectedEntry === i ? 'opacity-100' : 'opacity-70'
                  }`}>
                    {entry.label}
                  </span>
                  {selectedEntry === i && (
                    <span className={`text-[7px] tracking-[0.3em] uppercase ${isDarkMode ? 'opacity-100' : 'opacity-50'}`}>◉</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Section (Detail + Nav) */}
      <div className="flex-shrink-0">
        {/* Selected Entry Detail */}
        <div className={`max-w-2xl border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-300'} pt-4 mb-4`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[7px] tracking-[0.2em] uppercase">
            <div className={`${isDarkMode ? 'opacity-50' : 'opacity-60'}`}>ID_CODE</div>
            <div className="font-mono opacity-100">{entries[selectedEntry].id}</div>
            <div className="md:col-span-1"></div>
            
            <div className={`${isDarkMode ? 'opacity-50' : 'opacity-60'}`}>STATUS</div>
            <div className="font-mono opacity-100">{entries[selectedEntry].status}</div>
            <div className="md:col-span-1"></div>
            
            <div className={`${isDarkMode ? 'opacity-50' : 'opacity-60'}`}>TIMESTAMP</div>
            <div className="md:col-span-2 font-mono opacity-100">{entries[selectedEntry].timestamp}</div>
          </div>
        </div>

        {/* Bottom Descriptions */}
        <div className={`flex justify-between items-end text-[6px] tracking-[0.2em] uppercase ${isDarkMode ? 'opacity-40' : 'opacity-50'}`}>
          <div>DESC_LEFT</div>
          <div>DESC_RIGHT</div>
        </div>

        {/* Bottom Navigation */}
        {onNavigate && (
          <div className={`flex justify-between items-center pt-4 border-t ${isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200'}`}>
            <div className={`uppercase tracking-[0.2em] text-[7px] ${isDarkMode ? 'opacity-40' : 'opacity-50'}`}>
              XILYAS // ARCHIVE
            </div>
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => onNavigate('hero')}
                className={`text-[7px] tracking-[0.2em] uppercase transition-opacity border px-4 py-2 ${isDarkMode ? 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100' : 'border-zinc-300 hover:border-zinc-400 opacity-60 hover:opacity-100'}`}
              >
                HOME
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className={`text-[7px] tracking-[0.2em] uppercase transition-opacity border px-4 py-2 ${isDarkMode ? 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100' : 'border-zinc-300 hover:border-zinc-400 opacity-60 hover:opacity-100'}`}
              >
                CONTACT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artifacts;