begin;

-- U2.7.0: keep permanent lesson progress independent by learning course.
-- Existing rows are backfilled to English through the default value.
alter table public.lesson_progress
  add column learning_language text not null default 'en'
    check (learning_language in ('en','zh'));

alter table public.lesson_practice_results
  add column learning_language text not null default 'en'
    check (learning_language in ('en','zh'));

alter table public.lesson_progress
  drop constraint if exists lesson_progress_unique_user_lesson;
alter table public.lesson_progress
  add constraint lesson_progress_unique_user_lesson
  unique (user_id, learning_language, difficulty, lesson_id);

drop index if exists public.lesson_practice_results_one_per_lesson;
create unique index lesson_practice_results_one_per_lesson
  on public.lesson_practice_results(user_id, learning_language, difficulty, lesson_id);

create index if not exists lesson_progress_user_language_updated_idx
  on public.lesson_progress(user_id, learning_language, updated_at desc);
create index if not exists lesson_practice_results_user_language_attempted_idx
  on public.lesson_practice_results(user_id, learning_language, attempted_at desc);

-- The content catalogue is the server-side allowlist for lesson identity.
-- Daily activities remain English-only; only permanent lessons gain zh rows.
alter table private.learning_content_catalog
  drop constraint if exists learning_content_catalog_language_code_check;
alter table private.learning_content_catalog
  add constraint learning_content_catalog_language_code_check
  check (language_code in ('en','zh'));

do $check_language$
begin
  if not exists (select 1 from public.languages where code = 'zh') then
    raise exception 'The zh language code must exist before enabling Chinese lessons';
  end if;
end;
$check_language$;

-- Apply the same allowlist check to both learning languages.
create or replace function private.guard_lesson_progress_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is null or auth.uid() <> new.user_id then
    raise exception 'Authentication required for own lesson progress'
      using errcode = '42501';
  end if;

  if new.learning_language is null
     or new.learning_language not in ('en','zh')
     or not private.is_approved_learning_content(
       'permanent_lesson', new.lesson_id, null, new.difficulty,
       new.learning_language, 'daily'
     ) then
    raise exception 'Lesson is not part of the approved learning catalogue for this course'
      using errcode = '22023';
  end if;

  return new;
end;
$function$;

revoke all on function private.guard_lesson_progress_insert()
  from public, anon, authenticated;

-- Course identity is immutable after a progress row has been created.
create or replace function public.guard_lesson_progress_update()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  if new.user_id is distinct from old.user_id
     or new.learning_language is distinct from old.learning_language
     or new.difficulty is distinct from old.difficulty
     or new.lesson_id is distinct from old.lesson_id
     or new.started_at is distinct from old.started_at then
    raise exception 'Lesson identity, learning course and start time cannot be changed'
      using errcode = '42501';
  end if;

  if old.status = 'completed' and new.status <> 'completed' then
    raise exception 'Completed lessons cannot be reopened as incomplete'
      using errcode = '23514';
  end if;

  if old.status = 'in_progress' and new.status = 'completed' and new.completed_at is null then
    raise exception 'Completion timestamp is required'
      using errcode = '23514';
  end if;

  if new.status = 'in_progress' then
    new.completed_at := null;
  end if;

  new.updated_at := pg_catalog.now();
  return new;
end;
$function$;

revoke all on function public.guard_lesson_progress_update()
  from public, anon, authenticated, service_role;

-- The completion-based allowance design no longer charges or logs lesson starts.
-- Remove the legacy English-only start trigger so Chinese starts cannot be
-- mislabeled as English and starting/resuming a lesson remains free.
drop trigger if exists lesson_progress_charge_on_first_start on public.lesson_progress;
revoke all on function public.record_lesson_start_allowance()
  from public, anon, authenticated;

-- Completion events and practice summaries inherit the course from the row.
-- The lesson allowance remains shared across English and Chinese courses:
-- enforce_learning_daily_limit still counts activity_type='lesson' without
-- splitting the count by language_code.
create or replace function private.record_lesson_completion_allowance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_topic_id text;
  v_correct_count integer;
  v_question_count integer;
begin
  if auth.uid() is null or auth.uid() <> new.user_id then
    raise exception 'Authentication required for own lesson completion'
      using errcode = '42501';
  end if;

  if old.status = 'in_progress' and new.status = 'completed' then
    v_topic_id := pg_catalog.current_setting('swiftdictionary.lesson_topic_id', true);
    v_correct_count := pg_catalog.current_setting('swiftdictionary.lesson_correct_count', true)::integer;
    v_question_count := pg_catalog.current_setting('swiftdictionary.lesson_question_count', true)::integer;

    if v_topic_id is null or v_correct_count is null or v_question_count is null
       or v_question_count <= 0 or v_correct_count < 0
       or v_correct_count > v_question_count then
      raise exception 'Valid aggregate lesson practice results are required'
        using errcode = '22023';
    end if;

    insert into public.learning_activity_log
      (user_id, activity_type, language_code, event_type)
    values (new.user_id, 'lesson', new.learning_language, 'completed');

    insert into public.lesson_practice_results
      (user_id, learning_language, difficulty, lesson_id, topic_id, correct_count, question_count)
    values
      (new.user_id, new.learning_language, new.difficulty, new.lesson_id, v_topic_id,
       v_correct_count, v_question_count);
  end if;

  return new;
