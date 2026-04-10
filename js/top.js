document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // Featured Projects: カード全体クリック
  // =====================================================
  const featuredProjects = Array.from(document.querySelectorAll("[data-featured-project]"));

  featuredProjects.forEach((project) => {
    const targetUrl = project.dataset.projectLink;
    if (!targetUrl) return;

    project.style.cursor = "pointer";

    project.addEventListener("click", (event) => {
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
  // Featured Projects: progress line + moving dot
  // =====================================================
  const featuredInner = document.querySelector(".top-featured__inner");
  const progress = document.querySelector(".top-featured__progress");
  const activeDot = document.querySelector(".top-featured__active-dot");
  const steps = Array.from(document.querySelectorAll(".top-featured__step"));

  if (featuredInner && progress && activeDot && featuredProjects.length) {
    const mobileMq = window.matchMedia("(max-width: 767px)");
    let ticking = false;

    const getStepY = (project, isMobile) => {
      if (isMobile) {
        // SPは case-doctors のように少し上寄り
        return project.offsetTop + 18;
      }

      // PC / tablet はカード中央
      return project.offsetTop + project.offsetHeight / 2;
    };

    const getAllStepPositions = () => {
      const isMobile = mobileMq.matches;
      return featuredProjects.map((project) => getStepY(project, isMobile));
    };

    const renderStaticSteps = () => {
      const positions = getAllStepPositions();

      steps.forEach((step, index) => {
        if (typeof positions[index] !== "number") return;
        step.style.top = `${Math.round(positions[index])}px`;
      });
    };

    const setActiveCard = (index) => {
      featuredProjects.forEach((project, i) => {
        project.classList.toggle("is-active", i === index);
      });

      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === index);
      });
    };

    const setActiveDotPosition = (y) => {
      activeDot.style.top = `${Math.round(y)}px`;
    };

    const getActiveIndex = () => {
      let activeIndex = 0;

      if (mobileMq.matches) {
        const triggerLine = window.innerHeight * 0.28;

        featuredProjects.forEach((project, index) => {
          const rect = project.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            activeIndex = index;
          }
        });

        return activeIndex;
      }

      // PC / tablet は「カード中央が画面中央付近に最も近いもの」
      const triggerLine = window.innerHeight * 0.5;
      let minDistance = Infinity;

      featuredProjects.forEach((project, index) => {
        const rect = project.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - triggerLine);

        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      return activeIndex;
    };

    const updateFeaturedProgress = () => {
      const positions = getAllStepPositions();
      if (!positions.length) return;

      const activeIndex = getActiveIndex();
      setActiveCard(activeIndex);
      setActiveDotPosition(positions[activeIndex]);
    };

    const requestUpdateFeaturedProgress = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        renderStaticSteps();
        updateFeaturedProgress();
        ticking = false;
      });
    };

    window.addEventListener("scroll", requestUpdateFeaturedProgress, { passive: true });
    window.addEventListener("resize", requestUpdateFeaturedProgress);
    window.addEventListener("load", requestUpdateFeaturedProgress);

    setTimeout(() => {
      requestUpdateFeaturedProgress();
    }, 60);
  }

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