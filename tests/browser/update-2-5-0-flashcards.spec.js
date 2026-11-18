const { test, expect } = require("@playwright/test");

async function openMockFlashcards(page) {
  await page.route("**/supabase-config.js", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: 'window.SWIFT_SUPABASE_CONFIG = { url: "https://swift-test.supabase.co", anonKey: "mock-publishable-key" };'
  }));
  await page.route("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: "window.supabase = { createClient: function(){ return {}; } };"
  }));
  await page.route("https://cdn.jsdelivr.net/npm/hanzi-writer@3.7.3/dist/hanzi-writer.min.js", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: "window.HanziWriter = window.HanziWriter || function(){};"
  }));
  await page.goto("/?swiftMock=1");
  await expect(page.locator("#swiftMockPanel")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.SWIFT_DICTIONARY_MOCK_MODE)).toBe(true);
  await page.locator('[data-page="flashcards"]').click();
  await expect(page.locator("#flashcardsPage")).toBeVisible();
  const intro=page.locator("#learningIntroBackdrop");
  if(await intro.isVisible())await page.locator("#learningIntroDismiss").click();
  await expect(page.locator("#flashCollectionForm")).toBeVisible();
  await expect(page.locator("#flashcardsApp")).toContainText("Daily allowance: 0/3 games used · 3 remaining today");
}

async function createCollection(page,name="Flashcards CI") {
  await page.locator('#flashCollectionForm input[name="name"]').fill(name);
  await page.locator('#flashCollectionForm button[type="submit"]').click();
  await expect(page.locator("#flashManageCollection option").filter({hasText:name})).toHaveCount(1);
  return page.locator("#flashManageCollection").inputValue();
}

async function addCustomCard(page,front,back,example,translation) {
  await page.locator("#flashCustomForm").evaluate(form => { form.closest("details").open=true; });
  await page.locator('#flashCustomForm input[name="front"]').fill(front);
  await page.locator('#flashCustomForm textarea[name="back"]').fill(back);
  await page.locator('#flashCustomForm textarea[name="example"]').fill(example);
  await page.locator('#flashCustomForm input[name="translation"]').fill(translation);
  await page.locator('#flashCustomForm button[type="submit"]').click();
  await expect(page.locator("#flashcardsApp .flash-card-row").filter({hasText:front})).toHaveCount(1);
}

async function startGame(page,collectionId,mode="word",difficulty="beginner") {
  await page.locator('[data-action="mode"][data-value="'+mode+'"]').click();
  await page.locator("#flashDifficulty").selectOption(difficulty);
  await page.locator("#flashGameCollection").selectOption(collectionId);
  await page.locator('[data-action="start-game"]').click();
  await expect(page.locator(".flash-game")).toBeVisible();
  await expect(page.locator("#flashMemory")).not.toBeEmpty();
}

