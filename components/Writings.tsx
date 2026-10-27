import React from 'react';
import { writings } from './writingData';

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
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const muted = isDarkMode ? 'text-white/40' : 'text-black/40';

  return (
    <section className={`w-full max-w-[1100px] px-4 pb-24 md:px-0 ${textColor}`}>
      <header className="border-b border-current/15 pb-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-12 text-[8px] uppercase tracking-[0.25em] opacity-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-current"
        >
          ← About
        </button>

        <p className={`mb-5 text-[7px] font-bold uppercase tracking-[0.4em] ${muted}`}>
          Notes // 00.1
        </p>

        <h1 className="text-[13vw] font-[100] uppercase leading-[0.85] tracking-[-0.05em] md:text-[8rem]">
          Writing &amp; Research
        </h1>

        <p className={`mt-10 max-w-[540px] text-[10px] leading-[2] tracking-[0.1em] ${muted}`}>
          Writing and research from an emerging research-led design practice.
          These essays and notes document questions, methods, and directions as
          they develop.
        </p>
      </header>

      <main aria-label="Writing and research articles" className="mt-16">
        {writings.map((writing, index) => (
          <article
            key={writing.slug}
            className="border-t border-current/15"
          >
            <button
              type="button"
              onClick={() => onOpenWriting(writing.slug)}
              className="group grid w-full gap-5 py-8 text-left transition-opacity hover:opacity-70 focus:outline-none focus:ring-1 focus:ring-current md:grid-cols-[70px_150px_1fr_100px] md:items-start md:gap-8"
              aria-label={`Read ${writing.title}`}
            >
              <span className={`text-[8px] tracking-[0.2em] ${muted}`}>
                0{index + 1}
              </span>

              <span className={`text-[8px] uppercase tracking-[0.2em] ${muted}`}>
                {writing.type}
              </span>

              <span>
                <span className="block text-[14px] font-light uppercase tracking-[0.08em] md:text-[17px]">
                  {writing.title}
                </span>

                <span className={`mt-4 block max-w-[560px] text-[10px] leading-[1.9] tracking-[0.08em] ${muted}`}>
                  {writing.excerpt}
                </span>
              </span>

              <span className={`text-[8px] uppercase tracking-[0.15em] md:text-right ${muted}`}>
                {writing.status || writing.date}
                {writing.readingTime && (
                  <span className="mt-2 block">{writing.readingTime}</span>
                )}
              </span>
            </button>
          </article>
        ))}

        <div className="border-t border-current/15" />
      </main>
    </section>
  );
};

export default Writings;
