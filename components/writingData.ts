export const WRITING_KINDS = [
  'Essay',
  'Visual Essay',
  'Paper',
  'Case Study',
  'Whitepaper',
] as const;

export type WritingKind = (typeof WRITING_KINDS)[number];

export type WritingBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'figure'; src?: string; alt: string; caption: string };

export interface WritingEntry {
  slug: string;
  code: string; // reference code, e.g. WR-001
  title: string;
  kind: WritingKind;
  year: string;
  version: string; // e.g. v0.1
  abstract: string;
  keywords: string[];
  subtitle?: string;
  length?: string; // e.g. "12 pp"
  status?: string; // e.g. "In progress"; leave out when finished
  pdf?: string; // '/assets/<file>.pdf'; button hides when empty
  related?: string[]; // slugs, chosen by you
  notes?: string[]; // footnotes, cite as [1], [2] in the text
  references?: string[];
  content: WritingBlock[];
}

export const writings: WritingEntry[] = [
  {
    slug: 'essay-01',
    code: 'WR-001',
    title: 'Untitled Essay 01',
    kind: 'Essay',
    year: '2026',
    version: 'v0.1',
    status: 'In progress',
    subtitle: 'Placeholder subtitle.',
    abstract:
      'Placeholder abstract. Replace with a short summary of the question, the method and the finding.',
    keywords: ['Placeholder', 'Keyword'],
    pdf: '',
    content: [
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the opening of the essay.',
      },
      { type: 'heading', text: 'Section heading' },
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the body of the section.',
      },
      { type: 'blockquote', text: 'Placeholder quote or key observation.' },
      {
        type: 'list',
        items: [
          'Placeholder point one',
          'Placeholder point two',
          'Placeholder point three',
        ],
      },
      {
        type: 'figure',
        src: '',
        alt: 'Placeholder figure',
        caption: 'Placeholder caption.',
      },
    ],
    notes: ['Placeholder note.'],
    references: ['Placeholder reference.'],
  },
  {
    slug: 'case-study-01',
    code: 'WR-002',
    title: 'Untitled Case Study 01',
    kind: 'Case Study',
    year: '2026',
    version: 'v0.1',
    status: 'In progress',
    subtitle: 'Placeholder subtitle.',
    abstract:
      'Placeholder abstract. Replace with a short summary of the question, the method and the finding.',
    keywords: ['Placeholder', 'Keyword'],
    pdf: '',
    content: [
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the opening of the case study.',
      },
      { type: 'heading', text: 'Section heading' },
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the body of the section.',
      },
    ],
  },
];

export const getWritingBySlug = (slug: string) =>
  writings.find((writing) => writing.slug === slug);