import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PageFooter from './PageFooter';
import FilterDropdown, { FILTER_ALL, type FilterGroup } from './FilterDropdown';
import { studies, type StudyEntry } from '../studyData';
import { usePreviewMedia } from './PreviewMedia';
import { hasLink } from '../siteConfig';
import { MOTION, canHover, playEntrance, playSwap, prefersReducedMotion } from '../motion';

interface StudiesProps {
  isDarkMode: boolean;
  onNavigate: (
    view: 'hero' | 'about' | 'artifacts' | 'studies' | 'contact' | 'writings'
  ) => void;
}

/** "CANVAS / MOTION" -> category + subcategory. Falls back to the study type. */
const splitCategory = (study: StudyEntry) => {
  const [category, subcategory] = study.category.split(' / ');
  return { category, subcategory: subcategory ?? study.type.toUpperCase() };
};

const getYear = (timestamp: string) => timestamp.slice(0, 4);

const pad3 = (value: string | number) => String(value).padStart(3, '0');

// Shared by the header row and every study row so the columns line up
const ROW_COLUMNS = 'md:grid-cols-[1fr_9rem_9rem_3rem_2.5rem]';

/* ---------- Page ---------- */

const Studies: React.FC<StudiesProps> = ({ isDarkMode, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const [selectedEntry, setSelectedEntry] = useState(0);
  const lastSelected = useRef(selectedEntry);
  // 'all', or 'category:<name>' / 'subcategory:<name>'
  const [filter, setFilter] = useState(FILTER_ALL);
  const lastFilter = useRef(filter);

  // Filter menu: options are built from the studies themselves
  const filterGroups: FilterGroup[] = (['category', 'subcategory'] as const).map((kind) => {
    const counts = new Map<string, number>();
    studies.forEach((study) => {
      const name = splitCategory(study)[kind];
      counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    return {
      label: kind.toUpperCase(),
      options: Array.from(counts, ([name, count]) => ({
        id: `${kind}:${name}`,
        label: name,
        count,
      })),
    };
  });

  const visibleEntries = studies
    .map((study, index) => ({ study, index }))
    .filter(({ study }) => {
      if (filter === FILTER_ALL) return true;
      const separator = filter.indexOf(':');
      const kind = filter.slice(0, separator) as 'category' | 'subcategory';
      return splitCategory(study)[kind] === filter.slice(separator + 1);
    });

  // If the selected study is filtered out, feature the first visible one
  const featuredIndex = visibleEntries.some(({ index }) => index === selectedEntry)
    ? selectedEntry
    : visibleEntries[0]?.index ?? selectedEntry;
  const featured: StudyEntry | undefined = studies[featuredIndex];
  const featuredCategory = featured
    ? splitCategory(featured)
    : { category: '', subcategory: '' };

  // Preview media (image and/or video, with the IMG / VID switch) lives in PreviewMedia.tsx
  const { media: previewMedia, toggle: previewToggle } = usePreviewMedia({
    id: featured?.id,
    label: featured?.label,
    image: featured?.thumbnail,
    video: featured?.thumbnailVideo,
    mode: featured?.previewMode,
    swapClass: 'featured-swap',
  });
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Page entrance (shared motion settings)
  useGSAP(
    () => {
      playEntrance([
        '.studies-intro',
        '.studies-featured',
        '.studies-list-head',
        '.study-row',
        '.studies-meta',
      ]);

      // Header line draws in, like the About page
      if (!prefersReducedMotion()) {
        gsap.from('.studies-line', {
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

  // Soft swap when a different study is featured
  useGSAP(
    () => {
      if (lastSelected.current === featuredIndex) return;
      lastSelected.current = featuredIndex;
      playSwap('.featured-swap');
    },
    { scope: containerRef, dependencies: [featuredIndex] }
  );

  // Soft swap on the list when the filter changes
  useGSAP(
    () => {
      if (lastFilter.current === filter) return;
      lastFilter.current = filter;
      playSwap('.study-row');
    },
    { scope: containerRef, dependencies: [filter] }
  );

  const scrollBehavior = (): ScrollBehavior =>
    prefersReducedMotion() ? 'auto' : 'smooth';

  // Mouse: hover previews a study, click opens it.
  // Touch: tap features it (and scrolls up to the card).
  const handleRowClick = (study: StudyEntry, index: number) => {
    if (canHover()) {
      if (hasLink(study.sourceUrl)) {
        window.open(study.sourceUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    setSelectedEntry(index);
    featuredRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  };

  const handleRowPreview = (index: number) => {
    if (canHover()) setSelectedEntry(index);
  };

  // Subtle parallax on the featured artwork
  const handleCardMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !artRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(artRef.current, {
      x: x * -14,
      y: y * -14,
      duration: 0.8,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const handleCardLeave = () => {
    if (!artRef.current) return;
    gsap.to(artRef.current, { x: 0, y: 0, duration: 1, ease: 'power3.out' });
  };

  // Explicit zinc lines, like the rest of the app. Opacity-suffixed currentColor
  // borders render as solid white here, which is why the lines looked heavy.
  const hairline = isDarkMode ? 'border-zinc-800' : 'border-zinc-300';
  const softLine = isDarkMode ? 'border-zinc-900' : 'border-zinc-200';
  const metaItem = `border-l ${hairline} pl-4 text-[6px] uppercase tracking-[0.25em] opacity-70 md:text-[7px]`;

  // Details strip styling, shared with the Artifacts page
  const hasSource = hasLink(featured?.sourceUrl);
  const mutedLabel = isDarkMode ? 'opacity-50' : 'opacity-60';
  const specLabel = `block text-[7px] uppercase tracking-[0.2em] ${mutedLabel}`;
  const specValue =
    'featured-swap mt-2 block font-mono text-[7px] uppercase tracking-[0.2em] md:text-[8px]';

  // No studies yet: a quiet page instead of an empty card
  if (!featured) {
    return (
      <div ref={containerRef} className="relative mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-12 pb-10 pt-8 md:gap-14 md:pt-16">
        <section className="px-4 md:px-0">
          <h1 className="studies-intro mb-6 text-[clamp(2rem,9vw,3rem)] font-[100] uppercase leading-[0.95] tracking-[0.25em] lg:text-[clamp(2.5rem,4.5vw,4rem)]">
            STUDIES
          </h1>
          <p className="studies-intro text-[7.5px] font-medium uppercase leading-[2.2] tracking-[0.18em] opacity-35 md:text-[8.5px]">
            NO STUDIES YET
          </p>
        </section>
        <section>
          <PageFooter isDarkMode={isDarkMode} onNavigate={onNavigate} />
        </section>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex w-full flex-1 flex-col ${
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Same width and rhythm as the About page: narrow column, lots of air */}
      <div className="relative mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-12 pb-10 pt-8 md:gap-14 md:pt-16">
        {/* Header + featured study */}
        <section className="px-4 md:px-0">
          <div className="mb-10 flex flex-col items-end justify-between md:flex-row">
            <div className="studies-intro mb-3 text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:mb-0 md:text-[7.5px]">
              LOC_00.3 // THE_STUDIES
            </div>
            <div className="studies-line h-px w-full bg-current opacity-15 md:w-2/3" />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
            {/* Intro */}
            <div className="flex flex-col justify-between gap-10">
              <h1 className="studies-intro select-none text-[clamp(2rem,9vw,3rem)] font-[100] uppercase leading-[0.95] tracking-[0.25em] md:tracking-[0.3em] lg:text-[clamp(2.5rem,4.5vw,4rem)]">
                STUDIES
              </h1>

              <div className="max-w-[360px] space-y-5">
                <p className="studies-intro text-[9px] font-light uppercase leading-[2] tracking-[0.12em] opacity-80 md:text-[11px]">
                  An ongoing archive of experiments in motion, interaction and
                  generative form.
                </p>
                <p className="studies-intro text-[7.5px] font-medium uppercase leading-[2.2] tracking-[0.18em] opacity-35 md:text-[8.5px]">
                  {pad(studies.length)} entries. Select one to feature it.
                </p>

                <div className="studies-intro pt-2">
                  <FilterDropdown
                    isDarkMode={isDarkMode}
                    value={filter}
                    totalCount={studies.length}
                    groups={filterGroups}
                    onChange={setFilter}
                    align="left"
                  />
                </div>
              </div>
            </div>

            {/* Featured study: artwork fills the card, text sits over it */}
            <div
              ref={featuredRef}
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
              className={`studies-featured relative min-h-[260px] scroll-mt-20 overflow-hidden border lg:min-h-[250px] ${hairline}`}
            >
              <div ref={artRef} className="absolute -inset-4">
                {previewMedia}
              </div>

              {previewToggle}

              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
                  isDarkMode ? 'from-black/80' : 'from-white/80'
                }`}
              />

              <div className="featured-swap absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="mb-2 text-[6px] uppercase tracking-[0.3em] opacity-60 md:text-[7px]">
                  FEATURED STUDY // {featured.id}
                </p>

                <h2 className="mb-4 text-[1.1rem] font-[100] uppercase leading-none tracking-[0.08em] md:text-[1.5rem]">
                  {featured.label}
                </h2>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="text-[6px] uppercase tracking-[0.25em] opacity-70 md:text-[7px]">
                      {featuredCategory.category}
                    </span>
                    <span className={metaItem}>{featuredCategory.subcategory}</span>
                    <span className={metaItem}>{featured.timestamp}</span>
                  </div>

                  {hasSource && (
                    <a
                      href={featured.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-[7px] uppercase tracking-[0.25em] opacity-70 transition-opacity hover:opacity-100"
                    >
                      EXPLORE PROJECT
                      <span className="transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transform-none">
                        →
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Study index: same table styling as the Artifacts list */}
        <section className="px-4 md:px-0">
          <div
            className={`studies-list-head grid min-h-[2.25rem] grid-cols-[1fr_auto] items-center gap-4 pb-3 text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px] ${ROW_COLUMNS}`}
          >
            <span>STUDIES_{pad3(visibleEntries.length)}</span>
            <span className="hidden md:block">CATEGORY</span>
            <span className="hidden md:block">SUBCATEGORY</span>
            <span className="hidden md:block">YEAR</span>
            <span className="text-right">NO.</span>
          </div>

          <div
            className={`scrollbar-thin border-b lg:max-h-[max(9rem,calc(100svh-45rem))] lg:overflow-y-auto ${softLine}`}
          >
            {visibleEntries.map(({ study, index }) => {
              const isSelected = featuredIndex === index;
              const { category, subcategory } = splitCategory(study);

              return (
                <div
                  key={study.id}
                  className={`study-row group relative border-t ${softLine}`}
                >
                  <button
                    type="button"
                    onClick={() => handleRowClick(study, index)}
                    onMouseEnter={() => handleRowPreview(index)}
                    onFocus={() => handleRowPreview(index)}
                    className={`grid w-full grid-cols-[1fr_auto] items-center gap-4 py-4 text-left transition-opacity duration-500 motion-reduce:transition-none ${ROW_COLUMNS} ${
                      isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <span>
                      <span className="inline-block text-[9px] font-light uppercase tracking-[0.25em] transition-transform duration-500 group-hover:translate-x-2 motion-reduce:transform-none md:text-[11px]">
                        {study.label}
                      </span>
                      {/* Small screens: fold the other columns under the title */}
                      <span className="mt-2 block text-[6px] uppercase tracking-[0.2em] opacity-60 md:hidden">
                        {category} / {subcategory} / {getYear(study.timestamp)}
                      </span>
                    </span>

                    <span className="hidden text-[6px] uppercase tracking-[0.2em] opacity-60 md:block">
                      {category}
                    </span>
                    <span className="hidden text-[6px] uppercase tracking-[0.2em] opacity-60 md:block">
                      {subcategory}
                    </span>
                    <span className="hidden text-[6px] uppercase tabular-nums tracking-[0.2em] opacity-60 md:block">
                      {getYear(study.timestamp)}
                    </span>
                    <span className="text-right font-mono text-[10px] tracking-[0.2em] md:text-[11px]">
                      {pad3(study.id)}
                    </span>
                  </button>

                  {/* Underline that draws in for the featured row */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-700 motion-reduce:transition-none ${
                      isDarkMode ? 'bg-zinc-500' : 'bg-zinc-600'
                    } ${isSelected ? 'scale-x-100' : 'scale-x-0'}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Details strip: same design as the Artifacts page */}
          <div
            className={`studies-meta mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-5 md:mt-14 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-start ${hairline}`}
          >
            <div className="col-span-2 md:col-span-1">
              <span className={specLabel}>DESCRIPTION</span>
              <span className="featured-swap mt-2 block max-w-[320px] text-[8px] font-light uppercase leading-[1.9] tracking-[0.14em] opacity-80 md:text-[9px]">
                {featured.description}
              </span>
              <span className="featured-swap mt-1 block text-[6.5px] font-medium uppercase tracking-[0.18em] opacity-35 md:text-[7px]">
                {featured.category} // {featured.type}
              </span>
            </div>

            <div>
              <span className={specLabel}>ID_CODE</span>
              <span className={specValue}>{featured.id}</span>
            </div>
            <div>
              <span className={specLabel}>STATUS</span>
              <span className={specValue}>{featured.status}</span>
            </div>
            <div>
              <span className={specLabel}>TIMESTAMP</span>
              <span className={specValue}>{featured.timestamp}</span>
            </div>

            <div className="col-span-2 md:col-span-1 md:justify-self-end md:text-right">
              <span className={specLabel}>ACTIONS</span>
              <div className="mt-2 flex gap-2 md:justify-end">
                {hasSource ? (
                  <a
                    href={featured.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-current/20 px-3 py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100 md:text-[8px]"
                  >
                    ↗ VISIT
                  </a>
                ) : (
                  <span className="py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-30 md:text-[8px]">
                    —
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Page footer, same as About and Contact */}
        <section>
          <div className="mt-10 md:mt-20">
            <PageFooter isDarkMode={isDarkMode} onNavigate={onNavigate} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Studies;