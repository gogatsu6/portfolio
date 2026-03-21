// =====================================================
//  work.js — Muuri＋スマホ横スクロール＋暴走防止＋高さリセット＋スマホソート対応版（停止後ゆっくりループ）＋ハッシュ自動オープン
//  ✅ 追加：data-case によるケース別フィルタ（hospital / ecommerce）
//  ✅ 追加：UX図のモーダル（uxModal があるページだけ）
//  ✅ 修正：overflow競合を防ぐ（元のoverflowを復元）
//  ✅ 修正：モーダルopen時はハンバーガーを閉じる（衝突防止）
// =====================================================

$(window).off('scroll');
$('.openbtn').off('click');
$('#g-navi a').off('click');

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../work/data/works.json");
    const jsonData = await response.json();

    // =====================================================
    // ✅ ここが今回の要：ページに応じて works を絞り込む
    // - body[data-case="hospital"] → hospital だけ
    // - body[data-case="ecommerce"] → ecommerce だけ
    // - data-case が無い → 全件表示（/work/index.html 想定）
    // =====================================================
    const allWorks = Array.isArray(jsonData.works) ? jsonData.works : [];

    const caseKeyRaw = document.body?.dataset?.case || "";
    const caseKey = String(caseKeyRaw).trim(); // "hospital" | "ecommerce" | ""（全体）

    const works = caseKey
      ? allWorks.filter(w => w && w.case === caseKey)
      : allWorks;

    console.log("✅ JSON 読み込み成功（allWorks）", allWorks);
    console.log("✅ caseKey:", caseKey || "(all)");
    console.log("✅ 表示対象 works:", works);

    const gallery = document.getElementById("work-gallery");
    const detail = document.getElementById("work-detail");
    const gridEl = document.querySelector(".grid");
    const thumbPrev = document.querySelector(".thumb-prev");
    const thumbNext = document.querySelector(".thumb-next");

    // ✅ UXページ等、workギャラリーが無いページではここで終了（他機能に影響させない）
    if (!gallery || !detail || !gridEl) {
      console.warn("ℹ️ workギャラリー要素が無いページなので、Muuri/ギャラリー処理はスキップします。");
      return;
    }

    // =====================================================
    // ✅ 0件のときの保険（caseKeyが間違ってる等）
    // =====================================================
    if (works.length === 0) {
      console.warn("⚠ 表示対象の作品が0件です。data-case と JSON の case を確認してね。");
      return;
    }

    // =====================================================
    // JSONを元にDOM生成（※ここからは「フィルタ済み works」を使う）
    // =====================================================
    works.forEach((work, index) => {
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("work-image");
      if (index === 0) imgDiv.classList.add("active");
      imgDiv.id = work.id;
      imgDiv.innerHTML = `<img src="${work.mainImage}" alt="${work.title}">`;
      gallery.appendChild(imgDiv);

      const li = document.createElement("li");
      li.classList.add("item", `sort-${work.category}`);
      if (index === 0) li.classList.add("active");
      li.dataset.target = work.id;
      li.innerHTML = `<img src="${work.thumbnail}" alt="${work.title}" class="thumb-img">`;
      gridEl.appendChild(li);

      const textDiv = document.createElement("div");
      textDiv.classList.add("text-content");
      if (index === 0) textDiv.classList.add("active");
      textDiv.dataset.id = work.id;

      // --- descriptions（label/text 前提） ---
      const descHTML = (work.descriptions || [])
        .filter((desc) => desc && desc.label)
        .map((desc) => {
          const text = typeof desc.text === "string" ? desc.text : "";
          return `
            <div class="description_container">
              <p class="description_sub-title">${desc.label}</p>
              <p>${text.replace(/\n/g, "<br>")}</p>
            </div>
          `;
        })
        .join("");

      // --- PDF補足（work直下の pdfUrl/pdfNote を使う） ---
let pdfHTML = "";

if (
  (work.pdfNote1 && work.pdfUrl1) ||
  (work.pdfNote2 && work.pdfUrl2) ||
  (work.pdfNote3 && work.pdfUrl3) ||
  (work.pdfNote4 && work.pdfUrl4)
) {
  let pdfLinksHTML = "";

  if (work.pdfNote1 && work.pdfUrl1) {
    pdfLinksHTML += `
      <a href="${work.pdfUrl1}"
         target="_blank"
         rel="noopener noreferrer"
         class="pdf-link">
         ${work.pdfNote1}
      </a><br>
    `;
  }

  if (work.pdfNote2 && work.pdfUrl2) {
    pdfLinksHTML += `
      <a href="${work.pdfUrl2}"
         target="_blank"
         rel="noopener noreferrer"
         class="pdf-link">
         ${work.pdfNote2}
      </a><br>
    `;
  }

  if (work.pdfNote3 && work.pdfUrl3) {
    pdfLinksHTML += `
      <a href="${work.pdfUrl3}"
         target="_blank"
         rel="noopener noreferrer"
         class="pdf-link">
         ${work.pdfNote3}
      </a><br>
    `;
  }

  if (work.pdfNote4 && work.pdfUrl4) {
    pdfLinksHTML += `
      <a href="${work.pdfUrl4}"
         target="_blank"
         rel="noopener noreferrer"
         class="pdf-link">
         ${work.pdfNote4}
      </a>
    `;
  }

  pdfHTML = `
    <div class="description_container">
      <p class="description_sub-title">補足資料（PDF）</p>
      <p>${pdfLinksHTML}</p>
    </div>
  `;
}

      const linkHtml = work.link
        ? `<a href="${work.link}" target="_blank" rel="noopener noreferrer"><img src="../work/img/link.png" alt="リンク"></a>`
        : "";

const uxBtnHtml = work.uxUrl
  ? `
    <div class="ux-cta">
      <a href="${work.uxUrl}"
         class="ux-cta__btn"
         target="_blank"
         rel="noopener noreferrer">
        ${work.uxLabel || "UX設計の詳細を見る"}
      </a>
    </div>
  `
  : "";
      textDiv.innerHTML = `
        <div class="description_title">
          <h3>${String(work.title || "").replace(/\n/g, "<br>")}</h3>
          ${linkHtml}
        </div>

        ${uxBtnHtml}

        ${descHTML}
        ${pdfHTML}
      `;

      detail.appendChild(textDiv);
    });

    // =====================================================
    // Muuri 初期化／破棄関数
    // =====================================================
    let grid = null;

    const initMuuri = () => {
      grid = new Muuri(".grid", {
        layout: { fillGaps: true, horizontal: false },
        layoutDuration: 400,
        layoutEasing: "ease",
        dragEnabled: false,
      });
      console.log("Muuri 初期化");
    };

    const destroyMuuri = () => {
      if (grid) {
        grid.destroy();
        grid = null;
      }
      gridEl.style.display = "flex";
      gridEl.style.flexWrap = "nowrap";
      gridEl.style.overflowX = "auto";
      gridEl.parentElement.style.height = "auto";
      console.log("📱 Muuri 停止＆高さリセット");
    };

    // =====================================================
    // 画像読込完了 → Muuri再配置
    // =====================================================
    const allImages = gridEl.querySelectorAll("img");
    let loadedCount = 0;

    if (allImages.length === 0) {
      console.warn("⚠ grid 内に画像がありません。");
    }

    allImages.forEach((img) => {
      img.addEventListener("load", () => {
        loadedCount++;
        if (loadedCount === allImages.length && grid) {
          console.log("画像読込完了 → Muuriレイアウト更新");
          grid.refreshItems().layout();
        }
      });
    });

    // =====================================================
    // ソートボタン
    // =====================================================
    $(".sort-btn li").on("click", function () {
      $(".sort-btn .active").removeClass("active");
      const className = $(this).attr("class").split(" ")[0];
      $("." + className).addClass("active");

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        if (className === "sort00") {
          $(".item").show();
        } else {
          $(".item").hide();
          $(".item." + className).show();
        }
        return;
      }

      if (!grid) return;
      if (className === "sort00") grid.show("");
      else grid.filter("." + className);

      setTimeout(() => {
        grid.refreshItems().layout();
        const parent = gridEl.parentElement;
        if (parent) parent.style.height = gridEl.scrollHeight + "px";
      }, 600);
    });

    // =====================================================
    // サムネイルクリックで切替
    // =====================================================
    const thumbs = document.querySelectorAll(".item");
    const images = document.querySelectorAll(".work-image");
    const texts = document.querySelectorAll(".text-content");

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const targetId = thumb.dataset.target;
        thumbs.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        images.forEach((img) => img.classList.toggle("active", img.id === targetId));
        texts.forEach((text) => text.classList.toggle("active", text.dataset.id === targetId));
      });
    });

    // =====================================================
    //  ハッシュから該当作品を自動オープン！
    // =====================================================
    const handleHashOpen = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      setTimeout(() => {
        const targetThumb = document.querySelector(`.item[data-target="${hash}"]`);
        if (!targetThumb) {
          console.warn("⚠ 該当作品が見つかない（このページのフィルタ範囲外かも）:", hash);
          return;
        }

        targetThumb.click();

        const targetImg = document.getElementById(hash);
        if (targetImg) {
          targetImg.scrollIntoView({ behavior: "smooth" });
        }

        console.log("ハッシュ作品自動オープン:", hash);
      }, 200);
    };

    handleHashOpen();

    // =====================================================
    // PC／スマホ切替処理
    // =====================================================
    const checkMode = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) destroyMuuri();
      else if (!grid) initMuuri();
    };

    window.addEventListener("resize", checkMode);
    checkMode();

    // =====================================================
    // 📱 スマホ専用：横スクロールループ
    // =====================================================
    const gridContainer = document.querySelector(".grid");

    if (thumbPrev && thumbNext && gridContainer) {
      const scrollAmount = 150;
      let isJumping = false;
      let scrollTimeout = null;

      gridContainer.addEventListener("scroll", () => {
        if (isJumping) return;

        const maxScroll = gridContainer.scrollWidth - gridContainer.clientWidth;
        const current = gridContainer.scrollLeft;

        if (scrollTimeout) clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          if (current >= maxScroll - 20) {
            isJumping = true;
            gridContainer.scrollTo({ left: 5, behavior: "smooth" });
            setTimeout(() => (isJumping = false), 600);
          } else if (current <= 0) {
            isJumping = true;
            gridContainer.scrollTo({ left: maxScroll - 5, behavior: "smooth" });
            setTimeout(() => (isJumping = false), 600);
          }
        }, 2000);
      });

      thumbPrev.addEventListener("click", () => {
        const maxScroll = gridContainer.scrollWidth - gridContainer.clientWidth;
        const newLeft = gridContainer.scrollLeft - scrollAmount;
        if (newLeft <= 0) {
          gridContainer.scrollTo({ left: maxScroll - 5, behavior: "smooth" });
        } else {
          gridContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      });

      thumbNext.addEventListener("click", () => {
        const maxScroll = gridContainer.scrollWidth - gridContainer.clientWidth;
        const newLeft = gridContainer.scrollLeft + scrollAmount;
        if (newLeft >= maxScroll - 10) {
          gridContainer.scrollTo({ left: 5, behavior: "smooth" });
        } else {
          gridContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      });
    }
  } catch (err) {
    console.error("❌ JSON読み込み失敗:", err);
  }
});

