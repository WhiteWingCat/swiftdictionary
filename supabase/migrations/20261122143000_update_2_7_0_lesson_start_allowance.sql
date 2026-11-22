-- SwiftDictionary U2.7.0 — charge permanent lesson allowance on first selection.
-- A new lesson start is charged atomically with its lesson_progress insert.
-- Resuming an in-progress lesson and reviewing a completed lesson remain free.
begin;

create or replace function public.enforce_learning_daily_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_timezone text;
  v_plan text;
  v_status text;
  v_valid_from timestamptz;
  v_valid_until timestamptz;
  v_limit integer;
  v_enabled boolean;
  v_start timestamptz;
  v_end timestamptz;
  v_used integer;
  v_error_message text;
begin
  if auth.uid() is null or auth.uid() <> new.user_id then
    raise exception 'Authentication required for own learning activity'
      using errcode = '42501';
  end if;

  new.created_at := pg_catalog.now();

  -- Permanent lessons charge on their first start. Their later completion
  -- event remains history-only so a lesson can never be charged twice.
  -- Daily activities continue to charge only after successful completion.
  if new.activity_type = 'lesson' then
    if new.event_type <> 'started' then
      return new;
    end if;
    v_error_message := 'Daily lesson start limit reached';
  else
    if new.event_type <> 'completed' then
      return new;
    end if;
    v_error_message := 'Daily learning completion limit reached';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.user_id::text, 0)
  );

  select coalesce(
           case when p.allowance_timezone is not null
                     and p.allowance_timezone_until > pg_catalog.now()
                then p.allowance_timezone else p.timezone end,
           'UTC'
         )
  into v_timezone
  from public.user_preferences p
  where p.user_id = new.user_id;

  if not exists (
    select 1 from pg_catalog.pg_timezone_names where name = v_timezone
  ) then
    raise exception 'Invalid IANA timezone in user preferences'
      using errcode = '22023';
  end if;

  select e.plan_code, e.status, e.valid_from, e.valid_until
  into v_plan, v_status, v_valid_from, v_valid_until
  from public.user_entitlements e
  where e.user_id = new.user_id;

  if not found or v_status <> 'active'
     or (v_valid_from is not null and pg_catalog.now() < v_valid_from)
     or (v_valid_until is not null and pg_catalog.now() >= v_valid_until) then
    v_plan := 'free';
  end if;

  select l.daily_limit, l.is_enabled into v_limit, v_enabled
  from public.learning_plan_limits l
  where l.plan_code = v_plan and l.activity_type = new.activity_type;

  if not found or not v_enabled then
    raise exception 'This learning activity is currently unavailable'
      using errcode = '42501';
  end if;

  -- The personal testing exemption remains limited to permanent lessons.
  if new.activity_type = 'lesson' and private.is_learning_limit_exempt() then
    return new;
  end if;

  v_start := (((pg_catalog.now() at time zone v_timezone)::date)::timestamp
                at time zone v_timezone);
  v_end := ((((pg_catalog.now() at time zone v_timezone)::date + 1)::timestamp)
                at time zone v_timezone);

  insert into private.learning_allowance_usage
    (user_id, activity_type, window_start, window_end, used_count)
  values
    (new.user_id, new.activity_type, v_start, v_end, 1)
  on conflict (user_id, activity_type)
  do update
  set window_start = excluded.window_start,
      window_end = excluded.window_end,
      used_count = case
        when private.learning_allowance_usage.window_start = excluded.window_start
         and private.learning_allowance_usage.window_end = excluded.window_end
        then private.learning_allowance_usage.used_count + 1
        else 1
      end,
      updated_at = pg_catalog.now()
  where private.learning_allowance_usage.window_start is distinct from excluded.window_start
     or private.learning_allowance_usage.window_end is distinct from excluded.window_end
     or private.learning_allowance_usage.used_count < v_limit
  returning used_count into v_used;

  if not found then
    select u.used_count into v_used
    from private.learning_allowance_usage u
    where u.user_id = new.user_id
      and u.activity_type = new.activity_type;

    raise exception '%', v_error_message
      using errcode = 'P0001',
            detail = pg_catalog.json_build_object(
              'activity_type', new.activity_type,
              'daily_limit', v_limit,
              'used', coalesce(v_used, v_limit),
              'timezone', v_timezone,
              'resets_at', v_end
            )::text;
  end if;

  return new;
end;
$function$;

revoke all on function public.enforce_learning_daily_limit()
  from public, anon, authenticated, service_role;

-- Charge only the first insert of an in-progress lesson. Existing rows are
-- resumed/reviewed without a new insert, and completed lessons are never
-- reinserted, so neither action consumes another allowance.
create or replace function public.record_lesson_start_allowance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.status <> 'in_progress' then
    return new;
  end if;

  if auth.uid() is null or auth.uid() <> new.user_id then
    raise exception 'Authentication required for own lesson start'
      using errcode = '42501';
  end if;

  -- The personal test account is fully exempt: do not create a ledger event.
  if private.is_learning_limit_exempt() then
    return new;
  end if;

  insert into public.learning_activity_log
    (user_id, activity_type, language_code, event_type)
  values
    (new.user_id, 'lesson', new.learning_language, 'started');

  return new;
end;
$function$;

revoke all on function public.record_lesson_start_allowance()
  from public, anon, authenticated, service_role;

drop trigger if exists lesson_progress_charge_on_first_start
  on public.lesson_progress;
create trigger lesson_progress_charge_on_first_start
after insert on public.lesson_progress
for each row
execute function public.record_lesson_start_allowance();

commit;
