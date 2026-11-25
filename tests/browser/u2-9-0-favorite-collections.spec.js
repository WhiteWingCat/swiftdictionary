const { test, expect } = require("@playwright/test");

async function installCollectionsFixture(page) {
  await page.addInitScript(() => {
    const db = {
      favorite_collections: [],
      favorite_collection_items: [],
      saved_words: [
        { id: 101, user_id: "test-user-a", word: "hello", course: "en" },
        { id: 102, user_id: "test-user-a", word: "你", course: "zh" },
        { id: 201, user_id: "test-user-b", word: "secret", course: "en" }
      ]
    };
    const activeUserId = () => window.currentUser?.id;
    class Query {
      constructor(table) { this.table = table; this.action = "select"; this.payload = null; this.filters = []; this.opts = {}; this.returning = false; this.singleRow = false; this.sort = null; this.fields = ""; }
      select(fields, opts) { this.returning = true; this.opts = opts || {}; this.fields = fields || ""; return this; }
      insert(payload) { this.action = "insert"; this.payload = payload; return this; }
      upsert(payload) { this.action = "upsert"; this.payload = payload; return this; }
      update(payload) { this.action = "update"; this.payload = payload; return this; }
      delete() { this.action = "delete"; return this; }
      eq(key, value) { this.filters.push([key, value]); return this; }
      order(key, options) { this.sort = [key, options || {}]; return this; }
      single() { this.singleRow = true; return this; }
      then(resolve, reject) { return this.run().then(resolve, reject); }
      async run() {
        if (this.table === "favorite_collections" && this.action === "select" && window.__delayNextCollectionRead) {
          window.__delayNextCollectionRead = false;
          await new Promise(resolve => setTimeout(resolve, 120));
        }
        const rows = db[this.table];
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
              return { ...row, saved_words: db.saved_words.find(word => word.id === row.saved_word_id) || null };
            }
            return { ...row };
          });
          if (this.sort) data.sort((a,b) => String(a[this.sort[0]]).localeCompare(String(b[this.sort[0]])) * (this.sort[1].ascending === false ? -1 : 1));
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
  await page.setContent("<!doctype html><html><head></head><body><section><h2>Favorite words</h2></section></body></html>");
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

  await card.getByRole("button", { name: "More options for Travel" }).click();
  const menu = card.getByRole("menu");
  await expect(menu).toBeVisible();
  await menu.getByRole("menuitem", { name: "Add words" }).click();
  await expect(page.getByRole("dialog", { name: "Add words to Travel" })).toBeVisible();
  await page.locator('input[type="checkbox"][value="101"]').check();
  await page.locator('input[type="checkbox"][value="102"]').check();
  await page.getByRole("button", { name: "Add selected" }).click();
  await expect(card.getByRole("button", { name: "Open saved word hello" })).toBeVisible();
  await expect(card.getByRole("button", { name: "Open saved word 你" })).toBeVisible();
  await expect(card.locator(".fc-expanded-grid.character-grid .fc-word-open")).toHaveCSS("aspect-ratio", "1 / 1");

  await card.getByRole("button", { name: "Remove hello from this folder" }).click();
  await expect(card.getByRole("button", { name: "Open saved word hello" })).toHaveCount(0);
  expect(await page.evaluate(() => window.__collectionsTestDB.saved_words.some(row => row.id === 101))).toBe(true);

  await card.getByRole("button", { name: "Open saved word 你" }).click();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("swift-collections-open-word-picker", { detail: { word: "hello", course: "en" } })));
  const membershipDialog = page.getByRole("dialog", { name: "Add to collection" });
  await expect(membershipDialog).toBeVisible();
  const folderChoices = membershipDialog.locator('input[type="checkbox"]');
  await expect(folderChoices).toHaveCount(2);
  await expect(folderChoices.nth(0)).not.toBeChecked();
  await expect(folderChoices.nth(1)).not.toBeChecked();
  await folderChoices.nth(1).check();
  await membershipDialog.getByRole("button", { name: "Save" }).click();
  await expect(membershipDialog).toBeHidden();
  const workCard = panel.locator(".fc-folder-card").nth(1);
  await workCard.locator(".fc-folder-toggle").click();
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
  expect(remainingSavedWords).toEqual([102,201]);

  const styles = await panel.evaluate(node => {
    const primary = node.querySelector(".fc-primary");
    return { shadow: getComputedStyle(primary).boxShadow, background: getComputedStyle(primary).backgroundColor };
  });
  expect(styles.shadow).not.toBe("none");
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
  const savedWord = await page.locator("#modalWord").textContent();
  await page.locator("#closeButton").click();
  await page.evaluate(word => window.dispatchEvent(new CustomEvent("swift-collections-open-word", { detail: { word, course: "en" } })), savedWord);
  await expect(page.locator("#modalBackdrop")).toHaveClass(/open/);
  await expect(page.locator("#modalWord")).toHaveText(savedWord);
});
