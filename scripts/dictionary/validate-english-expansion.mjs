#!/usr/bin/env node
/**
 * SwiftDictionary U2.9.0 English expansion validator.
 * Run from repository root: node scripts/dictionary/validate-english-expansion.mjs
 * This validates authored expansion batches against the embedded main English word bank.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const indexPath = path.join(root, "index.html");
const candidatePath = path.join(root, "data/english-expansion-candidates.json");
const batchDir = path.join(root, "data");
const source = fs.readFileSync(indexPath, "utf8");
const normalizeHeadword = value => String(value || "").trim().toLowerCase().replace(/[-\s]+/g, " ");
const marker = "const englishWords = ";
const markerAt = source.indexOf(marker);
if (markerAt < 0) throw new Error("Could not locate embedded englishWords array.");
const arrayStart = markerAt + marker.length;
const closing = /\n\\s*\\];/.exec(source.slice(arrayStart));
if (!closing) throw new Error("Could not locate end of englishWords array.");
const arrayEnd = arrayStart + closing.index + closing[0].lastIndexOf("]") + 1;
const baseline = JSON.parse(source.slice(arrayStart, arrayEnd).trim());
const candidatesDoc = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const normalizedCandidates = candidatesDoc.candidates.map(x => normalizeHeadword(x.word));
const candidateWords = new Set(normalizedCandidates);
if (candidateWords.size !== normalizedCandidates.length) throw new Error("Candidate inventory contains duplicate normalised headwords.");
const baselineWords = new Set();
const baselineDuplicates = [];
for (const entry of baseline) {
  const key = normalizeHeadword(entry.word);
  if (!key) baselineDuplicates.push("(empty headword)");
  else if (baselineWords.has(key)) baselineDuplicates.push(key);
  baselineWords.add(key);
}

const batchFiles = fs.readdirSync(batchDir)
  .filter(name => /^english-expansion-batch-\d+\.json$/.test(name))
  .sort();
const errors = [];
const allowedCategories = new Set(["Actions","Everyday Terms","Activities","Places","People & Relationships","Science & Technology","History & Culture","Nature & Environment","Education","Emotions & Descriptions"]);
const allNew = [];
const categoryCounts = {};
const batchReports = [];

for (const file of batchFiles) {
  const doc = JSON.parse(fs.readFileSync(path.join(batchDir, file), "utf8"));
  const entries = doc.entries;
  if (!Array.isArray(entries)) {
    errors.push(file + ": entries must be an array");
    continue;
  }
  const seen = new Set();
  const words = [];
  for (const entry of entries) {
    const word = String(entry.word || "").trim();
    const key = normalizeHeadword(word);
    words.push(word);
    if (!word) errors.push(file + ": empty headword");
    if (baselineWords.has(key)) errors.push(file + ": duplicate of baseline: " + word);
    if (seen.has(key)) errors.push(file + ": duplicate in batch: " + word);
    if (!candidateWords.has(key)) errors.push(file + ": not in candidate inventory: " + word);
    seen.add(key);
    allNew.push(key);

    for (const field of ["part","phonetic","definition","definitionZh","tip","course","breakdown"]) {
      if (typeof entry[field] !== "string" || !entry[field].trim()) {
        errors.push(file + ": " + word + " missing " + field);
      }
    }
    if (typeof entry.related !== "string") errors.push(file + ": " + word + " related must be a string (empty is allowed)");
    for (const field of ["examples","senses","categories"]) {
      if (!Array.isArray(entry[field]) || entry[field].length === 0) {
        errors.push(file + ": " + word + " missing " + field);
      }
    }
    if (!Array.isArray(entry.examples) || entry.examples.length < 2) {
      errors.push(file + ": " + word + " should have at least two examples");
    }
    for (const sense of entry.senses || []) {
      if (!sense.part || !sense.definition || !sense.definitionZh ||
          !Array.isArray(sense.examples) || sense.examples.length < 1) {
        errors.push(file + ": " + word + " has an incomplete sense");
      }
    }
    for (const category of entry.categories || []) {
      if (!allowedCategories.has(category)) errors.push(file + ": " + word + " has unapproved category: " + category);
      if (!categoryCounts[category]) categoryCounts[category] = 0;
      categoryCounts[category]++;
    }
  }
  batchReports.push({ file, entries: entries.length, words });
}

const allSeen = new Set();
for (const word of allNew) {
  if (allSeen.has(word)) errors.push("duplicate across batches: " + word);
  allSeen.add(word);
}
if (baselineDuplicates.length) errors.push("baseline contains duplicate headwords: " + baselineDuplicates.join(", "));

const report = {
  update: "2.9.0",
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
