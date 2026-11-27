/* Language-specific linguistic behaviour behind one shared adapter contract. */
(() => {
  "use strict";
  const adapters = Object.create(null);
  const registry = () => window.SWIFT_LANGUAGE_REGISTRY;
  function register(code, adapter) {
    if (!registry()?.has(code)) throw new Error("Register language metadata before its adapter: " + code);
    if (adapters[code]) throw new Error("Language adapter already registered: " + code);
    adapters[code] = Object.freeze({ code, ...adapter });
  }
  const normalise = value => String(value ?? "").normalize("NFKC").trim();
  const english = {
    locale:"en", script:"Latn", gridMode:"word", pronunciationLabel:"IPA", morphology:"english", flashcardModes:["word","definition","mixed","sentence"], flashcardCardSets:["all","common","nouns","verbs","adjectives","adverbs","phrases","terms"],
    normaliseSearch(value) { return normalise(value).toLocaleLowerCase("en").replace(/\s+/g," "); },
    matchesSearch(entry, query) { return !query || this.normaliseSearch(entry?.word).includes(this.normaliseSearch(query)); },
    matchesGridEntry(entry) { return Boolean(entry && typeof entry.word === "string" && entry.word.trim()); },
    sort(a,b) { return String(a?.word||"").localeCompare(String(b?.word||""),"en"); },
    displayPronunciation(entry) { return entry?.phonetic || ""; },
    getLabel() { return "English"; }
  };
  const chinese = {
    locale:"zh-CN", script:"Hans", gridMode:"single-han", pronunciationLabel:"Pinyin", morphology:"chinese", flashcardModes:["word","definition","translation","sentence"], flashcardCardSets:["all","characters","vocabulary","phrases"],
    normaliseSearch(value) { return normalise(value).normalize("NFD").replace(/\p{M}/gu,"").toLocaleLowerCase("zh-CN").replace(/[\s\p{P}\p{S}]+/gu,""); },
    matchesSearch(entry, query) {
      if (!query) return true;
      const q=this.normaliseSearch(query), word=this.normaliseSearch(entry?.word), pinyin=this.normaliseSearch(entry?.phonetic);
      return word.includes(q) || pinyin.includes(q);
    },
    matchesGridEntry(entry) { return Boolean(entry && typeof entry.word === "string" && [...entry.word].length === 1 && /\p{Script=Han}/u.test(entry.word)); },
    sort(a,b) { return String(a?.word||"").localeCompare(String(b?.word||""),"zh-CN"); },
    displayPronunciation(entry) { return entry?.phonetic || ""; },
    getLabel() { return "简体中文"; }
  };
  const malay = {
    locale:"ms-MY", script:"Latn", gridMode:"word", pronunciationLabel:"Sebutan", morphology:"malay-affixation", flashcardModes:["word","definition","mixed","sentence"], flashcardCardSets:["all","common","nouns","verbs","adjectives","phrases"],
    normaliseSearch(value) { return normalise(value).toLocaleLowerCase("ms-MY").replace(/\s+/g," "); },
    getSearchForms(entry) {
      const explicit = Array.isArray(entry?.searchForms) ? entry.searchForms : [];
      const morphology = Array.isArray(entry?.morphology?.forms) ? entry.morphology.forms : [];
      return [...new Set([...explicit, ...morphology].filter(value => typeof value === "string" && value.trim()))];
    },
    describeMorphology(entry) { return entry?.morphology || null; },
    matchesSearch(entry, query) {
      if (!query) return true;
      const q=this.normaliseSearch(query);
      return [entry?.word, ...this.getSearchForms(entry)].some(value => this.normaliseSearch(value).includes(q));
    },
    matchesGridEntry(entry) { return Boolean(entry && typeof entry.word === "string" && entry.word.trim()); },
    sort(a,b) { return String(a?.word||"").localeCompare(String(b?.word||""),"ms-MY"); },
    displayPronunciation(entry) { return entry?.pronunciation || entry?.phonetic || ""; },
    getLabel() { return "Bahasa Melayu"; }
  };
  register("en", english);
  register("zh", chinese);
  register("ms", malay);
  const api = Object.freeze({
    get(code) { return adapters[registry()?.normaliseCode(code)] || null; },
    has(code) { return Boolean(this.get(code)); },
    list() { return Object.keys(adapters).map(code => adapters[code]); },
    register
  });
  window.SWIFT_LANGUAGE_ADAPTERS = api;
})();