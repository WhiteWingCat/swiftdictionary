#!/usr/bin/env bash
set -euo pipefail

db="${DATABASE_URL:?DATABASE_URL is required}"
uid="33333333-3333-4333-8333-333333333333"

# Four confirmed first starts use four of the five Free lesson slots.
psql "$db" -X -v ON_ERROR_STOP=1 <<SQL
select set_config('request.jwt.claim.sub', '$uid', false);
set role authenticated;
insert into public.lesson_progress(user_id,learning_language,difficulty,lesson_id,status)
select '$uid','en','beginner','concurrent-' || lpad(n::text,2,'0'),'in_progress'
from generate_series(1,4) as n;
SQL

run_lesson_start() {
  local lesson="$1"
  local output="/tmp/start-${lesson}.out"
  local status="/tmp/start-${lesson}.status"
  set +e
  psql "$db" -X -v ON_ERROR_STOP=1 >"$output" 2>&1 <<SQL
begin;
select set_config('request.jwt.claim.sub', '$uid', true);
set local role authenticated;
-- Both users select a new lesson together; the allowance ledger must serialize starts.
select pg_sleep(1);
insert into public.lesson_progress(user_id,learning_language,difficulty,lesson_id,status)
values ('$uid','en','beginner','$lesson','in_progress');
commit;
SQL
  echo "$?" >"$status"
  set -e
}

run_lesson_start concurrent-05 &
pid_a=$!
run_lesson_start concurrent-06 &
pid_b=$!
wait "$pid_a"
wait "$pid_b"

status_a="$(cat /tmp/start-concurrent-05.status)"
status_b="$(cat /tmp/start-concurrent-06.status)"
if ! { [[ "$status_a" -eq 0 && "$status_b" -ne 0 ]] || [[ "$status_a" -ne 0 && "$status_b" -eq 0 ]]; }; then
  echo "Expected exactly one concurrent first lesson start to succeed and one to hit the allowance."
  cat /tmp/start-concurrent-05.out /tmp/start-concurrent-06.out
  exit 1
fi

psql "$db" -X -v ON_ERROR_STOP=1 <<'SQL'
do $$
declare
  v_started integer;
  v_progress integer;
  v_used integer;
begin
  select count(*) into v_started
  from public.learning_activity_log
  where user_id = '33333333-3333-4333-8333-333333333333'
    and activity_type = 'lesson' and event_type = 'started';
  select count(*) into v_progress
  from public.lesson_progress
  where user_id = '33333333-3333-4333-8333-333333333333'
    and status = 'in_progress';
  v_used := private.current_learning_allowance_usage(
    '33333333-3333-4333-8333-333333333333'::uuid,'lesson','UTC'
  );

  if v_started <> 5 then
    raise exception 'Concurrent first-start race produced % start events; expected exactly 5', v_started;
  end if;
  if v_progress <> 5 then
    raise exception 'Concurrent first-start race left % in-progress lessons; expected exactly 5', v_progress;
  end if;
  if v_used <> 5 then
    raise exception 'Concurrent first-start race used % allowances; expected exactly 5', v_used;
  end if;
end;
$$;
SQL

# Completion of an already-charged lesson must remain possible at the limit.
psql "$db" -X -v ON_ERROR_STOP=1 <<SQL
select set_config('request.jwt.claim.sub', '$uid', false);
set role authenticated;
select (public.complete_permanent_lesson(
  'beginner',
  (select lesson_id from public.lesson_progress
   where user_id='$uid' and lesson_id in ('concurrent-05','concurrent-06')
     and status='in_progress' limit 1),
  'sentence-basics',3,3
)).status;
SQL

psql "$db" -X -v ON_ERROR_STOP=1 <<'SQL'
do $$
declare
  v_started integer;
  v_completed integer;
  v_used integer;
begin
  select count(*) into v_started
  from public.learning_activity_log
  where user_id = '33333333-3333-4333-8333-333333333333'
    and activity_type = 'lesson' and event_type = 'started';
  select count(*) into v_completed
  from public.learning_activity_log
  where user_id = '33333333-3333-4333-8333-333333333333'
    and activity_type = 'lesson' and event_type = 'completed';
  v_used := private.current_learning_allowance_usage(
    '33333333-3333-4333-8333-333333333333'::uuid,'lesson','UTC'
  );

  if v_started <> 5 or v_completed <> 1 or v_used <> 5 then
    raise exception 'Completing an already-charged lesson changed the allowance: started %, completed %, used %',
      v_started,v_completed,v_used;
  end if;
end;
$$;
SQL

echo "Concurrent lesson-start test passed: one of two final starts committed, and completion did not charge twice."

# Concurrent retries for the same daily reading session must be idempotent:
# both callers may receive the completed row, but only one completion event is written.
daily_uid="66666666-6666-4666-8666-666666666666"
psql "$db" -X -v ON_ERROR_STOP=1 <<SQL
insert into auth.users(id) values ('$daily_uid');
insert into public.user_preferences(user_id,timezone)
values ('$daily_uid','UTC');
insert into public.user_entitlements(user_id,plan_code,status)
values ('$daily_uid','free','active');
SQL

daily_session_id="$(psql "$db" -qAtX -v ON_ERROR_STOP=1 <<SQL
select set_config('request.jwt.claim.sub', '$daily_uid', false) \gset
set role authenticated;
select (public.start_daily_activity_session('daily_topic','daily-topic-concurrency-01','sentence-basics','beginner','daily')).id;
SQL
)"

run_daily_completion() {
  local label="$1"
  local output="/tmp/daily-$label.out"
  local status="/tmp/daily-$label.status"
  set +e
  psql "$db" -X -v ON_ERROR_STOP=1 >"$output" 2>&1 <<SQL
begin;
select set_config('request.jwt.claim.sub', '$daily_uid', true);
set local role authenticated;
select pg_sleep(1);
select (public.complete_daily_activity_session('$daily_session_id', null, null)).status;
commit;
SQL
  echo "$?" >"$status"
  set -e
}

run_daily_completion a &
daily_pid_a=$!
run_daily_completion b &
daily_pid_b=$!
wait "$daily_pid_a"
wait "$daily_pid_b"

psql "$db" -X -v ON_ERROR_STOP=1 <<SQL
do \$\$
declare
  v_events integer;
  v_status text;
begin
  select count(*) into v_events
  from public.learning_activity_log
  where user_id = '$daily_uid'
    and activity_type = 'daily_topic'
    and event_type = 'completed';
  select status into v_status
  from public.daily_activity_sessions
  where id = '$daily_session_id';

  if v_events <> 1 then
    raise exception 'Concurrent daily completion retries wrote % events; expected exactly 1', v_events;
  end if;
  if v_status <> 'completed' then
    raise exception 'Concurrent daily completion left the session in status %', v_status;
  end if;
end;
\$\$;
SQL

if [[ "$(cat /tmp/daily-a.status)" -ne 0 || "$(cat /tmp/daily-b.status)" -ne 0 ]]; then
  echo "Concurrent daily completion retry unexpectedly failed."
  cat /tmp/daily-a.out /tmp/daily-b.out
  exit 1
fi

echo "Concurrent daily completion test passed: duplicate requests wrote exactly one event."

echo "Concurrent completion test passed: one completion committed, one was rejected, and the quota remained at five."
