const test = require("node:test");
const assert = require("node:assert/strict");

global.window = {};
require("../data/languages/english-dictionary.js");
require("../data/english-expansion.js");
require("../data/languages/chinese-dictionary.js");
require("../data/chinese-characters.js");

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
