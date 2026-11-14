// Single source of truth for artifact entries.
// Used by App (gallery items), Artifacts (list) and ArtifactDetail (preview).

export interface TabSection {
  id: string;
  label: string;
  content: string;
}

export interface GalleryMediaItem {
  id: string;
  label: string;
  description: string;
  media: string[];
  tabSections: TabSection[];
  metadata: Record<string, string>;
}

export type ArtifactCategory = 'traditional' | 'generative' | 'graphic';

export const ARTIFACT_CATEGORIES: { id: ArtifactCategory; label: string }[] = [
  { id: 'traditional', label: 'TRADITIONAL' },
  { id: 'generative', label: 'GENERATIVE' },
  { id: 'graphic', label: 'GRAPHIC' },
];

export interface ArtifactEntry {
  id: string;
  label: string;
  status: string;
  timestamp: string;
  /** Preview image. Leave empty or use a missing/placeholder file to show no image. */
  thumbnail: string;
  /** Optional preview video (muted, looping), e.g. '/assets/pixel-boxes.mp4'. */
  thumbnailVideo?: string;
  /**
   * Which preview shows first when an entry has both. Defaults to 'video'.
   * Visitors can still switch with the small IMG / VID toggle.
   */
  previewMode?: 'image' | 'video';
  description: string;
  /** Use '#' (or leave empty) until there is a real link; the VISIT button stays hidden. */
  sourceUrl: string;
  type: 'python' | 'web' | 'other';
  /** Shown as a filter tab on the Artifacts page. */
  category: ArtifactCategory;
  /** Images/videos shown in the Detail carousel. */
  media: string[];
  /** Items shown on the Info page. */
  galleryMedia: GalleryMediaItem[];
}

/**
 * Your artifacts. Empty for now: add entries here and the Artifacts page appears
 * automatically (see featureFlags.ts). Copy this template for each entry.
 * Put image/video files in public/assets/ and reference them as '/assets/<file>'.
 *
 * {
 *   id: '01',                       // unique; shown as 001 on the page
 *   label: 'ENTRY 01',              // title shown in the list
 *   status: 'ACTIVE',               // free text, shown in the details strip
 *   timestamp: '2026.11.11',        // free text, shown in the details strip
 *   thumbnail: '/assets/entry-01.png',          // preview image ('' for none)
 *   thumbnailVideo: '/assets/entry-01.mp4',     // optional preview video
 *   previewMode: 'video',           // optional: 'image' | 'video' (shown first)
 *   description: 'One sentence about the piece',
 *   sourceUrl: 'https://...',       // VISIT button; '' or '#' hides it
 *   type: 'python',                 // 'python' | 'web' | 'other' (filter: TYPE)
 *   category: 'generative',         // 'traditional' | 'generative' | 'graphic'
 *   media: ['/assets/entry-01-a.png'],          // images/videos in the Detail view
 *   galleryMedia: [],               // items for the Info view (see the type above)
 * },
 */
export const artifacts: ArtifactEntry[] = [];

export const getArtifactById = (id?: string) =>
  artifacts.find((artifact) => artifact.id === id);