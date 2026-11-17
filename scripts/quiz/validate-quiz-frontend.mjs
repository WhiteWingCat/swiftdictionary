import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const mockTesting = fs.readFileSync(new URL("../../mock-testing.js", import.meta.url), "utf8");
const dailyLearning = fs.readFileSync(new URL("../../daily-learning.js", import.meta.url), "utf8");
const quizTranslationMigration = fs.readFileSync(new URL("../../supabase/migrations/20261117125000_swiftdictionary_update_2_4_1_quiz_translation_language_fix.sql", import.meta.url), "utf8");
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
  "quizEffectiveTranslationCode", "quizUpdateTranslationNotice", "quizSyncCoursePreferences", "applyLearningCourseAvailability",
  "quizRefreshVisibleTranslation", "quizApplyPageTranslation", "showPreferenceRefreshToast", "sessionView"
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
if (!html.includes('id="preferenceRefreshToast"') || !appScript.includes("showPreferenceRefreshToast(\"course\")") ||
    !appScript.includes("showPreferenceRefreshToast(\"translation\")")) {
  throw new Error("Course and translation selectors must show a transient page-refresh confirmation.");
}
if (!appScript.includes("p_learning_language:requestedCourse") || !appScript.includes("p_translation_language:requestedTranslation") ||
    !appScript.includes("setTimeout(()=>resolve(false),1500)")) {
  throw new Error("Quiz start must use the current selector values and must not block indefinitely on preference synchronization.");
}
if (!appScript.includes("function quizApplyPageTranslation") || !appScript.includes("知识测验") ||
    !appScript.includes("通过不同主题的问题检验你的理解") || !appScript.includes("quizPageState.sessionView&&quizPageState.session?.session_id") || !appScript.includes("if(quizPageState.result)")) {
  throw new Error("Quiz overview translation or active-session continuity is incomplete.");
}
if (!dailyLearning.includes('.select("id,activity_type,content_id,topic_id,difficulty,source,status,started_at")')) {
  throw new Error("Daily Learning must select the session ID before attempting expired-session cleanup.");
}
if (!appScript.includes("const sessionIsVisible=!!quizPageState.session&&!quizEl(\"quizSession\").hidden;") ||
    !appScript.includes("if(sessionIsVisible){quizPageState.sessionView=true;quizRenderSession();}")) {
  throw new Error("Changing translation from the Quiz overview must not auto-open an unfinished session.");
}
if (!appScript.includes("const showQuizSession=quizSignedIn&&!showQuizResults&&!!quizPageState.session&&!!quizPageState.sessionView;") ||
    !appScript.includes("const showQuizHome=quizSignedIn&&!showQuizResults&&!showQuizSession;")) {
  throw new Error("Course availability must preserve the learner's selected Quiz subview.");
}
if (!appScript.includes('const quizViewBefore=location.hash==="#quiz"') ||
    !appScript.includes('if (quizViewBefore==="session" && quizPageState.session)') ||
    !appScript.includes('else if (quizViewBefore==="home")')) {
  throw new Error("Changing translation must preserve the exact Quiz subview the learner was viewing.");
}
if (!appScript.includes("const requestedCourse=courseSelector.value||course||\"en\";") ||
    !appScript.includes("const requestedTranslation=translationSelector.value||translationLanguage||\"en\";")) {
  throw new Error("Quiz start must snapshot the current visible course and translation selector values.");
}
if (!quizTranslationMigration.includes("create or replace function private.get_my_quiz_availability_impl()") ||
    !quizTranslationMigration.includes("create or replace function private.start_my_quiz_impl(p_difficulty text, p_learning_language text, p_translation_language text)") ||
    !quizTranslationMigration.includes("create or replace function public.start_my_quiz(")) {
  throw new Error("The Update 2.4.1 Quiz translation migration is incomplete.");
}
if (!mockTesting.includes('"learning_page_introduction_preferences"')) {
  throw new Error("Mock User adapter does not support account-scoped learning introduction preferences.");
}
if (!mockTesting.includes("mock_simulation:true") || html.includes("Draft question-bank preview") || html.includes("not yet accuracy-approved for learners")) {
  throw new Error("The live Quiz page must not display the internal draft question-bank preview notice.");
}
if (!mockTesting.includes("async function loadQuizDraftBank") || !mockTesting.includes('bank.status!=="draft"') ||
    !mockTesting.includes("questions.en-zh.draft.json") || !mockTesting.includes("curriculum-map.en.json")) {
  throw new Error("Mock Quiz must load and validate only the bilingual draft question bank and its curriculum map.");
}
if (!mockTesting.includes("correct_option_id:question.correct_option_id") || !mockTesting.includes("delete item.correct_option_id")) {
  throw new Error("Mock answer shuffling must preserve correct option identity and hide answer keys before submission.");
}
if (!mockTesting.includes('question.question_type==="chinese_translation"') || !html.includes('q.question_type==="chinese_translation"') ||
    !html.includes("const primaryText=chineseTranslationQuestion?option.translation_text:option.learning_text")) {
  throw new Error("Chinese integration questions must render Chinese answer choices as the primary answer text.");
}
if (!html.includes('class="course-selector-wrap course-selector-pill"') ||
    html.includes("courseControlTrigger") || html.includes("translationControlTrigger")) {
  throw new Error("Learning and translation language controls must be directly selectable with one interaction.");
}
if (!html.includes("color-scheme:dark") || !html.includes(".course-selector-pill select option")) {
  throw new Error("Course and translation dropdown options must use the dark SwiftDictionary theme rather than the default white popup.");
}
if (!html.includes('id="practiceQuizWrongAnswers"') ||
    !appScript.includes('supabaseClient.rpc("get_my_quiz_review"') ||
    !appScript.includes("const quizPracticeRows = []") ||
    !appScript.includes("data-practice-lesson") ||
    !appScript.includes("openLesson(lessonId)")) {
  throw new Error("Practice Insights must aggregate completed Quiz reviews and link missed questions to their source lessons.");
}
if (!html.includes('showPage("quiz",true,{skipQuizInitialise:true})') ||
    !html.includes('quizReview(button.dataset.dashboardQuizReview,"profile")') ||
    !html.includes('quizPageState.returnPage==="profile"?"← Back to Dashboard"')) {
  throw new Error("Dashboard Quiz history must open directly into the review and provide a Dashboard return path.");
}
if (!mockTesting.includes("correct_count:row.correct_count")) {
  throw new Error("Mock Quiz history must include the actual correct-answer count.");
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
