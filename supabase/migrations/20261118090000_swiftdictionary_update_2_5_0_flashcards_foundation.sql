-- SwiftDictionary Update 2.5.0 — private Flashcards foundation.
-- Learner-owned collections, cards, mastery and game history remain in the
-- non-exposed private schema. Public RPCs are narrow authenticated entrypoints.

begin;

create table if not exists private.flashcard_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists flashcard_collections_user_name_unique
  on private.flashcard_collections(user_id, lower(name));
create index if not exists flashcard_collections_user_updated_idx
  on private.flashcard_collections(user_id, updated_at desc);

create table if not exists private.flashcard_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  collection_id uuid not null references private.flashcard_collections(id) on delete cascade,
  card_type text not null check (card_type in ('dictionary','custom')),
  language_code text not null default 'en' check (language_code = 'en'),
  dictionary_word text,
  front_text text not null check (char_length(btrim(front_text)) between 1 and 500),
  back_text text not null check (char_length(btrim(back_text)) between 1 and 2000),
  example_text text check (example_text is null or char_length(example_text) <= 2000),
  translation_text text check (translation_text is null or char_length(translation_text) <= 1000),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint flashcard_cards_source_check check (
    (card_type = 'dictionary' and dictionary_word is not null
      and char_length(btrim(dictionary_word)) between 1 and 120)
    or
    (card_type = 'custom' and dictionary_word is null)
  ),
  unique (id,user_id)
);
create index if not exists flashcard_cards_collection_order_idx
  on private.flashcard_cards(collection_id,position,created_at);
create index if not exists flashcard_cards_user_id_idx
  on private.flashcard_cards(user_id);
create unique index if not exists flashcard_cards_dictionary_once_per_collection
  on private.flashcard_cards(collection_id,lower(dictionary_word))
  where card_type = 'dictionary';

create table if not exists private.flashcard_mastery (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_key text not null check (char_length(card_key) between 1 and 180),
  correct_count integer not null default 0 check (correct_count >= 0),
  incorrect_count integer not null default 0 check (incorrect_count >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  last_result text check (last_result in ('correct','incorrect')),
  last_seen_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id,card_key)
);
create index if not exists flashcard_mastery_user_weak_idx
  on private.flashcard_mastery(user_id,last_seen_at asc)
  where last_result = 'incorrect';

create table if not exists private.flashcard_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('word','definition','translation','sentence')),
  difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  status text not null default 'in_progress'
    check (status in ('in_progress','completed','abandoned')),
  words_seen integer,
  correct_count integer,
  incorrect_count integer,
  unanswered_count integer,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint flashcard_sessions_counts_check check (
    (status = 'in_progress' and completed_at is null
      and words_seen is null and correct_count is null
      and incorrect_count is null and unanswered_count is null)
    or
    (status <> 'in_progress' and
      ((status = 'abandoned' and completed_at is null) or
       (status = 'completed' and completed_at is not null)))
  )
);
create index if not exists flashcard_sessions_user_history_idx
  on private.flashcard_sessions(user_id,started_at desc);

alter table private.flashcard_collections enable row level security;
alter table private.flashcard_cards enable row level security;
alter table private.flashcard_mastery enable row level security;
alter table private.flashcard_sessions enable row level security;
revoke all on table private.flashcard_collections,private.flashcard_cards,
  private.flashcard_mastery,private.flashcard_sessions from public,anon,authenticated;

-- All private implementations derive the owner from auth.uid(); no caller
-- supplied user ID is accepted by any RPC.
create or replace function private.get_my_flashcard_allowance_impl()
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_plan text; v_status text; v_valid_from timestamptz; v_valid_until timestamptz;
  v_limit integer; v_used integer; v_timezone text;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
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
  v_limit := coalesce(v_limit,0);
  select coalesce(
      case when p.allowance_timezone is not null
                and p.allowance_timezone_until > pg_catalog.now()
           then p.allowance_timezone else p.timezone end,
      'UTC'
    )
    into v_timezone
    from public.user_preferences p where p.user_id=v_user;
  if v_timezone is null then raise exception 'A saved allowance timezone is required' using errcode='22023'; end if;
  v_used := private.current_learning_allowance_usage(v_user,'flashcard',v_timezone);
  return jsonb_build_object('plan',v_plan,'daily_limit',v_limit,
    'used_count',v_used,'remaining',greatest(v_limit-v_used,0));
