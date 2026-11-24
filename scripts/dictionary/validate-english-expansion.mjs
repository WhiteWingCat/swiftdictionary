#!/usr/bin/env node
/**
 * SwiftDictionary U2.9.0 English expansion validator.
 * Run from the repository root:
 *   node scripts/dictionary/validate-english-expansion.mjs
 * Optional explicit baseline source:
 *   node scripts/dictionary/validate-english-expansion.mjs --baseline path/to/app-source.js
 *
 * The validator checks authored JSON batches against the embedded English word bank.
 * It deliberately fails when it cannot locate that baseline rather than reporting a
 * misleading "no duplicate" result.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const baselineArg = args.indexOf("--baseline");
const explicitBaseline = baselineArg >= 0 ? args[baselineArg + 1] : null;
if (baselineArg >= 0 && !explicitBaseline) {
  throw new Error("--baseline requires a source-file path.");
}

const dataDir = path.join(root, "data");
const candidatePath = path.join(dataDir, "english-expansion-candidates.json");
const normalizeHeadword = value => String(value || "").normalize("NFKC").trim().toLowerCase().replace(/[\s-]+/g, " ");

function listSourceFiles(dir) {
  const results = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name === ".git" || item.name === "node_modules" || item.name === "dist" || item.name === "build") continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...listSourceFiles(full));
    else if (/\.(?:html?|mjs|cjs|js)$/i.test(item.name) && fs.statSync(full).size > 0) results.push(full);
  }
  return results;
}

// Find the closing bracket for a JavaScript array while ignoring brackets in strings/comments.
function findArrayEnd(source, start) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === "*" && next === "/") { blockComment = false; i++; }
      continue;
    }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "/" && next === "/") { lineComment = true; i++; continue; }
    if (ch === "/" && next === "*") { blockComment = true; i++; continue; }
    if (ch === "\"" || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function locateBaseline() {
  const files = explicitBaseline
    ? [path.resolve(root, explicitBaseline)]
    : listSourceFiles(root);
  const markers = [
    /(?:const|let|var)\s+englishWords\s*=\s*\[/,
    /(?:const|let|var)\s+englishDictionary\s*=\s*\[/
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const marker of markers) {
      const match = marker.exec(source);
      if (!match) continue;
      const start = source.indexOf("[", match.index);
      const end = findArrayEnd(source, start);
      if (end < 0) throw new Error("Found an English word-bank declaration but could not parse its array boundary in " + path.relative(root, file));
      try {
        const entries = JSON.parse(source.slice(start, end));
        if (Array.isArray(entries) && entries.length) return { file, entries };
      } catch (error) {
        throw new Error("English word bank in " + path.relative(root, file) + " is not JSON-compatible: " + error.message);
      }
    }
  }
  throw new Error("Could not locate a non-empty embedded englishWords/englishDictionary array. Supply --baseline with the application source file containing it.");
}

if (!fs.existsSync(candidatePath)) throw new Error("Missing candidate inventory: " + path.relative(root, candidatePath));
const candidatesDoc = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
if (!Array.isArray(candidatesDoc.candidates)) throw new Error("Candidate inventory must contain a candidates array.");
const baselineDoc = locateBaseline();
const baseline = baselineDoc.entries;

const normalizedCandidates = candidatesDoc.candidates.map(x => normalizeHeadword(x.word));
const candidateWords = new Set(normalizedCandidates);
const errors = [];
if (candidateWords.size !== normalizedCandidates.length) errors.push("Candidate inventory contains duplicate normalised headwords.");

const baselineWords = new Set();
const baselineDuplicates = [];
for (const entry of baseline) {
  const key = normalizeHeadword(entry.word);
  if (!key) baselineDuplicates.push("(empty headword)");
  else if (baselineWords.has(key)) baselineDuplicates.push(key);
  baselineWords.add(key);
}

const batchFiles = fs.readdirSync(dataDir)
  .filter(name => /^english-expansion-batch-\d+\.json$/.test(name))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const allowedCategories = new Set([
  "Actions", "Everyday Terms", "Activities", "Places", "People & Relationships",
  "Science & Technology", "History & Culture", "Nature & Environment", "Education",
  "Emotions & Descriptions"
]);
const allNew = [];
const categoryCounts = {};
const batchReports = [];

for (const file of batchFiles) {
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
  } catch (error) {
    errors.push(file + ": invalid JSON: " + error.message);
    continue;
  }
  const entries = doc.entries;
  if (!Array.isArray(entries)) {
    errors.push(file + ": entries must be an array");
    continue;
  }
  const seen = new Set();
  for (const entry of entries) {
    const word = String(entry.word || "").trim();
    const key = normalizeHeadword(word);
    if (!word) errors.push(file + ": empty headword");
    if (baselineWords.has(key)) errors.push(file + ": duplicate of baseline: " + word);
    if (seen.has(key)) errors.push(file + ": duplicate in batch: " + word);
    if (!candidateWords.has(key)) errors.push(file + ": not in candidate inventory: " + word);
    seen.add(key);
    allNew.push(key);

    for (const field of ["part", "phonetic", "definition", "definitionZh", "tip", "course", "breakdown"]) {
      if (typeof entry[field] !== "string" || !entry[field].trim()) errors.push(file + ": " + word + " missing " + field);
    }
    if (typeof entry.related !== "string") errors.push(file + ": " + word + " related must be a string (empty is allowed)");
    for (const field of ["examples", "senses", "categories"]) {
      if (!Array.isArray(entry[field]) || entry[field].length === 0) errors.push(file + ": " + word + " missing " + field);
    }
    if (!Array.isArray(entry.examples) || entry.examples.length < 2) errors.push(file + ": " + word + " should have at least two examples");
    if (entry.course !== "en") errors.push(file + ": " + word + " must belong to the English course");
    if (!/^\/.+\/$/.test(entry.phonetic || "")) errors.push(file + ": " + word + " pronunciation should be slash-delimited IPA");

    for (const sense of entry.senses || []) {
      if (typeof sense.part !== "string" || !sense.part.trim() ||
          typeof sense.definition !== "string" || !sense.definition.trim() ||
          typeof sense.definitionZh !== "string" || !sense.definitionZh.trim() ||
          !Array.isArray(sense.examples) || sense.examples.length < 1 ||
          sense.examples.some(example => typeof example !== "string" || !example.trim())) {
        errors.push(file + ": " + word + " has an incomplete sense");
      }
    }
    for (const category of entry.categories || []) {
      if (!allowedCategories.has(category)) errors.push(file + ": " + word + " has unapproved category: " + category);
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  }
  batchReports.push({ file, entries: entries.length });
}

const allSeen = new Set();
for (const word of allNew) {
  if (allSeen.has(word)) errors.push("duplicate across batches: " + word);
  allSeen.add(word);
}
if (baselineDuplicates.length) errors.push("baseline contains duplicate headwords: " + baselineDuplicates.join(", "));
if (batchFiles.length === 0) errors.push("No english-expansion-batch-NN.json files were found.");

const report = {
  update: "2.9.0",
  baselineFile: path.relative(root, baselineDoc.file),
  baselineCount: baseline.length,
  baselineUniqueCount: baselineWords.size,
  candidateCount: candidatesDoc.candidates.length,
  authoredCount: allNew.length,
  finalProjectedCount: baselineWords.size + allSeen.size,
  batches: batchReports,
  categoryCounts,
  errors
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
