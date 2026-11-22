\set ON_ERROR_STOP on
begin;

-- This test runs only against disposable local Supabase in CI.
-- It verifies legacy backfill, language isolation, approved content, RLS,
-- start-time lesson allowance, replay idempotency and English RPC compatibility.

do $legacy$
declare
  v_count integer;
  v_language text;
begin
  select count(*) into v_count
  from public.lesson_progress
  where user_id = '11111111-1111-4111-8111-111111111111'
    and learning_language <> 'en';
  if v_count <> 0 then
    raise exception 'Legacy lesson progress was not backfilled to English';
  end if;

  select learning_language into v_language
  from public.lesson_practice_results
  where user_id = '11111111-1111-4111-8111-111111111111'
    and lesson_id = 'legacy-01';
  if v_language is distinct from 'en' then
    raise exception 'Legacy practice summary should default to English, got %', v_language;
  end if;

  select count(*) into v_count
  from private.learning_content_catalog
  where activity_type = 'permanent_lesson'
    and language_code = 'zh'
    and is_active;
  if v_count <> 17 then
    raise exception 'Expected 17 approved Chinese permanent lessons, found %', v_count;
  end if;

  select count(*) into v_count
  from private.learning_content_catalog
  where language_code = 'zh'
    and activity_type <> 'permanent_lesson';
  if v_count <> 0 then
    raise exception 'U2.7.0 must not enable Chinese Daily Learning content';
  end if;
end;
$legacy$;

-- Test-only approved mappings. b-sentence exists in English; this additional
-- zh mapping intentionally uses the same content_id to prove course isolation.
insert into private.learning_content_catalog(
  activity_type,content_id,topic_id,difficulty,language_code,is_active
)
values
  ('permanent_lesson','b-sentence','zh-test-topic','beginner','zh',true),
  ('permanent_lesson','legacy-02','legacy-fixture-topic-2','beginner','en',true)
on conflict (activity_type,content_id,language_code)
do update set topic_id=excluded.topic_id,difficulty=excluded.difficulty,is_active=true;

insert into auth.users(id) values
  ('12121212-1212-4121-8121-121212121212'),
  ('13131313-1313-4131-8131-131313131313')
on conflict (id) do nothing;

insert into public.user_preferences(user_id,learning_language,translation_language,timezone)
values
  ('12121212-1212-4121-8121-121212121212','en','en','Asia/Kuala_Lumpur'),
  ('13131313-1313-4131-8131-131313131313','en','en','Asia/Kuala_Lumpur')
on conflict (user_id) do update set
  learning_language=excluded.learning_language,
  translation_language=excluded.translation_language,
  timezone=excluded.timezone;

insert into public.user_entitlements(user_id,plan_code,status)
values
  ('12121212-1212-4121-8121-121212121212','free','active'),
  ('13131313-1313-4131-8131-131313131313','free','active')
on conflict (user_id) do update set
  plan_code=excluded.plan_code,status='active',valid_from=null,valid_until=null;

-- Legacy English replay wrapper remains functional and idempotent.
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $legacy_replay$
declare
  v_first boolean;
  v_second boolean;
begin
  v_first := public.record_completed_lesson_practice_result(
    'beginner','legacy-02','legacy-fixture-topic-2',2,3
  );
  v_second := public.record_completed_lesson_practice_result(
    'beginner','legacy-02','legacy-fixture-topic-2',2,3
  );
  if v_first is distinct from true or v_second is distinct from false then
    raise exception 'Legacy English replay wrapper is not idempotent: first %, second %',v_first,v_second;
  end if;
end;
$legacy_replay$;

-- User 555 starts the same lesson identity in both courses.
select set_config('request.jwt.claim.sub','12121212-1212-4121-8121-121212121212',true);
insert into public.lesson_progress(user_id,learning_language,difficulty,lesson_id,status)
values
  ('12121212-1212-4121-8121-121212121212','en','beginner','b-sentence','in_progress'),
  ('12121212-1212-4121-8121-121212121212','zh','beginner','b-sentence','in_progress');

do $parallel_progress$
declare
  v_count integer;
  v_started integer;
  v_used integer;
