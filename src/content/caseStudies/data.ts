import type { CaseStudyMetric, CaseStudyRecord } from './types';
import { calculateBooklet, calculateResolution } from '@/lib/calculations';

const SAMPLE_BASE = '/samples';

const dates = {
  testedAt: '2026-08-09',
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
  toolVersion: '0.1.0',
} as const;

const resolutionDpi = (widthMm: number): number => {
  const targetDpi = (1200 * 25.4) / widthMm;
  const result = calculateResolution({
    widthPx: 1200,
    heightPx: 800,
    dpi: targetDpi,
    unit: 'cm',
  });
  return Number((1200 / (result.width / 2.54)).toFixed(2));
};

const booklet6 = calculateBooklet({ pages: 6 });
const booklet8 = calculateBooklet({ pages: 8 });
const booklet12 = calculateBooklet({ pages: 12 });

const resolutionMetrics: CaseStudyMetric[] = [
  {
    id: 'dpi-at-100mm',
    label: { ko: '100 mm 출력 유효 DPI', en: 'Effective DPI at 100 mm' },
    expected: 304.8,
    observed: resolutionDpi(100),
    unit: 'DPI',
    tolerance: 0.05,
    status: 'pass',
  },
  {
    id: 'dpi-at-200mm',
    label: { ko: '200 mm 출력 유효 DPI', en: 'Effective DPI at 200 mm' },
    expected: 152.4,
    observed: resolutionDpi(200),
    unit: 'DPI',
    tolerance: 0.05,
    status: 'pass',
  },
  {
    id: 'dpi-at-297mm',
    label: { ko: '297 mm 출력 유효 DPI', en: 'Effective DPI at 297 mm' },
    expected: 102.63,
    observed: resolutionDpi(297),
    unit: 'DPI',
    tolerance: 0.05,
    status: 'warning',
  },
];

