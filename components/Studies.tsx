import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { playEntrance } from '../motion';

interface StudyEntry {
  id: string;
  label: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'UNRESOLVED';
  timestamp: string;
  category: string;
  description: string;
  sourceUrl: string;
  thumbnail?: string;
  type: 'web' | 'motion' | 'canvas' | 'other';
}

interface StudiesProps {
  isDarkMode: boolean;
}

const Studies: React.FC<StudiesProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEntry, setSelectedEntry] = useState(0);

  const studies: StudyEntry[] = [
    {
      id: '07',
      label: 'UNRESOLVED FORMS',
      status: 'ACTIVE',
      timestamp: '2026.03.08',
      category: 'GENERATIVE TYPE',
      description:
        'An ongoing study of unstable letterforms, fragmented systems, and procedural distortion.',
      sourceUrl: 'https://codepen.io/your-username/pen/your-study-07',
      thumbnail: '',
      type: 'web',
    },
    {
      id: '06',
      label: 'NOISE STUDY',
      status: 'ACTIVE',
      timestamp: '2026.02.19',
      category: 'CANVAS / MOTION',
      description:
        'A visual investigation into procedural noise, interference, and digital residue.',
      sourceUrl: 'https://codepen.io/your-username/pen/your-study-06',
      thumbnail: '',
      type: 'canvas',
    },
    {
      id: '05',
      label: 'SOFT SYSTEM',
      status: 'ARCHIVED',
      timestamp: '2025.11.02',
      category: 'MOTION / WEBGL',
      description:
        'A responsive interaction study focused on soft movement and unstable transitions.',
      sourceUrl: 'https://codepen.io/your-username/pen/your-study-05',
      thumbnail: '',
      type: 'motion',
    },
    {
      id: '04',
      label: 'UNNAMED INTERFACE',
      status: 'UNRESOLVED',
      timestamp: '2025.08.14',
      category: 'INTERACTION',
      description:
        'An unfinished interface system exploring navigation without a fixed hierarchy.',
      sourceUrl: 'https://codepen.io/your-username/pen/your-study-04',
      thumbnail: '',
      type: 'web',
    },
  ];

  useGSAP(
    () => {
      playEntrance([
        '.studies-subtitle',
        '.studies-title',
        '.study-list-item',
        '.studies-meta',
      ]);
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`flex w-full flex-1 flex-col px-[10px] pb-16 pt-4 md:px-6 md:pb-20 lg:px-10 ${
        isDarkMode
          ? 'bg-black text-white'
          : 'bg-white text-black'
      }`}
    >
      <div className="relative flex flex-1 flex-col">
        {/* Page label */}
        <div className="absolute left-0 top-0 text-[7px] uppercase tracking-[0.35em] opacity-50">
          ACTIVE / STUDIES
        </div>

        {/* Right-aligned content */}
        <div className="ml-auto flex w-full max-w-[720px] flex-1 flex-col pt-8 md:pt-10 lg:mr-[2%] lg:w-[58%]">
          <div className="studies-subtitle mb-2 text-[7px] uppercase tracking-[0.4em] opacity-60">
            STUDY_ARCHIVE / ACTIVE
          </div>

          <h1 className="studies-title mb-6 text-[1.7rem] font-[100] uppercase leading-none tracking-[0.08em] md:text-[2.2rem] lg:text-[2.7rem]">
            STUDIES
          </h1>

          {/* Expandable horizontal study rows */}
          <div className="study-list mb-10 space-y-1">
            {studies.map((study, index) => {
              const isSelected = selectedEntry === index;

              return (
                <div
                  key={study.id}
                  className={`study-list-item border transition-colors duration-500 motion-reduce:transition-none ${
                    isSelected
                      ? isDarkMode
                        ? 'border-zinc-500'
                        : 'border-zinc-700'
                      : isDarkMode
                        ? 'border-zinc-900'
                        : 'border-zinc-300'
                  }`}
                >
                  {/* Compressed row */}
                  <button
                    type="button"
                    onClick={() => setSelectedEntry(index)}
                    aria-expanded={isSelected}
                    aria-controls={`study-panel-${study.id}`}
                    className="group flex w-full items-center justify-between px-3 py-3 text-left md:px-4"
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={`font-mono text-[8px] tracking-[0.2em] ${
                          isSelected ? 'opacity-100' : 'opacity-45'
                        }`}
                      >
                        {study.id}
                      </span>

                      <span
                        className={`text-[8px] uppercase tracking-[0.22em] transition-opacity md:text-[9px] ${
                          isSelected
                            ? 'opacity-100'
                            : 'opacity-55 group-hover:opacity-100'
                        }`}
                      >
                        {study.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="hidden text-[6px] uppercase tracking-[0.2em] opacity-35 md:block">
                        {study.category}
                      </span>

                      <span
                        className={`text-[8px] transition-transform duration-300 ${
                          isSelected
                            ? 'rotate-90 opacity-100'
                            : 'opacity-40'
                        }`}
                      >
                        →
                      </span>
                    </div>
                  </button>

                  {/* Expanded selected study */}
                  <div
                    id={`study-panel-${study.id}`}
                    inert={!isSelected}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none ${
                      isSelected
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-current/10 px-3 pb-4 pt-4 md:px-4">
                        <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                          {/* Study information */}
                          <div>
                            <div className="mb-4 text-[7px] uppercase tracking-[0.3em] opacity-50">
                              {study.status} // {study.type}
                            </div>

                            <p className="mb-5 max-w-[390px] text-[7px] uppercase leading-[1.9] tracking-[0.14em] opacity-60">
                              {study.description}
                            </p>

                            <div className="mb-5 grid grid-cols-2 gap-y-3 text-[6px] uppercase tracking-[0.2em]">
                              <span className="opacity-40">
                                CATEGORY
                              </span>

                              <span className="font-mono text-right">
                                {study.category}
                              </span>

                              <span className="opacity-40">
                                TIMESTAMP
                              </span>

                              <span className="font-mono text-right">
                                {study.timestamp}
                              </span>

                              <span className="opacity-40">
                                STATUS
                              </span>

                              <span className="font-mono text-right">
                                {study.status}
                              </span>
                            </div>

                            <a
                              href={study.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block border border-current/30 px-3 py-2 text-[7px] uppercase tracking-[0.2em] opacity-65 transition-opacity hover:opacity-100"
                            >
                              OPEN STUDY ↗
                            </a>
                          </div>

                          {/* Preview only appears inside expanded row */}
                          <div
                            className={`relative h-[115px] overflow-hidden border ${
                              isDarkMode
                                ? 'border-zinc-800'
                                : 'border-zinc-300'
                            }`}
                          >
                            {study.thumbnail ? (
                              <img
                                src={study.thumbnail}
                                alt={study.label}
                                className="h-full w-full object-cover grayscale opacity-70"
                              />
                            ) : (
                              <div className="relative h-full w-full opacity-60">
                                <div className="absolute left-[10%] top-[45%] h-px w-[80%] rotate-[18deg] bg-current" />

                                <div className="absolute left-[15%] top-[60%] h-px w-[70%] -rotate-[25deg] bg-current" />

                                <div className="absolute left-[30%] top-[15%] h-[75%] w-px rotate-[28deg] bg-current" />

                                <div className="absolute left-[60%] top-[20%] h-[70%] w-px -rotate-[35deg] bg-current" />

                                <div className="absolute left-[72%] top-[35%] h-px w-[20%] rotate-[50deg] bg-current" />
                              </div>
                            )}

                            <span className="absolute bottom-2 left-2 text-[5px] uppercase tracking-[0.2em] opacity-50">
                              OUTPUT / {study.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom metadata */}
          <div className="studies-meta mt-auto border-t border-current/10 pt-4">
            <div className="grid grid-cols-2 gap-y-3 text-[7px] uppercase tracking-[0.2em] md:grid-cols-3">
              <div className="opacity-45">SELECTED</div>

              <div className="font-mono">
                {studies[selectedEntry].id}
              </div>

              <div className="hidden md:block" />

              <div className="opacity-45">TOTAL</div>

              <div className="font-mono">
                {studies.length.toString().padStart(2, '0')}
              </div>

              <div className="hidden md:block" />

              <div className="opacity-45">ACTIVE</div>

              <div className="font-mono">
                {studies
                  .filter((study) => study.status === 'ACTIVE')
                  .length.toString()
                  .padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Studies;