begin
  select count(*) into v_count
  from public.lesson_progress
  where user_id=auth.uid() and lesson_id='b-sentence';
  if v_count <> 2 then
    raise exception 'English and Chinese progress should coexist for the same lesson ID; found %',v_count;
  end if;

  select count(*) into v_started
  from public.learning_activity_log
  where user_id=auth.uid() and activity_type='lesson' and event_type='started';
  if v_started <> 2 then
    raise exception 'Starting one new lesson in each course should create two allowance events; found %',v_started;
  end if;

  v_used := private.current_learning_allowance_usage(auth.uid(),'lesson','Asia/Kuala_Lumpur');
  if v_used <> 2 then
    raise exception 'Two first-start events should consume two shared lesson allowances; found %',v_used;
  end if;
end;
$parallel_progress$;

-- The legacy English completion RPC remains an English wrapper.
do $complete_english$
declare
  v_progress public.lesson_progress%rowtype;
begin
  v_progress := public.complete_permanent_lesson(
    'beginner','b-sentence','sentence-basics',4,4
  );
  if v_progress.learning_language <> 'en' or v_progress.status <> 'completed' then
    raise exception 'Legacy English completion wrapper returned the wrong course or status';
  end if;
end;
$complete_english$;

-- Chinese completion uses the language-aware RPC and records zh in both ledgers.
do $complete_chinese$
declare
  v_progress public.lesson_progress%rowtype;
  v_count integer;
  v_used integer;
begin
  v_progress := public.complete_permanent_lesson_for_language(
    'zh','beginner','b-sentence','zh-test-topic',3,4
  );
  if v_progress.learning_language <> 'zh' or v_progress.status <> 'completed' then
    raise exception 'Chinese completion RPC returned the wrong course or status';
  end if;

  select count(*) into v_count
  from public.learning_activity_log
  where user_id=auth.uid() and activity_type='lesson'
    and event_type='completed' and language_code in ('en','zh');
  if v_count <> 2 then
    raise exception 'Expected two completed lesson events across courses, found %',v_count;
  end if;

  select count(*) into v_count
  from public.lesson_practice_results
  where user_id=auth.uid() and lesson_id='b-sentence'
    and learning_language in ('en','zh');
  if v_count <> 2 then
    raise exception 'Expected separate English and Chinese practice summaries, found %',v_count;
  end if;

  v_used := private.current_learning_allowance_usage(auth.uid(),'lesson','Asia/Kuala_Lumpur');
  if v_used <> 2 then
    raise exception 'Completing already-started lessons must not charge a second allowance; found %',v_used;
  end if;
end;
$complete_chinese$;

-- Simulate a legacy completed Chinese lesson with no stored practice summary.
-- Replay records its summary once and does not create another allowance event.
reset role;
delete from public.lesson_practice_results
where user_id='12121212-1212-4121-8121-121212121212'
  and learning_language='zh' and lesson_id='b-sentence';
set local role authenticated;
select set_config('request.jwt.claim.sub','12121212-1212-4121-8121-121212121212',true);

do $chinese_replay$
declare
  v_first boolean;
  v_second boolean;
  v_events integer;
begin
  v_first := public.record_completed_lesson_practice_result_for_language(
    'zh','beginner','b-sentence','zh-test-topic',2,4
  );
  v_second := public.record_completed_lesson_practice_result_for_language(
    'zh','beginner','b-sentence','zh-test-topic',2,4
  );
  if v_first is distinct from true or v_second is distinct from false then
    raise exception 'Chinese replay summary is not idempotent: first %, second %',v_first,v_second;
  end if;

  select count(*) into v_events
  from public.learning_activity_log
  where user_id=auth.uid() and activity_type='lesson' and event_type='completed';
  if v_events <> 2 then
    raise exception 'Replaying a completed lesson must not create another completion event';
  end if;

  if private.current_learning_allowance_usage(auth.uid(),'lesson','Asia/Kuala_Lumpur') <> 2 then
    raise exception 'Replaying completed Chinese practice must not consume another allowance';
  end if;
end;
$chinese_replay$;

-- User 666 has one shared Free lesson-start allowance across both courses.
reset role;
update public.learning_plan_limits
set daily_limit=1,is_enabled=true,updated_at=now()
where plan_code='free' and activity_type='lesson';
set local role authenticated;

select set_config('request.jwt.claim.sub','13131313-1313-4131-8131-131313131313',true);
insert into public.lesson_progress(user_id,learning_language,difficulty,lesson_id,status)
values
  ('13131313-1313-4131-8131-131313131313','en','beginner','b-sentence','in_progress');