end;
$function$;

create or replace function private.get_my_flashcard_data_impl()
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_allowance jsonb;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  v_allowance := private.get_my_flashcard_allowance_impl();
  return jsonb_build_object(
    'allowance',v_allowance,
    'collections',coalesce((select jsonb_agg(jsonb_build_object(
      'id',c.id,'name',c.name,'created_at',c.created_at,'updated_at',c.updated_at
    ) order by c.updated_at desc) from private.flashcard_collections c where c.user_id=v_user),'[]'::jsonb),
    'cards',coalesce((select jsonb_agg(jsonb_build_object(
      'id',c.id,'collection_id',c.collection_id,'card_type',c.card_type,
      'language_code',c.language_code,'dictionary_word',c.dictionary_word,
      'front_text',c.front_text,'back_text',c.back_text,
      'example_text',c.example_text,'translation_text',c.translation_text,
      'position',c.position,'created_at',c.created_at,'updated_at',c.updated_at
    ) order by c.collection_id,c.position,c.created_at)
      from private.flashcard_cards c where c.user_id=v_user),'[]'::jsonb),
    'mastery',coalesce((select jsonb_agg(jsonb_build_object(
      'card_key',m.card_key,'correct_count',m.correct_count,
      'incorrect_count',m.incorrect_count,'current_streak',m.current_streak,
      'last_result',m.last_result,'last_seen_at',m.last_seen_at
    )) from private.flashcard_mastery m where m.user_id=v_user),'[]'::jsonb),
    'history',coalesce((select jsonb_agg(jsonb_build_object(
      'id',s.id,'mode',s.mode,'difficulty',s.difficulty,'words_seen',s.words_seen,
      'correct_count',s.correct_count,'incorrect_count',s.incorrect_count,
      'unanswered_count',s.unanswered_count,'completed_at',s.completed_at
    ) order by s.started_at desc) from (
      select * from private.flashcard_sessions
      where user_id=v_user and status='completed'
      order by started_at desc limit 30
    ) s),'[]'::jsonb)
  );
end;
$function$;

create or replace function private.save_my_flashcard_collection_impl(
  p_action text,p_collection_id uuid,p_name text
) returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare v_user uuid := auth.uid(); v_row private.flashcard_collections%rowtype;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_action='create' then
    if p_collection_id is not null then raise exception 'New collections cannot supply an ID' using errcode='22023'; end if;
    if p_name is null or char_length(btrim(p_name)) not between 1 and 60 then
      raise exception 'Collection names must be 1–60 characters' using errcode='22023';
    end if;
    insert into private.flashcard_collections(user_id,name)
      values(v_user,btrim(p_name)) returning * into v_row;
  elsif p_action='rename' then
    if p_collection_id is null or p_name is null
       or char_length(btrim(p_name)) not between 1 and 60 then
      raise exception 'A collection and valid name are required' using errcode='22023';
    end if;
    update private.flashcard_collections set name=btrim(p_name),updated_at=now()
      where id=p_collection_id and user_id=v_user returning * into v_row;
    if not found then raise exception 'Collection not found' using errcode='P0002'; end if;
  elsif p_action='delete' then
    if p_collection_id is null then raise exception 'Collection ID is required' using errcode='22023'; end if;
    delete from private.flashcard_mastery m using private.flashcard_cards c
      where m.user_id=v_user and c.user_id=v_user and c.collection_id=p_collection_id
        and c.card_type='custom' and m.card_key='custom:'||c.id::text;
    delete from private.flashcard_collections where id=p_collection_id and user_id=v_user;
    if not found then raise exception 'Collection not found' using errcode='P0002'; end if;
    return jsonb_build_object('deleted',true,'id',p_collection_id);
  else
    raise exception 'Unsupported collection action' using errcode='22023';
  end if;
  return jsonb_build_object('id',v_row.id,'name',v_row.name,'created_at',v_row.created_at,'updated_at',v_row.updated_at);
