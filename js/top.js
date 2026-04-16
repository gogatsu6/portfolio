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
  const dots = Array.from(document.querySelectorAll(".top-grid__dot"));

  if (viewport && track && prevBtn && nextBtn) {
    const originalCards = Array.from(track.querySelectorAll(".project-card"));
    const CARD_COUNT = originalCards.length;

    if (CARD_COUNT > 0) {
      const CLONE_COUNT = Math.min(3, CARD_COUNT);
      const AUTO_SLIDE_INTERVAL = 3200;

      let logicalIndex = 0;
      let isAnimating = false;
      let autoSlideTimer = null;
      let resizeTimer = null;

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

      const warmCloneImages = () => {
        track.querySelectorAll(".project-card img").forEach((img) => {
          const src = img.currentSrc || img.src;
          if (!src) return;

          const preload = new Image();
          preload.src = src;
        });
      };

      const getGap = () => {
        const styles = window.getComputedStyle(track);
        return parseFloat(styles.columnGap || styles.gap || 0);
      };

      const getPerView = () => {
        if (window.innerWidth <= 767) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3; // 中央3枚表示
      };

      const getLayout = () => {
        const gap = getGap();
        const viewportWidth = viewport.clientWidth;
        const perView = getPerView();

        let cardWidth;

        if (perView === 3) {
          // 左右に半分見切れを出す: 画面内には「4枚分」使う
          cardWidth = (viewportWidth - gap * 4) / 4;
        } else if (perView === 2) {
          cardWidth = (viewportWidth - gap) / 2;
        } else {
          cardWidth = viewportWidth;
        }

        const step = cardWidth + gap;

        track.style.setProperty("--card-width", `${cardWidth}px`);

        return { cardWidth, step, perView, gap };
      };

      const getPhysicalIndex = (index) => index + CLONE_COUNT;

      const normalizeIndex = (index) => {
        return ((index % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
      };

const getCenterLogicalIndex = (index) => {
  return normalizeIndex(index);
};

      const setActiveDot = (index) => {
        if (!dots.length) return;

        dots.forEach((dot, i) => {
          const isActive = i === index;
          dot.classList.toggle("is-active", isActive);

          if (isActive) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });
      };

      const updateActiveDotByLogicalIndex = (index) => {
        const centerIndex = getCenterLogicalIndex(index);
        setActiveDot(centerIndex);
      };

      const applyPosition = (index, withTransition = true) => {
        const { cardWidth, step, perView } = getLayout();
        if (!cardWidth || !step) return;

        const physicalIndex = getPhysicalIndex(index);
        let offset = 0;

        if (perView === 3) {
          // 左半分カード位置に合わせる
          offset = step * physicalIndex + cardWidth / 2;
        } else {
          // 通常スライド
          offset = step * physicalIndex;
        }

        track.style.transition = withTransition ? "transform 0.45s ease" : "none";
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;

        updateActiveDotByLogicalIndex(index);
      };

      const jumpWithoutAnimation = (index) => {
        logicalIndex = index;
        applyPosition(logicalIndex, false);
      };

      const snapToLogicalIndex = () => {
        if (logicalIndex >= CARD_COUNT) {
          jumpWithoutAnimation(0);
        } else if (logicalIndex < 0) {
          jumpWithoutAnimation(CARD_COUNT - 1);
        }
      };

      const moveTo = (nextIndex) => {
        if (isAnimating || CARD_COUNT <= 0) return;

        isAnimating = true;
        logicalIndex = nextIndex;
        applyPosition(logicalIndex, true);
      };

      const moveNext = () => {
        moveTo(logicalIndex + 1);
      };

      const movePrev = () => {
        moveTo(logicalIndex - 1);
      };

      const stopAutoSlide = () => {
        if (autoSlideTimer) {
          clearInterval(autoSlideTimer);
          autoSlideTimer = null;
        }
      };

      const startAutoSlide = () => {
        stopAutoSlide();

        if (CARD_COUNT <= 1) return;

        autoSlideTimer = setInterval(() => {
          if (!isAnimating) {
            moveNext();
          }
        }, AUTO_SLIDE_INTERVAL);
      };

      const restartAutoSlide = () => {
        stopAutoSlide();
        startAutoSlide();
      };

      const handleTransitionEnd = () => {
        snapToLogicalIndex();

        requestAnimationFrame(() => {
          isAnimating = false;
        });
      };

      const setup = () => {
        createClones();
        warmCloneImages();
        logicalIndex = 0;
        applyPosition(logicalIndex, false);
        updateActiveDotByLogicalIndex(logicalIndex);
        startAutoSlide();
      };

      prevBtn.addEventListener("click", () => {
        movePrev();
        restartAutoSlide();
      });

      nextBtn.addEventListener("click", () => {
        moveNext();
        restartAutoSlide();
      });

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          const { perView } = getLayout();

          let targetIndex = index;

          if (perView === 3) {
            // 中央カード基準なので、左端カード位置に変換
            targetIndex = index - 1;
          }

          moveTo(targetIndex);
          restartAutoSlide();
        });
      });

      track.addEventListener("transitionend", handleTransitionEnd);

      viewport.addEventListener("mouseenter", stopAutoSlide);
      viewport.addEventListener("mouseleave", startAutoSlide);
      viewport.addEventListener("focusin", stopAutoSlide);
      viewport.addEventListener("focusout", startAutoSlide);

      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          applyPosition(logicalIndex, false);
          updateActiveDotByLogicalIndex(logicalIndex);
        }, 80);
      });

      window.addEventListener("load", () => {
        applyPosition(logicalIndex, false);
        updateActiveDotByLogicalIndex(logicalIndex);
      });

      setup();
    }
  }
});