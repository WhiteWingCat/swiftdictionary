-- U2.8.0 first-attempt and retry analytics for Daily Learning.
begin;

alter table public.daily_activity_sessions
  add column if not exists first_try_correct_count integer;
alter table public.daily_activity_sessions
  add column if not exists incorrect_attempt_count integer;
alter table public.daily_activity_sessions
  add column if not exists retry_count integer;

do $$
begin
  if not exists(select 1 from pg_constraint where conrelid='public.daily_activity_sessions'::regclass and conname='daily_activity_first_try_count_check') then
    alter table public.daily_activity_sessions add constraint daily_activity_first_try_count_check
      check(first_try_correct_count is null or (question_count is not null and first_try_correct_count between 0 and question_count));
  end if;
  if not exists(select 1 from pg_constraint where conrelid='public.daily_activity_sessions'::regclass and conname='daily_activity_incorrect_attempt_count_check') then
    alter table public.daily_activity_sessions add constraint daily_activity_incorrect_attempt_count_check
      check(incorrect_attempt_count is null or incorrect_attempt_count>=0);
  end if;
  if not exists(select 1 from pg_constraint where conrelid='public.daily_activity_sessions'::regclass and conname='daily_activity_retry_count_check') then
    alter table public.daily_activity_sessions add constraint daily_activity_retry_count_check
      check(retry_count is null or retry_count>=0);
  end if;
end $$;

-- Permit only the trusted U2.8.0 attempt-metrics RPC to annotate an already
-- completed Daily Application/Revision session. All session identity, lifecycle
-- and completion-result fields remain immutable after completion.
create or replace function public.guard_daily_activity_session_update()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if new.id is distinct from old.id
     or new.user_id is distinct from old.user_id
     or new.activity_type is distinct from old.activity_type
     or new.language_code is distinct from old.language_code
     or new.content_id is distinct from old.content_id
     or new.topic_id is distinct from old.topic_id
     or new.difficulty is distinct from old.difficulty
     or new.source is distinct from old.source
     or new.local_date is distinct from old.local_date
     or new.timezone is distinct from old.timezone
     or new.started_at is distinct from old.started_at
     or new.created_at is distinct from old.created_at then
    raise exception 'Daily activity session identity cannot be changed'
      using errcode = '42501';
  end if;

  if old.status = 'completed' then
    if pg_catalog.current_setting('swiftdictionary.daily_practice_attempt_rpc', true) = 'on'
       and new.status is not distinct from old.status
       and new.completed_at is not distinct from old.completed_at
       and new.correct_count is not distinct from old.correct_count
       and new.question_count is not distinct from old.question_count then
      new.updated_at := pg_catalog.now();
      return new;
    end if;
    raise exception 'Finished daily activity sessions cannot be changed'
      using errcode = '23514';
  end if;

  if old.status <> 'in_progress' then
    raise exception 'Finished daily activity sessions cannot be changed'
      using errcode = '23514';
  end if;
  if new.status = 'completed'
     and pg_catalog.current_setting('swiftdictionary.daily_completion_rpc', true)
         is distinct from 'on' then
    raise exception 'Use complete_daily_activity_session to save completion'
      using errcode = '42501';
  end if;
  if new.status = 'abandoned'
     and pg_catalog.current_setting('swiftdictionary.daily_abandon_rpc', true)
         is distinct from 'on' then
    raise exception 'Use abandon_daily_activity_session to abandon a daily activity'
      using errcode = '42501';
  end if;
  if new.status not in ('in_progress','completed','abandoned') then
    raise exception 'Invalid daily activity session status'
      using errcode = '23514';
  end if;
  if new.status = 'abandoned' then
    new.completed_at := null;
    new.correct_count := null;
    new.question_count := null;
  end if;
  new.updated_at := pg_catalog.now();
  return new;
end;
$function$;

create or replace function private.record_my_daily_practice_attempt_impl(
  p_session_id uuid,p_first_try_correct_count integer,
  p_incorrect_attempt_count integer,p_retry_count integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid:=auth.uid();
  v_session public.daily_activity_sessions%rowtype;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_session_id is null or p_first_try_correct_count is null
     or p_incorrect_attempt_count is null or p_retry_count is null
     or p_first_try_correct_count<0 or p_incorrect_attempt_count<0 or p_retry_count<0 then
    raise exception 'Invalid Daily Learning practice statistics' using errcode='22023';
  end if;
  select * into v_session from public.daily_activity_sessions
    where id=p_session_id and user_id=v_user for update;
  if not found then raise exception 'Daily activity session not found' using errcode='P0002'; end if;
  if v_session.status<>'completed' then
    raise exception 'Practice statistics can only be saved for completed activities' using errcode='42501';
  end if;
  if v_session.activity_type not in ('daily_application','daily_revision')
     or v_session.question_count is null
     or p_first_try_correct_count>v_session.question_count then
    raise exception 'This activity does not support question-attempt statistics' using errcode='22023';
  end if;
  if v_session.first_try_correct_count is not null
     and (v_session.first_try_correct_count is distinct from p_first_try_correct_count
       or v_session.incorrect_attempt_count is distinct from p_incorrect_attempt_count
       or v_session.retry_count is distinct from p_retry_count) then
    raise exception 'Daily Learning attempt statistics are already recorded' using errcode='23505';
  end if;
  perform pg_catalog.set_config('swiftdictionary.daily_practice_attempt_rpc','on',true);
  update public.daily_activity_sessions set
    first_try_correct_count=p_first_try_correct_count,
    incorrect_attempt_count=p_incorrect_attempt_count,
    retry_count=p_retry_count,
    updated_at=now()
  where id=p_session_id and user_id=v_user;
  perform pg_catalog.set_config('swiftdictionary.daily_practice_attempt_rpc','off',true);
  return pg_catalog.jsonb_build_object('session_id',p_session_id,
    'first_try_correct_count',p_first_try_correct_count,
    'incorrect_attempt_count',p_incorrect_attempt_count,'retry_count',p_retry_count);
end;
$function$;
revoke all on function private.record_my_daily_practice_attempt_impl(uuid,integer,integer,integer) from public,anon,authenticated;
grant execute on function private.record_my_daily_practice_attempt_impl(uuid,integer,integer,integer) to authenticated;

create or replace function public.record_my_daily_practice_attempt(
  p_session_id uuid,p_first_try_correct_count integer,
  p_incorrect_attempt_count integer,p_retry_count integer
)
returns jsonb
language sql
security invoker
set search_path = ''
as $function$
  select private.record_my_daily_practice_attempt_impl(
    p_session_id,p_first_try_correct_count,p_incorrect_attempt_count,p_retry_count
  );
$function$;
revoke all on function public.record_my_daily_practice_attempt(uuid,integer,integer,integer) from public,anon;
grant execute on function public.record_my_daily_practice_attempt(uuid,integer,integer,integer) to authenticated;

commit;
