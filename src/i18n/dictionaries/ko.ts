export const ko = {
  nav: { home: '홈', tools: '도구', cta: 'PDF 검사' },
  home: {
    eyebrow: '인쇄 제작 툴킷',
    heroTitle: '인쇄소에 보내기 전, 파일과 규격을 먼저 확인하세요',
    heroDesc:
      'PDF, 이미지, 책등, 종이 무게, 접지 규격까지 인쇄 제작에 필요한 계산과 검수를 한 곳에서 처리합니다.',
    ctaPrimary: 'PDF 검사 시작하기',
    ctaSecondary: '계산기 둘러보기',
    toolsTitle: '필요한 도구를 골라 바로 시작하세요',
    toolsDesc: '검수부터 계산까지, 인쇄 제작 단계마다 필요한 도구를 모았습니다.',
  },
  tools: [
    {
      id: 'pdf',
      title: 'PDF 인쇄 파일 검사',
      desc: '재단·해상도·색상 모드·폰트 내장 여부를 한 번에 점검합니다.',
      tag: '프리플라이트',
    },
    {
      id: 'res',
      title: '이미지 인쇄 크기 계산',
      desc: '픽셀 크기와 해상도로 인쇄 가능한 최대 크기를 확인합니다.',
      tag: '해상도',
    },
    {
      id: 'spine',
      title: '책등 두께 계산',
      desc: '제본 방식과 페이지 수로 책등과 표지 전체 너비를 계산합니다.',
      tag: '제본',
    },
    {
      id: 'weight',
      title: '종이 무게 계산',
      desc: '규격·평량·매수로 전체 종이 무게와 포장 무게를 추정합니다.',
      tag: '평량',
    },
    {
      id: 'fold',
      title: '접지 규격 계산',
      desc: '접지 방식에 맞춘 각 패널의 정확한 너비를 산출합니다.',
      tag: '접지',
    },
    {
      id: 'label',
      title: '라벨 배치 계산',
      desc: '한 장에 들어가는 라벨 수와 행·열 배치를 계산합니다.',
      tag: '판수율',
    },
  ],
  footer: {
    tagline: '인쇄 제작에 필요한 검수와 계산을 한 곳에서.',
    toolsHead: '도구',
    aboutHead: '안내',
    about: ['개인정보 처리방침', '이용약관', '문의하기'],
    cookieSettings: '쿠키 설정',
    copy: '© 2026 PrintReady',
    note: '브라우저 내 처리 · 로그인 불필요',
  },
  common: {
    adLabel: '광고 영역',
    adNote: '동의 후 광고가 표시됩니다',
    skipToContent: '본문으로 건너뛰기',
  },
  langName: '한국어',
};

export type Dictionary = typeof ko;
