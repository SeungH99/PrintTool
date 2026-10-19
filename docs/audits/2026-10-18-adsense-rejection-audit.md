# AdSense 재거절 진단 — 2026-10-18

대상: https://printreadyhq.com · 확인된 거절 문구: **가치가 별로 없는 콘텐츠**.

상태: DONE_WITH_CONCERNS. 운영 사이트와 로컬 소스를 읽기 전용으로 점검했다. 이 보고서 외 제품 코드·광고 콘솔·심사 신청은 변경하지 않았다. Google의 내부 심사 결과는 공개되지 않으므로 아래 위험 요인은 실제 거절 원인으로 확정할 수 없다.

## 판단

가장 유력한 개선 영역은 독자가 실제 제작 문제를 해결할 수 있는 고유 콘텐츠의 깊이다. 접근 장애나 ads.txt 누락을 뒷받침하는 근거는 없었다. 기존 샘플과 사례는 수치·메타데이터 테스트로 유효하지만 시각적 제작 문제를 설명하는 교육 자료로는 약하다. 도구의 정상 작동만으로 이 콘텐츠 약점이 해소되지는 않는다.

Google은 고유하고 관련성 있는 콘텐츠, 유용한 사용자 경험, 명확한 탐색을 요구한다. 아래의 페이지 수·문단 수는 현황 설명이지 합격 기준이 아니다.

