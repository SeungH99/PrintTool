import type { Locale } from '@/i18n/config';
import type { SourceId } from '@/content/sources';

export interface RefTable {
  title: string;
  columns: string[];
  rows: string[][];
  sourceIds: SourceId[];
  basis: 'standard' | 'calculated' | 'commercial-convention';
  sourceContext?: string;
  note?: string;
}

export interface ReferenceContent {
  title: string;
  description: string;
  intro: string;
  updatedAt: string;
  tables: RefTable[];
}

// Values are standard published sizes/constants or computed from the same formulas
// the calculators use (pixels = mm ÷ 25.4 × DPI; lb = GSM ÷ type factor). Korean trim
// sizes carry an explicit "varies by printer" note rather than being asserted as exact.
const ko: ReferenceContent = {
  title: '인쇄 규격 참고 자료',
  description:
    'ISO 용지 규격, 국내 책 판형 관행, 평량(GSM), 인쇄 해상도, 도련 확인 기준을 출처와 함께 정리한 참고 자료입니다.',
  intro:
    '인쇄 작업에서 자주 찾는 규격과 기준 값을 한곳에 모았습니다. 표준에서 직접 가져온 값, 공식으로 계산한 값, 인쇄소별 상업 관행을 구분해 표시합니다. 실제 제작에서는 선택한 인쇄소의 최신 사양을 우선하세요.',
  updatedAt: '2026-08-09',
  tables: [
    {
      title: 'ISO A·B 용지 규격',
      columns: ['규격', '크기 (mm)'],
      rows: [
        ['A3', '297 × 420'],
        ['A4', '210 × 297'],
        ['A5', '148 × 210'],
        ['A6', '105 × 148'],
        ['B4', '250 × 353'],
        ['B5', '176 × 250'],
      ],
      sourceIds: ['iso216'],
      basis: 'standard',
      note: 'ISO A·B 계열은 국제 표준이며, 한 단계 내려갈 때마다 면적이 절반이 됩니다.',
    },
    {
      title: '국내 책 판형 (참고)',
      columns: ['판형', '크기 (mm)', '비고'],
      rows: [
        ['국판', '148 × 210', '인쇄소별 관행 — 선택한 인쇄소에 확인 필요'],
        ['신국판', '152 × 225', '인쇄소별 관행 — 선택한 인쇄소에 확인 필요'],
        ['46판(4·6판)', '127 × 188', '인쇄소별 관행 — 선택한 인쇄소에 확인 필요'],
        ['크라운판', '176 × 248', '인쇄소별 관행 — 선택한 인쇄소에 확인 필요'],
        ['46배판', '188 × 257', '인쇄소별 관행 — 선택한 인쇄소에 확인 필요'],
      ],
      sourceIds: [],
      basis: 'commercial-convention',
      note: '보편 표준이 아닌 인쇄소별 상업 관행입니다. 주문 전에 선택한 인쇄소의 재단 규격을 확인하세요.',
    },
    {
      title: '평량(GSM)의 정의',
      columns: ['항목', '내용'],
      rows: [
        ['평량', '종이·판지 1m²당 질량을 g으로 나타낸 값(g/m², GSM)'],
        ['예시', '100 GSM은 1m²당 질량이 100g이라는 뜻'],
      ],
      sourceIds: ['iso536'],
      basis: 'standard',
      note: 'ISO 536은 종이와 판지의 평량 측정 방법을 정의합니다. 용도별 적합성은 인쇄소의 재질 사양으로 확인하세요.',
    },
    {
      title: '인쇄 해상도와 PDF 준비 참고',
      columns: ['규격', '300 PPI (Adobe 저해상도 기준)', '150 DPI 계산 예시 (권장값 아님)'],
      rows: [
        ['A4 (210×297)', '2480 × 3508', '1240 × 1754'],
        ['A5 (148×210)', '1748 × 2480', '874 × 1240'],
        ['A3 (297×420)', '3508 × 4961', '1754 × 2480'],
        ['명함 예시 (90×50, 인쇄소 확인)', '1063 × 591', '531 × 295'],
        ['엽서 예시 (100×148, 인쇄소 확인)', '1181 × 1748', '591 × 874'],
      ],
      sourceIds: ['adobePrintPdf'],
      basis: 'calculated',
      sourceContext: 'Adobe 출처 범위: 300 PPI 미만 저해상도 경고와 인쇄용 PDF 내보내기 확인 사항',
      note: '픽셀 수는 크기(mm) ÷ 25.4 × DPI로 계산했습니다. 150 DPI 열은 중립적인 계산 예시이며 권장값이 아닙니다. 이미지 해상도와 PDF 내보내기에서는 선택한 인쇄소의 사양이 우선합니다.',
    },
    {
      title: '도련 확인 기준',
      columns: ['항목', '확인 내용'],
      rows: [
        ['도련(블리드)', '재단선 바깥까지 아트워크를 연장하고 폭은 인쇄소에 확인'],
        ['사방 3mm 예시', '흔한 상업 관행이지만 선택한 인쇄소에 확인 필요'],
      ],
      sourceIds: ['adobeBleed'],
      basis: 'commercial-convention',
      note: 'Adobe 자료는 도련 영역의 역할과 설정 방법을 설명합니다. 구체적인 폭은 보편 표준이 아니므로 인쇄소 사양을 따르세요.',
    },
  ],
};

