import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
test("Malay target option is available for English and Chinese courses, not as a self-translation",()=>{
 const html=read("index.html");
 assert.match(html,/const available=activeLearningCode!=="ms"/);
 assert.doesNotMatch(html,/translationSelect:\s*malayDictionaryTargetReady/);
 assert.doesNotMatch(html,/preferenceTranslation:\s*malayDictionaryTargetReady/);
});
test("Malay daily activity resolves structured multilingual prompts, options and explanations",()=>{
 const js=read("daily-learning.js");
 assert.match(js,/function dailyLocalizedText\(value, language=snapshot\.learningLanguage/);
 assert.match(js,/function dailyQuestionOption\(option\)/);
 assert.match(js,/dailyLocalizedText\(option,snapshot\.learningLanguage/);
 assert.match(js,/function dailyQuestionExplanation\(question\)/);
});
test("Malay lesson history review resolves the Malay lesson catalogue",()=>{
 const html=read("index.html");
 assert.match(html,/targetCourse\s*===\s*["']ms["'][\s\S]{0,100}SWIFT_MALAY_LESSONS\?\.\[difficulty\]/);
 assert.match(html,/dashboardLanguageLabel\(code\)/);
});
test("Quiz unavailable copy is generic and capability-driven",()=>{
 const html=read("index.html");
 assert.match(html,/SWIFT_LANGUAGE_REGISTRY\?\.get\(course\)/);
 assert.doesNotMatch(html,/Chinese Quiz is coming soon/);
});
