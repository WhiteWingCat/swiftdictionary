import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

test("Malay support glosses cover the first curated English and Chinese Flashcard vocabulary set",()=>{
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync("data/languages/malay-flashcard-translations.js","utf8"),context);
 const pack=context.window.SWIFT_FLASHCARD_MALAY_SUPPORT;
 assert.equal(Object.keys(pack.en).length,73);
 assert.equal(Object.keys(pack.zh).length,124);
 assert.equal(pack.metadata.status,"machine_assisted_draft");
 assert.ok(Object.values(pack.en).every(value=>typeof value==="string"&&value.length>0));
 assert.ok(Object.values(pack.zh).every(value=>typeof value==="string"&&value.length>0));
});

test("Flashcard decks exclude untranslated words when Malay is the selected support language",()=>{
 const flashcards=fs.readFileSync("flashcards.js","utf8");
 assert.match(flashcards,/addMalayFlashcardSupport\(items,language\)/);
 assert.match(flashcards,/all=all\.filter\(word=>Boolean\(translationFor\(word\)\)\)/);
});
