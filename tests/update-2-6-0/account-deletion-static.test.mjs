import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const frontend = readFileSync("account-deletion.js", "utf8");
const edge = readFileSync("supabase/functions/delete-account/index.ts", "utf8");
const config = readFileSync("supabase-config.js", "utf8");
const build = readFileSync("build.sh", "utf8");
const index = readFileSync("index.html", "utf8");
const flashcards = readFileSync("flashcards.js", "utf8");
const dailyLearning = readFileSync("daily-learning.js", "utf8");
const terms = readFileSync("terms.html", "utf8");

test("optional local saved-word clearing is opt-in and scoped to its dedicated key", () => {
  assert.match(frontend, /id="swiftDeleteLocalCheckbox" type="checkbox"/);
  assert.match(frontend, /checkbox\.checked = false/);
  assert.match(frontend, /localStorage\.removeItem\(ANONYMOUS_SAVED_KEY\)/);
  assert.doesNotMatch(frontend, /localStorage\.clear\s*\(/);
  assert.doesNotMatch(frontend, /indexedDB\.deleteDatabase/);
});

test("anonymous saves are stored separately from account cloud saves", () => {
  assert.match(config, /swiftdictionary-anonymous-saved/);
  assert.match(frontend, /swiftdictionary-anonymous-saved/);
  assert.match(frontend, /if \(currentUser\)/);
  assert.match(frontend, /applyAnonymousSavedWords/);
  assert.ok(frontend.includes("onAuthStateChange((_event, session)"));
});

test("account deletion derives its target from a verified user session", () => {
  assert.match(edge, /userClient\.auth\.getUser\(accessToken\)/);
  assert.match(edge, /adminClient\.auth\.admin\.signOut\(accessToken, "global"\)/);
  assert.match(edge, /adminClient\.auth\.admin\.deleteUser\(user\.id, false\)/);
  assert.match(edge, /getUserById\(user\.id\)/);
  assert.match(edge, /hasRecentAuthentication\(payload, nowSeconds, MAX_AUTH_AGE_SECONDS\)/);
  assert.doesNotMatch(edge, /body\s*as Record<string, unknown>\)\.user_id/);
});

test("no privileged key is embedded in browser code", () => {
  assert.doesNotMatch(frontend, /SUPABASE_SERVICE_ROLE_KEY|sb_secret_/);
  assert.doesNotMatch(config, /SUPABASE_SERVICE_ROLE_KEY|sb_secret_/);
});

test("Cloudflare build routing preserves anonymous saved words without dynamic module injection", () => {
  assert.match(build, /swiftdictionary-anonymous-saved/);
  assert.doesNotMatch(build, /moduleScript/);
});

test("account deletion is visibly distinct from learning-history deletion", () => {
  assert.ok(frontend.includes("<h3>Delete Account</h3>"));
  assert.ok(frontend.includes("host.insertBefore(card, historyCard)"));
  assert.ok(index.includes("<h3>Learning history</h3>"));
  assert.ok(index.includes("separate Delete account option above"));
});

test("learning-history confirmation uses an in-site dialog, not the browser prompt", () => {
  assert.ok(index.includes("confirmLearningHistoryDeletion"));
  assert.ok(index.includes('role="dialog" aria-modal="true"'));
  assert.ok(index.includes("Delete learning history?"));
  const handlerStart = index.indexOf('document.getElementById("deleteLearningHistoryButton").addEventListener');
  const handlerEnd = index.indexOf("function browserTimezone", handlerStart);
  const handler = index.slice(handlerStart, handlerEnd);
  assert.ok(handler.includes("await confirmLearningHistoryDeletion()"));
  assert.ok(!handler.includes("confirm("));
  assert.ok(!handler.includes("confirm ("));
});

test("signed-out Flashcards visitors still see the page banner and title", () => {
  const start = flashcards.indexOf("if(!currentUser){");
  const end = flashcards.indexOf("if(state.loading)", start);
  const signedOut = flashcards.slice(start, end);
  assert.match(signedOut, /flash-banner/);
  assert.match(signedOut, /Flashcards/);
  assert.match(signedOut, /data-action="signin"/);
});

