-- Exercise the actual owner-authorized Malay staging bank through authenticated RPCs.
-- This file is used only in the disposable local Supabase CI database.
\set ON_ERROR_STOP on
begin;

insert into auth.users(id) values
 ('f0a00000-0000-4000-8000-000000000011'),
 ('f0a00000-0000-4000-8000-000000000012')
on conflict(id) do nothing;

insert into public.user_preferences(user_id,learning_language,translation_language,timezone)
values
 ('f0a00000-0000-4000-8000-000000000011','ms','en','Asia/Kuala_Lumpur'),
 ('f0a00000-0000-4000-8000-000000000012','ms','zh','Asia/Kuala_Lumpur')
on conflict(user_id) do update set
 learning_language=excluded.learning_language,
 translation_language=excluded.translation_language,
 timezone=excluded.timezone;

insert into public.user_entitlements(user_id,plan_code,status)
values
 ('f0a00000-0000-4000-8000-000000000011','premium','active'),
 ('f0a00000-0000-4000-8000-000000000012','premium','active')
on conflict(user_id) do update set plan_code='premium',status='active',valid_from=null,valid_until=null;

update public.learning_plan_limits set daily_limit=3,is_enabled=true
where plan_code='premium' and activity_type='quiz';

set local role authenticated;

select set_config('request.jwt.claim.sub','f0a00000-0000-4000-8000-000000000011',true);
select set_config('request.jwt.claims','{"sub":"f0a00000-0000-4000-8000-000000000011"}',true);
do $actual_malay_en$
declare
 v_availability jsonb;
 v_session jsonb;
 v_question jsonb;
begin
 v_availability:=public.get_my_quiz_availability();
 if v_availability->>'learning_language_code'<>'ms'
    or v_availability->>'translation_language_code'<>'en' then
   raise exception 'Actual Malay→English availability routing failed: %',v_availability;
 end if;
 if exists(select 1 from jsonb_array_elements(v_availability->'difficulties') as x(value) where not coalesce((value->>'available')::boolean,false)) then
   raise exception 'Actual Malay→English bank should meet availability for all three difficulties: %',v_availability;
 end if;
 v_session:=public.start_my_quiz('beginner','ms','en');
 if v_session->>'status'<>'in_progress'
    or jsonb_array_length(v_session->'questions')<>10
    or v_session->>'learning_language_code'<>'ms'
    or v_session->>'translation_language_code'<>'en' then
   raise exception 'Actual Malay→English session did not start correctly: %',v_session;
 end if;
 for v_question in select value from jsonb_array_elements(v_session->'questions') loop
   if v_question ? 'correct_option_id' or v_question ? 'explanation_learning' then
     raise exception 'Actual Malay active session leaked its answer key or explanation';
   end if;
   if v_question->>'question_id' not like 'quiz-ms-en-%'
      or v_question->>'prompt_learning' ~* '^(choose|which|what|where|how|why|select|complete)'
      or v_question->>'prompt_translation' ~ '[一-龥]' then
     raise exception 'Actual Malay→English prompt language or question source is invalid: %',v_question;
   end if;
   if exists(select 1 from jsonb_array_elements(v_question->'options') as x(value) where value->>'learning_text'=value->>'translation_text') then
     raise exception 'Actual Malay→English question has identical learning and support option text: %',v_question;
   end if;
 end loop;
end;
$actual_malay_en$;

select set_config('request.jwt.claim.sub','f0a00000-0000-4000-8000-000000000012',true);
select set_config('request.jwt.claims','{"sub":"f0a00000-0000-4000-8000-000000000012"}',true);
do $actual_malay_zh$
declare
 v_availability jsonb;
 v_session jsonb;
 v_question jsonb;
begin
 v_availability:=public.get_my_quiz_availability();
 if v_availability->>'learning_language_code'<>'ms'
    or v_availability->>'translation_language_code'<>'zh' then
   raise exception 'Actual Malay→Chinese availability routing failed: %',v_availability;
 end if;
 if exists(select 1 from jsonb_array_elements(v_availability->'difficulties') d where not coalesce((d->>'available')::boolean,false)) then
   raise exception 'Actual Malay→Chinese bank should meet availability for all three difficulties: %',v_availability;
 end if;
 v_session:=public.start_my_quiz('beginner','ms','zh');
 if v_session->>'status'<>'in_progress'
    or jsonb_array_length(v_session->'questions')<>10
    or v_session->>'learning_language_code'<>'ms'
    or v_session->>'translation_language_code'<>'zh' then
   raise exception 'Actual Malay→Chinese session did not start correctly: %',v_session;
 end if;
 for v_question in select value from jsonb_array_elements(v_session->'questions') loop
   if v_question ? 'correct_option_id' or v_question ? 'explanation_learning' then
     raise exception 'Actual Malay→Chinese active session leaked its answer key or explanation';
   end if;
   if v_question->>'question_id' not like 'quiz-ms-zh-%'
      or v_question->>'prompt_learning' ~* '^(choose|which|what|where|how|why|select|complete)'
      or v_question->>'prompt_learning' ~ '[一-龥]'
      or v_question->>'prompt_translation' !~ '[一-龥]' then
     raise exception 'Actual Malay→Chinese prompt language or question source is invalid: %',v_question;
   end if;
 end loop;
end;
$actual_malay_zh$;

rollback;
