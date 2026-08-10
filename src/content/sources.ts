export const SOURCES = {
  iso216: {
    title: 'ISO 216:2007 – A and B series trimmed sizes',
    publisher: 'International Organization for Standardization',
    url: 'https://www.iso.org/standard/36631.html',
  },
  iso536: {
    title: 'ISO 536:2019 – Determination of grammage',
    publisher: 'International Organization for Standardization',
    url: 'https://www.iso.org/standard/77583.html',
  },
  adobeBleed: {
    title: 'Print bleed and slug areas in InDesign',
    publisher: 'Adobe',
    url: 'https://helpx.adobe.com/indesign/desktop/print/page-set-up-and-printer-marks/print-bleed-and-slug-areas.html',
  },
  adobePrintPdf: {
    title: 'Produce print-ready PDF files in InDesign',
    publisher: 'Adobe',
    url: 'https://helpx.adobe.com/indesign/desktop/print/print-production-and-file-creation/produce-print-ready-pdf-files.html',
  },
  adobeBooklet: {
    title: 'Booklet printing settings in InDesign',
    publisher: 'Adobe',
    url: 'https://helpx.adobe.com/indesign/desktop/print/print-booklets/booklet-printing-settings.html',
  },
} as const;

export type SourceId = keyof typeof SOURCES;
export type SourceReference = (typeof SOURCES)[SourceId];
