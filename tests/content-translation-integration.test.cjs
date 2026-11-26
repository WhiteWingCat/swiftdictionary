const test=require("node:test");
const assert=require("node:assert/strict");
global.window={};
require("../js/core/language-registry.js");
require("../js/core/content-contracts.js");
require("../js/core/translation-registry.js");
require("../js/core/content-packages.js");
const packages=window.SWIFT_CONTENT_PACKAGES;
const translations=window.SWIFT_TRANSLATION_REGISTRY;

test("legacy English lesson translations are wrapped as unverified records",()=>{
 const p=packages.createPackage({languageCode:"en",contentVersion:"legacy-u2.9.1",content:{lessons:{permanent:[{id:"en.lesson.greetings",difficulty:"beginner"}],translations:{"en.lesson.greetings":{title:"问候"}}}}});
 assert.equal(p.lessons.permanent[0].id,"en.lesson.greetings");
 assert.equal(p.lessons.translations.length,1);
 const record=translations.get("en.lesson.greetings","en","zh");
 assert.equal(record.status,"legacy_unverified");
 assert.equal(record.content.title,"问候");
 assert.equal(record.reviewerId,null);
});

test("planned language packages cannot start active learning features",()=>{
 packages.createPackage({languageCode:"ms",contentVersion:"3.0.0-planned"});
 assert.throws(()=>packages.requireFeature("ms","lessons"),/not active/);
 assert.throws(()=>packages.requireFeature("ms","quiz"),/not active/);
});

test("English and Chinese package lookup remains language isolated",()=>{
 packages.createPackage({languageCode:"en",contentVersion:"1",content:{dictionary:{entries:[{word:"hello",definition:"A greeting."}]}}});
 packages.createPackage({languageCode:"zh",contentVersion:"1",content:{dictionary:{entries:[{word:"学",definition:"学习。"}]}}});
 assert.equal(packages.get("en").dictionary.entries[0].headword,"hello");
 assert.equal(packages.get("zh").dictionary.entries[0].headword,"学");
 assert.equal(packages.get("en").dictionary.entries[0].languageCode,"en");
 assert.equal(packages.get("zh").dictionary.entries[0].languageCode,"zh");
});
