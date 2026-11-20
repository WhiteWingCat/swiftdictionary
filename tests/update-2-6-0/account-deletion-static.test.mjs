import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const frontend = readFileSync("account-deletion.js", "utf8");
const edge = readFileSync("supabase/functions/delete-account/index.ts", "utf8");
const config = readFileSync("supabase-config.js", "utf8");
const build = readFileSync("build.sh", "utf8");
const index = readFileSync("index.html", "utf8");
const flashcards = readFileSync("flashcards.js", "utf8");

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
  assert.match(edge, /hasRecentAuthTime\(payload, nowSeconds, MAX_AUTH_AGE_SECONDS\)/);
  assert.doesNotMatch(edge, /body\s*as Record<string, unknown>\)\.user_id/);
});

test("no privileged key is embedded in browser code", () => {
  assert.doesNotMatch(frontend, /SUPABASE_SERVICE_ROLE_KEY|sb_secret_/);
  assert.doesNotMatch(config, /SUPABASE_SERVICE_ROLE_KEY|sb_secret_/);
});

test("Cloudflare build routing appends the account-deletion loader after config generation", () => {
  assert.match(build, /account-deletion\.js/);
});

test("account deletion is visibly distinct from learning-history deletion", () => {
  assert.ok(frontend.includes("<h3>Delete account</h3>"));
  assert.ok(frontend.includes("host.insertBefore(card, historyCard)"));
  assert.ok(index.includes("<h3>Learning history</h3>"));
  assert.ok(index.includes("separate Delete account option above"));
});

test("learning-history confirmation uses an in-site dialog, not the browser prompt", () => {
  assert.ok(index.includes("confirmLearningHistoryDeletion"));
  assert.ok(index.includes('role="dialog" aria-modal="true"'));
  assert.ok(index.includes("Delete learning history?"));
  assert.ok(!index.includes("window.confirm("));
});

test("signed-out Flashcards visitors still see the page banner and title", () => {
  const start = flashcards.indexOf("if(!currentUser){");
  const end = flashcards.indexOf("if(state.loading)", start);
  const signedOut = flashcards.slice(start, end);
  assert.match(signedOut, /flash-banner/);
  assert.match(signedOut, /Flashcards/);
  assert.match(signedOut, /data-action="signin"/);
});
