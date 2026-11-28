import test from "node:test";
import assert from "node:assert/strict";
import { normaliseComparableText, validateLanguagePair, validateQuestionEnvelope, SUPPORTED_QUESTION_TYPES } from "../scripts/content/validation-core.mjs";

test("shared normalisation respects locale while removing punctuation",()=>{
 assert.equal(normaliseComparableText("Hello, WORLD!","en"),"helloworld");
 assert.equal(normaliseComparableText(" 学 习！ ","zh"),"学习");
});
test("language-pair validation is generic and rejects mismatched packs",()=>{
 assert.deepEqual(validateLanguagePair({learning_language_code:"en",translation_language_code:"zh"},"en","zh"),[]);
 assert.equal(validateLanguagePair({learning_language_code:"zh",translation_language_code:"en"},"en","zh").length,1);
});
test("shared question envelope reserves one-blank text answers for U3.1",()=>{
 const q={question_id:"en.lesson.one",question_type:"fill_blank",answer_mode:"text",blank_count:1,accepted_answers:["went","had gone"]};
 assert.deepEqual(validateQuestionEnvelope(q),[]);
 assert.ok(validateQuestionEnvelope({...q,blank_count:2}).length);
 assert.ok(SUPPORTED_QUESTION_TYPES.includes("fill_blank"));
});
test("existing multiple-choice question envelope remains four-option",()=>{
 assert.deepEqual(validateQuestionEnvelope({question_id:"en.q.1",answer_mode:"choice",options:[1,2,3,4]}),[]);
 assert.ok(validateQuestionEnvelope({question_id:"en.q.1",answer_mode:"choice",options:[1,2,3]}).length);
});
