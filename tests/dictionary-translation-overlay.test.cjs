const test = require("node:test");
const assert = require("node:assert/strict");

global.window = {
  SWIFT_DICTIONARY_MS_TRANSLATIONS: {
    status: "machine_assisted_draft",
    provenance: "Local machine-assisted draft",
    languages: {
      en: {
        hello: { headwordMs: "helo", senses: [{ definitionMs: "Ucapan sapaan." }] },
        book: { headwordMs: "buku", senses: [{ definitionMs: "Bahan bacaan." }, { definitionMs: "Tempahan." }] }
      }
    }
  }
};
require("../js/core/dictionary-translation-overlay.js");
const overlay = window.SWIFT_DICTIONARY_TRANSLATION_OVERLAY;

test("Malay translation overlay applies headword and per-sense drafts without flattening meanings", () => {
  const entries = [
    { word: "hello", definition: "A greeting." },
    { word: "book", definition: "A written work.", senses: [{ definition: "A written work." }, { definition: "To reserve." }] }
  ];
  const coverage = overlay.apply(entries, "en");
  assert.equal(entries[0].headwordMs, "helo");
  assert.equal(entries[0].definitionMs, "Ucapan sapaan.");
  assert.equal(entries[1].senses[0].definitionMs, "Bahan bacaan.");
  assert.equal(entries[1].senses[1].definitionMs, "Tempahan.");
  assert.equal(entries[1].translationStatus.ms, "machine_assisted_draft");
  assert.equal(coverage.complete, true);
  assert.equal(coverage.translatedSenses, 3);
});

test("missing Malay translations remain explicit coverage gaps", () => {
  const coverage = overlay.apply([{ word: "missing", definition: "No translation." }], "en");
  assert.equal(coverage.complete, false);
  assert.equal(coverage.missingEntries, 1);
  assert.equal(coverage.missingSenses, 1);
});
