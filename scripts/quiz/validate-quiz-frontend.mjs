import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const mockTesting = fs.readFileSync(new URL("../../mock-testing.js", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
const appScript = scripts.map(match => match[1]).find(source => source.includes("let supabaseClient = null"));
if (!appScript) throw new Error("Could not locate the main SwiftDictionary application script.");

new vm.Script(appScript, { filename: "index.html:inline-app-script" });

const requiredMarkup = [
  'id="quizPage"', 'id="quizSignedOut"', 'id="quizHome"', 'id="quizSession"',
  'id="quizResults"', 'id="quizDifficultyGrid"', 'id="quizHistory"',
  'id="quizQuestionArea"', 'id="quizSubmit"', 'id="quizAbandon"',
  'id="learningIntroBackdrop"', 'id="lessonsChineseUnavailable"',
  'id="quizChineseUnavailable"', 'id="flashcardsChineseUnavailable"',
  'id="quizTranslationNotice"'
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

const learningPageFeatures = [
  "learningIntroSaveDismissal", "learningIntroLoadPreferences",
  "learningIntroMaybeShow", "learning_page_introduction_preferences",
  "quizEffectiveTranslationCode", "quizUpdateTranslationNotice", "quizSyncCoursePreferences", "applyLearningCourseAvailability"
];
for (const feature of learningPageFeatures) {
  if (!appScript.includes(feature)) throw new Error("Missing learning-page feature: " + feature);
}
for (const page of ["lessons", "quiz", "flashcards"]) {
  if (!html.includes('data-learning-help="' + page + '"')) throw new Error("Missing contextual help control: " + page);
}
if (!appScript.includes("This session keeps its original translation") || !appScript.includes("will apply to the next Quiz")) {
  throw new Error("Quiz translation snapshot fallback messaging is incomplete.");
}
if (!mockTesting.includes('"learning_page_introduction_preferences"')) {
  throw new Error("Mock User adapter does not support account-scoped learning introduction preferences.");
}
for (const feature of [
  "function refreshTranslationViews(nextLanguage)",
  "renderLesson(activeLesson,true)",
  'quizEl("quizNext").hidden=pos>=s.question_count',
  "quiz-difficulty-count",
  "Build confidence with essential vocabulary",
  "Stretch your command of English",
  "linear-gradient(135deg,#202b46",
  "Math.random()*(i+1)"
]) {
  if (!html.includes(feature) && !mockTesting.includes(feature)) {
    throw new Error("Missing revised learning/Quiz UI behaviour: " + feature);
  }
}
for (const internalLabel of [
  "quiz-bank-status",
  "quizEscape(target)",
  "quizEscape(bankSummary)",
  "quizEscape(reason)",
  "quizEscape(unavailableReason)"
]) {
  if (html.includes(internalLabel)) {
    throw new Error("Internal bank/allowance diagnostics must not be rendered in Quiz difficulty cards: " + internalLabel);
  }
}
console.log("Quiz frontend validation passed: inline JavaScript parses, required Quiz screens/RPCs exist, account-scoped learning introductions and Chinese availability states exist, lesson translation refresh and Quiz snapshot fallback are wired, simplified difficulty cards and last-question navigation are present, mock answer positions are randomized, answer review is wired, and private Quiz tables are not queried directly.");
