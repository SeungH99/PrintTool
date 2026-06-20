import type { Dictionary } from './ko';

export const en: Dictionary = {
  nav: { home: 'Home', tools: 'Tools', cta: 'Check PDF' },
  home: {
    eyebrow: 'Print production toolkit',
    heroTitle: 'Check your files and specs before they reach the print shop',
    heroDesc:
      'PDF, images, book spine, paper weight, fold layouts — every calculation and check you need for print production, in one place.',
    ctaPrimary: 'Start PDF check',
    ctaSecondary: 'Browse calculators',
    toolsTitle: 'Pick a tool and start right away',
    toolsDesc: 'From preflight to calculation — every step of print production, covered.',
  },
  tools: [
    {
      id: 'pdf',
      title: 'PDF Preflight Check',
      desc: 'Inspect bleed, resolution, color mode and font embedding at once.',
      tag: 'Preflight',
    },
    {
      id: 'res',
      title: 'Print Resolution',
      desc: 'Find the largest printable size from pixel dimensions and DPI.',
      tag: 'Resolution',
    },
    {
      id: 'spine',
      title: 'Book Spine Width',
      desc: 'Calculate spine thickness and total cover width from page count.',
      tag: 'Binding',
    },
    {
      id: 'weight',
      title: 'Paper Weight',
      desc: 'Estimate total and package weight from size, GSM and sheet count.',
      tag: 'GSM',
    },
    {
      id: 'fold',
      title: 'Fold Layout',
      desc: 'Get the exact panel widths for any folded print piece.',
      tag: 'Folding',
    },
    {
      id: 'label',
      title: 'Label Layout',
      desc: 'Calculate how many labels fit on a single sheet.',
      tag: 'Imposition',
    },
  ],
  footer: {
    tagline: 'Print-production checks and calculations, all in one place.',
    toolsHead: 'Tools',
    aboutHead: 'About',
    about: ['Privacy policy', 'Terms of use', 'Contact'],
    cookieSettings: 'Cookie settings',
    copy: '© 2026 PrintReady',
    note: 'In-browser · no login',
  },
  common: {
    adLabel: 'Ad space',
    adNote: 'Ads appear after consent',
    skipToContent: 'Skip to content',
  },
  langName: 'EN',
};
