import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const pack=JSON.parse(fs.readFileSync(path.join(root,"content/flashcards/chinese-cards.draft.json"),"utf8"));
const release=process.argv.includes("--release");
const errors=[],warnings=[];
const ids=new Set(),chars=new Set(),vocab=new Set();
if(pack.schema_version!==1||pack.status!=="draft"||pack.language_code!=="zh")errors.push("Pack must remain a Chinese-language draft.");
if(!Array.isArray(pack.characters)||!Array.isArray(pack.vocabulary)||!Array.isArray(pack.phrases))errors.push("characters, vocabulary and phrases arrays are required.");
for(const [i,c] of (pack.characters||[]).entries()){
 if(!c.id||ids.has(c.id))errors.push("Character "+i+" has a missing or duplicate ID");ids.add(c.id);
 if([...String(c.word||"")].length!==1)errors.push("Character "+i+" is not one Han character");
 if(chars.has(c.word))errors.push("Duplicate character "+c.word);chars.add(c.word);
 for(const k of ["pinyin","translationEn","definitionZh","exampleZh"])if(typeof c[k]!=="string"||!c[k].trim())warnings.push("Character "+c.word+" needs "+k);
 if(!Array.isArray(c.sourceIds)||!c.sourceIds.length)errors.push("Character "+c.word+" has no provenance");
}
for(const [i,v] of (pack.vocabulary||[]).entries()){
 if(!v.id||ids.has(v.id))errors.push("Vocabulary "+i+" has a missing or duplicate ID");ids.add(v.id);
 if([...String(v.word||"")].length<2)errors.push("Vocabulary "+i+" is not multi-character");
 if(vocab.has(v.word))errors.push("Duplicate vocabulary "+v.word);vocab.add(v.word);
 if(!v.pinyinNumeric||!v.translationEn)errors.push("Vocabulary "+v.word+" needs pinyin and an English gloss");
 for(const k of ["definitionZh","exampleZh","examplePinyin"])if(typeof v[k]!=="string"||!v[k].trim())warnings.push("Vocabulary "+v.word+" needs "+k);
 if(!Array.isArray(v.sourceIds)||!v.sourceIds.includes("cc-cedict-2026-11-20"))errors.push("Vocabulary "+v.word+" is missing CC-CEDICT provenance");
}
if(release&&warnings.length)errors.push("Release mode requires all mode-specific Chinese definitions, examples and pinyin to be complete.");
if(errors.length){console.error("Chinese Flashcard validation failed:");for(const e of errors)console.error(" - "+e);process.exit(1);}
console.log("Chinese Flashcard draft structure passed: "+chars.size+" characters, "+vocab.size+" multi-character terms, "+(pack.phrases||[]).length+" phrases.");
console.log("Unresolved linguistic fields: "+warnings.length+". These records remain draft-only and must not be imported into the learner-facing bank.");
