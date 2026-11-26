const test=require("node:test");
const assert=require("node:assert/strict");
global.window={};
require("../js/core/content-contracts.js");
require("../js/core/translation-registry.js");
const registry=window.SWIFT_TRANSLATION_REGISTRY;

test("legacy translations are preserved but explicitly unverified",()=>{
 const records=registry.registerLegacyMap({translations:{"en.lesson.hello":{title:"你好"}},sourceLanguageCode:"en",targetLanguageCode:"zh",contentVersion:"legacy-u2.9.1"});
 assert.equal(records.length,1);
 assert.equal(records[0].status,"legacy_unverified");
 assert.equal(registry.get("en.lesson.hello","en","zh").content.title,"你好");
});
test("source revision changes stale existing translations",()=>{
 registry.register({contentId:"en.lesson.goodbye",sourceLanguageCode:"en",targetLanguageCode:"zh",sourceRevision:1,translationRevision:1,status:"reviewed",provenance:"review batch"});
 const stale=registry.markSourceRevisionChanged("en.lesson.goodbye","en",2);
 assert.equal(stale.length,1);
 assert.equal(stale[0].status,"stale");
});
test("approved translations require reviewer reference",()=>{
 assert.throws(()=>registry.register({contentId:"en.lesson.test",sourceLanguageCode:"en",targetLanguageCode:"zh",sourceRevision:1,translationRevision:1,status:"approved"}),/reviewerId/);
});
