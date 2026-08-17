import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ArtifactInfoProps {
  isDarkMode: boolean;
  galleryMediaItems: GalleryMediaItem[];
  currentGalleryMediaIndex: number;
  onGalleryMediaChange?: (index: number) => void;
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
  media: string[];
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
  const descScrollRef = useRef<HTMLDivElement>(null);
  const [activeSubMediaIndex, setActiveSubMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullscreen, setShowFullscreen] = useState(false);

  const currentGalleryMedia = galleryMediaItems[currentGalleryMediaIndex] || galleryMediaItems[0];
  const subMedia = currentGalleryMedia.media || [];
  const currentSubMedia = subMedia[activeSubMediaIndex];

  useEffect(() => {
    setActiveSubMediaIndex(0);
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
    const nextIndex = (currentGalleryMediaIndex + 1) % galleryMediaItems.length;
    if (onGalleryMediaChange) {
      onGalleryMediaChange(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentGalleryMediaIndex - 1 + galleryMediaItems.length) % galleryMediaItems.length;
    if (onGalleryMediaChange) {
      onGalleryMediaChange(prevIndex);
    }
  };

  const handleFullscreenToggle = () => {
    setShowFullscreen(prev => !prev);
  };

  // GSAP animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.from('.info-header', { y: -20, opacity: 0, duration: 0.6 })
      .from('.info-meta-top', { x: -15, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
      .from('.info-description', { y: 10, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.info-specs', { y: 15, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.info-nav', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2');
  }, { scope: containerRef });

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

      {/* Main Container */}
      <div className={`w-full flex flex-col ${isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>

        {/* Structural border lines - KEPT as-is */}
        <div className={`fixed top-0 bottom-0 left-4 md:left-[5%] w-px transition-colors duration-1000 z-10 ${
          isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-200'
        }`} />
        <div className={`fixed top-0 bottom-0 right-4 md:right-[5%] w-px transition-colors duration-1000 z-10 ${
          isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-200'
        }`} />

        {/* Padding now matches decorative line positions */}
        <div className="relative z-20 w-full px-4 md:px-[5%] pt-4 flex flex-col h-[calc(100vh-80px)]">

          {/* Header Section */}
          <div className="info-header flex items-start justify-between mb-4">
            <div>
              <div className="info-meta-top text-[7px] md:text-[8px] tracking-[0.4em] uppercase opacity-60 mb-2">
                ID_CODE // {currentGalleryMedia.id}
              </div>
              <h1 className={`text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-[100] uppercase tracking-[0.05em] leading-none mb-2 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                {currentGalleryMedia.label}
              </h1>
            </div>

            {/* Back button */}
            {onBack && (
              <button
                onClick={onBack}
                className={`text-[7px] md:text-[8px] tracking-[0.2em] pt-[30px] uppercase transition-all duration-300 
                  opacity-50 hover:opacity-100 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                ‹ BACK
              </button>
            )}
          </div>

          {/* Content Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">

            {/* Left Column - Media Display */}
            <div className={`border transition-all duration-300 p-4 flex flex-col ${
              isDarkMode ? 'border-zinc-800' : 'border-zinc-300'
            }`}>

              {/* Media Display - Centers image regardless of aspect ratio */}
              <div className="relative w-full flex items-center justify-center mb-3 flex-shrink-0">
                <div className={`relative max-w-full max-h-[280px] border overflow-hidden rounded-lg bg-zinc-900/20 ${
                  isDarkMode ? 'border-zinc-800' : 'border-zinc-300'
                }`}>
                  {currentSubMedia.endsWith('.mp4') || currentSubMedia.endsWith('.webm') ? (
                    <video
                      src={currentSubMedia}
                      className="max-w-full max-h-[280px] object-contain cursor-pointer"
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
                      className="max-w-full max-h-[280px] object-contain cursor-pointer"
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

              {/* Sub-Media Thumbnails */}
              <div className="mt-auto">
                <div className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-40 mb-1">
                  MEDIA {activeSubMediaIndex + 1}/{subMedia.length}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {subMedia.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSubMediaIndex(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded border overflow-hidden transition-all ${
                        i === activeSubMediaIndex
                          ? `${isDarkMode ? 'border-white' : 'border-black'} opacity-100`
                          : `${isDarkMode ? 'border-zinc-800' : 'border-zinc-300'} opacity-50 hover:opacity-100`
                      }`}
                    >
                      {/* Thumbnail image */}
                      <img 
                        src={src} 
                        className="w-full h-full object-cover" 
                        alt="" 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Info Content */}
            <div className={`info-info-panel flex flex-col ${
              isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>

              {/* Meta Data + Tabs */}
              <div className={`info-meta-top border-b py-3 mb-3 ${
                isDarkMode ? 'border-zinc-800' : 'border-zinc-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-[7px] md:text-[8px] tracking-[0.3em] uppercase ${
                      isDarkMode ? 'opacity-60' : 'opacity-70'
                    }`}>
                      META DATA
                    </span>

                    {/* Tab Buttons */}
                    <div className="flex gap-2">
                      {currentGalleryMedia.tabSections?.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`text-[7px] tracking-[0.2em] uppercase px-2 py-1 transition-all border-b-2 ${
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
                </div>
              </div>

              {/* Description */}
              <div className="info-description mb-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-2" ref={descScrollRef}>
                <h4 className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase opacity-60 mb-2 flex-shrink-0">
                  DESCRIPTION
                </h4>
                <p className={`text-[7px] md:text-[8px] tracking-[0.15em] leading-relaxed opacity-70 whitespace-pre-line ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {currentGalleryMedia.tabSections?.find(t => t.id === activeTab)?.content || currentGalleryMedia.description}
                </p>
              </div>

              {/* Divider Bar */}
              <div className={`border-t mb-3 ${
                isDarkMode ? 'border-zinc-800' : 'border-zinc-300'
              }`} />

              {/* Specs */}
              <div className="info-specs mb-3">
                <h4 className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase opacity-60 mb-2">
                  SPECS
                </h4>
                <div className="space-y-1">
                  {currentGalleryMedia.metadata && Object.entries(currentGalleryMedia.metadata).slice(0, 5).map(([key, value], index) => (
                    <div key={index} className="grid grid-cols-3 gap-2">
                      <span className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase ${
                        isDarkMode ? 'opacity-50' : 'opacity-60'
                      }`}>
                        {key}
                      </span>
                      <span className={`font-mono text-[7px] md:text-[8px] tracking-[0.1em] col-span-2 truncate ${
                        isDarkMode ? 'text-white' : 'text-black'
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className={`info-nav border-t pt-3 mt-auto ${
                isDarkMode ? 'border-zinc-800' : 'border-zinc-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-40 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    ENTRY {currentGalleryMediaIndex + 1}/{galleryMediaItems.length}
                  </span>

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
        </div>
      </div>
    </div>
  );
};

export default ArtifactInfo;