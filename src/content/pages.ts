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
      'PrintReady는 인쇄 파일 준비에 필요한 검수와 계산을 브라우저에서 무료로 제공하는 도구 모음입니다. 업로드 없이 로컬에서 동작합니다.',
    intro:
      'PrintReady는 인쇄·제작 파일을 입고하기 전에 필요한 검수와 규격 계산을 한곳에 모은 무료 웹 도구 모음입니다. 회원가입이나 설치 없이 브라우저에서 바로 사용할 수 있습니다.',
    sections: [
      {
        heading: '무엇을 제공하나요',
        body: 'PDF 프리플라이트, 해상도·DPI 계산, CMYK↔RGB 변환과 소프트프루프, 도련·재단 계산, 평량(GSM) 변환, 책등 두께, 중철 터잡기, 인쇄 마크 등 인쇄 실무에 자주 쓰는 17가지 도구를 제공합니다. 각 도구에는 사용법·공식·예시와 자주 묻는 질문을 함께 실어, 결과 숫자가 무엇을 뜻하는지까지 이해할 수 있도록 했습니다.',
      },
      {
        heading: '파일은 브라우저에서만 처리됩니다',
        body: '업로드한 PDF·이미지·ICC 프로파일은 사용자의 브라우저 안에서만 처리되며, 서버로 전송하거나 저장하지 않습니다. 인쇄 데이터처럼 민감한 파일도 외부로 나가지 않으므로 안심하고 사용할 수 있습니다.',
      },
      {
        heading: '누구를 위한 도구인가요',
        body: '디자이너, 소규모 인쇄소, 자가 출판 작가, 그리고 처음 인쇄를 맡기는 분 모두를 위해 만들었습니다. 인쇄소의 전문 용어와 규격에 익숙하지 않아도, 도구가 안내하는 값을 따라가면 재인쇄 없이 한 번에 출고할 수 있도록 돕는 것이 목표입니다.',
      },
      {
        heading: '정확성과 한계',
        body: '계산과 검수 결과는 일반적인 인쇄 기준을 바탕으로 한 안내이며, 최종 사양은 인쇄소마다 다를 수 있습니다. 도련 폭, 색상 프로파일, 제본 방식 같은 중요한 값은 주문 전에 인쇄소 가이드로 한 번 더 확인하시길 권장합니다. PrintReady는 검수를 돕는 도구일 뿐, 인쇄 결과를 보증하지 않습니다.',
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
    sections: [
      {
        heading: '무엇을 보내면 되나요',
        body: '계산 결과가 이상하거나 도구가 동작하지 않는 경우, 어떤 도구에서 어떤 입력으로 문제가 생겼는지 알려 주시면 빠르게 확인할 수 있습니다. 새로 추가했으면 하는 계산기나 가이드 주제 제안도 환영합니다.',
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
    description:
      'PrintReady 이용약관 — 서비스 제공 조건, 면책, 저작권, 광고에 대한 안내입니다.',
    intro:
      '이 약관은 PrintReady(이하 "서비스") 이용에 적용됩니다. 서비스를 사용하면 아래 내용에 동의한 것으로 봅니다.',
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
      'PrintReady is a free, browser-based set of tools for checking and calculating print files. Everything runs locally, with no uploads.',
    intro:
      'PrintReady is a free set of web tools that gathers the checks and spec calculations you need before sending a file to print — all in one place. No sign-up, no install: it runs right in your browser.',
    sections: [
      {
        heading: 'What it offers',
        body: 'PrintReady provides 17 tools used in everyday print production: PDF preflight, resolution and DPI math, CMYK↔RGB conversion and soft proofing, bleed and trim calculations, paper weight (GSM) conversion, spine thickness, saddle-stitch imposition, printer marks, and more. Each tool ships with how-to notes, the formula, worked examples, and an FAQ, so you understand what the numbers mean — not just what they are.',
      },
      {
        heading: 'Your files stay in the browser',
        body: 'Any PDF, image, or ICC profile you open is processed entirely inside your browser — never uploaded to or stored on a server. Even sensitive print data never leaves your device, so you can use the tools with confidence.',
      },
      {
        heading: 'Who it is for',
        body: 'It is built for designers, small print shops, self-publishing authors, and anyone ordering print for the first time. The goal is to help you ship a file correctly on the first run — without reprints — even if you are not fluent in a printer’s jargon and specs.',
      },
      {
        heading: 'Accuracy and limits',
        body: 'The calculations and checks are guidance based on common print conventions, and final specs vary by printer. We recommend confirming important values — bleed width, color profile, binding method — against your printer’s guide before ordering. PrintReady is a tool to assist your checks; it does not guarantee print results.',
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
    sections: [
      {
        heading: 'What to send',
        body: 'If a result looks wrong or a tool does not work, tell us which tool and what inputs caused the problem so we can look into it quickly. Suggestions for new calculators or guide topics are welcome too.',
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
