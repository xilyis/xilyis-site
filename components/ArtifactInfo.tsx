import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import { playEntrance, playSwap } from '../motion';
import type { GalleryMediaItem } from '../artifactData';

interface ArtifactInfoProps {
  isDarkMode: boolean;
  galleryMediaItems: GalleryMediaItem[];
  currentGalleryMediaIndex: number;
  onGalleryMediaChange?: (index: number) => void;
  onBack?: () => void;
  onAssetClick?: (subMediaIndex: number) => void;
}

const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

const ArtifactInfo: React.FC<ArtifactInfoProps> = ({
  isDarkMode,
  galleryMediaItems,
  currentGalleryMediaIndex,
  onGalleryMediaChange,
  onBack,
  onAssetClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSubMediaIndex, setActiveSubMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const lastSwapKey = useRef(`${currentGalleryMediaIndex}:${activeTab}`);

  const currentGalleryMedia =
    galleryMediaItems[currentGalleryMediaIndex] || galleryMediaItems[0];
  const subMedia = currentGalleryMedia?.media ?? [];
  const currentSubMedia = subMedia[activeSubMediaIndex] ?? '';
  const itemCount = galleryMediaItems.length;

  useEffect(() => {
    setActiveSubMediaIndex(0);
  }, [currentGalleryMediaIndex]);

  useEffect(() => {
    const stepGalleryMedia = (direction: 1 | -1) => {
      if (!itemCount) return;
      onGalleryMediaChange?.(
        (currentGalleryMediaIndex + direction + itemCount) % itemCount
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;

      if (e.key === 'Escape') {
        if (showFullscreen) {
          setShowFullscreen(false);
        } else {
          onBack?.();
        }
        return;
      }

      if (target?.closest('input, textarea')) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepGalleryMedia(1);
      } else if (e.key === ' ') {
        // Don't hijack Space when it is activating a button or link
        if (target?.closest('button, a')) return;
        e.preventDefault();
        stepGalleryMedia(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepGalleryMedia(-1);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setShowFullscreen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showFullscreen,
    currentGalleryMediaIndex,
    itemCount,
    onBack,
    onGalleryMediaChange,
  ]);

  useEffect(() => {
    document.body.style.overflow = showFullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFullscreen]);

  // Page entrance (shared motion settings)
  useGSAP(
    () => {
      playEntrance([
        '.info-header',
        '.info-media',
        '.info-tabs',
        '.info-description',
        '.info-specs',
        '.info-nav',
      ]);
    },
    { scope: containerRef }
  );

  // Soft swap when the tab or gallery item changes
  useGSAP(
    () => {
      const key = `${currentGalleryMediaIndex}:${activeTab}`;
      if (lastSwapKey.current === key) return;
      lastSwapKey.current = key;
      playSwap('.info-swap');
    },
    { scope: containerRef, dependencies: [currentGalleryMediaIndex, activeTab] }
  );

  const toggleFullscreen = () => setShowFullscreen((prev) => !prev);

  const openFullscreen = () => {
    setShowFullscreen(true);
    onAssetClick?.(activeSubMediaIndex);
  };

  const themeClass = isDarkMode ? 'text-white bg-black' : 'text-black bg-white';
  const borderClass = isDarkMode ? 'border-zinc-800' : 'border-zinc-300';

  if (!currentGalleryMedia) {
    return (
      <div className={`flex w-full flex-1 flex-col px-4 pt-4 ${themeClass}`}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 w-fit text-[7px] uppercase tracking-[0.2em] opacity-50 transition-opacity hover:opacity-100 md:text-[8px]"
          >
            ‹ BACK
          </button>
        )}
        <p className="text-[7px] uppercase tracking-[0.2em] opacity-50 md:text-[8px]">
          NO MEDIA AVAILABLE
        </p>
      </div>
    );
  }

  // Rendered into <body> so it sits above the fixed nav and footer
  const fullscreenOverlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!showFullscreen}
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 motion-reduce:transition-none ${
        isDarkMode ? 'bg-black/95 text-white' : 'bg-white/95 text-black'
      } ${showFullscreen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div className="relative h-full w-full px-4 pb-4 pt-16 md:px-8 md:pb-8 md:pt-20">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute right-6 top-20 z-10 text-[7px] uppercase tracking-[0.2em] opacity-50 transition-opacity hover:opacity-100 md:right-10 md:text-[8px]"
        >
          [ CLOSE FULLSCREEN ]
        </button>

        {/* Only mounted while open, so hidden videos never play */}
        {showFullscreen && currentSubMedia && (
          <div className="flex h-full w-full items-center justify-center">
            {isVideo(currentSubMedia) ? (
              <video
                src={currentSubMedia}
                className="max-h-full max-w-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={currentSubMedia}
                alt={currentGalleryMedia.label}
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={`flex w-full flex-1 ${themeClass}`}>
      {createPortal(fullscreenOverlay, document.body)}

      {/* One screen on large displays; flows naturally on small ones */}
      <div className="relative z-20 flex w-full flex-col px-4 pb-16 pt-4 md:px-[5%] md:pb-20 lg:h-[calc(100svh-9rem)] lg:pb-4">
        {/* Header */}
        <div className="info-header mb-4 flex items-start justify-between">
          <div>
            <div className="info-swap mb-2 text-[7px] uppercase tracking-[0.4em] opacity-60 md:text-[8px]">
              ID_CODE // {currentGalleryMedia.id}
            </div>
            <h1 className="info-swap mb-2 text-[1.75rem] font-[100] uppercase leading-none tracking-[0.05em] md:text-[2rem] lg:text-[2.5rem]">
              {currentGalleryMedia.label}
            </h1>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="pt-[30px] text-[7px] uppercase tracking-[0.2em] opacity-50 transition-opacity duration-300 hover:opacity-100 md:text-[8px]"
            >
              ‹ BACK
            </button>
          )}
        </div>

        {/* Content grid */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Left column: media */}
          <div className={`info-media flex flex-col border p-4 ${borderClass}`}>
            <div className="relative mb-3 flex w-full flex-shrink-0 items-center justify-center">
              <div
                className={`group relative max-h-[280px] max-w-full overflow-hidden rounded-lg border bg-zinc-900/20 ${borderClass}`}
              >
                {currentSubMedia && isVideo(currentSubMedia) ? (
                  <video
                    src={currentSubMedia}
                    className="max-h-[280px] max-w-full cursor-pointer object-contain"
                    loop
                    muted
                    playsInline
                    autoPlay
                    onClick={openFullscreen}
                  />
                ) : currentSubMedia ? (
                  <img
                    src={currentSubMedia}
                    alt={currentGalleryMedia.label}
                    className="max-h-[280px] max-w-full cursor-pointer object-contain"
                    loading="lazy"
                    onClick={openFullscreen}
                  />
                ) : null}

                {/* Hover hint: group-hover, because the overlay itself ignores the pointer */}
                <div
                  className={`pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    isDarkMode ? 'bg-black/20' : 'bg-white/20'
                  }`}
                >
                  <span className="font-mono text-[7px] uppercase tracking-[0.2em] opacity-90 md:text-[8px]">
                    [ CLICK FOR FULLSCREEN ]
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-media thumbnails */}
            <div className="mt-auto">
              <div className="mb-1 text-[7px] uppercase tracking-[0.2em] opacity-40 md:text-[8px]">
                MEDIA {subMedia.length ? activeSubMediaIndex + 1 : 0}/{subMedia.length}
              </div>

              <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
                {subMedia.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveSubMediaIndex(i)}
                    aria-label={`Show media ${i + 1}`}
                    className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded border transition-[opacity,border-color] ${
                      i === activeSubMediaIndex
                        ? `${isDarkMode ? 'border-white' : 'border-black'} opacity-100`
                        : `${borderClass} opacity-50 hover:opacity-100`
                    }`}
                  >
                    {isVideo(src) ? (
                      <video
                        src={src}
                        className="pointer-events-none h-full w-full object-cover"
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <img src={src} className="h-full w-full object-cover" alt="" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: info */}
          <div className={`flex min-h-0 flex-col ${themeClass}`}>
            {/* Metadata + tabs */}
            <div className={`info-tabs mb-3 border-b py-3 ${borderClass}`}>
              <div className="flex items-center gap-4">
                <span
                  className={`text-[7px] uppercase tracking-[0.3em] md:text-[8px] ${
                    isDarkMode ? 'opacity-60' : 'opacity-70'
                  }`}
                >
                  META DATA
                </span>

                <div className="flex gap-2">
                  {currentGalleryMedia.tabSections?.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`border-b-2 px-2 py-1 text-[7px] uppercase tracking-[0.2em] transition-[opacity,border-color] ${
                        activeTab === tab.id
                          ? `${isDarkMode ? 'border-white' : 'border-black'} opacity-100`
                          : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="info-description scrollbar-thin mb-3 max-h-[40vh] min-h-0 flex-1 overflow-y-auto pr-2 lg:max-h-none">
              <h4 className="mb-2 flex-shrink-0 text-[7px] uppercase tracking-[0.3em] opacity-60 md:text-[8px]">
                DESCRIPTION
              </h4>
              <p className="info-swap whitespace-pre-line text-[7px] leading-relaxed tracking-[0.15em] opacity-70 md:text-[8px]">
                {currentGalleryMedia.tabSections?.find((t) => t.id === activeTab)
                  ?.content || currentGalleryMedia.description}
              </p>
            </div>

            <div className={`mb-3 border-t ${borderClass}`} />

            {/* Specs */}
            <div className="info-specs mb-3">
              <h4 className="mb-2 text-[7px] uppercase tracking-[0.3em] opacity-60 md:text-[8px]">
                SPECS
              </h4>
              <div className="info-swap space-y-1">
                {currentGalleryMedia.metadata &&
                  Object.entries(currentGalleryMedia.metadata)
                    .slice(0, 5)
                    .map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 gap-2">
                        <span
                          className={`text-[7px] uppercase tracking-[0.2em] md:text-[8px] ${
                            isDarkMode ? 'opacity-50' : 'opacity-60'
                          }`}
                        >
                          {key}
                        </span>
                        <span className="col-span-2 truncate font-mono text-[7px] tracking-[0.1em] md:text-[8px]">
                          {value}
                        </span>
                      </div>
                    ))}
              </div>
            </div>

            {/* Navigation footer */}
            <div className={`info-nav mt-auto border-t pt-3 ${borderClass}`}>
              <div className="flex items-center justify-between">
                <span className="text-[7px] uppercase tracking-[0.2em] opacity-40 md:text-[8px]">
                  ENTRY {currentGalleryMediaIndex + 1}/{itemCount}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onGalleryMediaChange?.((currentGalleryMediaIndex + 1) % itemCount)
                  }
                  className={`border px-4 py-2 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-[opacity,border-color] duration-300 hover:opacity-100 md:text-[8px] ${
                    isDarkMode
                      ? 'border-white/20 hover:border-white/40'
                      : 'border-black/20 hover:border-black/40'
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
  );
};

export default ArtifactInfo;