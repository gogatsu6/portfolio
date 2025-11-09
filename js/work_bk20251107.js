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

  // --- ハンバーガー要素が存在する場合のみ処理 ---
  if ($('.openbtn').length && $('#header').length) {
    // --- ハンバーガー開閉 ---
    $('.openbtn').on('click', function () {
      console.log("openbtn clicked");
      $(this).toggleClass('active');
      $('#header').toggleClass('panelactive');
    });
  }

  // --- メニューリンクが存在する場合のみ処理 ---
  if ($('#g-navi a').length) {
    $('#g-navi a').on('click', function () {
      console.log("nav link clicked");
      $('.openbtn').removeClass('active');
      $('#header').removeClass('panelactive');
    });
  }
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


// =====================================================
//  work___ thumb-indicator_dots/loop
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  const thumbList = document.querySelector(".thumb-list");
  const thumbs = Array.from(document.querySelectorAll(".thumb"));
  const prevBtn = document.querySelector(".thumb-prev");
  const nextBtn = document.querySelector(".thumb-next");
  const dots = Array.from(document.querySelectorAll(".thumb-indicator span"));

  if (!thumbList || thumbs.length === 0) return;

  const total = thumbs.length;
  const visibleCount = 3; // 一度に見せる枚数
  const scrollAmount = thumbs[0].offsetWidth + 10; // サムネイル幅＋余白
  let currentIndex = 0;

  // ===== 表示更新関数 =====
  function updateActive(index) {
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });

    const perDotRange = Math.ceil(total / dots.length);
    const dotIndex = Math.floor(index / perDotRange);
    dots.forEach((dot, i) => dot.classList.toggle("active", i === dotIndex));
  }

  // ===== スクロールスナップ対応（スワイプ後のドット同期） =====
  thumbList.addEventListener("scroll", () => {
    const index = Math.round(thumbList.scrollLeft / (thumbs[0].offsetWidth + 10));
    if (index !== currentIndex) {
      currentIndex = index;
      updateActive(index);
    }
  });

  // ===== スクロール関数（ループ対応） =====
  function scrollToIndex(index, smooth = true) {
    if (index < 0) {
      index = total - 1;
    } else if (index >= total) {
      index = 0;
    }

    currentIndex = index;
    const left = scrollAmount * index;
    thumbList.scrollTo({
      left: left,
      behavior: smooth ? "smooth" : "auto",
    });

    updateActive(index);
  }

  // ===== 前後ボタン操作 =====
  nextBtn.addEventListener("click", () => {
    scrollToIndex(currentIndex + 1);
  });

  prevBtn.addEventListener("click", () => {
    scrollToIndex(currentIndex - 1);
  });

  // ===== サムネクリック =====
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => {
      scrollToIndex(i);
      // メイン画像と説明更新関数を呼び出す場所（例：showMainImage(i)）
    });
  });

  // ===== ドットクリック追加 =====
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      const perDotRange = Math.ceil(total / dots.length);
      const targetIndex = dotIndex * perDotRange;
      scrollToIndex(targetIndex);
    });
  });

  // ===== 初期化 =====
  updateActive(currentIndex);
});


// =====================================================
//  work___ JSON data load & DOM生成（統合版）
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./data/works.json");
    const jsonData = await response.json();
    const works = jsonData.works;

    console.log("✅ JSON 読み込み成功", works);

    // ===== HTMLの差し込み先 =====
    const gallery = document.getElementById("work-gallery");
    const detail = document.getElementById("work-detail");
    const thumbArea = document.getElementById("thumbnail-area");

    // ===== JSONデータをもとに生成 =====
    works.forEach((work, index) => {
      // --- メイン画像 ---
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("work-image");
      if (index === 0) imgDiv.classList.add("active");
      imgDiv.id = work.id;
      imgDiv.innerHTML = `<img src="${work.mainImage}" alt="${work.title}">`;
      gallery.appendChild(imgDiv);

      // --- サムネイル ---
      const thumb = document.createElement("img");
      thumb.classList.add("thumb", `sort-${work.category}`);
      thumb.src = work.thumbnail;
      thumb.alt = work.title;
      thumb.dataset.target = work.id;
      thumbArea.appendChild(thumb);

      // --- 説明欄 ---
      const textDiv = document.createElement("div");
      textDiv.classList.add("text-content");
      if (index === 0) textDiv.classList.add("active");
      textDiv.dataset.id = work.id;

      const descHTML = work.descriptions
        .map((desc) => `
          <div class="description_container">
            <p class="description_sub-title">${desc.label}</p>
            <p>${desc.text}</p>
          </div>
        `)
      .join("");

      // タイトル部分を description_title 構造で出す（既存のCSSに合わせる）
      const linkHtml = work.link
          ? `<a href="${work.link}" target="_blank" rel="noopener noreferrer"><img src="./img/link.png" alt="リンク先のアイコン"></a>`
          : "";

      textDiv.innerHTML = `
        <div class="description_title">
          <h3>${work.title}</h3>
          ${linkHtml}
          </div>
          ${descHTML}
        `;

      detail.appendChild(textDiv);
    });
  } catch (error) {
    console.error("❌ JSON読み込みエラー:", error);
  }
});
