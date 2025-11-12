// ===================================================== 
//  work.js — Muuri＋スマホ横スクロール＋暴走防止＋高さリセット＋スマホソート対応版（停止後ゆっくりループ）
// =====================================================

$(window).off('scroll');
$('.openbtn').off('click');
$('#g-navi a').off('click');

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../work/data/works.json");
    const jsonData = await response.json();
    const works = jsonData.works;

    console.log("✅ JSON 読み込み成功", works);

    const gallery = document.getElementById("work-gallery");
    const detail = document.getElementById("work-detail");
    const gridEl = document.querySelector(".grid");
    const thumbPrev = document.querySelector(".thumb-prev");
    const thumbNext = document.querySelector(".thumb-next");

    if (!gallery || !detail || !gridEl) {
      console.error("❌ 必要な要素が見つかりません。");
      return;
    }

    // =====================================================
    // JSONを元にDOM生成
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

      const descHTML = work.descriptions
        .map(
          (desc) => `
            <div class="description_container">
              <p class="description_sub-title">${desc.label}</p>
              <p>${desc.text.replace(/\n/g, '<br>')}</p>
            </div>
          `
        )
        .join("");

      const linkHtml = work.link
        ? `<a href="${work.link}" target="_blank" rel="noopener noreferrer"><img src="../work/img/link.png" alt="リンク"></a>`
        : "";

      textDiv.innerHTML = `
        <div class="description_title">
          <h3>${work.title.replace(/\n/g, '<br>')}</h3>
          ${linkHtml}
        </div>
        ${descHTML}
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
      console.log("💻 Muuri 初期化");
    };

    const destroyMuuri = () => {
      if (grid) {
        grid.destroy();
        grid = null;
      }
      gridEl.style.display = "flex";
      gridEl.style.flexWrap = "nowrap";
      gridEl.style.overflowX = "auto";
      gridEl.parentElement.style.height = "auto"; // ✅ 高さリセット
      console.log("📱 Muuri 停止＆高さリセット");
    };

    // =====================================================
    // 画像読込完了 → Muuri再配置
    // =====================================================
    const allImages = gridEl.querySelectorAll("img");
    let loadedCount = 0;
    allImages.forEach((img) => {
      img.addEventListener("load", () => {
        loadedCount++;
        if (loadedCount === allImages.length && grid) {
          console.log("🟢 画像読込完了 → Muuriレイアウト更新");
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
    // 📱 スマホ専用：横スクロールループ（停止後にゆっくり戻る）
    // =====================================================
    const gridContainer = document.querySelector(".grid");

    if (thumbPrev && thumbNext && gridContainer) {
      const scrollAmount = 150;
      let isJumping = false;
      let scrollTimeout = null; // 🆕 停止タイマー

      gridContainer.addEventListener("scroll", () => {
        if (isJumping) return;

        const maxScroll = gridContainer.scrollWidth - gridContainer.clientWidth;
        const current = gridContainer.scrollLeft;

        // スクロール中はタイマーをリセット
        if (scrollTimeout) clearTimeout(scrollTimeout);

        // 一定時間（1.2秒）止まっていたらループ発動
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
        }, 2000); // 🕒 ← 停止後に戻るまでの時間（今は1.2秒）
      });

      // ← ボタン
      thumbPrev.addEventListener("click", () => {
        const maxScroll = gridContainer.scrollWidth - gridContainer.clientWidth;
        const newLeft = gridContainer.scrollLeft - scrollAmount;
        if (newLeft <= 0) {
          gridContainer.scrollTo({ left: maxScroll - 5, behavior: "smooth" });
        } else {
          gridContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      });

      // → ボタン
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
// ハンバーガーメニュー制御
// =====================================================
$(function () {
  $("#header").addClass("dnone");
  $(".openbtn").addClass("fadeDown");
  $(window).off("scroll");

  $(".openbtn").on("click", function () {
    $(this).toggleClass("active");
    $("#header").toggleClass("panelactive");
  });

  $("#g-navi a").on("click", function () {
    $(".openbtn").removeClass("active");
    $("#header").removeClass("panelactive");
  });
});
