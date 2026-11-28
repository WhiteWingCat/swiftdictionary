const fs=require("node:fs");
const path=require("node:path");
global.window={};
require(path.resolve("data/languages/english-lessons.js"));
require(path.resolve("data/chinese-lessons.js"));
require(path.resolve("data/chinese-flashcards.js"));
require(path.resolve("data/languages/malay-learning-support-translations.js"));
require(path.resolve("data/languages/malay-learning-support-overrides.js"));
const output=window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS;
if(!output||output.status!=="machine_assisted_draft"||output.targetLanguage!=="ms")throw new Error("Malay learning-support output metadata is invalid");
if(output.humanReviewStatus!=="pending"||output.modelLicensingStatus!=="pending_verification")throw new Error("Malay support translations must retain explicit human-review and model-license release gates.");
let lessonQuestions=0,quizQuestions=0,flashcardEntries=0;
const indonesianOnlyTerms=/\b(?:aku|kamu|kau|khawatir|halo|ayolah|ayo|teman|ketemu|karena|bahwa|berbeda|coba|kapan|silakan|aktivitas|kualitas|universitas|berpikir|pikir|ngomong|membutuhkan|butuh|kalian|dulu|kantor|kalimat|bis|nggak|enggak|banget|apotek|bahasan|ana|kakakku|pertanyaan|kursi|kebijakan|menaruh|film|dimana|saja|mengirimkan|mengirim|mendapatkan|meskipun|terjadi|saat|berbicara|mengerti|jadwal|dosing|ekonomis|memyakinkan|wourna)\b/i;
function assertMalayDraftQuality(value,path){
 if(typeof value==="string"&&indonesianOnlyTerms.test(value))throw new Error("Indonesian-only wording remains in Malay draft at "+path+": "+value);
 if(Array.isArray(value))value.forEach((item,index)=>assertMalayDraftQuality(item,path+"["+index+"]"));
 else if(value&&typeof value==="object")Object.entries(value).forEach(([key,item])=>assertMalayDraftQuality(item,path+"."+key));
}
for(const [code,catalogue] of [["en",window.SWIFT_ENGLISH_LESSONS],["zh",window.SWIFT_CHINESE_LESSONS]]){
  for(const difficulty of ["beginner","intermediate","advanced"]){
    for(const lesson of catalogue[difficulty]||[]){
      const source=lesson.practices||(lesson.practice?[lesson.practice]:[]);
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
if(input.flashcards?.en?.length!==1341||input.flashcards?.zh?.length!==1447)throw new Error("Flashcard translation source inventory is incomplete.");
if(Object.keys(output.flashcards?.en||{}).length!==1341||Object.keys(output.flashcards?.zh||{}).length!==1447)throw new Error("Generated Malay Flashcard support must cover 1,341 English and 1,447 Chinese cards.");
for(const [code,items] of Object.entries(input.flashcards||{})){
  for(const item of items){
    const row=output.flashcards?.[code]?.[item.word];
    if(!row)throw new Error("Missing Flashcard Malay support row: "+code+"/"+item.word);
    if(item.definition&&(!row.definitionMs||!row.definitionMs.trim()))throw new Error("Missing Flashcard Malay definition: "+code+"/"+item.word);
    if(item.example&&(!row.exampleMs||!row.exampleMs.trim()))throw new Error("Missing Flashcard Malay example: "+code+"/"+item.word);
    flashcardEntries++;
  }
}
assertMalayDraftQuality(output.lessons,"lessons");
assertMalayDraftQuality(output.quiz,"quiz");
assertMalayDraftQuality(output.flashcards,"flashcards");
for(const [code,lessons] of Object.entries(output.lessons||{})){
 for(const [lessonId,rows] of Object.entries(lessons||{})){
  for(let index=0;index<rows.length;index++){
   const options=rows[index].options||[];
   if(new Set(options).size!==options.length)throw new Error("Duplicate Malay lesson options: "+code+"/"+lessonId+"/"+index);
  }
 }
}
for(const [code,questions] of Object.entries(output.quiz||{})){
 for(const [questionId,question] of Object.entries(questions||{})){
  const options=Object.values(question.options||{});
  for(const field of ["learning","translation"]){
   const values=options.map(option=>String(option[field]||"").trim());
   if(values.some(value=>!value)||new Set(values).size!==values.length)throw new Error("Missing or duplicate Malay Quiz "+field+" options: "+code+"/"+questionId);
  }
 }
}
console.log(JSON.stringify({lessonPracticeQuestions:lessonQuestions,quizQuestions,flashcardEntries,status:"PASS"}));
