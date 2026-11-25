-- SwiftDictionary U2.9.0 Favorite Collections — schema/security regression.
-- Run after the migration in the isolated staging database.
begin;

do $p4schema$
declare
  v_rls_collections boolean;
  v_rls_items boolean;
  v_policy_count integer;
  v_fk_count integer;
  v_unique_index boolean;
  v_bad_policy_count integer;
  v_realtime_table_count integer;
  v_saved_word_schema_count integer;
  v_broadcast_policy_count integer;
  v_broadcast_trigger_count integer;
  v_broadcast_secure boolean;
  v_realtime_rls boolean;
begin
  select c.relrowsecurity into v_rls_collections
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relname='favorite_collections';

  select c.relrowsecurity into v_rls_items
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relname='favorite_collection_items';

  if coalesce(v_rls_collections,false) is not true then
    raise exception 'favorite_collections must have RLS enabled';
  end if;
  if coalesce(v_rls_items,false) is not true then
    raise exception 'favorite_collection_items must have RLS enabled';
  end if;

  select count(*) into v_policy_count
  from pg_policies
  where schemaname='public' and tablename='favorite_collections'
    and policyname in (
      'favorite_collections_select_own','favorite_collections_insert_own',
      'favorite_collections_update_own','favorite_collections_delete_own'
    );
  if v_policy_count <> 4 then
    raise exception 'Expected 4 owner-scoped collection policies, found %',v_policy_count;
  end if;

  select count(*) into v_policy_count
  from pg_policies
  where schemaname='public' and tablename='favorite_collection_items'
    and policyname in (
      'favorite_collection_items_select_own','favorite_collection_items_insert_own',
      'favorite_collection_items_delete_own'
    );
  if v_policy_count <> 3 then
    raise exception 'Expected 3 owner-scoped membership policies, found %',v_policy_count;
  end if;

  select count(*) into v_bad_policy_count
  from pg_policies
  where schemaname='public' and tablename='favorite_collections'
    and policyname in (
      'favorite_collections_select_own','favorite_collections_insert_own',
      'favorite_collections_update_own','favorite_collections_delete_own'
    )
    and (
      coalesce(qual,with_check) not ilike '%auth.uid%'
      or coalesce(qual,with_check) not ilike '%user_id%'
    );
  if v_bad_policy_count <> 0 then
    raise exception 'A collection policy is missing its owner predicate';
  end if;

  select count(*) into v_bad_policy_count
  from pg_policies
  where schemaname='public' and tablename='favorite_collection_items'
    and policyname in (
      'favorite_collection_items_select_own','favorite_collection_items_insert_own',
      'favorite_collection_items_delete_own'
    )
    and (
      case when cmd='INSERT' then with_check else qual end not ilike '%auth.uid%'
      or case when cmd='INSERT' then with_check else qual end not ilike '%favorite_collections%'
      or case when cmd='INSERT' then with_check else qual end not ilike '%saved_words%'
    );
  if v_bad_policy_count <> 0 then
    raise exception 'A membership policy is missing collection or saved-word ownership checks';
  end if;

  select count(*) into v_fk_count
  from pg_constraint con
  join pg_class rel on rel.oid=con.conrelid
  join pg_namespace n on n.oid=rel.relnamespace
  where n.nspname='public' and rel.relname='favorite_collection_items'
    and con.contype='f' and con.confdeltype='c';
  if v_fk_count <> 2 then
    raise exception 'Both membership foreign keys must cascade; found %',v_fk_count;
  end if;

  select exists (
    select 1 from pg_indexes
    where schemaname='public' and tablename='favorite_collections'
      and indexname='favorite_collections_user_name_unique'
  ) into v_unique_index;
  if not v_unique_index then
    raise exception 'Case-insensitive per-user collection-name uniqueness index is missing';
  end if;

  if has_table_privilege('anon','public.favorite_collections','select')
     or has_table_privilege('anon','public.favorite_collection_items','select') then
    raise exception 'Anonymous role must not read collections or memberships';
  end if;

  if not has_table_privilege('authenticated','public.favorite_collections','select')
     or not has_table_privilege('authenticated','public.favorite_collection_items','insert') then
    raise exception 'Authenticated grants are incomplete';
  end if;

  select count(*) into v_saved_word_schema_count
  from information_schema.columns
  where table_schema='public' and table_name='saved_words'
    and ((column_name='id' and data_type='bigint')
      or (column_name='user_id' and data_type='uuid')
      or (column_name='course' and data_type='text')
      or (column_name='word' and data_type='text'));
  if v_saved_word_schema_count <> 4 then
    raise exception 'Favorite Collections expects the existing saved_words id/user_id/course/word columns; found % of 4',v_saved_word_schema_count;
  end if;

  select count(*) into v_realtime_table_count
  from pg_publication_tables
  where pubname='supabase_realtime' and schemaname='public'
    and tablename in ('favorite_collections','favorite_collection_items');
  if v_realtime_table_count <> 0 then
    raise exception 'Collection tables must stay out of Postgres Changes; private Broadcast is the only sync channel (found % publication entries)',v_realtime_table_count;
  end if;

  select c.relrowsecurity into v_realtime_rls
  from pg_class c where c.oid='realtime.messages'::regclass;
  if coalesce(v_realtime_rls,false) is not true then
    raise exception 'Realtime messages must have RLS enabled for private broadcasts';
  end if;

  select count(*) into v_broadcast_policy_count
  from pg_policies
  where schemaname='realtime' and tablename='messages'
    and policyname='authenticated can receive own favorite collection broadcasts'
    and cmd='SELECT'
    and coalesce(qual,'') ilike '%realtime.topic%'
    and coalesce(qual,'') ilike '%auth.uid%'
    and coalesce(qual,'') ilike '%broadcast%';
  if v_broadcast_policy_count <> 1 then
    raise exception 'Owner-scoped private Broadcast receive policy is missing or incomplete';
  end if;

  select count(*) into v_broadcast_trigger_count
  from pg_trigger
  where not tgisinternal
    and tgfoid='private.broadcast_favorite_collection_changes()'::regprocedure
    and tgname in ('favorite_collections_broadcast_changes','favorite_collection_items_broadcast_changes');
  if v_broadcast_trigger_count <> 2 then
    raise exception 'Both collection tables must have private Broadcast triggers; found %',v_broadcast_trigger_count;
  end if;

  select p.prosecdef and p.proconfig @> array['search_path=""']
  into v_broadcast_secure
  from pg_proc p
  where p.oid='private.broadcast_favorite_collection_changes()'::regprocedure;
  if coalesce(v_broadcast_secure,false) is not true then
    raise exception 'Broadcast trigger must be SECURITY DEFINER with an empty search_path';
  end if;

  if has_function_privilege('anon','private.broadcast_favorite_collection_changes()','execute')
     or has_function_privilege('authenticated','private.broadcast_favorite_collection_changes()','execute') then
    raise exception 'Broadcast trigger function must not be executable by API roles';
  end if;
