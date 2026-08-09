import type { Dictionary } from './ko';

export const en: Dictionary = {
  nav: { home: 'Home', tools: 'Tools', guides: 'Guides', cta: 'Check PDF' },
  home: {
    metaTitle: 'Print Preflight & Spec Calculators · PrintReady',
    eyebrow: 'Print production toolkit',
    heroTitle: 'Check your files and specs before they reach the print shop',
    heroDesc:
      'PDF, images, book spine, paper weight, fold layouts — every calculation and check you need for print production, in one place.',
    ctaPrimary: 'Start PDF check',
    ctaSecondary: 'Browse calculators',
    workflow: {
      title: 'Convert, check, and resolve the result',
      steps: [
        'Convert an image to the intended PDF size',
        'Check the PDF size, DPI, and color',
        'Understand each warning and choose the next action',
      ],
    },
    toolsTitle: 'Pick a tool and start right away',
    toolsDesc: 'From preflight to calculation — every step of print production, covered.',
    featured: {
      title: 'Workflows verified with real files',
      description: 'Each case publishes its input, expected value, and observed result.',
    },
    methodology: {
      title: 'Verification methods and privacy',
      body: 'Calculations and PDF checks include reproducible examples and their limitations. Uploaded files are processed only in your browser, and your selected print provider’s specification remains the final authority.',
      link: 'Read our methodology and limitations',
    },
    editorial: {
      title: 'What to check before you send a file to the printer',
      intro:
        'PrintReady is a free set of tools that gathers the checks and spec calculations you need before sending a print file to the shop. It helps you catch the one-way mistakes — resolution, color, bleed, fonts — up front, so you avoid reprints and missed deadlines.',
      sections: [
        {
          heading: 'Why preflight matters',
          body: 'A file that looks fine on screen can print blurry from low resolution, dull from RGB color, or clipped at the edge from missing bleed. Catching these before the file reaches the printer is what saves cost and time.',
        },
        {
          heading: 'What it covers',
          body: 'File preflight (PDF), image resolution and print size, CMYK/RGB color and soft proofing, bleed and trim, paper weight and spine, saddle-stitch imposition and printer marks — 17 tools for each step from design to hand-off.',
        },
        {
          heading: 'Your files stay in the browser',
          body: 'Any PDF, image, or ICC profile you open is processed entirely inside your browser, never sent to a server. No sign-up, no install — use it without sending sensitive print data anywhere.',
        },
        {
          heading: 'Understand the results',
          body: 'Each tool ships with the formula, how-to notes, worked examples, and an FAQ. Final specs vary by printer, though, so confirm important values like bleed width and color profile against your printer’s guide before ordering.',
        },
      ],
    },
    faq: {
      title: 'Frequently asked questions',
      items: [
        {
          q: 'Is PrintReady free?',
          a: 'Yes, every tool is free. No sign-up and no install required.',
        },
        {
          q: 'Are my uploaded files safe?',
          a: 'Files are processed entirely in your browser and are never uploaded to or stored on a server. Your print data never leaves your device.',
        },
        {
          q: 'What should I check before sending a file to the printer?',
          a: 'Check resolution (usually 300 DPI), color mode (CMYK), bleed on all sides (usually 3mm), and font embedding. The PDF check tool inspects these at once.',
        },
        {
          q: 'Which tool should I start with?',
          a: 'If you already have a finished PDF, start with the PDF check. If you are still designing, use the resolution and bleed calculators to set your working size first.',
        },
        {
          q: 'Can I rely on the calculated results?',
          a: 'They are guidance based on common print conventions. Final specs vary by printer, so confirm important values with your print shop.',
        },
      ],
    },
    categories: {
      preflight: 'Preflight',
      convert: 'Convert',
      size: 'Size & resolution',
      paper: 'Paper',
      production: 'Production',
    },
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
    {
      id: 'bleed',
      title: 'Bleed & Safe Area',
      desc: 'Get the working size with bleed added and the safe margin box from a finished trim size.',
      tag: 'Bleed',
    },
    {
      id: 'size',
      title: 'Paper Size to Pixels',
      desc: 'Convert A4, business card, and other sizes to mm, cm, inches, and pixels at any DPI.',
      tag: 'Size',
    },
    {
      id: 'gsm',
      title: 'Paper Weight Converter',
      desc: 'Convert GSM to US basis weight (lb) for each paper grade.',
      tag: 'GSM',
    },
    {
      id: 'booklet',
      title: 'Saddle-Stitch Pages',
      desc: 'Validate booklet page count (multiple of 4) and get the printing page order.',
      tag: 'Booklet',
    },
    {
      id: 'nup',
      title: 'Sheet Yield (N-up)',
      desc: 'Find how many pieces a parent sheet yields and the wasted area.',
      tag: 'Imposition',
    },
    {
      id: 'grommet',
      title: 'Banner Grommets',
      desc: 'Get grommet count and positions from banner size and spacing.',
      tag: 'Banner',
    },
    {
      id: 'color',
      title: 'CMYK Color Converter',
      desc: 'Convert between CMYK, RGB, and HEX through an ICC profile.',
      tag: 'Color',
    },
    {
      id: 'impose',
      title: 'PDF Imposition (N-up)',
      desc: 'Repeat a finished-design PDF across a parent sheet for print.',
      tag: 'Imposition',
    },
    {
      id: 'marks',
      title: 'PDF Crop & Printer Marks',
      desc: 'Add crop marks and registration targets outside the PDF bleed.',
      tag: 'Printer marks',
    },
    {
      id: 'proof',
      title: 'Image Soft Proof (CMYK)',
      desc: 'Simulate an image in CMYK to preview print color and out-of-gamut areas.',
      tag: 'Soft proof',
    },
  ],
  footer: {
    tagline: 'Print-production checks and calculations, all in one place.',
    toolsHead: 'Tools',
    aboutHead: 'About',
    about: 'About',
    reference: 'Print reference',
    terms: 'Terms',
    privacy: 'Privacy policy',
    privacyDesc:
      'PrintReady privacy policy — uploaded files are processed locally in your browser, never sent to a server.',
    contact: 'Contact',
    cookieSettings: 'Cookie settings',
    copy: '© 2026 PrintReady',
    note: 'In-browser · no login',
  },
  common: {
    adLabel: 'Ad space',
    adNote: 'Ads appear after consent',
    skipToContent: 'Skip to content',
    relatedTools: 'Related tools',
  },
  guides: {
    metaTitle: 'Print production guides · PrintReady',
    eyebrow: 'Guide',
    title: 'Print production guides',
    desc: 'From file prep to color — the essentials of getting print right.',
    intro:
      'Print is one-way: once it runs, you cannot undo it. These guides break down the steps where files most often go wrong before hand-off — resolution, color, bleed, paper, and binding — explained for real production. Each guide links to the related calculators, so you can grasp the concept and then run the numbers. Pick a topic below to start.',
    verifiedTitle: 'Verified workflows',
    verifiedDesc:
      'Reproducible print-production workflows built around the same samples and observed results.',
    referencesTitle: 'Sourced references',
    referencesDesc: 'Editorial guides grounded in standards and print-production references.',
    all: 'All guides',
    faqTitle: 'Frequently asked questions',
  },
  calc: {
    inputs: 'Values',
    result: 'Result',
    copy: 'Copy',
    back: 'All tools',
    guideTitle: 'Guide',
    comingSoon: 'Coming soon',
    comingSoonDesc: 'This tool is on its way. Try another calculator in the meantime.',
    errors: {
      positive: 'All values must be numbers greater than 0.',
      tooLarge: 'A value is too large — please check your input.',
      foldInner: 'The inner-panel adjustment is larger than the panel.',
      labelMargin: 'Margins are larger than the sheet.',
      bleedSafe: 'The safe margin is larger than half the finished size.',
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
      aspectLabel: 'Aspect ratio',
      draftLabel: 'Max size at 150 DPI',
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
      coverGsmNote: 'Used only for perfect binding.',
      spineLabel: 'Estimated spine thickness',
      leavesLabel: 'Body leaves',
      previewCaption: 'Cover spread — back · spine · front',
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
      areaLabel: 'Sheet area',
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
      sheetSize: 'Sheet size',
      sheetCustom: 'Custom',
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
    bleed: {
      width: 'Finished width (mm)',
      height: 'Finished height (mm)',
      bleed: 'Bleed (mm)',
      bleedHelper: '3mm per side is the common standard',
      safe: 'Safe margin (mm)',
      safeHelper: 'Keep text and logos inside this line',
      unit: 'Display unit',
      unitMm: 'Millimeters (mm)',
      unitInch: 'Inches (inch)',
      workLabel: 'Working size (with bleed)',
      trimLabel: 'Trim size (finished)',
      safeLabel: 'Safe area',
      legendBleed: 'Bleed',
      legendTrim: 'Trim',
      legendSafe: 'Safe',
      note: 'Match the bleed your printer asks for (usually 1–3mm). Build the artwork at the working size; the piece is cut down to the trim size.',
      guide: [
        'Working size = finished size + bleed on all sides. Extend any color or image that touches the edge all the way to the bleed.',
        'Keep critical text and logos inside the safe line so they survive if the cut shifts.',
      ],
    },
    size: {
      format: 'Paper size',
      custom: 'Custom',
      width: 'Width (mm)',
      height: 'Height (mm)',
      dpi: 'Resolution (DPI)',
      dpiHelper: 'Print usually calls for 300 DPI',
      pxLabel: 'Pixel size',
      mmLabel: 'Millimeters',
      cmLabel: 'Centimeters',
      inLabel: 'Inches',
      note: 'Pixel size = size(mm) ÷ 25.4 × DPI. At the same size, a higher DPI means more pixels.',
      guide: [
        'Filling A4 at 300 DPI needs about 2480 × 3508 px.',
        'Print files are usually built at 300 DPI; large-format pieces are fine at 150 DPI.',
      ],
    },
    gsm: {
      gsm: 'Weight (GSM)',
      grade: 'Paper grade',
      grades: {
        bond: 'Bond / Writing',
        text: 'Text / Book',
        cover: 'Cover',
        index: 'Index',
        tag: 'Tag',
        bristol: 'Bristol',
      },
      note: 'lb differs by grade because each uses a different basis sheet size. GSM is an absolute unit independent of grade.',
      guide: [
        'GSM is the weight of 1 m² of paper — an absolute unit independent of grade.',
        'US lb depends on a grade-specific basis size, so the same GSM is a different lb for Cover, Text, and Bond.',
      ],
    },
    booklet: {
      pages: 'Page count',
      pagesUnit: 'pp',
      pagesHelper: 'Total pages incl. cover (multiple of 4 recommended)',
      quickPick: 'Quick pick',
      sheetsLabel: 'Sheets needed',
      sheetUnit: 'sheets',
      paddedLabel: 'Adjusted page count',
      blanksLabel: 'Blank pages',
      outer: 'outer',
      inner: 'inner',
      warn: 'Not a multiple of 4 — blank pages are added. Round to the nearest multiple of 4.',
      note: 'For saddle stitch. One folded sheet holds 4 pages; the page order is shown as outer/inner spreads.',
      guide: [
        'Saddle stitch binds in 4-page units, so the total page count must be a multiple of 4.',
        'Outer sheets carry the first and last pages; inner sheets carry the middle pages.',
      ],
    },
    nup: {
      sheet: 'Parent sheet',
      custom: 'Custom',
      sheetW: 'Sheet width (mm)',
      sheetH: 'Sheet height (mm)',
      pieceLabel: 'Finished size',
      pieces: {
        card: 'Business card',
        postcard: 'Postcard',
        a6: 'A6',
        a5: 'A5',
        a4: 'A4',
      },
      pieceW: 'Piece width (mm)',
      pieceH: 'Piece height (mm)',
      gap: 'Gutter / gap (mm)',
      gapHelper: 'Cutting allowance, usually 0–5mm',
      perSheetLabel: 'Pieces per sheet',
      unit: '',
      gridLabel: 'Layout (cols × rows)',
      wasteLabel: 'Wasted area',
      rotatedBadge: 'Rotated 90°',
      note: 'How many finished pieces a parent sheet yields (n-up) and the wasted area. Both orientations are compared and the higher-yield one is used.',
      guide: [
        'Yield = (sheet width ÷ piece width) × (sheet height ÷ piece height); the better orientation is chosen automatically.',
        'Common Korean parent sheets: 4x6 (788×1091mm), Kuk (636×939mm).',
      ],
    },
    grommet: {
      width: 'Banner width (mm)',
      height: 'Banner height (mm)',
      spacing: 'Grommet spacing (mm)',
      spacingHelper: 'Typically every 500–600mm',
      totalLabel: 'Total grommets',
      unit: '',
      topLabel: 'Per top/bottom edge',
      sideLabel: 'Per side edge',
      note: 'A grommet sits at each corner and is spaced no farther apart than the spacing along every edge. Check the preview for placement.',
      guide: [
        'Grommets usually sit every 50–60cm, including the corners.',
        'For windy outdoor banners, tighten the spacing to reduce sag and tearing.',
      ],
    },
    color: {
      hex: 'HEX',
      gamutWarn:
        'This screen colour is outside the CMYK gamut and will print as the nearest reproducible colour.',
      gamutBadge: 'Out of gamut',
      copy: 'Copy',
      loading: 'Loading profile…',
      errorLoad: 'Could not load the color engine. Refresh and try again.',
      note: 'ICC profile-based conversion. The actual printed color depends on your printer’s profile and paper.',
      guide: [
        'CMYK is ink (print); RGB/HEX is screen. The ICC profile converts between them to preview an on-screen approximation.',
        'Exact print color depends on the printer’s profile and stock, so confirm with a proof.',
      ],
    },
    impose: {
      dropTitle: 'Drop the PDF to impose here',
      dropOr: 'or',
      dropBtn: 'Choose file',
      dropTypes: 'PDF file · processed in your browser',
      errTitle: 'Could not read the file',
      errDesc: 'Make sure it is a PDF and try again.',
      selected: 'File to impose',
      change: 'Change file',
      pieceLabel: 'Piece size',
      settingsTitle: 'Imposition settings',
      sheet: 'Parent sheet',
      custom: 'Custom',
      sheetW: 'Sheet width (mm)',
      sheetH: 'Sheet height (mm)',
      gap: 'Gutter / gap (mm)',
      margin: 'Edge / gripper margin (mm)',
      marginHelper: 'Margin kept clear at the sheet edges',
      perSheetLabel: 'Pieces per sheet',
      gridLabel: 'Layout (cols × rows)',
      rotatedBadge: 'Rotated 90°',
      tooBig:
        'The piece is larger than the sheet and cannot be placed. Check the sheet size or margins.',
      imposing: 'Imposing…',
      start: 'Build imposed PDF',
      doneTitle: 'Imposition complete',
      outLabel: 'Output file',
      specOutSize: 'Output size',
      download: 'Download PDF',
      reset: 'Start over',
      guideTitle: 'Guide',
      guide: [
        'The piece size is read automatically from the first page of your PDF.',
        'The gripper margin is where the press grabs the sheet — usually keep 10–15mm clear.',
        'Both orientations are compared and the higher-yield one is chosen, flagged with a badge when rotated.',
      ],
      disclaimer:
        'Processed in your browser; the file is never uploaded. Colors are preserved as-is. Use a separate tool for crop marks.',
    },
    marks: {
      dropTitle: 'Drop the PDF to mark here',
      dropOr: 'or',
      dropBtn: 'Choose file',
      dropTypes: 'PDF file · processed in your browser',
      errTitle: 'Could not read the file',
      errDesc: 'Make sure it is a PDF and try again.',
      selected: 'File to mark',
      change: 'Change file',
      trimLabel: 'Trim size',
      previewTitle: 'Preview',
      settingsTitle: 'Mark settings',
      crop: 'Crop marks',
      registration: 'Registration marks',
      bleed: 'Bleed (mm)',
      offset: 'Offset (mm)',
      length: 'Mark length (mm)',
      weight: 'Stroke width (pt)',
      applying: 'Adding marks…',
      start: 'Build marked PDF',
      doneTitle: 'Marks added',
      outLabel: 'Output file',
      specOutSize: 'Output size',
      download: 'Download PDF',
      reset: 'Start over',
      guideTitle: 'Guide',
      guide: [
        'Crop marks show where to trim; registration marks check color alignment.',
        'Marks sit outside the trim, in the bleed area, so the page grows to fit them.',
        'The offset keeps the marks clear of the printed (bleed) area.',
      ],
      disclaimer:
        'Processed in your browser; the file is never uploaded. Marks are added to every page and drawn in registration black (all plates). Match the values to your printer’s spec.',
    },
    proof: {
      dropTitle: 'Drop an image to soft-proof here',
      dropOr: 'or',
      dropBtn: 'Choose file',
      dropTypes: 'JPG · PNG · WebP · processed in your browser',
      errTitle: 'Could not read the file',
      errDesc: 'Make sure it is an image (JPG·PNG·WebP) and try again.',
      loading: 'Loading color profile…',
      errorLoad: 'Could not load the color engine. Refresh and try again.',
      processing: 'Converting image…',
      gamutLabel: 'Out-of-gamut area',
      inGamut: 'In gamut',
      reset: 'Start over',
      originalLabel: 'Original (screen)',
      proofLabel: 'Proof (print sim)',
      highlight: 'Highlight out-of-gamut',
      highlightHelper: 'Mark pixels that dull in print, in magenta',
      uploadIcc: 'Upload ICC profile',
      download: 'Download proof PNG',
      simNote:
        'This is an on-screen simulation and does not guarantee the printed result. It varies with monitor calibration, paper, and press conditions.',
      guideTitle: 'Guide',
      guide: [
        'Compare the original (screen RGB) with the print simulation (CMYK profile) side by side.',
        'The out-of-gamut % is the share of pixels whose screen color can’t be reproduced in CMYK.',
        'Upload your printer’s ICC profile for a more accurate preview.',
      ],
      disclaimer: 'ICC profile-based simulation. Confirm exact color with a printed proof.',
    },
    pdf: {
      dropTitle: 'Drop your PDF here',
      dropOr: 'or',
      dropBtn: 'Choose file',
      dropTypes: 'PDF file · processed in your browser',
      analyzing: 'Analyzing your file…',
      errTitle: 'Could not read the file',
      errDesc: 'Make sure it is a PDF and try again.',
      previewAlt: 'First page preview',
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
      sizeA3: 'A3 (297 × 420 mm)',
      sizeLetter: 'Letter (8.5 × 11 in)',
      sizeFit: 'Fit to image size',
      orientationLabel: 'Orientation',
      orientAuto: 'Auto',
      orientPortrait: 'Portrait',
      orientLandscape: 'Landscape',
      previewTitle: 'Preview',
      effDpiLabel: 'Effective resolution',
      dpiLowBadge: 'Low resolution',
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
      specOutSize: 'Output size',
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
        'PDF preflight reports the page size, image resolution, color spaces, and font details the browser can detect, while separating automatic findings from items that still need manual review.',
      body: [
        {
          heading: 'Detected properties and manual review',
          text: 'Readable page and object properties appear as detected findings. Spot colors, overprint intent, and production-specific trim decisions stay in manual review when the file structure cannot support a reliable pass or fail.',
        },
        {
          heading: 'Limits of browser analysis',
          text: 'The upload is a first-pass inspection performed in the browser. It does not reproduce a RIP, press color settings, or physical cutting tolerance, so confirm final production conditions with the printer.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Does manual review mean the file is wrong?',
          a: 'No. It means browser analysis does not have enough evidence to decide, so the source document or printer settings need a human check.',
        },
        {
          q: 'Does a clean report prove the PDF is print-ready?',
          a: 'No. The report covers detectable file properties, not a contract proof, RIP output, or finishing setup.',
        },
      ],
    },
    convert: {
      intro:
        'The image-to-PDF converter fits supported raster images onto PDF pages while preserving their aspect ratio and leaving RGB pixel data unconverted.',
      body: [
        {
          heading: 'Supported images and fitting',
          text: 'Supported JPEG, PNG, and WebP files are scaled to fit inside the selected page without stretching. A large image is reduced; an image with a different aspect ratio can leave empty page area rather than being cropped.',
        },
        {
          heading: 'RGB is preserved',
          text: 'This is document packaging, not a print-profile conversion. RGB images remain RGB, so use the printer’s specified profile and workflow separately when CMYK output is required.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Does conversion automatically make images CMYK?',
          a: 'No. Their RGB values remain unchanged; CMYK conversion is a separate color-management step.',
        },
        {
          q: 'Will an image be cropped to fill the page?',
          a: 'No. The default fit preserves the whole image and its aspect ratio, which can leave unused space.',
        },
      ],
    },
    color: {
      intro:
        'The color converter uses Little CMS and a bundled default CMYK ICC profile to convert between RGB and CMYK values in the browser.',
      body: [
        {
          heading: 'Conversion through the bundled profile',
          text: 'The displayed values come from the bundled profile’s relative-colorimetric conversion. A commercial printer may use a different output profile, ink set, stock, or rendering setup, so confirm the required profile before production.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Will the calculated CMYK values print exactly like the screen?',
          a: 'No. The conversion is ICC-based, but it reflects the bundled default profile rather than every press condition. Commercial output can differ with the printer’s profile and materials.',
        },
      ],
    },
    proof: {
      intro:
        'Soft proofing simulates the effect of a selected output profile on a monitor, but it cannot remove the limits of the display or viewing environment.',
      body: [
        {
          heading: 'Monitor and profile dependency',
          text: 'Accuracy depends on the correct output ICC profile and a calibrated display. Paper texture, gloss, fluorescent or metallic inks, and changing room light cannot be reproduced completely on screen.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Does a soft proof replace a physical proof?',
          a: 'No. It helps preview the direction of color changes; verify critical color on the intended stock with a physical proof.',
        },
      ],
    },
    res: {
      intro:
        'The image resolution calculator divides pixel dimensions by output inches to show the effective DPI an image has at a chosen physical size.',
      body: [
        {
          heading: 'Pixels divided by inches',
          text: 'Effective DPI is the pixel count on each axis divided by that axis in inches. Enlarging the same image spreads its pixels over more space and lowers DPI; printing it smaller raises DPI.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Why can metadata DPI differ from effective DPI?',
          a: 'Effective DPI is recalculated from real pixels and placed size. Editing only a stored DPI tag does not add pixels.',
        },
      ],
    },
    size: {
      intro:
        'The paper-size converter uses physical dimensions and a target DPI to calculate pixel canvas dimensions; it does not judge source-image quality or color settings.',
      body: [
        {
          heading: 'Physical size to pixels',
          text: 'Divide millimeters by 25.4 to get inches, then multiply by the target DPI. A4 at 210×297mm and 300 DPI, for example, needs about 2480×3508 pixels.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Do the calculated dimensions guarantee print quality?',
          a: 'No. They define a target canvas only; source sharpness, resampling, and color mode still need separate checks.',
        },
      ],
    },
    weight: {
      intro:
        'The paper weight calculator multiplies one sheet’s area by GSM and quantity to estimate the theoretical weight of the paper itself.',
      body: [
        {
          heading: 'Area × GSM × quantity',
          text: 'Convert width and height to meters, multiply the area by GSM for grams per sheet, then multiply by the sheet count. Packaging, ink, moisture, and manufacturing tolerance are outside this paper-only result.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Can I use the result directly as a shipping weight?',
          a: 'Not for a final rate. Weigh the packed job because packaging, stock moisture, and mill tolerance add variation.',
        },
      ],
    },
    gsm: {
      intro:
        'The basis-weight converter uses paper-grade basis sizes to approximate conversions between GSM and US pounds.',
      body: [
        {
          heading: 'A basis-weight approximation',
          text: 'Pounds are defined from a different basis-sheet size for Bond, Text, Cover, and other grades. The same lb number can therefore represent different GSM values, so use the conversion as a stock-selection estimate.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Why does changing the paper grade change the result?',
          a: 'Each grade defines pounds from the weight of 500 sheets at its own basis dimensions.',
        },
      ],
    },
    spine: {
      intro:
        'The spine calculator estimates text-block thickness from page count and paper caliper, which can vary by mill, stock finish, and binding process even at the same GSM.',
      body: [
        {
          heading: 'Caliper and bindery variation',
          text: 'The real spine depends on sheet caliper, cover construction, adhesive, and compression. Use the estimate to begin a layout, then confirm it with the supplied stock specification or a bindery dummy before ordering.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Does the same GSM always produce the same spine?',
          a: 'No. Coating and bulk can give two papers with the same GSM different thickness per sheet.',
        },
      ],
    },
    bleed: {
      intro:
        'The bleed calculator separates the final trim size from the larger artwork size created by adding bleed on every edge.',
      body: [
        {
          heading: 'Trim size versus bleed size',
          text: 'Artwork width and height equal the trim size plus bleed on both opposing sides. Bleed extends backgrounds beyond the cut line and is not part of the finished piece.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What does 3mm bleed add to a 90×50mm card?',
          a: 'It adds 6mm to each dimension, making the artwork size 96×56mm.',
        },
      ],
    },
    fold: {
      intro:
        'The fold calculator divides panel widths while allowing for a narrower inner panel where layers tuck inside one another.',
      body: [
        {
          heading: 'Inner-panel allowance',
          text: 'A roll fold can buckle unless inward panels are slightly narrower. The required allowance changes with stock caliper and folding equipment, so confirm the final split with a folded sample on the intended paper.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Can every panel use the same width?',
          a: 'Some folds, such as a Z-fold, use nearly equal panels, but a panel that tucks inside may need a width allowance for paper thickness.',
        },
      ],
    },
    label: {
      intro:
        'The label layout calculator finds rows and columns inside the usable sheet area after subtracting edge margins and spacing between labels.',
      body: [
        {
          heading: 'Margins, gaps, and usable area',
          text: 'Subtract left, right, top, and bottom margins, then divide the remaining dimensions by the label size plus its gap. The rectangular result depends on your inputs; enter the converter’s gripper margin and cutting tolerance where applicable.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Does a zero gap always give the best layout?',
          a: 'It can increase the mathematical count, but it may remove space required for cutting or die lines. Check the minimum gap for the production method.',
        },
      ],
    },
    booklet: {
      intro:
        'The saddle-stitch calculator rounds the total to a multiple of four and reports how many blank pages are needed.',
      body: [
        {
          heading: 'Four-page units and blanks',
          text: 'One folded sheet creates four pages, so a saddle-stitched booklet is built in four-page units. If the manuscript count does not fit, decide where the calculated blank pages belong during layout.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'How many blanks does a 22-page manuscript need?',
          a: 'It needs two blank pages to reach the next multiple of four, 24 pages.',
        },
      ],
    },
    nup: {
      intro:
        'The N-up calculator compares how many finished pieces fit on a sheet when item gaps and 90-degree rotation are included.',
      body: [
        {
          heading: 'Fit count, gap, and rotation',
          text: 'It divides usable sheet width and height by item dimensions plus the chosen gap, then compares the rotated result. Gripper space, trim grip, and paper grain remain production constraints outside the count.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Is the layout with the highest count always best?',
          a: 'No. Finishing direction, gripper margin, and paper grain can make a lower-count arrangement more practical.',
        },
      ],
    },
    impose: {
      intro:
        'The PDF imposition tool repeats only the source PDF’s first page across a larger sheet in an N-up grid, using the selected margin and spacing to find how many copies fit.',
      body: [
        {
          heading: 'First-page grid placement',
          text: 'The first page supplies the piece size and artwork. The tool subtracts the sheet margin, applies the chosen gap, and compares upright and 90-degree rotated grids; additional PDF pages are not placed.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What happens when the source PDF has several pages?',
          a: 'Only the first page is repeated in the output grid. Split or process other pages separately if each one also needs an N-up sheet.',
        },
      ],
    },
    marks: {
      intro:
        'The printer-marks tool adds trim and registration indicators around an existing page, but it cannot create artwork bleed that is missing from the source.',
      body: [
        {
          heading: 'Marks do not create bleed',
          text: 'A crop mark identifies where to cut; it does not extend an image past that line. If artwork stops at trim, extend its background into a bleed area in the design source before adding marks.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Will adding marks fix a possible white edge?',
          a: 'No. Without source artwork beyond trim, marks add instructions but no extra background to cut through.',
        },
      ],
    },
    grommet: {
      intro:
        'The banner grommet calculator anchors a grommet at every corner and divides each edge into approximately equal intervals no greater than the requested spacing; there is no edge-offset control.',
      body: [
        {
          heading: 'Corner anchors and equal spacing',
          text: 'Width, height, and target spacing determine the positions. The rectangular model redistributes each full edge evenly from corner to corner; seams, reinforcement, and wind load may require a different production layout.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Will every interval equal the number I enter?',
          a: 'The tool chooses a whole number of segments and redistributes them evenly, so the actual interval can differ slightly.',
        },
      ],
    },
  },
};
