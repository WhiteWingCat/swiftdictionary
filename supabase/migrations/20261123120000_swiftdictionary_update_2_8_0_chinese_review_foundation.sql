-- SwiftDictionary Update 2.8.0 — Chinese course and complete learning review foundations.
-- Additive feature-branch migration. Do not apply to production without separate approval.

begin;

-- Quiz bank language rules: Chinese-learning questions are answered in Chinese.
alter table private.quiz_question_bank
  drop constraint if exists quiz_question_bank_answer_language_by_type_check;
alter table private.quiz_question_bank
  add constraint quiz_question_bank_answer_language_by_type_check
  check (
    (question_type='chinese_translation' and answer_language_code='zh')
    or
    (question_type in ('knowledge','word_definition')
      and answer_language_code=learning_language_code)
  );

-- Freeze the learning language on each issued Quiz question as part of its snapshot.
alter table private.quiz_session_questions
  add column if not exists learning_language_code_snapshot text;
update private.quiz_session_questions sq
set learning_language_code_snapshot=s.learning_language_code
from private.quiz_sessions s
where s.id=sq.session_id and sq.learning_language_code_snapshot is null;
alter table private.quiz_session_questions
  alter column learning_language_code_snapshot set default 'en',
  alter column learning_language_code_snapshot set not null;
alter table private.quiz_session_questions
  drop constraint if exists quiz_session_question_type_language_check;
alter table private.quiz_session_questions
  add constraint quiz_session_question_type_language_check
  check (
    (question_type_snapshot='chinese_translation' and answer_language_code_snapshot='zh')
    or
    (question_type_snapshot in ('knowledge','word_definition')
      and answer_language_code_snapshot=learning_language_code_snapshot)
  );
alter table private.quiz_session_questions
  drop constraint if exists quiz_session_questions_learning_language_code_snapshot_check;
alter table private.quiz_session_questions
  add constraint quiz_session_questions_learning_language_code_snapshot_check
  check (learning_language_code_snapshot in ('en','zh'));

-- Flashcard cards can now represent either learning language. Existing English
-- rows retain their value; custom-card creation remains owner-scoped via RPC.
alter table private.flashcard_cards
  drop constraint if exists flashcard_cards_language_code_check;
alter table private.flashcard_cards
  add constraint flashcard_cards_language_code_check
  check (language_code in ('en','zh'));
alter table private.flashcard_cards
  add column if not exists pinyin text,
  add column if not exists definition_zh text,
  add column if not exists translation_zh text,
  add column if not exists example_pinyin text;

-- Preserve the selected language pair on every new Flashcard game.
alter table private.flashcard_sessions
  add column if not exists learning_language_code text not null default 'en'
    check (learning_language_code in ('en','zh')),
  add column if not exists translation_language_code text not null default 'zh'
    check (translation_language_code in ('en','zh'));

alter table private.flashcard_sessions
  drop constraint if exists flashcard_sessions_mode_check;
alter table private.flashcard_sessions
  add constraint flashcard_sessions_mode_check
  check (mode in ('word','definition','translation','mixed','sentence'));

alter table private.flashcard_review_items
  drop constraint if exists flashcard_review_items_mode_check;
alter table private.flashcard_review_items
  add constraint flashcard_review_items_mode_check
  check (mode in ('word','definition','translation','mixed','sentence'));

-- A completed game needs immutable per-card snapshots for full read-only review.
create unique index if not exists flashcard_sessions_id_user_unique
  on private.flashcard_sessions(id,user_id);

create table if not exists private.flashcard_session_items (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  position integer not null check (position > 0),
  card_key text not null check (char_length(card_key) between 6 and 180),
  recall_mode text not null check (recall_mode in ('word','definition','translation','mixed','sentence')),
  prompt_snapshot text not null check (char_length(btrim(prompt_snapshot)) between 1 and 2000),
  card_snapshot jsonb not null check (jsonb_typeof(card_snapshot)='object'),
  options_snapshot jsonb not null check (jsonb_typeof(options_snapshot)='array' and jsonb_array_length(options_snapshot)=4),
  selected_option_index integer check (selected_option_index between 0 and 3),
  correct_option_index integer not null check (correct_option_index between 0 and 3),
  selected_answer_snapshot text,
  correct_answer_snapshot text not null,
  is_correct boolean not null,
  unanswered boolean not null default false,
  created_at timestamptz not null default now(),
  constraint flashcard_session_items_session_fk
    foreign key(session_id,user_id)
    references private.flashcard_sessions(id,user_id) on delete cascade,
  constraint flashcard_session_items_position_unique unique(session_id,position),
  constraint flashcard_session_items_answer_state_check
    check (not (is_correct and unanswered))
);

