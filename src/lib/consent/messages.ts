import type { Locale } from '@/i18n/config';

export const consentMessages = {
  en: {
    title: 'Cookie choices',
    description:
      'Optional Google Analytics and advertising stay off until you choose. Your files are processed in your browser, not uploaded to PrintReady.',
    reject: 'Reject optional',
    accept: 'Accept optional',
    customize: 'Customize',
    save: 'Save choices',
    close: 'Close',
    analytics: 'Analytics',
    ads: 'Advertising',
    analyticsDescription: 'Allow Google Analytics to measure visits and tool use.',
    adsDescription: 'Allow Google AdSense advertising and its storage and personalization signals.',
    adsPaused: 'Advertising is currently paused on this site.',
    essential:
      'Essential: your choice is stored on this browser. Tools work without optional tags.',
    pending: 'Optional tags stay off while Google checks regional choices.',
    unavailable:
      'Google’s consent service is not ready. Your choices can be saved, but optional tags remain off until Google confirms.',
    regional:
      'Google’s regional choices also apply. These local choices can restrict them, never override a Google denial.',
    googleChoices: 'Google regional choices',
    googleUnavailable:
      'Google’s regional controls are not ready here. Optional tags remain off where regional permission is unavailable.',
    gpc: 'Global Privacy Control is on: both optional categories remain off, regardless of saved or Google choices.',
    storageError:
      'We could not save your choice in this browser. Check browser storage settings and try again.',
    privacy: 'Privacy policy',
    reload:
      'Withdrawing a category that is already running reloads this page. Download any unsaved work first. This does not delete third-party cookies.',
  },
  ko: {
    title: '쿠키 선택',
    description:
      '선택하기 전까지 Google 분석과 광고는 꺼져 있습니다. 작업 파일은 PrintReady로 업로드하지 않고 브라우저 안에서 처리합니다.',
    reject: '선택 항목 거부',
    accept: '선택 항목 허용',
    customize: '직접 선택',
    save: '선택 저장',
    close: '닫기',
    analytics: '분석',
    ads: '광고',
    analyticsDescription: 'Google Analytics로 방문과 도구 사용을 측정하도록 허용합니다.',
    adsDescription: 'Google AdSense 광고 및 관련 저장·맞춤 설정 신호를 허용합니다.',
    adsPaused: '현재 이 사이트의 광고는 꺼져 있습니다.',
    essential:
      '필수: 이 브라우저에 선택 내용을 저장합니다. 선택 항목을 거부해도 도구를 사용할 수 있습니다.',
    pending: 'Google이 지역별 선택을 확인하는 동안 선택 태그는 꺼져 있습니다.',
    unavailable:
      'Google 동의 서비스가 준비되지 않았습니다. 선택은 저장할 수 있지만 Google 확인 전까지 선택 태그는 꺼진 상태로 유지됩니다.',
    regional:
      'Google의 지역별 선택도 적용됩니다. 여기서는 범위를 더 제한할 수 있지만 Google에서 거부한 항목을 허용할 수 없습니다.',
    googleChoices: 'Google 지역별 선택',
    googleUnavailable:
      'Google의 지역별 설정이 아직 준비되지 않았습니다. 지역별 허용을 확인할 수 없으면 선택 태그는 꺼져 있습니다.',
    gpc: 'Global Privacy Control이 켜져 있어 저장된 선택이나 Google 선택과 관계없이 두 선택 항목을 모두 끕니다.',
    storageError:
      '이 브라우저에 선택을 저장하지 못했습니다. 브라우저 저장소 설정을 확인하고 다시 시도해 주세요.',
    privacy: '개인정보 처리방침',
    reload:
      '이미 실행 중인 항목을 철회하면 이 페이지가 새로고침됩니다. 저장하지 않은 작업은 먼저 다운로드하세요. 제3자 쿠키가 삭제되는 것은 아닙니다.',
  },
} satisfies Record<Locale, Record<string, string>>;
