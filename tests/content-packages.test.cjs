const test=require("node:test");
const assert=require("node:assert/strict");
global.window={};
require("../js/core/language-registry.js");
require("../js/core/content-packages.js");
const packages=window.SWIFT_CONTENT_PACKAGES;

test("content packages preserve language-owned source arrays without mutating them",()=>{
 const entries=[{word:"hello",course:"en",definition:"A greeting."}];
 const p=packages.createPackage({languageCode:"en",contentVersion:"legacy-u2.9.1",content:{dictionary:{entries}}});
 assert.equal(p.dictionary.entries.length,1);
 assert.equal(p.dictionary.entries[0].headword,"hello");
 assert.equal(p.dictionary.entries[0].languageCode,"en");
 assert.equal(p.dictionary.entries[0].senses[0].definition,"A greeting.");
 assert.equal(p.dictionary.entries[0].legacySource,entries[0]);
 assert.equal(p.languageCode,"en");
 assert.equal(entries[0].word,"hello");
});
test("Phase 3 Malay content package inherits the feature-build active status",()=>{
 const p=packages.createPackage({languageCode:"ms",contentVersion:"3.0.0-draft"});
 assert.equal(p.status,"active");
 assert.deepEqual(p.dictionary.entries,[]);
});
test("unknown language package is rejected",()=>{
 assert.throws(()=>packages.createPackage({languageCode:"xx",contentVersion:"1"}),/Unknown language/);
});

test("lesson and Daily Learning records retain source identity and difficulty metadata",()=>{
 const lesson={id:"en.lesson.basics",difficulty:"beginner",title:"Basics"};
 const daily={id:"en.daily.topic.1",title:"Daily topic"};
 const p=packages.createPackage({languageCode:"en",contentVersion:"1.0.0",content:{lessons:{permanent:[{...lesson,legacySource:lesson}]},dailyLearning:{topics:[daily]}}});
 assert.equal(p.lessons.permanent[0].difficulty,"beginner");
 assert.equal(p.lessons.permanent[0].legacySource,lesson);
 assert.equal(p.dailyLearning.topics[0].legacySource,daily);
});
