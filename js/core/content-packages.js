/* Shared language content-package registry. Legacy content is wrapped without rewriting source records. */
(() => {
  "use strict";
  const packages = new Map();
  const registry = () => window.SWIFT_LANGUAGE_REGISTRY;
  function stableLegacySlug(value, code) {
    const text = String(value || "").trim();
    if (code === "zh") return [...text].map(character => character.codePointAt(0).toString(16)).join("-");
    return text.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "entry";
  }
  function adaptLegacyDictionaryEntry(entry, code, contentVersion) {
    const headword = String(entry?.word || "").trim();
    if (!headword) return null;
    const pos = String(entry.part || "entry").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "entry";
    const id = entry.id || ("legacy." + code + ".dictionary." + stableLegacySlug(headword,code) + "." + pos);
    const sourceSenses = Array.isArray(entry.senses) && entry.senses.length ? entry.senses : [{
      definition:entry.definition || "", definitionZh:entry.definitionZh || "",
      examples:Array.isArray(entry.examples) ? entry.examples : [], tip:entry.tip || ""
    }];
    const senses = sourceSenses.map((sense,index) => ({
      ...sense,
      id:sense.id || id + ".sense." + (index+1),
      definition:String(sense.definition || sense.meaning || entry.definition || ""),
      translations:{
        ...(sense.translations || {}),
        ...(sense.definitionZh || entry.definitionZh ? { zh:sense.definitionZh || entry.definitionZh } : {}),
        ...(sense.definitionMs || entry.definitionMs ? { ms:sense.definitionMs || entry.definitionMs } : {}),
        ...(sense.definitionEn || entry.definitionEn ? { en:sense.definitionEn || entry.definitionEn } : {})
      },
      examples:Array.isArray(sense.examples) ? sense.examples : (Array.isArray(entry.examples) ? entry.examples : [])
    }));
    return {
      id, schemaVersion:1, languageCode:code, contentVersion:String(contentVersion),
      headword, partOfSpeech:entry.part || null,
      pronunciation:{ system:entry.pronunciationSystem || (code === "zh" ? "pinyin" : code === "en" ? "ipa" : "unspecified"), value:entry.pronunciation || entry.phonetic || "" },
      senses, categories:Array.isArray(entry.categories) ? entry.categories : [],
      searchForms:Array.isArray(entry.searchForms) ? entry.searchForms.slice() : [],
      headwordTranslations:{...(entry.headwordMs ? {ms:entry.headwordMs} : {})},
      headwordTranslationStatus:entry.translationStatus?.ms || null,
      translationProvenance:entry.translationProvenance || null,
      morphology:entry.morphology || null, provenance:entry.provenance || null,
      editorialStatus:entry.provenance?.editorialStatus || "legacy-unverified",
      legacySource:entry
    };
  }
  function registerDictionaryTranslations(entries, sourceLanguageCode) {
    const registry = window.SWIFT_TRANSLATION_REGISTRY;
    if (!registry) return [];
    const output = [];
    for (const entry of entries) {
      for (const targetLanguageCode of ["en","zh","ms"]) {
        if (targetLanguageCode === sourceLanguageCode) continue;
        const translatedHeadword = entry.headwordTranslations?.[targetLanguageCode];
        if (!translatedHeadword) continue;
        const existing = registry.get(entry.id,sourceLanguageCode,targetLanguageCode);
        if (existing) { output.push(existing); continue; }
        output.push(registry.register({
          contentId:entry.id, sourceLanguageCode, targetLanguageCode,
          sourceRevision:1, translationRevision:1,
          status:entry.headwordTranslationStatus || "draft",
          provenance:entry.translationProvenance || entry.provenance?.authoringNote || "Dictionary headword translation source record",
          reviewerId:null,
          content:{headword:translatedHeadword}
        }));
      }
      for (const sense of entry.senses || []) {
        for (const targetLanguageCode of ["en","zh","ms"]) {
          if (targetLanguageCode === sourceLanguageCode) continue;
          const translatedText = sense.translations?.[targetLanguageCode];
          if (!translatedText) continue;
          const contentId = sense.id;
          const existing = registry.get(contentId, sourceLanguageCode, targetLanguageCode);
          if (existing) { output.push(existing); continue; }
          output.push(registry.register({
            contentId, sourceLanguageCode, targetLanguageCode,
            sourceRevision:1, translationRevision:1,
            status:sense.translationStatus?.[targetLanguageCode] || entry.translationStatus?.[targetLanguageCode] || "draft",
            provenance:entry.translationProvenance || entry.provenance?.authoringNote || "Dictionary translation source record",
            reviewerId:null,
            content:{ definition:translatedText }
          }));
        }
      }
    }
    return output;
  }
  function adaptLegacyRecords(records, code, contentVersion) {
    return (Array.isArray(records) ? records : []).filter(item => item && typeof item === "object").map(item => ({
      ...item, schemaVersion:1, languageCode:code, contentVersion:String(contentVersion), legacySource:item.legacySource || item
    }));
  }
  function createPackage(input) {
    if (!input || typeof input !== "object") throw new TypeError("A language content package is required.");
    const code = registry()?.normaliseCode(input.languageCode);
    const language = registry()?.get(code);
    if (!language) throw new RangeError("Unknown language package: " + input.languageCode);
    if (!input.contentVersion) throw new TypeError("Content package version is required.");
    const content = input.content || {};
    const dictionaryEntries = (Array.isArray(content.dictionary?.entries) ? content.dictionary.entries : []).map(entry => adaptLegacyDictionaryEntry(entry,code,input.contentVersion)).filter(Boolean);
    const dictionaryTranslations = registerDictionaryTranslations(dictionaryEntries, code);
    const packageRecord = Object.freeze({
      schemaVersion: 1, languageCode: code, contentVersion: String(input.contentVersion),
      status: input.status || language.status,
      dictionary: Object.freeze({ entries: dictionaryEntries, translations: dictionaryTranslations }),
      lessons: Object.freeze({ permanent: adaptLegacyRecords(content.lessons?.permanent,code,input.contentVersion), translations: window.SWIFT_TRANSLATION_REGISTRY ? window.SWIFT_TRANSLATION_REGISTRY.registerLegacyMap({ translations:content.lessons?.translations || {}, sourceLanguageCode:code, targetLanguageCode:input.translationLanguageCode || (code === "en" ? "zh" : "en"), contentVersion:input.contentVersion }) : [], legacyTranslations:content.lessons?.translations || {} }),
      dailyLearning: Object.freeze({ topics: adaptLegacyRecords(content.dailyLearning?.topics,code,input.contentVersion), applications: adaptLegacyRecords(content.dailyLearning?.applications,code,input.contentVersion), discovery: adaptLegacyRecords(content.dailyLearning?.discovery,code,input.contentVersion), revision: content.dailyLearning?.revision || "adaptive" }),
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