- [AdSense 사이트 준비 안내](https://support.google.com/adsense/answer/7299563?hl=ko)
- [가치가 낮거나 게시자 콘텐츠가 없는 화면 정책](https://support.google.com/publisherpolicies/answer/11112688?hl=ko)

## 1. 우선: 교육용 사례에 내용 있는 아트워크와 전후 비교가 없다

확인된 사실:

- https://printreadyhq.com/samples/printready-rgb-1200x800.png 는 글자·사진·가는 선 없이 단색 RGB(25,102,172)로 채운 직사각형이다. 운영 파일과 로컬 파일 해시가 일치하고 로컬 이미지를 직접 확인했다.
- `scripts/generate-case-study-samples.mjs:30`의 생성기는 모든 픽셀을 같은 색으로 채운다.
- 같은 스크립트의 `:78` 이후에서 `printready-a4-no-bleed.pdf`는 빈 A4 페이지, `printready-a4-3mm-bleed.pdf`는 빈 페이지에 TrimBox/BleedBox만 설정한다.
- https://printreadyhq.com/ko/guides/bleed-and-trim 의 `src/content/caseStudies/data.ts:489`는 아트워크를 육안 확인하라고 안내한다. 제공 샘플에는 그 확인에 필요한 아트워크가 없다.
- 해상도·색상 사례도 같은 단색 이미지를 공유하므로 선명도·디테일·색 변화를 눈으로 비교하기 어렵다.

영향과 추론: 재현 가능한 테스트 파일은 제공되지만, 인쇄 실패를 피하거나 수정하는 데 필요한 추가 학습 가치가 작다. 같은 거절 사유와 가장 직접적으로 연결되는 콘텐츠 약점이다. 실제 인쇄물 사진이 반드시 필요하다는 뜻은 아니다.

개선 방향: 글자·가는 선·사진 또는 직접 만든 패턴·배경·재단 경계가 있는 디지털 아트워크를 만들고, 잘못 만든 파일 → 검사 결과 → 수정한 파일 → 다시 검사한 결과를 화면 캡처와 주석으로 비교한다. 실제로 수행하지 않은 인쇄 경험을 주장하지 않는다.

## 2. 우선: 독립 가이드와 도구 설명이 짧고 작업 완결성이 낮다

확인된 사실:

- https://printreadyhq.com/ko/guides/paper-weight-gsm : `src/content/guides.ts:56` 이후. 소개, 본문 두 문단, FAQ 두 개로 구성되며 ISO 536의 적용 범위와 한계가 중심이다.
- https://printreadyhq.com/ko/guides/large-format-banner : 같은 파일 `:89` 이후. 짧은 본문 세 문단과 FAQ 두 개이며, 완성할 배너 작업 예제나 결과 파일은 없다.
- 한국어 toolGuides 17개 중 15개는 소개 + 본문 한 문단 + FAQ 한 개이고, 별도 짧은 예제가 붙는다. PDF/convert만 본문·FAQ가 각각 두 개다. 예: `src/i18n/dictionaries/ko.ts:709`, `:743`, `:794`.
- 사이트맵 62개 URL에는 한국어·영어 버전과 도구·정책 페이지가 함께 포함돼 있다. 62개의 독립적인 심층 콘텐츠를 뜻하지 않는다.

영향과 추론: 짧은 글이나 번역 페이지 자체가 정책 위반은 아니며 계산 도구 자체도 가치가 있다. 다만 현재 가이드 상당수는 정의·주의사항·외부 업체 확인 안내에서 끝나 사용자가 이 사이트에서 완수할 작업이 적다.

개선 방향: 이용이 많은 작업 3~5개를 선정해 입력 조건, 계산, 실패 유형, 해결 단계, 다운로드 가능한 최종 자료를 한 과정으로 연결한다. 임의의 글자 수·글 개수를 목표로 늘리지 않는다.

## 3. 우선: PDF 안내의 단정과 실제 검사 UI가 신뢰를 낮춘다

확인된 사실:

- https://printreadyhq.com/ko/pdf 의 `src/content/toolExamples.ts:18`은 저해상도 이미지를 바꾸고 전체를 CMYK로 변환하면 경고가 사라진다고 단정한다. 영문 `:89`에도 같은 내용이 있다.
- https://printreadyhq.com/ko/guides/cmyk-vs-rgb 는 RGB 검출 자체가 자동 불합격이 아니라고 설명한다. 출력 업체·프로파일·다른 검사 항목을 고려한 안내와 도구 예제가 충돌한다.
- 운영 사이트에서 1200×800 PNG를 A4 가로 PDF로 변환·다운로드한 뒤 바로 그 파일을 재업로드했다. 페이지 297.0×210.0mm, 102.6 DPI, RGB가 정상 검출됐다.
- 그런데 검출된 102.6 DPI와 RGB 옆 상태가 각각 **미설정**으로 표시됐다.
- `src/lib/preflight/report.ts:56`과 `:63`의 `warn`을 `src/components/calculators/PdfPreflight.tsx:55`가 공용 `statusWarn`으로 표시한다. 이 번역은 `src/i18n/dictionaries/ko.ts:594`의 ‘미설정’, `en.ts:599`의 ‘Not set’이다. `error`도 같은 문구를 쓴다.

개선 방향: RGB 검출, 권장 DPI 미만, 페이지 박스 부재를 각각 설명한다. CMYK 변환만으로 모든 경고가 해소된다는 보장을 제거하고 업체별 출력 조건에 맞춘 다음 조치를 제공한다.

## 4. 별도 정책 위험: 404 화면에서도 광고 요청이 발생한다

확인된 사실:

- 완전히 새 브라우저 컨텍스트에서 https://printreadyhq.com/ko/not-a-real-tool 을 열면 HTTP 404와 오류 화면을 반환한다.
- 클라이언트 렌더 후 `adsbygoogle.js`와 GA 스크립트가 로드되며 `ins.adsbygoogle[data-ad-status="unfilled"]`가 생긴다. 점검 시 슬롯 높이는 0이고 실제 광고 소재는 채워지지 않았다.
- https://printreadyhq.com/ko/contact 도 같은 광고 요청 범위다. 문의 페이지 자체가 일률적으로 금지된다는 주장은 하지 않는다.
- `src/app/[locale]/layout.tsx:91`에서 전역 광고 로더를 마운트하고, `src/components/ads/ConsentScripts.tsx:29`와 `:39`는 privacy만 제외한다.
- 같은 404 방문에서 `ReferenceError: gtag is not defined`도 재현됐다. 개인정보 페이지는 새 컨텍스트에서 Google 스크립트·광고 슬롯·오류가 없었다.

정책상 의미: Google은 오류 화면 등 콘텐츠 없는 화면의 광고 게재를 금지한다. 이번 확인은 광고 **요청**까지이며 실제 광고 **게재**나 이것이 거절을 유발했다는 사실은 확인하지 못했다.

개선 방향: 오류·비콘텐츠 화면을 광고 대상에서 제외하고, Auto ads 콘솔의 실제 페이지·영역 제외도 확인한다. 현재 코드 밖의 콘솔 설정은 이 점검에 포함되지 않았다.

- [관련 Google 정책](https://support.google.com/publisherpolicies/answer/11112688?hl=ko)

## 5. 별도 신뢰 문제: 개인정보 안내와 지역별 쿠키 설정 동작 불일치

확인된 사실:

- `src/app/[locale]/privacy/policyHtml.ts:20`과 `:31`은 동의한 경우 분석하며 쿠키 설정에서 언제든 분석 동의를 변경·철회할 수 있다고 안내한다. 영문 `:61`, `:72`도 같다.
- `src/components/ads/ConsentScripts.tsx:47`과 `:57`은 EEA/영국/스위스 밖에서 기본 저장 상태를 granted로 설정한다.
- `src/components/layout/CookieSettingsButton.tsx:21`은 GDPR 적용 및 CMP API 조건이 충족되지 않으면 개인정보 페이지로 이동한다. 별도의 분석 선택·철회 UI는 없다.

영향: 모든 방문자에게 약속한 선택 기능과 실제 기능이 일치하지 않는다. 현재 코드만으로 특정 국가의 법률 위반이나 이번 거절 원인이라고 단정하지 않는다.

개선 방향: 지역별 실제 처리와 문구를 일치시키고, 분석 동의 변경을 계속 약속한다면 작동하는 선택 기능을 제공한다.

- [Google 개인정보 보호 공개 정책](https://support.google.com/publisherpolicies/answer/10437794?hl=ko)

## 낮은 우선순위의 추가 개선

작성자는 `PrintReady` 브랜드로 표시되고, 소개는 검증 방법·한계를 설명하며 문의는 1인 운영 및 이메일을 안내한다. 브랜드 작성자나 Gmail 자체는 위반 근거가 아니다. 사실에 근거한 운영 배경, 검증 책임, 실제 수정 기록을 추가하면 독자가 신뢰를 판단하기 쉬워진다. 경력·후기·제작 경험을 만들어 넣지 않는다.

## 정상 확인 항목과 한계

- 사이트맵 62개 URL: HTTP 200, 자기 참조 canonical, noindex 없음.
- robots.txt: 크롤링 허용. HTTP/HTTPS, www, 끝 슬래시 이동 정상.
- ads.txt: HTTP 200, text/plain, 게시자 ID가 운영 HTML meta와 일치.
- Googlebot·Mediapartners-Google·Google-Display-Ads-Bot 사용자 에이전트 요청에 정상 응답. Google 실제 IP의 접근 로그를 확인한 것은 아니다.
- 운영 핵심 흐름: PNG 업로드 → A4 가로 변환 → 실제 다운로드 → 동일 PDF 업로드 → 297×210mm/RGB/102.6DPI 검출 성공.
- 모든 17개 도구·모든 파일 형식·모든 지역의 CMP를 전수 검증한 것은 아니다.
- 실제 AdSense 광고 설정, Google의 내부 심사 기준별 판정, Search Console 제외 URL 목록은 접근하지 않았다.

## 권장 순서

1. 내용 있는 사례 샘플과 수정 전후 비교를 만들어 기존 핵심 사례를 실용적인 제작 자료로 개편한다.
2. 짧은 가이드를 실제 작업·결과·체크리스트가 있는 자료로 보강하고, PDF의 모순된 안내·잘못된 상태 문구를 수정한다.
3. 404 광고 요청과 GA 오류, 개인정보 선택 기능·설명 불일치를 해결한다.
4. 운영 반영 후 실제 파일을 사용해 결과와 안내의 일치를 다시 확인하고 재심사를 요청한다. 승인 여부는 이 점검으로 보장할 수 없다.
