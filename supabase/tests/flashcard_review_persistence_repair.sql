-- U3.0 Flashcard regression and snapshot-evaluation test.
-- Run after migrations 20261127200000 and 20261127210000 on a disposable Supabase-compatible database.
begin;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
values('a2500000-0000-4000-8000-000000000002','authenticated','authenticated',
       'flashcard-review-repair-ci@example.invalid',now(),now(),now());

insert into public.user_preferences(user_id,learning_language,translation_language,timezone)
values('a2500000-0000-4000-8000-000000000002','en','ms','UTC');

insert into public.user_entitlements(user_id,plan_code,status)
values('a2500000-0000-4000-8000-000000000002','free','active');

create temporary table flashcard_repair_test_session(session_id uuid);
grant insert,select on table pg_temp.flashcard_repair_test_session to authenticated;

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"a2500000-0000-4000-8000-000000000002","role":"authenticated"}',true);

do $start$
declare v_game jsonb;
begin
  v_game:=public.start_my_flashcard_game('word','beginner',60);
  if v_game->>'session_id' is null then raise exception 'Flashcard test session did not start'; end if;
  if v_game->>'learning_language_code'<>'en' or v_game->>'translation_language_code'<>'ms' then
    raise exception 'Malay Flashcard support language was not retained in the game session: %',v_game;
  end if;
  insert into pg_temp.flashcard_repair_test_session values((v_game->>'session_id')::uuid);
end
$start$;

reset role;

do $elapsed$
declare has_identity_guard boolean;
begin
  select exists(
    select 1 from pg_catalog.pg_trigger
    where tgrelid='private.flashcard_sessions'::regclass
      and tgname='guard_flashcard_session_identity_update' and not tgisinternal
  ) into has_identity_guard;
  if has_identity_guard then execute 'alter table private.flashcard_sessions disable trigger guard_flashcard_session_identity_update'; end if;
  update private.flashcard_sessions set started_at=now()-interval '61 seconds'
  where id=(select session_id from pg_temp.flashcard_repair_test_session);
  if has_identity_guard then execute 'alter table private.flashcard_sessions enable trigger guard_flashcard_session_identity_update'; end if;
end
$elapsed$;

set local role authenticated;
do $complete$
declare
  v_session uuid:=(select session_id from pg_temp.flashcard_repair_test_session);
  v_result jsonb;
  v_review jsonb;
  v_data jsonb;
  v_weak jsonb;
begin
  v_result:=public.complete_my_flashcard_game(v_session,'[
    {"card_key":"dict:hello","mode":"word","correct":true,"unanswered":false,
     "snapshot":{"prompt":"hello","card":{"word":"hello"},"recall_mode":"word",
      "options":[{"text":"hello","card_key":"dict:hello"},{"text":"goodbye","card_key":"dict:goodbye"},{"text":"thanks","card_key":"dict:thanks"},{"text":"please","card_key":"dict:please"}],
      "correct_answer":"hello","selected_answer":"hello","correct_option_index":0,"selected_option_index":0}},
    {"card_key":"dict:goodbye","mode":"word","correct":true,"unanswered":false,
     "snapshot":{"prompt":"goodbye","card":{"word":"goodbye"},"recall_mode":"word",
      "options":[{"text":"hello","card_key":"dict:hello"},{"text":"goodbye","card_key":"dict:goodbye"},{"text":"thanks","card_key":"dict:thanks"},{"text":"please","card_key":"dict:please"}],
      "correct_answer":"goodbye","selected_answer":"hello","correct_option_index":1,"selected_option_index":0}},
    {"card_key":"dict:thanks","mode":"word","correct":false,"unanswered":true,
     "snapshot":{"prompt":"thanks","card":{"word":"thanks"},"recall_mode":"word",
      "options":[{"text":"hello","card_key":"dict:hello"},{"text":"goodbye","card_key":"dict:goodbye"},{"text":"thanks","card_key":"dict:thanks"},{"text":"please","card_key":"dict:please"}],
      "correct_answer":"thanks","selected_answer":null,"correct_option_index":2,"selected_option_index":null}}
  ]'::jsonb);

  if (v_result->>'words_seen')::integer<>3
     or (v_result->>'correct_count')::integer<>1
     or (v_result->>'incorrect_count')::integer<>2
     or (v_result->>'unanswered_count')::integer<>1 then
    raise exception 'Server-side Flashcard evaluation did not recompute the correct totals: %',v_result;
  end if;

  v_review:=public.get_my_flashcard_game_review(v_session);
  if coalesce((v_review->>'review_available')::boolean,false) is not true
     or jsonb_array_length(v_review->'items')<>3 then
    raise exception 'Per-card Flashcard review snapshots were not persisted: %',v_review;
  end if;
  if coalesce((v_review->'items'->1->>'is_correct')::boolean,true) is not false
     or v_review->'items'->1->>'selected_answer'<>'hello'
     or v_review->'items'->1->>'correct_answer'<>'goodbye' then
    raise exception 'Flashcard review did not preserve and evaluate the incorrect answer: %',v_review->'items'->1;
  end if;

  v_data:=public.get_my_flashcard_data();
  v_weak:=v_data->'review_items';
  if jsonb_array_length(v_weak)<2
     or not exists(select 1 from jsonb_array_elements(v_weak) item where item->>'card_key'='dict:goodbye')
     or not exists(select 1 from jsonb_array_elements(v_weak) item where item->>'card_key'='dict:thanks') then
    raise exception 'Incorrect and unanswered Flashcard answers did not enter Review weak memory: %',v_weak;
  end if;
end
$complete$;

rollback;
