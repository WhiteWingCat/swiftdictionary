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
  update public.daily_activity_sessions set
    first_try_correct_count=p_first_try_correct_count,
    incorrect_attempt_count=p_incorrect_attempt_count,
    retry_count=p_retry_count,
    updated_at=now()
  where id=p_session_id and user_id=v_user;
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
