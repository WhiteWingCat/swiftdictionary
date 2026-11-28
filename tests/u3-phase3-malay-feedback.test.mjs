import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const daily=fs.readFileSync("daily-learning.js","utf8");
const index=fs.readFileSync("index.html","utf8");
const migration=fs.readFileSync("supabase/migrations/20261127150000_swiftdictionary_update_3_0_malay_daily_discovery_catalogue_sync.sql","utf8");

test("Daily Learning resolves multilingual object prompts, options and explanations to strings",()=>{
 assert.match(daily,/function dailyLocalizedText\(value, language=snapshot\.learningLanguage/);
 assert.match(daily,/dailyLocalizedText\(source,snapshot\.learningLanguage/);
 assert.match(daily,/dailyLocalizedText\(option,snapshot\.learningLanguage/);
 assert.match(daily,/function dailyQuestionExplanation\(question\)/);
 assert.match(daily,/const explanation = dailyQuestionExplanation\(question\)/);
 assert.doesNotMatch(daily,/esc\(question\.q \|\| ""\)/);
});

test("Malay target selection is no longer coupled to Dictionary translation coverage",()=>{
 assert.match(index,/const available=activeLearningCode!=="ms"/);
 assert.doesNotMatch(index,/translationLanguage=requestedLanguage==="ms" && !malayDictionaryTargetReady/);
 assert.doesNotMatch(index,/if\(translation==="ms" && !malayDictionaryTargetReady\)/);
 assert.match(index,/const quizMalaySupport=window\.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS\?\.quiz\|\|\{\}/);
 assert.match(index,/function quizMalayQuestion\(q,learningCode\)/);
 assert.doesNotMatch(index,/Malay support translations for English and Chinese Quiz questions are not available yet/);
});

test("Malay Discovery catalogue sync preserves the 93 active scheduled entries",()=>{
 assert.match(migration,/<>93/);
 assert.match(migration,/rotation_order/);
 assert.match(migration,/set is_active=false,rotation_order=null/);
});

test("Chinese Weak Memory lookup indexes each source bank with a valid card kind",()=>{
 const flashcards=fs.readFileSync("flashcards.js","utf8");
 assert.match(flashcards,/mapChineseReviewItems\(bank\.characters,"characters"\)/);
 assert.match(flashcards,/mapChineseReviewItems\(bank\.vocabulary,"vocabulary"\)/);
 assert.match(flashcards,/mapChineseReviewItems\(bank\.phrases,"phrases"\)/);
 assert.doesNotMatch(flashcards,/cardKind:kind,definition:item\.translationEn/);
});

test("Quiz course switching waits for the persisted selection and ignores stale switches",()=>{
 assert.match(index,/const requestedCourse=quizEl\("courseSelect"\)\.value\|\|course/);
 assert.match(index,/quizCourseSwitchRequest!==quizCourseSwitchRequestId/);
 assert.match(index,/await quizSyncCoursePreferences\(\)/);
 assert.match(index,/supports\(requestedCourse,"quiz"\)/);
});

test("learning help copy reflects the three active learning courses",()=>{
 assert.match(index,/Quiz supports English, Simplified Chinese and Malaysian Standard Malay/);
 assert.match(index,/Flashcards supports English, Simplified Chinese and Malaysian Standard Malay/);
 assert.doesNotMatch(index,/Not yet\. The current approved Quiz content supports the English learning course only/);
 assert.doesNotMatch(index,/current Lessons library contains English learning content only/);
});

test("Learning guidance is available in English, Chinese and Malaysian Malay for all learning pages",()=>{
 assert.match(index,/const chineseIntroCopy=\{[\s\S]*?lessons:\{title:"欢迎使用课程学习"/);
 assert.match(index,/const malayIntroCopy=\{[\s\S]*?lessons:\{title:"Selamat Datang ke Pelajaran"/);
 assert.match(index,/quiz:\{title:"Selamat Datang ke Kuiz"/);
 assert.match(index,/flashcards:\{title:"Selamat Datang ke Kad Imbas"/);
 assert.match(index,/translationLanguage==="ms"&&malayIntroCopy\[page\]/);
 assert.match(index,/translationLanguage==="zh"\?"常见问题":translationLanguage==="ms"\?"Soalan lazim"/);
 assert.match(index,/\["Which learning courses are available\?","Flashcards supports/);
});
