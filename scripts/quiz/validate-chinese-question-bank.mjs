import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const pack=JSON.parse(fs.readFileSync(path.join(root,"content/quiz/questions.zh-zh.draft.json"),"utf8"));
const map=JSON.parse(fs.readFileSync(path.join(root,"content/quiz/curriculum-map.zh.json"),"utf8"));
const errors=[];\nconst emitSql=process.argv.includes("--emit-sql");\nconst approve=process.argv.includes("--approve-for-release");\nif(approve&&!emitSql){console.error("--approve-for-release requires --emit-sql");process.exit(1);}
const ids=new Set(),prompts=new Set();
const counts={beginner:0,intermediate:0,advanced:0};
const topics={beginner:new Set(),intermediate:new Set(),advanced:new Set()};
const norm=s=>String(s??"").normalize("NFKC").toLocaleLowerCase("zh").replace(/[\s\p{P}\p{S}]+/gu,"");
if(pack.schema_version!==1||pack.status!=="draft"||pack.learning_language_code!=="zh"||pack.translation_language_code!=="en")errors.push("Pack metadata must remain a Chinese-learning, Chinese-focused draft.");
if(!Array.isArray(pack.questions))errors.push("questions must be an array.");
for(const [i,q] of (pack.questions||[]).entries()){
 const at="questions["+i+"]";
 if(!q.question_id||ids.has(q.question_id))errors.push(at+" has a missing or duplicate question_id");ids.add(q.question_id);
 const lesson=map.lessons?.[q.source_lesson_id];
 if(!lesson)errors.push(at+" has no approved Chinese lesson mapping");
 else{
  counts[lesson.difficulty]++;topics[lesson.difficulty].add(lesson.topic_id);
  if(!lesson.objectives?.some(o=>o.id===q.learning_objective_id))errors.push(at+" has an invalid learning objective");
 }
 for(const key of ["prompt_learning","prompt_pinyin","prompt_translation","explanation_learning","explanation_pinyin","explanation_translation"]){
  if(typeof q[key]!=="string"||!q[key].trim())errors.push(at+" is missing "+key);
 }
 if(q.question_type!=="knowledge"||q.answer_language_code!=="zh")errors.push(at+" must be a Chinese-answer knowledge question");
 if(!Array.isArray(q.options)||q.options.length!==4)errors.push(at+" must have exactly four options");
 else{
  const optionIds=new Set(),labels=new Set();
  for(const [j,o] of q.options.entries()){
   if(!o.id||optionIds.has(o.id))errors.push(at+" has duplicate option IDs");optionIds.add(o.id);
   for(const k of ["learning_text","translation_text","pinyin"])if(typeof o[k]!=="string"||!o[k].trim())errors.push(at+" option "+j+" is missing "+k);
   const n=norm(o.learning_text);if(labels.has(n))errors.push(at+" has duplicate Chinese option text");labels.add(n);
  }
  if(optionIds.size!==4||!optionIds.has(q.correct_option_id))errors.push(at+" correct_option_id must match one of four unique options");
 }
 const p=norm(q.prompt_learning);if(prompts.has(p))errors.push(at+" duplicates a Chinese prompt");prompts.add(p);
}
for(const [d,min] of Object.entries({beginner:30,intermediate:36,advanced:48})){
 if(counts[d]<min)errors.push(d+" has "+counts[d]+" questions; at least "+min+" required");
 if(topics[d].size<3)errors.push(d+" needs at least three mapped topics");
}
if(errors.length){console.error("Chinese Quiz draft validation failed:");for(const e of errors)console.error(" - "+e);process.exit(1);}
console.log("Chinese Quiz draft validation passed: "+pack.questions.length+" questions.");
for(const d of Object.keys(counts))console.log(d+": "+counts[d]+" questions across "+topics[d].size+" topics.");
console.log("Draft status remains non-releasable until independent linguistic, answer-key, distractor, and objective QA is signed off.");
if(emitSql){
 if(approve){console.error("Refusing to approve Chinese Quiz content automatically. Human owner approval and independent QA must be recorded separately.");process.exit(1);}
 const lit=v=>"'"+String(v).replace(/'/g,"''")+"'";
 const json=v=>lit(JSON.stringify(v))+"::jsonb";
 const rows=pack.questions.map(q=>{
  const lesson=map.lessons[q.source_lesson_id];
  return "("+[
   lit(q.question_id),"1",lit("zh"),lit("en"),lit(q.source_lesson_id),lit(lesson.topic_id),
   lit(lesson.difficulty),lit(q.question_type),lit(q.answer_language_code),lit(q.learning_objective_id),
   lit(q.prompt_learning),lit(q.prompt_translation),json(q.options),lit(q.correct_option_id),
   lit(q.explanation_learning),lit(q.explanation_translation),lit("draft"),"null"
  ].join(", ")+")";
 });
 const sql=["-- U2.8.0 Chinese Quiz draft import. Never changes status to approved.",
 "begin;","insert into private.quiz_question_bank (",
 "question_id,revision,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,question_type,answer_language_code,learning_objective_id,prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,status,approved_at",
 ") values",rows.join(",\n"),";","commit;"].join("\n");
 process.stdout.write(sql+"\n");
}
