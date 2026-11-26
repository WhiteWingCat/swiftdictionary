/* Shared validation primitives for language-owned content packs.
 * Pair-specific curriculum and linguistic rules remain in their own validators.
 */
export const SUPPORTED_QUESTION_TYPES = Object.freeze([
  "knowledge", "word_definition", "chinese_translation", "fill_blank"
]);
export const SUPPORTED_ANSWER_MODES = Object.freeze(["choice", "text"]);

export function normaliseComparableText(value, locale = "en") {
  return String(value ?? "").normalize("NFKC").toLocaleLowerCase(locale)
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

export function validateLanguagePair(pack, expectedLearning, expectedTranslation) {
  const errors = [];
  if (!pack || typeof pack !== "object") return ["Content pack must be an object."];
  if (!/^[a-z]{2,3}$/.test(String(expectedLearning || "")) ||
      !/^[a-z]{2,3}$/.test(String(expectedTranslation || "")) ||
      expectedLearning === expectedTranslation) {
    return ["Validator configuration must specify two distinct language codes."];
  }
  if (pack.learning_language_code !== expectedLearning ||
      pack.translation_language_code !== expectedTranslation) {
    errors.push("Pack language pair must be " + expectedLearning + " learning with " + expectedTranslation + " translation.");
  }
  return errors;
}

export function validateQuestionEnvelope(question, options = {}) {
  const errors = [];
  const at = options.path || "question";
  if (!question || typeof question !== "object" || Array.isArray(question)) return [at + " must be an object."];
  if (typeof question.question_id !== "string" || !question.question_id.trim()) errors.push(at + ".question_id is required.");
  if (question.question_type && !SUPPORTED_QUESTION_TYPES.includes(question.question_type)) errors.push(at + ".question_type is unsupported.");
  const answerMode = question.answer_mode || "choice";
  if (!SUPPORTED_ANSWER_MODES.includes(answerMode)) errors.push(at + ".answer_mode is unsupported.");
  if (question.question_type === "fill_blank" || answerMode === "text") {
    if (answerMode !== "text") errors.push(at + " fill_blank questions must use text answer mode.");
    if (question.blank_count !== 1) errors.push(at + " fill_blank questions must contain exactly one missing word.");
    if (!Array.isArray(question.accepted_answers) || !question.accepted_answers.length ||
        question.accepted_answers.some(answer => typeof answer !== "string" || !answer.trim())) {
      errors.push(at + ".accepted_answers must contain at least one non-empty accepted answer.");
    }
  } else if (answerMode === "choice") {
    if (!Array.isArray(question.options) || question.options.length !== 4) errors.push(at + ".options must contain exactly four choices.");
  }
  return errors;
}
