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
    body: 'A4 카탈로그의 이미지가 180 DPI이고 RGB / 비CMYK가 검출되었다면 두 문제를 나누어 확인합니다. 업체가 최종 300 DPI를 요구하면 더 많은 실제 픽셀이 있는 원본을 쓰거나 배치 크기를 줄입니다. RGB 허용 여부와 변환 주체·출력 프로파일은 업체에 확인하세요. 수정한 PDF를 다시 검사해도 폰트·박스·수동 확인 항목은 별도로 남을 수 있습니다.',
  },
  convert: {
    heading: '예: 이미지를 인쇄용 PDF로',
    body: '3000×2000px 사진을 여백 없이 A4 가로 PDF에 맞추면 이미지는 297×198mm, 실효 해상도는 약 256.6 DPI입니다. 210mm 높이 안에 맞추므로 위아래에는 각각 약 6mm가 남습니다. 빈 곳을 없애기 위한 자르기나 도련 생성은 하지 않습니다. 다운로드한 PDF를 다시 검사하고, 더 높은 DPI가 필요하면 실제 픽셀이 많은 원본이나 더 작은 배치 크기를 선택하세요.',
  },
  res: {
    heading: '예: 필요한 픽셀 구하기',
    body: '10×15cm 사진을 300 DPI로 인쇄하려면 약 1181×1772px가 필요합니다(10 ÷ 2.54 × 300 ≈ 1181). 원본이 더 작다면 300 DPI 기준을 충족하는 출력 크기를 줄이거나 원본을 교체합니다. 픽셀 수만 보간해 늘렸다고 사진의 디테일이 새로 생기는 것은 아닙니다.',
  },
  spine: {
    heading: '예: 책등 두께',
    body: '내지 100 GSM, 표지 250 GSM, 200쪽 무선제본을 입력하면 고정 벌크 계수로 캘리퍼를 추정해 약 13.23mm가 나옵니다. 실제 값은 선택한 종이 사양서와 제본소에서 확인하세요.',
  },
  weight: {
    heading: '예: 용지 무게',
    body: 'A4 210×297mm의 면적은 0.06237m²입니다. 80 GSM 500매는 0.06237 × 80 × 500 = 2494.8g, 즉 2.4948kg입니다. 같은 500매를 양면 인쇄해도 종이 장수는 늘지 않습니다. 포장 중량과 인쇄소가 요구한 여분 수량은 따로 반영하세요.',
  },
  fold: {
    heading: '예: 두루마리 3단 접지',
    body: '펼친 폭 210mm의 3단 접지에서 안쪽 보정값을 2mm로 입력하면 이 도구의 패널 폭은 71·68·71mm이며 합계는 210mm입니다. 보정 2mm는 설명을 위한 입력값이지 모든 용지의 제작 기준이 아닙니다. 실제로 안으로 들어갈 면과 접는 방향을 표시한 목업을 확인한 뒤 접지선 위치를 확정하세요.',
  },
  label: {
    heading: '예: 한 장에 라벨 수',
    body: 'A4(210×297mm)에 65×35mm 라벨, 사방 5mm 여백, 라벨 간격 0mm를 넣으면 3열×8행 = 24개입니다. 간격을 2mm로 바꾸면 3열×7행 = 21개가 됩니다. 칼선 사이의 실제 제작 간격을 입력해야 의미 있는 수량을 얻을 수 있습니다.',
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
    body: '270 GSM 종이는 Cover 기준 약 100lb(270 ÷ 2.7048)입니다. 같은 100lb라도 Text는 약 148 GSM으로 면적당 질량이 다릅니다. 이 차이를 두께 차이로 그대로 읽지 말고, 재고의 종류·GSM·캘리퍼를 함께 확인하세요.',
  },
  booklet: {
    heading: '예: 페이지 배치',
    body: '12쪽 중철 책자는 종이 3장이 필요하고, 가장 바깥 장 겉면에는 12·1쪽, 속면에는 2·11쪽이 들어갑니다.',
  },
  nup: {
    heading: '예: 한 판에 몇 개',
    body: '여백·간격을 제외한 A4 210×297mm에 90×50mm 명함은 정방향 2열×5행 = 10개, 90도 회전하면 4열×3행 = 12개입니다. 이 도구는 더 많은 회전 배치를 선택합니다. 실제 발주에서는 도련·재단 간격·그리퍼 공간을 제외한 사용 가능 면적과 비교해야 합니다.',
  },
  grommet: {
    heading: '예: 그로멧 개수',
    body: '가로 3000mm, 세로 1000mm, 목표 간격 600mm라면 윗변·아랫변은 각각 6개, 양 옆변은 각각 3개입니다. 모서리 4개를 중복에서 빼면 전체 14개이고 짧은 변의 실제 간격은 500mm입니다. 이 계산에는 구멍 중심의 안쪽 거리나 설치 강도 판단이 포함되지 않습니다.',
  },
  color: {
    heading: '예: 색역 초과',
    body: 'RGB 초록(0, 255, 0)을 입력해 내장 CMYK 프로파일로 변환한 채널 값을 기록합니다. 이 수치는 해당 프로파일 조건에서의 변환 결과이며 모든 장비에서 같은 초록을 보장하지 않습니다. 중요한 브랜드 색이라면 업체 출력 프로파일의 소프트프루프와 실제 교정을 비교하고 채널 값만 복사해 확정하지 마세요.',
  },
  impose: {
    heading: '예: 첫 페이지 10-up 반복 배치',
    body: '90×50mm PDF의 첫 페이지를 A4 용지에 여백 10mm, 간격 3mm로 놓으면 정방향 2열×5행의 10-up N-up 격자에 반복됩니다. 원본의 두 번째 페이지부터는 결과에 포함되지 않습니다.',
  },
  marks: {
    heading: '예: 마크 배치',
    body: '90×50mm가 올바른 TrimBox인 PDF에 도련 여유 3mm를 지정하면 그 재단 경계를 기준으로 마크를 놓을 공간을 바깥에 확보합니다. 96×56mm 전체 작업판이 재단 크기로 잘못 읽히면 마크도 잘못된 경계에 붙을 수 있습니다. 결과의 완성 크기와 실제 배경 연장을 확인하세요. 마크 설정만으로 배경 픽셀이 추가되지는 않습니다.',
  },
  proof: {
    heading: '예: 색역 초과 비율',
    body: '같은 사진에서 내장 프로파일 결과를 먼저 본 뒤 업체가 제공한 ICC로 다시 비교합니다. 강조 영역과 변화 비율은 해당 프로파일·도구 기준으로 검토할 위치를 찾는 보조값입니다. 수치가 낮아졌다고 출력 승인이나 색 일치가 증명되는 것은 아닙니다. 내려받은 PNG는 화면 시뮬레이션이며 납품용 CMYK 원본을 대신하지 않습니다.',
  },
};