do $shared_allowance$
declare
  v_failed boolean := false;
  v_count integer;
  v_used integer;
  v_completed integer;
begin
  begin
    insert into public.lesson_progress(user_id,learning_language,difficulty,lesson_id,status)
    values ('13131313-1313-4131-8131-131313131313','zh','beginner','b-sentence','in_progress');
  exception when raise_exception then
    if position('Daily lesson start limit reached' in sqlerrm)=0 then
      raise;
    end if;
    v_failed := true;
  end;

  if not v_failed then
    raise exception 'Starting a Chinese lesson should share and exhaust the one-per-day Free allowance';
  end if;

  select count(*) into v_count
  from public.lesson_progress
  where user_id=auth.uid() and learning_language='zh'
    and difficulty='beginner' and lesson_id='b-sentence';
  if v_count <> 0 then
    raise exception 'Rejected second lesson start must not create a Chinese progress row';
  end if;

  v_used := private.current_learning_allowance_usage(auth.uid(),'lesson','Asia/Kuala_Lumpur');
  if v_used <> 1 then
    raise exception 'Rejected second lesson start must leave exactly one allowance used; found %',v_used;
  end if;

  perform public.complete_permanent_lesson('beginner','b-sentence','sentence-basics',4,4);

  v_used := private.current_learning_allowance_usage(auth.uid(),'lesson','Asia/Kuala_Lumpur');
  if v_used <> 1 then
    raise exception 'Completing a lesson after its start must not consume a second allowance; found %',v_used;
  end if;

  select count(*) into v_completed
  from public.learning_activity_log
  where user_id=auth.uid() and activity_type='lesson' and event_type='completed';
  if v_completed <> 1 then
    raise exception 'Successful completion should still be recorded as learning history';
  end if;
end;
$shared_allowance$;

-- The personal test account still bypasses lesson start consumption.
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
insert into public.lesson_progress(user_id,learning_language,difficulty,lesson_id,status)
values ('22222222-2222-4222-8222-222222222222','en','beginner','b-sentence','in_progress');

do $personal_test_bypass$
declare
  v_started integer;
  v_used integer;
begin
  select count(*) into v_started
  from public.learning_activity_log
  where user_id=auth.uid() and activity_type='lesson' and event_type='started';
  if v_started <> 1 then
    raise exception 'Personal test lesson start should still be recorded for history';
  end if;

  v_used := private.current_learning_allowance_usage(auth.uid(),'lesson','Asia/Kuala_Lumpur');
  if v_used <> 0 then
    raise exception 'Personal test access must bypass the new first-start allowance charge; found %',v_used;
  end if;
end;
$personal_test_bypass$;

-- RLS must continue isolating one learner's progress from another.
select set_config('request.jwt.claim.sub','13131313-1313-4131-8131-131313131313',true);
do $rls$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.lesson_progress
  where user_id='12121212-1212-4121-8121-121212121212';
  if v_count <> 0 then
    raise exception 'RLS exposed another learner''s lesson progress';
  end if;
end;
$rls$;

-- Course identity is immutable and unsupported course codes are rejected.
do $invalid$
declare
  v_failed boolean := false;
begin
  begin
    update public.lesson_progress
    set learning_language='en'
    where user_id=auth.uid() and learning_language='zh'
      and lesson_id='b-sentence';
  exception when insufficient_privilege then
    v_failed := true;
  end;
  if not v_failed then
    raise exception 'Changing a progress row''s learning language should be rejected';
  end if;

  v_failed := false;
  begin
    insert into public.lesson_progress(user_id,learning_language,difficulty,lesson_id,status)
    values (auth.uid(),'fr','beginner','unsupported-language-test','in_progress');
  exception when invalid_parameter_value or check_violation then
    v_failed := true;
  end;
  if not v_failed then
    raise exception 'Unsupported learning language should be rejected';
  end if;

  v_failed := false;
  begin
    insert into public.lesson_progress(user_id,learning_language,difficulty,lesson_id,status)
    values (auth.uid(),'zh','beginner','not-in-catalogue','in_progress');
  exception when invalid_parameter_value then
    v_failed := true;
  end;
  if not v_failed then
    raise exception 'Unapproved Chinese lesson identity should be rejected';
  end if;
end;
$invalid$;

rollback;
