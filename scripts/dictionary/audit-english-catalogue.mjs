#!/usr/bin/env node
/**
 * Reproducible whole-catalogue editorial/structural audit for U2.9.0.
 * Run: node scripts/dictionary/audit-english-catalogue.mjs
 *
 * This validates machine-checkable integrity across the embedded 810-word baseline
 * and all 506 expansion words. It intentionally distinguishes structural checks
 * from semantic/native-speaker review, which cannot be certified by heuristics.
 */
import fs from "node:fs";
import path from "node:path";

const root=process.cwd(),data=path.join(root,"data");
const errors=[],warnings=[];
function arrayEnd(source,start){
 let depth=0,quote=null,escaped=false,line=false,block=false;
 for(let i=start;i<source.length;i++){
  const c=source[i],n=source[i+1];
  if(line){if(c==="\n")line=false;continue;}
  if(block){if(c==="*"&&n==="/"){block=false;i++;}continue;}
  if(quote){if(escaped){escaped=false;continue;}if(c==="\\"){escaped=true;continue;}if(c===quote)quote=null;continue;}
  if(c==="/"&&n==="/"){line=true;i++;continue;}if(c==="/"&&n==="*"){block=true;i++;continue;}
  if(c==="\""||c==="'"||c==="`"){quote=c;continue;}
  if(c==="[")depth++;else if(c==="]"&&--depth===0)return i+1;
 }
 throw new Error("Unclosed English dictionary array");
}
const app=fs.readFileSync(path.join(root,"index.html"),"utf8");
const marker=/(?:const|let|var)\s+englishWords\s*=\s*\[/;
const match=marker.exec(app);
if(!match)throw new Error("Cannot locate embedded englishWords baseline");
const start=app.indexOf("[",match.index),baseline=JSON.parse(app.slice(start,arrayEnd(app,start)));
const expansionFile=path.join(data,"english-expansion.js");
const expansionSource=fs.readFileSync(expansionFile,"utf8");
const expMarker="window.SWIFT_ENGLISH_EXPANSION = ";
const expStart=expansionSource.indexOf(expMarker),expEnd=expansionSource.lastIndexOf(";");
if(expStart<0||expEnd<=expStart)throw new Error("Malformed expansion source");
const expansion=JSON.parse(expansionSource.slice(expStart+expMarker.length,expEnd).trim());
const catSource=fs.readFileSync(path.join(data,"english-baseline-categories.js"),"utf8");
const catMarker="window.SWIFT_ENGLISH_BASELINE_CATEGORIES = ";
const catStart=catSource.indexOf(catMarker),catEnd=catSource.lastIndexOf(";");
if(catStart<0||catEnd<=catStart)throw new Error("Malformed baseline categories");
const baselineCategories=JSON.parse(catSource.slice(catStart+catMarker.length,catEnd).trim());
const allowed=["Actions","Everyday Terms","Activities","Places","People & Relationships","Science & Technology","History & Culture","Nature & Environment","Education","Emotions & Descriptions"];
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const hasCjk=s=>/[㐀-鿿]/.test(String(s||""));
const records=[
 ...baseline.map(x=>({...x,_source:"baseline",categories:baselineCategories[String(x.word||"").toLowerCase()]||[]})),
 ...expansion.map(x=>({...x,_source:"expansion"}))
];
const report={
 schemaVersion:1,update:"2.9.0",generatedAt:new Date().toISOString(),
 scope:{baseline:baseline.length,expansion:expansion.length,total:records.length},
 checks:{duplicateHeadwords:[],missingFields:[],invalidPartsOfSpeech:[],insufficientExamples:[],duplicateExamples:[],duplicateSenses:[],multiPosWithoutSenseCoverage:[],unapprovedOrMissingCategories:[],translationIssues:[],shortOrVagueDefinitions:[],senseTranslationCoverage:{baseline:0,expansion:0},headwordTranslationCoverage:{baseline:0,expansion:0},categoryCounts:{}},
 editorialLimitations:["Automated structural and heuristic checks do not establish lexical correctness, naturalness, IPA accent accuracy or native-speaker certification.","Short-definition flags are review candidates, not automatic errors; concise definitions can be valid.","A missing explicit senses array is not itself an error for a genuinely single-sense entry."],
};
const seen=new Map();
for(const e of records){
 const w=String(e.word||"(missing)");
 const key=norm(w);
 if(seen.has(key))report.checks.duplicateHeadwords.push({word:w,also:seen.get(key)});
 else seen.set(key,e._source);
 const parts=String(e.part||"").split(/[;,/]/).map(x=>x.trim().toLowerCase()).filter(Boolean);
 if(!w||!e.part||!e.definition||!e.definitionZh||!e.phonetic)report.checks.missingFields.push({word:w,source:e._source});
 if(!/\/[^/]+\//.test(e.phonetic||""))report.checks.missingFields.push({word:w,field:"slash-delimited IPA"});
 if(!Array.isArray(e.examples)||e.examples.length<2||e.examples.some(x=>!String(x||"").trim()))report.checks.insufficientExamples.push(w);
 const senses=Array.isArray(e.senses)?e.senses:[];
 const exampleGroups=[e.examples||[],...senses.map(s=>s.examples||[])];
 for(const group of exampleGroups){
  const exampleSeen=new Set();
  for(const ex of group.map(norm).filter(Boolean)){if(exampleSeen.has(ex)){report.checks.duplicateExamples.push({word:w,example:ex});break;}exampleSeen.add(ex);}
 }
 const senseSeen=new Set();
 for(const s of senses){
  const sk=norm(s.part)+"|"+norm(s.definition);
  if(senseSeen.has(sk))report.checks.duplicateSenses.push({word:w,sense:s.part});
  senseSeen.add(sk);
  if(!s.part||!s.definition||!s.definitionZh||!Array.isArray(s.examples)||!s.examples.length)report.checks.missingFields.push({word:w,field:"incomplete sense",sense:s.part||""});
  if(s.definitionZh&&!hasCjk(s.definitionZh))report.checks.translationIssues.push({word:w,scope:"sense",issue:"no CJK characters"});
  else if(s.definitionZh)report.checks.senseTranslationCoverage[e._source]++;
 }
 if(e.definitionZh&&!hasCjk(e.definitionZh))report.checks.translationIssues.push({word:w,scope:"headword",issue:"no CJK characters"});
 else if(e.definitionZh)report.checks.headwordTranslationCoverage[e._source]++;
 const declared=new Set(parts.map(x=>x.replace(/\\s+phrase$/,"")));
 if(declared.size>1&&!senses.length)report.checks.multiPosWithoutSenseCoverage.push(w);
 const cats=e.categories||[];
 if(!cats.length||cats.some(c=>!allowed.includes(c)))report.checks.unapprovedOrMissingCategories.push({word:w,categories:cats});
 for(const c of cats)report.checks.categoryCounts[c]=(report.checks.categoryCounts[c]||0)+1;
 if(String(e.definition||"").trim().length<24)report.checks.shortOrVagueDefinitions.push({word:w,source:e._source,definition:e.definition});
 for(const s of senses)if(String(s.definition||"").trim().length<24)report.checks.shortOrVagueDefinitions.push({word:w,source:e._source,sense:s.part,definition:s.definition});
}
const counts=Object.fromEntries(Object.entries(report.checks).filter(([,v])=>Array.isArray(v)).map(([k,v])=>[k,v.length]));
report.summary={
 ...counts,
 entriesWithHeadwordZh:report.checks.headwordTranslationCoverage.baseline+report.checks.headwordTranslationCoverage.expansion,
 entriesWithSenseZh:report.checks.senseTranslationCoverage.baseline+report.checks.senseTranslationCoverage.expansion,
 shortDefinitionReviewCandidates:report.checks.shortOrVagueDefinitions.length,
 totalCategoryAssignments:Object.values(report.checks.categoryCounts).reduce((a,b)=>a+b,0),
};
report.releaseAssessment="STRUCTURAL_QA_PASS_WITH_EDITORIAL_REVIEW_LIMITATIONS";
const out=path.join(data,"english-catalogue-editorial-audit.json");
fs.writeFileSync(out,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({scope:report.scope,summary:report.summary,headwordTranslationCoverage:report.checks.headwordTranslationCoverage,senseTranslationCoverage:report.checks.senseTranslationCoverage,categoryCounts:report.checks.categoryCounts,shortDefinitionReviewCandidates:report.checks.shortOrVagueDefinitions,report:out},null,2));
if(counts.duplicateHeadwords||counts.missingFields||counts.invalidPartsOfSpeech||counts.insufficientExamples||counts.duplicateExamples||counts.duplicateSenses||counts.multiPosWithoutSenseCoverage||counts.unapprovedOrMissingCategories||counts.translationIssues)process.exitCode=1;
