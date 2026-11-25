const { test, expect } = require("@playwright/test");

test("Favorite Collections create, mixed-language membership, rename, remove and delete without deleting saved words", async ({ page }) => {
  await page.addInitScript(() => {
    const db = {
      favorite_collections: [],
      favorite_collection_items: [],
      saved_words: [
        { id: 101, user_id: "test-user-a", word: "hello", course: "en", created_at: "2026-11-25T00:00:00Z" },
        { id: 102, user_id: "test-user-a", word: "你好", course: "zh", created_at: "2026-11-25T00:01:00Z" },
        { id: 201, user_id: "test-user-b", word: "secret", course: "en", created_at: "2026-11-25T00:02:00Z" }
      ]
    };
    const user = { id: "test-user-a" };
    class Query {
      constructor(table) { this.table = table; this.action = "select"; this.payload = null; this.filters = []; this.opts = {}; this.returning = false; this.singleRow = false; this.sort = null; }
      select(fields, opts) { this.returning = true; this.opts = opts || {}; this.fields = fields; return this; }
      insert(payload) { this.action = "insert"; this.payload = payload; return this; }
      upsert(payload) { this.action = "upsert"; this.payload = payload; return this; }
      update(payload) { this.action = "update"; this.payload = payload; return this; }
      delete() { this.action = "delete"; return this; }
      eq(key, value) { this.filters.push([key, value]); return this; }
      order(key, options) { this.sort = [key, options || {}]; return this; }
      single() { this.singleRow = true; return this; }
      then(resolve, reject) { return this.run().then(resolve, reject); }
      async run() {
        const rows = db[this.table];
        const matches = row => this.filters.every(([k,v]) => row[k] === v);
        const own = row => this.table === "saved_words" ? row.user_id === user.id
          : this.table === "favorite_collections" ? row.user_id === user.id
          : db.favorite_collections.some(c => c.id === row.collection_id && c.user_id === user.id)
            && db.saved_words.some(w => w.id === row.saved_word_id && w.user_id === user.id);
        let data = [];
        let error = null;
        if (this.action === "insert" || this.action === "upsert") {
          for (const raw of (Array.isArray(this.payload) ? this.payload : [this.payload])) {
            const row = { ...raw };
            if (this.table === "favorite_collections") {
              if (row.user_id !== user.id) { error = { message: "row-level security violation" }; break; }
              if (rows.some(x => x.user_id === user.id && x.name.toLowerCase() === row.name.toLowerCase())) { error = { message: "duplicate key unique constraint" }; break; }
              row.id = "collection-" + (rows.length + 1); row.created_at = new Date().toISOString(); rows.push(row); data.push(row);
            } else if (this.table === "favorite_collection_items") {
              const collection = db.favorite_collections.find(c => c.id === row.collection_id && c.user_id === user.id);
              const word = db.saved_words.find(w => w.id === row.saved_word_id && w.user_id === user.id);
              if (!collection || !word) { error = { message: "row-level security violation" }; break; }
              if (!rows.some(x => x.collection_id === row.collection_id && x.saved_word_id === row.saved_word_id)) rows.push({ ...row, created_at: new Date().toISOString() });
            }
          }
        } else if (this.action === "update") {
          data = rows.filter(x => own(x) && matches(x));
          for (const row of data) Object.assign(row, this.payload);
        } else if (this.action === "delete") {
          const doomed = rows.filter(x => own(x) && matches(x));
          for (const row of doomed) {
            const i = rows.indexOf(row); if (i >= 0) rows.splice(i, 1);
            if (this.table === "favorite_collections") db.favorite_collection_items = db.favorite_collection_items.filter(x => x.collection_id !== row.id);
          }
        } else {
          data = rows.filter(x => own(x) && matches(x)).map(row => {
            if (this.table === "favorite_collection_items" && this.fields?.includes("saved_words")) {
              return { ...row, saved_words: db.saved_words.find(w => w.id === row.saved_word_id) || null };
            }
            return { ...row };
          });
          if (this.sort) data.sort((a,b) => String(a[this.sort[0]]).localeCompare(String(b[this.sort[0]])) * (this.sort[1].ascending === false ? -1 : 1));
        }
        if (error) return { data: null, error };
        if (this.opts.head) return { data: null, count: data.length, error: null };
        return { data: this.singleRow ? (data[0] || null) : (this.returning ? data : null), count: data.length, error: null };
      }
    }
    window.currentUser = user;
    window.__collectionsTestDB = db;
    window.__collectionsTestClient = {
      from: table => new Query(table),
      channel: () => ({ on() { return this; }, subscribe() { return this; } }),
      removeChannel() {},
      auth: { onAuthStateChange() {} }
    };
    window.supabaseClient = window.__collectionsTestClient;
  });

  await page.goto("about:blank");
  await page.setContent("<!doctype html><html><head></head><body></body></html>");
  await page.evaluate(() => {
    window.supabaseClient = window.__collectionsTestClient;
    window.currentUser = { id: "test-user-a" };
  });
  await page.addScriptTag({ path: require("path").resolve(__dirname, "../../favorite-collections.js") });
  await page.evaluate(() => {
    const heading = document.createElement("h2");
    heading.textContent = "Favorite words";
    const section = document.createElement("div");
    section.append(heading);
    document.body.append(section);
  });
  const panel = page.locator("#swiftFavoriteCollections");
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "＋ New folder" }).click();
  await page.locator("#fcCollectionName").fill("Travel");
  await page.getByRole("button", { name: "Create folder" }).click();
  await expect(panel.getByText("Travel")).toBeVisible();

  await panel.getByRole("button", { name: /Travel/ }).click();
  await page.getByRole("button", { name: "Add saved words" }).click();
  await expect(page.getByText("hello")).toBeVisible();
  await expect(page.getByText("你好")).toBeVisible();
  await page.locator('input[type="checkbox"][value="101"]').check();
  await page.locator('input[type="checkbox"][value="102"]').check();
  await page.getByRole("button", { name: "Add selected" }).click();
  await expect(page.getByText("hello")).toBeVisible();
  await expect(page.getByText("你好")).toBeVisible();

  await page.getByRole("button", { name: "Rename" }).click();
  await page.locator("#fcCollectionName").fill("Trips");
  await page.getByRole("button", { name: "Save name" }).click();
  await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();

  await page.getByRole("button", { name: "Remove" }).first().click();
  await expect(page.getByText("你好")).toBeVisible();
  await expect(page.getByText("hello")).toHaveCount(0);

  await page.getByRole("button", { name: "Delete folder" }).click();
  await page.getByRole("button", { name: "Delete folder" }).last().click();
  await expect(page.getByText("No collections yet.")).toBeVisible();
  const remaining = await page.evaluate(() => window.__collectionsTestDB.saved_words.map(x => x.id));
  expect(remaining).toEqual([101, 102, 201]);
  const membershipCount = await page.evaluate(() => window.__collectionsTestDB.favorite_collection_items.length);
  expect(membershipCount).toBe(0);
});
