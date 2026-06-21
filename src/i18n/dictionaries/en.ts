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
      id: 'convert',
      title: 'Print PDF Convert',
      desc: 'Turn an image or PDF into a print-ready PDF fitted to a page size.',
      tag: 'Convert',
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
    privacy: 'Privacy policy',
    contact: 'Contact',
    cookieSettings: 'Cookie settings',
    copy: '© 2026 PrintReady',
    note: 'In-browser · no login',
  },
  common: {
    adLabel: 'Ad space',
    adNote: 'Ads appear after consent',
    skipToContent: 'Skip to content',
  },
  calc: {
    inputs: 'Values',
    result: 'Result',
    back: 'All tools',
    guideTitle: 'Guide',
    comingSoon: 'Coming soon',
    comingSoonDesc: 'This tool is on its way. Try another calculator in the meantime.',
    errors: {
      positive: 'All values must be numbers greater than 0.',
      foldInner: 'The inner-panel adjustment is larger than the panel.',
      labelMargin: 'Margins are larger than the sheet.',
    },
    res: {
      widthPx: 'Width (pixels)',
      heightPx: 'Height (pixels)',
      dpi: 'Target resolution (DPI)',
      dpiHelper: 'Print usually calls for 300 DPI',
      unit: 'Unit',
      unitCm: 'Centimeters (cm)',
      unitInch: 'Inches (inch)',
      sizeLabel: 'Maximum print size',
      qualityLabel: 'Quality level',
      megapixelsLabel: 'Total pixels',
      levelHigh: 'High quality',
      levelOk: 'Acceptable',
      levelLow: 'Low resolution',
      guide: [
        'Print size (inch) = pixels ÷ DPI · cm = inch × 2.54',
        '300 DPI+ is high quality, 150–299 suits general print, below 150 degrades when enlarged.',
      ],
    },
    spine: {
      binding: 'Binding type',
      bindingPerfect: 'Perfect binding',
      bindingSaddle: 'Saddle stitch',
      bindingCase: 'Case binding',
      pages: 'Page count',
      pagesHelper: 'Body pages, excluding the cover',
      interiorGsm: 'Interior paper (GSM)',
      coverGsm: 'Cover paper (GSM)',
      spineLabel: 'Estimated spine thickness',
      leavesLabel: 'Body leaves',
      warn: 'Page count should be a multiple of 4. The current value may leave blank pages.',
      note: 'Actual thickness varies with paper bulk, coating and binding — confirm with your printer before production. (estimate)',
      guide: [
        'A 1mm spine error shifts the cover artwork and title position.',
        'Perfect binding wraps the cover around the spine; saddle stitch has almost no spine; case binding adds board thickness.',
      ],
    },
    weight: {
      size: 'Paper size',
      sizeCustom: 'Custom',
      width: 'Width (mm)',
      height: 'Height (mm)',
      gsm: 'Weight (GSM)',
      sheets: 'Number of sheets',
      totalLabel: 'Total paper weight',
      perSheetLabel: 'Per sheet',
      packageLabel: 'Est. package weight',
      note: 'Package weight adds ~4% plus packaging to the paper weight, as an estimate.',
      guide: ['Per sheet (g) = width(m) × height(m) × GSM', 'GSM is the weight of 1 m² of paper.'],
    },
    fold: {
      width: 'Finished width (mm)',
      widthHelper: 'Folded finished width, not flat',
      type: 'Fold type',
      typeHalf: 'Half fold (2 panel)',
      typeLetter: 'Letter fold (3 panel)',
      typeZ: 'Z-fold (3 panel)',
      typeRoll: 'Roll fold (4 panel)',
      inner: 'Inner panel adjustment (mm)',
      innerHelper: 'Amount to narrow inward panels',
      panel: 'Panel',
      shorterNote: 'folds inward',
      guide: [
        'Inward panels should be 1–2mm narrower so the paper folds cleanly.',
        'Z-folds can be equal; letter and roll folds must narrow toward the inside.',
      ],
    },
    label: {
      sheetW: 'Sheet width (mm)',
      sheetH: 'Sheet height (mm)',
      labelW: 'Label width (mm)',
      labelH: 'Label height (mm)',
      margin: 'Sheet margin (mm)',
      gap: 'Gap between labels (mm)',
      rotate: 'Allow rotation',
      rotateHelper: 'Applies a 90° layout automatically if it fits more',
      totalLabel: 'Labels per sheet',
      gridLabel: 'Rows × Columns',
      remainderLabel: 'Remaining space',
      rotatedBadge: 'Rotated layout applied',
      unit: '',
      guide: [
        'Columns = (sheet width − margin×2 + gap) ÷ (label width + gap)',
        'Gaps absorb cutting tolerance — 2mm or more is recommended.',
      ],
    },
    pdf: {
      dropTitle: 'Drop your PDF here',
      dropOr: 'or',
      dropBtn: 'Choose file',
      dropTypes: 'PDF file · processed in your browser',
      analyzing: 'Analyzing your file…',
      errTitle: 'Could not read the file',
      errDesc: 'Make sure it is a PDF and try again.',
      reset: 'Start over',
      summaryTitle: 'Result',
      overallOk: 'Basic check passed',
      overallWarn: 'Needs review',
      pages: 'pages',
      items: {
        pageSize: 'Page size',
        trim: 'Trim box',
        bleed: 'Bleed box',
        resolution: 'Image resolution',
        color: 'Color mode',
        fonts: 'Embedded fonts',
      },
      statusPass: 'Detected',
      statusWarn: 'Not set',
      statusUnknown: 'Detection limited',
      disclaimer:
        'This is a basic in-browser metadata check. Page size, trim/bleed, font embedding, image resolution and color space are detected on a best-effort basis (some formats, nested layouts or color spaces may be missed) — not a production guarantee. Confirm with your printer or a professional preflight tool.',
    },
    convert: {
      dropTitle: 'Drop an image or PDF here',
      dropOr: 'or',
      dropBtn: 'Choose file',
      dropTypes: 'JPG · PNG · WebP · PDF · processed in your browser',
      errTitle: 'Could not read the file',
      errDesc: 'Make sure it is an image (JPG·PNG·WebP) or PDF and try again.',
      selected: 'File to convert',
      change: 'Change file',
      settingsTitle: 'Conversion settings',
      sizeLabel: 'Page size',
      sizeA4: 'A4 (210 × 297 mm)',
      sizeLetter: 'Letter (8.5 × 11 in)',
      sizeFit: 'Fit to image size',
      orientationLabel: 'Orientation',
      orientAuto: 'Auto',
      orientPortrait: 'Portrait',
      orientLandscape: 'Landscape',
      start: 'Convert to print PDF',
      converting: 'Converting…',
      doneTitle: 'Conversion complete',
      outLabel: 'Output file',
      download: 'Download PDF',
      specsTitle: 'Conversion details',
      specInput: 'Input format',
      specPages: 'Pages',
      specSize: 'Page size',
      specColor: 'Color',
      reset: 'Start over',
      cmykNote:
        'Output is RGB. True CMYK conversion is not possible in the browser — for precise color, use your print shop or a professional tool.',
      disclaimer:
        'Converted in your browser; files are not sent to a server. The original aspect ratio is preserved and fitted to the page.',
      guideTitle: 'Guide',
      guide: [
        'Images are fitted to the chosen size (A4·Letter) preserving aspect ratio, or kept at original size with "Fit to image size".',
        'PDFs have every page re-fitted to the chosen size. Color stays RGB; no CMYK conversion is performed.',
      ],
    },
  },
  error: {
    title: 'Something went wrong',
    desc: 'An unexpected error stopped this page from loading. Please try again.',
    retry: 'Try again',
  },
  notFound: {
    code: '404',
    title: 'Page not found',
    desc: 'This page may have moved or been removed. Jump to one of the tools below.',
    home: 'Go home',
    tools: 'Browse tools',
    toolsHead: 'Quick links',
  },
  langName: 'EN',
  toolGuides: {
    pdf: {
      intro:
        'PDF preflight checks your print file before you send it to the printer — verifying bleed, image resolution (DPI), color mode (CMYK/RGB), and font embedding. Catching problems early avoids costly reprints.',
      body: [
        {
          heading: 'What gets checked',
          text: 'Bleed, page size, image resolution (DPI), color mode, and font embedding are checked at once, each flagged as pass, warning, or needs review.',
        },
        {
          heading: 'Processed safely in your browser',
          text: 'Your PDF is analyzed entirely in the browser and never uploaded to a server, so even confidential files stay private.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What is preflight?',
          a: 'An automated check that confirms a file is print-ready — verifying resolution, color, bleed, and fonts to prevent printing errors.',
        },
        {
          q: 'Why does print need CMYK?',
          a: 'Screens use RGB while presses use CMYK ink. RGB files get converted at the printer and colors can shift, so it helps to confirm the color mode first.',
        },
        {
          q: 'Why is bleed needed?',
          a: 'Bleed adds about 3mm beyond the trim edge so no white slivers appear if the cut shifts slightly.',
        },
      ],
    },
    convert: {
      intro:
        'Convert to a print-ready PDF turns JPG, PNG, or WebP images and existing PDFs into a PDF sized to standard print formats like A4 or A3 — ready to send to the printer with the right page size and orientation.',
      body: [
        {
          heading: 'Images to print-ready PDF',
          text: 'Upload an image and it is placed into a PDF at the page size (A4, A3, etc.) and orientation (portrait or landscape) you choose.',
        },
        {
          heading: 'Converted in your browser',
          text: 'Conversion runs entirely in your browser, so files are never uploaded to a server. No login required.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Which files can I convert?',
          a: 'JPG, PNG, and WebP images and PDFs can be converted into a print-ready PDF.',
        },
        {
          q: 'What page sizes are supported?',
          a: 'Standard sizes such as A4 and A3 with portrait or landscape orientation.',
        },
        {
          q: 'Are my uploaded files safe?',
          a: 'Conversion happens only in your browser; files are never sent to an external server.',
        },
      ],
    },
    res: {
      intro:
        'The image print size calculator tells you the largest size you can print from a given pixel dimension at a target resolution (DPI). It uses print size = pixels ÷ DPI so you can check the limit before a photo turns out blurry.',
      body: [
        {
          heading: 'How print size is calculated',
          text: 'Dividing width and height in pixels by the target DPI gives the size in inches; multiplying by 2.54 gives centimeters. The higher the DPI, the smaller the print size from the same image.',
        },
        {
          heading: 'Print resolution tiers',
          text: '300 DPI is the high-quality benchmark for general printing. 150 DPI is acceptable for posters viewed from a distance; below that, prints may look blurry.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What is DPI (resolution)?',
          a: 'The number of dots (pixels) within one inch. Higher DPI is sharper but yields a smaller print size from the same pixels.',
        },
        {
          q: 'Why is 300 DPI recommended for print?',
          a: 'The eye stops resolving individual dots at around 300 DPI at normal viewing distance, making it the standard for smooth, high-quality print.',
        },
        {
          q: 'How large can my photo print?',
          a: 'Enter the pixel dimensions and it calculates the maximum print size at 300 and 150 DPI instantly.',
        },
      ],
    },
    spine: {
      intro:
        'The spine thickness calculator estimates a book spine from the binding type, page count, and interior/cover paper weight (GSM). Getting the spine width right keeps the title aligned on your cover design.',
      body: [
        {
          heading: 'How spine thickness is calculated',
          text: 'The number of leaves (pages ÷ 2) is multiplied by the thickness of one sheet (GSM × paper bulk) to get the text-block thickness. Values are estimates that vary by paper and bindery, so confirm with your printer.',
        },
        {
          heading: 'Differences by binding',
          text: 'Perfect binding adds the cover thickness to the text block; case (hardcover) binding adds board thickness. Saddle-stitch nests folded signatures, so there is almost no flat spine.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'How do you calculate spine thickness?',
          a: 'Multiply half the page count (leaves) by the thickness of one sheet to get the text block, then add cover or board thickness depending on the binding.',
        },
        {
          q: 'Why should page count be a multiple of 4?',
          a: 'Printing and binding fold sheets into 4-page units, so a count that is not a multiple of 4 can leave blank pages.',
        },
        {
          q: 'Perfect binding vs. saddle stitch?',
          a: 'Perfect binding glues the spine and creates thickness; saddle stitch staples the center fold and has almost no spine.',
        },
      ],
    },
    weight: {
      intro:
        'The paper weight calculator estimates total and packaged weight from sheet size, paper weight (GSM), and quantity — useful for shipping costs, quotes, and mailing weight.',
      body: [
        {
          heading: 'How paper weight is calculated',
          text: 'GSM is grams per square meter. One sheet = area (m²) × GSM, and total weight = per-sheet weight × quantity. The per-sheet weight is exact; only the packaged weight is an estimate.',
        },
        {
          heading: 'What GSM means',
          text: 'GSM expresses paper thickness and weight — the higher the number, the thicker and heavier. Copy paper is typically 80 GSM, business cards 250 GSM or more.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What is GSM?',
          a: 'Grams per square meter — the weight of paper per m². 80 GSM means one square meter weighs 80 grams.',
        },
        {
          q: 'How is paper weight calculated?',
          a: 'Multiply the sheet area (m²) by GSM for one sheet, then by the number of sheets for the total.',
        },
        {
          q: 'Can I estimate packaged weight?',
          a: 'It also shows an approximate packaged weight by adding packaging and box weight to the paper weight.',
        },
      ],
    },
    fold: {
      intro:
        'The fold layout calculator gives the exact width of each panel for half folds, tri folds, roll folds, and more. Inward-folding panels must be slightly narrower so the paper folds cleanly.',
      body: [
        {
          heading: 'Fold types',
          text: 'Half fold (2 panels), Z-fold / tri-fold (3 panels), and roll fold (4 panels folded inward) each split the width differently across panels.',
        },
        {
          heading: 'Why inner panels are narrower',
          text: 'When several panels fold inward, an inner panel as wide as the outer ones would not close. Narrowing inner panels by a few mm lets the piece fold cleanly.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'How are fold panel widths set?',
          a: 'Divide the finished width by the number of panels, then narrow any inward-folding panel by a few mm so it folds cleanly.',
        },
        {
          q: 'Tri-fold vs. roll fold?',
          a: 'A tri-fold folds in a Z; a roll fold curls inward in one direction, so its inner panels must be narrower.',
        },
        {
          q: 'Why do panels have different widths?',
          a: 'Panels that tuck inside must be narrower than the outer panels so they do not overlap when folded.',
        },
      ],
    },
    label: {
      intro:
        'The label layout calculator works out how many labels fit on a sheet and their row/column grid. Enter label size, sheet margin, and gap to find the layout that fits the most.',
      body: [
        {
          heading: 'How label layout is calculated',
          text: 'The area left after margins is divided by the label size plus gap to find how many columns and rows fit. Columns × rows is the total per sheet.',
        },
        {
          heading: 'Higher yield with rotation',
          text: 'Rotating labels 90° sometimes fits more. With rotation on, the layout that fits more is selected automatically.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'How many labels fit on a sheet?',
          a: 'Enter sheet size, margins, label size, and gap, and it calculates the columns, rows, and total instantly.',
        },
        {
          q: 'Does rotating labels fit more?',
          a: 'Depending on the label ratio, a 90° rotated layout can fit more. The rotation option compares and picks the better one.',
        },
        {
          q: 'Why are margins and gaps needed?',
          a: 'They absorb printing and cutting tolerance and keep labels from touching, via sheet-edge margins and gaps between labels.',
        },
      ],
    },
  },
};
