# AdSense 지적 1–5 수정 및 검증

작성일: 2026-10-18 (Asia/Seoul)

브랜치: `codex/adsense-value-rework` · 시작점: `origin/main`의 `528b609`.

기존 체크아웃에서 작업했으며 worktree를 만들지 않았다. 기존 사용자 `.gitignore` 변경과 미추적 vault/logo 파일을 보존했다.

## 수정 결과

| 진단 항목 | 반영 내용 | 실제 검증 |
|---|---|---|
| 1. 빈약한 샘플·사례 | 직접 만든 글자·1px 선·풍경 패턴·색상 패치가 있는 원본, 실제 도련 아트워크, 100 mm 수정 PDF, 도식·주석과 5개 양언어 사례 개선 | PDF 렌더 이미지 확인; 실제 다운로드한 수정 PDF를 재업로드해 304.8 DPI 확인 |
| 2. 짧고 작업이 끝나지 않는 안내 | 평량·배너 가이드를 구체적인 계산·결정·실수·전달 체크리스트로 개편; 15개 짧은 도구 안내 보강 | 계산 직접 검산, 출처 범위 검토, KO/EN 가이드 렌더·접근성·샘플 다운로드 테스트 |
| 3. 모순된 PDF 안내·미설정 표시 | CMYK 전환만으로 경고 해소한다는 보장 제거; 검출 RGB/비CMYK·권장 DPI 미만·박스 없음·수동 확인을 구분; PDF 재배치 결과는 원본 색상 유지라고 표시 | 실제 저해상도 RGB PDF와 CMYK PDF 입력의 UI 회귀 테스트; 변환→다운로드→동일 PDF 재검사 |
| 4. 오류 화면 광고 요청 | 정확히 알려진 콘텐츠 주소만 허용; 404·알 수 없는 중첩 주소·정책/문의 화면 제외; 페이지 및 전역 오류의 기존 Google 실행 코드 정리 후 새로고침 | 실제 404 응답·광고 요청 0·pageerror 0; 기존 DOM/전역 런타임·리마운트·히스토리·전역 오류 회귀 테스트 |
| 5. 개인정보 안내와 선택 불일치 | 분석/광고 기본 거부, 각각 선택·저장·재열기·철회, 한국어/영어 비차단 안내와 설정 대화상자, Google 지역 동의와 GPC 우선, 방침 문구 일치 | 거부→새로고침→분석만 허용→철회, 지역 Google 거부/허용, GPC, 저장 실패의 실제 상태 안내 |

## 샘플의 정확성과 재현성

- 원본: 1200×800 px. A4 가로 297 mm 폭 배치 ≈102.63 DPI.
- 수정: 같은 픽셀을 100×66.67 mm에 배치한 실제 PDF ≈304.8 DPI. 픽셀을 늘리거나 CMYK로 변환하지 않는다.
- A4 비교 PDF의 배치를 실제 변환기와 맞춰 위·아래 각각 6 mm 여백으로 수정했다.
- 도련 비교: 210×297 mm 문서와, 배경을 실제로 연장한 216×303 mm 문서에 3 mm TrimBox inset을 설정한 문서. 화면의 점선 안내는 PDF에 인쇄되지 않는다.
- 미리보기는 같은 비트맵을 사용한다. 화면상 크기는 정규화되므로 실제 출력 크기나 실물 교정쇄로 오인하지 않도록 설명했다.
- 모든 예시는 디지털 교육 자료이며, 실제 인쇄 시험·인쇄소 접수 승인·출력 프로파일 일치를 주장하지 않는다.
- 생성 테스트는 격리된 출력 폴더 두 곳에서 10개 산출물의 바이트 동일성을 비교한다. 공개 파일을 재생성한 최종 확인에서도 10개 모두 변화가 없었다.
- `.gitattributes`로 샘플 PDF/PNG의 바이너리 바이트와 JSON의 LF를 보존한다.

대표 SHA-256:

```text
원본 PNG       a842345bb135e85d3e8fa60acd6f2b4cb773bb471c33e024757b255056c124ad
A4 비교 PDF    9c14d509094c2d97f3842a5186cc0da13bbc3800066e987e0c644f025566cce4
100 mm 수정 PDF 88ae86cef0a5bd960fd86f8a5a2bdd8b866eec326c7612d1b8b87f3e64c23c73
```

## 동의 및 광고 경계

