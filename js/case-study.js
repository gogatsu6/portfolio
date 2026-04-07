/* ---------------------------------
   Timeline for case studies
--------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const timelineConfigs = [
        {
            stepSelector: ".case-doctors-step",
            finalSelector: ".case-doctors-step--final"
        },
        {
            stepSelector: ".case-saas-step",
            finalSelector: ".case-saas-step--final"
        },
        {
            stepSelector: ".case-portfolio-step",
            finalSelector: ".case-portfolio-step--final"
        }
    ];

    timelineConfigs.forEach(({ stepSelector, finalSelector }) => {
        const steps = document.querySelectorAll(stepSelector);
        if (!steps.length) return;

        let isLocked = false;

        const setActiveStep = (target) => {
            steps.forEach((step) => step.classList.remove("is-active"));
            target.classList.add("is-active");
        };

        const updateActiveStep = () => {
            if (isLocked) return;

            const viewportCenter = window.innerHeight / 2;

            let closestStep = null;
            let closestDistance = Infinity;

            steps.forEach((step) => {
                const rect = step.getBoundingClientRect();
                const stepCenter = rect.top + rect.height / 2;
                const distance = Math.abs(viewportCenter - stepCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestStep = step;
                }
            });

            if (closestStep) {
                setActiveStep(closestStep);

                if (closestStep.matches(finalSelector)) {
                    isLocked = true;
                }
            }
        };

        setActiveStep(steps[0]);

        window.addEventListener("scroll", updateActiveStep, { passive: true });
        window.addEventListener("resize", updateActiveStep);

        updateActiveStep();
    });

    /* ---------------------------------
       Modal for images
    --------------------------------- */
    const modal = document.getElementById("modal");
    const modalOpenTargets = document.querySelectorAll(".js-modal-open");

    if (modal && modalOpenTargets.length) {
        const modalImg = modal.querySelector("img");
        const closeBtn =
            modal.querySelector(".case-saas-modal__close") ||
            modal.querySelector(".case-portfolio-modal__close");

        if (modalImg) {
            modalOpenTargets.forEach((img) => {
                img.addEventListener("click", () => {
                    modal.classList.add("is-active");
                    modal.setAttribute("aria-hidden", "false");
                    modalImg.src = img.src;
                    modalImg.alt = img.alt || "拡大画像";
                });
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                modal.classList.remove("is-active");
                modal.setAttribute("aria-hidden", "true");
            });
        }

        modal.addEventListener("click", () => {
            modal.classList.remove("is-active");
            modal.setAttribute("aria-hidden", "true");
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("is-active")) {
                modal.classList.remove("is-active");
                modal.setAttribute("aria-hidden", "true");
            }
        });
    }
});