import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

function load(path){
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path,"utf8"),context);
 return context.window;
}

test("Every English and Simplified Chinese permanent lesson has a Malay title, summary and explanation",()=>{
 const english=load("data/languages/english-lessons.js").SWIFT_ENGLISH_LESSONS;
 const chinese=load("data/chinese-lessons.js").SWIFT_CHINESE_LESSONS;
 const translations=load("data/languages/malay-lesson-translations.js").SWIFT_LESSON_TRANSLATIONS_MS;
 for(const [language,source] of [["en",english],["zh",chinese]]){
  for(const lessons of Object.values(source)){
   for(const lesson of lessons){
    const translated=translations[language]?.[lesson.id];
    assert.ok(translated,language+":"+lesson.id+" is missing a Malay translation record");
    for(const field of ["topic","title","summary","explanation"]){
     assert.ok(translated[field],language+":"+lesson.id+"."+field+" is missing");
     assert.equal(typeof translated[field],"string",language+":"+lesson.id+"."+field+" must be a string");
    }
   }
  }
 }
});

test("Lesson renderer selects Malay translations for English and Chinese learning courses",()=>{
 const html=fs.readFileSync("index.html","utf8");
 assert.match(html,/const lessonMs=window\.SWIFT_LESSON_TRANSLATIONS_MS/);
 assert.match(html,/if\(isChineseCourse\(\)&&ms&&ms\[key\]!==undefined\)return ms\[key\]/);
 assert.match(html,/function lessonTopicText\(x\)/);
 assert.match(html,/lessonMsTextLookup\.get\(value\.zh\)/);
});
