import gsap from 'gsap';

/**
 * Shared motion settings so every page moves the same way.
 * Pages should use these helpers instead of hand-written timelines.
 */
export const MOTION = {
  ease: 'power3.out',
  fast: 0.3, // small swaps (text changing in place)
  base: 0.6, // page entrance
  offset: 12, // px rise on entrance
  stagger: 0.06,
  scroll: 0.9, // scroll-triggered reveals (About)
  scrollOffset: 24, // px rise for scroll reveals
  line: 1.2, // horizontal lines drawing in
} as const;

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Standard page entrance: each selector fades in and rises slightly,
 * one after another. Call inside useGSAP so selectors stay scoped.
 */
export const playEntrance = (selectors: string[]) => {
  if (prefersReducedMotion()) return null;

  const timeline = gsap.timeline({ defaults: { ease: MOTION.ease } });

  selectors.forEach((selector, index) => {
    timeline.from(
      selector,
      {
        opacity: 0,
        y: MOTION.offset,
        duration: MOTION.base,
        stagger: MOTION.stagger,
        // Only clear what we animated; 'all' would wipe other inline styles.
        clearProps: 'opacity,transform',
      },
      index === 0 ? 0 : '-=0.4'
    );
  });

  return timeline;
};

/**
 * Small fade for text that changes in place (e.g. selecting a list item).
 * Call inside useGSAP.
 */
export const playSwap = (targets: gsap.TweenTarget) => {
  if (prefersReducedMotion()) return;

  gsap.from(targets, {
    opacity: 0,
    y: 6,
    duration: MOTION.fast,
    ease: MOTION.ease,
    overwrite: 'auto',
    clearProps: 'opacity,transform',
  });
};

/** Hover-capable pointer (mouse/trackpad) as opposed to touch. */
export const canHover = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;