const en: ReferenceContent = {
  title: 'Print Specs Reference',
  description:
    'A sourced reference for ISO paper sizes, Korean book-trim conventions, paper weight (GSM), print resolution, and bleed checks.',
  intro:
    "Frequently used print specifications and reference values are gathered here. Published standards, calculated values, and printer-dependent commercial conventions are identified separately. Your selected printer's current specification takes precedence for production.",
  updatedAt: '2026-08-09',
  tables: [
    {
      title: 'ISO A and B paper sizes',
      columns: ['Size', 'Dimensions (mm)'],
      rows: [
        ['A3', '297 × 420'],
        ['A4', '210 × 297'],
        ['A5', '148 × 210'],
        ['A6', '105 × 148'],
        ['B4', '250 × 353'],
        ['B5', '176 × 250'],
      ],
      sourceIds: ['iso216'],
      basis: 'standard',
      note: 'The ISO A and B series are international standards; each step down halves the area.',
    },
    {
      title: 'Korean book trims (reference)',
      columns: ['Trim', 'Dimensions (mm)', 'Notes'],
      rows: [
        ['Gukpan', '148 × 210', 'Printer-dependent convention — confirm with the selected printer'],
        [
          'Sin-gukpan',
          '152 × 225',
          'Printer-dependent convention — confirm with the selected printer',
        ],
        [
          '4×6 (46-pan)',
          '127 × 188',
          'Printer-dependent convention — confirm with the selected printer',
        ],
        ['Crown', '176 × 248', 'Printer-dependent convention — confirm with the selected printer'],
        [
          '4×6 double (46-bae)',
          '188 × 257',
          'Printer-dependent convention — confirm with the selected printer',
        ],
      ],
      sourceIds: [],
      basis: 'commercial-convention',
      note: 'These are printer-dependent commercial conventions, not universal standards. Confirm the trim specification with the selected printer before ordering.',
    },
    {
      title: 'Definition of paper weight (GSM)',
      columns: ['Item', 'Definition'],
      rows: [
        ['Grammage', 'Mass in grams per square metre of paper or board (g/m², GSM)'],
        ['Example', '100 GSM means one square metre has a mass of 100g'],
      ],
      sourceIds: ['iso536'],
      basis: 'standard',
      note: "ISO 536 defines how paper and board grammage is determined. Confirm a stock's suitability against the printer's material specification.",
    },
    {
      title: 'Print resolution and print-ready PDF notes',
      columns: [
        'Size',
        '300 PPI (Adobe low-resolution threshold)',
        '150 DPI calculation example (not a recommendation)',
      ],
      rows: [
        ['A4 (210×297)', '2480 × 3508', '1240 × 1754'],
        ['A5 (148×210)', '1748 × 2480', '874 × 1240'],
        ['A3 (297×420)', '3508 × 4961', '1754 × 2480'],
        ['Business-card example (90×50; confirm with printer)', '1063 × 591', '531 × 295'],
        ['Postcard example (100×148; confirm with printer)', '1181 × 1748', '591 × 874'],
      ],
      sourceIds: ['adobePrintPdf'],
      basis: 'calculated',
      sourceContext:
        'Adobe source scope: the 300 PPI low-resolution threshold and print-ready PDF export checks',
      note: "Pixel counts use pixels = size(mm) ÷ 25.4 × DPI. The 150 DPI column is a neutral calculation example, not a recommendation. The selected printer's specification takes precedence for image resolution and PDF export settings.",
    },
    {
      title: 'Bleed checks',
      columns: ['Item', 'What to confirm'],
      rows: [
        ['Bleed', 'Extend artwork beyond the trim and confirm the width with the printer'],
        [
          '3mm per-side example',
          'A common commercial convention; confirm with the selected printer',
        ],
      ],
      sourceIds: ['adobeBleed'],
      basis: 'commercial-convention',
      note: "Adobe's guidance explains the purpose and setup of bleed areas. A specific width is not universal, so follow the printer's specification.",
    },
  ],
};

const REFERENCE: Record<Locale, ReferenceContent> = { ko, en };

export function getReference(locale: Locale): ReferenceContent {
  return REFERENCE[locale];
}
