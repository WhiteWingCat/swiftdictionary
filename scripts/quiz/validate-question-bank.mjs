import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const emitSql = args.includes("--emit-sql");
const approveForRelease = args.includes("--approve-for-release");
if (approveForRelease && !emitSql) {
  console.error("--approve-for-release requires --emit-sql");
  process.exit(1);
}
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
const translationCounts = { beginner: 0, intermediate: 0, advanced: 0 };
const definitionCounts = { beginner: 0, intermediate: 0, advanced: 0 };
const knowledgeCounts = { beginner: 0, intermediate: 0, advanced: 0 };
const topics = { beginner: new Set(), intermediate: new Set(), advanced: new Set() };
const normalizeOption = value => String(value ?? "").normalize("NFKC").toLocaleLowerCase("zh").replace(/[\s\p{P}\p{S}]+/gu, "");

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
  if (!Array.isArray(source?.objectives) || source.objectives.length === 0) fail.push(at + " source lesson has no defined learning objectives");
  if (source && (!q.learning_objective_id || !source.objectives.some(objective => objective.id === q.learning_objective_id))) fail.push(at + " has no valid learning_objective_id for its source lesson");
  const questionType = q.question_type ?? "knowledge";
  q.question_type = questionType;
  q.answer_language_code = q.answer_language_code ?? (questionType === "chinese_translation" ? "zh" : "en");
  if (!["knowledge", "word_definition", "chinese_translation"].includes(questionType)) fail.push(at + " has an unsupported question_type");
  if (questionType === "chinese_translation" && q.answer_language_code !== "zh") fail.push(at + " Chinese translation questions must set answer_language_code to zh");
  if (questionType !== "chinese_translation" && q.answer_language_code !== "en") fail.push(at + " knowledge and word-definition questions must set answer_language_code to en");
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
    const labels = q.options.map(o => normalizeOption(o.learning_text));
    if (new Set(labels).size !== 4) fail.push(at + " has duplicate English option labels");
    const translationLabels = q.options.map(o => normalizeOption(o.translation_text));
    if (new Set(translationLabels).size !== 4) fail.push(at + " has duplicate Chinese translation option labels");
  }
  if (source) {
    counts[source.difficulty] += 1;
    if (questionType === "chinese_translation") translationCounts[source.difficulty] += 1;
    else if (questionType === "word_definition") definitionCounts[source.difficulty] += 1;
    else knowledgeCounts[source.difficulty] += 1;
    topics[source.difficulty].add(source.topic_id);
    q.difficulty = source.difficulty;
    q.topic_id = source.topic_id;
  }
  const normalized = String(q.prompt_learning ?? "").toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, " ").trim();
  if (normalized && seenPrompts.has(normalized)) fail.push(at + " duplicates another normalized English prompt");
  seenPrompts.add(normalized);
}
if (questions.length !== 223) fail.push("The current draft pack must contain exactly 223 questions");
if (counts.beginner !== 64 || counts.intermediate !== 70 || counts.advanced !== 89) fail.push("Difficulty totals must be 64 Beginner / 70 Intermediate / 89 Advanced");
if (knowledgeCounts.beginner !== 38 || knowledgeCounts.intermediate !== 44 || knowledgeCounts.advanced !== 56) fail.push("Knowledge-question supply must be 38 Beginner / 44 Intermediate / 56 Advanced after the Phase 6 additions");
if (definitionCounts.beginner !== 5 || definitionCounts.intermediate !== 5 || definitionCounts.advanced !== 5) fail.push("Word-definition questions must total five at each difficulty");
if (translationCounts.beginner !== 21 || translationCounts.intermediate !== 21 || translationCounts.advanced !== 28) fail.push("Chinese translation question totals must be 21 Beginner / 21 Intermediate / 28 Advanced");

