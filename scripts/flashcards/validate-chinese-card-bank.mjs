import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const pack=JSON.parse(fs.readFileSync(path.join(root,"content/flashcards/chinese-cards.draft.json"),"utf8"));
const release=process.argv.includes("--release");
const errors=[],warnings=[],optionalWarnings=[];
const generatedSource=fs.readFileSync(path.join(root,"data/chinese-flashcards.js"),"utf8");
const generatedStart=generatedSource.indexOf("=");
if(generatedStart<0)errors.push("Generated Chinese Flashcard bank assignment is missing");
let generated={};
try{generated=JSON.parse(generatedSource.slice(generatedStart+1).trim().replace(/;$/,""));}
catch{errors.push("Generated Chinese Flashcard bank is not valid JSON");}
const commonSyncFields=["word","pinyin","translationEn","translationZh","availableModes","difficulty","translationLanguages","sourceIds","contentStatus","examplePinyin"];
const syncFieldsByGroup={
 characters:[...commonSyncFields,"definitionCueZh","definitionZh","exampleZh","related","hskLevel"],
 vocabulary:[...commonSyncFields,"pinyinNumeric"],
 phrases:[...commonSyncFields,"definitionCueZh","exampleZh"]
};
if(generated.status!==pack.status)errors.push("Generated Chinese Flashcard bank draft status does not match its source.");
for(const group of ["characters","vocabulary","phrases"]){
 const sourceItems=pack[group]||[],generatedItems=generated[group]||[];
 const sourceById=new Map(sourceItems.map(item=>[item.id,item]));
 const generatedById=new Map(generatedItems.map(item=>[item.id,item]));
 for(const id of sourceById.keys())if(!generatedById.has(id))errors.push("Generated Flashcard bank is missing "+group+" card "+id);
 for(const id of generatedById.keys())if(!sourceById.has(id))errors.push("Generated Flashcard bank has stale or untracked "+group+" card "+id);
 for(const [id,item] of sourceById){
  const built=generatedById.get(id);if(!built)continue;
  for(const field of syncFieldsByGroup[group]){
   const a=JSON.stringify(item[field]??null),b=JSON.stringify(built[field]??null);
   if(a!==b)errors.push("Generated Flashcard card "+id+" has stale "+field+" data");
  }
 }
}
const ids=new Set(),chars=new Set(),vocab=new Set(),allTerms=new Map();
const modes={word:0,definition:0,translation_en:0,translation_zh:0,sentence:0};
const norm=x=>String(x||"").normalize("NFKC").replace(/[，。；、\s]/g,"").toLowerCase();
const registerTerm=(word,group)=>{
 const key=norm(word);
 if(!key)return;
 const previous=allTerms.get(key);
 if(previous)errors.push("Duplicate Chinese term across "+previous+" and "+group+": "+word);
 else allTerms.set(key,group);
};
if(pack.schema_version!==1||pack.status!=="draft"||pack.language_code!=="zh")errors.push("Pack must remain a Chinese-language draft.");
if(!Array.isArray(pack.characters)||!Array.isArray(pack.vocabulary)||!Array.isArray(pack.phrases))errors.push("characters, vocabulary and phrases arrays are required.");
for(const [i,c] of (pack.characters||[]).entries()){
 if(!c.id||ids.has(c.id))errors.push("Character "+i+" has a missing or duplicate ID");ids.add(c.id);
 if([...String(c.word||"")].length!==1)errors.push("Character "+i+" is not one Han character");
 registerTerm(c.word,"characters");
 if(chars.has(c.word))errors.push("Duplicate character "+c.word);chars.add(c.word);
 if(typeof c.examplePinyin!=="string"||!c.examplePinyin.trim())optionalWarnings.push("Character "+c.word+" has no sentence Pinyin (not used by current Sentence Recall).");
 if(!Array.isArray(c.sourceIds)||!c.sourceIds.length)errors.push("Character "+c.word+" has no provenance");
 if(!Array.isArray(c.availableModes))errors.push("Character "+c.word+" has no mode eligibility list");
 else{
  for(const mode of c.availableModes)if(!["word","definition","translation","sentence"].includes(mode))errors.push("Character "+c.word+" has an unknown mode");
  if(c.availableModes.includes("word")&&(!c.pinyin||!c.pinyin.trim()))errors.push("Character "+c.word+" enables Word Recall without Pinyin");
  if(c.availableModes.includes("definition")&&!String(c.definitionCueZh||c.definitionZh||"").trim())errors.push("Character "+c.word+" enables Definition Recall without a Chinese definition cue");
  if(c.availableModes.includes("sentence")&&!String(c.exampleZh||"").trim())errors.push("Character "+c.word+" enables Sentence Recall without an example sentence");
  if(c.availableModes.includes("translation")&&c.translationLanguages?.includes("en")&&!String(c.translationEn||"").trim())errors.push("Character "+c.word+" enables English Translation Recall without an English equivalent");
  if(c.availableModes.includes("translation")&&c.translationLanguages?.includes("zh")&&!String(c.translationZh||"").trim())errors.push("Character "+c.word+" enables Chinese Translation Recall without a distinct cue");
  if(c.availableModes.includes("translation")&&c.translationLanguages?.includes("zh")&&norm(c.definitionCueZh)===norm(c.translationZh))errors.push("Character "+c.word+" reuses its definition cue as its Chinese translation cue");
  for(const mode of c.availableModes)if(mode!=="translation")modes[mode]++;
  if(c.translationLanguages?.includes("en")&&c.translationEn)modes.translation_en++;
  if(c.translationLanguages?.includes("zh")&&c.translationZh&&norm(c.definitionCueZh||c.definitionZh)!==norm(c.translationZh))modes.translation_zh++;
 }
 if(c.translationLanguages?.includes("zh")&&!c.translationZh)errors.push("Character "+c.word+" advertises a missing Chinese equivalent");
}
for(const [i,v] of (pack.vocabulary||[]).entries()){
 if(!v.id||ids.has(v.id))errors.push("Vocabulary "+i+" has a missing or duplicate ID");ids.add(v.id);
 if([...String(v.word||"")].length<2)errors.push("Vocabulary "+i+" is not multi-character");
 registerTerm(v.word,"vocabulary");
 if(vocab.has(v.word))errors.push("Duplicate vocabulary "+v.word);vocab.add(v.word);
 if(!v.pinyinNumeric||!v.translationEn)errors.push("Vocabulary "+v.word+" needs pinyin and an English gloss");
 if(typeof v.examplePinyin!=="string"||!v.examplePinyin.trim())optionalWarnings.push("Vocabulary "+v.word+" has no sentence Pinyin (not used by current Sentence Recall).");
 if(!Array.isArray(v.sourceIds)||!v.sourceIds.includes("cc-cedict-2026-11-20"))errors.push("Vocabulary "+v.word+" is missing CC-CEDICT provenance");
 if(!Array.isArray(v.availableModes)||v.availableModes.some(mode=>!["word","translation"].includes(mode)))errors.push("Vocabulary "+v.word+" has invalid mode eligibility");
 if(v.availableModes?.includes("word")&&(!v.pinyin||!v.pinyin.trim()))errors.push("Vocabulary "+v.word+" enables Word Recall without Pinyin");
 if(v.availableModes?.includes("translation")&&v.translationLanguages?.includes("en")&&!String(v.translationEn||"").trim())errors.push("Vocabulary "+v.word+" enables English Translation Recall without a direct gloss");
 if(v.availableModes?.includes("translation")&&v.translationLanguages?.includes("zh")&&!String(v.translationZh||"").trim())errors.push("Vocabulary "+v.word+" enables Chinese Translation Recall without a direct equivalent");
 if(v.translationLanguages?.includes("zh")&&v.translationZh&&norm(v.definitionZh)===norm(v.translationZh))errors.push("Vocabulary "+v.word+" reuses its definition cue as its Chinese translation cue");
 if(v.availableModes?.includes("word"))modes.word++;
 if(v.translationLanguages?.includes("en")&&v.translationEn)modes.translation_en++;
 if(v.translationLanguages?.includes("zh")&&v.translationZh&&norm(v.definitionCueZh||v.definitionZh)!==norm(v.translationZh))modes.translation_zh++;
}
for(const [i,p] of (pack.phrases||[]).entries()){
 if(!p.id||ids.has(p.id))errors.push("Phrase "+i+" has a missing or duplicate ID");ids.add(p.id);
 if(!p.word||!p.pinyin||!p.translationEn||!p.definitionCueZh||!p.translationZh||!p.exampleZh)errors.push("Phrase "+p.word+" is missing a mode-specific cue");
 registerTerm(p.word,"phrases");
 if(norm(p.definitionCueZh)===norm(p.translationZh))errors.push("Phrase "+p.word+" reuses its definition cue as its translation cue");
 if(!Array.isArray(p.availableModes)||["word","definition","translation","sentence"].some(mode=>!p.availableModes.includes(mode)))errors.push("Phrase "+p.word+" does not support all four Chinese modes");
 for(const mode of p.availableModes||[])if(mode!=="translation")modes[mode]++;
 if(p.translationLanguages?.includes("en")&&p.translationEn)modes.translation_en++;
 if(p.translationLanguages?.includes("zh")&&p.translationZh&&norm(p.definitionCueZh||p.definitionZh)!==norm(p.translationZh))modes.translation_zh++;
}

