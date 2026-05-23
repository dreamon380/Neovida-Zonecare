/* ============================================================
   존케어서비스 (ZONE CARE · NEOVIDA) 랜딩 페이지 — 인터랙션
   ============================================================ */
(function () {
  "use strict";

  /* --- 1. 스크롤 시 네비게이션 스타일 변경 --- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- 2. 모바일 메뉴 토글 --- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* --- 3. 스크롤 인 애니메이션 (IntersectionObserver) --- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* --- 4. 연도 자동 표시 --- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- 5. 문의 폼 처리 (백엔드 없음 → mailto로 메일 클라이언트 실행) ---
     실제 서버 연동 시 이 핸들러를 fetch(POST) 등으로 교체하세요. */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = "필수 항목을 모두 입력해 주세요.";
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const subject = `[존케어서비스 문의] ${data.get("topic")} — ${data.get("name")}`;
      const body =
        `이름/상호명: ${data.get("name")}\n` +
        `이메일: ${data.get("email")}\n` +
        `연락처: ${data.get("phone") || "-"}\n` +
        `관심 서비스: ${data.get("topic")}\n\n` +
        `${data.get("message")}`;
      const to = "dreamon380@gmail.com";
      window.location.href =
        `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = "메일 작성 창이 열립니다. 전송을 완료해 주세요.";
      form.reset();
    });
  }
})();
