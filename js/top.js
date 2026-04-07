document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // Featured Projects: カード全体クリック
  // =====================================================
  const featuredProjects = document.querySelectorAll("[data-featured-project]");

  featuredProjects.forEach((project) => {
    const targetUrl = project.dataset.projectLink;
    if (!targetUrl) return;

    project.style.cursor = "pointer";

    project.addEventListener("click", (event) => {
      // すでにaタグをクリックした場合は標準リンクを優先
      const clickedLink = event.target.closest("a");
      if (clickedLink) return;

      window.location.href = targetUrl;
    });

    project.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = targetUrl;
      }
    });
  });

  // =====================================================
  // Other Works Slider
  // =====================================================
  const viewport = document.querySelector(".top-grid__viewport");
  const track = document.querySelector(".top-grid__track");
  const prevBtn = document.querySelector(".top-grid__nav--prev");
  const nextBtn = document.querySelector(".top-grid__nav--next");

  if (viewport && track && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const firstCard = track.querySelector(".project-card");
      if (!firstCard) return viewport.clientWidth * 0.8;

      const cardStyle = window.getComputedStyle(firstCard);
      const cardWidth = firstCard.getBoundingClientRect().width;
      const marginRight = parseFloat(cardStyle.marginRight) || 0;

      return cardWidth + marginRight;
    };

    const updateNavState = () => {
      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

      prevBtn.disabled = viewport.scrollLeft <= 0;
      nextBtn.disabled = viewport.scrollLeft >= maxScrollLeft - 1;
    };

    prevBtn.addEventListener("click", () => {
      viewport.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    });

    nextBtn.addEventListener("click", () => {
      viewport.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    });

    viewport.addEventListener("scroll", updateNavState);
    window.addEventListener("resize", updateNavState);

    updateNavState();
  }
});