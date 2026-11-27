import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const files=["content/quiz/questions.ms-en.draft.json","content/quiz/questions.ms-zh.draft.json"];
const emitSql=process.argv.includes("--emit-sql");
const errors=[];
const map=JSON.parse(fs.readFileSync(path.join(root,"content/quiz/curriculum-map.ms.json"),"utf8"));
const packs=[];
for(const relative of files){
 const pack=JSON.parse(fs.readFileSync(path.join(root,relative),"utf8"));
 const target=relative.includes("-en.")?"en":"zh";
 if(pack.schema_version!==1||pack.status!=="draft"||pack.editorial_status!=="draft")errors.push(relative+": pack must remain draft");
 if(pack.learning_language_code!=="ms"||pack.translation_language_code!==target)errors.push(relative+": invalid language pair");
 if(pack.questions?.length!==48)errors.push(relative+": expected 48 cumulative questions");
 const seen=new Set(),prompts=new Set();
 const counts={beginner:0,intermediate:0,advanced:0};
 const batchTwo={beginner:0,intermediate:0,advanced:0};
 for(const [i,q] of (pack.questions||[]).entries()){
  const at=relative+" questions["+i+"]";
  for(const key of ["question_id","source_lesson_id","topic_id","difficulty","prompt_learning","prompt_translation","explanation_learning","explanation_translation","learning_objective_id"])if(typeof q[key]!=="string"||!q[key].trim())errors.push(at+": missing "+key);
  if(seen.has(q.question_id))errors.push(at+": duplicate question ID");
  seen.add(q.question_id);
  if(q.learning_language_code!=="ms"||q.translation_language_code!==target||q.answer_language_code!=="ms")errors.push(at+": inconsistent language metadata");
  if(q.question_type!=="knowledge")errors.push(at+": Malay batch currently supports knowledge questions only");
  if(q.release_approved!==false)errors.push(at+": draft question must not be release-approved");
  if(!["beginner","intermediate","advanced"].includes(q.difficulty))errors.push(at+": invalid difficulty");
  else {
   counts[q.difficulty]++;
   const n=Number(q.question_id.slice(-3));
   if(n>=13&&n<=48)batchTwo[q.difficulty]++;
   else if(n<1||n>12)errors.push(at+": question ID is outside batch 01/02 numbering");
  }
  const lesson=map[q.source_lesson_id];
  if(!lesson)errors.push(at+": unmapped source lesson "+q.source_lesson_id);
  else {
   if(lesson.topic_id!==q.topic_id||lesson.difficulty!==q.difficulty)errors.push(at+": source lesson topic/difficulty mismatch");
   if(!lesson.objectives?.some(o=>o.id===q.learning_objective_id))errors.push(at+": objective is not mapped to source lesson");
  }
  if(!Array.isArray(q.options)||q.options.length!==4){errors.push(at+": exactly four options required");continue;}
  const ids=q.options.map(o=>o.id),labels=q.options.map(o=>o.learning_text.trim().toLocaleLowerCase("ms")),translations=q.options.map(o=>o.translation_text.trim().toLocaleLowerCase(target));
  if(new Set(ids).size!==4||!ids.includes(q.correct_option_id))errors.push(at+": correct option must identify one unique choice");
  if(new Set(labels).size!==4)errors.push(at+": Malay options must be unique");
  if(new Set(translations).size!==4)errors.push(at+": translated options must be unique");
  for(const option of q.options)if(!option.learning_text?.trim()||!option.translation_text?.trim())errors.push(at+": incomplete bilingual option");
  const normalized=q.prompt_learning.toLocaleLowerCase("ms").replace(/[^\p{L}\p{N}]+/gu," ").trim();
  if(prompts.has(normalized))errors.push(at+": duplicate Malay prompt");
  prompts.add(normalized);
 }
 if(Object.values(counts).some(n=>n!==16))errors.push(relative+": expected 16 cumulative questions per difficulty");
 if(Object.values(batchTwo).some(n=>n!==12))errors.push(relative+": batch 02 must contain 36 questions, 12 per difficulty");
 packs.push(pack);
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Malay Quiz draft validated: 48 questions per support language; batch 02 adds 36 (12 per difficulty); all remain draft.");

if(emitSql){
 const quote=value=>"'"+String(value).replace(/'/g,"''")+"'";
 const rows=[];
 for(const pack of packs)for(const q of pack.questions){
  rows.push("("+
   [q.question_id,1,"ms",q.translation_language_code,q.source_lesson_id,q.topic_id,q.difficulty,
    q.prompt_learning,q.prompt_translation,JSON.stringify(q.options),q.correct_option_id,
    q.explanation_learning,q.explanation_translation,"draft", "knowledge","ms",q.learning_objective_id]
    .map((v,i)=>i===9?quote(v)+"::jsonb":quote(v)).join(",")+
   ")");
 }
 console.log("\n-- Draft-only Malay Quiz content. Never marks records approved.\n"+
 `insert into private.quiz_question_bank(\n question_id,revision,learning_language_code,translation_language_code,\n source_lesson_id,topic_id,difficulty,prompt_learning,prompt_translation,options,\n correct_option_id,explanation_learning,explanation_translation,status,question_type,\n answer_language_code,learning_objective_id\n) values\n`+
 rows.join(",\n")+ "\non conflict(question_id,revision) do nothing;\n");
}
