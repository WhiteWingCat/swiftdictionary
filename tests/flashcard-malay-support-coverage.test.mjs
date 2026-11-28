import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

test("Curated Malay Flashcard glosses provide a non-empty fallback vocabulary set",()=>{
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync("data/languages/malay-flashcard-translations.js","utf8"),context);
 const pack=context.window.SWIFT_FLASHCARD_MALAY_SUPPORT;
 assert.equal(Object.keys(pack.en).length,73);
 assert.equal(Object.keys(pack.zh).length,124);
 assert.equal(pack.metadata.status,"machine_assisted_draft");
 assert.ok(Object.values(pack.en).every(value=>typeof value==="string"&&value.length>0));
 assert.ok(Object.values(pack.zh).every(value=>typeof value==="string"&&value.length>0));
});

test("Malay support exporter includes source definitions for every English and Chinese Flashcard",()=>{
 const exporter=fs.readFileSync("scripts/content/export-malay-learning-support-input.cjs","utf8");
 assert.match(exporter,/definition:item\.definition\|\|item\.definitionEn/);
 assert.match(exporter,/definitionSource:chineseDefinition\?"zh":"en"/);
 assert.match(exporter,/expectedChineseFlashcards/);
});
 
test("Flashcard decks exclude untranslated words when Malay is the selected support language",()=>{
 const flashcards=fs.readFileSync("flashcards.js","utf8");
 assert.match(flashcards,/function addMalayFlashcardSupport\(items,language,\{allowDictionaryFallback=true\}=\{\}\)/);
 assert.match(flashcards,/SWIFT_FLASHCARD_MALAY_SUPPORT/);
 assert.match(flashcards,/SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS\?\.flashcards/);
 assert.match(flashcards,/row\.definitionMs\|\|\(allowDictionaryFallback\?dictionaryDerivedMalaySupport/);
 assert.match(flashcards,/const customSupport=word\._flashCard\?\.translation_language_code===language/);
 assert.match(flashcards,/SWIFT_DICTIONARY_MS_TRANSLATIONS\?\.languages\?\.\[language\]/);
 assert.match(flashcards,/generatedEntry\?\.senses\?\.find\(sense=>sense\.definitionMs\)/);
 assert.equal(flashcards.includes("\\\\s"),false,"Malay glossary tokenisation must use real whitespace regexes, not literal backslash-s");
 // Chinese cards may have curated sentence examples while their original
 // availableModes metadata lists only word/translation. The runtime must
 // explicitly allow Sentence Recall only for reviewed Malay sentence pairs.
 assert.match(flashcards,/mode===\"sentence\"[\s\S]{0,260}exampleMsReviewed&&w\.exampleMs&&cueFor\(w,mode\)/);
 assert.match(flashcards,/all=all\.filter\(word=>Boolean\(translationFor\(word\)\)\)/);
 assert.match(flashcards,/customCards=customCards\.filter\(word=>Boolean\(translationFor\(word\)\)\)/);
 assert.match(flashcards,/malaySupportEnglishCount/);
 assert.match(flashcards,/malaySupportChineseCount/);
});


test("Malay Flashcard coverage is measured across dictionary, phrase and sentence card banks",()=>{
 const context={window:{}};
 vm.createContext(context);
 const load=path=>vm.runInContext(fs.readFileSync(path,"utf8"),context);
 for(const path of [
  "data/languages/english-dictionary.js",
  "data/english-expansion.js",
  "data/languages/chinese-dictionary.js",
  "data/chinese-characters.js",
  "data/chinese-flashcards.js",
  "data/languages/malay-dictionary.js",
  "data/languages/malay-dictionary-manual-overrides.js",
  "data/languages/malay-dictionary-translations.js",
  "data/languages/malay-learning-support-translations.js",
  "data/languages/malay-learning-support-overrides.js",
  "data/languages/malay-flashcard-translations.js",
  "js/core/dictionary-translation-overlay.js"
 ]) load(path);

 const english=[
  ...(context.window.SWIFT_ENGLISH_BASE_DICTIONARY||[]),
  ...(context.window.SWIFT_ENGLISH_EXPANSION||[])
 ].filter(word=>word&&word.course==="en"&&word.word&&word.definition);
 const chinese=[...new Map([
  ...(context.window.SWIFT_CHINESE_BASE_DICTIONARY||[]),
  ...(context.window.SWIFT_CHINESE_WORDS||[])
 ].filter(word=>word&&word.word).map(word=>[String(word.word),word])).values()];
 const englishOverlay=context.window.SWIFT_DICTIONARY_TRANSLATION_OVERLAY.apply(english,"en");
 const chineseOverlay=context.window.SWIFT_DICTIONARY_TRANSLATION_OVERLAY.apply(chinese,"zh");
 assert.equal(englishOverlay.complete,true);
 assert.equal(chineseOverlay.complete,true);

 const flashcards=fs.readFileSync("flashcards.js","utf8");
 const helperStart=flashcards.indexOf("const reviewWordIndexCache=new Map();");
 const helperEnd=flashcards.indexOf("function words(",helperStart);
 assert.ok(helperStart>=0&&helperEnd>helperStart,"Malay Flashcard support/index helper block must exist");
 vm.runInContext(
  "let malayGlossLookupCache=null; "+flashcards.slice(helperStart,helperEnd)+"; window.__addMalayFlashcardSupport=addMalayFlashcardSupport;",
  context
 );
 const add=context.window.__addMalayFlashcardSupport;
 const englishDictionary=add(english,"en");
 const phraseMatch=flashcards.match(/const curatedEnglishPhrases = (\[[\s\S]*?\n  \]);/);
 assert.ok(phraseMatch,"Curated English phrase bank must be available");
 vm.runInContext("window.__curatedEnglishPhrases = "+phraseMatch[1]+";",context);
 const existing=new Set(english.map(word=>String(word.word).trim().toLowerCase()));
 const englishPhrases=add(context.window.__curatedEnglishPhrases.filter(word=>!existing.has(word.word.toLowerCase())),"en");
 const bank=context.window.SWIFT_CHINESE_FLASHCARDS||{};
 const chineseCards=[
  ...(bank.characters||[]).map(word=>({...word,course:"zh",cardKind:"characters",definition:word.translationEn||"",examples:(word.sentenceExampleZh||word.exampleZh)?[word.sentenceExampleZh||word.exampleZh]:[],phonetic:word.pinyin||""})),
  ...(bank.vocabulary||[]).map(word=>({...word,course:"zh",cardKind:"vocabulary",definition:word.translationEn||"",examples:(word.sentenceExampleZh||word.exampleZh)?[word.sentenceExampleZh||word.exampleZh]:[],phonetic:word.pinyin||""})),
  ...(bank.phrases||[]).map(word=>({...word,course:"zh",cardKind:"phrases",definition:word.translationEn||"",examples:(word.sentenceExampleZh||word.exampleZh)?[word.sentenceExampleZh||word.exampleZh]:[],phonetic:word.pinyin||""}))
 ].filter(word=>word.word);
 const chineseFlashcards=add(chineseCards,"zh");
 const count=(items,predicate)=>items.filter(predicate).length;

 assert.equal(englishDictionary.length,1316);
 assert.equal(count(englishDictionary,word=>!!word.definitionMs),1316);
 assert.equal(englishPhrases.length,25);
 assert.equal(count(englishPhrases,word=>!!word.definitionMs),25);
 assert.equal(count(englishDictionary,word=>word.examples?.length>0),1316);
 assert.equal(count(englishDictionary,word=>word.exampleMsReviewed&&!!word.exampleMs),18);
 assert.equal(count(englishPhrases,word=>word.examples?.length>0),25);
 assert.equal(count(englishPhrases,word=>word.exampleMsReviewed&&!!word.exampleMs),25);

 assert.equal(chineseFlashcards.length,1447);
 assert.equal(count(chineseFlashcards,word=>!!word.definitionMs),1447);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="characters"),519);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="characters"&&!!word.definitionMs),519);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="characters"&&word.examples?.length>0),519);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="characters"&&word.exampleMsReviewed&&!!word.exampleMs),0);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="vocabulary"),904);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="vocabulary"&&!!word.definitionMs),904);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="vocabulary"&&word.examples?.length>0),60);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="vocabulary"&&word.exampleMsReviewed&&!!word.exampleMs),18);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="phrases"),24);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="phrases"&&!!word.definitionMs),24);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="phrases"&&word.examples?.length>0),24);
 assert.equal(count(chineseFlashcards,word=>word.cardKind==="phrases"&&word.exampleMsReviewed&&!!word.exampleMs),24);
 assert.equal(count(chineseFlashcards,word=>!!word.exampleMs),603);
 assert.equal(count(chineseFlashcards,word=>word.examples?.length>0),603);
 assert.equal(count(chineseFlashcards,word=>word.exampleMsReviewed&&!!word.exampleMs),42);
 assert.equal(count(chineseFlashcards,word=>!word.definitionMs),0);
});
