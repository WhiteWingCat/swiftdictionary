/* SwiftDictionary versioned What's New dialog. */
(() => {
  "use strict";
  const DATA = {
  "currentVersion": "3.0.0",
  "title": "SwiftDictionary Update 3.0.0",
  "releasedAt": "2026-11-28",
  "intro": "A major expansion bringing Malaysian Standard Malay into SwiftDictionary, alongside broader learning and review improvements.",
  "sections": {
    "added": [
      "Malaysian Standard Malay is now available as a learning and translation course, with a dedicated dictionary and expanded lesson catalogue.",
      "Malay learning support has been added across lessons, Quiz, Daily Learning and Flashcards.",
      "Daily Learning now includes expanded Topic, Application and Discovery content, plus adaptive Daily Revision.",
      "Malay Quiz content and Malay Flashcard support have been added.",
      "Flashcard review history now preserves per-card results so incorrect cards can be revisited."
    ],
    "changed": [
      "Course and translation-language selection now supports English, Simplified Chinese and Malay across the learning experience.",
      "Dictionary and learning content now use a shared multi-language content structure.",
      "Weak Memory review now loads lightweight language-specific indexes and fetches translation details only when needed."
    ],
    "fixed": [
      "Fixed Quiz not consistently refreshing when switching between English, Chinese and Malay courses.",
      "Reduced lag when opening and navigating Weak Memory review lists.",
      "Improved Flashcard review persistence and handling of older completed games."
    ],
    "removed": []
  }
};
  const TABLE = "learning_page_introduction_preferences";
  const pageKey = "release:" + DATA.currentVersion;
  const localKey = userId => "swiftdictionary-release-seen:" + (userId || "guest");
  let activeUserId = null;
  let opened = false;
  let seen = false;
  let syncToken = 0;

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\\\"":"&quot;","'":"&#39;"}[char]));
  function ensureStyles() {
    if (document.getElementById("swiftReleaseStyles")) return;
    const style = document.createElement("style"); style.id = "swiftReleaseStyles";
    style.textContent = `
      .swift-release-brand{cursor:pointer;border:0;background:transparent;color:inherit;font:inherit;text-align:left;padding:0;border-radius:10px}
      .swift-release-brand:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
      .swift-release-backdrop{position:fixed;inset:0;z-index:50000;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.76);backdrop-filter:blur(7px)}
      .swift-release-backdrop[hidden]{display:none!important}
      .swift-release-dialog{width:min(700px,100%);max-height:min(86vh,850px);overflow:auto;padding:clamp(20px,4vw,32px);border:1px solid #52658f;border-radius:20px;background:var(--panel,#191c23);color:var(--text,#f3f4f6);box-shadow:0 28px 90px #000a}
      .swift-release-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}
      .swift-release-eyebrow{color:var(--accent);font-size:.75rem;font-weight:850;letter-spacing:.12em;text-transform:uppercase}
      .swift-release-head h2{margin:5px 0 7px;font-size:clamp(1.55rem,4vw,2rem);letter-spacing:-.03em}
      .swift-release-intro{margin:0 0 18px;color:var(--muted);line-height:1.6}
      .swift-release-close{flex:0 0 auto;width:38px;height:38px;border:1px solid var(--border);border-radius:10px;background:var(--panel-hover);color:var(--text);font-size:1.35rem}
      .swift-release-section{margin:18px 0;padding:15px 17px;border:1px solid var(--border);border-radius:14px;background:var(--panel-hover)}
      .swift-release-section h3{display:flex;align-items:center;gap:9px;margin:0 0 9px;font-size:1.02rem}
      .swift-release-section ul{margin:0;padding-left:1.25rem;color:var(--muted);line-height:1.65}
      .swift-release-section li+li{margin-top:7px}
      .swift-release-section p{margin:0;color:var(--muted)}
      .swift-release-footer{display:flex;justify-content:flex-end;margin-top:22px}
      .swift-release-done{border:1px solid #7185ad;border-radius:11px;padding:10px 18px;background:linear-gradient(145deg,#526c9f,#30466e);color:#fff;font-weight:800}
      @media(max-width:520px){.swift-release-backdrop{padding:10px}.swift-release-dialog{padding:18px;border-radius:16px}.swift-release-section{padding:13px}}
    `;
    document.head.appendChild(style);
  }
  function ensureDialog() {
    if (document.getElementById("swiftReleaseBackdrop")) return;
    ensureStyles();
    const backdrop = document.createElement("div"); backdrop.id = "swiftReleaseBackdrop"; backdrop.className = "swift-release-backdrop"; backdrop.hidden = true;
    backdrop.innerHTML = `<section class="swift-release-dialog" role="dialog" aria-modal="true" aria-labelledby="swiftReleaseTitle" aria-describedby="swiftReleaseIntro">
      <div class="swift-release-head"><div><div class="swift-release-eyebrow">What’s New · Version ${escapeHTML(DATA.currentVersion)}</div><h2 id="swiftReleaseTitle">${escapeHTML(DATA.title)}</h2></div><button class="swift-release-close" type="button" aria-label="Close update notes">×</button></div>
      <p class="swift-release-intro" id="swiftReleaseIntro">${escapeHTML(DATA.intro)}</p><div id="swiftReleaseSections"></div>
      <div class="swift-release-footer"><button class="swift-release-done" type="button">Got it</button></div>
    </section>`;
    document.body.appendChild(backdrop);
    backdrop.querySelectorAll(".swift-release-close,.swift-release-done").forEach(button => button.addEventListener("click", markSeenAndClose));
    backdrop.addEventListener("click", event => { if (event.target === backdrop) markSeenAndClose(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && !backdrop.hidden) markSeenAndClose(); });
    const sections = [
      ["added","✨","Added"], ["changed","🔄","Changed"], ["fixed","🛠️","Fixed"], ["removed","🗑️","Removed"]
    ];
    document.getElementById("swiftReleaseSections").innerHTML = sections.map(([key,icon,label]) => {
      const items = DATA.sections[key] || [];
      return `<section class="swift-release-section"><h3><span aria-hidden="true">${icon}</span>${label}</h3>${items.length ? "<ul>"+items.map(item=>"<li>"+escapeHTML(item)+"</li>").join("")+"</ul>" : "<p>Nothing was removed in this update.</p>"}</section>`;
    }).join("");
  }
  function currentUserId() {
    try { return typeof currentUser !== "undefined" && currentUser?.id ? String(currentUser.id) : null; } catch { return null; }
  }
  function localSeen(userId) { try { return localStorage.getItem(localKey(userId)) === DATA.currentVersion; } catch { return false; } }
  function saveLocal(userId) { try { localStorage.setItem(localKey(userId), DATA.currentVersion); } catch {} }
  async function cloudSeen(userId) {
    try {
      if (typeof supabaseClient === "undefined" || !supabaseClient) return false;
      const {data,error} = await supabaseClient.from(TABLE).select("page_key").eq("user_id",userId).eq("page_key",pageKey).maybeSingle();
      return !error && !!data;
    } catch { return false; }
  }
  async function saveCloud(userId) {
    try {
      if (typeof supabaseClient === "undefined" || !supabaseClient) return;
      await supabaseClient.from(TABLE).upsert({user_id:userId,page_key:pageKey,dismissed_at:new Date().toISOString()},{onConflict:"user_id,page_key"});
    } catch {}
  }
  function openNotes() { ensureDialog(); opened = true; document.getElementById("swiftReleaseBackdrop").hidden = false; document.body.style.overflow = "hidden"; }
  function closeNotes() { const node=document.getElementById("swiftReleaseBackdrop"); if(node)node.hidden=true; document.body.style.overflow=""; opened=false; }
  async function markSeenAndClose() {
    const userId = activeUserId || currentUserId(); saveLocal(userId); seen = true;
    closeNotes();
    if (userId) void saveCloud(userId);
  }
  async function refreshForAccount() {
    const token = ++syncToken; const userId = currentUserId(); activeUserId = userId;
    seen = localSeen(userId);
    if (userId && !seen) { seen = await cloudSeen(userId); if (token !== syncToken) return; if (seen) saveLocal(userId); }
    if (token !== syncToken) return;
    if (!seen) openNotes();
    else if (opened) closeNotes();
  }
  function init() {
    const brand = document.querySelector(".brand");
    if (brand) {
      brand.classList.add("swift-release-brand"); brand.setAttribute("role","button"); brand.setAttribute("tabindex","0");
      brand.setAttribute("aria-label","SwiftDictionary — view latest update notes");
      brand.addEventListener("click",openNotes);
      brand.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openNotes();}});
    }
    window.addEventListener("swift-auth-updated",refreshForAccount);
    // Auth initialisation is asynchronous; this also covers guests and fast cached sessions.
    setTimeout(refreshForAccount,900);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true}); else init();
})();
