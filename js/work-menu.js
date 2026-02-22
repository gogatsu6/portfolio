// =====================================================
// WorkTop専用：ハンバーガーメニュー制御（競合回避版）
// =====================================================
$(function () {
  // WorkTopは常にハンバーガー
  $("body#work").addClass("is-hamburger");

  // 既に他JSでバインドされてる可能性があるので解除
  $(".openbtn").off("click");
  $("#g-navi a").off("click");

  // scroll系の制御がある場合も止める（common.js側の影響を切る）
  $(window).off("scroll");

  // 初期表示：ボタン表示（workと同じ演出を使うなら）
  $(".openbtn").addClass("fadeDown");

  // 開閉
  $(".openbtn").on("click", function () {
    $(this).toggleClass("active");
    $("#header").toggleClass("panelactive");
  });

  // メニュー内リンクで閉じる
  $("#g-navi a").on("click", function () {
    $(".openbtn").removeClass("active");
    $("#header").removeClass("panelactive");
  });
});

$(function () {
  console.log("work-menu.js loaded");
  console.log("header:", $("#header").length, "g-navi:", $("#g-navi").length, "openbtn:", $(".openbtn").length);

  $(".openbtn").on("click", function () {
    console.log("openbtn clicked");
  });
});