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
//  Stickyfill（動画固定）
// =====================================================
$(window).on('load resize', function () {
  const elements = $('#fixed-area');
  if (typeof Stickyfill !== 'undefined') {
    if (window.innerWidth >= 768) {
      Stickyfill.add(elements);
    } else {
      Stickyfill.remove(elements);
    }
  }
});


// =====================================================
//  ON / OFF モード切替（ヘッダー／ページトップ位置制御含む）
// =====================================================
const wrapper = $('#wrapper');
const toggleBtn = $('#mode-toggle');
const videoOn = $('.video-on');
const videoOff = $('.video-off');
const onScreen = $('.on_screen');
const offScreen = $('.off_screen');
const header = $('#header');
const pageTop = $('.page-top');
const openbtn = $('.openbtn')
const footer = $('#footer')

wrapper.addClass('mode-on');
videoOn.show();
videoOff.hide();
offScreen.hide();

toggleBtn.on('click', function () {
  const isOn = wrapper.hasClass('mode-on');

  if (isOn) {
    // ---- ON → OFF ----
    wrapper.removeClass('mode-on').addClass('mode-off');
    toggleBtn
      .removeClass('mode-on')
      .addClass('mode-off')
      .text('OFF MODE');
    videoOn.hide();
    videoOff.show();
    onScreen.fadeOut(400, () => offScreen.fadeIn(400));

    // header / page-top を左側へ
    header.addClass('pos-left').removeClass('pos-right');
    pageTop.addClass('pos-left').removeClass('pos-right');
    openbtn.addClass('pos-left').removeClass('pos-right');
    footer.addClass('pos-left').removeClass('pos-right');
    
  } else {
    // ---- OFF → ON ----
    wrapper.removeClass('mode-off').addClass('mode-on');
    toggleBtn
      .removeClass('mode-off')
      .addClass('mode-on')
      .text('ON MODE');
    videoOff.hide();
    videoOn.show();
    offScreen.fadeOut(400, () => onScreen.fadeIn(400));

    // header / page-top を右側へ
    header.addClass('pos-right').removeClass('pos-left');
    pageTop.addClass('pos-right').removeClass('pos-left');
        openbtn.addClass('pos-right').removeClass('pos-left');
    footer.addClass('pos-right').removeClass('pos-left');

  }

  wrapper.addClass('is-switching');
  setTimeout(() => wrapper.removeClass('is-switching'), 400);
});



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
//  hand animation
// =====================================================
const hand = document.getElementById("hand");
const text = document.getElementById("text");
if (hand && text) {
  hand.addEventListener("animationend", () => {
    text.style.opacity = 1;
  });
}


// =====================================================
//  page_top button
// =====================================================

const button = document.querySelector('.page-top');

button.addEventListener('click', () => {
  window.scroll({ 
    top: 0, 
    behavior: "smooth"
  });
});

window.addEventListener('scroll', () => {
  if(window.scrollY > 100){
    button.classList.add('is-active');
  }else{
    button.classList.remove('is-active');
  }
});



// =====================================================
//  work___ page_top button
// =====================================================

//上部画像の設定
$('.gallery').slick({
	infinite: true, //スライドをループさせるかどうか。初期値はtrue。
	fade: true, //フェードの有効化
	arrows: true,//左右の矢印あり
	prevArrow: '<div class="slick-prev"></div>',//矢印部分PreviewのHTMLを変更
	nextArrow: '<div class="slick-next"></div>',//矢印部分NextのHTMLを変更
});

//選択画像の設定
$('.choice-btn').slick({
	infinite: true, //スライドをループさせるかどうか。初期値はtrue。
	slidesToShow: 8, //表示させるスライドの数
	focusOnSelect: true, //フォーカスの有効化
	asNavFor: '.gallery', //連動させるスライドショーのクラス名
});
  
//下の選択画像をスライドさせずに連動して変更させる設定。
$('.gallery').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
	var index = nextSlide; //次のスライド番号
	//サムネイルのslick-currentを削除し次のスライド要素にslick-currentを追加
	$(".choice-btn .slick-slide").removeClass("slick-current").eq(index).addClass("slick-current");
});