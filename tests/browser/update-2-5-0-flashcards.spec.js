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
  await expect.poll(() => page.evaluate(() => window.__swiftDictionaryMock !== undefined)).toBe(true);
  await page.locator('[data-page="flashcards"]').click();
  await expect(page.locator("#flashcardsPage")).toBeVisible();
  const intro=page.locator("#learningIntroBackdrop");
  if(await intro.isVisible())await page.locator("#learningIntroDismiss").click();
  await expect(page.locator("#flashCollectionForm")).toBeVisible();
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

test("Mock User can build a collection, play Flash Recall and see allowance usage",async({page})=>{
  test.setTimeout(60000);
  await openMockFlashcards(page);
  const collectionId=await createCollection(page);
  await addCustomCard(page,"What is a collocation?","Words that commonly occur together.","We say make a decision, not do a decision.","常见词语搭配");
  await page.locator("#flashDictionarySearch").evaluate(input=>{input.closest("details").open=true;});
  await page.locator("#flashDictionarySearch").fill("aberration");
  await expect(page.locator("#flashDictionaryResults [data-add-word]")).toHaveCount(1);
  await page.locator("#flashDictionaryResults [data-add-word]").click();
  await expect(page.locator("#flashNotice")).toContainText("Dictionary word added.");
  await expect(page.locator("#flashcardsApp .flash-card-row").filter({hasText:"aberration"})).toHaveCount(1);

  const modes=await page.locator('[data-action="mode"]').evaluateAll(elements=>elements.map(element=>element.dataset.value));
  expect(modes).toEqual(["word","definition","translation","sentence"]);
  expect(await page.locator("#flashDifficulty option").evaluateAll(elements=>elements.map(element=>element.value))).toEqual(["beginner","intermediate","advanced"]);
  await expect(page.locator("#flashcardsApp")).toContainText("Daily allowance: 0/3 games used · 3 remaining today");

  await startGame(page,collectionId,"word","beginner");
  await page.waitForTimeout(5100);
  const options=await page.locator("#flashOptions .flash-option").allTextContents();
  expect(options).toHaveLength(4);
  expect(new Set(options.map(value=>value.trim().toLocaleLowerCase())).size).toBe(4);
  await page.locator("#flashOptions .flash-option").first().click();
  await page.waitForTimeout(500);
  await expect(page.locator("#flashTimerLabel")).toHaveText("Memory 4.5s · Answer 11s");
  await page.locator('[data-action="leave-game"]').click();

  const completed=await page.evaluate(async()=>{
    const client=window.__swiftDictionaryMock.getClient();
    const data=await client.rpc("get_my_flashcard_data");
    const custom=data.data.cards.find(card=>card.card_type==="custom");
    const started=await client.rpc("start_my_flashcard_game",{p_mode:"word",p_difficulty:"beginner"});
    const result=await client.rpc("complete_my_flashcard_game",{
      p_session_id:started.data.session_id,
      p_results:[{card_key:"custom:"+custom.id,correct:true,unanswered:false}]
    });
    return {error:result.error};
  });
  expect(completed.error).toBeNull();
  await page.evaluate(()=>window.dispatchEvent(new Event("swift-auth-updated")));
  await expect(page.locator("#flashcardsApp")).toContainText("Daily allowance: 1/3 games used · 2 remaining today");
  await page.locator("#accountButton").click();
  await page.locator("#menuProfile").click();
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

test("deleting the selected collection returns the manager to the all-words state",async({page})=>{
  await openMockFlashcards(page);
  await createCollection(page,"Collection to delete");
  await page.once("dialog",dialog=>dialog.accept());
  await page.locator('[data-action="delete-collection"]').click();
  await expect(page.locator("#flashManageCollection option").filter({hasText:"Collection to delete"})).toHaveCount(0);
  await expect(page.locator("#flashManageCollection")).toHaveValue("");
  await expect(page.locator("#flashcardsApp")).toContainText("Select a collection above to manage its cards.");
});

test("edited dictionary cards use their saved content in a selected Flash Recall set",async({page})=>{
  test.setTimeout(45000);
  await openMockFlashcards(page);
  const collectionId=await createCollection(page,"Edited dictionary cards");
  await page.locator("#flashDictionarySearch").evaluate(input=>{input.closest("details").open=true;});
  await page.locator("#flashDictionarySearch").fill("aberration");
  await page.locator("#flashDictionaryResults [data-add-word]").click();
  await expect(page.locator("#flashcardsApp .flash-card-row").filter({hasText:"aberration"})).toHaveCount(1);
  const promptAnswers=["edited front","edited definition"];
  page.on("dialog",dialog=>dialog.accept(promptAnswers.shift()));
  await page.locator('#flashcardsApp [data-action="edit-card"]').click();
  await expect(page.locator("#flashcardsApp .flash-card-row").filter({hasText:"edited front"})).toHaveCount(1);
  await startGame(page,collectionId,"word","beginner");
  await expect(page.locator("#flashMemory")).toHaveText("edited front");
  await page.waitForTimeout(5100);
  await expect(page.locator("#flashOptions")).toContainText("edited definition");
  await page.locator('[data-action="leave-game"]').click();
});
