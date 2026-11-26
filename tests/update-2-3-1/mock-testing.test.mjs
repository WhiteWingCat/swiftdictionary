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
  assert.ok(flashcardsSource.includes("if(isChineseLanguage(language))"),
    "Chinese Flashcards must be selected through the registered language adapter");
  assert.ok(flashcardsSource.includes("const bank=window.SWIFT_CHINESE_FLASHCARDS||{};"),
    "Chinese-course users must resolve the Chinese Flashcards bank");
  for(const cardType of ["characters","vocabulary","phrases"]){
    assert.ok(flashcardsSource.includes('map(bank.'+cardType+',"'+cardType+'")'),
      "Chinese-course users must receive "+cardType+" cards");
  }
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