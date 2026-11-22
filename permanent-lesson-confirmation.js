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

  const status = document.getElementById("lessonStatus");
  if (status) {
    new MutationObserver(() => {
      const message = status.textContent.trim();
      const replacements = new Map([
        ["Lesson opened. Resuming is free.","Lesson started. One daily lesson allowance has been used. Resuming is free."],
        ["课程已打开，继续学习无需额外额度。","课程已开始，已使用一次每日课程额度。继续学习无需再次消耗额度。"],
        ["Your daily lesson-completion allowance has been used. You can still review completed lessons; new lessons unlock after the daily reset.","Your daily lesson allowance has been used. You can still review completed lessons; new lessons unlock after your local-day reset."],
        ["今日课程完成额度已用完。你仍可复习已完成的课程。","今日课程额度已用完。你仍可复习已完成的课程。"],
        ["Could not open lesson. Your saved progress remains available; please try again.","Today's daily lesson allowance has already been used. Your saved progress remains available; resume it after your local-day reset."],
        ["无法打开课程，你的学习进度仍会保留，请稍后重试。","今日课程额度已用完。你的学习进度仍会保留，可在本地日期重置后继续。"]
      ]);
      if (replacements.has(message)) status.textContent = replacements.get(message);
    }).observe(status,{childList:true,characterData:true,subtree:true});
  }
})();