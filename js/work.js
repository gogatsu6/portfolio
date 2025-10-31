// =====================================================
//  work___ sort button
// =====================================================

$(window).on('load', function() {
  // Muuriギャラリー設定
  var grid = new Muuri('.grid', {
    showDuration: 600,
    showEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    hideDuration: 600,
    hideEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    visibleStyles: { opacity: '1', transform: 'scale(1)' },
    hiddenStyles: { opacity: '0', transform: 'scale(0.5)' }
  });

  // 並び替えボタン設定
  $('.sort-btn li').on('click', function() {
    $(".sort-btn .active").removeClass("active");
    var className = $(this).attr("class").split(' ')[0];
    $("." + className).addClass("active");
    if (className === "sort00") {
      grid.show('');
    } else {
      grid.filter("." + className);
    }
  });
});

// =====================================================
//  work___ hamburger button (header表示制御付き)
// =====================================================

$(function() {
  // headerを初期で非表示
  $('#header').addClass('dnone');
  // ハンバーガーを常時表示
  $('.openbtn').addClass('fadeDown');

  // --- ハンバーガー開閉 ---
  $('.openbtn').on('click', function() {
    $(this).toggleClass('active');
    $('#header').toggleClass('panelactive');
  });

  // --- メニューリンククリック時 ---
  $('#g-navi a').on('click', function() {
    $('.openbtn').removeClass('active');
    $('#header').removeClass('panelactive');
  });
});

// =====================================================
//  work___ thumbnail click (メイン画像・説明切替)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  const thumbs = document.querySelectorAll(".thumb");
  const images = document.querySelectorAll(".work-image");
  const texts = document.querySelectorAll(".text-content");

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const targetId = thumb.dataset.target;

      // サムネイルのアクティブ切替
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");

      // メイン画像切替
      images.forEach((img) => {
        img.classList.toggle("active", img.id === targetId);
      });

      // テキスト切替
      texts.forEach((text) => {
        text.classList.toggle("active", text.dataset.id === targetId);
      });
    });
  });
});
