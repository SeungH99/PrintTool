import type { Locale } from '@/i18n/config';
import type { ToolId } from '@/lib/tools';

export interface ToolExample {
  heading: string;
  body: string;
}

/**
 * A concrete worked example per tool, shown between the how-it-works sections and
 * the FAQ. Gives each tool page unique, numeric content (not a shared template) and
 * a worked walkthrough the calculator UI alone doesn't spell out. Numbers come from
 * the same formulas the calculators use; illustrative cases are clearly framed.
 */
const ko: Partial<Record<ToolId, ToolExample>> = {
  pdf: {
    heading: '예: 검사 결과 읽기',
    body: 'A4 카탈로그를 검사했더니 표지 이미지가 180 DPI, 본문 색상이 RGB로 떴습니다. 표지는 300 DPI 원본으로 교체하고 전체를 CMYK로 변환한 뒤 다시 검사하면 경고가 사라집니다.',
  },
  convert: {
    heading: '예: 이미지를 인쇄용 PDF로',
    body: '3000×2000px 사진을 A4 PDF로 변환하면 약 254 DPI로 배치됩니다. 더 선명하게 하려면 원본을 더 크게 쓰거나 배치 크기를 줄이세요.',
  },
  res: {
    heading: '예: 필요한 픽셀 구하기',
    body: '10×15cm 사진을 300 DPI로 인쇄하려면 약 1181×1772px가 필요합니다(10 ÷ 2.54 × 300 ≈ 1181). 가진 이미지가 이보다 작으면 흐려집니다.',
  },
  spine: {
    heading: '예: 책등 두께',
    body: '200쪽 책을 한 장 0.1mm 종이로 무선제본하면 책등은 약 (200 ÷ 2) × 0.1 = 10mm에 표지 두께를 더한 값입니다. 종이가 두꺼울수록 책등도 두꺼워집니다.',
  },
  weight: {
    heading: '예: 용지 무게',
    body: 'A4(약 0.0624㎡) 80GSM 복사용지 500매는 약 0.0624 × 80 × 500 ≈ 2.5kg입니다. 평량이 두 배면 무게도 두 배입니다.',
  },
  fold: {
    heading: '예: 두루마리 3단 접지',
    body: '210mm 폭 3단 두루마리 접지는 안쪽으로 말려 들어가는 패널을 1~2mm 좁게 잡아야 접었을 때 패널이 겹치거나 튀어나오지 않습니다.',
  },
  label: {
    heading: '예: 한 장에 라벨 수',
    body: 'A4(210×297)에 65×35mm 라벨을 사방 5mm 여백으로 배치하면 가로 3 × 세로 8 = 24개가 한 장에 들어갑니다.',
  },
  bleed: {
    heading: '예: 작업 사이즈',
    body: '90×50mm 명함에 사방 3mm 도련이면 작업 사이즈는 96×56mm, 안전선은 재단선에서 3mm 안쪽인 84×44mm입니다.',
  },
  size: {
    heading: '예: 캔버스 크기',
    body: 'A4를 300 DPI로 작업하려면 2480×3508px 캔버스로 시작합니다. 사방 3mm 도련까지 포함하면 약 2551×3579px입니다.',
  },
  gsm: {
    heading: '예: lb ↔ GSM',
    body: '270 GSM 종이는 Cover 기준 약 100lb(270 ÷ 2.7048)입니다. 같은 100lb라도 Text는 약 148 GSM으로 훨씬 얇습니다 — 종류를 함께 봐야 합니다.',
  },
  booklet: {
    heading: '예: 페이지 배치',
    body: '12쪽 중철 책자는 종이 3장이 필요하고, 가장 바깥 장 겉면에는 12·1쪽, 속면에는 2·11쪽이 들어갑니다.',
  },
  nup: {
    heading: '예: 한 판에 몇 개',
    body: 'A4 한 장에 90×50mm 명함을 앉히면 가로 2 × 세로 5로 10개를 모아 찍을 수 있습니다(여백 제외). 모아 찍고 재단하면 효율이 올라갑니다.',
  },
  grommet: {
    heading: '예: 그로멧 개수',
    body: '가로 3m(300cm) 현수막 윗변에 모서리 2개 + 60cm 간격이면 약 6개의 그로멧이 들어갑니다. 아랫변도 같게 맞춥니다.',
  },
  color: {
    heading: '예: 색역 초과',
    body: 'RGB의 형광 초록(0, 255, 0)은 CMYK 색역을 벗어나, 인쇄하면 탁한 초록으로 바뀝니다. 소프트프루프로 미리 확인하고 채도를 낮추세요.',
  },
  impose: {
    heading: '예: 8쪽 터잡기',
    body: '8쪽 문서를 중철 임포지션하면 A3 2장에 4-up으로 앉고, 인쇄해 접어 묶으면 1~8쪽 순서가 됩니다.',
  },
  marks: {
    heading: '예: 마크 배치',
    body: '90×50mm 재단 크기에 3mm 도련을 주면 재단선(crop mark)은 네 모서리에, 맞춤표(registration mark)는 도련 바깥에 배치됩니다.',
  },
  proof: {
    heading: '예: 색역 초과 비율',
    body: '채도 높은 사진을 소프트프루프하면 예컨대 화면 픽셀의 8%가 CMYK 색역을 벗어난다고 표시됩니다. 그 영역의 채도를 낮추면 인쇄 색에 가까워집니다.',
  },
};

