import { getCaseStudySummary } from '@/content/caseStudies';
import { guideSlugs, type GuideSlug } from '@/content/guideSlugs';
import type { SourceId } from '@/content/sources';
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

export { guideSlugs, type GuideSlug } from '@/content/guideSlugs';

interface GuideSummaryBase {
  slug: GuideSlug;
  title: string;
  description: string;
  updatedAt: string;
  relatedTools: ToolId[];
}

export interface CaseStudySummary extends GuideSummaryBase {
  kind: 'case-study';
}

export interface EditorialGuide extends GuideSummaryBase {
  kind: 'editorial';
  publishedAt: string;
  intro: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  sourceIds: SourceId[];
}

export type GuideSummary = CaseStudySummary | EditorialGuide;

const editorialGuides: Record<Locale, EditorialGuide[]> = {
  ko: [
    {
      slug: 'paper-weight-gsm',
      kind: 'editorial',
      title: '종이 평량(GSM)으로 A4 500매 발주 무게 계산하기',
      description:
        'A4 80 GSM 500매의 이론 무게를 직접 계산하고, 120 GSM 변경안과 비교한 뒤 발주·포장·제본 확인 항목을 정리합니다.',
      publishedAt: '2026-08-09',
      updatedAt: '2026-10-18',
      intro:
        'A4 낱장 안내문 500매를 발주한다고 가정하고, 종이 자체의 무게와 용지 변경 영향을 계산합니다. 아래 값은 치수와 평량으로 계산한 예시이지 실물 측정 결과가 아닙니다. 계산을 마치면 발주서에 넣을 수 있는 수량·규격·이론 무게와 별도 확인할 조건이 남습니다.',
      sections: [
        {
          heading: '1. 입력값: 페이지가 아니라 실제 종이 장수',
          body: '완성 낱장 크기 210×297mm, 평량 80g/m², 수량 500매를 종이 무게 계산기에 입력합니다. 양면에 인쇄하더라도 종이 500매는 그대로입니다. 원고가 1,000쪽이라는 이유로 수량을 1,000으로 입력하지 마세요. 여러 장을 묶는 책자라면 표지와 내지의 실제 장수를 따로 구하고 각 종이의 GSM으로 나누어 계산해야 합니다.',
        },
        {
          heading: '2. 손으로 검산: 500매는 2.4948kg',
          body: '한 장 면적은 0.210m × 0.297m = 0.06237m²입니다. 여기에 80g/m²를 곱하면 장당 4.9896g, 다시 500매를 곱하면 2,494.8g = 2.4948kg입니다. 화면에 약 2.5kg로 반올림되어도 원래 계산은 같습니다. mm를 그대로 곱하면 면적 단위가 틀어지므로, 먼저 m로 바꾸거나 mm² 결과를 1,000,000으로 나눕니다.',
        },
        {
          heading: '3. 120 GSM으로 변경할지 결정하기',
          body: '크기와 수량을 유지하고 120 GSM으로 바꾸면 0.06237 × 120 × 500 = 3,742.2g = 3.7422kg입니다. 차이는 1.2474kg이며 종이 무게가 50% 증가합니다. 이 비교로 운반 부담을 가늠할 수 있지만 더 두껍다거나 양면 비침이 충분히 줄어든다고 판정할 수는 없습니다. 불투명도·표면·필기성 같은 요구는 선택한 품목의 사양서와 견본으로 별도 확인하세요.',
        },
        {
          heading: '4. 종이 선택에서 혼동하기 쉬운 두 가지',
          body: '미국식 100lb처럼 종류가 빠진 표기는 바로 비교하지 마세요. 평량 변환기에서 Bond·Text·Cover 중 공급업체가 명시한 종류를 선택하고, 가능하면 품목의 GSM 표기를 우선 확인합니다. 또 GSM에서 책등을 확정하지 마세요. 이 사이트의 책등 도구는 고정 벌크 계수로 캘리퍼를 추정하며, 실제 두께·코팅·압착·접착 조건은 반영하지 못합니다.',
        },
        {
          heading: '5. 발주·배송 인계 체크리스트',
          body: '발주서에 품목명과 사양서 버전, 완성 낱장 210×297mm, 80 GSM, 실제 수량 500매, 종이 자체 이론 무게 2.4948kg를 기록합니다. 재단 전 큰 용지를 구매한다면 완성 낱장 대신 구매 전지 규격과 전지 매수로 다시 계산하세요. 인쇄소와 합의한 여분 수량은 계산 수량에 추가하고, 운임 확정에는 포장·잉크·부자재를 포함한 완성 포장을 실제로 달아야 합니다. 이 도구는 그 실측 무게를 제공하지 않습니다.',
        },
        {
          heading: '출처의 범위와 이 예제의 한계',
          body: 'ISO 536은 종이·판지의 평량을 측정하는 방법에 대한 근거입니다. 여기서 GSM은 단위 면적당 질량(g/m²)으로 사용했습니다. 위의 무게 비교는 면적 × 평량 × 장수라는 산술 예시이며, ISO가 용도별 권장 GSM, lb 환산표, 두께나 책등값을 정한다는 뜻은 아닙니다. 제조 허용차·수분 변화·납품 중량은 공급업체 자료와 실제 계량으로 확인해야 합니다.',
        },
      ],
      faq: [
        {
          q: 'GSM은 무엇을 나타내나요?',
          a: '종이 또는 판지 1m²의 질량을 그램으로 나타낸 평량입니다.',
        },
        {
          q: '같은 GSM이면 두께도 같나요?',
          a: '그렇지 않습니다. ISO 536은 평량을 다루며 캘리퍼를 정하지 않습니다. 실제 장당 두께는 선택한 종이 사양서에서 확인하세요.',
        },
      ],
      sourceIds: ['iso536'],
      relatedTools: ['weight', 'gsm', 'spine'],
    },
    {
      slug: 'large-format-banner',
      kind: 'editorial',
      title: '3m 배너 준비: 축척·해상도·도련 인계하기',
      description:
        '3000×1000mm 배너를 1:10으로 작업하는 예제로 최종 DPI, 도련, 아일렛 수량과 인쇄소 전달 체크리스트를 정리합니다.',
      publishedAt: '2026-08-09',
      updatedAt: '2026-10-18',
      intro:
        '완성 크기 3000×1000mm 배너 한 장을 인쇄소에 넘기는 계산 예제입니다. 아래의 150 DPI·10mm 도련·50mm 안전 여유·600mm 아일렛 간격은 설명을 위한 가정이지 제작 권장값이 아닙니다. 실제 업체 사양으로 바꿔 따라 하고, 축척을 명시한 PDF와 주문 조건을 함께 인계하세요. 실물 출력이나 설치 시험을 했다는 뜻은 아닙니다.',
      sections: [
        {
          heading: '1. 파일을 열기 전에 제작 조건부터 받기',
          body: '인쇄소에 완성 크기와 소재, 실내·실외 용도, 봉제·접착·보강 방식, 허용 축척, 최종 크기에서 필요한 이미지 DPI, 도련과 중요 요소 안전 여유를 확인합니다. 아일렛 중심 위치와 마감 여유도 별도로 받으세요. 가장자리 봉제 여유와 재단 도련은 용도가 다르므로 같은 숫자로 대신하지 않습니다. 업체가 원본 크기 작업을 요구하면 이 예제의 1:10 축척을 쓰지 마세요.',
        },
        {
          heading: '2. 1:10 작업판과 도련 계산',
          body: '완성 3000×1000mm를 1:10으로 줄이면 재단 크기는 300×100mm입니다. 가정한 최종 도련 10mm는 파일에서 사방 1mm이므로, 도련 포함 크기는 302×102mm입니다. 중요 요소의 최종 안전 여유 50mm는 파일에서 5mm 안쪽입니다. 문서의 재단 크기와 별도 도련 설정을 구분하고 배경을 도련 끝까지 연장하세요. 300×100mm PDF의 이름에만 “3m”를 넣으면 축척 전달이 끝나는 것은 아닙니다.',
        },
        {
          heading: '3. 해상도는 최종 크기에서 검산',
          body: '12000×4000px 이미지를 완성 배너 전체에 놓으면 12000 ÷ (3000 ÷ 25.4) = 101.6 DPI입니다. 이 예제의 가정인 최종 150 DPI에는 부족합니다. 같은 비율의 18000×6000px 원본을 쓰면 152.4 DPI가 됩니다. 1:10 작업 파일 안에서는 각각 1016 DPI와 1524 DPI로 보이지만 10배 확대 출력하면 다시 101.6과 152.4 DPI입니다. DPI 태그만 1500으로 바꾸거나 픽셀을 보간해 늘리는 것은 원본 디테일 복원이 아닙니다.',
        },
        {
          heading: '4. 아일렛 계산은 수량 검산으로만 사용',
          body: '아일렛 도구에 최종 가로 3000mm, 세로 1000mm, 목표 간격 600mm를 넣으면 긴 변은 600mm씩 5구간으로 6개, 짧은 변은 500mm씩 2구간으로 3개입니다. 모서리를 중복 계산하지 않은 전체 수량은 2×6 + 2×3 − 4 = 14개입니다. 도구는 모서리에 중심을 놓는 직사각형 모델이며 오프셋 입력이 없습니다. 실제 구멍 중심의 안쪽 거리·보강·하중은 이 수량으로 결정할 수 없으므로 제작 도면은 업체 승인을 받으세요.',
        },
        {
          heading: '5. 내보낸 바로 그 PDF를 다시 확인',
          body: '업체가 지정한 PDF 설정과 출력 프로파일로 내보내고, 원본이 아니라 납품할 PDF를 다시 엽니다. 페이지 크기가 축척과 맞는지, 잘림·폰트·중요 요소·도련 배경을 확대 확인합니다. 이 사이트 PDF 검사의 300 DPI 경고는 일반 검토 기준이므로 축척과 업체 기준을 대입해 해석하세요. BleedBox가 있다고 아트워크 연장까지 확인된 것은 아니며, RGB 검출만으로 자동 불합격 또는 무조건 CMYK 변환을 뜻하지도 않습니다.',
        },
        {
          heading: '6. 인쇄소 전달 체크리스트',
          body: 'PDF 파일명·수정 버전, 최종 3000×1000mm, 파일 재단 300×100mm, 1:10 축척·1000% 출력, 최종/파일 도련 10/1mm, 안전 여유 50/5mm를 주문서에 함께 적습니다. 여기에 소재·마감, 요청 해상도와 원본 픽셀, 색상 프로파일, 아일렛 수량과 업체 승인 배치도를 첨부하세요. 축척·마감·색상 조건이 한 가지라도 미확정이면 그 항목을 표시해 회신받고 제작을 진행합니다.',
        },
        {
          heading: '출처가 설명하는 것과 설명하지 않는 것',
          body: 'Adobe 출처는 재단선 밖으로 배경을 이어 두는 도련 개념과 InDesign 설정에만 사용합니다. 이 예제의 치수·픽셀·수량은 계산으로 얻은 값입니다. Adobe가 배너의 150 DPI, 아일렛 간격, 안전 여유, 소재 또는 설치 강도를 정한 것이 아니며, 이 사이트도 실제 가공 적합성이나 설치 안전을 판정하지 않습니다.',
        },
      ],
      faq: [
        {
          q: '배너의 권장 DPI를 여기서 정할 수 있나요?',
          a: '아닙니다. 최종 크기, 시청 거리, 출력 장비에 따라 달라지므로 제작 업체가 제공한 해상도 기준을 따르세요.',
        },
        {
          q: '아일렛과 마감 여유도 Adobe 도련 안내의 범위인가요?',
          a: '아닙니다. 아일렛 배치와 마감 여유는 설치·가공 방식에 따른 업체별 조건입니다.',
        },
      ],
      sourceIds: ['adobeBleed'],
      relatedTools: ['grommet', 'size', 'res'],
    },
  ],
  en: [
    {
      slug: 'paper-weight-gsm',
      kind: 'editorial',
      title: 'Use GSM to estimate an order of 500 A4 sheets',
      description:
        'Calculate the paper mass of 500 A4 sheets at 80 GSM, compare a 120 GSM alternative, and prepare an order and packing handoff.',
      publishedAt: '2026-08-09',
      updatedAt: '2026-10-18',
      intro:
        'Assume an order of 500 loose A4 information sheets. Work out the paper-only mass and the effect of changing stock. These are dimensional calculations, not measured print results. The finished task is an order record with sheet count, size, theoretical mass, and clearly separated checks still needed from the supplier.',
      sections: [
        {
          heading: '1. Inputs: count physical sheets, not document pages',
          body: 'Enter a finished sheet size of 210×297mm, grammage of 80g/m², and quantity of 500 in the paper-weight calculator. Printing on both sides still uses 500 sheets. Do not enter 1,000 just because the artwork has 1,000 printed sides. For bound products, determine physical cover and interior sheet counts separately, then calculate each stock with its own GSM.',
        },
        {
          heading: '2. Hand check: 500 sheets weigh 2.4948kg',
          body: 'One sheet has an area of 0.210m × 0.297m = 0.06237m². Multiply by 80g/m² to get 4.9896g per sheet, then by 500 to get 2,494.8g = 2.4948kg. A rounded display of about 2.5kg represents the same calculation. Convert millimetres to metres before multiplying, or divide the area in mm² by 1,000,000; mixing these units produces a very different result.',
        },
        {
          heading: '3. Decide what a change to 120 GSM means',
          body: 'Keeping size and count fixed, 120 GSM gives 0.06237 × 120 × 500 = 3,742.2g = 3.7422kg. That adds 1.2474kg, a 50% increase in paper mass. Use the comparison to plan handling, not to establish thickness or sufficient resistance to show-through. Check opacity, surface and writing performance against the named stock specification and samples.',
        },
        {
          heading: '4. Avoid two stock-selection shortcuts',
          body: 'A label such as 100lb without its stock category is not enough to compare paper. Select the supplier’s Bond, Text or Cover category in the grammage converter and prefer a directly stated GSM where available. Nor does GSM establish a final spine width. This site’s spine calculator infers caliper with a fixed bulk heuristic; it cannot account for the selected stock’s thickness, coating, compression and adhesive conditions.',
        },
        {
          heading: '5. Order and shipping handoff checklist',
          body: 'Record the stock name and data-sheet version, finished sheet size 210×297mm, 80 GSM, 500 physical sheets, and paper-only theoretical mass 2.4948kg. If buying parent sheets, calculate again with the purchased parent size and count instead of finished pieces. Add any agreed production overs to the quantity. For a shipping quote, weigh the completed package including ink, packing and accessories; this tool does not supply that measured weight.',
        },
        {
          heading: 'Source scope and limits of the example',
          body: 'ISO 536 supports the method for determining paper and board grammage. Here GSM means mass per unit area in g/m². The comparison above is area × grammage × sheet count arithmetic; it does not mean ISO specifies application-specific GSM recommendations, lb conversions, caliper or spine values. Manufacturing tolerance, moisture and delivered mass need supplier evidence and actual weighing.',
        },
      ],
      faq: [
        {
          q: 'What does GSM measure?',
          a: 'It states the mass in grams of one square metre of paper or board.',
        },
        {
          q: 'Does equal GSM mean equal thickness?',
          a: 'No. ISO 536 covers grammage, not caliper. Check the selected stock data sheet for actual sheet thickness.',
        },
      ],
      sourceIds: ['iso536'],
      relatedTools: ['weight', 'gsm', 'spine'],
    },
    {
      slug: 'large-format-banner',
      kind: 'editorial',
      title: 'Prepare a 3m banner: scale, resolution and bleed handoff',
      description:
        'Work through a 3000×1000mm banner at 1:10 scale, checking final DPI, bleed, grommet quantities and the provider handoff.',
      publishedAt: '2026-08-09',
      updatedAt: '2026-10-18',
      intro:
        'This calculated example prepares one finished 3000×1000mm banner. The 150 DPI, 10mm bleed, 50mm safety allowance and 600mm grommet spacing below are illustrative assumptions, not production recommendations. Replace them with the provider’s specification and deliver an explicitly scaled PDF with the order conditions. No physical output or installation test is claimed.',
      sections: [
        {
          heading: '1. Obtain production conditions before opening artwork',
          body: 'Ask the provider for finished size, material, indoor/outdoor use, seams or bonded finishing, reinforcement, allowed scale, image DPI at final size, bleed, and the safe area for important content. Obtain grommet-centre positions and finishing allowances separately. A seam allowance and print bleed serve different purposes; do not substitute one for the other. If full-size artwork is required, do not use this example’s 1:10 scale.',
        },
        {
          heading: '2. Calculate the 1:10 document and bleed',
          body: 'A 3000×1000mm final size becomes a 300×100mm trim at 1:10. The assumed final bleed of 10mm becomes 1mm on each side in the file, giving 302×102mm including bleed. A final safety allowance of 50mm becomes 5mm inside the file trim. Keep document trim and bleed settings separate, and extend backgrounds to the bleed edge. Naming a 300×100mm PDF “3m” does not by itself communicate all output instructions.',
        },
        {
          heading: '3. Check resolution at finished size',
          body: 'A 12000×4000px image covering the finished banner gives 12000 ÷ (3000 ÷ 25.4) = 101.6 DPI, below this example’s assumed final 150 DPI requirement. An 18000×6000px original at the same size gives 152.4 DPI. In the 1:10 file these appear as 1016 and 1524 DPI, but a tenfold enlargement returns them to 101.6 and 152.4 DPI. Changing a DPI tag to 1500 or interpolating more pixels does not recover original detail.',
        },
        {
          heading: '4. Use grommet geometry only as a quantity check',
          body: 'Enter final width 3000mm, height 1000mm, and target spacing 600mm. Each long edge has five 600mm segments and six points; each short edge has two 500mm segments and three points. Counting shared corners once gives 2×6 + 2×3 − 4 = 14 grommets. This rectangular calculator anchors points at corners and has no offset input. It cannot establish actual inward hole-centre distances, reinforcement or loads; obtain provider approval of the production drawing.',
        },
        {
          heading: '5. Reopen the actual PDF to be delivered',
          body: 'Export with the provider’s PDF settings and output profile, then reopen the delivery PDF rather than only reviewing the source. Check its scale and page size, clipping, fonts, important content and bleed artwork. Interpret this site’s 300 DPI preflight warning using the scale and provider’s final-size requirement. A BleedBox does not verify artwork extension; an RGB flag is neither automatic rejection nor an instruction to convert everything to CMYK.',
        },
        {
          heading: '6. Provider handoff checklist',
          body: 'Record the PDF filename and revision, final size 3000×1000mm, file trim 300×100mm, 1:10 scale with 1000% output, final/file bleed 10/1mm, and safety allowance 50/5mm. Include material and finishing, required resolution and source pixel dimensions, output profile, grommet quantity and approved placement drawing. Mark any unresolved scale, finishing or color condition and obtain confirmation before production.',
        },
        {
          heading: 'What the source does and does not support',
          body: 'Adobe is cited only for artwork extending beyond trim and for InDesign bleed settings. The dimensions, pixel densities and quantities in this example are calculated. Adobe does not establish the example’s 150 DPI, grommet spacing, safe area, material or installation strength. Neither does this site determine physical finishing suitability or installation safety.',
        },
      ],
      faq: [
        {
          q: 'Does this guide set a banner DPI?',
          a: 'No. Use the provider’s resolution requirement for the final dimensions, viewing condition, and output equipment.',
        },
        {
          q: 'Does Adobe’s bleed guide specify grommets and finishing allowance?',
          a: 'No. Those are provider-specific installation and finishing requirements.',
        },
      ],
      sourceIds: ['adobeBleed'],
      relatedTools: ['grommet', 'size', 'res'],
    },
  ],
};

export function getEditorialGuide(locale: Locale, slug: string): EditorialGuide | undefined {
  return editorialGuides[locale].find((guide) => guide.slug === slug);
}

export function getGuideSummary(locale: Locale, slug: string): GuideSummary | undefined {
  return getCaseStudySummary(locale, slug) ?? getEditorialGuide(locale, slug);
}

export const GUIDES: Record<Locale, GuideSummary[]> = {
  ko: guideSlugs.flatMap((slug) => {
    const guide = getGuideSummary('ko', slug);
    return guide ? [guide] : [];
  }),
  en: guideSlugs.flatMap((slug) => {
    const guide = getGuideSummary('en', slug);
    return guide ? [guide] : [];
  }),
};
