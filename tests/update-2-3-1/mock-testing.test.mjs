import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../../mock-testing.js", import.meta.url), "utf8");
const flashcardsSource = fs.readFileSync(new URL("../../flashcards.js", import.meta.url), "utf8");
const draftBank = JSON.parse(fs.readFileSync(new URL("../../content/quiz/questions.en-zh.draft.json", import.meta.url), "utf8"));
const curriculumMap = JSON.parse(fs.readFileSync(new URL("../../content/quiz/curriculum-map.en.json", import.meta.url), "utf8"));
const draftById = new Map(draftBank.questions.map(question => [question.question_id, question]));
class FakeStorage {
  constructor(){ this.data=new Map(); }
  get length(){ return this.data.size; }
  key(index){ return [...this.data.keys()][index] ?? null; }
  getItem(key){ return this.data.has(String(key)) ? this.data.get(String(key)) : null; }
  setItem(key,value){ this.data.set(String(key),String(value)); }
  removeItem(key){ this.data.delete(String(key)); }
  clear(){ this.data.clear(); }
}
function makeContext(hostname,search="?swiftMock=1") {
  const localStorage=new FakeStorage(), sessionStorage=new FakeStorage();
  const listeners={};
  const originalClient={auth:{},from(){throw new Error("original Supabase client should not be called");}};
  const window={supabase:{createClient(){return originalClient;}}};
  const document={readyState:"loading",addEventListener(name,callback){listeners[name]=callback;}};
  const location={hostname,search,href:"https://"+hostname+"/"+search,replace(){}};
  const context={
    window,document,location,localStorage,sessionStorage,Storage:FakeStorage,
    URLSearchParams,Intl,Date,JSON,String,Set,Array,Object,Number,Math,Promise,
    fetch:async url=>({
      ok:true,
      async json(){
        if(String(url).includes("questions.en-zh.draft.json")) return JSON.parse(JSON.stringify(draftBank));
        if(String(url).includes("curriculum-map.en.json")) return JSON.parse(JSON.stringify(curriculumMap));
        throw new Error("Unexpected mock fetch URL: "+url);
      }
    }),
    console:{log(){},info(){},warn(){},error(){}}
  };
  vm.runInNewContext(source,context,{filename:"mock-testing.js"});
  return {context,window,document,location,localStorage,sessionStorage,listeners,originalClient};
}

test("mock adapter activates only on the exact feature preview with explicit opt-in", async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  assert.equal(env.window.SWIFT_DICTIONARY_MOCK_MODE,true);
  assert.equal(env.window.SWIFT_DICTIONARY_MOCK_CAPABILITIES.rls,false);
  assert.equal(env.window.SWIFT_DICTIONARY_MOCK_CAPABILITIES.crossDeviceSync,false);
  const client=env.window.supabase.createClient("https://production.supabase.co","public-key");
  assert.equal(typeof client.from,"function");
  const session=await client.auth.getSession();
  assert.equal(session.data.session.user.id,"mock-user-a");
  const oauth=await client.auth.signInWithOAuth({provider:"google"});
  assert.match(oauth.error.message,/disabled in MOCK TEST MODE/);
});

test("mock adapter fails closed on the base testing domain and unapproved hosts",()=>{
  for(const host of ["swiftdictionary-testing.pages.dev","example.com"]){
    const env=makeContext(host);
    assert.notEqual(env.window.SWIFT_DICTIONARY_MOCK_MODE,true);
    assert.equal(env.window.__swiftDictionaryMock,undefined);
  }
});

test("Quiz feature preview requires explicit opt-in and activates only on its exact host",async()=>{
  const env=makeContext("feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev");
  assert.equal(env.window.SWIFT_DICTIONARY_MOCK_MODE,true);
  assert.equal(env.window.SWIFT_DICTIONARY_MOCK_CAPABILITIES.database,false);
  const client=env.window.supabase.createClient();
  const availability=await client.rpc("get_my_quiz_availability");
  assert.equal(availability.data.allowance.daily_limit,1);
});

test("mock data is isolated by identity and scoped to session storage",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  let result=await client.from("saved_words").select("word").eq("user_id","mock-user-a");
  assert.deepEqual(Array.from(result.data,row=>row.word).sort(),["hello","你"].sort());

  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  result=await client.from("saved_words").select("word").eq("user_id","mock-user-b");
  assert.deepEqual(Array.from(result.data,row=>row.word).sort(),["thank","好"].sort());
  await client.from("saved_words").insert({user_id:"mock-user-b",course:"en",word:"world"});
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-a");
  result=await client.from("saved_words").select("word").eq("user_id","mock-user-a");
  assert.deepEqual(Array.from(result.data,row=>row.word).sort(),["hello","你"].sort());

  env.localStorage.setItem("swiftdictionary-saved","real-account-data");
  assert.equal(env.localStorage.getItem("swiftdictionary-saved"),null);
  env.localStorage.setItem("unrelated-real-setting","keep");
  env.sessionStorage.setItem("unrelated-session-setting","keep");
  assert.equal(env.window.__swiftDictionaryMock.selectionGeneration(),0);
  env.window.__swiftDictionaryMock.reset();
  assert.equal(env.window.__swiftDictionaryMock.selectionGeneration(),1);
  assert.equal(env.localStorage.getItem("unrelated-real-setting"),"keep");
  assert.equal(env.sessionStorage.getItem("unrelated-session-setting"),"keep");
  assert.deepEqual([...env.sessionStorage.data.keys()].sort(),["unrelated-session-setting","swiftDictionaryMock:v1:selection-generation"].sort());
  // Reset restores each identity's own fixture while advancing the daily-selection generation.
  result=await client.from("saved_words").select("word").eq("user_id","mock-user-a");
  assert.deepEqual(Array.from(result.data,row=>row.word).sort(),["hello","你"].sort());
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  result=await client.from("saved_words").select("word").eq("user_id","mock-user-b");
  assert.deepEqual(Array.from(result.data,row=>row.word).sort(),["thank","好"].sort());
});

