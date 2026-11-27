import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import vm from "node:vm";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
test("Malay target option is available for English and Chinese courses, not as a self-translation",()=>{
 const html=read("index.html");
 assert.match(html,/const available=activeLearningCode!=="ms"/);
 assert.doesNotMatch(html,/translationSelect:\s*malayDictionaryTargetReady/);
 assert.doesNotMatch(html,/preferenceTranslation:\s*malayDictionaryTargetReady/);
});
test("Malay daily activity resolves structured multilingual prompts, options and explanations",()=>{
 const js=read("daily-learning.js");
 assert.match(js,/function dailyLocalizedText\(value, language=snapshot\.learningLanguage/);
 assert.match(js,/function dailyQuestionOption\(option\)/);
 assert.match(js,/dailyLocalizedText\(option,snapshot\.learningLanguage/);
 assert.match(js,/function dailyQuestionExplanation\(question\)/);
});
test("Malay lesson history review resolves the Malay lesson catalogue",()=>{
 const html=read("index.html");
 assert.match(html,/targetCourse\s*===\s*["']ms["'][\s\S]{0,100}SWIFT_MALAY_LESSONS\?\.\[difficulty\]/);
 assert.match(html,/dashboardLanguageLabel\(code\)/);
});
test("Quiz unavailable copy is generic and capability-driven",()=>{
 const html=read("index.html");
 assert.match(html,/SWIFT_LANGUAGE_REGISTRY\?\.get\(course\)/);
 assert.doesNotMatch(html,/Chinese Quiz is coming soon/);
});

test("Daily activity rendering never stringifies structured content objects",()=>{
 const js=read("daily-learning.js");
 assert.match(js,/const safeFallback=typeof fallback===\"string\"\|\|typeof fallback===\"number\"\?String\(fallback\):\"\"/);
 assert.match(js,/function dailyDisplaySupport\(value, primary\)/);
 assert.match(js,/dailyLocalizedText\(content\.body,snapshot\.learningLanguage/);
 assert.match(js,/dailyLocalizedText\(example,snapshot\.learningLanguage/);
 assert.doesNotMatch(js,/esc\(content\.body\)/);
 assert.doesNotMatch(js,/\" 中文说明：\" \+ question\.zh/);
});
test("Malay Daily Topic and Application catalogue metadata mirrors all 120 live content records",()=>{
 const source=read("data/malay-daily-learning.js");
 const migration=read("supabase/migrations/20261127190000_swiftdictionary_update_3_0_malay_daily_catalogue_metadata_alignment.sql");
 const context={window:{}};
 vm.runInNewContext(source,context);
 const daily=context.window.SWIFT_MALAY_DAILY_LEARNING;
 const topics=daily.topics||[];
 const applications=daily.applications||[];
 const ids=[...topics,...applications].map(item=>item.id);
 assert.equal(topics.length,60);
 assert.equal(applications.length,60);
 for(const id of ids)assert.ok(migration.includes("'" + id + "'"),"catalogue alignment is missing "+id);
 assert.match(migration,/v_updated <> 120/);
});

test("English and Chinese Lessons retain their learning-language text and show Malay support alongside it",()=>{
 const html=read("index.html");
 assert.match(html,/const lessonMsTextLookup=new Map\(\)/);
 assert.match(html,/function indexLessonSupportText\(source,support\)/);
 assert.match(html,/lessonMsTextLookup\.get\(value\)/);
 assert.match(html,/lessonMsTextLookup\.get\(value\.zh\)/);
 assert.match(html,/lessonZh\[x\.id\]\?\.practices/);
 assert.match(html,/lessonMsPractice\[isChineseCourse\(\)\?"zh":"en"\]\?\.\[x\.id\]/);
 assert.match(html,/q:practiceValue\(q\.q,translated\?\.q\)/);
  assert.match(html,/lessonMsPractice\[isChineseCourse\(\)\?"zh":"en"\]\?\.\[x\.id\]/);
  assert.match(html,/translations:\{\.\.\.\(source\.translations\|\|\{\}\),ms:translated\}/);
 assert.match(html,/options:order\.map\(j=>practiceValue\(q\.options\[j\],translated\?\.options\?\.\[j\]\)\)/);
});
test("Malay lesson practice and English/Chinese Quiz support packs are wired into the reader and answer review",()=>{
 const html=read("index.html");
 assert.match(html,/<script src="data\/languages\/malay-learning-support-translations\.js\?v=3\.0\.0-ms1"><\/script>/);
 assert.match(html,/quizTranslationVisible\(code\)\{return code === "zh" \|\| code === "en" \|\| code === "ms";\}/);
 assert.match(html,/quizMalayQuestion\(q,learningCode\)/);
 assert.match(html,/quizMalayOption\(q,option,learningCode\)/);
 assert.match(html,/quizMalayOption\(q,o,data\.learning_language_code\)/);
 assert.match(html,/explanationSupport=effectiveTranslation==="ms"\?\(supportRow\?\.explanationLearning/);
 assert.match(html,/serverTranslation=requestedTranslation==="ms"\?"en":requestedTranslation/);
 const generator=read("scripts/content/generate-malay-learning-support.py");
 assert.match(generator,/"lessons":\{"en":\{\},"zh":\{\}\}/);
 assert.match(generator,/"quiz":\{"en":\{\},"zh":\{\}\}/);
 assert.match(generator,/"flashcards":\{"en":\{\},"zh":\{\}\}/);
});
test("Flashcards derive Malay support from authored dictionary translations and avoid blank translated cards",()=>{
 const html=read("index.html");
 const support=html.indexOf('<script src="data/languages/malay-flashcard-translations.js');
 const flash=html.indexOf('<script src="flashcards.js');
 assert.ok(support>=0&&flash>support,"Malay Flashcard support translations must load before Flashcards");
 const js=read("flashcards.js");
 assert.match(js,/function addMalayFlashcardSupport\(items,language\)/);
 assert.match(js,/SWIFT_FLASHCARD_MALAY_SUPPORT/);
 assert.match(js,/all=all\.filter\(word=>Boolean\(translationFor\(word\)\)\)/);
 assert.match(js,/malaySupportEnglishCount/);
 assert.match(js,/malaySupportChineseCount/);
 assert.match(js,/SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS\?\.flashcards\?\.\[language\]/);
});
