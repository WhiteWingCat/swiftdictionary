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
  await page.locator("#courseSelect").selectOption(language);
}
async function selectTranslation(page, language) {
  await page.locator("#translationSelect").selectOption(language);
}

async function selectCourseAndWaitForSave(page, language) {
  const saved = page.waitForResponse(response =>
    response.url().includes("/rest/v1/user_preferences") &&
    response.request().method() === "POST");
  await selectCourse(page, language);
  await saved;
}
async function selectTranslationAndWaitForSave(page, language) {
  const saved = page.waitForResponse(response =>
    response.url().includes("/rest/v1/user_preferences") &&
    response.request().method() === "POST");
  await selectTranslation(page, language);
  await saved;
}

async function updateLearningPreference(userId, learningLanguage, translationLanguage) {
  const response = await api.patch(
    apiUrl + "/rest/v1/user_preferences?user_id=eq." + encodeURIComponent(userId),
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: "Bearer " + serviceRoleKey,
        Prefer: "return=minimal"
      },
      data: { learning_language: learningLanguage, translation_language: translationLanguage }
    }
  );
  if (!response.ok()) throw new Error("Could not update disposable learning/translation preferences: " + await response.text());
}

async function openQuiz(page, session) {
  await installLocalSupabaseConfig(page);
  const browserDiagnostics = [];
  page.__quizNativeDialogCount = 0;
  page.on("console", message => {
    if (message.type() === "error") browserDiagnostics.push("console: " + message.text());
  });
  page.on("pageerror", error => browserDiagnostics.push("pageerror: " + error.message));
  page.on("requestfailed", request => browserDiagnostics.push("requestfailed: " + request.url() + " " + (request.failure()?.errorText || "")));
  page.on("request", request => {
    if (request.url().includes("/rest/v1/user_preferences")) {
      const headers=request.headers();
      browserDiagnostics.push("user_preferences request auth=" + (headers.authorization ? "present" : "missing") +
        " apikey=" + (headers.apikey ? "present" : "missing"));
    }
  });
  page.on("dialog", async dialog => { page.__quizNativeDialogCount=(page.__quizNativeDialogCount||0)+1; const custom=page.__quizDialogHandler; if(custom){page.__quizDialogHandler=null;await custom(dialog);}else await dialog.accept(); });
  await page.goto("/#quiz");
  // Start each authenticated browser scenario from a clean same-origin state.
  // The about:blank document has an opaque origin and does not expose localStorage.
  await page.evaluate(()=>localStorage.clear());
  // Ask the installed Supabase JS client for its actual storage key instead of
  // guessing from the local URL hostname (which differs across local runtimes).
  const storageKey = await page.evaluate(({ url, key }) => {
    if (!window.supabase?.createClient) throw new Error("Supabase JS client library did not load.");
    const probe = window.supabase.createClient(url, key);
    return probe.auth.storageKey;
  }, { url: apiUrl, key: anonKey });
  if (!storageKey) throw new Error("Supabase JS did not expose its session storage key.");
  await page.evaluate(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: storageKey, value: session });
  await page.reload();
  await expect.poll(() => page.evaluate(key => localStorage.getItem(key) !== null, storageKey)).toBe(true);
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
    await expect(page.locator(".quiz-home-hero")).toBeVisible();
    await expect(page.locator(".quiz-difficulty-grid .quiz-difficulty-option")).toHaveCount(3);
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
      authStorageKeys: Object.keys(localStorage).filter(key => key.includes("auth-token")), localStorageKeys: Object.keys(localStorage), sessionStorageKeys: Object.keys(sessionStorage)
    }));
    throw new Error("Authenticated Quiz did not initialize. Browser diagnostics: " +
      JSON.stringify(diagnostics) + "; browser errors: " + browserDiagnostics.join(" | ") +
      "; original error: " + error.message);
  }
}

async function startQuiz(page,difficulty="beginner") {
  const nativeDialogsBefore=page.__quizNativeDialogCount||0;
  await page.locator(`[data-quiz-start="${difficulty}"]`).click();
  const modal=page.locator(".lesson-start-confirm-backdrop");
  await expect(modal).toBeVisible({timeout:10000});
  const filter=await modal.evaluate(node=>getComputedStyle(node).backdropFilter);
  expect(filter).toContain("blur");
  expect(page.__quizNativeDialogCount||0).toBe(nativeDialogsBefore);
  await modal.locator('[data-confirm="yes"]').click();
  await expect(modal).toBeHidden();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizPage > .learning-banner")).toBeHidden();
}

