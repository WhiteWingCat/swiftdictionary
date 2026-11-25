#!/usr/bin/env node
/**
 * U2.9.0 Phase 3 audit: category metadata and sense-level Simplified Chinese coverage.
 * Run: node scripts/dictionary/validate-english-phase3.mjs
 */
import fs from "node:fs";
import path from "node:path";
const root=process.cwd(), data=path.join(root,"data");
const allowed=["Actions","Everyday Terms","Activities","Places","People & Relationships","Science & Technology","History & Culture","Nature & Environment","Education","Emotions & Descriptions"];
const errors=[];
function extractArray(source, marker){
 const at=source.indexOf(marker); if(at<0)throw new Error("Missing source marker: "+marker);
 const start=source.indexOf("[",at); let depth=0,quote=null,escaped=false,line=false,block=false;
 for(let i=start;i<source.length;i++){
  const c=source[i],n=source[i+1];
  if(line){if(c==="\n")line=false;continue;}
  if(block){if(c==="*"&&n==="/"){block=false;i++;}continue;}
  if(quote){if(escaped){escaped=false;continue;}if(c==="\\"){escaped=true;continue;}if(c===quote)quote=null;continue;}
  if(c==="/"&&n==="/"){line=true;i++;continue;}if(c==="/"&&n==="*"){block=true;i++;continue;}
  if(c==="\""||c==="'"||c==="`"){quote=c;continue;}
  if(c==="[")depth++;else if(c==="]"&&--depth===0)return JSON.parse(source.slice(start,i+1));
 }
 throw new Error("Could not find array end for "+marker);
}
const app=fs.readFileSync(path.join(root,"index.html"),"utf8");
const baseline=extractArray(app,"const englishWords = [");
const categoryPath=path.join(data,"english-baseline-categories.js");
if(!fs.existsSync(categoryPath))throw new Error("Missing data/english-baseline-categories.js");
const categorySource=fs.readFileSync(categoryPath,"utf8");
const marker="window.SWIFT_ENGLISH_BASELINE_CATEGORIES = ";
const categoryStart=categorySource.indexOf(marker), categoryEnd=categorySource.lastIndexOf(";");
if(categoryStart<0||categoryEnd<=categoryStart)throw new Error("Malformed baseline category metadata");
const categoryMap=JSON.parse(categorySource.slice(categoryStart+marker.length,categoryEnd).trim());
const batches=fs.readdirSync(data).filter(x=>/^english-expansion-batch-\d+\.json$/.test(x)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
const expansion=batches.flatMap(file=>JSON.parse(fs.readFileSync(path.join(data,file),"utf8")).entries||[]);
const summary={baselineEntries:baseline.length,baselineCategorised:0,baselineMissingZh:0,baselineSenseCount:0,baselineSenseMissingZh:0,expansionEntries:expansion.length,expansionMissingZh:0,expansionSenseCount:0,expansionSenseMissingZh:0,headwordTranslationsWithoutCjk:0,senseTranslationsWithoutCjk:0,placeholderTranslations:0,categoryCounts:{},errors};
const containsCjk=value=>/[\\u3400-\\u9fff]/.test(String(value||""));
const placeholderTranslation=/translation pending|待翻译|待补充|翻译待|\\bTODO\\b|\\bN\\/A\\b|常见语境[:：]/i;
function auditTranslation(value,label){
 if(!containsCjk(value)){summary[label]++;errors.push("Translation has no Simplified Chinese characters: "+label);}
 if(placeholderTranslation.test(String(value||""))){summary.placeholderTranslations++;errors.push("Placeholder/fallback translation found: "+String(value));}
}
for(const item of baseline){
 const key=String(item.word||"").toLowerCase(),cats=categoryMap[key];
 if(!Array.isArray(cats)||!cats.length){errors.push("Baseline word lacks category metadata: "+item.word);continue;}
 summary.baselineCategorised++;
 for(const cat of cats){if(!allowed.includes(cat))errors.push(item.word+" has unapproved category "+cat);summary.categoryCounts[cat]=(summary.categoryCounts[cat]||0)+1;}
 if(typeof item.definitionZh!=="string"||!item.definitionZh.trim()){summary.baselineMissingZh++;errors.push("Baseline word lacks Simplified Chinese definition: "+item.word);}else auditTranslation(item.definitionZh,"headwordTranslationsWithoutCjk");
 for(const sense of item.senses||[]){summary.baselineSenseCount++;if(typeof sense.definitionZh!=="string"||!sense.definitionZh.trim()){summary.baselineSenseMissingZh++;errors.push("Baseline sense lacks Simplified Chinese definition: "+item.word+" / "+sense.part);}else auditTranslation(sense.definitionZh,"senseTranslationsWithoutCjk");}
}
for(const item of expansion){
 const cats=item.categories;
 if(!Array.isArray(cats)||!cats.length)errors.push("Expansion word lacks category metadata: "+item.word);
 for(const cat of cats||[]){if(!allowed.includes(cat))errors.push(item.word+" has unapproved category "+cat);summary.categoryCounts[cat]=(summary.categoryCounts[cat]||0)+1;}
 if(typeof item.definitionZh!=="string"||!item.definitionZh.trim()){summary.expansionMissingZh++;errors.push("Expansion word lacks Simplified Chinese definition: "+item.word);}else auditTranslation(item.definitionZh,"headwordTranslationsWithoutCjk");
 for(const sense of item.senses||[]){summary.expansionSenseCount++;if(typeof sense.definitionZh!=="string"||!sense.definitionZh.trim()){summary.expansionSenseMissingZh++;errors.push("Expansion sense lacks Simplified Chinese definition: "+item.word+" / "+sense.part);}else auditTranslation(sense.definitionZh,"senseTranslationsWithoutCjk");}
}
const requiredScripts=[
 ["data/english-baseline-categories.js", "data/english-baseline-categories.js"],
 ["english-category-filters.js", "english-category-filters.js"]
];
for(const [pathPart,label] of requiredScripts)if(!app.includes(pathPart))errors.push("index.html does not load "+label);
if(summary.baselineCategorised!==baseline.length)errors.push("Not all baseline entries have category assignments.");
if(summary.baselineMissingZh||summary.baselineSenseMissingZh||summary.expansionMissingZh||summary.expansionSenseMissingZh)errors.push("Simplified Chinese translation coverage is incomplete.");
console.log(JSON.stringify(summary,null,2));
if(errors.length)process.exitCode=1;
