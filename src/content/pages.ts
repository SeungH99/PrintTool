import type { Locale } from '@/i18n/config';

export interface PageSection {
  heading: string;
  body: string;
}

export interface StaticPage {
  slug: StaticPageSlug;
  title: string;
  description: string;
  intro: string;
  updatedAt: string;
  sections: PageSection[];
  /** Rendered as a mailto button when present (contact page). */
  email?: string;
}

/** Stable slugs shared by both locales — drives routing and sitemap. */
export const pageSlugs = ['about', 'contact', 'terms'] as const;
export type StaticPageSlug = (typeof pageSlugs)[number];

const CONTACT_EMAIL = 'sheyeon1216@gmail.com';

const ko: Record<StaticPageSlug, StaticPage> = {
  about: {
    slug: 'about',
    title: 'PrintReady 소개',
    description:
      'PrintReady가 제공하는 인쇄 계산·PDF 검사 범위와 검증 방법, 한계, 콘텐츠 업데이트 및 오류 수정 원칙을 설명합니다.',
    intro:
      'PrintReady는 인쇄·제작 파일을 보내기 전에 계산값과 PDF 속성을 확인하는 브라우저 기반 도구 모음입니다. 결과는 참고용 안내이며 생산 결과를 보증하지 않습니다. 최종 판단에서는 선택한 인쇄소의 사양이 항상 우선합니다.',
    updatedAt: '2026-08-09',
    sections: [
      {
        heading: '무엇을 제공하는가',
        body: 'PDF 속성 검사, 해상도·DPI 계산, 색상 수치 변환, 도련·재단 계산, 평량과 책등 두께, 중철·터잡기 등 인쇄 준비에 쓰는 도구와 재현 가능한 디지털 사례를 제공합니다. 파일은 서버로 업로드하거나 저장하지 않고 사용자의 브라우저 안에서 처리합니다.',
      },
      {
        heading: '계산값을 검증하는 방법',
        body: '계산 공식은 단위가 분명한 입력과 구현 코드와 별도로 산출한 예상값을 fixture로 만들고 자동 테스트로 비교합니다. 사례 페이지에는 같은 입력 파일, 예상값, 도구가 관찰한 값을 함께 기록하여 결과를 다시 검산할 수 있게 합니다.',
      },
      {
        heading: 'PDF 검사가 확인할 수 없는 것',
        body: '브라우저 검사는 페이지 크기, 일부 색상 공간, 이미지 해상도, TrimBox와 BleedBox 같은 감지 가능한 속성을 최선의 범위에서 읽습니다. 실제 아트워크가 도련까지 충분히 이어지는지, 모든 ICC·폰트·잉크 조건이 적합한지, 특정 인쇄소의 생산 규격을 충족하는지는 확정할 수 없습니다. 감지할 수 없는 항목은 정상으로 단정하지 않고 수동 확인 대상으로 안내합니다.',
      },
      {
        heading: '콘텐츠와 테스트 업데이트',
        body: '참고표와 가이드는 근거가 되는 출처와 실제 수정일을 함께 관리합니다. 계산 로직이나 검사 범위가 바뀌면 관련 fixture와 자동 테스트를 갱신하고, 한국어와 영어 콘텐츠가 같은 범위와 한계를 설명하는지 확인합니다.',
      },
      {
        heading: '오류 제보와 수정 원칙',
        body: '제보된 오류는 먼저 같은 입력을 담은 fixture로 재현한 뒤 수정합니다. 수정 전 실패와 수정 후 통과를 자동 테스트로 남기고, 결과의 해석이나 적용 범위가 달라지면 관련 설명과 수정일도 함께 갱신합니다.',
      },
    ],
  },
  contact: {
    slug: 'contact',
    title: '문의하기',
    description:
      'PrintReady 문의·피드백·오류 신고 연락처입니다. 이메일로 보내주시면 확인 후 답변드립니다.',
    intro:
      '도구에 대한 질문, 기능 제안, 오류 신고, 협업 문의는 언제든 이메일로 보내주세요. 보내주신 내용은 직접 확인하고 있습니다.',
    updatedAt: '2026-06-30',
    sections: [
      {
        heading: '무엇을 보내면 되나요',
        body: '계산 결과가 이상하거나 도구가 동작하지 않는 경우, 어떤 도구에서 어떤 입력으로 문제가 생겼는지 알려 주시면 빠르게 확인할 수 있습니다. 새로 추가했으면 하는 계산기나 가이드 주제 제안도 환영합니다.',
      },
      {
        heading: '피드백이 사이트를 만듭니다',
        body: 'PrintReady의 도구와 가이드는 사용자 피드백을 반영해 다듬어 갑니다. 자주 들어오는 질문은 가이드에 정리하고, 요청이 많은 계산기는 우선 추가합니다. 인쇄 실무에서 불편했던 점이나 빠진 기능이 있으면 알려 주세요.',
      },
      {
        heading: '답변 안내',
        body: '1인이 운영하는 사이트라 답변이 며칠 걸릴 수 있습니다. 같은 문의가 자주 들어오면 가이드 문서에 반영해 두기도 합니다.',
      },
    ],
    email: CONTACT_EMAIL,
  },
  terms: {
    slug: 'terms',
    title: '이용약관',
    description: 'PrintReady 이용약관 — 서비스 제공 조건, 면책, 저작권, 광고에 대한 안내입니다.',
    intro:
      '이 약관은 PrintReady(이하 "서비스") 이용에 적용됩니다. 서비스를 사용하면 아래 내용에 동의한 것으로 봅니다.',
    updatedAt: '2026-06-30',
    sections: [
      {
        heading: '서비스 제공',
        body: '서비스는 인쇄 파일 준비를 돕는 무료 도구를 "있는 그대로(as-is)" 제공합니다. 사전 고지 없이 도구를 추가·변경·중단할 수 있으며, 항상 중단 없는 이용을 보장하지는 않습니다.',
      },
      {
        heading: '면책',
        body: '모든 계산과 검수 결과는 참고용 안내이며, 정확성·완전성을 보증하지 않습니다. 인쇄 결과, 재인쇄 비용, 납기 지연 등 서비스 이용으로 발생한 손해에 대해서는 책임지지 않습니다. 최종 인쇄 사양은 반드시 인쇄소와 확인하세요.',
      },
      {
        heading: '저작권과 사용',
        body: '서비스의 도구·콘텐츠·디자인에 대한 권리는 PrintReady에 있습니다. 개인적·업무적 용도로 도구를 자유롭게 사용할 수 있으나, 사이트 콘텐츠를 무단으로 복제·재배포하지 마세요. 사용자가 업로드한 파일에 대한 권리는 전적으로 사용자에게 있으며, 파일은 브라우저에서만 처리됩니다.',
      },
      {
        heading: '광고와 외부 링크',
        body: '서비스는 Google AdSense 등 제3자 광고를 게재할 수 있습니다. 광고와 외부 링크의 내용에 대해서는 책임지지 않습니다. 광고 제공사는 쿠키를 사용할 수 있으며, 자세한 내용은 개인정보 처리방침을 참고하세요.',
      },
      {
        heading: '약관 변경',
        body: '약관은 필요에 따라 변경될 수 있으며, 변경 시 이 페이지에 게시합니다. 변경 후 서비스를 계속 사용하면 변경된 약관에 동의한 것으로 봅니다.',
      },
    ],
  },
};

