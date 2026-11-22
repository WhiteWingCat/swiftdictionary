import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const source = fs.readFileSync("data/chinese-lessons.js", "utf8");
const migration = fs.readFileSync("supabase/migrations/20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql", "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "data/chinese-lessons.js" });
const catalogue = sandbox.window.SWIFT_CHINESE_LESSONS;
assert.ok(catalogue && typeof catalogue === "object", "Chinese lesson catalogue did not load.");
assert.ok(source.includes("二零二六年"), "Chinese year example should use 零 rather than 〇.");
assert.ok(source.includes("èr líng èr liù"), "The Chinese year example must include líng in pinyin.");
assert.ok(source.includes("李明") && source.includes("Lǐ Míng"), "Chinese course examples should use a Chinese name with matching pinyin.");
assert.ok(!/\\bMaya\\b/.test(source), "The Chinese course must not use the English name Maya.");

const expected = { beginner: { lessons: 7, questions: 44 }, intermediate: { lessons: 5, questions: 34 }, advanced: { lessons: 5, questions: 34 } };
const ids = new Set();
const han = /[\u3400-\u9fff]/;
let totalLessons = 0;
let totalQuestions = 0;

function validateBilingual(value, path) {
  assert.ok(value && typeof value === "object", path + " must be a bilingual object.");
  assert.ok(typeof value.zh === "string" && value.zh.trim(), path + " is missing Chinese text.");
  assert.ok(han.test(value.zh), path + " Chinese text must contain Han characters.");
  assert.ok(typeof value.pinyin === "string" && value.pinyin.trim(), path + " is missing pinyin.");
  assert.ok(typeof value.en === "string" && value.en.trim(), path + " is missing English support.");
}

function walk(value, path, insideBilingualBlock = false) {
  if (Array.isArray(value)) { value.forEach((item, index) => walk(item, path + "[" + index + "]", insideBilingualBlock)); return; }
  if (typeof value === "string") {
    assert.ok(insideBilingualBlock || !han.test(value), "Chinese text must be paired with pinyin and English support: " + path);
    return;
  }
  if (!value || typeof value !== "object") return;
  const isBilingualBlock = Object.prototype.hasOwnProperty.call(value, "zh");
  if (isBilingualBlock) validateBilingual(value, path);
  for (const [key, child] of Object.entries(value)) walk(child, path + "." + key, insideBilingualBlock || isBilingualBlock);
}

for (const [difficulty, rule] of Object.entries(expected)) {
  const lessons = catalogue[difficulty];
  assert.ok(Array.isArray(lessons), "Missing " + difficulty + " lesson array.");
  assert.equal(lessons.length, rule.lessons, difficulty + " lesson count changed.");
  const questionCount = lessons.reduce((sum, lesson) => sum + (lesson.practices?.length || 0), 0);
  assert.equal(questionCount, rule.questions, difficulty + " practice question count changed.");
  totalLessons += lessons.length;
  totalQuestions += questionCount;

  for (const lesson of lessons) {
    assert.ok(lesson.id && !ids.has(lesson.id), "Missing or duplicate lesson ID: " + lesson.id);
    ids.add(lesson.id);
    assert.ok(lesson.topic_id, "Missing stable topic ID: " + lesson.id);
    assert.ok(migration.includes("'" + lesson.id + "'"), "Supabase content catalogue is missing lesson ID: " + lesson.id);
    validateBilingual(lesson.topicDisplay, lesson.id + ".topicDisplay");
    validateBilingual(lesson.title, lesson.id + ".title");
    validateBilingual(lesson.summary, lesson.id + ".summary");
    assert.ok(Array.isArray(lesson.explanation) && lesson.explanation.length >= 2, "Lesson explanation is too short: " + lesson.id);
    assert.ok(Array.isArray(lesson.examples) && lesson.examples.length >= 2, "Lesson needs contextual examples: " + lesson.id);
    assert.ok(Array.isArray(lesson.mistakes) && lesson.mistakes.length >= 1, "Lesson needs common mistakes: " + lesson.id);
    assert.ok(Array.isArray(lesson.practices) && lesson.practices.length >= 6, "Lesson needs at least six practice questions: " + lesson.id);
    walk(lesson, lesson.id);

    for (const [index, question] of lesson.practices.entries()) {
      if (typeof question.q === "string") {
        assert.ok(question.q.trim(), "Question prompt missing: " + lesson.id + "[" + index + "]");
        assert.ok(!han.test(question.q), "Chinese question prompt must include pinyin and English support: " + lesson.id + "[" + index + "]");
      } else {
        validateBilingual(question.q, lesson.id + ".practices[" + index + "].q");
      }
      assert.ok(Array.isArray(question.options) && question.options.length === 4, "Every practice question needs four options: " + lesson.id + "[" + index + "]");
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, "Invalid answer index: " + lesson.id + "[" + index + "]");
      question.options.forEach((option, optionIndex) => validateBilingual(option, lesson.id + ".practices[" + index + "].options[" + optionIndex + "]"));
    }
  }
}
assert.equal(totalLessons, 17);
assert.equal(totalQuestions, 112);
console.log("Chinese Lessons checks passed: " + totalLessons + " lessons and " + totalQuestions + " bilingual, pinyin-supported practice questions.");
