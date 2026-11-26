/* Wrap the existing English and Chinese catalogues in the shared package contract. */
(() => {
  "use strict";
  const source = window.SWIFT_LEGACY_CONTENT_DATA || {};
  const packages = window.SWIFT_CONTENT_PACKAGES;
  // The English lesson expansion runs after the main inline application script.
  // Rebuild the package lesson snapshots here so they include those additions.
  if (source.en && typeof lessonData !== "undefined") {
    source.en.lessons = Object.values(lessonData).flat();
    if (typeof lessonZh !== "undefined") source.en.lessonTranslations = lessonZh;
  }
  if (source.zh && typeof chineseLessonData !== "undefined") {
    source.zh.lessons = Object.values(chineseLessonData).flat();
  }
  if (!packages) return;
  for (const code of ["en","zh"]) {
    const data = source[code];
    if (!data) continue;
    const dailyLearning = window.SWIFT_DAILY_LEARNING_CONTENT?.[code] || data.dailyLearning || {};
    packages.createPackage({
      languageCode:code, contentVersion:"legacy-u2.9.1",
      content:{
        dictionary:{entries:data.dictionary || []},
        lessons:{permanent:data.lessons || [], translations:data.lessonTranslations || {}},
        dailyLearning,
        quiz:{source:data.quizSource || null},
        flashcards:{source:data.flashcardSource || null}
      },
      metadata:{legacySource:"U2.9.1", manifestPath:"content/languages/"+code+"/manifest.json", migrationState:"wrapped-not-rewritten"}
    });
  }
  window.dispatchEvent(new CustomEvent("swiftdictionary:content-packages-ready", { detail:{ languages:packages.list().map(item=>item.languageCode) } }));
})();