-- SwiftDictionary U2.9.0 — persistent, owner-scoped Favorite Collection ordering.
begin;

alter table public.favorite_collections
  add column if not exists sort_order integer not null default 0;

with ranked as (
  select id,
         row_number() over (partition by user_id order by created_at, id) - 1 as new_order
  from public.favorite_collections
)
update public.favorite_collections c
set sort_order = ranked.new_order
from ranked
where ranked.id = c.id;

create index if not exists favorite_collections_user_sort_order_idx
  on public.favorite_collections (user_id, sort_order, created_at, id);

create or replace function public.reorder_my_favorite_collection(
  p_collection_id uuid,
  p_new_position integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_old_position integer;
  v_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_collection_id is null or p_new_position is null or p_new_position < 0 then
    raise exception 'Invalid collection position' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );

  select c.sort_order into v_old_position
  from public.favorite_collections c
  where c.id = p_collection_id and c.user_id = v_user_id
  for update;

  if not found then
    raise exception 'Collection not found' using errcode = '42501';
  end if;

  select count(*)::integer into v_count
  from public.favorite_collections c
  where c.user_id = v_user_id;

  if p_new_position >= v_count then
    raise exception 'Collection position is outside the current list' using errcode = '22023';
  end if;

  if p_new_position = v_old_position then
    return true;
  end if;

  -- Move every row into a temporary positive range before assigning compact
  -- zero-based positions. The account advisory lock serializes concurrent moves.
  update public.favorite_collections c
  set sort_order = c.sort_order + 1000000
  where c.user_id = v_user_id;

  with position_keys as (
    select c.id,
      case
        when c.id = p_collection_id then p_new_position
        when p_new_position < v_old_position
          then (c.sort_order - 1000000)
             + case when (c.sort_order - 1000000) >= p_new_position then 1 else 0 end
        else (c.sort_order - 1000000)
             - case when (c.sort_order - 1000000) > v_old_position
                       and (c.sort_order - 1000000) <= p_new_position then 1 else 0 end
      end as position_key
    from public.favorite_collections c
    where c.user_id = v_user_id
  ),
  ranked as (
    select id, row_number() over (order by position_key, id) - 1 as new_position
    from position_keys
  )
  update public.favorite_collections c
  set sort_order = ranked.new_position
  from ranked
  where ranked.id = c.id and c.user_id = v_user_id;

  return true;
end;
$function$;

revoke all on function public.reorder_my_favorite_collection(uuid, integer) from public, anon, authenticated;
grant execute on function public.reorder_my_favorite_collection(uuid, integer) to authenticated;

comment on column public.favorite_collections.sort_order is
  'Account-scoped zero-based display order, updated through reorder_my_favorite_collection.';
comment on function public.reorder_my_favorite_collection(uuid, integer) is
  'Moves one authenticated owner collection to a zero-based position with per-account transaction serialization.';


-- Newly created folders append after the account's current final position.
-- The existing create RPC holds the same account advisory lock, preventing
-- simultaneous creates from receiving the same position.
create or replace function private.assign_favorite_collection_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.user_id is null or new.user_id <> auth.uid() then
    raise exception 'Collection owner mismatch' using errcode = '42501';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.user_id::text, 0)
  );
  select coalesce(max(c.sort_order) + 1, 0)
    into new.sort_order
  from public.favorite_collections c
  where c.user_id = new.user_id;
  return new;
end;
$function$;

revoke all on function private.assign_favorite_collection_order() from public, anon, authenticated;
drop trigger if exists favorite_collections_assign_order on public.favorite_collections;
create trigger favorite_collections_assign_order
before insert on public.favorite_collections
for each row execute function private.assign_favorite_collection_order();

commit;
