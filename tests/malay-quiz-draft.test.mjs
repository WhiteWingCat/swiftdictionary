import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
test("Malay Quiz draft banks cover both support languages without release approval",()=>{
 for(const target of ["en","zh"]){
  const pack=JSON.parse(fs.readFileSync(path.join(root,"content/quiz/questions.ms-"+target+".draft.json"),"utf8"));
  assert.equal(pack.learning_language_code,"ms");assert.equal(pack.translation_language_code,target);
  assert.equal(pack.status,"draft");assert.equal(pack.questions.length,12);
  for(const level of ["beginner","intermediate","advanced"])assert.equal(pack.questions.filter(q=>q.difficulty===level).length,4);
  for(const q of pack.questions){assert.equal(q.release_approved,false);assert.equal(q.answer_language_code,"ms");assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);assert.ok(q.options.every(o=>o.learning_text&&o.translation_text));}
 }
});
