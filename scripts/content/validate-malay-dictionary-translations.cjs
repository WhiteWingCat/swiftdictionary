const fs = require("node:fs");
global.window = {};
require("../../data/languages/malay-dictionary-translations.js");
const data = window.SWIFT_DICTIONARY_MS_TRANSLATIONS;
if (!data || data.status !== "machine_assisted_draft" || data.targetLanguage !== "ms") throw new Error("Translation metadata/status missing");
const expected = { en: { entries: 1316, senses: 1931 }, zh: { entries: 725, senses: 825 } };
const report = {};
for (const [language, count] of Object.entries(expected)) {
  const entries = data.languages?.[language] || {};
  const words = Object.keys(entries);
  const senses = words.reduce((n, word) => n + (entries[word].senses || []).length, 0);
  const missingHeadwords = words.filter(word => !entries[word].headwordMs);
  const missingSenses = words.flatMap(word => (entries[word].senses || []).filter(sense => !sense.definitionMs));
  const indonesianOnlyTerms = /\b(?:aku|kamu|kau|khawatir|halo|ayolah|ayo|teman|ketemu|karena|bahwa|berbeda|coba|kapan|silakan|aktivitas|kualitas|universitas|berpikir|pikir|ngomong|membutuhkan|butuh|kalian|dulu|bisa(?!\s+(?:ular|racun|sengat|beracun))|kantor|kalimat|bis|nggak|enggak|banget|apotek|bahasan|ana|kakakku|pertanyaan|kursi|kebijakan|menaruh|film|dimana|saja|mengirimkan|mengirim|meskipun|terjadi|saat|berbicara|mengerti|jadwal|dosing|ekonomis|memyakinkan|wourna|jawaban|keripik|keriput|hukuman\s+mana|enak\s+sekali|apa\s+dia|di\s+hari|semua\s+kata|mural\s+a)\b/i;
  const languageQualityFlags = words.flatMap(word => [
    entries[word].headwordMs,
    ...(entries[word].senses || []).map(sense => sense.definitionMs)
  ].filter(value => indonesianOnlyTerms.test(String(value || ""))).map(value => ({ word, value })));
  if (words.length !== count.entries || senses !== count.senses || missingHeadwords.length || missingSenses.length || languageQualityFlags.length) {
    throw new Error(language + " translation coverage/quality mismatch: " + JSON.stringify({ entries: words.length, senses, missingHeadwords: missingHeadwords.length, missingSenses: missingSenses.length, languageQualityFlags: languageQualityFlags.slice(0, 12) }));
  }
  report[language] = { entries: words.length, senses, missingHeadwords: 0, missingSenses: 0, languageQualityFlags: 0 };
}
console.log(JSON.stringify({ status: data.status, engine: data.engine, coverage: report, bytes: fs.statSync("data/languages/malay-dictionary-translations.js").size }));
