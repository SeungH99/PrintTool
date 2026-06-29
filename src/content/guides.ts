import type { Locale } from '@/i18n/config';
import type { ToolId } from '@/lib/tools';

export interface GuideSection {
  heading: string;
  body: string;
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  /** Tools this guide links to (internal linking + topical clustering). */
  relatedTools: ToolId[];
}

/** Stable slugs shared by both locales — drives routing, sitemap, and static params. */
export const guideSlugs = [
  'print-file-prep',
  'bleed-and-trim',
  'cmyk-vs-rgb',
  'resolution-and-dpi',
  'paper-weight-gsm',
  'saddle-stitch-booklet',
  'large-format-banner',
] as const;
export type GuideSlug = (typeof guideSlugs)[number];

const ko: Guide[] = [
  {
    slug: 'print-file-prep',
    title: '인쇄 파일 준비 완벽 가이드 — 입고 전 체크리스트',
    description:
      '인쇄소에 데이터를 넘기기 전에 해상도·색상·도련·폰트를 점검하는 방법을 단계별로 정리했습니다. 재인쇄와 납기 지연을 막는 사전 체크리스트.',
    intro:
      '인쇄는 한 번 출고되면 되돌릴 수 없습니다. 화면에서 멀쩡해 보여도 해상도가 낮거나 색상 모드가 RGB이거나 도련이 없으면 결과물이 흐리거나, 색이 튀거나, 가장자리가 잘려 나옵니다. 이 가이드는 인쇄소에 파일을 넘기기 전 반드시 확인할 다섯 가지를 순서대로 정리합니다.',
    sections: [
      {
        heading: '1. 해상도 — 300 DPI 기준',
        body: '인쇄용 이미지는 보통 300 DPI를 권장합니다. 실효 해상도는 이미지의 픽셀 수를 실제 배치 크기(인치)로 나눈 값으로, 1000px 이미지를 10인치로 배치하면 100 DPI에 불과합니다. 멀리서 보는 대형 출력물은 150 DPI로도 충분하지만, 손에 드는 인쇄물은 300 DPI를 지키세요. 작은 이미지를 편집기에서 키우면 픽셀만 늘어날 뿐 선명도는 오히려 떨어집니다.',
      },
      {
        heading: '2. 색상 — CMYK로 작업',
        body: '화면은 빛을 더하는 RGB, 인쇄는 잉크를 겹치는 CMYK입니다. RGB로 작업한 형광·고채도 색은 CMYK로 변환되면서 탁해질 수 있으므로, 가능하면 처음부터 CMYK로 작업하고 핵심 색은 인쇄 색을 미리 확인하세요. 작은 검은 글자는 네 색을 겹치지 말고 K100 단색으로 처리해야 핀이 어긋나도 번지지 않습니다.',
      },
      {
        heading: '3. 도련(블리드)과 안전 여백',
        body: '가장자리까지 색이나 이미지가 닿는 디자인은 재단 오차를 흡수하도록 사방 3mm 도련을 둡니다. 반대로 잘리면 안 되는 글자·로고는 재단선에서 3~5mm 안쪽(안전 여백)에 배치하세요. 작업 파일은 완성 크기에 도련을 더한 크기로 만들고, 재단은 완성 크기로 이뤄집니다.',
      },
      {
        heading: '4. 폰트 임베딩',
        body: '인쇄소 컴퓨터에 같은 폰트가 없으면 글자가 다른 서체로 바뀌거나 깨집니다. PDF로 내보낼 때 폰트를 모두 내장(embed)하거나 윤곽선(outline)으로 변환하세요. PDF/X-1a 또는 PDF/X-4 프리셋으로 내보내면 색상·폰트·투명도가 인쇄용으로 정리됩니다.',
      },
      {
        heading: '5. 마지막 프리플라이트 검사',
        body: '출고 직전, 완성 PDF를 한 번 더 검사해 도련·페이지 크기·이미지 해상도·색상 모드·폰트 임베딩을 확인합니다. 문제를 화면에서 잡으면 재인쇄와 추가 비용을 막을 수 있습니다. 검사에서 주의로 뜬 항목은 무시하지 말고 원본에서 수정한 뒤 다시 내보내세요.',
      },
    ],
    faq: [
      {
        q: '인쇄용 해상도는 몇 DPI가 적당한가요?',
        a: '손에 드는 인쇄물은 300 DPI, 멀리서 보는 대형 출력물은 150 DPI를 권장합니다. 실효 해상도는 배치 크기에 따라 달라지므로 배치 후 값을 확인하세요.',
      },
      {
        q: 'RGB로 작업한 파일을 그대로 넘겨도 되나요?',
        a: '권장하지 않습니다. 인쇄는 CMYK라 RGB의 형광·고채도 색이 탁해질 수 있습니다. CMYK로 변환하고 핵심 색은 미리 확인하세요.',
      },
      {
        q: '도련은 꼭 넣어야 하나요?',
        a: '가장자리까지 색·이미지가 닿는 디자인이라면 필수입니다. 도련이 없으면 재단이 조금만 밀려도 흰 여백이 보입니다. 국내 일반 인쇄는 사방 3mm입니다.',
      },
    ],
    relatedTools: ['pdf', 'res', 'bleed', 'color'],
  },
  {
    slug: 'bleed-and-trim',
    title: '도련·재단·재단선 완벽 정리 — 작업 사이즈 잡는 법',
    description:
      '도련(블리드), 재단 크기, 안전 여백, 재단선·맞춤표의 차이와 작업 사이즈 계산법을 인쇄 실무 기준으로 정리했습니다.',
    intro:
      '재단은 칼이 정확히 같은 자리를 자르지 못합니다. 항상 약간의 오차가 생기므로, 그 오차를 흡수하도록 디자인을 완성 크기보다 크게 만들고(도련), 중요한 요소는 가장자리에서 떨어뜨립니다(안전 여백). 이 가이드는 도련·재단·재단선의 관계와 작업 사이즈 잡는 법을 정리합니다.',
    sections: [
      {
        heading: '도련(블리드)이란',
        body: '도련은 완성 크기 바깥으로 색·이미지를 연장해 두는 영역입니다. 재단이 밀려도 흰 여백이 보이지 않게 하려면 가장자리까지 닿는 요소를 도련 끝까지 채워야 합니다. 국내 일반 인쇄는 사방 3mm가 표준이며, 인쇄소에 따라 1~5mm를 요구하기도 합니다.',
      },
      {
        heading: '안전 여백',
        body: '안전 여백은 반대로, 잘리면 안 되는 글자·로고를 재단선에서 안쪽으로 띄우는 거리입니다. 보통 3~5mm를 둡니다. 재단이 안쪽으로 밀려도 중요한 요소가 잘려 나가지 않게 하는 안전장치입니다.',
      },
      {
        heading: '작업 사이즈 = 완성 크기 + 도련',
        body: '작업 파일은 완성 크기에 사방 도련을 더한 크기로 만듭니다. 예를 들어 90×50mm 명함에 3mm 도련이면 작업 사이즈는 96×56mm입니다. 재단은 완성 크기(90×50mm)로 이뤄지고, 도련은 잘려 나갑니다.',
      },
      {
        heading: '재단선과 맞춤표(트림·레지스트레이션 마크)',
        body: '재단선(crop marks)은 어디를 자를지 표시하는 모서리 선이고, 맞춤표(registration marks)는 CMYK 네 색 판이 정확히 겹쳤는지 확인하는 표적입니다. 마크는 도련 바깥에 두며, 맞춤표는 네 판 모두에 찍히도록 리치블랙으로 그립니다.',
      },
      {
        heading: '흔한 실수',
        body: '가장 흔한 실수는 도련 없이 완성 크기로만 작업하는 것입니다. 그러면 재단이 조금만 밀려도 흰 선이 보입니다. 또 글자를 가장자리에 너무 붙이면 잘려 나갈 수 있으니 안전 여백 안쪽에 두세요.',
      },
    ],
    faq: [
      {
        q: '도련은 보통 몇 mm인가요?',
        a: '국내 일반 인쇄는 사방 3mm가 표준입니다. 인쇄소에 따라 1~5mm를 요구하므로 사양서를 확인하세요.',
      },
      {
        q: '작업 사이즈는 어떻게 계산하나요?',
        a: '완성 크기에 사방 도련을 더합니다. 90×50mm에 3mm 도련이면 96×56mm입니다. 재단 여백 계산기로 바로 구할 수 있습니다.',
      },
      {
        q: '재단선과 맞춤표는 직접 그려야 하나요?',
        a: '인쇄 마크 도구로 PDF에 자동으로 추가할 수 있습니다. 마크는 도련 바깥에 배치됩니다.',
      },
    ],
    relatedTools: ['bleed', 'marks', 'impose'],
  },
  {
    slug: 'cmyk-vs-rgb',
    title: '인쇄 색상 가이드 — CMYK vs RGB와 색역',
    description:
      '화면(RGB)과 인쇄(CMYK)의 색이 다른 이유, 색역과 변환, 소프트프루프, K100 리치블랙까지 인쇄 색상의 기본을 정리했습니다.',
    intro:
      '디자인할 때 화면에서 본 색과 인쇄물의 색이 다른 경우가 많습니다. 화면은 빛을 더해 만드는 RGB, 인쇄는 잉크를 겹쳐 빼는 CMYK라 표현 범위(색역)가 다르기 때문입니다. 이 가이드는 두 색 공간의 차이와 인쇄 색을 예측하는 방법을 정리합니다.',
    sections: [
      {
        heading: 'RGB와 CMYK의 차이',
        body: 'RGB는 빨강·초록·파랑 빛을 더해 색을 만드는 가산혼합으로, 화면·웹에서 씁니다. CMYK는 청록·자홍·노랑·검정 잉크를 겹쳐 빛을 빼는 감산혼합으로, 인쇄에서 씁니다. 같은 색이라도 두 공간의 표현 범위가 달라 1:1로 대응하지 않습니다.',
      },
      {
        heading: '색역(Gamut)과 색역 초과',
        body: 'CMYK의 색역은 RGB보다 좁아서, 형광 초록이나 강한 파랑 같은 고채도 색은 인쇄로 재현되지 않고 탁해집니다. 이렇게 CMYK 색역을 벗어나는 색을 색역 초과(out of gamut)라고 합니다. 브랜드 색·로고는 인쇄 색과 크게 어긋나지 않는지 미리 확인하는 것이 좋습니다.',
      },
      {
        heading: 'ICC 프로파일과 변환',
        body: 'RGB↔CMYK 변환 결과는 잉크·용지·인쇄 조건에 따라 달라지므로 단순 수식으로는 부정확합니다. 표준 CMYK ICC 프로파일로 변환하면 공식 기반 근사보다 신뢰도가 높습니다. 인쇄소가 쓰는 프로파일(예: FOGRA·SWOP)이 있으면 그 조건으로 변환하세요.',
      },
      {
        heading: '소프트프루프로 미리보기',
        body: '소프트프루프는 이미지를 CMYK 프로파일로 변환해 화면에서 인쇄 색을 근사적으로 미리보는 방법입니다. 색역 초과 영역을 비율로 알려 주어, 인쇄 시 탁해질 색을 미리 찾아 채도를 낮추거나 조정할 수 있습니다. 다만 화면은 시뮬레이션이므로 최종 색은 교정 출력으로 확인하세요.',
      },
      {
        heading: 'K100 단색과 리치블랙',
        body: '작은 검은 글자나 가는 선은 네 색을 겹친 리치블랙이 아니라 K100(검정 단색)으로 처리해야 핀이 어긋나도 번지지 않습니다. 반대로 큰 검은 면은 깊은 검정을 위해 리치블랙을 쓰기도 합니다. 용도에 맞게 구분하세요.',
      },
    ],
    faq: [
      {
        q: 'RGB를 CMYK로 바꾸면 왜 색이 달라지나요?',
        a: '두 색 공간의 표현 범위(색역)가 다르기 때문입니다. RGB의 형광·고채도 색은 CMYK에서 재현되지 않아 탁해질 수 있습니다.',
      },
      {
        q: '인쇄 색을 미리 확인할 수 있나요?',
        a: '소프트프루프 도구로 이미지를 CMYK로 시뮬레이션해 인쇄 근사 색과 색역 초과 비율을 미리볼 수 있습니다. 정확한 색은 교정 출력으로 확인하세요.',
      },
      {
        q: '검은색은 K100과 리치블랙 중 무엇을 쓰나요?',
        a: '작은 글자·가는 선은 K100 단색, 큰 검은 면은 깊은 검정이 필요하면 리치블랙을 씁니다.',
      },
    ],
    relatedTools: ['color', 'proof', 'convert'],
  },
  {
    slug: 'resolution-and-dpi',
    title: '인쇄 해상도와 DPI 가이드 — 흐릿하지 않게 출력하기',
    description:
      'DPI·PPI·실효 해상도의 차이와, 인쇄 크기에 맞는 픽셀 수를 정하는 법을 정리했습니다. 이미지가 흐릿하게 나오는 원인과 해결책.',
    intro:
      '인쇄물이 흐릿하게 나오는 가장 흔한 원인은 해상도 부족입니다. 화면에서 선명해 보여도 실제 인쇄 크기로 놓으면 픽셀이 부족해 뭉개질 수 있습니다. 이 가이드는 DPI의 의미와, 원하는 크기로 선명하게 인쇄하려면 몇 픽셀이 필요한지 정리합니다.',
    sections: [
      {
        heading: 'DPI와 PPI',
        body: 'DPI(dots per inch)는 인쇄기가 1인치에 찍는 점의 수, PPI(pixels per inch)는 이미지가 1인치에 담는 픽셀 수입니다. 실무에서는 둘을 섞어 쓰지만, 디자인 단계에서 중요한 것은 이미지의 픽셀 밀도(PPI)입니다.',
      },
      {
        heading: '실효 해상도',
        body: '같은 이미지라도 크게 배치하면 해상도가 떨어집니다. 실효 해상도 = 이미지 가로 픽셀 ÷ 배치 가로 길이(인치)입니다. 3000px 이미지를 10인치로 놓으면 300 DPI지만, 20인치로 늘리면 150 DPI로 떨어집니다.',
      },
      {
        heading: '용도별 권장 DPI',
        body: '손에 드는 인쇄물(명함·브로슈어·책)은 300 DPI를 권장합니다. 1~2m 거리에서 보는 포스터는 150 DPI, 멀리서 보는 대형 현수막은 72~100 DPI로도 충분합니다. 보는 거리가 멀수록 낮은 해상도가 허용됩니다.',
      },
      {
        heading: '이미지를 키우면 안 되는 이유',
        body: '작은 이미지를 편집기에서 확대하면 픽셀 수만 늘 뿐 없던 디테일이 생기지 않습니다(업스케일). AI 업스케일러도 한계가 있으니, 처음부터 충분히 큰 원본이나 벡터(SVG·AI)를 쓰는 것이 안전합니다.',
      },
      {
        heading: '필요한 픽셀 계산',
        body: '필요한 픽셀 = 인쇄 크기(인치) × 목표 DPI입니다. A4(약 8.27×11.69인치)를 300 DPI로 채우려면 약 2480×3508px가 필요합니다. 해상도 계산기나 규격·픽셀 변환기로 바로 구할 수 있습니다.',
      },
    ],
    faq: [
      {
        q: '인쇄에 필요한 DPI는 얼마인가요?',
        a: '손에 드는 인쇄물은 300 DPI가 기준입니다. 포스터는 150 DPI, 대형 현수막은 72~100 DPI로도 충분합니다. 보는 거리가 멀수록 낮아도 됩니다.',
      },
      {
        q: '이미지를 키우면 해상도가 좋아지나요?',
        a: '아니요. 업스케일은 픽셀만 늘리고 디테일은 만들지 못해 오히려 뭉개집니다. 충분히 큰 원본이나 벡터를 쓰세요.',
      },
      {
        q: '실효 해상도가 무엇인가요?',
        a: '이미지를 실제 인쇄 크기로 놓았을 때의 해상도입니다. 픽셀 수 ÷ 배치 크기(인치)로, 크게 놓을수록 낮아집니다.',
      },
    ],
    relatedTools: ['res', 'size', 'pdf'],
  },
  {
    slug: 'paper-weight-gsm',
    title: '종이 평량(GSM)과 두께 가이드 — 용지 고르고 책등 계산하기',
    description:
      'GSM과 미국식 lb의 차이, 용도별 평량 선택, 그리고 페이지 수로 책등 두께를 계산하는 법을 정리했습니다.',
    intro:
      '종이를 고를 때 가장 먼저 보는 값이 평량입니다. 같은 "두껍다"도 명함과 책 표지가 다르고, 미터식 GSM과 미국식 lb은 표기 방식이 전혀 달라 혼동되기 쉽습니다. 이 가이드는 평량의 의미와 용도별 선택, 책등 계산까지 정리합니다.',
    sections: [
      {
        heading: 'GSM이란',
        body: 'GSM(g/m²)은 종이 1제곱미터의 무게입니다. 종류와 무관한 절대 단위라 비교가 쉽습니다. 복사용지 80, 일반 전단 100~150, 명함 250~300, 책 표지 250 이상이 대략의 기준입니다.',
      },
      {
        heading: 'GSM과 미국식 lb',
        body: '미국은 lb(파운드)으로 표기하는데, 종류마다 기준 전지 크기가 달라 같은 두께라도 숫자가 다릅니다. 80lb Text와 80lb Cover는 전혀 다른 두께입니다. 비교할 때는 GSM으로 환산하세요.',
      },
      {
        heading: '평량과 두께(caliper)는 다르다',
        body: '평량은 무게, 두께(caliper)는 실제 두께입니다. 같은 GSM이라도 종이 밀도에 따라 두께가 다릅니다. 책등 계산에는 평량보다 종이별 실측 두께가 더 정확하지만, 평량으로도 근사할 수 있습니다.',
      },
      {
        heading: '책등 두께',
        body: '책등 두께는 대략 (내지 페이지 수 ÷ 2) × 한 장 두께 + 표지 두께로 계산합니다. 페이지가 많을수록, 종이가 두꺼울수록 책등이 두꺼워집니다. 무선제본·중철 등 제본 방식에 따라서도 달라집니다.',
      },
    ],
    faq: [
      {
        q: '명함은 보통 몇 GSM인가요?',
        a: '250~300 GSM을 많이 씁니다. 더 도톰한 고급 명함은 350 GSM 이상을 쓰기도 합니다.',
      },
      {
        q: '80lb는 GSM으로 얼마인가요?',
        a: '종류에 따라 다릅니다. 80lb Text는 약 118 GSM, 80lb Cover는 약 216 GSM입니다. 종류를 함께 봐야 정확합니다.',
      },
      {
        q: '책등 두께는 어떻게 구하나요?',
        a: '페이지 수, 종이 평량/두께, 제본 방식을 책등 계산기에 입력하면 mm 단위로 바로 나옵니다.',
      },
    ],
    relatedTools: ['weight', 'gsm', 'spine'],
  },
  {
    slug: 'saddle-stitch-booklet',
    title: '중철제본과 터잡기 가이드 — 페이지 수와 순서 맞추기',
    description:
      '중철제본에서 페이지 수가 4의 배수여야 하는 이유, 터잡기(임포지션)와 크리프, N-up 배치를 정리했습니다.',
    intro:
      '소책자·카탈로그를 중철(가운데를 스테이플로 묶는 방식)로 만들 때, 페이지 수와 순서를 잘못 잡으면 인쇄 후 책이 맞지 않습니다. 이 가이드는 4의 배수 규칙, 터잡기, 크리프, 한 판에 여러 면을 앉히는 N-up까지 정리합니다.',
    sections: [
      {
        heading: '왜 4의 배수인가',
        body: '종이 한 장을 반으로 접으면 앞뒤 4쪽이 됩니다. 중철은 이런 장을 겹쳐 묶으므로 전체 쪽수는 항상 4의 배수여야 합니다. 부족하면 빈 페이지를 넣어 맞춥니다.',
      },
      {
        heading: '터잡기(임포지션)',
        body: '책으로 묶으면 물리적으로 떨어진 페이지가 같은 면에 인쇄됩니다. 8쪽 책자라면 첫 장 겉면에 8쪽과 1쪽이, 속면에 2쪽과 7쪽이 들어갑니다. 이렇게 인쇄 순서로 페이지를 재배치하는 것이 터잡기입니다.',
      },
      {
        heading: '크리프(밀림)',
        body: '장수가 많아지면 안쪽 페이지가 바깥보다 조금씩 튀어나옵니다(크리프). 재단하면 안쪽 페이지의 바깥 여백이 줄어들므로, 가장자리 가까운 요소는 크리프를 감안해 여백을 넉넉히 두세요.',
      },
      {
        heading: 'N-up 배치',
        body: '한 전지에 여러 페이지나 여러 부수를 앉혀 인쇄 효율을 높이는 것이 N-up입니다. 명함처럼 작은 인쇄물은 한 장에 여러 개를 모아 찍고 재단합니다.',
      },
    ],
    faq: [
      {
        q: '중철 페이지 수는 왜 4의 배수여야 하나요?',
        a: '종이 한 장을 접으면 4쪽이 되기 때문입니다. 4의 배수가 아니면 빈 페이지가 생깁니다. 20쪽이면 5장, 24쪽이면 6장이 필요합니다.',
      },
      {
        q: '터잡기를 직접 해야 하나요?',
        a: '임포지션 도구로 PDF를 인쇄 순서에 맞게 자동 재배치할 수 있습니다. 페이지 순서와 면 배치를 계산해 줍니다.',
      },
      {
        q: '크리프는 언제 신경 써야 하나요?',
        a: '페이지가 많은 두꺼운 중철일수록 영향이 큽니다. 안쪽 여백에 중요한 요소가 있으면 여유를 두세요.',
      },
    ],
    relatedTools: ['booklet', 'impose', 'nup'],
  },
  {
    slug: 'large-format-banner',
    title: '현수막·배너 제작 가이드 — 해상도, 그로멧, 마감',
    description:
      '대형 현수막과 배너의 해상도 기준, 그로멧(아일릿) 간격, 여백·마감 처리를 정리했습니다.',
    intro:
      '현수막·배너는 명함이나 책과 기준이 다릅니다. 크기가 크고 멀리서 보기 때문에 해상도는 낮아도 되지만, 그로멧 위치나 마감 여백을 잘못 잡으면 설치할 때 문제가 생깁니다. 이 가이드는 대형 출력의 해상도, 그로멧, 마감을 정리합니다.',
    sections: [
      {
        heading: '해상도는 낮아도 된다',
        body: '대형 출력은 보는 거리가 멀어 72~150 DPI면 충분합니다. 다만 실제 출력 크기 기준이어야 하므로, 1:1 크기에서 그 해상도를 만족하는지 확인하세요. 파일이 너무 커지면 1/10 크기에 10배 DPI로 작업하기도 합니다.',
      },
      {
        heading: '그로멧(아일릿)',
        body: '그로멧은 현수막을 끈으로 묶기 위해 가장자리에 뚫는 금속 고리입니다. 보통 모서리에 하나씩 두고 그 사이를 50~100cm 간격으로 배치합니다. 그로멧 위치에는 글자나 중요한 요소를 두지 마세요.',
      },
      {
        heading: '여백과 마감',
        body: '봉제(헤밍)나 접착으로 가장자리를 마감하면 그만큼 안쪽이 가려집니다. 마감 폭(보통 2~5cm)만큼 안전 여백을 두고, 배경은 가장자리까지 채워 마감 후에도 흰 부분이 보이지 않게 하세요.',
      },
      {
        heading: '재질과 용도',
        body: '실내 배너는 합성지·PVC, 실외 현수막은 방수·내후성 원단을 씁니다. 바람을 많이 받는 곳은 바람이 통하는 메시 원단이 안전합니다.',
      },
    ],
    faq: [
      {
        q: '현수막은 몇 DPI로 작업하나요?',
        a: '보는 거리가 멀어 72~150 DPI면 충분합니다. 실제 출력 크기 기준으로 확인하고, 파일이 크면 1/10 크기에 10배 DPI로 작업하세요.',
      },
      {
        q: '그로멧 간격은 얼마가 적당한가요?',
        a: '보통 모서리마다 하나씩 두고 그 사이를 50~100cm 간격으로 배치합니다. 그로멧 자리에는 글자를 두지 마세요.',
      },
      {
        q: '현수막에도 도련이 필요한가요?',
        a: '마감(봉제·접착) 폭만큼 배경을 더 채우고, 그 안쪽에 안전 여백을 둡니다. 마감 후 흰 가장자리가 보이지 않도록 하세요.',
      },
    ],
    relatedTools: ['grommet', 'size', 'res'],
  },
];