end $p4schema$;

-- Exercise actual PostgreSQL RLS as the authenticated role using two existing
-- staging accounts. All test folders and memberships are rolled back below.
create temporary table _phase4_rls_test_accounts on commit drop as
select user_id, min(id) as saved_word_id,
       row_number() over(order by count(*) desc) as account_no
from public.saved_words
group by user_id
order by count(*) desc
limit 2;
grant select on _phase4_rls_test_accounts to authenticated;

set local role authenticated;
do $phase4$
declare
  user_a uuid;
  user_b uuid;
  word_a bigint;
  word_b bigint;
  collection_a uuid;
  collection_b uuid;
  visible_count integer;
  affected integer;
  denied boolean := false;
  suffix text := left(gen_random_uuid()::text, 24);
begin
  select user_id,saved_word_id into user_a,word_a
  from _phase4_rls_test_accounts where account_no=1;
  select user_id,saved_word_id into user_b,word_b
  from _phase4_rls_test_accounts where account_no=2;

  if user_a is null or user_b is null then
    raise notice 'Skipped live two-account RLS exercise: staging needs saved words for two accounts';
    return;
  end if;

  perform set_config('request.jwt.claim.sub', user_a::text, true);
  insert into public.favorite_collections(user_id,name)
  values(user_a,'__p4a_' || suffix) returning id into collection_a;
  insert into public.favorite_collection_items(collection_id,saved_word_id)
  values(collection_a,word_a);

  perform set_config('request.jwt.claim.sub', user_b::text, true);
  insert into public.favorite_collections(user_id,name)
  values(user_b,'__p4b_' || suffix) returning id into collection_b;
  select count(*) into visible_count from public.favorite_collections where id=collection_a;
  if visible_count <> 0 then raise exception 'Account B can read Account A collection'; end if;
  select count(*) into visible_count from public.favorite_collection_items where collection_id=collection_a;
  if visible_count <> 0 then raise exception 'Account B can read Account A membership'; end if;

  update public.favorite_collections set name='__p4_hijacked_' || suffix where id=collection_a;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Account B updated Account A collection'; end if;
  delete from public.favorite_collections where id=collection_a;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Account B deleted Account A collection'; end if;

  begin
    insert into public.favorite_collection_items(collection_id,saved_word_id)
    values(collection_a,word_b);
  exception when insufficient_privilege then denied := true;
  end;
  if not denied then raise exception 'Account B inserted membership into Account A collection'; end if;

  denied := false;
  begin
    insert into public.favorite_collection_items(collection_id,saved_word_id)
    values(collection_b,word_a);
  exception when insufficient_privilege then denied := true;
  end;
  if not denied then raise exception 'Account B added another account saved word to its own collection'; end if;

  delete from public.favorite_collection_items where collection_id=collection_a;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Account B deleted Account A membership'; end if;

  perform set_config('request.jwt.claim.sub', user_a::text, true);
  update public.favorite_collections set name='__p4a_renamed_' || suffix where id=collection_a;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Account A cannot rename its own collection'; end if;

  denied := false;
  begin
    update public.favorite_collections set user_id=user_b where id=collection_a;
  exception when insufficient_privilege then denied := true;
  end;
  if not denied then raise exception 'Account A reassigned collection ownership'; end if;

  select count(*) into visible_count from public.favorite_collection_items where collection_id=collection_a;
  if visible_count <> 1 then raise exception 'Account A cannot read its own membership'; end if;

  -- Removing a saved word must cascade its membership out of every folder.
  -- The enclosing transaction is rolled back, so the staging account's word is preserved.
  delete from public.saved_words where id=word_a;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Account A could not delete its own saved word in the cascade regression'; end if;
  select count(*) into visible_count from public.favorite_collection_items where saved_word_id=word_a;
  if visible_count <> 0 then raise exception 'Deleting a saved word did not remove its collection memberships'; end if;

  delete from public.favorite_collections where id=collection_a;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Account A cannot delete its own collection'; end if;

  perform set_config('request.jwt.claim.sub', user_b::text, true);
  delete from public.favorite_collections where id=collection_b;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Account B cannot delete its own collection'; end if;

  raise notice 'PASS: authenticated two-account RLS isolation, own CRUD and foreign membership denial';
end $phase4$;

rollback;
