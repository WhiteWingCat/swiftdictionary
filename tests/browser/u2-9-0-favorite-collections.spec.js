const { test, expect } = require("@playwright/test");

async function installCollectionsFixture(page) {
  await page.addInitScript(() => {
    const db = {
      favorite_collections: [],
      favorite_collection_items: [],
      saved_words: [
        { id: 101, user_id: "test-user-a", word: "hello", course: "en" },
        { id: 102, user_id: "test-user-a", word: "你", course: "zh" },
        { id: 103, user_id: "test-user-a", word: "bioavailability", course: "en" },
        { id: 201, user_id: "test-user-b", word: "secret", course: "en" }
      ]
    };
    const activeUserId = () => window.currentUser?.id;
    class Query {
      constructor(table) { this.table = table; this.action = "select"; this.payload = null; this.filters = []; this.opts = {}; this.returning = false; this.singleRow = false; this.sort = []; this.fields = ""; }
      select(fields, opts) { this.returning = true; this.opts = opts || {}; this.fields = fields || ""; return this; }
      insert(payload) { this.action = "insert"; this.payload = payload; return this; }
      upsert(payload) { this.action = "upsert"; this.payload = payload; return this; }
      update(payload) { this.action = "update"; this.payload = payload; return this; }
      delete() { this.action = "delete"; return this; }
      eq(key, value) { this.filters.push([key, value]); return this; }
      order(key, options) { this.sort.push([key, options || {}]); return this; }
      single() { this.singleRow = true; return this; }
      then(resolve, reject) { return this.run().then(resolve, reject); }
      async run() {
        let delayedRows = null;
        let delayedSavedWords = null;
        if (this.table === "favorite_collections" && this.action === "select" && window.__delayNextCollectionRead) {
          window.__delayNextCollectionRead = false;
          await new Promise(resolve => setTimeout(resolve, 120));
        }
        if (this.table === "favorite_collection_items" && this.action === "select" && window.__delayNextMembershipRead) {
          window.__delayNextMembershipRead = false;
          delayedRows = db.favorite_collection_items.map(row => ({ ...row }));
          delayedSavedWords = db.saved_words.map(row => ({ ...row }));
          await new Promise(resolve => setTimeout(resolve, 120));
        }
        const rows = delayedRows || db[this.table];
        const matches = row => this.filters.every(([key,value]) => row[key] === value);
        const own = row => this.table === "saved_words" ? row.user_id === activeUserId()
          : this.table === "favorite_collections" ? row.user_id === activeUserId()
          : db.favorite_collections.some(collection => collection.id === row.collection_id && collection.user_id === activeUserId())
            && db.saved_words.some(word => word.id === row.saved_word_id && word.user_id === activeUserId());
        let data = [];
        let error = null;
        if (this.action === "insert" || this.action === "upsert") {
          for (const raw of (Array.isArray(this.payload) ? this.payload : [this.payload])) {
            const row = { ...raw };
            if (this.table === "favorite_collections") {
              if (row.user_id !== activeUserId()) { error = { message: "row-level security violation" }; break; }
              if (rows.some(existing => existing.user_id === activeUserId() && existing.name.toLowerCase() === row.name.toLowerCase())) { error = { message: "duplicate key unique constraint" }; break; }
              row.id = "collection-" + (rows.length + 1); row.created_at = new Date().toISOString(); rows.push(row); data.push(row);
            } else if (this.table === "favorite_collection_items") {
              const collection = db.favorite_collections.find(item => item.id === row.collection_id && item.user_id === activeUserId());
              const word = db.saved_words.find(item => item.id === row.saved_word_id && item.user_id === activeUserId());
              if (!collection || !word) { error = { message: "row-level security violation" }; break; }
              if (!rows.some(item => item.collection_id === row.collection_id && item.saved_word_id === row.saved_word_id)) {
                const inserted = { ...row, created_at: new Date().toISOString() }; rows.push(inserted); data.push(inserted);
              }
            }
          }
        } else if (this.action === "update") {
          data = rows.filter(row => own(row) && matches(row));
          for (const row of data) Object.assign(row, this.payload);
        } else if (this.action === "delete") {
          const doomed = rows.filter(row => own(row) && matches(row));
          for (const row of doomed) {
            const i = rows.indexOf(row); if (i >= 0) rows.splice(i, 1);
            if (this.table === "favorite_collections") db.favorite_collection_items = db.favorite_collection_items.filter(item => item.collection_id !== row.id);
            if (this.table === "saved_words") db.favorite_collection_items = db.favorite_collection_items.filter(item => item.saved_word_id !== row.id);
          }
        } else {
          data = rows.filter(row => own(row) && matches(row)).map(row => {
            if (this.table === "favorite_collection_items" && this.fields.includes("saved_words")) {
              return { ...row, saved_words: (delayedSavedWords || db.saved_words).find(word => word.id === row.saved_word_id) || null };
            }
            return { ...row };
          });
          if (this.sort.length) data.sort((a,b) => { for (const [key,options] of this.sort) { const result = String(a[key] ?? "").localeCompare(String(b[key] ?? "")) * (options.ascending === false ? -1 : 1); if (result) return result; } return 0; });
        }
        if (error) return { data: null, error };
        if (this.opts.head) return { data: null, count: data.length, error: null };
        return { data: this.singleRow ? (data[0] || null) : data, count: data.length, error: null };
      }
    }
    window.currentUser = { id: "test-user-a" };
    window.__collectionsTestDB = db;
    window.__collectionsTestChannels = [];
    window.__openedCollectionWord = null;
    window.addEventListener("swift-collections-open-word", event => { window.__openedCollectionWord = event.detail; });
    window.__collectionsTestClient = {
      from: table => new Query(table),
      rpc: async (name, args) => {
        if (name === "reorder_my_favorite_collection") {
          const row = db.favorite_collections.find(item => item.id === args.p_collection_id && item.user_id === activeUserId());
          if (!row) return { data: null, error: { message: "row-level security violation" } };
          const owned = db.favorite_collections.filter(item => item.user_id === activeUserId()).sort((a,b) => a.sort_order - b.sort_order);
          const target = Number(args.p_new_position);
          if (!Number.isInteger(target) || target < 0 || target >= owned.length) return { data: null, error: { message: "invalid position" } };
          const old = owned.findIndex(item => item.id === row.id);
          owned.splice(old, 1);
          owned.splice(target, 0, row);
          owned.forEach((item,index) => { item.sort_order = index; });
          return { data: true, error: null };
        }
        if (name !== "create_my_favorite_collection") return { data: null, error: { message: "Unknown RPC" } };
        const limit = window.__collectionsTestPlan === "premium" ? 40 : 16;
        const count = db.favorite_collections.filter(row => row.user_id === activeUserId()).length;
        if (count >= limit) return { data: null, error: {
          message: "COLLECTION_FOLDER_LIMIT_REACHED",
          details: JSON.stringify({ plan_code: window.__collectionsTestPlan || "free", folder_limit: limit, folder_count: count })
        } };
        const nameValue = String(args?.p_name || "").trim();
        if (!nameValue || nameValue.length > 48) return { data: null, error: { message: "Invalid collection name" } };
        if (db.favorite_collections.some(row => row.user_id === activeUserId() && row.name.toLowerCase() === nameValue.toLowerCase())) return { data: null, error: { message: "duplicate key unique constraint" } };
        const owned = db.favorite_collections.filter(item => item.user_id === activeUserId());
        const row = { id: "collection-" + (db.favorite_collections.length + 1), user_id: activeUserId(), name: nameValue, sort_order: owned.length ? Math.max(...owned.map(item => item.sort_order || 0)) + 1 : 0, created_at: new Date().toISOString() };
        db.favorite_collections.push(row);
        return { data: { id: row.id, name: row.name }, error: null };
      },
      channel: (name, options) => {
        const channel = { name, options, removed: false, handlers: [], statusCallback: null,
          on(type, filter, callback) { this.handlers.push({ type, event: filter.event, callback }); return this; },
          subscribe(callback) { this.statusCallback = callback; return this; }
        };
        window.__collectionsTestChannels.push(channel);
        return channel;
      },
      removeChannel(channel) { channel.removed = true; },
      auth: { onAuthStateChange() {} }
    };
    window.supabaseClient = window.__collectionsTestClient;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("about:blank");
  await page.setContent(`<!doctype html><html><head><style>.profile-card{background:rgb(255,255,255);padding:22px;border:1px solid transparent}.word-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.word-card{min-height:58px}.favorite-word-grid{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))}@media(max-width:650px){.word-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}}</style></head><body><main id="profilePage"><section class="profile-card"><details><summary><h2>Favorite words</h2></summary><div id="favoriteEnglishGrid" class="word-grid favorite-word-grid"></div></details></section></main></body></html>`);
  await page.evaluate(() => window.addEventListener("swift-collections-open-word", event => { window.__openedCollectionWord = event.detail; }));
  await page.addScriptTag({ path: require("path").resolve(__dirname, "../../favorite-collections.js") });
  await expect(page.locator("#swiftFavoriteCollections")).toBeVisible();
}

test("Your Collections folders expand inline, use a custom actions menu, and open the shared saved-word detail flow", async ({ page }) => {
  await installCollectionsFixture(page);
  const panel = page.locator("#swiftFavoriteCollections");
  await expect(panel.getByText("Customize and organize any saved words to your preferences.")).toBeVisible();
  const panelBox = await panel.boundingBox();
  expect(panelBox.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const create = panel.getByRole("button", { name: "＋ New folder" });
  await create.click();
  const createDialog = page.getByRole("dialog");
  await expect(createDialog).toHaveAttribute("aria-modal", "true");
  const collectionDialogTheme = await createDialog.evaluate(node => ({
    backgroundImage: getComputedStyle(node).backgroundImage,
    color: getComputedStyle(node).color
  }));
  expect(collectionDialogTheme.backgroundImage).not.toBe("none");
  expect(collectionDialogTheme.color).toBe("rgb(243, 244, 246)");
  await expect(page.locator("#fcCollectionName")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(createDialog.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(createDialog).toBeHidden();
  await expect(create).toBeFocused();
  await create.click();
  await page.locator("#fcCollectionName").fill("Travel");
  await page.getByRole("button", { name: "Create folder" }).click();
  await expect(panel.getByText("Travel")).toBeVisible();

  const card = panel.locator(".fc-folder-card").first();
  const toggle = card.locator(".fc-folder-toggle");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(card.getByText("This folder is empty.")).toBeVisible();

  await panel.getByRole("button", { name: "＋ New folder" }).click();
  await page.getByRole("button", { name: "Create folder" }).click();
  await expect(page.getByRole("alert")).toHaveText("Enter a collection name.");
  await page.locator("#fcCollectionName").fill("travel");
  await page.getByRole("button", { name: "Create folder" }).click();
  await expect(page.getByRole("alert")).toHaveText("You already have a collection with that name.");
  await page.getByRole("button", { name: "Cancel" }).click();

  await panel.getByRole("button", { name: "＋ New folder" }).click();
  await page.locator("#fcCollectionName").fill("Work");
  await page.getByRole("button", { name: "Create folder" }).click();
  await expect(panel.getByText("Work")).toBeVisible();

  // Folder order can be changed with accessible controls and persists in the account data.
  const workOrderCard = panel.locator(".fc-folder-card").filter({ hasText: "Work" });
  await workOrderCard.getByRole("button", { name: "Move Work up" }).click();
  await expect.poll(() => page.evaluate(() => window.__collectionsTestDB.favorite_collections
    .filter(row => row.user_id === "test-user-a").sort((a,b) => a.sort_order-b.sort_order).map(row => row.name)))
    .toEqual(["Work", "Travel"]);
  await workOrderCard.getByRole("button", { name: "Move Work down" }).click();
  await expect.poll(() => page.evaluate(() => window.__collectionsTestDB.favorite_collections
    .filter(row => row.user_id === "test-user-a").sort((a,b) => a.sort_order-b.sort_order).map(row => row.name)))
    .toEqual(["Travel", "Work"]);

  await card.getByRole("button", { name: "More options for Travel" }).click();
  const menu = card.getByRole("menu");
  await expect(menu).toBeVisible();
  await menu.getByRole("menuitem", { name: "Add words" }).click();
  await expect(page.getByRole("dialog", { name: "Add words to Travel" })).toBeVisible();
  await page.locator('input[type="checkbox"][value="101"]').check();
  await page.locator('input[type="checkbox"][value="102"]').check();
  await page.locator('input[type="checkbox"][value="103"]').check();
  await page.getByRole("button", { name: "Add selected" }).click();
  await expect(card.getByRole("button", { name: "Open saved word hello" })).toBeVisible();
  await expect(card.getByRole("button", { name: "Open saved word 你" })).toBeVisible();
  const longWord = card.getByRole("button", { name: "Open saved word bioavailability" });
  await expect(longWord).toBeVisible();
  const longWordGeometry = await longWord.evaluate(node => ({ width: node.getBoundingClientRect().width, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth }));
  expect(longWordGeometry.width).toBeGreaterThanOrEqual(132);
  expect(longWordGeometry.scrollWidth).toBeLessThanOrEqual(longWordGeometry.clientWidth + 1);
  expect((await panel.boundingBox()).width).toBeCloseTo(panelBox.width, 0);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileLongWord = await longWord.evaluate(node => ({ width: node.getBoundingClientRect().width, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth }));
  expect(mobileLongWord.width).toBeGreaterThanOrEqual(132);
  expect(mobileLongWord.scrollWidth).toBeLessThanOrEqual(mobileLongWord.clientWidth + 1);
  await expect(card.locator(".fc-expanded-grid.character-grid .fc-word-open")).toHaveCSS("aspect-ratio", "1 / 1");
  const collectionGridTracks = await card.locator(".fc-expanded-grid:not(.character-grid)").evaluate(node =>
    getComputedStyle(node).gridTemplateColumns.split(" ").map(value => Number.parseFloat(value))
  );
  expect(collectionGridTracks.length).toBeGreaterThan(0);
  expect(collectionGridTracks.every(width => width >= 110)).toBe(true);
  await expect(card.locator(".fc-expanded-grid:not(.character-grid) .fc-word-open").first()).toHaveCSS("min-height", "58px");

  await expect(card.locator(".fc-word-remove")).toHaveCount(0);
  await expect(card.getByRole("button", { name: "Open saved word hello" })).toBeVisible();
  expect(await page.evaluate(() => window.__collectionsTestDB.saved_words.some(row => row.id === 101))).toBe(true);

  const folderRowStyle = await card.locator(".fc-folder-head").evaluate(node => getComputedStyle(node).flexDirection);
  expect(folderRowStyle).toBe("row");
  const favoriteBackground = await page.locator("section.profile-card").first().evaluate(node => getComputedStyle(node).backgroundColor);
  const collectionsBackground = await panel.evaluate(node => getComputedStyle(node).backgroundColor);
  expect(collectionsBackground).toBe(favoriteBackground);

  await card.getByRole("button", { name: "Open saved word hello" }).click();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("swift-collections-open-word-picker", { detail: { word: "hello", course: "en" } })));
  const membershipDialog = page.getByRole("dialog", { name: "Add to collection" });
  await expect(membershipDialog).toBeVisible();
  const folderChoices = membershipDialog.locator('input[type="checkbox"]');
  await expect(folderChoices).toHaveCount(2);
  await expect(folderChoices.nth(0)).toBeChecked();
  await expect(folderChoices.nth(1)).not.toBeChecked();
  await folderChoices.nth(0).uncheck();
  await membershipDialog.getByRole("button", { name: "Save" }).click();
  await expect(membershipDialog).toBeHidden();
  await expect(card.getByRole("button", { name: "Open saved word hello" })).toHaveCount(0);
  expect(await page.evaluate(() => window.__collectionsTestDB.saved_words.some(row => row.id === 101))).toBe(true);

  // Reassign the same saved word to Work through the same detail-panel collection picker.
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("swift-collections-open-word-picker", { detail: { word: "hello", course: "en" } })));
  const reassignDialog = page.getByRole("dialog", { name: "Add to collection" });
  await expect(reassignDialog).toBeVisible();
  const reassignChoices = reassignDialog.locator('input[type="checkbox"]');
  await expect(reassignChoices.nth(0)).not.toBeChecked();
  await expect(reassignChoices.nth(1)).not.toBeChecked();
  await reassignChoices.nth(1).check();
  await reassignDialog.getByRole("button", { name: "Save" }).click();
  await expect(reassignDialog).toBeHidden();
  const workCard = panel.locator(".fc-folder-card").nth(1);
  const workToggle = workCard.locator(".fc-folder-toggle");
  await workToggle.click();
  await expect(workCard.getByRole("button", { name: "Open saved word hello" })).toBeVisible();

  // A stale first expansion response must not overwrite a newer collapsed/reopened state.
  await workToggle.click();
  await page.evaluate(() => { window.__delayNextMembershipRead = true; });
  await workToggle.click();
  await workToggle.click();
  const workMembership = await page.evaluate(() => {
    const row = window.__collectionsTestDB.favorite_collection_items.find(item => item.collection_id === "collection-2" && item.saved_word_id === 101);
    window.__collectionsTestDB.favorite_collection_items = window.__collectionsTestDB.favorite_collection_items.filter(item => item !== row);
    return row;
  });
  await workToggle.click();
  await expect(workCard.getByText("This folder is empty.")).toBeVisible();
  await page.waitForTimeout(150);
  await expect(workCard.getByText("This folder is empty.")).toBeVisible();
  await page.evaluate(row => { if (row) window.__collectionsTestDB.favorite_collection_items.push(row); }, workMembership);
  await workToggle.click();
  await workToggle.click();
  await expect(workCard.getByRole("button", { name: "Open saved word hello" })).toBeVisible();

  await card.getByRole("button", { name: "More options for Travel" }).click();
  await card.getByRole("menuitem", { name: "Rename" }).click();
  await page.locator("#fcCollectionName").fill("Trips");
  await page.getByRole("button", { name: "Save name" }).click();
  await expect(panel.getByText("Trips")).toBeVisible();

  // Deleting a saved_words row cascades its membership rows at the database level.
  await page.evaluate(async () => {
    await window.supabaseClient.from("saved_words").delete().eq("id", 101);
    window.dispatchEvent(new Event("swift-favorite-words-updated"));
  });
  await expect(panel.locator(".fc-folder-card").getByRole("button", { name: "Open saved word hello" })).toHaveCount(0);
  await expect(panel.locator(".fc-folder-card").getByRole("button", { name: "Open saved word 你" })).toBeVisible();

  const dbMembershipsAfterFavoriteRemoval = await page.evaluate(() => window.__collectionsTestDB.favorite_collection_items.filter(item => item.saved_word_id === 101).length);
  expect(dbMembershipsAfterFavoriteRemoval).toBe(0);

  await panel.locator(".fc-folder-card").getByRole("button", { name: "More options for Trips" }).click();
  await panel.getByRole("menuitem", { name: "Remove" }).click();
  await expect(page.getByRole("dialog", { name: "Remove this folder?" })).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Remove" }).click();
  await panel.locator(".fc-folder-card").getByRole("button", { name: "More options for Work" }).click();
  await panel.getByRole("menuitem", { name: "Remove" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Remove" }).click();
  await expect(panel.getByText("No collections yet.")).toBeVisible();
  const remainingSavedWords = await page.evaluate(() => window.__collectionsTestDB.saved_words.map(row => row.id).sort((a,b) => a-b));
  expect(remainingSavedWords).toEqual([102,103,201]);

  const styles = await panel.evaluate(node => {
    const primary = node.querySelector(".fc-primary");
    return { shadow: getComputedStyle(primary).boxShadow, background: getComputedStyle(primary).backgroundColor };
  });
  expect(styles.shadow).not.toBe("none");
  expect(styles.background).not.toBe("rgb(70, 121, 185)");
  await expect(panel.locator("select")).toHaveCount(0);
});

test("Your Collections folders can be dragged to the top or bottom of the list", async ({ page }) => {
  await installCollectionsFixture(page);
  const panel = page.locator("#swiftFavoriteCollections");
  for (const name of ["First", "Second", "Third"]) {
    await panel.getByRole("button", { name: "＋ New folder" }).click();
    await page.locator("#fcCollectionName").fill(name);
    await page.getByRole("button", { name: "Create folder" }).click();
    await expect(panel.getByText(name, { exact: true })).toBeVisible();
  }
  const third = panel.locator(".fc-folder-card").filter({ hasText: "Third" });
  const first = panel.locator(".fc-folder-card").filter({ hasText: "First" });
  await third.locator(".fc-drag-handle").dragTo(first, { targetPosition: { x: 12, y: 8 } });
  await expect.poll(() => page.evaluate(() => window.__collectionsTestDB.favorite_collections
    .filter(row => row.user_id === "test-user-a").sort((a,b) => a.sort_order-b.sort_order).map(row => row.name)))
    .toEqual(["Third", "First", "Second"]);
  const lastCard = panel.locator(".fc-folder-card").last();
  const lastCardBox = await lastCard.boundingBox();
  await first.locator(".fc-drag-handle").dragTo(lastCard, { targetPosition: { x: 12, y: Math.max(1, lastCardBox.height - 4) } });
  await expect.poll(() => page.evaluate(() => window.__collectionsTestDB.favorite_collections
    .filter(row => row.user_id === "test-user-a").sort((a,b) => a.sort_order-b.sort_order).map(row => row.name)))
    .toEqual(["Third", "Second", "First"]);
  await expect(panel.locator(".fc-folder-card").first()).toContainText("Third");
  await expect(panel.locator(".fc-folder-card").last()).toContainText("First");
});

test("Your Collections remain account-isolated and replace private Realtime channels when accounts switch", async ({ page }) => {
  await installCollectionsFixture(page);
  const panel = page.locator("#swiftFavoriteCollections");
  await panel.getByRole("button", { name: "＋ New folder" }).click();
  await page.locator("#fcCollectionName").fill("Private A");
  await page.getByRole("button", { name: "Create folder" }).click();
  await expect(panel.getByText("Private A")).toBeVisible();

  const initial = await page.evaluate(() => ({
    topic: window.__collectionsTestChannels[0]?.name,
    private: window.__collectionsTestChannels[0]?.options?.config?.private,
    handlers: window.__collectionsTestChannels[0]?.handlers.map(item => item.event).sort()
  }));
  expect(initial).toEqual({ topic: "favorite-collections:test-user-a", private: true, handlers: ["DELETE","INSERT","UPDATE"] });

  await page.evaluate(() => {
    window.__delayNextCollectionRead = true;
    window.dispatchEvent(new Event("swift-auth-updated"));
    window.currentUser = { id: "test-user-b" };
    window.dispatchEvent(new Event("swift-auth-updated"));
  });
  await expect(panel.getByText("No collections yet.")).toBeVisible();
  await expect(panel.getByText("Private A")).toHaveCount(0);
  await page.waitForTimeout(180);
  await expect(panel.getByText("Private A")).toHaveCount(0);
  const channels = await page.evaluate(() => window.__collectionsTestChannels.map(channel => ({ name: channel.name, removed: channel.removed })));
  expect(channels).toEqual([
    { name: "favorite-collections:test-user-a", removed: true },
    { name: "favorite-collections:test-user-b", removed: false }
  ]);

  await page.evaluate(() => {
    window.currentUser = null;
    window.dispatchEvent(new Event("swift-auth-updated"));
  });
  await expect(panel.getByText("Sign in to create and sync collections across your devices.")).toBeVisible();
  const signedOutChannels = await page.evaluate(() => window.__collectionsTestChannels.map(channel => ({ name: channel.name, removed: channel.removed })));
  expect(signedOutChannels).toEqual([
    { name: "favorite-collections:test-user-a", removed: true },
    { name: "favorite-collections:test-user-b", removed: true }
  ]);
});


test("Dictionary detail panel shows Add to collection only for a saved word", async ({ page }) => {
  await page.route("https://*.supabase.co/**", route => route.abort());
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => window.SWIFT_FAVORITE_COLLECTIONS_READY === true), { timeout: 10000 }).toBe(true);
  const panelPlacement = await page.evaluate(() => {
    const heading = [...document.querySelectorAll("h1,h2,h3,h4,h5")].find(node => node.textContent.trim().toLowerCase() === "favorite words");
    const favoriteCard = heading?.closest(".profile-card,section");
    const collectionsPanel = document.getElementById("swiftFavoriteCollections");
    return {
      foundFavoriteCard: !!favoriteCard,
      directlyBelowFavoriteWords: !!favoriteCard && collectionsPanel?.previousElementSibling === favoriteCard,
      title: collectionsPanel?.querySelector("#swiftFavoriteCollectionsTitle")?.textContent.trim() || "",
      description: collectionsPanel?.querySelector(".fc-muted")?.textContent.trim() || "",
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    };
  });
  expect(panelPlacement).toMatchObject({
    foundFavoriteCard: true,
    directlyBelowFavoriteWords: true,
    title: "Your collections",
    description: "Customize and organize any saved words to your preferences."
  });
  expect(panelPlacement.documentWidth).toBeLessThanOrEqual(panelPlacement.viewportWidth);
  const word = page.locator("#wordGrid .word-card").first();
  await expect(word).toBeVisible();
  await word.click();
  const save = page.getByRole("button", { name: "Save word" });
  const add = page.locator("#collectionAddButton");
  await expect(add).toBeHidden();
  await save.click();
  await expect(add).toBeVisible();
  const placement = await page.evaluate(() => ({
    visible: !document.getElementById("collectionAddButton").hidden,
    nextToFavorite: document.getElementById("saveButton").nextElementSibling?.id === "collectionAddButton",
    label: document.getElementById("collectionAddButton").getAttribute("aria-label")
  }));
  expect(placement).toEqual({ visible: true, nextToFavorite: true, label: "Add to collection" });

  // Simulate an authenticated client after the local favorite is created, then
  // click the real detail-panel action and verify the selected folder write.
  await page.evaluate(() => {
    const state = { memberships: [] };
    class Query {
      constructor(table) { this.table = table; this.filters = []; }
      select() { return this; }
      eq(key, value) { this.filters.push([key, value]); return this; }
      order() { return this; }
      upsert(rows) {
        state.memberships.push(...(Array.isArray(rows) ? rows : [rows]));
        return Promise.resolve({ error: null });
      }
      then(resolve, reject) {
        let data = [];
        if (this.table === "favorite_collections") data = [{ id: "folder-a", name: "Travel", created_at: "2026-01-01T00:00:00Z" }];
        if (this.table === "saved_words") data = [{ id: 501, word: document.getElementById("modalWord").textContent, course: "en" }];
        if (this.table === "favorite_collection_items") {
          data = state.memberships.filter(row => this.filters.every(([key, value]) => row[key] === value)).map(row => ({ collection_id: row.collection_id }));
        }
        return Promise.resolve({ data, error: null }).then(resolve, reject);
      }
    }
    window.__detailCollectionState = state;
    window.currentUser = { id: "test-user-a" };
    window.supabaseClient = {
      from: table => new Query(table),
      channel(name, options) {
        return { name, options, on() { return this; }, subscribe(callback) { callback?.("SUBSCRIBED"); return this; } };
      },
      removeChannel() {}
    };
    window.dispatchEvent(new Event("swift-auth-updated"));
    document.getElementById("collectionAddButton").disabled = false;
  });
  await add.click();
  const addDialog = page.getByRole("dialog", { name: "Add to collection" });
  await expect(addDialog).toBeVisible();
  await addDialog.getByLabel("Travel").check();
  await addDialog.getByRole("button", { name: "Save" }).click();
  await expect(addDialog).toBeHidden();
  const detailMembershipWrites = await page.evaluate(() => window.__detailCollectionState.memberships);
  expect(detailMembershipWrites).toEqual([{ collection_id: "folder-a", saved_word_id: 501 }]);

  const savedWord = await page.locator("#modalWord").textContent();
  await page.locator("#closeButton").click();
  await page.evaluate(word => window.dispatchEvent(new CustomEvent("swift-collections-open-word", { detail: { word, course: "en" } })), savedWord);
  await expect(page.locator("#modalBackdrop")).toHaveClass(/open/);
  await expect(page.locator("#modalWord")).toHaveText(savedWord);
});


test("Premium plan opens a dedicated comparison page with all six complete feature areas", async ({ page }) => {
  await page.route("https://*.supabase.co/**", route => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.locator("#premiumPlanOpen");
  await expect(trigger).toBeVisible();
  await trigger.click();
  await page.waitForURL(/premium-plan\.html(?:$|\?)/);
  await expect(page.getByRole("heading", { name: "Free vs Premium" })).toBeVisible();
  const premiumTheme = await page.evaluate(() => ({
    body: getComputedStyle(document.body).backgroundColor,
    heroImage: getComputedStyle(document.querySelector(".premium-hero")).backgroundImage,
    comparisonImage: getComputedStyle(document.querySelector(".premium-comparison")).backgroundImage
  }));
  expect(premiumTheme.body).toBe("rgb(17, 19, 24)");
  expect(premiumTheme.heroImage).not.toBe("none");
  expect(premiumTheme.comparisonImage).not.toBe("none");
  await expect(page.getByRole("table", { name: "Free and Premium plan comparison" })).toBeVisible();
  const rows = page.locator(".premium-comparison-row");
  await expect(rows).toHaveCount(6);
  await expect(rows.nth(0)).toContainText("Unlimited");
  await expect(rows.nth(0)).toContainText("Always free");
  await expect(rows.nth(1)).toContainText("1 completion per category / day");
  await expect(rows.nth(1)).toContainText("3 completions per category / day");
  await expect(rows.nth(2)).toContainText("5 per local day");
  await expect(rows.nth(2)).toContainText("15 per local day");
  await expect(rows.nth(3)).toContainText("1 per local day");
  await expect(rows.nth(3)).toContainText("3 per local day");
  await expect(rows.nth(4)).toContainText("3 per local day");
  await expect(rows.nth(4)).toContainText("10 per local day");
  await expect(rows.nth(5)).toContainText("16 folders");
  await expect(rows.nth(5)).toContainText("40 folders");
  await expect(page.getByText("Active folder limit", { exact: true })).toBeVisible();
  await expect(page.getByText("Premium is not currently available to purchase.", { exact: true })).toBeVisible();
  await expect(page.locator("button,[role=dialog]")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Free vs Premium" })).toBeVisible();
  await expect(rows).toHaveCount(6);
});


test("Your Collections enforces the Free 16-folder and Premium 40-folder limits without a capacity display", async ({ page }) => {
  await installCollectionsFixture(page);
  const panel = page.locator("#swiftFavoriteCollections");
  await expect(panel.getByText(/folders? remaining|16 of 16|40 of 40/i)).toHaveCount(0);
  await page.evaluate(() => {
    for (let i = 1; i <= 16; i++) window.__collectionsTestDB.favorite_collections.push({
      id: "free-" + i, user_id: "test-user-a", name: "Free folder " + i, created_at: new Date(Date.now() + i).toISOString()
    });
  });
  await page.evaluate(() => window.dispatchEvent(new Event("swift-favorite-words-updated")));
  await expect(panel.locator(".fc-folder-card")).toHaveCount(16);
  await panel.getByRole("button", { name: "＋ New folder" }).click();
  await page.locator("#fcCollectionName").fill("One too many");
  await page.getByRole("button", { name: "Create folder" }).click();
  await expect(page.getByRole("alert")).toHaveText("You've reached the 16-folder limit for the Free plan. Remove an existing folder before creating another.");
  await expect(panel.locator(".fc-folder-card")).toHaveCount(16);
  await page.getByRole("button", { name: "Cancel" }).click();

  await page.evaluate(() => {
    window.__collectionsTestDB.favorite_collections = [];
    window.__collectionsTestPlan = "premium";
    for (let i = 1; i <= 40; i++) window.__collectionsTestDB.favorite_collections.push({
      id: "premium-" + i, user_id: "test-user-a", name: "Premium folder " + i, created_at: new Date(Date.now() + i).toISOString()
    });
    window.dispatchEvent(new Event("swift-favorite-words-updated"));
  });
  await expect(panel.locator(".fc-folder-card")).toHaveCount(40);
  await panel.getByRole("button", { name: "＋ New folder" }).click();
  await page.locator("#fcCollectionName").fill("Premium overflow");
  await page.getByRole("button", { name: "Create folder" }).click();
  await expect(page.getByRole("alert")).toHaveText("You've reached the 40-folder limit for the Premium plan. Remove an existing folder before creating another.");
  await expect(panel.locator(".fc-folder-card")).toHaveCount(40);
});


test("Collection word cards preserve Favorite grid width and long headwords", async ({ page }) => {
  await installCollectionsFixture(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  const panel = page.locator("#swiftFavoriteCollections");
  const favoriteGrid = page.locator("#favoriteEnglishGrid");
  await favoriteGrid.evaluate(grid => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "word-card";
    card.innerHTML = '<span class="word-name">bioavailability</span>';
    grid.append(card);
  });
  const desktopBefore = await favoriteGrid.evaluate(grid => ({
    columns: getComputedStyle(grid).gridTemplateColumns,
    cardWidth: grid.firstElementChild.getBoundingClientRect().width,
    gridWidth: grid.getBoundingClientRect().width
  }));
  await page.setViewportSize({ width: 390, height: 844 });
  const before = await favoriteGrid.evaluate(grid => ({
    columns: getComputedStyle(grid).gridTemplateColumns,
    cardWidth: grid.firstElementChild.getBoundingClientRect().width,
    gridWidth: grid.getBoundingClientRect().width
  }));

  await panel.getByRole("button", { name: "＋ New folder" }).click();
  await page.locator("#fcCollectionName").fill("Science");
  await page.getByRole("button", { name: "Create folder" }).click();
  const folder = panel.locator(".fc-folder-card").filter({ hasText: "Science" });
  await folder.getByRole("button", { name: "More options for Science" }).click();
  await panel.getByRole("menuitem", { name: "Add words" }).click();
  const dialog = page.getByRole("dialog", { name: "Add words to Science" });
  await dialog.getByLabel(/bioavailability/).check();
  await dialog.getByRole("button", { name: "Add selected" }).click();
  const collectionGrid = folder.locator(".fc-expanded-grid:not(.character-grid)").first();
  await expect(collectionGrid.getByText("bioavailability")).toBeVisible();
  const after = await collectionGrid.evaluate(grid => ({
    columns: getComputedStyle(grid).gridTemplateColumns,
    cardWidth: grid.firstElementChild.getBoundingClientRect().width,
    gridWidth: grid.getBoundingClientRect().width
  }));
  expect(after.columns).toBe(before.columns);
  expect(after.cardWidth).toBeCloseTo(before.cardWidth, 0);
  expect(after.gridWidth).toBeCloseTo(before.gridWidth, 0);
  await page.setViewportSize({ width: 1280, height: 800 });
  const desktopAfter = await collectionGrid.evaluate(grid => ({
    columns: getComputedStyle(grid).gridTemplateColumns,
    cardWidth: grid.firstElementChild.getBoundingClientRect().width,
    gridWidth: grid.getBoundingClientRect().width
  }));
  expect(desktopAfter.columns).toBe(desktopBefore.columns);
  expect(desktopAfter.cardWidth).toBeCloseTo(desktopBefore.cardWidth, 0);
  expect(desktopAfter.gridWidth).toBeCloseTo(desktopBefore.gridWidth, 0);
  await expect(collectionGrid.locator(".word-name")).toHaveCSS("overflow-wrap", "anywhere");
});

test("Collection and Favorite disclosure panels animate and respect reduced motion", async ({ page }) => {
  await installCollectionsFixture(page);
  const panel = page.locator("#swiftFavoriteCollections");
  await panel.getByRole("button", { name: "＋ New folder" }).click();
  await page.locator("#fcCollectionName").fill("Animation");
  await page.getByRole("button", { name: "Create folder" }).click();
  const folder = panel.locator(".fc-folder-card").filter({ hasText: "Animation" });
  const toggle = folder.locator(".fc-folder-toggle");
  await toggle.click();
  const expanded = folder.locator(".fc-expanded");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(expanded).toHaveCSS("transition-duration", /0\.28s/);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => expanded.evaluate(node => node.hidden)).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await toggle.click();
  await expect(expanded).toBeVisible();
  await toggle.click();
  await expect(expanded).toBeHidden();

  const favoriteDetails = page.locator("#profilePage details");
  const favoriteSummary = favoriteDetails.locator(":scope > summary");
  const favoriteContent = favoriteDetails.locator(":scope > .fc-disclosure-content");
  await favoriteContent.evaluate(node => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "word-card";
    card.innerHTML = '<span class="word-name">hello</span>';
    node.append(card);
  });
  await expect(favoriteContent).toHaveCSS("transition-duration", "0s");
  await favoriteSummary.click();
  await expect(favoriteSummary).toHaveAttribute("aria-expanded", "true");
  await expect(favoriteContent).toBeVisible();
  await favoriteSummary.click();
  await expect(favoriteSummary).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => favoriteContent.evaluate(node => node.inert)).toBe(true);
});
