/* Versioned translation registry. Legacy translations are retained as unverified, never auto-approved. */
(() => {
  "use strict";
  const records=new Map();
  const contracts=()=>window.SWIFT_CONTENT_CONTRACTS;
  const keyOf=record=>[record.contentId,record.sourceLanguageCode,record.targetLanguageCode].join("|");
  function register(record){
    const errors=contracts()?.validateTranslation(record)||[];
    if(errors.length)throw new TypeError("Invalid translation record: "+errors.map(x=>x.path+": "+x.message).join("; "));
    const key=keyOf(record);
    if(records.has(key))throw new Error("Translation record already exists: "+key);
    const frozen=Object.freeze({...record});
    records.set(key,frozen);
    return frozen;
  }
  function registerLegacyMap({translations,sourceLanguageCode,targetLanguageCode,contentVersion}){
    return Object.entries(translations||{}).map(([contentId,content])=>register({
      contentId,sourceLanguageCode,targetLanguageCode,sourceRevision:1,translationRevision:1,
      status:"legacy_unverified",provenance:"Legacy translation map; "+String(contentVersion||"unspecified"),
      reviewerId:null,content
    }));
  }
  function get(contentId,sourceLanguageCode,targetLanguageCode){return records.get([contentId,sourceLanguageCode,targetLanguageCode].join("|"))||null;}
  function list(){return [...records.values()];}
  function markSourceRevisionChanged(contentId,sourceLanguageCode,newRevision){
    if(!Number.isInteger(newRevision)||newRevision<1)throw new TypeError("A positive source revision is required.");
    const updates=[];
    for(const [key,record] of records){
      if(record.contentId!==contentId||record.sourceLanguageCode!==sourceLanguageCode||record.sourceRevision>=newRevision)continue;
      const stale=Object.freeze({...record,status:"stale",sourceRevision:newRevision});
      records.set(key,stale);updates.push(stale);
    }
    return updates;
  }
  const api=Object.freeze({register,registerLegacyMap,get,list,markSourceRevisionChanged});
  window.SWIFT_TRANSLATION_REGISTRY=api;
})();