import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const files=["content/quiz/questions.ms-en.draft.json","content/quiz/questions.ms-zh.draft.json"];
const errors=[];
for(const relative of files){
 const pack=JSON.parse(fs.readFileSync(path.join(root,relative),"utf8"));
 const target=relative.includes("-en.")?"en":"zh";
 if(pack.schema_version!==1||pack.status!=="draft"||pack.editorial_status!=="draft")errors.push(relative+": pack must remain draft");
 if(pack.learning_language_code!=="ms"||pack.translation_language_code!==target)errors.push(relative+": invalid language pair");
 const seen=new Set();
 const counts={beginner:0,intermediate:0,advanced:0};
 for(const [i,q] of (pack.questions||[]).entries()){
  const at=relative+" questions["+i+"]";
  for(const key of ["question_id","source_lesson_id","topic_id","difficulty","prompt_learning","prompt_translation","explanation_learning","explanation_translation","learning_objective_id"])if(typeof q[key]!=="string"||!q[key].trim())errors.push(at+": missing "+key);
  if(seen.has(q.question_id))errors.push(at+": duplicate question ID");
  seen.add(q.question_id);
  if(q.learning_language_code!=="ms"||q.translation_language_code!==target||q.answer_language_code!=="ms")errors.push(at+": inconsistent language metadata");
  if(q.release_approved!==false)errors.push(at+": draft question must not be release-approved");
  if(!["beginner","intermediate","advanced"].includes(q.difficulty))errors.push(at+": invalid difficulty");else counts[q.difficulty]++;
  if(!Array.isArray(q.options)||q.options.length!==4){errors.push(at+": exactly four options required");continue;}
  const optionIds=q.options.map(o=>o.id),labels=q.options.map(o=>o.learning_text.trim().toLocaleLowerCase("ms"));
  if(new Set(optionIds).size!==4||!optionIds.includes(q.correct_option_id))errors.push(at+": correct option must identify one unique choice");
  if(new Set(labels).size!==4)errors.push(at+": Malay options must be unique");
  for(const option of q.options)if(!option.learning_text?.trim()||!option.translation_text?.trim())errors.push(at+": incomplete bilingual option");
 }
 if(pack.questions?.length!==48||Object.values(counts).some(n=>n!==16))errors.push(relative+": expected 48 cumulative questions, 16 per difficulty");
 const batchTwo=pack.questions.filter(q=>Number(q.question_id.slice(-3))>=13&&Number(q.question_id.slice(-3))<=48);
 const batchTwoCounts={beginner:0,intermediate:0,advanced:0};
 for(const q of batchTwo)if(batchTwoCounts[q.difficulty]!==undefined)batchTwoCounts[q.difficulty]++;
 if(batchTwo.length!==36||Object.values(batchTwoCounts).some(n=>n!==12))errors.push(relative+": batch 02 must contain 36 questions, 12 per difficulty");
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Malay Quiz draft batch 01 validated: 48 cumulative questions per support language; batch 02 adds 36, 12 per difficulty; all remain draft.");
