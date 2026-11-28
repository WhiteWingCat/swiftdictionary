/* SwiftDictionary versioned What's New dialog.
 * Release copy lives in data/release-notes.json; bump its currentVersion for each main release.
 */
(() => {
  "use strict";
  const DATA_URL = "data/release-notes.json?v=3.0.0-r1";
  const TABLE = "learning_page_introduction_preferences";
  let DATA = null;
  let activeUserId = null;
  let opened = false;
  let syncToken = 0;

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => {
    switch (char) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return char;
    }
  });
  const pageKey = () => "release:" + DATA.currentVersion;
  const localKey = userId => "swiftdictionary-release-seen:" + (userId || "guest");

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
    const backdrop = document.createElement("div");
    backdrop.id = "swiftReleaseBackdrop";
    backdrop.className = "swift-release-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML = `<section class="swift-release-dialog" role="dialog" aria-modal="true" aria-labelledby="swiftReleaseTitle" aria-describedby="swiftReleaseIntro">
      <div class="swift-release-head"><div><div class="swift-release-eyebrow">What’s New · Version ${escapeHTML(DATA.currentVersion)}</div><h2 id="swiftReleaseTitle">${escapeHTML(DATA.title)}</h2></div><button class="swift-release-close" type="button" aria-label="Close update notes">×</button></div>
      <p class="swift-release-intro" id="swiftReleaseIntro">${escapeHTML(DATA.intro)}</p><div id="swiftReleaseSections"></div>
      <div class="swift-release-footer"><button class="swift-release-done" type="button">Got it</button></div>
    </section>`;
    document.body.appendChild(backdrop);
    backdrop.querySelectorAll(".swift-release-close,.swift-release-done").forEach(button => button.addEventListener("click", markSeenAndClose));
    backdrop.addEventListener("click", event => { if (event.target === backdrop) markSeenAndClose(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && !backdrop.hidden) markSeenAndClose(); });
    const groups = [["added","✨","Added"],["changed","🔄","Changed"],["fixed","🛠️","Fixed"],["removed","🗑️","Removed"]];
    document.getElementById("swiftReleaseSections").innerHTML = groups.map(([key,icon,label]) => {
      const items = Array.isArray(DATA.sections?.[key]) ? DATA.sections[key] : [];
      const body = items.length
        ? "<ul>" + items.map(item => "<li>" + escapeHTML(item) + "</li>").join("") + "</ul>"
        : "<p>Nothing was removed in this update.</p>";
      return '<section class="swift-release-section"><h3><span aria-hidden="true">' + icon + "</span>" + label + "</h3>" + body + "</section>";
    }).join("");
  }
  function currentUserId() {
    try { return typeof currentUser !== "undefined" && currentUser?.id ? String(currentUser.id) : null; }
    catch { return null; }
  }
  function localSeen(userId) {
    try { return localStorage.getItem(localKey(userId)) === DATA.currentVersion; }
    catch { return false; }
  }
  function saveLocal(userId) {
    try { localStorage.setItem(localKey(userId), DATA.currentVersion); } catch {}
  }
  async function cloudSeen(userId) {
    try {
      if (typeof supabaseClient === "undefined" || !supabaseClient) return false;
      const {data,error} = await supabaseClient.from(TABLE).select("page_key").eq("user_id",userId).eq("page_key",pageKey()).maybeSingle();
      return !error && !!data;
    } catch { return false; }
  }
  async function saveCloud(userId) {
    try {
      if (typeof supabaseClient === "undefined" || !supabaseClient) return;
      await supabaseClient.from(TABLE).upsert({user_id:userId,page_key:pageKey(),dismissed_at:new Date().toISOString()},{onConflict:"user_id,page_key"});
    } catch {}
  }
  function openNotes() {
    if (!DATA) return;
    ensureDialog();
    opened = true;
    document.getElementById("swiftReleaseBackdrop").hidden = false;
    document.body.style.overflow = "hidden";
    document.querySelector(".swift-release-close")?.focus();
  }
  function closeNotes() {
    const node = document.getElementById("swiftReleaseBackdrop");
    if (node) node.hidden = true;
    document.body.style.overflow = "";
    opened = false;
  }
  function markSeenAndClose() {
    const userId = activeUserId || currentUserId();
    saveLocal(userId);
    closeNotes();
    if (userId) void saveCloud(userId);
  }
  async function refreshForAccount() {
    if (!DATA) return;
    const token = ++syncToken;
    const userId = currentUserId();
    activeUserId = userId;
    let seen = localSeen(userId);
    if (userId && !seen) {
      seen = await cloudSeen(userId);
      if (token !== syncToken) return;
      if (seen) saveLocal(userId);
    }
    if (token !== syncToken) return;
    if (!seen) openNotes();
    else if (opened) closeNotes();
  }
  async function init() {
    try {
      const response = await fetch(DATA_URL, {cache:"no-cache"});
      if (!response.ok) throw new Error("Release notes could not be loaded.");
      DATA = await response.json();
      if (!DATA.currentVersion || !DATA.title || !DATA.sections) throw new Error("Release notes manifest is incomplete.");
    } catch (error) {
      console.warn("[SwiftDictionary] What's New is unavailable:", error);
      return;
    }
    const brand = document.querySelector(".brand");
    if (brand) {
      brand.classList.add("swift-release-brand");
      brand.setAttribute("role","button");
      brand.setAttribute("tabindex","0");
      brand.setAttribute("aria-label","SwiftDictionary — view latest update notes");
      brand.addEventListener("click",openNotes);
      brand.addEventListener("keydown",event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openNotes(); }
      });
    }
    window.addEventListener("swift-auth-updated",refreshForAccount);
    refreshForAccount();
    // A delayed pass covers a cached Supabase session that resolves after the initial auth event.
    setTimeout(refreshForAccount,1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
