import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html = fs.readFileSync("index.html", "utf8");
const dataFile = fs.readFileSync("data/chinese-characters.js", "utf8");

let inlineScripts = 0;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const attrs = match[1] || "";
  const body = match[2] || "";
  if (/\bsrc\s*=/.test(attrs) || !body.trim() || /type\s*=\s*["']application\//i.test(attrs)) continue;
  new vm.Script(body, { filename: "index.html inline script" });
  inlineScripts++;
}
new vm.Script(dataFile, { filename: "data/chinese-characters.js" });
assert.ok(inlineScripts > 0, "Expected at least one inline application script.");
assert.ok(html.includes('<script src="data/chinese-characters.js"></script>'), "Chinese character data file is not loaded before the app.");

const marker = "const chineseWords = [";
const markerAt = html.indexOf(marker);
assert.notEqual(markerAt, -1, "Chinese dictionary declaration is missing.");
const arrayStart = html.indexOf("[", markerAt);
const spreadAt = html.indexOf("...(window.SWIFT_CHINESE_WORDS || [])", arrayStart);
assert.ok(spreadAt > arrayStart, "External Chinese character data is not merged into the dictionary.");
const baseLiteral = html.slice(arrayStart, spreadAt).replace(/,\s*$/, "") + "]";
const baseWords = vm.runInNewContext("(" + baseLiteral + ")");
const dataMatch = dataFile.match(/window\.SWIFT_CHINESE_WORDS\s*=\s*(\[[\s\S]*?\]);/);
assert.ok(dataMatch, "External Chinese character array is missing.");
const additions = vm.runInNewContext("(" + dataMatch[1] + ")");
const metadataMatch = dataFile.match(/window\.SWIFT_CHINESE_METADATA\s*=\s*(\{[\s\S]*?\});/);
assert.ok(metadataMatch, "Chinese legacy-entry metadata is missing.");
const metadata = vm.runInNewContext("(" + metadataMatch[1] + ")");
for (const item of baseWords) {
  const record = metadata[item.word];
  assert.ok(record && Array.isArray(record.categories) && record.categories.length > 0, "Existing Chinese entry lacks categories: " + item.word);
  item.categories = record.categories;
  if (record.phonetic) item.phonetic = record.phonetic;
}
const words = [...baseWords, ...additions];
assert.ok(Array.isArray(words) && words.length >= 250, "Combined Chinese dictionary dataset unexpectedly small.");
assert.equal(new Set(words.map(item => item.word)).size, words.length, "Chinese dictionary contains duplicate character entries.");
for (const item of words) {
  assert.equal([...item.word].length, 1, "Dictionary grid entry is not a single character: " + item.word);
  assert.equal(item.course, "zh", "Unexpected course on Chinese entry: " + item.word);
  assert.ok(typeof item.phonetic === "string" && item.phonetic.trim(), "Missing pinyin: " + item.word);
  if (additions.some(entry => entry.word === item.word)) {
    assert.ok(Array.isArray(item.categories) && item.categories.length > 0, "New entry must have at least one category: " + item.word);
    assert.ok(Array.isArray(item.sourceIds) && item.sourceIds.length >= 3, "New entry must retain field provenance source IDs: " + item.word);
    assert.ok(Number.isInteger(item.hskLevel) && item.hskLevel >= 1 && item.hskLevel <= 5, "New entry must retain its HSK candidate level: " + item.word);
    assert.ok(Array.isArray(item.examples) && item.examples.length > 0 && item.examples.some(sentence => sentence.includes(item.word)), "New entry example must demonstrate its character: " + item.word);
  }
  if (item.categories !== undefined) {
    assert.ok(Array.isArray(item.categories), "Categories must be an array: " + item.word);
    for (const category of item.categories) assert.ok([
      "actions", "expressions", "communication", "people", "objects", "nature", "places",
      "time-numbers", "emotions-states", "descriptions", "grammar-function"
    ].includes(category), "Unknown Chinese category " + category + " on " + item.word);
  }
}

assert.ok(additions.length >= 500, "Expected at least 500 new Chinese character entries.");
assert.ok(words.length >= 700, "Combined Chinese dictionary should contain at least 700 unique characters.");
const sourcesPage = fs.readFileSync("data-sources.html", "utf8");
const thirdPartyNotices = fs.readFileSync("THIRD_PARTY_NOTICES.md", "utf8");
assert.ok(html.includes('href="data-sources.html"'), "The application footer must link to dictionary data sources.");
for (const [label, source] of [["public data-sources page", sourcesPage], ["repository third-party notices", thirdPartyNotices]]) {
  assert.ok(source.includes("CC BY-SA 4.0"), label + " must attribute CC-CEDICT and its share-alike licence.");
  assert.ok(source.includes("Unicode License v3"), label + " must include the Unicode Unihan licence notice.");
  assert.ok(source.includes("Pleco Inc."), label + " must include the HSK 3.0 source attribution.");
  assert.ok(source.includes("mozillazg") && source.includes("Copyright (c) 2016"), label + " must include the pinyin-data MIT attribution.");
  assert.ok(source.includes("Copyright © 2021-2026 Unicode, Inc."), label + " must include the Unihan copyright notice.");
}
assert.ok(html.includes("function chinesePinyinInitials(item)"), "Pinyin initial extraction helper is missing.");
assert.ok(html.includes("chinesePinyinInitials(item).includes(activeLetter)"), "Chinese pinyin initial filtering is not wired into the result filter.");
assert.ok(html.includes("item.categories.includes(activeChineseCategory)"), "Chinese category filtering is not wired into the result filter.");
assert.ok(html.includes('id="chineseCategoryRow"'), "Chinese category filter controls are missing.");
assert.ok(html.includes('id="chinesePinyinFilterLabel"'), "Chinese Pinyin A–Z label is missing.");
const cardStart = html.indexOf("button.innerHTML = ", html.indexOf("function render()"));
const cardEnd = html.indexOf("button.addEventListener", cardStart);
assert.ok(cardStart !== -1 && cardEnd > cardStart, "Dictionary card markup was not found.");
assert.ok(!html.slice(cardStart, cardEnd).toLowerCase().includes("pinyin"), "Pinyin must not be added to Chinese Dictionary grid cards.");

const polyphonic = words.filter(item => String(item.phonetic || "").includes("/"));
assert.ok(polyphonic.length >= 70, "Polyphonic Chinese readings should remain represented in the dictionary.");
for (const item of polyphonic) {
  assert.ok(typeof item.definition === "string" && item.definition.trim(), "Polyphonic character is missing English meanings: " + item.word);
  assert.ok(typeof item.definitionZh === "string" && item.definitionZh.trim(), "Polyphonic character is missing Chinese meanings: " + item.word);
}
for (const character of ["好","看","要","和","大","背","的","了","得","长","还","少","只","会","行","着","差","中","发","乐","空","打","场","便","角","传"]) {
  const item = words.find(entry => entry.word === character);
  assert.ok(item && Array.isArray(item.senses) && item.senses.length >= 2, "Common multiple-reading character needs separately explained senses: " + character);
  for (const sense of item.senses) {
    assert.ok(sense.part && /读音/.test(sense.part), "Each polyphonic sense should identify its reading: " + character);
    assert.ok(sense.definition && sense.definitionZh, "Each polyphonic sense needs English and Chinese definitions: " + character);
  }
}
const expandedPolyphonic = ["儿","分","干","过","号","几","假","间","见","教","觉","累","难","什","识","同","系","兴","正","重","子","作","参","查","称","处","单","倒","度","凉","量","绿","论","弄","片","漂","万","为","相","应","划","结","色","省","食","熟","数","提","通","脏","占","曾","朝","创","待","调","尽","落","语"];
for (const character of expandedPolyphonic) {
  const item = words.find(entry => entry.word === character);
  assert.ok(item && Array.isArray(item.senses) && item.senses.length >= 2, "Common polyphonic character needs reading-specific senses: " + character);
  for (const sense of item.senses) {
    assert.ok(sense.part && /读音/.test(sense.part), "Reading-specific sense must identify its pronunciation: " + character);
    assert.ok(sense.definition && sense.definitionZh, "Reading-specific sense needs English and Chinese definitions: " + character);
  }
}
const pinyinMapMatch=html.match(/const hanziPinyin = (\\{[\\s\\S]*?\\});/);
const supplementalPinyinMatch=html.match(/const extraSensePinyin = (\\{[\\s\\S]*?\\});/);
assert.ok(pinyinMapMatch && supplementalPinyinMatch,"Chinese pinyin fallback maps are missing.");
const pinyinMap=JSON.parse(pinyinMapMatch[1]);
const supplementalPinyin=JSON.parse(supplementalPinyinMatch[1]);
for(const item of words)for(const sense of item.senses||[])for(const example of sense.examples||[])for(const character of example){
  if(/[\\u3400-\\u9fff]/.test(character))assert.ok(pinyinMap[character]||supplementalPinyin[character],"Sense example character is missing pinyin fallback: "+item.word+" / "+character);
}
console.log("Chinese dictionary checks passed: " + words.length + " unique characters (" + additions.length + " new), " + polyphonic.length + " polyphonic entries reviewed, " + inlineScripts + " inline script syntax-checked.");
