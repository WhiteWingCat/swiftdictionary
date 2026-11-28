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

function loadLessonCatalogues(){
 const context={window:{}};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync("data/languages/english-lessons.js","utf8"),context);
 vm.runInContext(fs.readFileSync("data/chinese-lessons.js","utf8"),context);
 return context.window;
}

const indonesianOnlyTerms=/\b(?:aku|bisa|kantor|nggak|enggak|banget|apotek|kalimat|bis|bahasan|wournia|ana)\b/i;
const flashcardDefinitionTerms=/\b(?:aku|bisa(?!\s+(?:ular|racun|sengat|beracun))|kantor|nggak|enggak|banget|apotek|kalimat|bis|bahasan|wournia|ana)\b/i;

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
  assert.equal(row.promptTranslation,row.promptLearning,question.question_id+" paired prompt fields must use the same Malay meaning");
  assert.equal(row.explanationTranslation,row.explanationLearning,question.question_id+" paired explanation fields must use the same Malay meaning");
  const optionIds=question.options.map(option=>option.id).sort();
  assert.deepEqual(Object.keys(row.options||{}).sort(),optionIds,question.question_id+" option IDs must remain unchanged");
  const displayedOptions=question.question_type==="chinese_translation"
   ?optionIds.map(id=>row.options[id].translation)
   :optionIds.map(id=>row.options[id].learning);
  assert.equal(new Set(displayedOptions.map(value=>value.normalize("NFKC").toLocaleLowerCase("ms").replace(/[^\p{L}\p{N}]+/gu," ").trim())).size,optionIds.length,question.question_id+" Malay answer choices must remain distinct");
  if(question.question_type==="chinese_translation"){
   for(const optionId of optionIds)assert.ok(row.options[optionId]?.translation?.trim(),question.question_id+" missing Malay translation for Chinese answer option "+optionId);
  }
  for(const field of [row.promptLearning,row.explanationLearning,...Object.values(row.options).flatMap(option=>[option.learning,option.translation])]){
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
  assert.equal(row.promptTranslation,row.promptLearning,question.question_id+" paired prompt fields must use the same Malay meaning");
  assert.equal(row.explanationTranslation,row.explanationLearning,question.question_id+" paired explanation fields must use the same Malay meaning");
  const optionIds=question.options.map(option=>option.id).sort();
  assert.deepEqual(Object.keys(row.options||{}).sort(),optionIds,question.question_id+" option IDs must remain unchanged");
  const displayedOptions=question.question_type==="chinese_translation"
   ?optionIds.map(id=>row.options[id].translation)
   :optionIds.map(id=>row.options[id].learning);
  assert.equal(new Set(displayedOptions.map(value=>value.normalize("NFKC").toLocaleLowerCase("ms").replace(/[^\p{L}\p{N}]+/gu," ").trim())).size,optionIds.length,question.question_id+" Malay answer choices must remain distinct");
  for(const field of [row.promptLearning,row.explanationLearning,...Object.values(row.options).map(option=>option.learning)]){
   assert.ok(field?.trim(),question.question_id+" contains an empty Malay field");
   assert.doesNotMatch(field,indonesianOnlyTerms,question.question_id+" contains an Indonesian-only lexical form");
  }
 }
});

test("English and Chinese lesson practice prompts and options are corrected into Malaysian Malay and source-aligned",()=>{
 const support=loadMalaySupport();
 const catalogues=loadLessonCatalogues();
 for(const language of ["en","zh"]){
  const lessons=support.lessons[language]||{};
  const sourceCatalogue=language==="en"?catalogues.SWIFT_ENGLISH_LESSONS:catalogues.SWIFT_CHINESE_LESSONS;
  const sourceById=new Map(Object.values(sourceCatalogue||{}).flat().map(lesson=>[lesson.id,lesson]));
  const rows=Object.values(lessons).flat();
  assert.equal(rows.length,112,language+" lesson practice translation count");
  for(const [lessonId,questions] of Object.entries(lessons)){
   const sourceLesson=sourceById.get(lessonId);
   assert.ok(sourceLesson,language+":"+lessonId+" source lesson is missing");
   const sourceQuestions=sourceLesson.practices||(sourceLesson.practice?[sourceLesson.practice]:[]);
   assert.equal(questions.length,sourceQuestions.length,language+":"+lessonId+" practice row count must match source");
   for(const [index,question] of questions.entries()){
    assert.ok(question.q?.trim(),language+":"+lessonId+" question "+index+" missing Malay prompt");
    assert.ok(Array.isArray(question.options),language+":"+lessonId+" question "+index+" missing options");
    assert.equal(question.options.length,sourceQuestions[index].options.length,language+":"+lessonId+" question "+index+" option count must match source");
    const normalizedOptions=question.options.map(value=>value.normalize("NFKC").toLocaleLowerCase("ms").replace(/[\p{L}\p{N}]+/gu," ").trim());
    assert.equal(new Set(normalizedOptions).size,normalizedOptions.length,language+":"+lessonId+" question "+index+" has duplicate Malay answer choices");
    for(const field of [question.q,...question.options]){
     assert.ok(field?.trim(),language+":"+lessonId+" question "+index+" has empty Malay text");
     assert.doesNotMatch(field,indonesianOnlyTerms,language+":"+lessonId+" contains an Indonesian-only lexical form");
    }
   }
  }
 }
});

test("English and Chinese Flashcard Malay definitions contain no obvious Indonesian-only forms",()=>{
 const support=loadMalaySupport();
 for(const lang of ["en","zh"])for(const [word,row] of Object.entries(support.flashcards?.[lang]||{})){
  if(!row.definitionMs?.trim())continue; // Full coverage is asserted separately after generation.
  assert.doesNotMatch(row.definitionMs,flashcardDefinitionTerms,lang+":"+word+" definition contains an Indonesian-only lexical form");
 }
});

test("Malay support generator falls back to curated glosses for isolated Chinese tokens", () => {
  const exporter = fs.readFileSync("scripts/content/export-malay-learning-support-input.cjs","utf8");
  const generator = fs.readFileSync("scripts/content/generate-malay-learning-support.py","utf8");
  assert.ok(exporter.includes("window.SWIFT_FLASHCARD_MALAY_SUPPORT"));
  assert.ok(generator.includes('malay_glosses.get("zh",{}).get(value,"")'));
  assert.ok(generator.includes('re.search(r"[\\u3400-\\u9fff]"'));
});
