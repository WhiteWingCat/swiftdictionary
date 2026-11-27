-- Repair U3.0 Flashcard completion after the language-support migrations replaced
-- the 2.5 completion routine without preserving weak-memory rows or card snapshots.
-- This is additive and account-scoped; it does not rewrite completed session summaries.
begin;

create or replace function private.complete_my_flashcard_game_impl(
  p_session_id uuid,p_results jsonb
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_session private.flashcard_sessions%rowtype;
  v_seen integer;
  v_correct integer := 0;
  v_incorrect integer := 0;
  v_unanswered integer := 0;
  v_position integer := 0;
  v_item jsonb;
  v_snapshot jsonb;
  v_key text;
  v_custom_id uuid;
  v_ok boolean;
  v_unanswered_flag boolean;
  v_mode text;
  v_snapshot_mode text;
  v_selected_index integer;
  v_correct_index integer;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;
  if p_session_id is null or jsonb_typeof(p_results) <> 'array'
     or jsonb_array_length(p_results) < 1 or jsonb_array_length(p_results) > 30 then
    raise exception 'Invalid Flashcard game results' using errcode='22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
  select * into v_session
  from private.flashcard_sessions
  where id=p_session_id and user_id=v_user
  for update;

  if not found then
    raise exception 'Flashcard game not found' using errcode='P0002';
  end if;
  if v_session.status='completed' then
    return jsonb_build_object(
      'completed',true,'already_completed',true,
      'words_seen',v_session.words_seen,'correct_count',v_session.correct_count,
      'incorrect_count',v_session.incorrect_count,'unanswered_count',v_session.unanswered_count
    );
  end if;
  if v_session.status <> 'in_progress' then
    raise exception 'Flashcard game is no longer active' using errcode='42501';
  end if;
  if v_session.started_at > now()-make_interval(secs=>coalesce(v_session.duration_seconds,60)) then
    raise exception 'The Flash Recall challenge is not complete yet' using errcode='P0001';
  end if;
  if v_session.started_at < now()-interval '5 minutes' then
    raise exception 'Flashcard game expired; start a new round' using errcode='P0001';
  end if;

  v_seen := jsonb_array_length(p_results);
  for v_item in select value from jsonb_array_elements(p_results)
  loop
    v_position := v_position+1;
    v_key := nullif(btrim(v_item->>'card_key'),'');
    v_ok := coalesce((v_item->>'correct')::boolean,false);
    v_unanswered_flag := coalesce((v_item->>'unanswered')::boolean,false);
    v_mode := coalesce(nullif(v_item->>'mode',''),v_session.mode);

    if v_mode not in ('word','definition','translation','mixed','sentence') then
      raise exception 'A Flashcard result has an invalid recall mode' using errcode='22023';
    end if;
    if v_key is null or char_length(v_key)>180
       or (v_key not like 'dict:%' and v_key not like 'custom:%') then
      raise exception 'A Flashcard result is missing a valid card key' using errcode='22023';
    end if;

    if v_key like 'custom:%' then
      begin
        v_custom_id := substring(v_key from 8)::uuid;
      exception when invalid_text_representation then
        raise exception 'Custom Flashcard result key is invalid' using errcode='22023';
      end;
      if not exists(
        select 1 from private.flashcard_cards c
        where c.id=v_custom_id and c.user_id=v_user and c.card_type='custom'
      ) then
        raise exception 'Custom Flashcard result does not belong to this account' using errcode='42501';
      end if;
    elsif char_length(v_key)<=5 then
      raise exception 'Dictionary Flashcard result key is invalid' using errcode='22023';
    end if;

    if v_ok and v_unanswered_flag then
      raise exception 'An unanswered card cannot be correct' using errcode='22023';
    end if;

    -- Persist the exact question, card, choices and selected answer. Older clients
    -- may still submit summary-only results; those remain completable, but are
    -- deliberately not represented as fully reviewable sessions.
    v_snapshot := v_item->'snapshot';
    if jsonb_typeof(v_snapshot)='object' then
      v_snapshot_mode := coalesce(nullif(v_snapshot->>'recall_mode',''),v_mode);
      v_selected_index := nullif(v_snapshot->>'selected_option_index','')::integer;
      v_correct_index := nullif(v_snapshot->>'correct_option_index','')::integer;
      if v_snapshot_mode not in ('word','definition','translation','mixed','sentence')
         or jsonb_typeof(v_snapshot->'card') <> 'object'
         or jsonb_typeof(v_snapshot->'options') <> 'array'
         or jsonb_array_length(v_snapshot->'options') <> 4
         or char_length(btrim(coalesce(v_snapshot->>'prompt',''))) not between 1 and 2000
         or v_correct_index is null or v_correct_index not between 0 and 3
         or (v_selected_index is not null and v_selected_index not between 0 and 3)
         or char_length(btrim(coalesce(v_snapshot->>'correct_answer',''))) not between 1 and 1000 then
        raise exception 'A Flashcard per-card review snapshot is incomplete or invalid' using errcode='22023';
      end if;

      insert into private.flashcard_session_items(
        session_id,user_id,position,card_key,recall_mode,prompt_snapshot,
        card_snapshot,options_snapshot,selected_option_index,correct_option_index,
        selected_answer_snapshot,correct_answer_snapshot,is_correct,unanswered
      ) values (
        p_session_id,v_user,v_position,v_key,v_snapshot_mode,
        btrim(v_snapshot->>'prompt'),v_snapshot->'card',v_snapshot->'options',
        v_selected_index,v_correct_index,
        nullif(v_snapshot->>'selected_answer',''),
        btrim(v_snapshot->>'correct_answer'),v_ok,v_unanswered_flag
      );
    end if;

    -- Every incorrect or unanswered answer enters the weak-memory queue.
    if not v_ok then
      insert into private.flashcard_review_items(
        user_id,card_key,mode,incorrect_count,last_incorrect_at,last_session_id
      ) values(v_user,v_key,v_mode,1,now(),p_session_id)
      on conflict(user_id,card_key,mode) do update set
        incorrect_count=private.flashcard_review_items.incorrect_count+1,
        last_incorrect_at=excluded.last_incorrect_at,
        last_session_id=excluded.last_session_id;
      v_incorrect := v_incorrect+1;
    else
      v_correct := v_correct+1;
    end if;
    if v_unanswered_flag then
      v_unanswered := v_unanswered+1;
    end if;

    insert into private.flashcard_mastery(
      user_id,card_key,correct_count,incorrect_count,current_streak,
      last_result,last_seen_at,updated_at
    ) values (
      v_user,v_key,case when v_ok then 1 else 0 end,
      case when v_ok then 0 else 1 end,
      case when v_ok then 1 else 0 end,
      case when v_ok then 'correct' else 'incorrect' end,now(),now()
    )
    on conflict(user_id,card_key) do update set
      correct_count=private.flashcard_mastery.correct_count+excluded.correct_count,
      incorrect_count=private.flashcard_mastery.incorrect_count+excluded.incorrect_count,
      current_streak=case when excluded.last_result='correct'
        then private.flashcard_mastery.current_streak+1 else 0 end,
      last_result=excluded.last_result,last_seen_at=now(),updated_at=now();
  end loop;

  update private.flashcard_sessions
  set status='completed',words_seen=v_seen,correct_count=v_correct,
      incorrect_count=v_incorrect,unanswered_count=v_unanswered,completed_at=now()
  where id=p_session_id and user_id=v_user;

  -- Keep allowance accounting aligned with the actual learning course.
  insert into public.learning_activity_log(user_id,activity_type,language_code,event_type)
  values(v_user,'flashcard',coalesce(v_session.learning_language_code,'en'),'completed');

  return jsonb_build_object(
    'completed',true,'words_seen',v_seen,'correct_count',v_correct,
    'incorrect_count',v_incorrect,'unanswered_count',v_unanswered,
    'review_available',exists(
      select 1 from private.flashcard_session_items i
      where i.session_id=p_session_id and i.user_id=v_user
    )
  );
end;
$function$;

revoke all on function private.complete_my_flashcard_game_impl(uuid,jsonb) from public,anon,authenticated;
grant execute on function private.complete_my_flashcard_game_impl(uuid,jsonb) to authenticated;

-- Recover weak-memory entries for recent misses already recorded in mastery
-- before the completion routine was repaired. Associate only with a nearby
-- completed session; never guess a mode for orphaned mastery rows.
insert into private.flashcard_review_items(
  user_id,card_key,mode,incorrect_count,last_incorrect_at,last_session_id
)
select m.user_id,m.card_key,s.mode,greatest(m.incorrect_count,1),m.last_seen_at,s.id
from private.flashcard_mastery m
join lateral (
  select fs.id,fs.mode,fs.completed_at
  from private.flashcard_sessions fs
  where fs.user_id=m.user_id and fs.status='completed' and fs.completed_at is not null
  order by abs(extract(epoch from (fs.completed_at-m.last_seen_at))) asc
  limit 1
) s on abs(extract(epoch from (s.completed_at-m.last_seen_at))) <= 600
where m.last_result='incorrect'
on conflict(user_id,card_key,mode) do update set
  incorrect_count=greatest(private.flashcard_review_items.incorrect_count,excluded.incorrect_count),
  last_incorrect_at=greatest(private.flashcard_review_items.last_incorrect_at,excluded.last_incorrect_at),
  last_session_id=case when excluded.last_incorrect_at>=private.flashcard_review_items.last_incorrect_at
    then excluded.last_session_id else private.flashcard_review_items.last_session_id end;

commit;