const releaseQuestions = questions.filter(question => question.release_approved === true);
const releaseCounts = { beginner: 0, intermediate: 0, advanced: 0 };
const releaseKnowledge = { beginner: 0, intermediate: 0, advanced: 0 };
const releaseDefinitions = { beginner: 0, intermediate: 0, advanced: 0 };
const releaseTranslations = { beginner: 0, intermediate: 0, advanced: 0 };
for (const question of releaseQuestions) {
  const source = lessons[question.source_lesson_id];
  if (!source) continue;
  const difficulty = source.difficulty;
  releaseCounts[difficulty] += 1;
  const type = question.question_type ?? "knowledge";
  if (type === "chinese_translation") releaseTranslations[difficulty] += 1;
  else if (type === "word_definition") releaseDefinitions[difficulty] += 1;
  else releaseKnowledge[difficulty] += 1;
}
if (releaseQuestions.length !== 199) fail.push("The previously owner-approved release subset must remain exactly 199 questions");
if (releaseCounts.beginner !== 56 || releaseCounts.intermediate !== 62 || releaseCounts.advanced !== 81) fail.push("The previously approved release subset must retain 56/62/81 difficulty totals");
if (releaseKnowledge.beginner !== 30 || releaseKnowledge.intermediate !== 36 || releaseKnowledge.advanced !== 48) fail.push("The previously approved release subset must retain 30/36/48 knowledge-question totals");
if (releaseDefinitions.beginner !== 5 || releaseDefinitions.intermediate !== 5 || releaseDefinitions.advanced !== 5) fail.push("The previously approved release subset must retain five word-definition questions per difficulty");
if (releaseTranslations.beginner !== 21 || releaseTranslations.intermediate !== 21 || releaseTranslations.advanced !== 28) fail.push("The previously approved release subset must retain 21/21/28 Chinese-translation questions");
if (questions.some(question => question.release_approved !== true && question.release_approved !== false)) fail.push("Every question must explicitly state whether it belongs to the previously owner-approved release subset");
if (fail.length) {
  console.error("Quiz content validation failed:");
  for (const issue of fail) console.error(" - " + issue);
  process.exit(1);
}
if (!emitSql) console.log("Quiz content validation passed.");
if (!emitSql) console.log("Draft items: " + questions.length);
for (const difficulty of ["beginner", "intermediate", "advanced"]) {
  if (!emitSql) console.log(difficulty + ": " + counts[difficulty] + " total (" + knowledgeCounts[difficulty] + " knowledge, " + definitionCounts[difficulty] + " word definition, " + translationCounts[difficulty] + " Chinese translation) across " + topics[difficulty].size + " topics");
}
if (!emitSql) console.log("223 source items: 199 previously owner-approved release questions plus 24 Phase 6 draft-only additions. The source pack remains draft.");
if (!emitSql) console.log("No difficulty becomes available until sufficient approved, lesson-aligned questions of each required type exist.");
if (!emitSql) console.log("Beginner minimum 20 / target 30: " + counts.beginner + "/20 minimum, " + counts.beginner + "/30 target");
if (!emitSql) console.log("Intermediate minimum 24 intermediate + 16 beginner; target 36 + 24.");
if (!emitSql) console.log("Advanced minimum 32 advanced + 8 intermediate + 8 beginner; target 48 + 12 + 12.");
if (!emitSql) console.log("All source content remains draft and must receive human approval before import.");

if (emitSql) {
  const lit = value => "'" + String(value).replace(/'/g, "''") + "'";
  const json = value => lit(JSON.stringify(value)) + "::jsonb";
  const exportQuestions = approveForRelease ? releaseQuestions : questions;
  if (approveForRelease) {
    console.error("OWNER-AUTHORIZED RELEASE MODE: generated rows will be approved and selectable by Quiz.");
  }
  const rows = exportQuestions.map(q => {
    const source = lessons[q.source_lesson_id];
    return "(" + [
      lit(q.question_id), "1", lit(raw.learning_language_code),
      lit(raw.translation_language_code), lit(q.source_lesson_id),
      lit(source.topic_id), lit(source.difficulty),
      lit(q.question_type ?? "knowledge"), lit(q.answer_language_code ?? ((q.question_type ?? "knowledge") === "chinese_translation" ? "zh" : "en")),
      lit(q.learning_objective_id),
      lit(q.prompt_learning), lit(q.prompt_translation), json(q.options),
      lit(q.correct_option_id), lit(q.explanation_learning),
      lit(q.explanation_translation), lit(approveForRelease ? "approved" : "draft"), approveForRelease ? "pg_catalog.now()" : "null"
    ].join(", ") + ")";
  });
  const sql = [
    "-- Generated from " + file + (approveForRelease ? ". OWNER-AUTHORIZED RELEASE IMPORT." : ". Draft import only."),
    approveForRelease ? "-- Owner explicitly authorized publication; approved rows become selectable by Quiz." : "-- Draft import only; no question is approved or made selectable.",
    "begin;",
    "insert into private.quiz_question_bank (",
    "  question_id, revision, learning_language_code, translation_language_code,",
    "  source_lesson_id, topic_id, difficulty, question_type, answer_language_code, learning_objective_id, prompt_learning, prompt_translation,",
    "  options, correct_option_id, explanation_learning, explanation_translation, status, approved_at",
    ") values",
    rows.join(",\n"),
    ";",
    "commit;"
  ].join("\n");
  process.stdout.write(sql + "\n");
}
