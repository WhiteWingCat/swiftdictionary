import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("Malay Dictionary exposes grouped topic and word-class filters",()=>{
  const context={window:{}};
  vm.createContext(context);
  vm.runInContext(read("malay-category-filters.js"),context);
  const filters=context.window.SWIFT_MALAY_DICTIONARY_FILTERS;
  assert.ok(filters);
  assert.ok(filters.groups.length>=12);
  assert.ok(filters.wordClasses.some(item=>item.id==="noun"));
  assert.ok(filters.wordClasses.some(item=>item.id==="verb"));
  assert.deepEqual([...filters.categoryIds({categories:["keluarga","makanan dan minuman"]})].sort(),["food","people"]);
  assert.equal(filters.matchesPart({part:"kata nama / kata kerja"},"noun"),true);
  assert.equal(filters.matchesPart({part:"kata nama / kata kerja"},"verb"),true);
  assert.equal(filters.matchesPart({part:"kata adjektif"},"adjective"),true);
  assert.equal(filters.matchesPart({part:"kata sendi nama"},"function"),true);
});

test("Malay filter script is wired into the U3.0 staging page",()=>{
  const html=read("index.html");
  assert.match(html,/malay-category-filters\.js/);
});
