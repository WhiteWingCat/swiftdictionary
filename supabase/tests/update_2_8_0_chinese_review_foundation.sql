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
 ('28000000-0000-4000-8000-000000000101','28000000-0000-4000-8000-000000000001','word','beginner','in_progress',null,null,null,null,now()-interval '2 minutes',null,60,'zh','zh'),
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
update private.flashcard_sessions set status='completed',words_seen=1,correct_count=1,incorrect_count=0,unanswered_count=0,completed_at=now()
where id='28000000-0000-4000-8000-000000000101';

insert into private.learning_content_catalog(activity_type,content_id,topic_id,difficulty,language_code,is_active)
values('permanent_lesson','u280-test-lesson','u280-test-topic','beginner','zh',true)
on conflict(activity_type,content_id,language_code)
do update set topic_id=excluded.topic_id,difficulty=excluded.difficulty,is_active=true;

insert into public.user_preferences(user_id,learning_language,translation_language,timezone)
values('28000000-0000-4000-8000-000000000001','zh','zh','Asia/Kuala_Lumpur')
on conflict(user_id) do update set learning_language='zh',translation_language='zh',timezone='Asia/Kuala_Lumpur';

insert into public.daily_activity_sessions(
 id,user_id,activity_type,language_code,content_id,topic_id,difficulty,local_date,timezone,status,
 correct_count,question_count,completed_at
) values(
 '28000000-0000-4000-8000-000000000201','28000000-0000-4000-8000-000000000001',
 'daily_application','zh','u280-daily-application','u280-daily-topic','beginner',
 current_date,'Asia/Kuala_Lumpur','completed',3,5,now()
);

insert into private.learning_content_catalog(activity_type,content_id,topic_id,difficulty,language_code,is_active)
select 'permanent_lesson',
       'u280-zh-'||d.code||'-lesson-'||n::text,
       'u280-topic-'||d.code||'-'||n::text,
       d.code,'zh',true
from (values('beginner'),('intermediate'),('advanced')) as d(code)
cross join generate_series(1,3) as n
on conflict(activity_type,content_id,language_code)
do update set topic_id=excluded.topic_id,difficulty=excluded.difficulty,is_active=true;

with numbered as (
 select gs,
   case when gs<=30 then 'beginner' when gs<=66 then 'intermediate' else 'advanced' end as difficulty,
   ((gs-1)%3)+1 as topic_number
 from generate_series(1,114) as gs
)
insert into private.quiz_question_bank(
 question_id,revision,learning_language_code,translation_language_code,
 source_lesson_id,topic_id,difficulty,question_type,answer_language_code,
 learning_objective_id,prompt_learning,prompt_translation,prompt_pinyin,options,
 correct_option_id,explanation_learning,explanation_translation,explanation_pinyin,status,approved_at
)
select
 'u280-zh-'||difficulty||'-'||lpad(gs::text,3,'0'),1,'zh','en',
 'u280-zh-'||difficulty||'-lesson-'||topic_number,
 'u280-topic-'||difficulty||'-'||topic_number,difficulty,'knowledge','zh',
 'u280-objective','测试题目 '||gs||'：请选择正确的汉字。',
 'Test question '||gs||': choose the correct Chinese character.',
 'cè shì tí mù, qǐng xuǎn zé zhèng què de hàn zì.',
 jsonb_build_array(
  jsonb_build_object('id','o1','learning_text','好','translation_text','good','pinyin','hǎo'),
  jsonb_build_object('id','o2','learning_text','大','translation_text','big','pinyin','dà'),
  jsonb_build_object('id','o3','learning_text','小','translation_text','small','pinyin','xiǎo'),
  jsonb_build_object('id','o4','learning_text','人','translation_text','person','pinyin','rén')
 ),
 'o1','“好”表示良好、不错或令人满意。','“好” means good, well or satisfactory.',
 'hǎo biǎo shì liáng hǎo, bú cuò huò lìng rén mǎn yì.','approved',now()
from numbered
on conflict(question_id,revision) do nothing;

set local role authenticated;
select set_config('request.jwt.claims',
 '{"sub":"28000000-0000-4000-8000-000000000001","role":"authenticated"}',true);

do $test$
declare v_saved jsonb; v_rows jsonb; v_quiz1 jsonb; v_quiz2 jsonb; v_avail jsonb; v_overlap integer; v_daily jsonb;
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
 v_daily:=public.record_my_daily_practice_attempt(
   '28000000-0000-4000-8000-000000000201',2,4,3
 );
 if (v_daily->>'first_try_correct_count')::integer<>2
    or (v_daily->>'incorrect_attempt_count')::integer<>4
    or (v_daily->>'retry_count')::integer<>3 then
   raise exception 'Daily Learning first-try/retry statistics were not saved: %',v_daily;
 end if;
 v_rows:=public.get_my_flashcard_game_review('28000000-0000-4000-8000-000000000101');
 if coalesce((v_rows->>'review_available')::boolean,false) is not true
    or jsonb_array_length(v_rows->'items')<>1
    or coalesce((v_rows->'items'->0->>'is_correct')::boolean,false) is not true then
   raise exception 'Full completed Flashcard review did not return correct cards: %',v_rows;
 end if;
 v_avail:=public.get_my_quiz_availability();
 if jsonb_array_length(v_avail->'difficulties')<>3
    or exists(select 1 from jsonb_array_elements(v_avail->'difficulties') d where coalesce((d->>'available')::boolean,false) is not true) then
   raise exception 'Chinese Quiz bank availability did not satisfy the configured minimums: %',v_avail;
 end if;
 v_quiz1:=public.start_my_quiz('beginner','zh','zh');
 if v_quiz1->>'learning_language_code'<>'zh'
    or v_quiz1->>'translation_language_code'<>'zh'
    or jsonb_array_length(v_quiz1->'questions')<>10
    or exists(select 1 from jsonb_array_elements(v_quiz1->'questions') q where nullif(q->>'prompt_pinyin','') is null
       or exists(select 1 from jsonb_array_elements(q->'options') o where nullif(o->>'pinyin','') is null)) then
   raise exception 'Chinese Quiz did not return a Pinyin-complete Chinese-focused session: %',v_quiz1;
 end if;
 perform public.abandon_my_quiz((v_quiz1->>'session_id')::uuid);
 v_quiz2:=public.start_my_quiz('beginner','zh','en');
 if v_quiz2->>'translation_language_code'<>'en' then
   raise exception 'Chinese Quiz did not preserve the selected English translation language: %',v_quiz2;
 end if;
 select count(*) into v_overlap
 from jsonb_array_elements(v_quiz1->'questions') a
 join jsonb_array_elements(v_quiz2->'questions') b
   on a->>'question_id'=b->>'question_id';
 if v_overlap<>0 then raise exception 'Chinese Quiz repeated questions across translation preferences'; end if;
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