test("account deletion loads after the main app, without an async config-loader race", () => {
  assert.ok(index.indexOf('<script src="flashcards.js?v=2.8.0-r4"></script>') < index.indexOf('<script src="account-deletion.js?v=2.6.0-r4"></script>'));
  assert.doesNotMatch(config, /moduleScript\\.async\\s*=\\s*true/);
  assert.doesNotMatch(build, /moduleScript\\.async\\s*=\\s*true/);
  assert.match(build, /Account deletion is loaded explicitly after the main app script/);
});

test("Google sign-in is bound before the initial serialized account hydration", () => {
  const authBlock = index.slice(index.indexOf("async function initAccount"), index.indexOf("const accountMenu", index.indexOf("async function initAccount")));
  assert.ok(authBlock.indexOf('google.addEventListener("click"') < authBlock.lastIndexOf('await enqueueAccountRefresh(null, false, "BOOTSTRAP", false);'));
  assert.match(authBlock, /Google sign-in could not start/);
  assert.match(authBlock, /accountRefreshQueue/);
});

test("routine token refresh events do not trigger full account hydration", () => {
  const authBlock = index.slice(index.indexOf("async function initAccount"), index.indexOf("const accountMenu", index.indexOf("async function initAccount")));
  assert.match(authBlock, /event === "INITIAL_SESSION" \|\| event === "TOKEN_REFRESHED"/);
  assert.match(authBlock, /TOKEN_REFRESHED is deliberately not queued/);
  assert.match(authBlock, /SIGNED_IN", "SIGNED_OUT", "USER_UPDATED", "PASSWORD_RECOVERY/);
});

test("post-sign-in loading overlay is present and released after account hydration", () => {
  assert.match(index, /id="swiftAuthLoading"/);
  assert.match(index, /swiftAuthLoadingMessage/);
  assert.match(index, /setAuthLoading\(false\)/);
  assert.match(index, /__swiftFlashcardsAuthHydration/);
});

test("cloud saved-word sync failures do not clear the authenticated account", () => {
  const syncBlock = index.slice(index.indexOf("async function syncCurrentCourseFromCloud"), index.indexOf("async function initAccount"));
  const authBlock = index.slice(index.indexOf("async function refreshAccount"), index.indexOf("function enqueueAccountRefresh"));
  assert.match(syncBlock, /You are still signed in/);
  assert.match(syncBlock, /local saved words remain available/i);
  assert.match(authBlock, /syncError/);
  assert.match(authBlock, /You are signed in/);
});

test("Terms & Conditions has a footer link and does not publish an unapproved legal draft", () => {
  assert.ok(index.includes('<a href="terms.html">Terms &amp; Conditions</a>'));
  assert.match(terms, /Terms &amp; Conditions/);
  assert.match(terms, /Not yet published/);
  assert.match(terms, /not a contract or a binding set of Terms/);
  assert.match(terms, /No acceptance of Terms is being requested or recorded/);
});

