const { test, expect } = require("@playwright/test");

async function openMockFlashcards(page) {
  await page.route("**/supabase-config.js", route => route.fulfill({
    status: 200, contentType: "application/javascript",
    body: 'window.SWIFT_SUPABASE_CONFIG = { url: "https://swift-test.supabase.co", anonKey: "mock-publishable-key" };'
  }));
  await page.route("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2", route => route.fulfill({
    status: 200, contentType: "application/javascript",
    body: "window.supabase = { createClient: function(){ return {}; } };"
  }));
  await page.route("https://cdn.jsdelivr.net/npm/hanzi-writer@3.7.3/dist/hanzi-writer.min.js", route => route.fulfill({
    status: 200, contentType: "application/javascript", body: "window.HanziWriter = function(){};"
  }));
  await page.goto("/?swiftMock=1");
  await expect(page.locator("#swiftMockPanel")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__swiftDictionaryMock !== undefined)).toBe(true);
  await page.locator('[data-page="flashcards"]').click();
  await expect(page.locator("#flashcardsPage")).toBeVisible();
  const intro=page.locator("#learningIntroBackdrop");
  if(await intro.isVisible()) await page.locator("#learningIntroDismiss").click();
  await expect(page.locator(".flash-banner")).toBeVisible();
  await expect(page.locator("#flashcardsHeading")).toHaveCount(0);
  await expect(page.locator(".flash-banner .learning-help-button")).toBeVisible();
  await expect(page.locator(".flash-mode")).toHaveCount(4);
  await page.locator("#translationSelect").selectOption("en");
}

async function beginRecall(page,mode="word",difficulty="beginner",cardSet="all",duration=60) {
  await page.locator('[data-action="open-setup"][data-mode="'+mode+'"]').click();
  await expect(page.locator("#flashSetupTitle")).toBeVisible();
  await page.locator("#flashDifficulty").selectOption(difficulty);
  await page.locator("#flashChallengeDuration").selectOption(String(duration));
  await page.locator("#flashGameCollection").selectOption(cardSet);
  await page.locator('[data-action="begin-game"]').click();
  await expect(page.locator(".flash-game")).toBeVisible();
}

test("Mode-specific schedules use fixed 0.2 second reductions and respect caps",async({page})=>{
  await openMockFlashcards(page);
  const expected={
    word:{beginner:[5,12,3,9],intermediate:[5,10,2,7],advanced:[3,9,1,5]},
    definition:{beginner:[6,5,4,3],intermediate:[5,4,3,3],advanced:[4,4,2,3]},
    sentence:{beginner:[7,10,5,7],intermediate:[6,8,4,6],advanced:[5,6,3,3]},
    mixed:{beginner:[8,12,6,9],intermediate:[7,10,5,7],advanced:[6,8,4,5]}
  };
  const result=await page.evaluate(expected=>{
    const api=window.SwiftDictionaryFlashcards,out={};
    for(const [mode,levels] of Object.entries(expected)){
      out[mode]={};
      for(const [difficulty,[m,a,mf,af]] of Object.entries(levels)){
        const next=api.next(m,a,difficulty,mode),cap=api.next(mf,af,difficulty,mode);
        out[mode][difficulty]={start:[api.config[mode][difficulty].memory,api.config[mode][difficulty].answer],next:[next.memory,next.answer],cap:[cap.memory,cap.answer]};
      }
    }
    return out;
  },expected);
  for(const [mode,levels] of Object.entries(expected))for(const [difficulty,[m,a,mf,af]] of Object.entries(levels)){
    expect(result[mode][difficulty]).toEqual({start:[m,a],next:[Number((m-.2).toFixed(2)),Number((a-.2).toFixed(2))],cap:[mf,af]});
  }
});

test("Flashcards home is simplified, colour-coded and opens a compact setup prompt",async({page})=>{
  await openMockFlashcards(page);
  const modes=await page.locator(".flash-mode").evaluateAll(nodes=>nodes.map(n=>n.dataset.mode));
  expect(modes).toEqual(["word","definition","mixed","sentence"]);
  await expect(page.locator("#flashcardsApp")).not.toContainText("My Collections");
  await expect(page.locator("#flashcardsApp")).not.toContainText("Start 60 seconds game");
  await page.locator('[data-action="open-setup"][data-mode="mixed"]').click();
  await expect(page.locator("#flashSetupTitle")).toContainText("Mixed Recall");
  await expect(page.locator("#flashChallengeDuration")).toBeVisible();
  await expect(page.locator("#flashChallengeDuration")).toHaveValue("60");
  await expect(page.locator("#flashGameCollection")).toBeVisible();
  await expect(page.locator('[data-action="begin-game"]')).toBeVisible();
});

