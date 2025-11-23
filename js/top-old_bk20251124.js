
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
      .text('Working');
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
      .text('Private');
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
//  hand animation
// =====================================================
const hand = document.getElementById("hand");
const text = document.getElementById("text");
if (hand && text) {
  hand.addEventListener("animationend", () => {
    text.style.opacity = 1;
  });
}


document.addEventListener("DOMContentLoaded", () => {

  /* PCだけで実行 */
  if (window.innerWidth >= 1025) {

    const title = document.querySelector("#top h1.on-title");

    if (title) {
      title.classList.add("pc-title-init");

      /* 2秒後にフェードイン */
      setTimeout(() => {
        title.classList.add("pc-title-show");
      }, 2000);
    }
  }

});



