import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const emitSql = args.includes("--emit-sql");
const fileArg = args.find(arg => !arg.startsWith("--"));
const file = path.resolve(repoRoot, fileArg ?? "content/quiz/questions.en-zh.draft.json");
const raw = JSON.parse(fs.readFileSync(file, "utf8"));
const mapFile = path.join(repoRoot, "content/quiz/curriculum-map.en.json");
const lessons = JSON.parse(fs.readFileSync(mapFile, "utf8"));
const fail = [];
const questions = Array.isArray(raw.questions) ? raw.questions : [];
const seenIds = new Set();
const seenPrompts = new Set();
const counts = { beginner: 0, intermediate: 0, advanced: 0 };
const topics = { beginner: new Set(), intermediate: new Set(), advanced: new Set() };

function requireText(value, label, max = 2000) {
  if (typeof value !== "string" || !value.trim() || value.length > max) {
    fail.push(label + " must be a non-empty string of at most " + max + " characters");
  }
}
if (raw.schema_version !== 1) fail.push("Unsupported schema_version");
if (raw.status !== "draft") fail.push("Source pack must remain draft until approved");
if (raw.learning_language_code !== "en" || raw.translation_language_code !== "zh") {
  fail.push("This batch must be English learning with Simplified Chinese translation");
}
if (!Array.isArray(questions) || questions.length === 0) fail.push("questions must be a non-empty array");

for (const [index, q] of questions.entries()) {
  const at = "questions[" + index + "]";
  requireText(q.question_id, at + ".question_id", 120);
  if (seenIds.has(q.question_id)) fail.push(at + " duplicates question_id " + q.question_id);
  seenIds.add(q.question_id);
  const source = lessons[q.source_lesson_id];
  if (!source) fail.push(at + " uses an unmapped source lesson " + q.source_lesson_id);
  if (source && (source.difficulty !== "beginner" && source.difficulty !== "intermediate" && source.difficulty !== "advanced")) {
    fail.push(at + " source lesson has an invalid difficulty");
  }
  if (source && !source.topic_id) fail.push(at + " source lesson has no topic_id");
  requireText(q.prompt_learning, at + ".prompt_learning");
  requireText(q.prompt_translation, at + ".prompt_translation");
  requireText(q.explanation_learning, at + ".explanation_learning");
  requireText(q.explanation_translation, at + ".explanation_translation");
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    fail.push(at + " must have exactly four options");
  } else {
    const optionIds = new Set();
    for (const [oi, option] of q.options.entries()) {
      requireText(option.id, at + ".options[" + oi + "].id", 32);
      requireText(option.learning_text, at + ".options[" + oi + "].learning_text");
      requireText(option.translation_text, at + ".options[" + oi + "].translation_text");
      if (optionIds.has(option.id)) fail.push(at + " has duplicate option id " + option.id);
      optionIds.add(option.id);
    }
    if (optionIds.size !== 4 || !optionIds.has(q.correct_option_id)) {
      fail.push(at + " correct_option_id must match exactly one of four unique option IDs");
    }
    const labels = q.options.map(o => String(o.learning_text ?? "").trim().toLocaleLowerCase("en"));
    if (new Set(labels).size !== 4) fail.push(at + " has duplicate English option labels");
  }
  if (source) {
    counts[source.difficulty] += 1;
    topics[source.difficulty].add(source.topic_id);
    q.difficulty = source.difficulty;
    q.topic_id = source.topic_id;
  }
  const normalized = String(q.prompt_learning ?? "").toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, " ").trim();
  if (normalized && seenPrompts.has(normalized)) fail.push(at + " duplicates another normalized English prompt");
  seenPrompts.add(normalized);
}
if (fail.length) {
  console.error("Quiz content validation failed:");
  for (const issue of fail) console.error(" - " + issue);
  process.exit(1);
}
if (!emitSql) console.log("Quiz content validation passed.");
if (!emitSql) console.log("Draft items: " + questions.length);
for (const difficulty of ["beginner", "intermediate", "advanced"]) {
  if (!emitSql) console.log(difficulty + ": " + counts[difficulty] + " questions across " + topics[difficulty].size + " topics");
}
if (!emitSql) console.log("Availability gates (approved content only; draft counts do not enable any difficulty):");
if (!emitSql) console.log("Beginner minimum 20 / target 30: " + counts.beginner + "/20 minimum, " + counts.beginner + "/30 target");
if (!emitSql) console.log("Intermediate minimum 24 intermediate + 16 beginner; target 36 + 24.");
if (!emitSql) console.log("Advanced minimum 32 advanced + 8 intermediate + 8 beginner; target 48 + 12 + 12.");
if (!emitSql) console.log("All source content remains draft and must receive human approval before import.");

if (emitSql) {
  const lit = value => "'" + String(value).replace(/'/g, "''") + "'";
  const json = value => lit(JSON.stringify(value)) + "::jsonb";
  const rows = questions.map(q => {
    const source = lessons[q.source_lesson_id];
    return "(" + [
      lit(q.question_id), "1", lit(raw.learning_language_code),
      lit(raw.translation_language_code), lit(q.source_lesson_id),
      lit(source.topic_id), lit(source.difficulty),
      lit(q.prompt_learning), lit(q.prompt_translation), json(q.options),
      lit(q.correct_option_id), lit(q.explanation_learning),
      lit(q.explanation_translation), lit("draft")
    ].join(", ") + ")";
  });
  const sql = [
    "-- Generated from " + file + ". Drafts only; never auto-approve.",
    "begin;",
    "insert into private.quiz_question_bank (",
    "  question_id, revision, learning_language_code, translation_language_code,",
    "  source_lesson_id, topic_id, difficulty, prompt_learning, prompt_translation,",
    "  options, correct_option_id, explanation_learning, explanation_translation, status",
    ") values",
    rows.join(",\n"),
    ";",
    "commit;"
  ].join("\n");
  process.stdout.write(sql + "\n");
}
