-- U3.0 release-note preference constraint regression.
begin;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.learning_page_introduction_preferences'::regclass
      and conname = 'learning_page_introduction_preferences_page_key_check'
  ) then
    raise exception 'Release-note page_key constraint is missing.';
  end if;

  if not pg_get_constraintdef((
    select oid from pg_constraint
    where conrelid = 'public.learning_page_introduction_preferences'::regclass
      and conname = 'learning_page_introduction_preferences_page_key_check'
  )) like '%release:%' then
    raise exception 'Release-note version keys are not allowed by the constraint.';
  end if;
end;
$$;

rollback;
