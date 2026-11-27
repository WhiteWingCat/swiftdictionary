const fs=require("node:fs");
const path=require("node:path");
global.window={};
require(path.resolve("data/languages/english-lessons.js"));
require(path.resolve("data/chinese-lessons.js"));

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
const payload={schemaVersion:1,targetLanguage:"ms",source:"Original SwiftDictionary lesson practice and Quiz content",lessons,quiz};
for(const code of ["en","zh"]){
  if(!lessons[code].length)throw new Error("No "+code+" lesson inventory");
  if(!quiz[code].length)throw new Error("No "+code+" Quiz inventory");
}
fs.mkdirSync("tmp",{recursive:true});
fs.writeFileSync("tmp/u3-malay-learning-support-input.json",JSON.stringify(payload));
console.log(JSON.stringify({
  lessons:Object.fromEntries(Object.entries(lessons).map(([k,v])=>[k,{count:v.length,practiceQuestions:v.reduce((n,x)=>n+x.practices.length,0)}])),
  quiz:Object.fromEntries(Object.entries(quiz).map(([k,v])=>[k,v.length]))
}));
