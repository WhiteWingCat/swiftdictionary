import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const curriculum=JSON.parse(fs.readFileSync(path.join(root,"content/quiz/curriculum-map.ms.json"),"utf8"));

test("Malay Quiz draft banks cover both support languages and the 36-question second batch",()=>{
 for(const target of ["en","zh"]){
  const pack=JSON.parse(fs.readFileSync(path.join(root,"content/quiz/questions.ms-"+target+".draft.json"),"utf8"));
  assert.equal(pack.learning_language_code,"ms");
  assert.equal(pack.translation_language_code,target);
  assert.equal(pack.status,"draft");
  assert.equal(pack.questions.length,48);
  const ids=new Set();
  for(const level of ["beginner","intermediate","advanced"]){
   assert.equal(pack.questions.filter(q=>q.difficulty===level).length,16);
   assert.equal(pack.questions.filter(q=>q.difficulty===level&&Number(q.question_id.slice(-3))>=13).length,12);
  }
  for(const q of pack.questions){
   assert.equal(ids.has(q.question_id),false);ids.add(q.question_id);
   assert.equal(q.release_approved,false);
   assert.equal(q.answer_language_code,"ms");
   assert.equal(q.question_type,"knowledge");
   assert.equal(q.options.length,4);
   assert.equal(new Set(q.options.map(o=>o.id)).size,4);
   assert.equal(new Set(q.options.map(o=>o.learning_text.toLocaleLowerCase("ms"))).size,4);
   assert.equal(new Set(q.options.map(o=>o.translation_text.toLocaleLowerCase(target))).size,4);
   assert.ok(q.options.every(o=>o.learning_text&&o.translation_text));
   const lesson=curriculum[q.source_lesson_id];
   assert.ok(lesson,"missing curriculum mapping for "+q.question_id);
   assert.equal(lesson.topic_id,q.topic_id);
   assert.equal(lesson.difficulty,q.difficulty);
   assert.ok(lesson.objectives.some(o=>o.id===q.learning_objective_id));
  }
 }
});

test("Malay Quiz runtime migration keeps answers private and reuses authenticated session RPCs",()=>{
 const sql=fs.readFileSync(path.join(root,"supabase/migrations/20261127130000_swiftdictionary_update_3_0_malay_quiz_runtime.sql"),"utf8");
 assert.match(sql,/private\.get_my_malay_quiz_availability_impl/);
 assert.match(sql,/private\.start_my_malay_quiz_impl/);
 assert.match(sql,/security definer[\s\S]*?set search_path = ''/);
 assert.match(sql,/auth\.uid\(\)/);
 assert.match(sql,/pg_advisory_xact_lock/);
 assert.match(sql,/quiz_daily_question_reservations/);
 assert.match(sql,/insert into public\\.learning_activity_log[\\s\\S]*?values\\(v_user,'quiz','ms','started'\\)/);
 assert.match(sql,/private\.quiz_session_payload\(v_session,false\)/);
 assert.match(sql,/quiz_question_bank_answer_language_code_check[\s\S]*?ms/);
 assert.match(sql,/quiz_session_questions_learning_language_code_snapshot_check[\s\S]*?ms/);
 assert.match(sql,/quiz_session_questions_answer_language_code_snapshot_check[\s\S]*?ms/);
 assert.match(sql,/public\.get_my_quiz_availability/);
 assert.match(sql,/public\.start_my_quiz/);
 assert.match(sql,/revoke all on function private\.start_my_malay_quiz_impl/);
 assert.match(sql,/grant execute on function private\.start_my_malay_quiz_impl[\s\S]*?to authenticated/);
});

