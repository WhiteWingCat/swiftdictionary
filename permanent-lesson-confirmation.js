(() => {
  "use strict";
  const copy = "Selecting this lesson will consume one daily lessons allowance, are you sure?";
  let approvedButton = null;
  let backdrop = null;
  let lastFocused = null;

  function closeDialog(confirmed) {
    if (!backdrop) return;
    const button = approvedButton;
    backdrop.classList.remove("is-open");
    const finish = () => {
      backdrop?.remove();
      backdrop = null;
      approvedButton = null;
      if (confirmed && button && button.isConnected) {
        button.dataset.confirmedLessonStart = "true";
        button.click();
      } else if (lastFocused?.isConnected) {
        lastFocused.focus();
      }
      lastFocused = null;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else window.setTimeout(finish, 190);
  }

  function showDialog(button) {
    if (backdrop) return;
    approvedButton = button;
    lastFocused = document.activeElement;
    backdrop = document.createElement("div");
    backdrop.className = "lesson-start-confirm-backdrop";
    backdrop.innerHTML = '<section class="lesson-start-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="lessonStartConfirmMessage"><p id="lessonStartConfirmMessage"></p><div class="lesson-start-confirm-actions"><button type="button" data-confirm="no">Cancel</button><button type="button" data-confirm="yes">Confirm</button></div></section>';
    backdrop.querySelector("p").textContent = copy;
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop || event.target.closest('[data-confirm="no"]')) closeDialog(false);
      if (event.target.closest('[data-confirm="yes"]')) closeDialog(true);
    });
    backdrop.addEventListener("keydown", event => {
      if (event.key === "Escape") { event.preventDefault(); closeDialog(false); }
      if (event.key === "Tab") {
        const controls = [...backdrop.querySelectorAll("button")];
        if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
      }
    });
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => {
      backdrop?.classList.add("is-open");
      backdrop?.querySelector('[data-confirm="yes"]')?.focus();
    });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("#lessonCards .lesson-card");
    if (!button) return;
    if (button.dataset.confirmedLessonStart === "true") {
      delete button.dataset.confirmedLessonStart;
      return;
    }
    // Completed and in-progress cards are free to review/resume.
    if (button.querySelector(".lesson-status.completed,.lesson-status.in-progress")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showDialog(button);
  }, true);
})();