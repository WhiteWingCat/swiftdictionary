const { test, expect, request } = require("@playwright/test");
const { randomUUID } = require("node:crypto");

const apiUrl = process.env.API_URL;
const anonKey = process.env.ANON_KEY;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
test.skip(!apiUrl || !anonKey || !serviceRoleKey,
  "Quiz authenticated runtime tests require the disposable local Supabase environment.");

let api;
let freeSession;
let premiumSession;
let freeUserId;

async function signIn(email, password) {
  const response = await api.post(apiUrl + "/auth/v1/token?grant_type=password", {
    headers: { apikey: anonKey },
    data: { email, password }
  });
  const body = await response.json();
  if (!response.ok || !body.access_token) {
    throw new Error("Local Supabase password sign-in failed: " + JSON.stringify(body));
  }
  return {
    ...body,
    expires_at: Math.floor(Date.now() / 1000) + Number(body.expires_in || 3600)
  };
}


async function createRuntimeUser(label, plan) {
  const email = `quiz-${label}-${randomUUID()}@example.test`;
  const password = `Quiz-${randomUUID()}-Aa1!`;
  const created = await api.post(apiUrl + "/auth/v1/admin/users", {
    headers: { apikey: serviceRoleKey, Authorization: "Bearer " + serviceRoleKey },
    data: { email, password, email_confirm: true, user_metadata: { test_role: label } }
  });
  const user = await created.json();
  if (!created.ok() || !user.id) throw new Error("Could not create fresh disposable " + label + " account: " + JSON.stringify(user));

  for (const [table, body] of [
    ["user_preferences", { user_id: user.id, learning_language: "en", translation_language: "zh", timezone: "Asia/Kuala_Lumpur" }],
    ["user_entitlements", { user_id: user.id, plan_code: plan, status: "active", valid_from: null, valid_until: null }]
  ]) {
    const response = await api.post(apiUrl + "/rest/v1/" + table + "?on_conflict=user_id", {
      headers: {
        apikey: serviceRoleKey,
        Authorization: "Bearer " + serviceRoleKey,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      data: body
    });
    if (!response.ok()) throw new Error("Could not seed disposable " + label + " " + table + ": " + await response.text());
  }
  return { id: user.id, email, password };
}

async function installLocalSupabaseConfig(page) {
  await page.route("**/supabase-config.js", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: "window.SWIFT_SUPABASE_CONFIG = { url: " + JSON.stringify(apiUrl) +
      ", anonKey: " + JSON.stringify(anonKey) + " };"
  }));
}

async function selectCourse(page, language) {
  await page.locator("#courseControlTrigger").click();
  await page.locator("#courseSelect").selectOption(language);
}
async function selectTranslation(page, language) {
  await page.locator("#translationControlTrigger").click();
  await page.locator("#translationSelect").selectOption(language);
}

async function openQuiz(page, session) {
  await installLocalSupabaseConfig(page);
  const storageKey = "sb-" + new URL(apiUrl).hostname.split(".")[0] + "-auth-token";
  await page.addInitScript(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: storageKey, value: session });
  const browserDiagnostics = [];
  page.on("console", message => {
    if (message.type() === "error") browserDiagnostics.push("console: " + message.text());
  });
  page.on("pageerror", error => browserDiagnostics.push("pageerror: " + error.message));
  page.on("requestfailed", request => browserDiagnostics.push("requestfailed: " + request.url() + " " + (request.failure()?.errorText || "")));
  await page.goto("/#quiz");
  const availabilityResponse = await api.post(apiUrl + "/rest/v1/rpc/get_my_quiz_availability", {
    headers: { apikey: anonKey, Authorization: "Bearer " + session.access_token },
    data: {}
  });
  const availability = await availabilityResponse.json();
  if (!availabilityResponse.ok()) throw new Error("Fresh-account availability check failed: " + JSON.stringify(availability));
  if (availability.active_session_id !== null) {
    throw new Error("New disposable account unexpectedly has an active Quiz session: " + availability.active_session_id);
  }
  await expect(page.locator("#quizPage")).toBeVisible({ timeout: 20000 });
  try {
    await expect(page.locator("#quizHome")).toBeVisible({ timeout: 20000 });
    await expect(page.locator("#learningIntroBackdrop")).toBeVisible({ timeout: 10000 });
    await page.locator("#learningIntroDismiss").click();
    await expect(page.locator("#learningIntroBackdrop")).toBeHidden();
    const savedIntro = await api.get(apiUrl + "/rest/v1/learning_page_introduction_preferences?user_id=eq." +
      encodeURIComponent(session.user.id) + "&page_key=eq.quiz&select=page_key", {
      headers: { apikey: serviceRoleKey, Authorization: "Bearer " + serviceRoleKey }
    });
    if (!savedIntro.ok() || !(await savedIntro.json()).some(row => row.page_key === "quiz")) {
      throw new Error("Quiz introduction dismissal was not persisted to the signed-in account.");
    }
  } catch (error) {
    const diagnostics = await page.evaluate(() => ({
      accountLabel: document.querySelector("#accountButtonLabel")?.textContent,
      accountStatus: document.querySelector("#accountStatus")?.textContent,
      quizStatus: document.querySelector("#quizStatus")?.textContent,
      configLoaded: !!window.SWIFT_SUPABASE_CONFIG,
      authStorageKeys: Object.keys(localStorage).filter(key => key.includes("auth-token"))
    }));
    throw new Error("Authenticated Quiz did not initialize. Browser diagnostics: " +
      JSON.stringify(diagnostics) + "; browser errors: " + browserDiagnostics.join(" | ") +
      "; original error: " + error.message);
  }
}

