
// =====================================================
//  scroll animation（fadeUp）
// =====================================================
const fadeElements = document.querySelectorAll('.fadeUpTrigger');
let fadePositions = [];

function updateFadePositions() {
  fadePositions = [];
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollY;
    fadePositions.push({ el, top });
  });
}

function fadeAnimeLight() {
  const scroll = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  fadePositions.forEach(({ el, top }) => {
    if (scroll + windowHeight > top + 50) {
      el.classList.add('fadeUp');
    } else {
      el.classList.remove('fadeUp');
    }
  });
}

updateFadePositions();
window.addEventListener('resize', updateFadePositions, { passive: true });
window.addEventListener('scroll', () => requestAnimationFrame(fadeAnimeLight), { passive: true });
window.addEventListener('load', fadeAnimeLight);



// =====================================================
//  Header & Hamburger（bodyスクロール対応・安定版）
// =====================================================
function FixedAnime() {
  const scroll = $(window).scrollTop();

  if (scroll > 50) { // ← 少し下がったら隠す（0だと誤判定しやすい）
    $('#header').addClass('dnone');
    $('.openbtn').addClass('fadeDown');
  } else {
    $('#header').removeClass('dnone');
    $('.openbtn').removeClass('fadeDown');
  }
}

// 初回ロード時はheaderをフェードイン
$(window).on('load', function () {
  $('#header').addClass('fadeDown');
  setTimeout(() => {
    $('#header').removeClass('fadeDown');
  }, 800); // フェードアニメ後にクラスを削除（状態リセット）
});

// スクロール時に切り替え
$(window).on('scroll', FixedAnime);

// =====================================================
//  Hamburger ボタンの動作
// =====================================================
$(".openbtn").on('click', function () {
  $(this).toggleClass('active');
  $("#header").toggleClass('panelactive');
});

$("#g-navi li a").on('click', function () {
  $(".openbtn").removeClass('active fadeDown');
  $("#header").removeClass('panelactive dnone');
});

// -------------------------------------------
// Smooth Scroll（アンカーリンク）
// -------------------------------------------
$('#g-navi li a, a[href^="#"]').on('click', function (e) {
  const href = $(this).attr('href');
  if (!href || href === '#') return;

  const target = $(href);
  if (target.length === 0) return;

  e.preventDefault();
  $('html, body').stop(true, false);

  const headerH = $('#header').outerHeight(true) || 0;
  const pos = target.offset().top - headerH;
  $('html, body').animate({ scrollTop: pos }, 600, 'swing');
});


// =====================================================
//  アンカーリンク（連続クリック対応）
// =====================================================
$('a[href^="#"]').off('click.anchor').on('click.anchor', function (e) {
  const href = $(this).attr('href');
  if (!href || href === '#') return;
  const $target = $(href);
  if ($target.length === 0) return;

  e.preventDefault();
  $('html, body').stop(true, false);

  const headerH = $('#header').outerHeight(true) || 0;
  const pos = $target.offset().top - headerH;
  $('html, body').animate({ scrollTop: pos }, 600, 'swing');
});


// =====================================================
//  page_top button
// =====================================================

const button = document.querySelector('.page-top');

if (button) {
  button.addEventListener('click', () => {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      button.classList.add('is-active');
    } else {
      button.classList.remove('is-active');
    }
  });
}
