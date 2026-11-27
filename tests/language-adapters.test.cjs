const test=require("node:test");
const assert=require("node:assert/strict");
global.window={};
require("../js/core/language-registry.js");
require("../js/languages/adapters.js");
const adapters=window.SWIFT_LANGUAGE_ADAPTERS;

test("English adapter searches whole words and retains IPA semantics",()=>{
 const a=adapters.get("en");
 assert.equal(a.gridMode,"word");
 assert.equal(a.matchesGridEntry({word:"hello"}),true);
 assert.equal(a.matchesSearch({word:"Hello"},"hell"),true);
 assert.equal(a.matchesSearch({word:"hello"},"greeting"),false);
 assert.equal(a.displayPronunciation({phonetic:"/həˈləʊ/"}),"/həˈləʊ/");
});
test("Chinese adapter retains single-Han grid and Pinyin search",()=>{
 const a=adapters.get("zh");
 assert.equal(a.gridMode,"single-han");
 assert.equal(a.matchesGridEntry({word:"学"}),true);
 assert.equal(a.matchesGridEntry({word:"学习"}),false);
 assert.equal(a.matchesSearch({word:"学",phonetic:"xué"},"xue"),true);
});
test("Malay adapter has independent Malay locale and affix-aware search forms",()=>{
 const a=adapters.get("ms");
 assert.equal(a.locale,"ms-MY");
 assert.equal(a.morphology,"malay-affixation");
 assert.deepEqual(a.flashcardModes,["word","definition","mixed","sentence"]);
 assert.ok(a.flashcardCardSets.includes("common"));
 assert.equal(a.matchesSearch({word:"berjalan",searchForms:["jalan","berjalan"]},"jalan"),true);
 assert.equal(a.matchesGridEntry({word:"berjalan"}),true);
});