async function updateTranslationPreference(userId, language) {
  const response = await api.patch(
    apiUrl + "/rest/v1/user_preferences?user_id=eq." + encodeURIComponent(userId),
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: "Bearer " + serviceRoleKey,
        Prefer: "return=minimal"
      },
      data: { translation_language: language }
    }
  );
  if (!response.ok()) throw new Error("Could not update disposable test preference: " + await response.text());
}

test.beforeAll(async () => {
  api = await request.newContext();
});

test.beforeEach(async () => {
  // A new account per attempt prevents Playwright retries from inheriting an
  // unfinished session created by a failed earlier attempt.
  const [free, premium] = await Promise.all([
    createRuntimeUser("free", "free"),
    createRuntimeUser("premium", "premium")
  ]);
  freeUserId = free.id;
  freeSession = await signIn(free.email, free.password);
  premiumSession = await signIn(premium.email, premium.password);
});

test.afterAll(async () => {
  await api?.dispose();
});

test("Free user can switch translation in an open permanent lesson and complete a real authenticated Quiz", async ({ page }) => {
  await openQuiz(page, freeSession);

  // Translation changes must refresh the already-open permanent lesson,
  // without closing it or discarding the learner's selected practice answer.
  await page.goto("/#lessons");
  await expect(page.locator("#lessonsPage")).toBeVisible();
  await expect(page.locator("#learningIntroBackdrop")).toBeVisible();
  // Dismiss the separate Lessons guide before opening a permanent lesson.
  await page.locator("#learningIntroDismiss").click();
  await expect(page.locator("#learningIntroBackdrop")).toBeHidden();
  await expect(page.locator("#lessonCards button").first()).toBeVisible();
  const lessonAllowanceNetwork = [];
  page.on("response", async response => {
    if (!response.url().includes("/rest/v1/")) return;
    let body = "";
    try { body = (await response.text()).slice(0, 1200); } catch {}
    lessonAllowanceNetwork.push({ url: response.url(), status: response.status(), body });
  });
  await page.locator("#lessonCards button").first().click();
  await page.waitForFunction(() => {
    const detail = document.querySelector("#lessonDetailPage");
    const status = document.querySelector("#lessonStatus");
    return (detail && !detail.hidden) || !!status?.textContent?.trim();
  }, null, { timeout: 10000 });
  const lessonOpenDiagnostics = await page.evaluate(() => ({
    detailHidden: document.querySelector("#lessonDetailPage")?.hidden,
    lessonStatus: document.querySelector("#lessonStatus")?.textContent,
    readerHidden: document.querySelector("#lessonReader")?.hidden,
    accountStatus: document.querySelector("#accountStatus")?.textContent,
    accountLabel: document.querySelector("#accountButtonLabel")?.textContent
  }));
  expect(lessonOpenDiagnostics.detailHidden, "Lesson opening diagnostics: " + JSON.stringify(lessonOpenDiagnostics) + "; allowance network: " + JSON.stringify(lessonAllowanceNetwork)).toBe(false);
  // The synthetic account starts with Chinese as its selected translation.
  // Verify the current snapshot, then switch both ways without losing the answer.
  await expect(page.locator("#lessonReaderContent h2")).toHaveText("构建清晰的基本句子");
  await page.locator('input[name="lessonAnswer0"][value="1"]').check();
  await selectTranslation(page,"en");
  await expect(page.locator("#lessonReaderContent h2")).toHaveText("Build a clear basic sentence");
  await expect(page.locator('input[name="lessonAnswer0"][value="1"]')).toBeChecked();
  await selectTranslation(page,"zh");
  await expect(page.locator("#lessonReaderContent h2")).toHaveText("构建清晰的基本句子");
  await expect(page.locator('input[name="lessonAnswer0"][value="1"]')).toBeChecked();

  // Ensure the authenticated preference has settled in the disposable DB before
  // the Quiz page snapshots its language pair. The selector change above is
  // also exercised in the UI; this removes a race between the queued upsert and
  // the next hash navigation in a fast CI browser.
  await updateTranslationPreference(freeUserId, "zh");
  await page.goto("/#quiz");
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizAllowanceText")).toHaveText("1 of 1 remaining");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("Preferred question-bank target met");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("approved");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("You have used today's Quiz allowance");
  await expect(page.locator('[data-quiz-start="beginner"]'),
    "Beginner availability diagnostics: " + await page.locator("#quizDifficultyGrid").innerText()
  ).toBeEnabled();

  await page.locator('[data-quiz-start="beginner"]').click();
  await expect(page.locator("#quizSession")).toBeVisible({ timeout: 15000 });
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 1 of 10",{timeout:15000});
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toContainText("运行测试题");

  // Changing the shared translation selector while a Quiz is already open
  // must immediately redraw the current question from the immutable snapshot.
  await selectTranslation(page,"en");
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
  await expect(page.locator("#quizTranslationNotice")).toContainText("learning-language text");
  await selectTranslation(page,"zh");
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toContainText("运行测试题");
  await expect(page.locator("#quizTranslationNotice")).toContainText("selected translation");

  // The learner can change an answer before submission.
  await page.locator('[data-quiz-option="b"]').click();
  await expect(page.locator('[data-quiz-option="b"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator('[data-quiz-option="a"]').click();
  await expect(page.locator('[data-quiz-option="a"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator("#quizNext").click();
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 2 of 10",{timeout:15000});

  // Reloading restores the active session and the saved position/answer.
  await page.reload();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizActiveCard")).toBeVisible();
  await page.locator("#quizResume").click();
  try {
    await expect(page.locator("#quizSession")).toBeVisible({ timeout: 7000 });
  } catch (error) {
    const diagnostics = await page.evaluate(() => ({
      quizStatus: document.querySelector("#quizStatus")?.textContent,
      quizHomeHidden: document.querySelector("#quizHome")?.hidden,
      quizSessionHidden: document.querySelector("#quizSession")?.hidden,
      activeCardText: document.querySelector("#quizActiveDescription")?.textContent,
      accountStatus: document.querySelector("#accountStatus")?.textContent,
      accountLabel: document.querySelector("#accountButtonLabel")?.textContent
    }));
    throw new Error("Resume RPC did not render the active session: " + JSON.stringify(diagnostics) + "; " + error.message);
  }
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 2 of 10");
  await page.locator("#quizPrevious").click();
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 1 of 10");
  await expect(page.locator('[data-quiz-option="a"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator("#quizNext").click();

  // English is already present as the learning-language text in this snapshot.
  // Selecting it must refresh the active session immediately without changing
  // the server-owned answers or question position.
  await updateTranslationPreference(freeUserId, "en");
  await page.reload();
  await expect(page.locator("#quizHome")).toBeVisible();
  await page.locator("#quizResume").click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
  await expect(page.locator("#quizTranslationNotice")).toContainText("learning-language text");
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 2 of 10");
  await page.locator("#quizPrevious").click();
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 1 of 10");
  await expect(page.locator('[data-quiz-option="a"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator("#quizNext").click();

  for (let position = 2; position <= 10; position += 1) {
    await page.locator('[data-quiz-option="a"]').click();
    if (position < 10) await page.locator("#quizNext").click();
  }
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 10 of 10");
  await expect(page.locator("#quizNext")).toBeHidden();
  await expect(page.locator("#quizSubmit")).toBeEnabled();
  page.once("dialog", dialog => dialog.accept());
  await page.locator("#quizSubmit").click();
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("#quizResultsContent .quiz-results-score")).toContainText("100%");
  await expect(page.locator("#quizResultsContent .quiz-results-score")).toContainText("10 correct out of 10");
  await expect(page.locator("#quizResultsContent")).toContainText("There is no pass or fail result.");
  await expect(page.locator("#quizResultsContent .quiz-review-question")).toHaveCount(10);
  await expect(page.locator("#quizResultsContent .quiz-review-explanation")).toHaveCount(10);

  await page.locator("#quizResultsHome").click();
  await expect(page.locator("#quizAllowanceText")).toHaveText("0 of 1 remaining");
  await expect(page.locator("#quizHistory [data-quiz-review]")).toHaveCount(1);
  await page.locator("#quizHistory [data-quiz-review]").click();
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("#quizResultsContent .quiz-review-question")).toHaveCount(10);

  // The Dashboard must surface the same completed Quiz history and allow review.
  await page.goto("/#profile");
  await expect(page.locator("#profileContent")).toBeVisible();
  const dashboardHistoryDiagnostics = await page.locator("#dashboardQuizHistory").innerText();
  const dashboardProfileStatus = await page.locator("#preferenceStatus").innerText();
  await expect(page.locator("#dashboardQuizHistory [data-dashboard-quiz-review]"), "Dashboard history: "+dashboardHistoryDiagnostics+"; profile status: "+dashboardProfileStatus).toHaveCount(1);
  await expect(page.locator("#dashboardQuizHistory")).toContainText("100%");
  await page.locator("#dashboardQuizHistory [data-dashboard-quiz-review]").click();
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("#quizResultsContent .quiz-review-question")).toHaveCount(10);
});


test("Quiz preserves an unavailable translation snapshot and applies the preference to the next session", async ({ page }) => {
  // Begin with an English-only snapshot. The account preference is then
  // changed to Chinese, which is not present in this active session.
  await updateTranslationPreference(freeUserId, "en");
  await openQuiz(page, freeSession);
  await page.locator('[data-quiz-start="beginner"]').click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
  await page.locator('[data-quiz-option="b"]').click();
  await expect(page.locator('[data-quiz-option="b"]')).toHaveAttribute("aria-pressed", "true");

  await updateTranslationPreference(freeUserId, "zh");
  await page.reload();
  await expect(page.locator("#quizHome")).toBeVisible();
  await page.locator("#quizResume").click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
  await expect(page.locator("#quizTranslationNotice")).toContainText("not included in this Quiz snapshot");
  await expect(page.locator("#quizTranslationNotice")).toContainText("will apply to the next Quiz");
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 1 of 10");
  await expect(page.locator('[data-quiz-option="b"]')).toHaveAttribute("aria-pressed", "true");

  page.once("dialog", dialog => dialog.accept());
  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();
  await page.locator('[data-quiz-start="beginner"]').click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toContainText("运行测试题");
});

test("learning introductions are independent per page and help controls reopen them", async ({ page }) => {
  await openQuiz(page, freeSession);
  await page.goto("/#lessons");
  await expect(page.locator("#learningIntroBackdrop")).toBeVisible();
  await expect(page.locator("#learningIntroTitle")).toHaveText("Welcome to Lessons");
  await page.locator("#learningIntroDismiss").click();
  await expect(page.locator("#learningIntroBackdrop")).toBeHidden();

  await page.locator('[data-learning-help="lessons"]').click();
  await expect(page.locator("#learningIntroBackdrop")).toBeVisible();
  await expect(page.locator("#learningIntroTitle")).toHaveText("Welcome to Lessons");
  await page.locator("#learningIntroClose").click();

  await page.goto("/#flashcards");
  await expect(page.locator("#learningIntroBackdrop")).toBeVisible();
  await expect(page.locator("#learningIntroTitle")).toHaveText("Welcome to Flashcards");
  await page.locator("#learningIntroDismiss").click();
  await expect(page.locator("#learningIntroBackdrop")).toBeHidden();

  const rows = await api.get(apiUrl + "/rest/v1/learning_page_introduction_preferences?user_id=eq." +
    encodeURIComponent(freeSession.user.id) + "&select=page_key", {
    headers: { apikey: serviceRoleKey, Authorization: "Bearer " + serviceRoleKey }
  });
  expect(rows.ok()).toBeTruthy();
  const pages = (await rows.json()).map(row => row.page_key).sort();
  expect(pages).toEqual(["flashcards", "lessons", "quiz"]);

  const otherAccountRows = await api.get(apiUrl + "/rest/v1/learning_page_introduction_preferences?user_id=eq." +
    encodeURIComponent(premiumSession.user.id) + "&select=page_key", {
    headers: { apikey: serviceRoleKey, Authorization: "Bearer " + serviceRoleKey }
  });
  expect(otherAccountRows.ok()).toBeTruthy();
  expect(await otherAccountRows.json()).toEqual([]);
});

test("Chinese course selection clearly disables English learning content on all three pages", async ({ page }) => {
  await openQuiz(page, freeSession);
  await selectCourse(page,"zh");
  await expect(page.locator("#quizChineseUnavailable")).toBeVisible();
  await expect(page.locator("#quizHome")).toBeHidden();
  await selectCourse(page,"en");
  await expect(page.locator("#quizChineseUnavailable")).toBeHidden();
  await expect(page.locator("#quizHome")).toBeVisible();

  await page.goto("/#lessons");
  await expect(page.locator("#learningIntroBackdrop")).toBeVisible();
  await page.locator("#learningIntroDismiss").click();
  await selectCourse(page,"zh");
  await expect(page.locator("#lessonsChineseUnavailable")).toBeVisible();
  await expect(page.locator("#lessonLibrary")).toBeHidden();
  await selectCourse(page,"en");
  await expect(page.locator("#lessonsChineseUnavailable")).toBeHidden();
  await expect(page.locator("#lessonLibrary")).toBeVisible();

  await page.goto("/#flashcards");
  await expect(page.locator("#learningIntroBackdrop")).toBeVisible();
  await page.locator("#learningIntroDismiss").click();
  await selectCourse(page,"zh");
  await expect(page.locator("#flashcardsChineseUnavailable")).toBeVisible();
  await expect(page.locator("#flashcardsPage .coming-card")).toBeHidden();
  await selectCourse(page,"en");
  await expect(page.locator("#flashcardsChineseUnavailable")).toBeHidden();
  await expect(page.locator("#flashcardsPage .coming-card")).toBeVisible();
});

test("Premium user sees three daily completions; abandonment does not consume allowance and one active session is enforced", async ({ page }) => {
  await openQuiz(page, premiumSession);
  await expect(page.locator("#quizAllowanceText")).toHaveText("3 of 3 remaining");
  await expect(page.locator('[data-quiz-start="advanced"]'),
    "Advanced availability diagnostics: " + await page.locator("#quizDifficultyGrid").innerText()
  ).toBeEnabled();

  await page.locator('[data-quiz-start="advanced"]').click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 1 of 20");

  // Returning to overview and attempting a different difficulty must resume
  // the existing server-owned session rather than create a second one.
  await page.locator("#quizBackHome").click();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizActiveCard")).toBeVisible();
  // A second difficulty must remain unavailable while the server-owned
  // active session exists. Resume the existing session instead of clicking
  // the intentionally disabled start button.
  await expect(page.locator('[data-quiz-start="intermediate"]')).toBeDisabled();
  await page.locator("#quizResume").click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizSessionDifficulty")).toHaveText("Advanced");

  page.once("dialog", dialog => dialog.accept());
  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizAllowanceText")).toHaveText("3 of 3 remaining");
  await expect(page.locator("#quizActiveCard")).toBeHidden();
});

test("signed-out visitors cannot open Quiz sessions or account history", async ({ page }) => {
  await installLocalSupabaseConfig(page);
  await page.goto("/#quiz");
  await expect(page.locator("#quizPage")).toBeVisible({ timeout: 20000 });
  await expect(page.locator("#quizSignedOut")).toBeVisible();
  await expect(page.locator("#quizHome")).toBeHidden();
  await expect(page.locator("#quizSession")).toBeHidden();
});
