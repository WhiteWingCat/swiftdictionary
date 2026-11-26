import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {} };
vm.createContext(context);
const registry = {
  normaliseCode: code => String(code || "").trim().toLowerCase(),
  has: code => ["en","zh","ms"].includes(String(code).toLowerCase()),
  get: code => ({
    code, name: code === "ms" ? "Malay" : code === "zh" ? "Simplified Chinese" : "English",
    locale: code === "ms" ? "ms-MY" : code === "zh" ? "zh-Hans" : "en",
    adapter: code === "ms" ? "malay" : code,
    status: code === "ms" ? "planned" : "active",
    capabilities: { dictionary:true, lessons:code !== "ms", dailyLearning:code !== "ms", quiz:code !== "ms", flashcards:code !== "ms" }
  }),
  assertSupported(code, feature) {
    const item = this.get(code);
    if (!item || item.status !== "active" || (feature && !item.capabilities[feature])) throw new RangeError("Language is inactive or unsupported");
    return item;
  }
};
context.window.SWIFT_LANGUAGE_REGISTRY = registry;
vm.runInContext(read("js/core/content-contracts.js"), context);
vm.runInContext(read("js/core/translation-registry.js"), context);
vm.runInContext(read("js/languages/adapters.js"), context);
vm.runInContext(read("js/core/content-packages.js"), context);
vm.runInContext(read("data/languages/malay-dictionary.js"), context);
const entries = context.window.SWIFT_MALAY_DICTIONARY;
const adapter = context.window.SWIFT_LANGUAGE_ADAPTERS.get("ms");

test("Malay package has stable, language-owned lexical records", () => {
  assert.equal(entries.length, 24);
  assert.ok(entries.every(entry => entry.schemaVersion === 1 && entry.languageCode === "ms"));
  assert.ok(entries.every(entry => /^ms\.dict\.[a-z-]+$/.test(entry.id)));
  assert.ok(entries.every(entry => entry.contentVersion === "u3-ms-dict-0.1.0"));
  assert.ok(entries.every(entry => entry.word.trim() && entry.part && entry.definition && entry.examples?.length));
  assert.ok(entries.every(entry => entry.senses?.length));
});

test("Malay headwords and sense identities are unique", () => {
  const headwords = entries.map(entry => entry.word.normalize("NFKC").toLocaleLowerCase("ms-MY"));
  const ids = entries.map(entry => entry.id);
  const senseIds = entries.flatMap(entry => entry.senses.map(sense => sense.id));
  assert.equal(new Set(headwords).size, headwords.length);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(senseIds).size, senseIds.length);
});

test("every Malay sense has independent en/zh draft translations and examples", () => {
  for (const entry of entries) {
    for (const sense of entry.senses) {
      assert.ok(sense.id && sense.definition);
      assert.ok(sense.definitionEn && sense.definitionZh);
      assert.ok(sense.examples?.length);
    }
    assert.equal(entry.provenance?.authoringMethod, "original-authored");
    assert.equal(entry.provenance?.sourceTextCopied, false);
    assert.equal(entry.provenance?.sourcesConsulted?.length, 0);
    assert.ok(entry.provenance?.authoringNote);
    for (const sense of entry.senses) {
      assert.equal(sense.translationStatus?.en, "machine_assisted_draft");
      assert.equal(sense.translationStatus?.zh, "machine_assisted_draft");
    }
    assert.equal(entry.provenance?.editorialStatus, "draft");
    assert.equal(entry.provenance?.licenceStatus, "original-draft-rights-review-pending");
  }
});

test("Malay entries satisfy the shared versioned Dictionary contract", () => {
  for (const entry of entries) {
    const normalized = {
      id:entry.id, schemaVersion:entry.schemaVersion, languageCode:entry.languageCode,
      contentVersion:entry.contentVersion, headword:entry.word,
      senses:entry.senses.map(sense => ({ id:sense.id, definition:sense.definition, examples:sense.examples }))
    };
    const errors = context.window.SWIFT_CONTENT_CONTRACTS.validateDictionaryEntry(normalized);
    assert.equal(errors.length, 0, JSON.stringify(errors));
  }
});

