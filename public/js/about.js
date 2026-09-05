(function () {
  const overlay = document.createElement("div");
  overlay.className = "fdf-about";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "false");
  overlay.setAttribute("aria-labelledby", "fdf-about-title");
  overlay.innerHTML = `
    <div class="fdf-about-panel">
      <button type="button" class="fdf-about-close" id="fdf-about-close" aria-label="안내 닫기">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      <p>
        《자유로운 문서 포맷 Free Document Format》은 독점적인 소프트웨어 없이, 오픈소스 기술로 유동적이고 유연한 문서 형식을 만들려는 실험입니다.
      </p>
      <p>
        지금 이 페이지는 웹 문서를 종이책으로 전환하는 과정 그 자체가 드러난 화면입니다.
        여기서 보이는 그대로 실제 종이책이 만들어졌고, 흰 사각형이 실제 판형(115 × 180 mm)입니다.
        작동 원리는 다음과 같습니다.
      </p>
      <ol>
        <li>원고를 마크다운으로 씁니다.</li>
        <li>Pandoc이 마크다운 원고를 HTML로 바꿉니다.</li>
        <li>Paged.js가 CSS Paged Media를 읽어 긴 글을 쪽 단위로 나누고, 목차·색인·각주·쪽번호와 같은 요소를 지정한 위치에 붙입니다.</li>
        <li>웹 브라우저가 제공하는 기본 인쇄 기능으로 PDF 생성 혹은 인쇄하면 종이책이 됩니다.</li>
      </ol>
      <p>
        페이지가 잠시 비어 보이다가 펼쳐지면, 조판 엔진이 본문을 나누고 있는 중이니 잠시 기다려주세요.
      </p>
    </div>
  `;

  const help = document.createElement("button");
  help.className = "fdf-about-help";
  help.type = "button";
  help.title = "이 페이지 안내";
  help.setAttribute("aria-label", "이 페이지 안내 열기");
  help.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 11v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>
  `;

  function openAbout() {
    overlay.hidden = false;
    help.setAttribute("aria-expanded", "true");
    const close = overlay.querySelector("#fdf-about-close");
    if (close) close.focus();
  }

  function closeAbout() {
    overlay.hidden = true;
    help.setAttribute("aria-expanded", "false");
    help.focus();
  }

  overlay.querySelector("#fdf-about-close").addEventListener("click", closeAbout);

  help.addEventListener("click", () => {
    if (overlay.hidden) openAbout();
    else closeAbout();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) {
      closeAbout();
    }
  });

  document.documentElement.appendChild(overlay);
  document.documentElement.appendChild(help);

  overlay.style.cssText = "position:fixed;top:56px;left:16px;z-index:2147483646;";
  help.style.cssText = "position:fixed;top:16px;left:16px;z-index:2147483645;";
  help.setAttribute("aria-expanded", "false");

  window.addEventListener("beforeprint", () => {
    overlay.hidden = true;
    help.setAttribute("aria-expanded", "false");
  });
})();