test("mock identities represent separate Free and Premium plans",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();

  let entitlement=await client.from("user_entitlements").select("plan_code").eq("user_id","mock-user-a").single();
  assert.equal(entitlement.data.plan_code,"free");
  let limit=await client.from("learning_plan_limits").select("daily_limit").eq("plan_code","free").eq("activity_type","daily_discovery").single();
  assert.equal(limit.data.daily_limit,1);
  const freeLessonLimit=await client.from("learning_plan_limits").select("daily_limit").eq("plan_code","free").eq("activity_type","lesson").single();
  assert.equal(freeLessonLimit.data.daily_limit,5);

  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  entitlement=await client.from("user_entitlements").select("plan_code").eq("user_id","mock-user-b").single();
  assert.equal(entitlement.data.plan_code,"premium");
  limit=await client.from("learning_plan_limits").select("daily_limit").eq("plan_code","premium").eq("activity_type","daily_discovery").single();
  assert.equal(limit.data.daily_limit,3);
  const premiumLessonLimit=await client.from("learning_plan_limits").select("daily_limit").eq("plan_code","premium").eq("activity_type","lesson").single();
  assert.equal(premiumLessonLimit.data.daily_limit,15);
  for (let i=1;i<=3;i++) {
    const started=await client.rpc("start_daily_activity_session",{
      p_activity_type:"daily_discovery",p_content_id:"mock-discovery-"+i+":2026-11-14",
      p_topic_id:null,p_difficulty:null,p_source:"daily"
    });
    const completed=await client.rpc("complete_daily_activity_session",{
      p_session_id:started.data.id,p_correct_count:null,p_question_count:null
    });
    assert.equal(completed.data.status,"completed");
  }
  const usage=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(usage.data.find(row=>row.activity_type==="daily_discovery").used_count,3);
  const fourth=await client.rpc("start_daily_activity_session",{
    p_activity_type:"daily_discovery",p_content_id:"mock-discovery-4:2026-11-14",
    p_topic_id:null,p_difficulty:null,p_source:"daily"
  });
  assert.equal(fourth.error.code,"P0001");

  const replay=await client.rpc("start_daily_activity_session",{
    p_activity_type:"daily_discovery",p_content_id:"mock-discovery-1:2026-11-14",
    p_topic_id:null,p_difficulty:null,p_source:"daily"
  });
  assert.equal(replay.data.status,"completed");
  const afterReplay=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(afterReplay.data.find(row=>row.activity_type==="daily_discovery").used_count,3);
});

test("Flash Recall mode-specific timer starts, fixed 0.2s reductions and caps match approved rules",()=>{
  const match=flashcardsSource.match(/const timing = \{([\s\S]*?)\n  \};/);
  assert.ok(match,"Flashcards must define the mode-specific timer configuration");
  const config={};
  for(const modeRow of match[1].matchAll(/(word|definition|sentence|mixed):\{((?:[^{}]|\{[^{}]*\})*)\}/g)){
    const mode=modeRow[1],levels={};
    for(const row of modeRow[2].matchAll(/(beginner|intermediate|advanced):\{memory:([0-9.]+),answer:([0-9.]+),memoryFloor:([0-9.]+),answerFloor:([0-9.]+)\}/g)){
      levels[row[1]]={memory:Number(row[2]),answer:Number(row[3]),memoryFloor:Number(row[4]),answerFloor:Number(row[5])};
    }
    config[mode]=levels;
  }
  assert.deepEqual(config,{
    word:{beginner:{memory:5,answer:12,memoryFloor:3,answerFloor:9},intermediate:{memory:5,answer:10,memoryFloor:2,answerFloor:7},advanced:{memory:3,answer:9,memoryFloor:1,answerFloor:5}},
    definition:{beginner:{memory:6,answer:5,memoryFloor:4,answerFloor:3},intermediate:{memory:5,answer:4,memoryFloor:3,answerFloor:3},advanced:{memory:4,answer:4,memoryFloor:2,answerFloor:3}},
    sentence:{beginner:{memory:7,answer:10,memoryFloor:5,answerFloor:7},intermediate:{memory:6,answer:8,memoryFloor:4,answerFloor:6},advanced:{memory:5,answer:6,memoryFloor:3,answerFloor:3}},
    mixed:{beginner:{memory:8,answer:12,memoryFloor:6,answerFloor:9},intermediate:{memory:7,answer:10,memoryFloor:5,answerFloor:7},advanced:{memory:6,answer:8,memoryFloor:4,answerFloor:5}}
  });
  assert.match(flashcardsSource,/const REDUCTION_STEP = 0\.2/);
  assert.match(flashcardsSource,/state\.memory-REDUCTION_STEP/);
  assert.match(flashcardsSource,/state\.answer-REDUCTION_STEP/);
  for(const levels of Object.values(config))for(const t of Object.values(levels)){
    let memory=t.memory,answer=t.answer;
    for(let i=0;i<100;i++){memory=Math.max(t.memoryFloor,Number((memory-.2).toFixed(2)));answer=Math.max(t.answerFloor,Number((answer-.2).toFixed(2)));}
    assert.equal(memory,t.memoryFloor);
    assert.equal(answer,t.answerFloor);
  }
});
test("Flashcard mock allowance matches the approved Free 3 and Premium 10 games per day",async()=>{
  const env=makeContext("feature-update-2-5-0-flashcards.swiftdictionary-testing.pages.dev");
  assert.equal(env.window.SWIFT_DICTIONARY_MOCK_MODE,true);
  const client=env.window.supabase.createClient();

  let free=await client.from("learning_plan_limits").select("daily_limit").eq("plan_code","free").eq("activity_type","flashcard").single();
  assert.equal(free.data.daily_limit,3);

  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  const premium=await client.from("learning_plan_limits").select("daily_limit").eq("plan_code","premium").eq("activity_type","flashcard").single();
  assert.equal(premium.data.daily_limit,10);
});

test("Flashcard Mock User supports private collections, custom cards, mastery and Free allowance",async()=>{
  const env=makeContext("feature-update-2-5-0-flashcards.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  const created=await client.rpc("save_my_flashcard_collection",{p_action:"create",p_collection_id:null,p_name:"My custom words"});
  assert.equal(created.error,null);
  const collectionId=created.data.id;
  const card=await client.rpc("save_my_flashcard_card",{
    p_action:"create",p_card_id:null,p_collection_id:collectionId,p_card_type:"custom",
    p_dictionary_word:null,p_front_text:"What is a collocation?",p_back_text:"Words that commonly occur together.",
    p_example_text:"make a decision",p_translation_text:"常见搭配",p_position:0
  });
  assert.equal(card.error,null);
  let data=await client.rpc("get_my_flashcard_data");
  assert.equal(data.data.collections.length,1);
  assert.equal(data.data.cards.length,1);
  assert.equal(data.data.allowance.daily_limit,3);
  assert.equal(data.data.allowance.remaining,3);
  const allowanceSummary=await client.rpc("get_my_flashcard_allowance");
  assert.equal(allowanceSummary.data.daily_limit,3);
  assert.equal(allowanceSummary.data.remaining,3);

  const abandoned=await client.rpc("start_my_flashcard_game",{p_mode:"word",p_difficulty:"beginner"});
  assert.equal(abandoned.error,null);
  await client.rpc("abandon_my_flashcard_game",{p_session_id:abandoned.data.session_id});
  let usage=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(usage.data.find(row=>row.activity_type==="flashcard").used_count,0);

  for(let i=0;i<3;i++){
    const started=await client.rpc("start_my_flashcard_game",{p_mode:"word",p_difficulty:"beginner"});
    assert.equal(started.error,null);
    const completed=await client.rpc("complete_my_flashcard_game",{
      p_session_id:started.data.session_id,
      p_results:[{card_key:"custom:"+card.data.id,correct:i===0,unanswered:i===2},{card_key:"dict:hello",correct:true,unanswered:false}]
    });
    assert.equal(completed.error,null);
    assert.equal(completed.data.words_seen,2);
  }
  usage=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(usage.data.find(row=>row.activity_type==="flashcard").used_count,3);
  const blocked=await client.rpc("start_my_flashcard_game",{p_mode:"word",p_difficulty:"beginner"});
  assert.equal(blocked.error.code,"P0001");
  data=await client.rpc("get_my_flashcard_data");
  assert.equal(data.data.history.length,3);
  assert.equal(data.data.allowance.used_count,3);
  assert.equal(data.data.allowance.remaining,0);
  assert.equal(data.data.mastery.find(row=>row.card_key==="custom:"+card.data.id).incorrect_count,2);

  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  data=await client.rpc("get_my_flashcard_data");
  assert.equal(data.data.collections.length,0);
  assert.equal(data.data.cards.length,0);
  assert.equal(data.data.mastery.length,0);
});

test("Flashcard collections support editing, moving and deleting cards",async()=>{
  const env=makeContext("feature-update-2-5-0-flashcards.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  const first=await client.rpc("save_my_flashcard_collection",{p_action:"create",p_collection_id:null,p_name:"First"});
  const second=await client.rpc("save_my_flashcard_collection",{p_action:"create",p_collection_id:null,p_name:"Second"});
  const created=await client.rpc("save_my_flashcard_card",{
    p_action:"create",p_card_id:null,p_collection_id:first.data.id,p_card_type:"dictionary",
    p_dictionary_word:"hello",p_front_text:"hello",p_back_text:"a greeting",
    p_example_text:"Hello there.",p_translation_text:"你好",p_position:0
  });
  assert.equal(created.error,null);
  const moved=await client.rpc("save_my_flashcard_card",{
    p_action:"move",p_card_id:created.data.id,p_collection_id:second.data.id,p_card_type:null,
    p_dictionary_word:null,p_front_text:null,p_back_text:null,p_example_text:null,p_translation_text:null,p_position:0
  });
  assert.equal(moved.error,null);
  const edited=await client.rpc("save_my_flashcard_card",{
    p_action:"update",p_card_id:created.data.id,p_collection_id:second.data.id,p_card_type:"dictionary",
    p_dictionary_word:"hello",p_front_text:"hello!",p_back_text:"an informal greeting",
    p_example_text:"Hello there.",p_translation_text:"你好",p_position:0
  });
  assert.equal(edited.data.front_text,"hello!");
  const removed=await client.rpc("save_my_flashcard_card",{
    p_action:"delete",p_card_id:created.data.id,p_collection_id:null,p_card_type:null,
    p_dictionary_word:null,p_front_text:null,p_back_text:null,p_example_text:null,p_translation_text:null,p_position:0
  });
  assert.equal(removed.data.deleted,true);
  const renamed=await client.rpc("save_my_flashcard_collection",{p_action:"rename",p_collection_id:second.data.id,p_name:"Renamed"});
  assert.equal(renamed.data.name,"Renamed");
  const deleted=await client.rpc("save_my_flashcard_collection",{p_action:"delete",p_collection_id:first.data.id,p_name:null});
  assert.equal(deleted.data.deleted,true);
});

test("Deleting Flashcard learning history preserves collections, custom cards and today's allowance",async()=>{
  const env=makeContext("feature-update-2-5-0-flashcards.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  const collection=await client.rpc("save_my_flashcard_collection",{p_action:"create",p_collection_id:null,p_name:"Keep this collection"});
  const card=await client.rpc("save_my_flashcard_card",{
    p_action:"create",p_card_id:null,p_collection_id:collection.data.id,p_card_type:"custom",
    p_dictionary_word:null,p_front_text:"Question",p_back_text:"Answer",
    p_example_text:null,p_translation_text:null,p_position:0
  });
  const started=await client.rpc("start_my_flashcard_game",{p_mode:"word",p_difficulty:"beginner"});
  await client.rpc("complete_my_flashcard_game",{
    p_session_id:started.data.session_id,p_results:[{card_key:"custom:"+card.data.id,correct:false,unanswered:true}]
  });
  const before=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(before.data.find(row=>row.activity_type==="flashcard").used_count,1);
  const deleted=await client.rpc("delete_my_learning_history");
  assert.equal(deleted.data.deleted,true);
  const after=await client.rpc("get_my_flashcard_data");
  assert.equal(after.data.history.length,0);
  assert.equal(after.data.mastery.length,0);
  assert.equal(after.data.collections.length,1);
  assert.equal(after.data.cards.length,1);
  assert.equal(after.data.allowance.used_count,1);
  assert.equal(after.data.allowance.remaining,2);
  const usage=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(usage.data.find(row=>row.activity_type==="flashcard").used_count,1);
});

test("Premium Mock User can complete ten Flashcard games but not an eleventh",async()=>{
  const env=makeContext("feature-update-2-5-0-flashcards.swiftdictionary-testing.pages.dev");
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  const client=env.window.supabase.createClient();
  for(let i=0;i<10;i++){
    const started=await client.rpc("start_my_flashcard_game",{p_mode:"mixed",p_difficulty:"advanced"});
    assert.equal(started.error,null);
    const done=await client.rpc("complete_my_flashcard_game",{
      p_session_id:started.data.session_id,p_results:[{card_key:"dict:hello",mode:"mixed",correct:true,unanswered:false}]
    });
    assert.equal(done.error,null);
  }
  const blocked=await client.rpc("start_my_flashcard_game",{p_mode:"mixed",p_difficulty:"advanced"});
  assert.equal(blocked.error.code,"P0001");
});

test("Free mock permanent lesson allowance permits 5 first starts and blocks the 6th",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-a");
  for(let i=1;i<=6;i++){
    const lessonId="free-lesson-"+i;
    const inserted=await client.from("lesson_progress").insert({
      user_id:"mock-user-a",learning_language:"en",difficulty:"beginner",lesson_id:lessonId,status:"in_progress"
    }).select("difficulty,lesson_id,status").single();
    if(i<=5){
      assert.equal(inserted.error,null,"Free first start "+i+" should be allowed");
      const completed=await client.rpc("complete_permanent_lesson",{
        p_difficulty:"beginner",p_lesson_id:lessonId,p_topic_id:"greetings",
        p_correct_count:2,p_question_count:2
      });
      assert.equal(completed.error,null,"Completion must remain allowed after its start was charged");
    }else{
      assert.equal(inserted.error.code,"P0001","Free first start 6 should be blocked");
    }
  }
  const usage=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(usage.data.find(row=>row.activity_type==="lesson").used_count,5);
});

test("Premium mock permanent lesson allowance permits 15 first starts and blocks the 16th",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  for(let i=1;i<=16;i++){
    const lessonId="premium-lesson-"+i;
    const inserted=await client.from("lesson_progress").insert({
      user_id:"mock-user-b",learning_language:"en",difficulty:"beginner",lesson_id:lessonId,status:"in_progress"
    }).select("difficulty,lesson_id,status").single();
    if(i<=15){
      assert.equal(inserted.error,null,"Premium first start "+i+" should be allowed");
      const completed=await client.rpc("complete_permanent_lesson",{
        p_difficulty:"beginner",p_lesson_id:lessonId,p_topic_id:"greetings",
        p_correct_count:2,p_question_count:2
      });
      assert.equal(completed.error,null,"Completing an already-charged lesson "+i+" should be allowed");
      const usage=await client.rpc("get_my_learning_allowance_usage");
      assert.equal(usage.data.find(row=>row.activity_type==="lesson").used_count,i,
        "Completion must not charge the lesson a second time");
    }else{
      assert.equal(inserted.error.code,"P0001","Premium first start 16 should be blocked");
      const missing=await client.from("lesson_progress").select("lesson_id").eq("user_id","mock-user-b").eq("lesson_id",lessonId);
      assert.equal(missing.data.length,0,"Rejected first start must not create lesson progress");
    }
  }
  const usage=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(usage.data.find(row=>row.activity_type==="lesson").used_count,15);
});

test("Free users cannot start a new daily activity after one completion but can review it",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  const first=await client.rpc("start_daily_activity_session",{
    p_activity_type:"daily_application",p_content_id:"application-one",
    p_topic_id:"verb-tenses",p_difficulty:"intermediate",p_source:"daily"
  });
  assert.equal(first.data.status,"in_progress");
  const done=await client.rpc("complete_daily_activity_session",{
    p_session_id:first.data.id,p_correct_count:2,p_question_count:2
  });
  assert.equal(done.data.status,"completed");
  const blocked=await client.rpc("start_daily_activity_session",{
    p_activity_type:"daily_application",p_content_id:"application-two",
    p_topic_id:"verb-tenses",p_difficulty:"intermediate",p_source:"daily"
  });
  assert.equal(blocked.error.code,"P0001");
  const replay=await client.rpc("start_daily_activity_session",{
    p_activity_type:"daily_application",p_content_id:"application-one",
    p_topic_id:"verb-tenses",p_difficulty:"intermediate",p_source:"daily"
  });
  assert.equal(replay.data.status,"completed");
  const usage=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(usage.data.find(row=>row.activity_type==="daily_application").used_count,1);
});

test("daily activity RPCs simulate completion and allowance use without cloud access",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  const started=await client.rpc("start_daily_activity_session",{
    p_activity_type:"daily_topic",p_content_id:"topic-1",p_topic_id:"greetings",p_difficulty:null,p_source:"daily"
  });
  assert.equal(started.data.status,"in_progress");
  const completed=await client.rpc("complete_daily_activity_session",{
    p_session_id:started.data.id,p_correct_count:null,p_question_count:null
  });
  assert.equal(completed.data.status,"completed");
  const usage=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(usage.data.find(row=>row.activity_type==="daily_topic").used_count,1);
  const duplicate=await client.rpc("complete_daily_activity_session",{
    p_session_id:started.data.id,p_correct_count:null,p_question_count:null
  });
  assert.equal(duplicate.data.status,"completed");
  const afterReplay=await client.rpc("get_my_learning_allowance_usage");
  assert.equal(afterReplay.data.find(row=>row.activity_type==="daily_topic").used_count,1);
});

test("production, root Pages and unknown hosts fail closed even with opt-in query",()=>{
  for(const host of [
    "swiftdictionary-testing.pages.dev",
    "whitewingcat.github.io",
    "example.com",
    "another-branch.swiftdictionary-testing.pages.dev",
    "feature-update-2-3-1-bug-fix-and-changes.swiftdictionary-testing.pages.dev",
    "feature-update-2-4-0-quiz-extra.swiftdictionary-testing.pages.dev"
  ]){
    const env=makeContext(host);
    assert.equal(env.window.SWIFT_DICTIONARY_MOCK_MODE,undefined,host);
    assert.equal(env.window.supabase.createClient(),env.originalClient,host);
    assert.equal(env.window.__swiftDictionaryMock,undefined,host);
  }
});

