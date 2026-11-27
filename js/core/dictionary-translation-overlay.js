/* Applies generated, versioned Malay target-language Dictionary drafts to legacy entries. */
(() => {
  "use strict";
  const translationData = () => window.SWIFT_DICTIONARY_MS_TRANSLATIONS || {};
  function apply(entries, languageCode) {
    const code = String(languageCode || "");
    const records = translationData().languages?.[code] || {};
    let translatedEntries = 0, translatedSenses = 0, totalSenses = 0;
    for (const entry of Array.isArray(entries) ? entries : []) {
      const sourceWordKey = code === "en"
        ? String(entry.word || "").trim().toLowerCase()
        : String(entry.word || "").trim();
      const record = records[sourceWordKey];
      const sourceSenses = Array.isArray(entry.senses) && entry.senses.length ? entry.senses : [entry];
      totalSenses += sourceSenses.length;
      if (!record) continue;
      if (record.headwordMs) entry.headwordMs = record.headwordMs;
      let entryTranslated = false;
      for (let index = 0; index < sourceSenses.length; index++) {
        const sourceSense = sourceSenses[index];
        const translatedSense = record.senses?.[index];
        if (!translatedSense?.definitionMs) continue;
        sourceSense.definitionMs = translatedSense.definitionMs;
        sourceSense.translationStatus = {
          ...(sourceSense.translationStatus || {}),
          ms: "machine_assisted_draft"
        };
        translatedSenses++;
        entryTranslated = true;
      }
      if (entryTranslated) {
        entry.definitionMs = sourceSenses[0]?.definitionMs || entry.definitionMs || "";
        entry.translationStatus = {
          ...(entry.translationStatus || {}),
          ms: "machine_assisted_draft"
        };
        entry.translationProvenance = translationData().provenance || translationData().engine || "Machine-assisted draft; human review pending.";
        translatedEntries++;
      }
    }
    return Object.freeze({
      languageCode: code, targetLanguageCode: "ms",
      totalEntries: Array.isArray(entries) ? entries.length : 0,
      translatedEntries, totalSenses, translatedSenses,
      missingEntries: (Array.isArray(entries) ? entries.length : 0) - translatedEntries,
      missingSenses: totalSenses - translatedSenses,
      complete: Array.isArray(entries) && entries.length > 0 && translatedEntries === entries.length && totalSenses === translatedSenses
    });
  }
  window.SWIFT_DICTIONARY_TRANSLATION_OVERLAY = Object.freeze({ apply });
})();