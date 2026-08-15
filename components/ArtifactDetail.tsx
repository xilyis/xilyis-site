import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ArtifactDetailProps {
  isDarkMode: boolean;
  artifactId: string;
  onBack?: () => void;
  onAssetClick?: (assetIndex: number) => void;
}

const ArtifactDetail: React.FC<ArtifactDetailProps> = ({ 
  isDarkMode, 
  artifactId,
  onBack,
  onAssetClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const entries = [
    {
      id: '01',
      label: 'ENTRY 01',
      status: 'ACTIVE',
      timestamp: '2024.08.11',
      thumbnail: '/assets/sacred-patterns-thumb.png',
      description: 'Generative geometry with rotational symmetry',
      sourceUrl: 'https://github.com/you/repo/blob/main/SacredPatterns.py',
      downloadUrl: '/assets/sacred-patterns.png',
      type: 'python',
      media: ['/assets/sacred-patterns-1.png', '/assets/sacred-patterns-2.png']
    },
    {
      id: '02',
      label: 'ENTRY 02',
      status: 'VER_2',
      timestamp: '2024.03.15',
      thumbnail: '/assets/default-placeholder.png',
      description: 'Coming soon',
      sourceUrl: '#',
      type: 'python',
      media: ['/assets/default-placeholder.png']
    }
  ];

  const entry = entries.find(e => e.id === artifactId) || entries[0];
  const media = entry.media || [entry.thumbnail];

  useEffect(() => {
    setActiveThumbnailIndex(0);
  }, [artifactId]);

  useEffect(() => {
    const timer = setTimeout(() => setTooltipVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setActiveThumbnailIndex(prev => (prev + 1) % media.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveThumbnailIndex(prev => (prev - 1 + media.length) % media.length);
      } else if (e.key === 'Escape') {
        onBack?.();
      } else if (e.key === '?') {
        setTooltipVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [media.length, onBack]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    tl.from('.detail-header', { y: -30, opacity: 0, duration: 0.7 })
      .from('.detail-tool-tip', { x: 30, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.detail-preview-card', { 
        scale: 0.9, 
        opacity: 0, 
        duration: 0.6, 
        stagger: { amount: 0.3, from: 'center' },
        clearProps: 'all'
      }, '-=0.3')
      .from('.detail-meta', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.detail-actions', { opacity: 0, y: 15, duration: 0.4 }, '-=0.2');
  }, { scope: containerRef });

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.to('.preview-active', {
      scale: 1,
      opacity: 1,
      zIndex: 20,
      duration: 0.4,
      clearProps: 'all'
    })
    .to('.preview-inactive', {
      scale: 0.94,
      opacity: 0.35,
      zIndex: 10,
      duration: 0.4,
      clearProps: 'all'
    }, '<');
  }, [activeThumbnailIndex]);

  const goToNext = () => {
    setActiveThumbnailIndex(prev => (prev + 1) % media.length);
  };

  const goToPrev = () => {
    setActiveThumbnailIndex(prev => (prev - 1 + media.length) % media.length);
  };

  return (
    <div ref={containerRef} className={`h-screen w-full overflow-hidden flex flex-col ${isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>
      
      {/* Header Section - With Internal Padding */}
      <div className="detail-header mb-5">
        {/* Back Button - Top Left */}
        {onBack && (
          <button
            onClick={onBack}
            className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase transition-all duration-300 
              opacity-50 hover:opacity-100 mb-4 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            ‹ BACK
          </button>
        )}

        {/* Status Line */}
        <span className={`text-[7px] md:text-[8px] tracking-[0.4em] uppercase block mb-2 ${
          isDarkMode ? 'opacity-60' : 'opacity-70'
        }`}>
          {entry.status} // ARTIFACT_DETAIL
        </span>

        {/* Title */}
        <h1 className={`text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-[100] uppercase tracking-[0.05em] leading-none mb-2 ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>
          {entry.label}
        </h1>
      </div>

      {/* Tool Tip - Top Right (absolute position) */}
      <div className={`detail-tool-tip text-[7px] md:text-[8px] tracking-[0.15em] uppercase opacity-50 max-w-xs text-right hidden md:block transition-opacity duration-300 absolute right-10 top-4 ${
        tooltipVisible ? 'opacity-50' : 'opacity-0'
      }`}>
        TOGGLE TO NAVIGATE<br/>
      </div>

      {/* Preview Area - With Internal Padding */}
      <div className="flex-1 flex items-center justify-center relative my-4 px-4 md:px-6 lg:px-10">
        <div className="relative w-full h-[45vh] md:h-[55vh]">
          {media.map((src, i) => {
            const isActive = i === activeThumbnailIndex;
            const offset = i - activeThumbnailIndex;
            
            return (
              <div
                key={i}
                onClick={() => {
                  if (isActive) {
                    onAssetClick?.(i);
                  } else {
                    setActiveThumbnailIndex(i);
                  }
                }}
                className={`detail-preview-card absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  transition-all duration-500 cursor-pointer rounded-lg border overflow-hidden
                  ${isActive 
                    ? 'preview-active border-current z-20' 
                    : 'preview-inactive border-zinc-800 z-10'
                  } ${isDarkMode ? '' : 'border-zinc-300'}`}
                style={{
                  width: '60%',
                  height: '100%',
                  left: `${50 + offset * 8}%`,
                  transform: `translate(-50%, -50%) ${isActive ? 'scale(1)' : 'scale(0.94)'}`,
                }}
              >
                <div className="w-full h-full bg-zinc-900/20 relative">
                  {src.endsWith('.mp4') || src.endsWith('.webm') ? (
                    <video
                      src={src}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img
                      src={src}
                      alt={entry.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}

                  {/* Hover overlay */}
                  <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/30' : 'bg-white/30'} opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none`}>
                    <span className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase font-mono opacity-90">
                      CLICK FOR DETAILS →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={goToPrev}
          className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center 
            border transition-all duration-300 opacity-40 hover:opacity-100
            ${isDarkMode ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-300 hover:border-zinc-400'}`}
        >
          ‹
        </button>
        <button 
          onClick={goToNext}
          className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center 
            border transition-all duration-300 opacity-40 hover:opacity-100
            ${isDarkMode ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-300 hover:border-zinc-400'}`}
        >
          ›
        </button>
      </div>

      {/* Meta Info - With Internal Padding */}
      <div className="detail-meta grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto pt-5 px-4 md:px-6 lg:px-10">
        {/* Brief Description */}
        <div className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase leading-relaxed opacity-50">
          DESCRIPTION
          <span className="block mt-2 leading-relaxed opacity-100">
            {entry.description}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="detail-actions flex justify-center gap-3 items-end">
          {entry.downloadUrl && entry.downloadUrl !== '#' && (
            <a 
              href={entry.downloadUrl}
              download
              className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 border border-current/20 px-3 py-1.5 transition-all"
            >
              ↓ DOWNLOAD
            </a>
          )}
          
          <a 
            href={entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 border border-current/20 px-3 py-1.5 transition-all"
          >
            VIEW
          </a>
        </div>

        {/* Date/Time */}
        <div className="text-right">
          <span className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase opacity-50 block">
            IMPLEMENTED
          </span>
          <span className="font-mono text-[7px] md:text-[8px] tracking-[0.1em] block mt-2">
            {entry.timestamp}
          </span>
        </div>
      </div>

      {/* Footer Navigation */}
      {onBack && (
        <div className={`flex justify-between items-center pt-4 mt-4 border-t ${
          isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200'
        } px-4 md:px-6 lg:px-10`}>
          <div className={`uppercase tracking-[0.2em] text-[7px] ${
            isDarkMode ? 'opacity-40' : 'opacity-50'
          }`}>
            XILYAS // ARTIFACT_DETAIL
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactDetail;