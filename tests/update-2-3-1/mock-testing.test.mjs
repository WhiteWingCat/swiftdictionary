import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../../mock-testing.js", import.meta.url), "utf8");
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

test("Premium mock permanent lesson allowance permits 15 completions and blocks the 16th",async()=>{
  const env=makeContext("feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev");
  const client=env.window.supabase.createClient();
  env.window.__swiftDictionaryMock.setActiveUser("mock-user-b");
  for(let i=1;i<=16;i++){
    const lessonId="premium-lesson-"+i;
    const inserted=await client.from("lesson_progress").insert({
      user_id:"mock-user-b",difficulty:"beginner",lesson_id:lessonId,status:"in_progress"
    }).select("difficulty,lesson_id,status").single();
    assert.equal(inserted.error,null);
    const completed=await client.rpc("complete_permanent_lesson",{
      p_difficulty:"beginner",p_lesson_id:lessonId,p_topic_id:"greetings",
      p_correct_count:2,p_question_count:2
    });
    if(i<=15) assert.equal(completed.error,null,"Premium completion "+i+" should be allowed");
    else assert.equal(completed.error.code,"P0001","Premium completion 16 should be blocked");
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
  assert.equal(first.correct_option_id,undefined,"Answer keys must stay hidden before submission");
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
  const issuedIds=sessionsToCheck.flatMap(session=>session.questions.map(question=>question.question_id));
  assert.equal(new Set(issuedIds).size,issuedIds.length,"Mock Quiz must not reuse a question on the same local day, including abandoned sessions");
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
});
