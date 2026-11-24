-- Keep the review response field name aligned with the browser contract.
-- recall_mode remains as a backwards-compatible explicit field.
begin;

create or replace function private.get_my_flashcard_game_review_impl(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_session private.flashcard_sessions%rowtype;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select * into v_session from private.flashcard_sessions s
  where s.id=p_session_id and s.user_id=v_user;
  if not found then raise exception 'Flashcard game not found' using errcode='P0002'; end if;
  if v_session.status<>'completed' then
    raise exception 'Only completed Flashcard games can be reviewed' using errcode='42501';
  end if;
  return jsonb_build_object(
    'session_id',v_session.id,'mode',v_session.mode,'difficulty',v_session.difficulty,
    'learning_language_code',v_session.learning_language_code,
    'translation_language_code',v_session.translation_language_code,
    'duration_seconds',v_session.duration_seconds,'started_at',v_session.started_at,
    'completed_at',v_session.completed_at,'words_seen',v_session.words_seen,
    'correct_count',v_session.correct_count,'incorrect_count',v_session.incorrect_count,
    'unanswered_count',v_session.unanswered_count,
    'review_available',exists(select 1 from private.flashcard_session_items i where i.session_id=v_session.id and i.user_id=v_user),
    'items',coalesce((select jsonb_agg(jsonb_build_object(
      'position',i.position,'card_key',i.card_key,'mode',i.recall_mode,'recall_mode',i.recall_mode,
      'prompt',i.prompt_snapshot,'card',i.card_snapshot,'options',i.options_snapshot,
      'selected_option_index',i.selected_option_index,'correct_option_index',i.correct_option_index,
      'selected_answer',i.selected_answer_snapshot,'correct_answer',i.correct_answer_snapshot,
      'is_correct',i.is_correct,'unanswered',i.unanswered
    ) order by i.position) from private.flashcard_session_items i
      where i.session_id=v_session.id and i.user_id=v_user),'[]'::jsonb)
  );
end;
$function$;
revoke all on function private.get_my_flashcard_game_review_impl(uuid) from public,anon,authenticated;
grant execute on function private.get_my_flashcard_game_review_impl(uuid) to authenticated;

commit;
