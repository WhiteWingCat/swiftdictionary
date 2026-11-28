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
