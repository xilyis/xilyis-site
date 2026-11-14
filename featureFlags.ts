// Site-wide feature flags.
// A section is hidden everywhere (nav, footer, hero, routes) when its flag is false.

import { artifacts } from './artifactData';
import { studies } from './studyData';

export interface Features {
  /** Writings & Research (footer link, /writing routes, article pages). */
  writings: boolean;
  /** Studies page (nav link). */
  studies: boolean;
  /** Artifacts archive (nav link, footer link, hero "Archive" button). */
  artifacts: boolean;
}

export const FEATURES: Features = {
  // Manual: set true when the articles are finished.
  writings: false,
  // Automatic: on as soon as there is at least one entry. Replace the
  // expression with `false` to force a page hidden, or `true` to force it on.
  studies: studies.length > 0,
  artifacts: artifacts.length > 0,
};

/** Whether a given App view is currently enabled. Views without a flag are always on. */
export const isViewEnabled = (view: string): boolean => {
  switch (view) {
    case 'artifacts':
      return FEATURES.artifacts;
    case 'studies':
      return FEATURES.studies;
    case 'writings':
    case 'writingArticle':
      return FEATURES.writings;
    default:
      return true;
  }
};