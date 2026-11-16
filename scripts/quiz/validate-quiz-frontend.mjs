import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
const appScript = scripts.map(match => match[1]).find(source => source.includes("let supabaseClient = null"));
if (!appScript) throw new Error("Could not locate the main SwiftDictionary application script.");

new vm.Script(appScript, { filename: "index.html:inline-app-script" });

const requiredMarkup = [
  'id="quizPage"', 'id="quizSignedOut"', 'id="quizHome"', 'id="quizSession"',
  'id="quizResults"', 'id="quizDifficultyGrid"', 'id="quizHistory"',
  'id="quizQuestionArea"', 'id="quizSubmit"', 'id="quizAbandon"'
];
for (const marker of requiredMarkup) {
  if (!html.includes(marker)) throw new Error("Missing Quiz UI element: " + marker);
}

const requiredRpcs = [
  "get_my_quiz_availability", "start_my_quiz", "get_my_active_quiz",
  "save_my_quiz_answer", "submit_my_quiz", "abandon_my_quiz",
  "get_my_quiz_history", "get_my_quiz_review"
];
for (const rpc of requiredRpcs) {
  if (!appScript.includes('"' + rpc + '"')) throw new Error("Missing Quiz RPC integration: " + rpc);
}

for (const forbidden of ['.from("quiz_question_bank")', '.from("quiz_sessions")', '.from("quiz_session_questions")']) {
  if (appScript.includes(forbidden)) throw new Error("Quiz frontend must not read private tables directly: " + forbidden);
}

if (!appScript.includes("function quizRenderResult") || !appScript.includes("correct_option_id") || !appScript.includes("explanation_learning")) {
  throw new Error("Completed Quiz answer review UI is incomplete.");
}
if (!appScript.includes("function quizSaveCurrent") || !appScript.includes("function quizAbandon")) {
  throw new Error("Quiz save/resume/abandon flow is incomplete.");
}

console.log("Quiz frontend validation passed: inline JavaScript parses, required screens/RPCs exist, answer review is wired, and private Quiz tables are not queried directly.");
