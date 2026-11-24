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
