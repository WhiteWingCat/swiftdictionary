import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync("index.html","utf8");
const flashcards=fs.readFileSync("flashcards.js","utf8");
const mock=fs.readFileSync("mock-testing.js","utf8");
const migration=fs.readFileSync("supabase/migrations/20261118090000_swiftdictionary_update_2_5_0_flashcards_foundation.sql","utf8");

let inlineCount=0;
for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  const attrs=match[1]||"",body=match[2]||"";
  if(/\bsrc\s*=/.test(attrs)||!body.trim())continue;
  if(/type\s*=\s*["']application\//i.test(attrs))continue;
  new vm.Script(body,{filename:"index.html inline script"});
  inlineCount++;
}
new vm.Script(flashcards,{filename:"flashcards.js"});
new vm.Script(mock,{filename:"mock-testing.js"});
if(inlineCount<1)throw new Error("No inline application script was syntax-checked.");
if(!/<script[^>]+src=["']flashcards\.js["']/.test(html))throw new Error("Flashcards runtime is not loaded by index.html.");
if(!/id=["']flashcardsApp["']/.test(html))throw new Error("Flashcards page mount is missing.");
if(/Flashcards are being prepared|Flashcards will become available/.test(html))throw new Error("Outdated Coming Soon copy remains.");
for(const mode of ["word","definition","mixed","sentence"])if(!flashcards.includes('"'+mode+'"'))throw new Error("Missing Flash Recall mode: "+mode);
for(const [needle,label] of [
  ["memoryFloor:2,answerFloor:5","Beginner timer floors"],
  ["memoryFloor:1.5,answerFloor:4","Intermediate timer floors"],
  ["memoryFloor:.7,answerFloor:3","Advanced timer floors"],
  ["60000","60-second game duration"],
  ["Your game results","End-of-game results prompt"],
  ["setTimeout(showMemory,3000)","Three-second answer feedback"],
  ["flashMemoryGauge","Memory gauge"],
  ["flashAnswerGauge","Answer gauge"],
  ["open-review","Weak Memory review"],
  ["reorder-up","Collection ordering"],
  ["custom","Custom card support"]
])if(!flashcards.includes(needle))throw new Error("Missing "+label+".");
if(!mock.includes('name==="start_my_flashcard_game"')||!mock.includes('name==="complete_my_flashcard_game"'))throw new Error("Mock User Flashcard game RPC support is missing.");
if(!html.includes('flashcard:"Flashcards"')||!html.includes('rpc("get_my_flashcard_allowance")')||!html.includes('rpc("get_my_quiz_availability")'))throw new Error("Profile progress/allowance integration is missing.");
if(!flashcards.includes("allowance.used_count")||!flashcards.includes("allowance.remaining"))throw new Error("Flashcards daily allowance display is missing.");
if(!migration.includes("delete from private.quiz_sessions where user_id=v_user")||!migration.includes("private.current_learning_allowance_usage(v_user,'flashcard',v_timezone)")||!migration.includes("public.get_my_flashcard_allowance()")||!migration.includes("delete from private.flashcard_mastery where user_id=v_user"))throw new Error("Server allowance or learning-history deletion integration is missing.");
console.log("Flashcards page checks passed; syntax-checked "+inlineCount+" inline application script(s).");
