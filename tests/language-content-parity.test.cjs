const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const context={window:{}};
vm.createContext(context);

test("English and Chinese Dictionary packages retain audited counts and unique headwords",()=>{
 vm.runInContext(read("data/languages/english-dictionary.js"),context);
 vm.runInContext(read("data/english-expansion.js"),context);
 const english=[...context.window.SWIFT_ENGLISH_BASE_DICTIONARY,...context.window.SWIFT_ENGLISH_EXPANSION];
 const englishKeys=english.map(x=>String(x.word).toLocaleLowerCase("en")+"|"+String(x.part||""));
 assert.equal(context.window.SWIFT_ENGLISH_BASE_DICTIONARY.length,810);
 assert.equal(context.window.SWIFT_ENGLISH_EXPANSION.length,506);
 assert.equal(english.length,1316);
 assert.equal(new Set(englishKeys).size,1316);

 vm.runInContext(read("data/chinese-characters.js"),context);
 vm.runInContext(read("data/languages/chinese-dictionary.js"),context);
 const chinese=context.window.SWIFT_CHINESE_BASE_DICTIONARY;
 assert.equal(chinese.length,725);
 assert.equal(new Set(chinese.map(x=>x.word)).size,725);
});

test("English and Chinese lesson catalogues preserve audited lesson totals",()=>{
 vm.runInContext(read("data/languages/english-lessons.js"),context);
 vm.runInContext(read("data/chinese-lessons.js"),context);
 const englishBase=Object.values(context.window.SWIFT_ENGLISH_LESSONS).flat();
 const chinese=Object.values(context.window.SWIFT_CHINESE_LESSONS).flat();
 const expansion=read("data/english-lessons-expansion.js");
 const added=[...expansion.matchAll(/\bid\s*:\s*"/g)].length;
 assert.equal(englishBase.length+added,20);
 assert.equal(chinese.length,17);
 assert.equal(new Set(chinese.map(x=>x.id)).size,17);
});

test("Chinese Daily Learning and Flashcard source counts remain unchanged and draft status is preserved",()=>{
 vm.runInContext(read("data/chinese-daily-learning.js"),context);
 const daily=context.window.SWIFT_CHINESE_DAILY_LEARNING;
 assert.equal(daily.topics.length,6);
 assert.equal(daily.applications.length,7);
 assert.equal(daily.discovery.length,93);
 vm.runInContext(read("data/chinese-flashcards.js"),context);
 const cards=context.window.SWIFT_CHINESE_FLASHCARDS;
 assert.equal(cards.status,"draft");
 assert.equal(cards.characters.length,519);
 assert.equal(cards.vocabulary.length,904);
 assert.equal(cards.phrases.length,24);
 assert.ok([...cards.characters,...cards.vocabulary,...cards.phrases].every(x=>x.contentStatus==="draft"));
});
