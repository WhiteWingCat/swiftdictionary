(() => {
  "use strict";
  if (window.__swiftLearningConfirmationInstalled) return;
  window.__swiftLearningConfirmationInstalled = true;
  const copy = "Selecting this lesson will consume one daily lessons allowance, are you sure?";
  let approvedButton = null;
  let backdrop = null;
  let lastFocused = null;
  let pendingNewStartStatus = false;
  let pendingResolver = null;

  function closeDialog(confirmed) {
    if (!backdrop) return;
    const button = approvedButton;
    const resolve = pendingResolver;
    pendingResolver = null;
    backdrop.classList.remove("is-open");
    const finish = () => {
      backdrop?.remove();
      backdrop = null;
      approvedButton = null;
      if (confirmed && button && button.isConnected) {
        pendingNewStartStatus = true;
        button.dataset.confirmedLessonStart = "true";
        button.click();
      } else if (lastFocused?.isConnected) {
        lastFocused.focus();
      }
      lastFocused = null;
      if (resolve) resolve(confirmed);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else window.setTimeout(finish, 190);
  }

  function showDialog(button, message = copy, labels = {}) {
    if (backdrop) return false;
    approvedButton = button;
    lastFocused = document.activeElement;
    backdrop = document.createElement("div");
    backdrop.className = "lesson-start-confirm-backdrop";
    backdrop.innerHTML = '<section class="lesson-start-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="lessonStartConfirmMessage"><p id="lessonStartConfirmMessage"></p><div class="lesson-start-confirm-actions"><button type="button" data-confirm="no">Cancel</button><button type="button" data-confirm="yes">Confirm</button></div></section>';
    backdrop.querySelector("p").textContent = String(message || "");
    backdrop.querySelector('[data-confirm="no"]').textContent = labels.cancelLabel || "Cancel";
    backdrop.querySelector('[data-confirm="yes"]').textContent = labels.confirmLabel || "Confirm";
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
    return true;
  }

  window.showLearningAllowanceConfirmation = (message, labels = {}) => new Promise(resolve => {
    if (backdrop) { resolve(false); return; }
    pendingResolver = resolve;
    if (!showDialog(null, message, labels)) {
      pendingResolver = null;
      resolve(false);
    }
  });

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
        ["Your daily lesson-completion allowance has been used. You can still review completed lessons; new lessons unlock after the daily reset.","Your daily lesson allowance has been used. You can still review completed lessons; new lessons unlock after your local-day reset."],
        ["今日课程完成额度已用完。你仍可复习已完成的课程。","今日课程额度已用完。你仍可复习已完成的课程。"],
        ["Could not open lesson. Your saved progress remains available; please try again.","Today's daily lesson allowance has already been used. Your saved progress remains available; resume it after your local-day reset."],
        ["无法打开课程。已保存的进度仍可使用，请稍后再试。","今日课程额度已用完。你的学习进度仍会保留，可在本地日期重置后继续。"]
      ]);
      if (pendingNewStartStatus && message === "Lesson opened. Resuming is free.") {
        pendingNewStartStatus = false;
        status.textContent = "Lesson started. One daily lesson allowance has been used. Resuming is free.";
        return;
      }
      if (pendingNewStartStatus && message === "课程已打开，继续学习无需额外额度。") {
        pendingNewStartStatus = false;
        status.textContent = "课程已开始，已使用一次每日课程额度。继续学习无需再次消耗额度。";
        return;
      }
      if (replacements.has(message)) {
        pendingNewStartStatus = false;
        status.textContent = replacements.get(message);
        return;
      }
      if (pendingNewStartStatus && message) pendingNewStartStatus = false;
    }).observe(status,{childList:true,characterData:true,subtree:true});
  }
})();