test("Word Recall hides answers during memory, reveals answer phase, and shows three-second feedback",async({page})=>{
  test.setTimeout(45000);
  await openMockFlashcards(page);
  await beginRecall(page,"word","beginner","all");
  await expect(page.locator("#flashOptions .flash-option")).toHaveCount(4);
  await expect(page.locator("#flashOptions .flash-option").first()).toHaveClass(/is-hidden/);
  await page.waitForTimeout(5100);
  await expect(page.locator("#flashOptions .flash-option").first()).not.toHaveClass(/is-hidden/);
  await expect(page.locator("#flashMemoryOverlay")).toBeVisible();
  await expect(page.locator("#flashPhaseLabel")).toContainText("Pick your answers");
  const values=await page.locator("#flashOptions .flash-option").allTextContents();
  expect(values).toHaveLength(4);
  expect(new Set(values.map(v=>v.trim().toLowerCase())).size).toBe(4);
  await page.locator("#flashOptions .flash-option").first().click();
  await expect(page.locator("#flashMemoryOverlay")).toBeHidden();
  await expect(page.locator("#flashPhaseLabel")).not.toContainText("Pick your answers");
  await expect(page.locator("#flashPhaseLabel")).toContainText(/Correct|Not quite/);
  await expect(page.locator("#flashMemory")).not.toHaveClass(/is-blurred/);
  await expect(page.locator("#flashOptions .flash-option.is-correct")).toHaveCount(1);
  await page.waitForTimeout(3100);
  await expect(page.locator("#flashPhaseLabel")).toContainText("Memorise");
  await page.locator('[data-action="leave-game"]').click();
  await expect(page.locator(".flash-banner")).toBeVisible();
});

test("Mixed Recall starts as a mixed session and records mode-specific weak answers",async({page})=>{
  await openMockFlashcards(page);
  const result=await page.evaluate(async()=>{
    const client=window.__swiftDictionaryMock.getClient();
    const started=await client.rpc("start_my_flashcard_game",{p_mode:"mixed",p_difficulty:"beginner"});
    if(started.error)return started;
    const completed=await client.rpc("complete_my_flashcard_game",{p_session_id:started.data.session_id,p_results:[{card_key:"dict:aberration",mode:"mixed",correct:false,unanswered:false}]});
    const data=await client.rpc("get_my_flashcard_data");
    return {error:completed.error,review:data.data.review_items};
  });
  expect(result.error).toBeNull();
  expect(result.review).toEqual(expect.arrayContaining([expect.objectContaining({card_key:"dict:aberration",mode:"mixed",incorrect_count:1})]));
  await page.evaluate(()=>window.dispatchEvent(new Event("swift-auth-updated")));
  await page.locator('[data-action="open-review"]').click();
  await page.locator('[data-action="review-tab"][data-value="mixed"]').click();
  await expect(page.locator(".flash-review-list")).toContainText("aberration");
  await page.locator('[data-action="review-detail"]').click();
  await expect(page.locator(".flash-review-detail")).toBeVisible();
  await expect(page.locator(".flash-review-detail")).toContainText("aberration");
});

test("60-second completion shows results and requires closing the prompt to return home",async({page})=>{
  test.setTimeout(30000);
  await page.clock.install();
  await openMockFlashcards(page);
  await beginRecall(page,"definition","beginner","all");
  await expect(page.locator("#flashGameClock")).toHaveClass(/flash-game-clock/);
  await expect(page.locator("#flashGameClock")).toHaveCSS("background-color","rgb(36, 89, 166)");
  await page.clock.fastForward(61000);
  await expect(page.locator(".flash-times-up-text")).toHaveText("Time's Up!");
  await page.clock.fastForward(2000);
  await expect(page.locator("#flashResultTitle")).toBeVisible();
  await expect(page.locator(".flash-modal")).toContainText("60-second Flash Recall summary");
  await expect(page.locator(".flash-modal")).toContainText("Accuracy");
  await expect(page.locator('[data-action="close-result"]')).toBeVisible();
  await page.locator('[data-action="close-result"]').click();
  await expect(page.locator(".flash-banner")).toBeVisible();
  await expect(page.locator("#flashResultTitle")).toHaveCount(0);
});