test("preview host without explicit opt-in does not activate mock mode",()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev","");
  assert.equal(env.window.SWIFT_DICTIONARY_MOCK_MODE,undefined);
  assert.equal(env.window.__swiftDictionaryMock,undefined);
});

test("mock Quiz supports Free session resume, answer saving, submission, history and 1/day allowance",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  let availability=await client.rpc("get_my_quiz_availability");
  assert.equal(availability.data.allowance.daily_limit,1);
  assert.equal(availability.data.allowance.remaining_count,1);
  const started=await client.rpc("start_my_quiz",{p_difficulty:"beginner"});
  assert.equal(started.error,null);
  assert.equal(started.data.questions.length,10);
  assert.equal(started.data.questions.filter(question=>question.question_type==="word_definition").length,1);
  assert.ok(started.data.questions.every(question=>question.learning_objective_id),"Every issued question must retain its permanent lesson objective link.");
  const beginnerChineseCount=started.data.questions.filter(question=>question.question_type==="chinese_translation").length;
  assert.ok(beginnerChineseCount>=1&&beginnerChineseCount<=7,"Daily Beginner Chinese mix must be randomized from one to seven");
  assert.ok(started.data.questions.some(question=>question.question_type==="word_definition")||draftBank.questions.some(question=>question.question_type==="word_definition"),"The expanded bank must include word-definition items");
  assert.equal(draftBank.questions.filter(question=>question.question_type==="word_definition").length,15);
  assert.equal(draftBank.questions.filter(question=>question.question_type==="chinese_translation"&&question.source_lesson_id==="b-verb-combinations").length>=10,true);
  const active=await client.rpc("get_my_active_quiz");
  assert.equal(active.data.session_id,started.data.session_id);
  assert.equal(active.data.questions.length,10);
  const first=active.data.questions[0];
  const firstDraft=draftById.get(first.question_id);
  assert.ok(firstDraft,"Mock Quiz must use a real draft-bank question ID");
  assert.equal(first.prompt_learning,firstDraft.prompt_learning);
  assert.equal(first.prompt_translation,firstDraft.prompt_translation);
  assert.equal(first.source_lesson_id,firstDraft.source_lesson_id);
  assert.equal(first.learning_objective_id,firstDraft.learning_objective_id,"Mock Quiz snapshots must retain the mapped permanent lesson objective.");
  assert.equal(first.correct_option_id,undefined,"Answer keys must stay hidden before submission");
  assert.ok(first.options.every(option=>!Object.prototype.hasOwnProperty.call(option,"pinyin")),"Option Pinyin must stay hidden while the Quiz is active");
  assert.deepEqual(Array.from(first.options,option=>option.id).sort(),["a","b","c","d"]);
  const firstCorrectOption=first.options.find(option=>option.id===firstDraft.correct_option_id);
  assert.ok(firstCorrectOption);
  const saved=await client.rpc("save_my_quiz_answer",{
    p_session_id:active.data.session_id,p_question_id:first.question_id,
    p_selected_option_id:firstCorrectOption.id,p_current_position:2
  });
  assert.equal(saved.data.questions[0].selected_option_id,firstCorrectOption.id);
  const blocked=await client.rpc("start_my_quiz",{p_difficulty:"intermediate"});
  assert.equal(blocked.data.status,"active_session_exists");
  for(const question of saved.data.questions){
    if(!question.selected_option_id){
      const draft=draftById.get(question.question_id);
      const correctOption=question.options.find(option=>option.id===draft.correct_option_id);
      const result=await client.rpc("save_my_quiz_answer",{
        p_session_id:active.data.session_id,p_question_id:question.question_id,
        p_selected_option_id:correctOption.id,p_current_position:question.position
      });
      assert.equal(result.error,null);
    }
  }
  const submitted=await client.rpc("submit_my_quiz",{p_session_id:active.data.session_id});
  assert.equal(submitted.error,null);
  assert.equal(submitted.data.status,"completed");
  assert.equal(submitted.data.percentage,100);
  assert.equal(submitted.data.questions[0].correct_option_id,draftById.get(submitted.data.questions[0].question_id).correct_option_id);
  const history=await client.rpc("get_my_quiz_history",{p_limit:20});
  assert.equal(history.data.length,1);
  assert.equal(history.data[0].correct_count,10,"Mock history must return the actual correct-answer count");
  assert.equal(history.data[0].question_count,10);
  const review=await client.rpc("get_my_quiz_review",{p_session_id:active.data.session_id});
  assert.equal(review.data.questions.length,10);
  availability=await client.rpc("get_my_quiz_availability");
  assert.equal(availability.data.allowance.remaining_count,0);
  const exhausted=await client.rpc("start_my_quiz",{p_difficulty:"beginner"});
  assert.equal(exhausted.error.code,"P0001");
});

