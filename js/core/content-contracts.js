/* SwiftDictionary U3.0 — versioned content contracts and structural validation. */
(() => {
  "use strict";
  const SCHEMA_VERSION = 1;
  const CODE = /^[a-z]{2,3}$/;
  const ID = /^[a-z0-9][a-z0-9._:-]{1,119}$/;
  const text = value => typeof value === "string" && value.trim().length > 0;
  const issue = (path, message) => ({ path, message });

  function validateIdentity(item, path = "item") {
    const errors = [];
    if (!item || typeof item !== "object" || Array.isArray(item)) return [issue(path, "must be an object")];
    if (!ID.test(String(item.id || ""))) errors.push(issue(path + ".id", "must be a stable, non-empty identifier"));
    if (item.schemaVersion !== SCHEMA_VERSION) errors.push(issue(path + ".schemaVersion", "unsupported schema version"));
    if (!CODE.test(String(item.languageCode || ""))) errors.push(issue(path + ".languageCode", "must be a registered-format language code"));
    if (!text(item.contentVersion)) errors.push(issue(path + ".contentVersion", "must identify the authored content revision"));
    return errors;
  }

  function validateDictionaryEntry(entry) {
    const errors = validateIdentity(entry, "entry");
    if (!text(entry?.headword)) errors.push(issue("entry.headword", "is required"));
    if (!Array.isArray(entry?.senses) || !entry.senses.length) errors.push(issue("entry.senses", "must contain at least one sense"));
    else {
      const ids = new Set();
      entry.senses.forEach((sense, index) => {
        const at = "entry.senses[" + index + "]";
        if (!ID.test(String(sense?.id || ""))) errors.push(issue(at + ".id", "must be stable"));
        if (ids.has(sense?.id)) errors.push(issue(at + ".id", "must be unique within the entry"));
        ids.add(sense?.id);
        if (!text(sense?.definition)) errors.push(issue(at + ".definition", "is required"));
        if (sense?.examples != null && (!Array.isArray(sense.examples) || sense.examples.some(example => !text(example)))) errors.push(issue(at + ".examples", "must contain non-empty strings"));
      });
    }
    return errors;
  }

  function validateTranslation(record) {
    const errors = [];
    if (!record || typeof record !== "object") return [issue("translation", "must be an object")];
    if (!ID.test(String(record.contentId || ""))) errors.push(issue("translation.contentId", "must reference stable content identity"));
    if (!CODE.test(String(record.sourceLanguageCode || "")) || !CODE.test(String(record.targetLanguageCode || ""))) errors.push(issue("translation.languages", "source and target language codes are required"));
    if (record.sourceLanguageCode === record.targetLanguageCode) errors.push(issue("translation.languages", "source and target languages must differ"));
    if (!Number.isInteger(record.sourceRevision) || record.sourceRevision < 1) errors.push(issue("translation.sourceRevision", "must be a positive source revision"));
    if (!Number.isInteger(record.translationRevision) || record.translationRevision < 1) errors.push(issue("translation.translationRevision", "must be a positive translation revision"));
    if (!["not_started","draft","machine_assisted_draft","legacy_unverified","reviewed","approved","stale","not_applicable"].includes(record.status)) errors.push(issue("translation.status", "is not a supported workflow status"));
    if (record.status === "approved" && !text(record.reviewerId)) errors.push(issue("translation.reviewerId", "approved translations require a reviewer reference"));
    return errors;
  }

  function validatePack(pack, itemValidator) {
    const errors = [];
    if (!pack || typeof pack !== "object" || Array.isArray(pack)) return [issue("pack", "must be an object")];
    if (pack.schemaVersion !== SCHEMA_VERSION) errors.push(issue("pack.schemaVersion", "unsupported schema version"));
    if (!CODE.test(String(pack.languageCode || ""))) errors.push(issue("pack.languageCode", "must be a language code"));
    if (!text(pack.contentVersion)) errors.push(issue("pack.contentVersion", "is required"));
    if (!Array.isArray(pack.items)) errors.push(issue("pack.items", "must be an array"));
    else {
      const ids = new Set();
      pack.items.forEach((item, index) => {
        const itemErrors = itemValidator(item);
        itemErrors.forEach(error => errors.push(issue("pack.items[" + index + "]." + error.path, error.message)));
        if (ids.has(item?.id)) errors.push(issue("pack.items[" + index + "].id", "duplicate stable ID"));
        ids.add(item?.id);
        if (item?.languageCode !== pack.languageCode) errors.push(issue("pack.items[" + index + "].languageCode", "must match the authored package language"));
      });
    }
    return errors;
  }

  const api = Object.freeze({ SCHEMA_VERSION, validateIdentity, validateDictionaryEntry, validateTranslation, validatePack });
  if (typeof window !== "undefined") window.SWIFT_CONTENT_CONTRACTS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();