import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { playEntrance } from '../motion';
import { artifacts, getArtifactById } from '../artifactData';
import { asset, hasLink } from '../siteConfig';

interface ArtifactDetailProps {
  isDarkMode: boolean;
  artifactId: string;
  onBack?: () => void;
  onAssetClick?: (assetIndex: number) => void;
  onNavigateToInfo?: (artifactId: string) => void;
}

const ArtifactDetail: React.FC<ArtifactDetailProps> = ({
  isDarkMode,
  artifactId,
  onBack,
  onAssetClick,
  onNavigateToInfo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const entry = getArtifactById(artifactId) ?? artifacts[0];
  const media = (entry ? (entry.media.length ? entry.media : [entry.thumbnail]) : []).map(asset);
  const hasSource = hasLink(entry?.sourceUrl);

  useEffect(() => {
    setActiveThumbnailIndex(0);
  }, [artifactId]);

  useEffect(() => {
    const timer = setTimeout(() => setTooltipVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!media.length) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveThumbnailIndex((prev) => (prev + 1) % media.length);
      } else if (e.key === ' ') {
        // Don't hijack Space when it is activating a button or link
        const target = e.target as HTMLElement | null;
        if (target?.closest('button, a, input, textarea')) return;
        e.preventDefault();
        setActiveThumbnailIndex((prev) => (prev + 1) % media.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveThumbnailIndex((prev) => (prev - 1 + media.length) % media.length);
      } else if (e.key === 'Escape') {
        onBack?.();
      } else if (e.key === '?') {
        setTooltipVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [media.length, onBack]);

  // Page entrance. Only wrappers are animated here: the preview cards
  // are positioned and faded by CSS transitions, so GSAP never touches them.
  useGSAP(
    () => {
      playEntrance(['.detail-header', '.detail-stage', '.detail-meta']);
    },
    { scope: containerRef }
  );

  const goToNext = () => {
    setActiveThumbnailIndex((prev) => (prev + 1) % media.length);
  };

  const goToPrev = () => {
    setActiveThumbnailIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const arrowClass = `hidden md:flex absolute top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center
    border transition-[opacity,border-color] duration-300 opacity-40 hover:opacity-100 ${
      isDarkMode
        ? 'border-zinc-700 hover:border-zinc-500'
        : 'border-zinc-300 hover:border-zinc-400'
    }`;

  // Unknown id (for example after entries were removed): render nothing
  if (!entry) return null;

  return (
    <div
      ref={containerRef}
      className={`flex w-full flex-1 flex-col px-[10px] pb-16 md:px-6 md:pb-20 lg:px-10 ${
        isDarkMode ? 'text-white bg-black' : 'text-black bg-white'
      }`}
    >
      {/* Header */}
      <div className="detail-header relative mb-5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 text-[7px] uppercase tracking-[0.2em] opacity-50 transition-opacity duration-300 hover:opacity-100 md:text-[8px]"
          >
            ‹ BACK
          </button>
        )}

        <span
          className={`mb-2 block text-[7px] uppercase tracking-[0.4em] md:text-[8px] ${
            isDarkMode ? 'opacity-60' : 'opacity-70'
          }`}
        >
          {entry.status} // ARTIFACT_DETAIL
        </span>

        <h1 className="mb-2 text-[1.5rem] font-[100] uppercase leading-none tracking-[0.05em] md:text-[1.75rem] lg:text-[2rem]">
          {entry.label}
        </h1>

        {/* Tooltip: top right of the header, fades out with CSS only */}
        <div
          className={`absolute right-0 top-0 hidden max-w-xs text-right text-[7px] uppercase tracking-[0.15em] transition-opacity duration-500 md:block md:text-[8px] ${
            tooltipVisible ? 'opacity-50' : 'opacity-0'
          }`}
        >
          TOGGLE TO NAVIGATE
        </div>
      </div>

      {/* Preview area */}
      <div className="detail-stage relative my-4 flex flex-1 items-center justify-center px-4 md:px-6 lg:px-10">
        <div className="relative h-[45vh] w-full md:h-[55vh]">
          {media.map((src, i) => {
            const isActive = i === activeThumbnailIndex;
            const offset = i - activeThumbnailIndex;
            const isFar = Math.abs(offset) > 2;

            return (
              <div
                key={`${src}-${i}`}
                onClick={() => {
                  if (isActive) {
                    onAssetClick?.(i);
                  } else {
                    setActiveThumbnailIndex(i);
                  }
                }}
                className={`group absolute top-1/2 cursor-pointer overflow-hidden rounded-lg border transition-[left,transform,opacity] duration-500 ease-out motion-reduce:transition-none ${
                  isActive
                    ? isDarkMode
                      ? 'border-white'
                      : 'border-black'
                    : isDarkMode
                      ? 'border-zinc-800'
                      : 'border-zinc-300'
                }`}
                style={{
                  width: '60%',
                  height: '100%',
                  left: `${50 + Math.max(-2, Math.min(2, offset)) * 8}%`,
                  transform: `translate(-50%, -50%) scale(${isActive ? 1 : 0.94})`,
                  opacity: isFar ? 0 : isActive ? 1 : 0.35,
                  zIndex: isActive ? 20 : 10 - Math.min(Math.abs(offset), 5),
                  pointerEvents: isFar ? 'none' : 'auto',
                }}
              >
                <div className="relative h-full w-full bg-zinc-900/20">
                  {src.endsWith('.mp4') || src.endsWith('.webm') ? (
                    <video
                      src={src}
                      className="h-full w-full object-cover"
                      loop
                      muted
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img
                      src={src}
                      alt={`${entry.label} ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}

                  {/* Hover hint (active card only). Uses group-hover because the
                      overlay itself ignores the pointer. */}
                  {isActive && (
                    <div
                      className={`pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        isDarkMode ? 'bg-black/30' : 'bg-white/30'
                      }`}
                    >
                      <span className="font-mono text-[7px] uppercase tracking-[0.2em] opacity-90 md:text-[8px]">
                        CLICK FOR DETAILS →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <button type="button" onClick={goToPrev} aria-label="Previous" className={`${arrowClass} left-0`}>
          ‹
        </button>
        <button type="button" onClick={goToNext} aria-label="Next" className={`${arrowClass} right-0`}>
          ›
        </button>
      </div>

      {/* Meta info */}
      <div className="detail-meta mt-auto grid grid-cols-1 gap-4 px-4 pt-5 md:grid-cols-3 md:px-6 lg:px-10">
        <div className="text-[7px] uppercase leading-relaxed tracking-[0.15em] opacity-50 md:text-[8px]">
          DESCRIPTION
          <span className="mt-2 block leading-relaxed opacity-100">
            {entry.description}
          </span>
        </div>

        <div className="flex items-end justify-center gap-3">
          {hasSource && (
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-current/20 px-3 py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100 md:text-[8px]"
            >
              ↗ VISIT
            </a>
          )}

          <button
            type="button"
            onClick={() => onNavigateToInfo?.(entry.id)}
            className="border border-current/20 px-3 py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100 md:text-[8px]"
          >
            INFO
          </button>
        </div>

        <div className="md:text-right">
          <span className="block text-[7px] uppercase tracking-[0.15em] opacity-50 md:text-[8px]">
            IMPLEMENTED
          </span>
          <span className="mt-2 block font-mono text-[7px] tracking-[0.1em] md:text-[8px]">
            {entry.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArtifactDetail;