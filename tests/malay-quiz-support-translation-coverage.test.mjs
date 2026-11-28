import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

function loadMalaySupport(){
 const context={window:{}};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync("data/languages/malay-learning-support-translations.js","utf8"),context);
 vm.runInContext(fs.readFileSync("data/languages/malay-learning-support-overrides.js","utf8"),context);
 return context.window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS;
}

const indonesianOnlyTerms=/\b(?:aku|bisa|kantor|nggak|enggak|banget|apotek)\b/i;

test("Every approved English Quiz question has a complete Malay prompt, explanation and option set",()=>{
 const support=loadMalaySupport();
 const source=JSON.parse(fs.readFileSync("content/quiz/questions.en-zh.draft.json","utf8"));
 const approved=source.questions.filter(question=>question.release_approved===true);
 assert.equal(approved.length,199);
 for(const question of approved){
  const row=support.quiz.en[question.question_id];
  assert.ok(row,question.question_id+" missing Malay support");
  assert.ok(row.promptLearning?.trim(),question.question_id+" missing Malay prompt");
  assert.ok(row.explanationLearning?.trim(),question.question_id+" missing Malay explanation");
  const optionIds=question.options.map(option=>option.id).sort();
  assert.deepEqual(Object.keys(row.options||{}).sort(),optionIds,question.question_id+" option IDs must remain unchanged");
  for(const field of [row.promptLearning,row.explanationLearning,...Object.values(row.options).map(option=>option.learning)]){
   assert.ok(field?.trim(),question.question_id+" contains an empty Malay field");
   assert.doesNotMatch(field,indonesianOnlyTerms,question.question_id+" contains an Indonesian-only lexical form");
  }
 }
});

test("Every Chinese Quiz question has a complete Malay support-language mapping",()=>{
 const support=loadMalaySupport();
 const source=JSON.parse(fs.readFileSync("content/quiz/questions.zh-en.draft.json","utf8"));
 assert.equal(source.questions.length,145);
 for(const question of source.questions){
  const row=support.quiz.zh[question.question_id];
  assert.ok(row,question.question_id+" missing Malay support");
  assert.ok(row.promptLearning?.trim(),question.question_id+" missing Malay prompt");
  assert.ok(row.explanationLearning?.trim(),question.question_id+" missing Malay explanation");
  const optionIds=question.options.map(option=>option.id).sort();
  assert.deepEqual(Object.keys(row.options||{}).sort(),optionIds,question.question_id+" option IDs must remain unchanged");
  for(const field of [row.promptLearning,row.explanationLearning,...Object.values(row.options).map(option=>option.learning)]){
   assert.ok(field?.trim(),question.question_id+" contains an empty Malay field");
   assert.doesNotMatch(field,indonesianOnlyTerms,question.question_id+" contains an Indonesian-only lexical form");
  }
 }
});
