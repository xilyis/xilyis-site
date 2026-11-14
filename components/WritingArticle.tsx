import React, { useEffect } from 'react';
import { getWritingBySlug, writings } from './writingData';
import { SITE_NAME } from '../siteConfig';

interface WritingArticleProps {
  slug: string;
  isDarkMode: boolean;
  onBack: () => void;
  onOpenWriting: (slug: string) => void;
}

const WritingArticle: React.FC<WritingArticleProps> = ({
  slug,
  isDarkMode,
  onBack,
  onOpenWriting,
}) => {
  const writing = getWritingBySlug(slug);

  useEffect(() => {
    if (!writing) return;

    document.title = `${writing.title} — ${SITE_NAME}`;

    const description = writing.excerpt;
    let meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }

    meta.content = description;

    const setOpenGraph = (property: string, content: string) => {
      let tag = document.querySelector(
        `meta[property="${property}"]`,
      ) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }

      tag.content = content;
    };

    setOpenGraph('og:title', writing.title);
    setOpenGraph('og:description', writing.excerpt);
    setOpenGraph('og:type', 'article');
  }, [writing]);

  if (!writing) {
    return (
      <section className="w-full max-w-[760px] px-4 pb-24 md:px-0">
        <button
          type="button"
          onClick={onBack}
          className="text-[8px] uppercase tracking-[0.25em] opacity-60 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-current"
        >
          ← Writing &amp; Research
        </button>

        <h1 className="mt-20 text-3xl font-light uppercase">
          Writing not found
        </h1>
      </section>
    );
  }

  const currentIndex = writings.findIndex((item) => item.slug === slug);
  const previous = writings[currentIndex - 1];
  const next = writings[currentIndex + 1];

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const muted = isDarkMode ? 'text-white/45' : 'text-black/45';

  return (
    <article className={`w-full max-w-[760px] px-4 pb-24 md:px-0 ${textColor}`}>
      <header className="border-b border-current/15 pb-12">
        <button
          type="button"
          onClick={onBack}
          className="mb-20 text-[8px] uppercase tracking-[0.25em] opacity-55 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-current"
        >
          ← Writing &amp; Research
        </button>

        <div className={`mb-7 flex flex-wrap gap-x-6 gap-y-2 text-[8px] uppercase tracking-[0.2em] ${muted}`}>
          <span>{writing.type}</span>
          {writing.status && <span>{writing.status}</span>}
          {writing.date && <span>{writing.date}</span>}
          {writing.readingTime && <span>{writing.readingTime}</span>}
        </div>

        <h1 className="max-w-[720px] text-[11vw] font-[100] uppercase leading-[0.9] tracking-[-0.04em] md:text-[5.5rem]">
          {writing.title}
        </h1>

        {writing.subtitle && (
          <p className={`mt-8 max-w-[570px] text-[12px] leading-[1.9] tracking-[0.06em] ${muted}`}>
            {writing.subtitle}
          </p>
        )}
      </header>

      <div className="prose-container mt-14 max-w-[620px]">
        {writing.content.map((block, index) => {
          if (block.type === 'heading') {
            return (
              <h2
                key={index}
                className="mb-5 mt-14 text-[14px] font-light uppercase tracking-[0.08em]"
              >
                {block.text}
              </h2>
            );
          }

          if (block.type === 'blockquote') {
            return (
              <blockquote
                key={index}
                className={`my-10 border-l border-current/40 pl-6 text-[13px] italic leading-[2] tracking-[0.04em] ${muted}`}
              >
                {block.text}
              </blockquote>
            );
          }

          if (block.type === 'list') {
            return (
              <ul
                key={index}
                className="my-8 space-y-4 pl-5 text-[12px] leading-[2] tracking-[0.04em]"
              >
                {block.items.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p
              key={index}
              className="mb-7 text-[12px] leading-[2.15] tracking-[0.035em] opacity-85 md:text-[13px]"
            >
              {block.text}
            </p>
          );
        })}
      </div>

      <nav
        aria-label="Article navigation"
        className="mt-20 grid grid-cols-1 gap-5 border-t border-current/15 pt-8 md:grid-cols-2"
      >
        {previous ? (
          <button
            type="button"
            onClick={() => onOpenWriting(previous.slug)}
            className="text-left focus:outline-none focus:ring-1 focus:ring-current"
          >
            <span className={`block text-[8px] uppercase tracking-[0.2em] ${muted}`}>
              ← Previous
            </span>
            <span className="mt-3 block text-[11px] uppercase tracking-[0.06em]">
              {previous.title}
            </span>
          </button>
        ) : (
          <span />
        )}

        {next && (
          <button
            type="button"
            onClick={() => onOpenWriting(next.slug)}
            className="text-left md:text-right focus:outline-none focus:ring-1 focus:ring-current"
          >
            <span className={`block text-[8px] uppercase tracking-[0.2em] ${muted}`}>
              Next →
            </span>
            <span className="mt-3 block text-[11px] uppercase tracking-[0.06em]">
              {next.title}
            </span>
          </button>
        )}
      </nav>
    </article>
  );
};

export default WritingArticle;