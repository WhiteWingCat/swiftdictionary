import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync("index.html","utf8");
const flashcards=fs.readFileSync("flashcards.js","utf8");
const mock=fs.readFileSync("mock-testing.js","utf8");
const migration=fs.readFileSync("supabase/migrations/20261118090000_swiftdictionary_update_2_5_0_flashcards_foundation.sql","utf8");
const recallMigration=fs.readFileSync("supabase/migrations/20261118143000_flashcards_mixed_recall_and_review_history.sql","utf8");
const deletionMigration=fs.readFileSync("supabase/migrations/20261118150000_flashcards_review_history_deletion.sql","utf8");
const durationMigration=fs.readFileSync("supabase/migrations/20261119130000_flashcards_60_120_second_challenges.sql","utf8");

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
  ["state.usedQuestionKeys","No repeated question targets within a challenge"],
  ["if(!freshPools.length)return null","Stop presenting questions instead of repeating when the selected deck is exhausted"],
  ["durationSeconds","Configurable game duration"],
  ["flash-times-up-text","Animated Time's Up transition"],
  ["setTimeout(()=>saveGameResults(),2000)","Two-second end-of-game transition"],
  ["flash-duration-pill","60/120-second challenge pills beside the Flash Recall heading"],
  ["roundRecorded","Pending questions are recorded as weak memory when the challenge ends"],
  ["function uiText(en,zh)","English/Simplified Chinese Flashcards interface translation"],
  ["translationHint:mode===\"sentence\"","Chinese meaning support for Sentence Recall"],
  ["translationFor(target)","Chinese translation in Word and Definition Recall"],
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
for(const [needle,label] of [
  ['data-dashboard-flashcard-review',"Dashboard Weak Memory entry point"],
  ['rpc("get_my_flashcard_data")',"Dashboard Flashcard statistics source"],
  ['dashboardFlashcardAccuracy',"Dashboard Flashcard accuracy statistic"],
  ['learning-banner',"Shared Lessons/Quiz banner style"],
  ['class="nav-icon"',"Icon-based main navigation"],
  ['id="dictionaryFiltersPanel"',"Inline Dictionary filter panel"],
  ['aria-controls="dictionaryFiltersPanel"',"Dictionary Filters toggle and panel relationship"]
])if(!html.includes(needle))throw new Error("Missing "+label+".");
if(flashcards.includes("id=\"flashChallengeDuration\""))throw new Error("Challenge duration must be selected beside the Flash Recall heading, not inside setup.");
if(!flashcards.includes("allowance.used_count")||!flashcards.includes("allowance.remaining"))throw new Error("Flashcards daily allowance display is missing.");
if(!migration.includes("delete from private.quiz_sessions where user_id=v_user")||!migration.includes("private.current_learning_allowance_usage(v_user,'flashcard',v_timezone)")||!migration.includes("public.get_my_flashcard_allowance()")||!migration.includes("delete from private.flashcard_mastery where user_id=v_user"))throw new Error("Server allowance or learning-history deletion integration is missing.");
if(!recallMigration.includes("private.flashcard_review_items")||!recallMigration.includes("'mixed'")||!recallMigration.includes("review_items"))throw new Error("Mixed Recall review-history migration is incomplete.");
if(!deletionMigration.includes("delete from private.flashcard_review_items where user_id=v_user"))throw new Error("Learning-history deletion does not include weak-memory records.");
if(!durationMigration.includes("duration_seconds in (60,120)")||!durationMigration.includes("p_duration_seconds")||!durationMigration.includes("v_session.duration_seconds"))throw new Error("Server-side 60/120-second challenge validation is incomplete.");
if(!flashcards.includes('data-action="phase-action"')||!flashcards.includes('uiText("Answer now","立即作答")')||!flashcards.includes('uiText("Next","下一题")'))throw new Error("Early-answer and next-round controls are missing.");
if(!flashcards.includes("function questionKey(card)")||!flashcards.includes("usedQuestionKeys.has(questionKey(item))")||!flashcards.includes("seenCards.has(key)"))throw new Error("Flash Recall must deduplicate normalized question prompts across card types and modes.");
for(const id of ["b-greetings-polite-expressions","b-places-getting-around"])if(!html.includes('id:"'+id+'"'))throw new Error("Missing permanent lesson for expanded Flash Recall vocabulary: "+id);
for(const word of ["thanks","excuse me","good morning","good afternoon","good evening","take care","station","market","library","hospital","restaurant","museum","entrance","exit","corner","bridge","ticket","platform"])if(!html.includes('"word": "'+word+'"'))throw new Error("Missing expanded lesson-linked Flash Recall vocabulary: "+word);
if(!html.includes("60-second or 120-second challenge")||!html.includes("Mixed Recall combines word, definition and sentence prompts"))throw new Error("Flashcards introduction still contains outdated challenge or mode information.");
if(!html.includes('translationLanguage==="zh"&&chineseIntroCopy[page]'))throw new Error("Simplified Chinese Quiz/Flashcards introductions are missing.");
console.log("Flashcards page checks passed; syntax-checked "+inlineCount+" inline application script(s).");
