-- Disposable authenticated Flashcards RPC integration test.
-- Run inside a transaction on a Supabase-compatible test database; all fixtures roll back.

begin;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
values(
  'a2500000-0000-4000-8000-000000000001',
  'authenticated','authenticated','flashcards-ci@example.invalid',now(),now(),now()
);
insert into public.user_preferences(user_id,learning_language,translation_language,timezone)
values('a2500000-0000-4000-8000-000000000001','en','zh','UTC');
insert into public.user_entitlements(user_id,plan_code,status)
values('a2500000-0000-4000-8000-000000000001','free','active');

create temporary table flashcard_test_session(session_id uuid);
grant insert,select on table pg_temp.flashcard_test_session to authenticated;

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"a2500000-0000-4000-8000-000000000001","role":"authenticated"}',true);

do $test$
declare
  v_collection jsonb;
  v_card jsonb;
  v_game jsonb;
begin
  if auth.uid() <> 'a2500000-0000-4000-8000-000000000001'::uuid then
    raise exception 'JWT subject was not recognised by auth.uid()';
  end if;

  v_collection := public.save_my_flashcard_collection('create',null,'CI Collection');
  if v_collection->>'name' <> 'CI Collection' then raise exception 'Collection creation failed'; end if;

  v_card := public.save_my_flashcard_card(
    'create',null,(v_collection->>'id')::uuid,'custom',null,
    'Prompt','Answer','Example sentence','中文',0
  );
  if v_card->>'front_text' <> 'Prompt' then raise exception 'Custom card creation failed'; end if;

  v_game := public.start_my_flashcard_game('word','beginner');
  if v_game->>'session_id' is null then raise exception 'Flash Recall session did not start'; end if;
  insert into pg_temp.flashcard_test_session values((v_game->>'session_id')::uuid);
end
$test$;

reset role;
update private.flashcard_sessions
set started_at=now()-interval '61 seconds'
where id=(select session_id from pg_temp.flashcard_test_session);

set local role authenticated;
do $test$
declare v_result jsonb;
begin
  v_result := public.complete_my_flashcard_game(
    (select session_id from pg_temp.flashcard_test_session),
    '[{"card_key":"dict:hello","correct":true,"unanswered":false},
      {"card_key":"dict:goodbye","correct":false,"unanswered":true}]'::jsonb
  );
  if (v_result->>'words_seen')::integer <> 2
     or (v_result->>'correct_count')::integer <> 1
     or (v_result->>'incorrect_count')::integer <> 1
     or (v_result->>'unanswered_count')::integer <> 1 then
    raise exception 'Flash Recall aggregate counts are incorrect: %',v_result;
  end if;
end
$test$;

-- A started and abandoned game must not consume allowance.
do $test$
declare v_game jsonb;
begin
  v_game := public.start_my_flashcard_game('definition','beginner');
  perform public.abandon_my_flashcard_game((v_game->>'session_id')::uuid);
  if (select used_count from public.get_my_learning_allowance_usage() where activity_type='flashcard') <> 1 then
    raise exception 'An abandoned Flashcard game consumed allowance';
  end if;
end
$test$;

reset role;
-- Add two more valid completion events to reach the Free limit of three.
insert into public.learning_activity_log(user_id,activity_type,language_code,event_type)
select 'a2500000-0000-4000-8000-000000000001'::uuid,'flashcard','en','completed'
from generate_series(1,2);

set local role authenticated;
do $test$
declare v_blocked boolean := false;
begin
  begin
    perform public.start_my_flashcard_game('word','beginner');
  exception when sqlstate 'P0001' then
    v_blocked := true;
  end;
  if not v_blocked then raise exception 'Free Flashcard allowance did not block game four'; end if;
  if (select used_count from public.get_my_learning_allowance_usage() where activity_type='flashcard') <> 3 then
    raise exception 'Flashcard allowance count did not reach three';
  end if;
end
$test$;

rollback;
