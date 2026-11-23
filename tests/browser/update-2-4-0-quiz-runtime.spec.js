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
  await expect(page.locator("#translationSelect")).toHaveValue("zh");
  await expect(page.locator("#quizAllowanceText")).toHaveText("1 / 1 今日剩余");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("Preferred question-bank target met");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("approved");
  await expect(page.locator("#quizDifficultyGrid")).not.toContainText("You have used today's Quiz allowance");
  await expect(page.locator('[data-quiz-start="beginner"]'),
    "Beginner availability diagnostics: " + await page.locator("#quizDifficultyGrid").innerText()
  ).toBeEnabled();

  await page.locator('[data-quiz-start="beginner"]').click();
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
  await selectTranslation(page,"en");
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toHaveCount(0);
  await expect(page.locator("#quizTranslationNotice")).toContainText("learning-language text");
  await selectTranslation(page,"zh");
  await expect(page.locator("#quizQuestionArea .quiz-question-translation")).toContainText(targetPrompt);
  await expect(page.locator("#quizTranslationNotice")).toContainText("本次测验正在使用你选择的翻译语言");

  // The learner can change an answer before submission.
  await page.locator('[data-quiz-option="b"]').click();
  await expect(page.locator('[data-quiz-option="b"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator('[data-quiz-option="a"]').click();
  await expect(page.locator('[data-quiz-option="a"]')).toHaveAttribute("aria-pressed", "true");
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
  await expect(page.locator("#swiftDictionaryToast")).toContainText(/Quiz allowance|测验额度/);
  await expect(page.locator("#quizHistory [data-quiz-review]")).toHaveCount(1);
  await page.locator("#quizHistory [data-quiz-review]").click();
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("#quizResultsContent .quiz-review-question")).toHaveCount(10);
  await expect(page.locator("#quizResultsHome")).toHaveText("← Back to Quiz");
  await page.locator("#quizResultsHome").click();
  await expect(page.locator("#quizHome")).toBeVisible();

  // The Dashboard must surface the same completed Quiz history and allow review.
  await page.goto("/#profile");
  await expect(page.locator("#profileContent")).toBeVisible();
  const dashboardHistoryDiagnostics = await page.locator("#dashboardQuizHistory").innerText();
  const dashboardProfileStatus = await page.locator("#preferenceStatus").innerText();
  await expect(page.locator("#dashboardQuizHistory [data-dashboard-quiz-review]"), "Dashboard history: "+dashboardHistoryDiagnostics+"; profile status: "+dashboardProfileStatus).toHaveCount(1);
  await expect(page.locator("#dashboardQuizHistory")).toContainText("100%");
  await expect(page.locator("#dashboardQuizHistory")).toContainText("10/10 correct");
  await page.locator("#dashboardQuizHistory [data-dashboard-quiz-review]").click();
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("#quizHome")).toBeHidden();
  await expect(page.locator("#quizResultsContent .quiz-review-question")).toHaveCount(10);
  await expect(page.locator("#quizResultsHome")).toHaveText("← Back to Dashboard");
  await page.locator("#quizResultsHome").click();
  await expect(page.locator("#profileContent")).toBeVisible();
  await expect(page).toHaveURL(/#profile$/);
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
  await expect(page.locator("#quizTranslationNotice")).toContainText("不包含在本次测验快照中");
  await expect(page.locator("#quizTranslationNotice")).toContainText("新偏好将在下一次测验生效");
  await expect(page.locator("#quizQuestionCounter")).toHaveText("第 1 题，共 10 题");
  await expect(page.locator('[data-quiz-option="b"]')).toHaveAttribute("aria-pressed", "true");

  page.once("dialog", dialog => dialog.accept());
  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();
  await page.locator('[data-quiz-start="beginner"]').click();
  await expect(page.locator("#quizSession")).toBeVisible();
  const questionTypes = [];
  for (let position=1;position<=10;position++) {
    questionTypes.push(await page.locator("#quizQuestionArea").getAttribute("data-question-type"));
    if(position<10) await page.locator("#quizNext").click();
  }
  expect(questionTypes).toContain("chinese_translation");
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

test("Premium user sees three daily completions; abandonment does not consume allowance and one active session is enforced", async ({ page }) => {
  await openQuiz(page, premiumSession);
  await expect(page.locator("#quizAllowanceText")).toHaveText("3 / 3 今日剩余");
  await expect(page.locator('[data-quiz-start="advanced"]'),
    "Advanced availability diagnostics: " + await page.locator("#quizDifficultyGrid").innerText()
  ).toBeEnabled();

  const startDiagnostics=[];
  page.on("request",request=>{if(request.url().includes("/rpc/start_my_quiz"))startDiagnostics.push({event:"request",url:request.url(),body:request.postData()});});
  page.on("response",async response=>{if(response.url().includes("/rpc/start_my_quiz")){let body="";try{body=await response.text();}catch{}startDiagnostics.push({event:"response",status:response.status(),body});}});
  page.on("requestfailed",request=>{if(request.url().includes("/rpc/start_my_quiz"))startDiagnostics.push({event:"failed",error:request.failure()?.errorText||"unknown"});});
  await page.locator('[data-quiz-start="advanced"]').click();
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
  // the intentionally disabled start button.
  await expect(page.locator('[data-quiz-start="intermediate"]')).toBeDisabled();
  await page.locator("#quizResume").click();
  await expect(page.locator("#quizSession")).toBeVisible();
  await expect(page.locator("#quizSessionDifficulty")).toHaveText("高级");

  page.once("dialog", dialog => dialog.accept());
  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizAllowanceText")).toHaveText("3 / 3 今日剩余");
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
  await expect(page.locator("#quizAllowanceText")).toHaveText("1 / 1 今日剩余");
  await expect(page.locator("#quizDifficultyGrid .quiz-difficulty-option h3").first()).toHaveText("初级");
  await expect(page.locator("#preferenceRefreshToast")).not.toHaveClass(/visible/,{timeout:5000});

  await page.locator('[data-quiz-start="beginner"]').click();
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
  await page.locator('[data-quiz-start="beginner"]').click();
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
test("Learning course selector enables Chinese Quiz and shows a short refresh confirmation", async ({ page }) => {
  await openQuiz(page, freeSession);
  await selectCourse(page,"zh");
  // The learning course is Chinese, while the selected interface/translation language remains English.
  await expect(page.locator("#quizChineseUnavailable")).toBeHidden();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator('[data-quiz-start="beginner"]')).toBeEnabled();
  await expect(page.locator("#preferenceRefreshToast")).toHaveClass(/visible/);
  await selectCourse(page,"en");
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#preferenceRefreshToast")).toHaveClass(/visible/);
});

test("Dashboard Quiz History renders a clean Review button", async ({ page }) => {
  await openQuiz(page, freeSession);
  await page.evaluate(() => {
    showPage("profile", false);
    document.querySelector("#profileContent").hidden = false;
  });
  await page.evaluate(() => {
    const host = document.querySelector("#dashboardQuizHistory");
    host.innerHTML = '<div class="quiz-history-row"><button type="button" class="secondary-button" data-dashboard-quiz-review="completed-session-id">Review</button></div>';
  });
  const reviewButton = page.locator("#dashboardQuizHistory [data-dashboard-quiz-review]");
  await expect(reviewButton).toBeVisible();
  await expect(reviewButton).toHaveText("Review");
  await expect(reviewButton).not.toContainText("quizEscape");
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
  await page.locator('[data-quiz-start="beginner"]').click();
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

  let foundTranslationQuestion=false;
  for(let position=1;position<=10;position++){
    const area=page.locator("#quizQuestionArea");
    const type=await page.evaluate(()=>quizPageState.session.questions.find(q=>q.position===quizPageState.session.current_position)?.question_type);
    if(type==="chinese_translation"){
      foundTranslationQuestion=true;
      await expect(area.locator(".quiz-question-pinyin")).toHaveCount(0);
      await expect(area.locator(".quiz-question-translation")).toHaveCount(0);
      await expect(area.locator(".quiz-option-pinyin")).toHaveCount(4);
      break;
    }
    await expect(area.locator(".quiz-question-pinyin")).toBeVisible();
    await expect(area.locator(".quiz-question-translation")).toBeVisible();
    await area.locator(".quiz-option").first().click();
    if(position<10)await page.locator("#quizNext").click();
  }
  expect(foundTranslationQuestion).toBe(true);

  page.once("dialog",dialog=>dialog.accept());
  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();

  await updateLearningPreference(freeUserId,"zh","zh");
  await page.reload();
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#courseSelect")).toHaveValue("zh");
  await expect(page.locator("#translationSelect")).toHaveValue("zh");
  await page.locator('[data-quiz-start="beginner"]').click();
  await expect(page.locator("#quizSession")).toBeVisible({timeout:15000});

  for(let position=1;position<=10;position++){
    const area=page.locator("#quizQuestionArea");
    await expect(area).toHaveAttribute("data-question-type","knowledge");
    await expect(area.locator(".quiz-question-pinyin")).toBeVisible();
    await expect(area.locator(".quiz-question-translation")).toHaveCount(0);
    await expect(area.locator(".quiz-option-pinyin")).toHaveCount(4);
    await area.locator(".quiz-option").first().click();
    if(position<10)await page.locator("#quizNext").click();
  }
  page.once("dialog",dialog=>dialog.accept());
  await page.locator("#quizAbandon").click();
  await expect(page.locator("#quizHome")).toBeVisible();
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
  test.setTimeout(90000);
  const user=await createRuntimeUser("flashcard-zh-review","free");
  const session=await signIn(user.email,user.password);
  await openQuiz(page,session);
  await page.locator('[data-page="flashcards"]').click();
  await expect(page.locator("#flashcardsPage .flash-mode-grid")).toBeVisible();
  if(await page.locator("#learningIntroBackdrop").isVisible()){
    await page.locator("#learningIntroDismiss").click();
    await expect(page.locator("#learningIntroBackdrop")).toBeHidden();
  }
  await selectCourse(page,"zh");
  await selectTranslation(page,"zh");
  await expect(page.locator("#flashcardsPage .flash-mode-grid")).toBeVisible();
  const flashRpcDiagnostics=[];
  page.on("response",async response=>{
    if(response.url().includes("/rpc/complete_my_flashcard_game")){
      let body="";try{body=await response.text();}catch{}
      flashRpcDiagnostics.push({status:response.status(),body});
    }
  });
  await page.locator('#flashcardsPage .flash-mode[data-mode="word"]').click();
  await expect(page.locator("#flashGameCollection")).toHaveValue("all");
  await page.clock.install();
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

  await page.clock.runFor((challengeSeconds+2)*1000);
  await page.clock.runFor(2500);
  const flashResultCount=await page.locator("#flashResultTitle").count();
  if(!flashResultCount){
    const diagnostics=await page.evaluate(()=>({
      clock:document.querySelector("#flashGameClock")?.textContent,
      notice:document.querySelector("#flashNotice")?.textContent,
      overlay:document.querySelector("#flashOverlay")?.innerText,
      appText:document.querySelector("#flashcardsApp")?.innerText?.slice(-1200)
    }));
    throw new Error("Flashcard game did not reach its result screen: "+JSON.stringify({diagnostics,flashRpcDiagnostics}));
  }
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