const en: Partial<Record<ToolId, ToolExample>> = {
  pdf: {
    heading: 'Example: reading the report',
    body: 'You check an A4 catalog and the cover image flags at 180 DPI and the body color flags as RGB. Replace the cover with a 300 DPI original, convert everything to CMYK, and re-run the check — the warnings clear.',
  },
  convert: {
    heading: 'Example: image to print-ready PDF',
    body: 'Converting a 3000×2000px photo to an A4 PDF places it at about 254 DPI. For sharper output, start from a larger original or place it at a smaller size.',
  },
  res: {
    heading: 'Example: pixels you need',
    body: 'To print a 10×15cm photo at 300 DPI you need about 1181×1772px (10 ÷ 2.54 × 300 ≈ 1181). A smaller image than that will look soft.',
  },
  spine: {
    heading: 'Example: spine thickness',
    body: 'A 200-page book perfect-bound on 0.1mm sheets has a spine of about (200 ÷ 2) × 0.1 = 10mm plus the cover thickness. Thicker paper means a thicker spine.',
  },
  weight: {
    heading: 'Example: paper weight',
    body: '500 sheets of A4 (about 0.0624㎡) at 80 GSM weigh about 0.0624 × 80 × 500 ≈ 2.5kg. Double the GSM, double the weight.',
  },
  fold: {
    heading: 'Example: 3-panel roll fold',
    body: 'On a 210mm-wide three-panel roll fold, make the panel that tucks inside 1–2mm narrower so the panels do not overlap or stick out when folded.',
  },
  label: {
    heading: 'Example: labels per sheet',
    body: 'On A4 (210×297) with 65×35mm labels and 5mm margins all around, you fit 3 across × 8 down = 24 labels per sheet.',
  },
  bleed: {
    heading: 'Example: working size',
    body: 'A 90×50mm business card with 3mm bleed on all sides has a 96×56mm working size, and a safe line 3mm inside the trim at 84×44mm.',
  },
  size: {
    heading: 'Example: canvas size',
    body: 'To build A4 at 300 DPI, start a 2480×3508px canvas. Including 3mm bleed on all sides it is about 2551×3579px.',
  },
  gsm: {
    heading: 'Example: lb ↔ GSM',
    body: '270 GSM paper is about 100lb Cover (270 ÷ 2.7048). The same 100lb in Text is about 148 GSM — much thinner — so always read the type alongside the number.',
  },
  booklet: {
    heading: 'Example: page placement',
    body: 'A 12-page saddle-stitch booklet needs 3 sheets; the outer side of the outermost sheet holds pages 12 and 1, and its inner side holds pages 2 and 11.',
  },
  nup: {
    heading: 'Example: how many up',
    body: 'On one A4 sheet you can gang 90×50mm cards 2 across × 5 down = 10 up (excluding margins). Ganging and trimming raises efficiency.',
  },
  grommet: {
    heading: 'Example: grommet count',
    body: 'On the top edge of a 3m (300cm) banner, 2 corners plus 60cm spacing gives about 6 grommets. Match the bottom edge to it.',
  },
  color: {
    heading: 'Example: out of gamut',
    body: 'A neon RGB green (0, 255, 0) falls outside the CMYK gamut and prints as a duller green. Check it with soft proofing first and lower the saturation.',
  },
  impose: {
    heading: 'Example: imposing 8 pages',
    body: 'Imposing an 8-page document for saddle stitch lays it 4-up on 2 A3 sheets; printed, folded, and bound it reads in 1–8 order.',
  },
  marks: {
    heading: 'Example: mark placement',
    body: 'With a 90×50mm trim and 3mm bleed, crop marks go at the four corners and registration marks sit outside the bleed.',
  },
  proof: {
    heading: 'Example: out-of-gamut share',
    body: 'Soft-proofing a saturated photo might report that, say, 8% of the on-screen pixels fall outside the CMYK gamut. Lowering saturation there brings it closer to the printed color.',
  },
};

const TOOL_EXAMPLES: Record<Locale, Partial<Record<ToolId, ToolExample>>> = { ko, en };

export function getToolExample(locale: Locale, toolId: ToolId): ToolExample | undefined {
  return TOOL_EXAMPLES[locale][toolId];
}