comment on table private.flashcard_session_items is
  'Immutable per-card snapshots for owner-only read-only review of completed Flashcard games. Contains user-linked learning performance and may include custom-card text.';

alter table private.flashcard_session_items enable row level security;
revoke all on table private.flashcard_session_items from public,anon,authenticated;
create index if not exists flashcard_session_items_user_session_idx
  on private.flashcard_session_items(user_id,session_id,position);

create or replace function private.guard_flashcard_session_item_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is null or auth.uid() is distinct from new.user_id then
    raise exception 'Authentication required for own Flashcard review snapshot'
      using errcode='42501';
  end if;
  if not exists (
    select 1 from private.flashcard_sessions s
    where s.id=new.session_id and s.user_id=new.user_id and s.status='in_progress'
  ) then
    raise exception 'Flashcard review snapshots can only be added to an active owned game'
      using errcode='42501';
  end if;
  return new;
end;
$function$;
revoke all on function private.guard_flashcard_session_item_insert() from public,anon,authenticated,service_role;
drop trigger if exists guard_flashcard_session_item_insert on private.flashcard_session_items;
create trigger guard_flashcard_session_item_insert
before insert on private.flashcard_session_items
for each row execute function private.guard_flashcard_session_item_insert();

create or replace function private.guard_flashcard_session_item_update()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  raise exception 'Flashcard review snapshots are immutable'
    using errcode='42501';
end;
$function$;
revoke all on function private.guard_flashcard_session_item_update() from public,anon,authenticated,service_role;
drop trigger if exists guard_flashcard_session_item_update on private.flashcard_session_items;
create trigger guard_flashcard_session_item_update
before update on private.flashcard_session_items
for each row execute function private.guard_flashcard_session_item_update();

-- Minimal attempt aggregates preserve first-attempt errors and retries without
-- storing raw answers or per-keystroke behaviour.
create table if not exists private.lesson_practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  learning_language text not null check (learning_language in ('en','zh')),
  difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  lesson_id text not null check (char_length(lesson_id) between 1 and 120),
  topic_id text not null check (char_length(topic_id) between 1 and 120),
  first_try_correct_count integer not null check (first_try_correct_count >= 0),
  question_count integer not null check (question_count between 1 and 100),
  incorrect_attempt_count integer not null default 0 check (incorrect_attempt_count >= 0),
  retry_count integer not null default 0 check (retry_count >= 0),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint lesson_practice_attempts_first_try_check
    check (first_try_correct_count <= question_count)
);
comment on table private.lesson_practice_attempts is
  'Minimal owner-linked lesson practice attempt aggregates. No raw answers are stored; rows support first-attempt and retry-aware Practice Insights.';

alter table private.lesson_practice_attempts enable row level security;
revoke all on table private.lesson_practice_attempts from public,anon,authenticated;
create index if not exists lesson_practice_attempts_user_topic_recent_idx
  on private.lesson_practice_attempts(user_id,learning_language,topic_id,completed_at desc);