async function submitQuiz(page) {
  const nativeDialogsBefore=page.__quizNativeDialogCount||0;
  await page.locator("#quizSubmit").click();
  const modal=page.locator(".lesson-start-confirm-backdrop");
  await expect(modal).toBeVisible({timeout:10000});
  const filter=await modal.evaluate(node=>getComputedStyle(node).backdropFilter);
  expect(filter).toContain("blur");
  expect(page.__quizNativeDialogCount||0).toBe(nativeDialogsBefore);
  await modal.locator('[data-confirm="yes"]').click();
  await expect(modal).toBeHidden();
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("#quizPage > .learning-banner")).toBeHidden();
  await expect(page.locator("#quizResultsContent [data-quiz-review-close]")).toBeVisible();
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
  test.setTimeout(120000);
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
  const lessonPrompt=page.locator(".lesson-start-confirm-backdrop");
  await expect(lessonPrompt).toBeVisible();
  // Force a lesson-card refresh while the confirmation is open. The
  // allowance refresh can replace the original button node before confirm.
  const lessonTopicFilter = page.locator("#lessonTopicFilter");
  const selectedTopic = (await page.locator("#lessonCards .lesson-card").first().locator(".lesson-chip").textContent()).trim();
  const topicOption = lessonTopicFilter.locator("option").filter({ hasText: selectedTopic }).first();
  const topicValue = await topicOption.getAttribute("value");
  await page.evaluate(value => {
    const filter = document.querySelector("#lessonTopicFilter");
    filter.value = value;
    filter.dispatchEvent(new Event("change", { bubbles: true }));
    filter.value = "all";
    filter.dispatchEvent(new Event("change", { bubbles: true }));
  }, topicValue);
  await expect(lessonPrompt).toBeVisible();
  await lessonPrompt.locator('[data-confirm="yes"]').click();
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
  await selectTranslationAndWaitForSave(page,"en");
  await expect(page.locator("#lessonReaderContent h2")).toHaveText("Build a clear basic sentence");
  await expect(page.locator('input[name="lessonAnswer0"][value="1"]')).toBeChecked();
  await selectTranslationAndWaitForSave(page,"zh");
  await expect(page.locator("#lessonReaderContent h2")).toHaveText("构建清晰的基本句子");
  await expect(page.locator('input[name="lessonAnswer0"][value="1"]')).toBeChecked();
  await selectTranslationAndWaitForSave(page,"ms");
  const expectedMalayPractice=await page.evaluate(()=>window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS.lessons.en[ls.active.id][0].q);
  expect(expectedMalayPractice).toBeTruthy();
  await expect(page.locator(".lesson-question-title").first()).toContainText(expectedMalayPractice);
  await selectTranslationAndWaitForSave(page,"zh");
  await expect(page.locator("#lessonReaderContent h2")).toHaveText("构建清晰的基本句子");

  // Ensure the authenticated preference has settled in the disposable DB before
  // the Quiz page snapshots its language pair. The selector change above is
  // also exercised in the UI; this removes a race between the queued upsert and
  // the next hash navigation in a fast CI browser.
  await updateTranslationPreference(freeUserId, "zh");
  await page.goto("/#quiz");
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#translationSelect")).toHaveValue("zh");
  await expect(page.locator("#quizAllowanceText")).toContainText("1 / 1");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("Preferred question-bank target met");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("approved");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("You have used today's Quiz allowance");
  await expect(page.locator('[data-quiz-start="beginner"]'),
    "Beginner availability diagnostics: " + await page.locator("#quizDifficultyGrid").innerText()
  ).toBeEnabled();

  await startQuiz(page,"beginner");
  await expect(page.locator("#quizSession"),
    "Beginner Quiz failed to render. Status: " + await page.locator("#quizStatus").innerText()
  ).toBeVisible({ timeout: 15000 });
  await expect(page.locator("#quizQuestionCounter")).toHaveText("第 1 题，共 10 题",{timeout:15000});
  const englishSnapshot=await page.evaluate(()=>({
    selector:document.getElementById("translationSelect")?.value,
    learning:quizPageState.session?.learning_language_code,
    translation:quizPageState.session?.translation_language_code
  }));
  expect(englishSnapshot).toMatchObject({selector:"zh",learning:"en",translation:"zh"});
  const targetPosition=await page.evaluate(()=>quizPageState.session.questions.find(q=>q.question_type!=="chinese_translation"&&String(q.prompt_translation||"").trim())?.position||0);
  expect(targetPosition).toBeGreaterThan(0);
  expect(targetPosition).toBeLessThan(10);
  for(let position=1;position<targetPosition;position++){
    const currentType=await page.evaluate(()=>quizPageState.session.questions.find(q=>q.position===quizPageState.session.current_position)?.question_type);
    expect(currentType).toBe("chinese_translation");
    await expect(page.locator("#quizQuestionArea .quiz-question-pinyin")).toHaveCount(0);
    await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
    await page.locator('[data-quiz-option="a"]').click();
    await page.locator("#quizNext").click();
    await expect(page.locator("#quizQuestionCounter")).toHaveText(`第 ${position+1} 题，共 10 题`);
  }
  const targetPrompt=await page.evaluate(()=>quizPageState.session.questions.find(q=>q.position===quizPageState.session.current_position)?.prompt_translation||"");
  expect(targetPrompt.trim()).not.toBe("");
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toBeVisible();
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toContainText(targetPrompt);

  // Translation changes redraw the current question without discarding answers.
  await selectTranslationAndWaitForSave(page,"en");
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
  await expect(page.locator("#quizTranslationNotice")).toContainText("learning-language text");
  await selectTranslationAndWaitForSave(page,"zh");
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toContainText(targetPrompt);
  await expect(page.locator("#quizTranslationNotice")).toContainText("本次测验正在使用你选择的翻译语言");

  // The learner can change an answer before submission.
  await page.locator('[data-quiz-option="b"]').click();
  await expect(page.locator('[data-quiz-option="b"]')).toHaveAttribute("aria-pressed", "true");
  await expect.poll(()=>page.evaluate(()=>quizPageState.saving)).toBe(false);
  await expect.poll(()=>page.evaluate(()=>quizPageState.session.questions.find(q=>q.position===quizPageState.session.current_position)?.selected_option_id)).toBe("b");
  await page.locator('[data-quiz-option="a"]').click();
  await expect(page.locator('[data-quiz-option="a"]')).toHaveAttribute("aria-pressed", "true");
  await expect.poll(()=>page.evaluate(()=>quizPageState.saving)).toBe(false);
  await expect.poll(()=>page.evaluate(()=>quizPageState.session.questions.find(q=>q.position===quizPageState.session.current_position)?.selected_option_id)).toBe("a");
  await page.locator("#quizNext").click();
  const nextPosition=targetPosition+1;
  await expect(page.locator("#quizQuestionCounter")).toHaveText(`第 ${nextPosition} 题，共 10 题`,{timeout:15000});

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
  await expect(page.locator("#quizQuestionCounter")).toHaveText(`第 ${nextPosition} 题，共 10 题`);
  await page.locator("#quizPrevious").click();
  await expect(page.locator("#quizQuestionCounter")).toHaveText(`第 ${targetPosition} 题，共 10 题`);
  await expect(page.locator('[data-quiz-option="a"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator("#quizNext").click();

  // English is already present as the learning-language text in this snapshot.
  // Selecting it must refresh the active session immediately without changing
  // the server-owned answers or question position.
  await updateTranslationPreference(freeUserId, "en");
  await page.reload();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#translationSelect")).toHaveValue("en");
  await page.locator("#quizResume").click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
  await expect(page.locator("#quizTranslationNotice")).toContainText("learning-language text");
  await expect(page.locator("#quizQuestionCounter")).toHaveText(`Question ${nextPosition} of 10`);
  await page.locator("#quizPrevious").click();
  await expect(page.locator("#quizQuestionCounter")).toHaveText(`Question ${targetPosition} of 10`);
  await expect(page.locator('[data-quiz-option="a"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator("#quizNext").click();

  for(let position=nextPosition;position<=10;position++){
    await page.locator('[data-quiz-option="a"]').click();
    await expect(page.locator('[data-quiz-option="a"]')).toHaveAttribute("aria-pressed", "true");
    if(position<10){
      await page.locator("#quizNext").click();
      await expect(page.locator("#quizQuestionCounter")).toHaveText(`Question ${position+1} of 10`,{timeout:10000});
    }
  }
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 10 of 10");
  await expect(page.locator("#quizNext")).toBeHidden();
  await expect(page.locator("#quizSubmit")).toBeEnabled();

  const nativeDialogsBeforeSubmit=page.__quizNativeDialogCount||0;
  const submitPrompt=page.locator(".lesson-start-confirm-backdrop");
  await page.locator("#quizSubmit").click();
  await expect(submitPrompt).toBeVisible();
  await expect(submitPrompt.locator("p")).toContainText(/Submit this Quiz|提交/);
  const submitBackdropFilter=await submitPrompt.evaluate(node=>getComputedStyle(node).backdropFilter);
  expect(submitBackdropFilter).toContain("blur");
  expect(page.__quizNativeDialogCount||0).toBe(nativeDialogsBeforeSubmit);
  await submitPrompt.locator('[data-confirm="no"]').click();
  await expect(submitPrompt).toBeHidden();
  await expect(page.locator("#quizSession")).toBeVisible();
  await page.locator("#quizSubmit").click();
  await expect(submitPrompt).toBeVisible();
  await submitPrompt.locator('[data-confirm="yes"]').click();
  await expect(submitPrompt).toBeHidden();
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("#quizResultsContent .quiz-review-summary")).toContainText("100%");
  await expect(page.locator("#quizResultsContent .quiz-review-score")).toContainText("10 / 10 correct");
  await expect(page.locator("#quizResultsContent .quiz-review-question")).toHaveCount(10);
  await expect(page.locator("#quizResultsContent .quiz-review-explanation")).toHaveCount(10);

  await page.locator("#quizResultsHome").click();
  await expect(page.locator("#quizAllowanceText")).toHaveText("0 of 1 remaining");
  await expect(page.locator("#swiftDictionaryToast")).toContainText(/Quiz allowance|测验额度/);
  await expect(page.locator("#quizHistory [data-quiz-review]")).toHaveCount(1);
  await page.locator("#quizHistory [data-quiz-review]").click();
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("#quizResultsContent .quiz-review-question")).toHaveCount(10);
  await expect(page.locator("#quizResultsHome")).toHaveText("← Back to Quiz");
  await page.locator("#quizResultsHome").click();
  await expect(page.locator("#quizHome")).toBeVisible();

  // Quiz history is grouped in Daily History, not Analytics.
  await page.goto("/#profile");
  await expect(page.locator("#profileContent")).toBeVisible();
  await page.locator('[data-dashboard-tab="history"]').click();
  const dashboardHistoryDiagnostics = await page.locator("#dashboardDailyHistory").innerText();
  const dashboardProfileStatus = await page.locator("#preferenceStatus").innerText();
  await expect(page.locator("#dashboardDailyHistory [data-dashboard-daily-quiz-review]"), "Dashboard history: "+dashboardHistoryDiagnostics+"; profile status: "+dashboardProfileStatus).toHaveCount(1);
  await expect(page.locator("#dashboardDailyHistory")).toContainText("100%");
  await expect(page.locator("#dashboardDailyHistory")).toContainText("10/10 correct");
  await page.locator("#dashboardDailyHistory [data-dashboard-daily-quiz-review]").click();
  await expect(page.locator("#dashboardReviewOverlay")).toBeVisible();
  await expect(page.locator("#dashboardReviewContent .quiz-review-question")).toHaveCount(10);
  await expect(page.locator("#profilePage")).toBeVisible();
  await expect(page).toHaveURL(/#profile$/);
  await page.locator("[data-dashboard-review-close]").click();
  await expect(page.locator("#dashboardReviewOverlay")).toBeHidden();
});


test("Quiz preserves an unavailable translation snapshot and applies the preference to the next session", async ({ page }) => {
  // Begin with an English-only snapshot. The account preference is then
  // changed to Chinese, which is not present in this active session.
  await updateTranslationPreference(freeUserId, "en");
  await openQuiz(page, freeSession);
  await startQuiz(page,"beginner");
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
  await expect(page.locator("#quizTranslationNotice")).toContainText("不包含在本次测验快照中");
  await expect(page.locator("#quizTranslationNotice")).toContainText("新偏好将在下一次测验生效");
  await expect(page.locator("#quizQuestionCounter")).toHaveText("第 1 题，共 10 题");
  await expect(page.locator('[data-quiz-option="b"]')).toHaveAttribute("aria-pressed", "true");

  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();

  // The first successful start has already consumed the Free daily allowance.
  // Use a fresh disposable account to verify the next-session preference.
  const nextUser=await createRuntimeUser("translation-snapshot-next","free");
  const nextSession=await signIn(nextUser.email,nextUser.password);
  await updateTranslationPreference(nextUser.id,"zh");
  const nextContext=page.context();
  await page.close();
  const nextPage=await nextContext.newPage();
  await openQuiz(nextPage,nextSession);
  await expect(nextPage.locator("#quizHome")).toBeVisible();
  if(await nextPage.locator("#learningIntroBackdrop").isVisible()){
    await nextPage.locator("#learningIntroDismiss").click();
    await expect(nextPage.locator("#learningIntroBackdrop")).toBeHidden();
  }
  await startQuiz(nextPage,"beginner");
  await expect(nextPage.locator("#quizSession")).toBeVisible();
  const questionTypes = [];
  for (let position=1;position<=10;position++) {
    questionTypes.push(await nextPage.locator("#quizQuestionArea").getAttribute("data-question-type"));
    if(position<10) await nextPage.locator("#quizNext").click();
  }
  expect(questionTypes).toContain("chinese_translation");
});

test("learning introductions are independent per page and help controls reopen them", async ({ page }) => {
  await openQuiz(page, freeSession);
  // This test asserts the English introduction copy; the disposable account
  // is initially configured with Chinese as its translation language.
  await selectTranslationAndWaitForSave(page,"en");
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
  await expect(page.locator("#learningIntroTitle")).toHaveText(/^(Welcome to Flashcards|欢迎使用闪卡)$/);
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

test("Chinese course enables Chinese Lessons, Quiz and Flashcards", async ({ page }) => {
  await openQuiz(page, freeSession);
  await selectCourse(page,"zh");
  await expect(page.locator("#quizChineseUnavailable")).toBeHidden();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator('[data-quiz-start="beginner"]')).toBeEnabled();
  await selectCourse(page,"en");
  await expect(page.locator("#quizChineseUnavailable")).toBeHidden();
  await expect(page.locator("#quizHome")).toBeVisible();

  await page.goto("/#lessons");
  await expect(page.locator("#learningIntroBackdrop")).toBeVisible();
  await page.locator("#learningIntroDismiss").click();
  await selectCourse(page,"zh");
  await expect(page.locator("#lessonsChineseUnavailable")).toBeHidden();
  await expect(page.locator("#lessonLibrary")).toBeVisible();
  await expect(page.locator("#lessonCards .lesson-card")).toHaveCount(7);
  await expect(page.locator("#lessonCards .lesson-card").first().locator("h3 .lesson-chinese-line")).toContainText("拼音");
  await selectCourse(page,"en");
  await expect(page.locator("#lessonsChineseUnavailable")).toBeHidden();
  await expect(page.locator("#lessonLibrary")).toBeVisible();

  await page.goto("/#flashcards");
  await expect(page.locator("#learningIntroBackdrop")).toBeVisible();
  await page.locator("#learningIntroDismiss").click();
  await selectCourse(page,"zh");
  await expect(page.locator("#flashcardsChineseUnavailable")).toBeHidden();
  await expect(page.locator("#flashcardsPage .flash-mode-grid")).toBeVisible();
  await expect(page.locator('#flashcardsPage .flash-mode[data-mode="translation"]')).toBeVisible();
  await selectCourse(page,"en");
  await expect(page.locator("#flashcardsChineseUnavailable")).toBeHidden();
  await expect(page.locator("#flashcardsPage .flash-section").first()).toBeVisible();
});

test("Premium user has three daily Quiz starts; abandonment does not refund allowance and one active session is enforced", async ({ page }) => {
  await openQuiz(page, premiumSession);
  await expect(page.locator("#quizAllowanceText")).toHaveText("3 / 3 今日剩余");
  await expect(page.locator('[data-quiz-start="advanced"]'),
    "Advanced availability diagnostics: " + await page.locator("#quizDifficultyGrid").innerText()
  ).toBeEnabled();

  const startDiagnostics=[];
  page.on("request",request=>{if(request.url().includes("/rpc/start_my_quiz"))startDiagnostics.push({event:"request",url:request.url(),body:request.postData()});});
  page.on("response",async response=>{if(response.url().includes("/rpc/start_my_quiz")){let body="";try{body=await response.text();}catch{}startDiagnostics.push({event:"response",status:response.status(),body});}});
  page.on("requestfailed",request=>{if(request.url().includes("/rpc/start_my_quiz"))startDiagnostics.push({event:"failed",error:request.failure()?.errorText||"unknown"});});
  await startQuiz(page,"advanced");
  try {
    await expect(page.locator("#quizSession")).toBeVisible({ timeout: 15000 });
  } catch (error) {
    const state=await page.evaluate(()=>({userId:currentUser?.id,requestedUserId:quizPageState.userId,translation:translationLanguage,selector:document.querySelector("#translationSelect")?.value,sessionView:quizPageState.sessionView,sessionId:quizPageState.session?.session_id,quizStatus:document.querySelector("#quizStatus")?.textContent}));
    throw new Error("Advanced Quiz did not render. State: "+JSON.stringify(state)+"; RPC diagnostics: "+JSON.stringify(startDiagnostics)+"; "+error.message);
  }
  await expect(page.locator("#quizQuestionCounter")).toHaveText("第 1 题，共 20 题");
  const advancedComposition=await page.evaluate(()=>{
    const actual={beginner:0,intermediate:0,advanced:0};
    for(const q of quizPageState.session.questions)actual[q.source_difficulty]=(actual[q.source_difficulty]||0)+1;
    return {expected:quizPageState.session.source_composition,actual};
  });
  expect(advancedComposition.actual).toEqual(advancedComposition.expected);

  // Returning to overview and attempting a different difficulty must resume
  // the existing server-owned session rather than create a second one.
  await page.locator("#quizBackHome").click();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizActiveCard")).toBeVisible();
  // A second difficulty must remain unavailable while the server-owned
  // active session exists. Resume the existing session instead of clicking
  // the intentionally disabled start button. The start already consumed one
  // allowance, and abandoning the session does not refund it.
  await expect(page.locator('[data-quiz-start="intermediate"]')).toBeDisabled();
  await page.locator("#quizResume").click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizSessionDifficulty")).toHaveText("高级");

  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizAllowanceText")).toHaveText("2 / 3 今日剩余");
  await expect(page.locator("#quizActiveCard")).toBeHidden();
});

test("Quiz overview follows translation preference and selector changes preserve an active session", async ({ page }) => {
  await updateTranslationPreference(freeUserId,"en");
  await openQuiz(page, freeSession);
  await expect(page.locator("#quizHeading")).toHaveText("Quiz");
  await expect(page.locator("#quizPage .learning-banner .page-intro")).toContainText("Test your understanding");
  await expect(page.locator("#quizRefresh")).toHaveText("Refresh");
  await expect(page.locator(".quiz-difficulty-heading h2")).toHaveText("Choose a difficulty");
  await expect(page.locator("#quizDifficultyGrid .quiz-difficulty-option h3").first()).toHaveText("Beginner");

  await selectTranslation(page,"zh");
  await expect(page.locator("#preferenceRefreshToast")).toHaveClass(/visible/);
  await expect(page.locator("#quizHeading")).toHaveText("测验");
  await expect(page.locator("#quizAllowanceText")).toContainText("1 / 1");
  await expect(page.locator("#quizDifficultyGrid .quiz-difficulty-option h3").first()).toHaveText("初级");
  await expect(page.locator("#preferenceRefreshToast")).not.toHaveClass(/visible/,{timeout:5000});

  await startQuiz(page,"beginner");
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizHome")).toBeHidden();
  const languageState = await page.evaluate(() => ({ selector:document.querySelector("#translationSelect")?.value, global:translationLanguage, sessionView:quizPageState.sessionView, sessionVisible:!document.querySelector("#quizSession")?.hidden }));
  expect(languageState).toEqual({selector:"zh",global:"zh",sessionView:true,sessionVisible:true});
  await expect(page.locator("#quizQuestionCounter")).toHaveText("第 1 题，共 10 题");
  await selectTranslation(page,"en");
  await expect(page.locator("#preferenceRefreshToast")).toHaveClass(/visible/);
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizHome")).toBeHidden();
  await expect(page.locator("#quizTranslationNotice")).toContainText("This Quiz is showing its learning-language text");
  await expect(page.locator("#quizQuestionCounter")).toHaveText("Question 1 of 10");
  await selectTranslation(page,"zh");
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizHome")).toBeHidden();
  await expect(page.locator("#quizTranslationNotice")).toContainText("本次测验正在使用你选择的翻译语言");
  await expect(page.locator("#quizQuestionCounter")).toHaveText("第 1 题，共 10 题");
});
test("Translation changes on the Quiz overview do not auto-open an unfinished session", async ({ page }) => {
  await updateTranslationPreference(freeUserId,"zh");
  await openQuiz(page,freeSession);
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizHeading")).toHaveText("测验");
  await expect(page.locator("#quizPage .learning-banner .page-intro")).toContainText("通过不同主题的问题检验你的理解");
  await expect(page.locator("#quizRefresh")).toHaveText("刷新");
  await expect(page.locator(".quiz-difficulty-heading h2")).toHaveText("选择难度");
  await expect(page.locator("#quizDifficultyGrid .quiz-difficulty-option h3").first()).toHaveText("初级");
  await startQuiz(page,"beginner");
  await expect(page.locator("#quizSession")).toBeVisible();
  await page.locator("#quizBackHome").click();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizActiveCard")).toBeVisible();
  await expect(page.locator("#quizSession")).toBeHidden();

  await selectTranslation(page,"en");
  await expect(page.locator("#preferenceRefreshToast")).toHaveClass(/visible/);
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizActiveCard")).toBeVisible();
  await expect(page.locator("#quizSession")).toBeHidden();

  await page.locator("#quizResume").click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await selectTranslation(page,"zh");
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizHome")).toBeHidden();
  await expect(page.locator("#quizQuestionCounter")).toHaveText("第 1 题，共 10 题");
});
test("Changing course during an active Quiz switches to the selected course overview",async({page})=>{
  await openQuiz(page,freeSession);
  await selectCourse(page,"zh");
  await expect.poll(()=>page.evaluate(()=>quizPageState.availability?.learning_language_code)).toBe("zh");
  await startQuiz(page,"beginner");
  await expect(page.locator("#quizSession")).toBeVisible();

  await selectCourse(page,"ms");
  await expect.poll(()=>page.evaluate(()=>quizPageState.availability?.learning_language_code)).toBe("ms");
  await expect(page.locator("#quizSession")).toBeHidden();
  await expect(page.locator("#quizResults")).toBeHidden();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizDifficultyGrid")).toContainText("日常马来语词汇");

  await selectCourse(page,"en");
  await expect.poll(()=>page.evaluate(()=>quizPageState.availability?.learning_language_code)).toBe("en");
  await expect(page.locator("#quizDifficultyGrid")).toContainText("基础词汇");
  await expect(page.locator("#quizHome")).toBeVisible();
});

test("Quiz overview refreshes its question bank for every supported learning course", async ({ page }) => {
  await openQuiz(page, freeSession);
  await selectCourseAndWaitForSave(page,"zh");
  // The learning course is Chinese, while the selected interface/translation language remains English.
  await expect(page.locator("#quizChineseUnavailable")).toBeHidden();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator('[data-quiz-start="beginner"]')).toBeEnabled();
  await expect.poll(()=>page.evaluate(()=>quizPageState.availability?.learning_language_code)).toBe("zh");
  await expect.poll(()=>page.evaluate(async()=>{const {data}=await supabaseClient.from("user_preferences").select("learning_language").eq("user_id",currentUser.id).single();return data?.learning_language;})).toBe("zh");
  await expect(page.locator("#quizDifficultyGrid")).toContainText("建立汉字");
  await expect(page.locator("#preferenceRefreshToast")).toHaveClass(/visible/);

  await selectCourseAndWaitForSave(page,"ms");
  await expect.poll(()=>page.evaluate(()=>quizPageState.availability?.learning_language_code)).toBe("ms");
  await expect.poll(()=>page.evaluate(async()=>{const {data}=await supabaseClient.from("user_preferences").select("learning_language").eq("user_id",currentUser.id).single();return data?.learning_language;})).toBe("ms");
  await expect(page.locator("#quizDifficultyGrid")).toContainText("日常马来语词汇");
  await expect(page.locator("#quizChineseUnavailable")).toBeHidden();

  const quizRequestsBeforeEnglish=await page.evaluate(()=>quizHomeRequestId);
  await selectCourseAndWaitForSave(page,"en");
  await expect.poll(()=>page.evaluate(()=>quizHomeRequestId)).toBeGreaterThan(quizRequestsBeforeEnglish);
  await expect.poll(()=>page.evaluate(()=>quizPageState.availability?.learning_language_code)).toBe("en");
  await expect.poll(()=>page.evaluate(async()=>{const {data}=await supabaseClient.from("user_preferences").select("learning_language").eq("user_id",currentUser.id).single();return data?.learning_language;})).toBe("en");
  await expect(page.locator("#quizDifficultyGrid")).toContainText("基础词汇");
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#preferenceRefreshToast")).toHaveClass(/visible/);
});

test("Quiz course switching remains consistent across repeated English, Chinese and Malay changes",async({page})=>{
  test.setTimeout(120000);
  await openQuiz(page,freeSession);
  const sequence=["zh","ms","en","ms","zh","en"];
  for(const language of sequence){
    const previousRequest=await page.evaluate(()=>quizHomeRequestId);
    await selectCourseAndWaitForSave(page,language);
    await expect.poll(()=>page.evaluate(()=>quizPageState.availability?.learning_language_code),{timeout:20000}).toBe(language);
    await expect.poll(()=>page.evaluate(()=>quizHomeRequestId),{timeout:20000}).toBeGreaterThan(previousRequest);
    await expect(page.locator("#quizHome")).toBeVisible();
    await expect(page.locator("#quizSession")).toBeHidden();
    await expect(page.locator("#quizResults")).toBeHidden();
    const expected=language==="zh"?"建立汉字":language==="ms"?"日常马来语词汇":"基础词汇";
    await expect(page.locator("#quizDifficultyGrid")).toContainText(expected);
    await expect.poll(()=>page.evaluate(async()=>{
      const {data,error}=await supabaseClient.from("user_preferences").select("learning_language").eq("user_id",currentUser.id).single();
      if(error)throw error;
      return data?.learning_language;
    })).toBe(language);
  }
});

test("Chinese Quiz choices do not reveal answers through English translations or Pinyin",async({page})=>{
  await openQuiz(page,freeSession);
  await selectCourse(page,"zh");
  await startQuiz(page,"beginner");
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizQuestionArea .quiz-option-copy small")).toHaveCount(0);
  await expect(page.locator("#quizQuestionArea .quiz-option-pinyin")).toHaveCount(0);
  const snapshot=await page.evaluate(()=>{
    const q=quizPageState.session.questions.find(item=>item.position===quizPageState.session.current_position);
    return {language:quizPageState.session.learning_language_code,options:[...document.querySelectorAll("#quizQuestionArea .quiz-option-copy")].map(node=>node.innerText),prompt:q?.prompt_learning,translation:q?.prompt_translation};
  });
  expect(snapshot.language).toBe("zh");
  expect(snapshot.options.length).toBe(4);
  expect(snapshot.options.every(value=>value.trim().length>0)).toBe(true);
});
test("Quiz overview and active test use the redesigned layout and directional transitions",async({page})=>{
  await openQuiz(page,freeSession);
  await expect(page.locator(".quiz-home-hero")).toBeVisible();
  await expect(page.locator(".quiz-home-benefits span")).toHaveCount(3);
  await page.evaluate(()=>{
    window.__quizScreenAnimations=[];
    document.getElementById("quizSession").addEventListener("animationstart",event=>window.__quizScreenAnimations.push(event.animationName));
  });
  await startQuiz(page,"beginner");
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>window.__quizScreenAnimations)).toContain("quizScreenEnter");
  await expect(page.locator(".quiz-question-card")).toBeVisible();
  await expect(page.locator(".quiz-question-card .quiz-question-topic")).not.toBeEmpty();
  await page.evaluate(()=>{
    window.__quizAnimationNames=[];
    document.getElementById("quizQuestionArea").addEventListener("animationstart",event=>window.__quizAnimationNames.push(event.animationName));
  });
  await page.locator("#quizNext").click();
  await expect(page.locator("#quizQuestionCounter")).toContainText("2");
  await expect.poll(()=>page.evaluate(()=>window.__quizAnimationNames)).toContain("quizSlideFromRight");
  await page.locator("#quizPrevious").click();
  await expect(page.locator("#quizQuestionCounter")).toContainText("1");
  await expect.poll(()=>page.evaluate(()=>window.__quizAnimationNames)).toContain("quizSlideFromLeft");
});

