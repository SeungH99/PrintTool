import type { Locale } from '@/i18n/config';

const ko = String.raw`
  <h1>개인정보 처리방침</h1>
  <p><strong>최종 업데이트: 2026년 10월 18일</strong></p>
  <p>Mooni Studio가 운영하는 PrintReady(이하 “서비스”)는 사용자의 개인정보와 작업 파일을 안전하게 처리하는 것을 중요하게 생각합니다. 이 방침은 서비스가 어떤 정보를 처리하고, 왜 사용하며, 사용자가 어떤 선택을 할 수 있는지 설명합니다.</p>

  <h2>브라우저 안에서 처리되는 파일</h2>
  <p>PDF와 이미지 분석·변환은 사용자의 브라우저에서 이루어집니다. 작업 파일은 PrintReady 서버로 업로드되거나 저장되지 않습니다. 사용자가 직접 이메일로 파일을 보내는 경우에는 문의 처리에 필요한 범위에서만 별도로 다룹니다.</p>

  <h2>처리할 수 있는 정보</h2>
  <ul>
    <li><strong>문의 정보:</strong> 사용자가 이메일로 제공한 이름, 이메일 주소, 문의 내용</li>
    <li><strong>기술 및 이용 정보:</strong> 동의 상태에 따라 페이지 방문, 브라우저·기기 유형, 대략적인 지역, 오류 및 도구 이용 이벤트</li>
    <li><strong>쿠키 및 유사 기술:</strong> 동의 관리, Google Analytics 측정 및 Google AdSense 광고 제공에 필요한 식별자</li>
  </ul>
  <p>이 정보는 서비스 제공, 오류 해결, 이용 현황 파악, 보안 유지 및 광고 운영을 위해 사용합니다.</p>

  <h2>Google Analytics</h2>
  <p>분석을 허용하고 적용되는 Google 지역별 동의 조건도 충족한 경우에만 Google Analytics 태그를 불러옵니다. Google이 처리한 이용 통계는 집계된 형태로 확인합니다. 분석 제공업체가 처리하는 데이터 전체가 익명이라는 의미는 아닙니다. 사용자는 페이지 하단의 쿠키 설정에서 분석 선택을 변경할 수 있습니다.</p>

  <section id="google-adsense">
    <h2>Google AdSense 및 광고 쿠키</h2>
    <p>Google을 포함한 제3자 광고 제공업체는 광고를 게재하기 위해 쿠키를 사용합니다. 이러한 쿠키를 통해 이 사이트 또는 다른 웹사이트의 이전 방문을 바탕으로 사용자에게 광고가 표시될 수 있으며, Google의 광고 쿠키는 Google과 그 파트너가 관련성 높은 광고를 제공하도록 돕습니다.</p>
    <p>제3자 광고 제공업체나 광고 네트워크는 사용자의 브라우저에 쿠키를 저장하거나 읽을 수 있고, 광고 제공 및 효과 측정을 위해 웹 비콘 또는 IP 주소 같은 기술을 사용할 수 있습니다. PrintReady는 이러한 제3자 쿠키를 직접 제어하지 않습니다.</p>
    <p>사용자는 <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google 광고 설정</a>에서 맞춤 광고를 해제할 수 있으며, <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">AboutAds</a>에서 참여 광고 제공업체의 맞춤 광고를 관리할 수 있습니다.</p>
    <p>Google이 파트너 사이트에서 수집한 정보를 처리하는 방법은 <a href="https://policies.google.com/technologies/partner-sites?hl=ko" target="_blank" rel="noopener noreferrer">Google 파트너 사이트 데이터 사용 안내</a>에서 확인할 수 있습니다.</p>
  </section>

  <h2 id="consent-and-cookie-settings">동의 및 쿠키 설정</h2>
  <p>모든 방문자에게 분석과 광고를 기본적으로 끈 상태로 제공합니다. 첫 방문 안내의 선택 항목 거부·허용·직접 선택, 또는 페이지 하단의 쿠키 설정에서 두 항목을 각각 선택할 수 있습니다. 선택은 이 브라우저의 로컬 저장소에 기록되며 다른 브라우저나 기기로 자동 공유되지 않습니다. 필수적인 선택 저장과 파일 처리 도구는 선택 항목을 거부해도 사용할 수 있습니다.</p>
  <p>Google의 지역별 동의 관리가 적용되는 경우 해당 선택도 함께 충족해야 합니다. 이 사이트의 선택이 Google에서 거부한 항목을 허용하지는 않습니다. Google 지역별 선택 버튼은 해당 관리 도구가 준비되었을 때 제공됩니다. Google 동의 서비스가 준비되지 않았거나 허용 여부를 확인할 수 없으면 분석·광고 태그는 꺼진 상태로 유지되며 안내를 표시합니다. 동의 확인에 필요한 Google 동의 관리 스크립트는 선택 태그보다 먼저 불러올 수 있습니다.</p>
  <p>지원 브라우저의 Global Privacy Control 신호가 켜져 있으면 저장된 선택과 관계없이 분석과 광고를 모두 끕니다. 실행 중인 항목을 철회하면 이미 불러온 코드의 동작을 멈추기 위해 페이지를 새로고침합니다. 작업 중인 파일이나 결과는 먼저 다운로드하세요. 철회가 기존 제3자 쿠키를 모두 삭제하는 것은 아닙니다. 쿠키 삭제·차단은 브라우저 설정이나 각 제공업체의 설정에서 별도로 관리할 수 있습니다.</p>
  <p>광고·분석 태그는 확인된 도구와 가이드 등 콘텐츠 경로에서만 불러오며, 오류·문의·약관·개인정보 화면에서는 불러오지 않습니다.</p>

  <h2>공유, 보관 및 보안</h2>
  <p>개인정보를 판매하지 않습니다. 서비스 운영에 필요한 범위에서 Google 등 분석·광고 제공업체 또는 법적 의무를 이행하기 위한 기관과 정보가 처리될 수 있습니다. 문의 기록은 답변과 분쟁 대응에 필요한 기간만 보관하고, 분석·광고 데이터는 각 제공업체의 설정과 정책에 따라 보관됩니다. 합리적인 기술적·관리적 보호조치를 적용하지만 인터넷 전송의 절대적인 안전을 보장할 수는 없습니다.</p>

  <h2>사용자의 권리</h2>
  <p>관련 법률이 허용하는 범위에서 개인정보의 열람, 정정, 삭제, 처리 제한 또는 동의 철회를 요청할 수 있습니다. 요청은 아래 연락처로 보내 주세요.</p>

  <h2>변경 및 문의</h2>
  <p>서비스나 법률의 변경을 반영하기 위해 이 방침을 업데이트할 수 있으며, 중요한 변경은 이 페이지와 최종 업데이트 날짜를 통해 알립니다.</p>
  <p>개인정보 관련 문의: <a href="mailto:sheyeon1216@gmail.com">sheyeon1216@gmail.com</a></p>
`;