create or replace function private.record_my_lesson_practice_attempt_impl(
  p_learning_language text,
  p_difficulty text,
  p_lesson_id text,
  p_topic_id text,
  p_first_try_correct_count integer,
  p_question_count integer,
  p_incorrect_attempt_count integer,
  p_retry_count integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_id uuid;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;
  if p_learning_language not in ('en','zh')
     or p_difficulty not in ('beginner','intermediate','advanced')
     or p_lesson_id is null or p_topic_id is null
     or p_question_count not between 1 and 100
     or p_first_try_correct_count not between 0 and p_question_count
     or p_incorrect_attempt_count < 0 or p_retry_count < 0 then
    raise exception 'Invalid lesson practice attempt summary' using errcode='22023';
  end if;
  if not private.is_approved_learning_content(
    'permanent_lesson',p_lesson_id,null,p_difficulty,p_learning_language,'daily'
  ) then
    raise exception 'Lesson is not in the approved course catalogue'
      using errcode='22023';
  end if;
  if not exists (
    select 1 from private.learning_content_catalog c
    where c.activity_type='permanent_lesson'
      and c.content_id=p_lesson_id and c.topic_id=p_topic_id
      and c.language_code=p_learning_language and c.is_active
  ) then
    raise exception 'Lesson topic does not match the approved catalogue'
      using errcode='22023';
  end if;
  insert into private.lesson_practice_attempts(
    user_id,learning_language,difficulty,lesson_id,topic_id,
    first_try_correct_count,question_count,incorrect_attempt_count,retry_count
  ) values (
    v_user,p_learning_language,p_difficulty,p_lesson_id,p_topic_id,
    p_first_try_correct_count,p_question_count,p_incorrect_attempt_count,p_retry_count
  ) returning id into v_id;
  return jsonb_build_object('saved',true,'attempt_id',v_id);
end;
$function$;
revoke all on function private.record_my_lesson_practice_attempt_impl(text,text,text,text,integer,integer,integer,integer)
  from public,anon,authenticated;
grant execute on function private.record_my_lesson_practice_attempt_impl(text,text,text,text,integer,integer,integer,integer)
  to authenticated;

create or replace function public.record_my_lesson_practice_attempt(
  p_learning_language text,
  p_difficulty text,
  p_lesson_id text,
  p_topic_id text,
  p_first_try_correct_count integer,
  p_question_count integer,
  p_incorrect_attempt_count integer,
  p_retry_count integer
)
returns jsonb
language sql
security invoker
set search_path = ''
as $function$
  select private.record_my_lesson_practice_attempt_impl(
    p_learning_language,p_difficulty,p_lesson_id,p_topic_id,
    p_first_try_correct_count,p_question_count,p_incorrect_attempt_count,p_retry_count
  );
$function$;
revoke all on function public.record_my_lesson_practice_attempt(text,text,text,text,integer,integer,integer,integer)
  from public,anon;
grant execute on function public.record_my_lesson_practice_attempt(text,text,text,text,integer,integer,integer,integer)
  to authenticated;

create or replace function private.get_my_lesson_practice_attempts_impl(p_limit integer default 100)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_limit not between 1 and 200 then raise exception 'Invalid attempt-history limit' using errcode='22023'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'learning_language',a.learning_language,'difficulty',a.difficulty,
      'lesson_id',a.lesson_id,'topic_id',a.topic_id,
      'first_try_correct_count',a.first_try_correct_count,'question_count',a.question_count,
      'incorrect_attempt_count',a.incorrect_attempt_count,'retry_count',a.retry_count,
      'completed_at',a.completed_at
    ) order by a.completed_at desc)
    from (
      select * from private.lesson_practice_attempts
      where user_id=v_user order by completed_at desc limit p_limit
    ) a
  ),'[]'::jsonb);
end;
$function$;
revoke all on function private.get_my_lesson_practice_attempts_impl(integer) from public,anon,authenticated;
grant execute on function private.get_my_lesson_practice_attempts_impl(integer) to authenticated;

create or replace function public.get_my_lesson_practice_attempts(p_limit integer default 100)
returns jsonb
language sql
security invoker
set search_path = ''
as $function$
  select private.get_my_lesson_practice_attempts_impl(p_limit);
$function$;
revoke all on function public.get_my_lesson_practice_attempts(integer) from public,anon;
grant execute on function public.get_my_lesson_practice_attempts(integer) to authenticated;

-- History deletion removes the new learning-attempt and per-card review rows.
create or replace function private.delete_my_learning_history_impl()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_jwt jsonb;
  v_session_id uuid;
  v_session_created_at timestamptz;
  v_session_not_after timestamptz;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  v_jwt := auth.jwt();
  v_session_id := nullif(v_jwt ->> 'session_id','')::uuid;
  select s.created_at,s.not_after into v_session_created_at,v_session_not_after
    from auth.sessions s where s.id=v_session_id and s.user_id=v_user;
  if not found or v_session_created_at is null
     or v_session_created_at < pg_catalog.now()-interval '15 minutes'
     or v_session_created_at > pg_catalog.now()+interval '60 seconds'
     or (v_session_not_after is not null and v_session_not_after<=pg_catalog.now()) then
    raise exception 'Recent authentication required to delete learning history' using errcode='42501';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
  delete from private.quiz_sessions where user_id=v_user;
  delete from public.daily_activity_sessions where user_id=v_user;
  delete from public.lesson_practice_attempts where user_id=v_user;
  delete from public.lesson_practice_results where user_id=v_user;
  delete from public.lesson_progress where user_id=v_user;
  delete from public.learning_activity_log where user_id=v_user;
  delete from private.flashcard_sessions where user_id=v_user;
  delete from private.flashcard_mastery where user_id=v_user;
  delete from private.flashcard_review_items where user_id=v_user;
  return jsonb_build_object('deleted',true);
end;
$function$;
revoke all on function private.delete_my_learning_history_impl() from public,anon,authenticated;
grant execute on function private.delete_my_learning_history_impl() to authenticated;

commit;
