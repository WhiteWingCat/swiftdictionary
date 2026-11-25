/* SwiftDictionary U2.9.0 — English topic filters. Loaded after the main dictionary script. */
(() => {
  "use strict";
  const categories = [
    "Actions", "Everyday Terms", "Activities", "Places", "People & Relationships",
    "Science & Technology", "History & Culture", "Nature & Environment", "Education", "Emotions & Descriptions"
  ];
  const baselineCategories = window.SWIFT_ENGLISH_BASELINE_CATEGORIES || {};
  englishWords.forEach(item => {
    if (!Array.isArray(item.categories) || !item.categories.length) {
      const assigned = baselineCategories[String(item.word || "").toLowerCase()];
      if (Array.isArray(assigned)) item.categories = assigned.slice();
    }
  });
  const row = document.createElement("div");
  row.id = "englishTopicCategoryRow";
  row.className = "category-row";
  row.setAttribute("aria-label", "Filter English words by topic");
  row.hidden = course !== "en";
  const label = document.createElement("div");
  label.className = "filter-group-label";
  label.textContent = "Topics";
  row.appendChild(label);
  let activeTopic = "all";
  const buttons = [];
  function updateButtons() {
    buttons.forEach(button => {
      const active = button.dataset.englishCategory === activeTopic;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  function resetForCourse() {
    activeTopic = "all";
    row.hidden = course !== "en";
    updateButtons();
    render();
  }
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "category-button active";
  allButton.dataset.englishCategory = "all";
  allButton.textContent = "All topics";
  allButton.setAttribute("aria-pressed", "true");
  allButton.addEventListener("click", () => { activeTopic = "all"; currentPage = 1; updateButtons(); render(); });
  buttons.push(allButton);
  row.appendChild(allButton);
  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.dataset.englishCategory = category;
    button.textContent = category;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => { activeTopic = activeTopic === category ? "all" : category; currentPage = 1; updateButtons(); render(); });
    buttons.push(button);
    row.appendChild(button);
  });
  const existingRow = document.getElementById("categoryRow");
  if (!existingRow) return;
  existingRow.parentNode.insertBefore(row, existingRow);
  const originalFilteredWords = filteredWords;
  filteredWords = function () {
    const result = originalFilteredWords();
    if (course !== "en" || activeTopic === "all") return result;
    return result.filter(item => Array.isArray(item.categories) && item.categories.includes(activeTopic));
  };
  const originalRender = render;
  render = function () {
    row.hidden = course !== "en";
    originalRender();
  };
  window.addEventListener("swiftdictionary:course-changed", resetForCourse);
  render();
  window.SWIFT_ENGLISH_CATEGORY_FILTERS_READY = true;
})();
