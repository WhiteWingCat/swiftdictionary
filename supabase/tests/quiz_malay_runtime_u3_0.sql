-- U3.0 Malay Quiz authenticated runtime, answer privacy and completion tests.
\set ON_ERROR_STOP on
begin;

insert into auth.users(id) values
 ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'),
 ('11111111-1111-4111-8111-111111111111'),
 ('22222222-2222-4222-8222-222222222222'),
 ('33333333-3333-4333-8333-333333333333'),
 ('44444444-4444-4444-8444-444444444444'),
 ('55555555-5555-4555-8555-555555555555')
on conflict(id) do nothing;

insert into public.user_preferences(user_id,learning_language,translation_language,timezone)
values
 ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','ms','en','Asia/Kuala_Lumpur'),
 ('11111111-1111-4111-8111-111111111111','ms','en','Asia/Kuala_Lumpur'),
 ('22222222-2222-4222-8222-222222222222','ms','en','Asia/Kuala_Lumpur'),
 ('33333333-3333-4333-8333-333333333333','ms','zh','Asia/Kuala_Lumpur'),
 ('44444444-4444-4444-8444-444444444444','ms','ms','Asia/Kuala_Lumpur'),
 ('55555555-5555-4555-8555-555555555555','ms','en','Asia/Kuala_Lumpur')
on conflict(user_id) do update set
 learning_language=excluded.learning_language,
 translation_language=excluded.translation_language,
 timezone=excluded.timezone;

insert into public.user_entitlements(user_id,plan_code,status)
select id,'premium','active' from auth.users
where id in (
 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
 '11111111-1111-4111-8111-111111111111',
 '22222222-2222-4222-8222-222222222222',
 '33333333-3333-4333-8333-333333333333',
 '44444444-4444-4444-8444-444444444444',
 '55555555-5555-4555-8555-555555555555'
)
on conflict(user_id) do update set
 plan_code='premium',status='active',valid_from=null,valid_until=null;

update public.learning_plan_limits
set daily_limit=3,is_enabled=true
where plan_code='premium' and activity_type='quiz';

insert into private.learning_content_catalog(
 activity_type,content_id,topic_id,difficulty,language_code,is_active
)
select 'permanent_lesson',
       'u3-ms-quiz-fixture-'||d.prefix||'-'||n,
       'u3-ms-topic-'||d.prefix||'-'||n,
       d.difficulty,'ms',true
from (values ('b','beginner'),('i','intermediate'),('a','advanced')) d(prefix,difficulty)
cross join generate_series(1,3) n
on conflict(activity_type,content_id,language_code)
do update set topic_id=excluded.topic_id,difficulty=excluded.difficulty,is_active=true;

insert into private.quiz_question_bank(
 question_id,revision,learning_language_code,translation_language_code,
 source_lesson_id,topic_id,difficulty,prompt_learning,prompt_translation,
 options,correct_option_id,explanation_learning,explanation_translation,
 status,question_type,answer_language_code,learning_objective_id
)
select
 'u3-ms-quiz-'||pair.code||'-'||d.prefix||'-'||pg_catalog.lpad(n::text,3,'0'),
 1,'ms',pair.code,
 'u3-ms-quiz-fixture-'||d.prefix||'-'||(((n-1)%3)+1),
 'u3-ms-topic-'||d.prefix||'-'||(((n-1)%3)+1),
 d.difficulty,
 'Soalan ujian Malay '||d.difficulty||' '||pair.code||' '||n,
 case when pair.code='zh' then '马来语测验测试题 '||d.difficulty||' '||n
      else 'Malay Quiz test question '||d.difficulty||' '||n end,
 pg_catalog.jsonb_build_array(
  pg_catalog.jsonb_build_object('id','a','learning_text','Jawapan betul','translation_text',case when pair.code='zh' then '正确答案' else 'Correct answer' end),
  pg_catalog.jsonb_build_object('id','b','learning_text','Pilihan salah satu','translation_text',case when pair.code='zh' then '错误选项一' else 'Incorrect option one' end),
  pg_catalog.jsonb_build_object('id','c','learning_text','Pilihan salah dua','translation_text',case when pair.code='zh' then '错误选项二' else 'Incorrect option two' end),
  pg_catalog.jsonb_build_object('id','d','learning_text','Pilihan salah tiga','translation_text',case when pair.code='zh' then '错误选项三' else 'Incorrect option three' end)
 ),
 'a','Jawapan ini betul berdasarkan soalan.','The selected answer is correct.','approved','knowledge','ms','fixture-objective'
from (values ('en'),('zh')) pair(code)
cross join (values ('b','beginner',30),('i','intermediate',24),('a','advanced',32)) d(prefix,difficulty,total)
cross join lateral generate_series(1,d.total) n
on conflict(question_id,revision) do update set
 status='approved',approved_at=pg_catalog.now(),
 prompt_learning=excluded.prompt_learning,
 prompt_translation=excluded.prompt_translation,
 options=excluded.options,
 correct_option_id=excluded.correct_option_id,
 explanation_learning=excluded.explanation_learning,
 explanation_translation=excluded.explanation_translation;

