import { mergeAttributes, Node } from '@tiptap/core';

export interface NotablyCtaAttributes {
  title: string;
  description: string;
  primaryText: string;
  primaryUrl: string;
}

export const DEFAULT_NOTABLY_CTA: NotablyCtaAttributes = {
  title: 'Vil du slippe manuelle møtereferater?',
  description: 'Notably transkriberer møter på 90+ språk, lager oppsummeringer og henter ut handlingspunkter automatisk.',
  primaryText: 'Prøv Notably gratis',
  primaryUrl: 'https://notably.no/',
};

const NOTABLY_CTA_LOGO_URL = 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1771673146531.png';

const sanitizeText = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const sanitizeUrl = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return fallback;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return fallback;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    notablyCta: {
      insertNotablyCta: (attributes?: Partial<NotablyCtaAttributes>) => ReturnType;
    };
  }
}

export const NotablyCta = Node.create({
  name: 'notablyCta',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: DEFAULT_NOTABLY_CTA.title,
        parseHTML: (element: HTMLElement) =>
          sanitizeText(element.getAttribute('data-title'), DEFAULT_NOTABLY_CTA.title),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-title': sanitizeText(attributes.title, DEFAULT_NOTABLY_CTA.title),
        }),
      },
      description: {
        default: DEFAULT_NOTABLY_CTA.description,
        parseHTML: (element: HTMLElement) =>
          sanitizeText(element.getAttribute('data-description'), DEFAULT_NOTABLY_CTA.description),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-description': sanitizeText(attributes.description, DEFAULT_NOTABLY_CTA.description),
        }),
      },
      primaryText: {
        default: DEFAULT_NOTABLY_CTA.primaryText,
        parseHTML: (element: HTMLElement) =>
          sanitizeText(element.getAttribute('data-primary-text'), DEFAULT_NOTABLY_CTA.primaryText),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-primary-text': sanitizeText(attributes.primaryText, DEFAULT_NOTABLY_CTA.primaryText),
        }),
      },
      primaryUrl: {
        default: DEFAULT_NOTABLY_CTA.primaryUrl,
        parseHTML: (element: HTMLElement) =>
          sanitizeUrl(element.getAttribute('data-primary-url'), DEFAULT_NOTABLY_CTA.primaryUrl),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-primary-url': sanitizeUrl(attributes.primaryUrl, DEFAULT_NOTABLY_CTA.primaryUrl),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-notably-cta="true"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const attrs = node.attrs as NotablyCtaAttributes;
    const title = sanitizeText(attrs.title, DEFAULT_NOTABLY_CTA.title);
    const description = sanitizeText(attrs.description, DEFAULT_NOTABLY_CTA.description);
    const primaryText = sanitizeText(attrs.primaryText, DEFAULT_NOTABLY_CTA.primaryText);
    const primaryUrl = sanitizeUrl(attrs.primaryUrl, DEFAULT_NOTABLY_CTA.primaryUrl);

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'notably-inline-cta',
        'data-notably-cta': 'true',
      }),
      [
        'div',
        { class: 'notably-inline-cta__inner' },
        [
          'div',
          { class: 'notably-inline-cta__logo' },
          [
            'img',
            {
              class: 'notably-inline-cta__logo-image',
              src: NOTABLY_CTA_LOGO_URL,
              alt: 'Notably logo',
              loading: 'lazy',
            },
          ],
        ],
        [
          'div',
          { class: 'notably-inline-cta__text' },
          ['h3', { class: 'notably-inline-cta__title' }, title],
          ['p', { class: 'notably-inline-cta__description' }, description],
        ],
        [
          'div',
          { class: 'notably-inline-cta__actions' },
          ['a', { class: 'notably-inline-cta__button', href: primaryUrl }, primaryText],
        ],
      ],
    ];
  },

  addCommands() {
    return {
      insertNotablyCta:
        (attributes: Partial<NotablyCtaAttributes> = {}) =>
        ({ commands }) => {
          const nextAttrs: NotablyCtaAttributes = {
            title: sanitizeText(attributes.title, DEFAULT_NOTABLY_CTA.title),
            description: sanitizeText(attributes.description, DEFAULT_NOTABLY_CTA.description),
            primaryText: sanitizeText(attributes.primaryText, DEFAULT_NOTABLY_CTA.primaryText),
            primaryUrl: sanitizeUrl(attributes.primaryUrl, DEFAULT_NOTABLY_CTA.primaryUrl),
          };

          return commands.insertContent({
            type: this.name,
            attrs: nextAttrs,
          });
        },
    };
  },
});
