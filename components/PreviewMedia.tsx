import React, { useState } from 'react';
import { prefersReducedMotion } from '../motion';
import { asset } from '../siteConfig';

/** A real file path: not empty and not one of the template placeholders. */
export const isRealMedia = (src?: string): src is string =>
  Boolean(src) && !src!.includes('placeholder');

interface PreviewMediaOptions {
  /** Entry id. Without one, the preview shows nothing. */
  id?: string;
  label?: string;
  image?: string;
  video?: string;
  /** Which kind shows first when both exist. Defaults to 'video'. */
  mode?: 'image' | 'video';
  /** Class added to the media layer so pages can fade it with playSwap(). */
  swapClass?: string;
}

/**
 * Shared preview logic for Artifacts and Studies: image and/or video,
 * with a visitor-facing IMG / VID switch when an entry has both.
 *
 * Returns two elements for the page to place:
 *   media  absolute inset-0 layer (put it inside a `relative` box)
 *   toggle absolute top-right switch, or null when there is nothing to switch
 */
export const usePreviewMedia = ({
  id,
  label = '',
  image,
  video,
  mode,
  swapClass = '',
}: PreviewMediaOptions) => {
  // Keys look like 'image:01' / 'video:01'; set when a file fails to load
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  // Visitor's IMG / VID choice per entry (overrides `mode`)
  const [viewerMode, setViewerMode] = useState<Record<string, 'image' | 'video'>>({});

  const key = id ?? '';
  const imageSrc = isRealMedia(image) && !failed[`image:${key}`] ? image : undefined;
  const videoSrc = isRealMedia(video) && !failed[`video:${key}`] ? video : undefined;
  const hasBoth = Boolean(imageSrc && videoSrc);

  const wanted = viewerMode[key] ?? mode ?? (videoSrc ? 'video' : 'image');
  // Fall back to whatever exists if the wanted kind is missing
  const active: 'image' | 'video' | null =
    wanted === 'video'
      ? videoSrc ? 'video' : imageSrc ? 'image' : null
      : imageSrc ? 'image' : videoSrc ? 'video' : null;

  const media = (
    <div className={`${swapClass} pointer-events-none absolute inset-0`}>
      {id && active === 'video' && videoSrc ? (
        <video
          key={videoSrc}
          src={asset(videoSrc)}
          poster={imageSrc ? asset(imageSrc) : undefined}
          className="h-full w-full object-cover"
          autoPlay={!prefersReducedMotion()}
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setFailed((prev) => ({ ...prev, [`video:${key}`]: true }))}
        />
      ) : id && active === 'image' && imageSrc ? (
        <img
          key={imageSrc}
          src={asset(imageSrc)}
          alt={label}
          className="h-full w-full object-cover"
          onError={() => setFailed((prev) => ({ ...prev, [`image:${key}`]: true }))}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[6px] uppercase tracking-[0.3em] opacity-30 md:text-[7px]">
          NO PREVIEW
        </span>
      )}
    </div>
  );

  const toggle =
    id && hasBoth ? (
      <div className="absolute right-3 top-3 z-10 flex gap-3 text-[6px] uppercase tracking-[0.3em] mix-blend-difference md:text-[7px]">
        {(['image', 'video'] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => setViewerMode((prev) => ({ ...prev, [key]: kind }))}
            aria-pressed={active === kind}
            className={`transition-opacity duration-300 motion-reduce:transition-none ${
              active === kind ? 'opacity-100' : 'opacity-40 hover:opacity-100'
            }`}
          >
            {kind === 'image' ? 'IMG' : 'VID'}
          </button>
        ))}
      </div>
    ) : null;

  return { media, toggle };
};