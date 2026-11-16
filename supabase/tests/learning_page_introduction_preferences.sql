-- Structural/security assertions for the account-scoped learning page intro preference table.
do $$
declare
  v_rls boolean;
  v_policy_count integer;
begin
  select c.relrowsecurity into v_rls
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relname='learning_page_introduction_preferences';
  if coalesce(v_rls,false) is not true then
    raise exception 'RLS must be enabled on learning_page_introduction_preferences';
  end if;

  select count(*) into v_policy_count
  from pg_policies
  where schemaname='public' and tablename='learning_page_introduction_preferences'
    and roles @> array['authenticated']::name[];
  if v_policy_count <> 4 then
    raise exception 'Expected four authenticated owner-scoped policies; found %',v_policy_count;
  end if;

  if has_table_privilege('anon','public.learning_page_introduction_preferences','SELECT')
     or has_table_privilege('anon','public.learning_page_introduction_preferences','INSERT') then
    raise exception 'Anonymous users must not access learning page introduction preferences';
  end if;

  if not has_table_privilege('authenticated','public.learning_page_introduction_preferences','SELECT')
     or not has_table_privilege('authenticated','public.learning_page_introduction_preferences','INSERT')
     or not has_table_privilege('authenticated','public.learning_page_introduction_preferences','UPDATE')
     or not has_table_privilege('authenticated','public.learning_page_introduction_preferences','DELETE') then
    raise exception 'Authenticated users must have CRUD privileges, constrained by owner-scoped RLS';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid='public.learning_page_introduction_preferences'::regclass
      and contype='p'
  ) then
    raise exception 'Account/page composite primary key is required';
  end if;
end $$;

select 'Learning page introduction preference security assertions passed.' as result;