test("Daily History reviews a completed Quiz without leaving Dashboard",async({page})=>{
  await openQuiz(page,freeSession);
  await startQuiz(page,"beginner");
  await expect(page.locator("#quizSession")).toBeVisible({timeout:15000});
  for(let position=1;position<=10;position++){
    await page.locator("#quizQuestionArea .quiz-option").first().click();
    if(position<10){
      await expect(page.locator("#quizNext")).toBeEnabled();
      await page.locator("#quizNext").click();
      await expect(page.locator("#quizQuestionCounter")).toContainText(String(position+1));
    }
  }
  await expect(page.locator("#quizSubmit")).toBeEnabled();

  const submitPrompt=page.locator(".lesson-start-confirm-backdrop");
  await page.locator("#quizSubmit").click();
  await expect(submitPrompt).toBeVisible();
  await submitPrompt.locator('[data-confirm="yes"]').click();
  await expect(submitPrompt).toBeHidden();
  await expect(page.locator("#quizResults")).toBeVisible({timeout:15000});
  await page.locator("#accountButton").click();
  await page.locator("#menuProfile").click();
  await expect(page.locator("#profilePage")).toBeVisible();
  await page.locator('[data-dashboard-tab="history"]').click();
  const review=page.locator("#dashboardDailyHistory [data-dashboard-daily-quiz-review]");
  await expect(review).toBeVisible({timeout:15000});
  await review.click();
  await expect(page.locator("#dashboardReviewOverlay")).toBeVisible();
  await expect(page.locator("#dashboardReviewTitle")).toHaveText(/^(Quiz review|测验复习)$/);
  await expect(page.locator("#dashboardReviewContent .quiz-review-question")).toHaveCount(10);
  await expect(page.locator("#profilePage")).toBeVisible();
  expect(new URL(page.url()).hash).toBe("#profile");
  await page.locator("[data-dashboard-review-close]").click();
  await expect(page.locator("#dashboardReviewOverlay")).toBeHidden();
});

