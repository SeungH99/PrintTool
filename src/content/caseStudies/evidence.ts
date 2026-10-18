import type { CaseStudyFigure } from './types';

const source: CaseStudyFigure = {
  src: '/samples/printready-rgb-1200x800.png',
  width: 1200,
  height: 800,
  alt: {
    ko: '원본 RGB 테스트 카드: 작은 글자, 1픽셀 선, 색상 패치와 직접 그린 풍경 패턴',
    en: 'Original RGB test card with small lettering, one-pixel rules, color patches and a geometric landscape',
  },
  caption: {
    ko: '수정 후: 동일한 1200 × 800 px을 100 × 66.67 mm로 배치한 PDF = 304.8 DPI. 픽셀 추가나 CMYK 변환은 하지 않았습니다.',
    en: 'After: the same 1200 × 800 px placed at 100 × 66.67 mm in the corrected PDF = 304.8 DPI. No extra pixels or CMYK conversion.',
  },
};

export const resolutionFigures: CaseStudyFigure[] = [
  {
    src: '/samples/printready-a4-rgb-preview.png',
    width: 1200,
    height: 848,
    alt: {
      ko: 'A4 가로 페이지 가운데 배치한 테스트 카드와 위아래 각각 6 mm 흰 여백',
      en: 'Test card centered across landscape A4, with 6 mm white margins above and below',
    },
    caption: {
      ko: '수정 전: 297 × 210 mm PDF에서 이미지 폭 297 mm = 102.63 DPI. 원본 비율을 유지해 가운데 배치하므로 위아래 각각 6 mm가 흰색입니다.',
      en: 'Before: image width 297 mm on a 297 × 210 mm PDF = 102.63 DPI. Centering at its original aspect ratio leaves 6 mm white margins above and below.',
    },
  },
  source,
];

export const colorFigures: CaseStudyFigure[] = [
  {
    ...source,
    caption: {
      ko: '직접 만든 RGB 아트워크의 디지털 미리보기입니다. 청록·주황 패치와 그라데이션은 확인 위치를 제공할 뿐, CMYK 교정본이나 실제 인쇄 색상 비교가 아닙니다.',
      en: 'Digital preview of our original RGB artwork. The teal/orange patches and gradients give you regions to inspect; this is not a CMYK proof or a comparison of physical prints.',
    },
  },
];

export const bleedFigures: CaseStudyFigure[] = [
  {
    src: '/samples/printready-a4-no-bleed-preview.png',
    width: 2520,
    height: 3564,
    alt: {
      ko: '재단 크기에서 바로 끝나 추가 도련이 없는 배경 아트워크',
      en: 'Background artwork ending at the trim-sized page with no extra bleed area',
    },
    caption: {
      ko: '수정 전: 페이지와 아트워크가 210 × 297 mm에서 끝납니다. 재단이 밖으로 어긋나면 쓸 여분이 없으며 명시적인 TrimBox·BleedBox도 없습니다.',
      en: 'Before: page and artwork stop at 210 × 297 mm. There is no spare artwork for an outward cut variation, and no explicit TrimBox or BleedBox.',
    },
  },
  {
    src: '/samples/printready-a4-3mm-bleed-preview.png',
    width: 2592,
    height: 3636,
    trimGuide: { insetXPercent: (3 / 216) * 100, insetYPercent: (3 / 303) * 100 },
    alt: {
      ko: '점선 재단 경계 바깥으로 네 변 모두 3 mm 연장된 배경 아트워크',
      en: 'Background artwork extending 3 mm beyond the dashed trim boundary on all four sides',
    },
    caption: {
      ko: '수정 후: 216 × 303 mm 페이지에 배경을 실제로 연장했습니다. 점선은 화면에만 겹친 210 × 297 mm 재단 경계이며 PDF에는 인쇄되지 않습니다. 네 변의 배경과 박스를 각각 확인하세요.',
      en: 'After: the background actually extends across a 216 × 303 mm page. The dashed 210 × 297 mm trim guide is a screen overlay, not a printed PDF mark. Check artwork on all four sides separately from the boxes.',
    },
  },
];

export const bookletFigures: CaseStudyFigure[] = [
  {
    src: '/samples/printready-booklet-plan.png',
    width: 1200,
    height: 700,
    alt: {
      ko: '독자 순서 1~8 페이지 도식: 1~6은 콘텐츠이고 7~8은 의도적으로 남긴 빈 페이지',
      en: 'Reader-order plan of positions 1–8, with content on 1–6 and intentional blanks on 7–8',
    },
    caption: {
      ko: '6페이지 원고를 8칸에 놓는 교육용 계획도입니다. 이 예제는 7·8페이지를 비웠지만 최종 표지 위치에 따라 달라집니다. 인쇄용 면배치 파일이 아닙니다.',
      en: 'Teaching plan for a six-page manuscript in eight positions. This example leaves 7–8 blank; your cover arrangement may need different positions. It is not a press-imposition file.',
    },
  },
];
