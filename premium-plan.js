/* SwiftDictionary U2.9.0 — dedicated Premium information page navigation. */
(() => {
  "use strict";
  const trigger = document.getElementById("premiumPlanOpen");
  if (!trigger) return;
  trigger.addEventListener("click", event => {
    event.preventDefault();
    const destination = new URL("premium-plan.html", document.baseURI);
    window.location.assign(destination.href);
  });
})();
