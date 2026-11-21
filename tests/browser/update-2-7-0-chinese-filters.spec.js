const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.route("**/supabase-config.js", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: 'window.SWIFT_SUPABASE_CONFIG = { url: "", anonKey: "" };'
  }));
  await page.route("https://*.supabase.co/**", route => route.abort());
});

test("Chinese dictionary filters by pinyin initial and keeps cards character-only", async ({ page }) => {
  await page.goto("/");
  await page.locator("#openDictionaryFilters").click();
  await page.locator("#courseSelect").selectOption("zh");

  await expect(page.locator("#chinesePinyinFilterLabel")).toBeVisible();
  await expect(page.locator("#alphabet")).toBeVisible();
  await expect(page.locator("#alphabet button[data-letter='B']")).toBeEnabled();
  await expect(page.locator("#chineseCategoryRow")).toBeHidden();

  await page.locator("#alphabet button[data-letter='B']").click();
  await expect(page.locator("#count")).toContainText("16");
  await expect(page.locator(".word-card")).toHaveCount(16);
  await expect(page.locator(".word-card .pinyin-line")).toHaveCount(0);

  await page.locator("#search").fill("bu");
  await expect(page.locator("#count")).toContainText("1");
  await expect(page.locator(".word-card .word-name")).toHaveText("不");
  await expect(page.locator(".word-card .pinyin-line")).toHaveCount(0);
});

test("switching back to English restores the English alphabet and part-of-speech filters", async ({ page }) => {
  await page.goto("/");
  await page.locator("#openDictionaryFilters").click();
  await page.locator("#courseSelect").selectOption("zh");
  await page.locator("#alphabet button[data-letter='B']").click();
  await page.locator("#courseSelect").selectOption("en");

  await expect(page.locator("#chinesePinyinFilterLabel")).toBeHidden();
  await expect(page.locator("#categoryRow")).toBeVisible();
  await expect(page.locator("#alphabet button[data-letter='H']")).toBeEnabled();
  await page.locator("#alphabet button[data-letter='H']").click();
  const visibleWords = await page.locator(".word-card .word-name").allTextContents();
  expect(visibleWords.length).toBeGreaterThan(0);
  expect(visibleWords.every(word => word.toUpperCase().startsWith("H"))).toBeTruthy();
});