test("Malay adapter searches headwords and explicit inflected forms only", () => {
  const baca = entries.find(entry => entry.word === "baca");
  const makan = entries.find(entry => entry.word === "makan");
  assert.equal(adapter.matchesSearch(baca, "BACA"), true);
  assert.equal(adapter.matchesSearch(baca, "membaca"), true);
  assert.equal(adapter.matchesSearch(baca, "pembacaan"), true);
  assert.equal(adapter.matchesSearch(baca, "membacakan"), false);
  assert.equal(adapter.matchesSearch(makan, "memakan"), true);
  assert.equal(adapter.matchesSearch(makan, "memakani"), false);
  assert.equal(adapter.matchesSearch(makan, makan.definition), false);
  assert.equal(adapter.matchesSearch(makan, makan.examples[0]), false);
});

test("Malay search aliases do not collide between separate headwords", () => {
  const owner = new Map();
  for (const entry of entries) {
    for (const form of [entry.word, ...adapter.getSearchForms(entry)]) {
      const key = adapter.normaliseSearch(form);
      const previous = owner.get(key);
      assert.ok(!previous || previous === entry.id, `Search form "${form}" collides between ${previous} and ${entry.id}`);
      owner.set(key, entry.id);
    }
  }
});

test("Malay adapter preserves Malaysian orthography and exposes explicit morphology", () => {
  const normalized = adapter.normaliseSearch("  TERIMA   KASIH ");
  assert.equal(normalized, "terima kasih");
  assert.equal(adapter.normaliseSearch("é"), "é");
  const baca = entries.find(entry => entry.word === "baca");
  assert.ok(adapter.getSearchForms(baca).includes("membaca"));
  assert.equal(adapter.describeMorphology(baca).type, "kata dasar");
  assert.equal(adapter.matchesGridEntry({ word:"terima kasih" }), true);
});

test("Malay can be packaged without being activated or selectable", () => {
  const pkg = context.window.SWIFT_CONTENT_PACKAGES.createPackage({
    languageCode:"ms", contentVersion:"u3-ms-dict-0.1.0", status:"planned",
    content:{ dictionary:{ entries } },
    metadata:{ manifestPath:"content/languages/ms/manifest.json", editorialStatus:"draft" }
  });
  assert.equal(pkg.languageCode, "ms");
  assert.equal(pkg.status, "planned");
  assert.equal(pkg.dictionary.entries.length, entries.length);
  assert.equal(pkg.dictionary.translations.length, 82);
  assert.ok(pkg.dictionary.translations.every(record => record.status === "machine_assisted_draft"));
  assert.ok(pkg.dictionary.translations.every(record => record.sourceLanguageCode === "ms" && ["en","zh"].includes(record.targetLanguageCode)));
  const baca = pkg.dictionary.entries.find(entry => entry.headword === "baca");
  assert.equal(baca.id, "ms.dict.baca");
  assert.equal(baca.provenance.editorialStatus, "draft");
  assert.ok(baca.searchForms.includes("membaca"));
  assert.equal(baca.pronunciation.system, "unspecified");
  assert.throws(() => context.window.SWIFT_CONTENT_PACKAGES.requireFeature("ms", "dictionary"), /inactive or unsupported|not active/i);
});

test("English and Chinese adapter behaviour remains distinct", () => {
  const english = context.window.SWIFT_LANGUAGE_ADAPTERS.get("en");
  const chinese = context.window.SWIFT_LANGUAGE_ADAPTERS.get("zh");
  assert.equal(english.matchesSearch({word:"hello",definition:"a greeting"},"greeting"), false);
  assert.equal(chinese.matchesSearch({word:"你",phonetic:"nǐ"},"ni"), true);
  assert.equal(chinese.matchesGridEntry({word:"你好"}), false);
  assert.equal(adapter.matchesGridEntry({word:"terima kasih"}), true);
});
