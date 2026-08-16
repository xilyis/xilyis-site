import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ArtifactInfoProps {
  isDarkMode: boolean;
  galleryMediaItems: GalleryMediaItem[];  // Pass gallery items from parent
  currentGalleryMediaIndex: number;        // Which gallery item is active
  onGalleryMediaChange?: (index: number) => void;  // Called when NEXT button pressed
  onBack?: () => void;
  onAssetClick?: (subMediaIndex: number) => void;
}

interface TabSection {
  id: string;
  label: string;
  content: string;
}

interface GalleryMediaItem {
  id: string;
  label: string;
  description: string;
  media: string[];  // Sub-media for this gallery item
  tabSections: TabSection[];
  metadata: Record<string, string>;
}

const ArtifactInfo: React.FC<ArtifactInfoProps> = ({ 
  isDarkMode, 
  galleryMediaItems,
  currentGalleryMediaIndex,
  onGalleryMediaChange,
  onBack,
  onAssetClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSubMediaIndex, setActiveSubMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullscreen, setShowFullscreen] = useState(false);

  const currentGalleryMedia = galleryMediaItems[currentGalleryMediaIndex] || galleryMediaItems[0];
  const subMedia = currentGalleryMedia.media || [];
  const currentSubMedia = subMedia[activeSubMediaIndex];

  useEffect(() => {
    setActiveSubMediaIndex(0);  // Reset sub-media when gallery item changes
  }, [currentGalleryMediaIndex]);

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
  }, [showFullscreen, currentGalleryMediaIndex, galleryMediaItems.length, onBack]);

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
    // Navigate to NEXT GALLERY MEDIA ITEM (NOT sub-media)
    const nextIndex = (currentGalleryMediaIndex + 1) % galleryMediaItems.length;
    if (onGalleryMediaChange) {
      onGalleryMediaChange(nextIndex);
    }
  };

  const handlePrev = () => {
    // Navigate to PREVIOUS GALLERY MEDIA ITEM
    const prevIndex = (currentGalleryMediaIndex - 1 + galleryMediaItems.length) % galleryMediaItems.length;
    if (onGalleryMediaChange) {
      onGalleryMediaChange(prevIndex);
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
            {currentSubMedia.endsWith('.mp4') || currentSubMedia.endsWith('.webm') ? (
              <video
                src={currentSubMedia}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={currentSubMedia}
                alt={currentGalleryMedia.label}
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
            ID: <span className="font-mono opacity-100">{currentGalleryMedia.id}</span>
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
            
            {currentSubMedia.endsWith('.mp4') || currentSubMedia.endsWith('.webm') ? (
              <video
                src={currentSubMedia}
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
                src={currentSubMedia}
                alt={currentGalleryMedia.label}
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
              
              {/* Tab Buttons */}
              <div className="flex gap-2">
                {currentGalleryMedia.tabSections?.map(tab => (
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
                {currentGalleryMedia.tabSections?.find(t => t.id === activeTab)?.content || currentGalleryMedia.description}
              </p>
            </div>
          </div>

          {/* Static Technical Specs */}
          <div className="border-t border-zinc-800 pt-6">
            <h4 className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase opacity-60 mb-3">
              SPECS
            </h4>
            <div className="space-y-2">
              {currentGalleryMedia.metadata && Object.entries(currentGalleryMedia.metadata).map(([key, value], index) => (
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