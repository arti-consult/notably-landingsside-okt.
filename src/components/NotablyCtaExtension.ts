import { mergeAttributes, Node } from '@tiptap/core';

export interface NotablyCtaAttributes {
  title: string;
  description: string;
  primaryText: string;
  primaryUrl: string;
  secondaryText: string;
  secondaryUrl: string;
}

export const DEFAULT_NOTABLY_CTA: NotablyCtaAttributes = {
  title: 'Vil du slippe manuelle møtereferater?',
  description: 'Notably transkriberer møter på norsk, lager oppsummeringer og henter ut handlingspunkter automatisk.',
  primaryText: 'Prøv Notably gratis',
  primaryUrl: 'https://notably.no/',
  secondaryText: 'Les mer',
  secondaryUrl: 'https://notably.no/',
};

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
      secondaryText: {
        default: DEFAULT_NOTABLY_CTA.secondaryText,
        parseHTML: (element: HTMLElement) =>
          sanitizeText(element.getAttribute('data-secondary-text'), DEFAULT_NOTABLY_CTA.secondaryText),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-secondary-text': sanitizeText(attributes.secondaryText, DEFAULT_NOTABLY_CTA.secondaryText),
        }),
      },
      secondaryUrl: {
        default: DEFAULT_NOTABLY_CTA.secondaryUrl,
        parseHTML: (element: HTMLElement) =>
          sanitizeUrl(element.getAttribute('data-secondary-url'), DEFAULT_NOTABLY_CTA.secondaryUrl),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-secondary-url': sanitizeUrl(attributes.secondaryUrl, DEFAULT_NOTABLY_CTA.secondaryUrl),
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
    const secondaryText = sanitizeText(attrs.secondaryText, DEFAULT_NOTABLY_CTA.secondaryText);
    const secondaryUrl = sanitizeUrl(attrs.secondaryUrl, DEFAULT_NOTABLY_CTA.secondaryUrl);

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'notably-inline-cta',
        'data-notably-cta': 'true',
      }),
      [
        'div',
        { class: 'notably-inline-cta__inner' },
        ['div', { class: 'notably-inline-cta__logo', 'aria-hidden': 'true' }, 'N'],
        [
          'div',
          { class: 'notably-inline-cta__text' },
          ['h3', { class: 'notably-inline-cta__title' }, title],
          ['p', { class: 'notably-inline-cta__description' }, description],
        ],
        [
          'div',
          { class: 'notably-inline-cta__actions' },
          ['a', { class: 'notably-inline-cta__learn', href: secondaryUrl }, secondaryText],
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
            secondaryText: sanitizeText(attributes.secondaryText, DEFAULT_NOTABLY_CTA.secondaryText),
            secondaryUrl: sanitizeUrl(attributes.secondaryUrl, DEFAULT_NOTABLY_CTA.secondaryUrl),
          };

          return commands.insertContent({
            type: this.name,
            attrs: nextAttrs,
          });
        },
    };
  },
});