const en: Record<StaticPageSlug, StaticPage> = {
  about: {
    slug: 'about',
    title: 'About PrintReady',
    description:
      'How PrintReady validates print calculations and PDF checks, defines limitations, updates content, and corrects reported errors.',
    intro:
      "PrintReady is a browser-based set of tools for checking calculations and detectable PDF properties before production. Results are guidance, not a production guarantee, and the selected printer's specification always takes precedence.",
    updatedAt: '2026-08-09',
    sections: [
      {
        heading: 'What PrintReady provides',
        body: 'PrintReady provides tools and reproducible digital examples for detectable PDF properties, resolution and DPI, numeric color conversion, bleed and trim, paper weight and spine calculations, booklet layout, and imposition. Files stay in your browser; they are not uploaded to or stored on a server.',
      },
      {
        heading: 'How calculations are validated',
        body: 'For each formula, we create fixtures with explicit units and expected values derived separately from the implementation, then compare the tool output in automated tests. Case studies publish the same input file, expected value, and observed result so the calculation can be checked again.',
      },
      {
        heading: 'What PDF preflight cannot confirm',
        body: "The browser check reads detectable properties such as page size, some color spaces, image resolution, TrimBox, and BleedBox on a best-effort basis. It cannot certify that artwork reaches the bleed, that every ICC, font, or ink condition is suitable, or that a particular printer's production requirements are met. Undetectable properties are presented for manual review rather than reported as healthy.",
      },
      {
        heading: 'Content and test updates',
        body: 'Reference tables and guides keep their supporting sources and actual revision dates. When a calculation or detection boundary changes, we update the relevant fixtures and automated tests and check that Korean and English copy describe the same scope and limitations.',
      },
      {
        heading: 'Error reporting and corrections',
        body: 'For each reported error, we first create a fixture that causes the issue to be reproduced before correction. The automated test records the failure before the fix and the passing result after it; when interpretation or scope changes, we update the related explanation and revision date too.',
      },
    ],
  },
  contact: {
    slug: 'contact',
    title: 'Contact',
    description:
      'How to reach PrintReady for questions, feedback, or bug reports. Email us and we will reply after reviewing your message.',
    intro:
      'For questions about a tool, feature suggestions, bug reports, or partnership inquiries, email us any time. Messages are read personally.',
    updatedAt: '2026-06-30',
    sections: [
      {
        heading: 'What to send',
        body: 'If a result looks wrong or a tool does not work, tell us which tool and what inputs caused the problem so we can look into it quickly. Suggestions for new calculators or guide topics are welcome too.',
      },
      {
        heading: 'Feedback shapes the site',
        body: 'PrintReady’s tools and guides are refined from user feedback. Common questions get written into a guide, and frequently requested calculators get built first. If something was awkward in real production or a feature is missing, let us know.',
      },
      {
        heading: 'About replies',
        body: 'This is a one-person site, so a reply may take a few days. When the same question comes up often, we may fold the answer into a guide.',
      },
    ],
    email: CONTACT_EMAIL,
  },
  terms: {
    slug: 'terms',
    title: 'Terms of Use',
    description:
      'PrintReady Terms of Use — how the service is provided, plus disclaimer, copyright, and advertising notes.',
    intro:
      'These terms apply to your use of PrintReady (the "Service"). By using the Service, you agree to what follows.',
    updatedAt: '2026-06-30',
    sections: [
      {
        heading: 'The service',
        body: 'The Service provides free tools to help prepare print files, offered "as-is." Tools may be added, changed, or discontinued without notice, and uninterrupted availability is not guaranteed.',
      },
      {
        heading: 'Disclaimer',
        body: 'All calculations and checks are guidance for reference only; their accuracy and completeness are not guaranteed. We are not liable for print results, reprint costs, missed deadlines, or other losses arising from use of the Service. Always confirm final print specifications with your printer.',
      },
      {
        heading: 'Copyright and use',
        body: 'Rights to the Service’s tools, content, and design belong to PrintReady. You may use the tools freely for personal or commercial work, but do not copy or redistribute the site’s content without permission. You retain all rights to the files you open, which are processed only in your browser.',
      },
      {
        heading: 'Advertising and external links',
        body: 'The Service may display third-party ads, including Google AdSense. We are not responsible for the content of ads or external links. Ad providers may use cookies; see the Privacy Policy for details.',
      },
      {
        heading: 'Changes to these terms',
        body: 'These terms may change as needed, and changes are posted on this page. Continuing to use the Service after a change means you accept the updated terms.',
      },
    ],
  },
};

const PAGES: Record<Locale, Record<StaticPageSlug, StaticPage>> = { ko, en };

export function getPage(locale: Locale, slug: StaticPageSlug): StaticPage {
  return PAGES[locale][slug];
}
