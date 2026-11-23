-- U2.8.0 schema and owner-scoped practice-attempt RPC test.
begin;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
values
 ('28000000-0000-4000-8000-000000000001','authenticated','authenticated','u280-practice@example.invalid',now(),now(),now()),
 ('28000000-0000-4000-8000-000000000002','authenticated','authenticated','u280-other@example.invalid',now(),now(),now())
on conflict(id) do nothing;

insert into private.flashcard_sessions(
 id,user_id,mode,difficulty,status,words_seen,correct_count,incorrect_count,
 unanswered_count,started_at,completed_at,duration_seconds,learning_language_code,translation_language_code
) values
 ('28000000-0000-4000-8000-000000000101','28000000-0000-4000-8000-000000000001','word','beginner','in_progress',1,1,0,0,now()-interval '2 minutes',null,60,'zh','zh'),
 ('28000000-0000-4000-8000-000000000102','28000000-0000-4000-8000-000000000002','word','beginner','completed',1,1,0,0,now()-interval '2 minutes',now(),60,'zh','zh');

select set_config('request.jwt.claims',
 '{"sub":"28000000-0000-4000-8000-000000000001","role":"authenticated"}',true);

insert into private.flashcard_session_items(
 session_id,user_id,position,card_key,recall_mode,prompt_snapshot,card_snapshot,options_snapshot,
 selected_option_index,correct_option_index,selected_answer_snapshot,correct_answer_snapshot,is_correct,unanswered
) values (
 '28000000-0000-4000-8000-000000000101','28000000-0000-4000-8000-000000000001',1,
 'dict:zh:好','word','Choose the correct Pinyin pronunciation',
 '{"word":"好","pinyin":"hǎo","translation_zh":"很好","course":"zh"}'::jsonb,
 '[{"text":"hǎo","card_key":"dict:zh:好","word":"好"},{"text":"hào","card_key":"dict:zh:号","word":"号"},{"text":"hāo","card_key":"dict:zh:蒿","word":"蒿"},{"text":"hǎi","card_key":"dict:zh:海","word":"海"}]'::jsonb,
 0,0,'hǎo','hǎo',true,false
);
update private.flashcard_sessions set status='completed',completed_at=now()
where id='28000000-0000-4000-8000-000000000101';

insert into private.learning_content_catalog(activity_type,content_id,topic_id,difficulty,language_code,is_active)
values('permanent_lesson','u280-test-lesson','u280-test-topic','beginner','zh',true)
on conflict(activity_type,content_id,language_code)
do update set topic_id=excluded.topic_id,difficulty=excluded.difficulty,is_active=true;

set local role authenticated;
select set_config('request.jwt.claims',
 '{"sub":"28000000-0000-4000-8000-000000000001","role":"authenticated"}',true);

do $test$
declare v_saved jsonb; v_rows jsonb;
begin
 if auth.uid()<>'28000000-0000-4000-8000-000000000001'::uuid then
   raise exception 'Test JWT subject was not recognised';
 end if;
 v_saved:=public.record_my_lesson_practice_attempt(
   'zh','beginner','u280-test-lesson','u280-test-topic',3,5,4,2
 );
 if coalesce((v_saved->>'saved')::boolean,false) is not true then
   raise exception 'Practice attempt was not saved: %',v_saved;
 end if;
 v_rows:=public.get_my_lesson_practice_attempts(10);
 if jsonb_array_length(v_rows)<>1
    or (v_rows->0->>'first_try_correct_count')::integer<>3
    or (v_rows->0->>'incorrect_attempt_count')::integer<>4
    or (v_rows->0->>'retry_count')::integer<>2 then
   raise exception 'Practice attempt aggregates were not preserved: %',v_rows;
 end if;
 v_rows:=public.get_my_flashcard_game_review('28000000-0000-4000-8000-000000000101');
 if coalesce((v_rows->>'review_available')::boolean,false) is not true
    or jsonb_array_length(v_rows->'items')<>1
    or coalesce((v_rows->'items'->0->>'is_correct')::boolean,false) is not true then
   raise exception 'Full completed Flashcard review did not return correct cards: %',v_rows;
 end if;
 begin
   perform public.get_my_flashcard_game_review('28000000-0000-4000-8000-000000000102');
   raise exception 'Another account Flashcard review was exposed';
 exception when sqlstate 'P0002' then null;
 end;
 begin
   perform public.record_my_lesson_practice_attempt('zh','beginner','not-approved','u280-test-topic',1,1,0,0);
   raise exception 'Unapproved lesson attempt was accepted';
 exception when sqlstate '22023' then null;
 end;
end
$test$;

reset role;

do $test$
begin
 if not (select relrowsecurity from pg_class where oid='private.lesson_practice_attempts'::regclass) then
   raise exception 'Practice attempt table must have RLS enabled';
 end if;
 if has_table_privilege('authenticated','private.lesson_practice_attempts','SELECT')
    or has_table_privilege('anon','private.lesson_practice_attempts','SELECT') then
   raise exception 'Direct API-role access to practice attempts must remain revoked';
 end if;
 if not (select relrowsecurity from pg_class where oid='private.flashcard_session_items'::regclass) then
   raise exception 'Flashcard snapshot table must have RLS enabled';
 end if;
 if has_table_privilege('authenticated','private.flashcard_session_items','SELECT')
    or has_table_privilege('anon','private.flashcard_session_items','SELECT') then
   raise exception 'Direct API-role access to Flashcard snapshots must remain revoked';
 end if;
 if not exists(select 1 from pg_constraint where conname='flashcard_sessions_mode_check'
   and pg_get_constraintdef(oid) like '%translation%') then
   raise exception 'Translation Recall must be accepted by Flashcard session mode constraint';
 end if;
 if not exists(select 1 from pg_attribute where attrelid='private.quiz_session_questions'::regclass
   and attname='learning_language_code_snapshot' and attnotnull) then
   raise exception 'Quiz question language snapshot is missing';
 end if;
end
$test$;

rollback;
