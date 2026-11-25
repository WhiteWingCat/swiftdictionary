-- SwiftDictionary Update 2.9.0 — account-owned Favorite Collections.
-- No folder quota is enforced here. The proposed 16/40 tier capacities remain future policy.
begin;

create table if not exists public.favorite_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint favorite_collections_name_valid
    check (name = btrim(name) and char_length(name) between 1 and 48)
);

create unique index if not exists favorite_collections_user_name_unique
  on public.favorite_collections (user_id, lower(name));

create index if not exists favorite_collections_user_created_idx
  on public.favorite_collections (user_id, created_at, id);

create table if not exists public.favorite_collection_items (
  collection_id uuid not null
    references public.favorite_collections(id) on delete cascade,
  saved_word_id bigint not null
    references public.saved_words(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (collection_id, saved_word_id)
);

create index if not exists favorite_collection_items_saved_word_idx
  on public.favorite_collection_items (saved_word_id);

alter table public.favorite_collections enable row level security;
alter table public.favorite_collection_items enable row level security;

revoke all on public.favorite_collections from anon, authenticated;
revoke all on public.favorite_collection_items from anon, authenticated;
grant select, insert, update, delete on public.favorite_collections to authenticated;
grant select, insert, delete on public.favorite_collection_items to authenticated;

drop policy if exists favorite_collections_select_own on public.favorite_collections;
create policy favorite_collections_select_own
  on public.favorite_collections for select to authenticated
  using ((select auth.uid()) is not null and user_id = (select auth.uid()));

drop policy if exists favorite_collections_insert_own on public.favorite_collections;
create policy favorite_collections_insert_own
  on public.favorite_collections for insert to authenticated
  with check ((select auth.uid()) is not null and user_id = (select auth.uid()));

drop policy if exists favorite_collections_update_own on public.favorite_collections;
create policy favorite_collections_update_own
  on public.favorite_collections for update to authenticated
  using ((select auth.uid()) is not null and user_id = (select auth.uid()))
  with check ((select auth.uid()) is not null and user_id = (select auth.uid()));

drop policy if exists favorite_collections_delete_own on public.favorite_collections;
create policy favorite_collections_delete_own
  on public.favorite_collections for delete to authenticated
  using ((select auth.uid()) is not null and user_id = (select auth.uid()));

drop policy if exists favorite_collection_items_select_own on public.favorite_collection_items;
create policy favorite_collection_items_select_own
  on public.favorite_collection_items for select to authenticated
  using (
    exists (
      select 1 from public.favorite_collections c
      where c.id = collection_id and c.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.saved_words s
      where s.id = saved_word_id and s.user_id = (select auth.uid())
    )
  );

drop policy if exists favorite_collection_items_insert_own on public.favorite_collection_items;
create policy favorite_collection_items_insert_own
  on public.favorite_collection_items for insert to authenticated
  with check (
    exists (
      select 1 from public.favorite_collections c
      where c.id = collection_id and c.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.saved_words s
      where s.id = saved_word_id and s.user_id = (select auth.uid())
    )
  );

drop policy if exists favorite_collection_items_delete_own on public.favorite_collection_items;
create policy favorite_collection_items_delete_own
  on public.favorite_collection_items for delete to authenticated
  using (
    exists (
      select 1 from public.favorite_collections c
      where c.id = collection_id and c.user_id = (select auth.uid())
    )
  );

comment on table public.favorite_collections is
  'Account-owned Favorite word collections. Folder-count entitlements are intentionally not enforced in U2.9.0.';
comment on table public.favorite_collection_items is
  'Membership links to account-owned saved_words rows; deleting a collection or saved word removes membership only.';

commit;