end;
$function$;

revoke all on function private.record_lesson_completion_allowance()
  from public, anon, authenticated;

-- Language-aware completion RPC. The update and quota event remain atomic.
create or replace function public.complete_permanent_lesson_for_language(
  p_learning_language text,
  p_difficulty text,
  p_lesson_id text,
  p_topic_id text,
  p_correct_count integer,
  p_question_count integer
)
returns public.lesson_progress
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_progress public.lesson_progress%rowtype;
begin
  if v_user is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if p_learning_language is null
     or p_learning_language not in ('en','zh')
     or p_difficulty is null
     or p_difficulty not in ('beginner','intermediate','advanced')
     or p_lesson_id is null
     or p_lesson_id <> pg_catalog.btrim(p_lesson_id)
     or pg_catalog.char_length(p_lesson_id) < 1
     or pg_catalog.char_length(p_lesson_id) > 120
     or p_topic_id is null
     or p_topic_id <> pg_catalog.btrim(p_topic_id)
     or pg_catalog.char_length(p_topic_id) < 1
     or pg_catalog.char_length(p_topic_id) > 120
     or p_correct_count is null or p_question_count is null
     or p_question_count <= 0 or p_correct_count < 0
     or p_correct_count > p_question_count then
    raise exception 'Invalid lesson identity, course or aggregate practice result'
      using errcode = '22023';
  end if;

  if not private.is_approved_learning_content(
    'permanent_lesson', p_lesson_id, p_topic_id, p_difficulty,
    p_learning_language, 'daily'
  ) then
    raise exception 'Lesson identity, topic or course is not part of the approved learning catalogue'
      using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user::text, 0)
  );

  select * into v_progress
  from public.lesson_progress
  where user_id = v_user
    and learning_language = p_learning_language
    and difficulty = p_difficulty
    and lesson_id = p_lesson_id
  for update;

  if not found then
    raise exception 'Start this lesson before completing it'
      using errcode = 'P0002';
  end if;

  if v_progress.status = 'completed' then
    return v_progress;
  end if;

  perform pg_catalog.set_config('swiftdictionary.lesson_topic_id', p_topic_id, true);
  perform pg_catalog.set_config('swiftdictionary.lesson_correct_count', p_correct_count::text, true);
  perform pg_catalog.set_config('swiftdictionary.lesson_question_count', p_question_count::text, true);
  perform pg_catalog.set_config('swiftdictionary.lesson_completion_rpc', 'on', true);

  update public.lesson_progress
  set status = 'completed',
      completed_at = pg_catalog.now()
  where id = v_progress.id
    and status = 'in_progress'
  returning * into v_progress;

  if not found then
    raise exception 'Lesson completion could not be saved'
      using errcode = '40001';
  end if;

  perform pg_catalog.set_config('swiftdictionary.lesson_completion_rpc', 'off', true);
  perform pg_catalog.set_config('swiftdictionary.lesson_topic_id', '', true);
  perform pg_catalog.set_config('swiftdictionary.lesson_correct_count', '', true);
  perform pg_catalog.set_config('swiftdictionary.lesson_question_count', '', true);

  return v_progress;
end;
$function$;

revoke all on function public.complete_permanent_lesson_for_language(text,text,text,text,integer,integer)
  from public, anon;
grant execute on function public.complete_permanent_lesson_for_language(text,text,text,text,integer,integer)
  to authenticated;

-- Backward-compatible English wrapper for existing clients.
create or replace function public.complete_permanent_lesson(
  p_difficulty text,
  p_lesson_id text,
  p_topic_id text,
  p_correct_count integer,
  p_question_count integer
)
returns public.lesson_progress
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  return public.complete_permanent_lesson_for_language(
    'en', p_difficulty, p_lesson_id, p_topic_id, p_correct_count, p_question_count
  );
end;
$function$;

revoke all on function public.complete_permanent_lesson(text,text,text,integer,integer)
  from public, anon;
grant execute on function public.complete_permanent_lesson(text,text,text,integer,integer)
  to authenticated;