test("120-second challenge is available and remains active after the first 60 seconds",async({page})=>{
  await page.clock.install();
  await openMockFlashcards(page);
  await beginRecall(page,"word","beginner","all",120);
  await expect(page.locator("#flashGameClock")).toHaveText("120s");
  await page.clock.fastForward(61000);
  await expect(page.locator(".flash-game")).toBeVisible();
  await expect(page.locator("#flashGameClock")).toHaveText("59s");
  await expect(page.locator(".flash-times-up-text")).toHaveCount(0);
  await page.locator('[data-action="leave-game"]').click();
  await expect(page.locator(".flash-banner")).toBeVisible();
});


test("Dictionary filters are grouped inside a single overlay",async({page})=>{
  await openMockFlashcards(page);
  await page.locator('[data-page="dictionary"]').click();
  await page.locator("#openDictionaryFilters").click();
  await expect(page.locator("#dictionaryFiltersOverlay")).toBeVisible();
  await expect(page.locator("#categoryRow .category-button")).toHaveCount(6);
  await expect(page.locator("#savedFilter")).toBeVisible();
  await expect(page.locator("#alphabet button").first()).toHaveText("All");
  await page.locator('#categoryRow [data-category="verb"]').click();
  await expect(page.locator('#categoryRow [data-category="verb"]')).toHaveAttribute("aria-pressed","true");
  await page.locator("#closeDictionaryFilters").click();
  await expect(page.locator("#dictionaryFiltersOverlay")).toBeHidden();
});

test("Lessons and Quiz share the new banner presentation and retain help controls",async({page})=>{
  await openMockFlashcards(page);
  await page.locator('[data-page="lessons"]').click();
  await expect(page.locator("#lessonsPage .learning-banner h1")).toHaveText("Lessons");
  const lessonIntro=page.locator("#learningIntroBackdrop");
  if(await lessonIntro.isVisible())await page.locator("#learningIntroDismiss").click();
  await expect(page.locator('#lessonsPage [data-learning-help="lessons"]')).toBeVisible();
  await page.locator('[data-page="quiz"]').click();
  await expect(page.locator("#quizPage .learning-banner h1")).toHaveText("Quiz");
  const quizIntro=page.locator("#learningIntroBackdrop");
  if(await quizIntro.isVisible())await page.locator("#learningIntroDismiss").click();
  await expect(page.locator('#quizPage [data-learning-help="quiz"]')).toBeVisible();
  await expect(page.locator("#quizRefresh")).toBeVisible();
});

test("Dashboard Weak Memory opens as an overlay and keeps Dashboard as the active page",async({page})=>{
  await openMockFlashcards(page);
  await page.evaluate(()=>{
    document.getElementById("flashcardsPage").hidden=true;
    document.getElementById("profilePage").hidden=false;
  });
  await page.evaluate(()=>window.SwiftDictionaryFlashcards.openReviewFromDashboard());
  await expect(page.locator("#profilePage")).toBeVisible();
  await expect(page.locator("#dashboardFlashcardSection")).toHaveCount(1);
  await expect(page.locator("#flashOverlayRoot .flash-review-modal")).toBeVisible();
  await page.locator('#flashOverlayRoot [data-action="close-overlay"]').click();
  await expect(page.locator("#flashOverlayRoot .flash-review-modal")).toHaveCount(0);
  await expect(page.locator("#profilePage")).toBeVisible();
});

test("Flashcards main page and English recall prompts use Simplified Chinese translation",async({page})=>{
  test.setTimeout(30000);
  await openMockFlashcards(page);
  await page.locator("#translationSelect").selectOption("zh");
  await expect(page.locator(".flash-banner h2")).toHaveText("闪卡");
  await expect(page.locator(".flash-mode").first()).toContainText("单词回忆");
  await beginRecall(page,"word","beginner","all",60);
  await page.waitForTimeout(5100);
  await expect(page.locator("#flashPhaseLabel")).toHaveText("请选择答案");
  await expect(page.locator("#flashQuestion")).toHaveText("请选择正确的中文释义");
  const options=await page.locator("#flashOptions .flash-option").allTextContents();
  expect(options.some(value=>/[\u3400-\u9fff]/.test(value))).toBe(true);
  await page.locator('[data-action="leave-game"]').click();
  await expect(page.locator(".flash-banner h2")).toHaveText("闪卡");
  await page.locator("#translationSelect").selectOption("en");
});
