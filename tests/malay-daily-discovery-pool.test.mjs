import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

test("Malay Daily Discovery slug normalisation preserves ordinary letters and resolves all approved dictionary entries",()=>{
 const runtime=fs.readFileSync("daily-learning.js","utf8");
 const slugStart=runtime.indexOf("const malayDailyDiscoverySlug = ");
 const slugEnd=runtime.indexOf("const buildMalayDailyDiscoveryPool",slugStart);
 assert.ok(slugStart>=0&&slugEnd>slugStart,"Runtime Malay Discovery slug helper must exist");
 const slugExpression=runtime.slice(slugStart,slugEnd).trim()
  .replace(/^const malayDailyDiscoverySlug = /,"")
  .replace(/;$/,"");
 const slug=vm.runInNewContext("("+slugExpression+")");
 assert.equal(slug("bantu"),"bantu");
 assert.equal(slug("untuk"),"untuk");
 assert.equal(slug("kampung"),"kampung");
 assert.equal(slug("terima kasih"),"terima-kasih");

 const dictionaryContext={window:{}};
 vm.runInNewContext(fs.readFileSync("data/languages/malay-dictionary.js","utf8"),dictionaryContext);
 const dictionary=dictionaryContext.window.SWIFT_MALAY_DICTIONARY||[];
 const approvedMatch=runtime.match(/const MALAY_DAILY_DISCOVERY_APPROVED_WORDS = (\[[\s\S]*?\]);/);
 assert.ok(approvedMatch,"Approved Malay Daily Discovery ID list must exist");
 const approved=vm.runInNewContext(approvedMatch[1]);
 const dictionarySlugs=new Set(dictionary.map(entry=>slug(entry.word)));
 const missing=approved.filter(id=>!dictionarySlugs.has(id));
 assert.equal(approved.length,93);
 assert.equal(new Set(approved).size,93);
 assert.equal(missing.length,0,`Missing approved Malay Discovery words: ${Array.from(missing).join(', ')}`);
});

test("Daily Discovery rotation order is unique per language, not globally",()=>{
 const base=fs.readFileSync("supabase/migrations/20261114082311_swiftdictionary_update_2_3_0_learning_content_catalog.sql","utf8");
 const sync=fs.readFileSync("supabase/migrations/20261127150000_swiftdictionary_update_3_0_malay_daily_discovery_catalogue_sync.sql","utf8");
 const repair=fs.readFileSync("supabase/migrations/20261128100000_swiftdictionary_update_3_0_language_scoped_discovery_rotation.sql","utf8");
 for(const [name,sql] of [["baseline",base],["Malay sync",sync],["staging repair",repair]]){
  assert.match(sql,/on private\.learning_content_catalog\s*\(language_code\s*,\s*rotation_order\)/i,name+" must scope the unique rotation index by language");
 }
 assert.doesNotMatch(base,/on private\.learning_content_catalog\s*\(rotation_order\)/i);
 assert.match(sync,/drop index if exists private\.learning_content_catalog_discovery_order_idx/i);
 assert.match(repair,/drop index if exists private\.learning_content_catalog_discovery_order_idx/i);
});
