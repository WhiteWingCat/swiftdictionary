-- Test-only observers for isolated Quiz integration tests.
-- These are installed only in disposable CI databases, never in production.
-- Test-only clock control for the Flashcard duration integration test.
-- The override is installed only in disposable CI databases, never in production.
create or replace function private.guard_flashcard_session_identity_update()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if new.user_id is distinct from old.user_id
     or new.mode is distinct from old.mode
     or new.difficulty is distinct from old.difficulty
     or new.duration_seconds is distinct from old.duration_seconds
     or new.learning_language_code is distinct from old.learning_language_code
     or new.translation_language_code is distinct from old.translation_language_code
     or (new.started_at is distinct from old.started_at
         and pg_catalog.current_setting('swiftdictionary.test_flashcard_clock',true) is distinct from 'on') then
    raise exception 'Flashcard game identity and language snapshots are immutable'
      using errcode='42501';
  end if;
  return new;
end;
$function$;

create or replace function public.test_elapse_my_flashcard_challenge()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid:=auth.uid();
  v_session_id uuid;
  v_duration integer;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  perform pg_catalog.set_config('swiftdictionary.test_flashcard_clock','on',true);
  update private.flashcard_sessions s
    set started_at=pg_catalog.now()-pg_catalog.make_interval(secs=>(s.duration_seconds+1)::double precision)
    where s.user_id=v_user and s.status='in_progress'
    returning s.id,s.duration_seconds into v_session_id,v_duration;
  perform pg_catalog.set_config('swiftdictionary.test_flashcard_clock','off',true);
  if v_session_id is null then
    raise exception 'No active Flashcard challenge exists for this account' using errcode='P0002';
  end if;
  return pg_catalog.jsonb_build_object('session_id',v_session_id,'duration_seconds',v_duration);
end;
$function$;
revoke all on function public.test_elapse_my_flashcard_challenge() from public,anon,service_role;
grant execute on function public.test_elapse_my_flashcard_challenge() to authenticated;

create or replace function public.test_current_quiz_usage()
returns integer
language sql
security definer
set search_path=''
as $$
  select coalesce((
    select u.used_count from private.learning_allowance_usage u
    where u.user_id=auth.uid() and u.activity_type='quiz'
  ),0)
$$;

create or replace function public.test_my_quiz_session_count()
returns integer
language plpgsql
security definer
set search_path=''
as $$
declare v_count integer;
begin
  select count(*)::integer into v_count
  from private.quiz_sessions s where s.user_id=auth.uid();
  return v_count;
end;
$$;

create or replace function public.test_my_quiz_completed_event_count()
returns integer
language sql
security definer
set search_path=''
as $$
  select count(*)::integer from public.learning_activity_log l
  where l.user_id=auth.uid() and l.activity_type='quiz' and l.event_type='completed'
$$;

revoke all on function public.test_current_quiz_usage() from public,anon;
revoke all on function public.test_my_quiz_session_count() from public,anon;
revoke all on function public.test_my_quiz_completed_event_count() from public,anon;
grant execute on function public.test_current_quiz_usage() to authenticated;
grant execute on function public.test_my_quiz_session_count() to authenticated;
grant execute on function public.test_my_quiz_completed_event_count() to authenticated;