const en = String.raw`
  <h1>Privacy Policy</h1>
  <p><strong>Last updated: October 18, 2026</strong></p>
  <p>PrintReady, operated by Mooni Studio, respects your privacy and the confidentiality of your production files. This policy explains what information the service processes, why it is used, and the choices available to you.</p>

  <h2>Files processed in your browser</h2>
  <p>PDF and image analysis and conversion run locally in your browser. Your working files are not uploaded to or stored on PrintReady servers. If you choose to email a file to us, it is handled separately and only as needed to answer your request.</p>

  <h2>Information we may process</h2>
  <ul>
    <li><strong>Contact information:</strong> your name, email address, and message when you contact us by email</li>
    <li><strong>Technical and usage information:</strong> depending on your consent, page visits, browser and device type, approximate region, errors, and tool-use events</li>
    <li><strong>Cookies and similar technologies:</strong> identifiers needed for consent management, Google Analytics measurement, and Google AdSense advertising</li>
  </ul>
  <p>We use this information to provide the service, diagnose errors, understand aggregate usage, maintain security, and support advertising.</p>

  <h2>Google Analytics</h2>
  <p>We load Google Analytics only if you allow analytics and any applicable Google regional consent requirements are also satisfied. We review aggregated usage reports; this does not mean all data processed by the analytics provider is anonymous. You can change your analytics choice through Cookie settings in the footer.</p>

  <section id="google-adsense">
    <h2>Google AdSense and advertising cookies</h2>
    <p>Third-party vendors, including Google, use cookies to serve ads. These cookies may be used to show ads based on prior visits to this website or other websites. Google's advertising cookies enable Google and its partners to serve ads that may be more relevant to you.</p>
    <p>Third-party vendors and ad networks may place or read cookies in your browser and may use technologies such as web beacons or IP addresses to deliver and measure advertising. PrintReady does not directly control these third-party cookies.</p>
    <p>You can opt out of personalized advertising through <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. You can also manage personalized advertising from participating vendors through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">AboutAds</a>.</p>
    <p>For details about Google's processing on sites that use its services, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses data on partner sites</a>.</p>
  </section>

  <h2 id="consent-and-cookie-settings">Consent and cookie controls</h2>
  <p>Analytics and advertising start off for every visitor. Use Reject optional, Accept optional, or Customize in the first-visit notice, or reopen Cookie settings in the footer to choose each category independently. Your choice is stored in this browser's local storage and is not automatically shared with other browsers or devices. Essential choice storage and file-processing tools work without optional tags.</p>
  <p>Where Google's regional consent management applies, its choices must also permit the category. A local choice cannot override a Google denial. Google regional choices are available when that manager is ready. If Google's consent service is not ready or its permission cannot be confirmed, analytics and advertising tags remain off and the controls explain this. The Google consent-manager script needed to establish regional choices may load before optional tags.</p>
  <p>A supported Global Privacy Control signal keeps both analytics and advertising off, regardless of stored choices. Withdrawing a category that is already running reloads this page to stop code already loaded. Download any unsaved work first. Withdrawal does not delete all existing third-party cookies. You can separately manage cookie deletion and blocking in browser or provider settings.</p>
  <p>Advertising and analytics tags load only on recognized content routes such as tools and guides, not on error, contact, terms, or privacy screens.</p>

  <h2>Sharing, retention, and security</h2>
  <p>We do not sell personal information. Information may be processed by service providers such as Google where necessary for analytics or advertising, or disclosed when required by law. We retain contact records only as long as needed to respond and handle disputes. Analytics and advertising data are retained according to the applicable provider settings and policies. We use reasonable technical and organizational safeguards, but no internet transmission can be guaranteed completely secure.</p>

  <h2>Your rights</h2>
  <p>Subject to applicable law, you may request access, correction, deletion, restriction, or withdrawal of consent regarding your personal information. Contact us using the address below.</p>

  <h2>Changes and contact</h2>
  <p>We may update this policy to reflect changes to the service or applicable law. Material changes will be indicated on this page and by the last-updated date.</p>
  <p>Privacy questions: <a href="mailto:sheyeon1216@gmail.com">sheyeon1216@gmail.com</a></p>
`;

export const POLICY_HTML: Record<Locale, string> = { ko, en };
