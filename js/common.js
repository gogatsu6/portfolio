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