test("Dashboard Daily History segments Quiz records and keeps Quiz review in History", async ({ page }) => {
  await openQuiz(page, freeSession);
  await page.evaluate(() => {
    showPage("profile", false);
    document.querySelector("#profileContent").hidden = false;
    const now=new Date().toISOString();
    renderDashboardDailyHistory({today:new Intl.DateTimeFormat("en-CA",{timeZone:"UTC",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()),timezone:"UTC",lessonRows:[],dailyRows:[],quizRows:[{completed_at:now,difficulty:"beginner",correct_count:10,question_count:10,percentage:100,session_id:"completed-session-id"}],flashcardRows:[]});
  });
  await page.locator('[data-dashboard-tab="history"]').click();
  await expect(page.locator("#dashboardDailyHistory .dashboard-history-lessons")).toBeVisible();
  await expect(page.locator("#dashboardDailyHistory .dashboard-history-quiz")).toContainText("10/10 correct");
  await expect(page.locator("#dashboardDailyHistory .dashboard-history-flashcards")).toBeVisible();
  const reviewButton=page.locator("#dashboardDailyHistory .dashboard-history-quiz [data-dashboard-daily-quiz-review]");
  await expect(reviewButton).toBeVisible();
  await expect(reviewButton).toHaveText(/Review answers|查看答案/);
  await expect(page.locator("#dashboardTabAnalytics #dashboardQuizHistory")).toHaveCount(0);
});

test("ordinary Dashboard navigation to Quiz opens the overview, not completed review", async ({ page }) => {
  await openQuiz(page, freeSession);
  await page.evaluate(() => showPage("profile", false));
  await expect(page.locator("#profilePage")).toBeVisible();
  await page.evaluate(() => {
    quizPageState.result = { session_id: "previously-completed-session" };
    quizPageState.returnPage = "profile";
    quizPageState.sessionView = true;
    document.querySelector("#quizResults").hidden = false;
    document.querySelector("#quizHome").hidden = true;
  });
  await page.evaluate(() => showPage("quiz", false));
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizResults")).toBeHidden();
  await expect(page.locator("#quizSession")).toBeHidden();
  const state = await page.evaluate(() => ({
    result: quizPageState.result,
    returnPage: quizPageState.returnPage,
    sessionView: quizPageState.sessionView
  }));
  expect(state).toEqual({ result: null, returnPage: "quiz", sessionView: false });
});

test("signed-out visitors cannot open Quiz sessions or account history", async ({ page }) => {
  await installLocalSupabaseConfig(page);
  await page.goto("/#quiz");
  await expect(page.locator("#quizPage")).toBeVisible({ timeout: 20000 });
  await expect(page.locator("#quizSignedOut")).toBeVisible();
  await expect(page.locator("#quizHome")).toBeHidden();
  await expect(page.locator("#quizSession")).toBeHidden();
});

test("signed-out Lessons shows the same account gate and hides lesson content",async({page})=>{
  await installLocalSupabaseConfig(page);
  await page.goto("/#lessons");
  await expect(page.locator("#lessonsPage")).toBeVisible({timeout:20000});
  await expect(page.locator("#lessonsSignedOut")).toBeVisible();
  await expect(page.locator("#lessonsSignIn")).toBeVisible();
  await expect(page.locator("#dailyLearningPage")).toBeHidden();
  await expect(page.locator(".difficulty-tabs")).toBeHidden();
  await expect(page.locator("#lessonLibrary")).toBeHidden();
  await expect(page.locator("#lessonsSignedOut")).toHaveClass(/learning-auth-card/);
});

test("signed-out Quiz uses the shared Flashcards-style sign-in card",async({page})=>{
  await installLocalSupabaseConfig(page);
  await page.goto("/#quiz");
  await expect(page.locator("#quizPage")).toBeVisible({timeout:20000});
  await expect(page.locator("#quizSignedOut")).toBeVisible();
  await expect(page.locator("#quizSignedOut")).toHaveClass(/learning-auth-card/);
  await expect(page.locator("#quizSignIn")).toHaveClass(/learning-auth-button/);
});


test("Chinese Quiz respects the selected translation language", async ({ page }) => {
  await updateLearningPreference(freeUserId,"zh","en");
  await openQuiz(page,freeSession);
  await expect(page.locator("#courseSelect")).toHaveValue("zh");
  await expect(page.locator("#translationSelect")).toHaveValue("en");
  await startQuiz(page,"beginner");
  await expect(page.locator("#quizSession")).toBeVisible({timeout:15000});
  const chineseSnapshot=await page.evaluate(()=>({
    selector:document.getElementById("translationSelect")?.value,
    learning:quizPageState.session?.learning_language_code,
    translation:quizPageState.session?.translation_language_code,
    prompt:quizPageState.session?.questions?.[0]?.prompt_translation
  }));
  expect(chineseSnapshot).toMatchObject({selector:"en",learning:"zh",translation:"en"});
  const hasChineseKnowledgeTranslation=await page.evaluate(()=>quizPageState.session.questions.some(q=>q.question_type!=="chinese_translation"&&String(q.prompt_translation||"").trim()));
  expect(hasChineseKnowledgeTranslation).toBe(true);

  const waitForRenderedQuestion=async targetPage=>{
    let renderedSnapshot=null;
    await expect.poll(async()=>{
      renderedSnapshot=await targetPage.evaluate(()=>{
        const pageState=typeof quizPageState!=="undefined"?quizPageState:null;
        // Wait for answer-save/navigation RPCs to finish before accepting a
        // DOM match. Otherwise the previous question can match briefly while
        // quizMove is still pending and then change underneath the assertions.
        if(!pageState||pageState.saving)return false;
        const session=pageState.session;
        const question=session?.questions?.find(q=>q.position===session.current_position);
        const area=document.getElementById("quizQuestionArea");
        if(!question||!area)return false;
        const text=selector=>area.querySelector(selector)?.textContent?.trim()||"";
        const selectedTranslation=document.getElementById("translationSelect")?.value||"en";
        const showTranslation=selectedTranslation!==(session.learning_language_code||"en")
          && question.question_type!=="chinese_translation";
        const expectedPinyin=session.learning_language_code==="zh"?String(question.prompt_pinyin||"").trim():"";
        const expectedTranslation=showTranslation?String(question.prompt_translation||"").trim():"";
        const actual={
          prompt:text(".quiz-question-prompt"),
          pinyin:text(".quiz-question-pinyin"),
          translation:text(".quiz-question-translation")
        };
        return {
          question,
          actual,
          matches:area.dataset.questionType===(question.question_type||"")
            && actual.prompt===String(question.prompt_learning||"").trim()
            && actual.pinyin===expectedPinyin
            && actual.translation===expectedTranslation
        };
      });
      return renderedSnapshot?.matches===true;
    },{timeout:10000}).toBe(true);
    // Return the exact question snapshot whose prompt and optional language
    // fields were compared with the DOM, avoiding a second read racing a
    // pending next-question render.
    return renderedSnapshot.question;
  };

  let foundTranslationQuestion=false;
  for(let position=1;position<=10;position++){
    const area=page.locator("#quizQuestionArea");
    // The server session position can advance before the directional UI transition
    // has finished. Compare the state and rendered prompt contract atomically so
    // same-type adjacent questions cannot make a stale DOM assertion pass/fail.
    const currentQuestion=await waitForRenderedQuestion(page);
    expect(Number(currentQuestion?.position)).toBe(position);
    const type=currentQuestion?.question_type;
    if(type==="chinese_translation"){
      foundTranslationQuestion=true;
      // Wait for the exact server-snapshot question to finish rendering before checking type-specific UI.
      // Translation Recall must not show a translated prompt or answer-side
      // option hints. Pinyin is optional pronunciation support on the prompt.
      await expect(area).toHaveAttribute("data-question-type","chinese_translation");
      await expect(area.locator(".quiz-question-pinyin")).toHaveCount(currentQuestion.prompt_pinyin?1:0);
      await expect(area.locator(".quiz-question-translation")).toHaveCount(0);
      await expect(area.locator(".quiz-option-pinyin")).toHaveCount(0);
      await expect(area.locator(".quiz-option-translation")).toHaveCount(0);
      break;
    }
    await expect(area).toHaveAttribute("data-question-type",type||"");
    await expect(area.locator(".quiz-question-pinyin")).toHaveCount(currentQuestion?.prompt_pinyin?1:0);
    await expect(area.locator(".quiz-question-translation")).toHaveCount(currentQuestion?.prompt_translation?1:0);
    await expect(area.locator(".quiz-option-pinyin")).toHaveCount(0);
    await expect(area.locator(".quiz-option-translation")).toHaveCount(0);
    await area.locator(".quiz-option").first().click();
    if(position<10){
      await page.locator("#quizNext").click();
      await expect.poll(()=>page.evaluate(expectedPosition=>
        !quizPageState.saving&&quizPageState.session?.current_position===expectedPosition
      ,position+1),{timeout:10000}).toBe(true);
    }
  }
  expect(foundTranslationQuestion).toBe(true);

  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();

  // Quiz starts are allowance-charged even when abandoned. Use a fresh
  // disposable account for the second translation-language snapshot check.
  const zhUser=await createRuntimeUser("zh-translation-snapshot","free");
  const zhSession=await signIn(zhUser.email,zhUser.password);
  await updateLearningPreference(zhUser.id,"zh","zh");
  const zhContext=page.context();
  await page.close();
  const zhPage=await zhContext.newPage();
  await openQuiz(zhPage,zhSession);
  await expect(zhPage.locator("#quizHome")).toBeVisible();
  if(await zhPage.locator("#learningIntroBackdrop").isVisible()){
    await zhPage.locator("#learningIntroDismiss").click();
    await expect(zhPage.locator("#learningIntroBackdrop")).toBeHidden();
  }
  await expect(zhPage.locator("#courseSelect")).toHaveValue("zh");
  await expect(zhPage.locator("#translationSelect")).toHaveValue("zh");
  await startQuiz(zhPage,"beginner");
  await expect(zhPage.locator("#quizSession")).toBeVisible({timeout:15000});

  for(let position=1;position<=10;position++){
    const area=zhPage.locator("#quizQuestionArea");
    await waitForRenderedQuestion(zhPage);
    const currentQuestion=await zhPage.evaluate(()=>quizPageState.session.questions.find(q=>q.position===quizPageState.session.current_position));
    await expect(area).toHaveAttribute("data-question-type","knowledge");
    await expect(area.locator(".quiz-question-pinyin")).toHaveCount(currentQuestion?.prompt_pinyin?1:0);
    await expect(area.locator(".quiz-question-translation")).toHaveCount(0);
    await expect(area.locator(".quiz-option-pinyin")).toHaveCount(0);
    await expect(area.locator(".quiz-option-translation")).toHaveCount(0);
    await area.locator(".quiz-option").first().click();
    if(position<10)await zhPage.locator("#quizNext").click();
  }

  await zhPage.locator("#quizAbandon").click();
  await expect(zhPage.locator("#quizHome")).toBeVisible();
});

test("Chinese Flashcards only offer card sets supported by the selected recall mode", async ({ page }) => {
  await openQuiz(page,freeSession);
  await page.goto("/#flashcards");
  await expect(page.locator("#flashcardsPage")).toBeVisible();
  if(await page.locator("#learningIntroBackdrop").isVisible()){
    await page.locator("#learningIntroDismiss").click();
    await expect(page.locator("#learningIntroBackdrop")).toBeHidden();
  }
  await selectCourse(page,"zh");
  await expect(page.locator("#flashcardsPage .flash-mode-grid")).toBeVisible();

  await page.locator('#flashcardsPage .flash-mode[data-mode="definition"]').click();
  await expect(page.locator("#flashGameCollection")).toHaveValue("all");
  await expect(page.locator('#flashGameCollection option[value="vocabulary"]')).toHaveCount(0);
  await expect(page.locator(".flash-modal")).toContainText("多字词汇卡片目前尚未支持此回忆模式");

  await page.locator('[data-action="close-overlay"]').click();
  await page.locator('#flashcardsPage .flash-mode[data-mode="translation"]').click();
  await expect(page.locator('#flashGameCollection option[value="vocabulary"]')).toHaveCount(0);

  await page.locator('[data-action="close-overlay"]').click();
  await page.locator('#flashcardsPage .flash-mode[data-mode="word"]').click();
  await expect(page.locator('#flashGameCollection option[value="vocabulary"]')).toHaveCount(1);

  await updateTranslationPreference(freeUserId,"en");
  await page.reload();
  await expect(page.locator("#flashcardsPage .flash-mode-grid")).toBeVisible();
  await page.locator('#flashcardsPage .flash-mode[data-mode="translation"]').click();
  await expect(page.locator('#flashGameCollection option[value="vocabulary"]')).toHaveCount(1);
});

test("Chinese Flashcard games save per-card snapshots and support read-only review", async ({ page }) => {
  test.setTimeout(120000);
  const user=await createRuntimeUser("flashcard-zh-review","free");
  const session=await signIn(user.email,user.password);
  await openQuiz(page,session);
  await page.locator('[data-page="flashcards"]').click();
  await expect(page.locator("#flashcardsPage .flash-mode-grid")).toBeVisible();
  if(await page.locator("#learningIntroBackdrop").isVisible()){
    await page.locator("#learningIntroDismiss").click();
    await expect(page.locator("#learningIntroBackdrop")).toBeHidden();
  }
  await selectCourseAndWaitForSave(page,"zh");
  await selectTranslation(page,"zh");
  await expect(page.locator("#flashcardsPage .flash-mode-grid")).toBeVisible();
  // The UI preference write is queued; explicitly settle the synthetic account's
  // server-side course pair before asserting the authenticated RPC restriction.
  await updateLearningPreference(user.id,"zh","zh");
  const mixedModeResponse=await api.post(apiUrl+"/rest/v1/rpc/start_my_flashcard_game",{
    headers:{apikey:anonKey,Authorization:"Bearer "+session.access_token},
    data:{p_mode:"mixed",p_difficulty:"beginner",p_duration_seconds:60}
  });
  expect(mixedModeResponse.ok()).toBe(false);
  expect(await mixedModeResponse.text()).toContain("four distinct recall modes");
  await page.locator('#flashcardsPage .flash-mode[data-mode="word"]').click();
  await expect(page.locator("#flashGameCollection")).toHaveValue("all");
  await page.locator('[data-action="begin-game"]').click();
  await expect(page.locator(".flash-game")).toBeVisible();
  await expect(page.locator("#flashGameClock")).toBeVisible();
  await expect(page.locator("#flashMemory")).not.toBeEmpty();
  await page.locator("#flashPhaseAction").click();
  await expect(page.locator(".flash-option").first()).toBeEnabled();
  await page.locator(".flash-option").first().click();
  await expect(page.locator(".flash-stats .flash-stat strong").first()).toHaveText("1");
  const clockText=await page.locator("#flashGameClock").textContent();
  const challengeSeconds=Number(String(clockText||"").replace(/\D/g,""));
  expect(challengeSeconds).toBeGreaterThan(0);
  expect(challengeSeconds).toBeLessThanOrEqual(120);

  const completionResponsePromise=page.waitForResponse(
    response=>response.url().includes("/rpc/complete_my_flashcard_game"),
    {timeout:90000}
  );
  await page.waitForTimeout((challengeSeconds+2)*1000);
  const completionResponse=await completionResponsePromise;
  const completionBody=await completionResponse.text();
  expect(completionResponse.ok(),completionBody).toBeTruthy();
  await expect(page.locator("#flashResultTitle")).toBeVisible({timeout:15000});

  const dataResponse=await api.post(apiUrl+"/rest/v1/rpc/get_my_flashcard_data",{
    headers:{apikey:anonKey,Authorization:"Bearer "+session.access_token},
    data:{}
  });
  expect(dataResponse.ok()).toBeTruthy();
  const data=await dataResponse.json();
  const latest=data.history?.[0];
  const sessionId=latest?.session_id||latest?.id;
  expect(sessionId).toBeTruthy();

  const reviewResponse=await api.post(apiUrl+"/rest/v1/rpc/get_my_flashcard_game_review",{
    headers:{apikey:anonKey,Authorization:"Bearer "+session.access_token},
    data:{p_session_id:sessionId}
  });
  expect(reviewResponse.ok()).toBeTruthy();
  const review=await reviewResponse.json();
  expect(review.review_available).toBe(true);
  expect(review.learning_language_code).toBe("zh");
  expect(review.translation_language_code).toBe("zh");
  expect(review.items.length).toBeGreaterThan(0);
  expect(review.items[0].mode).toBe("word");
  expect(review.items[0].card.course).toBe("zh");
});

test("Quiz start allowance warning uses the centered website dialog and cancellation does not consume allowance", async ({ page }) => {
  const user=await createRuntimeUser("quiz-start-confirmation-ui","free");
  const session=await signIn(user.email,user.password);
  await openQuiz(page,session);
  const nativeDialogsBefore=page.__quizNativeDialogCount||0;
  const modal=page.locator(".lesson-start-confirm-backdrop");
  await page.locator('[data-quiz-start="beginner"]').click();
  await expect(modal).toBeVisible();
  await expect(modal.locator(".lesson-start-confirm-dialog")).toBeVisible();
  await expect(modal.locator("p")).toContainText(/allowance|额度/);
  const filter=await modal.evaluate(node=>getComputedStyle(node).backdropFilter);
  expect(filter).toContain("blur");
  expect(page.__quizNativeDialogCount||0).toBe(nativeDialogsBefore);
  await modal.locator('[data-confirm="no"]').click();
  await expect(modal).toBeHidden();
  await expect(page.locator("#quizAllowanceText")).toHaveText("1 / 1 今日剩余");
  await page.locator('[data-quiz-start="beginner"]').click();
  await expect(modal).toBeVisible();
  await expect(page.__quizNativeDialogCount||0).toBe(nativeDialogsBefore);
  await modal.locator('[data-confirm="yes"]').click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizAllowanceText")).toContainText("0 / 1");
});

test("English and Chinese Quiz render complete Malay support for prompts, options and explanations",async({page})=>{
  for(const learningLanguage of ["en","zh"]){
    const user=await createRuntimeUser(learningLanguage+"-quiz-malay-support","free");
    const session=await signIn(user.email,user.password);
    await updateLearningPreference(user.id,learningLanguage,"ms");
    await openQuiz(page,session);
    await expect(page.locator("#courseSelect")).toHaveValue(learningLanguage);
    await expect(page.locator("#translationSelect")).toHaveValue("ms");
    await startQuiz(page,"beginner");
    await expect(page.locator("#quizSession")).toBeVisible();
    // The local Auth suite deliberately seeds synthetic b-runtime/i-runtime
    // question IDs. Give those test-only questions explicit Malay fixture rows;
    // the production approved-bank coverage is independently checked by the
    // Malay Quiz source-inventory tests.
    await page.evaluate(()=>{
      const snapshot=quizPageState.session;
      const support=window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS.quiz[snapshot.learning_language_code]||
        (window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS.quiz[snapshot.learning_language_code]={});
      for(const question of snapshot.questions){
        const options={};
        for(const option of question.options||[]){
          const text="Pilihan ujian "+String(option.id||"");
          options[option.id]={learning:text,translation:text};
        }
        support[question.question_id]={
          promptLearning:"Soalan ujian "+String(question.question_id),
          explanationLearning:"Penerangan ujian "+String(question.question_id),
          options
        };
      }
      quizRenderSession();
    });
    await expect(page.locator("#quizTranslationNotice")).toBeVisible();
    const coverage=await page.evaluate(()=>{
      const snapshot=quizPageState.session;
      const rows=snapshot.questions.map(question=>quizMalayQuestion(question,snapshot.learning_language_code));
      const reviewMarkup=quizBuildResultMarkup(snapshot);
      return {
        effective:quizEffectiveTranslationCode(snapshot),
        count:snapshot.questions.length,
        complete:rows.every((row,index)=>row?.promptLearning?.trim()&&row?.explanationLearning?.trim()&&snapshot.questions[index].options.every(option=>{
          const translated=quizMalayOption(snapshot.questions[index],option,snapshot.learning_language_code);
          return typeof translated==="string"&&translated.trim();
        })),
        explanationInReview:rows.some(row=>row?.explanationLearning&&reviewMarkup.includes(quizEscape(row.explanationLearning)))
      };
    });
    expect(coverage).toMatchObject({effective:"ms",count:10,complete:true,explanationInReview:true});
    await expect(page.locator("#quizTranslationNotice")).toContainText("Bahasa Melayu");
    await expect(page.locator("#quizQuestionArea .quiz-option-copy small")).toHaveCount(4);
    await page.locator("#quizAbandon").click();
    await expect(page.locator("#quizHome")).toBeVisible();
  }
});
test("Chinese Quiz shows English translations for knowledge prompts when English is selected", async ({ page }) => {
  const user=await createRuntimeUser("chinese-quiz-english-prompt-support","free");
  const session=await signIn(user.email,user.password);
  await openQuiz(page,session);
  await selectCourseAndWaitForSave(page,"zh");
  await selectTranslationAndWaitForSave(page,"en");
  await startQuiz(page,"beginner");
  const questionCount=await page.evaluate(()=>quizPageState.session.questions.length);
  expect(questionCount).toBe(10);
  let knowledgeQuestions=0;
  for(let position=1;position<=questionCount;position++){
    const current=await page.evaluate(()=>{
      const question=quizPageState.session.questions.find(item=>item.position===quizPageState.session.current_position);
      return {type:question?.question_type,prompt:question?.prompt_learning,translation:question?.prompt_translation};
    });
    if(current.type==="chinese_translation"){
      expect(String(current.prompt||"").trim()).not.toBe("");
      await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
    }else{
      knowledgeQuestions++;
      expect(String(current.translation||"").trim()).not.toBe("");
      await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toContainText(current.translation);
    }
    if(position<questionCount){
      await page.locator("#quizQuestionArea .quiz-option").first().click();
      await page.locator("#quizNext").click();
      await page.waitForFunction(expected=>!quizPageState.saving&&quizPageState.session?.current_position===expected,position+1);
    }
  }
  expect(knowledgeQuestions).toBeGreaterThan(0);
});

test("Dashboard allowance progress is presented as actionable tasks and Daily History groups are arranged in rows", async ({ page }) => {
  const user=await createRuntimeUser("dashboard-allowance-task-list","free");
  const session=await signIn(user.email,user.password);
  await openQuiz(page,session);
  await page.locator("#accountButton").click();
  await page.locator("#menuProfile").click();
  await expect(page.locator("#profilePage")).toBeVisible({timeout:20000});
  await expect(page.locator("#profileContent")).toBeVisible({timeout:20000});
  await page.locator('[data-dashboard-tab="progress"]').click();
  const tasks=page.locator("#dashboardAllowanceBars .dashboard-allowance-card");
  await expect(tasks).toHaveCount(7);
  await expect(tasks.nth(0)).toContainText("Complete 5 of any permanent lessons today.");
  await expect(tasks.nth(0)).toContainText("0/5");
  await expect(tasks.nth(1)).toContainText("Complete Daily Topic of any course.");
  await expect(tasks.nth(1)).toContainText("0/1");
  await expect(tasks.nth(2)).toContainText("Complete Daily Application of any course.");
  await expect(tasks.nth(3)).toContainText("Complete Daily Discovery of any course.");
  await expect(tasks.nth(4)).toContainText("Complete Daily Revision of any course.");
  await expect(tasks.nth(5)).toContainText("Participate in a Quiz test.");
  await expect(tasks.nth(5)).toContainText("0/1");
  await expect(tasks.nth(6)).toContainText("Play 3 Flashcard games today.");
  await expect(tasks.nth(6)).toContainText("0/3");
  await page.locator('[data-dashboard-tab="history"]').click();
  await expect(page.locator("#dashboardDailyHistory .dashboard-history-group")).toHaveCount(4);
  const historyColumns=await page.locator("#dashboardDailyHistory").evaluate(node=>getComputedStyle(node).gridTemplateColumns.split(" ").filter(Boolean).length);
  expect(historyColumns).toBe(1);
});
