import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
test("Malay Dictionary target option is available independent of the learning course",()=>{
 const html=read("index.html");
 assert.match(html,/translationSelect:\s*malayDictionaryTargetReady/);
 assert.match(html,/preferenceTranslation:\s*malayDictionaryTargetReady/);
 assert.doesNotMatch(html,/translationSelect:\s*malayDictionaryTargetReady\s*&&\s*course\s*!==\s*["']ms/);
});
test("Malay daily activity renders structured Malay, English and Chinese options",()=>{
 const js=read("daily-learning.js");
 assert.match(js,/if\s*\(isMalayLearningCourse\(\)\)/);
 assert.match(js,/option\.ms\s*\|\|\s*option\.text/);
 assert.match(js,/translationLanguage\s*===\s*["']zh["']\s*\?\s*option\.zh/);
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
