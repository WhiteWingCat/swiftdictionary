import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const context={window:{}};
vm.createContext(context);
vm.runInContext(read("js/core/language-registry.js"),context);
vm.runInContext(read("js/core/content-contracts.js"),context);
vm.runInContext(read("js/core/translation-registry.js"),context);
vm.runInContext(read("js/languages/adapters.js"),context);
vm.runInContext(read("js/core/content-packages.js"),context);
vm.runInContext(read("data/languages/malay-dictionary.js"),context);
vm.runInContext(read("data/malay-lessons.js"),context);
vm.runInContext(read("data/malay-lessons-expansion-02.js"),context);
vm.runInContext(read("data/malay-lessons-expansion-03.js"),context);
vm.runInContext(read("data/malay-lessons-expansion-04.js"),context);
vm.runInContext(read("data/malay-lessons-expansion-05.js"),context);
vm.runInContext(read("data/malay-lessons-expansion-06.js"),context);
vm.runInContext(read("data/malay-lessons-expansion-07.js"),context);
vm.runInContext(read("data/malay-lessons-expansion-08.js"),context);
vm.runInContext(read("data/malay-daily-learning.js"),context);
vm.runInContext(read("data/malay-daily-learning.js").slice(read("data/malay-daily-learning.js").indexOf("/* Fill the scheduled mixed Discovery")),context);

const lessons=context.window.SWIFT_MALAY_LESSONS;
const daily=context.window.SWIFT_MALAY_DAILY_LEARNING;

test("Malay is enabled only for the Phase 3 feature scope",()=>{
  const language=context.window.SWIFT_LANGUAGE_REGISTRY.get("ms");
  assert.equal(language.status,"active");
  assert.equal(language.capabilities.dictionary,true);
  assert.equal(language.capabilities.lessons,true);
  assert.equal(language.capabilities.dailyLearning,true);
  assert.equal(language.capabilities.quiz,false);
  assert.equal(language.capabilities.flashcards,false);
});

test("Malay Lessons has independently authored draft content at all three levels",()=>{
  for(const level of ["beginner","intermediate","advanced"]){
    assert.equal(lessons[level].length,24);
    for(const lesson of lessons[level]){
      assert.match(lesson.id,/^ms-[bia]-/);
      assert.ok(lesson.topic_id);
      for(const field of ["topic","title","summary"]){
        assert.ok(lesson[field]?.ms && lesson[field]?.en && lesson[field]?.zh,lesson.id+" "+field);
      }
      assert.ok(lesson.explanation?.length>=2);
      assert.ok(lesson.points?.length>=1);
      assert.ok(lesson.examples?.length>=1);
      assert.ok(lesson.mistakes?.length>=1);
      assert.ok(lesson.practices?.length>=3);
      for(const q of lesson.practices){
        assert.ok(q.q.ms && q.q.en && q.q.zh);
        assert.equal(q.options.length,4);
        assert.ok(Number.isInteger(q.answer) && q.answer>=0 && q.answer<q.options.length);
        assert.ok(q.options.every(o=>o.ms&&o.en&&o.zh));
      }
    }
  }
  assert.equal(lessons.editorialStatus,"draft");
  assert.equal(lessons.translationStatus,"machine_assisted_draft");
  assert.equal(lessons.contentVersion,"u3-ms-lessons-0.8.0");
  assert.equal(lessons.expansionBatches.reduce((sum,batch)=>sum+batch.added,0),63);
  const ids=["beginner","intermediate","advanced"].flatMap(level=>lessons[level].map(x=>x.id));
  assert.equal(ids.length,72);
  assert.equal(new Set(ids).size,72);
});

test("Malay Daily Learning includes all four shared activity categories",()=>{
  assert.equal(daily.topics.length,3);
  assert.equal(daily.applications.length,3);
  assert.equal(daily.discovery.length,93);
  assert.ok(daily.topics.every(x=>x.id&&x.topicId&&x.title&&x.body));
  assert.ok(daily.applications.every(x=>x.id&&x.topicId&&x.questions?.length));
  assert.ok(daily.discovery.every(x=>x.id&&x.word&&x.definition&&x.en&&x.zh));
  assert.equal(new Set(daily.discovery.map(x=>x.id)).size,93);
});

test("Malay Lessons can be wrapped in the shared content-package contract",()=>{
  const dictionary=context.window.SWIFT_MALAY_DICTIONARY;
  const permanent=Object.entries(lessons).filter(([key,value])=>["beginner","intermediate","advanced"].includes(key)).flatMap(([difficulty,items])=>items.map(item=>({...item,difficulty})));
  const pkg=context.window.SWIFT_CONTENT_PACKAGES.createPackage({
    languageCode:"ms",contentVersion:"u3-ms-phase3-0.1.0",
    content:{dictionary:{entries:dictionary},lessons:{permanent},dailyLearning:daily}
  });
  assert.equal(pkg.status,"active");
  assert.equal(pkg.dictionary.entries.length,650);
  assert.equal(pkg.lessons.permanent.length,72);
  assert.equal(pkg.dailyLearning.topics.length,3);
  assert.equal(pkg.dailyLearning.applications.length,3);
  assert.equal(pkg.dailyLearning.discovery.length,93);
  assert.equal(pkg.dictionary.translations.length,1344);
  assert.ok(pkg.dictionary.translations.every(x=>x.status==="machine_assisted_draft"));
});
