const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");

test("application loads registry, contracts, translation registry and adapters before content packages",()=>{
 const html=read("index.html");
 const ordered=[
  'js/core/language-registry.js',
  'js/core/content-contracts.js',
  'js/core/translation-registry.js',
  'js/languages/adapters.js',
  'js/core/content-packages.js'
 ];
 let previous=-1;
 for(const script of ordered){const position=html.indexOf(script);assert.ok(position>previous,script+" must load in dependency order");previous=position;}
});

test("legacy content bootstrap runs after language content sources and daily learning",()=>{
 const html=read("index.html");
 const sources=["data/languages/english-dictionary.js","data/languages/chinese-dictionary.js","data/languages/english-lessons.js","daily-learning.js","data/chinese-flashcards.js","flashcards.js","js/core/legacy-content-bootstrap.js"];
 let previous=-1;
 for(const source of sources){
  // Match the actual script element, not an earlier metadata reference in inline code.
  const position=html.indexOf('<script src="'+source);
  assert.ok(position>previous,source+" must load after its dependencies");
  previous=position;
 }
 assert.ok(html.includes("SWIFT_LEGACY_CONTENT_DATA"));
});

test("English and Chinese manifests are active and Malay remains planned",()=>{
 const en=JSON.parse(read("content/languages/en/manifest.json"));
 const zh=JSON.parse(read("content/languages/zh/manifest.json"));
 const ms=JSON.parse(read("content/languages/ms/manifest.json"));
 assert.equal(en.status,"active");assert.equal(zh.status,"active");assert.equal(ms.status,"planned");
 assert.equal(ms.standard,"Malaysian Standard Malay (Bahasa Melayu Malaysia)");
 assert.equal(ms.capabilities.lessons,false);assert.equal(ms.capabilities.quiz,false);
});

test("architecture migration design retains safe migration gates",()=>{
 const design=read("docs/U3.0-PHASE-1-DATABASE-MIGRATION-DESIGN.md");
 assert.ok(design.includes("Expand"));
 assert.ok(design.includes("Migrate"));
 assert.ok(design.includes("Verify"));
 assert.ok(design.includes("Contract"));
 assert.match(design,/no staging preview/i);
 assert.match(design,/Phase 3 is complete/i);
});