test("Mock User Flashcards supports custom collections, four modes, timer reductions and timeouts",async({page})=>{
  test.setTimeout(90000);
  await openMockFlashcards(page);
  const collectionId=await createCollection(page);
  await addCustomCard(page,"What is a collocation?","Words that commonly occur together.","We say make a decision, not do a decision.","常见词语搭配");
  await addCustomCard(page,"What does concise mean?","Using few words while giving the needed information.","A concise explanation is easy to follow.","简洁的");
  await page.locator("#flashDictionarySearch").fill("hello");
  await page.locator("#flashDictionaryResults [data-add-word]").first().click();
  await expect(page.locator("#flashcardsApp .flash-card-row").filter({hasText:"hello"})).toHaveCount(1);

  // Collection order can be changed and remains visible after the RPC refresh.
  const before=await page.locator("#flashcardsApp .flash-card-row strong").allTextContents();
  await page.locator('#flashcardsApp [data-action="reorder-down"]').first().click();
  await expect.poll(()=>page.locator("#flashcardsApp .flash-card-row strong").allTextContents()).not.toEqual(before);

  await page.clock.install();
  for(const mode of ["word","definition","translation","sentence"]){
    await startGame(page,collectionId,mode,"beginner");
    if(mode==="sentence")await expect(page.locator("#flashMemory")).toContainText("_____");
    await page.clock.fastForward(5000);
    const options=await page.locator("#flashOptions .flash-option").allTextContents();
    expect(options).toHaveLength(4);
    expect(new Set(options.map(value=>value.trim().toLocaleLowerCase())).size).toBe(4);
    if(mode==="sentence")await expect(page.locator("#flashQuestion")).toContainText("Which word completes the sentence?");
    await page.locator('[data-action="leave-game"]').click();
    await expect(page.locator("#flashcardsApp")).toBeVisible();
  }

  // A selected answer shortens both timers by the approved fixed reductions.
  await startGame(page,collectionId,"word","beginner");
  await page.clock.fastForward(5000);
  await page.locator("#flashOptions .flash-option").first().click();
  await page.clock.fastForward(450);
  await expect(page.locator("#flashTimerLabel")).toHaveText("Memory 4.5s · Answer 11s");
  await expect(page.locator(".flash-stat strong").first()).toHaveText("1");
  await page.locator('[data-action="leave-game"]').click();

  // A per-question timeout is recorded as incorrect and also reduces the next timers.
  await startGame(page,collectionId,"word","beginner");
  await page.clock.fastForward(5000);
  await page.clock.fastForward(12000);
  await page.clock.fastForward(450);
  await expect(page.locator(".flash-stat strong").nth(0)).toHaveText("1");
  await expect(page.locator(".flash-stat strong").nth(1)).toHaveText("0");
  await expect(page.locator(".flash-stat strong").nth(2)).toHaveText("1");
  await expect(page.locator("#flashTimerLabel")).toHaveText("Memory 4.5s · Answer 11s");
  await page.locator('[data-action="leave-game"]').click();

  const usage=await page.evaluate(async()=>window.__swiftDictionaryMock.getClient().rpc("get_my_learning_allowance_usage"));
  expect(usage.data.find(row=>row.activity_type==="flashcard").used_count).toBe(0);
});

test("A completed 60-second Flash Recall game saves mastery and charges one Free allowance",async({page})=>{
  test.setTimeout(90000);
  await openMockFlashcards(page);
  const collectionId=await createCollection(page,"Completion test");
  await addCustomCard(page,"What is a synonym?","A word with a similar meaning.","Small is a synonym of little.","同义词");
  await page.clock.install();
  await startGame(page,collectionId,"definition","advanced");
  await page.clock.fastForward(60000);
  await expect(page.locator("#flashNotice")).toContainText("Game complete",{timeout:10000});
  await expect(page.locator("#flashcardsApp")).toContainText("Daily allowance: 1/3 games used · 2 remaining today");
  const result=await page.evaluate(async()=>{
    const client=window.__swiftDictionaryMock.getClient();
    const [data,usage]=await Promise.all([client.rpc("get_my_flashcard_data"),client.rpc("get_my_learning_allowance_usage")]);
    return {history:data.data.history,mastery:data.data.mastery,used:usage.data.find(row=>row.activity_type==="flashcard").used_count};
  });
  expect(result.history).toHaveLength(1);
  expect(result.history[0].words_seen).toBeGreaterThan(0);
  expect(result.history[0].incorrect_count).toBeGreaterThanOrEqual(result.history[0].unanswered_count);
  expect(result.mastery.length).toBeGreaterThan(0);
  expect(result.used).toBe(1);
  await page.evaluate(()=>window.showPage("profile"));
  await expect(page.locator("#dashboardAllowanceBars")).toContainText("2 of 3 remaining · 1 used");
});

test("Flashcard collections remain isolated when Mock User accounts are switched",async({page})=>{
  await openMockFlashcards(page);
  await createCollection(page,"Private A collection");
  await page.locator("#swiftMockUser").selectOption("mock-user-b");
  await expect.poll(()=>page.evaluate(()=>window.__swiftDictionaryMock.activeUser())).toBe("mock-user-b");
  await expect(page.locator("#flashManageCollection option").filter({hasText:"Private A collection"})).toHaveCount(0);
  await page.locator("#swiftMockUser").selectOption("mock-user-a");
  await expect.poll(()=>page.evaluate(()=>window.__swiftDictionaryMock.activeUser())).toBe("mock-user-a");
  await expect(page.locator("#flashManageCollection option").filter({hasText:"Private A collection"})).toHaveCount(1);
});
