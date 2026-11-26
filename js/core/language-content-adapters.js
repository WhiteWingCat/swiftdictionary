/* SwiftDictionary U3.0 — language-owned content adapters.
 * Shared UI and persistence should request content through this API instead of
 * assuming every non-Chinese course is English.
 */
(() => {
  "use strict";
  const adapters = new Map();
  const registry = () => window.SWIFT_LANGUAGE_REGISTRY || null;
  const codeOf = value => String(value || "").trim().toLowerCase();
  function register(code, adapter) {
    const languageCode = codeOf(code);
    if (!/^[a-z]{2,3}$/.test(languageCode)) throw new TypeError("Invalid language code.");
    if (!adapter || typeof adapter !== "object") throw new TypeError("Adapter must be an object.");
    if (adapters.has(languageCode)) throw new Error("Adapter already registered: " + languageCode);
    adapters.set(languageCode, Object.freeze({ ...adapter }));
  }
  function get(code) { return adapters.get(codeOf(code)) || null; }
  function resolve(code, feature, fallback = []) {
    const adapter = get(code);
    const provider = adapter?.[feature];
    if (typeof provider !== "function") return fallback;
    const result = provider();
    return Array.isArray(result) ? result : fallback;
  }
  function available(code, feature) { return typeof get(code)?.[feature] === "function"; }

  // English and Chinese are bridged to the current data sources without
  // changing their editorial data or language-specific rendering rules.
  register("en", {
    dictionary: () => window.englishWords || [],
    dailyTopics: () => window.dailyTopics || [],
    dailyApplications: () => window.dailyApplications || [],
    dailyDiscovery: () => window.dailyDiscoveryVocabulary || [],
    flashcards: () => window.englishWords || []
  });
  register("zh", {
    dictionary: () => window.chineseCharacters || window.SWIFT_CHINESE_CHARACTERS || [],
    dailyTopics: () => window.SWIFT_CHINESE_DAILY_LEARNING?.topics || [],
    dailyApplications: () => window.SWIFT_CHINESE_DAILY_LEARNING?.applications || [],
    dailyDiscovery: () => window.SWIFT_CHINESE_DAILY_LEARNING?.discovery || [],
    flashcards: () => {
      const bank = window.SWIFT_CHINESE_FLASHCARDS || {};
      return [...(bank.characters || []), ...(bank.vocabulary || []), ...(bank.phrases || [])];
    }
  });
  // Malay is deliberately registered with no content provider until its
  // independently authored and reviewed package is ready.
  if (registry()?.has("ms") && !get("ms")) register("ms", {});

  window.SWIFT_LANGUAGE_CONTENT_ADAPTERS = Object.freeze({ register, get, resolve, available, normaliseCode: codeOf });
})();