create temporary table quiz_malay_test_refs(session_id uuid);
grant select,insert on quiz_malay_test_refs to authenticated;

set local role authenticated;

-- Beginner, Malay→English: no answer keys before submission; server scores completion.
select set_config('request.jwt.claim.sub','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',true);
select set_config('request.jwt.claims','{"sub":"eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee"}',true);
do $beginner$
declare
 v_availability jsonb;v_session jsonb;v_saved jsonb;v_result jsonb;v_q jsonb;v_sid uuid;
begin
 v_availability:=public.get_my_quiz_availability();
 if v_availability->>'learning_language_code'<>'ms'
    or v_availability->>'translation_language_code'<>'en'
    or not coalesce((v_availability->'difficulties'->0->>'available')::boolean,false) then
   raise exception 'Malay→English Beginner availability failed: %',v_availability;
 end if;
 v_session:=public.start_my_quiz('beginner','ms','en');
 v_sid:=(v_session->>'session_id')::uuid;
 if v_session->>'status'<>'in_progress' or jsonb_array_length(v_session->'questions')<>10 then
   raise exception 'Malay Beginner session did not contain ten questions: %',v_session;
 end if;
 v_availability:=public.get_my_quiz_availability();
 if v_availability->'allowance'->>'used_count'<>'1'
    or v_availability->'allowance'->>'remaining_count'<>'2' then
   raise exception 'Starting a Malay Quiz must consume exactly one start allowance: %',v_availability;
 end if;
 if (v_session->'questions'->0) ? 'correct_option_id'
    or (v_session->'questions'->0) ? 'explanation_learning' then
   raise exception 'Active Malay Quiz leaked answer key or explanation';
 end if;
 insert into pg_temp.quiz_malay_test_refs values(v_sid);
 for v_q in select value from jsonb_array_elements(v_session->'questions') loop
   v_saved:=public.save_my_quiz_answer(v_sid,v_q->>'question_id','a',(v_q->>'position')::integer);
 end loop;
 v_result:=public.submit_my_quiz(v_sid);
 if v_result->>'status'<>'completed' or v_result->>'correct_count'<>'10'
    or v_result->>'percentage'<>'100' then
   raise exception 'Malay Beginner server scoring failed: %',v_result;
 end if;
 if not ((v_result->'questions'->0) ? 'correct_option_id')
    or not ((v_result->'questions'->0) ? 'explanation_learning') then
   raise exception 'Completed Malay review did not reveal the answer and explanation';
 end if;
 v_availability:=public.get_my_quiz_availability();
 if v_availability->'allowance'->>'used_count'<>'1'
    or v_availability->'allowance'->>'remaining_count'<>'2' then
   raise exception 'Malay Quiz completion allowance was not charged exactly once: %',v_availability;
 end if;
end;
$beginner$;

-- Intermediate, Malay→English: 12 intermediate + 3 beginner questions.
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
select set_config('request.jwt.claims','{"sub":"11111111-1111-4111-8111-111111111111"}',true);
do $intermediate$
declare v_session jsonb;v_saved jsonb;v_result jsonb;v_q jsonb;v_sid uuid;
begin
 v_session:=public.start_my_quiz('intermediate','ms','en');
 v_sid:=(v_session->>'session_id')::uuid;
 if v_session->>'learning_language_code'<>'ms'
    or v_session->>'translation_language_code'<>'en'
    or jsonb_array_length(v_session->'questions')<>15 then
   raise exception 'Malay Intermediate session routing or question count failed: %',v_session;
 end if;
 for v_q in select value from jsonb_array_elements(v_session->'questions') loop
   v_saved:=public.save_my_quiz_answer(v_sid,v_q->>'question_id','a',(v_q->>'position')::integer);
 end loop;
 v_result:=public.submit_my_quiz(v_sid);
 if v_result->>'status'<>'completed' or v_result->>'correct_count'<>'15' then
   raise exception 'Malay Intermediate scoring failed: %',v_result;
 end if;
end;
$intermediate$;

-- A user cannot inspect another user's completed answer review.
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
select set_config('request.jwt.claims','{"sub":"11111111-1111-4111-8111-111111111111"}',true);
do $ownership$
declare v_other uuid;v_blocked boolean:=false;
begin
 select session_id into v_other from pg_temp.quiz_malay_test_refs limit 1;
 begin
   perform public.get_my_quiz_review(v_other);
 exception when insufficient_privilege or no_data_found then
   v_blocked:=true;
 end;
 if not v_blocked then raise exception 'Cross-account Malay Quiz review was not blocked'; end if;
