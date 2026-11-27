const test = require("node:test");
const assert = require("node:assert/strict");

global.window = {};
require("../data/languages/english-dictionary.js");
require("../data/english-expansion.js");
require("../data/languages/chinese-dictionary.js");
require("../data/chinese-characters.js");
require("../data/languages/malay-dictionary-translations.js");
require("../js/core/dictionary-translation-overlay.js");

const english = [...window.SWIFT_ENGLISH_BASE_DICTIONARY, ...window.SWIFT_ENGLISH_EXPANSION];
const chinese = [...window.SWIFT_CHINESE_BASE_DICTIONARY, ...window.SWIFT_CHINESE_WORDS];

function senseCount(entries) {
  return entries.reduce((total, entry) => total + (Array.isArray(entry.senses) && entry.senses.length ? entry.senses.length : 1), 0);
}

test("U3.0 translation inventory covers the complete active English and Chinese Dictionary catalogues", () => {
  assert.equal(english.length, 1316);
  assert.equal(senseCount(english), 1931);
  assert.equal(chinese.length, 725);
  assert.equal(senseCount(chinese), 825);
  assert.equal(new Set(english.map(entry => entry.word)).size, english.length);
  assert.equal(new Set(chinese.map(entry => entry.word)).size, chinese.length);
});

test("Chinese base entries and separately maintained character entries are combined without duplicates", () => {
  assert.equal(window.SWIFT_CHINESE_BASE_DICTIONARY.length, 206);
  assert.equal(window.SWIFT_CHINESE_WORDS.length, 519);
  assert.equal(chinese.length, 725);
  assert.equal(chinese.some(entry => !entry.definitionZh && !entry.definition), false);
});


test("Malay target-language overlay registers the authored draft batches without flattening senses", () => {
  const englishCoverage = window.SWIFT_DICTIONARY_TRANSLATION_OVERLAY.apply(english, "en");
  const chineseCoverage = window.SWIFT_DICTIONARY_TRANSLATION_OVERLAY.apply(chinese, "zh");
  assert.equal(englishCoverage.translatedSenses, 260);
  assert.equal(chineseCoverage.translatedSenses, 100);
  assert.equal(englishCoverage.complete, false);
  assert.equal(chineseCoverage.complete, false);
  assert.equal(window.SWIFT_DICTIONARY_MS_TRANSLATIONS.status, "machine_assisted_draft");
  assert.ok(english.every(entry => !entry.definitionMs || entry.translationStatus?.ms === "machine_assisted_draft"));
  assert.ok(chinese.every(entry => !entry.definitionMs || entry.translationStatus?.ms === "machine_assisted_draft"));
});
