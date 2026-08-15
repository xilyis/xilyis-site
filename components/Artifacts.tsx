import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ArtifactEntry {
  id: string;
  label: string;
  status: string;
  timestamp: string;
  thumbnail: string;
  description: string;
  sourceUrl: string;
  downloadUrl?: string;
  type: 'python' | 'web' | 'other';
}

interface ArtifactsProps {
  isDarkMode: boolean;
  onNavigate?: (view: 'hero' | 'about' | 'artifacts' | 'contact') => 
void;
  onNavigateToDetail?: (artifactId: string) => void;
}

const Artifacts: React.FC<ArtifactsProps> = ({ 
  isDarkMode, 
  onNavigate,
onNavigateToDetail
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEntry, setSelectedEntry] = useState(0);
  
  const entries = [
  {
    id: '01',
    label: 'ENTRY 01',
    status: 'ACTIVE',
    timestamp: '2024.08.11',
    thumbnail: '/assets/default-placeholder.png',
    description: 'Coming soon...',
    sourceUrl: '#',
    downloadUrl: '/assets/default-placeholder.png',
    type: 'python',
    media: ['/assets/default-placeholder.png', '/assets/default-placeholder.png']
  },

  {
    id: '02',
    label: 'ENTRY 02',
    status: 'VER_2',
    timestamp: '2024.03.15',
    thumbnail: '/assets/default-placeholder.png',
    description: 'Coming soon...',
    sourceUrl: '#',
    type: 'python',
    media: ['/assets/default-placeholder.png']
  }
];

    useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.from('.entry-title', { y: -20, duration: 0.8, clearProps: 'all' })
      .from('.entry-subtitle', { x: -15, duration: 0.6, clearProps: 'all' }, '-=0.5')
      .from('.entry-list-item', { x: -10, duration: 0.5, stagger: 0.08, clearProps: 'all' }, '-=0.3');
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`h-screen w-full overflow-hidden px-4 md:px-6 lg:px-10 py-4 md:py-5 flex flex-col ${isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>
      
      {/* Header Section */}
      <div className="mb-6">
        <div className="entry-subtitle text-[7px] md:text-[8px] tracking-[0.4em] uppercase opacity-60 mb-2">
          {entries[selectedEntry].status} // ARTIFACT_ARCHIVE
        </div>
        <h1 className="entry-title text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-[100] uppercase tracking-[0.05em] leading-none mb-2">
          {entries[selectedEntry].label}
        </h1>
        <p className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase opacity-50 leading-relaxed max-w-md">
          {entries[selectedEntry].description}
        </p>
      </div>

      {/* List Section - Fixed height, scrolling internally */}
      <div 
        className="overflow-y-auto pr-2 mb-6 scrollbar-thin"
        style={{ height: '280px' }}
      >
        <div className="space-y-1 max-w-xl pb-4">
          {entries.map((entry, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedEntry(i);
              onNavigateToDetail?.(entry.id);
              }}
              className="entry-list-item w-full text-left transition-all duration-300 group"
            >
              <div className={`border transition-all duration-300 p-3 md:p-4 ${
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
                  <span className={`text-[7px] tracking-[0.2em] px-2 py-1 border ${
                    isDarkMode ? 'border-zinc-800' : 'border-zinc-300'
                  }`}>
                    {entry.type.toUpperCase()}
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

      {/* Bottom Section */}
      <div className="max-w-2xl border-t border-zinc-800 pt-4">
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[7px] tracking-[0.2em] uppercase">
          <div className={`${isDarkMode ? 'opacity-50' : 'opacity-60'}`}>ID_CODE</div>
          <div className="font-mono opacity-100">{entries[selectedEntry].id}</div>
          <div className="md:col-span-1"></div>
          <div className={`${isDarkMode ? 'opacity-50' : 'opacity-60'}`}>STATUS</div>
          <div className="font-mono opacity-100">{entries[selectedEntry].status}</div>
          <div className="md:col-span-1"></div>
          <div className={`${isDarkMode ? 'opacity-50' : 'opacity-60'}`}>TIMESTAMP</div>
          <div className="md:col-span-2 font-mono opacity-100">{entries[selectedEntry].timestamp}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          {entries[selectedEntry].downloadUrl && entries[selectedEntry].downloadUrl !== '#' && (
            <a 
              href={entries[selectedEntry].downloadUrl}
              download
              className="text-[7px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 border border-current/20 px-3 py-1.5 transition-all"
            >
              ↓ DOWNLOAD
            </a>
          )}
          <a 
            href={entries[selectedEntry].sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[7px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 border border-current/20 px-3 py-1.5 transition-all"
          >
            📄 VIEW SOURCE
          </a>
        </div>

        {/* Navigation */}
        {onNavigate && (
          <div className={`flex justify-between items-center pt-4 mt-4 border-t ${isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200'}`}>
            <div className={`uppercase tracking-[0.2em] text-[7px] ${isDarkMode ? 'opacity-40' : 'opacity-50'}`}>
              XILYAS // ARCHIVE
            </div>
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => onNavigate('hero')}
                className={`text-[7px] tracking-[0.2em] uppercase transition-opacity border px-3 py-1.5 ${isDarkMode ? 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100' : 'border-zinc-300 hover:border-zinc-400 opacity-60 hover:opacity-100'}`}
              >
                HOME
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className={`text-[7px] tracking-[0.2em] uppercase transition-opacity border px-3 py-1.5 ${isDarkMode ? 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100' : 'border-zinc-300 hover:border-zinc-400 opacity-60 hover:opacity-100'}`}
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