end;
$ownership$;

-- Advanced, Malay→English: 12 advanced + 6 intermediate + 2 beginner questions.
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
select set_config('request.jwt.claims','{"sub":"22222222-2222-4222-8222-222222222222"}',true);
do $advanced$
declare v_session jsonb;v_saved jsonb;v_result jsonb;v_q jsonb;v_sid uuid;
begin
 v_session:=public.start_my_quiz('advanced','ms','en');
 v_sid:=(v_session->>'session_id')::uuid;
 if v_session->>'learning_language_code'<>'ms'
    or jsonb_array_length(v_session->'questions')<>20 then
   raise exception 'Malay Advanced session routing or question count failed: %',v_session;
 end if;
 for v_q in select value from jsonb_array_elements(v_session->'questions') loop
   v_saved:=public.save_my_quiz_answer(v_sid,v_q->>'question_id','a',(v_q->>'position')::integer);
 end loop;
 v_result:=public.submit_my_quiz(v_sid);
 if v_result->>'status'<>'completed' or v_result->>'correct_count'<>'20' then
   raise exception 'Malay Advanced scoring failed: %',v_result;
 end if;
end;
$advanced$;

-- Malay→Chinese support text is routed independently from the Malay course.
select set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
select set_config('request.jwt.claims','{"sub":"33333333-3333-4333-8333-333333333333"}',true);
do $chinese$
declare v_availability jsonb;v_session jsonb;v_saved jsonb;v_result jsonb;v_q jsonb;v_sid uuid;
begin
 v_availability:=public.get_my_quiz_availability();
 if v_availability->>'translation_language_code'<>'zh'
    or v_availability->>'question_bank_translation_language_code'<>'zh' then
   raise exception 'Malay→Chinese support-language availability failed: %',v_availability;
 end if;
 v_session:=public.start_my_quiz('beginner','ms','zh');
 v_sid:=(v_session->>'session_id')::uuid;
 if v_session->>'translation_language_code'<>'zh'
    or jsonb_array_length(v_session->'questions')<>10 then
   raise exception 'Malay→Chinese session was not routed to the Chinese support bank: %',v_session;
 end if;
 for v_q in select value from jsonb_array_elements(v_session->'questions') loop
   v_saved:=public.save_my_quiz_answer(v_sid,v_q->>'question_id','a',(v_q->>'position')::integer);
 end loop;
 v_result:=public.submit_my_quiz(v_sid);
 if v_result->>'status'<>'completed' or v_result->>'correct_count'<>'10' then
   raise exception 'Malay→Chinese server scoring failed: %',v_result;
 end if;
end;
$chinese$;

-- Selecting Malay as its own translation keeps the Malay display while using
-- an English support snapshot internally. The account preference remains ms.
select set_config('request.jwt.claim.sub','44444444-4444-4444-8444-444444444444',true);
select set_config('request.jwt.claims','{"sub":"44444444-4444-4444-8444-444444444444"}',true);
do $same_language$
declare v_availability jsonb;v_session jsonb;v_failed boolean:=false;
begin
 v_availability:=public.get_my_quiz_availability();
 if v_availability->>'translation_language_code'<>'ms'
    or v_availability->>'question_bank_translation_language_code'<>'en' then
   raise exception 'Malay same-language preference did not use the expected support fallback: %',v_availability;
 end if;
 begin
   perform public.start_my_quiz('beginner','en','en');
 exception when insufficient_privilege then
   v_failed:=true;
 end;
 if not v_failed then raise exception 'A client-supplied learning-language override was accepted'; end if;
 v_session:=public.start_my_quiz('beginner','ms','ms');
 if v_session->>'learning_language_code'<>'ms'
    or v_session->>'translation_language_code'<>'en' then
   raise exception 'Malay same-language Quiz snapshot fallback failed: %',v_session;
 end if;
end;
$same_language$;

-- Abandoning a session must not consume completion allowance.
select set_config('request.jwt.claim.sub','55555555-5555-4555-8555-555555555555',true);
select set_config('request.jwt.claims','{"sub":"55555555-5555-4555-8555-555555555555"}',true);
do $abandon$
declare v_session jsonb;v_result jsonb;v_availability jsonb;
begin
 v_session:=public.start_my_quiz('beginner','ms','en');
 v_result:=public.abandon_my_quiz((v_session->>'session_id')::uuid);
 if v_result->>'status'<>'abandoned' then raise exception 'Malay Quiz abandon failed: %',v_result; end if;
 v_availability:=public.get_my_quiz_availability();
 if v_availability->'allowance'->>'used_count'<>'1'
    or v_availability->'allowance'->>'remaining_count'<>'2' then
   raise exception 'Abandoning a Malay Quiz must not refund the existing start allowance: %',v_availability;
 end if;
end;
$abandon$;

rollback;
