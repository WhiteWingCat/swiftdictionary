-- Expand authenticated Flashcard history payload so the UI can page through up to 100 recent completed games.
create or replace function private.get_my_flashcard_data_impl()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare v_user uuid:=auth.uid(); v_allowance jsonb;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  v_allowance:=private.get_my_flashcard_allowance_impl();
  return jsonb_build_object(
    'allowance',v_allowance,
    'collections',coalesce((select jsonb_agg(jsonb_build_object(
      'id',c.id,'name',c.name,'created_at',c.created_at,'updated_at',c.updated_at
    ) order by c.updated_at desc) from private.flashcard_collections c where c.user_id=v_user),'[]'::jsonb),
    'cards',coalesce((select jsonb_agg(jsonb_build_object(
      'id',c.id,'collection_id',c.collection_id,'card_type',c.card_type,
      'language_code',c.language_code,'dictionary_word',c.dictionary_word,
      'front_text',c.front_text,'back_text',c.back_text,'pinyin',c.pinyin,
      'definition_zh',c.definition_zh,'translation_zh',c.translation_zh,
      'example_text',c.example_text,'example_pinyin',c.example_pinyin,
      'translation_text',c.translation_text,'position',c.position,
      'created_at',c.created_at,'updated_at',c.updated_at
    ) order by c.collection_id,c.position,c.created_at)
      from private.flashcard_cards c where c.user_id=v_user),'[]'::jsonb),
    'review_items',coalesce((select jsonb_agg(jsonb_build_object(
      'card_key',r.card_key,'mode',r.mode,'incorrect_count',r.incorrect_count,
      'last_incorrect_at',r.last_incorrect_at
    ) order by r.last_incorrect_at desc) from private.flashcard_review_items r where r.user_id=v_user),'[]'::jsonb),
    'mastery',coalesce((select jsonb_agg(jsonb_build_object(
      'card_key',m.card_key,'correct_count',m.correct_count,
      'incorrect_count',m.incorrect_count,'current_streak',m.current_streak,
      'last_result',m.last_result,'last_seen_at',m.last_seen_at
    )) from private.flashcard_mastery m where m.user_id=v_user),'[]'::jsonb),
    'history',coalesce((select jsonb_agg(jsonb_build_object(
      'id',s.id,'mode',s.mode,'difficulty',s.difficulty,'learning_language_code',s.learning_language_code,
      'translation_language_code',s.translation_language_code,'words_seen',s.words_seen,
      'correct_count',s.correct_count,'incorrect_count',s.incorrect_count,
      'unanswered_count',s.unanswered_count,'started_at',s.started_at,'completed_at',s.completed_at
    ) order by s.started_at desc) from (
      select * from private.flashcard_sessions where user_id=v_user and status='completed'
      order by started_at desc limit 100
    ) s),'[]'::jsonb)
  );
end;
$function$;
revoke all on function private.get_my_flashcard_data_impl() from public,anon,authenticated;
grant execute on function private.get_my_flashcard_data_impl() to authenticated;
