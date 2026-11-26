/* SwiftDictionary Update 2.6.0 account deletion and anonymous saved-word isolation.
 * Loaded after the main application script through supabase-config.js.
 */
(() => {
  "use strict";

  const ANONYMOUS_SAVED_KEY = "swiftdictionary-anonymous-saved";
  const LEGACY_SAVED_KEY = "swiftdictionary-saved";
  const isActiveLanguage = code => window.SWIFT_LANGUAGE_REGISTRY?.get(code)?.status === "active";

  function readAnonymousEntries() {
    try {
      const raw = localStorage.getItem(ANONYMOUS_SAVED_KEY);
      const parsed = JSON.parse(raw || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.map((entry) => {
        if (typeof entry === "string") return { course: "en", word: entry };
        if (entry && isActiveLanguage(entry.course) && typeof entry.word === "string") return entry;
        return null;
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  function writeAnonymousEntries(entries) {
    const unique = new Map();
    for (const entry of entries) {
      if (!entry || !isActiveLanguage(entry.course) || typeof entry.word !== "string") continue;
      unique.set(entry.course + "\u0000" + entry.word, { course: entry.course, word: entry.word });
    }
    localStorage.setItem(ANONYMOUS_SAVED_KEY, JSON.stringify([...unique.values()]));
  }

  function applyAnonymousSavedWords() {
    const entries = readAnonymousEntries();
    saved.clear();
    entries.forEach((entry) => saved.add(savedKey(entry.course, entry.word)));
    if (typeof activeWord !== "undefined" && activeWord) updateSaveButton();
    render();
  }

  function addStyles() {
    if (document.getElementById("swiftAccountDeletionStyles")) return;
    const style = document.createElement("style");
    style.id = "swiftAccountDeletionStyles";
    style.textContent = `
      .swift-delete-card{border:1px solid #704747!important}
      .swift-delete-button{border:1px solid #a65c5c!important;color:#ffb4b4!important}
      .swift-delete-overlay[hidden]{display:none!important}
      .swift-delete-overlay{position:fixed;inset:0;z-index:10050;background:rgba(0,0,0,.76);display:grid;place-items:center;padding:18px}
      .swift-delete-dialog{width:min(560px,100%);max-height:90dvh;overflow:auto;background:#191c23;color:#f3f4f6;border:1px solid #454b58;border-radius:18px;padding:24px;box-shadow:0 18px 55px rgba(0,0,0,.45)}
      .swift-delete-dialog h2{margin:0 0 12px;font-size:1.35rem}
      .swift-delete-dialog p{line-height:1.55;color:#c3c8d2}
      .swift-delete-check{display:flex;gap:10px;align-items:flex-start;margin:18px 0;padding:14px;border:1px solid #454b58;border-radius:12px}
      .swift-delete-check input{margin-top:4px;flex:0 0 auto}
      .swift-delete-warning{padding:12px;border-radius:10px;background:#3a2929;color:#ffd2d2;margin:14px 0}
      .swift-delete-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:20px}
      .swift-delete-status{min-height:1.4em;white-space:pre-wrap}
      .swift-delete-reauth{margin-top:10px}
      @media(max-width:520px){.swift-delete-dialog{padding:18px}.swift-delete-actions>*{flex:1}}
    `;
    document.head.appendChild(style);
  }

  function mountAccountDeletion() {
    const host = document.getElementById("preferencesSignedIn");
    if (!host) return;
    addStyles();
    if (!document.getElementById("accountDeletionCard")) {
      const card = document.createElement("section");
      card.id = "accountDeletionCard";
      card.className = "profile-card swift-delete-card";
      card.innerHTML = `
        <h3>Delete Account</h3>
        <p class="muted-note">Permanently delete your SwiftDictionary account and its cloud-synchronised data, including saved words, profile, preferences and learning records. This does not delete your Google account. Choose this option only when you want to close the account permanently; deleting learning history alone is a separate action.</p>
        <p class="muted-note">Other devices will lose refresh access immediately; an access token already issued to another device can remain valid until it expires.</p>
        <button type="button" id="openAccountDeletion" class="secondary-button swift-delete-button">Delete Account</button>
      `;
      const historyCard = [...host.querySelectorAll(".profile-card")].find(section => section.querySelector("h3")?.textContent.trim() === "Learning history");
      if (historyCard) host.insertBefore(card, historyCard);
      else host.appendChild(card);
    }
    if (document.getElementById("accountDeletionDialog")) return;
    const overlay = document.createElement("div");
    overlay.id = "accountDeletionDialog";
    overlay.className = "swift-delete-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="swift-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="swiftDeleteTitle">
        <h2 id="swiftDeleteTitle">Delete your account?</h2>
        <p>This permanently deletes your SwiftDictionary account and its cloud-synchronised learning data. This action cannot be undone. Your Google account will not be deleted.</p>
        <p id="swiftDeleteLocalSummary" class="muted-note"></p>
        <label id="swiftDeleteLocalOption" class="swift-delete-check" hidden>
          <input id="swiftDeleteLocalCheckbox" type="checkbox">
          <span><strong>Also clear signed-out saved words on this device</strong><br><small class="muted-note">Only the separate local saved-word collection in this browser will be cleared. Other accounts and unrelated browser data will not be affected. Unchecked by default.</small></span>
        </label>
        <div class="swift-delete-warning">Make sure you have saved anything you want to keep. Your cloud account data will be permanently deleted.</div>
        <p id="swiftDeleteStatus" class="swift-delete-status" role="status" aria-live="polite"></p>
        <button type="button" id="swiftDeleteReauth" class="secondary-button swift-delete-reauth" hidden>Sign in again with Google</button>
        <div class="swift-delete-actions">
          <button type="button" id="swiftDeleteCancel" class="secondary-button">Cancel</button>
          <button type="button" id="swiftDeleteConfirm" class="secondary-button swift-delete-button">Confirm deletion</button>
        </div>
      </section>`;
    document.body.appendChild(overlay);

    const checkbox = overlay.querySelector("#swiftDeleteLocalCheckbox");
    const option = overlay.querySelector("#swiftDeleteLocalOption");
    const status = overlay.querySelector("#swiftDeleteStatus");
    const confirm = overlay.querySelector("#swiftDeleteConfirm");
    const reauth = overlay.querySelector("#swiftDeleteReauth");

    function refreshLocalOption() {
      const count = readAnonymousEntries().length;
      option.hidden = count === 0;
      checkbox.checked = false;
      overlay.querySelector("#swiftDeleteLocalSummary").textContent = count
        ? `This browser currently has ${count} signed-out saved-word entr${count === 1 ? "y" : "ies"} stored separately from your account.`
        : "There are no signed-out local saved words to clear on this device.";
    }
    function closeDialog() {
      overlay.hidden = true;
      status.textContent = "";
      reauth.hidden = true;
      confirm.disabled = false;
      checkbox.checked = false;
    }
    function openDialog() {
      refreshLocalOption();
      status.textContent = "";
      reauth.hidden = true;
      overlay.hidden = false;
      confirm.focus();
    }
    document.getElementById("openAccountDeletion").addEventListener("click", openDialog);
    overlay.querySelector("#swiftDeleteCancel").addEventListener("click", closeDialog);
    overlay.addEventListener("click", (event) => { if (event.target === overlay) closeDialog(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !overlay.hidden) closeDialog(); });

    reauth.addEventListener("click", async () => {
      if (!supabaseClient) return;
      reauth.disabled = true;
      status.textContent = "Opening Google sign-in. Complete sign-in, then return and confirm deletion again.";
      try {
        const redirectTo = window.location.origin + window.location.pathname + "#preferences";
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo, queryParams: { prompt: "select_account" } }
        });
        if (error) status.textContent = `Could not start Google sign-in: ${error.message}`;
      } finally {
        reauth.disabled = false;
      }
    });

    confirm.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!supabaseClient || !currentUser) {
        status.textContent = "Your signed-in session is no longer available. Sign in again before retrying.";
        return;
      }
      confirm.disabled = true;
      reauth.hidden = true;
      status.textContent = "Verifying your session and deleting your account…";
      try {
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
        const session = sessionData?.session;
        if (sessionError || !session?.access_token) throw new Error("Your session could not be verified. Sign in again and retry.");

        const response = await fetch(`${window.SWIFT_SUPABASE_CONFIG.url}/functions/v1/delete-account`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "apikey": window.SWIFT_SUPABASE_CONFIG.anonKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ confirm: true })
        });
        const result = await response.json().catch(() => ({}));
        if (response.status === 401) {
          status.textContent = result.error === "reauthentication_required"
            ? "For your security, sign in again with Google before deleting your account. Your account and data have not been deleted."
            : "The server rejected this deletion request. Your account and data have not been deleted. Please sign in again before retrying.";
          reauth.hidden = false;
          overlay.hidden = false;
          return;
        }
        if (!response.ok || result.success !== true) {
          if (result.error === "deletion_failed_after_session_revocation") {
            throw new Error("Your sessions were revoked, but account deletion did not complete. Sign in again and retry.");
          }
          if (result.error === "deletion_submitted_but_unverified") {
            throw new Error("The deletion request was submitted, but the server could not verify its final status. Please contact support before retrying.");
          }
          throw new Error(`Account deletion could not be completed (${result.error || response.status}). No success was reported.`);
        }

        let localClearSucceeded = true;
        if (checkbox.checked && !option.hidden) {
          try {
            localStorage.removeItem(ANONYMOUS_SAVED_KEY);
            localStorage.removeItem(LEGACY_SAVED_KEY);
            saved.clear();
            render();
          } catch {
            localClearSucceeded = false;
          }
        }

        // The server has already revoked all refreshable sessions and deleted the Auth user.
        // Clear this browser's Supabase session locally; do not depend on a second server call.
        try { await supabaseClient.auth.signOut({ scope: "local" }); } catch { /* local sign-out may still have cleared storage */ }
        overlay.hidden = true;
        if (typeof showPage === "function") showPage("dictionary");
        const successMessage = localClearSucceeded
          ? (checkbox.checked
            ? "Your SwiftDictionary account was successfully deleted. Signed-out saved words on this device were also cleared."
            : "Your SwiftDictionary account was successfully deleted. Signed-out saved words on this device were preserved.")
          : "Your SwiftDictionary account was successfully deleted, but signed-out saved words may still remain on this device.";
        const accountStatusNode = document.getElementById("accountStatus");
        if (accountStatusNode) accountStatusNode.textContent = successMessage;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("swift-account-deleted"));
          // Render after sign-out listeners finish refreshing the page shell.
          window.setTimeout(() => {
            const previousToast = document.getElementById("swiftDictionaryDeletionSuccess");
            if (previousToast) previousToast.remove();
            const toast = document.createElement("div");
            toast.id = "swiftDictionaryDeletionSuccess";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            toast.setAttribute("aria-atomic", "true");
            toast.textContent = successMessage;
            toast.style.cssText = "position:fixed;left:50%;bottom:max(22px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:25000;width:max-content;max-width:calc(100vw - 32px);padding:13px 18px;border:1px solid #47785f;border-radius:13px;background:#1d342a;color:#f5f7fb;box-shadow:0 12px 32px #0006;text-align:center;font-size:.94rem;line-height:1.45;pointer-events:none";
            document.body.appendChild(toast);
            window.setTimeout(() => toast.remove(), 5000);
          }, 0);
        }
      } catch (error) {
        status.textContent = error?.message || "Account deletion failed. Your account has not been confirmed as deleted.";
        overlay.hidden = false;
      } finally {
        confirm.disabled = false;
      }
    });
  }

  function installAnonymousStorageIsolation() {
    // Preserve the old signed-out collection before the existing app's auth handler
    // removes the legacy key on sign-in. The anonymous key is never used as cloud data.
    try {
      if (!localStorage.getItem(ANONYMOUS_SAVED_KEY)) {
        const legacy = localStorage.getItem(LEGACY_SAVED_KEY);
        if (legacy) localStorage.setItem(ANONYMOUS_SAVED_KEY, legacy);
      }
    } catch {}

    const originalPersist = persistSaved;
    persistSaved = function persistAnonymousOrAccountSaved() {
      try {
        if (currentUser) {
          localStorage.removeItem(LEGACY_SAVED_KEY);
          return;
        }
        const entries = [...saved].map((key) => {
          const separator = key.indexOf(String.fromCharCode(0));
          return { course: key.slice(0, separator), word: key.slice(separator + 1) };
        });
        writeAnonymousEntries(entries);
        localStorage.removeItem(LEGACY_SAVED_KEY);
      } catch {
        // Keep the dictionary usable when browser storage is blocked.
        try { originalPersist(); } catch {}
      }
    };

    if (!currentUser) applyAnonymousSavedWords();
    window.addEventListener("swift-auth-updated", () => {
      if (!currentUser) applyAnonymousSavedWords();
    });
  }

  function initialise() {
    if (typeof supabaseClient === "undefined" || typeof currentUser === "undefined"
        || typeof saved === "undefined" || typeof savedKey !== "function"
        || typeof render !== "function" || typeof persistSaved !== "function") {
      console.error("SwiftDictionary account deletion could not initialise: app bindings are unavailable.");
      return;
    }
    installAnonymousStorageIsolation();
    if (currentUser) mountAccountDeletion();
    // Listen directly for INITIAL_SESSION as well: the app's first getSession()
    // is asynchronous and may finish after this module has initialised.
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) mountAccountDeletion();
    });
    window.addEventListener("swift-auth-updated", () => {
      if (currentUser) mountAccountDeletion();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();

