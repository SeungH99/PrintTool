import type { Locale } from '@/i18n/config';

export interface RefTable {
  title: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface ReferenceContent {
  title: string;
  description: string;
  intro: string;
  tables: RefTable[];
}

// Values are standard published sizes/constants or computed from the same formulas
// the calculators use (pixels = mm ÷ 25.4 × DPI; lb = GSM ÷ type factor). Korean trim
// sizes carry an explicit "varies by printer" note rather than being asserted as exact.
const ko: ReferenceContent = {
  title: '인쇄 규격 참고 자료',
  description:
    '용지 규격, 국내 책 판형, 평량(GSM), 인쇄 해상도, 도련 표준을 한 표에 정리했습니다. 계산기 없이 바로 찾아볼 수 있는 한국어·영어 인쇄 참고표.',
  intro:
    '인쇄 작업에서 자주 찾는 규격과 기준 값을 한곳에 모았습니다. 영어권 자료와 달리 국내에서 쓰는 판형과 명함 규격, 그리고 mm·GSM 기준을 함께 담았습니다. 모든 값은 표준 규격이거나 계산기와 같은 공식으로 구한 값이며, 판형처럼 인쇄소마다 다를 수 있는 항목에는 따로 표시했습니다.',
  tables: [
    {
      title: '표준 용지 규격',
      columns: ['규격', '크기 (mm)', '용도'],
      rows: [
        ['A4', '210 × 297', '일반 문서·전단'],
        ['A5', '148 × 210', '소책자·엽서'],
        ['A3', '297 × 420', '포스터·도면'],
        ['A6', '105 × 148', '엽서·카드'],
        ['B5', '176 × 250', '단행본·노트'],
        ['B4', '250 × 353', '큰 전단'],
        ['Letter', '215.9 × 279.4', '미국 문서'],
        ['Legal', '215.9 × 355.6', '미국 법률 문서'],
        ['Tabloid', '279.4 × 431.8', '미국 신문·포스터'],
        ['명함', '90 × 50', '국내 표준 명함'],
        ['엽서', '100 × 148', '우편엽서'],
      ],
      note: 'ISO A·B 계열은 국제 표준이며, 한 단계 내려갈 때마다 면적이 절반이 됩니다.',
    },
    {
      title: '국내 책 판형 (참고)',
      columns: ['판형', '크기 (mm)', '비고'],
      rows: [
        ['국판', '148 × 210', 'A5와 동일'],
        ['신국판', '152 × 225', '일반 단행본'],
        ['46판(4·6판)', '127 × 188', '문고·실용서'],
        ['크라운판', '176 × 248', '큰 단행본'],
        ['46배판', '188 × 257', '잡지·교재'],
      ],
      note: '판형 치수는 인쇄소·재단 기준에 따라 조금씩 다를 수 있으니 주문 전에 확인하세요.',
    },
    {
      title: '평량(GSM)과 용도',
      columns: ['평량 (GSM)', '용도'],
      rows: [
        ['70 – 90', '복사용지·내지'],
        ['100 – 150', '전단·리플릿'],
        ['180 – 220', '엽서·표지 내지'],
        ['250 – 300', '명함·카드'],
        ['300 이상', '책 표지·고급 명함'],
      ],
      note: 'lb 표기는 종이 종류마다 기준이 달라, 비교할 때는 GSM으로 환산하세요. 예: 100lb Cover ≈ 270 GSM, 100lb Text ≈ 148 GSM.',
    },
    {
      title: '인쇄 해상도 (300 / 150 DPI 픽셀)',
      columns: ['규격', '300 DPI', '150 DPI'],
      rows: [
        ['A4 (210×297)', '2480 × 3508', '1240 × 1754'],
        ['A5 (148×210)', '1748 × 2480', '874 × 1240'],
        ['A3 (297×420)', '3508 × 4961', '1754 × 2480'],
        ['명함 (90×50)', '1063 × 591', '531 × 295'],
        ['엽서 (100×148)', '1181 × 1748', '591 × 874'],
      ],
      note: '픽셀 = 크기(mm) ÷ 25.4 × DPI. 손에 드는 인쇄물은 300 DPI, 멀리서 보는 대형 출력은 150 DPI를 권장합니다.',
    },
    {
      title: '도련·여백 표준',
      columns: ['항목', '표준 값'],
      rows: [
        ['도련(블리드)', '사방 3mm (인쇄소에 따라 1~5mm)'],
        ['안전 여백', '재단선 안쪽 3~5mm'],
        ['최소 본문 해상도', '300 DPI'],
        ['작은 검은 글자', 'K100 단색'],
      ],
      note: '가장자리까지 색이나 이미지가 닿는 디자인은 반드시 도련을 넣으세요.',
    },
  ],
};

const en: ReferenceContent = {
  title: 'Print Specs Reference',
  description:
    'Paper sizes, Korean book trims, paper weight (GSM), print resolution, and bleed standards in one place — a bilingual print reference you can look up without a calculator.',
  intro:
    'The specs and standard values you reach for most in print work, gathered in one place. Unlike English-only references, it includes the trim sizes and card formats used in Korea alongside mm and GSM standards. Every value is a published standard or computed with the same formula the calculators use; items that vary by printer, like book trims, are marked.',
  tables: [
    {
      title: 'Standard paper sizes',
      columns: ['Size', 'Dimensions (mm)', 'Use'],
      rows: [
        ['A4', '210 × 297', 'General documents, flyers'],
        ['A5', '148 × 210', 'Booklets, postcards'],
        ['A3', '297 × 420', 'Posters, drawings'],
        ['A6', '105 × 148', 'Postcards, cards'],
        ['B5', '176 × 250', 'Trade books, notebooks'],
        ['B4', '250 × 353', 'Large flyers'],
        ['Letter', '215.9 × 279.4', 'US documents'],
        ['Legal', '215.9 × 355.6', 'US legal documents'],
        ['Tabloid', '279.4 × 431.8', 'US newspapers, posters'],
        ['Business card', '90 × 50', 'Standard card (KR)'],
        ['Postcard', '100 × 148', 'Mailing postcard'],
      ],
      note: 'The ISO A and B series are international standards; each step down halves the area.',
    },
    {
      title: 'Korean book trims (reference)',
      columns: ['Trim', 'Dimensions (mm)', 'Notes'],
      rows: [
        ['Gukpan', '148 × 210', 'Same as A5'],
        ['Sin-gukpan', '152 × 225', 'Common trade book'],
        ['4×6 (46-pan)', '127 × 188', 'Pocket / practical books'],
        ['Crown', '176 × 248', 'Larger trade book'],
        ['4×6 double (46-bae)', '188 × 257', 'Magazines, textbooks'],
      ],
      note: 'Trim sizes vary slightly by printer and cutting standard — confirm before ordering.',
    },
    {
      title: 'Paper weight (GSM) by use',
      columns: ['Weight (GSM)', 'Use'],
      rows: [
        ['70 – 90', 'Copy paper, interior text'],
        ['100 – 150', 'Flyers, leaflets'],
        ['180 – 220', 'Postcards, cover stock'],
        ['250 – 300', 'Business cards'],
        ['300+', 'Book covers, premium cards'],
      ],
      note: 'Pound (lb) ratings differ by paper type, so convert to GSM to compare. E.g., 100lb Cover ≈ 270 GSM, 100lb Text ≈ 148 GSM.',
    },
    {
      title: 'Print resolution (300 / 150 DPI pixels)',
      columns: ['Size', '300 DPI', '150 DPI'],
      rows: [
        ['A4 (210×297)', '2480 × 3508', '1240 × 1754'],
        ['A5 (148×210)', '1748 × 2480', '874 × 1240'],
        ['A3 (297×420)', '3508 × 4961', '1754 × 2480'],
        ['Business card (90×50)', '1063 × 591', '531 × 295'],
        ['Postcard (100×148)', '1181 × 1748', '591 × 874'],
      ],
      note: 'pixels = size(mm) ÷ 25.4 × DPI. Use 300 DPI for hold-in-hand pieces and 150 DPI for large-format viewed from a distance.',
    },
    {
      title: 'Bleed and margin standards',
      columns: ['Item', 'Standard'],
      rows: [
        ['Bleed', '3mm per side (1–5mm by printer)'],
        ['Safe margin', '3–5mm inside the trim'],
        ['Min. body resolution', '300 DPI'],
        ['Small black text', 'K100 single channel'],
      ],
      note: 'Always add bleed when color or imagery reaches the edge.',
    },
  ],
};

const REFERENCE: Record<Locale, ReferenceContent> = { ko, en };

export function getReference(locale: Locale): ReferenceContent {
  return REFERENCE[locale];
}
