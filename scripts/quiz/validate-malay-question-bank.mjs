import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const files=["content/quiz/questions.ms-en.draft.json","content/quiz/questions.ms-zh.draft.json"];
const emitSql=process.argv.includes("--emit-sql");
const approveForRelease=process.argv.includes("--approve-for-release");
const errors=[];
const map=JSON.parse(fs.readFileSync(path.join(root,"content/quiz/curriculum-map.ms.json"),"utf8"));
const packs=[];
const englishPrompt=/^(choose|which|what|where|how|why|select|complete|in the phrase|in the sentence|you arrive|someone says|you are|the claim|two websites|original:)/i;
const hasHan=value=>/[\u4e00-\u9fff]/u.test(String(value||""));

for(const relative of files){
 const pack=JSON.parse(fs.readFileSync(path.join(root,relative),"utf8"));
 const target=relative.includes("-en.")?"en":"zh";
 if(pack.schema_version!==1||pack.status!=="draft"||pack.editorial_status!=="draft")errors.push(relative+": source pack must remain editorially draft");
 if(pack.learning_language_code!=="ms"||pack.translation_language_code!==target)errors.push(relative+": invalid language pair");
 if(pack.questions?.length!==120)errors.push(relative+": expected 120 cumulative questions");
 if(approveForRelease&&pack.staging_release?.status!=="owner_authorized_staging_only")errors.push(relative+": staging release authorization metadata is missing");
 const seen=new Set(),prompts=new Set();
 const counts={beginner:0,intermediate:0,advanced:0};
 const batches=[
  {begin:1,end:12,counts:{beginner:4,intermediate:4,advanced:4}},
  {begin:13,end:48,counts:{beginner:12,intermediate:12,advanced:12}},
  {begin:49,end:84,counts:{beginner:10,intermediate:10,advanced:16}},
  {begin:85,end:120,counts:{beginner:10,intermediate:10,advanced:16}}
 ];
 const batchCounts=batches.map(()=>({beginner:0,intermediate:0,advanced:0}));
 for(const [i,q] of (pack.questions||[]).entries()){
  const at=relative+" questions["+i+"]";
  for(const key of ["question_id","source_lesson_id","topic_id","difficulty","prompt_learning","prompt_translation","explanation_learning","explanation_translation","learning_objective_id"])if(typeof q[key]!=="string"||!q[key].trim())errors.push(at+": missing "+key);
  if(seen.has(q.question_id))errors.push(at+": duplicate question ID");
  seen.add(q.question_id);
  if(q.learning_language_code!=="ms"||q.translation_language_code!==target||q.answer_language_code!=="ms")errors.push(at+": inconsistent language metadata");
  if(q.question_type!=="knowledge")errors.push(at+": Malay batch currently supports knowledge questions only");
  if(typeof q.release_approved!=="boolean")errors.push(at+": release_approved must be an explicit boolean");
  if(approveForRelease&&q.release_approved!==true)errors.push(at+": staging release export requires release_approved=true");
  if(englishPrompt.test(q.prompt_learning)||hasHan(q.prompt_learning))errors.push(at+": learning prompt must be in Malay");
  if(!["beginner","intermediate","advanced"].includes(q.difficulty))errors.push(at+": invalid difficulty");
  else{
   counts[q.difficulty]++;
   const n=Number(q.question_id.slice(-3));
   const batchIndex=batches.findIndex(b=>n>=b.begin&&n<=b.end);
   if(batchIndex<0)errors.push(at+": question ID is outside batch 01/04 numbering");
   else batchCounts[batchIndex][q.difficulty]++;
  }
  const lesson=map[q.source_lesson_id];
  if(!lesson)errors.push(at+": unmapped source lesson "+q.source_lesson_id);
  else{
   if(lesson.topic_id!==q.topic_id||lesson.difficulty!==q.difficulty)errors.push(at+": source lesson topic/difficulty mismatch");
   if(!lesson.objectives?.some(o=>o.id===q.learning_objective_id))errors.push(at+": objective is not mapped to source lesson");
  }
  if(!Array.isArray(q.options)||q.options.length!==4){errors.push(at+": exactly four options required");continue;}
  const ids=q.options.map(o=>o.id);
  const labels=q.options.map(o=>o.learning_text.trim().toLocaleLowerCase("ms"));
  const translations=q.options.map(o=>o.translation_text.trim().toLocaleLowerCase(target));
  if(new Set(ids).size!==4||!ids.includes(q.correct_option_id))errors.push(at+": correct option must identify one unique choice");
  if(new Set(labels).size!==4)errors.push(at+": Malay options must be unique");
  if(new Set(translations).size!==4)errors.push(at+": translated options must be unique");
  for(const option of q.options){
   if(!option.learning_text?.trim()||!option.translation_text?.trim())errors.push(at+": incomplete bilingual option");
   if(option.learning_text.trim().toLocaleLowerCase("ms")===option.translation_text.trim().toLocaleLowerCase(target))errors.push(at+": answer text is duplicated into the support-language field");
  }
  const normalized=q.prompt_learning.toLocaleLowerCase("ms").replace(/[^\p{L}\p{N}]+/gu," ").trim();
  if(prompts.has(normalized))errors.push(at+": duplicate Malay prompt");
  prompts.add(normalized);
  if(target==="zh"&&(!hasHan(q.prompt_translation)||!hasHan(q.explanation_translation)))errors.push(at+": Chinese support prompt/explanation is missing");
 }
 if(JSON.stringify(counts)!==JSON.stringify({beginner:36,intermediate:36,advanced:48}))errors.push(relative+": expected cumulative counts 36 Beginner, 36 Intermediate, 48 Advanced");
 batches.forEach((b,i)=>{if(JSON.stringify(batchCounts[i])!==JSON.stringify(b.counts))errors.push(relative+": batch "+(i+1)+" difficulty distribution is incorrect");});
 packs.push(pack);
}
if(packs.length===2){
 const enById=new Map(packs[0].questions.map(q=>[q.question_id,q]));
 for(const q of packs[1].questions){
  const sourceId=q.question_id.replace("quiz-ms-zh-","quiz-ms-en-");
  const en=enById.get(sourceId);
  if(!en){errors.push(q.question_id+": matching English support pack record is missing");continue;}
  if(q.prompt_learning!==en.prompt_learning||q.explanation_learning!==en.explanation_learning||q.correct_option_id!==en.correct_option_id)errors.push(q.question_id+": Malay prompt/explanation/answer key differs between support packs");
  if(JSON.stringify(q.options.map(o=>o.learning_text))!==JSON.stringify(en.options.map(o=>o.learning_text)))errors.push(q.question_id+": Malay answer choices differ between support packs");
 }
}
if(errors.length){console.error(errors.join(String.fromCharCode(10)));process.exit(1);}
const summary="Malay Quiz validated: 120 questions per support language; 240 records total; 36 Beginner, 36 Intermediate and 48 Advanced per pair; source packs remain editorially draft.";
if(emitSql)console.error(summary);else console.log(summary);

