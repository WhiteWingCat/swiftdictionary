-- U2.8.0 security hardening: keep public RPCs SECURITY INVOKER.
-- Behaviour and signatures remain unchanged; privileged work stays private.
begin;

create or replace function public.is_personal_learning_test_access()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select private.is_learning_limit_exempt();
$function$;
revoke all on function public.is_personal_learning_test_access() from public,anon,service_role;
grant execute on function public.is_personal_learning_test_access() to authenticated;

create or replace function private.record_completed_lesson_practice_result_for_language_impl(
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
revoke all on function private.record_completed_lesson_practice_result_for_language_impl(text,text,text,text,integer,integer)
  from public,anon,authenticated,service_role;
grant execute on function private.record_completed_lesson_practice_result_for_language_impl(text,text,text,text,integer,integer)
  to authenticated;

create or replace function public.record_completed_lesson_practice_result_for_language(
  p_learning_language text,
  p_difficulty text,
  p_lesson_id text,
  p_topic_id text,
  p_correct_count integer,
  p_question_count integer
)
returns boolean
language sql
security invoker
set search_path = ''
as $function$
  select private.record_completed_lesson_practice_result_for_language_impl(
    p_learning_language,p_difficulty,p_lesson_id,p_topic_id,p_correct_count,p_question_count
  );
$function$;
revoke all on function public.record_completed_lesson_practice_result_for_language(text,text,text,text,integer,integer)
  from public,anon,service_role;
grant execute on function public.record_completed_lesson_practice_result_for_language(text,text,text,text,integer,integer)
  to authenticated;

commit;
