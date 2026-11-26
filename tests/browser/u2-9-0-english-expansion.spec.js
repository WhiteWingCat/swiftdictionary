const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.route("**/supabase-config.js", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: 'window.SWIFT_SUPABASE_CONFIG = { url: "", anonKey: "" };'
  }));
  await page.route("https://*.supabase.co/**", route => route.abort());
});

test("English expansion loads before dictionary state and preserves headword-only search", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#count")).toHaveText("1316 words");
  await expect(page.locator("#pageStatus")).toHaveText("Page 1 of 14");

  await page.locator("#search").fill("bus stop");
  await expect(page.locator("#count")).toHaveText("1 word");
  await expect(page.locator(".word-card .word-name")).toHaveText("bus stop");

  // Definitions and examples must not become accidental headword search targets.
  await page.locator("#search").fill("place beside a road");
  await expect(page.locator("#count")).toHaveText("0 words");
  await expect(page.locator(".word-card")).toHaveCount(0);
});

test("new English entries open in the existing detail drawer", async ({ page }) => {
  await page.goto("/");
  await page.locator("#search").fill("post office");
  await page.locator(".word-card").first().click();

  await expect(page.locator("#modalBackdrop")).toHaveClass(/open/);
  await expect(page.locator("#modalBackdrop")).toContainText("post office");
  await expect(page.locator("#modalDefinition")).toContainText("A place where people can send letters and parcels");
});

test("switching to Chinese keeps the existing character-only catalogue isolated", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#count")).toHaveText("1316 words");

  await page.locator("#courseSelect").selectOption("zh");
  const chineseCountText = await page.locator("#count").textContent();
  const chineseCount = Number((chineseCountText || "").match(/^\d+/)?.[0] || 0);
  expect(chineseCount).toBeGreaterThan(200);
  expect(chineseCount).toBeLessThan(1316);
  const visibleChineseWords = await page.locator(".word-card .word-name").allTextContents();
  expect(visibleChineseWords.length).toBeGreaterThan(0);
  expect(visibleChineseWords.every(word => [...word].length === 1)).toBeTruthy();
  await expect(page.locator(".word-card .pinyin-line")).toHaveCount(0);
});


test("English permanent lesson expansion adds three translated, practice-ready lessons", async ({ page }) => {
  await page.goto("/");
  const catalogue = await page.evaluate(() => {
    const data = eval("lessonData");
    const zh = eval("lessonZh");
    const ids = ["b-question-forms-negatives", "i-passive-voice", "a-reported-speech"];
    return {
      counts: Object.fromEntries(Object.entries(data).map(([level, items]) => [level, items.length])),
      lessons: ids.map(id => {
        const level = Object.keys(data).find(key => data[key].some(item => item.id === id));
        const lesson = level ? data[level].find(item => item.id === id) : null;
        const translation = zh[id];
        return {
          id, level, title: lesson?.title, practiceCount: lesson?.practices?.length,
          examplesCount: lesson?.examples?.length, pointsCount: lesson?.points?.length,
          translationTitle: translation?.title, translationPracticeCount: translation?.practices?.length
        };
      })
    };
  });
  expect(catalogue.counts).toEqual({ beginner: 8, intermediate: 6, advanced: 6 });
  expect(catalogue.lessons).toEqual([
    expect.objectContaining({ id: "b-question-forms-negatives", level: "beginner", practiceCount: 5, examplesCount: 7, translationPracticeCount: 5 }),
    expect.objectContaining({ id: "i-passive-voice", level: "intermediate", practiceCount: 5, examplesCount: 6, translationPracticeCount: 5 }),
    expect.objectContaining({ id: "a-reported-speech", level: "advanced", practiceCount: 5, examplesCount: 6, translationPracticeCount: 5 })
  ]);
  expect(catalogue.lessons.every(item => item.title && item.translationTitle && item.pointsCount >= 5)).toBeTruthy();
});
