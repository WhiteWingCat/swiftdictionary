/* SwiftDictionary Update 2.5.0 — Flashcards UI and Flash Recall runtime. */
(() => {
  "use strict";
  const root = document.getElementById("flashcardsPage");
  if (!root) return;
  const $ = (selector, scope=root) => scope.querySelector(selector);
  let overlayRoot=document.getElementById("flashOverlayRoot");
  if(!overlayRoot){overlayRoot=document.createElement("div");overlayRoot.id="flashOverlayRoot";}
  overlayRoot.classList.add("flash-overlay-root");
  document.body.appendChild(overlayRoot);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  // Mode-specific start windows and minimum caps. Both windows reduce by 0.2s per completed round.
  const REDUCTION_STEP = 0.2;
  const timing = {
    word:{beginner:{memory:5,answer:12,memoryFloor:3,answerFloor:9},intermediate:{memory:5,answer:10,memoryFloor:2,answerFloor:7},advanced:{memory:3,answer:9,memoryFloor:1,answerFloor:5}},
    definition:{beginner:{memory:6,answer:5,memoryFloor:4,answerFloor:3},intermediate:{memory:5,answer:4,memoryFloor:3,answerFloor:3},advanced:{memory:4,answer:4,memoryFloor:2,answerFloor:3}},
    sentence:{beginner:{memory:7,answer:10,memoryFloor:5,answerFloor:7},intermediate:{memory:6,answer:8,memoryFloor:4,answerFloor:6},advanced:{memory:5,answer:6,memoryFloor:3,answerFloor:3}},
    mixed:{beginner:{memory:8,answer:12,memoryFloor:6,answerFloor:9},intermediate:{memory:7,answer:10,memoryFloor:5,answerFloor:7},advanced:{memory:6,answer:8,memoryFloor:4,answerFloor:5}}
  };
  const timingFor=(mode,difficulty)=>timing[mode]?.[difficulty]||timing.word[difficulty];
  const state = {
    ready:false,loading:false,starting:false,finishing:false,ending:false,duration:60,roundRecorded:false,usedQuestionKeys:new Set(),data:{collections:[],cards:[],mastery:[],history:[]},
    collectionId:"all",cardSet:"all",mode:"word",difficulty:"beginner",game:null,gameTimer:null,phaseTimer:null,reviewMode:"word",reviewSelected:null,lastResult:null,
    phase:"idle",round:null,roundIndex:0,results:[],memory:5,answer:12,phaseEnds:0,
    selectedWord:null,notice:"",saving:false,weakOnly:false,weakKeys:new Set(),
    helpButton:root.querySelector('[data-learning-help="flashcards"]')
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
  function uiText(en,zh){return (state.game?.translationLanguage||translationLanguage)==="zh"?zh:en;}
  function modeLabel(mode){return ({word:uiText("Word Recall","单词回忆"),definition:uiText("Definition Recall","释义回忆"),mixed:uiText("Mixed Recall","混合回忆"),sentence:uiText("Sentence Recall","句子回忆")})[mode]||mode;}
  function difficultyLabel(level){return ({beginner:uiText("Beginner","初级"),intermediate:uiText("Intermediate","中级"),advanced:uiText("Advanced","高级")})[level]||level;}
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
      .flash-overlay-root .flash-modal-backdrop{position:fixed;inset:0;z-index:10050;background:#050910bb;backdrop-filter:blur(7px);display:grid;place-items:center;padding:16px}
      .flash-overlay-root .flash-modal{width:min(540px,100%);max-height:calc(100dvh - 32px);overflow:auto;background:#1b202b;border:1px solid #3a4558;border-radius:22px;padding:22px;box-shadow:0 24px 70px #0009}
      .flash-overlay-root .flash-modal select{width:100%;background:#101722;color:#f5f7ff;border:1px solid #414d61;border-radius:12px;padding:11px}
      .flash-overlay-root .flash-modal label{display:grid;gap:7px;margin:14px 0;color:#c8d0df}
      .flash-overlay-root .flash-modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}
      #flashcardsPage .flash-game{width:min(900px,100%);max-width:900px}
      #flashcardsPage .flash-gauge-row{display:flex;align-items:center;gap:12px;margin:16px 0}
      #flashcardsPage .flash-round-gauge{height:14px;background:#30394a;border-radius:99px;overflow:hidden;margin:0;display:flex;flex:1;min-width:0}
      #flashcardsPage .flash-phase-action{flex:0 0 auto;min-width:112px;min-height:40px;border:1px solid #91b4f5;border-radius:999px;padding:8px 15px;background:linear-gradient(145deg,#4f70ad,#304c80);color:#fff;font-weight:800;box-shadow:0 3px 0 #182d51,0 6px 12px #0004}
      #flashcardsPage .flash-phase-action[hidden]{display:none!important}
      #flashcardsPage .flash-phase-action:focus-visible{outline:3px solid #d5e3ff;outline-offset:3px}
      @media(max-width:420px){#flashcardsPage .flash-gauge-row{gap:8px}#flashcardsPage .flash-phase-action{min-width:92px;padding:8px 10px;font-size:.88rem}}
      #flashcardsPage .flash-round-gauge span{height:100%;transition:width .08s linear}
      #flashcardsPage .flash-round-gauge .memory{background:linear-gradient(90deg,#ffe27b,#f5c344)}
      #flashcardsPage .flash-round-gauge .answer{background:linear-gradient(90deg,#ffae55,#f17b36)}
      #flashcardsPage .flash-memory{min-height:174px;background:linear-gradient(145deg,#d8efff,#a9d8f5);color:#17344b;border:1px solid #83b9df;border-radius:18px}
      #flashcardsPage .flash-memory.is-blurred{filter:blur(7px);opacity:.65}
      #flashcardsPage .flash-memory-overlay{position:relative;margin-top:-106px;min-height:88px;display:grid;place-items:center;color:#fff;font-weight:800;font-size:1.25rem;text-shadow:0 2px 9px #101827;pointer-events:none;z-index:2}
      #flashcardsPage .flash-options{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      #flashcardsPage .flash-option{min-height:68px;border-radius:15px;box-shadow:0 4px 0 #182438}
      #flashcardsPage .flash-option.is-hidden{background:#080c14;color:transparent;border-color:#080c14;box-shadow:0 4px 0 #030509}
      #flashcardsPage .flash-option.is-correct{background:#246e4b;border-color:#57c28b;color:#fff}
      #flashcardsPage .flash-option.is-wrong{background:#873c45;border-color:#e27c84;color:#fff}
      .flash-overlay-root .flash-review-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
      .flash-overlay-root .flash-review-tab{border:1px solid #3c4960;border-radius:99px;padding:8px 14px;background:#202a3a;color:#e6edfb}
      .flash-overlay-root .flash-review-tab[aria-selected=true]{background:#344e77}
      .flash-overlay-root .flash-review-layout{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .flash-overlay-root .flash-review-list button{width:100%;text-align:left;margin:5px 0;padding:11px;border-radius:10px;background:#242e40;border:1px solid #3c4a60;color:#eef3ff}
      .flash-overlay-root .flash-review-detail{background:#202a3a;border:1px solid #3b4a62;border-radius:14px;padding:16px;animation:flashSlideIn .22s ease-out}
      #flashcardsPage .flash-banner{position:relative;padding-right:30px;display:flex;align-items:center;justify-content:space-between;gap:18px}
      #flashcardsPage .flash-banner-copy{flex:1;min-width:0}
      #flashcardsPage .flash-banner .learning-help-button{position:static;top:auto;right:auto;margin:0;flex:0 0 auto}
      #flashcardsPage .flash-recall-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
      #flashcardsPage .flash-duration-controls{display:flex;align-items:center;gap:8px;flex:0 0 auto}
      #flashcardsPage .flash-duration-label{font-size:.82rem;color:var(--muted);font-weight:750;margin-right:2px}
      #flashcardsPage .flash-duration-pill{border:1px solid #536789;border-radius:999px;padding:8px 16px;background:linear-gradient(145deg,#202d43,#172235);color:#dce8ff;font-weight:800;box-shadow:0 3px 0 #080e19,0 6px 12px #0003;transition:transform .15s,filter .15s}
      #flashcardsPage .flash-duration-pill:hover{transform:translateY(-1px);filter:brightness(1.15)}
      #flashcardsPage .flash-duration-pill[aria-pressed=true]{background:linear-gradient(145deg,#526fa8,#314b79);border-color:#a9c4f5;color:#fff;box-shadow:0 3px 0 #17243c,0 7px 14px #0005}
      .flash-overlay-root .flash-modal{background:linear-gradient(155deg,#202a3b,#171d29 68%);border:1px solid #52617a;border-radius:24px;padding:26px;box-shadow:0 28px 90px #000b,inset 0 1px 0 #ffffff12}
      .flash-overlay-root .flash-modal h2{margin:0 0 10px;font-size:1.45rem;letter-spacing:-.02em;color:#f5f8ff}
      .flash-overlay-root .flash-modal .flash-muted{line-height:1.55;color:#b9c6da}
      .flash-overlay-root .flash-modal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 14px;margin:18px 0}
      .flash-overlay-root .flash-modal-grid label{margin:0;font-size:.88rem;font-weight:750;color:#dbe5f5}
      .flash-overlay-root .flash-modal select{appearance:none;min-height:46px;padding:11px 40px 11px 13px;border:1px solid #566987;border-radius:12px;background-color:#111a2a;background-image:linear-gradient(45deg,transparent 50%,#cbd9f2 50%),linear-gradient(135deg,#cbd9f2 50%,transparent 50%),linear-gradient(145deg,#172236,#101722);background-position:calc(100% - 17px) 19px,calc(100% - 11px) 19px,0 0;background-size:6px 6px,6px 6px,100% 100%;background-repeat:no-repeat;color:#fff;font-weight:650;box-shadow:inset 0 1px 2px #0006;cursor:pointer}
      .flash-overlay-root .flash-modal select:focus-visible{outline:3px solid #9dbbff;outline-offset:2px;border-color:#c5d8ff}
      .flash-overlay-root .flash-modal-actions button{min-height:44px;padding:10px 20px;font-weight:800;transition:transform .15s,filter .15s,box-shadow .15s}
      .flash-overlay-root .flash-modal-actions button:hover{transform:translateY(-1px);filter:brightness(1.12)}
      .flash-overlay-root .flash-modal-actions .flash-primary{border:1px solid #91b4f5;background:linear-gradient(145deg,#4f70ad,#304c80);color:#fff;border-radius:999px;box-shadow:0 4px 0 #182d51,0 8px 16px #0005}
      .flash-overlay-root .flash-modal-actions .flash-secondary{border:1px solid #56647a;background:linear-gradient(145deg,#2c3749,#202a39);color:#e6edf8;border-radius:999px;box-shadow:0 4px 0 #111925,0 8px 16px #0004}
      .flash-overlay-root .flash-close-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid #61718b;border-radius:999px;background:linear-gradient(145deg,#2b374a,#1c2635);color:#edf3ff;padding:10px 19px;font-weight:800;box-shadow:0 4px 0 #101925,0 8px 16px #0004}
      .flash-overlay-root .flash-close-button span{font-size:1.15rem;line-height:.8}
      .flash-overlay-root .flash-result-modal{width:min(620px,100%);text-align:center;padding:28px}
      .flash-overlay-root .flash-result-modal .flash-accuracy-hero{display:grid;justify-items:center;gap:3px;margin:20px auto 22px;padding:18px 14px;width:min(260px,100%);border:1px solid #617da7;border-radius:18px;background:linear-gradient(145deg,#304b70,#1d2d45);box-shadow:inset 0 1px 0 #ffffff18}
      .flash-overlay-root .flash-result-modal .flash-accuracy-hero strong{font-size:clamp(2.8rem,8vw,4rem);line-height:1;font-weight:900;letter-spacing:-.04em;color:#fff;font-variant-numeric:tabular-nums}
      .flash-overlay-root .flash-result-modal .flash-accuracy-hero span{font-size:1rem;font-weight:800;color:#dce8ff;letter-spacing:.02em}
      .flash-overlay-root .flash-result-modal .flash-stats{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:0 0 18px}
      .flash-overlay-root .flash-result-modal .flash-stat{display:grid;align-content:center;gap:7px;min-height:92px;padding:16px 12px;background:linear-gradient(145deg,#26364e,#1b2738);border:1px solid #465a78;border-radius:15px}
      .flash-overlay-root .flash-result-modal .flash-stat strong{font-size:1.9rem;line-height:1.1;color:#fff}
      .flash-overlay-root .flash-result-modal .flash-stat span{font-size:.95rem;color:#cbd8eb}
      .flash-overlay-root .flash-result-modal .flash-modal-actions{justify-content:center}
      .flash-overlay-root .flash-review-modal .flash-modal-actions{justify-content:flex-end}
      @media(max-width:560px){.flash-overlay-root .flash-modal-grid{grid-template-columns:1fr}#flashcardsPage .flash-banner{padding-right:18px}.flash-overlay-root .flash-result-modal .flash-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.flash-overlay-root .flash-result-modal .flash-stat{min-height:82px;padding:13px 9px}}
      #flashcardsPage .flash-translation-hint{margin:10px auto 18px;padding:9px 14px;max-width:780px;border-radius:10px;background:#263b55;color:#c9ddf5;text-align:center;font-size:.95rem}
      #flashcardsPage .flash-translation-hint span{font-weight:800;color:#fff;margin-right:5px}
      #flashcardsPage .flash-banner .learning-help-button{position:static;align-self:center;margin:0;flex:0 0 auto}
      #flashcardsPage .flash-game-clock{display:inline-flex;align-items:center;justify-content:center;min-width:76px;padding:8px 15px;border-radius:12px;background:#2459a6;color:#fff;font-size:1.25rem;font-weight:850;line-height:1.1;box-shadow:0 5px 0 #14366b,0 8px 16px #0005;font-variant-numeric:tabular-nums}
      #flashcardsPage .flash-game-clock.is-warning{background:#d97706;box-shadow:0 5px 0 #92400e,0 8px 16px #0005}
      #flashcardsPage .flash-game-clock.is-danger{background:#c83232;box-shadow:0 5px 0 #7f1d1d,0 8px 16px #0005}
      .flash-times-up-backdrop{position:fixed;inset:0;z-index:11000;display:grid;place-items:center;background:#05091077;backdrop-filter:blur(9px) brightness(.55);animation:flashTimeBackdrop .25s ease-out}
      .flash-times-up-text{font-size:clamp(2.8rem,9vw,6rem);font-weight:950;letter-spacing:.04em;color:#fff;text-shadow:0 6px 0 #8b1f1f,0 12px 34px #000b;animation:flashTimeUp .6s cubic-bezier(.2,.9,.25,1.2) both}
      @keyframes flashTimeBackdrop{from{opacity:0}to{opacity:1}}
      @keyframes flashTimeUp{0%{opacity:0;transform:scale(.45) translateY(25px)}65%{opacity:1;transform:scale(1.12) translateY(-4px)}100%{opacity:1;transform:scale(1) translateY(0)}}
      #flashcardsPage .flash-memory-overlay[hidden]{display:none!important}
      .flash-overlay-root .flash-review-modal{width:min(1000px,100%);height:min(700px,calc(100dvh - 32px));min-height:min(540px,calc(100dvh - 32px));display:flex;flex-direction:column}
      .flash-overlay-root .flash-review-modal .flash-review-tabs{flex-shrink:0}
      .flash-overlay-root .flash-review-modal .flash-review-layout{flex:1;min-height:0;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
      .flash-overlay-root .flash-review-modal .flash-review-list,.flash-overlay-root .flash-review-modal #flashReviewDetail{min-height:0;overflow:auto}
      .flash-overlay-root .flash-review-modal .flash-review-tab{border:0;border-radius:12px;color:#fff;font-weight:750;box-shadow:0 4px 0 #0005,0 7px 12px #0003}
      .flash-overlay-root .flash-review-modal .flash-review-tab[data-value=word]{background:#4b91b9;box-shadow:0 4px 0 #28516b,0 7px 12px #0003}
      .flash-overlay-root .flash-review-modal .flash-review-tab[data-value=definition]{background:#2865b2;box-shadow:0 4px 0 #173d70,0 7px 12px #0003}
      .flash-overlay-root .flash-review-modal .flash-review-tab[data-value=mixed]{background:#b33f91;box-shadow:0 4px 0 #70275a,0 7px 12px #0003}
      .flash-overlay-root .flash-review-modal .flash-review-tab[data-value=sentence]{background:#7650b8;box-shadow:0 4px 0 #493176,0 7px 12px #0003}
      .flash-overlay-root .flash-review-modal .flash-review-tab[aria-selected=true]{filter:brightness(1.18);transform:translateY(-1px)}
      @media(max-width:650px){.flash-overlay-root .flash-review-modal{min-height:min(620px,calc(100dvh - 32px));height:calc(100dvh - 32px)}.flash-overlay-root .flash-review-modal .flash-review-layout{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) minmax(0,1fr)}}
      @keyframes flashSlideIn{from{transform:translateX(-18px);opacity:0}to{transform:translateX(0);opacity:1}}
      @media(max-width:650px){#flashcardsPage .flash-mode-grid{gap:8px}#flashcardsPage .flash-mode{padding:10px;min-height:78px}#flashcardsPage .flash-options{gap:8px}#flashcardsPage .flash-option{font-size:.9rem;padding:9px 6px}.flash-overlay-root .flash-review-layout{grid-template-columns:1fr}}
    `;
    document.head.appendChild(node);
  }
  function shell(){
    const coming=$(".coming-card");
    if(coming)coming.hidden=true;
    root.querySelector(".learning-page-heading")?.remove();
    let mount=$("#flashcardsApp");
    if(!mount){mount=document.createElement("div");mount.id="flashcardsApp";root.appendChild(mount);}
    return mount;
  }
  function render(){
    const mount=shell();style();
    if(course==="zh"){mount.innerHTML='<section class="flash-section"><h2>'+uiText("English course required","需要英语学习课程")+'</h2><p class="flash-muted">'+uiText("Flashcards currently support the English learning course. Switch your Learning Course to English to continue.","闪卡目前仅支持英语学习课程。请将学习课程切换为英语后继续。")+'</p></section>';return;}
    if(!currentUser){mount.innerHTML='<section class="flash-section coming-card"><h2>'+uiText("Sign in to use Flashcards","登录以使用闪卡")+'</h2><p class="flash-muted">'+uiText("Your learning progress is saved securely to your account.","你的学习进度会安全地保存到帐户中。")+'</p><button class="flash-primary" data-action="signin">'+uiText("Sign in","登录")+'</button></section>';return;}
    if(state.loading){mount.innerHTML='<section class="flash-section">'+uiText("Loading your Flashcards…","正在加载闪卡…")+'</section>';return;}
    if(state.finishing){mount.innerHTML='<section class="flash-section"><h2>'+uiText("Saving your game","正在保存游戏")+'</h2><p class="flash-muted">'+uiText("Your results are being saved securely.","正在安全地保存你的游戏结果。")+'</p></section>';return;}
    if(state.game){renderGame(mount);return;}
    const allowance=state.data.allowance||{daily_limit:3,used_count:0,remaining:3};
    const weakItems=(state.data.review_items||[]).filter(item=>item.incorrect_count>0);
    mount.innerHTML=`
      <div class="flash-home">
        <section class="flash-banner"><div class="flash-banner-copy"><h2>${uiText("Flashcards","闪卡")}</h2><p>${uiText("Sharpen your recall with quick, focused challenges. Choose a mode, set your pace, and see how much you can remember.","通过快速、专注的挑战强化记忆。选择回忆模式和节奏，看看你能记住多少内容。")}</p></div></section>
        <section class="flash-section">
          <div class="flash-recall-heading"><div><h2>${uiText("Choose your Flash Recall","选择闪卡回忆模式")}</h2><p class="flash-muted">${uiText("Four ways to strengthen your memory.","通过四种方式强化记忆。")}</p></div><div class="flash-duration-controls" role="group" aria-label="${uiText("Challenge duration","挑战时长")}"><span class="flash-duration-label">${uiText("Duration","时长")}</span><button type="button" class="flash-duration-pill" data-action="set-duration" data-value="60" aria-pressed="${state.duration===60}">60s</button><button type="button" class="flash-duration-pill" data-action="set-duration" data-value="120" aria-pressed="${state.duration===120}">120s</button></div></div>
          <div class="flash-mode-grid">
            <button class="flash-mode" data-action="open-setup" data-mode="word"><span class="flash-mode-icon">🔤</span><span>${modeLabel("word")}<small>${uiText("Recall the meaning of a word","回忆单词的中文释义")}</small></span></button>
            <button class="flash-mode" data-action="open-setup" data-mode="definition"><span class="flash-mode-icon">📘</span><span>${modeLabel("definition")}<small>${uiText("Identify the word from its meaning","根据中文释义找出英文单词")}</small></span></button>
            <button class="flash-mode" data-action="open-setup" data-mode="mixed"><span class="flash-mode-icon">🎨</span><span>${modeLabel("mixed")}<small>${uiText("Word, meaning and sentence prompts","结合单词、释义和句子进行回忆")}</small></span></button>
            <button class="flash-mode" data-action="open-setup" data-mode="sentence"><span class="flash-mode-icon">✍️</span><span>${modeLabel("sentence")}<small>${uiText("Complete a sentence with the right word","选择正确的单词完成句子")}</small></span></button>
          </div>
          <p class="flash-muted">${uiText("Daily games: ","每日游戏：")}<strong>${allowance.used_count}</strong>/${allowance.daily_limit} ${uiText("used","已使用")} · <strong>${allowance.remaining}</strong> ${uiText("remaining","剩余")}</p>
        </section>
        <section class="flash-section"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><h2>${uiText("Review weak memory","复习薄弱记忆")}</h2><p class="flash-muted">${uiText("Revisit answers you missed in previous games.","重新复习之前答错的内容。")}</p></div><button class="flash-primary" data-action="open-review">${uiText("Review weak memory","复习薄弱记忆")} (${weakItems.length})</button></div></section>
        <section class="flash-section"><h2>${uiText("Recent games","最近的游戏")}</h2>
          ${state.data.history?.length?'<div class="flash-card-list">'+state.data.history.slice(0,6).map(g=>`<div class="flash-pill">${escapeHtml(modeLabel(g.mode))} · ${escapeHtml(difficultyLabel(g.difficulty))} · ${g.correct_count}/${g.words_seen} ${uiText("correct","答对")}</div>`).join("")+'</div>':'<p class="flash-muted">'+uiText("Your completed games and scores will appear here.","已完成的游戏和分数会显示在这里。")+'</p>'}
        </section>
        <p id="flashNotice" class="flash-muted" role="status" aria-live="polite">${escapeHtml(state.notice)}</p>
      </div>`;
    const banner=mount.querySelector(".flash-banner");
    if(state.helpButton&&banner&&!banner.contains(state.helpButton))banner.appendChild(state.helpButton);
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
    let all=words();
    const common=new Set("a an the and or but if because as at by for from in into of on to with about after again all also always am are be been before between big can come could day do down each even every find first get give go good great had has have he her here him his how i if in is it just know like little long look make man many may me more most my new no not now number of old on one only other our out over people place same see she so some take than that the their them then there these they thing think this time up us use very want was way we well were what when where which who will with work would year you your".split(" "));
    if(state.cardSet==="common")all=all.filter(w=>common.has(String(w.word).toLowerCase()));
    else if(["nouns","verbs","adjectives","adverbs"].includes(state.cardSet)){
      const wanted=state.cardSet.slice(0,-1),getPos=w=>String(w.part||w.partOfSpeech||w.pos||w.type||"").toLowerCase();
      all=all.filter(w=>getPos(w).includes(wanted));
    }else if(state.cardSet==="phrases")all=all.filter(w=>String(w.word).trim().includes(" "));
    else if(state.cardSet==="terms")all=all.filter(w=>/technical vocabulary|scientific|academic|subject-specific/i.test(String(w.breakdown||"")+" "+String(w.tip||"")));
    const allCards=[...all,...state.data.cards.filter(c=>c.card_type==="custom").map(mapCustomCard)];
    if(state.collectionId==="all")return allCards;
    const selected=state.data.cards.filter(c=>c.collection_id===state.collectionId);
    const targets=selected.map(c=>{if(c.card_type==="custom")return mapCustomCard(c);const source=words().find(w=>w.word.toLowerCase()===c.dictionary_word.toLowerCase());return source?{...source,word:c.front_text,definition:c.back_text,definitionZh:c.translation_text||source.definitionZh,examples:c.example_text?[c.example_text]:source.examples,dictionary_word:c.dictionary_word,_flashCard:c}:null;}).filter(Boolean);
    const selectedKeys=new Set(targets.map(w=>w._custom?"custom:"+w._custom.id:"dict:"+String(w.dictionary_word||w.word).toLowerCase()));
    const distractors=allCards.filter(w=>!selectedKeys.has(w._custom?"custom:"+w._custom.id:"dict:"+w.word.toLowerCase())).map(w=>({...w,_flashDistractor:true}));
    return [...targets,...distractors];
  }
  function makeRound(deck){
    const seenCards=new Set(),available=deck.filter(w=>{if(!w.word||!w.definition)return false;const key=cardKey(w);if(seenCards.has(key))return false;seenCards.add(key);return true;});
    const targets=state.weakOnly?available.filter(w=>!w._flashDistractor&&state.weakKeys.has(cardKey(w))):available.filter(w=>!w._flashDistractor);
    if(!targets.length)throw new Error("There are no cards available for this recall mode.");
    if(available.length<4)throw new Error("Four distinct choices are not available for this card set.");
    const normalize=v=>String(v||"").normalize("NFKC").trim().toLocaleLowerCase();
    const modes=state.mode==="mixed"?["word","definition","sentence"]:[state.mode];
    const pools=modes.map(mode=>{
      const optionValue=w=>mode==="word"?translationFor(w):w.word;
      const viable=targets.filter(target=>{const correct=mode==="word"?translationFor(target):target.word,key=normalize(correct),d=new Set();for(const c of available){if(c===target)continue;const k=normalize(optionValue(c));if(k&&k!==key)d.add(k);}return d.size>=3;});
      return {mode,viable,fresh:viable.filter(item=>!state.usedQuestionKeys.has(cardKey(item)))};
    }).filter(pool=>pool.viable.length);
    if(!pools.length)throw new Error("This card set does not contain four distinct choices for any recall mode.");
    const freshPools=pools.filter(pool=>pool.fresh.length);
    // Never recycle a question within one challenge. A small custom collection
    // may run out before the timer; in that case the game waits for the timer
    // and shows a clear message instead of repeating earlier questions.
    if(!freshPools.length)return null;
    const chosenPool=freshPools[Math.floor(Math.random()*freshPools.length)];
    const mode=chosenPool.mode,viable=chosenPool.viable,questionPool=chosenPool.fresh.length?chosenPool.fresh:viable;
    const target=questionPool[Math.floor(Math.random()*questionPool.length)];
    const optionValue=w=>mode==="word"?translationFor(w):w.word;
    state.usedQuestionKeys.add(cardKey(target));
    let memory="",prompt="",correct="";
    if(mode==="word"){memory=target.word;prompt=uiText("Choose the correct meaning","请选择正确的中文释义");correct=translationFor(target);}
    else if(mode==="definition"){memory=translationFor(target);prompt=uiText("Which word matches this meaning?","哪个英文单词符合这个释义？");correct=target.word;}
    else{const sentence=(target.examples||[])[0]||("I want to "+target.word+" today.");const index=sentence.toLowerCase().indexOf(target.word.toLowerCase());memory=index>=0?sentence.slice(0,index)+"_____"+sentence.slice(index+target.word.length):sentence+" _____";prompt=uiText("Which word completes the sentence?","哪个单词最适合填入句子？");correct=target.word;}
    const key=normalize(correct),distinct=new Map();for(const c of available){if(c===target)continue;const value=optionValue(c),k=normalize(value);if(k&&k!==key&&!distinct.has(k))distinct.set(k,c);}
    const distractors=[...distinct.values()];for(let i=distractors.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[distractors[i],distractors[j]]=[distractors[j],distractors[i]];}
    const chosen=[target,...distractors.slice(0,3)];for(let i=chosen.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[chosen[i],chosen[j]]=[chosen[j],chosen[i]];}
    return {target,mode,memory,prompt,correct,translationHint:mode==="sentence"?translationFor(target):"",options:chosen.map(optionValue)};
  }
  function durationLabel(n){return Number(n.toFixed(1))+"s";}
  function clearTimers(){clearTimeout(state.gameTimer);clearTimeout(state.phaseTimer);state.gameTimer=null;state.phaseTimer=null;}
  function renderGame(mount){
    const duration=state.game.durationSeconds||state.duration||60;
    const elapsed=Math.max(0,duration-(Date.now()-state.game.startedAt)/1000),remain=Math.max(0,duration-elapsed),round=state.round;
    const activeModeLabel=modeLabel(state.mode),activeDifficulty=difficultyLabel(state.difficulty);
    const translationHint=round?.mode==="sentence"&&state.game.translationLanguage==="zh"&&round.translationHint?'<p class="flash-translation-hint"><span>中文释义：</span>'+escapeHtml(round.translationHint)+'</p>':"";
    mount.innerHTML=`<section class="flash-game">
      <div class="flash-game-top"><span class="flash-pill">${activeModeLabel} · ${activeDifficulty}</span><strong id="flashGameClock" class="flash-game-clock">${Math.ceil(remain)}s</strong></div>
      
      <div class="flash-memory" id="flashMemory">${escapeHtml(round?.memory||uiText("Get ready","准备开始"))}</div>${translationHint}
      <div id="flashMemoryOverlay" class="flash-memory-overlay" ${state.phase==="answer"?"":"hidden"}>${uiText("Pick your answers","请选择答案")}</div>
      <div class="flash-gauge-row"><div class="flash-round-gauge"><span class="memory" id="flashMemoryGauge" style="width:100%"></span><span class="answer" id="flashAnswerGauge" style="width:0%"></span></div><button type="button" id="flashPhaseAction" class="flash-phase-action" data-action="phase-action">${uiText("Answer now","立即作答")}</button></div>
      <p id="flashQuestion" class="flash-game-status">${state.phase==="answer"?escapeHtml(round?.prompt||""):uiText("Memorise the card","请记住卡片内容")}</p>
      <div class="flash-options" id="flashOptions">${(round?.options||["","","",""]).map((o,i)=>`<button class="flash-option ${state.phase==="memory"?"is-hidden":""}" data-action="answer" data-index="${i}" ${state.phase!=="answer"?"disabled":""}>${state.phase==="memory"?uiText("Hidden answer","隐藏答案"):escapeHtml(o)}</button>`).join("")}</div>
      <p id="flashPhaseLabel" class="flash-game-status">${state.phase==="memory"?uiText("Memorise the card","请记住卡片内容"):state.phase==="answer"?uiText("Pick your answers","请选择答案"):uiText("Round feedback","本轮反馈")}</p>
      <div class="flash-stats"><div class="flash-stat"><strong>${state.results.length}</strong><span>${uiText("Attempted","已作答")}</span></div><div class="flash-stat"><strong>${state.results.filter(r=>r.correct).length}</strong><span>${uiText("Correct","正确")}</span></div><div class="flash-stat"><strong>${state.results.filter(r=>!r.correct).length}</strong><span>${uiText("Incorrect","错误")}</span></div></div>
      <button class="flash-secondary" data-action="leave-game">${uiText("Leave game","退出游戏")}</button>
    </section>`;
  }
  function tickGame(){
    if(!state.game)return;
    const duration=state.game.durationSeconds||state.duration||60;
    const remain=Math.max(0,duration-(Date.now()-state.game.startedAt)/1000);
    const clock=$("#flashGameClock");
    if(clock){clock.textContent=Math.ceil(remain)+"s";clock.classList.toggle("is-warning",remain<=20&&remain>10);clock.classList.toggle("is-danger",remain<=10);}
    const elapsed=Date.now()-state.phaseStartedAt,ratio=Math.max(0,Math.min(1,1-elapsed/(state.phaseDuration||1)));
    const mg=$("#flashMemoryGauge"),ag=$("#flashAnswerGauge");
    if(mg)mg.style.width=(state.phase==="memory"?ratio*100:0)+"%";
    if(ag)ag.style.width=(state.phase==="answer"?ratio*100:0)+"%";
    if(remain<=0){finishGame();return;}state.gameTimer=setTimeout(tickGame,80);
  }
  function showMemory(){
    if(!state.game)return;if(Date.now()-state.game.startedAt>=(state.game.durationSeconds||state.duration||60)*1000){finishGame();return;}
    try{state.round=makeRound(state.deck);}catch(e){state.notice=e.message;finishGame();return;}
    const memory=$("#flashMemory"),label=$("#flashPhaseLabel"),options=$("#flashOptions"),question=$("#flashQuestion"),overlay=$("#flashMemoryOverlay");
    if(!state.round){
      state.phase="exhausted";state.phaseStartedAt=Date.now();state.phaseDuration=1;
      if(memory){memory.classList.remove("is-blurred");memory.textContent=uiText("All unique questions completed","已完成所有不重复题目");}
      if(overlay)overlay.hidden=true;
      if(label)label.textContent=uiText("You have completed every unique question in this card set. Your results will appear when the challenge ends.","你已完成此卡片范围内所有不重复题目。挑战结束后将显示成绩。");
      if(question)question.textContent="";
      if(options)options.innerHTML="";
      return;
    }
    state.roundRecorded=false;state.phase="memory";state.phaseStartedAt=Date.now();state.phaseDuration=state.memory*1000;
    if(memory){memory.classList.remove("is-blurred");memory.textContent=state.round.memory;}
    if(overlay)overlay.hidden=true;if(label)label.textContent=uiText("Memorise the card","请记住卡片内容");
    const phaseAction=$("#flashPhaseAction");if(phaseAction){phaseAction.hidden=false;phaseAction.disabled=false;phaseAction.textContent=uiText("Answer now","立即作答");}
    if(options)options.innerHTML=state.round.options.map((o,i)=>`<button class="flash-option is-hidden" data-action="answer" data-index="${i}" disabled>Hidden answer</button>`).join("");
    if(question)question.textContent=state.round.prompt;
    state.phaseTimer=setTimeout(showAnswers,state.phaseDuration);
  }
  function showAnswers(){
    if(!state.game)return;clearTimeout(state.phaseTimer);state.phaseTimer=null;if(Date.now()-state.game.startedAt>=(state.game.durationSeconds||state.duration||60)*1000){finishGame();return;}
    state.phase="answer";state.phaseStartedAt=Date.now();state.phaseDuration=state.answer*1000;
    const memory=$("#flashMemory"),label=$("#flashPhaseLabel"),options=$("#flashOptions"),question=$("#flashQuestion"),overlay=$("#flashMemoryOverlay");
    const phaseAction=$("#flashPhaseAction");if(phaseAction){phaseAction.hidden=true;phaseAction.disabled=true;}
    if(memory)memory.classList.add("is-blurred");if(overlay)overlay.hidden=false;
    if(label)label.textContent=uiText("Pick your answers","请选择答案");if(overlay)overlay.textContent=uiText("Pick your answers","请选择答案");if(question)question.textContent=state.round.prompt;
    if(options)options.innerHTML=state.round.options.map((o,i)=>`<button class="flash-option" data-action="answer" data-index="${i}">${escapeHtml(o)}</button>`).join("");
    state.phaseTimer=setTimeout(()=>recordAnswer(false,true),state.phaseDuration);
  }
  function recordAnswer(correct,unanswered=false){
    if(!state.game||state.phase!=="answer")return;clearTimeout(state.phaseTimer);
    state.results.push({card_key:cardKey(state.round.target),mode:state.mode,correct:!!correct,unanswered:!!unanswered});state.roundRecorded=true;
    const limits=timingFor(state.mode,state.difficulty);
    state.memory=Math.max(limits.memoryFloor,Number((state.memory-REDUCTION_STEP).toFixed(2)));
    state.answer=Math.max(limits.answerFloor,Number((state.answer-REDUCTION_STEP).toFixed(2)));
    state.phase="feedback";state.phaseStartedAt=Date.now();state.phaseDuration=3000;
    const phaseAction=$("#flashPhaseAction");if(phaseAction){phaseAction.hidden=false;phaseAction.disabled=false;phaseAction.textContent=uiText("Next","下一题");}
    const memory=$("#flashMemory"),overlay=$("#flashMemoryOverlay"),label=$("#flashPhaseLabel"),options=$("#flashOptions"),question=$("#flashQuestion");
    if(memory){memory.classList.remove("is-blurred");memory.textContent=state.round.memory;}if(overlay)overlay.hidden=true;
    if(label)label.textContent=unanswered?uiText("Time expired","答题时间已结束"):correct?uiText("Correct!","回答正确！"):uiText("Not quite","再试一次");
    if(question)question.textContent=uiText("Correct answer: ","正确答案：")+state.round.correct;
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
      state.usedQuestionKeys.clear();
      if(!makeRound(deck))throw new Error("This card set has no unused questions available. Choose another card set and try again.");
      state.usedQuestionKeys.clear();
      state.round=null;state.phase="idle";state.phaseEnds=0;state.ending=false;
      const {data,error}=await supabaseClient.rpc("start_my_flashcard_game",{p_mode:state.mode,p_difficulty:state.difficulty,p_duration_seconds:state.duration});
      if(error)throw error;
      state.game={id:data.session_id,startedAt:Date.now(),translationLanguage,durationSeconds:Number(data.duration_seconds)||state.duration};
      state.results=[];state.roundIndex=0;
      const schedule=timingFor(state.mode,state.difficulty);
      Object.assign(state,{memory:schedule.memory,answer:schedule.answer});
      render();tickGame();showMemory();
    }catch(error){state.deck=null;throw error;}
    finally{state.starting=false;if(startButton?.isConnected)startButton.disabled=false;}
  }
  function finishGame(){
    if(!state.game||state.finishing||state.ending)return;
    state.ending=true;clearTimers();
    if(state.round&&!state.roundRecorded){state.results.push({card_key:cardKey(state.round.target),mode:state.mode,correct:false,unanswered:true});state.roundRecorded=true;}
    overlayRoot.innerHTML='<div class="flash-times-up-backdrop" role="status" aria-live="assertive"><div class="flash-times-up-text">'+uiText("Time's Up!","时间到！")+'</div></div>';
    setTimeout(()=>saveGameResults(),2000);
  }
  async function saveGameResults(){
    if(!state.game||state.finishing)return;
    const game=state.game;state.game=null;state.finishing=true;render();
    try{
      const {data,error}=await supabaseClient.rpc("complete_my_flashcard_game",{p_session_id:game.id,p_results:state.results});if(error)throw error;
      state.lastResult=data;state.finishing=false;await loadData();showResultPrompt();
    }catch(error){state.notice="The game result could not be saved: "+error.message;try{await supabaseClient.rpc("abandon_my_flashcard_game",{p_session_id:game.id});}catch(_){}state.finishing=false;await loadData();}
  }
  function showResultPrompt(){
    const mount=overlayRoot;if(!mount)return;
    const r=state.lastResult||{},attempted=Number(r.words_seen)||state.results.length,correct=Number(r.correct_count)||state.results.filter(x=>x.correct).length,incorrect=Number(r.incorrect_count)||state.results.filter(x=>!x.correct).length,accuracy=attempted?Math.round(correct/attempted*100):0;
    mount.innerHTML=`<div class="flash-modal-backdrop"><section class="flash-modal flash-result-modal" role="dialog" aria-modal="true" aria-labelledby="flashResultTitle"><h2 id="flashResultTitle">${uiText("Your game results","本次游戏结果")}</h2><p class="flash-muted">${uiText("Your "+state.duration+"-second Flash Recall summary.","本次"+state.duration+"秒限时回忆挑战总结。")}</p><div class="flash-accuracy-hero"><strong>${accuracy}%</strong><span>${uiText("Accuracy","正确率")}</span></div><div class="flash-stats"><div class="flash-stat"><strong>${attempted}</strong><span>${uiText("Attempted","已作答")}</span></div><div class="flash-stat"><strong>${correct}</strong><span>${uiText("Correct","正确")}</span></div><div class="flash-stat"><strong>${incorrect}</strong><span>${uiText("Incorrect","错误")}</span></div></div><p class="flash-muted">${uiText("Unanswered: ","未作答：")}${Number(r.unanswered_count)||0}</p><div class="flash-modal-actions"><button class="flash-close-button" data-action="close-result"><span aria-hidden="true">×</span> ${uiText("Close","关闭")}</button></div></section></div>`;
  }
  function openSetupPrompt(mode){
    state.mode=mode;const overlay=overlayRoot;if(!overlay)return;
    const sets=[["all",uiText("All available words","所有可用单词")],["common",uiText("Common words","常用词")],["nouns",uiText("Nouns","名词")],["verbs",uiText("Verbs","动词")],["adjectives",uiText("Adjectives","形容词")],["adverbs",uiText("Adverbs","副词")],["phrases",uiText("Everyday phrases","日常短语")],["terms",uiText("Subject terms","学科术语")]];
    overlay.innerHTML=`<div class="flash-modal-backdrop"><section class="flash-modal" role="dialog" aria-modal="true" aria-labelledby="flashSetupTitle"><h2 id="flashSetupTitle">${modeLabel(mode)}</h2><p class="flash-muted">${uiText("Your selected challenge duration is shown beside the recall modes. Memory and answer windows become shorter after every round, including incorrect answers and timeouts.","挑战时长已在回忆模式旁显示。每完成一轮后，记忆和答题时间都会缩短，包括答错或超时。")}</p><div class="flash-modal-grid"><label>${uiText("Difficulty","难度")}<select id="flashDifficulty"><option value="beginner">${difficultyLabel("beginner")}</option><option value="intermediate">${difficultyLabel("intermediate")}</option><option value="advanced">${difficultyLabel("advanced")}</option></select></label><label>${uiText("Card set","卡片范围")}<select id="flashGameCollection">${sets.map(([v,l])=>`<option value="${v}" ${state.cardSet===v?"selected":""}>${l}</option>`).join("")}</select></label></div><p class="flash-muted">${uiText("Beginner starts with longer memory and answer windows. Intermediate and Advanced reduce the time more quickly.","初级提供较长的记忆和答题时间；中级和高级的时间缩短速度更快。")}</p><div class="flash-modal-actions"><button class="flash-secondary" data-action="close-overlay">${uiText("Cancel","取消")}</button><button class="flash-primary" data-action="begin-game">${uiText("Begin","开始")}</button></div></section></div>`;
  }
  function openReviewPrompt(){
    state.reviewMode="word";state.reviewSelected=null;renderReviewPrompt();
  }
  function renderReviewPrompt(){
    const overlay=overlayRoot;if(!overlay)return;
    const labels={word:uiText("Word","单词"),definition:uiText("Definition","释义"),mixed:uiText("Mixed","混合"),sentence:uiText("Sentence","句子")};
    const previousListScroll=overlay.querySelector(".flash-review-list")?.scrollTop||0;
    const previousDetailScroll=overlay.querySelector("#flashReviewDetail")?.scrollTop||0;
    const items=(state.data.review_items||[]).filter(item=>item.mode===state.reviewMode);
    const selected=items.find(item=>item.card_key===state.reviewSelected);
    const resolve=key=>{if(key.startsWith("dict:"))return words().find(w=>w.word.toLowerCase()===key.slice(5));const c=state.data.cards.find(x=>cardKey(x)===key);return c?mapCustomCard(c):null;};
    const card=selected?resolve(selected.card_key):null;
    const detail=card?`<div class="flash-review-detail"><h3>${escapeHtml(card.word)}</h3><p>${escapeHtml(translationFor(card))}</p>${card.examples?.[0]?`<p><em>${escapeHtml(card.examples[0])}</em></p>`:""}</div>`:'<p class="flash-muted">'+uiText("Select an answer to review its meaning and example. Reviewing does not start a game or affect your allowance.","选择答案以查看释义和例句。复习不会开始游戏，也不会消耗每日次数。")+'</p>';
    overlay.innerHTML=`<div class="flash-modal-backdrop"><section class="flash-modal flash-review-modal" role="dialog" aria-modal="true" aria-labelledby="flashReviewTitle"><h2 id="flashReviewTitle">${uiText("Review weak memory","复习薄弱记忆")}</h2><div class="flash-review-tabs">${Object.entries(labels).map(([id,label])=>`<button class="flash-review-tab" data-action="review-tab" data-value="${id}" aria-selected="${state.reviewMode===id}">${label}${uiText(" Recall","回忆")}</button>`).join("")}</div><div class="flash-review-layout"><div class="flash-review-list">${items.length?items.map(item=>{const c=resolve(item.card_key);return `<button data-action="review-detail" data-value="${escapeHtml(item.card_key)}">${escapeHtml(c?.word||c?.front_text||item.card_key)}</button>`;}).join(""):'<p class="flash-muted">'+uiText("No incorrect answers in this recall mode yet.","此回忆模式目前没有答错记录。")+'</p>'}</div><div id="flashReviewDetail">${detail}</div></div><div class="flash-modal-actions"><button class="flash-close-button" data-action="close-overlay"><span aria-hidden="true">×</span> ${uiText("Close","关闭")}</button></div></section></div>`;
    const list=overlay.querySelector(".flash-review-list"),detailPanel=overlay.querySelector("#flashReviewDetail");
    if(list)list.scrollTop=previousListScroll;
    if(detailPanel)detailPanel.scrollTop=previousDetailScroll;
  }
  async function loadData(){
    if(!currentUser||!supabaseClient)return;
    state.loading=true;render();
    const {data,error}=await supabaseClient.rpc("get_my_flashcard_data");
    state.loading=false;
    if(error){state.notice="Flashcards could not load: "+error.message;render();return;}
    state.data=data||{collections:[],cards:[],mastery:[],history:[],review_items:[]};state.ready=true;render();
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
  function closeOverlay(){if(overlayRoot)overlayRoot.innerHTML="";}
  async function handleClick(event){
    const button=event.target.closest("[data-action]");if(!button)return;
    const action=button.dataset.action,value=button.dataset.value;
    try{
      if(action==="signin"){document.getElementById("menuSignIn")?.click();return;}
      if(action==="open-setup"){openSetupPrompt(button.dataset.mode);return;}
      if(action==="set-duration"){state.duration=Number(value)===120?120:60;render();return;}
      if(action==="close-overlay"){closeOverlay();return;}
      if(action==="close-result"){closeOverlay();state.lastResult=null;state.results=[];render();return;}
      if(action==="begin-game"){state.difficulty=overlayRoot.querySelector("#flashDifficulty").value;state.cardSet=overlayRoot.querySelector("#flashGameCollection").value;state.collectionId="all";state.weakOnly=false;state.weakKeys.clear();closeOverlay();await startGame();return;}
      if(action==="open-review"){openReviewPrompt();return;}
      if(action==="review-tab"){state.reviewMode=value;state.reviewSelected=null;renderReviewPrompt();return;}
      if(action==="review-detail"){state.reviewSelected=value;renderReviewPrompt();return;}
      if(action==="mode"){state.mode=value;render();return;}
      if(action==="select-collection"){state.collectionId=value;render();return;}
      if(action==="start-game"){await startGame();return;}
      if(action==="answer"){state.selectedAnswerIndex=Number(button.dataset.index);recordAnswer(state.round.options[state.selectedAnswerIndex]===state.round.correct,false);return;}
      if(action==="phase-action"){
        if(state.phase==="memory"){showAnswers();return;}
        if(state.phase==="feedback"){clearTimeout(state.phaseTimer);state.phaseTimer=null;showMemory();return;}
      }
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
  overlayRoot.addEventListener("click",handleClick);
  attachForms();
  document.getElementById("flashDifficulty")?.addEventListener("change",e=>state.difficulty=e.target.value);
  window.addEventListener("swift-auth-updated",()=>{state.game=null;clearTimers();if(currentUser)loadData();else render();});
  const originalFlashShowPage=window.showPage;
  document.querySelectorAll('[data-page="flashcards"]').forEach(button=>button.addEventListener("click",()=>{if(currentUser&&!state.ready)loadData();else render();}));
  window.addEventListener("hashchange",()=>{if(location.hash==="#flashcards"&&currentUser)loadData();});
  const timerApi={
    config:timing,
    reductionStep:REDUCTION_STEP,
    next(memory,answer,difficulty,mode="word"){
      const t=timingFor(mode,difficulty);
      return {memory:Math.max(t.memoryFloor,Number((memory-REDUCTION_STEP).toFixed(2))),answer:Math.max(t.answerFloor,Number((answer-REDUCTION_STEP).toFixed(2)))};
    }
  };
  timerApi.openReviewFromDashboard=async()=>{if(!currentUser)return;if(!state.ready)await loadData();openReviewPrompt();};
  timerApi.refreshDashboardData=async()=>{if(currentUser)await loadData();};
  timerApi.refreshTranslation=()=>{
    if(state.game)return; // Keep the language snapshot stable during an active challenge.
    if(overlayRoot.querySelector("#flashReviewTitle"))renderReviewPrompt();
    else if(overlayRoot.querySelector("#flashResultTitle"))showResultPrompt();
    else if(overlayRoot.querySelector("#flashSetupTitle"))openSetupPrompt(state.mode);
    else render();
  };
  window.SwiftDictionaryFlashcards=timerApi;
  render();
  if(currentUser)loadData();
})();