-- Replay summaries remain idempotent and never create allowance events.
create or replace function public.record_completed_lesson_practice_result_for_language(
  p_learning_language text,
  p_difficulty text,
  p_lesson_id text,
  p_topic_id text,
  p_correct_count integer,
  p_question_count integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_progress_id bigint;
  v_inserted_id bigint;
begin
  if v_user is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if p_learning_language is null
     or p_learning_language not in ('en','zh')
     or p_difficulty is null
     or p_difficulty not in ('beginner','intermediate','advanced')
     or p_lesson_id is null
     or p_lesson_id <> pg_catalog.btrim(p_lesson_id)
     or pg_catalog.char_length(p_lesson_id) < 1
     or pg_catalog.char_length(p_lesson_id) > 120
     or p_topic_id is null
     or p_topic_id <> pg_catalog.btrim(p_topic_id)
     or pg_catalog.char_length(p_topic_id) < 1
     or pg_catalog.char_length(p_topic_id) > 120
     or p_correct_count is null or p_question_count is null
     or p_question_count <= 0 or p_correct_count < 0
     or p_correct_count > p_question_count then
    raise exception 'Invalid lesson identity, course or aggregate practice result'
      using errcode = '22023';
  end if;

  if not private.is_approved_learning_content(
    'permanent_lesson', p_lesson_id, p_topic_id, p_difficulty,
    p_learning_language, 'daily'
  ) then
    raise exception 'Lesson identity, topic or course is not part of the approved learning catalogue'
      using errcode = '22023';
  end if;

  -- Serialize replay summaries with learning-history deletion and other
  -- completion writers for the same account.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user::text, 0)
  );

  select id into v_progress_id
  from public.lesson_progress
  where user_id = v_user
    and learning_language = p_learning_language
    and difficulty = p_difficulty
    and lesson_id = p_lesson_id
    and status = 'completed';

  if not found then
    raise exception 'Only a completed lesson can receive a replay practice summary'
      using errcode = 'P0002';
  end if;

  insert into public.lesson_practice_results
    (user_id, learning_language, difficulty, lesson_id, topic_id, correct_count, question_count)
  values
    (v_user, p_learning_language, p_difficulty, p_lesson_id, p_topic_id,
     p_correct_count, p_question_count)
  on conflict (user_id, learning_language, difficulty, lesson_id) do nothing
  returning id into v_inserted_id;

  return v_inserted_id is not null;
end;
$function$;

revoke all on function public.record_completed_lesson_practice_result_for_language(text,text,text,text,integer,integer)
  from public, anon;
grant execute on function public.record_completed_lesson_practice_result_for_language(text,text,text,text,integer,integer)
  to authenticated;

-- Backward-compatible English wrapper for existing clients.
create or replace function public.record_completed_lesson_practice_result(
  p_difficulty text,
  p_lesson_id text,
  p_topic_id text,
  p_correct_count integer,
  p_question_count integer
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  return public.record_completed_lesson_practice_result_for_language(
    'en', p_difficulty, p_lesson_id, p_topic_id, p_correct_count, p_question_count
  );
end;
$function$;

revoke all on function public.record_completed_lesson_practice_result(text,text,text,integer,integer)
  from public, anon;
grant execute on function public.record_completed_lesson_practice_result(text,text,text,integer,integer)
  to authenticated;

-- Stable Chinese lesson IDs; these must match data/chinese-lessons.js exactly.
insert into private.learning_content_catalog(
  activity_type, content_id, topic_id, difficulty, language_code, is_active
)
values
  ('permanent_lesson','zh-b-pinyin-foundations','zh-pinyin-pronunciation','beginner','zh',true),
  ('permanent_lesson','zh-b-greetings-introductions','zh-greetings-introductions','beginner','zh',true),
  ('permanent_lesson','zh-b-numbers-dates-time','zh-numbers-dates-time','beginner','zh',true),
  ('permanent_lesson','zh-b-pronouns-basic-sentences','zh-pronouns-basic-sentences','beginner','zh',true),
  ('permanent_lesson','zh-b-common-actions','zh-common-actions','beginner','zh',true),
  ('permanent_lesson','zh-b-places-getting-around','zh-places-getting-around','beginner','zh',true),
  ('permanent_lesson','zh-b-questions-negation','zh-questions-negation','beginner','zh',true),
  ('permanent_lesson','zh-i-measure-words','zh-measure-words','intermediate','zh',true),
  ('permanent_lesson','zh-i-grammar-particles','zh-grammar-particles','intermediate','zh',true),
  ('permanent_lesson','zh-i-time-expressions','zh-time-expressions','intermediate','zh',true),
  ('permanent_lesson','zh-i-comparisons','zh-comparisons','intermediate','zh',true),
  ('permanent_lesson','zh-i-sentence-expansion','zh-sentence-expansion','intermediate','zh',true),
  ('permanent_lesson','zh-a-complex-sentences','zh-complex-sentences','advanced','zh',true),
  ('permanent_lesson','zh-a-connectors','zh-connectors','advanced','zh',true),
  ('permanent_lesson','zh-a-idioms-proverbs','zh-idioms-proverbs','advanced','zh',true),
  ('permanent_lesson','zh-a-nuanced-vocabulary','zh-nuanced-vocabulary','advanced','zh',true),
  ('permanent_lesson','zh-a-natural-expression-literature','zh-natural-expression-literature','advanced','zh',true)
on conflict (activity_type, content_id, language_code)
do update set
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  is_active = true,
  updated_at = pg_catalog.now();

comment on column public.lesson_progress.learning_language is
  'The language being learned; English legacy rows default to en, Chinese course rows use zh.';
comment on column public.lesson_practice_results.learning_language is
  'The language being learned for this lesson practice result.';

commit;
