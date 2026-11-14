import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PageFooter from './PageFooter';
import { MOTION, canHover, playEntrance, playSwap, prefersReducedMotion } from '../motion';
import {
  ARTIFACT_CATEGORIES,
  artifacts as entries,
  type ArtifactCategory,
} from '../artifactData';
import { hasLink } from '../siteConfig';
import { usePreviewMedia } from './PreviewMedia';
import FilterDropdown, { FILTER_ALL, type FilterGroup } from './FilterDropdown';

interface ArtifactsProps {
  isDarkMode: boolean;
  onNavigate?: (
    view: 'hero' | 'about' | 'artifacts' | 'studies' | 'contact' | 'writings'
  ) => void;
  onNavigateToDetail?: (artifactId: string) => void;
  onNavigateToInfo?: (artifactId: string) => void;
}

// 'all', or 'category:<id>' / 'type:<name>'
type Filter = string;

const pad3 = (value: string | number) => String(value).padStart(3, '0');

const Artifacts: React.FC<ArtifactsProps> = ({
  isDarkMode,
  onNavigate,
  onNavigateToDetail,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState(entries[0]?.id ?? '');
  const lastSelectedId = useRef(selectedId);
  const lastFilter = useRef(filter);

  const visible = entries.filter((entry) => {
    if (filter === FILTER_ALL) return true;
    const [group, value] = filter.split(':');
    return group === 'category' ? entry.category === value : entry.type === value;
  });

  // Menu options come from the data, so editing entries updates the menu
  const filterGroups: FilterGroup[] = [
    {
      label: 'CATEGORY',
      options: ARTIFACT_CATEGORIES.map((category) => ({
        id: `category:${category.id}`,
        label: category.label,
        count: entries.filter((entry) => entry.category === category.id).length,
      })),
    },
    {
      label: 'TYPE',
      options: Array.from(new Set(entries.map((entry) => entry.type))).map((type) => ({
        id: `type:${type}`,
        label: type.toUpperCase(),
        count: entries.filter((entry) => entry.type === type).length,
      })),
    },
  ];
  // If the selected entry is filtered out, fall back to the first visible one
  const selected = visible.find((entry) => entry.id === selectedId) ?? visible[0];
  const selectedKey = selected?.id ?? '';

  const hasSource = hasLink(selected?.sourceUrl);
  // Preview media (image and/or video, with the IMG / VID switch) lives in PreviewMedia.tsx
  const { media: previewMedia, toggle: previewToggle } = usePreviewMedia({
    id: selected?.id,
    label: selected?.label,
    image: selected?.thumbnail,
    video: selected?.thumbnailVideo,
    mode: selected?.previewMode,
    swapClass: 'entry-swap',
  });

  const hairline = isDarkMode ? 'border-zinc-800' : 'border-zinc-300';
  const softLine = isDarkMode ? 'border-zinc-900' : 'border-zinc-200';
  const mutedLabel = isDarkMode ? 'opacity-50' : 'opacity-60';

  // Page entrance (shared motion settings)
  useGSAP(
    () => {
      playEntrance([
        '.artifacts-intro',
        '.entry-list-head',
        '.entry-list-item',
        '.entry-tabs',
        '.entry-preview',
        '.entry-meta',
      ]);

      // Header line draws in, like the About page
      if (!prefersReducedMotion()) {
        gsap.from('.artifacts-line', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: MOTION.line,
          ease: MOTION.ease,
          clearProps: 'transform',
        });
      }
    },
    { scope: containerRef }
  );

  // Soft swap when the selected entry changes
  useGSAP(
    () => {
      if (lastSelectedId.current === selectedKey) return;
      lastSelectedId.current = selectedKey;
      playSwap('.entry-swap');
    },
    { scope: containerRef, dependencies: [selectedKey] }
  );

  // Soft swap on the list when the filter changes
  useGSAP(
    () => {
      if (lastFilter.current === filter) return;
      lastFilter.current = filter;
      playSwap('.entry-list-item');
    },
    { scope: containerRef, dependencies: [filter] }
  );

  // Mouse: hover previews, click opens. Touch: tap selects (the info block has VIEW).
  const handleRowClick = (id: string) => {
    if (canHover()) {
      onNavigateToDetail?.(id);
    } else {
      setSelectedId(id);
    }
  };

  const handleRowPreview = (id: string) => {
    if (canHover()) setSelectedId(id);
  };

  const renderFilter = (align: 'left' | 'right') => (
    <FilterDropdown
      isDarkMode={isDarkMode}
      value={filter}
      totalCount={entries.length}
      groups={filterGroups}
      onChange={setFilter}
      align={align}
    />
  );

  const specLabel = `block text-[7px] uppercase tracking-[0.2em] ${mutedLabel}`;
  const specValue =
    'entry-swap mt-2 block font-mono text-[7px] uppercase tracking-[0.2em] md:text-[8px]';

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-[1100px] flex-col gap-12 pb-10 pt-8 md:gap-14 md:pt-16"
    >
      {/* Header + content: same structure as About (coordinate label + line, heading, two-tier text) */}
      <section className="px-4 md:px-0">
        <div className="mb-8 flex flex-col items-end justify-between md:flex-row">
          <div className="artifacts-intro mb-3 text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:mb-0 md:text-[7.5px]">
            LOC_00.2 // THE_ARTIFACTS
          </div>
          <div className="artifacts-line h-px w-full bg-current opacity-15 md:w-2/3" />
        </div>

        {/* Left: heading, intro, index. Right: tabs + preview, starting level with the intro. */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:grid-rows-[auto_auto_1fr] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
          <h1 className="artifacts-intro select-none text-[clamp(2rem,9vw,3rem)] font-[100] uppercase leading-[0.95] tracking-[0.25em] md:tracking-[0.3em] lg:col-start-1 lg:row-start-1 lg:text-[clamp(2.5rem,4.5vw,4rem)]">
            ARTIFACTS
          </h1>

          <div className="max-w-[360px] space-y-5 lg:col-start-1 lg:row-start-2">
            <p className="artifacts-intro text-[9px] font-light uppercase leading-[2] tracking-[0.12em] opacity-80 md:text-[11px]">
              A digital archive of generative and traditional artifacts.
            </p>
            <p className="artifacts-intro text-[7.5px] font-medium uppercase leading-[2.2] tracking-[0.18em] opacity-35 md:text-[8.5px]">
              Filter the list and select an entry to preview it.
            </p>
          </div>

          {/* Index list: directly under the intro */}
          <div className="min-w-0 pt-6 lg:col-start-1 lg:row-start-3 lg:self-start lg:pt-10">
            <div className="entry-tabs mb-4 lg:hidden">{renderFilter('left')}</div>

            <div className="entry-list-head flex min-h-[2.25rem] items-center justify-between pb-3 text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px]">
              <span>ENTRIES_{pad3(visible.length)}</span>
              <span>NO.</span>
            </div>

            <div className={`scrollbar-thin max-h-[min(40vh,360px)] overflow-y-auto border-b ${softLine}`}>
              {visible.map((entry) => {
                const isSelected = entry.id === selectedKey;

                return (
                  <div
                    key={entry.id}
                    className={`entry-list-item group relative border-t ${softLine}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleRowClick(entry.id)}
                      onMouseEnter={() => handleRowPreview(entry.id)}
                      onFocus={() => handleRowPreview(entry.id)}
                      className={`grid w-full grid-cols-[1fr_auto] items-center gap-4 py-4 text-left transition-opacity duration-500 motion-reduce:transition-none ${
                        isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <span className="text-[9px] font-light uppercase tracking-[0.25em] transition-transform duration-500 group-hover:translate-x-2 motion-reduce:transform-none md:text-[11px]">
                        {entry.label}
                      </span>
                      <span className="flex items-center gap-6">
                        <span className="hidden text-[6px] uppercase tracking-[0.2em] opacity-60 sm:block">
                          {entry.type}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.2em] md:text-[11px]">
                          {pad3(entry.id)}
                        </span>
                      </span>
                    </button>

                    {/* Underline that draws in for the selected row */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-700 motion-reduce:transition-none ${
                        isDarkMode ? 'bg-zinc-500' : 'bg-zinc-600'
                      } ${isSelected ? 'scale-x-100' : 'scale-x-0'}`}
                    />
                  </div>
                );
              })}

              {visible.length === 0 && (
                <p className="py-6 text-[7px] uppercase tracking-[0.25em] opacity-40 md:text-[8px]">
                  {entries.length === 0 ? 'NO ENTRIES YET' : 'NO ENTRIES MATCH THIS FILTER'}
                </p>
              )}
            </div>
          </div>

          {/* Right (desktop only): filter menu, level with the top of the heading */}
          <div className="entry-tabs hidden justify-end lg:col-start-2 lg:row-start-1 lg:flex lg:self-start">
            {renderFilter('right')}
          </div>

          {/* Right (desktop only): square preview, kept in its previous position */}
          <div className="hidden lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mt-9 lg:block">
            <div
              className={`entry-preview group relative aspect-square w-full overflow-hidden border ${hairline}`}
            >
              {previewMedia}

              <button
                type="button"
                disabled={!selected}
                onClick={() => selected && onNavigateToDetail?.(selected.id)}
                aria-label={selected ? `View ${selected.label}` : 'No entry selected'}
                className="absolute inset-0 z-[5] block text-left"
              >
                <span className="absolute left-3 top-3 text-[6px] uppercase tracking-[0.3em] opacity-60 mix-blend-difference md:text-[7px]">
                  PREVIEW // {selected ? selected.id : '--'}
                </span>
                <span className="absolute bottom-3 right-3 text-[6px] uppercase tracking-[0.3em] opacity-0 mix-blend-difference transition-opacity duration-500 group-hover:opacity-80 motion-reduce:transition-none md:text-[7px]">
                  VIEW →
                </span>
              </button>

              {previewToggle}
            </div>
          </div>
        </div>
      </section>

      {/* Details strip: one minimal row spread across the full width */}
      <section className="entry-meta px-4 md:px-0">
        <div
          className={`grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-5 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-start ${hairline}`}
        >
          <div className="col-span-2 md:col-span-1">
            <span className={specLabel}>DESCRIPTION</span>
            <span className="entry-swap mt-2 block max-w-[320px] text-[8px] font-light uppercase leading-[1.9] tracking-[0.14em] opacity-80 md:text-[9px]">
              {selected?.description ?? '—'}
            </span>
            <span className="entry-swap mt-1 block text-[6.5px] font-medium uppercase tracking-[0.18em] opacity-35 md:text-[7px]">
              {selected ? `${selected.category} // ${selected.type}` : ''}
            </span>
          </div>

          <div>
            <span className={specLabel}>ID_CODE</span>
            <span className={specValue}>{selected?.id ?? '—'}</span>
          </div>
          <div>
            <span className={specLabel}>STATUS</span>
            <span className={specValue}>{selected?.status ?? '—'}</span>
          </div>
          <div>
            <span className={specLabel}>TIMESTAMP</span>
            <span className={specValue}>{selected?.timestamp ?? '—'}</span>
          </div>

          <div className="col-span-2 md:col-span-1 md:justify-self-end md:text-right">
            <span className={specLabel}>ACTIONS</span>
            <div className="mt-2 flex gap-2 md:justify-end">
              {selected && hasSource && (
                <a
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-current/20 px-3 py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100 md:text-[8px]"
                >
                  ↗ VISIT
                </a>
              )}

              {selected && (
                <button
                  type="button"
                  onClick={() => onNavigateToDetail?.(selected.id)}
                  className="border border-current/20 px-3 py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100 md:text-[8px]"
                >
                  VIEW
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Page footer, same as About, Contact and Studies */}
      <section>
        <div className="mt-10 md:mt-20">
          <PageFooter isDarkMode={isDarkMode} onNavigate={onNavigate ?? (() => undefined)} />
        </div>
      </section>
    </div>
  );
};

export default Artifacts;