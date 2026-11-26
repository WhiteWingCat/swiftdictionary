/* Shared language content-package registry. Legacy content is wrapped without rewriting source records. */
(() => {
  "use strict";
  const packages = new Map();
  const registry = () => window.SWIFT_LANGUAGE_REGISTRY;
  function createPackage(input) {
    if (!input || typeof input !== "object") throw new TypeError("A language content package is required.");
    const code = registry()?.normaliseCode(input.languageCode);
    const language = registry()?.get(code);
    if (!language) throw new RangeError("Unknown language package: " + input.languageCode);
    if (!input.contentVersion) throw new TypeError("Content package version is required.");
    const content = input.content || {};
    const packageRecord = Object.freeze({
      schemaVersion: 1, languageCode: code, contentVersion: String(input.contentVersion),
      status: input.status || language.status,
      dictionary: Object.freeze({ entries: Array.isArray(content.dictionary?.entries) ? content.dictionary.entries : [] }),
      lessons: Object.freeze({ permanent: Array.isArray(content.lessons?.permanent) ? content.lessons.permanent : [], translations: content.lessons?.translations || {} }),
      dailyLearning: Object.freeze({ topics: content.dailyLearning?.topics || [], applications: content.dailyLearning?.applications || [], discovery: content.dailyLearning?.discovery || [], revision: content.dailyLearning?.revision || "adaptive" }),
      quiz: Object.freeze({ source: content.quiz?.source || null, questionBank: content.quiz?.questionBank || null }),
      flashcards: Object.freeze({ source: content.flashcards?.source || null, cards: Array.isArray(content.flashcards?.cards) ? content.flashcards.cards : [] }),
      metadata: Object.freeze({ adapter: language.adapter, locale: language.locale, capabilities: language.capabilities, ...(input.metadata || {}) })
    });
    packages.set(code, packageRecord);
    return packageRecord;
  }
  function get(code) { return packages.get(registry()?.normaliseCode(code)) || null; }
  function list() { return [...packages.values()]; }
  function requireFeature(code, feature) {
    const language = registry()?.assertSupported(code, feature);
    const content = get(code);
    if (!content) throw new Error("No content package has been loaded for " + code + ".");
    return { language, content };
  }
  const api = Object.freeze({ createPackage, get, list, requireFeature });
  window.SWIFT_CONTENT_PACKAGES = api;
})();