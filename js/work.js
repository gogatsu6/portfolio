document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("work-gallery");
  const grid = document.getElementById("work-grid");
  const detail = document.getElementById("work-detail");
  const filterButtons = document.querySelectorAll(".work__filter li");

  if (!gallery || !grid || !detail) return;

  let works = [];

  try {
    const res = await fetch("./data/works.json");
    if (!res.ok) throw new Error(`works.json の読み込みに失敗: ${res.status}`);
    const data = await res.json();
    works = Array.isArray(data.works) ? data.works : [];
  } catch (error) {
    console.error(error);
    return;
  }

  if (!works.length) return;

  works.forEach((work, index) => {
    const isActive = index === 0;

    // ===== メイン画像 =====
    const img = document.createElement("div");
    img.className = `work__image${isActive ? " active" : ""}`;
    img.dataset.id = work.id;
    img.innerHTML = `<img src="${escapeHtml(work.mainImage || "")}" alt="${escapeHtml(work.title || "")}">`;
    gallery.appendChild(img);

    // ===== サムネ =====
    const li = document.createElement("li");
    li.className = `work__item${isActive ? " active" : ""}`;
    li.dataset.id = work.id;
    li.dataset.category = work.category || "";
    li.setAttribute("tabindex", "0");
    li.innerHTML = `<img src="${escapeHtml(work.thumbnail || "")}" alt="${escapeHtml(work.title || "")}">`;
    grid.appendChild(li);

    // ===== 詳細 =====
    const text = document.createElement("div");
    text.className = `work__detail${isActive ? " active" : ""}`;
    text.dataset.id = work.id;

    const desc = (work.descriptions || []).map(d => `
      <div class="work__block">
        <p class="work__label">${escapeHtml(d.label || "")}</p>
        <p>${nl2br(escapeHtml(d.text || ""))}</p>
      </div>
    `).join("");

    const linkHtml = work.link
      ? `
        <a href="${escapeHtml(work.link)}" class="work__title-link" target="_blank" rel="noopener noreferrer" aria-label="外部リンクを開く">
          ↗
        </a>
      `
      : "";

    const uxHtml = work.uxUrl
      ? `
        <div class="work__ux">
          <a href="${escapeHtml(work.uxUrl)}" target="_blank" rel="noopener noreferrer" class="work__ux-btn">
            ${escapeHtml(work.uxLabel || "UX設計の詳細を見る")}
          </a>
        </div>
      `
      : "";

    const pdfLinks = [
      { note: work.pdfNote1, url: work.pdfUrl1 },
      { note: work.pdfNote2, url: work.pdfUrl2 },
      { note: work.pdfNote3, url: work.pdfUrl3 },
      { note: work.pdfNote4, url: work.pdfUrl4 }
    ]
      .filter(item => item.note && item.url)
      .map(item => `
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="work__pdf-link">
          ${escapeHtml(item.note)}
        </a>
      `)
      .join("");

    const pdfHtml = pdfLinks
      ? `
        <div class="work__block">
          <p class="work__label">補足資料（PDF）</p>
          <p class="work__pdf-list">${pdfLinks}</p>
        </div>
      `
      : "";

    text.innerHTML = `
      <div class="work__detail-head">
        <h2>${nl2br(escapeHtml(work.title || ""))}</h2>
        ${linkHtml}
      </div>
      ${uxHtml}
      ${desc}
      ${pdfHtml}
    `;

    detail.appendChild(text);
  });

  function activateWork(id) {
    document.querySelectorAll(".work__item").forEach(el => {
      el.classList.toggle("active", el.dataset.id === id);
    });

    document.querySelectorAll(".work__image").forEach(el => {
      el.classList.toggle("active", el.dataset.id === id);
    });

    document.querySelectorAll(".work__detail").forEach(el => {
      el.classList.toggle("active", el.dataset.id === id);
    });
  }

  document.querySelectorAll(".work__item").forEach(item => {
    item.addEventListener("click", () => {
      activateWork(item.dataset.id);
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateWork(item.dataset.id);
      }
    });
  });

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach(el => el.classList.remove("active"));
      btn.classList.add("active");

      const items = [...document.querySelectorAll(".work__item")];

      items.forEach(item => {
        const show = filter === "all" || item.dataset.category === filter;
        item.style.display = show ? "" : "none";
      });

      const visibleItems = items.filter(item => item.style.display !== "none");
      if (visibleItems.length) {
        activateWork(visibleItems[0].dataset.id);
      }
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const target = document.querySelector(`.work__item[data-id="${cssEscape(hash)}"]`);
    if (target) {
      const category = target.dataset.category;
      const filterBtn = document.querySelector(`.work__filter li[data-filter="${cssEscape(category)}"]`);
      if (filterBtn) filterBtn.click();
      activateWork(hash);
    }
  }

  function nl2br(str) {
    return String(str).replace(/\n/g, "<br>");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function cssEscape(str) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(str);
    }
    return String(str).replace(/"/g, '\\"');
  }
});

  // ===== モバイル時サムネイルスライダー =====
  const slider = document.querySelector(".work__grid");
  const prevBtn = document.querySelector(".work__slider-btn--prev");
  const nextBtn = document.querySelector(".work__slider-btn--next");

  if (slider && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const firstItem = slider.querySelector(".work__item");
      if (!firstItem) return 140;

      const itemWidth = firstItem.getBoundingClientRect().width;
      return itemWidth + 10; // gap分込み
    };

    prevBtn.addEventListener("click", () => {
      slider.scrollBy({
        left: -getScrollAmount() * 2,
        behavior: "smooth"
      });
    });

    nextBtn.addEventListener("click", () => {
      slider.scrollBy({
        left: getScrollAmount() * 2,
        behavior: "smooth"
      });
    });
  }

// =========================
// Back to Top
// =========================
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  const toggleBackToTop = () => {
const showOffset = 100;
    if (window.scrollY > showOffset) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  window.addEventListener("resize", toggleBackToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // 初期状態も判定
  toggleBackToTop();
}