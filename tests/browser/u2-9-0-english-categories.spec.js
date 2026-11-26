const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.route("**/supabase-config.js", route => route.fulfill({
    status: 200, contentType: "application/javascript",
    body: 'window.SWIFT_SUPABASE_CONFIG = { url: "", anonKey: "" };'
  }));
  await page.route("https://*.supabase.co/**", route => route.abort());
});

test("English topic filters combine with headword search and preserve POS filters", async ({ page }) => {
  await page.goto("/");
  await page.locator("#courseSelect").selectOption("en");
  await page.locator("#openDictionaryFilters").click();
  const topics = page.locator("#englishTopicCategoryRow");
  await expect(topics).toBeVisible();
  await expect(topics.locator("button")).toHaveCount(11);

  await page.locator("#search").fill("acoustics");
  await topics.getByRole("button", { name: "Science & Technology" }).click();
  await expect(page.locator("#count")).toHaveText("1 word");
  await expect(page.locator(".word-card .word-name")).toHaveText("acoustics");

  await page.locator("#search").fill("place beside a road");
  await expect(page.locator("#count")).toHaveText("0 words");
  await topics.getByRole("button", { name: "All topics" }).click();
  await expect(page.locator("#count")).toHaveText("0 words");

  await page.locator("#search").fill("accretion");
  await topics.getByRole("button", { name: "Science & Technology" }).click();
  await expect(page.locator("#count")).toHaveText("1 word");
  await expect(page.locator(".word-card .word-name")).toHaveText("accretion");

  await page.locator("#search").fill("");
  await page.locator("#categoryRow").getByRole("button", { name: "Verbs", exact: true }).click();
  const verbCount = Number((await page.locator("#count").textContent()).match(/^\d+/)[0]);
  expect(verbCount).toBeGreaterThan(0);
  expect(verbCount).toBeLessThan(1316);
});

test("Simplified Chinese translation switching refreshes an open multi-sense English entry", async ({ page }) => {
  await page.goto("/");
  await page.locator("#courseSelect").selectOption("en");
  await page.locator("#translationSelect").selectOption("zh");
  await page.locator("#search").fill("accept");
  await page.locator(".word-card").first().click();
  await expect(page.locator("#modalDefinition")).toContainText("接受");
  await expect(page.locator("#modalDefinition .definition-sense")).toHaveCount(2);

  await page.locator("#translationSelect").selectOption("en");
  await expect(page.locator("#modalDefinition")).toContainText("agree to receive");
  await page.locator("#translationSelect").selectOption("zh");
  await expect(page.locator("#modalDefinition")).toContainText("接受");
  await expect(page.locator("#modalBackdrop")).toHaveClass(/open/);

  // Single-sense baseline entries use the headword-level translation fallback.
  await page.locator("#closeButton").click();
  await page.locator("#search").fill("ability");
  await page.locator(".word-card").first().click();
  await expect(page.locator("#modalDefinition")).toContainText("能力");
  await page.locator("#translationSelect").selectOption("en");
  await expect(page.locator("#modalDefinition")).toContainText("skill or power");
  await page.locator("#translationSelect").selectOption("zh");
  await expect(page.locator("#modalDefinition")).toContainText("能力");

  // Expansion entries use their explicit sense-level Chinese translations.
  await page.locator("#closeButton").click();
  await page.locator("#search").fill("adjust");
  await page.locator(".word-card").first().click();
  await expect(page.locator("#modalDefinition")).toContainText("调整");
  await expect(page.locator("#modalDefinition .definition-sense")).toHaveCount(2);
  await page.locator("#translationSelect").selectOption("en");
  await expect(page.locator("#modalDefinition")).toContainText("make a small change");
  await page.locator("#translationSelect").selectOption("zh");
  await expect(page.locator("#modalDefinition")).toContainText("逐渐适应");
});

