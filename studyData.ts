// Your studies. Add entries here and the Studies page appears
// automatically (see featureFlags.ts).

export interface StudyEntry {
  id: string;
  label: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'UNRESOLVED';
  timestamp: string;
  /** "CATEGORY" or "CATEGORY / SUBCATEGORY". Feeds the filter menu and list columns. */
  category: string;
  description: string;
  /** The study's live link. '' or '#' hides the open/visit buttons. */
  sourceUrl: string;
  /** Preview image, e.g. '/assets/pixel-boxes.png'. Optional. */
  thumbnail?: string;
  /** Preview video (muted, looping), e.g. '/assets/pixel-boxes.mp4'. Optional. */
  thumbnailVideo?: string;
  /** Which shows first when both exist: 'image' | 'video' (default 'video'). */
  previewMode?: 'image' | 'video';
  type: 'web' | 'motion' | 'canvas' | 'other';
}

/**
 * Template for one entry:
 *
 * {
 *   id: '01',
 *   label: 'Artifact-001',
 *   status: 'ACTIVE',
 *   timestamp: '2026.11.11',
 *   category: 'WEBGL / VIDEO',      // category / subcategory
 *   description: 'Video rebuilt from thousands of instanced boxes.',
 *   sourceUrl: 'https://...',
 *   thumbnail: '/assets/artifact-001.png',
 *   thumbnailVideo: '/assets/artifact-001.mp4',
 *   previewMode: 'video',
 *   type: 'web',
 * },
 */
export const studies: StudyEntry[] = [
  {
    id: '00',
    label: 'Artifact 000',
    status: 'ACTIVE',
    timestamp: '2026.10.11',
    category: 'WEBGL / VIDEO',
    description:
      'A looping particle animation rebuilt from about 29,000 drifting 3D pixels, with feedback trails and a blur that grows toward the edges.',
    sourceUrl: 'https://artifact-000.xilyasx.workers.dev',
    thumbnail: './assets/artifact-000.png',
    thumbnailVideo: './assets/artifact-000.mp4',
    previewMode: 'video',
    type: 'web',
  },
];