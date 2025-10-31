
$(window).off('scroll');
$('.openbtn').off('click');
$('#g-navi a').off('click');

// =====================================================
//  work___ page_top button
// =====================================================

// work.js
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


// =====================================================
//  work___ sort button
// =====================================================


$(window).on('load',function(){

//＝＝＝Muuriギャラリープラグイン設定
var grid = new Muuri('.grid', {

//アイテムの表示速度
showDuration: 600,
showEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
hideDuration: 600,
hideEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
	
// アイテムの表示/非表示状態のスタイル
  visibleStyles: {
    opacity: '1',
    transform: 'scale(1)'
  },
  hiddenStyles: {
    opacity: '0',
    transform: 'scale(0.5)'
  }    
});

//＝＝＝並び替えボタン設定
$('.sort-btn li').on('click',function(){			//並び替えボタンをクリックしたら
	$(".sort-btn .active").removeClass("active");	//並び替えボタンに付与されているactiveクラスを全て取り除き
	var className = $(this).attr("class");			//クラス名を取得
	className = className.split(' ');				//「sortXX active」のクラス名を分割して配列にする
	$("."+className[0]).addClass("active");			//並び替えボタンに付与されているクラス名とギャラリー内のリストのクラス名が同じボタンにactiveクラスを付与
	if(className[0] == "sort00"){						//クラス名がsort00（全て）のボタンの場合は、
		 grid.show('');								//全ての要素を出す
	}else{											//それ以外の場合は
		grid.filter("."+className[0]); 				//フィルターを実行
	}
});
});

// =====================================================
//  work___ hamburger button (header表示制御付き)
// =====================================================

$(function () {
  // headerを初期で非表示
  $('#header').addClass('dnone');
  // ハンバーガーを常時表示
  $('.openbtn').addClass('fadeDown');

  // 共通のスクロールイベントを解除
  $(window).off('scroll');

  // --- ハンバーガー開閉 ---
  $('.openbtn').on('click', function () {
    console.log("openbtn clicked"); // デバッグ
    $(this).toggleClass('active');
    $('#header').toggleClass('panelactive');
  });

  // --- メニューリンククリック時 ---
  $('#g-navi a').on('click', function () {
    console.log("nav link clicked"); // デバッグ
    $('.openbtn').removeClass('active');
    $('#header').removeClass('panelactive');
  });
});




// =====================================================
//  work___ thumbnail slider
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  const thumbList = document.querySelector(".thumb-list");
  const prevBtn = document.querySelector(".thumb-prev");
  const nextBtn = document.querySelector(".thumb-next");

  if (thumbList && prevBtn && nextBtn) {
    const scrollAmount = 120; // スクロール量調整

    prevBtn.addEventListener("click", () => {
      thumbList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      thumbList.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }
});