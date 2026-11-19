import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync("index.html","utf8");
const flashcards=fs.readFileSync("flashcards.js","utf8");
const mock=fs.readFileSync("mock-testing.js","utf8");
const migration=fs.readFileSync("supabase/migrations/20261118090000_swiftdictionary_update_2_5_0_flashcards_foundation.sql","utf8");
const recallMigration=fs.readFileSync("supabase/migrations/20261118143000_flashcards_mixed_recall_and_review_history.sql","utf8");
const deletionMigration=fs.readFileSync("supabase/migrations/20261118150000_flashcards_review_history_deletion.sql","utf8");

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
  ["const REDUCTION_STEP = 0.2","Fixed 0.2-second timing reduction"],
  ["word:{beginner:{memory:5,answer:12,memoryFloor:3,answerFloor:9}","Word Recall Beginner schedule"],
  ["word:{beginner:{memory:5,answer:12,memoryFloor:3,answerFloor:9},intermediate:{memory:5,answer:10,memoryFloor:2,answerFloor:7},advanced:{memory:3,answer:9,memoryFloor:1,answerFloor:5}","Word Recall schedules"],
  ["definition:{beginner:{memory:6,answer:5,memoryFloor:4,answerFloor:3}","Definition Recall schedules"],
  ["sentence:{beginner:{memory:7,answer:10,memoryFloor:5,answerFloor:7}","Sentence Recall schedules"],
  ["mixed:{beginner:{memory:8,answer:12,memoryFloor:6,answerFloor:9}","Mixed Recall schedules"],
  ["flash-game-clock.is-warning","20-second orange timer warning"],
  ["flash-game-clock.is-danger","10-second red timer warning"],
  ["flash-review-modal","Expanded, fixed-size weak-memory review"],
  ["flash-review-tab[data-value=word]","Recall-coloured weak-memory navigation"],
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
if(!recallMigration.includes("private.flashcard_review_items")||!recallMigration.includes("'mixed'")||!recallMigration.includes("review_items"))throw new Error("Mixed Recall review-history migration is incomplete.");
if(!deletionMigration.includes("delete from private.flashcard_review_items where user_id=v_user"))throw new Error("Learning-history deletion does not include weak-memory records.");
console.log("Flashcards page checks passed; syntax-checked "+inlineCount+" inline application script(s).");
