const fs=require("node:fs");
const path=require("node:path");
global.window={};
require(path.resolve("data/languages/english-lessons.js"));
require(path.resolve("data/chinese-lessons.js"));
require(path.resolve("data/chinese-flashcards.js"));
require(path.resolve("data/languages/malay-learning-support-translations.js"));
const output=window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS;
if(!output||output.status!=="machine_assisted_draft"||output.targetLanguage!=="ms")throw new Error("Malay learning-support output metadata is invalid");
let lessonQuestions=0,quizQuestions=0,flashcardEntries=0;
for(const [code,catalogue] of [["en",window.SWIFT_ENGLISH_LESSONS],["zh",window.SWIFT_CHINESE_LESSONS]]){
  for(const difficulty of ["beginner","intermediate","advanced"]){
    for(const lesson of catalogue[difficulty]||[]){
      const source=lesson.practices||[];
      const translated=output.lessons?.[code]?.[lesson.id];
      if(!Array.isArray(translated)||translated.length!==source.length)throw new Error("Missing practice translation rows: "+code+"/"+lesson.id);
      translated.forEach((row,index)=>{
        if(typeof row.q!=="string"||!row.q.trim()||!Array.isArray(row.options)||row.options.length!==source[index].options.length||row.options.some(x=>typeof x!=="string"||!x.trim()))throw new Error("Incomplete practice translation: "+code+"/"+lesson.id+"/"+index);
        lessonQuestions++;
      });
    }
  }
  const sourcePack=JSON.parse(fs.readFileSync(path.resolve(code==="en"?"content/quiz/questions.en-zh.draft.json":"content/quiz/questions.zh-en.draft.json"),"utf8"));
  for(const q of sourcePack.questions||[]){
    const row=output.quiz?.[code]?.[q.question_id];
    if(!row||["promptLearning","promptTranslation","explanationLearning","explanationTranslation"].some(k=>typeof row[k]!=="string"||!row[k].trim()))throw new Error("Missing Quiz support translation: "+code+"/"+q.question_id);
    if(!Array.isArray(q.options)||q.options.some(o=>!row.options?.[o.id]||!row.options[o.id].learning||!row.options[o.id].translation))throw new Error("Incomplete Quiz option support translation: "+code+"/"+q.question_id);
    quizQuestions++;
  }
}
const input=JSON.parse(fs.readFileSync(path.resolve("tmp/u3-malay-learning-support-input.json"),"utf8"));
for(const [code,items] of Object.entries(input.flashcards||{})){
  for(const item of items){
    const row=output.flashcards?.[code]?.[item.word];
    if(!row||typeof row.definitionMs!=="string"||!row.definitionMs.trim())throw new Error("Missing Flashcard Malay definition: "+code+"/"+item.word);
    if(item.example&&(!row.exampleMs||!row.exampleMs.trim()))throw new Error("Missing Flashcard Malay example: "+code+"/"+item.word);
    flashcardEntries++;
  }
}
console.log(JSON.stringify({lessonPracticeQuestions:lessonQuestions,quizQuestions,flashcardEntries,status:"PASS"}));
