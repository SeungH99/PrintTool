# AdSense 일시중지와 재개

이 사이트의 광고는 `NEXT_PUBLIC_ADSENSE_ENABLED`가 정확히 `true`인 빌드에서만 동작한다. 값이 없거나 `false`이면 광고는 꺼진다. 기본값은 **꺼짐**이다.

## 다시 켜기

1. 광고 수익화를 재개하기로 결정한 뒤 Cloudflare Workers Builds의 **빌드 환경 변수**에 `NEXT_PUBLIC_ADSENSE_ENABLED=true`를 설정한다.
2. 새 빌드·배포를 실행한다. `NEXT_PUBLIC_` 값은 브라우저 번들에 포함되므로 실행 환경 변수만 바꾸거나 Worker를 재시작하는 것으로는 반영되지 않는다.
3. 광고를 허용한 브라우저에서 지역별 Google 동의와 GPC 조건도 충족할 때만 광고 로더가 나타나는지 확인한다.

다시 끄려면 값을 `false`로 설정하거나 제거하고 새 빌드·배포를 실행한다. 종료 날짜를 추정해 자동으로 다시 켜지는 기능은 없다.

## 유지되는 항목

- 게시자 ID, `google-adsense-account` 메타 태그와 `ads.txt`는 유지한다. 이 파일·태그 자체는 광고를 게재하지 않는다.
- Google Analytics와 동의 관리 연결은 유지한다. 분석은 기존의 사용자 선택·지역별 Google 동의·GPC 제한을 계속 따른다.
- 광고가 꺼져 있으면 저장된 광고 동의가 `true`여도 광고 스크립트·수동 슬롯을 만들지 않으며 광고 저장/맞춤 신호도 거부한다. 쿠키 설정의 광고 선택은 비활성화된다.
- 이미 열어 둔 구버전 문서는 새 배포가 자동으로 바꾸지 않으므로 새로고침이 필요하다. 사이트 코드는 AdSense 계정 전체나 다른 사이트의 설정을 변경하지 않는다.

## 검증

- 활성 모드 전체 E2E: `npm run e2e -- --workers=2` (테스트용 기본 빌드는 스위치가 켜져 있다).
- 비활성 모드 E2E (PowerShell): `$env:NEXT_PUBLIC_ADSENSE_ENABLED='false'; npm run e2e -- e2e/ads-paused.spec.ts --workers=2`.
- 두 모드 모두 테스트용 게시자/GA ID와 외부 Google 응답 대체를 사용한다. 실제 운영 빌드에는 테스트 ID를 사용하지 않는다.