// =====================================================
// ハンバーガーメニュー制御（ここは共通挙動のまま）
// =====================================================
const closeHamburger = () => {
  $(".openbtn").removeClass("active").attr("aria-expanded", "false");
  $("#header").removeClass("panelactive");
};

$(function () {
  $("#header").addClass("dnone");
  $(".openbtn").addClass("fadeDown");
  $(window).off("scroll");

  $(".openbtn").on("click", function () {
    const isActive = $(this).toggleClass("active").hasClass("active");
    $(this).attr("aria-expanded", String(isActive));
    $("#header").toggleClass("panelactive");
  });

  $("#g-navi a").on("click", function () {
    closeHamburger();
  });
});

// =====================================================
// UX 図モーダル（uxModal があるページだけ）
// =====================================================
(() => {
  const modal = document.getElementById("uxModal");
  const modalImg = document.getElementById("uxModalImg");
  const zoomables = document.querySelectorAll(".ux-zoomable");

  // ✅ UXページ以外は何もしない（最重要の安全ガード）
  if (!modal || !modalImg || zoomables.length === 0) return;

  let lastFocused = null;

  const lockScroll = () => {
    const html = document.documentElement;

    // すでにロック済みなら上書きしない（保険）
    if (!html.dataset.prevOverflow) {
      html.dataset.prevOverflow = html.style.overflow || "";
    }
    html.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    const html = document.documentElement;
    const prev = html.dataset.prevOverflow;

    html.style.overflow = typeof prev === "string" ? prev : "";
    delete html.dataset.prevOverflow;
  };

  const openModal = (imgEl) => {
    lastFocused = document.activeElement;

    // ✅ 競合回避：モーダル開くときはハンバーガーを閉じる
    closeHamburger();

    // 開いた瞬間、前回スクロール位置が残らないように先頭へ
    const dialog = modal.querySelector(".ux-modal__dialog");
    if (dialog) dialog.scrollTop = 0;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    modalImg.src = imgEl.src;
    modalImg.alt = imgEl.alt || "";

    lockScroll();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    modalImg.src = "";
    modalImg.alt = "";

    unlockScroll();

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  zoomables.forEach((img) => {
    img.addEventListener("click", () => openModal(img));
  });

  // × or overlay
  modal.addEventListener("click", (e) => {
    if (e.target.matches("[data-modal-close]")) {
      closeModal();
    }
  });

  // Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();