/* SwiftDictionary isolated mock testing adapter.
 * Enabled only on the dedicated Cloudflare Pages preview host with ?swiftMock=1.
 * All simulated account data is held in sessionStorage; no Supabase API calls are made.
 */
(function () {
  "use strict";
  const PREVIEW_HOSTS = new Set([
    "feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev",
    "feature-update-2-4-0-quiz.swiftdictionary-testing.pages.dev"
  ]);
  const ACTIVATION_PARAM = "swiftMock";
  const STORAGE_PREFIX = "swiftDictionaryMock:v1:";
  const SELECTION_GENERATION_KEY = STORAGE_PREFIX + "selection-generation";
  const host = String(location.hostname || "").toLowerCase();
  const requested = new URLSearchParams(location.search).get(ACTIVATION_PARAM) === "1";
  if (!requested || !PREVIEW_HOSTS.has(host) || host === "swiftdictionary-testing.pages.dev") return;

  const nativeGet = Storage.prototype.getItem;
  const nativeSet = Storage.prototype.setItem;
  const nativeRemove = Storage.prototype.removeItem;
  const userDefs = [
    { id:"mock-user-a", email:"test-user-a@swiftdictionary.invalid", label:"Test User A", avatar:"🌿", plan:"free" },
    { id:"mock-user-b", email:"test-user-b@swiftdictionary.invalid", label:"Test User B", avatar:"🐈", plan:"premium" }
  ];
  let activeUser = userDefs[0];
  let client = null;
  let authListeners = [];
  let sequence = 0;

  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function now() { return new Date().toISOString(); }
  function planLimits(plan) {
    const premium = plan === "premium";
    const dailyLimit = premium ? 3 : 1;
    const lessonLimit = premium ? 15 : 5;
    return [
      ["lesson",lessonLimit],["daily_topic",dailyLimit],["daily_application",dailyLimit],
      ["daily_discovery",dailyLimit],["daily_revision",dailyLimit],["quiz",dailyLimit],["flashcard",5]
    ].map(([activity_type,daily_limit]) => ({plan_code:premium?"premium":"free",activity_type,daily_limit,is_enabled:true}));
  }
  function key(userId) { return STORAGE_PREFIX + userId; }
  function emptyState(user) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const limits = planLimits(user.plan || "free");
    return {
      profiles:[{user_id:user.id,display_name:user.label,avatar_icon:user.avatar}],
      user_preferences:[{user_id:user.id,learning_language:"en",translation_language:"zh",timezone,allowance_timezone:timezone,allowance_timezone_until:null,daily_topic_enabled:true,daily_application_enabled:true,daily_discovery_enabled:true,daily_revision_enabled:true}],
      user_entitlements:[{user_id:user.id,plan_code:user.plan || "free",status:"active",valid_from:null,valid_until:null}],
      learning_plan_limits:limits,
      saved_words:user.id === "mock-user-a"
        ? [{user_id:user.id,course:"en",word:"hello"},{user_id:user.id,course:"zh",word:"你"}]
        : [{user_id:user.id,course:"en",word:"thank"},{user_id:user.id,course:"zh",word:"好"}],
      lesson_progress:[],
      learning_activity_log:[],
      lesson_practice_results:[],
      daily_activity_sessions:[],
      learning_page_introduction_preferences:[],
      quiz_sessions:[]
    };
  }
  function loadState(user) {
    try {
      const raw = nativeGet.call(sessionStorage,key(user.id));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.tables) {
          // Keep the mock entitlement fixture aligned with the fixed Test User A/B plan assignment.
          parsed.tables.user_entitlements = [{user_id:user.id,plan_code:user.plan || "free",status:"active",valid_from:null,valid_until:null}];
          parsed.tables.learning_plan_limits = planLimits(user.plan || "free");
          return parsed;
        }
      }
    } catch (error) {
      console.warn("[SwiftDictionary mock] Could not read session data; using fresh fixtures.",error);
    }
    return {tables:emptyState(user)};
  }
  function saveState(user,state) {
    try { nativeSet.call(sessionStorage,key(user.id),JSON.stringify(state)); }
    catch (error) { console.error("[SwiftDictionary mock] Session storage write failed.",error); }
  }
  function state() { return loadState(activeUser); }
  function persist(next) { saveState(activeUser,next); }
  function error(message,code) { return {message,code:code || "MOCK_UNSUPPORTED"}; }
  function emit(event) {
    const session = activeUser ? {user:{id:activeUser.id,email:activeUser.email,user_metadata:{display_name:activeUser.label}}} : null;
    authListeners.slice().forEach(callback => {
      try { callback(event,session); } catch (err) { console.error("[SwiftDictionary mock] Auth listener failed.",err); }
    });
  }
  function setActiveUser(id) {
    activeUser = userDefs.find(user => user.id === id) || userDefs[0];
    loadState(activeUser);
    emit("SIGNED_IN");
    renderPanel();
  }

  // Keep the application's legacy local-favourites key away from real localStorage.
  // The mock database adapter is the only source of saved-word state while active.
  Storage.prototype.getItem = function (name) {
    if (this === localStorage && name === "swiftdictionary-saved") return null;
    if (this === localStorage && name === "swiftdictionary-avatar") {
      try { return nativeGet.call(sessionStorage,STORAGE_PREFIX + activeUser.id + ":avatar"); } catch (_) { return null; }
    }
    return nativeGet.call(this,name);
  };
  Storage.prototype.setItem = function (name,value) {
    if (this === localStorage && name === "swiftdictionary-saved") return;
    if (this === localStorage && name === "swiftdictionary-avatar") {
      try { nativeSet.call(sessionStorage,STORAGE_PREFIX + activeUser.id + ":avatar",String(value)); } catch (_) {}
      return;
    }
    return nativeSet.call(this,name,value);
  };
  Storage.prototype.removeItem = function (name) {
    if (this === localStorage && name === "swiftdictionary-saved") return;
    if (this === localStorage && name === "swiftdictionary-avatar") {
      try { nativeRemove.call(sessionStorage,STORAGE_PREFIX + activeUser.id + ":avatar"); } catch (_) {}
      return;
    }
    return nativeRemove.call(this,name);
  };

  const supportedTables = new Set([
    "profiles","user_preferences","user_entitlements","learning_plan_limits","saved_words",
    "lesson_progress","learning_activity_log","lesson_practice_results","daily_activity_sessions",
    "learning_page_introduction_preferences"
  ]);
  class MockQuery {
    constructor(table) {
      this.table=table; this.operation="select"; this.values=null; this.filters=[]; this.sorts=[]; this.max=null;
      this.returning=false; this.countMode=null; this.cardinality="many"; this.conflict=null; this.ignoreDuplicates=false;
      this.unsupported=null;
    }
    select(_columns,options) { this.returning = this.operation !== "select"; if (options && options.count) this.countMode=options.count; return this; }
    insert(values) { this.operation="insert"; this.values=values; return this; }
    upsert(values,options) { this.operation="upsert"; this.values=values; this.conflict=options?.onConflict || null; this.ignoreDuplicates=!!options?.ignoreDuplicates; return this; }
    update(values) { this.operation="update"; this.values=values; return this; }
    delete() { this.operation="delete"; return this; }
    eq(column,value) { this.filters.push(row => row[column] === value); return this; }
    neq(column,value) { this.filters.push(row => row[column] !== value); return this; }
    in(column,values) { this.filters.push(row => values.includes(row[column])); return this; }
    order(column,options) { this.sorts.push({column,ascending:options?.ascending !== false}); return this; }
    limit(value) { this.max=Math.max(0,Number(value)||0); return this; }
    single() { this.cardinality="one"; return this; }
    maybeSingle() { this.cardinality="maybe"; return this; }
    then(resolve,reject) { return this.execute().then(resolve,reject); }
    async execute() {
      if (!supportedTables.has(this.table)) return {data:null,error:error("Mock adapter does not support table: "+this.table)};
      const db=state(), rows=db.tables[this.table] || (db.tables[this.table]=[]);
      let selected=rows.filter(row=>this.filters.every(test=>test(row)));
      if (this.operation==="select") {
        selected=selected.map(clone);
        for (const sort of this.sorts) selected.sort((a,b)=> {
          const av=a[sort.column] || "", bv=b[sort.column] || "";
          return (av<bv?-1:av>bv?1:0)*(sort.ascending?1:-1);
        });
        if (this.max!==null) selected=selected.slice(0,this.max);
        return this.resultShape(selected,db);
      }
      let changed=[];
      if (this.operation==="insert") {
        const values=Array.isArray(this.values)?this.values:[this.values];
        changed=values.map(value=>({...clone(value),created_at:value.created_at || now()}));
        rows.push(...changed);
      } else if (this.operation==="upsert") {
        const values=Array.isArray(this.values)?this.values:[this.values];
        for (const value of values) {
          const keys=this.conflict ? this.conflict.split(",") : Object.keys(value).filter(k=>["user_id","course","word","difficulty","lesson_id","activity_type"].includes(k));
          const existing=rows.find(row=>keys.every(k=>row[k]===value[k]));
          if (existing) { if (!this.ignoreDuplicates) Object.assign(existing,clone(value)); changed.push(existing); }
          else { const added=clone(value); rows.push(added); changed.push(added); }
        }
      } else if (this.operation==="update") {
        changed=selected;
        changed.forEach(row=>Object.assign(row,clone(this.values)));
      } else if (this.operation==="delete") {
        changed=selected.slice();
        db.tables[this.table]=rows.filter(row=>!selected.includes(row));
      } else return {data:null,error:error("Unsupported mock table operation: "+this.operation)};
      persist(db);
      return this.resultShape(this.returning?changed.map(clone):[],db);
    }
    resultShape(rows,db) {
      let data=rows;
      if (this.cardinality==="one") {
        if (rows.length!==1) return {data:null,error:error("Expected one mock row, received "+rows.length,"PGRST116")};
        data=rows[0];
      } else if (this.cardinality==="maybe") {
        if (rows.length>1) return {data:null,error:error("Expected at most one mock row.","PGRST116")};
        data=rows[0] || null;
      }
      return {data,error:null,...(this.countMode?{count:rows.length}:{})};
    }
  }

  function dateInZone(value,timezone) {
    try { return new Intl.DateTimeFormat("en-CA",{timeZone:timezone||"UTC",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(value)); }
    catch (_) { return new Date(value).toISOString().slice(0,10); }
  }
  function today(timezone) { return dateInZone(Date.now(),timezone); }
  function dailyRows(db,type) {
    const pref=db.tables.user_preferences?.[0] || {};
    const timezone=pref.allowance_timezone || pref.timezone || "UTC";
    const day=today(timezone);
    return (db.tables.daily_activity_sessions || []).filter(row=>row.activity_type===type && row.status==="completed" && row.completed_at && dateInZone(row.completed_at,timezone)===day);
  }
  function usageRows(db) {
    const types=["lesson","daily_topic","daily_application","daily_discovery","daily_revision","quiz","flashcard"];
    return types.map(activity_type=>({
      activity_type,
      used_count:activity_type==="lesson"
        ? (db.tables.learning_activity_log||[]).filter(row=>row.activity_type==="lesson" && row.event_type==="completed" && row.created_at && dateInZone(row.created_at,db.tables.user_preferences?.[0]?.timezone)===today(db.tables.user_preferences?.[0]?.timezone)).length
        : activity_type==="quiz"
          ? (db.tables.quiz_sessions||[]).filter(row=>row.status==="completed" && row.completed_at && dateInZone(row.completed_at,db.tables.user_preferences?.[0]?.timezone)===today(db.tables.user_preferences?.[0]?.timezone)).length
          : dailyRows(db,activity_type).length
    }));
  }
  let quizDraftBankPromise=null;
  async function loadQuizDraftBank() {
    if(!quizDraftBankPromise) {
      quizDraftBankPromise=(async()=>{
        const [bankResponse,mapResponse]=await Promise.all([
          fetch("/content/quiz/questions.en-zh.draft.json",{cache:"no-store"}),
          fetch("/content/quiz/curriculum-map.en.json",{cache:"no-store"})
        ]);
        if(!bankResponse.ok||!mapResponse.ok) throw new Error("The draft Quiz question bank could not be loaded in Mock Test Mode.");
        const [bank,curriculum]=await Promise.all([bankResponse.json(),mapResponse.json()]);
        if(bank.status!=="draft") throw new Error("Mock Quiz may load only content explicitly marked as draft.");
        if(!Array.isArray(bank.questions)||bank.questions.length!==114) throw new Error("The draft Quiz bank must contain exactly 114 questions.");
        const mapped=bank.questions.map(question=>{
          const source=curriculum[question.source_lesson_id];
          if(!source||!["beginner","intermediate","advanced"].includes(source.difficulty)) throw new Error("A draft Quiz question has no valid curriculum mapping: "+question.question_id);
          if(!question.question_id||!question.prompt_learning||!question.prompt_translation||!Array.isArray(question.options)||question.options.length!==4) throw new Error("A draft Quiz question is incomplete: "+question.question_id);
          if(new Set(question.options.map(option=>option.id)).size!==4) throw new Error("A draft Quiz question contains duplicate option IDs: "+question.question_id);
          if(!question.options.some(option=>option.id===question.correct_option_id)) throw new Error("A draft Quiz answer key is invalid: "+question.question_id);
          if(!question.explanation_learning||!question.explanation_translation) throw new Error("A draft Quiz explanation is incomplete: "+question.question_id);
          if(question.options.some(option=>!option.id||!option.learning_text||!option.translation_text)) throw new Error("A draft Quiz option is incomplete: "+question.question_id);
          return {...question,topic_id:source.topic_id,source_difficulty:source.difficulty};
        });
        const counts=mapped.reduce((result,question)=>(result[question.source_difficulty]++,result),{beginner:0,intermediate:0,advanced:0});
        if(counts.beginner!==30||counts.intermediate!==36||counts.advanced!==48) throw new Error("The draft Quiz bank difficulty totals do not match the expected 30/36/48 distribution.");
        return {questions:mapped,counts};
      })().catch(error=>{quizDraftBankPromise=null;throw error;});
    }
    return quizDraftBankPromise;
  }
  function shuffled(items) {
    const result=items.slice();
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  async function quizMockQuestions(sessionId,difficulty) {
    const bank=await loadQuizDraftBank();
    const composition=difficulty==="beginner"
      ? {beginner:10}
      : difficulty==="intermediate"
        ? {intermediate:12,beginner:3}
        : {advanced:12,intermediate:6,beginner:2};
    const selected=[];
    for(const [level,amount] of Object.entries(composition)) {
      const pool=bank.questions.filter(question=>question.source_difficulty===level);
      if(pool.length<amount) throw new Error("Not enough draft Quiz questions for "+level+" difficulty.");
      selected.push(...shuffled(pool).slice(0,amount));
    }
    return shuffled(selected).map((question,index)=>{
      const options=shuffled(question.options).map(option=>({
        id:option.id,learning_text:option.learning_text,translation_text:option.translation_text
      }));
      return {
        question_id:question.question_id,source_lesson_id:question.source_lesson_id,
        topic_id:question.topic_id,source_difficulty:question.source_difficulty,position:index+1,
        prompt_learning:question.prompt_learning,prompt_translation:question.prompt_translation,
        options,selected_option_id:null,correct_option_id:question.correct_option_id,
        explanation_learning:question.explanation_learning,explanation_translation:question.explanation_translation
      };
    });
  }
  function quizMockPayload(session,includeReview=false) {
    if(!session)return null;
    return {
      session_id:session.session_id,difficulty:session.difficulty,status:session.status,
      question_count:session.question_count,current_position:session.current_position,
      learning_language_code:"en",translation_language_code:"zh",
      source_composition:session.source_composition,started_at:session.started_at,
      completed_at:session.completed_at||null,correct_count:session.correct_count??null,
      percentage:session.percentage??null,
      questions:clone(session.questions).map(question=>{
        const item={...question};
        if(!includeReview){
          delete item.correct_option_id;delete item.explanation_learning;delete item.explanation_translation;
        } else {
          item.is_correct=item.selected_option_id===item.correct_option_id;
        }
        return item;
      })
    };
  }
  function quizMockAvailability(db,user,bankCounts) {
    const pref=db.tables.user_preferences?.[0]||{},timezone=pref.allowance_timezone||pref.timezone||"UTC";
    const day=today(timezone),plan=(db.tables.user_entitlements||[]).find(row=>row.user_id===user.id)?.plan_code||"free";
    const limit=(db.tables.learning_plan_limits||[]).find(row=>row.plan_code===plan&&row.activity_type==="quiz")?.daily_limit??(plan==="premium"?3:1);
    const sessions=db.tables.quiz_sessions||[];
    const used=sessions.filter(row=>row.status==="completed"&&row.completed_at&&dateInZone(row.completed_at,timezone)===day).length;
    const active=sessions.find(row=>row.status==="in_progress")||null;
    const remaining=Math.max(0,limit-used);
    const difficulties=["beginner","intermediate","advanced"].map(difficulty=>({
      difficulty,question_count:difficulty==="beginner"?10:difficulty==="intermediate"?15:20,
      // Counts describe draft availability only; they do not imply editorial approval.
      bank_minimum_met:true,bank_target_met:false,bank_counts:bankCounts||{},remaining_counts:bankCounts||{},
      available:!active&&remaining>0,
      reason:active?"active_session_exists":remaining<=0?"allowance_exhausted":"draft_content_mock_only"
    }));
    return {mock_simulation:true,timezone,local_date:day,plan_code:plan,
      allowance:{daily_limit:limit,used_count:used,remaining_count:remaining},
      active_session_id:active?.session_id||null,difficulties};
  }
  async function mockRpc(name,args) {
    const db=state(), tables=db.tables, user=activeUser;
    if (name==="get_my_quiz_availability") {
      const bank=await loadQuizDraftBank();
      return {data:quizMockAvailability(db,user,bank.counts),error:null};
    }
    if (name==="get_my_active_quiz") {
      const active=(tables.quiz_sessions||[]).find(row=>row.status==="in_progress");
      return {data:quizMockPayload(active),error:null};
    }
    if (name==="start_my_quiz") {
      const active=(tables.quiz_sessions||[]).find(row=>row.status==="in_progress");
      if(active)return {data:{status:"active_session_exists",session:quizMockPayload(active)},error:null};
      const availability=quizMockAvailability(db,user);
      if(availability.allowance.remaining_count<1)return {data:null,error:error("Daily Quiz completion allowance exhausted.","P0001")};
      const difficulty=args.p_difficulty;
      if(!["beginner","intermediate","advanced"].includes(difficulty))return {data:null,error:error("Invalid Quiz difficulty.","22023")};
      const count=difficulty==="beginner"?10:difficulty==="intermediate"?15:20;
      const sessionId="mock-quiz-session-"+(++sequence);
      const questions=await quizMockQuestions(sessionId,difficulty);
      const session={session_id:sessionId,user_id:user.id,difficulty,status:"in_progress",question_count:count,current_position:1,source_composition:difficulty==="advanced"?"advanced:12, intermediate:6, beginner:2":difficulty==="intermediate"?"intermediate:12, beginner:3":"beginner:10",started_at:now(),completed_at:null,questions};
      (tables.quiz_sessions||=[]).push(session);persist(db);
      return {data:quizMockPayload(session),error:null};
    }
    if (name==="save_my_quiz_answer") {
      const session=(tables.quiz_sessions||[]).find(row=>row.session_id===args.p_session_id&&row.user_id===user.id);
      if(!session||session.status!=="in_progress")return {data:null,error:error("Unfinished mock Quiz session not found.")};
      const question=session.questions.find(row=>row.question_id===args.p_question_id);
      if(!question)return {data:null,error:error("Mock Quiz question not found.")};
      if(args.p_selected_option_id!==null&&!question.options.some(option=>option.id===args.p_selected_option_id))return {data:null,error:error("Invalid mock answer option.")};
      question.selected_option_id=args.p_selected_option_id??null;
      session.current_position=args.p_current_position;
      persist(db);return {data:quizMockPayload(session),error:null};
    }
    if (name==="submit_my_quiz") {
      const session=(tables.quiz_sessions||[]).find(row=>row.session_id===args.p_session_id&&row.user_id===user.id);
      if(!session||session.status!=="in_progress")return {data:null,error:error("Unfinished mock Quiz session not found.")};
      if(session.questions.some(question=>!question.selected_option_id))return {data:null,error:error("Answer all mock Quiz questions before submitting.")};
      const correct=session.questions.filter(question=>question.selected_option_id===question.correct_option_id).length;
      Object.assign(session,{status:"completed",completed_at:now(),correct_count:correct,percentage:Math.round(correct/session.question_count*100)});
      persist(db);return {data:quizMockPayload(session,true),error:null};
    }
    if (name==="abandon_my_quiz") {
      const session=(tables.quiz_sessions||[]).find(row=>row.session_id===args.p_session_id&&row.user_id===user.id);
      if(!session||session.status!=="in_progress")return {data:null,error:error("Unfinished mock Quiz session not found.")};
      Object.assign(session,{status:"abandoned",abandoned_at:now()});persist(db);
      return {data:quizMockPayload(session),error:null};
    }
    if (name==="get_my_quiz_history") {
      const rows=(tables.quiz_sessions||[]).filter(row=>row.status==="completed").sort((a,b)=>String(b.completed_at).localeCompare(String(a.completed_at))).slice(0,Math.max(0,Number(args.p_limit)||20));
      return {data:rows.map(row=>({session_id:row.session_id,difficulty:row.difficulty,question_count:row.question_count,correct_count:row.correct_count,percentage:row.percentage,completed_at:row.completed_at})),error:null};
    }
    if (name==="get_my_quiz_review") {
      const session=(tables.quiz_sessions||[]).find(row=>row.session_id===args.p_session_id&&row.status==="completed");
      return session?{data:quizMockPayload(session,true),error:null}:{data:null,error:error("Completed mock Quiz review not found.")};
    }
    if (name==="get_my_learning_allowance_usage") return {data:usageRows(db),error:null};
    if (name==="is_personal_learning_test_access") return {data:false,error:null};
    if (name==="record_completed_lesson_practice_result") {
      const duplicate=(tables.lesson_practice_results||[]).some(row=>row.lesson_id===args.p_lesson_id && row.difficulty===args.p_difficulty);
      if (!duplicate) (tables.lesson_practice_results ||= []).push({
        user_id:user.id,difficulty:args.p_difficulty,lesson_id:args.p_lesson_id,topic_id:args.p_topic_id,
        correct_count:args.p_correct_count,question_count:args.p_question_count,attempted_at:now()
      });
      persist(db); return {data:!duplicate,error:null};
    }
    if (name==="complete_permanent_lesson") {
      const plan=(tables.user_entitlements||[]).find(row=>row.user_id===user.id)?.plan_code || "free";
      const lessonLimit=(tables.learning_plan_limits||[]).find(item=>item.plan_code===plan && item.activity_type==="lesson")?.daily_limit ?? 5;
      const used=usageRows(db).find(row=>row.activity_type==="lesson")?.used_count || 0;
      if (used>=lessonLimit) return {data:null,error:error("Daily learning completion limit reached.","P0001")};
      const row=(tables.lesson_progress||[]).find(item=>item.difficulty===args.p_difficulty && item.lesson_id===args.p_lesson_id);
      if (!row) return {data:null,error:error("Mock lesson progress row was not found.")};
      Object.assign(row,{status:"completed",completed_at:now(),updated_at:now()});
      (tables.learning_activity_log ||= []).push({user_id:user.id,activity_type:"lesson",event_type:"completed",language_code:"en",created_at:now()});
      (tables.lesson_practice_results ||= []).push({user_id:user.id,difficulty:args.p_difficulty,lesson_id:args.p_lesson_id,topic_id:args.p_topic_id,correct_count:args.p_correct_count,question_count:args.p_question_count,attempted_at:now()});
      persist(db); return {data:clone(row),error:null};
    }
    if (name==="start_daily_activity_session") {
      const completed=(tables.daily_activity_sessions||[]).find(row=>row.activity_type===args.p_activity_type && row.content_id===args.p_content_id && row.status==="completed");
      if (completed) return {data:clone(completed),error:null};
      const existing=(tables.daily_activity_sessions||[]).find(row=>row.activity_type===args.p_activity_type && row.status==="in_progress");
      if (existing) return {data:clone(existing),error:null};
      const plan=(tables.user_entitlements||[]).find(item=>item.user_id===user.id)?.plan_code || "free";
      const limit=(tables.learning_plan_limits||[]).find(item=>item.plan_code===plan && item.activity_type===args.p_activity_type);
      const used=usageRows(db).find(item=>item.activity_type===args.p_activity_type)?.used_count || 0;
      if (!limit?.is_enabled || used >= (limit?.daily_limit ?? 1)) return {data:null,error:error("Daily learning completion limit reached.","P0001")};
      const row={id:"mock-session-"+(++sequence),user_id:user.id,activity_type:args.p_activity_type,content_id:args.p_content_id,topic_id:args.p_topic_id,difficulty:args.p_difficulty,source:args.p_source,status:"in_progress",started_at:now(),completed_at:null};
      (tables.daily_activity_sessions ||= []).push(row); persist(db); return {data:clone(row),error:null};
    }
    if (name==="abandon_daily_activity_session") {
      const row=(tables.daily_activity_sessions||[]).find(item=>item.id===args.p_session_id);
      if (!row) return {data:null,error:error("Mock session not found.")};
      if (row.status==="in_progress") row.status="abandoned";
      persist(db); return {data:clone(row),error:null};
    }
    if (name==="complete_daily_activity_session") {
      const row=(tables.daily_activity_sessions||[]).find(item=>item.id===args.p_session_id);
      if (!row) return {data:null,error:error("Mock session not found.")};
      if (row.status==="completed") return {data:clone(row),error:null};
      const plan=(tables.user_entitlements||[]).find(item=>item.user_id===user.id)?.plan_code || "free";
      const limit=(tables.learning_plan_limits||[]).find(item=>item.plan_code===plan && item.activity_type===row.activity_type);
      if (dailyRows(db,row.activity_type).length >= (limit?.daily_limit ?? 1)) return {data:null,error:error("Daily activity allowance exhausted.","P0001")};
      Object.assign(row,{status:"completed",completed_at:now(),correct_count:args.p_correct_count,question_count:args.p_question_count});
      (tables.learning_activity_log ||= []).push({user_id:user.id,activity_type:row.activity_type,event_type:"completed",language_code:"en",created_at:now()});
      persist(db); return {data:clone(row),error:null};
    }
    if (name==="delete_my_learning_history") {
      tables.lesson_progress=[]; tables.learning_activity_log=[]; tables.lesson_practice_results=[]; tables.daily_activity_sessions=[];
      persist(db); return {data:{deleted:true},error:null};
    }
    return {data:null,error:error("Mock RPC is not implemented: "+name)};
  }

  const auth = {
    async getSession() { return {data:{session:activeUser?{user:{id:activeUser.id,email:activeUser.email,user_metadata:{display_name:activeUser.label}}}:null},error:null}; },
    onAuthStateChange(callback) { authListeners.push(callback); return {data:{subscription:{unsubscribe(){authListeners=authListeners.filter(item=>item!==callback);}}}}; },
    async signOut() { activeUser=null; emit("SIGNED_OUT"); renderPanel(); return {error:null}; },
    async signInWithOAuth() { return {data:null,error:error("Google sign-in is disabled in MOCK TEST MODE. Use the separate mock-user panel.")}; }
  };
  const adapter = {
    auth,
    from(table) { return new MockQuery(table); },
    async rpc(name,args={}) { try { return await mockRpc(name,args); } catch (err) { return {data:null,error:error(err.message || "Mock RPC failed.")}; } },
    storage: { from() { return {upload:async()=>({data:null,error:error("Storage is not supported in mock mode.")}),download:async()=>({data:null,error:error("Storage is not supported in mock mode.")})}; } }
  };
  if (!window.supabase || typeof window.supabase.createClient!=="function") return;
  const originalCreateClient=window.supabase.createClient.bind(window.supabase);
  window.supabase.createClient=function(){ client=adapter; return client; };
  window.SWIFT_DICTIONARY_MOCK_MODE=true;
  window.SWIFT_DICTIONARY_MOCK_CAPABILITIES={auth:false,rls:false,database:false,crossDeviceSync:false,frontendSimulation:true};
  function selectionGeneration() {
    const value=Number(nativeGet.call(sessionStorage,SELECTION_GENERATION_KEY));
    return Number.isSafeInteger(value) && value>=0 ? value : 0;
  }
  function resetMockStore() {
    try {
      // Change the content-selection generation before clearing both mock identities.
      // This makes reset visibly generate a fresh personalised daily set.
      nativeSet.call(sessionStorage,SELECTION_GENERATION_KEY,String(selectionGeneration()+1));
      for(let i=sessionStorage.length-1;i>=0;i--){
        const k=sessionStorage.key(i);
        if(k && k.startsWith(STORAGE_PREFIX) && k!==SELECTION_GENERATION_KEY) nativeRemove.call(sessionStorage,k);
      }
    } catch(error) { console.error("[SwiftDictionary mock] Reset failed.",error); }
  }
  // Deliberately exposed only while the preview-only mock adapter is active.
  // This small surface also lets local unit tests verify identity isolation.
  window.__swiftDictionaryMock = Object.freeze({
    setActiveUser,
    activeUser:()=>activeUser?.id || null,
    reset:resetMockStore,
    selectionGeneration,
    getClient:()=>client
  });

  function renderPanel() {
    if (!document || typeof document.getElementById !== "function") return;
    let panel=document.getElementById("swiftMockPanel");
    if (!panel) return;
    const select=panel.querySelector("select");
    if (select) select.value=activeUser?.id || "";
    const identity=panel.querySelector("[data-mock-identity]");
    if (identity) identity.textContent=activeUser ? activeUser.label+" · "+(activeUser.plan||"free").toUpperCase()+" · "+activeUser.email : "Signed out in mock mode";
  }
  function installPanel() {
    if (document.getElementById("swiftMockPanel")) return;
    const panel=document.createElement("aside");
    panel.id="swiftMockPanel";
    panel.setAttribute("aria-label","Mock testing controls");
    panel.innerHTML='<style>#swiftMockPanel{position:fixed;z-index:10000;right:14px;bottom:14px;width:min(340px,calc(100vw - 28px));padding:14px;border:2px solid #e2a94b;border-radius:12px;background:#171d25;color:#fff;box-shadow:0 8px 30px #0008;font:14px/1.4 system-ui,sans-serif}#swiftMockPanel strong{display:block;color:#ffd27a;font-size:13px;letter-spacing:.04em}#swiftMockPanel p{margin:6px 0 10px}#swiftMockPanel select,#swiftMockPanel button{font:inherit;border-radius:7px;padding:8px;border:1px solid #718096}#swiftMockPanel select{width:100%;background:#fff;color:#111;margin:5px 0 8px}#swiftMockPanel .mock-actions{display:flex;gap:7px;flex-wrap:wrap}#swiftMockPanel button{background:#293747;color:#fff;cursor:pointer}#swiftMockPanel button:hover{background:#3a4c60}#swiftMockPanel small{display:block;margin-top:8px;color:#c4cbd4}</style><strong>MOCK TEST MODE — NO REAL ACCOUNT / NO CLOUD SYNC</strong><p data-mock-identity></p><label for="swiftMockUser">Switch simulated user</label><select id="swiftMockUser"><option value="mock-user-a">Test User A — Free</option><option value="mock-user-b">Test User B — Premium</option></select><div class="mock-actions"><button type="button" data-mock-reset>Reset mock data</button><button type="button" data-mock-exit>Exit mock mode</button></div><small>Fictional session-only data. Google sign-in and real Supabase services are disabled.</small>';
    document.body.appendChild(panel);
    panel.querySelector("select").addEventListener("change",event=>setActiveUser(event.target.value));
    panel.querySelector("[data-mock-reset]").addEventListener("click",()=>{
      resetMockStore();
      location.reload();
    });
    panel.querySelector("[data-mock-exit]").addEventListener("click",()=>{
      const url=new URL(location.href);url.searchParams.delete(ACTIVATION_PARAM);location.replace(url.toString());
    });
    renderPanel();
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",installPanel,{once:true});
  else installPanel();
  console.info("[SwiftDictionary] Isolated mock mode active. Supabase client creation is intercepted.");
})();