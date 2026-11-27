const test = require("node:test");
const assert = require("node:assert/strict");
const languages = require("../js/core/language-registry.js");
const contracts = require("../js/core/content-contracts.js");

test("English, Simplified Chinese and Phase 3 Malay are registered as active learning languages", () => {
  assert.equal(languages.get("en").status, "active");
  assert.equal(languages.get("zh").status, "active");
  assert.equal(languages.get("ms").status, "active");
  assert.deepEqual(languages.list().map(x => x.code).sort(), ["en", "zh"]);
});

test("language-specific capabilities do not impose Chinese behaviour on English", () => {
  assert.equal(languages.supports("zh", "strokeOrder"), true);
  assert.equal(languages.supports("en", "strokeOrder"), false);
  assert.equal(languages.get("ms").capabilities.morphology, "malay-affixation");
});

test("dictionary entry contract requires stable IDs, version and senses", () => {
  const valid = { id:"en.word.hello", schemaVersion:1, languageCode:"en", contentVersion:"1.0.0", headword:"hello", senses:[{ id:"en.word.hello.sense.1", definition:"A greeting." }] };
  assert.deepEqual(contracts.validateDictionaryEntry(valid), []);
  assert.ok(contracts.validateDictionaryEntry({ ...valid, senses:[] }).length > 0);
});

test("translation contract prevents same-language and unreviewed approval", () => {
  const base = { contentId:"en.lesson.greetings", sourceLanguageCode:"en", targetLanguageCode:"zh", sourceRevision:1, translationRevision:1, status:"approved", reviewerId:"reviewer-1" };
  assert.deepEqual(contracts.validateTranslation(base), []);
  assert.ok(contracts.validateTranslation({ ...base, targetLanguageCode:"en" }).length > 0);
  assert.ok(contracts.validateTranslation({ ...base, reviewerId:null }).length > 0);
});

test("package contract rejects duplicate IDs and mixed authored languages", () => {
  const item = { id:"en.word.hello", schemaVersion:1, languageCode:"en", contentVersion:"1.0.0", headword:"hello", senses:[{id:"en.word.hello.sense.1",definition:"A greeting."}] };
  assert.deepEqual(contracts.validatePack({schemaVersion:1,languageCode:"en",contentVersion:"1.0.0",items:[item]}, contracts.validateDictionaryEntry), []);
  assert.ok(contracts.validatePack({schemaVersion:1,languageCode:"en",contentVersion:"1.0.0",items:[item,item]}, contracts.validateDictionaryEntry).length > 0);
});
