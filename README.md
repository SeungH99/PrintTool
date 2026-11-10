# PrintReady

인쇄소에 파일을 보내기 전, PDF·이미지를 확인하고 제작 규격을 계산하는 웹 도구 모음입니다. 파일 검사, PDF 변환, 색상 비교, 용지·제본 계산 등 17개 도구를 한국어와 영어로 제공합니다.

**서비스:** [printreadyhq.com/ko](https://printreadyhq.com/ko) · [English](https://printreadyhq.com/en)

개인 프로젝트로 기획·개발·배포한 서비스입니다. AI 코딩 도구와 디자인 스킬을 개발에 활용했으며, 파일 처리 위치와 검사 범위, 검증 조건을 정하고 코드와 UI를 확인·수정하는 방식으로 작업했습니다.

## 주요 기능

| 구분 | 도구 |
| --- | --- |
| 파일 검사 | PDF 인쇄 파일 검사 |
| 변환·색상 | 인쇄용 PDF 변환, CMYK·RGB·HEX 변환, 이미지 소프트프루프 |
| 규격·해상도 | 이미지 인쇄 크기 계산, 용지 규격·픽셀 변환 |
| 용지·제본 | 종이 무게, 평량 단위, 책등 두께, 중철 페이지 계산 |
| 제작·배치 | 접지 규격, 라벨 배치, 재단·안전영역, 절수·조판, 현수막 그로멧 계산 |
| PDF 출력 | PDF 터잡기, PDF 재단·인쇄 마크 추가 |

도구 ID와 분류는 [`src/lib/tools.ts`](src/lib/tools.ts), 화면 연결은 [`src/app/[locale]/[tool]/page.tsx`](src/app/%5Blocale%5D/%5Btool%5D/page.tsx)에서 관리합니다.

## 파일 처리 구조

```text
사용자가 선택한 PDF·이미지·ICC 프로파일
  → 브라우저의 File API로 읽기
  → pdf-lib / PDF.js / Little CMS WebAssembly로 처리
  → 검사 결과·미리보기 표시 또는 결과 파일 다운로드
```

사용자가 선택한 원본 파일은 브라우저에서 처리하며 파일 업로드 API로 전송하지 않습니다. Next.js와 Cloudflare Workers는 페이지와 애플리케이션 자산을 제공합니다. 색상 도구는 같은 사이트에서 WASM 엔진과 기본 ICC 프로파일을 불러옵니다.

사이트에는 별도의 동의 관리·선택적 분석·광고 연동 코드가 있습니다. 설정과 동의 상태에 따라 Google 동의 관리, Analytics, 광고 관련 네트워크 요청이 발생할 수 있으므로, 원본 파일의 로컬 처리와 사이트 전체의 네트워크 통신은 구분합니다. 도구 완료 이벤트에는 도구 ID를 사용합니다.

## 검사 범위와 해석

### PDF 검사

- 전체 문서의 페이지 수 확인
- **첫 페이지**의 크기, TrimBox·BleedBox 존재, 폰트 내장 여부와 이미지 유효 DPI 확인
- **각 페이지가 직접 참조하는 이미지 XObject**의 색상 공간 검사
- 확인할 수 없는 값은 `unknown`으로 유지
- 미리보기 렌더링이 실패해도 가능한 검사 결과는 표시

중첩 Form XObject 내부의 이미지와 벡터 색상은 현재 색상 검사 범위에 포함하지 않습니다. 재단·도련 박스의 존재는 실제 그림이 도련 영역까지 채워져 있다는 의미가 아닙니다. 최종 출력 사양은 인쇄소 가이드와 원본 파일을 함께 확인해야 합니다.

관련 코드: [`analyze.ts`](src/lib/preflight/analyze.ts), [`images.ts`](src/lib/preflight/images.ts), [`report.ts`](src/lib/preflight/report.ts)

### ICC 색상 변환·소프트프루프

Little CMS WASM과 CMYK ICC 프로파일을 사용해 CMYK↔sRGB 변환을 수행합니다. 기본 프로파일 외에 사용자가 선택한 프로파일도 브라우저에서 읽을 수 있습니다. 소프트프루프는 RGB→CMYK→RGB 왕복 결과를 원본과 비교하고, RGB 차이 기준으로 변화가 큰 영역을 표시합니다.

이미지 소프트프루프는 긴 변을 최대 1,000px로 줄인 미리보기입니다. 선택한 프로파일과 화면 표시 조건에 따른 시뮬레이션이며 실제 용지·잉크·인쇄기의 출력색을 보장하지 않습니다.

관련 코드: [`cmyk.ts`](src/lib/color/cmyk.ts), [`loadEngine.ts`](src/lib/color/loadEngine.ts), [`SoftProofTool.tsx`](src/components/calculators/SoftProofTool.tsx)

## 기술 구성

| 영역 | 사용 기술 |
| --- | --- |
| 웹·UI | Next.js App Router, React, TypeScript, Tailwind CSS |
| PDF 읽기·생성·변환 | pdf-lib, PDF.js |
| 색상 관리 | lcms-wasm / Little CMS, ICC 프로파일 |
| 배포 | OpenNext, Cloudflare Workers |
| 검증 | Vitest, Testing Library, Playwright, axe-core, GitHub Actions |
| 다국어 | `/ko`, `/en` 경로와 타입 기반 사전 |

## 로컬 실행

Node.js 24와 npm을 기준으로 합니다. CI도 Node.js 24를 사용합니다.

```bash
npm ci
npm run dev
```

[http://localhost:3000/ko](http://localhost:3000/ko)에서 확인할 수 있습니다.

일반적인 도구 실행에는 외부 AI API 키가 필요하지 않습니다. 사이트 URL이나 선택적 Google 연동을 설정하려면 [`.env.example`](.env.example)을 참고해 로컬 환경 파일을 만듭니다.

| 환경 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical URL·사이트맵 기준 주소. 미설정 시 `http://localhost:3000` |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | 정확히 `true`일 때만 광고 기능 활성화. 기본 비활성 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | 선택적 AdSense·Google 동의 관리 식별자 |
| `NEXT_PUBLIC_GA_ID` | 선택적 GA4 측정 ID |

`NEXT_PUBLIC_*` 값은 클라이언트에 공개되는 설정입니다. 비밀키나 개인 인증 정보를 넣지 않습니다. 광고 스위치는 빌드 시 적용되므로 변경 후 다시 빌드·배포해야 합니다.

## 검증 방법

```bash
npm run lint
npm run build
npm run typecheck
npm run test
npx playwright install chromium
npm run e2e
```

- Vitest: 계산식·입력값 경계, PDF 검사·변환·터잡기, ICC 변환, UI·동의 처리 등을 검사합니다.
- Playwright: 한국어·영어 도구 화면, 파일 처리 흐름, 가이드의 재현 자료와 접근성 등을 확인합니다. E2E 설정은 별도의 프로덕션 빌드와 서버를 실행합니다.
- [GitHub Actions CI](.github/workflows/ci.yml): 의존성 설치·보안 감사 → lint → build → typecheck → 단위 테스트 → 일반 E2E와 광고 중단 모드 → Cloudflare 빌드·Worker 실행 검사 순서로 구성되어 있습니다.

테스트 코드는 [`tests/`](tests), [`e2e/`](e2e), 일부 기능 옆의 `*.test.ts(x)`에 있습니다. 실행 결과는 해당 커밋의 CI 로그로 확인할 수 있습니다.

```bash
npm audit --audit-level=moderate
NEXT_PUBLIC_ADSENSE_ENABLED=false npm run e2e -- e2e/ads-paused.spec.ts
npx opennextjs-cloudflare build
node scripts/worker-smoke.mjs
```

환경변수 지정 예시는 Bash 기준입니다. PowerShell에서는 `$env:NEXT_PUBLIC_ADSENSE_ENABLED='false'`를 설정한 뒤 같은 E2E 명령을 실행합니다. Worker 검사는 배포 없이 로컬 미리보기를 실행하고, 한국어·영어 경로와 JS/WASM/ICC 정적 파일의 응답을 확인합니다.

### 전이 의존성 보안 패치

`package.json`의 `overrides`는 OpenNext·node-minify가 사용하는 `glob`과 typescript-eslint가 사용하는 `minimatch` 경로에만 적용합니다. 상위 패키지의 사용 API와 Node.js 24 호환 범위를 확인한 패치이며, 다른 패키지의 구형 API까지 전역으로 교체하지 않습니다. 상위 의존성을 갱신할 때 해당 override의 필요 여부와 Worker 빌드 결과를 함께 확인합니다.

### 샘플로 확인하기

[`public/samples/`](public/samples)에는 생성 스크립트로 만든 검사·계산 예시 파일이 있습니다. PDF 검사 화면에서 [저해상도 RGB 샘플](public/samples/printready-a4-rgb-low-resolution.pdf)과 [도련 박스가 있는 샘플](public/samples/printready-a4-3mm-bleed.pdf)을 읽어 결과 차이를 확인할 수 있습니다.

```bash
npm run samples:generate
```

샘플 생성 코드는 [`scripts/generate-case-study-samples.mjs`](scripts/generate-case-study-samples.mjs)에 있습니다.

## 구현에서 다룬 판단

- **원본 파일 처리 위치:** 파일 바이트를 브라우저 안에서 읽고 결과 파일도 브라우저에서 생성하는 구조 선택
- **검사 범위 표시:** 첫 페이지 검사와 문서 전체 이미지 색상 검사를 구분하고, 검출할 수 없는 값은 추정하지 않고 `unknown`으로 반환
- **라이브러리 간 버퍼 관리:** pdf-lib의 구조 읽기를 먼저 마친 뒤 PDF.js에 복사한 버퍼를 전달해 버퍼 분리의 영향 방지
- **사용자 확인 단계:** 원본·변환 결과와 소프트프루프를 비교하고, 경고와 검사 한계를 함께 확인할 수 있는 화면 구성
- **반복 UI:** 입력 필드·버튼·검사 상태 컴포넌트와 색상·간격 스타일을 공유하고, 한국어·영어 화면에 적용

## 디렉터리

```text
src/app/                  페이지·메타데이터·다국어 경로
src/components/           도구 화면·공통 UI·동의 처리
src/lib/calculations/     규격·용지·제본 계산
src/lib/preflight/        PDF 구조·이미지 검사와 보고서
src/lib/convert/          이미지→PDF·PDF 크기 변환
src/lib/color/            ICC·WASM 색상 변환
src/lib/impose/           PDF 터잡기
src/lib/marks/            인쇄 마크 생성
src/i18n/                 한국어·영어 사전
public/                   정적 자산·색상 엔진·프로파일·샘플
tests/                    단위·컴포넌트 테스트
e2e/                      브라우저 테스트
```

## Cloudflare 빌드·배포

```bash
npm run preview
npm run deploy
```

OpenNext로 빌드한 결과를 Cloudflare Workers에서 실행합니다. 배포에는 별도의 Cloudflare 계정 인증과 프로젝트에 맞는 [`wrangler.jsonc`](wrangler.jsonc) 설정이 필요합니다.

## 제3자 구성요소와 라이선스

이 저장소의 자체 코드에는 별도의 프로젝트 라이선스를 명시하지 않았습니다. 저장소 공개만으로 자체 코드에 MIT 또는 AGPL 라이선스를 부여한 것은 아닙니다.

포함된 WASM 엔진·래퍼와 ICC 프로파일은 각각의 원래 라이선스를 따릅니다. 파일별 출처와 적용 범위는 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), [ICC 프로파일 안내](public/profiles/README.md)에 정리했습니다. 제3자 구성요소에 부여된 권리는 해당 라이선스에 따릅니다.