test("Premium mock Quiz supports abandonment without quota use and three completed sessions/day",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  let availability=await client.rpc("get_my_quiz_availability");
  assert.equal(availability.data.allowance.daily_limit,3);
  const abandoned=await client.rpc("start_my_quiz",{p_difficulty:"advanced"});
  assert.equal(abandoned.data.questions.length,20);
  assert.equal(abandoned.data.questions.filter(question=>question.question_type==="word_definition").length,1);
  const abandonedChineseCount=abandoned.data.questions.filter(question=>question.question_type==="chinese_translation").length;
  assert.ok(abandonedChineseCount>=1&&abandonedChineseCount<=7,"Daily Advanced Chinese mix must be between one and seven");
  assert.deepEqual(
    abandoned.data.questions.reduce((counts,question)=>(counts[question.source_difficulty]=(counts[question.source_difficulty]||0)+1,counts),{}),
    {advanced:12,intermediate:6,beginner:2}
  );
  assert.ok(abandoned.data.questions.every(question=>draftById.has(question.question_id)));
  const activeStart=await client.rpc("start_my_quiz",{p_difficulty:"intermediate"});
  assert.equal(activeStart.data.status,"active_session_exists");
  const abandon=await client.rpc("abandon_my_quiz",{p_session_id:abandoned.data.session_id});
  assert.equal(abandon.data.status,"abandoned");
  availability=await client.rpc("get_my_quiz_availability");
  assert.equal(availability.data.allowance.remaining_count,3);
  const sessionsToCheck=[abandoned.data];
  for(const difficulty of ["intermediate","beginner","advanced"]){
    const started=await client.rpc("start_my_quiz",{p_difficulty:difficulty});
    const session=started.data.session||started.data;
    const selectedChineseCount=session.questions.filter(question=>question.question_type==="chinese_translation").length;
    assert.ok(selectedChineseCount>=1&&selectedChineseCount<=7,"Daily "+difficulty+" Chinese mix must be between one and seven");
    if(difficulty==="advanced") assert.equal(selectedChineseCount,abandonedChineseCount,"The same difficulty must keep its daily mix after abandonment");
    sessionsToCheck.push(session);
    for(const question of session.questions){
      const saved=await client.rpc("save_my_quiz_answer",{
        p_session_id:session.session_id,p_question_id:question.question_id,
        p_selected_option_id:question.options.find(option=>option.id===draftById.get(question.question_id).correct_option_id).id,p_current_position:question.position
      });
      assert.equal(saved.error,null);
    }
    const submitted=await client.rpc("submit_my_quiz",{p_session_id:session.session_id});
    assert.equal(submitted.data.status,"completed");
  }
  const issuedIds=sessionsToCheck.flatMap(session=>session.questions.map(question=>question.question_id));
  assert.equal(new Set(issuedIds).size,issuedIds.length,"Mock Quiz must not reuse a question on the same local day, including abandoned sessions");
  availability=await client.rpc("get_my_quiz_availability");
  assert.equal(availability.data.allowance.remaining_count,0);
  const exhausted=await client.rpc("start_my_quiz",{p_difficulty:"beginner"});
  assert.equal(exhausted.error.code,"P0001");
});

test("learning page introduction dismissals persist per page and mock account",async()=>{
  const env=makeContext("feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  await client.from("learning_page_introduction_preferences").upsert({
    user_id:"mock-user-a",page_key:"quiz",dismissed_at:"2026-11-16T00:00:00.000Z"
  },{onConflict:"user_id,page_key"});
  await client.from("learning_page_introduction_preferences").upsert({
    user_id:"mock-user-a",page_key:"lessons",dismissed_at:"2026-11-16T00:01:00.000Z"
  },{onConflict:"user_id,page_key"});
  let rows=await client.from("learning_page_introduction_preferences")
    .select("page_key").eq("user_id","mock-user-a");
  assert.deepEqual(Array.from(rows.data,row=>row.page_key).sort(),["lessons","quiz"]);
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  rows=await client.from("learning_page_introduction_preferences")
    .select("page_key").eq("user_id","mock-user-b");
  assert.deepEqual(Array.from(rows.data),[]);
  await client.from("learning_page_introduction_preferences").upsert({
    user_id:"mock-user-b",page_key:"flashcards",dismissed_at:"2026-11-16T00:02:00.000Z"
  },{onConflict:"user_id,page_key"});
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-a");
  rows=await client.from("learning_page_introduction_preferences")
    .select("page_key").eq("user_id","mock-user-a");
  assert.deepEqual(Array.from(rows.data,row=>row.page_key).sort(),["lessons","quiz"]);
});