const en: Guide[] = [
  {
    slug: 'print-file-prep',
    title: 'How to Prepare a File for Printing — A Pre-Press Checklist',
    description:
      'A step-by-step checklist for resolution, color, bleed, and fonts before you send a file to the printer — so you avoid reprints and missed deadlines.',
    intro:
      'Print is one-way: once it runs, you cannot undo it. A file that looks fine on screen can come back blurry, color-shifted, or trimmed at the edge if the resolution is low, the color mode is RGB, or there is no bleed. This guide walks through the five things to check before you hand a file to the printer.',
    sections: [
      {
        heading: '1. Resolution — aim for 300 DPI',
        body: 'Print images are usually built at 300 DPI. Effective resolution is the pixel count divided by the placed size in inches, so a 1000px image placed at 10 inches is only 100 DPI. Large-format pieces viewed from a distance are fine at 150 DPI, but hold-in-hand print should stay at 300. Upscaling a small image in an editor only adds pixels, not real detail.',
      },
      {
        heading: '2. Color — work in CMYK',
        body: 'Screens add light (RGB); print stacks ink (CMYK). Vivid, saturated RGB colors dull when converted to CMYK, so design in CMYK where possible and check key colors against print. Set small black text as K100 (single channel), not a four-color rich black, so it stays crisp even if registration shifts.',
      },
      {
        heading: '3. Bleed and safe margin',
        body: 'Any design whose color or image runs to the edge needs 3mm of bleed on all sides to absorb trimming tolerance. Conversely, keep text and logos 3–5mm inside the trim (the safe margin) so they survive if the cut drifts. Build the file at the finished size plus bleed; the piece is then cut down to the finished size.',
      },
      {
        heading: '4. Font embedding',
        body: 'If the printer does not have your fonts, type reflows or breaks. When exporting to PDF, embed all fonts or convert them to outlines. Exporting with a PDF/X-1a or PDF/X-4 preset cleans up color, fonts, and transparency for print.',
      },
      {
        heading: '5. A final preflight check',
        body: 'Right before output, check the finished PDF once more for bleed, page size, image resolution, color mode, and font embedding. Catching issues on screen saves reprints and extra cost. Do not ignore warnings — fix them in the source and re-export.',
      },
    ],
    faq: [
      {
        q: 'What DPI should I use for printing?',
        a: 'Use 300 DPI for hold-in-hand pieces and about 150 DPI for large-format prints viewed from a distance. Effective DPI depends on placed size, so check it after placing.',
      },
      {
        q: 'Can I send an RGB file as-is?',
        a: 'Not recommended. Print is CMYK, so vivid RGB colors can dull. Convert to CMYK and check key colors first.',
      },
      {
        q: 'Do I really need bleed?',
        a: 'Yes, if any color or image touches the edge. Without bleed, a slight trim shift leaves a white sliver. 3mm per side is the common standard.',
      },
    ],
    relatedTools: ['pdf', 'res', 'bleed', 'color'],
  },
  {
    slug: 'bleed-and-trim',
    title: 'Bleed, Trim, and Crop Marks Explained — Sizing Your Artwork',
    description:
      'What bleed, trim size, safe margin, and crop/registration marks are, and how to calculate your working size — explained for real print production.',
    intro:
      'A trimming blade never cuts exactly the same spot twice. There is always a little drift, so you build artwork larger than the finished size (bleed) and keep important elements away from the edge (safe margin). This guide explains how bleed, trim, and marks relate, and how to size your working file.',
    sections: [
      {
        heading: 'What bleed is',
        body: 'Bleed is the area where color and images extend past the finished size. To avoid a white sliver when the cut drifts, anything touching the edge must fill all the way to the bleed. 3mm per side is the common standard; some printers ask for 1–5mm.',
      },
      {
        heading: 'Safe margin',
        body: 'The safe margin is the opposite: the distance you keep text and logos inside the trim, usually 3–5mm. It is a buffer so that important elements are not clipped if the cut drifts inward.',
      },
      {
        heading: 'Working size = finished size + bleed',
        body: 'Build the file at the finished size plus bleed on all sides. A 90×50mm business card with 3mm bleed has a working size of 96×56mm. The piece is cut to 90×50mm and the bleed is trimmed away.',
      },
      {
        heading: 'Crop marks and registration marks',
        body: 'Crop marks are corner lines that show where to cut; registration marks are targets that confirm the four CMYK plates line up. Marks sit outside the bleed, and registration marks are drawn in rich black so they print on every plate.',
      },
      {
        heading: 'Common mistakes',
        body: 'The most common mistake is working at the finished size with no bleed — a slight trim shift then shows a white line. Placing text too close to the edge risks clipping, so keep it inside the safe margin.',
      },
    ],
    faq: [
      {
        q: 'How much bleed is standard?',
        a: '3mm per side is the common standard. Some printers ask for 1–5mm, so check the spec sheet.',
      },
      {
        q: 'How do I calculate the working size?',
        a: 'Add bleed on all sides to the finished size: 90×50mm with 3mm bleed becomes 96×56mm. A bleed calculator gives it instantly.',
      },
      {
        q: 'Do I have to draw crop and registration marks myself?',
        a: 'A printer-marks tool can add them to the PDF automatically, placed outside the bleed.',
      },
    ],
    relatedTools: ['bleed', 'marks', 'impose'],
  },
  {
    slug: 'cmyk-vs-rgb',
    title: 'CMYK vs RGB for Print — Color and Gamut',
    description:
      'Why screen (RGB) and print (CMYK) colors differ, how gamut and conversion work, plus soft proofing and K100 vs rich black — the basics of print color.',
    intro:
      'The color you see on screen often differs from the printed result. Screens add light (RGB) while print stacks ink (CMYK), so the two have different ranges (gamuts). This guide explains the difference and how to predict print color.',
    sections: [
      {
        heading: 'RGB vs CMYK',
        body: 'RGB adds red, green, and blue light (additive) and is used on screens and the web. CMYK overlays cyan, magenta, yellow, and black ink to subtract light (subtractive) and is used in print. The two spaces have different ranges, so colors do not map one-to-one.',
      },
      {
        heading: 'Gamut and out-of-gamut color',
        body: 'The CMYK gamut is narrower than RGB, so highly saturated colors like neon green or strong blue cannot be reproduced and dull in print. Colors outside the CMYK gamut are called out-of-gamut. Check brand colors and logos so they do not shift noticeably in print.',
      },
      {
        heading: 'ICC profiles and conversion',
        body: 'RGB↔CMYK conversion depends on ink, paper, and press conditions, so a simple formula is inaccurate. Converting through a standard CMYK ICC profile is more reliable than a formula-based approximation. If your printer provides a profile (e.g. FOGRA, SWOP), convert under those conditions.',
      },
      {
        heading: 'Preview with soft proofing',
        body: 'Soft proofing converts an image through a CMYK profile to approximate print color on screen. It reports the out-of-gamut share so you can find colors that will dull and lower their saturation or adjust them. The screen is still a simulation, so confirm final color with a printed proof.',
      },
      {
        heading: 'K100 vs rich black',
        body: 'Set small black text and thin lines as K100 (single-channel black), not a four-color rich black, so they stay crisp if registration shifts. For large black areas you may use rich black for a deeper black. Match the choice to the use.',
      },
    ],
    faq: [
      {
        q: 'Why does color change when I convert RGB to CMYK?',
        a: 'Because the two color spaces have different ranges (gamuts). Vivid, saturated RGB colors cannot be reproduced in CMYK and dull.',
      },
      {
        q: 'Can I preview print color in advance?',
        a: 'A soft-proof tool simulates an image in CMYK and shows the approximate print color and out-of-gamut share. Confirm exact color with a printed proof.',
      },
      {
        q: 'Should black be K100 or rich black?',
        a: 'Use K100 for small text and thin lines; use rich black for large black areas that need a deeper black.',
      },
    ],
    relatedTools: ['color', 'proof', 'convert'],
  },
  {
    slug: 'resolution-and-dpi',
    title: 'Print Resolution and DPI — How to Avoid Blurry Output',
    description:
      'The difference between DPI, PPI, and effective resolution, plus how to size your pixels for the print size. Why images come out blurry and how to fix it.',
    intro:
      'Low resolution is the most common reason print comes out blurry. An image that looks sharp on screen can break up once it is placed at the real print size, where there are not enough pixels. This guide explains what DPI means and how many pixels you need to print sharply at a given size.',
    sections: [
      {
        heading: 'DPI vs PPI',
        body: 'DPI (dots per inch) is how many dots the press lays down per inch; PPI (pixels per inch) is how many pixels the image packs per inch. The terms are used interchangeably in practice, but in the design stage what matters is the image’s pixel density (PPI).',
      },
      {
        heading: 'Effective resolution',
        body: 'The same image loses resolution as you place it larger. Effective resolution = image width in pixels ÷ placed width in inches. A 3000px image placed at 10 inches is 300 DPI, but stretched to 20 inches it drops to 150 DPI.',
      },
      {
        heading: 'Recommended DPI by use',
        body: 'Hold-in-hand pieces (business cards, brochures, books) want 300 DPI. A poster viewed from 1–2m is fine at 150 DPI, and a large banner viewed from far away works at 72–100 DPI. The farther the viewing distance, the lower the resolution you can get away with.',
      },
      {
        heading: 'Why upscaling does not help',
        body: 'Enlarging a small image in an editor only adds pixels — it cannot invent detail that was not there (upscaling). AI upscalers have limits too, so it is safest to start from a large enough original or a vector (SVG, AI).',
      },
      {
        heading: 'Calculating the pixels you need',
        body: 'Pixels needed = print size in inches × target DPI. Filling A4 (about 8.27×11.69 inches) at 300 DPI needs roughly 2480×3508px. A resolution calculator or a size-to-pixels converter gives it instantly.',
      },
    ],
    faq: [
      {
        q: 'What DPI do I need for print?',
        a: '300 DPI is the baseline for hold-in-hand pieces. Posters are fine at 150 DPI and large banners at 72–100 DPI. The farther the viewing distance, the lower it can be.',
      },
      {
        q: 'Does enlarging an image improve resolution?',
        a: 'No. Upscaling only adds pixels without adding detail, so it tends to look worse. Use a large enough original or a vector instead.',
      },
      {
        q: 'What is effective resolution?',
        a: 'It is the resolution once the image is placed at the real print size — pixel count ÷ placed size in inches. The larger you place it, the lower it gets.',
      },
    ],
    relatedTools: ['res', 'size', 'pdf'],
  },
  {
    slug: 'paper-weight-gsm',
    title: 'Paper Weight (GSM) and Thickness — Choosing Stock and Spine',
    description:
      'The difference between GSM and US pound (lb), how to pick a weight by use, and how to calculate spine thickness from page count.',
    intro:
      'Paper weight is the first number you look at when choosing stock. The same "thick" means one thing for a business card and another for a book cover, and metric GSM and US lb are written so differently that they are easy to confuse. This guide covers what weight means, how to choose by use, and how to calculate the spine.',
    sections: [
      {
        heading: 'What GSM is',
        body: 'GSM (g/m²) is the weight of one square meter of paper. Because it is an absolute unit independent of paper type, it is easy to compare. Rough guides: copy paper 80, general flyers 100–150, business cards 250–300, book covers 250 and up.',
      },
      {
        heading: 'GSM vs US pound (lb)',
        body: 'The US labels stock in pounds, but each type uses a different basis sheet size, so the same thickness gets a different number. 80lb Text and 80lb Cover are completely different thicknesses. Convert to GSM to compare.',
      },
      {
        heading: 'Weight is not thickness (caliper)',
        body: 'Weight is mass; caliper is actual thickness. Two papers at the same GSM can differ in thickness depending on density. A measured per-sheet thickness is more accurate for a spine than weight, but weight gives a usable approximation.',
      },
      {
        heading: 'Spine thickness',
        body: 'Spine thickness is roughly (interior page count ÷ 2) × per-sheet thickness + cover thickness. More pages and thicker paper make a thicker spine. The binding method (perfect binding, saddle stitch, etc.) changes it too.',
      },
    ],
    faq: [
      {
        q: 'What GSM is a business card?',
        a: '250–300 GSM is common. Heavier premium cards may use 350 GSM or more.',
      },
      {
        q: 'What is 80lb in GSM?',
        a: 'It depends on the type. 80lb Text is about 118 GSM and 80lb Cover about 216 GSM, so you have to know the type.',
      },
      {
        q: 'How do I find spine thickness?',
        a: 'Enter the page count, paper weight or thickness, and binding method into a spine calculator and it returns the value in millimeters.',
      },
    ],
    relatedTools: ['weight', 'gsm', 'spine'],
  },
  {
    slug: 'saddle-stitch-booklet',
    title: 'Saddle-Stitch Booklets and Imposition — Page Count and Order',
    description:
      'Why saddle-stitch page counts must be a multiple of four, plus imposition, creep, and N-up layout explained for real production.',
    intro:
      'When you make a booklet or catalog with saddle stitch (stapled at the center fold), getting the page count or order wrong means the book does not line up after printing. This guide covers the multiple-of-four rule, imposition, creep, and N-up layout for ganging multiple pieces on a sheet.',
    sections: [
      {
        heading: 'Why a multiple of four',
        body: 'Folding one sheet in half gives four pages, front and back. Saddle stitch nests these folded sheets, so the total page count must always be a multiple of four. If it falls short, blank pages are added to make up the difference.',
      },
      {
        heading: 'Imposition',
        body: 'Once bound, pages that are physically far apart print on the same sheet. In an 8-page booklet, the outer side of the first sheet holds pages 8 and 1, and the inner side holds pages 2 and 7. Rearranging pages into this printing order is called imposition.',
      },
      {
        heading: 'Creep (push-out)',
        body: 'As page count grows, the inner pages stick out slightly past the outer ones (creep). Trimming then shaves the outer margin of the inner pages, so keep elements near the edge well inside the margin to account for it.',
      },
      {
        heading: 'N-up layout',
        body: 'N-up gangs several pages or copies onto one sheet to print more efficiently. Small pieces like business cards are printed many-up on a sheet and then cut apart.',
      },
    ],
    faq: [
      {
        q: 'Why must saddle-stitch pages be a multiple of four?',
        a: 'Because folding one sheet makes four pages. If the count is not a multiple of four, you end up with blank pages. 20 pages needs 5 sheets, 24 pages needs 6.',
      },
      {
        q: 'Do I have to impose the pages myself?',
        a: 'An imposition tool can reorder a PDF into printing order automatically, calculating the page sequence and sheet layout for you.',
      },
      {
        q: 'When does creep matter?',
        a: 'The thicker the booklet and the higher the page count, the bigger the effect. Leave extra room if important elements sit in the inner margin.',
      },
    ],
    relatedTools: ['booklet', 'impose', 'nup'],
  },
  {
    slug: 'large-format-banner',
    title: 'Banners and Large-Format Printing — Resolution, Grommets, Finishing',
    description:
      'Resolution standards for large banners, grommet (eyelet) spacing, and margin and finishing — explained for outdoor and indoor display.',
    intro:
      'Banners follow different rules than business cards or books. They are large and viewed from a distance, so resolution can be low — but getting grommet positions or finishing margins wrong causes problems at install. This guide covers resolution, grommets, and finishing for large-format output.',
    sections: [
      {
        heading: 'Resolution can be low',
        body: 'Large-format output is viewed from far away, so 72–150 DPI is plenty. It just has to hold at the real output size, so check the resolution at 1:1 — or, if the file gets too big, work at 1/10 scale with 10× the DPI.',
      },
      {
        heading: 'Grommets (eyelets)',
        body: 'Grommets are the metal rings punched along the edge so the banner can be tied down. Typically one at each corner, with the rest spaced 50–100cm apart. Keep text and important elements away from where grommets land.',
      },
      {
        heading: 'Margin and finishing',
        body: 'Hemming or gluing the edges covers part of the artwork. Keep a safe margin equal to the finishing width (usually 2–5cm), and fill the background to the very edge so no white shows after finishing.',
      },
      {
        heading: 'Material and use',
        body: 'Indoor banners use synthetic paper or PVC; outdoor banners use waterproof, weather-resistant fabric. In windy locations, a mesh fabric that lets air through is safer.',
      },
    ],
    faq: [
      {
        q: 'What DPI should a banner be?',
        a: 'Viewed from a distance, 72–150 DPI is enough. Check it at the real output size, and if the file is too large, work at 1/10 scale with 10× DPI.',
      },
      {
        q: 'How far apart should grommets be?',
        a: 'Usually one at each corner with the rest spaced 50–100cm apart. Keep text out of the grommet positions.',
      },
      {
        q: 'Do banners need bleed?',
        a: 'Fill the background out by the finishing (hem/glue) width and keep a safe margin inside it, so no white edge shows after finishing.',
      },
    ],
    relatedTools: ['grommet', 'size', 'res'],
  },
];

export const GUIDES: Record<Locale, Guide[]> = { ko, en };

export function getGuide(locale: Locale, slug: string): Guide | undefined {
  return GUIDES[locale].find((g) => g.slug === slug);
}