const normPinyin=x=>String(x||"").normalize("NFKC").toLowerCase().replace(/[\s\p{P}\p{S}]+/gu,"");
const toneMarks={a:["ā","á","ǎ","à"],e:["ē","é","ě","è"],i:["ī","í","ǐ","ì"],o:["ō","ó","ǒ","ò"],u:["ū","ú","ǔ","ù"],ü:["ǖ","ǘ","ǚ","ǜ"]};
function convertNumericSyllable(token){
 const match=String(token||"").match(/^(.+?)([1-5])?$/);if(!match)return String(token||"");
 let body=match[1].toLowerCase().replace(/v/g,"ü").replace(/u:/g,"ü"),tone=Number(match[2]||5);
 if(tone<1||tone>4)return body;
 let index=body.indexOf("a");if(index<0)index=body.indexOf("e");
 if(index<0){const ou=body.indexOf("ou");if(ou>=0)index=ou;}
 if(index<0)for(let i=body.length-1;i>=0;i--)if("aeiouü".includes(body[i])){index=i;break;}
 if(index<0)return body;
 const vowel=body[index];return body.slice(0,index)+toneMarks[vowel][tone-1]+body.slice(index+1);
}
function convertNumericPinyin(value){return String(value||"").trim().split(/[\s'-]+/).map(convertNumericSyllable).join(" ");}
const dictionarySource=fs.readFileSync(path.join(root,"data/chinese-characters.js"),"utf8");
let dictionaryWords=[];
try{const start=dictionarySource.indexOf("["),end=dictionarySource.indexOf("];",start)+1;dictionaryWords=JSON.parse(dictionarySource.slice(start,end));}
catch{errors.push("Chinese character dictionary source is not valid JSON data");}
const dictionaryByWord=new Map(dictionaryWords.map(item=>[item.word,item]));
let characterSourceMatches=0,vocabularyPinyinMatches=0,repeatedSentenceTargets=0;
for(const c of pack.characters||[]){
 const source=dictionaryByWord.get(c.word);
 if(!source)errors.push("Character "+c.word+" is missing from the Chinese dictionary source");
 else{
  if(c.pinyin!==source.phonetic)errors.push("Character "+c.word+" Pinyin differs from the dictionary source");
  if(c.translationEn!==source.definition)errors.push("Character "+c.word+" English gloss differs from the dictionary source");
  if(c.definitionZh!==source.definitionZh)errors.push("Character "+c.word+" Chinese definition differs from the dictionary source");
  if(c.exampleZh!==(source.examples||[])[0])errors.push("Character "+c.word+" example differs from the dictionary source");
  if(c.related!==source.related)errors.push("Character "+c.word+" related-word source differs from the dictionary source");
  if(c.hskLevel!==source.hskLevel)errors.push("Character "+c.word+" HSK level differs from the dictionary source");
  characterSourceMatches++;
 }
}
for(const v of pack.vocabulary||[]){
 if(normPinyin(convertNumericPinyin(v.pinyinNumeric))!==normPinyin(v.pinyin))errors.push("Vocabulary "+v.word+" numeric Pinyin does not match its accented Pinyin");
 else vocabularyPinyinMatches++;
}
const flashcardsSource=fs.readFileSync(path.join(root,"flashcards.js"),"utf8");
if(!flashcardsSource.includes("function blankAllOccurrences(")||!flashcardsSource.includes("blankAllOccurrences(sentence,target.word,chinese)"))errors.push("Sentence Recall must blank every occurrence of its target");
function blankAllOccurrencesForCheck(sentence,word){
 const source=String(sentence||""),target=String(word||"");if(!source||!target)return source+" _____";
 const blanked=source.split(target).join("_____").replace(/(?:_____){2,}/g,"_____");
 return blanked===source?source+" _____":blanked;
}
for(const c of [...(pack.characters||[]),...(pack.phrases||[])]){
 const sentence=String(c.exampleZh||""),word=String(c.word||"");
 if(!sentence.includes(word))errors.push("Sentence Recall example does not contain its target: "+word);
 const occurrences=sentence.split(word).length-1;if(occurrences>1)repeatedSentenceTargets++;
 if(blankAllOccurrencesForCheck(sentence,word).includes(word))errors.push("Sentence Recall would still reveal repeated target "+word);
}
const allCards=[...(pack.characters||[]),...(pack.vocabulary||[]),...(pack.phrases||[])];
function cueFor(card,mode,language){
 if(mode==="word")return card.pinyin;
 if(mode==="definition")return card.definitionCueZh||card.definitionZh;
 if(mode==="translation")return language==="zh"?card.translationZh:card.translationEn;
 if(mode==="sentence")return card.exampleZh;
 return "";
}
function supports(card,mode,language){
 const cue=cueFor(card,mode,language);if(!cue)return false;
 if(mode==="translation"){
  if(!Array.isArray(card.availableModes)||!card.availableModes.includes("translation"))return false;
  if(!Array.isArray(card.translationLanguages)||!card.translationLanguages.includes(language))return false;
  return !(language==="zh"&&norm(cue)===norm(card.definitionCueZh||card.definitionZh));
 }
 return Array.isArray(card.availableModes)&&card.availableModes.includes(mode);
}
const coverage={word:0,definition:0,translation_en:0,translation_zh:0,sentence:0};
for(const [mode,language,key] of [["word","zh","word"],["definition","zh","definition"],["translation","en","translation_en"],["translation","zh","translation_zh"],["sentence","zh","sentence"]]){
 const eligible=allCards.filter(card=>supports(card,mode,language));coverage[key]=eligible.length;
 if(mode==="definition"||mode==="translation"||mode==="sentence"){
  const cueGroups=new Map();
  for(const card of eligible){
   const rawCue=mode==="sentence"?blankAllOccurrencesForCheck(card.exampleZh,card.word):cueFor(card,mode,language);
   const cue=norm(rawCue);
   if(cue){const group=cueGroups.get(cue)||[];group.push(card.word);cueGroups.set(cue,group);}
  }
  for(const words of cueGroups.values())if(words.length>1)errors.push("Ambiguous "+key+" cue is shared by: "+words.join(", "));
 }
 for(const target of eligible){
  const value=norm(mode==="word"?target.pinyin:target.word);
  const distractors=new Set(eligible.filter(card=>card!==target&&norm(mode==="word"?card.pinyin:card.word)!==value).map(card=>norm(mode==="word"?card.pinyin:card.word)));
  if(distractors.size<3)errors.push("Flashcard target "+target.word+" lacks three distinct distractors in "+key+" mode");
 }
}
if(characterSourceMatches!==(pack.characters||[]).length)errors.push("Not all Chinese character cards were source-checked");
if(vocabularyPinyinMatches!==(pack.vocabulary||[]).length)errors.push("Not all vocabulary Pinyin pairs were checked");
if((pack.characters||[]).length!==519||(pack.vocabulary||[]).length!==904||(pack.phrases||[]).length!==24)errors.push("Chinese Flashcard content counts changed without updating the QA baseline");

if(release&&warnings.length)errors.push("Release mode requires all mode-specific Chinese definitions, examples and pinyin to be complete.");
if(errors.length){console.error("Chinese Flashcard validation failed:");for(const e of errors)console.error(" - "+e);process.exit(1);}
console.log("Chinese Flashcard draft structure passed: "+chars.size+" characters, "+vocab.size+" multi-character terms, "+(pack.phrases||[]).length+" phrases.");
console.log("Unresolved release-blocking linguistic fields: "+warnings.length+".");
console.log("Optional sentence-Pinyin fields not used by current Sentence Recall: "+optionalWarnings.length+".");
console.log("Mode coverage — word: "+modes.word+", definition: "+modes.definition+", English translation: "+modes.translation_en+", Chinese translation: "+modes.translation_zh+", sentence: "+modes.sentence+".");
console.log("Source checks — character records: "+characterSourceMatches+"/"+(pack.characters||[]).length+", vocabulary Pinyin pairs: "+vocabularyPinyinMatches+"/"+(pack.vocabulary||[]).length+".");
console.log("Distractor coverage passed for every eligible target; repeated-target sentence examples: "+repeatedSentenceTargets+".");
