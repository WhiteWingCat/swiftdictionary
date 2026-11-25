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
});

test("English topic filters remain separate from Chinese character filters", async ({ page }) => {
  await page.goto("/");
  await page.locator("#courseSelect").selectOption("en");
  await page.locator("#openDictionaryFilters").click();
  await expect(page.locator("#englishTopicCategoryRow")).toBeVisible();
  await page.locator("#courseSelect").selectOption("zh");
  await expect(page.locator("#englishTopicCategoryRow")).toBeHidden();
  await expect(page.locator("#chineseCategoryRow")).toBeVisible();
  const words = await page.locator(".word-card .word-name").allTextContents();
  expect(words.length).toBeGreaterThan(0);
  expect(words.every(word => [...word].length === 1)).toBeTruthy();
  await page.locator("#courseSelect").selectOption("en");
  await expect(page.locator("#englishTopicCategoryRow")).toBeVisible();
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