export const caseStudies: CaseStudyRecord[] = [
  {
    slug: 'print-file-prep',
    relatedTools: ['convert', 'pdf', 'res'],
    samples: [
      {
        id: 'source-rgb-image',
        href: `${SAMPLE_BASE}/printready-rgb-1200x800.png`,
        downloadName: 'printready-rgb-1200x800.png',
        mimeType: 'image/png',
        description: {
          ko: 'PDF 변환에 사용한 1200 × 800 px RGB 원본 이미지',
          en: 'The 1200 × 800 px RGB source image used for PDF conversion',
        },
      },
      {
        id: 'converted-a4-pdf',
        href: `${SAMPLE_BASE}/printready-a4-rgb-low-resolution.pdf`,
        downloadName: 'printready-a4-rgb-low-resolution.pdf',
        mimeType: 'application/pdf',
        description: {
          ko: 'A4 가로 페이지에 맞춰 변환한 재현용 PDF',
          en: 'The reproducible PDF converted to fit a landscape A4 page',
        },
      },
    ],
    inputs: { widthPx: 1200, heightPx: 800, pageWidthMm: 297, pageHeightMm: 210 },
    metrics: [
      {
        id: 'page-width',
        label: { ko: '페이지 너비', en: 'Page width' },
        expected: 297,
        observed: 297,
        unit: 'mm',
        status: 'pass',
      },
      {
        id: 'page-height',
        label: { ko: '페이지 높이', en: 'Page height' },
        expected: 210,
        observed: 210,
        unit: 'mm',
        status: 'pass',
      },
      {
        id: 'color-mode',
        label: { ko: '검출 색상 모드', en: 'Detected color mode' },
        expected: 'RGB',
        observed: 'RGB',
        status: 'warning',
      },
      {
        id: 'minimum-image-dpi',
        label: { ko: '최저 이미지 DPI', en: 'Minimum image DPI' },
        expected: 102.63,
        observed: resolutionDpi(297),
        unit: 'DPI',
        tolerance: 1,
        status: 'warning',
      },
      {
        id: 'trim-box',
        label: { ko: 'TrimBox 존재', en: 'TrimBox present' },
        expected: false,
        observed: false,
        status: 'warning',
      },
      {
        id: 'bleed-box',
        label: { ko: 'BleedBox 존재', en: 'BleedBox present' },
        expected: false,
        observed: false,
        status: 'warning',
      },
    ],
    ...dates,
    sourceIds: ['adobePrintPdf'],
    limitations: [
      {
        ko: '이 검사는 제공된 샘플의 기술 속성을 기록한 것이며 특정 인쇄소의 접수 승인을 보장하지 않습니다.',
        en: 'This check records technical properties of the supplied sample; it does not guarantee acceptance by a particular print provider.',
      },
    ],
    copy: {
      ko: {
        title: '이미지에서 PDF 검사까지: 재현 가능한 전체 과정',
        description:
          '동일한 원본 이미지와 PDF를 내려받아 변환 결과의 페이지 크기, 색상 모드, 유효 DPI, 페이지 박스를 다시 확인할 수 있습니다.',
        eyebrow: '검증 사례 01',
        intro:
          '파일 준비 과정은 결과만 보여 주는 것보다 입력과 검사 조건을 함께 공개할 때 재현하기 쉽습니다. 이 사례는 1200 × 800 px RGB 이미지를 A4 가로 PDF로 변환한 뒤 동일한 검사 항목을 기록합니다.',
        problem:
          '화면에서 정상으로 보이는 이미지라도 A4 폭으로 확대하면 유효 DPI가 낮아질 수 있고, 변환만으로 RGB가 CMYK가 되거나 도련 박스가 생기지는 않습니다.',
        steps: [
          {
            heading: '원본 확인',
            body: '1200 × 800 px PNG를 내려받아 픽셀 크기와 RGB 원본임을 확인합니다.',
          },
          {
            heading: 'PDF 결과 비교',
            body: '변환된 PDF의 첫 페이지가 297 × 210 mm인지 확인합니다.',
          },
          {
            heading: '프리플라이트 실행',
            body: '색상 모드, 최저 이미지 DPI, TrimBox와 BleedBox 검출값을 표의 관측값과 비교합니다.',
          },
        ],
        explanation: [
          '1200 px 이미지를 297 mm 폭에 배치하면 유효 해상도는 약 102.63 DPI입니다.',
          'RGB 검출과 박스 부재는 자동 변환이나 인쇄 부적합을 단정하는 판정이 아니라 후속 확인이 필요한 관측값입니다.',
        ],
        actions: [
          '최종 출력 크기에서 필요한 DPI를 먼저 정하고 그에 맞는 픽셀 수의 이미지를 준비하세요.',
          '색상 프로파일, 도련, 폰트 및 인쇄소별 PDF 규격은 주문 전에 별도로 확인하세요.',
        ],
      },
      en: {
        title: 'From image to PDF preflight: a reproducible workflow',
        description:
          'Download the same source image and PDF to reproduce checks for page size, detected color mode, effective DPI, and page boxes.',
        eyebrow: 'Verified case 01',
        intro:
          'A file-preparation result is easier to reproduce when its input and inspection conditions are published together. This case converts a 1200 × 800 px RGB image to a landscape A4 PDF and records the same checks.',
        problem:
          'An image that looks fine on screen can have low effective DPI when enlarged to A4 width, and conversion alone does not turn RGB into CMYK or add bleed boxes.',
        steps: [
          {
            heading: 'Inspect the source',
            body: 'Download the 1200 × 800 px PNG and confirm its pixel dimensions and RGB source.',
          },
          {
            heading: 'Compare the PDF',
            body: 'Confirm that the first page of the converted PDF measures 297 × 210 mm.',
          },
          {
            heading: 'Run preflight',
            body: 'Compare the detected color mode, minimum image DPI, TrimBox, and BleedBox with the observed values in the table.',
          },
        ],
        explanation: [
          'A 1200 px image placed across 297 mm has an effective resolution of about 102.63 DPI.',
          'RGB detection and missing boxes are observations that call for follow-up, not automatic proof that a file is or is not printable.',
        ],
        actions: [
          'Choose the required DPI at final output size, then prepare an image with enough pixels.',
          'Confirm color profiles, bleed, fonts, and provider-specific PDF requirements before ordering.',
        ],
      },
    },
  },
  {
    slug: 'resolution-and-dpi',
    relatedTools: ['res', 'size', 'pdf'],
    samples: [
      {
        id: 'resolution-source-image',
        href: `${SAMPLE_BASE}/printready-rgb-1200x800.png`,
        downloadName: 'printready-rgb-1200x800.png',
        mimeType: 'image/png',
        description: {
          ko: '세 가지 출력 폭에 공통으로 사용하는 1200 px 너비 이미지',
          en: 'The 1200 px-wide image used for all three output widths',
        },
      },
    ],
    inputs: { widthPx: 1200, widthsMm: '100, 200, 297' },
    metrics: resolutionMetrics,
    ...dates,
    sourceIds: ['adobePrintPdf'],
    limitations: [
      {
        ko: 'DPI는 픽셀 수와 배치 크기의 관계만 설명합니다. 선명도, 압축 흔적, 리샘플링 품질까지 평가하지는 않습니다.',
        en: 'DPI describes the relationship between pixel count and placed size; it does not assess sharpness, compression artifacts, or resampling quality.',
      },
    ],
    copy: {
      ko: {
        title: '같은 이미지도 출력 크기에 따라 DPI가 달라지는 이유',
        description:
          '1200 px 너비의 같은 이미지를 100, 200, 297 mm로 출력할 때 유효 DPI가 어떻게 달라지는지 계산기로 재현합니다.',
        eyebrow: '검증 사례 02',
        intro:
          'DPI는 이미지 파일에 고정된 품질 점수가 아니라 픽셀 수를 실제 출력 폭에 얼마나 촘촘히 배치하는지를 나타내는 값입니다.',
        problem:
          '같은 파일도 작게 인쇄하면 픽셀이 조밀해지고 크게 인쇄하면 성기게 배치되므로, 파일명이나 화면 확대만으로 인쇄 해상도를 판단하기 어렵습니다.',
        steps: [
          { heading: '픽셀 수 고정', body: '샘플 이미지의 너비를 1200 px로 고정합니다.' },
          {
            heading: '출력 폭 변경',
            body: '출력 폭을 차례로 100 mm, 200 mm, 297 mm로 설정합니다.',
          },
          {
            heading: '유효 DPI 비교',
            body: '각 폭에서 304.8, 152.4, 102.63 DPI가 계산되는지 확인합니다.',
          },
        ],
        explanation: [
          '출력 폭이 두 배가 되면 같은 1200 px을 두 배 넓게 나누어 쓰므로 유효 DPI는 절반이 됩니다.',
          '297 mm에서는 약 102.63 DPI이므로 작은 출력물과 같은 세부 표현을 기대하기 어렵습니다.',
        ],
        actions: [
          '최종 재단 크기와 실제 이미지 배치 폭을 기준으로 DPI를 계산하세요.',
          '계산값이 작업 사양보다 낮다면 더 큰 원본을 사용하거나 출력 크기를 줄이고, 임의 업샘플링은 별도로 품질을 확인하세요.',
        ],
      },
      en: {
        title: 'Why the same image changes DPI at different print sizes',
        description:
          'Reproduce how a 1200 px-wide image changes from 304.8 to 152.4 and 102.63 DPI when printed at 100, 200, and 297 mm.',
        eyebrow: 'Verified case 02',
        intro:
          'DPI is not a fixed quality score stored in an image. It describes how densely a given number of pixels is placed across a physical print width.',
        problem:
          'The same file becomes denser when printed smaller and less dense when printed larger, so a filename or on-screen zoom cannot establish print resolution.',
        steps: [
          {
            heading: 'Hold pixels constant',
            body: 'Keep the sample image width fixed at 1200 px.',
          },
          {
            heading: 'Change output width',
            body: 'Set the output width to 100 mm, 200 mm, and 297 mm in turn.',
          },
          {
            heading: 'Compare effective DPI',
            body: 'Confirm calculated values of 304.8, 152.4, and 102.63 DPI.',
          },
        ],
        explanation: [
          'Doubling the output width spreads the same 1200 pixels over twice the distance, halving effective DPI.',
          'At 297 mm the result is about 102.63 DPI, so it cannot retain the same detail as a smaller print.',
        ],
        actions: [
          'Calculate DPI using the final trim size and the image’s actual placed width.',
          'If the value is below the job specification, use a larger source or reduce the output size; inspect quality separately if upsampling is proposed.',
        ],
      },
    },
  },
  {
    slug: 'cmyk-vs-rgb',
    relatedTools: ['pdf', 'color', 'proof'],
    samples: [
      {
        id: 'rgb-pdf',
        href: `${SAMPLE_BASE}/printready-a4-rgb-low-resolution.pdf`,
        downloadName: 'printready-a4-rgb-low-resolution.pdf',
        mimeType: 'application/pdf',
        description: {
          ko: 'RGB 이미지가 포함된 색상 모드 검출용 PDF',
          en: 'A PDF containing an RGB image for color-mode detection',
        },
      },
    ],
    inputs: { expectedColorMode: 'RGB', page: 1 },
    metrics: [
      {
        id: 'detected-color-mode',
        label: { ko: '검출 색상 모드', en: 'Detected color mode' },
        expected: 'RGB',
        observed: 'RGB',
        status: 'warning',
      },
      {
        id: 'icc-output-intent-review',
        label: { ko: 'ICC/출력 의도 검토', en: 'ICC/output intent review' },
        expected: 'manual-review',
        observed: 'manual-review',
        status: 'manual-review',
      },
    ],
    ...dates,
    sourceIds: ['adobePrintPdf'],
    limitations: [
      {
        ko: 'RGB 객체 검출만으로 올바른 ICC 프로파일, 출력 의도, 변환 조건 또는 실제 인쇄 색상을 확인할 수 없습니다.',
        en: 'Detecting an RGB object alone cannot verify the correct ICC profile, output intent, conversion conditions, or printed color.',
      },
    ],
    copy: {
      ko: {
        title: 'RGB 검출 결과가 말해 주는 것과 말해 주지 않는 것',
        description:
          '샘플 PDF에서 RGB 객체를 검출하고, 그 결과로 확인 가능한 범위와 별도 검토가 필요한 ICC·출력 의도 항목을 구분합니다.',
        eyebrow: '검증 사례 03',
        intro:
          '자동 검사는 PDF 내부 객체의 색상 공간을 찾는 데 유용하지만, 검출 결과 하나로 전체 색상 관리가 올바르다고 판단할 수는 없습니다.',
        problem:
          'RGB가 발견되었다는 사실을 즉시 오류로 보거나, 반대로 CMYK만 검출되면 색상 준비가 끝났다고 보는 해석은 모두 중요한 제작 조건을 놓칠 수 있습니다.',
        steps: [
          { heading: '샘플 열기', body: 'RGB 이미지가 포함된 재현용 PDF를 내려받습니다.' },
          {
            heading: '색상 모드 검사',
            body: '프리플라이트 결과에서 RGB 객체가 검출되는지 확인합니다.',
          },
          {
            heading: '수동 항목 분리',
            body: 'ICC 프로파일, 출력 의도, 변환 대상 인쇄 조건은 자동 검출과 분리해 검토합니다.',
          },
        ],
        explanation: [
          '이 샘플의 기대값과 관측값은 모두 RGB이며, 이는 RGB 객체가 실제로 포함되어 있음을 재현합니다.',
          '이 결과는 프로파일의 적합성이나 원하는 출력 색상, 인쇄소 규격 준수를 증명하지 않습니다.',
        ],
        actions: [
          '작업에 지정된 ICC 프로파일과 출력 의도를 문서 설정 및 PDF 출력 설정에서 확인하세요.',
          '색상 변환이 필요하면 대상 인쇄 조건과 인쇄소 지침을 확인하고 교정본으로 결과를 검토하세요.',
        ],
      },
      en: {
        title: 'What an RGB detection result does and does not prove',
        description:
          'Detect RGB content in a sample PDF, then separate what that observation establishes from ICC and output-intent checks that remain manual.',
        eyebrow: 'Verified case 03',
        intro:
          'Automated inspection can identify color spaces used by PDF objects, but one detection result cannot establish that the complete color-management workflow is correct.',
        problem:
          'Treating any RGB result as an automatic failure—or treating CMYK-only detection as complete preparation—can both overlook important production conditions.',
        steps: [
          {
            heading: 'Open the sample',
            body: 'Download the reproducible PDF that contains an RGB image.',
          },
          { heading: 'Inspect color mode', body: 'Confirm that preflight reports an RGB object.' },
          {
            heading: 'Separate manual checks',
            body: 'Review the ICC profile, output intent, and target printing condition independently of color-space detection.',
          },
        ],
        explanation: [
          'The expected and observed values are both RGB, reproducing the presence of RGB content in this sample.',
          'That result does not prove profile suitability, intended printed color, or compliance with a print provider’s specification.',
        ],
        actions: [
          'Check the job’s required ICC profile and output intent in the document and PDF export settings.',
          'If conversion is required, confirm the target printing condition and provider guidance, then evaluate a proof.',
        ],
      },
    },
  },
  {
    slug: 'bleed-and-trim',
    relatedTools: ['pdf', 'bleed', 'marks'],
    samples: [
      {
        id: 'a4-no-bleed',
        href: `${SAMPLE_BASE}/printready-a4-no-bleed.pdf`,
        downloadName: 'printready-a4-no-bleed.pdf',
        mimeType: 'application/pdf',
        description: {
          ko: 'TrimBox와 BleedBox가 없는 비교용 A4 PDF',
          en: 'Comparison A4 PDF without TrimBox or BleedBox',
        },
      },
      {
        id: 'a4-3mm-bleed',
        href: `${SAMPLE_BASE}/printready-a4-3mm-bleed.pdf`,
        downloadName: 'printready-a4-3mm-bleed.pdf',
        mimeType: 'application/pdf',
        description: {
          ko: '210 × 297 mm TrimBox와 사방 3 mm BleedBox가 있는 PDF',
          en: 'PDF with a 210 × 297 mm TrimBox and 3 mm BleedBox on every edge',
        },
      },
    ],
    inputs: { trimWidthMm: 210, trimHeightMm: 297, bleedMm: 3 },
    metrics: [
      {
        id: 'no-bleed-trim-box',
        label: { ko: '무도련 샘플 TrimBox', en: 'No-bleed sample TrimBox' },
        expected: false,
        observed: false,
        status: 'warning',
      },
      {
        id: 'no-bleed-bleed-box',
        label: { ko: '무도련 샘플 BleedBox', en: 'No-bleed sample BleedBox' },
        expected: false,
        observed: false,
        status: 'warning',
      },
      {
        id: 'three-mm-trim-box',
        label: { ko: '3 mm 도련 샘플 TrimBox', en: '3 mm sample TrimBox' },
        expected: true,
        observed: true,
        status: 'pass',
      },
      {
        id: 'three-mm-bleed-box',
        label: { ko: '3 mm 도련 샘플 BleedBox', en: '3 mm sample BleedBox' },
        expected: true,
        observed: true,
        status: 'pass',
      },
      {
        id: 'artwork-extension-review',
        label: { ko: '아트워크 도련 연장 검토', en: 'Artwork extension review' },
        expected: 'manual-review',
        observed: 'manual-review',
        status: 'manual-review',
      },
    ],
    ...dates,
    sourceIds: ['adobeBleed'],
    limitations: [
      {
        ko: 'BleedBox 존재 여부는 배경과 이미지가 재단선 밖까지 실제로 연장되었는지 증명하지 않습니다.',
        en: 'The presence of a BleedBox does not prove that backgrounds and images actually extend beyond the trim line.',
      },
    ],
    copy: {
      ko: {
        title: 'PDF의 TrimBox와 BleedBox를 실제 파일로 비교하기',
        description:
          '페이지 박스가 없는 A4 PDF와 3 mm 도련 박스가 있는 PDF를 나란히 검사해 검출 차이와 한계를 확인합니다.',
        eyebrow: '검증 사례 04',
        intro:
          'TrimBox는 최종 재단 경계를, BleedBox는 도련 영역의 경계를 표현할 수 있습니다. 두 샘플을 사용하면 박스의 유무를 같은 검사기로 재현할 수 있습니다.',
        problem:
          '페이지 크기가 커 보인다는 이유만으로 재단선과 도련이 올바르게 설정되었다고 판단하거나, BleedBox가 있다는 이유만으로 아트워크가 충분히 연장되었다고 판단할 수 없습니다.',
        steps: [
          {
            heading: '무도련 파일 검사',
            body: '첫 번째 PDF에서 TrimBox와 BleedBox가 모두 검출되지 않는지 확인합니다.',
          },
          {
            heading: '3 mm 파일 검사',
            body: '두 번째 PDF에서 TrimBox와 BleedBox가 모두 검출되는지 확인합니다.',
          },
          {
            heading: '아트워크 육안 확인',
            body: '재단선에 닿는 배경과 이미지가 도련 끝까지 실제로 이어지는지는 페이지를 직접 확인합니다.',
          },
        ],
        explanation: [
          '무도련 샘플은 false/false, 3 mm 샘플은 true/true로 검출되어 페이지 박스 구조의 차이를 보여 줍니다.',
          '박스는 경계 정보이며 그 안의 아트워크 내용이나 인쇄소가 요구하는 도련 폭 충족 여부를 자동으로 보증하지 않습니다.',
        ],
        actions: [
          'TrimBox와 BleedBox의 크기 차이를 확인하고 주문 사양의 도련 폭과 비교하세요.',
          '재단선에 닿는 모든 요소를 확대해 도련 영역 끝까지 연장되었는지 수동으로 확인하세요.',
        ],
      },
      en: {
        title: 'Comparing PDF TrimBox and BleedBox with real files',
        description:
          'Inspect an A4 PDF without page boxes beside one with a 3 mm bleed box to reproduce the detection difference and understand its limits.',
        eyebrow: 'Verified case 04',
        intro:
          'A TrimBox can express the final trim boundary, while a BleedBox can express the bleed boundary. These two samples reproduce the presence and absence of those boxes with the same inspector.',
        problem:
          'A larger-looking page does not establish correct trim and bleed settings, and the presence of a BleedBox does not establish that artwork extends far enough.',
        steps: [
          {
            heading: 'Inspect the no-bleed file',
            body: 'Confirm that neither a TrimBox nor a BleedBox is detected in the first PDF.',
          },
          {
            heading: 'Inspect the 3 mm file',
            body: 'Confirm that both a TrimBox and a BleedBox are detected in the second PDF.',
          },
          {
            heading: 'Review artwork visually',
            body: 'Inspect the page itself to confirm that backgrounds and images touching trim continue to the bleed edge.',
          },
        ],
        explanation: [
          'The no-bleed sample reports false/false and the 3 mm sample reports true/true, demonstrating a structural page-box difference.',
          'Boxes describe boundaries; they do not automatically verify artwork content or compliance with a provider’s required bleed width.',
        ],
        actions: [
          'Measure the difference between TrimBox and BleedBox and compare it with the order specification.',
          'Zoom in and manually confirm that every element touching trim extends to the outer edge of the bleed area.',
        ],
      },
    },
  },
  {
    slug: 'saddle-stitch-booklet',
    relatedTools: ['booklet', 'impose', 'spine'],
    samples: [
      {
        id: 'booklet-scenarios',
        href: `${SAMPLE_BASE}/booklet-scenarios.json`,
        downloadName: 'booklet-scenarios.json',
        mimeType: 'application/json',
        description: {
          ko: '6, 8, 12페이지 중철 계산 결과를 담은 재현용 데이터',
          en: 'Reproducible data for 6, 8, and 12-page saddle-stitch calculations',
        },
      },
    ],
    inputs: { pageCounts: '6, 8, 12', pagesPerSheet: 4 },
    metrics: [
      {
        id: 'six-pages-padded',
        label: { ko: '6페이지 보정 페이지 수', en: 'Padded pages for 6 pages' },
        expected: 8,
        observed: booklet6.paddedPages,
        unit: 'pages',
        status: 'pass',
      },
      {
        id: 'six-pages-blanks',
        label: { ko: '6페이지 빈 페이지 수', en: 'Blank pages for 6 pages' },
        expected: 2,
        observed: booklet6.blanks,
        unit: 'pages',
        status: 'pass',
      },
      {
        id: 'six-pages-sheets',
        label: { ko: '6페이지 용지 수', en: 'Sheets for 6 pages' },
        expected: 2,
        observed: booklet6.sheets,
        unit: 'sheets',
        status: 'pass',
      },
      {
        id: 'eight-pages-sheets',
        label: { ko: '8페이지 용지 수', en: 'Sheets for 8 pages' },
        expected: 2,
        observed: booklet8.sheets,
        unit: 'sheets',
        status: 'pass',
      },
      {
        id: 'twelve-pages-sheets',
        label: { ko: '12페이지 용지 수', en: 'Sheets for 12 pages' },
        expected: 3,
        observed: booklet12.sheets,
        unit: 'sheets',
        status: 'pass',
      },
    ],
    ...dates,
    sourceIds: ['adobeBooklet'],
    limitations: [
      {
        ko: '이 계산은 1장당 4페이지인 기본 중철 구조를 검증합니다. 실제 면배치 방향, 제본 여백, 크리프 보정 및 인쇄기 사양은 별도 제작 검토가 필요합니다.',
        en: 'This calculation verifies a basic four-pages-per-sheet saddle-stitch structure. Actual imposition orientation, binding margins, creep, and press requirements need separate production review.',
      },
    ],
    copy: {
      ko: {
        title: '6·8·12페이지 중철 배치를 직접 검산하기',
        description:
          '중철 한 장이 4페이지를 담는 원리로 6페이지의 빈 페이지 보정과 8·12페이지의 용지 수를 계산하고 공개 JSON과 비교합니다.',
        eyebrow: '검증 사례 05',
        intro:
          '중철 책자는 접은 한 장이 네 개의 독자 페이지를 만들기 때문에 전체 페이지 수가 4의 배수여야 합니다. 세 가지 입력으로 보정 페이지와 용지 수를 확인합니다.',
        problem:
          '페이지 수만 보고 제작 용지 수를 정하면 4의 배수가 아닌 원고에서 빈 페이지를 빠뜨리거나, 독자 페이지 순서와 실제 면배치를 혼동할 수 있습니다.',
        steps: [
          {
            heading: '6페이지 계산',
            body: '6페이지를 입력해 8페이지로 보정되고 빈 페이지 2개와 용지 2장이 계산되는지 확인합니다.',
          },
          {
            heading: '8페이지 계산',
            body: '8페이지는 빈 페이지 없이 용지 2장으로 계산되는지 확인합니다.',
          },
          {
            heading: '12페이지 계산',
            body: '12페이지는 빈 페이지 없이 용지 3장으로 계산되는지 확인하고 JSON 결과와 비교합니다.',
          },
        ],
        explanation: [
          '6페이지는 다음 4의 배수인 8페이지까지 두 칸을 비워야 하며, 8페이지와 12페이지는 추가 빈 페이지가 필요 없습니다.',
          '용지 수는 각각 2, 2, 3장이지만 실제 인쇄 면배치와 크리프 보정은 제작 조건에 따라 추가 검토가 필요합니다.',
        ],
        actions: [
          '표지 포함 여부를 먼저 정한 뒤 최종 독자 페이지 수를 계산기에 입력하세요.',
          '자동으로 추가된 빈 페이지의 위치와 실제 면배치, 제본 여백은 출력 전 인쇄소와 확인하세요.',
        ],
      },
      en: {
        title: 'Verifying 6, 8, and 12-page saddle-stitch layouts',
        description:
          'Use the four-pages-per-sheet rule to calculate padding for 6 pages and sheet counts for 8 and 12 pages, then compare the result with the published JSON.',
        eyebrow: 'Verified case 05',
        intro:
          'A folded saddle-stitch sheet creates four reader pages, so the total page count must be a multiple of four. Three inputs make the required padding and sheet counts visible.',
        problem:
          'Estimating sheets from page count alone can omit blanks when a manuscript is not divisible by four, or confuse reader order with physical imposition.',
        steps: [
          {
            heading: 'Calculate 6 pages',
            body: 'Enter 6 pages and confirm padding to 8 pages, with 2 blanks and 2 sheets.',
          },
          {
            heading: 'Calculate 8 pages',
            body: 'Confirm that 8 pages uses 2 sheets without added blanks.',
          },
          {
            heading: 'Calculate 12 pages',
            body: 'Confirm that 12 pages uses 3 sheets without added blanks, then compare the result with the JSON.',
          },
        ],
        explanation: [
          'Six pages requires two blank positions to reach the next multiple of four; 8 and 12 pages need no added blanks.',
          'The sheet counts are 2, 2, and 3, while physical imposition and creep still depend on production conditions.',
        ],
        actions: [
          'Decide whether the cover is included before entering the final reader-page count.',
          'Confirm the position of added blanks, physical imposition, and binding margins with the print provider before output.',
        ],
      },
    },
  },
];

export const caseStudySlugs = caseStudies.map((study) => study.slug);
