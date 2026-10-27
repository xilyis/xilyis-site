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

export interface ArtifactEntry {
  id: string;
  label: string;
  status: string;
  timestamp: string;
  thumbnail: string;
  description: string;
  /** Use '#' (or leave empty) until there is a real link; the VISIT button stays hidden. */
  sourceUrl: string;
  type: 'python' | 'web' | 'other';
  /** Images/videos shown in the Detail carousel. */
  media: string[];
  /** Items shown on the Info page. */
  galleryMedia: GalleryMediaItem[];
}

export const artifacts: ArtifactEntry[] = [
  {
    id: '01',
    label: 'ENTRY 01',
    status: 'ACTIVE',
    timestamp: '2024.08.11',
    thumbnail: '/assets/sacred-patterns-thumb.png',
    description: 'Generative geometry with rotational symmetry',
    sourceUrl: '#', // TODO: real link, e.g. https://github.com/you/repo/blob/main/SacredPatterns.py
    type: 'python',
    media: ['/assets/sacred-patterns-1.png', '/assets/sacred-patterns-2.png'],
    galleryMedia: [
      {
        id: '01-01',
        label: 'GALLERY MEDIA 01',
        description: 'First gallery item description',
        media: [
          '/assets/gm1-sub1.png',
          '/assets/gm1-sub2.png',
          '/assets/gm1-sub3.png',
        ],
        tabSections: [
          { id: 'overview', label: 'OVERVIEW', content: 'Overview for gallery media 01.' },
          { id: 'process', label: 'PROCESS', content: 'Process details for gallery media 01.' },
          { id: 'tech', label: 'TECHNICAL', content: 'Technical specs for gallery media 01.' },
        ],
        metadata: { Resolution: '1920x1080', Format: 'PNG', Size: '2.3 MB' },
      },
      {
        id: '01-02',
        label: 'GALLERY MEDIA 02',
        description: 'Second gallery item description',
        media: ['/assets/gm2-sub1.png', '/assets/gm2-sub2.png'],
        tabSections: [
          { id: 'overview', label: 'OVERVIEW', content: 'Overview for gallery media 02.' },
          { id: 'process', label: 'PROCESS', content: 'Process details for gallery media 02.' },
          { id: 'tech', label: 'TECHNICAL', content: 'Technical specs for gallery media 02.' },
        ],
        metadata: { Resolution: '1920x1080', Format: 'PNG', Size: '1.8 MB' },
      },
    ],
  },
  {
    id: '02',
    label: 'ENTRY 02',
    status: 'VER_2',
    timestamp: '2024.03.15',
    thumbnail: '/assets/default-placeholder.png',
    description: 'Coming soon...',
    sourceUrl: '#',
    type: 'python',
    media: ['/assets/default-placeholder.png'],
    galleryMedia: [
      {
        id: '02-01',
        label: 'GALLERY MEDIA 01',
        description: 'Entry 02 gallery media 01',
        media: ['/assets/entry02-gm1-1.png', '/assets/entry02-gm1-2.png'],
        tabSections: [
          { id: 'overview', label: 'OVERVIEW', content: 'Entry 02 overview.' },
          { id: 'process', label: 'PROCESS', content: 'Entry 02 process.' },
          { id: 'tech', label: 'TECHNICAL', content: 'Entry 02 technical.' },
        ],
        metadata: { Status: 'Under Development', Version: '2.0' },
      },
    ],
  },
];

export const getArtifactById = (id?: string) =>
  artifacts.find((artifact) => artifact.id === id);