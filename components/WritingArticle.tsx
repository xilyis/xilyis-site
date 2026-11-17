import React, { useEffect, useState } from 'react';
import { getWritingBySlug } from './writingData';
import { SITE_NAME, asset, hasLink } from '../siteConfig';

interface WritingArticleProps {
  slug: string;
  isDarkMode: boolean;
  onBack: () => void;
  onOpenWriting: (slug: string) => void;
}

interface FigureProps {
  src?: string;
  alt: string;
  caption: string;
  label: string;
  lineClass: string;
}

// Missing, "placeholder" or failed images show NO PREVIEW. No generated art.
const Figure: React.FC<FigureProps> = ({ src, alt, caption, label, lineClass }) => {
  const [failed, setFailed] = useState(false);
  const missing = !src || src.toLowerCase().includes('placeholder') || failed;

  return (
    <figure className="my-10">
      <div className={`w-full border ${lineClass}`}>
        {missing ? (
          <div className="flex aspect-[16/9] items-center justify-center text-[7px] uppercase tracking-[0.3em] opacity-35">
            No preview
          </div>
        ) : (
          <img
            src={asset(src)}
            alt={alt}
            onError={() => setFailed(true)}
            className="block h-auto w-full"
          />
        )}
      </div>
      <figcaption className="mt-3 flex gap-4 text-[7px] leading-[2.2] tracking-[0.18em] opacity-50 md:text-[8px]">
        <span className="font-mono">{label}</span>
        <span className="uppercase">{caption}</span>
      </figcaption>
    </figure>
  );
};

