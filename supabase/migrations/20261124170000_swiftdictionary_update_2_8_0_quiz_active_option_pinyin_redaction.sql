-- U2.8.0 Quiz answer-safety hardening.
-- Option Pinyin is useful in completed review, but can reveal a pronunciation
-- answer while a question is active. Keep it out of active-session payloads.
begin;

create or replace function private.quiz_session_payload(
  p_session_id uuid,
  p_include_review boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid:=auth.uid();
  v_session private.quiz_sessions%rowtype;
  v_payload jsonb;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  select * into v_session
  from private.quiz_sessions s
  where s.id=p_session_id and s.user_id=v_user;

  if not found then
    raise exception 'Quiz session not found' using errcode='P0002';
  end if;

  if p_include_review and v_session.status<>'completed' then
    raise exception 'Only completed Quizzes can be reviewed' using errcode='42501';
  end if;

  select pg_catalog.jsonb_build_object(
    'session_id',v_session.id,
    'difficulty',v_session.difficulty,
    'status',v_session.status,
    'question_count',v_session.question_count,
    'current_position',v_session.current_position,
    'learning_language_code',v_session.learning_language_code,
    'translation_language_code',v_session.translation_language_code,
    'source_composition',v_session.source_composition,
    'started_at',v_session.started_at,
    'completed_at',v_session.completed_at,
    'correct_count',case when v_session.status='completed' then v_session.correct_count else null end,
    'percentage',case when v_session.status='completed' then v_session.percentage else null end,
    'questions',coalesce(pg_catalog.jsonb_agg(
      pg_catalog.jsonb_build_object(
        'question_id',q.question_id,
        'source_lesson_id',q.source_lesson_id,
        'topic_id',q.topic_id,
        'source_difficulty',q.source_difficulty,
        'question_type',q.question_type_snapshot,
        'answer_language_code',q.answer_language_code_snapshot,
        'learning_language_code',q.learning_language_code_snapshot,
        'learning_objective_id',q.learning_objective_id_snapshot,
        'position',q.position,
        'prompt_learning',q.prompt_learning_snapshot,
        'prompt_translation',q.prompt_translation_snapshot,
        'prompt_pinyin',q.prompt_pinyin_snapshot,
        'options',(select pg_catalog.jsonb_agg(
          pg_catalog.jsonb_build_object(
            'id',o.value->>'id',
            'learning_text',o.value->>'learning_text',
            'translation_text',o.value->>'translation_text'
          ) || case when p_include_review then
            pg_catalog.jsonb_build_object('pinyin',o.value->>'pinyin')
          else '{}'::jsonb end
          order by pg_catalog.array_position(q.option_order,o.value->>'id')
        ) from pg_catalog.jsonb_array_elements(q.options_snapshot) as o(value)),
        'selected_option_id',q.selected_option_id
      ) || case when p_include_review then pg_catalog.jsonb_build_object(
        'correct_option_id',q.correct_option_id_snapshot,
        'is_correct',q.selected_option_id=q.correct_option_id_snapshot,
        'explanation_learning',q.explanation_learning_snapshot,
        'explanation_translation',q.explanation_translation_snapshot,
        'explanation_pinyin',q.explanation_pinyin_snapshot
      ) else '{}'::jsonb end
      order by q.position
    ),'[]'::jsonb)
  ) into v_payload
  from private.quiz_session_questions q
  where q.session_id=v_session.id and q.user_id=v_user;

  return v_payload;
end;
$function$;

revoke all on function private.quiz_session_payload(uuid,boolean) from public,anon,authenticated;
grant execute on function private.quiz_session_payload(uuid,boolean) to authenticated;

commit;
