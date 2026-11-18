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
    ready:false,loading:false,starting:false,finishing:false,data:{collections:[],cards:[],mastery:[],history:[]},
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
  function cardKey(card){if(card._custom)return "custom:"+card._custom.id;if(card.card_type==="custom")return "custom:"+card.id;return "dict:"+String(card.dictionary_word||card.word||"").toLowerCase();}
  function collectionName(id){return state.data.collections.find(c=>c.id===id)?.name||"Collection";}
  function translationFor(word){const language=state.game?.translationLanguage||translationLanguage;return language==="zh"?(word._flashCard?.translation_text||word.definitionZh||word.definition):word.definition;}
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

    node.textContent += `
      #flashcardsPage .flash-banner{border:1px solid #344a68;border-radius:22px;padding:30px;background:radial-gradient(circle at 88% 15%,#7096bd55,transparent 25%),linear-gradient(120deg,#15263b,#203c58 60%,#1b2941);box-shadow:0 16px 30px #0004}
      #flashcardsPage .flash-banner h2{font-size:2.2rem;margin:0 0 8px;color:#f4f8ff}
      #flashcardsPage .flash-banner p{margin:0;color:#c4d4ea}
      #flashcardsPage .flash-section{border-radius:18px;box-shadow:0 8px 22px #0002}
      #flashcardsPage .flash-mode-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:14px 0}
      #flashcardsPage .flash-mode{display:flex;align-items:center;gap:12px;min-height:88px;border:0;border-radius:17px;color:#fff;padding:15px;text-align:left;font-weight:750;box-shadow:0 7px 0 #0005,0 12px 20px #0003;transition:transform .16s}
      #flashcardsPage .flash-mode:hover{transform:translateY(-2px)}
      #flashcardsPage .flash-mode .flash-mode-icon{font-size:1.5rem;background:#ffffff25;padding:10px;border-radius:12px}
      #flashcardsPage .flash-mode small{display:block;color:#ffffffd9;font-weight:500;margin-top:4px}
      #flashcardsPage .flash-mode[data-mode=word]{background:#4b91b9;box-shadow:0 7px 0 #28516b,0 12px 20px #0003}
      #flashcardsPage .flash-mode[data-mode=definition]{background:#2865b2;box-shadow:0 7px 0 #173d70,0 12px 20px #0003}
      #flashcardsPage .flash-mode[data-mode=mixed]{background:#b33f91;box-shadow:0 7px 0 #70275a,0 12px 20px #0003}
      #flashcardsPage .flash-mode[data-mode=sentence]{background:#7650b8;box-shadow:0 7px 0 #493176,0 12px 20px #0003}
      #flashcardsPage .flash-pill{display:inline-flex;border-radius:99px;padding:8px 13px;border:1px solid var(--border);background:var(--panel-hover)}
      #flashcardsPage .flash-primary{border-radius:999px;padding:11px 22px;box-shadow:0 4px 0 #26385e}
      #flashcardsPage .flash-modal-backdrop{position:fixed;inset:0;z-index:10050;background:#050910bb;backdrop-filter:blur(7px);display:grid;place-items:center;padding:16px}
      #flashcardsPage .flash-modal{width:min(540px,100%);max-height:calc(100dvh - 32px);overflow:auto;background:#1b202b;border:1px solid #3a4558;border-radius:22px;padding:22px;box-shadow:0 24px 70px #0009}
      #flashcardsPage .flash-modal select{width:100%;background:#101722;color:#f5f7ff;border:1px solid #414d61;border-radius:12px;padding:11px}
      #flashcardsPage .flash-modal label{display:grid;gap:7px;margin:14px 0;color:#c8d0df}
      #flashcardsPage .flash-modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}
      #flashcardsPage .flash-game{width:min(900px,100%);max-width:900px}
      #flashcardsPage .flash-round-gauge{height:14px;background:#30394a;border-radius:99px;overflow:hidden;margin:16px 0;display:flex}
      #flashcardsPage .flash-round-gauge span{height:100%;transition:width .08s linear}
      #flashcardsPage .flash-round-gauge .memory{background:linear-gradient(90deg,#ffe27b,#f5c344)}
      #flashcardsPage .flash-round-gauge .answer{background:linear-gradient(90deg,#ffae55,#f17b36)}
      #flashcardsPage .flash-memory{min-height:174px;background:linear-gradient(145deg,#d8efff,#a9d8f5);color:#17344b;border:1px solid #83b9df;border-radius:18px}
      #flashcardsPage .flash-memory.is-blurred{filter:blur(7px);opacity:.65}
      #flashcardsPage .flash-options{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      #flashcardsPage .flash-option{min-height:68px;border-radius:15px;box-shadow:0 4px 0 #182438}
      #flashcardsPage .flash-option.is-hidden{background:#080c14;color:transparent;border-color:#080c14;box-shadow:0 4px 0 #030509}
      #flashcardsPage .flash-option.is-correct{background:#246e4b;border-color:#57c28b;color:#fff}
      #flashcardsPage .flash-option.is-wrong{background:#873c45;border-color:#e27c84;color:#fff}
      #flashcardsPage .flash-review-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
      #flashcardsPage .flash-review-tab{border:1px solid #3c4960;border-radius:99px;padding:8px 14px;background:#202a3a;color:#e6edfb}
      #flashcardsPage .flash-review-tab[aria-selected=true]{background:#344e77}
      #flashcardsPage .flash-review-layout{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      #flashcardsPage .flash-review-list button{width:100%;text-align:left;margin:5px 0;padding:11px;border-radius:10px;background:#242e40;border:1px solid #3c4a60;color:#eef3ff}
      #flashcardsPage .flash-review-detail{background:#202a3a;border:1px solid #3b4a62;border-radius:14px;padding:16px;animation:flashSlideIn .22s ease-out}
      @keyframes flashSlideIn{from{transform:translateX(-18px);opacity:0}to{transform:translateX(0);opacity:1}}
      @media(max-width:650px){#flashcardsPage .flash-mode-grid{gap:8px}#flashcardsPage .flash-mode{padding:10px;min-height:78px}#flashcardsPage .flash-options{gap:8px}#flashcardsPage .flash-option{font-size:.9rem;padding:9px 6px}#flashcardsPage .flash-review-layout{grid-template-columns:1fr}}
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
    if(course==="zh"){mount.innerHTML='<section class="flash-section"><h2>English course required</h2><p class="flash-muted">Flashcards currently support the English learning course. Switch your Learning Course to English to continue.</p></section>';return;}
    if(!currentUser){mount.innerHTML='<section class="flash-section"><h2>Sign in to use Flashcards</h2><p class="flash-muted">Your learning progress is saved securely to your account.</p><button class="flash-primary" data-action="signin">Sign in</button></section>';return;}
    if(state.loading){mount.innerHTML='<section class="flash-section">Loading your Flashcards…</section>';return;}
    if(state.finishing){mount.innerHTML='<section class="flash-section"><h2>Saving your game</h2><p class="flash-muted">Your results are being saved securely.</p></section>';return;}
    if(state.game){renderGame(mount);return;}
    const allowance=state.data.allowance||{daily_limit:3,used_count:0,remaining:3};
    const weakItems=(state.data.review_items||[]).filter(item=>item.incorrect_count>0);
    mount.innerHTML=`
      <div class="flash-home">
        <section class="flash-banner"><h2>Flashcards</h2><p>Sharpen your recall with quick, focused challenges. Choose a mode, set your pace, and see how much you can remember in 60 seconds.</p></section>
        <section class="flash-section">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><h2>Choose your Flash Recall</h2><p class="flash-muted">Four ways to strengthen your memory.</p></div><span class="flash-pill">⚡ 60-second challenge</span></div>
          <div class="flash-mode-grid">
            <button class="flash-mode" data-action="open-setup" data-mode="word"><span class="flash-mode-icon">🔤</span><span>Word Recall<small>Recall the meaning of a word</small></span></button>
            <button class="flash-mode" data-action="open-setup" data-mode="definition"><span class="flash-mode-icon">📘</span><span>Definition Recall<small>Identify the word from its meaning</small></span></button>
            <button class="flash-mode" data-action="open-setup" data-mode="mixed"><span class="flash-mode-icon">🎨</span><span>Mixed Recall<small>Word, meaning and sentence prompts</small></span></button>
            <button class="flash-mode" data-action="open-setup" data-mode="sentence"><span class="flash-mode-icon">✍️</span><span>Sentence Recall<small>Complete a sentence with the right word</small></span></button>
          </div>
          <p class="flash-muted">Daily games: <strong>${allowance.remaining}</strong> remaining of ${allowance.daily_limit}</p>
        </section>
        <section class="flash-section"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><h2>Review weak memory</h2><p class="flash-muted">Revisit answers you missed in previous games.</p></div><button class="flash-primary" data-action="open-review">Review weak memory (${weakItems.length})</button></div></section>
        <section class="flash-section"><h2>Recent games</h2>
          ${state.data.history?.length?'<div class="flash-card-list">'+state.data.history.slice(0,6).map(g=>`<div class="flash-pill">${escapeHtml(g.mode==="mixed"?"Mixed Recall":g.mode.charAt(0).toUpperCase()+g.mode.slice(1)+" Recall")} · ${escapeHtml(g.difficulty)} · ${g.correct_count}/${g.words_seen} correct</div>`).join("")+'</div>':'<p class="flash-muted">Your completed games and scores will appear here.</p>'}
        </section>
        <div id="flashOverlayRoot"></div>
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
    const targets=selected.map(c=>{
      if(c.card_type==="custom")return mapCustomCard(c);
      const source=all.find(w=>w.word.toLowerCase()===c.dictionary_word.toLowerCase());
      return source?{...source,word:c.front_text,definition:c.back_text,definitionZh:c.translation_text||source.definitionZh,
        examples:c.example_text?[c.example_text]:source.examples,dictionary_word:c.dictionary_word,_flashCard:c}:null;
    }).filter(Boolean);
    const selectedKeys=new Set(targets.map(w=>w._custom?"custom:"+w._custom.id:"dict:"+String(w.dictionary_word||w.word).toLowerCase()));
    const distractors=allCards.filter(w=>!selectedKeys.has(w._custom?"custom:"+w._custom.id:"dict:"+w.word.toLowerCase())).map(w=>({...w,_flashDistractor:true}));
    return [...targets,...distractors];
  }
  function makeRound(deck){
    const available=deck.filter(w=>w.word&&w.definition);
    const targets=state.weakOnly?available.filter(w=>!w._flashDistractor&&state.weakKeys.has(cardKey(w))):available.filter(w=>!w._flashDistractor);
    if(!targets.length)throw new Error("There are no cards available for this recall mode.");
    if(available.length<4)throw new Error("Four distinct choices are not available for this card set.");
    const mode=state.mode==="mixed"?["word","definition","sentence"][Math.floor(Math.random()*3)]:state.mode;
    const optionValue=w=>mode==="word"?w.definition:w.word,normalize=v=>String(v||"").normalize("NFKC").trim().toLocaleLowerCase();
    const viable=targets.filter(target=>{const correct=mode==="word"?target.definition:target.word,key=normalize(correct),d=new Set();for(const c of available){if(c===target)continue;const k=normalize(optionValue(c));if(k&&k!==key)d.add(k);}return d.size>=3;});
    if(!viable.length)throw new Error("This card set does not contain four distinct choices for this recall mode.");
    const target=viable[Math.floor(Math.random()*viable.length)];
    let memory="",prompt="",correct="";
    if(mode==="word"){memory=target.word;prompt="Choose the correct meaning";correct=target.definition;}
    else if(mode==="definition"){memory=target.definition;prompt="Which word matches this meaning?";correct=target.word;}
    else{const sentence=(target.examples||[])[0]||("I want to "+target.word+" today.");const index=sentence.toLowerCase().indexOf(target.word.toLowerCase());memory=index>=0?sentence.slice(0,index)+"_____"+sentence.slice(index+target.word.length):sentence+" _____";prompt="Which word completes the sentence?";correct=target.word;}
    const key=normalize(correct),distinct=new Map();for(const c of available){if(c===target)continue;const value=optionValue(c),k=normalize(value);if(k&&k!==key&&!distinct.has(k))distinct.set(k,c);}
    const distractors=[...distinct.values()];for(let i=distractors.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[distractors[i],distractors[j]]=[distractors[j],distractors[i]];}
    const chosen=[target,...distractors.slice(0,3)];for(let i=chosen.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[chosen[i],chosen[j]]=[chosen[j],chosen[i]];}
    return {target,mode,memory,prompt,correct,options:chosen.map(optionValue)};
  }
  function durationLabel(n){return Number(n.toFixed(1))+"s";}
  function clearTimers(){clearTimeout(state.gameTimer);clearTimeout(state.phaseTimer);state.gameTimer=null;state.phaseTimer=null;}
  function renderGame(mount){
    const elapsed=Math.max(0,60-(Date.now()-state.game.startedAt)/1000),remain=Math.max(0,60-elapsed),round=state.round;
    const modeLabel=state.mode==="mixed"?"Mixed Recall":state.mode.charAt(0).toUpperCase()+state.mode.slice(1)+" Recall";
    mount.innerHTML=`<section class="flash-game">
      <div class="flash-game-top"><span class="flash-pill">${modeLabel} · ${state.difficulty}</span><strong id="flashGameClock">${Math.ceil(remain)}s</strong></div>
      <div class="flash-round-gauge"><span class="memory" id="flashMemoryGauge" style="width:100%"></span><span class="answer" id="flashAnswerGauge" style="width:0%"></span></div>
      <div class="flash-memory" id="flashMemory">${escapeHtml(round?.memory||"Get ready")}</div>
      <div id="flashMemoryOverlay" class="flash-memory-overlay" ${state.phase==="answer"?"":"hidden"}>Pick your answers</div>
      <p id="flashQuestion" class="flash-game-status">${state.phase==="answer"?escapeHtml(round?.prompt||""):"Memorise the card"}</p>
      <div class="flash-options" id="flashOptions">${(round?.options||["","","",""]).map((o,i)=>`<button class="flash-option ${state.phase==="memory"?"is-hidden":""}" data-action="answer" data-index="${i}" ${state.phase!=="answer"?"disabled":""}>${state.phase==="memory"?"Hidden answer":escapeHtml(o)}</button>`).join("")}</div>
      <p id="flashPhaseLabel" class="flash-game-status">${state.phase==="memory"?"Memorise the card":state.phase==="answer"?"Pick your answers":"Round feedback"}</p>
      <div class="flash-stats"><div class="flash-stat"><strong>${state.results.length}</strong><span>Attempted</span></div><div class="flash-stat"><strong>${state.results.filter(r=>r.correct).length}</strong><span>Correct</span></div><div class="flash-stat"><strong>${state.results.filter(r=>!r.correct).length}</strong><span>Incorrect</span></div></div>
      <button class="flash-secondary" data-action="leave-game">Leave game</button>
    </section>`;
  }
  function tickGame(){
    if(!state.game)return;
    const remain=Math.max(0,60-(Date.now()-state.game.startedAt)/1000);
    const clock=$("#flashGameClock");if(clock)clock.textContent=Math.ceil(remain)+"s";
    const elapsed=Date.now()-state.phaseStartedAt,ratio=Math.max(0,Math.min(1,1-elapsed/(state.phaseDuration||1)));
    const mg=$("#flashMemoryGauge"),ag=$("#flashAnswerGauge");
    if(mg)mg.style.width=(state.phase==="memory"?ratio*100:0)+"%";
    if(ag)ag.style.width=(state.phase==="answer"?ratio*100:0)+"%";
    if(remain<=0){finishGame();return;}state.gameTimer=setTimeout(tickGame,80);
  }
  function showMemory(){
    if(!state.game)return;if(Date.now()-state.game.startedAt>=60000){finishGame();return;}
    try{state.round=makeRound(state.deck);}catch(e){state.notice=e.message;finishGame();return;}
    state.phase="memory";state.phaseStartedAt=Date.now();state.phaseDuration=state.memory*1000;
    const memory=$("#flashMemory"),label=$("#flashPhaseLabel"),options=$("#flashOptions"),question=$("#flashQuestion"),overlay=$("#flashMemoryOverlay");
    if(memory){memory.classList.remove("is-blurred");memory.textContent=state.round.memory;}
    if(overlay)overlay.hidden=true;if(label)label.textContent="Memorise the card";
    if(options)options.innerHTML=state.round.options.map((o,i)=>`<button class="flash-option is-hidden" data-action="answer" data-index="${i}" disabled>Hidden answer</button>`).join("");
    if(question)question.textContent=state.round.prompt;
    state.phaseTimer=setTimeout(showAnswers,state.phaseDuration);
  }
  function showAnswers(){
    if(!state.game)return;if(Date.now()-state.game.startedAt>=60000){finishGame();return;}
    state.phase="answer";state.phaseStartedAt=Date.now();state.phaseDuration=state.answer*1000;
    const memory=$("#flashMemory"),label=$("#flashPhaseLabel"),options=$("#flashOptions"),question=$("#flashQuestion"),overlay=$("#flashMemoryOverlay");
    if(memory)memory.classList.add("is-blurred");if(overlay)overlay.hidden=false;
    if(label)label.textContent="Pick your answers";if(question)question.textContent=state.round.prompt;
    if(options)options.innerHTML=state.round.options.map((o,i)=>`<button class="flash-option" data-action="answer" data-index="${i}">${escapeHtml(o)}</button>`).join("");
    state.phaseTimer=setTimeout(()=>recordAnswer(false,true),state.phaseDuration);
  }
  function recordAnswer(correct,unanswered=false){
    if(!state.game||state.phase!=="answer")return;clearTimeout(state.phaseTimer);
    state.results.push({card_key:cardKey(state.round.target),mode:state.round.mode,correct:!!correct,unanswered:!!unanswered});
    state.memory=Math.max(timing[state.difficulty].memoryFloor,Number((state.memory-timing[state.difficulty].memoryStep).toFixed(2)));
    state.answer=Math.max(timing[state.difficulty].answerFloor,Number((state.answer-timing[state.difficulty].answerStep).toFixed(2)));
    state.phase="feedback";state.phaseStartedAt=Date.now();state.phaseDuration=3000;
    const memory=$("#flashMemory"),overlay=$("#flashMemoryOverlay"),label=$("#flashPhaseLabel"),options=$("#flashOptions"),question=$("#flashQuestion");
    if(memory){memory.classList.remove("is-blurred");memory.textContent=state.round.memory;}if(overlay)overlay.hidden=true;
    if(label)label.textContent=unanswered?"Time expired":correct?"Correct!":"Not quite";
    if(question)question.textContent="Correct answer: "+state.round.correct;
    if(options)options.innerHTML=state.round.options.map((o,i)=>`<button class="flash-option ${o===state.round.correct?"is-correct":i===state.selectedAnswerIndex?"is-wrong":""}" disabled>${escapeHtml(o)}</button>`).join("");
    const stats=root.querySelectorAll(".flash-stat strong");if(stats.length===3){stats[0].textContent=state.results.length;stats[1].textContent=state.results.filter(r=>r.correct).length;stats[2].textContent=state.results.filter(r=>!r.correct).length;}
    state.selectedAnswerIndex=undefined;state.phaseTimer=setTimeout(showMemory,3000);
  }
  async function startGame(){
    if(state.starting)return;
    state.starting=true;
    const startButton=$("#flashcardsApp [data-action='start-game']");
    if(startButton)startButton.disabled=true;
    try{
      const deck=gameDeck();
      if(deck.length<4)throw new Error("Add at least four dictionary words or cards before starting a four-choice game.");
      // Validate the selected mode, translation and every eligible target before
      // creating a server session. Duplicate-heavy answer sets must not leave
      // behind a session that can only fail after the game has started.
      state.deck=deck;
      makeRound(deck);
      state.round=null;state.phase="idle";state.phaseEnds=0;
      const {data,error}=await supabaseClient.rpc("start_my_flashcard_game",{p_mode:state.mode,p_difficulty:state.difficulty});
      if(error)throw error;
      state.game={id:data.session_id,startedAt:Date.now(),translationLanguage};
      state.results=[];state.roundIndex=0;
      Object.assign(state,{memory:timing[state.difficulty].memory,answer:timing[state.difficulty].answer});
      render();tickGame();showMemory();
    }catch(error){state.deck=null;throw error;}
    finally{state.starting=false;if(startButton?.isConnected)startButton.disabled=false;}
  }
  async function finishGame(){
    if(!state.game)return;
    clearTimers();
    const game=state.game;
    if(state.round&&(state.phase==="memory"||state.phase==="answer")){
      state.results.push({card_key:cardKey(state.round.target),correct:false,unanswered:true});
    }
    state.game=null;state.finishing=true;render();
    try{
      const {data,error}=await supabaseClient.rpc("complete_my_flashcard_game",{p_session_id:game.id,p_results:state.results});
      if(error)throw error;
      state.notice=`Game complete: ${data.words_seen} words seen, ${data.correct_count} correct, ${data.incorrect_count} incorrect. ${data.unanswered_count} timed out.`;
      state.finishing=false;
      await loadData();
    }catch(error){
      state.notice="The game result could not be saved: "+error.message;
      try{await supabaseClient.rpc("abandon_my_flashcard_game",{p_session_id:game.id});}catch(_){}
      state.finishing=false;
      await loadData();
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
        if(!state.game)return;
        clearTimers();const id=state.game.id;state.game=null;state.finishing=true;render();
        try{const {error}=await supabaseClient.rpc("abandon_my_flashcard_game",{p_session_id:id});if(error)throw error;state.notice="Game left. No daily allowance was used.";}
        finally{state.finishing=false;await loadData();}
        return;
      }
      if(action==="review-weak"){state.collectionId="all";state.weakOnly=true;state.weakKeys=new Set([value]);state.mode=value.startsWith("dict:")?"word":"definition";await startGame();return;}
      if(action==="review-weak-all"){state.collectionId="all";state.weakOnly=true;state.weakKeys=new Set([...masteryMap().entries()].filter(([,m])=>m.last_result==="incorrect").map(([key])=>key));await startGame();return;}
      if(action==="rename-collection"){const name=prompt("New collection name",selectedCollection().name);if(name!==null)await collectionAction("rename",selectedCollection().id,name);return;}
      if(action==="delete-collection"){if(confirm("Delete this collection and its cards?")){const id=selectedCollection().id;state.collectionId="all";await collectionAction("delete",id,null);}return;}
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
        const target=choices.find(c=>c.name.toLowerCase()===String(chosen||"").toLowerCase());if(target){const nextPosition=state.data.cards.filter(item=>item.collection_id===target.id).length;await cardAction("move",{...card,position:nextPosition},target.id);}return;
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
    });
    root.addEventListener("input",event=>{if(event.target.id==="flashDictionarySearch")renderDictionarySearch(event.target.value);});
  }
  async function addDictionaryWord(wordName){
    notice("Adding dictionary word...");
    const selected=selectedCollection();if(!selected){notice("Create or select a collection first.");return;}
    const word=words().find(w=>w.word===wordName);if(!word){notice("Dictionary word could not be found.");return;}
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