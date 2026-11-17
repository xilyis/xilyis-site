import React, { useMemo, useState } from 'react';
import FilterDropdown from './FilterDropdown';
import { hasLink } from '../siteConfig';
import { WRITING_KINDS, writings } from './writingData';

interface WritingsProps {
  isDarkMode: boolean;
  onOpenWriting: (slug: string) => void;
  onBack: () => void;
}

const Writings: React.FC<WritingsProps> = ({
  isDarkMode,
  onOpenWriting,
  onBack,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [active, setActive] = useState<number | null>(null);

  const structureLine = isDarkMode ? 'border-zinc-800' : 'border-zinc-300';
  const rowLine = isDarkMode ? 'border-zinc-900' : 'border-zinc-200';
  const underline = isDarkMode ? 'bg-zinc-500' : 'bg-zinc-600';

  // Filter options are built from the data: only kinds that have entries.
  const groups = useMemo(() => {
    const present = WRITING_KINDS.filter((kind) =>
      writings.some((w) => w.kind === kind),
    );
    return [
      {
        label: 'Kind',
        options: [
          { id: 'all', label: 'All', count: writings.length },
          ...present.map((kind) => ({
            id: `kind:${kind}`,
            label: kind,
            count: writings.filter((w) => w.kind === kind).length,
          })),
        ],
      },
    ];
  }, []);

  const visible = writings.filter(
    (w) => filter === 'all' || filter === `kind:${w.kind}`,
  );

  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-12 px-4 pt-8 md:gap-14 md:px-0 md:pt-16">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-8 text-[7px] uppercase tracking-[0.25em] opacity-50 transition-opacity hover:opacity-100 focus:outline-none md:text-[8px]"
        >
          ← About
        </button>

        <p className="text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px]">
          LOC_00.4
        </p>
        <div className="mt-3 h-px bg-current opacity-15 md:w-2/3" />
      </div>

      <h1 className="text-[clamp(2rem,9vw,3rem)] font-[100] uppercase leading-[0.95] tracking-[0.25em] md:tracking-[0.3em] lg:text-[clamp(2.5rem,4.5vw,4rem)]">
        Writing &amp; Research
      </h1>

      <div className="writings-intro flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-[540px] flex-col gap-4">
          <p className="text-[9px] font-light uppercase leading-[2] tracking-[0.12em] opacity-80 md:text-[11px]">
            Essays, visual essays, papers, case studies and whitepapers from an
            emerging research-led design practice.
          </p>
          <p className="text-[7.5px] font-medium uppercase leading-[2.2] tracking-[0.18em] opacity-35 md:text-[8.5px]">
            Each entry documents questions, methods, and directions as they
            develop.
          </p>
        </div>

        {writings.length > 0 && (
          <FilterDropdown
            groups={groups}
            value={filter}
            onChange={setFilter}
            align="right"
            isDarkMode={isDarkMode}
            totalCount={writings.length}
          />
        )}
      </div>

      <main
        aria-label="Writing and research"
        onMouseLeave={() => setActive(null)}
      >
        <div
          className={`writings-list-head flex justify-between border-t pb-3 pt-4 text-[6px] uppercase tracking-[0.2em] opacity-60 ${structureLine}`}
        >
          <span>Index</span>
          <span>{String(visible.length).padStart(2, '0')} Entries</span>
        </div>

        {visible.length === 0 ? (
          <p className="py-8 text-[8px] uppercase tracking-[0.25em] opacity-35">
            {writings.length === 0
              ? 'No entries yet'
              : 'No entries match this filter'}
          </p>
        ) : (
          visible.map((writing, index) => {
            const isActive = active === index;
            const dimmed = active !== null && !isActive;
            const meta = [
              writing.version,
              writing.length,
              hasLink(writing.pdf) ? 'PDF' : null,
              writing.status,
            ]
              .filter(Boolean)
              .join(' · ');

            return (
              <article
                key={writing.slug}
                className={`writing-row border-b ${rowLine}`}
              >
                <button
                  type="button"
                  onClick={() => onOpenWriting(writing.slug)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive(null)}
                  aria-label={`Read ${writing.title}`}
                  className={`grid w-full grid-cols-[56px_1fr_auto] items-start gap-4 py-4 text-left transition-opacity duration-300 focus:outline-none md:grid-cols-[72px_110px_1fr_auto] md:gap-8 ${
                    dimmed ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <span className="pt-px font-mono text-[10px] md:text-[11px]">
                    {writing.code}
                  </span>

                  <span className="hidden pt-px text-[6px] uppercase tracking-[0.2em] opacity-60 md:block">
                    {writing.kind}
                  </span>

                  <span className="block">
                    <span className="relative inline-block pb-1 text-[9px] font-light uppercase tracking-[0.25em] md:text-[11px]">
                      {writing.title}
                      <span
                        aria-hidden="true"
                        className={`absolute bottom-0 left-0 h-px w-full transition-opacity duration-300 ${underline} ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </span>
                    <span className="mt-3 block font-mono text-[7px] opacity-50 md:text-[8px]">
                      {meta}
                    </span>
                  </span>

                  <span className="flex flex-col items-end gap-1 pt-px text-[6px] uppercase tracking-[0.2em] opacity-60">
                    <span>{writing.year}</span>
                    <span className="md:hidden">{writing.kind}</span>
                  </span>
                </button>
              </article>
            );
          })
        )}
      </main>
    </section>
  );
};

export default Writings;