end;
$function$;

create or replace function private.save_my_flashcard_card_impl(
  p_action text,p_card_id uuid,p_collection_id uuid,p_card_type text,
  p_dictionary_word text,p_front_text text,p_back_text text,
  p_example_text text,p_translation_text text,p_position integer
) returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare v_user uuid := auth.uid(); v_row private.flashcard_cards%rowtype;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_action='delete' then
    if p_card_id is null then raise exception 'Card ID is required' using errcode='22023'; end if;
    delete from private.flashcard_mastery where user_id=v_user and card_key='custom:'||p_card_id::text;
    delete from private.flashcard_cards where id=p_card_id and user_id=v_user;
    if not found then raise exception 'Card not found' using errcode='P0002'; end if;
    return jsonb_build_object('deleted',true,'id',p_card_id);
  end if;
  if p_action not in ('create','update','move') then
    raise exception 'Unsupported card action' using errcode='22023';
  end if;
  if p_collection_id is null or not exists(
    select 1 from private.flashcard_collections c
    where c.id=p_collection_id and c.user_id=v_user
  ) then raise exception 'Collection not found' using errcode='P0002'; end if;
  if p_action in ('create','update') then
    if p_card_type not in ('dictionary','custom')
       or p_front_text is null or char_length(btrim(p_front_text)) not between 1 and 500
       or p_back_text is null or char_length(btrim(p_back_text)) not between 1 and 2000
       or (p_card_type='dictionary' and
           (p_dictionary_word is null or char_length(btrim(p_dictionary_word)) not between 1 and 120))
       or (p_card_type='custom' and p_dictionary_word is not null)
       or (p_example_text is not null and char_length(p_example_text)>2000)
       or (p_translation_text is not null and char_length(p_translation_text)>1000) then
      raise exception 'Invalid Flashcard content' using errcode='22023';
    end if;
  end if;
  if p_action='create' then
    if p_card_id is not null then raise exception 'New cards cannot supply an ID' using errcode='22023'; end if;
    insert into private.flashcard_cards(
      user_id,collection_id,card_type,language_code,dictionary_word,
      front_text,back_text,example_text,translation_text,position
    ) values (
      v_user,p_collection_id,p_card_type,'en',nullif(btrim(p_dictionary_word),''),
      btrim(p_front_text),btrim(p_back_text),nullif(btrim(coalesce(p_example_text,'')),''),
      nullif(btrim(coalesce(p_translation_text,'')),''),greatest(coalesce(p_position,0),0)
    ) returning * into v_row;
  elsif p_action='update' then
    if p_card_id is null then raise exception 'Card ID is required' using errcode='22023'; end if;
    update private.flashcard_cards set collection_id=p_collection_id,
      card_type=p_card_type,dictionary_word=nullif(btrim(p_dictionary_word),''),
      front_text=btrim(p_front_text),back_text=btrim(p_back_text),
      example_text=nullif(btrim(coalesce(p_example_text,'')),''),
      translation_text=nullif(btrim(coalesce(p_translation_text,'')),''),
      position=greatest(coalesce(p_position,0),0),updated_at=now()
    where id=p_card_id and user_id=v_user returning * into v_row;
    if not found then raise exception 'Card not found' using errcode='P0002'; end if;
  else
    if p_card_id is null then raise exception 'Card ID is required' using errcode='22023'; end if;
    update private.flashcard_cards set collection_id=p_collection_id,
      position=greatest(coalesce(p_position,0),0),updated_at=now()
    where id=p_card_id and user_id=v_user returning * into v_row;
    if not found then raise exception 'Card not found' using errcode='P0002'; end if;
  end if;
  update private.flashcard_collections set updated_at=now()
    where id=p_collection_id and user_id=v_user;
  return jsonb_build_object('id',v_row.id,'collection_id',v_row.collection_id,
    'card_type',v_row.card_type,'front_text',v_row.front_text,'back_text',v_row.back_text,
    'position',v_row.position);
