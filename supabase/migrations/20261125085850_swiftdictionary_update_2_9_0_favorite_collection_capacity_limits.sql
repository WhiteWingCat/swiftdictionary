-- SwiftDictionary U2.9.0 — enforce per-plan Favorite Collections folder capacity.
-- Limits are enforced transactionally on the server; UI counts are intentionally not exposed.
begin;

create or replace function private.create_favorite_collection_with_limit(p_name text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_plan_code text;
  v_limit integer;
  v_count integer;
  v_id uuid;
  v_name text;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_name is null or char_length(btrim(p_name)) not between 1 and 48 then
    raise exception 'Collection names must be 1–48 characters' using errcode = '22023';
  end if;

  -- Serialize create requests per account so concurrent requests cannot pass
  -- the count check and both insert beyond the plan limit.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );

  select e.plan_code
    into v_plan_code
  from public.user_entitlements e
  where e.user_id = v_user_id
    and e.status = 'active'
    and (e.valid_from is null or e.valid_from <= pg_catalog.now())
    and (e.valid_until is null or e.valid_until > pg_catalog.now());

  if not found then
    v_plan_code := 'free';
  end if;

  v_limit := case when v_plan_code = 'premium' then 40 else 16 end;

  select count(*)::integer
    into v_count
  from public.favorite_collections c
  where c.user_id = v_user_id;

  if v_count >= v_limit then
    raise exception using
      errcode = 'P0001',
      message = 'COLLECTION_FOLDER_LIMIT_REACHED',
      detail = pg_catalog.jsonb_build_object(
        'plan_code', v_plan_code,
        'folder_limit', v_limit,
        'folder_count', v_count
      )::text;
  end if;

  insert into public.favorite_collections(user_id, name)
  values (v_user_id, btrim(p_name))
  returning id, name into v_id, v_name;

  return pg_catalog.jsonb_build_object('id', v_id, 'name', v_name);
end;
$function$;

revoke all on function private.create_favorite_collection_with_limit(text) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.create_favorite_collection_with_limit(text) to authenticated;

create or replace function public.create_my_favorite_collection(p_name text)
returns jsonb
language sql
security invoker
set search_path = ''
as $function$
  select private.create_favorite_collection_with_limit(p_name);
$function$;

revoke all on function public.create_my_favorite_collection(text) from public, anon, authenticated;
grant execute on function public.create_my_favorite_collection(text) to authenticated;

-- Creation must go through the transactional RPC; direct table INSERT would
-- otherwise bypass the server-side count check.
revoke insert on table public.favorite_collections from anon, authenticated;
drop policy if exists favorite_collections_insert_own on public.favorite_collections;

comment on function public.create_my_favorite_collection(text) is
  'Creates one account-owned Favorite Collection only when the active plan folder capacity (Free 16, Premium 40) has not been reached.';

commit;
