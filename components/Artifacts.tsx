import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { playEntrance, playSwap } from '../motion';
import { artifacts as entries } from '../artifactData';

interface ArtifactsProps {
  isDarkMode: boolean;
  onNavigate?: (view: 'hero' | 'about' | 'artifacts' | 'studies' | 'contact') => void;
  onNavigateToDetail?: (artifactId: string) => void;
  onNavigateToInfo?: (artifactId: string) => void;
}

const Artifacts: React.FC<ArtifactsProps> = ({
  isDarkMode,
  onNavigateToDetail,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEntry, setSelectedEntry] = useState(0);
  const lastSelected = useRef(selectedEntry);

  const selected = entries[selectedEntry];
  const hasSource = Boolean(selected.sourceUrl) && selected.sourceUrl !== '#';

  // Page entrance (shared motion settings)
  useGSAP(
    () => {
      playEntrance(['.entry-header', '.entry-list-item', '.entry-meta']);
    },
    { scope: containerRef }
  );

  // Soft swap when a different entry is selected
  useGSAP(
    () => {
      if (lastSelected.current === selectedEntry) return;
      lastSelected.current = selectedEntry;
      playSwap('.entry-swap');
    },
    { scope: containerRef, dependencies: [selectedEntry] }
  );

  const mutedLabel = isDarkMode ? 'opacity-50' : 'opacity-60';

  return (
    <div
      ref={containerRef}
      className={`flex w-full flex-1 flex-col px-[10px] pb-16 pt-4 md:px-6 md:pb-20 lg:px-10 ${
        isDarkMode ? 'text-white bg-black' : 'text-black bg-white'
      }`}
    >
      {/* Header */}
      <div className="entry-header mb-6">
        <div className="entry-swap mb-2 text-[7px] uppercase tracking-[0.4em] opacity-60 md:text-[8px]">
          {selected.status} // ARTIFACT_ARCHIVE
        </div>
        <h1 className="entry-swap mb-2 text-[1.75rem] font-[100] uppercase leading-none tracking-[0.05em] md:text-[2rem] lg:text-[2.5rem]">
          {selected.label}
        </h1>
        <p className="entry-swap max-w-md text-[7px] uppercase leading-relaxed tracking-[0.15em] opacity-50 md:text-[8px]">
          {selected.description}
        </p>
      </div>

      {/* List: sized by its content, scrolls only if it gets long */}
      <div className="scrollbar-thin mb-10 max-h-[min(40vh,420px)] max-w-xl overflow-y-auto pr-2">
        <div className="space-y-1 pb-1">
          {entries.map((entry, i) => {
            const isSelected = selectedEntry === i;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedEntry(i)}
                aria-pressed={isSelected}
                className="entry-list-item group w-full text-left"
              >
                <div
                  className={`border p-3 transition-colors duration-300 md:p-4 ${
                    isSelected
                      ? `${isDarkMode ? 'border-white' : 'border-black'} bg-transparent`
                      : isDarkMode
                        ? 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600'
                        : 'border-zinc-300 bg-zinc-100/40 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] tracking-[0.25em] md:text-[11px] ${
                        isSelected ? 'opacity-100' : 'opacity-70'
                      }`}
                    >
                      {entry.label}
                    </span>

                    {/* Badge + marker sit in one group so the badge never shifts on select */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`border px-2 py-1 text-[7px] tracking-[0.2em] ${
                          isDarkMode ? 'border-zinc-800' : 'border-zinc-300'
                        }`}
                      >
                        {entry.type.toUpperCase()}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`w-2 text-[7px] transition-opacity duration-300 ${
                          isSelected
                            ? isDarkMode
                              ? 'opacity-100'
                              : 'opacity-50'
                            : 'opacity-0'
                        }`}
                      >
                        ◉
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom section: pinned to the bottom of the viewport area */}
      <div
        className={`entry-meta mt-auto border-t pt-4 ${
          isDarkMode ? 'border-zinc-800' : 'border-zinc-300'
        }`}
      >
        <dl className="grid max-w-xl grid-cols-[7rem_1fr] gap-y-2 text-[7px] uppercase tracking-[0.2em] md:grid-cols-[9rem_1fr]">
          <dt className={mutedLabel}>ID_CODE</dt>
          <dd className="entry-swap font-mono">{selected.id}</dd>

          <dt className={mutedLabel}>STATUS</dt>
          <dd className="entry-swap font-mono">{selected.status}</dd>

          <dt className={mutedLabel}>TIMESTAMP</dt>
          <dd className="entry-swap font-mono">{selected.timestamp}</dd>
        </dl>

        <div className="mt-3 flex gap-2">
          {hasSource && (
            <a
              href={selected.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-current/20 px-3 py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100"
            >
              ↗ VISIT
            </a>
          )}

          <button
            type="button"
            onClick={() => onNavigateToDetail?.(selected.id)}
            className="border border-current/20 px-3 py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100"
          >
            VIEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Artifacts;