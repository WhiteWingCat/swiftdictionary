/* SwiftDictionary U3.0 — shared language registry.
 * Browser-safe UMD-style module. Language-specific behaviour belongs in adapters,
 * not scattered checks in shared UI or persistence code.
 */
(() => {
  "use strict";
  const CODE = /^[a-z]{2,3}$/;
  const registry = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  const normalise = code => String(code || "").trim().toLowerCase();

  function register(definition) {
    if (!definition || !CODE.test(normalise(definition.code))) throw new TypeError("A valid ISO-style language code is required.");
    const code = normalise(definition.code);
    if (registry.has(code)) throw new Error("Language is already registered: " + code);
    if (!definition.name || !definition.nativeName || !definition.locale || !definition.adapter) {
      throw new TypeError("Language metadata, locale and adapter identifier are required.");
    }
    const capabilities = Object.freeze({ dictionary: true, lessons: false, dailyLearning: false, quiz: false, flashcards: false, ...definition.capabilities });
    const record = Object.freeze({
      code, name: String(definition.name), nativeName: String(definition.nativeName),
      locale: String(definition.locale), script: String(definition.script || "Latn"),
      direction: definition.direction === "rtl" ? "rtl" : "ltr",
      status: definition.status || "active", adapter: String(definition.adapter),
      capabilities, metadata: Object.freeze({ ...(definition.metadata || {}) })
    });
    registry.set(code, record);
    return record;
  }

  function get(code) { return registry.get(normalise(code)) || null; }
  function has(code) { return registry.has(normalise(code)); }
  function list(options = {}) {
    return [...registry.values()].filter(item => options.includeInactive || item.status === "active").map(clone);
  }
  function supports(code, feature) { return Boolean(get(code)?.capabilities?.[feature]); }
  function assertSupported(code, feature) {
    const language = get(code);
    if (!language) throw new RangeError("Unsupported language: " + code);
    if (language.status !== "active") throw new RangeError("Language is not active: " + code);
    if (feature && !language.capabilities[feature]) throw new RangeError(language.name + " does not support " + feature + ".");
    return language;
  }

  register({ code:"en", name:"English", nativeName:"English", locale:"en", script:"Latn", adapter:"english", capabilities:{ dictionary:true, lessons:true, dailyLearning:true, quiz:true, flashcards:true, morphology:"english", pronunciation:"ipa", tokenisation:"whitespace" } });
  register({ code:"zh", name:"Simplified Chinese", nativeName:"简体中文", locale:"zh-Hans", script:"Hans", adapter:"chinese", capabilities:{ dictionary:true, lessons:true, dailyLearning:true, quiz:true, flashcards:true, morphology:"chinese", pronunciation:"pinyin", tokenisation:"character-aware", strokeOrder:true, singleCharacterGrid:true } });
  register({ code:"ms", name:"Malay", nativeName:"Bahasa Melayu", locale:"ms-MY", script:"Latn", adapter:"malay", status:"active", capabilities:{ dictionary:true, lessons:true, dailyLearning:true, quiz:false, flashcards:false, morphology:"malay-affixation", pronunciation:"optional", tokenisation:"whitespace" } });

  const api = Object.freeze({ register, get, has, list, supports, assertSupported, normaliseCode:normalise });
  if (typeof window !== "undefined") window.SWIFT_LANGUAGE_REGISTRY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();