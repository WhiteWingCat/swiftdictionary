const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
global.window={};
require(path.resolve("data/languages/english-lessons.js"));
require(path.resolve("data/chinese-lessons.js"));
require(path.resolve("data/chinese-flashcards.js"));
const flashcardsSource=fs.readFileSync(path.resolve("flashcards.js"),"utf8");
const phraseMatch=flashcardsSource.match(/const curatedEnglishPhrases\\s*=\\s*(\\[[\\s\\S]*?\\]);\\s*const state/);
if(!phraseMatch)throw new Error("Could not extract the curated English Flashcard phrase bank");
const englishPhrases=vm.runInNewContext(phraseMatch[1]);

const lessons={en:[],zh:[]};
for(const [code,catalogue] of [["en",window.SWIFT_ENGLISH_LESSONS||{}],["zh",window.SWIFT_CHINESE_LESSONS||{}]]){
  for(const difficulty of ["beginner","intermediate","advanced"]){
    for(const lesson of catalogue[difficulty]||[]){
      const practices=(lesson.practices||[]).map((item,index)=>{
        const pick=value=>typeof value==="string"?value:(value&&typeof value==="object"?(value[code]||value.en||value.zh||""):"");
        return {index,question:pick(item.q),options:(item.options||[]).map(pick)};
      });
      lessons[code].push({id:lesson.id,difficulty,practices});
    }
  }
}
const quiz={};
const flashcards={en:englishPhrases.map(item=>({word:item.word,definition:item.definition,example:(item.examples||[])[0]||""})),zh:[]};
for(const kind of ["characters","vocabulary","phrases"]){
  for(const item of window.SWIFT_CHINESE_FLASHCARDS?.[kind]||[]){
    const definition=item.definitionCueZh||item.definitionZh||"";
    if(item.word&&definition)flashcards.zh.push({word:item.word,definition,example:item.sentenceExampleZh||item.exampleZh||""});
  }
}
for(const [code,file] of [["en","content/quiz/questions.en-zh.draft.json"],["zh","content/quiz/questions.zh-en.draft.json"]]){
  const pack=JSON.parse(fs.readFileSync(file,"utf8"));
  quiz[code]=(pack.questions||[]).map(q=>({
    id:q.question_id,
    promptLearning:q.prompt_learning,
    promptTranslation:q.prompt_translation,
    explanationLearning:q.explanation_learning,
    explanationTranslation:q.explanation_translation,
    options:(q.options||[]).map(o=>({id:o.id,learning:o.learning_text,translation:o.translation_text}))
  }));
}
const payload={schemaVersion:1,targetLanguage:"ms",source:"Original SwiftDictionary lesson, Quiz and Flashcard content",lessons,quiz,flashcards};
for(const code of ["en","zh"]){
  if(!lessons[code].length)throw new Error("No "+code+" lesson inventory");
  if(!quiz[code].length)throw new Error("No "+code+" Quiz inventory");
}
fs.mkdirSync("tmp",{recursive:true});
fs.writeFileSync("tmp/u3-malay-learning-support-input.json",JSON.stringify(payload));
console.log(JSON.stringify({
  lessons:Object.fromEntries(Object.entries(lessons).map(([k,v])=>[k,{count:v.length,practiceQuestions:v.reduce((n,x)=>n+x.practices.length,0)}])),
  quiz:Object.fromEntries(Object.entries(quiz).map(([k,v])=>[k,v.length])),\n  flashcards:Object.fromEntries(Object.entries(flashcards).map(([k,v])=>[k,v.length]))
}));
