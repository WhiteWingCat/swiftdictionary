/* SwiftDictionary Update 2.5.0 — Flashcards UI and Flash Recall runtime. */
(() => {
  "use strict";
  const root = document.getElementById("flashcardsPage");
  if (!root) return;
  const $ = (selector, scope=root) => scope.querySelector(selector);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const timing = {
    beginner:{memory:5,answer:12,memoryFloor:2,answerFloor:5,memoryStep:.5,answerStep:1},
    intermediate:{memory:3,answer:9,memoryFloor:1.5,answerFloor:4,memoryStep:1.5,answerStep:4},
    advanced:{memory:2,answer:6,memoryFloor:.7,answerFloor:3,memoryStep:.7,answerStep:3}
  };
  const state = {
    ready:false,loading:false,data:{collections:[],cards:[],mastery:[],history:[]},
    collectionId:"all",mode:"word",difficulty:"beginner",game:null,gameTimer:null,phaseTimer:null,
    phase:"idle",round:null,roundIndex:0,results:[],memory:5,answer:12,phaseEnds:0,
    selectedWord:null,notice:"",saving:false,weakOnly:false,weakKeys:new Set()
  };
  function words(){return (window.englishWords || (typeof englishWords!=="undefined"?englishWords:[])).filter(w=>w&&w.course==="en"&&w.word&&w.definition);}
  function selectedCollection(){return state.data.collections.find(c=>c.id===state.collectionId);}
  function cardsForCollection(){
    const cards=state.data.cards||[];
    return state.collectionId==="all"?cards:cards.filter(c=>c.collection_id===state.collectionId);
  }
  function masteryMap(){return new Map((state.data.mastery||[]).map(m=>[m.card_key,m]));}
  function cardKey(card){return card.card_type==="dictionary"?"dict:"+card.dictionary_word.toLowerCase():"custom:"+card.id;}
  function collectionName(id){return state.data.collections.find(c=>c.id===id)?.name||"Collection";}
  function translationFor(word){const language=state.game?.translationLanguage||translationLanguage;return language==="zh"?(word.definitionZh||word.definition):word.definition;}
  function dictionaryCard(word){
    return {card_type:"dictionary",dictionary_word:word.word,front_text:word.word,back_text:word.definition,
      example_text:(word.examples||[])[0]||"",translation_text:translationFor(word),position:0};
  }
  function style(){
    if($("#flashcardsStyles"))return;
    const node=document.createElement("style");node.id="flashcardsStyles";
    node.textContent=`
      #flashcardsPage .flash-home{display:grid;gap:20px}
      #flashcardsPage .flash-section{border:1px solid var(--border);background:var(--panel);border-radius:16px;padding:20px}
      #flashcardsPage .flash-section h2{margin:0 0 6px}
      #flashcardsPage .flash-muted{color:var(--muted);font-size:.9rem}
      #flashcardsPage .flash-mode-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px 0}
      #flashcardsPage .flash-mode,#flashcardsPage .flash-collection{border:1px solid var(--border);border-radius:12px;background:var(--panel-hover);color:var(--text);padding:13px;text-align:left}
      #flashcardsPage .flash-mode[aria-pressed=true],#flashcardsPage .flash-collection[aria-pressed=true]{border-color:var(--accent);background:var(--accent-bg)}
      #flashcardsPage .flash-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:14px}
      #flashcardsPage .flash-controls select,#flashcardsPage .flash-form input,#flashcardsPage .flash-form textarea{background:#11151d;color:var(--text);border:1px solid var(--border);border-radius:9px;padding:10px}
      #flashcardsPage .flash-primary{border:1px solid #718ac7;background:#34446b;color:white;border-radius:10px;padding:11px 17px;font-weight:700}
      #flashcardsPage .flash-secondary{border:1px solid var(--border);background:var(--panel-hover);color:var(--text);border-radius:10px;padding:9px 13px}
      #flashcardsPage .flash-collection-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:9px;margin-top:12px}
      #flashcardsPage .flash-collection small{display:block;color:var(--muted);margin-top:4px}
      #flashcardsPage .flash-card-list{display:grid;gap:8px;margin-top:14px}
      #flashcardsPage .flash-card-row{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px 13px;border:1px solid var(--border);border-radius:11px;background:var(--panel-hover)}
      #flashcardsPage .flash-card-row strong{display:block}
      #flashcardsPage .flash-card-row small{color:var(--muted)}
      #flashcardsPage .flash-form{display:grid;gap:10px;margin-top:14px}
      #flashcardsPage .flash-form label{display:grid;gap:5px;color:var(--muted);font-size:.88rem}
      #flashcardsPage .flash-game{max-width:760px;margin:0 auto;border:1px solid var(--border);border-radius:20px;background:linear-gradient(145deg,#1d2a42,#19212f 65%,#171b24);padding:clamp(18px,4vw,30px);text-align:center}
      #flashcardsPage .flash-game-top{display:flex;justify-content:space-between;gap:10px;color:#dce6ff;font-variant-numeric:tabular-nums}
      #flashcardsPage .flash-progress{height:8px;background:#101722;border-radius:99px;overflow:hidden;margin:15px 0 24px}
      #flashcardsPage .flash-progress span{display:block;height:100%;background:#9eb9ff;transition:width .2s linear}
      #flashcardsPage .flash-memory{min-height:190px;display:grid;place-items:center;padding:25px;border:1px solid #52658f;border-radius:16px;background:#dce8ff;color:#1b2945;font-size:clamp(1.5rem,4vw,2.5rem);font-weight:750;line-height:1.3;overflow-wrap:anywhere}
      #flashcardsPage .flash-memory small{display:block;font-size:.8rem;font-weight:650;opacity:.7}
      #flashcardsPage .flash-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px}
      #flashcardsPage .flash-option{min-height:64px;border:1px solid #53617b;border-radius:12px;background:#25334d;color:#f5f7ff;padding:12px;font-weight:650}
      #flashcardsPage .flash-option:hover{background:#314466}
      #flashcardsPage .flash-option:disabled{opacity:.6}
      #flashcardsPage .flash-game-status{min-height:28px;color:#dce6ff;margin:12px 0}
      #flashcardsPage .flash-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:15px 0}
      #flashcardsPage .flash-stat{background:var(--panel-hover);border:1px solid var(--border);border-radius:12px;padding:12px}
      #flashcardsPage .flash-stat strong{display:block;font-size:1.5rem;color:var(--accent)}
      #flashcardsPage .flash-search-results{max-height:220px;overflow:auto;display:grid;gap:6px}
      #flashcardsPage .flash-search-results button{display:flex;justify-content:space-between;gap:12px;text-align:left;border:1px solid var(--border);background:var(--panel-hover);color:var(--text);padding:10px;border-radius:9px}
      @media(max-width:700px){#flashcardsPage .flash-mode-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#flashcardsPage .flash-options{grid-template-columns:1fr}#flashcardsPage .flash-card-row{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(node);
  }
  function shell(){
    const coming=$(".coming-card");
    if(coming)coming.hidden=true;
    let mount=$("#flashcardsApp");
    if(!mount){mount=document.createElement("div");mount.id="flashcardsApp";root.appendChild(mount);}
    return mount;
  }
  function render(){
    const mount=shell();style();
    if(course==="zh"){mount.innerHTML="";return;}
    if(!currentUser){
      mount.innerHTML='<section class="coming-card"><h2>Sign in to use Flashcards</h2><p class="page-intro" style="margin:0 auto 16px">Your collections and learning progress sync securely with your account.</p><button class="flash-primary" data-action="signin">Sign in</button></section>';
      return;
    }
    if(state.loading){mount.innerHTML='<section class="flash-section">Loading your Flashcards…</section>';return;}
    if(state.game){renderGame(mount);return;}
    const counts=masteryMap();
    const allowance=state.data.allowance||{plan:"free",daily_limit:3,used_count:0,remaining:3};
    const weak=[...counts.entries()].filter(([,m])=>m.last_result==="incorrect").sort((a,b)=>(a[1].last_seen_at||"").localeCompare(b[1].last_seen_at||""));
    const collections=state.data.collections;
    const selected=selectedCollection();
    mount.innerHTML=`
      <div class="flash-home">
        <section class="flash-section">
          <h2>Flash Recall</h2><p class="flash-muted">A focused 60-second memory challenge. Every answer makes the next round faster.</p>
          <div class="flash-mode-grid">
            ${[["word","Word Recall"],["definition","Definition Recall"],["translation","Translation Recall"],["sentence","Sentence Recall"]].map(([id,label])=>`<button class="flash-mode" data-action="mode" data-value="${id}" aria-pressed="${state.mode===id}"><strong>${label}</strong><small class="flash-muted">${id==="word"?"Remember the word":id==="definition"?"Remember its meaning":id==="translation"?"Remember the translation":"Complete the sentence"}</small></button>`).join("")}
          </div>
          <p class="flash-muted">Daily allowance: <strong>${allowance.used_count}/${allowance.daily_limit}</strong> games used · <strong>${allowance.remaining}</strong> remaining today</p>
          <div class="flash-controls"><label>Difficulty <select id="flashDifficulty"><option value="beginner" ${state.difficulty==="beginner"?"selected":""}>Beginner</option><option value="intermediate" ${state.difficulty==="intermediate"?"selected":""}>Intermediate</option><option value="advanced" ${state.difficulty==="advanced"?"selected":""}>Advanced</option></select></label>
          <label>Card set <select id="flashGameCollection"><option value="all">All available words</option>${collections.map(c=>`<option value="${c.id}" ${state.collectionId===c.id?"selected":""}>${escapeHtml(c.name)}</option>`).join("")}</select></label>
          <button class="flash-primary" data-action="start-game" ${allowance.remaining<=0?"disabled":""}>Start 60-second game</button></div>
          <p class="flash-muted">Each game uses one daily Flashcard allowance. Leaving a game early does not consume a game.</p>
        </section>
        <section class="flash-section"><h2>Learning Collections</h2><p class="flash-muted">Choose a collection to practise words saved from the dictionary.</p>
          <div class="flash-collection-list"><button class="flash-collection" data-action="select-collection" data-value="all" aria-pressed="${state.collectionId==="all"}"><strong>All available words</strong><small>${words().length} dictionary entries from the English dictionary</small></button></div>
        </section>
        <section class="flash-section"><h2>Weak Memory</h2><p class="flash-muted">Cards you answered incorrectly appear here for extra practice.</p>
          ${weak.length?'<div class="flash-controls"><button class="flash-primary" data-action="review-weak-all">Review weak memory</button></div><div class="flash-card-list">'+weak.map(([key,m])=>{const card=state.data.cards.find(c=>cardKey(c)===key);const word=key.startsWith("dict:")?words().find(w=>w.word.toLowerCase()===key.slice(5)):null;return `<div class="flash-card-row"><div><strong>${escapeHtml(card?.front_text||word?.word||key.replace(/^custom:/,"Custom card"))}</strong><small>${m.correct_count} correct · ${m.incorrect_count} incorrect · streak ${m.current_streak}</small></div><button class="flash-secondary" data-action="review-weak" data-value="${escapeHtml(key)}">Review</button></div>`;}).join("")+'</div>':'<p class="flash-muted">No weak-memory cards yet. Complete a Flash Recall game to build your review list.</p>'}
        </section>
        <section class="flash-section"><h2>My Collections</h2><p class="flash-muted">Create your own collections, add dictionary words, or write fully custom question-and-answer cards. Your changes sync to your account.</p>
          <form class="flash-form" id="flashCollectionForm"><label>New collection name<input name="name" maxlength="60" placeholder="e.g. Words I want to remember" required></label><div><button class="flash-primary" type="submit">Create collection</button></div></form>
          ${selected?'<div class="flash-controls"><strong>'+escapeHtml(selected.name)+'</strong><button class="flash-secondary" data-action="rename-collection">Rename</button><button class="flash-secondary" data-action="delete-collection">Delete collection</button></div>':''}
          <div class="flash-controls"><label>Manage collection <select id="flashManageCollection"><option value="">Choose a collection</option>${collections.map(c=>`<option value="${c.id}" ${state.collectionId===c.id?"selected":""}>${escapeHtml(c.name)}</option>`).join("")}</select></label></div>
          ${selected?renderCollectionCards(selected.id):'<p class="flash-muted">Select a collection above to manage its cards.</p>'}
          <details><summary>Add a dictionary word</summary><form class="flash-form" id="flashDictionaryForm"><label>Search English dictionary<input id="flashDictionarySearch" type="search" placeholder="Search words…" autocomplete="off"></label><div class="flash-search-results" id="flashDictionaryResults"></div></form></details>
          <details><summary>Create a custom flashcard</summary><p class="flash-muted">Keep cards focused on learning. Do not include sensitive personal information or another person’s private details.</p><form class="flash-form" id="flashCustomForm"><label>Front / question<input name="front" maxlength="500" required></label><label>Back / answer<textarea name="back" rows="3" maxlength="2000" required></textarea></label><label>Example (optional)<textarea name="example" rows="2" maxlength="2000"></textarea></label><label>Translation (optional)<input name="translation" maxlength="1000"></label><button class="flash-primary" type="submit">Save custom card</button></form></details>
        </section>
        <section class="flash-section"><h2>Recent Flash Recall</h2>${state.data.history.length?'<div class="flash-card-list">'+state.data.history.slice(0,8).map(s=>`<div class="flash-card-row"><div><strong>${escapeHtml(s.mode)} · ${escapeHtml(s.difficulty)}</strong><small>${s.words_seen} words · ${s.correct_count} correct · ${s.incorrect_count} incorrect</small></div><small>${new Date(s.completed_at).toLocaleString()}</small></div>`).join("")+'</div>':'<p class="flash-muted">Completed games will appear here.</p>'}</section>
        <p id="flashNotice" class="flash-muted" role="status" aria-live="polite">${escapeHtml(state.notice)}</p>
      </div>`;
  }
  function renderCollectionCards(id){
    const cards=state.data.cards.filter(c=>c.collection_id===id).sort((a,b)=>(Number(a.position)||0)-(Number(b.position)||0)||String(a.created_at||"").localeCompare(String(b.created_at||"")));
    return cards.length?'<div class="flash-card-list">'+cards.map((c,index)=>
      '<div class="flash-card-row"><div><strong>'+escapeHtml(c.front_text)+'</strong><small>'+escapeHtml(c.back_text)+'</small></div><div class="flash-controls">'+
      '<button class="flash-secondary" data-action="reorder-up" data-value="'+c.id+'" '+(index===0?"disabled":"")+'>&uarr;</button>'+
      '<button class="flash-secondary" data-action="reorder-down" data-value="'+c.id+'" '+(index===cards.length-1?"disabled":"")+'>&darr;</button>'+
      '<button class="flash-secondary" data-action="edit-card" data-value="'+c.id+'">Edit</button>'+
      '<button class="flash-secondary" data-action="move-card" data-value="'+c.id+'">Move</button>'+
      '<button class="flash-secondary" data-action="remove-card" data-value="'+c.id+'">Remove</button></div></div>'
    ).join("")+'</div>':'<p class="flash-muted">This collection is empty. Add dictionary words or custom cards.</p>';
  }
  function mapCustomCard(c){return {word:c.front_text,definition:c.back_text,definitionZh:c.translation_text||c.back_text,examples:c.example_text?[c.example_text]:[],_custom:c};}
  function gameDeck(){
    const all=words();
    const allCards=[...all,...state.data.cards.filter(c=>c.card_type==="custom").map(mapCustomCard)];
    if(state.collectionId==="all")return allCards;
    const selected=state.data.cards.filter(c=>c.collection_id===state.collectionId);
    const targets=selected.map(c=>c.card_type==="dictionary"?all.find(w=>w.word.toLowerCase()===c.dictionary_word.toLowerCase()):mapCustomCard(c)).filter(Boolean);
    const selectedKeys=new Set(targets.map(w=>w._custom?"custom:"+w._custom.id:"dict:"+w.word.toLowerCase()));
    const distractors=allCards.filter(w=>!selectedKeys.has(w._custom?"custom:"+w._custom.id:"dict:"+w.word.toLowerCase())).map(w=>({...w,_flashDistractor:true}));
    return [...targets,...distractors];
  }
  function makeRound(deck){
    const available=deck.filter(w=>w.word&&w.definition);
    const targets=state.weakOnly
      ? available.filter(w=>!w._flashDistractor&&state.weakKeys.has(w._custom?"custom:"+w._custom.id:"dict:"+w.word.toLowerCase()))
      : available.filter(w=>!w._flashDistractor);
    if(!targets.length)throw new Error(state.weakOnly?"There are no weak-memory cards in this card set yet.":"This card set has no available cards.");
    if(available.length<4)throw new Error("Four distinct choices are not available for this card set.");
    const target=targets[Math.floor(Math.random()*targets.length)];
    let memory="",prompt="",correct="";
    if(state.mode==="word"){memory=target.word;prompt="Choose the correct meaning";correct=target.definition;}
    else if(state.mode==="definition"){memory=target.definition;prompt="Which word matches this meaning?";correct=target.word;}
    else if(state.mode==="translation"){memory=target.word;prompt="Choose the correct translation";correct=translationFor(target);}
    else {
      const sentence=(target.examples||[])[0]||("I want to "+target.word+" today.");
      const index=sentence.toLowerCase().indexOf(target.word.toLowerCase());
      memory=index>=0?sentence.slice(0,index)+"_____"+sentence.slice(index+target.word.length):sentence+" _____";
      prompt="Which word completes the sentence?";correct=target.word;
    }
    const optionValue=w=>state.mode==="word"?w.definition:state.mode==="definition"?w.word:state.mode==="translation"?translationFor(w):w.word;
    const normalize=value=>String(value||"").normalize("NFKC").trim().toLocaleLowerCase();
    const distinct=new Map();
    for(const candidate of available){
      const value=optionValue(candidate),key=normalize(value);
      if(key&&!distinct.has(key))distinct.set(key,candidate);
    }
    const correctKey=normalize(correct);
    const distractors=[...distinct.entries()].filter(([key,candidate])=>key!==correctKey&&candidate!==target).map(([,candidate])=>candidate);
    if(distractors.length<3)throw new Error("This card set does not contain four distinct answer choices for this mode.");
    for(let i=distractors.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[distractors[i],distractors[j]]=[distractors[j],distractors[i]];}
    const chosen=[target,...distractors.slice(0,3)];
    for(let i=chosen.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[chosen[i],chosen[j]]=[chosen[j],chosen[i]];}
    const options=chosen.map(optionValue);
    return {target,memory,prompt,correct,options};
  }
  function durationLabel(n){return Number(n.toFixed(1))+"s";}
  function clearTimers(){clearTimeout(state.gameTimer);clearTimeout(state.phaseTimer);state.gameTimer=null;state.phaseTimer=null;}
  function renderGame(mount){
    const elapsed=Math.max(0,60-(Date.now()-state.game.startedAt)/1000);
    const progress=Math.max(0,elapsed/60*100);
    const round=state.round;
    mount.innerHTML=`<section class="flash-game">
      <div class="flash-game-top"><span>${escapeHtml(state.mode)} · ${escapeHtml(state.difficulty)}</span><strong id="flashGameClock">${Math.ceil(elapsed)}s left</strong></div>
      <div class="flash-progress"><span id="flashGameProgress" style="width:${progress}%"></span></div>
      <p id="flashPhaseLabel" class="flash-muted">${state.phase==="memory"?"Memorise this":state.phase==="answer"?"Choose your answer":"Get ready"}</p>
      <div class="flash-memory" id="flashMemory">${state.phase==="memory"?escapeHtml(round?.memory||""):"Ready?"}</div>
      <p id="flashQuestion" class="flash-game-status">${state.phase==="answer"?escapeHtml(round?.prompt||""):""}</p>
      <div class="flash-options" id="flashOptions">${state.phase==="answer"?(round?.options||[]).map((o,i)=>`<button class="flash-option" data-action="answer" data-index="${i}">${escapeHtml(o)}</button>`).join(""):""}</div>
      <p class="flash-game-status" id="flashTimerLabel">Memory ${durationLabel(state.memory)} · Answer ${durationLabel(state.answer)}</p>
      <div class="flash-stats"><div class="flash-stat"><strong>${state.results.length}</strong><span>Words seen</span></div><div class="flash-stat"><strong>${state.results.filter(r=>r.correct).length}</strong><span>Correct</span></div><div class="flash-stat"><strong>${state.results.filter(r=>!r.correct).length}</strong><span>Incorrect</span></div></div>
      <button class="flash-secondary" data-action="leave-game">Leave game</button>
    </section>`;
  }
  function tickGame(){
    if(!state.game)return;
    const elapsed=(Date.now()-state.game.startedAt)/1000;
    const remain=Math.max(0,60-elapsed);
    const clock=$("#flashGameClock"),bar=$("#flashGameProgress");
    if(clock)clock.textContent=Math.ceil(remain)+"s left";
    if(bar)bar.style.width=(remain/60*100)+"%";
    if(remain<=0){finishGame();return;}
    state.gameTimer=setTimeout(tickGame,100);
  }
  function showMemory(){
    if(!state.game)return;
    if((Date.now()-state.game.startedAt)>=60000){finishGame();return;}
    try{state.round=makeRound(state.deck);}catch(e){state.notice=e.message;finishGame();return;}
    state.phase="memory";
    const memory=$("#flashMemory"),label=$("#flashPhaseLabel"),options=$("#flashOptions"),question=$("#flashQuestion"),timer=$("#flashTimerLabel");
    if(memory)memory.textContent=state.round.memory;
    if(label)label.textContent="Memorise this";
    if(options)options.innerHTML="";
    if(question)question.textContent="";
    if(timer)timer.textContent="Memory "+durationLabel(state.memory)+" · Answer "+durationLabel(state.answer);
    state.phaseEnds=Date.now()+state.memory*1000;
    state.phaseTimer=setTimeout(showAnswers,state.memory*1000);
  }
  function showAnswers(){
    if(!state.game)return;
    if((Date.now()-state.game.startedAt)>=60000){finishGame();return;}
    state.phase="answer";
    const memory=$("#flashMemory"),label=$("#flashPhaseLabel"),options=$("#flashOptions"),question=$("#flashQuestion");
    if(memory)memory.innerHTML="<small>RECALL</small>What do you remember?";
    if(label)label.textContent="Choose before time runs out";
    if(question)question.textContent=state.round.prompt;
    if(options)options.innerHTML=state.round.options.map((o,i)=>`<button class="flash-option" data-action="answer" data-index="${i}">${escapeHtml(o)}</button>`).join("");
    state.phaseEnds=Date.now()+state.answer*1000;
    state.phaseTimer=setTimeout(()=>recordAnswer(false,true),state.answer*1000);
  }
  function recordAnswer(correct,unanswered=false){
    if(!state.game||state.phase!=="answer")return;
    clearTimeout(state.phaseTimer);
    state.results.push({card_key:state.round.target._custom?"custom:"+state.round.target._custom.id:"dict:"+state.round.target.word.toLowerCase(),correct:!!correct,unanswered:!!unanswered});
    const statValues=root.querySelectorAll(".flash-stat strong");
    if(statValues.length===3){
      statValues[0].textContent=String(state.results.length);
      statValues[1].textContent=String(state.results.filter(result=>result.correct).length);
      statValues[2].textContent=String(state.results.filter(result=>!result.correct).length);
    }
    state.memory=Math.max(timing[state.difficulty].memoryFloor,Number((state.memory-timing[state.difficulty].memoryStep).toFixed(2)));
    state.answer=Math.max(timing[state.difficulty].answerFloor,Number((state.answer-timing[state.difficulty].answerStep).toFixed(2)));
    state.roundIndex++;
    const options=$("#flashOptions");if(options)options.innerHTML="";
    const question=$("#flashQuestion");if(question)question.textContent=unanswered?"Time is up.":correct?"Correct!":"Not quite.";
    const label=$("#flashPhaseLabel");if(label)label.textContent=unanswered?"No answer recorded":correct?"Well remembered":"Keep going";
    state.phase="feedback";
    state.phaseTimer=setTimeout(showMemory,450);
  }
  async function startGame(){
    const deck=gameDeck();
    if(deck.length<4)throw new Error("Add at least four dictionary words or cards before starting a four-choice game.");
    const {data,error}=await supabaseClient.rpc("start_my_flashcard_game",{p_mode:state.mode,p_difficulty:state.difficulty});
    if(error)throw error;
    state.game={id:data.session_id,startedAt:Date.now(),translationLanguage};
    state.deck=deck;state.results=[];state.roundIndex=0;
    Object.assign(state,{memory:timing[state.difficulty].memory,answer:timing[state.difficulty].answer});
    render();tickGame();showMemory();
  }
  async function finishGame(){
    if(!state.game)return;
    clearTimers();
    const game=state.game;
    if(state.round&&(state.phase==="memory"||state.phase==="answer")){
      state.results.push({card_key:state.round.target._custom?"custom:"+state.round.target._custom.id:"dict:"+state.round.target.word.toLowerCase(),correct:false,unanswered:true});
    }
    state.game=null;
    try{
      const {data,error}=await supabaseClient.rpc("complete_my_flashcard_game",{p_session_id:game.id,p_results:state.results});
      if(error)throw error;
      state.notice=`Game complete: ${data.words_seen} words seen, ${data.correct_count} correct, ${data.incorrect_count} incorrect. ${data.unanswered_count} timed out.`;
      await loadData();
    }catch(error){
      state.notice="The game result could not be saved: "+error.message;
      try{await supabaseClient.rpc("abandon_my_flashcard_game",{p_session_id:game.id});}catch(_){}
      render();
    }
  }
  async function loadData(){
    if(!currentUser||!supabaseClient)return;
    state.loading=true;render();
    const {data,error}=await supabaseClient.rpc("get_my_flashcard_data");
    state.loading=false;
    if(error){state.notice="Flashcards could not load: "+error.message;render();return;}
    state.data=data||{collections:[],cards:[],mastery:[],history:[]};state.ready=true;render();
  }
  async function collectionAction(action,id,name){
    const {data,error}=await supabaseClient.rpc("save_my_flashcard_collection",{p_action:action,p_collection_id:id||null,p_name:name||null});
    if(error)throw error;
    if(action==="create"&&data?.id)state.collectionId=data.id;
    await loadData();
  }
  async function cardAction(action,card,collectionId){
    const {error}=await supabaseClient.rpc("save_my_flashcard_card",{
      p_action:action,p_card_id:card.id||null,p_collection_id:collectionId,
      p_card_type:card.card_type||null,p_dictionary_word:card.dictionary_word||null,
      p_front_text:card.front_text||null,p_back_text:card.back_text||null,
      p_example_text:card.example_text||null,p_translation_text:card.translation_text||null,
      p_position:action==="create"?state.data.cards.filter(c=>c.collection_id===collectionId).length:(Number(card.position)||0)
    });
    if(error)throw error;
    await loadData();
  }
  function notice(message){state.notice=message;const n=$("#flashNotice");if(n)n.textContent=message;}
  async function handleClick(event){
    const button=event.target.closest("[data-action]");if(!button)return;
    const action=button.dataset.action,value=button.dataset.value;
    try{
      if(action==="signin"){document.getElementById("menuSignIn")?.click();return;}
      if(action==="mode"){state.mode=value;render();return;}
      if(action==="select-collection"){state.collectionId=value;render();return;}
      if(action==="start-game"){state.difficulty=$("#flashDifficulty").value;state.collectionId=$("#flashGameCollection").value;state.weakOnly=false;state.weakKeys.clear();await startGame();return;}
      if(action==="answer"){recordAnswer(state.round.options[Number(button.dataset.index)]===state.round.correct,false);return;}
      if(action==="leave-game"){
        clearTimers();const id=state.game.id;state.game=null;
        await supabaseClient.rpc("abandon_my_flashcard_game",{p_session_id:id});state.notice="Game left. No daily allowance was used.";await loadData();return;
      }
      if(action==="review-weak"){state.collectionId="all";state.weakOnly=true;state.weakKeys=new Set([value]);state.mode=value.startsWith("dict:")?"word":"definition";await startGame();return;}
      if(action==="review-weak-all"){state.collectionId="all";state.weakOnly=true;state.weakKeys=new Set([...masteryMap().entries()].filter(([,m])=>m.last_result==="incorrect").map(([key])=>key));await startGame();return;}
      if(action==="rename-collection"){const name=prompt("New collection name",selectedCollection().name);if(name!==null)await collectionAction("rename",selectedCollection().id,name);return;}
      if(action==="delete-collection"){if(confirm("Delete this collection and its cards?")){await collectionAction("delete",selectedCollection().id,null);state.collectionId="all";}return;}
      if(action==="remove-card"){if(confirm("Remove this card from the collection?"))await cardAction("delete",{id:value},null);return;}
      if(action==="reorder-up"||action==="reorder-down"){
        const card=state.data.cards.find(c=>c.id===value);if(!card)return;
        const ordered=state.data.cards.filter(c=>c.collection_id===card.collection_id).sort((a,b)=>(Number(a.position)||0)-(Number(b.position)||0)||String(a.created_at||"").localeCompare(String(b.created_at||"")));
        const index=ordered.findIndex(c=>c.id===card.id),other=ordered[index+(action==="reorder-up"?-1:1)];
        if(!other)return;
        const oldPosition=Number(card.position)||0;
        await cardAction("move",{...card,position:Number(other.position)||0},card.collection_id);
        await cardAction("move",{...other,position:oldPosition},other.collection_id);return;
      }
      if(action==="edit-card"){
        const card=state.data.cards.find(c=>c.id===value);if(!card)return;
        const front=prompt("Front / question",card.front_text);if(front===null)return;
        const back=prompt("Back / answer",card.back_text);if(back===null)return;
        await cardAction("update",{...card,front_text:front,back_text:back},card.collection_id);return;
      }
      if(action==="move-card"){
        const card=state.data.cards.find(c=>c.id===value);const choices=state.data.collections.filter(c=>c.id!==card.collection_id);
        if(!choices.length){notice("Create another collection before moving this card.");return;}
        const chosen=prompt("Enter the destination collection name:\n"+choices.map(c=>c.name).join("\n"));
        const target=choices.find(c=>c.name.toLowerCase()===String(chosen||"").toLowerCase());if(target)await cardAction("move",card,target.id);return;
      }
    }catch(error){notice(error.message||"The action could not be completed.");}
  }
  function attachForms(){
    root.addEventListener("submit",async event=>{
      if(event.target.id==="flashCollectionForm"){
        event.preventDefault();const name=new FormData(event.target).get("name");
        try{await collectionAction("create",null,name);notice("Collection created.");}catch(error){notice(error.message);}
      }
      if(event.target.id==="flashCustomForm"){
        event.preventDefault();const form=new FormData(event.target);const selected=selectedCollection();
        if(!selected){notice("Create or select a collection first.");return;}
        try{await cardAction("create",{card_type:"custom",front_text:form.get("front"),back_text:form.get("back"),example_text:form.get("example"),translation_text:form.get("translation")},selected.id);notice("Custom flashcard saved.");}catch(error){notice(error.message);}
      }
    });
    root.addEventListener("change",event=>{
      if(event.target.id==="flashManageCollection"){state.collectionId=event.target.value||"all";render();}
      if(event.target.id==="flashDictionarySearch")renderDictionarySearch(event.target.value);
    });
    root.addEventListener("input",event=>{if(event.target.id==="flashDictionarySearch")renderDictionarySearch(event.target.value);});
  }
  async function addDictionaryWord(wordName){
    const selected=selectedCollection();if(!selected){notice("Create or select a collection first.");return;}
    const word=words().find(w=>w.word===wordName);if(!word)return;
    try{await cardAction("create",dictionaryCard(word),selected.id);notice("Dictionary word added.");}catch(error){notice(error.message);}
  }
  function renderDictionarySearch(query){
    const target=$("#flashDictionaryResults");if(!target)return;
    if(!query.trim()){target.innerHTML="";return;}
    const found=words().filter(w=>w.word.toLowerCase().includes(query.trim().toLowerCase())).slice(0,12);
    target.innerHTML=found.map(w=>`<button type="button" data-add-word="${escapeHtml(w.word)}"><span><strong>${escapeHtml(w.word)}</strong><br><small>${escapeHtml(w.definition)}</small></span><span>＋</span></button>`).join("")||'<p class="flash-muted">No matching words found.</p>';
    target.querySelectorAll("[data-add-word]").forEach(button=>button.addEventListener("click",()=>addDictionaryWord(button.dataset.addWord)));
  }
  root.addEventListener("click",handleClick);
  attachForms();
  document.getElementById("flashDifficulty")?.addEventListener("change",e=>state.difficulty=e.target.value);
  window.addEventListener("swift-auth-updated",()=>{state.game=null;clearTimers();if(currentUser)loadData();else render();});
  const originalFlashShowPage=window.showPage;
  document.querySelectorAll('[data-page="flashcards"]').forEach(button=>button.addEventListener("click",()=>{if(currentUser&&!state.ready)loadData();else render();}));
  window.addEventListener("hashchange",()=>{if(location.hash==="#flashcards"&&currentUser)loadData();});
  const timerApi={
    config:timing,
    next(memory,answer,difficulty){const t=timing[difficulty];return {memory:Math.max(t.memoryFloor,Number((memory-t.memoryStep).toFixed(2))),answer:Math.max(t.answerFloor,Number((answer-t.answerStep).toFixed(2)))};}
  };
  window.SwiftDictionaryFlashcards=timerApi;
  render();
  if(currentUser)loadData();
})();