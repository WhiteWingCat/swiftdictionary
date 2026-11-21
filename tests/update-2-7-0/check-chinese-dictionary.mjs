import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html = fs.readFileSync("index.html", "utf8");
let inlineScripts = 0;
for (const match of html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi)) {
  const attrs = match[1] || "";
  const body = match[2] || "";
  if (/\\bsrc\\s*=/.test(attrs) || !body.trim() || /type\\s*=\\s*["']application\\//i.test(attrs)) continue;
  new vm.Script(body, { filename: "index.html inline script" });
  inlineScripts++;
}
assert.ok(inlineScripts > 0, "Expected at least one inline application script.");

const marker = "const chineseWords = [";
const markerAt = html.indexOf(marker);
assert.notEqual(markerAt, -1, "Chinese dictionary declaration is missing.");
const arrayStart = html.indexOf("[", markerAt);
const arrayEnd = html.indexOf("];", arrayStart);
assert.ok(arrayEnd > arrayStart, "Chinese dictionary array terminator is missing.");
const words = vm.runInNewContext("(" + html.slice(arrayStart, arrayEnd + 1) + ")");
assert.ok(Array.isArray(words) && words.length >= 200, "Chinese dictionary dataset unexpectedly small.");
assert.equal(new Set(words.map(item => item.word)).size, words.length, "Chinese dictionary contains duplicate character entries.");
for (const item of words) {
  assert.equal([...item.word].length, 1, "Dictionary grid entry is not a single character: " + item.word);
  assert.equal(item.course, "zh", "Unexpected course on Chinese entry: " + item.word);
  assert.ok(typeof item.phonetic === "string" && item.phonetic.trim(), "Missing pinyin: " + item.word);
  if (item.categories !== undefined) {
    assert.ok(Array.isArray(item.categories), "Categories must be an array: " + item.word);
    for (const category of item.categories) assert.ok([
      "actions", "expressions", "people", "objects", "nature", "places",
      "time-numbers", "emotions-states", "descriptions", "grammar-function"
    ].includes(category), "Unknown Chinese category " + category + " on " + item.word);
  }
}

assert.ok(html.includes("function chinesePinyinInitials(item)"), "Pinyin initial extraction helper is missing.");
assert.ok(html.includes("chinesePinyinInitials(item).includes(activeLetter)"), "Chinese pinyin initial filtering is not wired into the result filter.");
assert.ok(html.includes("item.categories.includes(activeChineseCategory)"), "Chinese category filtering is not wired into the result filter.");
assert.ok(html.includes('id="chineseCategoryRow"'), "Chinese category filter controls are missing.");
assert.ok(html.includes('id="chinesePinyinFilterLabel"'), "Chinese Pinyin A–Z label is missing.");
assert.ok(html.includes("hasChineseCategories"), "Category controls must remain hidden until category metadata exists.");
const cardStart = html.indexOf("button.innerHTML = ", html.indexOf("function render()"));
const cardEnd = html.indexOf("button.addEventListener", cardStart);
assert.ok(cardStart !== -1 && cardEnd > cardStart, "Dictionary card markup was not found.");
assert.ok(!html.slice(cardStart, cardEnd).toLowerCase().includes("pinyin"), "Pinyin must not be added to Chinese Dictionary grid cards.");

console.log("Chinese dictionary checks passed: " + words.length + " unique single-character entries; " + inlineScripts + " inline script syntax-checked.");
