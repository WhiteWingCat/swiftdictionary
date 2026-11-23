-- U2.8.0 schema and owner-scoped practice-attempt RPC test.
begin;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
values('28000000-0000-4000-8000-000000000001','authenticated','authenticated',
       'u280-practice@example.invalid',now(),now(),now())
on conflict(id) do nothing;

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