test("Lessons are gated behind sign-in and expose a dedicated sign-in panel", () => {
  assert.ok(index.includes('id="lessonsSignedOut"'));
  assert.ok(index.includes('id="lessonsSignIn"'));
  assert.match(index, /learning-signed-out #dailyLearningPage/);
  assert.match(index, /lessonsSignedOut"\)\.hidden=lessonsSignedIn/);
  assert.match(index, /lessonsSignIn.*menuSignIn/);
});

test("Lessons and Quiz use the shared Flashcards-style signed-out card treatment", () => {
  assert.match(index, /id="quizSignedOut" class="coming-card learning-auth-card"/);
  assert.match(index, /id="lessonsSignedOut" class="learning-auth-card"/);
  assert.match(index, /class="primary-button learning-auth-button"/);
  assert.match(flashcards, /flash-section learning-auth-card/);
});

test("Delete Account card is present in Preferences before Learning history", () => {
  assert.ok(index.includes('id="accountDeletionCard"'));
  assert.ok(index.indexOf('id="accountDeletionCard"') < index.indexOf("<h3>Learning history</h3>"));
  assert.match(frontend, /if \(!document\.getElementById\("accountDeletionCard"\)\)/);
});

test("Flashcards resets and re-renders its signed-out view immediately on sign-out", () => {
  assert.match(flashcards, /event==="SIGNED_OUT"\|\|!session\?\.user/);
  assert.match(flashcards, /state\.data=\{collections:\[\],cards:\[\],mastery:\[\],history:\[\],review_items:\[\]\}/);
});

test("updated auth-sensitive scripts use fresh cache-busting versions", () => {
  assert.ok(index.includes('<script src="data/chinese-flashcards.js?v=2.8.0-draft3"></script>'));
  assert.ok(index.includes('<script src="flashcards.js?v=3.0.0-ms14"></script>'));
  assert.ok(index.includes('<script src="account-deletion.js?v=2.6.0-r4"></script>'));
  assert.match(build, /account-deletion\[\.\]js.*2\.6\.0-r5/);
  assert.ok(build.includes("(daily-learning[.]js)") && build.includes("2.8.0-r1"));
  assert.ok(build.includes("(flashcards[.]js)") && build.includes("2.8.0-r1"));
});

test("Flashcards auth hydration is awaitable by the main account initializer", () => {
  assert.match(flashcards, /window\.__swiftFlashcardsAuthHydration=Promise\.resolve\(\)/);
  assert.match(flashcards, /window\.__swiftFlashcardsAuthHydration=loadData\(\)/);
  assert.match(index, /await window\.__swiftFlashcardsAuthHydration/);
});

test("account-deletion dialog stays hidden until explicitly opened", () => {
  assert.match(frontend, /\.swift-delete-overlay\[hidden\]\{display:none!important\}/);
  assert.match(frontend, /overlay\.hidden = true/);
  assert.match(frontend, /overlay\.hidden = false/);
  assert.match(frontend, /swiftDeleteCancel.*closeDialog/s);
});

test("deletion errors remain visible and do not trigger a browser form navigation", () => {
  assert.match(frontend, /confirm\.addEventListener\("click", async \(event\) => \{/);
  assert.match(frontend, /event\.preventDefault\(\)/);
  assert.match(frontend, /event\.stopPropagation\(\)/);
  assert.match(frontend, /response\.status === 401/);
  assert.match(frontend, /Your account and data have not been deleted/);
  assert.match(frontend, /overlay\.hidden = false/);
});

test("account deletion reports confirmed success with a visible five-second toast", () => {
  assert.match(frontend, /Your SwiftDictionary account was successfully deleted/);
  assert.match(frontend, /window\.dispatchEvent\(new Event\("swift-account-deleted"\)\)/);
  assert.match(frontend, /window\.setTimeout\(\(\) => \{/);
  assert.match(frontend, /swiftDictionaryDeletionSuccess/);
  assert.match(frontend, /window\.setTimeout\(\(\) => toast\.remove\(\), 5000\)/);
});

test("Lessons, Quiz and Flashcards show a five-second toast only after successful exhaustion", () => {
  assert.match(dailyLearning, /complete_permanent_lesson: "lesson"/);
  assert.match(dailyLearning, /name === "complete_daily_activity_session"/);
  assert.match(dailyLearning, /daily_topic: chinese \? "主题学习" : "Daily Topic"/);
  assert.match(dailyLearning, /submit_my_quiz: "quiz"/);
  assert.match(flashcards, /notifyFlashcardAllowanceExhausted/);
  assert.match(flashcards, /showSwiftDictionaryToast\(message, "warning", 5000\)/);
  assert.match(dailyLearning, /allowance\.remaining !== 0/);
  assert.match(dailyLearning, /showSwiftDictionaryToast\(message, "warning", 5000\)/);
  assert.match(dailyLearning, /request\.then = function swiftAllowanceAwareThen/);
  assert.match(dailyLearning, /const originalThen = request\.then\.bind\(request\)/);
  assert.match(dailyLearning, /if \(result\?\.error\) return/);
});
