-- Update 2.4.1 regression assertions for the Quiz translation-language fix.
do $assertions$
declare
  v_availability text := pg_catalog.pg_get_functiondef('private.get_my_quiz_availability_impl()'::regprocedure);
  v_start text := pg_catalog.pg_get_functiondef('private.start_my_quiz_impl(text,text,text)'::regprocedure);
begin
  if pg_catalog.strpos(v_availability, 'q.translation_language_code = ''zh''') = 0 then
    raise exception 'Quiz availability must use the deployed Simplified Chinese content pack independently of display translation preference';
  end if;
  if pg_catalog.strpos(v_start, 'v_translation = ''zh''') = 0 then
    raise exception 'Chinese integration questions must remain conditional on the selected Simplified Chinese translation';
  end if;
  if pg_catalog.strpos(v_start, 'p_translation_language') = 0 then
    raise exception 'Quiz start must accept the current selector translation value';
  end if;
  if pg_catalog.has_function_privilege('anon','public.start_my_quiz(text,text,text)','EXECUTE') then
    raise exception 'Anonymous role must not execute the three-argument Quiz start RPC';
  end if;
  if not pg_catalog.has_function_privilege('authenticated','public.start_my_quiz(text,text,text)','EXECUTE') then
    raise exception 'Authenticated role is missing the three-argument Quiz start RPC';
  end if;
end;
$assertions$;
