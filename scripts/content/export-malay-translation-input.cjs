const fs = require("node:fs");
const path = require("node:path");

global.window = {};
for (const file of [
  "data/languages/english-dictionary.js",
  "data/english-expansion.js",
  "data/languages/chinese-dictionary.js",
  "data/chinese-characters.js",
  "data/languages/malay-dictionary-translations.js"
]) require(path.resolve(file));

function stableSlug(value, code) {
  const text = String(value || "").trim();
  if (code === "zh") return [...text].map(ch => ch.codePointAt(0).toString(16)).join("-");
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function entryId(entry, code) {
  const pos = String(entry.part || "entry").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "entry";
  return entry.id || "legacy." + code + ".dictionary." + stableSlug(entry.word, code) + "." + pos;
}
function build(code, records, manual) {
  const seen = new Set();
  return records.map(entry => {
    if (!entry || !entry.word) throw new Error("Dictionary entry has no headword in " + code);
    if (seen.has(entry.word)) throw new Error("Duplicate " + code + " headword: " + entry.word);
    seen.add(entry.word);
    const sourceSenses = Array.isArray(entry.senses) && entry.senses.length ? entry.senses : [entry];
    const senses = sourceSenses.map((sense, index) => {
      const sourceText = code === "zh"
        ? (sense.definitionZh || entry.definitionZh || sense.definition || entry.definition || "")
        : (sense.definition || entry.definition || "");
      const sourceLanguage = code === "zh" && (sense.definitionZh || entry.definitionZh) ? "zh" : "en";
      if (!String(sourceText).trim()) throw new Error("Missing source definition: " + code + "/" + entry.word + "/" + (index + 1));
      const manualText = manual?.[code]?.[entry.word]?.[index] || "";
      return {
        id: sense.id || entryId(entry, code) + ".sense." + (index + 1),
        sourceText: String(sourceText).trim(),
        sourceLanguage,
        manualTranslation: String(manualText || "").trim()
      };
    });
    return {
      id: entryId(entry, code),
      word: entry.word,
      sourceLanguage: code,
      headwordManual: "",
      senses
    };
  });
}

// Retain the hand-authored starter batch as higher-quality overrides over offline MT drafts.
const manual = window.SWIFT_DICTIONARY_MS_TRANSLATIONS || {};
const en = [
  ...(window.SWIFT_ENGLISH_BASE_DICTIONARY || []),
  ...(window.SWIFT_ENGLISH_EXPANSION || [])
];
const zh = [
  ...(window.SWIFT_CHINESE_BASE_DICTIONARY || []),
  ...(window.SWIFT_CHINESE_WORDS || [])
];
const payload = {
  schemaVersion: 1,
  source: "SwiftDictionary original-authored Dictionary definitions",
  targetLanguage: "ms",
  english: build("en", en, manual),
  chinese: build("zh", zh, manual)
};
const counts = payload => ({
  entries: payload.length,
  senses: payload.reduce((n, entry) => n + entry.senses.length, 0),
  missingSources: payload.reduce((n, entry) => n + entry.senses.filter(s => !s.sourceText).length, 0)
});
const summary = { en: counts(payload.english), zh: counts(payload.chinese) };
if (summary.en.entries !== 1316 || summary.en.senses !== 1931) throw new Error("English inventory mismatch: " + JSON.stringify(summary.en));
if (summary.zh.entries !== 725 || summary.zh.senses !== 825) throw new Error("Chinese inventory mismatch: " + JSON.stringify(summary.zh));
fs.mkdirSync("tmp", { recursive: true });
fs.writeFileSync("tmp/u3-malay-dictionary-translation-input.json", JSON.stringify(payload));
fs.writeFileSync("tmp/u3-malay-dictionary-translation-inventory.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