end;
$function$;

create or replace function private.start_my_flashcard_game_impl(p_mode text,p_difficulty text)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare v_user uuid := auth.uid(); v_learning text; v_id uuid; v_plan text; v_status text; v_valid_from timestamptz; v_valid_until timestamptz; v_limit integer; v_used integer; v_timezone text;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_mode not in ('word','definition','translation','sentence')
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
  insert into private.flashcard_sessions(user_id,mode,difficulty)
    values(v_user,p_mode,p_difficulty) returning id into v_id;
  return jsonb_build_object('session_id',v_id,'started_at',now(),'duration_seconds',60);
end;
$function$;

create or replace function private.complete_my_flashcard_game_impl(
  p_session_id uuid,p_results jsonb
) returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_session private.flashcard_sessions%rowtype;
  v_seen integer; v_correct integer; v_incorrect integer; v_unanswered integer;
  v_item jsonb; v_key text; v_custom_id uuid; v_ok boolean; v_unanswered_flag boolean;
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
  if v_session.started_at > now()-interval '60 seconds' then
    raise exception 'The 60-second Flash Recall round is not complete yet' using errcode='P0001';
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

create or replace function private.abandon_my_flashcard_game_impl(p_session_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  update private.flashcard_sessions set status='abandoned'
    where id=p_session_id and user_id=v_user and status='in_progress';
  return jsonb_build_object('abandoned',true);
end;
$function$;

-- Public schema wrappers are SECURITY INVOKER and expose no table access.
create or replace function public.get_my_flashcard_allowance()
returns jsonb language sql security invoker set search_path=''
as $function$ select private.get_my_flashcard_allowance_impl(); $function$;
create or replace function public.get_my_flashcard_data()
returns jsonb language sql security invoker set search_path=''
as $function$ select private.get_my_flashcard_data_impl(); $function$;
create or replace function public.save_my_flashcard_collection(p_action text,p_collection_id uuid,p_name text)
returns jsonb language sql security invoker set search_path=''
as $function$ select private.save_my_flashcard_collection_impl(p_action,p_collection_id,p_name); $function$;
create or replace function public.save_my_flashcard_card(
  p_action text,p_card_id uuid,p_collection_id uuid,p_card_type text,
  p_dictionary_word text,p_front_text text,p_back_text text,
  p_example_text text,p_translation_text text,p_position integer
) returns jsonb language sql security invoker set search_path=''
as $function$ select private.save_my_flashcard_card_impl(
  p_action,p_card_id,p_collection_id,p_card_type,p_dictionary_word,
  p_front_text,p_back_text,p_example_text,p_translation_text,p_position
); $function$;
create or replace function public.start_my_flashcard_game(p_mode text,p_difficulty text)
returns jsonb language sql security invoker set search_path=''
as $function$ select private.start_my_flashcard_game_impl(p_mode,p_difficulty); $function$;
create or replace function public.complete_my_flashcard_game(p_session_id uuid,p_results jsonb)
returns jsonb language sql security invoker set search_path=''
as $function$ select private.complete_my_flashcard_game_impl(p_session_id,p_results); $function$;
create or replace function public.abandon_my_flashcard_game(p_session_id uuid)
returns jsonb language sql security invoker set search_path=''
as $function$ select private.abandon_my_flashcard_game_impl(p_session_id); $function$;

grant usage on schema private to authenticated;
grant execute on function private.get_my_flashcard_allowance_impl() to authenticated;
grant execute on function private.get_my_flashcard_data_impl() to authenticated;
grant execute on function private.save_my_flashcard_collection_impl(text,uuid,text) to authenticated;
grant execute on function private.save_my_flashcard_card_impl(text,uuid,uuid,text,text,text,text,text,text,integer) to authenticated;
grant execute on function private.start_my_flashcard_game_impl(text,text) to authenticated;
grant execute on function private.complete_my_flashcard_game_impl(uuid,jsonb) to authenticated;
grant execute on function private.abandon_my_flashcard_game_impl(uuid) to authenticated;
revoke all on function private.get_my_flashcard_allowance_impl() from public,anon;
revoke all on function private.get_my_flashcard_data_impl() from public,anon;
revoke all on function private.save_my_flashcard_collection_impl(text,uuid,text) from public,anon;
revoke all on function private.save_my_flashcard_card_impl(text,uuid,uuid,text,text,text,text,text,text,integer) from public,anon;
revoke all on function private.start_my_flashcard_game_impl(text,text) from public,anon;
revoke all on function private.complete_my_flashcard_game_impl(uuid,jsonb) from public,anon;
revoke all on function private.abandon_my_flashcard_game_impl(uuid) from public,anon;

revoke all on function public.get_my_flashcard_allowance() from public,anon;
revoke all on function public.get_my_flashcard_data() from public,anon;
revoke all on function public.save_my_flashcard_collection(text,uuid,text) from public,anon;
revoke all on function public.save_my_flashcard_card(text,uuid,uuid,text,text,text,text,text,text,integer) from public,anon;
revoke all on function public.start_my_flashcard_game(text,text) from public,anon;
revoke all on function public.complete_my_flashcard_game(uuid,jsonb) from public,anon;
revoke all on function public.abandon_my_flashcard_game(uuid) from public,anon;
grant execute on function public.get_my_flashcard_allowance() to authenticated;
grant execute on function public.get_my_flashcard_data() to authenticated;
grant execute on function public.save_my_flashcard_collection(text,uuid,text) to authenticated;
grant execute on function public.save_my_flashcard_card(text,uuid,uuid,text,text,text,text,text,text,integer) to authenticated;
grant execute on function public.start_my_flashcard_game(text,text) to authenticated;
grant execute on function public.complete_my_flashcard_game(uuid,jsonb) to authenticated;
grant execute on function public.abandon_my_flashcard_game(uuid) to authenticated;

-- Update only the Flashcard plan rows; no other learning quotas are changed.
update public.learning_plan_limits
set daily_limit=case plan_code when 'free' then 3 when 'premium' then 10 else daily_limit end,
    is_enabled=true,updated_at=now()
where activity_type='flashcard' and plan_code in ('free','premium');

-- Extend the existing account-level learning-history deletion workflow.
create or replace function private.delete_my_learning_history_impl()
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_jwt jsonb;
  v_session_id uuid;
  v_session_created_at timestamptz;
  v_session_not_after timestamptz;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  v_jwt := auth.jwt();
  v_session_id := nullif(v_jwt ->> 'session_id', '')::uuid;
  select s.created_at,s.not_after into v_session_created_at,v_session_not_after
    from auth.sessions s where s.id=v_session_id and s.user_id=v_user;
  if not found or v_session_created_at is null
     or v_session_created_at < pg_catalog.now()-interval '15 minutes'
     or v_session_created_at > pg_catalog.now()+interval '60 seconds'
     or (v_session_not_after is not null and v_session_not_after<=pg_catalog.now()) then
    raise exception 'Recent authentication required to delete learning history' using errcode='42501';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
  delete from public.daily_activity_sessions where user_id=v_user;
  delete from public.lesson_practice_results where user_id=v_user;
  delete from public.lesson_progress where user_id=v_user;
  delete from public.learning_activity_log where user_id=v_user;
  delete from private.flashcard_sessions where user_id=v_user;
  delete from private.flashcard_mastery where user_id=v_user;
  return pg_catalog.jsonb_build_object('deleted',true);
end;
$function$;

commit;
