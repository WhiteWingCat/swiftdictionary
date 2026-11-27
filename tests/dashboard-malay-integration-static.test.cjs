const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

test("Dashboard Favorite Words has a Malay group and renders its saved entries", () => {
  assert.match(html, /id="favoriteMalayGrid"/);
  assert.match(html, /renderGroup\("ms","favoriteMalayGrid"\)/);
  assert.match(html, /const catalogue = dictionaryEntriesFor\(code\)/);
});

test("Daily History names Malay learning activities and resolves Malay titles", () => {
  assert.match(html, /daily_topic:"Daily Topic"/);
  assert.match(html, /daily_application:"Daily Application"/);
  assert.match(html, /daily_discovery:"Daily Discovery"/);
  assert.match(html, /daily_revision:"Daily Revision"/);
  assert.match(html, /language==="ms"\s*\?\s*window\.SWIFT_MALAY_DAILY_LEARNING/);
  assert.match(html, /ms:"Bahasa Melayu"/);
  assert.match(html, /groups\.dailyLearning\.push/);
  assert.match(html, /renderGroup\("dailyLearning","Daily Learning"/);
});

test("Malay support-language selection stays separate from the Malay learning course", () => {
  assert.match(html, /translationSelect: malayDictionaryTargetReady/);
  assert.match(html, /preferenceTranslation: malayDictionaryTargetReady/);
  assert.match(html, /translation==="ms" && !malayDictionaryTargetReady/);
});
