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
// Daily Learning is evaluated once; its discovery pool is derived in the same script.

const lessons=context.window.SWIFT_MALAY_LESSONS;
const daily=context.window.SWIFT_MALAY_DAILY_LEARNING;

test("Malay Quiz and Flashcards are enabled for the staging release",()=>{
  const language=context.window.SWIFT_LANGUAGE_REGISTRY.get("ms");
  assert.equal(language.status,"active");
  assert.equal(language.capabilities.dictionary,true);
  assert.equal(language.capabilities.lessons,true);
  assert.equal(language.capabilities.dailyLearning,true);
  assert.equal(language.capabilities.quiz,true);
  assert.equal(language.capabilities.flashcards,true);
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
  console.log("Malay daily inventory:", {topics:daily.topics.length, applications:daily.applications.length, discovery:daily.discovery.length});
  assert.equal(daily.topics.length,60);
  assert.equal(daily.applications.length,60);
  for(const level of ["beginner","intermediate","advanced"]){
    assert.equal(daily.topics.filter(x=>x.difficulty===level).length,20,"topic balance: "+level);
    assert.equal(daily.applications.filter(x=>x.difficulty===level).length,20,"application balance: "+level);
  }
  assert.equal(daily.discovery.length,93);
  assert.ok(daily.topics.every(x=>x.id&&x.topicId&&x.title&&x.body));
  assert.ok(daily.applications.every(x=>x.id&&x.topicId&&x.questions?.length));
  assert.equal(new Set(daily.topics.map(x=>x.id)).size,daily.topics.length);
  assert.equal(new Set(daily.applications.map(x=>x.id)).size,daily.applications.length);
  assert.ok(daily.topics.every(x=>x.titleEn&&x.titleZh&&x.example&&x.exampleEn&&x.exampleZh));
  assert.ok(daily.applications.every(x=>x.titleEn&&x.titleZh&&x.example&&x.exampleEn&&x.exampleZh&&x.questions.every(q=>q.q&&q.options.length===4&&Number.isInteger(q.answer))));
  assert.ok(daily.applications.filter(x=>x.id.endsWith("-02") || x.id.endsWith("-03") || x.id.endsWith("-04")).every(x=>x.questions.every(q=>q.q.ms&&q.q.en&&q.q.zh&&q.options.every(o=>o.ms&&o.en&&o.zh))));
  assert.ok(daily.topics.filter(x=>x.id.endsWith("-03") || x.id.endsWith("-04")).every(x=>x.titleEn&&x.titleZh&&x.en&&x.zh&&x.exampleEn&&x.exampleZh));
  assert.ok(daily.applications.filter(x=>x.id.endsWith("-03") || x.id.endsWith("-04")).every(x=>x.questions.every(q=>q.options.every(o=>typeof o==="object"&&o.ms&&o.en&&o.zh))));
  const topicIds=new Set(daily.topics.map(x=>x.topicId));
  assert.ok(daily.applications.filter(x=>x.id.endsWith("-03") || x.id.endsWith("-04")).every(x=>topicIds.has(x.topicId)));
  assert.equal(daily.contentVersion,"u3-ms-daily-0.4.0");
  assert.ok(daily.discovery.every(x=>x.id&&x.word&&x.definition&&x.en&&x.zh));
  assert.equal(new Set(daily.discovery.map(x=>x.id)).size,93);
});

