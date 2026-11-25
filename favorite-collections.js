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
  const expandedCollectionIds = new Set();
  let dialogReturnFocus = null;

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
      #swiftFavoriteCollections .fc-primary,.fc-dialog .fc-primary{background:color-mix(in srgb,var(--accent,#4679b9) 68%,#171c25);border-color:color-mix(in srgb,var(--accent,#4679b9) 72%,#171c25);color:#fff;font-weight:700;box-shadow:0 3px 10px rgba(0,0,0,.24)}
      #swiftFavoriteCollections .fc-button,.fc-dialog button{box-shadow:0 2px 7px rgba(0,0,0,.18)}
      #swiftFavoriteCollections .fc-button:hover,.fc-dialog button:hover{filter:brightness(1.08)}
      #swiftFavoriteCollections .fc-folder-card{min-width:0;border:1px solid var(--border,#384152);border-radius:11px;background:rgba(255,255,255,.025);overflow:visible}
      #swiftFavoriteCollections .fc-folder-head{display:flex;align-items:center;gap:7px;padding:7px}
      #swiftFavoriteCollections .fc-folder-toggle{display:flex;align-items:center;gap:9px;flex:1;min-width:0;padding:7px;border:0;background:transparent;color:inherit;text-align:left;box-shadow:none}
      #swiftFavoriteCollections .fc-folder-toggle:hover{background:rgba(255,255,255,.045);border-radius:8px}
      #swiftFavoriteCollections .fc-folder-toggle strong{overflow-wrap:anywhere}
      #swiftFavoriteCollections .fc-folder-caret{width:1.1em;flex:none;color:var(--muted,#aab2c0);transition:transform .16s ease}
      #swiftFavoriteCollections .fc-folder-toggle[aria-expanded=true] .fc-folder-caret{transform:rotate(90deg)}
      #swiftFavoriteCollections .fc-folder-menu-wrap{position:relative;flex:none}
      #swiftFavoriteCollections .fc-menu{position:absolute;right:0;top:calc(100% + 5px);z-index:5;min-width:145px;padding:5px;border:1px solid var(--border,#485366);border-radius:10px;background:#202735;box-shadow:0 10px 28px rgba(0,0,0,.38)}
      #swiftFavoriteCollections .fc-menu[hidden]{display:none}
      #swiftFavoriteCollections .fc-menu button{display:block;width:100%;padding:8px 10px;border:0;background:transparent;text-align:left;box-shadow:none}
      #swiftFavoriteCollections .fc-menu button:hover{background:rgba(255,255,255,.08)}
      #swiftFavoriteCollections .fc-expanded{padding:0 12px 12px}
      #swiftFavoriteCollections .fc-expanded[hidden]{display:none}
      #swiftFavoriteCollections .fc-expanded-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
      #swiftFavoriteCollections .fc-word-card{display:flex;align-items:center;justify-content:space-between;gap:7px;min-width:0;padding:9px;border:1px solid var(--border,#394456);border-radius:9px;background:var(--panel-hover,#20242d);color:inherit;text-align:left;box-shadow:0 2px 7px rgba(0,0,0,.18)}
      #swiftFavoriteCollections .fc-word-card strong{overflow-wrap:anywhere}
      #swiftFavoriteCollections .fc-word-remove{flex:none;padding:3px 7px!important;box-shadow:none!important}
      #collectionAddButton{box-shadow:0 3px 10px rgba(0,0,0,.28)}
      #collectionAddButton[hidden]{display:none!important}
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
    section.append(el("p", "fc-muted", "Customize and organize any saved words to your preferences."));
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
    if (!overlay || overlay.hidden) dialogReturnFocus = document.activeElement;
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
    if (dialogReturnFocus?.isConnected) dialogReturnFocus.focus();
    else if (panel) panel.querySelector("#swiftFavoriteCollectionCreate")?.focus();
    dialogReturnFocus = null;
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
        if (mode === "rename") expandedCollectionIds.add(collection.id);
        await refresh();
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
      expandedCollectionIds.clear();
      list.append(el("p", "fc-muted", "No collections yet. Create a folder to organise your Favorite words."));
      return;
    }
    const membershipResult = await c.from(ITEMS).select("collection_id");
    if (requestSequence !== refreshSequence || getUser()?.id !== user.id || !panel?.isConnected) return;
    const counts = new Map();
    if (!membershipResult.error) {
      for (const item of membershipResult.data || []) counts.set(item.collection_id, (counts.get(item.collection_id) || 0) + 1);
    }
    const validIds = new Set(data.map(item => item.id));
    for (const id of [...expandedCollectionIds]) if (!validIds.has(id)) expandedCollectionIds.delete(id);
    for (const collection of data) renderCollection(collection, counts.get(collection.id) || 0, membershipResult.error);
  }

  function renderCollection(collection, count, countError) {
    const card = el("div", "fc-folder-card");
    const head = el("div", "fc-folder-head");
    const expanded = expandedCollectionIds.has(collection.id);
    const toggle = button("", () => {
      const isOpen = !expandedCollectionIds.has(collection.id);
      if (isOpen) expandedCollectionIds.add(collection.id);
      else expandedCollectionIds.delete(collection.id);
      toggle.setAttribute("aria-expanded", String(isOpen));
      caret.textContent = "›";
      toggle.querySelector(".fc-folder-count").textContent = countError ? "Open folder" : `${count} words`;
      content.hidden = !isOpen;
      if (isOpen) loadCollectionWords(collection, content);
    }, "fc-folder-toggle");
    toggle.setAttribute("aria-expanded", String(expanded));
    const caret = el("span", "fc-folder-caret", "›");
    caret.setAttribute("aria-hidden", "true");
    const name = el("strong", "", collection.name);
    const countLabel = el("small", "fc-muted fc-folder-count", countError ? "Open folder" : `${count} words`);
    toggle.append(caret, name, countLabel);
    const menuWrap = el("div", "fc-folder-menu-wrap");
    const menuButton = button("…", () => {
      const menu = menuWrap.querySelector(".fc-menu");
      const opening = menu.hidden;
      panel.querySelectorAll(".fc-menu").forEach(node => { node.hidden = true; });
      panel.querySelectorAll("[data-fc-menu-toggle]").forEach(node => node.setAttribute("aria-expanded", "false"));
      menu.hidden = !opening;
      menuButton.setAttribute("aria-expanded", String(opening));
    }, "fc-button");
    menuButton.setAttribute("aria-label", `More options for ${collection.name}`);
    menuButton.setAttribute("aria-haspopup", "menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.dataset.fcMenuToggle = "true";
    const menu = el("div", "fc-menu");
    menu.hidden = true;
    menu.setAttribute("role", "menu");
    const menuAction = (label, action) => {
      const item = button(label, () => { menu.hidden = true; menuButton.setAttribute("aria-expanded", "false"); action(); }, "");
      item.setAttribute("role", "menuitem");
      menu.append(item);
    };
    menuAction("Add words", () => openAddWordsDialog(collection));
    menuAction("Rename", () => openNameDialog("rename", collection));
    menuAction("Remove", () => removeCollection(collection));
    menuWrap.append(menuButton, menu);
    head.append(toggle, menuWrap);
    const content = el("div", "fc-expanded");
    content.hidden = !expanded;
    content.append(el("p", "fc-muted", "Loading saved words…"));
    card.append(head, content);
    panel.querySelector(".fc-list").append(card);
    if (expanded) loadCollectionWords(collection, content);
  }

  async function loadCollectionWords(collection, content) {
    const userId = getUser()?.id;
    if (!userId || !content?.isConnected) return;
    content.replaceChildren(el("p", "fc-muted", "Loading saved words…"));
    const c = getClient();
    const { data, error } = await c.from(ITEMS)
      .select("saved_word_id, saved_words(id,word,course)")
      .eq("collection_id", collection.id)
      .order("created_at", { ascending: true });
    if (getUser()?.id !== userId || !content.isConnected || !expandedCollectionIds.has(collection.id)) return;
    content.replaceChildren();
    if (error) {
      content.append(el("p", "fc-muted", "Could not load this collection. Please retry."));
      return;
    }
    const words = (data || []).map(row => ({ ...row, word: Array.isArray(row.saved_words) ? row.saved_words[0] : row.saved_words })).filter(row => row.word);
    if (!words.length) {
      content.append(el("p", "fc-muted", "This folder is empty. Use … to add saved words."));
      return;
    }
    const grid = el("div", "fc-expanded-grid");
    for (const row of words) {
      const line = el("div", "fc-word-card");
      const open = button("", () => window.dispatchEvent(new CustomEvent("swift-collections-open-word", {
        detail: { word: row.word.word, course: row.word.course, trigger: open }
      })), "fc-folder-toggle");
      open.setAttribute("aria-label", `Open saved word ${row.word.word}`);
      open.append(el("strong", "", row.word.word), el("small", "fc-muted", row.word.course === "zh" ? "中文" : "EN"));
      line.append(open, button("×", async () => {
        const result = await c.from(ITEMS).delete().eq("collection_id", collection.id).eq("saved_word_id", row.saved_word_id);
        if (result.error) return;
        await refresh();
      }, "fc-word-remove"));
      grid.append(line);
    }
    content.append(grid);
  }

  async function openAddWordsDialog(collection) {
    const userId = getUser()?.id;
    if (!userId) return;
    const dialog = showDialog("Add words to " + collection.name);
    dialog.append(el("p", "", "Select saved English or Chinese words to include in this folder."));
    const list = el("div", "fc-word-list");
    list.append(el("p", "fc-muted", "Loading your saved words…"));
    dialog.append(list);
    const error = el("p", "fc-error");
    error.setAttribute("role", "alert");
    dialog.append(error);
    const actions = el("div", "fc-actions");
    actions.append(button("Cancel", closeDialog), button("Add selected", async () => {
      const selected = [...list.querySelectorAll('input[type="checkbox"]:checked')].map(input => Number(input.value));
      if (!selected.length) return showError(error, "Select at least one saved word.");
      const submit = actions.lastChild;
      submit.disabled = true;
      const result = await getClient().from(ITEMS).upsert(selected.map(saved_word_id => ({ collection_id: collection.id, saved_word_id })), { onConflict: "collection_id,saved_word_id", ignoreDuplicates: true });
      if (result.error) {
        showError(error, "Could not add those words. Refresh and try again.");
        submit.disabled = false;
        return;
      }
      closeDialog();
      expandedCollectionIds.add(collection.id);
      await refresh();
    }, "fc-button fc-primary"));
    dialog.append(actions);
    const c = getClient();
    const [{ data: words, error: wordsError }, { data: existing, error: existingError }] = await Promise.all([
      c.from(WORDS).select("id,word,course").order("id", { ascending: false }),
      c.from(ITEMS).select("saved_word_id").eq("collection_id", collection.id)
    ]);
    if (getUser()?.id !== userId || overlay?.hidden) return;
    list.replaceChildren();
    if (wordsError || existingError) {
      list.append(el("p", "fc-muted", "Could not load your saved words. Please try again."));
      return;
    }
    const existingIds = new Set((existing || []).map(item => Number(item.saved_word_id)));
    if (!words?.length) {
      list.append(el("p", "fc-muted", "Save words in Favorite words before adding them here."));
      return;
    }
    for (const word of words) {
      const row = el("div", "fc-word-row");
      const label = el("label");
      const checkbox = el("input");
      checkbox.type = "checkbox";
      checkbox.value = String(word.id);
      checkbox.checked = existingIds.has(Number(word.id));
      const text = el("span", "", word.word);
      const lang = el("small", "", word.course === "zh" ? "Chinese" : "English");
      label.append(checkbox, text, lang);
      row.append(label);
      list.append(row);
    }
  }

  async function openWordCollectionsDialog(word, course) {
    const userId = getUser()?.id;
    const c = getClient();
    if (!userId || !c) {
      const dialog = showDialog("Sign in required");
      dialog.append(el("p", "", "Sign in to add saved words to your collections."));
      const signInActions = el("div", "fc-actions");
      signInActions.append(button("Close", closeDialog, "fc-button fc-primary"));
      dialog.append(signInActions);
      return;
    }
    const dialog = showDialog("Add to collection");
    dialog.append(el("p", "", `Choose the folders that should contain “${word}”.`));
    const list = el("div", "fc-word-list");
    list.append(el("p", "fc-muted", "Loading your collections…"));
    dialog.append(list);
    const error = el("p", "fc-error");
    error.setAttribute("role", "alert");
    dialog.append(error);
    const actions = el("div", "fc-actions");
    actions.append(button("Cancel", closeDialog), button("Save", async () => {
      const selected = new Set([...list.querySelectorAll('input[type="checkbox"]:checked')].map(input => input.value));
      const submit = actions.lastChild;
      submit.disabled = true;
      const savedResult = await c.from(WORDS).select("id").eq("word", word).eq("course", course);
      if (savedResult.error || !savedResult.data?.length) {
        showError(error, "This word could not be found in your saved words. Save it again and retry.");
        submit.disabled = false;
        return;
      }
      const savedWordId = savedResult.data[0].id;
      const current = await c.from(ITEMS).select("collection_id").eq("saved_word_id", savedWordId);
      if (current.error) {
        showError(error, "Could not update your collection memberships. Please retry.");
        submit.disabled = false;
        return;
      }
      const currentIds = new Set((current.data || []).map(item => item.collection_id));
      for (const collectionId of selected) {
        if (currentIds.has(collectionId)) continue;
        const add = await c.from(ITEMS).upsert({ collection_id: collectionId, saved_word_id: savedWordId }, { onConflict: "collection_id,saved_word_id", ignoreDuplicates: true });
        if (add.error) { showError(error, "Could not add this word to every selected folder. Please retry."); submit.disabled = false; return; }
      }
      for (const collectionId of currentIds) {
        if (selected.has(collectionId)) continue;
        const remove = await c.from(ITEMS).delete().eq("collection_id", collectionId).eq("saved_word_id", savedWordId);
        if (remove.error) { showError(error, "Some folder memberships could not be removed. Please retry."); submit.disabled = false; return; }
      }
      closeDialog();
      await refresh();
    }, "fc-button fc-primary"));
    dialog.append(actions);
    const [{ data: collections, error: collectionsError }, { data: savedRows, error: savedError }] = await Promise.all([
      c.from(COLLECTIONS).select("id,name").order("created_at", { ascending: true }),
      c.from(WORDS).select("id").eq("word", word).eq("course", course)
    ]);
    if (getUser()?.id !== userId || overlay?.hidden) return;
    list.replaceChildren();
    if (collectionsError || savedError) {
      list.append(el("p", "fc-muted", "Could not load your folders. Please retry."));
      return;
    }
    if (!collections?.length) {
      list.append(el("p", "fc-muted", "Create a folder in Your collections before adding saved words."));
      return;
    }
    const savedWordId = savedRows?.[0]?.id;
    if (!savedWordId) {
      list.append(el("p", "fc-muted", "This word is not synced to your account yet. Wait for Favorite words to finish syncing, then try again."));
      return;
    }
    const { data: memberships, error: membershipError } = await c.from(ITEMS).select("collection_id").eq("saved_word_id", savedWordId);
    if (membershipError) {
      list.append(el("p", "fc-muted", "Could not load the current folder memberships."));
      return;
    }
    const selectedIds = new Set((memberships || []).map(item => item.collection_id));
    for (const collection of collections) {
      const row = el("div", "fc-word-row");
      const label = el("label");
      const checkbox = el("input");
      checkbox.type = "checkbox";
      checkbox.value = collection.id;
      checkbox.checked = selectedIds.has(collection.id);
      label.append(checkbox, el("span", "", collection.name));
      row.append(label);
      list.append(row);
    }
  }

  async function removeCollection(collection) {
    const dialog = showDialog("Remove this folder?");
    dialog.append(el("p", "", `“${collection.name}” and its folder memberships will be removed. Your saved words will remain in Favorite words.`));
    const error = el("p", "fc-error");
    dialog.append(error);
    const actions = el("div", "fc-actions");
    actions.append(button("Cancel", closeDialog), button("Remove", async () => {
      const submit = actions.lastChild;
      submit.disabled = true;
      const result = await getClient().from(COLLECTIONS).delete().eq("id", collection.id);
      if (result.error) {
        showError(error, "Could not remove this folder. Please try again.");
        submit.disabled = false;
        return;
      }
      expandedCollectionIds.delete(collection.id);
      closeDialog();
      await refresh();
    }, "fc-button fc-primary"));
    dialog.append(actions);
  }

  document.addEventListener("click", event => {
    if (panel?.contains(event.target) && event.target.closest(".fc-folder-menu-wrap")) return;
    panel?.querySelectorAll(".fc-menu").forEach(node => { node.hidden = true; });
    panel?.querySelectorAll("[data-fc-menu-toggle]").forEach(node => node.setAttribute("aria-expanded", "false"));
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !panel) return;
    const openMenu = panel.querySelector(".fc-menu:not([hidden])");
    if (!openMenu) return;
    openMenu.hidden = true;
    const trigger = openMenu.parentElement?.querySelector("[data-fc-menu-toggle]");
    trigger?.setAttribute("aria-expanded", "false");
    trigger?.focus();
  });
  window.addEventListener("swift-collections-open-word-picker", event => {
    const detail = event.detail || {};
    if (detail.word && (detail.course === "en" || detail.course === "zh")) openWordCollectionsDialog(detail.word, detail.course);
  });
  window.addEventListener("swift-favorite-words-updated", () => refresh());
  window.addEventListener("swift-favorite-word-toggled", event => {
    if (event.detail?.saved === false) refresh();
  });
  function bindSync() {
    const c = getClient(), user = getUser();
    if (!c || !user) return;
    if (realtimeChannel) { try { c.removeChannel(realtimeChannel); } catch {} }
    realtimeChannel = c.channel("favorite-collections:" + user.id, { config: { private: true } })
      .on("broadcast", { event: "INSERT" }, () => refresh())
      .on("broadcast", { event: "UPDATE" }, () => refresh())
      .on("broadcast", { event: "DELETE" }, () => refresh())
      .subscribe(status => {
        if (status === "SUBSCRIBED") {
          const warning = panel?.querySelector("#swiftFavoriteCollectionsSyncStatus");
          warning?.remove();
          refresh();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          if (!panel) return;
          let warning = panel.querySelector("#swiftFavoriteCollectionsSyncStatus");
          if (!warning) {
            warning = el("p", "fc-muted");
            warning.id = "swiftFavoriteCollectionsSyncStatus";
            warning.setAttribute("role", "status");
            panel.append(warning);
          }
          warning.textContent = "Live sync is temporarily unavailable. Collections will refresh when you return to this page.";
        }
      });
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
