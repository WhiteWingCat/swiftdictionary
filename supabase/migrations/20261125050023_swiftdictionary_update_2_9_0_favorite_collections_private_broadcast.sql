-- SwiftDictionary U2.9.0 — private per-account Favorite Collections broadcasts.
-- Postgres Changes cannot filter DELETE events and DELETE RLS is not enforced.
-- Private Broadcast topics ensure every operation, including deletes, is owner-scoped.
create policy "authenticated can receive own favorite collection broadcasts"
on realtime.messages
for select
to authenticated
using (
  extension = 'broadcast'
  and realtime.topic() = 'favorite-collections:' || (select auth.uid())::text
);

create or replace function private.broadcast_favorite_collection_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid;
  v_collection_id uuid;
  v_saved_word_id bigint;
begin
  if tg_table_name = 'favorite_collections' then
    v_user_id := coalesce(new.user_id, old.user_id);
  else
    v_collection_id := coalesce(new.collection_id, old.collection_id);
    v_saved_word_id := coalesce(new.saved_word_id, old.saved_word_id);

    select c.user_id into v_user_id
    from public.favorite_collections c
    where c.id = v_collection_id;

    if v_user_id is null then
      select s.user_id into v_user_id
      from public.saved_words s
      where s.id = v_saved_word_id;
    end if;
  end if;

  if v_user_id is not null then
    perform realtime.broadcast_changes(
      'favorite-collections:' || v_user_id::text,
      tg_op,
      tg_op,
      tg_table_name,
      tg_table_schema,
      new,
      old
    );
  end if;

  return null;
end;
$function$;

revoke all on function private.broadcast_favorite_collection_changes() from public, anon, authenticated;

drop trigger if exists favorite_collections_broadcast_changes on public.favorite_collections;
create trigger favorite_collections_broadcast_changes
after insert or update or delete on public.favorite_collections
for each row execute function private.broadcast_favorite_collection_changes();

drop trigger if exists favorite_collection_items_broadcast_changes on public.favorite_collection_items;
create trigger favorite_collection_items_broadcast_changes
after insert or update or delete on public.favorite_collection_items
for each row execute function private.broadcast_favorite_collection_changes();

comment on function private.broadcast_favorite_collection_changes() is
  'Emits account-scoped private Realtime Broadcast events for Favorite Collections; invoked only by table triggers.';
