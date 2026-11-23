-- U2.8.0 Flashcard language-aware session creation and complete per-card snapshots.
-- Feature-branch migration only; do not apply to production without separate approval.
begin;

create or replace function private.start_my_flashcard_game_impl(
  p_mode text,p_difficulty text,p_duration_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_learning text;
  v_translation text;
  v_id uuid;
  v_plan text;
  v_status text;
  v_valid_from timestamptz;
  v_valid_until timestamptz;
  v_limit integer;
  v_used integer;
  v_timezone text;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_duration_seconds not in (60,120) then
    raise exception 'Invalid Flashcard challenge duration' using errcode='22023';
  end if;
  if p_difficulty not in ('beginner','intermediate','advanced') then
    raise exception 'Invalid Flashcard difficulty' using errcode='22023';
  end if;
  select coalesce(learning_language,'en'),coalesce(translation_language,'zh')
    into v_learning,v_translation
    from public.user_preferences where user_id=v_user;
  v_learning:=coalesce(v_learning,'en');
  v_translation:=coalesce(v_translation,'zh');
  if v_learning not in ('en','zh') or v_translation not in ('en','zh') then
    raise exception 'Unsupported Flashcard language selection' using errcode='22023';
  end if;
  if v_learning='zh' and p_mode not in ('word','definition','translation','sentence') then
    raise exception 'Chinese Flashcards require one of the four distinct recall modes' using errcode='22023';
  end if;
  if v_learning='en' and p_mode not in ('word','definition','mixed','sentence') then
    raise exception 'Translation Recall is available in the Chinese learning course' using errcode='22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
  select e.plan_code,e.status,e.valid_from,e.valid_until
    into v_plan,v_status,v_valid_from,v_valid_until
    from public.user_entitlements e where e.user_id=v_user;
  if not found or v_status<>'active'
     or (v_valid_from is not null and now()<v_valid_from)
     or (v_valid_until is not null and now()>=v_valid_until) then
    v_plan:='free';
  end if;
  select l.daily_limit into v_limit from public.learning_plan_limits l
    where l.plan_code=v_plan and l.activity_type='flashcard' and l.is_enabled;
  if not found then raise exception 'Flashcards are unavailable for this plan' using errcode='42501'; end if;
  select coalesce(
    case when p.allowance_timezone is not null and p.allowance_timezone_until>pg_catalog.now()
      then p.allowance_timezone else p.timezone end,'UTC')
    into v_timezone from public.user_preferences p where p.user_id=v_user;
  if v_timezone is null then raise exception 'A saved allowance timezone is required' using errcode='22023'; end if;
  v_used:=private.current_learning_allowance_usage(v_user,'flashcard',v_timezone);
  if v_used>=v_limit then
    raise exception 'Daily Flashcard game allowance exhausted'
      using errcode='P0001',detail=jsonb_build_object('activity_type','flashcard','daily_limit',v_limit,'used',v_used)::text;
  end if;
  update private.flashcard_sessions set status='abandoned'
    where user_id=v_user and status='in_progress';
  insert into private.flashcard_sessions(
    user_id,mode,difficulty,duration_seconds,learning_language_code,translation_language_code
  ) values(v_user,p_mode,p_difficulty,p_duration_seconds,v_learning,v_translation)
  returning id into v_id;
  return jsonb_build_object('session_id',v_id,'started_at',now(),
    'duration_seconds',p_duration_seconds,'learning_language_code',v_learning,
    'translation_language_code',v_translation);
end;
$function$;
revoke all on function private.start_my_flashcard_game_impl(text,text,integer) from public,anon,authenticated;
grant execute on function private.start_my_flashcard_game_impl(text,text,integer) to authenticated;

create or replace function private.complete_my_flashcard_game_impl(p_session_id uuid,p_results jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid:=auth.uid();
  v_session private.flashcard_sessions%rowtype;
  v_seen integer;
  v_correct integer:=0;
  v_incorrect integer:=0;
  v_unanswered integer:=0;
  v_position integer:=0;
  v_item jsonb;
  v_snapshot jsonb;
  v_key text;
  v_custom_id uuid;
  v_ok boolean;
  v_unanswered_flag boolean;
  v_mode text;
  v_recall_mode text;
  v_selected_index integer;
  v_correct_index integer;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_session_id is null or jsonb_typeof(p_results)<>'array'
     or jsonb_array_length(p_results)<1 or jsonb_array_length(p_results)>30 then
    raise exception 'Invalid Flashcard game results' using errcode='22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
  select * into v_session from private.flashcard_sessions
    where id=p_session_id and user_id=v_user for update;
  if not found then raise exception 'Flashcard game not found' using errcode='P0002'; end if;
  if v_session.status='completed' then
    return jsonb_build_object('completed',true,'already_completed',true,
      'words_seen',v_session.words_seen,'correct_count',v_session.correct_count,
      'incorrect_count',v_session.incorrect_count,'unanswered_count',v_session.unanswered_count);
  end if;
  if v_session.status<>'in_progress' then
    raise exception 'Flashcard game is no longer active' using errcode='42501';
  end if;
  if v_session.started_at>now()-pg_catalog.make_interval(secs=>v_session.duration_seconds) then
    raise exception 'The Flash Recall challenge is not complete yet' using errcode='P0001';
  end if;
  if v_session.started_at<now()-interval '5 minutes' then
    raise exception 'Flashcard game expired; start a new round' using errcode='P0001';
  end if;
  v_seen:=jsonb_array_length(p_results);
  for v_item in select value from jsonb_array_elements(p_results)
  loop
    v_position:=v_position+1;
    v_key:=nullif(btrim(v_item->>'card_key'),'');
    v_unanswered_flag:=coalesce((v_item->>'unanswered')::boolean,false);
    v_mode:=coalesce(v_item->>'mode',v_session.mode);
    v_snapshot:=v_item->'snapshot';
    if v_mode not in ('word','definition','translation','mixed','sentence') then
      raise exception 'A Flashcard result has an invalid recall mode' using errcode='22023';
    end if;
    if (v_session.learning_language_code='zh' and v_mode not in ('word','definition','translation','sentence'))
       or (v_session.learning_language_code='en' and v_mode='translation') then
      raise exception 'Recall mode does not match the learning course' using errcode='22023';
    end if;
    if v_key is null or char_length(v_key)>180
       or (v_key not like 'dict:%' and v_key not like 'custom:%') then
      raise exception 'A Flashcard result is missing a valid card key' using errcode='22023';
    end if;
    if v_key like 'custom:%' then
      begin v_custom_id:=substring(v_key from 8)::uuid;
      exception when invalid_text_representation then
        raise exception 'Custom Flashcard result key is invalid' using errcode='22023';
      end;
      if not exists(select 1 from private.flashcard_cards c
        where c.id=v_custom_id and c.user_id=v_user and c.card_type='custom') then
        raise exception 'Custom Flashcard result does not belong to this account' using errcode='42501';
      end if;
    elsif char_length(v_key)<=5 then
      raise exception 'Dictionary Flashcard result key is invalid' using errcode='22023';
    end if;
    if jsonb_typeof(v_snapshot)<>'object'
       or nullif(btrim(v_snapshot->>'prompt'),'') is null
       or jsonb_typeof(v_snapshot->'card')<>'object'
       or jsonb_typeof(v_snapshot->'options')<>'array'
       or jsonb_array_length(v_snapshot->'options')<>4
       or nullif(btrim(v_snapshot->>'correct_answer'),'') is null then
      raise exception 'A Flashcard result is missing its review snapshot' using errcode='22023';
    end if;
    v_recall_mode:=coalesce(v_snapshot->>'recall_mode',v_mode);
    if v_recall_mode not in ('word','definition','translation','mixed','sentence')
       or (v_session.learning_language_code='zh' and v_recall_mode='mixed')
       or (v_session.learning_language_code='en' and v_recall_mode='translation') then
      raise exception 'A Flashcard review snapshot has an invalid recall mode' using errcode='22023';
    end if;
    begin
      v_correct_index:=(v_snapshot->>'correct_option_index')::integer;
      v_selected_index:=nullif(v_snapshot->>'selected_option_index','')::integer;
    exception when invalid_text_representation then
      raise exception 'Flashcard option indexes are invalid' using errcode='22023';
    end;
    if v_correct_index not between 0 and 3
       or (v_selected_index is not null and v_selected_index not between 0 and 3)
       or (v_unanswered_flag and v_selected_index is not null)
       or (not v_unanswered_flag and v_selected_index is null) then
      raise exception 'Flashcard selected/correct option indexes are inconsistent' using errcode='22023';
    end if;
    v_ok:=not v_unanswered_flag and v_selected_index=v_correct_index;
    if coalesce((v_item->>'correct')::boolean,false) is distinct from v_ok then
      raise exception 'Flashcard result correctness does not match its answer snapshot' using errcode='22023';
    end if;
    if v_unanswered_flag and v_ok then
      raise exception 'An unanswered card cannot be correct' using errcode='22023';
    end if;
    insert into private.flashcard_session_items(
      session_id,user_id,position,card_key,recall_mode,prompt_snapshot,
      card_snapshot,options_snapshot,selected_option_index,correct_option_index,
      selected_answer_snapshot,correct_answer_snapshot,is_correct,unanswered
    ) values(
      p_session_id,v_user,v_position,v_key,v_recall_mode,v_snapshot->>'prompt',
      v_snapshot->'card',v_snapshot->'options',v_selected_index,v_correct_index,
      v_snapshot->>'selected_answer',v_snapshot->>'correct_answer',v_ok,v_unanswered_flag
    );
    if not v_ok then
      insert into private.flashcard_review_items(user_id,card_key,mode,incorrect_count,last_incorrect_at,last_session_id)
      values(v_user,v_key,v_mode,1,now(),p_session_id)
      on conflict(user_id,card_key,mode) do update set
        incorrect_count=private.flashcard_review_items.incorrect_count+1,
        last_incorrect_at=now(),last_session_id=excluded.last_session_id;
    end if;
    if v_ok then v_correct:=v_correct+1; else v_incorrect:=v_incorrect+1; end if;
    if v_unanswered_flag then v_unanswered:=v_unanswered+1; end if;
    insert into private.flashcard_mastery(
      user_id,card_key,correct_count,incorrect_count,current_streak,last_result,last_seen_at,updated_at
    ) values(
      v_user,v_key,case when v_ok then 1 else 0 end,
      case when v_ok then 0 else 1 end,case when v_ok then 1 else 0 end,
      case when v_ok then 'correct' else 'incorrect' end,now(),now()
    )
    on conflict(user_id,card_key) do update set
      correct_count=private.flashcard_mastery.correct_count+excluded.correct_count,
      incorrect_count=private.flashcard_mastery.incorrect_count+excluded.incorrect_count,
      current_streak=case when excluded.last_result='correct'
        then private.flashcard_mastery.current_streak+1 else 0 end,
      last_result=excluded.last_result,last_seen_at=now(),updated_at=now();
  end loop;
  update private.flashcard_sessions set status='completed',words_seen=v_seen,
    correct_count=v_correct,incorrect_count=v_incorrect,unanswered_count=v_unanswered,
    completed_at=now() where id=p_session_id and user_id=v_user;
  insert into public.learning_activity_log(user_id,activity_type,language_code,event_type)
    values(v_user,'flashcard',v_session.learning_language_code,'completed');
  return jsonb_build_object('completed',true,'words_seen',v_seen,
    'correct_count',v_correct,'incorrect_count',v_incorrect,'unanswered_count',v_unanswered);
end;
$function$;
revoke all on function private.complete_my_flashcard_game_impl(uuid,jsonb) from public,anon,authenticated;
grant execute on function private.complete_my_flashcard_game_impl(uuid,jsonb) to authenticated;

-- Preserve language-pair metadata in the account-scoped Flashcard payload.
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
      order by started_at desc limit 30
    ) s),'[]'::jsonb)
  );
end;
$function$;
revoke all on function private.get_my_flashcard_data_impl() from public,anon,authenticated;
grant execute on function private.get_my_flashcard_data_impl() to authenticated;

commit;
