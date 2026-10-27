// Site-wide feature flags.
// Set a flag to false to hide that section everywhere (nav, footer, hero, routes).
// Set it back to true to bring the section back. No other edits needed.

export interface Features {
  /** Writings & Research (footer link, /writing routes, article pages). */
  writings: boolean;
  /** Studies page (nav link). */
  studies: boolean;
  /** Artifacts archive (nav link, footer link, hero "Archive" button). */
  artifacts: boolean;
}

export const FEATURES: Features = {
  writings: false,
  studies: true,
  artifacts: true,
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