test("Malay Lessons can be wrapped in the shared content-package contract",()=>{
  const dictionary=context.window.SWIFT_MALAY_DICTIONARY;
  const permanent=Object.entries(lessons).filter(([key,value])=>["beginner","intermediate","advanced"].includes(key)).flatMap(([difficulty,items])=>items.map(item=>({...item,difficulty})));
  const pkg=context.window.SWIFT_CONTENT_PACKAGES.createPackage({
    languageCode:"ms",contentVersion:"u3-ms-phase3-0.1.0",
    content:{dictionary:{entries:dictionary},lessons:{permanent},dailyLearning:daily,flashcards:{source:{type:"dictionary-derived",source:"data/languages/malay-dictionary.js",entryCount:650,supportLanguages:["en","zh"]}}}
  });
  assert.equal(pkg.status,"active");
  assert.equal(pkg.dictionary.entries.length,650);
  assert.equal(pkg.lessons.permanent.length,72);
  assert.equal(pkg.dailyLearning.topics.length,daily.topics.length);
  assert.equal(pkg.dailyLearning.applications.length,daily.applications.length);
  assert.equal(pkg.dailyLearning.discovery.length,93);
  assert.equal(pkg.flashcards.source.type,"dictionary-derived");
  const bootstrap=fs.readFileSync("js/core/legacy-content-bootstrap.js","utf8");
  assert.match(bootstrap,/flashcards:\{source:data\.flashcards\?\.source/);
  assert.equal(pkg.dictionary.translations.length,1344);
  assert.ok(pkg.dictionary.translations.every(x=>x.status==="machine_assisted_draft"));
});


test("Curated Malay Quiz support corrections load after generated drafts without changing answer IDs",()=>{
  vm.runInContext(read("data/languages/malay-learning-support-translations.js"),context);
  vm.runInContext(read("data/languages/malay-learning-support-overrides.js"),context);
  const support=context.window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS;
  const corrected=context.window.SWIFT_MALAY_LEARNING_SUPPORT_CORRECTIONS;
  assert.equal(corrected.status,"model_assisted_malay_draft_pending_editorial_review");
  assert.ok(corrected.quiz.en.length>=144,"English Quiz Malay support batch count should include the newly curated 36 questions");
  assert.ok(corrected.quiz.zh.length>=120,"Chinese Quiz Malay support batch count should include the newly curated 36 questions");
  assert.equal(corrected.lessons.en,49);
  assert.equal(corrected.lessons.zh,49);
  assert.match(support.lessons.en["b-sentence"][0].q,/ayat penyata mudah/);
  assert.match(support.lessons.en["b-sentence"][3].options[1],/Terdapat tiga buah kerusi/);
  assert.match(support.lessons.zh["zh-b-pinyin-foundations"][0].q,/nada pertama/);
  assert.match(support.lessons.zh["zh-b-pinyin-foundations"][5].options[0],/nǐ hǎo/);
  assert.match(support.lessons.en["b-present"][1].q,/Abang saya/);
  assert.match(support.lessons.zh["zh-b-greetings-introductions"][0].q,/Selamat pagi/);
  assert.match(support.lessons.en["b-articles"][3].q,/Mengapakah/);
  assert.match(support.lessons.zh["zh-b-numbers-dates-time"][4].q,/susunan tarikh/);
  assert.match(support.lessons.en["b-verb-combinations"][11].q,/Pilih frasa/);
  assert.match(support.lessons.zh["zh-b-pronouns-basic-sentences"][5].q,/Ini buku saya/);
  assert.match(support.lessons.en["b-countable-nouns"][3].q,/ungkapan yang semula jadi/);
  assert.match(support.lessons.zh["zh-b-common-actions"][5].q,/memperoleh pengetahuan/);
  assert.match(support.lessons.en["b-greetings-polite-expressions"][0].q,/pukul 9 pagi/);
  assert.match(support.lessons.zh["zh-b-places-getting-around"][3].q,/lokasi stesen MRT/);
  assert.match(support.lessons.en["b-places-getting-around"][0].q,/meminjam buku/);
  assert.match(support.lessons.zh["zh-b-questions-negation"][5].q,/Adakah kamu seorang pelajar/);
  assert.match(support.lessons.en["i-perfect"][0].q,/masa lampau/);
  assert.match(support.lessons.zh["zh-i-measure-words"][6].q,/kata penggolong/);
  for(const id of corrected.quiz.en){
    const row=support.quiz.en[id];
    assert.ok(row,id+" missing from English Quiz Malay support");
    assert.ok(row.promptLearning?.length>12,id+" prompt is missing");
    assert.ok(row.explanationLearning?.length>12,id+" explanation is missing");
    assert.deepEqual(Object.keys(row.options).sort(),["a","b","c","d"]);
    const values=Object.values(row.options).map(option=>option.learning);
    assert.ok(values.every(value=>typeof value==="string"&&value.trim()),id+" has an empty option translation");
    assert.equal(new Set(values.map(value=>value.toLocaleLowerCase("ms"))).size,4,id+" has duplicate Malay option translations");
  }
  assert.match(support.quiz.en["quiz-advanced-001"].promptLearning,/dapatan awal/i);
  assert.match(support.quiz.en["quiz-advanced-036"].promptLearning,/kenaikan pangkat/);
  assert.match(support.quiz.en["quiz-beginner-001"].promptLearning,/melakukan kesilapan/);
  assert.match(support.quiz.en["quiz-intermediate-006"].explanationLearning,/memikul tanggungjawab/);
  assert.match(support.quiz.en["quiz-intermediate-007"].promptLearning,/Penurunan jualan/);
  assert.match(support.quiz.en["quiz-advanced-042"].explanationLearning,/mempengaruhi/);
  for(const id of corrected.quiz.zh){
    const row=support.quiz.zh[id];
    assert.ok(row,id+" missing from Chinese Quiz Malay support");
    assert.ok(row.promptLearning?.length>12,id+" prompt is missing");
    assert.ok(row.explanationLearning?.length>12,id+" explanation is missing");
    assert.equal(Object.keys(row.options).length,4);
    const field=id.includes("-translation-")?"translation":"learning";
    assert.ok(Object.values(row.options).every(option=>option[field]?.trim()),id+" has an untranslated answer option");
  }
  assert.match(support.quiz.zh["zh-en-a-connectors-01"].promptLearning,/Kata hubung/);
  assert.match(support.quiz.zh["zh-en-b-pinyin-foundations-01"].promptLearning,/nada pertama/);
  assert.match(support.quiz.zh["zh-en-b-places-getting-around-04"].promptLearning,/lokasi stesen MRT/);
});

test("Malay support overrides are loaded after the generated translation inventory",()=>{
  const html=read("index.html");
  assert.ok(html.indexOf("malay-learning-support-translations.js")<html.indexOf("malay-learning-support-overrides.js"));
});
