import { getCaseStudySummary } from '@/content/caseStudies';
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
      title: '종이 평량(GSM): ISO 536이 정의하는 범위',
      description:
        'ISO 536의 평량 정의와 측정 범위를 설명하고, 용지 선택과 두께·책등 판단은 별도 자료가 필요한 이유를 구분합니다.',
      publishedAt: '2026-08-09',
      updatedAt: '2026-08-09',
      intro:
        'GSM은 종이를 비교할 때 유용하지만, 숫자 하나로 두께나 용도까지 확정할 수는 없습니다. 이 가이드는 ISO 536이 뒷받침하는 내용과 공급업체 자료로 따로 확인할 내용을 분리합니다.',
      sections: [
        {
          heading: 'ISO 536이 정의하는 값',
          body: 'ISO 536은 종이와 판지의 평량, 즉 단위 면적당 질량(g/m²)을 측정하는 방법을 정의합니다. 이 출처는 평량의 정의와 측정 범위에만 근거로 사용합니다.',
        },
        {
          heading: '표준의 범위 밖에 있는 판단',
          body: 'ISO 536은 용도별 GSM 권장 범위, 미국식 lb 변환, 캘리퍼(장당 두께), 책등 계산을 포함하지 않습니다. 이런 값은 선택한 종이의 제지사 사양서와 제작 업체의 제본 조건에서 확인해야 합니다.',
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
      title: '대형 배너 파일 인계: 도련과 업체별 제작 조건',
      description:
        'Adobe가 설명하는 도련의 범위와, 대형 배너에서 제작 업체에 별도로 확인해야 하는 조건을 구분합니다.',
      publishedAt: '2026-08-09',
      updatedAt: '2026-08-09',
      intro:
        '대형 배너는 크기와 설치 방식에 따라 파일 조건이 크게 달라집니다. 여기서는 Adobe 도련 안내가 뒷받침하는 파일 경계 개념만 설명하고, 나머지는 업체별 사양으로 명확히 분리합니다.',
      sections: [
        {
          heading: 'Adobe 출처가 뒷받침하는 도련',
          body: 'Adobe 안내는 재단 오차에 대비해 배경이나 이미지가 재단선 밖의 도련 영역까지 이어져야 한다는 개념과 InDesign의 도련 설정을 설명합니다. 이 출처는 그 범위에만 사용합니다.',
        },
        {
          heading: '제작 업체에서 받아야 하는 조건',
          body: '최종 크기에서의 해상도, 아일렛 위치, 마감 여유, 소재, 축척 방식은 Adobe 도련 안내가 정하지 않는 업체별 제작 조건입니다. 작업 전에 제작 사양서를 받아 각각의 값을 확인하세요.',
        },
        {
          heading: '파일 인계 전 기록할 항목',
          body: '최종 크기와 파일 축척, 업체가 요구한 도련, 중요 요소의 안전 영역을 주문 사양과 함께 기록하세요. 이 사이트의 계산 결과는 설치 강도나 실제 가공 적합성을 판정하지 않습니다.',
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
      title: 'Paper grammage (GSM): what ISO 536 defines',
      description:
        'Separate the ISO 536 definition of grammage from stock selection, thickness, and spine decisions that need other evidence.',
      publishedAt: '2026-08-09',
      updatedAt: '2026-08-09',
      intro:
        'GSM is useful for comparing paper mass, but one number cannot establish thickness or suitability for a job. This guide separates what ISO 536 supports from what must come from a stock or provider specification.',
      sections: [
        {
          heading: 'What ISO 536 defines',
          body: 'ISO 536 defines grammage for paper and board as mass per unit area, expressed in g/m², and specifies how it is determined. This source is used only for that definition and measurement scope.',
        },
        {
          heading: 'Decisions outside the standard',
          body: 'ISO 536 does not define application-specific GSM ranges, lb conversion, caliper, or spine calculations. Use the selected stock data sheet and the provider’s binding specification for those decisions.',
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
      title: 'Large-format artwork handoff: bleed and provider specifications',
      description:
        'Separate the bleed concept supported by Adobe from the job-specific requirements a large-format provider must supply.',
      publishedAt: '2026-08-09',
      updatedAt: '2026-08-09',
      intro:
        'Large-format file requirements vary with size, equipment, finishing, and installation. This guide uses Adobe only for the bleed boundary concept and clearly separates every provider-specific production input.',
      sections: [
        {
          heading: 'What the Adobe source supports',
          body: 'Adobe explains bleed as artwork extending beyond the trim boundary to allow for finishing variation, together with InDesign bleed settings. The source is used only for that scope.',
        },
        {
          heading: 'Inputs your provider must supply',
          body: 'Resolution at final size, grommet placement, finishing allowance, material, and scale are provider-specific requirements that the Adobe bleed guide does not define. Obtain a job specification before preparing the file.',
        },
        {
          heading: 'Record before handoff',
          body: 'Record final dimensions, file scale, the requested bleed, and the safe area for important elements beside the order specification. These calculators do not determine installation strength or physical finishing suitability.',
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
