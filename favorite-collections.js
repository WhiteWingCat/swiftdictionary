/* SwiftDictionary U2.9.0 — Favorite Collections.
 * Loaded after the main application script. All data access is user-scoped and RLS-backed.
 */
(() => {
  "use strict";
  if (window.SWIFT_FAVORITE_COLLECTIONS_READY) return;
  window.SWIFT_FAVORITE_COLLECTIONS_READY = true;
  const COLLECTIONS = "favorite_collections";
  const ITEMS = "favorite_collection_items";
  const WORDS = "saved_words";
  let client = null;
  let activeUser = null;
  let panel = null;
  let overlay = null;
  let currentCollection = null;
  let realtimeChannel = null;
  let refreshSequence = 0;

  const getClient = () => {
    if (window.supabaseClient) return window.supabaseClient;
    try { if (typeof supabaseClient !== "undefined") return supabaseClient; } catch {}
    return client;
  };
  const getUser = () => {
    if (window.currentUser) return window.currentUser;
    try { if (typeof currentUser !== "undefined") return currentUser; } catch {}
    return activeUser;
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (label, action, className = "fc-button") => {
    const node = el("button", className, label);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  };
  const after = (node, anchor) => anchor.parentNode.insertBefore(node, anchor.nextSibling);

  function styles() {
    if (document.getElementById("swiftFavoriteCollectionsStyles")) return;
    const style = el("style");
    style.id = "swiftFavoriteCollectionsStyles";
    style.textContent = `
      #swiftFavoriteCollections{margin:18px 0;padding:18px;border:1px solid var(--border,#384152);border-radius:14px;background:var(--panel,#171c25);color:var(--text,#f4f6fa)}
      #swiftFavoriteCollections .fc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
      #swiftFavoriteCollections h3{margin:0;font-size:1.08rem}
      #swiftFavoriteCollections .fc-muted{color:var(--muted,#aab2c0);font-size:.9rem}
      #swiftFavoriteCollections .fc-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;margin-top:14px}
      #swiftFavoriteCollections .fc-folder{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0;padding:12px;border:1px solid var(--border,#384152);border-radius:11px;background:rgba(255,255,255,.025);text-align:left;color:inherit}
      #swiftFavoriteCollections .fc-folder:hover{border-color:var(--accent,#7fa9df)}
      #swiftFavoriteCollections .fc-folder strong{overflow-wrap:anywhere}
      #swiftFavoriteCollections button{cursor:pointer}
      #swiftFavoriteCollections .fc-button,.fc-dialog button{border:1px solid var(--border,#485366);border-radius:9px;padding:8px 12px;background:var(--panel,#202735);color:inherit;font:inherit}
      #swiftFavoriteCollections .fc-primary,.fc-dialog .fc-primary{background:var(--accent,#4679b9);border-color:var(--accent,#4679b9);color:#fff;font-weight:700}
      #swiftFavoriteCollections .fc-button:focus-visible,.fc-dialog button:focus-visible,.fc-dialog input:focus-visible{outline:2px solid var(--accent,#8bb8ef);outline-offset:2px}
      .fc-overlay[hidden]{display:none!important}
      .fc-overlay{position:fixed;inset:0;z-index:10020;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.68);backdrop-filter:blur(5px)}
      .fc-dialog{width:min(620px,100%);max-height:min(88dvh,760px);overflow:auto;padding:22px;border:1px solid #465164;border-radius:16px;background:#171c25;color:#f4f6fa;box-shadow:0 20px 70px #0009}
      .fc-dialog h2{margin:0;font-size:1.3rem}
      .fc-dialog .fc-dialog-head{display:flex;justify-content:space-between;align-items:center;gap:12px}
      .fc-dialog p{color:#b9c2d0;line-height:1.5}
      .fc-dialog label{display:block;margin:14px 0 6px;font-size:.9rem}
      .fc-dialog input[type=text]{box-sizing:border-box;width:100%;padding:11px 12px;border:1px solid #536076;border-radius:9px;background:#10151d;color:#fff;font:inherit}
      .fc-dialog .fc-error{min-height:1.3em;color:#ffaaaa;font-size:.88rem}
      .fc-dialog .fc-actions{display:flex;justify-content:flex-end;gap:9px;flex-wrap:wrap;margin-top:16px}
      .fc-dialog .fc-word-list{display:grid;gap:8px;margin-top:12px;max-height:38dvh;overflow:auto}
      .fc-dialog .fc-word-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;border:1px solid #394456;border-radius:9px}
      .fc-dialog .fc-word-row label{display:flex;align-items:center;gap:9px;min-width:0;margin:0;overflow-wrap:anywhere}
      .fc-dialog .fc-word-row small{color:#aeb8c7}
      .fc-dialog .fc-inline-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
      .fc-dialog button:disabled{opacity:.55;cursor:wait}
      @media(max-width:520px){#swiftFavoriteCollections{padding:14px}.fc-dialog{padding:17px}.fc-overlay{padding:10px}}
    `;
    document.head.appendChild(style);
  }

  function favoriteHeading() {
    return [...document.querySelectorAll("h1,h2,h3,h4,h5")].find(n => n.textContent.trim().toLowerCase() === "favorite words");
  }

  function mount() {
    const heading = favoriteHeading();
    if (!heading || document.getElementById("swiftFavoriteCollections")) return false;
    styles();
    const section = el("div");
    section.id = "swiftFavoriteCollections";
    section.setAttribute("aria-labelledby", "swiftFavoriteCollectionsTitle");
    const head = el("div", "fc-head");
    head.append(el("h3", "", "Your collections"));
    head.firstChild.id = "swiftFavoriteCollectionsTitle";
    const create = button("＋ New folder", () => openNameDialog("create"), "fc-button fc-primary");
    create.id = "swiftFavoriteCollectionCreate";
    head.append(create);
    section.append(head);
    section.append(el("p", "fc-muted", "Organise your saved English and Chinese words into collections."));
    section.append(el("div", "fc-list"));
    const anchor = heading.closest(".profile-card,section") || heading.parentElement;
    after(section, anchor);
    panel = section;
    refresh();
    return true;
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = el("div", "fc-overlay");
    overlay.hidden = true;
    const dialog = el("div", "fc-dialog");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "fcDialogTitle");
    overlay.append(dialog);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeDialog(); });
    document.addEventListener("keydown", e => {
      if (overlay.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); closeDialog(); }
      if (e.key === "Tab") {
        const focusable = [...overlay.querySelectorAll('button:not([disabled]),input:not([disabled])')];
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    document.body.append(overlay);
    return overlay;
  }

  function showDialog(title) {
    const root = ensureOverlay();
    const dialog = root.firstChild;
    dialog.replaceChildren();
    const head = el("div", "fc-dialog-head");
    const h = el("h2", "", title);
    h.id = "fcDialogTitle";
    head.append(h, button("Close", closeDialog));
    dialog.append(head);
    root.hidden = false;
    document.body.style.overflow = "hidden";
    head.querySelector("button")?.focus();
    return dialog;
  }

  function closeDialog() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
    currentCollection = null;
    if (panel) panel.querySelector("#swiftFavoriteCollectionCreate")?.focus();
  }

  function showError(node, message) {
    node.textContent = message || "";
  }

  async function openNameDialog(mode, collection = null) {
    const dialog = showDialog(mode === "create" ? "Create a collection" : "Rename collection");
    const label = el("label", "", "Collection name");
    label.htmlFor = "fcCollectionName";
    const input = el("input");
    input.type = "text";
    input.id = "fcCollectionName";
    input.maxLength = 48;
    input.autocomplete = "off";
    input.value = collection?.name || "";
    const error = el("p", "fc-error");
    error.setAttribute("role", "alert");
    const actions = el("div", "fc-actions");
    actions.append(button("Cancel", closeDialog), button(mode === "create" ? "Create folder" : "Save name", async () => {
      const name = input.value.trim();
      if (!name) return showError(error, "Enter a collection name.");
      if (name.length > 48) return showError(error, "Use 48 characters or fewer.");
      const c = getClient(), user = getUser();
      if (!c || !user) return showError(error, "Sign in to manage collections.");
      const submit = actions.lastChild;
      submit.disabled = true;
      showError(error, "");
      try {
        const result = mode === "create"
          ? await c.from(COLLECTIONS).insert({ user_id: user.id, name }).select("id,name").single()
          : await c.from(COLLECTIONS).update({ name, updated_at: new Date().toISOString() }).eq("id", collection.id).select("id,name").single();
        if (result.error) throw result.error;
        closeDialog();
        await refresh();
        if (mode === "rename") await openCollection(result.data);
      } catch (e) {
        const msg = String(e?.message || "");
        showError(error, /unique|duplicate/i.test(msg) ? "You already have a collection with that name." : /favorite_collections_name_valid/i.test(msg) ? "Use a name between 1 and 48 characters." : "Could not save this collection. Please try again.");
        submit.disabled = false;
      }
    }, "fc-button fc-primary"));
    dialog.append(label, input, error, actions);
    input.focus();
  }

  async function refresh() {
    if (!panel) return;
    const requestSequence = ++refreshSequence;
    const list = panel.querySelector(".fc-list");
    list.replaceChildren();
    const user = getUser(), c = getClient();
    const createButton = panel.querySelector("#swiftFavoriteCollectionCreate");
    if (createButton) {
      createButton.disabled = !user;
      createButton.title = user ? "Create a collection" : "Sign in to create collections";
    }
    if (!user || !c) {
      list.append(el("p", "fc-muted", "Sign in to create and sync collections across your devices."));
      return;
    }
    list.append(el("p", "fc-muted", "Loading collections…"));
    const { data, error } = await c.from(COLLECTIONS).select("id,name,created_at").order("created_at", { ascending: true });
    if (requestSequence !== refreshSequence || getUser()?.id !== user.id || !panel?.isConnected) return;
    list.replaceChildren();
    if (error) {
      list.append(el("p", "fc-muted", "Collections could not be loaded. Check your connection and try again."));
      return;
    }
    if (!data?.length) {
      list.append(el("p", "fc-muted", "No collections yet. Create a folder to organise your Favorite words."));
      return;
    }
    const membershipResult = await c.from(ITEMS).select("collection_id");
    if (requestSequence !== refreshSequence || getUser()?.id !== user.id || !panel?.isConnected) return;
    const counts = new Map();
    if (!membershipResult.error) {
      for (const item of membershipResult.data || []) {
        counts.set(item.collection_id, (counts.get(item.collection_id) || 0) + 1);
      }
    }
    for (const collection of data) {
      const card = button("", () => openCollection(collection), "fc-folder");
      const name = el("strong", "", collection.name);
      const count = el("small", "fc-muted", membershipResult.error ? "Open folder" : `${counts.get(collection.id) || 0} words`);
      card.append(name, count);
      list.append(card);
    }
  }

  async function openCollection(collection) {
    const userId = getUser()?.id;
    if (!userId) return;
    currentCollection = collection;
    const dialog = showDialog(collection.name);
    const description = el("p", "", "Words in this folder. Removing a word here does not remove it from Favorite words.");
    dialog.append(description);
    const list = el("div", "fc-word-list");
    list.append(el("p", "fc-muted", "Loading saved words…"));
    dialog.append(list);
    const actions = el("div", "fc-inline-actions");
    actions.append(
      button("Add saved words", () => addWords(collection)),
      button("Rename", () => openNameDialog("rename", collection)),
      button("Delete folder", () => deleteCollection(collection))
    );
    dialog.append(actions);
    const c = getClient();
    const { data, error } = await c.from(ITEMS)
      .select("saved_word_id, saved_words(id,word,course)")
      .eq("collection_id", collection.id)
      .order("created_at", { ascending: true });
    if (getUser()?.id !== userId || currentCollection?.id !== collection.id || overlay?.hidden) return;
    list.replaceChildren();
    if (error) {
      list.append(el("p", "fc-muted", "Could not load this collection. Please retry."));
      return;
    }
    if (!data?.length) list.append(el("p", "fc-muted", "This collection is empty."));
    for (const row of data || []) {
      const word = row.saved_words;
      if (!word) continue;
      const line = el("div", "fc-word-row");
      const label = el("span", "", word.word);
      const meta = el("small", "", word.course === "zh" ? "Chinese" : "English");
      const left = el("div");
      left.append(label, meta);
      line.append(left, button("Remove", async () => {
        const result = await c.from(ITEMS).delete().eq("collection_id", collection.id).eq("saved_word_id", row.saved_word_id);
        if (result.error) return;
        await openCollection(collection);
      }));
      list.append(line);
    }
  }

  async function addWords(collection) {
    const userId = getUser()?.id;
    if (!userId) return;
    const dialog = showDialog("Add saved words");
    dialog.append(el("p", "", "Select any saved English or Chinese words to add to this collection."));
    const list = el("div", "fc-word-list");
    list.append(el("p", "fc-muted", "Loading your saved words…"));
    dialog.append(list);
    const error = el("p", "fc-error");
    error.setAttribute("role", "alert");
    dialog.append(error);
    const actions = el("div", "fc-actions");
    actions.append(button("Back", () => openCollection(collection)), button("Add selected", async () => {
      const selected = [...list.querySelectorAll('input[type="checkbox"]:checked')].map(input => Number(input.value));
      if (!selected.length) return showError(error, "Select at least one saved word.");
      const submit = actions.lastChild;
      submit.disabled = true;
      const c = getClient();
      const result = await c.from(ITEMS).upsert(selected.map(saved_word_id => ({ collection_id: collection.id, saved_word_id })), { onConflict: "collection_id,saved_word_id", ignoreDuplicates: true });
      if (result.error) {
        showError(error, "Could not add those words. Refresh and try again.");
        submit.disabled = false;
        return;
      }
      await openCollection(collection);
    }, "fc-button fc-primary"));
    dialog.append(actions);
    const c = getClient();
    const [{ data: words, error: wordsError }, { data: existing, error: existingError }] = await Promise.all([
      c.from(WORDS).select("id,word,course").order("id", { ascending: false }),
      c.from(ITEMS).select("saved_word_id").eq("collection_id", collection.id)
    ]);
    if (getUser()?.id !== userId || currentCollection?.id !== collection.id || overlay?.hidden) return;
    list.replaceChildren();
    if (wordsError || existingError) {
      list.append(el("p", "fc-muted", "Could not load your saved words. Please try again."));
      return;
    }
    const existingIds = new Set((existing || []).map(x => Number(x.saved_word_id)));
    const available = (words || []).filter(w => !existingIds.has(Number(w.id)));
    if (!available.length) {
      list.append(el("p", "fc-muted", words?.length ? "All your saved words are already in this collection." : "Save words in Favorite words before adding them here."));
      return;
    }
    for (const word of available) {
      const row = el("div", "fc-word-row");
      const label = el("label");
      const checkbox = el("input");
      checkbox.type = "checkbox";
      checkbox.value = String(word.id);
      const text = el("span", "", word.word);
      const lang = el("small", "", word.course === "zh" ? "Chinese" : "English");
      label.append(checkbox, text, lang);
      row.append(label);
      list.append(row);
    }
  }

  async function deleteCollection(collection) {
    const dialog = showDialog("Delete this folder?");
    dialog.append(el("p", "", `“${collection.name}” and its membership list will be deleted. Your saved words will remain in Favorite words.`));
    const error = el("p", "fc-error");
    dialog.append(error);
    const actions = el("div", "fc-actions");
    actions.append(button("Cancel", () => openCollection(collection)), button("Delete folder", async () => {
      const submit = actions.lastChild;
      submit.disabled = true;
      const result = await getClient().from(COLLECTIONS).delete().eq("id", collection.id);
      if (result.error) {
        showError(error, "Could not delete this folder. Please try again.");
        submit.disabled = false;
        return;
      }
      closeDialog();
      await refresh();
    }, "fc-button fc-primary"));
    dialog.append(actions);
  }

  function bindSync() {
    const c = getClient(), user = getUser();
    if (!c || !user) return;
    if (realtimeChannel) { try { c.removeChannel(realtimeChannel); } catch {} }
    realtimeChannel = c.channel("favorite-collections-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: COLLECTIONS, filter: "user_id=eq." + user.id }, () => refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: ITEMS }, () => refresh())
      .subscribe();
  }

  function syncAuth() {
    ++refreshSequence;
    const user = getUser();
    if (user?.id !== activeUser?.id) {
      activeUser = user || null;
      if (overlay && !overlay.hidden) closeDialog();
      if (panel) refresh();
      bindSync();
    } else if (panel) refresh();
  }

  function boot() {
    client = getClient();
    activeUser = getUser() || null;
    mount();
    const observer = new MutationObserver(() => {
      if (!panel) mount();
      else if (!panel.isConnected) { panel = null; mount(); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("swift-auth-updated", syncAuth);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
    window.addEventListener("focus", () => refresh());
    const c = getClient();
    if (c?.auth?.onAuthStateChange) {
      c.auth.onAuthStateChange((_event, session) => {
        activeUser = session?.user || null;
        if (panel) refresh();
        bindSync();
      });
    }
    bindSync();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
