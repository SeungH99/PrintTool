import type { Dictionary } from './ko';

export const en: Dictionary = {
  nav: { home: 'Home', tools: 'Tools', cta: 'Check PDF' },
  home: {
    metaTitle: 'Print Preflight & Spec Calculators · PrintReady',
    eyebrow: 'Print production toolkit',
    heroTitle: 'Check your files and specs before they reach the print shop',
    heroDesc:
      'PDF, images, book spine, paper weight, fold layouts — every calculation and check you need for print production, in one place.',
    ctaPrimary: 'Start PDF check',
    ctaSecondary: 'Browse calculators',
    toolsTitle: 'Pick a tool and start right away',
    toolsDesc: 'From preflight to calculation — every step of print production, covered.',
    keywords: [
      'print preflight',
      'PDF preflight',
      'print file check',
      'print-ready PDF conversion',
      'spine width calculator',
      'paper weight calculator',
      'fold layout calculator',
      'label layout calculator',
      'image print size',
      'DPI checker',
      'CMYK RGB color check',
      'bleed trim check',
    ],
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
  ],
  footer: {
    tagline: 'Print-production checks and calculations, all in one place.',
    toolsHead: 'Tools',
    aboutHead: 'About',
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
    bleed: {
      width: 'Finished width (mm)',
      height: 'Finished height (mm)',
      bleed: 'Bleed (mm)',
      bleedHelper: '3mm per side is the common standard',
      safe: 'Safe margin (mm)',
      safeHelper: 'Keep text and logos inside this line',
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
    bleed: {
      intro:
        'The bleed & safe-area calculator turns a finished (trim) size into the working size with bleed added on every side, plus the safe line that keeps text and logos from being cut. You build artwork at the working size and the piece is trimmed to the finished size, so it prints with no white edges and nothing important clipped.',
      body: [
        {
          heading: 'Working size, trim line, and safe line',
          text: 'Working size = finished size + bleed on all sides. The trim line sits at the finished size, and the safe line is inset from the trim. The preview shows all three zones: bleed (outer), trim (middle), and safe (inner).',
        },
        {
          heading: 'Why bleed is needed',
          text: 'Cutters trim stacks of sheets at once and can drift by 1–2mm. Any design where color or imagery touches the edge must fill to the bleed so a shifted cut never leaves a white sliver. 3mm per side is the common standard; some printers ask for 1–2mm.',
        },
        {
          heading: 'Keep content inside the safe line',
          text: 'Place text, logos, and numbers that must not be cut inside the safe line, typically 3mm in from the trim. That margin absorbs cutting tolerance so nothing important gets clipped.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What is the difference between trim size and working size?',
          a: 'Trim size is the final size after cutting; working size is that plus bleed on every side, which is how you build the file. A 90×50mm card with 3mm bleed has a 96×56mm working size.',
        },
        {
          q: 'How much bleed is standard?',
          a: '3mm on all sides is the common standard. Some printers ask for 1–2mm, so check your printer’s guide before ordering.',
        },
        {
          q: 'How big should the safe margin be?',
          a: 'About 3mm inside the trim line is typical. Keep important text and logos inside it so they survive if the cut drifts.',
        },
        {
          q: 'Can I go edge to edge without bleed?',
          a: 'Not recommended. Without bleed, a slightly shifted cut can show a white edge. Always add bleed when color or imagery reaches the edge.',
        },
      ],
    },
    size: {
      intro:
        'The paper size to pixels calculator turns standard formats like A4, business card, and postcard — or a custom size — into mm, cm, inches, and the pixel dimensions at a target DPI. It uses pixels = size(mm) ÷ 25.4 × DPI, so you know exactly how many pixels your design canvas needs.',
      body: [
        {
          heading: 'How size converts to pixels',
          text: 'Divide millimeters by 25.4 to get inches, then multiply by DPI for pixels. Filling A4 (210×297mm) at 300 DPI needs about 2480×3508px. A higher DPI yields more pixels at the same physical size.',
        },
        {
          heading: 'Standard paper sizes',
          text: 'The ISO A series halves in area each step down from A4 (210×297mm). US sizes include Letter (215.9×279.4mm), Legal, and Tabloid; a business card is typically 90×50mm and a postcard 100×148mm.',
        },
        {
          heading: 'Setting up your canvas',
          text: 'Enter these pixel values as the canvas size in your design app to guarantee print resolution. For trimmed work, add 3mm bleed per side to the size. Color mode (CMYK) is set separately.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'How many pixels is A4 at 300 DPI?',
          a: 'About 2480 × 3508 pixels — A4 (210×297mm) divided by 25.4 to inches, then multiplied by 300.',
        },
        {
          q: 'What is a business card in pixels?',
          a: 'A 90×50mm card at 300 DPI is about 1063 × 591 pixels; add a little more for 3mm bleed.',
        },
        {
          q: 'What DPI should I use?',
          a: '300 DPI for general print. Large-format pieces viewed from a distance, like posters and banners, are fine at 150 DPI.',
        },
        {
          q: 'Why convert between mm and px?',
          a: 'Print sizes are specified in mm while design canvases are in px. Converting lets you build a file at the right resolution for the print size.',
        },
      ],
    },
    gsm: {
      intro:
        'The paper weight converter turns metric GSM (g/m²) into US basis weight (lb) for each paper grade — Bond, Text, Cover, Index, Tag, and Bristol. Because lb uses a different basis sheet size per grade, the same paper reads as a different lb number depending on grade; this tool computes them all at once.',
      body: [
        {
          heading: 'GSM vs. lb',
          text: 'GSM is the weight of one square meter of paper, an absolute unit independent of grade. US lb is the weight of 500 sheets of that grade’s basis size (e.g. Cover 20×26in), so the same caliper reads as a different lb per grade.',
        },
        {
          heading: 'Conversion factors by grade',
          text: 'lb = GSM ÷ factor, with a grade-specific factor: Bond 3.76, Text 1.48, Cover 2.70, Index 1.875, Tag 1.63, Bristol 2.19. For example, 270 GSM is about 100lb Cover, and 216 GSM is about 115lb Index.',
        },
        {
          heading: 'Using it to order paper',
          text: 'When ordering imported stock quoted in lb, convert to GSM to compare against metric weights. Different grades at the same GSM can differ in thickness and stiffness, so confirm with a sample.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What is 80lb Cover in GSM?',
          a: 'About 216 GSM — 80 multiplied by the Cover factor 2.7048. It is a common thickness for covers and business cards.',
        },
        {
          q: 'Why do two papers at the same lb differ in thickness?',
          a: 'Each grade (Text, Cover, Bond, etc.) uses a different basis sheet size. 80lb Text and 80lb Cover have very different GSM. Compare by GSM for accuracy.',
        },
        {
          q: 'What GSM is copy paper?',
          a: 'Copy paper is usually 80 GSM (about 20lb Bond); business cards use 250 GSM or more (about 90lb+ Cover).',
        },
        {
          q: 'Is GSM or lb more accurate?',
          a: 'GSM is the grade-independent absolute unit, so it is more reliable for comparison. lb depends on the basis size and should always name its grade.',
        },
      ],
    },
    pdf: {
      intro:
        'A PDF preflight check inspects your print file before it goes to the printer, verifying bleed, page size, image resolution (DPI), color mode (CMYK/RGB), and font embedding in one pass. Catching issues before output saves you from reprints, missed deadlines, and extra cost. Your file is analyzed entirely in the browser and never uploaded to a server.',
      body: [
        {
          heading: 'How the check works',
          text: 'The tool reads each page to pull the page boxes (MediaBox/TrimBox), the pixel dimensions and placed size of every image, the color space, and font embedding status. Effective resolution is pixels divided by placed size in inches, so a 1000px image placed at 4 inches lands at about 250 DPI. Every item is flagged pass, warning, or needs review, and the numbers are estimates for guidance.',
        },
        {
          heading: 'Print standards and typical specs',
          text: 'For general print, aim for 300 DPI images (150 DPI is fine for large-format viewed from a distance), 3mm bleed, and a 3-5mm safety margin. Use CMYK, set small body black to K100, and embed all fonts or convert them to outlines. Paper is specified by weight (GSM): 80-120g for text stock and 200-300g for covers is common.',
        },
        {
          heading: 'Common mistakes to avoid',
          text: 'The usual culprits are stray RGB or spot colors, full-bleed designs exported with no bleed, and low-res images scaled up. Small text or thin rules built from all four CMYK plates can look fuzzy if the press misregisters, so keep them K-only. Do not ignore warnings; fix them in the source file and re-export rather than shipping as-is.',
        },
        {
          heading: 'Export workflow tips',
          text: "Exporting from your design app with a PDF/X-1a or PDF/X-4 preset cleans up color, fonts, and transparency for print. Place trim and registration marks outside the bleed, and set bleed to 3mm in the document setup before export. Even after a clean check, follow your printer's own spec sheet for margins, resolution, and file naming when it differs.",
        },
        {
          heading: 'How it connects to binding and finishing',
          text: "For a cover you also need the spine width, which depends on paper weight and page count, and perfect binding versus saddle-stitch use different imposition. Finishes like foil, embossing, or spot UV are usually placed on a separate spot-color layer to mark their position. These steps fall outside this check, so confirm them against the printer's spec sheet.",
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What DPI should a print-ready PDF be?',
          a: 'Aim for 300 DPI at the final placed size for general print. Large-format pieces viewed from a distance, like banners, are fine at 100-150 DPI.',
        },
        {
          q: 'Can I send an RGB file to print as-is?',
          a: 'The printer will convert it to CMYK automatically, but bright or neon colors can turn muddy. If color accuracy matters, convert to CMYK while designing so you can preview the shift.',
        },
        {
          q: 'How much bleed should I add?',
          a: '3mm on all sides is the common standard, though some printers ask for 1-2mm. Any design where color or imagery touches the edge must include bleed.',
        },
        {
          q: 'How do I stop fonts from breaking at the printer?',
          a: 'Embed all fonts when exporting the PDF, or convert text to outlines so it renders identically on any system. For fonts whose license blocks embedding, outlining is the safe option.',
        },
        {
          q: 'If my file passes, are printing errors impossible?',
          a: "Passing catches the major issues and sharply lowers the risk, but the figures are estimates, not a guarantee. Before final output, confirm against the printer's guidelines and a proof.",
        },
        {
          q: 'Is my uploaded PDF stored on a server?',
          a: 'No. The file is analyzed only in your browser and is never sent to or stored on any server, so confidential documents stay private.',
        },
        {
          q: 'Why should black text be K100 instead of rich black?',
          a: 'Rich black built from all four plates can look fuzzy on small text if the press misregisters. Keep small black text as K100 single-channel for crisp edges.',
        },
      ],
    },
    convert: {
      intro:
        'The print-ready PDF converter turns JPG, PNG, and WebP images and existing PDFs into a PDF sized to standard print formats like A4 or A3, so you get a file you can send straight to the printer. Pick the page size and orientation (portrait or landscape) and your file is laid out to match, with everything processed locally in your browser and no login required.',
      body: [
        {
          heading: 'How the conversion works',
          text: 'Upload an image and each one is placed on a PDF page at the size (A4, A3, etc.) and orientation you select; existing PDFs are fitted to the same chosen format. The image keeps its aspect ratio as it scales to fit, and any leftover space becomes margin. Print sharpness follows a simple relationship: print size in inches equals pixel count divided by DPI, so the same image looks lower-res on a larger format.',
        },
        {
          heading: 'Standard sizes and target resolution',
          text: 'A4 is 210×297mm and A3 is 297×420mm under ISO standards. Commercial print typically targets 300 DPI, which means roughly 2480×3508px to fill an A4 page and about 3508×4961px for A3. Posters viewed from a distance can be fine at 150–200 DPI.',
        },
        {
          heading: 'Common mistake: upscaling low-res images',
          text: 'The most frequent issue is dropping a small image onto a large format, which leaves the effective resolution too low. A 1000px-wide image stretched across A4 (about 8.27in wide) lands near 120 DPI and prints soft. Check your source pixel dimensions first and confirm they clear 300 DPI at the target size.',
        },
        {
          heading: 'Before you send it to the printer',
          text: 'Confirm the exact page size and orientation your printer requires, then convert to match. If the job is cut to size, note that this tool does not add a 3mm bleed for you; it has to be built into the source artwork. After converting, open the PDF and eyeball the page size, orientation, and any cropping.',
        },
        {
          heading: 'Color and bleed are separate steps',
          text: 'This conversion handles page size and placement; it does not switch the color mode to CMYK or remap ink profiles. RGB images stay RGB, so if your job needs CMYK, convert at the source or coordinate with your print shop. Treat trim, bleed, and font embedding as separate preflight checks.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'How do I convert a JPG image to a print-ready PDF?',
          a: 'Upload the image, pick the page size (A4, A3, etc.) and orientation, and a print-ready PDF laid out to that format is generated. You can download it straight from your browser with no login.',
        },
        {
          q: 'What DPI should a print-ready PDF be?',
          a: 'Commercial printing usually wants 300 DPI. Check that pixel count divided by inches clears 300 at your target size; posters and other distance-viewed pieces can be fine at 150–200 DPI.',
        },
        {
          q: 'Should I choose A4 or A3?',
          a: 'Match your final printed size: A4 is 210×297mm and A3 is double that area at 297×420mm. If your printer specifies a format, follow it.',
        },
        {
          q: 'Does it add a 3mm bleed automatically?',
          a: 'No. The tool only sets page size and placement, so a 3mm bleed is not generated for you; build it into the source artwork when the job is trimmed to size.',
        },
        {
          q: 'Are RGB images converted to CMYK?',
          a: 'No. Conversion does not change the color mode, so RGB images stay RGB. Convert at the source or check with your print shop if CMYK is required.',
        },
        {
          q: 'Can I convert WebP or PNG files too?',
          a: 'Yes. JPG, PNG, and WebP images and existing PDFs can all be converted into a print-ready PDF.',
        },
        {
          q: 'Are my uploaded files stored on a server?',
          a: 'No. Conversion happens entirely in your browser and files are never sent to an external server.',
        },
      ],
    },
    res: {
      intro:
        "The image print size calculator takes your photo's pixel dimensions and a target resolution (DPI) and returns the largest size you can print before the image goes soft. It applies print size = pixels ÷ DPI and shows the result at 300 and 150 DPI in both inches and centimeters. Checking resolution before you print helps you avoid reorders and wasted paper.",
      body: [
        {
          heading: 'How print size is calculated',
          text: 'Divide the width and height in pixels by your target DPI to get the size in inches, then multiply by 2.54 for centimeters. A 3000×2400px image, for example, prints up to 10×8 inches (about 25.4×20.3cm) at 300 DPI. Lowering the DPI grows the print size from the same pixels but reduces sharpness.',
        },
        {
          heading: 'Print resolution tiers',
          text: 'Commercial and photo printing treat 300 DPI as the high-quality benchmark. Posters and banners viewed from a distance work at around 150 DPI, and large outdoor signage tolerates 72-100 DPI. Newsprint and budget jobs sit near 150-200 DPI; below that, pixels start to show.',
        },
        {
          heading: 'A common mistake and how to avoid it',
          text: 'The most common mistake is upscaling a small image in an editor to hit a resolution target. Interpolating pixels does not add real detail, so the print often ends up softer, not sharper. Stay within the maximum size the calculator reports, and if it falls short, reshoot or rescan the original at a higher resolution.',
        },
        {
          heading: 'A practical workflow tip',
          text: 'Before sending to a printer, work backward from the final placed size: needed pixels = print size (inches) × DPI. Printing A4 (about 8.27×11.69in) at 300 DPI therefore needs roughly 2480×3508px. Add 3mm of bleed to that size so nothing important is lost at the trim edge.',
        },
        {
          heading: 'DPI vs PPI and other checks',
          text: "DPI (a press's ink-dot density) and PPI (an image's pixel density) are technically different, but for sizing they are used interchangeably. This calculator estimates size from pixels and DPI only; color mode (CMYK) and bleed are separate checks. Treat the output as a reference estimate and confirm final specs against your printer's guidelines.",
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Why do my photos print blurry?',
          a: 'When the pixel count is too low for the print size, the effective DPI drops and pixels smear together. Print smaller or use a higher-resolution original to fix it.',
        },
        {
          q: 'How many pixels do I need to print A4 at 300 DPI?',
          a: 'About 2480×3508px. A4 is 8.27×11.69 inches, and multiplying each side by 300 gives that count; add a little extra for bleed.',
        },
        {
          q: 'How large can a smartphone photo print?',
          a: 'A 12-megapixel photo (about 4000×3000px) prints sharply up to roughly 33.9×25.4cm at 300 DPI. Enter the pixel dimensions to see the exact maximum size.',
        },
        {
          q: 'Does enlarging an image increase its resolution?',
          a: 'No. Upscaling in an editor only interpolates pixels and does not create real detail; the original pixel count sets the quality ceiling.',
        },
        {
          q: 'What is the difference between DPI and PPI?',
          a: 'PPI is the pixel density of an image, while DPI is the dot density of a printer. For sizing they mean effectively the same thing, and this calculator works from pixels and DPI.',
        },
        {
          q: 'Is 150 DPI good enough for printing?',
          a: 'For posters and banners viewed from a distance, 150 DPI is fine. For photos and brochures held close, stick with 300 DPI.',
        },
        {
          q: "Does this calculator match a printer's exact specs?",
          a: 'The result is an estimate from pixels and DPI only, so treat it as a reference. Check color mode (CMYK) and bleed separately, and confirm final specs with your printer. The calculation runs locally in your browser.',
        },
      ],
    },
    spine: {
      intro:
        'The book spine width calculator estimates spine thickness from the binding type, page count, and interior/cover paper weight (GSM). Getting the spine width right keeps the title and barcode from creeping onto the front or back cover. Because paper bulk and bindery tolerances vary, the result is an estimate, so confirm the final spec with your printer.',
      body: [
        {
          heading: 'How spine thickness is calculated',
          text: 'The number of leaves (pages ÷ 2) is multiplied by the thickness of one sheet (GSM × paper bulk/volume) to get the text-block thickness. A 100 gsm uncoated stock with a bulk near 1.2, for example, is about 0.12 mm per sheet. These are estimates that vary by paper and bindery, so confirm with your printer.',
        },
        {
          heading: 'Typical weights and bulk values',
          text: 'Perfect-bound trade books commonly run 80–100 gsm interior and 250–300 gsm cover stock. At the same GSM, a thin uncoated sheet (bulk 1.1–1.3) and a high-bulk book paper (1.6+) can differ by up to 1.5x in spine width. A 200-page 100 gsm uncoated text block lands near 12 mm before the cover is added.',
        },
        {
          heading: 'Common mistake: doubling the leaf count',
          text: 'A frequent error is entering the raw page count as leaves, which doubles the spine. Page count covers both sides of each sheet, so always divide by two to get leaves. Ignoring the spine fold lines and 3 mm bleed in the cover layout also pulls the title around onto the front panel after trimming.',
        },
        {
          heading: 'Cover layout workflow',
          text: 'Place the calculated spine width in the center of a single flat cover (back + spine + front) and add a 3 mm bleed on all outer edges. Keep the title and barcode at least 3–5 mm inside the spine fold lines as a safe margin. Pull a physical dummy from the bindery on the actual stock to verify the thickness before you commit.',
        },
        {
          heading: 'How binding type changes the spine',
          text: 'Perfect binding (including PUR) adds the cover thickness to the text block; case (hardcover) binding adds greyboard and cloth, making the spine thicker still. Saddle stitch nests folded signatures, so there is almost no flat spine and you cannot print on it. Thin books under ~32 pages usually go saddle-stitch, while 60+ pages typically move to perfect binding.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'How do you calculate spine thickness?',
          a: 'Multiply half the page count (leaves) by the thickness of one sheet (GSM × bulk) to get the text block, then add cover or board thickness depending on the binding.',
        },
        {
          q: 'What is the spine width for a 200-page book?',
          a: 'On 100 gsm uncoated stock the text block alone is roughly 12 mm, varying with paper bulk and cover thickness. Confirm the exact figure with a dummy from your printer on the actual stock.',
        },
        {
          q: 'Why should page count be a multiple of 4?',
          a: 'Sheets are folded into 4-page signatures, so a count that is not a multiple of 4 can leave blank pages.',
        },
        {
          q: 'Perfect binding vs. saddle stitch?',
          a: 'Perfect binding glues the spine, creates real thickness, and can be printed on; saddle stitch staples the center fold and has almost no spine.',
        },
        {
          q: 'What is the difference between GSM and paper thickness?',
          a: "GSM is weight per square meter, while thickness is GSM multiplied by the paper's bulk (volume) factor. Two sheets at the same GSM can differ in thickness if their bulk differs.",
        },
        {
          q: 'Do I need a spine width for saddle stitch?',
          a: 'Saddle stitch has almost no flat spine, so the spine width is effectively zero. With higher page counts, allow trim margin for creep (page push-out) instead.',
        },
        {
          q: 'Can I use the calculated value directly for print?',
          a: 'The value is an estimate, so verify the spine width with a physical dummy on the real stock before finalizing the cover layout.',
        },
      ],
    },
    weight: {
      intro:
        'The paper weight calculator estimates total weight and approximate packaged weight from sheet size, paper weight (GSM), and quantity. It is handy for working out shipping cost tiers, print quotes, and mailing weight before you send. The per-sheet weight is calculated exactly from area and GSM; only the packaged weight is an estimate.',
      body: [
        {
          heading: 'The paper weight formula',
          text: 'GSM is grams per square meter. One sheet = area (m²) × GSM, and total weight = per-sheet weight × quantity. For example, A4 (210×297 mm) is about 0.0624 m², so one 80 GSM sheet weighs roughly 5 g and a 500-sheet ream about 2.5 kg. The per-sheet weight is exact; only the packaged weight is an estimate.',
        },
        {
          heading: 'Typical GSM by use case',
          text: 'Copy paper and text stock usually run 70-100 GSM, flyers and leaflets 100-150 GSM, catalog covers 200-250 GSM, and business cards 250-350 GSM. Higher numbers mean thicker, heavier stock, which affects postage tiers and binding choices. At the same GSM, caliper (bulk) can still vary by coating and paper type.',
        },
        {
          heading: 'Common mistake: GSM vs pounds',
          text: 'North American pound (lb) ratings use a different basis size for each grade, so the same lb can mean very different weights. For instance, 80 lb text is about 118 GSM while 80 lb cover is about 216 GSM. To calculate accurately, convert to GSM before entering values and base the area on the final trimmed sheet size.',
        },
        {
          heading: 'Plan shipping and postage tiers',
          text: 'Estimating total weight before you ship lets you tune quantity or GSM so you do not cross a postage bracket or courier weight-rate step. Add envelope, padding, and box weight to the packaged figure and leave one tier of headroom to be safe. Because packaged weight is an estimate, confirm important quotes on a real scale.',
        },
        {
          heading: 'Units and related calculations',
          text: 'GSM measures weight, not thickness, so when you need spine width use the spine calculator with paper caliper and page count instead. Weight scales with area, so going from A4 to A3 doubles the per-sheet weight at the same GSM. Specs given as ream weight or M-weight (per 1,000 sheets) convert with the same formula once the sheet count matches.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What is GSM?',
          a: 'Grams per square meter, the weight of paper per m². 80 GSM means one square meter weighs 80 grams, and a higher number means thicker, heavier stock.',
        },
        {
          q: 'How do I convert GSM to pounds (lb)?',
          a: 'There is no single factor because each paper grade uses a different basis size. As a rough guide, text stock is about GSM ÷ 1.48 and cover stock about GSM ÷ 2.7, but for accurate weight it is safer to work in GSM directly.',
        },
        {
          q: 'How much does a ream of A4 80 GSM (500 sheets) weigh?',
          a: 'One A4 sheet is about 5 g, so 500 sheets weigh roughly 2.5 kg. Add packaging and the real shipping weight is a little higher.',
        },
        {
          q: 'Why does my scale reading differ from the calculated weight?',
          a: 'Paper absorbs moisture, so real GSM carries a tolerance of about ±5%. The per-sheet calculation is exact, but actual readings vary with humidity and paper batch.',
        },
        {
          q: 'Can I use the packaged weight estimate for shipping quotes?',
          a: 'It is fine for ballpark tier checks, but for exact rates weigh the parcel on a real scale, since the packaged weight is an estimate.',
        },
        {
          q: 'What GSM should I use for business cards and flyers?',
          a: 'Business cards are usually 250-350 GSM and flyers or leaflets 100-150 GSM. Go heavier for a stiffer feel, but expect mailing weight to rise with it.',
        },
        {
          q: 'How do I calculate paper weight for a different sheet size?',
          a: 'Convert the size to area in m², then multiply by GSM and quantity. Enter the sheet size in the calculator and it works out area and weight automatically.',
        },
      ],
    },
    fold: {
      intro:
        'The fold layout calculator returns the exact width of every panel — half fold, tri-fold, roll fold, and more — down to the millimeter. Panels that fold inward must be a little narrower so the paper nests without buckling. Check your panel split before sending a leaflet, brochure, or mailer to print to head off fold and trim surprises.',
      body: [
        {
          heading: 'How panel widths are calculated',
          text: 'Start by dividing the finished width by the number of panels, then shave roughly 1–3mm off each panel that tucks inside to absorb the step. The more layers roll inward, as in a roll fold, the more you trim the innermost panel while keeping the outer panel widest. Outputs are recommended estimates that shift with paper weight and folder accuracy.',
        },
        {
          heading: 'Fold types and standard panel counts',
          text: 'A half fold is 2 panels, a Z-fold or letter tri-fold is 3, and a roll fold or gate fold is 4. An A4 tri-fold (297mm wide) splits to about 99mm per panel, but a roll fold biases it to roughly 100 / 99 / 98mm so the inner panel clears. Eight- and ten-panel folds are planned alongside 4-page imposition units.',
        },
        {
          heading: 'Common mistake: equal-width panels',
          text: 'Splitting the width evenly makes the inner panel bulge or the folded edge wrinkle. Heavier stock (250GSM and up) needs a bigger trim, while thin 80–120GSM paper folds fine with about 1mm. Fold one proof on the actual stock before locking in the trim amount.',
        },
        {
          heading: 'Practical workflow tip',
          text: "Once widths are set, mark each fold line as a 0.25pt guide and extend a 3mm bleed past the outer trim. Keep text and logos at least 3–5mm inside every fold and trim line (the safety zone) so nothing lands on a crease. Design on the flat spread and match panel order to your printer's template.",
        },
        {
          heading: 'Where folding fits in the print flow',
          text: 'Panel sizing is decided together with imposition, trim margins, and binding method. A 6-page leaflet is finished by folding alone, but a multi-page booklet also needs 4-page signatures and a calculated spine width. Locking the panel split first makes the later PDF preflight — checking trim and bleed — far smoother.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What are the panel widths for an A4 tri-fold?',
          a: "Dividing A4's 297mm width by three gives about 99mm per panel, but narrow the inner panel by 1–2mm to roughly 97–98mm so it closes cleanly. Confirm the exact figure with a folded proof on your stock.",
        },
        {
          q: 'How much narrower should the inner panel be on a roll fold?',
          a: 'Trim about 1–3mm per panel, and more for heavy stock over 250GSM. With more layers, step each inner panel progressively narrower toward the center.',
        },
        {
          q: 'Do fold lines need bleed?',
          a: "Fold lines themselves don't need bleed, but the outer trim edges do — add 3mm. Where a background crosses a panel boundary, carry the color through so no white line shows at the crease.",
        },
        {
          q: 'Are a tri-fold and a Z-fold the same?',
          a: 'Both have three panels, but they fold differently. A letter tri-fold tucks one panel inside, so that panel must be narrower, while a Z-fold zig-zags and leaves the panels nearly equal width.',
        },
        {
          q: 'What safety margin should fold panels use?',
          a: 'Keep type and key elements at least 3–5mm inside both the fold and trim lines. Content sitting on a crease reads poorly and is vulnerable to fold and trim drift.',
        },
        {
          q: 'Why does thicker paper need a bigger panel trim?',
          a: 'Thicker stock has a shorter inner circumference when folded, so it needs more compensation. 250–300GSM card may want 2–4mm per panel, while 80–120GSM is fine with about 1mm.',
        },
        {
          q: 'How do I size complex folds like 8-panel or gate folds?',
          a: 'The principle is the same — narrow the inner panels, increasing the trim toward the innermost fold in fold order. A gate fold meets in the middle, so the two outer panels together must be slightly smaller than the inner width to close.',
        },
      ],
    },
    label: {
      intro:
        'The label layout calculator works out how many labels fit on a sheet, the row and column grid (imposition), and the expected yield. Enter the label size, sheet margins, and gap, and it finds the arrangement that fits the most. It even compares a rotated layout to cut the paper you waste on each sheet.',
      body: [
        {
          heading: 'How label imposition is calculated',
          text: 'Subtract the margins on both sides to get the usable print area, then divide by the label size plus the gap to get the number of columns and rows. For example, a 200mm usable width with a 50mm label and a 2mm gap gives (200+2)÷(50+2)≈3.88, so 3 columns fit. Columns × rows is the total per sheet, and the trailing gap after the last label is dropped so the count matches what really fits.',
        },
        {
          heading: 'Standard sheet and label specs',
          text: 'Common stocks include A4 (210×297mm), SRA3 (320×450mm), and large press sheets. Edge margins are typically 3-10mm and the gap between labels 2-3mm, with a separate 3mm bleed to absorb cutting tolerance. Sticker face stock usually runs 80-120 g/m², and self-adhesive label stock with its liner sits around 150 g/m².',
        },
        {
          heading: 'Common mistake: confusing bleed and gap',
          text: 'Margin, gap, and bleed each do a different job. Set the gap to 0 and the cut lines overlap, so neighboring labels get sliced; skip the bleed and cutting tolerance leaves a white edge. Unless you are running a gapless kiss-cut where adjacent labels share color, keep at least a 2mm gap between cut lines and 3mm of bleed on every label.',
        },
        {
          heading: 'Workflow tips to raise yield',
          text: 'Turn on rotation to compare portrait and landscape placement; you often pick up an extra column or two per sheet. Shrinking the label by just 1-2mm can add a whole row or column and lift the total count sharply, so simulate a few sizes before locking the design. Hand the chosen layout straight to your imposition file and die-line (cutting die) artwork.',
        },
        {
          heading: 'Units and the next step',
          text: 'Millimeters give the most reliable result; if you enter inches, convert at 1in = 25.4mm and keep it consistent. The output is an estimated yield, so confirm the press gripper margin and die-cut tolerance before you print. Once the per-sheet count is set, use the paper weight calculator for total sheets and the DPI calculator for output size.',
        },
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'How many labels fit on an A4 sheet?',
          a: 'On A4 (210×297mm) with 5mm margins and a 2mm gap, a 50×30mm label fits about 3 columns × 9 rows = 27 per sheet. Enter your sheet, label size, and gap for the exact columns, rows, and total.',
        },
        {
          q: 'Does rotating labels fit more on a sheet?',
          a: "Depending on the label's width-to-height ratio, a 90° rotated layout can fit more. With rotation on, the tool compares both orientations and picks the one that fits more.",
        },
        {
          q: 'Why do labels need margins and gaps?',
          a: 'They absorb printing and cutting tolerance and stop labels from touching. The sheet edge gets a gripper and trim margin, and the space between labels keeps cut lines from overlapping.',
        },
        {
          q: 'What is the difference between kiss-cut and die-cut labels?',
          a: 'Kiss-cut scores only the label face and leaves the liner intact; die-cut cuts through the liner too, separating each label. Kiss-cut sheet labels can use a small or even zero gap.',
        },
        {
          q: 'How much bleed should a label have?',
          a: 'Like other print work, labels usually need 3mm of bleed on all sides. It absorbs trim and cutting-die tolerance so no white edge shows up after cutting.',
        },
        {
          q: 'Is the label layout result exact?',
          a: 'The result is an estimated yield based on your inputs. In production the press gripper margin, cutting-die tolerance, and paper grain can shift it by a row, so confirm with your printer before ordering.',
        },
        {
          q: 'Are my inputs or files sent to a server?',
          a: 'No. Everything is computed locally in your browser, and your inputs and any uploaded files are never sent to or stored on a server.',
        },
      ],
    },
  },
};
