const test=require("node:test");
const assert=require("node:assert/strict");
global.window={};
require("../js/core/language-registry.js");
require("../js/core/content-packages.js");
const packages=window.SWIFT_CONTENT_PACKAGES;

test("content packages preserve language-owned source arrays without mutating them",()=>{
 const entries=[{word:"hello",course:"en"}];
 const p=packages.createPackage({languageCode:"en",contentVersion:"legacy-u2.9.1",content:{dictionary:{entries}}});
 assert.equal(p.dictionary.entries,entries);
 assert.equal(p.languageCode,"en");
 assert.equal(entries[0].word,"hello");
});
test("planned Malay can be registered as a package without becoming active",()=>{
 const p=packages.createPackage({languageCode:"ms",contentVersion:"3.0.0-draft"});
 assert.equal(p.status,"planned");
 assert.deepEqual(p.dictionary.entries,[]);
});
test("unknown language package is rejected",()=>{
 assert.throws(()=>packages.createPackage({languageCode:"xx",contentVersion:"1"}),/Unknown language/);
});
