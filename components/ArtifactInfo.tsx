import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ArtifactInfoProps {
  isDarkMode: boolean;
  artifactId: string;
  onBack?: () => void;
  onNext?: (artifactId: string) => void;
  onAssetClick?: (assetIndex: number) => void;
}

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
  media: string[];  // SUB-MEDIA items for this artifact
  tabSections?: TabSection[];
}

interface TabSection {
  id: string;
  label: string;
  content: string;
}

interface ExtendedArtifact extends ArtifactEntry {
  detailedDescription?: string;
  metadata?: Record<string, string>;
}

const ArtifactInfo: React.FC<ArtifactInfoProps> = ({ 
  isDarkMode, 
  artifactId,
  onBack,
  onNext,
  onAssetClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSubMediaIndex, setActiveSubMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullscreen, setShowFullscreen] = useState(false);

  const entries: ExtendedArtifact[] = [
    {
      id: '01',
      label: 'ENTRY 01',
      status: 'ACTIVE',
      timestamp: '2024.08.11',
      thumbnail: '/assets/sacred-patterns-thumb.png',
      description: 'Generative geometry with rotational symmetry',
      detailedDescription: `This project explores generative geometry through rotational symmetry algorithms. The system creates intricate patterns by applying mathematical transformations to base geometric forms.

The core algorithm utilizes polar coordinate systems to distribute elements radially, creating visually balanced compositions. Each iteration introduces subtle variations while maintaining overall structural harmony.

Key features include:
- Dynamic symmetry axes that respond to user input
- Procedural pattern generation with seeded randomness
- Color palette harmonization based on complementary theory
- Export capabilities for high-resolution outputs

The underlying Python implementation leverages numpy for efficient matrix operations and matplotlib for rendering. Performance optimizations allow real-time preview of parameter adjustments.

Future iterations will incorporate machine learning models to predict aesthetically pleasing configurations based on user preferences and historical data.`,
      sourceUrl: 'https://github.com/you/repo/blob/main/SacredPatterns.py',
      downloadUrl: '/assets/sacred-patterns.png',
      type: 'python',
      media: ['/assets/sacred-patterns-1a.png', '/assets/sacred-patterns-1b.png', '/assets/sacred-patterns-1c.png'],
      metadata: {
        'Language': 'Python 3.11',
        'Dependencies': 'numpy, matplotlib, pillow',
        'License': 'MIT',
        'Last Updated': '2024.08.11',
        'Lines of Code': '1,247',
        'Repository Size': '2.3 MB'
      },
      tabSections: [
        { id: 'overview', label: 'OVERVIEW', content: `This project explores generative geometry through rotational symmetry algorithms. The system creates intricate patterns by applying mathematical transformations to base geometric forms.` },
        { id: 'process', label: 'PROCESS', content: `The core algorithm utilizes polar coordinate systems to distribute elements radially, creating visually balanced compositions. Each iteration introduces subtle variations while maintaining overall structural harmony.` },
        { id: 'tech', label: 'TECHNICAL', content: `The underlying Python implementation leverages numpy for efficient matrix operations and matplotlib for rendering. Performance optimizations allow real-time preview of parameter adjustments.` }
      ]
    },
    {
      id: '02',
      label: 'ENTRY 02',
      status: 'VER_2',
      timestamp: '2024.03.15',
      thumbnail: '/assets/default-placeholder.png',
      description: 'Coming soon',
      detailedDescription: 'Detailed description for Entry 02 will appear here.',
      sourceUrl: '#',
      type: 'python',
      media: ['/assets/default-placeholder-a.png', '/assets/default-placeholder-b.png', '/assets/default-placeholder-c.png'],
      metadata: {
        'Status': 'Under Development',
        'Version': '2.0'
      },
      tabSections: [
        { id: 'overview', label: 'OVERVIEW', content: 'Entry 02 overview content.' },
        { id: 'process', label: 'PROCESS', content: 'Entry 02 process details.' },
        { id: 'tech', label: 'TECHNICAL', content: 'Entry 02 technical specifications.' }
      ]
    }
  ];

  const entry = entries.find(e => e.id === artifactId) || entries[0];
  const subMedia = entry.media || [entry.thumbnail];
  const currentMedia = subMedia[activeSubMediaIndex];

  useEffect(() => {
    setActiveSubMediaIndex(0);
  }, [artifactId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (showFullscreen) {
          setShowFullscreen(false);
        } else {
          onBack?.();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleFullscreenToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreen, activeSubMediaIndex, subMedia.length, onBack]);

  useEffect(() => {
    if (showFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFullscreen]);

  const handleNext = () => {
    // Navigate to next ARTIFACT ENTRY
    const currentIndex = entries.findIndex(e => e.id === artifactId);
    const nextIndex = (currentIndex + 1) % entries.length;
    
    if (onNext) {
      onNext(entries[nextIndex].id);
    }
  };

  const handlePrev = () => {
    // Navigate to previous ARTIFACT ENTRY
    const currentIndex = entries.findIndex(e => e.id === artifactId);
    const prevIndex = (currentIndex - 1 + entries.length) % entries.length;
    
    if (onNext) {
      onNext(entries[prevIndex].id);
    }
  };

  const handleFullscreenToggle = () => {
    setShowFullscreen(prev => !prev);
  };

  return (
    <div ref={containerRef} className={`w-full h-screen flex ${isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>
      
      {/* Fullscreen Overlay */}
      <div className={`fixed inset-0 z-50 ${
        isDarkMode ? 'bg-black/95' : 'bg-white/95'
      } flex items-center justify-center transition-opacity duration-300 ${
        showFullscreen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="relative w-full h-full pt-16 md:pt-20 p-4 md:p-8">
          <button
            onClick={handleFullscreenToggle}
            className={`absolute top-20 right-10 z-50 text-[7px] md:text-[8px] tracking-[0.2em] uppercase
                opacity-50 hover:opacity-100 transition-all ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            [ CLOSE FULLSCREEN ]
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {currentMedia.endsWith('.mp4') || currentMedia.endsWith('.webm') ? (
              <video
                src={currentMedia}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={currentMedia}
                alt={entry.label}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Left Panel - Media Display */}
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-10 border-r border-zinc-800">
        
        {/* Header Row: ID + Fullscreen */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-60">
            ID: <span className="font-mono opacity-100">{entry.id}</span>
          </div>
          
          <button
            onClick={handleFullscreenToggle}
            className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase transition-all duration-300 
              opacity-50 hover:opacity-100 ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            FULLSCREEN
          </button>
        </div>

        {/* Media Display Area */}
        <div className="flex-1 flex items-center justify-center relative min-h-0">
          <div className={`relative w-full aspect-square max-h-[calc(100vh-200px)] 
            border ${isDarkMode ? 'border-zinc-800' : 'border-zinc-300'} overflow-hidden rounded-lg`}>
            
            {currentMedia.endsWith('.mp4') || currentMedia.endsWith('.webm') ? (
              <video
                src={currentMedia}
                className="w-full h-full object-cover cursor-pointer"
                loop
                muted
                playsInline
                autoPlay
                onClick={() => {
                  handleFullscreenToggle();
                  onAssetClick?.(activeSubMediaIndex);
                }}
              />
            ) : (
              <img
                src={currentMedia}
                alt={entry.label}
                className="w-full h-full object-cover cursor-pointer"
                loading="lazy"
                onClick={() => {
                  handleFullscreenToggle();
                  onAssetClick?.(activeSubMediaIndex);
                }}
              />
            )}

            {/* Hover overlay */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} 
              invisible hover:visible transition-all duration-300 flex items-center justify-center`}>
              <span className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase font-mono opacity-90">
                [ CLICK FOR FULLSCREEN ]
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Media Count + Thumbnail Strip */}
        <div className="mt-4">
          <div className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-40 mb-2">
            MEDIA {activeSubMediaIndex + 1}/{subMedia.length}
          </div>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
            {subMedia.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveSubMediaIndex(i)}
                className={`flex-shrink-0 w-24 h-16 rounded border transition-all ${
                  i === activeSubMediaIndex
                    ? `${isDarkMode ? 'border-white' : 'border-black'} opacity-100`
                    : `${isDarkMode ? 'border-zinc-800' : 'border-zinc-300'} opacity-50 hover:opacity-100`
                }`}
              >
                <img src={src} className="w-full h-full object-cover rounded" alt="" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Info Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Row: Meta Data + Tabs + Back */}
        <div className="p-4 md:p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className={`text-[7px] md:text-[8px] tracking-[0.4em] uppercase ${isDarkMode ? 'opacity-60' : 'opacity-70'}`}>
                META DATA
              </span>
              
              {/* Tab Buttons <1> */}
              <div className="flex gap-2">
                {entry.tabSections?.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-[7px] tracking-[0.2em] uppercase px-3 py-1 transition-all border-b-2 ${
                      activeTab === tab.id
                        ? `${isDarkMode ? 'border-white opacity-100' : 'border-black opacity-100'}`
                        : `${isDarkMode ? 'border-transparent opacity-50' : 'border-transparent opacity-50'} hover:opacity-100`
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {onBack && (
              <button
                onClick={onBack}
                className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase transition-all duration-300 
                  opacity-50 hover:opacity-100 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                ‹ BACK
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Description Section */}
        <div ref={scrollContainerRef} className={`flex-1 overflow-y-auto p-4 md:p-6 
          scrollbar-thin ${isDarkMode ? 'scrollbar-thumb-zinc-700' : 'scrollbar-thumb-zinc-300'}`}>
          
          <div className="mb-6">
            <h4 className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase opacity-60 mb-3">
              DESCRIPTION
            </h4>
            <div className={`prose prose-sm ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
              <p className="text-[7px] md:text-[8px] tracking-[0.15em] leading-relaxed opacity-70 whitespace-pre-line">
                {entry.tabSections?.find(t => t.id === activeTab)?.content || entry.detailedDescription}
              </p>
            </div>
          </div>

          {/* Static Technical Specs */}
          <div className="border-t border-zinc-800 pt-6">
            <h4 className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase opacity-60 mb-3">
              SPECS
            </h4>
            <div className="space-y-2">
              {entry.metadata && Object.entries(entry.metadata).map(([key, value], index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <span className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-50">
                    {key}
                  </span>
                  <span className="font-mono text-[7px] md:text-[8px] tracking-[0.1em] col-span-2 opacity-100">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Navigation Button */}
        <div className="p-4 md:p-6 border-t border-zinc-800">
          <div className="flex items-center justify-end">
            <button
              onClick={handleNext}
              className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase transition-all duration-300 
                px-4 py-2 border ${
                isDarkMode 
                  ? 'border-white/20 hover:border-white/40 opacity-60 hover:opacity-100' 
                  : 'border-black/20 hover:border-black/40 opacity-60 hover:opacity-100'
              }`}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactInfo;