-- Verify public tables created by 2.3.x/2.4.0 have explicit server grants
-- and no accidental anonymous Data API exposure on the isolated staging schema.

do $$
begin
  if not has_table_privilege('service_role','public.daily_activity_sessions','SELECT')
     or not has_table_privilege('service_role','public.daily_activity_sessions','INSERT')
     or not has_table_privilege('service_role','public.daily_activity_sessions','UPDATE')
     or not has_table_privilege('service_role','public.daily_activity_sessions','DELETE') then
    raise exception 'service_role grants are incomplete on daily_activity_sessions';
  end if;

  if not has_table_privilege('service_role','public.learning_page_introduction_preferences','SELECT')
     or not has_table_privilege('service_role','public.learning_page_introduction_preferences','INSERT')
     or not has_table_privilege('service_role','public.learning_page_introduction_preferences','UPDATE')
     or not has_table_privilege('service_role','public.learning_page_introduction_preferences','DELETE') then
    raise exception 'service_role grants are incomplete on learning_page_introduction_preferences';
  end if;

  if has_table_privilege('anon','public.daily_activity_sessions','SELECT')
     or has_table_privilege('anon','public.learning_page_introduction_preferences','SELECT') then
    raise exception 'Anonymous Data API access must not be granted to account-specific learning tables';
  end if;

  if not has_table_privilege('authenticated','public.daily_activity_sessions','SELECT')
     or not has_table_privilege('authenticated','public.learning_page_introduction_preferences','SELECT') then
    raise exception 'Authenticated user grants are missing from owner-scoped learning tables';
  end if;

  if not has_function_privilege('authenticated','public.start_my_quiz(text)','EXECUTE')
     or not has_function_privilege('authenticated','public.get_my_quiz_availability()','EXECUTE')
     or has_function_privilege('anon','public.start_my_quiz(text)','EXECUTE')
     or has_function_privilege('anon','public.get_my_quiz_availability()','EXECUTE')
     or has_function_privilege('anon','public.enforce_learning_daily_limit()','EXECUTE')
     or has_function_privilege('anon','public.guard_lesson_progress_update()','EXECUTE') then
    raise exception 'Authenticated Quiz RPC grants or private trigger-function restrictions are incorrect';
  end if;
end
$$;
