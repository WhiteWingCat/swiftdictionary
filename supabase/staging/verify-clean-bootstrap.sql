-- Assertions for the clean staging bootstrap. Run immediately after bootstrap,
-- before loading any disposable CI fixtures. This is safe for a fresh Supabase
-- project and must not be run after real tester accounts have been created.

create function public._staging_default_privilege_probe()
returns void language plpgsql as $staging_probe$ begin return; end $staging_probe$;

do $verify$
declare
  v_rls_missing text[];
begin
  if has_function_privilege('anon','public._staging_default_privilege_probe()','EXECUTE')
     or has_function_privilege('authenticated','public._staging_default_privilege_probe()','EXECUTE')
     or has_function_privilege('service_role','public._staging_default_privilege_probe()','EXECUTE') then
    raise exception 'New public functions must not inherit broad API execute privileges';
  end if;
  if exists (select 1 from auth.users) then
    raise exception 'Clean bootstrap unexpectedly created Auth users';
  end if;

  if exists (select 1 from public.saved_words)
     or exists (select 1 from public.profiles)
     or exists (select 1 from public.user_preferences)
     or exists (select 1 from public.user_entitlements)
     or exists (select 1 from public.learning_activity_log)
     or exists (select 1 from public.lesson_progress)
     or exists (select 1 from public.lesson_practice_results) then
    raise exception 'Clean bootstrap unexpectedly created user-specific application rows';
  end if;

  if (select count(*) from public.languages) <> 2
     or not exists (select 1 from public.languages where code='en')
     or not exists (select 1 from public.languages where code='zh') then
    raise exception 'Bootstrap must seed exactly the English and Simplified Chinese language references';
  end if;

  if (select count(*) from public.learning_plan_limits) <> 6 then
    raise exception 'Bootstrap must seed the six Free/Premium lesson, Quiz and Flashcard limit rows';
  end if;

  select array_agg(format('%I.%I',n.nspname,c.relname) order by n.nspname,c.relname)
    into v_rls_missing
  from pg_class c
  join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public'
    and c.relkind='r'
    and c.relname in (
      'saved_words','profiles','user_preferences','user_entitlements',
      'learning_plan_limits','learning_activity_log',
      'lesson_progress','lesson_practice_results'
    )
    and not c.relrowsecurity;

  if v_rls_missing is not null then
    raise exception 'RLS is not enabled on: %', array_to_string(v_rls_missing, ', ');
  end if;

  if has_table_privilege('anon','public.saved_words','SELECT')
     or has_table_privilege('anon','public.saved_words','INSERT')
     or has_table_privilege('anon','public.saved_words','DELETE') then
    raise exception 'Anonymous role must not have saved_words privileges';
  end if;

  if not has_table_privilege('authenticated','public.saved_words','SELECT')
     or not has_table_privilege('authenticated','public.saved_words','INSERT')
     or not has_table_privilege('authenticated','public.saved_words','DELETE') then
    raise exception 'Authenticated saved_words privileges are incomplete';
  end if;

  if not has_table_privilege('authenticated','public.user_preferences','INSERT')
     or not has_table_privilege('authenticated','public.lesson_progress','INSERT')
     or not has_sequence_privilege('authenticated','public.lesson_progress_id_seq','USAGE') then
    raise exception 'New-account preferences or lesson-start privileges are incomplete';
  end if;

  if not has_table_privilege('anon','public.languages','SELECT') then
    raise exception 'Anonymous role must be able to read active language references';
  end if;

  if not has_table_privilege('service_role','public.saved_words','SELECT')
     or not has_table_privilege('service_role','public.user_preferences','UPDATE')
     or not has_sequence_privilege('service_role','public.lesson_progress_id_seq','USAGE') then
    raise exception 'Server-side service_role grants are incomplete';
  end if;
end
$verify$;

drop function public._staging_default_privilege_probe();