- localStorage의 `printready.consent`에는 분석·광고의 명시적인 boolean 선택만 저장한다. 선택이 없거나 잘못된 값이면 기본 거부다.
- Google Funding Choices는 광고·분석 태그보다 별도로 준비한다. AdSense가 설정된 경우 Google의 문서화된 readiness·Consent Mode 목적별 결과와 로컬 선택의 교집합만 허용한다. 알 수 없거나 준비되지 않으면 태그를 허용하지 않는다.
- GA만 설정된 구성에서는 없는 AdSense CMP를 기다리지 않고 명시적인 분석 선택과 GPC를 적용한다. 광고는 허용하지 않는다.
- GPC에서는 두 선택 모두 거부한다. 로컬 선택으로 Google의 지역별 거부를 덮어쓰지 않는다.
- 이미 로드된 Google 실행 코드는 script 요소 삭제만으로 멈추지 않으므로 거부 신호·GA 비활성화·요소 제거 후 문서를 새로고침한다. 저장하지 않은 작업을 먼저 내려받으라는 안내를 제공한다.
- 전역 오류는 locale layout의 관찰자에 의존하지 않고 독립적으로 동일 종료 함수를 호출한다. 실행 코드가 없는 새 오류 문서에서는 재로드하지 않으며, 같은 문서의 중복 재로드도 막는다.
- Google 명령 큐는 canonical `Arguments` 객체를 사용하며, 테스트는 단순 태그 존재뿐 아니라 이 프로토콜과 기존 큐 보존을 검사한다.
- 저장에 실패하면 성공/철회했다고 표시하지 않는다. 브라우저 저장소가 차단된 상황에서 영구 저장을 보장하지 않는다.

근거: [Google Consent API](https://developers.google.com/funding-choices/fc-api-docs), [Google data layer](https://developers.google.com/tag-platform/devguides/datalayer).

## 최종 실행 검증

| 명령/검사 | 결과 |
|---|---|
| `npm.cmd run lint` | PASS |
| `npm.cmd run typecheck` (최종 Worker 빌드 후) | PASS |
| `npm.cmd test` | PASS — 55 files, 308 tests |
| `npm.cmd run e2e -- --workers=2` | PASS — 50 tests, 접근성 8개 경로 포함 |
| `opennextjs-cloudflare build` | PASS — Next 정적 페이지 103개 및 `.open-next/worker.js` 생성 |
| `npm.cmd run samples:generate` 재생성 해시 대조 | PASS — 10개 산출물, drift 0 |
| 수정한 소스/테스트 Prettier 검사 | PASS |
| 수정 경로 `git diff --check` | PASS |
| 최종 Worker의 테스트용 AdSense/GA ID 잔존 검사 | 없음 |

브라우저 테스트는 외부 Google 서비스 경계만 가짜 응답으로 대체하고 사이트의 실제 UI·저장·스크립트 로더를 실행한다. GA 가짜 소비자는 canonical Arguments 명령을 읽는지 검사한다. Google 실제 지역별 메시지 서버나 실계정 광고 게재 결과를 검증한 것은 아니다.

첫 통합 E2E는 46/48이었다. 두 실패는 변경된 PDF 항목/상태를 옛 문구로 찾는 회귀 기대값이었다. 새 의미를 확인하도록 갱신하고, 추가 모바일/지역 허용 검사와 리뷰 수정을 포함한 최종 50/50을 확인했다.

독립 리뷰에서 발견한 gtag 큐 프로토콜과 전역 오류의 실행 코드 정리 누락을 수정하고 재검토했다. 최종 미해결 Critical/Important 지적은 없다. 직접 모바일 점검에서 확인한 RelatedTools 카드의 422 px 가로 넘침은 `min-w-0`로 수정했으며 320/375 px KO/EN E2E가 통과했다.

## 경고 및 외부 확인 범위

- 단위 테스트에서 기존 jsdom의 전체 문서 navigation 미지원 stderr가 발생하지만 실패 테스트는 없었다.
- 빌드의 middleware convention deprecation 및 OpenNext Windows 호환성 경고는 남아 있다. 이번 최종 Next/Worker 빌드는 exit 0이었다. 기존 Cloudflare 호환 선택을 임의로 proxy로 변경하지 않았다.
- AdSense 콘솔 Auto ads 제외 영역·실제 Google 지역 메시지 게시/설정은 변경하지 않았다. 운영 반영 뒤 실제 계정의 메시지 준비 및 거부/철회 동작을 확인해야 한다.
- 실제 배포·PR 머지·재심사 제출은 수행하지 않았다. 이 결과는 로컬 구현과 검증의 완료이며 AdSense 승인을 보장하지 않는다.
