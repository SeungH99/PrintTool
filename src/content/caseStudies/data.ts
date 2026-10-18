import type { CaseStudyMetric, CaseStudyRecord, CaseStudySample } from './types';
import { calculateBooklet, calculateResolution } from '@/lib/calculations';
import { bleedFigures, bookletFigures, colorFigures, resolutionFigures } from './evidence';

const SAMPLE_BASE = '/samples';

const dates = {
  testedAt: '2026-10-18',
  publishedAt: '2026-08-09',
  updatedAt: '2026-10-18',
  toolVersion: '0.1.0',
} as const;

const correctedSample: CaseStudySample = {
  id: 'corrected-100mm-pdf',
  href: `${SAMPLE_BASE}/printready-rgb-100mm-corrected.pdf`,
  downloadName: 'printready-rgb-100mm-corrected.pdf',
  mimeType: 'application/pdf',
  description: {
    ko: '수정 예제: 동일한 1200 × 800 px을 100 × 66.67 mm로 배치한 304.8 DPI RGB PDF. A4가 꼭 필요하다면 이 축소안 대신 더 큰 원본이 필요합니다.',
    en: 'Correction example: the same 1200 × 800 px at 100 × 66.67 mm, giving 304.8 DPI in an RGB PDF. If A4 is required, use a larger source instead of this smaller-size alternative.',
  },
};

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
    figures: resolutionFigures,
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
      correctedSample,
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
      {
        id: 'corrected-image-dpi',
        label: { ko: '수정 PDF 이미지 DPI', en: 'Corrected PDF image DPI' },
        expected: 304.8,
        observed: resolutionDpi(100),
        unit: 'DPI',
        tolerance: 0.05,
        status: 'pass',
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
          '직접 만든 테스트 카드의 작은 글자·1픽셀 선·색상 패치를 사용해 원본 → A4 변환 → 검사 → 출력 크기 축소 → 재검사를 따라갑니다. 모두 다운로드 가능한 디지털 예제이며 실물 인쇄 시험은 하지 않았습니다.',
        problem:
          '화면에서 정상으로 보이는 이미지라도 A4 폭으로 확대하면 유효 DPI가 낮아질 수 있고, 변환만으로 RGB가 CMYK가 되거나 도련 박스가 생기지는 않습니다.',
        steps: [
          {
            heading: '원본 확인',
            body: 'PNG를 내려받아 1200 × 800 px인지 확인합니다. 100% 확대에서 왼쪽 1픽셀 선과 가운데 작은 글자를 찾아 두면 확대 배치 후 확인할 위치가 생깁니다.',
          },
          {
            heading: 'PDF 결과 비교',
            body: '이미지→PDF 도구에서 A4 가로로 변환해 다운로드합니다. 제공한 A4 PDF도 별도로 검사하세요. 이미지 폭은 297 mm, 높이는 198 mm이고 가운데 배치되어 위아래 각각 6 mm가 흰 여백이므로 꽉 찬 A4 디자인과 다릅니다.',
          },
          {
            heading: '프리플라이트 실행',
            body: '다운로드한 바로 그 PDF를 프리플라이트에 넣습니다. 297 × 210 mm, RGB, 약 102.6 DPI, TrimBox·BleedBox 없음이 나오는지 확인하고 파일명과 결과를 함께 기록합니다.',
          },
          {
            heading: '실제 수정 파일 재검사',
            body: '100 mm 수정 PDF를 내려받아 다시 검사합니다. 페이지는 100 × 66.67 mm, 이미지는 약 304.8 DPI가 되어야 합니다. RGB와 페이지 박스 부재는 그대로이며 모든 경고를 해결한 파일이 아닙니다.',
          },
          {
            heading: '사양에 맞는 해결안 선택',
            body: '작은 출력이 허용될 때만 100 mm 축소안을 사용합니다. 297 mm 폭에 300 DPI가 꼭 필요하면 최소 3508 px 너비의 원본을 새로 확보하고, 도련·색상·폰트는 각각 확인합니다.',
          },
        ],
        explanation: [
          '1200 px 이미지를 297 mm 폭에 배치하면 유효 해상도는 약 102.63 DPI입니다.',
          'RGB 검출과 박스 부재는 자동 변환이나 인쇄 부적합을 단정하는 판정이 아니라 후속 확인이 필요한 관측값입니다.',
          '수정은 PNG의 해상도 태그를 바꾼 것이 아니라 PDF의 실제 배치 크기를 줄인 것입니다. 1200 ÷ (100 ÷ 25.4) = 304.8 DPI이며 원본 디테일이 새로 생기지는 않습니다.',
        ],
        actions: [
          '최종 출력 크기에서 필요한 DPI를 먼저 정하고 그에 맞는 픽셀 수의 이미지를 준비하세요.',
          '색상 프로파일, 도련, 폰트 및 인쇄소별 PDF 규격은 주문 전에 별도로 확인하세요.',
          '납품 전 파일명, 완성 크기, 실제 배치 폭, 검사 DPI와 남은 수동 확인 항목을 한 장의 작업 메모로 전달하세요. 이 수정 샘플은 RGB·무도련이 허용되는 주문에만 검토할 수 있습니다.',
        ],
      },
      en: {
        title: 'From image to PDF preflight: a reproducible workflow',
        description:
          'Download the same source image and PDF to reproduce checks for page size, detected color mode, effective DPI, and page boxes.',
        eyebrow: 'Verified case 01',
        intro:
          'Follow source → A4 conversion → inspection → smaller placement → reinspection using our original card with small lettering, one-pixel rules and color patches. These are downloadable digital examples, not physical print tests.',
        problem:
          'An image that looks fine on screen can have low effective DPI when enlarged to A4 width, and conversion alone does not turn RGB into CMYK or add bleed boxes.',
        steps: [
          {
            heading: 'Inspect the source',
            body: 'Download the PNG and confirm 1200 × 800 px. At 100% zoom locate the left one-pixel rules and the center small lettering: these give you specific detail to inspect after placement.',
          },
          {
            heading: 'Compare the PDF',
            body: 'Use Image→PDF with landscape A4 and download the output. Inspect our supplied A4 PDF separately too: the image is 297 × 198 mm, centered with 6 mm white margins above and below rather than filling A4.',
          },
          {
            heading: 'Run preflight',
            body: 'Upload the actual downloaded PDF to preflight. Check 297 × 210 mm, RGB, about 102.6 DPI, and no explicit TrimBox or BleedBox. Keep the filename with the results.',
          },
          {
            heading: 'Inspect the actual correction',
            body: 'Download and inspect the 100 mm correction PDF. Expect a 100 × 66.67 mm page and about 304.8 DPI. RGB and missing page boxes remain: this is not a file with every warning cleared.',
          },
          {
            heading: 'Choose a correction that fits the order',
            body: 'Use the 100 mm alternative only when smaller output is acceptable. For 300 DPI at 297 mm, obtain an original at least 3508 px wide; check bleed, color and fonts separately.',
          },
        ],
        explanation: [
          'A 1200 px image placed across 297 mm has an effective resolution of about 102.63 DPI.',
          'RGB detection and missing boxes are observations that call for follow-up, not automatic proof that a file is or is not printable.',
          'The correction changes the actual PDF placement, not the PNG resolution tag: 1200 ÷ (100 ÷ 25.4) = 304.8 DPI. It creates no new source detail.',
        ],
        actions: [
          'Choose the required DPI at final output size, then prepare an image with enough pixels.',
          'Confirm color profiles, bleed, fonts, and provider-specific PDF requirements before ordering.',
          'Hand off the filename, finished size, placed width, measured DPI and remaining manual checks together. Consider this corrected sample only for orders that allow RGB and no bleed.',
        ],
      },
    },
  },
  {
    slug: 'resolution-and-dpi',
    figures: resolutionFigures,
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
      {
        id: 'resolution-before-pdf',
        href: `${SAMPLE_BASE}/printready-a4-rgb-low-resolution.pdf`,
        downloadName: 'printready-a4-rgb-low-resolution.pdf',
        mimeType: 'application/pdf',
        description: {
          ko: '수정 전: 같은 이미지의 배치 폭이 297 mm인 102.63 DPI PDF',
          en: 'Before: the same image placed 297 mm wide, giving 102.63 DPI',
        },
      },
      correctedSample,
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
          {
            heading: '픽셀 수 고정',
            body: 'PNG의 실제 너비가 1200 px인지 확인합니다. 파일 속성의 DPI 숫자를 바꿔도 픽셀 수와 PDF 배치 폭이 같으면 유효 DPI는 바뀌지 않습니다.',
          },
          {
            heading: '출력 폭 변경',
            body: '해상도 도구에 1200 × 800 px과 304.8 DPI를 넣으면 10 × 6.67 cm입니다. DPI를 152.4, 102.63으로 바꾸어 폭이 약 20 cm, 29.7 cm가 되는지 확인합니다.',
          },
          {
            heading: '유효 DPI 비교',
            body: '두 PDF를 각각 프리플라이트에 넣어 297 mm 파일의 약 102.6 DPI와 100 mm 파일의 약 304.8 DPI를 비교합니다. 두 파일에 들어 있는 이미지 픽셀 수는 같습니다.',
          },
          {
            heading: '디테일과 크기 함께 판단',
            body: 'PDF 뷰어에서 실제 크기를 확인한 뒤 작은 글자와 1픽셀 선을 확대합니다. 같은 화면 폭으로 맞춘 미리보기는 출력 크기 차이를 숨기며, 모니터만으로 인쇄 선명도를 확정할 수 없습니다.',
          },
        ],
        explanation: [
          '출력 폭이 두 배가 되면 같은 1200 px을 두 배 넓게 나누어 쓰므로 유효 DPI는 절반이 됩니다.',
          '297 mm에서는 약 102.63 DPI이므로 작은 출력물과 같은 세부 표현을 기대하기 어렵습니다.',
          '300 DPI를 가정한 최대 폭은 1200 ÷ 300 × 25.4 = 101.6 mm입니다. 100 mm 축소안은 이 조건을 만족하지만 A4 주문의 대체품은 아닙니다.',
        ],
        actions: [
          '최종 재단 크기와 실제 이미지 배치 폭을 기준으로 DPI를 계산하세요.',
          '계산값이 작업 사양보다 낮다면 더 큰 원본을 사용하거나 출력 크기를 줄이고, 임의 업샘플링은 별도로 품질을 확인하세요.',
          '주문 메모에 이미지의 실제 배치 폭과 목표 DPI를 함께 적으세요. PDF의 페이지 크기와 이미지가 차지하는 폭을 혼동하지 마세요.',
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
            body: 'Confirm that the PNG really is 1200 px wide. Changing a resolution tag cannot change effective DPI while pixel count and PDF placement stay the same.',
          },
          {
            heading: 'Change output width',
            body: 'In the resolution tool, enter 1200 × 800 px at 304.8 DPI: the result is 10 × 6.67 cm. Change DPI to 152.4 and 102.63 and check widths of about 20 cm and 29.7 cm.',
          },
          {
            heading: 'Compare effective DPI',
            body: 'Preflight both PDFs. Compare about 102.6 DPI in the 297 mm file with about 304.8 DPI in the 100 mm file; the embedded image pixel counts are identical.',
          },
          {
            heading: 'Judge detail together with size',
            body: 'Check actual PDF dimensions, then zoom into the small lettering and one-pixel rules. Fitting both previews to the same screen width hides their physical-size difference; a monitor cannot establish printed sharpness.',
          },
        ],
        explanation: [
          'Doubling the output width spreads the same 1200 pixels over twice the distance, halving effective DPI.',
          'At 297 mm the result is about 102.63 DPI, so it cannot retain the same detail as a smaller print.',
          'Assuming a 300 DPI target, maximum width is 1200 ÷ 300 × 25.4 = 101.6 mm. The 100 mm alternative meets that target but cannot replace an A4-sized order.',
        ],
        actions: [
          'Calculate DPI using the final trim size and the image’s actual placed width.',
          'If the value is below the job specification, use a larger source or reduce the output size; inspect quality separately if upsampling is proposed.',
          'Include both the placed image width and target DPI in the handoff. Do not confuse PDF page dimensions with the width occupied by the image.',
        ],
      },
    },
  },
  {
    slug: 'cmyk-vs-rgb',
    figures: colorFigures,
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
          {
            heading: '샘플과 검사 위치 확인',
            body: 'PDF를 내려받아 청록·주황 패치와 풍경 그라데이션을 찾습니다. 이것은 직접 만든 RGB 교육 예제이며 인쇄물 사진이나 색상 교정본이 아닙니다.',
          },
          {
            heading: '색상 모드 검사',
            body: '프리플라이트에 그 PDF를 넣고 RGB 검출을 확인합니다. 이미지 객체가 RGB임을 뜻하며, 화면에서 패치가 선명해 보인다는 사실과는 다른 관측입니다. 약 102.6 DPI와 페이지 박스 부재도 별개 문제로 남습니다.',
          },
          {
            heading: '수동 항목 분리',
            body: '업체에 RGB 접수 여부, 변환 담당자, 요구 ICC 프로파일과 PDF 규격을 묻습니다. RGB를 받는 워크플로라면 검출만을 이유로 임의 CMYK 변환하지 마세요. CMYK가 필요하면 업체가 지정한 출력 조건으로 문서 작성 프로그램에서 변환합니다.',
          },
          {
            heading: '변환·교정 뒤 다시 확인',
            body: '내보낸 최종 PDF를 새 파일명으로 저장해 재검사하고, 지정 프로파일로 만든 소프트프루프 또는 업체 교정본에서 같은 패치와 그라데이션을 비교합니다. 이 페이지는 가상의 CMYK 전후 색상을 만들어 보여주지 않습니다.',
          },
        ],
        explanation: [
          '이 샘플의 기대값과 관측값은 모두 RGB이며, 이는 RGB 객체가 실제로 포함되어 있음을 재현합니다.',
          '이 결과는 프로파일의 적합성이나 원하는 출력 색상, 인쇄소 규격 준수를 증명하지 않습니다.',
          '이 검사기의 색상 모드는 PDF 이미지 객체를 바탕으로 합니다. 벡터·별색·오버프린트·모든 페이지의 실제 출력 외관을 완전하게 검수하지 않으며, RGB 검출이 없어졌다고 전체 색상 문제가 해결된 것은 아닙니다.',
        ],
        actions: [
          '작업에 지정된 ICC 프로파일과 출력 의도를 문서 설정 및 PDF 출력 설정에서 확인하세요.',
          '색상 변환이 필요하면 대상 인쇄 조건과 인쇄소 지침을 확인하고 교정본으로 결과를 검토하세요.',
          '납품 메모에 원본 색상 공간, 변환 담당자, 사용한 프로파일 이름·버전과 교정 승인 범위를 남기세요. 숫자 또는 화면 미리보기만으로 실물 색상 일치를 약속하지 마세요.',
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
            body: 'Download the PDF and locate the teal/orange patches and landscape gradient. This is our original RGB teaching example, not a photograph of print or a color proof.',
          },
          {
            heading: 'Inspect color mode',
            body: 'Upload that PDF and confirm RGB detection. This describes the image object’s color space, not how vivid the patches appear on your monitor. About 102.6 DPI and missing page boxes are separate issues.',
          },
          {
            heading: 'Separate manual checks',
            body: 'Ask the provider whether RGB is accepted, who performs conversion, and which ICC profile and PDF specification are required. Do not convert arbitrarily if RGB is accepted. If CMYK is required, convert in the authoring application using the specified output condition.',
          },
          {
            heading: 'Recheck after conversion and proofing',
            body: 'Save the final export under a new filename and preflight it again. Compare the same patches and gradients in a correctly configured soft proof or provider proof. We do not fabricate a CMYK before/after appearance on this page.',
          },
        ],
        explanation: [
          'The expected and observed values are both RGB, reproducing the presence of RGB content in this sample.',
          'That result does not prove profile suitability, intended printed color, or compliance with a print provider’s specification.',
          'This inspector derives color mode from PDF image objects. It is not a complete inspection of vectors, spots, overprint or rendered appearance across every page. Removing an RGB result does not establish that every color issue is fixed.',
        ],
        actions: [
          'Check the job’s required ICC profile and output intent in the document and PDF export settings.',
          'If conversion is required, confirm the target printing condition and provider guidance, then evaluate a proof.',
          'Record the source color space, conversion owner, profile name/version and proof-approval scope with the handoff. Numbers or a screen preview cannot promise a physical color match.',
        ],
      },
    },
  },
  {
    slug: 'bleed-and-trim',
    figures: bleedFigures,
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
          '배경이 종이 끝에 닿는 포스터를 가정해, 재단 크기에서 끝나는 파일과 배경을 사방 3 mm 더 그린 파일을 비교합니다. 직접 생성한 디지털 예제이며 재단기 시험 결과가 아닙니다.',
        problem:
          '페이지 크기가 커 보인다는 이유만으로 재단선과 도련이 올바르게 설정되었다고 판단하거나, BleedBox가 있다는 이유만으로 아트워크가 충분히 연장되었다고 판단할 수 없습니다.',
        steps: [
          {
            heading: '무도련 파일 검사',
            body: '무도련 PDF를 검사해 페이지 210 × 297 mm와 명시적인 TrimBox·BleedBox 없음(false/false)을 확인합니다. 배경이 페이지 끝에서 끝나므로 재단 경계 밖에 여분의 아트워크가 없습니다.',
          },
          {
            heading: '3 mm 파일 검사',
            body: '3 mm PDF를 검사하면 페이지가 216 × 303 mm이고 두 박스가 존재합니다(true/true). TrimBox는 왼쪽·아래에서 각각 3 mm 떨어진 210 × 297 mm이고 BleedBox는 페이지 전체입니다.',
          },
          {
            heading: '아트워크 육안 확인',
            body: '시각적 비교의 점선은 화면에만 겹친 재단 경계입니다. 네 변과 네 모서리를 확대해 진한 배경·주황 영역이 점선 밖 페이지 끝까지 이어지는지 확인하세요. 다운로드 PDF에는 이 점선이 인쇄되지 않습니다.',
          },
          {
            heading: '원본에서 수정하고 다시 내보내기',
            body: '도련이 없다면 문서 크기·도련을 설정하고 재단선에 닿는 배경을 직접 연장한 뒤 다시 PDF로 내보냅니다. 이 사이트의 도련 계산은 치수 안내이며, 박스나 재단선 표시만 추가해 실제 디자인을 자동 연장하지 않습니다.',
          },
        ],
        explanation: [
          '무도련 샘플은 false/false, 3 mm 샘플은 true/true로 검출되어 페이지 박스 구조의 차이를 보여 줍니다.',
          '박스는 경계 정보이며 그 안의 아트워크 내용이나 인쇄소가 요구하는 도련 폭 충족 여부를 자동으로 보증하지 않습니다.',
          '크기 검산은 (216 − 210) ÷ 2 = 3 mm, (303 − 297) ÷ 2 = 3 mm입니다. 대칭 배치라는 조건에서의 값이며 박스 위치가 한쪽으로 치우치면 폭 차이만으로 사방 도련을 판단하면 안 됩니다.',
        ],
        actions: [
          'TrimBox와 BleedBox의 크기 차이를 확인하고 주문 사양의 도련 폭과 비교하세요.',
          '재단선에 닿는 모든 요소를 확대해 도련 영역 끝까지 연장되었는지 수동으로 확인하세요.',
          '업체가 요구한 도련 폭, 재단 규격, 중요 요소의 안전 여백, 재단선 포함 여부를 납품 메모에 적으세요. 이 예제의 3 mm가 모든 주문의 공통 규격은 아닙니다.',
        ],
      },
      en: {
        title: 'Comparing PDF TrimBox and BleedBox with real files',
        description:
          'Inspect an A4 PDF without page boxes beside one with a 3 mm bleed box to reproduce the detection difference and understand its limits.',
        eyebrow: 'Verified case 04',
        intro:
          'For a poster with edge-to-edge backgrounds, compare artwork stopping at trim with a version actually drawn 3 mm farther on every side. These are generated digital examples, not cutting-machine test results.',
        problem:
          'A larger-looking page does not establish correct trim and bleed settings, and the presence of a BleedBox does not establish that artwork extends far enough.',
        steps: [
          {
            heading: 'Inspect the no-bleed file',
            body: 'Inspect the no-bleed PDF: expect a 210 × 297 mm page and no explicit TrimBox or BleedBox (false/false). The background stops at the page edge with no spare artwork beyond trim.',
          },
          {
            heading: 'Inspect the 3 mm file',
            body: 'Inspect the 3 mm PDF: the page is 216 × 303 mm and both boxes are present (true/true). TrimBox is 210 × 297 mm, inset 3 mm from the left/bottom; BleedBox covers the full page.',
          },
          {
            heading: 'Review artwork visually',
            body: 'The dashed trim guide in the visual comparison is a screen-only overlay. Zoom into all four sides and corners: the dark background and orange area continue past the guide to the page edge. The downloadable PDF does not print this dashed guide.',
          },
          {
            heading: 'Correct the source and export again',
            body: 'If bleed is absent, configure the document and extend backgrounds that touch trim before exporting again. This site’s bleed calculator supplies dimensions; adding boxes or marks alone does not automatically extend actual design content.',
          },
        ],
        explanation: [
          'The no-bleed sample reports false/false and the 3 mm sample reports true/true, demonstrating a structural page-box difference.',
          'Boxes describe boundaries; they do not automatically verify artwork content or compliance with a provider’s required bleed width.',
          'Hand check: (216 − 210) ÷ 2 = 3 mm and (303 − 297) ÷ 2 = 3 mm. This assumes centered boxes; width differences alone cannot prove equal bleed if the trim box is offset.',
        ],
        actions: [
          'Measure the difference between TrimBox and BleedBox and compare it with the order specification.',
          'Zoom in and manually confirm that every element touching trim extends to the outer edge of the bleed area.',
          'Record the provider’s required bleed, trim size, safety margin for important content and crop-mark preference. The 3 mm teaching example is not a universal order specification.',
        ],
      },
    },
  },
  {
    slug: 'saddle-stitch-booklet',
    figures: bookletFigures,
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
            body: '먼저 표지와 의도적 빈 면까지 포함해 독자 페이지를 셉니다. 총 6페이지라면 4 × ceil(6 ÷ 4) = 8페이지, 빈 면 8 − 6 = 2개, 용지 8 ÷ 4 = 2장입니다. 계산기에 6을 입력하고 JSON 첫 행과 비교하세요.',
          },
          {
            heading: '8페이지 계산',
            body: '원고를 8페이지로 완성하면 빈 면 0개, 용지 2장입니다. 도식의 7·8번에 빈 면을 둘지 추가 콘텐츠를 둘지 편집 단계에서 정합니다. 뒷표지가 반드시 8번이어야 한다면 빈 면 위치를 달리 계획하세요.',
          },
          {
            heading: '12페이지 계산',
            body: '12를 입력해 빈 면 0개, 용지 3장을 확인합니다. 페이지를 8에서 12로 늘리면 접는 용지 한 장이 추가됩니다. PDF 페이지 수에 자동 추가 빈 면이 반영되었는지 최종 파일을 직접 확인하세요.',
          },
          {
            heading: '독자 순서와 인쇄 면배치 분리',
            body: '도식은 독자 순서입니다. 예를 들어 기본 8페이지 중철의 바깥 장 앞면은 8|1, 뒷면은 2|7처럼 마주 보지만 뒤집기 방향·인쇄기 조건은 다를 수 있습니다. 업체가 독자 순서 PDF를 받는다면 직접 면배치하지 말고 1~8 순서로 전달하세요.',
          },
        ],
        explanation: [
          '6페이지는 다음 4의 배수인 8페이지까지 두 칸을 비워야 하며, 8페이지와 12페이지는 추가 빈 페이지가 필요 없습니다.',
          '용지 수는 각각 2, 2, 3장이지만 실제 인쇄 면배치와 크리프 보정은 제작 조건에 따라 추가 검토가 필요합니다.',
          '여기서 용지 2장은 책자 한 부를 구성하는 접지 2장입니다. 큰 인쇄용 전지 매수, 손실분 또는 주문 부수 전체의 구매 수량을 계산한 값은 아닙니다.',
        ],
        actions: [
          '표지 포함 여부를 먼저 정한 뒤 최종 독자 페이지 수를 계산기에 입력하세요.',
          '자동으로 추가된 빈 페이지의 위치와 실제 면배치, 제본 여백은 출력 전 인쇄소와 확인하세요.',
          '최종 페이지 수·표지 포함 여부·빈 면 위치·완성 크기·독자 순서/면배치 방식·주문 부수를 인계하세요. 계산 결과만으로 파일 페이지를 자동 삽입하거나 제본 방향을 확정하지 않습니다.',
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
            body: 'Count reader pages including the cover and intentional blanks. For 6 total: 4 × ceil(6 ÷ 4) = 8 positions, 8 − 6 = 2 blanks, and 8 ÷ 4 = 2 sheets. Enter 6 and compare the first JSON row.',
          },
          {
            heading: 'Calculate 8 pages',
            body: 'Completing an 8-page manuscript uses 2 sheets and no added blanks. Decide editorially whether diagram positions 7–8 stay blank or carry more content. If the back cover must be page 8, plan different blank positions.',
          },
          {
            heading: 'Calculate 12 pages',
            body: 'Enter 12: expect 3 sheets and no added blanks. Moving from 8 to 12 pages adds one folded sheet. Inspect the final PDF itself to ensure all intended blank pages are actually present.',
          },
          {
            heading: 'Separate reader order from press imposition',
            body: 'The diagram is in reader order. For a basic eight-page booklet the outer sheet pairs 8|1 on the front and 2|7 on the back, but duplex orientation and press conditions vary. If the provider requests reader-order PDFs, deliver 1–8 rather than imposing them yourself.',
          },
        ],
        explanation: [
          'Six pages requires two blank positions to reach the next multiple of four; 8 and 12 pages need no added blanks.',
          'The sheet counts are 2, 2, and 3, while physical imposition and creep still depend on production conditions.',
          'Two sheets means two folded sheets within one finished booklet, not purchased parent sheets, production waste or the total stock for an entire order.',
        ],
        actions: [
          'Decide whether the cover is included before entering the final reader-page count.',
          'Confirm the position of added blanks, physical imposition, and binding margins with the print provider before output.',
          'Hand off final page count, cover inclusion, blank positions, finished size, reader-order/imposed delivery and order quantity. The calculation does not insert pages into your file or determine binding orientation.',
        ],
      },
    },
  },
];

export const caseStudySlugs = caseStudies.map((study) => study.slug);
