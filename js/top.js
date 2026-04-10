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
    const originalCards = Array.from(track.querySelectorAll(".project-card"));
    const CARD_COUNT = originalCards.length;

    // 中央3枚表示なので、左右に3枚ずつクローンを持つ
    const CLONE_COUNT = Math.min(3, CARD_COUNT);

    let logicalIndex = 0; // 0 = 左に1枚目半分、中央2〜4枚、右に5枚目半分
    let isAnimating = false;

    const createClones = () => {
      track.querySelectorAll(".project-card.is-clone").forEach((card) => card.remove());

      if (CARD_COUNT <= 1) return;

      const headClones = originalCards
        .slice(-CLONE_COUNT)
        .map((card) => card.cloneNode(true));

      const tailClones = originalCards
        .slice(0, CLONE_COUNT)
        .map((card) => card.cloneNode(true));

      headClones.forEach((clone) => {
        clone.classList.add("is-clone");
        track.prepend(clone);
      });

      tailClones.forEach((clone) => {
        clone.classList.add("is-clone");
        track.append(clone);
      });
    };

    const getGap = () => {
      const styles = window.getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap || 0);
    };

    const getLayout = () => {
      const gap = getGap();
      const viewportWidth = viewport.clientWidth;

      // 中央3枚 + 左右半分ずつ = 4枚分の幅
      const cardWidth = (viewportWidth - gap * 4) / 4;
      const step = cardWidth + gap;

      track.style.setProperty("--card-width", `${cardWidth}px`);

      return { cardWidth, step };
    };

    const getPhysicalIndex = (index) => index + CLONE_COUNT;

    const applyPosition = (index, withTransition = true) => {
      const { cardWidth, step } = getLayout();
      if (!cardWidth || !step) return;

      const physicalIndex = getPhysicalIndex(index);

      // 「左半分カード」位置に合わせる
      const offset = step * physicalIndex + cardWidth / 2;

      track.style.transition = withTransition ? "transform 0.45s ease" : "none";
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const snapToLogicalIndex = () => {
      if (logicalIndex >= CARD_COUNT) {
        logicalIndex = 0;
        applyPosition(logicalIndex, false);
      }

      if (logicalIndex < 0) {
        logicalIndex = CARD_COUNT - 1;
        applyPosition(logicalIndex, false);
      }
    };

    const moveTo = (nextIndex) => {
      if (isAnimating || CARD_COUNT <= 0) return;

      isAnimating = true;
      logicalIndex = nextIndex;
      applyPosition(logicalIndex, true);
    };

    const handleTransitionEnd = () => {
      snapToLogicalIndex();
      isAnimating = false;
    };

    const setup = () => {
      createClones();
      logicalIndex = 0;
      applyPosition(logicalIndex, false);
    };

    prevBtn.addEventListener("click", () => {
      moveTo(logicalIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
      moveTo(logicalIndex + 1);
    });

    track.addEventListener("transitionend", handleTransitionEnd);

    window.addEventListener("resize", () => {
      applyPosition(logicalIndex, false);
    });

    window.addEventListener("load", () => {
      applyPosition(logicalIndex, false);
    });

    setup();
  }
});