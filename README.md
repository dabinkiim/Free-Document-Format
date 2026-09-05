# 자유로운 문서 포맷 / Free Document Format

인디자인 없이 HTML, CSS, [Paged.js](https://pagedjs.org/)로 조판한 책 《자유로운 문서 포맷》의 웹 판본이자 제작 도구 체인입니다.

브라우저가 115 × 180 mm 종이책 페이지를 나누어 보여 줍니다. 같은 파일이 스크린의 책이 되고, 인쇄하면 종이책이 됩니다.

지은이 김다빈. 2024년 11월 14일 AABB에서 초판 발행.

## 작동 원리

1. 원고는 `markdown/text.md`에 마크다운으로 둡니다.
2. Pandoc이 HTML 조각으로 바꿉니다 (`npm run build:html`).
3. 브라우저에서 Paged.js가 CSS Paged Media(`public/css/style-screen.css`)를 읽어 쪽을 나누고, 목차·색인·각주·쪽번호를 붙입니다.
4. `public/css/interface.css`는 화면에서 책을 펼쳐 보이게 합니다.

사이트 파일은 `public/`에 있습니다. Vercel은 이 폴더를 웹 루트로 제공합니다.

## 로컬에서 보기

```bash
npm run dev
```

[http://localhost:8080](http://localhost:8080) 을 엽니다. 첫 조판에 몇 초가 걸립니다.

원고를 HTML에 다시 넣으려면 [Pandoc](https://pandoc.org/)이 필요합니다.

```bash
npm run build:html
```

## 라이선스

본문과 이미지는 지은이에게 저작권이 있으며, 문서는 Creative Commons Attribution-NonCommercial-NoDerivatives 4.0(CC-BY-NC-ND 4.0)을 따릅니다.
