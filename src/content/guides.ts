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

export interface GuideSummary {
  slug: GuideSlug;
  kind: 'case-study' | 'editorial';
  title: string;
  description: string;
  updatedAt: string;
  relatedTools: ToolId[];
}

export interface EditorialGuide extends GuideSummary {
  kind: 'editorial';
  intro: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  sourceIds: SourceId[];
}

const editorialGuides: Record<Locale, EditorialGuide[]> = {
  ko: [
    {
      slug: 'paper-weight-gsm',
      kind: 'editorial',
      title: '종이 평량(GSM)과 두께 가이드 — 용지 고르고 책등 계산하기',
      description:
        'GSM과 미국식 lb의 차이, 용도별 평량 선택, 그리고 페이지 수로 책등 두께를 계산하는 법을 정리했습니다.',
      updatedAt: '2026-08-09',
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
      sourceIds: ['iso536'],
      relatedTools: ['weight', 'gsm', 'spine'],
    },
    {
      slug: 'large-format-banner',
      kind: 'editorial',
      title: '현수막·배너 제작 가이드 — 해상도, 그로멧, 마감',
      description:
        '대형 현수막과 배너의 해상도 기준, 그로멧(아일릿) 간격, 여백·마감 처리를 정리했습니다.',
      updatedAt: '2026-08-09',
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
      sourceIds: ['adobeBleed'],
      relatedTools: ['grommet', 'size', 'res'],
    },
  ],
  en: [
    {
      slug: 'paper-weight-gsm',
      kind: 'editorial',
      title: 'Paper Weight (GSM) and Thickness — Choosing Stock and Spine',
      description:
        'The difference between GSM and US pound (lb), how to pick a weight by use, and how to calculate spine thickness from page count.',
      updatedAt: '2026-08-09',
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
      sourceIds: ['iso536'],
      relatedTools: ['weight', 'gsm', 'spine'],
    },
    {
      slug: 'large-format-banner',
      kind: 'editorial',
      title: 'Banners and Large-Format Printing — Resolution, Grommets, Finishing',
      description:
        'Resolution standards for large banners, grommet (eyelet) spacing, and margin and finishing — explained for outdoor and indoor display.',
      updatedAt: '2026-08-09',
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