if(emitSql){
 const quote=value=>"'"+String(value).replace(/'/g,"''")+"'";
 const rows=[];
 for(const pack of packs)for(const q of pack.questions){
  rows.push("("+[
   q.question_id,1,"ms",q.translation_language_code,q.source_lesson_id,q.topic_id,q.difficulty,
   q.prompt_learning,q.prompt_translation,JSON.stringify(q.options),q.correct_option_id,
   q.explanation_learning,q.explanation_translation,approveForRelease?"approved":"draft",
   "knowledge","ms",q.learning_objective_id,approveForRelease?"pg_catalog.now()":"null"
  ].map((value,i)=>i===9?quote(value)+"::jsonb":i===17?value:quote(value)).join(",")+")");
 }
 const nl=String.fromCharCode(10);
 const sql=[
  approveForRelease?"-- Owner-authorized STAGING-ONLY release. Never apply this SQL to production.":"-- Draft-only Malay Quiz content. Never marks records approved.",
  "begin;",
  "insert into private.quiz_question_bank(",
  " question_id,revision,learning_language_code,translation_language_code,",
  " source_lesson_id,topic_id,difficulty,prompt_learning,prompt_translation,options,",
  " correct_option_id,explanation_learning,explanation_translation,status,question_type,",
  " answer_language_code,learning_objective_id,approved_at",
  ") values",
  rows.join(","+nl),
  "on conflict(question_id,revision) do nothing;",
  approveForRelease?"do $assert_malay_quiz_release$ declare v_count integer; begin select count(*) into v_count from private.quiz_question_bank where question_id like 'quiz-ms-%' and status='approved'; if v_count<>240 then raise exception 'Expected 240 approved Malay staging questions, got %',v_count; end if; end; $assert_malay_quiz_release$;":"",
  "commit;"
 ].filter(Boolean).join(nl);
 console.log(sql);
}