const WritingArticle: React.FC<WritingArticleProps> = ({
  slug,
  isDarkMode,
  onBack,
  onOpenWriting,
}) => {
  const writing = getWritingBySlug(slug);

  const structureLine = isDarkMode ? 'border-zinc-800' : 'border-zinc-300';
  const rowLine = isDarkMode ? 'border-zinc-900' : 'border-zinc-200';
  const buttonLine = isDarkMode ? 'border-zinc-700' : 'border-zinc-300';

  useEffect(() => {
    if (!writing) return;

    document.title = `${writing.title} — ${SITE_NAME}`;

    let meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = writing.abstract;

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
    setOpenGraph('og:description', writing.abstract);
    setOpenGraph('og:type', 'article');
  }, [writing]);

  const backButton = (
    <button
      type="button"
      onClick={onBack}
      className="mb-8 text-[7px] uppercase tracking-[0.25em] opacity-50 transition-opacity hover:opacity-100 focus:outline-none md:text-[8px]"
    >
      ← Writing &amp; Research
    </button>
  );

  if (!writing) {
    return (
      <section className="mx-auto w-full max-w-[1100px] px-4 pt-8 md:px-0 md:pt-16">
        {backButton}
        <p className="text-[8px] uppercase tracking-[0.25em] opacity-35">
          Entry not found
        </p>
      </section>
    );
  }

  const specs: { label: string; value: string }[] = [
    { label: 'Kind', value: writing.kind },
    { label: 'Year', value: writing.year },
    { label: 'Version', value: writing.version },
    ...(writing.length ? [{ label: 'Length', value: writing.length }] : []),
    ...(writing.status ? [{ label: 'Status', value: writing.status }] : []),
    ...(writing.keywords.length
      ? [{ label: 'Keywords', value: writing.keywords.join(', ') }]
      : []),
  ];

  const related = (writing.related ?? [])
    .map((relatedSlug) => getWritingBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  let headingCount = 0;
  let figureCount = 0;

  return (
    <article className="mx-auto flex w-full max-w-[1100px] flex-col gap-12 px-4 pb-8 pt-8 md:gap-14 md:px-0 md:pt-16">
      <header>
        {backButton}

        <p className="text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px]">
          {writing.code} // {writing.kind}
        </p>
        <div className="mt-3 h-px bg-current opacity-15 md:w-2/3" />

        <h1 className="mt-12 max-w-[900px] break-words text-[clamp(2rem,9vw,3rem)] font-[100] uppercase leading-[0.95] tracking-[0.25em] md:tracking-[0.3em] lg:text-[clamp(2.5rem,4.5vw,4rem)]">
          {writing.title}
        </h1>

        {writing.subtitle && (
          <p className="mt-6 max-w-[540px] text-[7.5px] font-medium uppercase leading-[2.2] tracking-[0.18em] opacity-35 md:text-[8.5px]">
            {writing.subtitle}
          </p>
        )}
      </header>

      {/* Spec strip */}
      <dl
        className={`grid grid-cols-2 gap-x-6 gap-y-5 border-y py-5 md:grid-cols-3 lg:grid-cols-6 ${structureLine}`}
      >
        {specs.map((spec) => (
          <div key={spec.label}>
            <dt className="text-[7px] uppercase tracking-[0.2em] opacity-50">
              {spec.label}
            </dt>
            <dd className="mt-2 font-mono text-[7px] md:text-[8px]">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Abstract + document action */}
      <div className="flex max-w-[620px] flex-col gap-4">
        <p className="text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px]">
          Abstract
        </p>
        <p className="text-[9px] font-light uppercase leading-[2] tracking-[0.12em] opacity-80 md:text-[11px]">
          {writing.abstract}
        </p>

        {hasLink(writing.pdf) && (
          <a
            href={asset(writing.pdf as string)}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 inline-block w-fit border px-3 py-1.5 text-[7px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100 md:text-[8px] ${buttonLine}`}
          >
            PDF ↗
          </a>
        )}
      </div>

      {/* Body */}
      <div className="max-w-[620px]">
        {writing.content.map((block, index) => {
          if (block.type === 'heading') {
            headingCount += 1;
            return (
              <h2
                key={index}
                className="mb-5 mt-14 flex gap-4 text-[9px] font-light uppercase tracking-[0.25em] md:text-[11px]"
              >
                <span className="font-mono opacity-50">
                  {headingCount}.0
                </span>
                <span>{block.text}</span>
              </h2>
            );
          }

          if (block.type === 'blockquote') {
            return (
              <blockquote
                key={index}
                className={`my-10 border-l pl-6 text-[10px] font-light italic leading-[2.2] tracking-[0.06em] opacity-60 md:text-[11px] ${structureLine}`}
              >
                {block.text}
              </blockquote>
            );
          }

          if (block.type === 'list') {
            return (
              <ul
                key={index}
                className="my-8 space-y-3 pl-5 text-[10px] font-light leading-[2.2] tracking-[0.06em] opacity-80 md:text-[11px]"
              >
                {block.items.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === 'figure') {
            figureCount += 1;
            return (
              <Figure
                key={index}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
                label={`FIG. ${String(figureCount).padStart(2, '0')}`}
                lineClass={rowLine}
              />
            );
          }

          return (
            <p
              key={index}
              className="mb-7 text-[10px] font-light leading-[2.2] tracking-[0.06em] opacity-80 md:text-[11px]"
            >
              {block.text}
            </p>
          );
        })}
      </div>

      {/* Notes */}
      {writing.notes && writing.notes.length > 0 && (
        <section className={`max-w-[620px] border-t pt-6 ${structureLine}`}>
          <p className="mb-4 text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px]">
            Notes
          </p>
          <ol className="space-y-3">
            {writing.notes.map((note, index) => (
              <li
                key={index}
                className="flex gap-4 text-[8px] leading-[2.2] tracking-[0.06em] opacity-60 md:text-[9px]"
              >
                <span className="font-mono">[{index + 1}]</span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* References */}
      {writing.references && writing.references.length > 0 && (
        <section className={`max-w-[620px] border-t pt-6 ${structureLine}`}>
          <p className="mb-4 text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px]">
            References
          </p>
          <ul className="space-y-3">
            {writing.references.map((reference, index) => (
              <li
                key={index}
                className="text-[8px] leading-[2.2] tracking-[0.06em] opacity-60 md:text-[9px]"
              >
                {reference}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Cite */}
      <section className={`max-w-[620px] border-t pt-6 ${structureLine}`}>
        <p className="mb-4 text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px]">
          Cite this
        </p>
        <p className="font-mono text-[7px] leading-[2.2] opacity-60 md:text-[8px]">
          {SITE_NAME}, “{writing.title}”, {writing.kind}, {writing.year},{' '}
          {writing.version}.
        </p>
      </section>

      {/* Related: only entries you list by slug */}
      {related.length > 0 && (
        <nav
          aria-label="Related writing"
          className={`border-t pt-6 ${structureLine}`}
        >
          <p className="mb-4 text-[6.5px] font-bold uppercase tracking-[0.4em] opacity-30 md:text-[7.5px]">
            Related
          </p>
          <ul>
            {related.map((item) => (
              <li key={item.slug} className={`border-b ${rowLine}`}>
                <button
                  type="button"
                  onClick={() => onOpenWriting(item.slug)}
                  className="flex w-full gap-6 py-4 text-left opacity-60 transition-opacity hover:opacity-100 focus:outline-none"
                >
                  <span className="font-mono text-[10px] md:text-[11px]">
                    {item.code}
                  </span>
                  <span className="text-[9px] font-light uppercase tracking-[0.25em] md:text-[11px]">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
};

export default WritingArticle;