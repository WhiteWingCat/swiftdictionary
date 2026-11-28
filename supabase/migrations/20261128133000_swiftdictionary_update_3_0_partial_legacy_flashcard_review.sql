-- Preserve access to the recoverable part of completed Flashcard sessions
-- whose exact per-card snapshots were lost during the U3.0 completion-RPC
-- replacement. Never fabricate prompts, options or selected/correct answers.
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
  v_has_snapshots boolean;
  v_partial_items jsonb;
  v_review_status text;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  select * into v_session
  from private.flashcard_sessions s
  where s.id=p_session_id and s.user_id=v_user;

  if not found then
    raise exception 'Flashcard game not found' using errcode='P0002';
  end if;
  if v_session.status<>'completed' then
    raise exception 'Only completed Flashcard games can be reviewed' using errcode='42501';
  end if;

  select exists(
    select 1 from private.flashcard_session_items i
    where i.session_id=v_session.id and i.user_id=v_user
  ) into v_has_snapshots;

  if v_has_snapshots then
    v_review_status := 'full';
    return jsonb_build_object(
      'session_id',v_session.id,'mode',v_session.mode,'difficulty',v_session.difficulty,
      'learning_language_code',v_session.learning_language_code,
      'translation_language_code',v_session.translation_language_code,
      'duration_seconds',v_session.duration_seconds,'started_at',v_session.started_at,
      'completed_at',v_session.completed_at,'words_seen',v_session.words_seen,
      'correct_count',v_session.correct_count,'incorrect_count',v_session.incorrect_count,
      'unanswered_count',v_session.unanswered_count,
      'review_available',true,'review_status',v_review_status,
      'items',coalesce((
        select jsonb_agg(jsonb_build_object(
          'position',i.position,'card_key',i.card_key,'mode',i.recall_mode,'recall_mode',i.recall_mode,
          'prompt',i.prompt_snapshot,'card',i.card_snapshot,'options',i.options_snapshot,
          'selected_option_index',i.selected_option_index,'correct_option_index',i.correct_option_index,
          'selected_answer',i.selected_answer_snapshot,'correct_answer',i.correct_answer_snapshot,
          'is_correct',i.is_correct,'unanswered',i.unanswered
        ) order by i.position)
        from private.flashcard_session_items i
        where i.session_id=v_session.id and i.user_id=v_user
      ),'[]'::jsonb)
    );
  end if;

  -- A previous completion routine did persist weak-memory rows with the
  -- originating session id, but not exact snapshots. These rows identify only
  -- known missed cards; they cannot reconstruct the full round or answers.
  select coalesce(jsonb_agg(jsonb_build_object(
    'position',q.position,'card_key',q.card_key,'mode',q.mode,'recall_mode',q.mode,
    'incorrect_count',q.incorrect_count,
    'card',q.card
  ) order by q.position),'[]'::jsonb)
  into v_partial_items
  from (
    select
      row_number() over(order by r.last_incorrect_at,r.card_key)::integer as position,
      r.card_key,r.mode,r.incorrect_count,
      case
        when r.card_key like 'custom:%' then coalesce((
          select jsonb_build_object(
            'word',c.front_text,'definition',c.back_text,'example',c.example_text,
            'course',c.language_code,
            'translation_ms',case when c.translation_language_code='ms' then c.translation_text else null end
          )
          from private.flashcard_cards c
          where c.id=substring(r.card_key from 8)::uuid and c.user_id=v_user
        ),jsonb_build_object('word',r.card_key,'course',v_session.learning_language_code))
        else jsonb_build_object(
          'word',pg_catalog.regexp_replace(r.card_key,'^dict:(en|zh|ms):',''),
          'course',v_session.learning_language_code
        )
      end as card
    from private.flashcard_review_items r
    where r.user_id=v_user and r.last_session_id=v_session.id
    order by r.last_incorrect_at,r.card_key
  ) q;

  v_review_status := case
    when jsonb_array_length(v_partial_items)>0 then 'partial'
    else 'unavailable'
  end;

  return jsonb_build_object(
    'session_id',v_session.id,'mode',v_session.mode,'difficulty',v_session.difficulty,
    'learning_language_code',v_session.learning_language_code,
    'translation_language_code',v_session.translation_language_code,
    'duration_seconds',v_session.duration_seconds,'started_at',v_session.started_at,
    'completed_at',v_session.completed_at,'words_seen',v_session.words_seen,
    'correct_count',v_session.correct_count,'incorrect_count',v_session.incorrect_count,
    'unanswered_count',v_session.unanswered_count,
    'review_available',jsonb_array_length(v_partial_items)>0,
    'review_status',v_review_status,
    'items',v_partial_items
  );
end;
$function$;

revoke all on function private.get_my_flashcard_game_review_impl(uuid) from public,anon,authenticated;
grant execute on function private.get_my_flashcard_game_review_impl(uuid) to authenticated;

commit;
