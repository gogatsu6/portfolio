//---------------------------------------------
// Profile Modal
//---------------------------------------------


document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.querySelector(".l-header__profile");
  const modal = document.getElementById("profileModal");

  if (!openButton || !modal) return;

  const panel = modal.querySelector(".c-profileModal__panel");
  const closeButtons = modal.querySelectorAll("[data-profile-close]");
  const contactLink = modal.querySelector("[data-profile-contact]");

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    openButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-profile-open");

    if (panel) {
      panel.focus();
    }
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    openButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-profile-open");
  };

  openButton.addEventListener("click", openModal);

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  if (contactLink) {
    contactLink.addEventListener("click", () => {
      closeModal();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
      openButton.focus();
    }
  });
});


//---------------------------------------------
// Section navigation dots
//---------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.section-dots');
  if (!nav) return;

  const mediaQuery = window.matchMedia('(max-width: 1280px)');
  const navLinks = Array.from(document.querySelectorAll('.section-dots__link'));

  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => {
      const targetId = link.dataset.target;
      return document.getElementById(targetId);
    })
    .filter(Boolean);

  let timer = null;
  let isHovering = false;
  let isClickScrolling = false;

  // 背景が暗いセクションが増えたらここに追加
  const darkSectionIds = ['uiux'];

  const showNav = () => {
    if (mediaQuery.matches) return;
    nav.classList.add('is-visible');
    nav.classList.remove('is-hidden');
  };

  const hideNav = () => {
    if (isHovering) return;
    nav.classList.remove('is-visible');
    nav.classList.add('is-hidden');
  };

  const updateNavThemeByViewport = () => {
    const darkSections = darkSectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const shouldUseDarkTheme = darkSections.some((section) => {
      const rect = section.getBoundingClientRect();

      // 黒背景セクションがこの範囲に入っている間だけ白文字にする
      const triggerTop = window.innerHeight * 0.22;
      const triggerBottom = window.innerHeight * 0.62;

      return rect.top < triggerBottom && rect.bottom > triggerTop;
    });

    nav.classList.toggle('is-on-dark', shouldUseDarkTheme);
  };

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isMatch = link.dataset.target === id;
      link.classList.toggle('is-active', isMatch);

      if (isMatch) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    updateNavThemeByViewport();
  };

  const getClosestSectionInView = () => {
    const viewportAnchor = window.innerHeight * 0.32;

    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - viewportAnchor);

      if (rect.bottom > 0 && rect.top < window.innerHeight && distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });

    return closestSection;
  };

  // =========================
  // 初期表示
  // =========================
  showNav();
  timer = setTimeout(() => {
    hideNav();
  }, 2000);

  // =========================
  // スクロールで表示
  // =========================
  window.addEventListener('scroll', () => {
    if (mediaQuery.matches) return;

    showNav();
    updateNavThemeByViewport();

    clearTimeout(timer);
    timer = setTimeout(() => {
      hideNav();
    }, 3000);
  });

  // =========================
  // 右側にマウスが近づいたら表示
  // =========================
  document.addEventListener('mousemove', (e) => {
    if (mediaQuery.matches) return;

    const triggerArea = window.innerWidth - 120;

    if (e.clientX > triggerArea) {
      showNav();

      clearTimeout(timer);
      timer = setTimeout(() => {
        hideNav();
      }, 3000);
    }
  });

  // =========================
  // hover中は固定表示
  // =========================
  nav.addEventListener('mouseenter', () => {
    isHovering = true;
    showNav();
    clearTimeout(timer);
  });

  nav.addEventListener('mouseleave', () => {
    isHovering = false;

    clearTimeout(timer);
    timer = setTimeout(() => {
      hideNav();
    }, 2000);
  });

  // =========================
  // クリックで移動 + active更新
  // =========================
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      event.preventDefault();

      isClickScrolling = true;
      setActiveLink(targetId);

      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      showNav();

      clearTimeout(timer);
      timer = setTimeout(() => {
        hideNav();
      }, 3000);

      // クリック直後のobserver誤判定を防ぐ
      setTimeout(() => {
        isClickScrolling = false;

        const closestSection = getClosestSectionInView();
        if (closestSection) {
          setActiveLink(closestSection.id);
        } else {
          updateNavThemeByViewport();
        }
      }, 900);
    });
  });

  // =========================
  // Intersection Observer
  // =========================
  const observer = new IntersectionObserver(
    () => {
      if (isClickScrolling) return;

      const closestSection = getClosestSectionInView();
      if (closestSection) {
        setActiveLink(closestSection.id);
      } else {
        updateNavThemeByViewport();
      }
    },
    {
      root: null,
      rootMargin: '-18% 0px -55% 0px',
      threshold: [0.05, 0.12, 0.2, 0.35, 0.5]
    }
  );

  sections.forEach((section) => observer.observe(section));

  // =========================
  // リサイズ時の補正
  // =========================
  window.addEventListener('resize', () => {
    if (mediaQuery.matches) {
      nav.classList.remove('is-visible', 'is-hidden', 'is-on-dark');
      return;
    }

    updateNavThemeByViewport();

    const closestSection = getClosestSectionInView();
    if (closestSection) {
      setActiveLink(closestSection.id);
    }
  });

  // =========================
  // 初期active補正
  // =========================
  const initialSection = getClosestSectionInView();
  if (initialSection) {
    setActiveLink(initialSection.id);
  } else {
    updateNavThemeByViewport();
  }
});