const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.route("**/supabase-config.js", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: 'window.SWIFT_SUPABASE_CONFIG = { url: "", anonKey: "" };'
  }));
  await page.route("https://*.supabase.co/**", route => route.abort());
});
async function resetChineseGridToFirstPage(page) {
  const previous = page.locator("#previousPage");
  for (let i = 0; i < 10 && await previous.isEnabled(); i++) await previous.click();
}

async function expectChineseCharacterInFilteredGrid(page, character) {
  await resetChineseGridToFirstPage(page);
  const words = page.locator("#wordGrid .word-card .word-name");
  const next = page.locator("#nextPage");
  for (let i = 0; i < 10; i++) {
    if (await words.filter({ hasText: character }).count() === 1) return;
    if (!(await next.isEnabled())) break;
    await next.click();
  }
  await expect(words.filter({ hasText: character })).toHaveCount(1);
}


test("Chinese dictionary filters by pinyin initial and keeps cards character-only", async ({ page }) => {
  await page.goto("/");
  await page.locator("#openDictionaryFilters").click();
  await page.locator("#courseSelect").selectOption("zh");

  await expect(page.locator("#chinesePinyinFilterLabel")).toBeVisible();
  await expect(page.locator("#alphabet")).toBeVisible();
  await expect(page.locator("#alphabet button[data-letter='B']")).toBeEnabled();
  await expect(page.locator("#chineseCategoryRow")).toBeVisible();

  await page.locator("#alphabet button[data-letter='B']").click();
  const filteredCount = await page.locator("#wordGrid .word-card").count();
  expect(filteredCount).toBeGreaterThan(0);
  await expect(page.locator("#wordGrid .word-card .pinyin-line")).toHaveCount(0);

  await page.locator("#search").fill("bu");
  const pinyinMatches = page.locator("#wordGrid .word-card .word-name");
  expect(await pinyinMatches.count()).toBeGreaterThanOrEqual(2);
  await expect(pinyinMatches.filter({ hasText: "不" })).toHaveCount(1);
  await expect(pinyinMatches.filter({ hasText: "部" })).toHaveCount(1);
  await expect(page.locator("#wordGrid .word-card .pinyin-line")).toHaveCount(0);
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
  const visibleWords = await page.locator("#wordGrid .word-card .word-name").allTextContents();
  expect(visibleWords.length).toBeGreaterThan(0);
  expect(visibleWords.every(word => word.toUpperCase().startsWith("H"))).toBeTruthy();
});

test("polyphonic characters are discoverable under each pinyin initial", async ({ page }) => {
  await page.goto("/");
  await page.locator("#openDictionaryFilters").click();
  await page.locator("#courseSelect").selectOption("zh");

  await page.locator("#alphabet button[data-letter='H']").click();
  await expect(page.locator("#wordGrid .word-card .word-name").filter({ hasText: "会" })).toHaveCount(1);

  await page.locator("#alphabet button[data-letter='K']").click();
  await expect(page.locator("#wordGrid .word-card .word-name").filter({ hasText: "会" })).toHaveCount(1);

  await page.locator("#alphabet button[data-letter='C']").click();
  await expect(page.locator("#wordGrid .word-card .word-name").filter({ hasText: "朝" })).toHaveCount(1);
  await expect(page.locator("#wordGrid .word-card .word-name").filter({ hasText: "曾" })).toHaveCount(1);

  await page.locator("#alphabet button[data-letter='Z']").click();
  await expect(page.locator("#wordGrid .word-card .word-name").filter({ hasText: "朝" })).toHaveCount(1);
  await expect(page.locator("#wordGrid .word-card .word-name").filter({ hasText: "曾" })).toHaveCount(1);
});

test("Chinese category and pinyin filters combine", async ({ page }) => {
  await page.goto("/");
  await page.locator("#openDictionaryFilters").click();
  await page.locator("#courseSelect").selectOption("zh");

  await page.locator("#chineseCategoryRow button[data-chinese-category='actions']").click();
  await expectChineseCharacterInFilteredGrid(page, "打");

  await page.locator("#alphabet button[data-letter='B']").click();
  await expectChineseCharacterInFilteredGrid(page, "帮");
  await expect(page.locator("#wordGrid .word-card .word-name").filter({ hasText: "打" })).toHaveCount(0);
});
test("legacy Chinese dictionary entries are included in category filters", async ({ page }) => {
  await page.goto("/");
  await page.locator("#openDictionaryFilters").click();
  await page.locator("#courseSelect").selectOption("zh");
  await page.locator("#chineseCategoryRow button[data-chinese-category='actions']").click();

  await expectChineseCharacterInFilteredGrid(page, "买");
  await expectChineseCharacterInFilteredGrid(page, "卖");
  await expectChineseCharacterInFilteredGrid(page, "吃");
  await expect(page.locator("#wordGrid .word-card .pinyin-line")).toHaveCount(0);
});
