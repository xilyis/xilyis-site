export interface WritingEntry {
  slug: string;
  title: string;
  type: string;
  excerpt: string;
  date?: string;
  status?: string;
  readingTime?: string;
  subtitle?: string;
  content: WritingBlock[];
}

export type WritingBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'heading';
      text: string;
    }
  | {
      type: 'blockquote';
      text: string;
    }
  | {
      type: 'list';
      items: string[];
    };

export const writings: WritingEntry[] = [
  {
    slug: 'article-01',
    title: 'Untitled Article 01',
    type: 'Article',
    excerpt: 'Placeholder summary. This article is in progress.',
    status: 'Draft',
    readingTime: '5 min read',
    subtitle: 'Placeholder subtitle.',
    content: [
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the opening of the article.',
      },
      {
        type: 'heading',
        text: 'Section heading',
      },
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the body of the section.',
      },
      {
        type: 'blockquote',
        text: 'Placeholder quote or key observation.',
      },
      {
        type: 'list',
        items: [
          'Placeholder point one',
          'Placeholder point two',
          'Placeholder point three',
        ],
      },
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the conclusion.',
      },
    ],
  },
  {
    slug: 'article-02',
    title: 'Untitled Article 02',
    type: 'Article',
    excerpt: 'Placeholder summary. This article is in progress.',
    status: 'Draft',
    readingTime: '5 min read',
    subtitle: 'Placeholder subtitle.',
    content: [
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the opening of the article.',
      },
      {
        type: 'heading',
        text: 'Section heading',
      },
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the body of the section.',
      },
      {
        type: 'blockquote',
        text: 'Placeholder quote or key observation.',
      },
      {
        type: 'list',
        items: [
          'Placeholder point one',
          'Placeholder point two',
          'Placeholder point three',
        ],
      },
      {
        type: 'paragraph',
        text: 'Placeholder text. Replace this with the conclusion.',
      },
    ],
  },
];

export const getWritingBySlug = (slug: string) =>
  writings.find((writing) => writing.slug === slug);