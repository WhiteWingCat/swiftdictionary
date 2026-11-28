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