const en: Partial<Record<ToolId, ToolExample>> = {
  pdf: {
    heading: 'Example: reading the report',
    body: 'An A4 catalog reports a 180 DPI image and RGB / non-CMYK detection. Treat these separately. If the provider requires 300 DPI at final size, use an original with more actual pixels or reduce placement size. Ask whether RGB is accepted, who handles conversion, and which output profile is required. Recheck the revised PDF; font, box and manual-review items can remain.',
  },
  convert: {
    heading: 'Example: image to a sized PDF',
    body: 'With zero margins on landscape A4, a 3000×2000px photo fits at 297×198mm, about 256.6 DPI. Inside the 210mm page height it leaves about 6mm above and below. The tool does not crop to fill that space or create bleed. Recheck the downloaded PDF; if more DPI is needed, use an original with more actual pixels or a smaller placement.',
  },
  res: {
    heading: 'Example: pixels you need',
    body: 'To print a 10×15cm photo at 300 DPI you need about 1181×1772px (10 ÷ 2.54 × 300 ≈ 1181). If the original is smaller, reduce the output size that must meet 300 DPI or replace the original. Interpolating extra pixels does not create new photographic detail.',
  },
  spine: {
    heading: 'Example: spine thickness',
    body: 'Entering 100 GSM interior stock, 250 GSM cover stock, and 200 pages for perfect binding gives about 13.23mm after the fixed bulk heuristic infers caliper. Confirm it with the stock data sheet and bindery.',
  },
  weight: {
    heading: 'Example: paper weight',
    body: 'A4 at 210×297mm has an area of 0.06237m². At 80 GSM, 500 sheets weigh 0.06237 × 80 × 500 = 2494.8g, or 2.4948kg. Printing both sides of those sheets does not change the physical sheet count. Account separately for packaging mass and provider-required overs.',
  },
  fold: {
    heading: 'Example: 3-panel roll fold',
    body: 'For a 210mm unfolded width and three-panel fold with a 2mm inner-panel allowance, this tool gives 71·68·71mm, totaling 210mm. The 2mm allowance is an illustrative input, not a universal stock specification. Mark the tuck-in panel and folding direction on a mockup before approving crease positions.',
  },
  label: {
    heading: 'Example: labels per sheet',
    body: 'A4 at 210×297mm with 65×35mm labels, 5mm margins all around and a zero gap gives 3 columns × 8 rows = 24. Changing the gap to 2mm gives 3 columns × 7 rows = 21. Enter the actual production gap between die lines to get a usable quantity.',
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
    body: '270 GSM paper is about 100lb Cover (270 ÷ 2.7048). The same 100lb in Text is about 148 GSM, a different mass per area. Do not read that directly as a thickness difference; check the stock category, GSM and caliper together.',
  },
  booklet: {
    heading: 'Example: page placement',
    body: 'A 12-page saddle-stitch booklet needs 3 sheets; the outer side of the outermost sheet holds pages 12 and 1, and its inner side holds pages 2 and 11.',
  },
  nup: {
    heading: 'Example: how many up',
    body: 'On 210×297mm A4 with no margins or gaps, 90×50mm cards fit 2 columns × 5 rows = 10 upright, or 4 columns × 3 rows = 12 when rotated. The calculator selects the higher-yield rotated layout. For an order, compare against the area left after bleed, cutting gaps and gripper space.',
  },
  grommet: {
    heading: 'Example: grommet count',
    body: 'For width 3000mm, height 1000mm and target spacing 600mm, top and bottom each have six points and each side has three. Subtract the four shared corners for 14 total; actual spacing on the short edges is 500mm. Hole-centre inset and installation strength are not part of this calculation.',
  },
  color: {
    heading: 'Example: out of gamut',
    body: 'Enter RGB green (0, 255, 0) and record the channel values from the bundled CMYK profile. These are that profile’s conversion results, not a guarantee of the same green on every press. For a critical brand color, compare the provider-profile soft proof and a physical proof instead of approving copied channel values alone.',
  },
  impose: {
    heading: 'Example: repeating the first page 10-up',
    body: 'With a 90×50mm PDF, an A4 sheet, 10mm margins, and 3mm spacing, the first page is repeated in an upright 2-column × 5-row N-up grid. Pages after the first are not included in the output.',
  },
  marks: {
    heading: 'Example: mark placement',
    body: 'For a PDF with a correct 90×50mm TrimBox and 3mm bleed allowance, marks are positioned outside that trim boundary. If a 96×56mm artwork canvas is incorrectly read as trim, marks can target the wrong finished size. Check the exported trim and actual extended background; changing mark settings does not add background pixels.',
  },
  proof: {
    heading: 'Example: out-of-gamut share',
    body: 'Compare the same photo with the bundled profile and then the provider’s ICC. Highlights and the reported change percentage help locate areas for review under that profile and this tool’s criteria. A lower percentage is not output approval or proof of a color match. The downloaded PNG is a screen simulation, not a replacement for a production CMYK original.',
  },
};

const TOOL_EXAMPLES: Record<Locale, Partial<Record<ToolId, ToolExample>>> = { ko, en };

export function getToolExample(locale: Locale, toolId: ToolId): ToolExample | undefined {
  return TOOL_EXAMPLES[locale][toolId];
}
