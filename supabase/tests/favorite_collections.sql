-- SwiftDictionary U2.9.0 Favorite Collections — schema/security regression.
-- Run after the migration in the isolated staging database.
begin;

do $$
declare
  v_rls_collections boolean;
  v_rls_items boolean;
  v_policy_count integer;
  v_fk_count integer;
  v_unique_index boolean;
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
end $$;

rollback;
