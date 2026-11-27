const { test, expect } = require("@playwright/test");

async function openMockFlashcards(page) {
  await page.route("**/supabase-config.js", route => route.fulfill({
    status: 200, contentType: "application/javascript",
    body: `
      window.SWIFT_SUPABASE_CONFIG = { url: "https://swift-test.supabase.co", anonKey: "mock-publishable-key" };
      const loadFavoriteCollections = () => {
        if (document.getElementById("swiftFavoriteCollectionsScript")) return;
        const script = document.createElement("script");
        script.id = "swiftFavoriteCollectionsScript";
        script.src = "favorite-collections.js?v=2.9.0-p4-r4";
        script.defer = true;
        document.head.appendChild(script);
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadFavoriteCollections, { once: true });
      } else {
        loadFavoriteCollections();
      }
    `
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
  await expect(intro).toBeVisible();
  await expect(page.locator("#learningIntroTitle")).toHaveText(/^(Welcome to Flashcards|欢迎使用闪卡)$/);
  await page.locator("#learningIntroDismiss").click();
  await expect(page.locator(".flash-banner")).toBeVisible();
  await expect(page.locator("#flashcardsHeading")).toHaveCount(0);
  const flashHelp=page.locator(".flash-banner .learning-help-button");
  await expect(flashHelp).toBeVisible();
  await expect(flashHelp).toHaveCSS("position","static");
  const bannerBox=await page.locator(".flash-banner").boundingBox(),helpBox=await flashHelp.boundingBox();
  expect(Math.abs((helpBox.y+helpBox.height/2)-(bannerBox.y+bannerBox.height/2))).toBeLessThanOrEqual(2);
  await expect(page.locator(".flash-mode")).toHaveCount(4);
  await page.locator("#translationSelect").selectOption("en");
}

async function beginRecall(page,mode="word",difficulty="beginner",cardSet="all",duration=60) {
  // Duration controls live beside the mode heading, outside the setup dialog.
  await page.locator('[data-action="set-duration"][data-value="'+duration+'"]').click();
  await expect(page.locator('[data-action="set-duration"][data-value="'+duration+'"]')).toHaveAttribute("aria-pressed","true");
  await page.locator('[data-action="open-setup"][data-mode="'+mode+'"]').click();
  await expect(page.locator("#flashSetupTitle")).toBeVisible();
  await page.locator("#flashDifficulty").selectOption(difficulty);
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

test("Recall mode slot swaps between Mixed and Translation by learning course",async({page})=>{
  await openMockFlashcards(page);
  const englishModes=await page.locator(".flash-mode").evaluateAll(nodes=>nodes.map(node=>node.dataset.mode));
  expect(englishModes).toEqual(["word","definition","mixed","sentence"]);
  await page.locator("#courseSelect").selectOption("zh");
  await expect.poll(()=>page.locator(".flash-mode").evaluateAll(nodes=>nodes.map(node=>node.dataset.mode))).toEqual(["word","definition","translation","sentence"]);
  await expect(page.locator('.flash-mode[data-mode="mixed"]')).toHaveCount(0);
  await page.locator("#courseSelect").selectOption("en");
  await expect.poll(()=>page.locator(".flash-mode").evaluateAll(nodes=>nodes.map(node=>node.dataset.mode))).toEqual(["word","definition","mixed","sentence"]);
  await expect(page.locator('.flash-mode[data-mode="translation"]')).toHaveCount(0);
  await page.locator("#courseSelect").selectOption("zh");
  const translationRecallColor=await page.locator('.flash-mode[data-mode="translation"]').evaluate(node=>getComputedStyle(node).backgroundColor);
  expect(translationRecallColor).toBe("rgb(189, 118, 46)");
});

test("Switching course remaps an open Mixed Recall setup to Translation Recall in the same slot",async({page})=>{
  await openMockFlashcards(page);
  await page.locator('#flashcardsPage .flash-mode[data-mode="mixed"]').click();
  await expect(page.locator("#flashSetupTitle")).toHaveText("Mixed Recall");
  await page.locator("#courseSelect").selectOption("zh");
  await expect(page.locator("#flashSetupTitle")).toHaveText("Translation Recall");
  await expect(page.locator('#flashcardsPage .flash-mode[data-mode="mixed"]')).toHaveCount(0);
  await expect(page.locator('#flashcardsPage .flash-mode[data-mode="translation"]')).toBeVisible();
  await page.locator('[data-action="close-overlay"]').last().click();
});

test("Dashboard tabs switch their visible panels",async({page})=>{
  await openMockFlashcards(page);
  await page.locator("#accountButton").click();
  await page.locator("#menuProfile").click();
  await expect(page.locator("#profilePage")).toBeVisible();
  await expect(page.locator("#dashboardTabFavourites")).toBeVisible();

  const favoriteDisclosure = page.locator("#dashboardTabFavourites details").first();
  await expect(favoriteDisclosure).toBeVisible();
  const disclosureContent = favoriteDisclosure.locator(":scope > .fc-disclosure-content");
  await expect(disclosureContent).toHaveCount(1);
  await expect(disclosureContent).toHaveCSS("transition-property", /max-height/);
  const initiallyOpen = await favoriteDisclosure.evaluate(node => node.open);
  await favoriteDisclosure.locator(":scope > summary").click();
  await expect.poll(() => favoriteDisclosure.evaluate(node => node.open)).toBe(!initiallyOpen);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await favoriteDisclosure.locator(":scope > summary").click();
  await expect.poll(() => favoriteDisclosure.evaluate(node => node.open)).toBe(initiallyOpen);
  for(const name of ["progress","history","analytics","favourites"]){
    await page.locator('[data-dashboard-tab="'+name+'"]').click();
    const panel="#dashboardTab"+name[0].toUpperCase()+name.slice(1);
    await expect(page.locator(panel)).toBeVisible();
    for(const other of ["favourites","progress","history","analytics"])if(other!==name){
      const otherPanel="#dashboardTab"+other[0].toUpperCase()+other.slice(1);
      await expect(page.locator(otherPanel)).toBeHidden();
    }
    await expect(page.locator('[data-dashboard-tab="'+name+'"]')).toHaveAttribute("aria-selected","true");
  }
});

test("Daily History lesson and Daily Learning reviews stay inside Dashboard",async({page})=>{
  await openMockFlashcards(page);
  await page.locator("#translationSelect").selectOption("en");
  await page.locator("#accountButton").click();
  await page.locator("#menuProfile").click();
  await expect(page.locator("#profilePage")).toBeVisible();
  await page.locator('[data-dashboard-tab="history"]').click();
  await page.evaluate(()=>{
    document.querySelector("#dashboardDailyHistory").innerHTML=
      '<button type="button" data-dashboard-daily-lesson-review="b-sentence" data-difficulty="beginner" data-language-code="en">Review lesson</button>';
  });
  await page.locator("[data-dashboard-daily-lesson-review]").click();
  await expect(page.locator("#dashboardReviewOverlay")).toBeVisible();
  await expect(page.locator("#dashboardReviewContent")).toContainText("Build a clear basic sentence");
  expect(new URL(page.url()).hash).toBe("#profile");
  await page.locator("[data-dashboard-review-close]").click();
  await page.evaluate(()=>{
    document.querySelector("#dashboardDailyHistory").innerHTML=
      '<button type="button" data-dashboard-daily-activity-review="true" data-activity-type="daily_topic" data-content-id="topic-present-perfect-01" data-topic-id="verb-tenses" data-difficulty="intermediate" data-language-code="en">Review activity</button>';
  });
  await page.locator("[data-dashboard-daily-activity-review]").click();
  await expect(page.locator("#dailyActivityReader")).toBeVisible();
  await expect(page.locator("#dailyActivityReader")).toContainText("Past simple or present perfect?");
  await expect(page.locator("#profilePage")).toBeVisible();
  expect(new URL(page.url()).hash).toBe("#profile");
  await page.locator("#dailyActivityReader [data-daily-close]").click();
  await expect(page.locator("#dailyActivityReader")).toBeHidden();
});

test("Chinese permanent lesson Daily History review uses the Chinese lesson catalogue in place",async({page})=>{
  await openMockFlashcards(page);
  await page.locator("#courseSelect").selectOption("zh");
  await page.locator("#accountButton").click();
  await page.locator("#menuProfile").click();
  await expect(page.locator("#profilePage")).toBeVisible();
  await page.locator('[data-dashboard-tab="history"]').click();
  await page.evaluate(()=>{
    document.querySelector("#dashboardDailyHistory").innerHTML=
      '<button type="button" data-dashboard-daily-lesson-review="zh-b-pinyin-foundations" data-difficulty="beginner" data-language-code="zh">Review Chinese lesson</button>';
  });
  await page.locator("[data-dashboard-daily-lesson-review]").click();
  await expect(page.locator("#dashboardReviewOverlay")).toBeVisible();
  await expect(page.locator("#dashboardReviewContent")).toContainText("拼音基础与四声");
  await expect(page.locator("#dashboardReviewContent")).toContainText("拼音与发音");
  expect(new URL(page.url()).hash).toBe("#profile");
});

test("English Flashcards include the curated multiword expression bank",async({page})=>{
  await openMockFlashcards(page);
  const stats=await page.evaluate(()=>window.SwiftDictionaryFlashcards.contentStats);
  expect(stats.englishCuratedPhraseCount).toBe(25);
});

test("Malay Flashcard course and support-language content are loaded",async({page})=>{
  await openMockFlashcards(page);
  const stats=await page.evaluate(()=>window.SwiftDictionaryFlashcards.contentStats);
  expect(stats.malayDictionaryEntryCount).toBe(650);
  expect(stats.malaySupportEnglishCount).toBe(73);
  expect(stats.malaySupportChineseCount).toBe(124);
  await page.locator("#courseSelect").selectOption("ms");
  await expect.poll(()=>page.locator(".flash-mode").evaluateAll(nodes=>nodes.map(n=>n.dataset.mode))).toEqual(["word","definition","mixed","sentence"]);
  await expect(page.locator("#translationSelect")).toHaveValue("en");
  await expect(page.locator("#translationSelect option[value='ms']")).toBeDisabled();
});
test("Flashcards home is simplified, colour-coded and opens a compact setup prompt",async({page})=>{
  await openMockFlashcards(page);
  const modes=await page.locator(".flash-mode").evaluateAll(nodes=>nodes.map(n=>n.dataset.mode));
  expect(modes).toEqual(["word","definition","mixed","sentence"]);
  await expect(page.locator("#flashcardsApp")).not.toContainText("My Collections");
  await expect(page.locator("#flashcardsApp")).not.toContainText("Start 60 seconds game");
  await page.locator('[data-action="open-setup"][data-mode="mixed"]').click();
  await expect(page.locator("#flashSetupTitle")).toContainText("Mixed Recall");
  await expect(page.locator('[data-action="set-duration"][data-value="60"]')).toBeVisible();
  await expect(page.locator('[data-action="set-duration"][data-value="60"]')).toHaveAttribute("aria-pressed","true");
  await expect(page.locator("#flashChallengeDuration")).toHaveCount(0);
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

test("Answer now skips memory and Next immediately begins another unique round",async({page})=>{
  await page.clock.install();
  await openMockFlashcards(page);
  await beginRecall(page,"word","beginner","all",60);
  const action=page.locator("#flashPhaseAction");
  await expect(action).toBeVisible();
  await expect(action).toHaveText("Answer now");
  const firstPrompt=await page.locator("#flashMemory").textContent();
  await action.click();
  await expect(page.locator("#flashMemoryOverlay")).toBeVisible();
  await expect(action).toBeHidden();
  await page.locator("#flashOptions .flash-option").first().click();
  await expect(action).toBeVisible();
  await expect(action).toHaveText("Next");
  await expect(page.locator("#flashPhaseLabel")).toContainText(/Correct|Not quite/);
  await action.click();
  await expect(page.locator("#flashPhaseLabel")).toContainText("Memorise");
  await expect(action).toHaveText("Answer now");
  await expect(page.locator("#flashMemory")).not.toHaveText(firstPrompt);
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
  await page.locator('[data-action="close-overlay"]').last().click();
  await page.locator("#accountButton").click();
  await page.locator("#menuProfile").click();
  await expect(page.locator("#profilePage")).toBeVisible();
  await page.locator('[data-dashboard-tab="history"]').click();
  const historyReview=page.locator("[data-dashboard-flashcard-review-game]");
  await expect(historyReview).toBeVisible();
  await historyReview.click();
  await expect(page.locator("#profilePage")).toBeVisible();
  await expect(page.locator("#flashOverlayRoot .flash-game-review-modal")).toBeVisible();
  expect(new URL(page.url()).hash).toBe("#profile");
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
  await expect(page.locator(".flash-accuracy-hero strong")).toHaveText(/\d+%/);
  await expect(page.locator(".flash-accuracy-hero span")).toHaveText("Accuracy");
  await expect(page.locator(".flash-result-modal .flash-stats .flash-stat")).toHaveCount(3);
  await expect(page.locator(".flash-result-modal .flash-stat").first()).toHaveCSS("padding-top","16px");
  await expect(page.locator('[data-action="close-result"]')).toBeVisible();
  await page.locator('[data-action="close-result"]').click();
  await expect(page.locator(".flash-banner")).toBeVisible();
  await expect(page.locator("#flashResultTitle")).toHaveCount(0);
});

test("120-second challenge is available and remains active after the first 60 seconds",async({page})=>{
  await page.clock.install();
  await page.clock.pauseAt(new Date());
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


test("Dictionary filter panel expands below the search row and toggles closed",async({page})=>{
  await openMockFlashcards(page);
  await page.locator('[data-page="dictionary"]').click();
  const panel=page.locator("#dictionaryFiltersPanel"),button=page.locator("#openDictionaryFilters");
  await button.click();
  await expect(panel).toBeVisible();
  await expect(button).toHaveAttribute("aria-expanded","true");
  await expect(panel).not.toHaveAttribute("role","dialog");
  const widths=await page.evaluate(()=>({
    row:document.querySelector(".search-row").getBoundingClientRect().width,
    panel:document.querySelector("#dictionaryFiltersPanel").getBoundingClientRect().width,
    panelTop:document.querySelector("#dictionaryFiltersPanel").getBoundingClientRect().top,
    rowBottom:document.querySelector(".search-row").getBoundingClientRect().bottom,
    exploreTop:document.querySelector("#explore-title").getBoundingClientRect().top
  }));
  expect(Math.abs(widths.row-widths.panel)).toBeLessThanOrEqual(1);
  expect(widths.panelTop).toBeGreaterThanOrEqual(widths.rowBottom);
  expect(widths.exploreTop).toBeGreaterThan(widths.panelTop);
  await expect(page.locator("#categoryRow .category-button")).toHaveCount(6);
  await expect(page.locator("#savedFilter")).toBeVisible();
  await expect(page.locator("#alphabet button").first()).toHaveText("All");
  await page.locator('#categoryRow [data-category="verb"]').click();
  await expect(page.locator('#categoryRow [data-category="verb"]')).toHaveAttribute("aria-pressed","true");
  await button.click();
  await expect(panel).toBeHidden();
  await expect(button).toHaveAttribute("aria-expanded","false");
});

test("Lessons and Quiz share the new banner presentation and retain help controls",async({page})=>{
  await openMockFlashcards(page);
  await page.locator('[data-page="lessons"]').click();
  await expect(page.locator("#lessonsPage .learning-banner h1")).toHaveText("Lessons");
  const lessonIntro=page.locator("#learningIntroBackdrop");
  if(await lessonIntro.isVisible())await page.locator("#learningIntroDismiss").click();
  await expect(page.locator('#lessonsPage [data-learning-help="lessons"]')).toBeVisible();
  await page.locator("#translationSelect").selectOption("zh");
  await expect(page.locator("#lessonsHeading")).toHaveText("课程");
  await expect(page.locator("#lessonsPage .learning-banner .page-intro")).toHaveText("通过引导式讲解、示例和简短练习提升英语能力。");
  await page.locator("#translationSelect").selectOption("en");
  await expect(page.locator("#lessonsHeading")).toHaveText("Lessons");
  await page.locator('[data-page="quiz"]').click();
  await expect(page.locator("#quizPage .learning-banner h1")).toHaveText("Quiz");
  const quizIntro=page.locator("#learningIntroBackdrop");
  await expect(quizIntro).toBeVisible();
  await expect(page.locator("#learningIntroTitle")).toHaveText(/^(Welcome to Quiz|欢迎使用测验)$/);
  await page.locator("#learningIntroDismiss").click();
  await expect(page.locator('#quizPage [data-learning-help="quiz"]')).toBeVisible();
  await expect(page.locator("#quizRefresh")).toBeVisible();
});

test("Dashboard Flashcard statistics load and Weak Memory opens without leaving Dashboard",async({page})=>{
  await openMockFlashcards(page);
  await page.locator("#accountButton").click();
  await page.locator("#menuProfile").click();
  await expect(page.locator("#profilePage")).toBeVisible();
  await page.locator('[data-dashboard-tab="progress"]').click();
  await expect(page.locator("#profileContent #allowanceDetails")).toBeVisible();
  await page.locator('[data-dashboard-tab="analytics"]').click();
  await expect(page.locator("#dashboardFlashcardSection")).toBeVisible();
  await expect(page.locator("#profileContent #practiceAccuracy")).toBeVisible();
  await expect(page.locator("#dashboardFlashcardGames")).not.toHaveText("—");
  await expect(page.locator("#dashboardFlashcardAttempts")).not.toHaveText("—");
  await page.locator("#dashboardFlashcardSection [data-dashboard-flashcard-review]").click();
  await expect(page.locator("#profilePage")).toBeVisible();
  await expect(page.locator("#flashOverlayRoot .flash-review-modal")).toBeVisible();
  await page.locator('#flashOverlayRoot [data-action="close-overlay"]').last().click();
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
  await page.locator('[data-action="open-review"]').click();
  await expect(page.locator(".flash-review-tab").first()).toHaveText("单词回忆");
  await expect(page.locator(".flash-review-tab").nth(1)).toHaveText("释义回忆");
  await page.locator('[data-action="close-overlay"]').last().click();
  await page.locator("#translationSelect").selectOption("en");
});


test("An unanswered question at challenge timeout is saved to Weak Memory",async({page})=>{
  await page.clock.install();
  await openMockFlashcards(page);
  await beginRecall(page,"word","beginner","all",60);
  await page.clock.fastForward(61000);
  await expect(page.locator(".flash-times-up-text")).toBeVisible();
  await page.clock.fastForward(2000);
  await expect(page.locator("#flashResultTitle")).toBeVisible();
  const data=await page.evaluate(async()=>{
    const result=await window.__swiftDictionaryMock.getClient().rpc("get_my_flashcard_data");
    return result.data;
  });
  expect(data.history[0].unanswered_count).toBeGreaterThanOrEqual(1);
  expect(data.review_items.length).toBeGreaterThan(0);
  await page.locator('[data-action="close-result"]').click();
});

test("Translation changes do not reopen a previously closed Dictionary definition panel",async({page})=>{
  await openMockFlashcards(page);
  await page.locator('[data-page="dictionary"]').click();
  await page.locator(".word-card").first().click();
  await expect(page.locator("#modalBackdrop")).toHaveClass(/open/);
  await page.locator("#closeButton").click();
  await expect(page.locator("#modalBackdrop")).not.toHaveClass(/open/);
  for(const target of ["lessons","quiz","flashcards"]){
    await page.locator('[data-page="'+target+'"]').click();
    const intro=page.locator("#learningIntroBackdrop");
    if(await intro.isVisible())await page.locator("#learningIntroDismiss").click();
    await page.locator("#translationSelect").selectOption("zh");
    await expect(page.locator("#modalBackdrop")).not.toHaveClass(/open/);
    await page.locator("#translationSelect").selectOption("en");
    await expect(page.locator("#modalBackdrop")).not.toHaveClass(/open/);
  }
});

test("Weak Memory review keeps the list scroll position when selecting an item",async({page})=>{
  await openMockFlashcards(page);
  const result=await page.evaluate(async()=>{
    const client=window.__swiftDictionaryMock.getClient();
    const words=["aberration","abandon","ability","able","about","above","absence","absolute","absorb","abstract","abuse","academic"];
    const started=await client.rpc("start_my_flashcard_game",{p_mode:"word",p_difficulty:"beginner"});
    if(started.error)throw new Error(started.error.message);
    const completed=await client.rpc("complete_my_flashcard_game",{
      p_session_id:started.data.session_id,
      p_results:words.map(word=>({card_key:"dict:"+word,mode:"word",correct:false,unanswered:false}))
    });
    if(completed.error)throw new Error(completed.error.message);
    return (await client.rpc("get_my_flashcard_data")).data.review_items.length;
  });
  expect(result).toBeGreaterThanOrEqual(12);
  // The RPC fixture writes directly to the Mock adapter; refresh the page's
  // cached Flashcards data before opening the review UI.
  await page.evaluate(()=>window.dispatchEvent(new Event("swift-auth-updated")));
  await expect.poll(async()=>page.locator("#flashcardsApp").textContent()).toContain("12");
  await page.locator('[data-action="open-review"]').click();
  const list=page.locator(".flash-review-list");
  await expect(list.locator(".flash-review-entry")).toHaveCount(12);
  await list.evaluate(el=>{el.scrollTop=el.scrollHeight;});
  const before=await list.evaluate(el=>el.scrollTop);
  await list.locator(".flash-review-entry").first().evaluate(button=>button.click());
  const after=await list.evaluate(el=>el.scrollTop);
  expect(after).toBe(before);
  await expect(page.locator(".flash-review-detail")).toBeVisible();
  await expect(page.locator(".flash-review-detail")).not.toContainText("Missed");
});

test("signing out restores the Flashcards banner, title and sign-in panel",async({page})=>{
  await openMockFlashcards(page);
  await page.evaluate(async()=>{
    const client=window.__swiftDictionaryMock.getClient();
    const result=await client.auth.signOut();
    if(result.error)throw new Error(result.error.message);
  });
  await expect(page.locator("#flashcardsPage")).toBeVisible();
  await expect(page.locator(".flash-banner")).toBeVisible();
  await expect(page.locator(".flash-banner h2")).toHaveText("Flashcards");
  await expect(page.locator("#flashcardsApp .learning-auth-card")).toBeVisible();
  await expect(page.locator("#flashcardsApp .learning-auth-button")).toBeVisible();
  await expect(page.locator(".flash-mode")).toHaveCount(0);
});


test("Preferences deletion controls are distinct and learning history uses an in-site dialog",async({page})=>{
  await openMockFlashcards(page);
  const nativeDialogs=[];
  page.on("dialog",async dialog=>{nativeDialogs.push(dialog.message());await dialog.dismiss();});
  await page.evaluate(()=>showPage("preferences"));
  await expect(page.locator("#preferencesPage")).toBeVisible();
  await expect(page.locator("#accountDeletionCard")).toBeVisible();
  await expect(page.locator("#accountDeletionDialog")).toHaveCount(1);
  await page.locator("#openAccountDeletion").click();
  await expect(page.locator("#accountDeletionDialog [role='dialog']")).toBeVisible();
  await page.locator("#swiftDeleteCancel").click();
  await page.locator("#deleteLearningHistoryButton").click();
  await expect(page.locator('[aria-labelledby="learningHistoryConfirmTitle"]')).toBeVisible();
  expect(nativeDialogs).toEqual([]);
  await page.locator("[data-history-cancel]").click();
  await expect(page.locator('[aria-labelledby="learningHistoryConfirmTitle"]')).toHaveCount(0);
  await expect(page.locator('footer a[href="terms.html"]')).toHaveText("Terms & Conditions");
});


test("Flashcards shows a five-second toast when the daily allowance is exhausted",async({page})=>{
  await openMockFlashcards(page);
  for(let game=0;game<3;game++){
    await beginRecall(page,"word","beginner","all",60);
    await page.evaluate(()=>{
      window.__swiftOriginalDateNow=Date.now;
      Date.now=()=>window.__swiftOriginalDateNow()+60000;
    });
    await expect(page.locator(".flash-times-up-backdrop")).toBeVisible({timeout:5000});
    await expect(page.locator("#flashResultTitle")).toBeVisible({timeout:8000});
    await page.evaluate(()=>{
      Date.now=window.__swiftOriginalDateNow;
      delete window.__swiftOriginalDateNow;
    });
    if(game<2)await page.locator('[data-action="close-result"]').click();
  }
  await expect(page.locator("#swiftDictionaryToast")).toContainText("Flashcards allowance");
  await expect(page.locator("#swiftDictionaryToast")).toHaveClass(/is-visible/);
  await page.locator('[data-action="close-result"]').click();
  await page.locator('[data-action="open-setup"][data-mode="word"]').click();
  await expect(page.locator("#swiftDictionaryToast")).toContainText("Flashcards allowance");
  await expect(page.locator("#swiftDictionaryToast")).toHaveClass(/is-visible/);
  await expect(page.locator("#flashSetupTitle")).toBeHidden();
  await page.waitForTimeout(5200);
  await expect(page.locator("#swiftDictionaryToast")).not.toHaveClass(/is-visible/);
});

test("Flashcards home panels match Lessons and Quiz styling; weak-memory items can be dismissed individually",async({page})=>{
  await openMockFlashcards(page);
  await expect.poll(()=>page.evaluate(()=>window.__swiftDictionaryMock.activeUser())).not.toBeNull();
  const now=new Date().toISOString();
  await page.evaluate(async({now})=>{
    window.__swiftDictionaryMock.seedFlashcardData({
      reviewItems:[{card_key:"dict:zh:你",mode:"translation",incorrect_count:2,last_incorrect_at:now}],
      history:[{id:"11111111-1111-4111-8111-111111111111",mode:"translation",difficulty:"beginner",status:"completed",words_seen:1,correct_count:0,incorrect_count:1,unanswered_count:0,started_at:now,completed_at:now,duration_seconds:60,learning_language_code:"zh",translation_language_code:"en"}]
    });
    await window.SwiftDictionaryFlashcards.refreshDashboardData();
  },{now});
  await page.locator("#courseSelect").selectOption("zh");
  await page.locator("#translationSelect").selectOption("en");
  await expect(page.locator('#flashcardsPage .flash-mode[data-mode="translation"]')).toBeVisible();
  const panelStyles=await page.locator("#flashcardsPage .flash-home > .flash-section").evaluateAll(nodes=>nodes.map(node=>{
    const style=getComputedStyle(node);
    return {radius:style.borderRadius,background:style.backgroundImage,shadow:style.boxShadow};
  }));
  expect(panelStyles).toHaveLength(3);
  expect(panelStyles.every(style=>style.radius==="21px"&&style.background.includes("linear-gradient")&&style.shadow!=="none")).toBe(true);
  const recentGames=page.locator("#flashcardsPage .flash-home > .flash-section").last();
  await expect(recentGames).toContainText("Recent games");
  await expect(recentGames.locator(".flash-card-row")).toHaveCount(1);
  await expect(recentGames.locator(".flash-card-row").first()).toContainText("Simplified Chinese course");
  await page.locator('[data-action="open-review"]').click();
  const translationTab=page.locator('.flash-review-tab[data-value="translation"]');
  await expect(translationTab).toHaveCSS("background-color","rgb(189, 118, 46)");
  await translationTab.click();
  await expect(page.locator(".flash-review-item")).toHaveCount(1);
  await page.locator('[data-action="dismiss-review-item"]').click();
  await expect(page.locator(".flash-review-item")).toHaveCount(0);
  await expect(page.locator(".flash-review-dismiss-notice")).toContainText(/game history|游戏记录/);
  await page.locator('[data-action="close-overlay"]').last().click();
  await expect(page.locator('[data-action="open-review"]')).toContainText("(0)");
  await expect(recentGames.locator(".flash-card-row")).toHaveCount(1);
});


test("Completed Flashcard games save per-card snapshots and missed answers for review",async({page})=>{
  await page.clock.install();
  await openMockFlashcards(page);
  await beginRecall(page,"word","beginner","all",60);

  // Answer until at least one miss is recorded; the first option is intentionally
  // arbitrary, so the test checks the feedback rather than assuming an answer key.
  await page.locator('[data-action="phase-action"]').click();
  let outcome="";
  for(let attempt=0;attempt<12;attempt++){
    await page.locator("#flashOptions .flash-option").first().click();
    outcome=await page.locator("#flashPhaseLabel").innerText();
    if(/Not quite|再试一次|Time expired|答题时间已结束/.test(outcome))break;
    await page.locator('[data-action="phase-action"]').click();
  }
  expect(outcome).toMatch(/Not quite|再试一次|Time expired|答题时间已结束/);

  await page.evaluate(()=>{
    window.__swiftOriginalDateNow=Date.now;
    Date.now=()=>window.__swiftOriginalDateNow()+60000;
  });
  await page.clock.runFor(100);
  await expect(page.locator(".flash-times-up-backdrop")).toBeVisible();
  await page.clock.runFor(2000);
  await expect(page.locator("#flashResultTitle")).toBeVisible();
  await page.locator('[data-action="close-result"]').click();

  await expect(page.locator('[data-action="open-review"]')).not.toContainText("(0)");
  await page.locator('[data-action="open-review"]').click();
  await expect(page.locator(".flash-review-item").first()).toBeVisible();
  await page.locator('[data-action="close-overlay"]').last().click();

  await page.locator('[data-action="review-game"]').first().click();
  await expect(page.locator(".flash-game-review-modal .flash-review-card").first()).toBeVisible();
  await expect(page.locator(".flash-game-review-modal")).toContainText("Incorrect");
  await page.evaluate(()=>{
    Date.now=window.__swiftOriginalDateNow;
    delete window.__swiftOriginalDateNow;
  });
});

test("Recent games paginate ten at a time and game review has a top close control",async({page})=>{
  await openMockFlashcards(page);
  await page.evaluate(()=>{
    const history=Array.from({length:23},(_,index)=>({
      id:"mock-history-"+index,mode:"word",difficulty:"beginner",status:"completed",
      started_at:new Date(Date.now()-index*60000).toISOString(),
      completed_at:new Date(Date.now()-index*60000).toISOString(),
      words_seen:10,correct_count:7,incorrect_count:3,unanswered_count:0,
      learning_language_code:["en","zh","ms"][index%3],translation_language_code:"en",
      review_available:true,review_items:[]
    }));
    window.__swiftDictionaryMock.seedFlashcardData({history});
  });
  await page.evaluate(()=>window.dispatchEvent(new Event("swift-auth-updated")));
  await expect(page.locator("#flashcardsPage .flash-section").filter({hasText:"Recent games"}).locator(".flash-card-row")).toHaveCount(10);
  const firstPageGames=await page.locator("#flashcardsPage .flash-section").filter({hasText:"Recent games"}).locator(".flash-card-row").allTextContents();
  expect(firstPageGames.some(text=>text.includes("English course"))).toBe(true);
  expect(firstPageGames.some(text=>text.includes("Simplified Chinese course"))).toBe(true);
  expect(firstPageGames.some(text=>text.includes("Malay course"))).toBe(true);
  await expect(page.locator('[data-action="history-next"]')).toBeVisible();
  await page.locator('[data-action="history-next"]').click();
  await expect(page.locator("#flashcardsPage .flash-section").filter({hasText:"Recent games"}).locator(".flash-card-row")).toHaveCount(10);
  await expect(page.locator('[data-action="history-next"]')).toBeVisible();
  await page.locator('[data-action="history-next"]').click();
  await expect(page.locator("#flashcardsPage .flash-section").filter({hasText:"Recent games"}).locator(".flash-card-row")).toHaveCount(3);
  await expect(page.locator('[data-action="history-next"]')).toHaveCount(0);
  await page.locator('[data-action="history-prev"]').click();
  await page.locator('[data-action="review-game"]').first().click();
  await expect(page.locator("#flashOverlayRoot .flash-game-review-modal .flash-modal-close-top")).toBeVisible();
  await expect(page.locator("#flashOverlayRoot .flash-game-review-modal [data-action='close-overlay']")).toHaveCount(2);
  await page.locator("#flashOverlayRoot .flash-game-review-modal .flash-modal-close-top").click();
  await expect(page.locator("#flashOverlayRoot .flash-game-review-modal")).toHaveCount(0);
});

test("Quiz history paginates ten sessions and review closes from the top corner",async({page})=>{
  test.setTimeout(60000);
  console.log("[quiz-pagination] opening mock app");
  await openMockFlashcards(page);
  // Keep the fixed mock-control widget from covering pagination controls.
  await page.locator("#swiftMockPanel").evaluate(node=>node.hidden=true);
  console.log("[quiz-pagination] seeding 12 mock sessions");
  await page.evaluate(()=>{
    const question={
      question_id:"mock-review-question",position:1,question_type:"knowledge",
      prompt_learning:"Choose the correct example.",prompt_translation:"选择正确的例子。",
      selected_option_id:"a",correct_option_id:"a",
      explanation_learning:"This is the correct example.",explanation_translation:"这是正确的例子。",
      options:[
        {id:"a",learning_text:"Correct answer",translation_text:"正确答案"},
        {id:"b",learning_text:"Other answer",translation_text:"其他答案"}
      ]
    };
    const history=Array.from({length:12},(_,index)=>({
      session_id:"mock-quiz-history-"+index,difficulty:"beginner",status:"completed",
      question_count:1,current_position:1,learning_language_code:"en",translation_language_code:"zh",
      started_at:new Date(Date.now()-index*60000).toISOString(),
      completed_at:new Date(Date.now()-index*60000).toISOString(),
      correct_count:1,percentage:100,questions:[question]
    }));
    window.__swiftDictionaryMock.seedQuizHistory({history});
  });
  console.log("[quiz-pagination] navigating to Quiz");
  await page.locator('[data-page="quiz"]').click({timeout:5000});
  await expect(page.locator("#quizPage")).toBeVisible();
  const intro=page.locator("#learningIntroBackdrop");
  if(await intro.isVisible())await page.locator("#learningIntroDismiss").click({timeout:5000});
  console.log("[quiz-pagination] checking first page");
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("#quizPage > .learning-banner")).toBeVisible();
  await expect(page.locator("#quizHistory .quiz-history-row")).toHaveCount(10);
  await expect(page.locator("[data-quiz-history-next]")).toBeVisible();
  console.log("[quiz-pagination] checking second page");
  await page.locator("[data-quiz-history-next]").click({timeout:5000});
  await expect(page.locator("#quizHistory .quiz-history-row")).toHaveCount(2);
  await expect(page.locator("[data-quiz-history-next]")).toHaveCount(0);
  await page.locator("[data-quiz-history-prev]").click({timeout:5000});
  console.log("[quiz-pagination] opening answer review");
  await page.locator("#quizHistory [data-quiz-review]").first().click({timeout:5000});
  await expect(page.locator("#quizResults")).toBeVisible();
  await expect(page.locator("body")).toHaveClass(/quiz-focused/);
  await expect(page.locator("#quizPage > .learning-banner")).toBeHidden();
  await expect(page.locator("#quizResultsContent [data-quiz-review-close]")).toBeVisible();
  const reviewCloseBox=await page.locator("#quizResultsContent [data-quiz-review-close]").boundingBox();
  const reviewScoreBox=await page.locator("#quizResultsContent .quiz-review-score").boundingBox();
  expect(reviewCloseBox.x).toBeGreaterThan(reviewScoreBox.x+reviewScoreBox.width);

  console.log("[quiz-pagination] closing answer review");
  await page.locator("#quizResultsContent [data-quiz-review-close]").click({timeout:5000});
  await expect(page.locator("#quizHome")).toBeVisible();
  await expect(page.locator("body")).not.toHaveClass(/quiz-focused/);
  await expect(page.locator("#quizPage > .learning-banner")).toBeVisible();
  console.log("[quiz-pagination] passed");
});


test("Chinese Translation Recall hides Chinese choices until the answer phase",async({page})=>{
  await openMockFlashcards(page);
  await page.locator("#courseSelect").selectOption("zh");
  await expect.poll(()=>page.locator(".flash-mode").evaluateAll(nodes=>nodes.map(node=>node.dataset.mode))).toEqual(["word","definition","translation","sentence"]);
  await page.locator("#translationSelect").selectOption("en");
  await page.locator('[data-action="set-duration"][data-value="60"]').click();
  await page.locator('[data-action="open-setup"][data-mode="translation"]').click();
  await page.locator("#flashDifficulty").selectOption("beginner");
  await page.locator("#flashGameCollection").selectOption("all");
  await page.locator('[data-action="begin-game"]').click();
  await expect(page.locator(".flash-game")).toBeVisible();
  const memory=await page.locator("#flashMemory").innerText();
  expect(memory).not.toMatch(/[一-龥]/);
  await expect(page.locator("#flashOptions .flash-option.is-hidden")).toHaveCount(4);
  await page.locator('[data-action="phase-action"]').click();
  const options=await page.locator("#flashOptions .flash-option").allTextContents();
  expect(options).toHaveLength(4);
  expect(new Set(options.map(value=>value.trim())).size).toBe(4);
  expect(options.every(value=>/[一-龥]/.test(value))).toBe(true);
  await page.locator('[data-action="leave-game"]').click();
  await expect(page.locator(".flash-banner")).toBeVisible();
});

test("Chinese Translation Recall only uses cards with a unique cue in the selected language",async({page})=>{
  await openMockFlashcards(page);
  await page.locator("#courseSelect").selectOption("zh");
  for(const language of ["en","zh"]){
    await page.locator("#translationSelect").selectOption(language);
    await beginRecall(page,"translation","beginner","all",60);
    await page.locator('[data-action="phase-action"]').click();
    const options=await page.locator("#flashOptions .flash-option").allTextContents();
    expect(options).toHaveLength(4);
    expect(new Set(options.map(value=>value.trim())).size).toBe(4);
    const eligible=await page.evaluate(({language,options})=>{
      const bank=window.SWIFT_CHINESE_FLASHCARDS;
      const cards=[...bank.characters,...bank.vocabulary,...bank.phrases];
      const byWord=new Map(cards.map(card=>[card.word,card]));
      return options.map(value=>({word:value.trim(),supported:byWord.get(value.trim())?.translationLanguages?.includes(language)===true}));
    },{language,options});
    expect(eligible.every(item=>item.supported),JSON.stringify({language,eligible})).toBe(true);
    await page.locator('[data-action="leave-game"]').click();
    await expect(page.locator(".flash-banner")).toBeVisible();
  }
});

test("Chinese Sentence Recall uses curated examples when source examples would create ambiguous prompts",async({page})=>{
  await page.clock.install();
  await openMockFlashcards(page);
  await page.locator("#courseSelect").selectOption("zh");
  await page.locator("#translationSelect").selectOption("en");
  await page.locator('[data-action="set-duration"][data-value="60"]').click();
  await page.locator('[data-action="open-setup"][data-mode="sentence"]').click();
  await page.locator("#flashDifficulty").selectOption("beginner");
  await page.locator("#flashGameCollection").selectOption("all");
  const target=await page.evaluate(()=>{
    const bank=window.SWIFT_CHINESE_FLASHCARDS;
    const pool=[...bank.characters,...bank.vocabulary,...bank.phrases].filter(card=>Array.isArray(card.availableModes)&&card.availableModes.includes("sentence")&&(card.sentenceExampleZh||card.exampleZh));
    const card=pool.find(item=>item.word==="近");
    if(!card)throw new Error("Sentence Recall override for 近 is missing");
    return {index:pool.indexOf(card),total:pool.length,word:card.word};
  });
  await page.evaluate(({index,total})=>{
    window.__originalFlashcardRandom=Math.random;
    Math.random=()=>((index+0.25)/total);
  },target);
  await page.locator('[data-action="begin-game"]').click();
  await expect(page.locator(".flash-game")).toBeVisible();
  await expect(page.locator("#flashMemory")).toHaveText("这家商店离地铁站很_____。");
  await expect(page.locator("#flashMemory")).not.toContainText(target.word);
  await page.evaluate(()=>{
    if(window.__originalFlashcardRandom){Math.random=window.__originalFlashcardRandom;delete window.__originalFlashcardRandom;}
  });
  await page.locator('[data-action="leave-game"]').click();
  await expect(page.locator(".flash-banner")).toBeVisible();
});

test("Chinese Sentence Recall blanks every repeated character and keeps choices hidden",async({page})=>{
  await page.clock.install();
  await openMockFlashcards(page);
  await page.locator("#courseSelect").selectOption("zh");
  await expect.poll(()=>page.locator(".flash-mode").evaluateAll(nodes=>nodes.map(node=>node.dataset.mode))).toEqual(["word","definition","translation","sentence"]);
  await page.locator("#translationSelect").selectOption("en");
  await page.locator('[data-action="set-duration"][data-value="60"]').click();
  await page.locator('[data-action="open-setup"][data-mode="sentence"]').click();
  await page.locator("#flashDifficulty").selectOption("beginner");
  await page.locator("#flashGameCollection").selectOption("all");
  const target=await page.evaluate(()=>{
    const bank=window.SWIFT_CHINESE_FLASHCARDS;
    const pool=[...bank.characters,...bank.vocabulary,...bank.phrases].filter(card=>Array.isArray(card.availableModes)&&card.availableModes.includes("sentence")&&card.exampleZh);
    const card=pool.find(item=>item.word==="常"&&item.exampleZh.split(item.word).length-1>1);
    if(!card)throw new Error("Repeated Chinese target 常 is missing from the Flashcard bank");
    return {index:pool.indexOf(card),total:pool.length,word:card.word};
  });
  await page.evaluate(({index,total})=>{
    window.__originalFlashcardRandom=Math.random;
    const value=(index+0.25)/total;
    Math.random=()=>value;
  },target);
  await page.locator('[data-action="begin-game"]').click();
  await expect(page.locator(".flash-game"),"Chinese Sentence Recall did not start.").toBeVisible();
  await expect(page.locator("#flashMemory")).toContainText("_____");
  await expect(page.locator("#flashMemory")).not.toContainText(target.word);
  await expect(page.locator("#flashOptions .flash-option.is-hidden")).toHaveCount(4);
  await expect(page.locator("#flashOptions .flash-option")).toHaveText(["Hidden answer","Hidden answer","Hidden answer","Hidden answer"]);
  await expect(page.locator("#flashOptions")).not.toContainText(target.word);
  await page.evaluate(()=>{
    if(window.__originalFlashcardRandom){Math.random=window.__originalFlashcardRandom;delete window.__originalFlashcardRandom;}
  });
  await page.locator('[data-action="leave-game"]').click();
  await expect(page.locator(".flash-banner")).toBeVisible();
});