test("English topic filters remain separate from Chinese character filters", async ({ page }) => {
  await page.goto("/");
  await page.locator("#courseSelect").selectOption("en");
  await page.locator("#openDictionaryFilters").click();
  await expect(page.locator("#englishTopicCategoryRow")).toBeVisible();
  await page.locator("#englishTopicCategoryRow").getByRole("button", { name: "Science & Technology", exact: true }).click();
  await expect(page.locator("#englishTopicCategoryRow").getByRole("button", { name: "Science & Technology", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.locator("#courseSelect").selectOption("zh");
  await expect(page.locator("#englishTopicCategoryRow")).toBeHidden();
  await expect(page.locator("#chineseCategoryRow")).toBeVisible();
  const words = await page.locator(".word-card .word-name").allTextContents();
  expect(words.length).toBeGreaterThan(0);
  expect(words.every(word => [...word].length === 1)).toBeTruthy();
  await page.locator("#courseSelect").selectOption("en");
  await expect(page.locator("#englishTopicCategoryRow")).toBeVisible();
  await expect(page.locator("#englishTopicCategoryRow").getByRole("button", { name: "All topics", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("English topic filters wrap and remain usable on a narrow mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#courseSelect").selectOption("en");
  await page.locator("#openDictionaryFilters").click();

  const topicRow = page.locator("#englishTopicCategoryRow");
  await expect(topicRow).toBeVisible();
  await expect(topicRow.locator("button")).toHaveCount(11);
  const panel = page.locator("#dictionaryFiltersPanel");
  const dimensions = await panel.evaluate(node => ({
    clientWidth: node.clientWidth,
    scrollWidth: node.scrollWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 2);

  await topicRow.getByRole("button", { name: "Places", exact: true }).click();
  const count = Number((await page.locator("#count").textContent()).match(/^\d+/)[0]);
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(1316);
});

test("Premium plan entry navigates to a dedicated future-only comparison page", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Premium plan", exact: true });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await page.waitForURL(/premium-plan\.html(?:$|\?)/);
  await expect(page.getByRole("heading", { name: "Free vs Premium" })).toBeVisible();
  const rows = page.locator(".premium-comparison-row");
  await expect(rows).toHaveCount(6);
  await expect(rows.nth(0)).toContainText("Unlimited");
  await expect(rows.nth(0)).toContainText("Always free");
  await expect(rows.nth(1)).toContainText("1 completion per category / day");
  await expect(rows.nth(1)).toContainText("3 completions per category / day");
  await expect(rows.nth(2)).toContainText("5 per local day");
  await expect(rows.nth(2)).toContainText("15 per local day");
  await expect(rows.nth(3)).toContainText("1 per local day");
  await expect(rows.nth(3)).toContainText("3 per local day");
  await expect(rows.nth(4)).toContainText("3 per local day");
  await expect(rows.nth(4)).toContainText("10 per local day");
  await expect(rows.nth(5)).toContainText("16 folders");
  await expect(rows.nth(5)).toContainText("40 folders");
  await expect(page.locator(".premium-capacity")).toHaveText("Active folder limit");
  await expect(page.locator(".premium-status")).toContainText("Premium is not currently available to purchase.");
  await expect(page.locator("button,[role=dialog]")).toHaveCount(0);
});

test("Premium comparison page fits a narrow mobile viewport without hiding comparison rows", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/premium-plan.html");
  await expect(page.getByRole("heading", { name: "Free vs Premium" })).toBeVisible();
  const rows = page.locator(".premium-comparison-row");
  await expect(rows).toHaveCount(6);
  for (let index = 0; index < 6; index++) await expect(rows.nth(index)).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    content: document.querySelector(".premium-shell").scrollWidth
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test("every English topic category returns entries and keeps pagination scoped to the topic", async ({ page }) => {
  await page.goto("/");
  await page.locator("#courseSelect").selectOption("en");
  await page.locator("#openDictionaryFilters").click();
  const topics = page.locator("#englishTopicCategoryRow");
  const labels = [
    "Actions", "Everyday Terms", "Activities", "Places", "People & Relationships",
    "Science & Technology", "History & Culture", "Nature & Environment",
    "Education", "Emotions & Descriptions"
  ];
  for (const label of labels) {
    await topics.getByRole("button", { name: label, exact: true }).click();
    const count = Number((await page.locator("#count").textContent()).match(/^\d+/)[0]);
    expect(count, label + " should return entries").toBeGreaterThan(0);
  }
  await topics.getByRole("button", { name: "Actions", exact: true }).click();
  await expect(page.locator("#pageStatus")).toHaveText("Page 1 of 5");
  await expect(page.locator("#nextPage")).toBeEnabled();
  await page.locator("#nextPage").click();
  await expect(page.locator("#pageStatus")).toHaveText("Page 2 of 5");
});

test("editorially corrected expansion senses display context-aligned Chinese translations", async ({ page }) => {
  await page.goto("/");
  await page.locator("#courseSelect").selectOption("en");
  await page.locator("#translationSelect").selectOption("zh");
  const cases = [
    ["lecture", "作正式演讲"],
    ["father", "成为孩子的父亲"],
    ["mother", "像母亲一样悉心照料"],
    ["pedestrian", "供行人步行的"],
    ["favourite", "最喜欢的人或事物"],
    ["cycle", "骑自行车"],
    ["picnic", "在户外用餐"],
    ["design", "设计或规划"],
    ["golf", "打高尔夫球"],
    ["kayak", "使用桨划皮划艇"],
    ["breeze", "轻松而迅速地"],
    ["coral", "珊瑚色的"],
    ["telephone", "通过电话给某人打电话"],
    ["text message", "发送短信"]
  ];
  for (const [word, expectedChinese] of cases) {
    await page.locator("#search").fill(word);
    await page.locator(".word-name").filter({ hasText: new RegExp("^" + word + "$", "i") }).first().click();
    await expect(page.locator("#modalDefinition")).toContainText(expectedChinese);
    await page.locator("#closeButton").click();
  }
});
