-- SwiftDictionary Update 2.5.0 — configurable 60/120-second Flash Recall challenges.
-- Additive only. Apply to staging first; production remains untouched pending approval.
alter table private.flashcard_sessions
  add column if not exists duration_seconds integer not null default 60
  check (duration_seconds in (60,120));

create or replace function private.start_my_flashcard_game_impl(p_mode text,p_difficulty text,p_duration_seconds integer)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare v_user uuid := auth.uid(); v_learning text; v_id uuid; v_plan text; v_status text; v_valid_from timestamptz; v_valid_until timestamptz; v_limit integer; v_used integer; v_timezone text;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_duration_seconds not in (60,120) then raise exception 'Invalid Flashcard challenge duration' using errcode='22023'; end if;
  if p_mode not in ('word','definition','mixed','sentence')
     or p_difficulty not in ('beginner','intermediate','advanced') then
    raise exception 'Invalid Flashcard mode or difficulty' using errcode='22023';
  end if;
  select learning_language into v_learning from public.user_preferences where user_id=v_user;
  if coalesce(v_learning,'en') <> 'en' then
    raise exception 'Flashcards currently support the English learning course only' using errcode='42501';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
  select e.plan_code,e.status,e.valid_from,e.valid_until
    into v_plan,v_status,v_valid_from,v_valid_until
    from public.user_entitlements e where e.user_id=v_user;
  if not found or v_status <> 'active'
     or (v_valid_from is not null and now()<v_valid_from)
     or (v_valid_until is not null and now()>=v_valid_until) then
    v_plan := 'free';
  end if;
  select l.daily_limit into v_limit from public.learning_plan_limits l
    where l.plan_code=v_plan and l.activity_type='flashcard' and l.is_enabled;
  if not found then raise exception 'Flashcards are unavailable for this plan' using errcode='42501'; end if;
  select coalesce(
      case when p.allowance_timezone is not null
                and p.allowance_timezone_until > pg_catalog.now()
           then p.allowance_timezone else p.timezone end,
      'UTC'
    )
    into v_timezone
    from public.user_preferences p where p.user_id=v_user;
  if v_timezone is null then
    raise exception 'A saved allowance timezone is required' using errcode='22023';
  end if;
  v_used := private.current_learning_allowance_usage(v_user,'flashcard',v_timezone);
  if v_used >= v_limit then
    raise exception 'Daily Flashcard game allowance exhausted'
      using errcode='P0001',detail=jsonb_build_object('activity_type','flashcard','daily_limit',v_limit,'used',v_used)::text;
  end if;
  update private.flashcard_sessions set status='abandoned'
    where user_id=v_user and status='in_progress';
  insert into private.flashcard_sessions(user_id,mode,difficulty,duration_seconds)
    values(v_user,p_mode,p_difficulty,p_duration_seconds) returning id into v_id;
  return jsonb_build_object('session_id',v_id,'started_at',now(),'duration_seconds',p_duration_seconds);
end;
$function$;

create or replace function private.start_my_flashcard_game_impl(p_mode text,p_difficulty text)
returns jsonb language sql security definer set search_path=''
as $function$ select private.start_my_flashcard_game_impl(p_mode,p_difficulty,60); $function$;

create or replace function public.start_my_flashcard_game(p_mode text,p_difficulty text,p_duration_seconds integer)
returns jsonb language sql security invoker set search_path=''
as $function$ select private.start_my_flashcard_game_impl(p_mode,p_difficulty,p_duration_seconds); $function$;

create or replace function private.complete_my_flashcard_game_impl(
  p_session_id uuid,p_results jsonb
) returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_session private.flashcard_sessions%rowtype;
  v_seen integer; v_correct integer; v_incorrect integer; v_unanswered integer;
  v_item jsonb; v_key text; v_custom_id uuid; v_ok boolean; v_unanswered_flag boolean; v_mode text;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_session_id is null or jsonb_typeof(p_results) <> 'array'
     or jsonb_array_length(p_results) < 1 or jsonb_array_length(p_results) > 30 then
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
  if v_session.status <> 'in_progress' then raise exception 'Flashcard game is no longer active' using errcode='42501'; end if;
  if v_session.started_at > now()-pg_catalog.make_interval(secs => v_session.duration_seconds) then
    raise exception 'The Flash Recall challenge is not complete yet' using errcode='P0001';
  end if;
  if v_session.started_at < now()-interval '5 minutes' then
    raise exception 'Flashcard game expired; start a new round' using errcode='P0001';
  end if;
  v_seen := jsonb_array_length(p_results);
  v_correct := 0; v_incorrect := 0; v_unanswered := 0;
  for v_item in select value from jsonb_array_elements(p_results)
  loop
    v_key := nullif(btrim(v_item->>'card_key'),'');
    v_ok := coalesce((v_item->>'correct')::boolean,false);
    v_unanswered_flag := coalesce((v_item->>'unanswered')::boolean,false);
    v_mode := coalesce(v_item->>'mode',v_session.mode);
    if v_mode not in ('word','definition','mixed','sentence') then
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
    if v_ok and v_unanswered_flag then raise exception 'An unanswered card cannot be correct' using errcode='22023'; end if;
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
    ) values (
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
  -- This insert invokes the existing server-side completion allowance trigger.
  -- If the daily limit is exhausted, the whole transaction (including mastery)
  -- rolls back and the game remains uncharged.
  insert into public.learning_activity_log(user_id,activity_type,language_code,event_type)
    values(v_user,'flashcard','en','completed');
  return jsonb_build_object('completed',true,'words_seen',v_seen,
    'correct_count',v_correct,'incorrect_count',v_incorrect,'unanswered_count',v_unanswered);
end;
$function$;

grant execute on function private.start_my_flashcard_game_impl(text,text,integer) to authenticated;
revoke all on function private.start_my_flashcard_game_impl(text,text,integer) from public,anon;
revoke all on function public.start_my_flashcard_game(text,text,integer) from public,anon;
grant execute on function public.start_my_flashcard_game(text,text,integer) to authenticated;