test("Mock Quiz includes Chinese integration only when Chinese is the selected translation",async()=>{
  const env=makeContext("feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  const updated=await client.from("user_preferences").update({translation_language:"en"}).eq("user_id","mock-user-a");
  assert.equal(updated.error,null);
  const started=await client.rpc("start_my_quiz",{p_difficulty:"beginner"});
  assert.equal(started.error,null);
  assert.equal(started.data.translation_language_code,"en");
  assert.equal(started.data.questions.filter(question=>question.question_type==="chinese_translation").length,0);
  assert.equal(started.data.questions.filter(question=>question.question_type==="word_definition").length,1);
});

test("Flash Recall validates distinct choices before creating a server session and resets round state",()=>{
  const start=flashcardsSource.indexOf("  async function startGame(){");
  const end=flashcardsSource.indexOf("\n  function finishGame()",start);
  assert.ok(start>=0&&end>start,"Flashcards must expose a startGame flow");
  const source=flashcardsSource.slice(start,end);
  assert.ok(source.indexOf("makeRound(deck)")<source.indexOf('rpc("start_my_flashcard_game"'),
    "The selected mode must have four distinct choices before a server session is created");
  assert.match(source,/state\.round=null;state\.phase="idle";state\.phaseEnds=0/,
    "A new game must not inherit the previous game's round or phase");
  assert.match(source,/catch\(error\)\{state\.deck=null;throw error;\}/,
    "A preflight failure must clear the temporary deck and leave the allowance untouched");
});

test("Flash Recall filters out targets that cannot produce four distinct choices in every mode",()=>{
  const start=flashcardsSource.indexOf("  function makeRound(deck){");
  const end=flashcardsSource.indexOf("\n  function durationLabel",start);
  assert.ok(start>=0&&end>start,"Flashcards must expose a round builder");
  const source=flashcardsSource.slice(start,end);
  assert.match(source,/const viable=targets\.filter\(target=>/,
    "Each target must be checked before it can be selected");
  assert.match(source,/return d\.size>=3/,
    "Only targets with three distinct distractors may be used");
  assert.match(source,/if\(!pools\.length\)throw new Error/,
    "A deck with no viable target must fail before the game session starts");
  assert.match(source,/const freshPools=pools\.filter\(pool=>pool\.fresh\.length\)/,
    "Mixed Recall must choose a mode that still has unused question targets before repeating a question");
  assert.match(source,/if\(!freshPools\.length\)return null/,
    "The game must stop presenting questions rather than recycle a previously seen target");
  assert.doesNotMatch(source,/usedQuestionKeys\.clear\(\)/,
    "The used-question set must never be reset mid-game when the deck is exhausted");
  assert.match(source,/const chosenPool=freshPools\[Math\.floor\(Math\.random\(\)\*freshPools\.length\)\]/,
    "Gameplay must select only from validated targets that have not already appeared in this challenge");
  assert.match(source,/state\.usedQuestionKeys\.add\(questionKey\(target\)\)/,
    "Each selected question must be recorded to prevent repetition for the entire challenge");
  const showStart=flashcardsSource.indexOf("  function showMemory(){");
  const showEnd=flashcardsSource.indexOf("function showAnswers()",showStart);
  const show=flashcardsSource.slice(showStart,showEnd);
  assert.ok(show.includes("if(!state.round)")&&show.includes('state.phase="exhausted"'),
    "When unique cards are exhausted, gameplay must wait for the challenge timer instead of repeating a question");
});

test("Flash Recall never repeats a target within one challenge, even after exhausting a small deck",()=>{
  const start=flashcardsSource.indexOf("  function makeRound(deck){");
  const end=flashcardsSource.indexOf("  function durationLabel",start);
  assert.ok(start>=0&&end>start,"Flashcards must expose its round builder");
  const roundSource=flashcardsSource.slice(start,end);
  const context=vm.createContext({
    state:{mode:"mixed",weakOnly:false,weakKeys:new Set(),usedQuestionKeys:new Set(),game:{learningLanguage:"en"}},
    course:"en",
    cardKey:card=>"dict:"+String(card.word).toLowerCase(),
    questionKey:card=>String(card.word||card.dictionary_word||card.front_text||"").normalize("NFKC").trim().replace(/\s+/g," ").toLocaleLowerCase(),
    translationFor:card=>card.definitionZh||card.definition,
    uiText:english=>english
  });
  const blankStart=flashcardsSource.indexOf("  function blankAllOccurrences(");
  const blankEnd=flashcardsSource.indexOf("\n  function makeRound",blankStart);
  assert.ok(blankStart>=0&&blankEnd>blankStart,"Flashcards must expose its real sentence-cloze helper");
  context.blankAllOccurrences=vm.runInContext("("+flashcardsSource.slice(blankStart,blankEnd).trim()+")",context);
  assert.equal(context.blankAllOccurrences("I can learn apple and apple today.","apple"),"I can learn _____ and _____ today.");
  assert.equal(context.blankAllOccurrences("我喜欢苹果和苹果。","苹果",true),"我喜欢_____和_____。");
  const makeRound=vm.runInContext("("+roundSource+")",context);
  const deck=["apple","bridge","curious","discover","good morning","station","APPLE","good  morning"].map((word,index)=>({
    word,definition:"English meaning "+index,definitionZh:"中文释义 "+index,
    examples:["I "+word+" every day."]
  }));
  const seen=new Set();
  for(let index=0;index<6;index++){
    const round=makeRound(deck);
    assert.ok(round,"Every available unique target should be used before exhaustion");
    assert.ok(!seen.has(round.target.word),"A target must not repeat during the same challenge");
    seen.add(round.target.word);
  }
  assert.equal(seen.size,6,"Case and repeated whitespace variants must collapse to the same question.");
  assert.equal(makeRound(deck),null,"After all unique targets are used, no repeated question should be returned");
});

test("Flashcards supports Chinese-course banks and resets collection selection after deletion",()=>{
  assert.match(flashcardsSource,/function words\(language=state\.game\?\.learningLanguage\|\|course\)/,
    "Flashcards must select its dictionary bank from the active learning language");
  assert.match(flashcardsSource,/if\(language==="zh"\).*SWIFT_CHINESE_FLASHCARDS/s,
    "Chinese-course users must receive Chinese character, vocabulary and phrase cards");
  const handler=flashcardsSource.slice(flashcardsSource.indexOf('if(action==="delete-collection")'),flashcardsSource.indexOf('if(action==="remove-card")'));
  assert.ok(handler.indexOf('state.collectionId="all"')<handler.indexOf('await collectionAction("delete"'),
    "Deleting the selected collection must reset selection before the reload/render");
});

test("Mock Flashcards supports Chinese recall modes and keeps Mixed Recall English-only",async()=>{
  const env=makeContext("feature-update-2-5-0-flashcards.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  const updated=await client.from("user_preferences").update({learning_language:"zh",translation_language:"en"}).eq("user_id","mock-user-a");
  assert.equal(updated.error,null);
  const started=await client.rpc("start_my_flashcard_game",{p_mode:"sentence",p_difficulty:"beginner",p_duration_seconds:60});
  assert.equal(started.error,null);
  assert.equal(started.data.learning_language_code,"zh");
  assert.equal(started.data.translation_language_code,"en");
  const mixed=await client.rpc("start_my_flashcard_game",{p_mode:"mixed",p_difficulty:"beginner",p_duration_seconds:60});
  assert.equal(mixed.error.code,"22023","Chinese course must use Translation Recall rather than Mixed Recall");
  const abandoned=await client.rpc("abandon_my_flashcard_game",{p_session_id:started.data.session_id});
  assert.equal(abandoned.error,null);
});

test("Flash Recall prevents duplicate starts and locks the screen while saving or abandoning",()=>{
  assert.match(flashcardsSource,/if\(state\.starting\)return/,
    "A second start request must not create another server session");
  assert.match(flashcardsSource,/startButton\.disabled=true/,
    "The start action must be disabled while the session request is pending");
  assert.match(flashcardsSource,/state\.game=null;state\.finishing=true;render\(\)/,
    "The gameplay screen must be replaced while a session is being finalised");
  assert.match(flashcardsSource,/Saving your game/,
    "The learner must see feedback while results are saved");
  assert.match(flashcardsSource,/state\.finishing=false;await loadData\(\)/,
    "The interface must refresh after abandonment or completion");
});

test("Mock Quiz supports Chinese knowledge and English-gated translation banks",()=>{
  assert.match(source,/questions\.zh-en\.draft\.json/);
  assert.match(source,/curriculum-map\.zh\.json/);
  assert.match(source,/question\.question_type==="knowledge"\|\|\(translationLanguageCode==="en"&&question\.question_type==="chinese_translation"\)/);
  assert.match(source,/intermediate:12,beginner:3/);
  assert.match(source,/advanced:12,intermediate:6,beginner:2/);
});


test("Chinese Mixed Recall includes Translation Recall and rejects answer-revealing Chinese cues",()=>{
  const start=flashcardsSource.indexOf("function makeRound(deck){");
  const end=flashcardsSource.indexOf("function durationLabel",start);
  assert.ok(start>=0&&end>start,"Flashcards must expose its round builder");
  const roundSource=flashcardsSource.slice(start,end);
  const context=vm.createContext({
    state:{mode:"mixed",weakOnly:false,weakKeys:new Set(),usedQuestionKeys:new Set(),game:{learningLanguage:"zh",translationLanguage:"en"}},
    course:"zh",translationLanguage:"en",
    cardKey:card=>"dict:zh:"+String(card.word).toLowerCase(),
    questionKey:card=>String(card.word||"").normalize("NFKC").trim().toLowerCase(),
    translationFor:card=>card.translationEn||"",
    uiText:english=>english
  });
  const makeRound=vm.runInContext("("+roundSource+")",context);
  const deck=["苹果","香蕉","橘子","葡萄","西瓜"].map((word,index)=>({
    word,pinyin:"pinyin"+index,translationEn:"English cue "+index,translationZh:"",translationLanguages:["en","zh"],
    definitionCueZh:"中文描述"+index,definitionZh:"中文描述"+index,
    examples:["我喜欢"+word+"。"],availableModes:["translation"]
  }));
  const round=makeRound(deck);
  assert.equal(round.mode,"translation","Chinese Mixed Recall must sample Translation Recall when it is available");
  assert.equal(round.memory,round.target.translationEn,"English-selected Translation Recall must use a direct English equivalent");

  context.state.game.translationLanguage="zh";
  context.state.usedQuestionKeys=new Set();
  context.translationFor=card=>card.translationZh||"";
  const reused=deck.map(card=>({...card,translationZh:card.definitionCueZh,availableModes:["translation"]}));
  assert.throws(()=>makeRound(reused),/does not contain four distinct choices/,
    "Chinese-selected Translation Recall must not reuse a definition cue");

  context.state.mode="definition";
  const leakedDefinition=deck.map(card=>({...card,availableModes:["definition"],definitionCueZh:"这是关于"+card.word+"的说明"}));
  assert.throws(()=>makeRound(leakedDefinition),/does not contain four distinct choices/,
    "Definition Recall must reject a clue that contains its target");

  context.state.mode="translation";
  context.state.game.translationLanguage="zh";
  context.translationFor=card=>card.translationZh||"";
  const leakedTranslation=deck.map(card=>({...card,translationZh:"相关表达"+card.word,translationLanguages:["zh"],availableModes:["translation"]}));
  assert.throws(()=>makeRound(leakedTranslation),/does not contain four distinct choices/,
    "Chinese Translation Recall must reject a cue that contains its target");
  assert.match(flashcardsSource,/chinese\?\["word","definition","translation","sentence"\]:\["word","definition","sentence"\]/);
});
