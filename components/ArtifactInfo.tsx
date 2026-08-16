import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ArtifactInfoProps {
  isDarkMode: boolean;
  artifactId: string;
  onBack?: () => void;
  onNext?: () => void;
  onFullscreenToggle?: () => void;
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
  media: string[];
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
  onFullscreenToggle,
  onAssetClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
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
      media: ['/assets/sacred-patterns-1.png', '/assets/sacred-patterns-2.png'],
      metadata: {
        'Language': 'Python 3.11',
        'Dependencies': 'numpy, matplotlib, pillow',
        'License': 'MIT',
        'Last Updated': '2024.08.11',
        'Lines of Code': '1,247',
        'Repository Size': '2.3 MB'
      }
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
      media: ['/assets/default-placeholder.png'],
      metadata: {
        'Status': 'Under Development',
        'Version': '2.0'
      }
    }
  ];

  const entry = entries.find(e => e.id === artifactId) || entries[0];
  const media = entry.media || [entry.thumbnail];
  const currentMedia = media[activeMediaIndex];

  useEffect(() => {
    setActiveMediaIndex(0);
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
  }, [showFullscreen, activeMediaIndex, media.length, onBack]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    tl.from('.info-container', { 
      opacity: 0, 
      y: 20, 
      duration: 0.6 
    })
      .from('.media-panel', { 
        x: -30, 
        opacity: 0, 
        duration: 0.5 
      }, '-=0.3')
      .from('.detail-panel', { 
        x: 30, 
        opacity: 0, 
        duration: 0.5 
      }, '-=0.3')
      .from('.meta-data-item', { 
        y: 10, 
        opacity: 0, 
        stagger: 0.05, 
        duration: 0.4 
      }, '-=0.2');
  }, { scope: containerRef });

  useEffect(() => {
    const tl = gsap.timeline();
    
    if (showFullscreen) {
      document.body.style.overflow = 'hidden';
      tl.to('.fullscreen-overlay', {
        opacity: 1,
        visibility: 'visible',
        duration: 0.3
      });
    } else {
      document.body.style.overflow = '';
      tl.to('.fullscreen-overlay', {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.3
      });
    }
  }, [showFullscreen]);

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      setActiveMediaIndex(prev => (prev + 1) % media.length);
    }
  };

  const handlePrev = () => {
    setActiveMediaIndex(prev => (prev - 1 + media.length) % media.length);
  };

  const handleFullscreenToggle = () => {
    setShowFullscreen(prev => !prev);
    onFullscreenToggle?.();
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={containerRef} className={`w-full h-screen flex ${isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>
      
      {/* Fullscreen Overlay */}
      <div className={`fullscreen-overlay fixed inset-0 z-50 ${
        isDarkMode ? 'bg-black/95' : 'bg-white/95'
      } transition-all duration-300 opacity-0 visibility-hidden flex items-center justify-center`}>
        <div className="relative w-full h-full p-4 md:p-8">
          <button
            onClick={handleFullscreenToggle}
            className={`absolute top-4 right-4 z-50 text-[7px] md:text-[8px] tracking-[0.2em] uppercase 
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
      <div className="media-panel flex-1 flex flex-col p-4 md:p-6 lg:p-10 border-r border-zinc-800">
        
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-60">
            ID NO: <span className="font-mono opacity-100">{entry.id}</span>
          </div>
          
          <button
            onClick={handleFullscreenToggle}
            className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase transition-all duration-300 
              opacity-50 hover:opacity-100 ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            [1] FULLSCREEN
          </button>
        </div>

        {/* Media Display Area */}
        <div className="flex-1 flex items-center justify-center relative min-h-0">
          <div className={`relative w-full aspect-square max-h-[calc(100vh-200px)] 
            border ${isDarkMode ? 'border-zinc-800' : 'border-zinc-300'} overflow-hidden rounded-lg`}>
            
            {currentMedia.endsWith('.mp4') || currentMedia.endsWith('.webm') ? (
              <video
                src={currentMedia}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay
              />
            ) : (
              <img
                src={currentMedia}
                alt={entry.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}

            {/* Click hint overlay */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} 
              opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none`}>
              <span className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase font-mono opacity-90">
                [ CLICK FOR FULLSCREEN ]
              </span>
            </div>
          </div>
        </div>

        {/* Slide Title */}
        <div className="mt-4 text-center">
          <h2 className="text-[1rem] md:text-[1.25rem] lg:text-[1.5rem] font-[100] uppercase tracking-[0.1em]">
            {entry.label}
          </h2>
        </div>
      </div>

      {/* Right Panel - Details & Metadata */}
      <div className="detail-panel flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-800">
          <h3 className="text-[7px] md:text-[8px] tracking-[0.4em] uppercase opacity-60">
            META DATA
          </h3>
          
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

        {/* Scrollable Description Section */}
        <div ref={scrollContainerRef} className={`detail-scroll flex-1 overflow-y-auto p-4 md:p-6 
          scrollbar-thin ${isDarkMode ? 'scrollbar-thumb-zinc-700' : 'scrollbar-thumb-zinc-300'}`}>
          
          <div className="mb-6">
            <h4 className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase opacity-60 mb-3">
              [3] DESCRIPTION
            </h4>
            <div className={`prose prose-sm ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
              <p className="text-[7px] md:text-[8px] tracking-[0.15em] leading-relaxed opacity-70 whitespace-pre-line">
                {entry.detailedDescription}
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="border-t border-zinc-800 pt-6">
            <h4 className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase opacity-60 mb-3">
              TECHNICAL SPECS
            </h4>
            <div className="space-y-2">
              {entry.metadata && Object.entries(entry.metadata).map(([key, value], index) => (
                <div key={index} className="grid grid-cols-3 gap-2 meta-data-item">
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

        {/* Scroll indicator */}
        <div className="text-center py-4 text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-40">
            <span>[2] SCROLL DOWN</span>
        </div>
        </div>

        {/* Navigation Footer */}
        <div className="p-4 md:p-6 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-40">
            MEDIA {activeMediaIndex + 1}/{media.length}
          </div>
          
          <button
            onClick={handleNext}
            disabled={!onNext && media.length <= 1}
            className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase transition-all duration-300 
              px-4 py-2 border ${
              isDarkMode 
                ? 'border-white/20 hover:border-white/40 opacity-60 hover:opacity-100' 
                : 'border-black/20 hover:border-black/40 opacity-60 hover:opacity-100'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            [4] NEXT →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtifactInfo;