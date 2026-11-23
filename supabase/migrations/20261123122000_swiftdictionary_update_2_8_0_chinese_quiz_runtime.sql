-- U2.8.0 Chinese Quiz language-aware runtime and pinyin snapshots.
-- Additive feature-branch migration; no staging/production application is authorised.
begin;

alter table private.quiz_question_bank
  add column if not exists prompt_pinyin text;
alter table private.quiz_question_bank
  add column if not exists explanation_pinyin text;
alter table private.quiz_session_questions
  add column if not exists prompt_pinyin_snapshot text;
alter table private.quiz_session_questions
  add column if not exists explanation_pinyin_snapshot text;

create or replace function private.guard_quiz_session_question_update()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if new.session_id is distinct from old.session_id
     or new.user_id is distinct from old.user_id
     or new.local_date is distinct from old.local_date
     or new.question_id is distinct from old.question_id
     or new.question_revision is distinct from old.question_revision
     or new.position is distinct from old.position
     or new.source_lesson_id is distinct from old.source_lesson_id
     or new.topic_id is distinct from old.topic_id
     or new.source_difficulty is distinct from old.source_difficulty
     or new.question_type_snapshot is distinct from old.question_type_snapshot
     or new.answer_language_code_snapshot is distinct from old.answer_language_code_snapshot
     or new.learning_language_code_snapshot is distinct from old.learning_language_code_snapshot
     or new.learning_objective_id_snapshot is distinct from old.learning_objective_id_snapshot
     or new.option_order is distinct from old.option_order
     or new.prompt_learning_snapshot is distinct from old.prompt_learning_snapshot
     or new.prompt_translation_snapshot is distinct from old.prompt_translation_snapshot
     or new.prompt_pinyin_snapshot is distinct from old.prompt_pinyin_snapshot
     or new.options_snapshot is distinct from old.options_snapshot
     or new.correct_option_id_snapshot is distinct from old.correct_option_id_snapshot
     or new.explanation_learning_snapshot is distinct from old.explanation_learning_snapshot
     or new.explanation_translation_snapshot is distinct from old.explanation_translation_snapshot
     or new.explanation_pinyin_snapshot is distinct from old.explanation_pinyin_snapshot then
    raise exception 'Quiz question identity and snapshots are immutable'
      using errcode='42501';
  end if;
  if new.selected_option_id is not null
     and not (new.selected_option_id = any(new.option_order)) then
    raise exception 'Selected option does not belong to this Quiz question'
      using errcode='23514';
  end if;
  return new;
end;
$function$;
revoke all on function private.guard_quiz_session_question_update() from public,anon,authenticated;

create or replace function private.quiz_session_payload(p_session_id uuid,p_include_review boolean default false)
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
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select * into v_session from private.quiz_sessions s
    where s.id=p_session_id and s.user_id=v_user;
  if not found then raise exception 'Quiz session not found' using errcode='P0002'; end if;
  if p_include_review and v_session.status<>'completed' then
    raise exception 'Only completed Quizzes can be reviewed' using errcode='42501';
  end if;
  select pg_catalog.jsonb_build_object(
    'session_id',v_session.id,'difficulty',v_session.difficulty,'status',v_session.status,
    'question_count',v_session.question_count,'current_position',v_session.current_position,
    'learning_language_code',v_session.learning_language_code,
    'translation_language_code',v_session.translation_language_code,
    'source_composition',v_session.source_composition,'started_at',v_session.started_at,
    'completed_at',v_session.completed_at,
    'correct_count',case when v_session.status='completed' then v_session.correct_count else null end,
    'percentage',case when v_session.status='completed' then v_session.percentage else null end,
    'questions',coalesce(pg_catalog.jsonb_agg(
      pg_catalog.jsonb_build_object(
        'question_id',q.question_id,'source_lesson_id',q.source_lesson_id,
        'topic_id',q.topic_id,'source_difficulty',q.source_difficulty,
        'question_type',q.question_type_snapshot,
        'answer_language_code',q.answer_language_code_snapshot,
        'learning_language_code',q.learning_language_code_snapshot,
        'learning_objective_id',q.learning_objective_id_snapshot,
        'position',q.position,'prompt_learning',q.prompt_learning_snapshot,
        'prompt_translation',q.prompt_translation_snapshot,
        'prompt_pinyin',q.prompt_pinyin_snapshot,
        'options',(select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
          'id',o.value->>'id','learning_text',o.value->>'learning_text',
          'translation_text',o.value->>'translation_text','pinyin',o.value->>'pinyin'
        ) order by pg_catalog.array_position(q.option_order,o.value->>'id'))
          from pg_catalog.jsonb_array_elements(q.options_snapshot) as o(value)),
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

create or replace function private.get_my_chinese_quiz_availability_impl()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_ctx jsonb:=private.quiz_request_context();
  v_user uuid:=auth.uid();
  v_timezone text:=v_ctx->>'timezone';
  v_day date:=(v_ctx->>'local_date')::date;
  v_learning text;
  v_translation text;
  v_active uuid;
  v_b integer:=0;v_i integer:=0;v_a integer:=0;
  v_rb integer:=0;v_ri integer:=0;v_ra integer:=0;
  v_tb integer:=0;v_ti integer:=0;v_ta integer:=0;
  v_min_b boolean;v_min_i boolean;v_min_a boolean;
  v_fresh_b boolean;v_fresh_i boolean;v_fresh_a boolean;
  v_can_start boolean;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select p.learning_language,p.translation_language into v_learning,v_translation
    from public.user_preferences p where p.user_id=v_user;
  if v_learning is distinct from 'zh' then
    raise exception 'Chinese Quiz availability requested for a non-Chinese course' using errcode='22023';
  end if;
  select s.id into v_active from private.quiz_sessions s
    where s.user_id=v_user and s.status='in_progress';
  select count(distinct q.question_id) filter(where q.difficulty='beginner')::integer,
         count(distinct q.question_id) filter(where q.difficulty='intermediate')::integer,
         count(distinct q.question_id) filter(where q.difficulty='advanced')::integer,
         count(distinct q.topic_id) filter(where q.difficulty='beginner')::integer,
         count(distinct q.topic_id) filter(where q.difficulty='intermediate')::integer,
         count(distinct q.topic_id) filter(where q.difficulty='advanced')::integer
    into v_b,v_i,v_a,v_tb,v_ti,v_ta
  from private.quiz_question_bank q
  join private.learning_content_catalog c on c.activity_type='permanent_lesson'
    and c.content_id=q.source_lesson_id and c.language_code=q.learning_language_code
    and c.is_active and c.topic_id=q.topic_id
  where q.status='approved' and q.learning_language_code='zh'
    and q.translation_language_code='en' and q.question_type='knowledge'
    and q.answer_language_code='zh' and q.learning_objective_id is not null;
  select count(distinct q.question_id) filter(where q.difficulty='beginner')::integer,
         count(distinct q.question_id) filter(where q.difficulty='intermediate')::integer,
         count(distinct q.question_id) filter(where q.difficulty='advanced')::integer
    into v_rb,v_ri,v_ra
  from private.quiz_question_bank q
  join private.learning_content_catalog c on c.activity_type='permanent_lesson'
    and c.content_id=q.source_lesson_id and c.language_code=q.learning_language_code
    and c.is_active and c.topic_id=q.topic_id
  where q.status='approved' and q.learning_language_code='zh'
    and q.translation_language_code='en' and q.question_type='knowledge'
    and q.answer_language_code='zh' and q.learning_objective_id is not null
    and not exists(select 1 from private.quiz_daily_question_reservations r
      where r.user_id=v_user and r.local_date=v_day and r.question_id=q.question_id);
  v_min_b:=v_b>=30 and v_tb>=3;
  v_min_i:=v_i>=36 and v_ti>=3 and v_b>=30;
  v_min_a:=v_a>=48 and v_ta>=3 and v_i>=12;
  v_fresh_b:=v_rb>=10 and v_tb>=3;
  v_fresh_i:=v_ri>=12 and v_rb>=3 and v_ti>=3 and v_tb>=3;
  v_fresh_a:=v_ra>=16 and v_ri>=4 and v_ta>=3 and v_ti>=3;
  v_can_start:=coalesce((v_ctx->>'plan_enabled')::boolean,false)
    and coalesce((v_ctx->>'remaining_count')::integer,0)>0 and v_active is null;
  return pg_catalog.jsonb_build_object(
    'timezone',v_timezone,'local_date',v_day,'plan_code',v_ctx->>'plan_code',
    'learning_language_code',v_learning,'translation_language_code',v_translation,
    'allowance',pg_catalog.jsonb_build_object(
      'daily_limit',(v_ctx->>'daily_limit')::integer,
      'used_count',(v_ctx->>'used_count')::integer,
      'remaining_count',(v_ctx->>'remaining_count')::integer),
    'active_session_id',v_active,
    'difficulties',pg_catalog.jsonb_build_array(
      pg_catalog.jsonb_build_object('difficulty','beginner','question_count',10,
        'bank_minimum_met',v_min_b,'bank_target_met',v_min_b,
        'bank_counts',pg_catalog.jsonb_build_object('beginner',v_b),
        'remaining_counts',pg_catalog.jsonb_build_object('beginner',v_rb),
        'available',v_min_b and v_fresh_b and v_can_start,
        'reason',case when v_active is not null then 'active_session_exists'
          when not coalesce((v_ctx->>'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when coalesce((v_ctx->>'remaining_count')::integer,0)<1 then 'allowance_exhausted'
          when not v_min_b then 'question_bank_below_minimum'
          when not v_fresh_b then 'fresh_questions_unavailable_today' else null end),
      pg_catalog.jsonb_build_object('difficulty','intermediate','question_count',15,
        'bank_minimum_met',v_min_i,'bank_target_met',v_min_i,
        'bank_counts',pg_catalog.jsonb_build_object('beginner',v_b,'intermediate',v_i),
        'remaining_counts',pg_catalog.jsonb_build_object('beginner',v_rb,'intermediate',v_ri),
        'available',v_min_i and v_fresh_i and v_can_start,
        'reason',case when v_active is not null then 'active_session_exists'
          when not coalesce((v_ctx->>'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when coalesce((v_ctx->>'remaining_count')::integer,0)<1 then 'allowance_exhausted'
          when not v_min_i then 'question_bank_below_minimum'
          when not v_fresh_i then 'fresh_questions_unavailable_today' else null end),
      pg_catalog.jsonb_build_object('difficulty','advanced','question_count',20,
        'bank_minimum_met',v_min_a,'bank_target_met',v_min_a,
        'bank_counts',pg_catalog.jsonb_build_object('beginner',v_b,'intermediate',v_i,'advanced',v_a),
        'remaining_counts',pg_catalog.jsonb_build_object('intermediate',v_ri,'advanced',v_ra),
        'available',v_min_a and v_fresh_a and v_can_start,
        'reason',case when v_active is not null then 'active_session_exists'
          when not coalesce((v_ctx->>'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when coalesce((v_ctx->>'remaining_count')::integer,0)<1 then 'allowance_exhausted'
          when not v_min_a then 'question_bank_below_minimum'
          when not v_fresh_a then 'fresh_questions_unavailable_today' else null end)
    )
  );
end;
$function$;
revoke all on function private.get_my_chinese_quiz_availability_impl() from public,anon,authenticated;
grant execute on function private.get_my_chinese_quiz_availability_impl() to authenticated;

create or replace function private.start_my_chinese_quiz_impl(
  p_difficulty text,p_learning_language text,p_translation_language text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_ctx jsonb;
  v_user uuid:=auth.uid();
  v_timezone text;
  v_day date;
  v_learning text;
  v_translation text;
  v_active uuid;
  v_question_count integer;
  v_b integer:=0;v_i integer:=0;v_a integer:=0;
  v_rb integer:=0;v_ri integer:=0;v_ra integer:=0;
  v_tb integer:=0;v_ti integer:=0;v_ta integer:=0;
  v_min_b boolean;v_min_i boolean;v_min_a boolean;
  v_topic_counts jsonb:='{}'::jsonb;
  v_selected_ids text[]:='{}'::text[];
  v_selected_revisions integer[]:='{}'::integer[];
  v_source text;
  v_needed integer;
  v_added integer;
  v_topic_cap integer;
  v_topic_count integer;
  v_q record;
  v_session uuid;
  v_order text[];
  v_position integer;
  v_composition jsonb;
  v_group record;
  v_selected_b integer:=0;v_selected_i integer:=0;v_selected_a integer:=0;
begin
  if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_difficulty not in ('beginner','intermediate','advanced') then
    raise exception 'Invalid Quiz difficulty' using errcode='22023';
  end if;
  if p_learning_language is not null and p_learning_language<>'zh' then
    raise exception 'Chinese Quiz requires the Chinese learning course' using errcode='22023';
  end if;
  if p_translation_language is not null and p_translation_language not in ('en','zh') then
    raise exception 'Invalid Quiz translation language' using errcode='22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
  v_ctx:=private.quiz_request_context();
  v_timezone:=v_ctx->>'timezone';
  v_day:=(v_ctx->>'local_date')::date;
  select p.learning_language,coalesce(p_translation_language,p.translation_language)
    into v_learning,v_translation from public.user_preferences p where p.user_id=v_user;
  if v_learning is distinct from 'zh' then
    raise exception 'Chinese Quiz requires the Chinese learning course' using errcode='42501';
  end if;
  select s.id into v_active from private.quiz_sessions s
    where s.user_id=v_user and s.status='in_progress';
  if v_active is not null then
    return pg_catalog.jsonb_build_object('status','active_session_exists',
      'session',private.quiz_session_payload(v_active,false));
  end if;
  if not coalesce((v_ctx->>'plan_enabled')::boolean,false) then
    raise exception 'Quiz is currently unavailable for this plan' using errcode='42501',detail='plan_not_enabled';
  end if;
  if coalesce((v_ctx->>'remaining_count')::integer,0)<1 then
    raise exception 'Daily Quiz completion allowance exhausted' using errcode='P0001',
      detail=pg_catalog.jsonb_build_object('activity_type','quiz',
        'daily_limit',(v_ctx->>'daily_limit')::integer,
        'used',(v_ctx->>'used_count')::integer,'timezone',v_timezone)::text;
  end if;
  select count(*) filter(where q.difficulty='beginner')::integer,
         count(*) filter(where q.difficulty='intermediate')::integer,
         count(*) filter(where q.difficulty='advanced')::integer,
         count(distinct q.topic_id) filter(where q.difficulty='beginner')::integer,
         count(distinct q.topic_id) filter(where q.difficulty='intermediate')::integer,
         count(distinct q.topic_id) filter(where q.difficulty='advanced')::integer
    into v_b,v_i,v_a,v_tb,v_ti,v_ta
  from private.quiz_question_bank q
  join private.learning_content_catalog c on c.activity_type='permanent_lesson'
    and c.content_id=q.source_lesson_id and c.language_code=q.learning_language_code
    and c.is_active and c.topic_id=q.topic_id
  where q.status='approved' and q.learning_language_code='zh'
    and q.translation_language_code='en' and q.question_type='knowledge'
    and q.answer_language_code='zh' and q.learning_objective_id is not null;
  select count(*) filter(where q.difficulty='beginner')::integer,
         count(*) filter(where q.difficulty='intermediate')::integer,
         count(*) filter(where q.difficulty='advanced')::integer
    into v_rb,v_ri,v_ra
  from private.quiz_question_bank q
  join private.learning_content_catalog c on c.activity_type='permanent_lesson'
    and c.content_id=q.source_lesson_id and c.language_code=q.learning_language_code
    and c.is_active and c.topic_id=q.topic_id
  where q.status='approved' and q.learning_language_code='zh'
    and q.translation_language_code='en' and q.question_type='knowledge'
    and q.answer_language_code='zh' and q.learning_objective_id is not null
    and not exists(select 1 from private.quiz_daily_question_reservations r
      where r.user_id=v_user and r.local_date=v_day and r.question_id=q.question_id);
  v_min_b:=v_b>=30 and v_tb>=3;
  v_min_i:=v_i>=36 and v_ti>=3 and v_b>=30;
  v_min_a:=v_a>=48 and v_ta>=3 and v_i>=12;
  if (p_difficulty='beginner' and (not v_min_b or v_rb<10))
     or (p_difficulty='intermediate' and (not v_min_i or v_ri<12 or v_rb<3 or v_ti<3 or v_tb<3))
     or (p_difficulty='advanced' and (not v_min_a or v_ra<16 or v_ri<4 or v_ta<3 or v_ti<3)) then
    raise exception 'Chinese Quiz question bank is not ready or fresh questions are unavailable'
      using errcode='P0001',detail='question_bank_below_minimum_or_fresh_questions_unavailable';
  end if;
  if p_difficulty='beginner' then
    v_question_count:=10;v_source:='beginner';v_needed:=10;
  elsif p_difficulty='intermediate' then
    v_question_count:=15;
  else
    v_question_count:=20;
  end if;
  v_topic_cap:=ceil(v_question_count*0.4)::integer;
  if p_difficulty='beginner' then
    v_source:='beginner';v_needed:=10;
    for v_q in select * from (select distinct on(q.question_id) q.* from private.quiz_question_bank q
      join private.learning_content_catalog c on c.activity_type='permanent_lesson'
       and c.content_id=q.source_lesson_id and c.language_code=q.learning_language_code
       and c.is_active and c.topic_id=q.topic_id
      where q.status='approved' and q.learning_language_code='zh' and q.translation_language_code='en'
       and q.difficulty=v_source and q.question_type='knowledge'
       and not exists(select 1 from private.quiz_daily_question_reservations r where r.user_id=v_user and r.local_date=v_day and r.question_id=q.question_id)
      order by q.question_id,q.revision desc) approved_questions order by random()
    loop
      v_topic_count:=coalesce((v_topic_counts->>v_q.topic_id)::integer,0);
      if v_topic_count<v_topic_cap then
        v_selected_ids:=array_append(v_selected_ids,v_q.question_id);
        v_selected_revisions:=array_append(v_selected_revisions,v_q.revision);
        v_topic_counts:=pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],to_jsonb(v_topic_count+1),true);
        v_needed:=v_needed-1;
        exit when v_needed=0;
      end if;
    end loop;
  elsif p_difficulty='intermediate' then
    for v_group in select * from (values('intermediate',12),('beginner',3)) as t(source,needed)
    loop
      v_source:=v_group.source;v_needed:=v_group.needed;v_added:=0;
      for v_q in select * from (select distinct on(q.question_id) q.* from private.quiz_question_bank q
        join private.learning_content_catalog c on c.activity_type='permanent_lesson'
         and c.content_id=q.source_lesson_id and c.language_code=q.learning_language_code
         and c.is_active and c.topic_id=q.topic_id
        where q.status='approved' and q.learning_language_code='zh' and q.translation_language_code='en'
         and q.difficulty=v_source and q.question_type='knowledge'
         and not exists(select 1 from private.quiz_daily_question_reservations r where r.user_id=v_user and r.local_date=v_day and r.question_id=q.question_id)
        order by q.question_id,q.revision desc) approved_questions order by random()
      loop
        v_topic_count:=coalesce((v_topic_counts->>v_q.topic_id)::integer,0);
        if v_topic_count<v_topic_cap then
          v_selected_ids:=array_append(v_selected_ids,v_q.question_id);
          v_selected_revisions:=array_append(v_selected_revisions,v_q.revision);
          v_topic_counts:=pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],to_jsonb(v_topic_count+1),true);
          v_added:=v_added+1;exit when v_added=v_needed;
        end if;
      end loop;
      if v_added<v_needed then raise exception 'Fresh Chinese Quiz questions unavailable' using errcode='P0001'; end if;
    end loop;
  else
    for v_group in select * from (values('advanced',16),('intermediate',4)) as t(source,needed)
    loop
      v_source:=v_group.source;v_needed:=v_group.needed;v_added:=0;
      for v_q in select * from (select distinct on(q.question_id) q.* from private.quiz_question_bank q
        join private.learning_content_catalog c on c.activity_type='permanent_lesson'
         and c.content_id=q.source_lesson_id and c.language_code=q.learning_language_code
         and c.is_active and c.topic_id=q.topic_id
        where q.status='approved' and q.learning_language_code='zh' and q.translation_language_code='en'
         and q.difficulty=v_source and q.question_type='knowledge'
         and not exists(select 1 from private.quiz_daily_question_reservations r where r.user_id=v_user and r.local_date=v_day and r.question_id=q.question_id)
        order by q.question_id,q.revision desc) approved_questions order by random()
      loop
        v_topic_count:=coalesce((v_topic_counts->>v_q.topic_id)::integer,0);
        if v_topic_count<v_topic_cap then
          v_selected_ids:=array_append(v_selected_ids,v_q.question_id);
          v_selected_revisions:=array_append(v_selected_revisions,v_q.revision);
          v_topic_counts:=pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],to_jsonb(v_topic_count+1),true);
          v_added:=v_added+1;exit when v_added=v_needed;
        end if;
      end loop;
      if v_added<v_needed then raise exception 'Fresh Chinese Quiz questions unavailable' using errcode='P0001'; end if;
    end loop;
  end if;
  if cardinality(v_selected_ids)<>v_question_count or pg_catalog.jsonb_object_length(v_topic_counts)<3 then
    raise exception 'Chinese Quiz selection did not meet its topic-diversity target' using errcode='P0001';
  end if;
  select count(*) filter(where q.difficulty='beginner')::integer,
         count(*) filter(where q.difficulty='intermediate')::integer,
         count(*) filter(where q.difficulty='advanced')::integer
    into v_selected_b,v_selected_i,v_selected_a
  from unnest(v_selected_ids) as selected(question_id)
  join private.quiz_question_bank q on q.question_id=selected.question_id;
  v_composition:=pg_catalog.jsonb_build_object(
    'beginner',v_selected_b,'intermediate',v_selected_i,'advanced',v_selected_a
  );
  insert into private.quiz_sessions(user_id,difficulty,learning_language_code,translation_language_code,
    question_count,source_composition,local_date,timezone)
  values(v_user,p_difficulty,'zh',v_translation,v_question_count,v_composition,v_day,v_timezone)
  returning id into v_session;
  for v_position in 1..v_question_count loop
    select * into v_q from private.quiz_question_bank q
      where q.question_id=v_selected_ids[v_position] and q.revision=v_selected_revisions[v_position];
    select array_agg(o.value->>'id' order by random()) into v_order
      from jsonb_array_elements(v_q.options) as o(value);
    insert into private.quiz_session_questions(
      session_id,user_id,local_date,question_id,question_revision,position,option_order,
      prompt_learning_snapshot,prompt_translation_snapshot,prompt_pinyin_snapshot,
      options_snapshot,correct_option_id_snapshot,explanation_learning_snapshot,
      explanation_translation_snapshot,explanation_pinyin_snapshot,
      source_lesson_id,topic_id,source_difficulty,question_type_snapshot,
      answer_language_code_snapshot,learning_language_code_snapshot,learning_objective_id_snapshot
    ) values(
      v_session,v_user,v_day,v_q.question_id,v_q.revision,v_position,v_order,
      v_q.prompt_learning,v_q.prompt_translation,v_q.prompt_pinyin,
      v_q.options,v_q.correct_option_id,v_q.explanation_learning,
      v_q.explanation_translation,v_q.explanation_pinyin,
      v_q.source_lesson_id,v_q.topic_id,v_q.difficulty,v_q.question_type,
      v_q.answer_language_code,'zh',v_q.learning_objective_id
    );
  end loop;
  insert into private.quiz_daily_question_reservations(user_id,local_date,question_id)
    select v_user,v_day,x from unnest(v_selected_ids) as x
    on conflict(user_id,local_date,question_id) do nothing;
  return private.quiz_session_payload(v_session,false);
end;
$function$;
revoke all on function private.start_my_chinese_quiz_impl(text,text,text) from public,anon,authenticated;
grant execute on function private.start_my_chinese_quiz_impl(text,text,text) to authenticated;

create or replace function public.get_my_quiz_availability()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare v_learning text;
begin
  select learning_language into v_learning from public.user_preferences where user_id=auth.uid();
  if v_learning='zh' then return private.get_my_chinese_quiz_availability_impl(); end if;
  return private.get_my_quiz_availability_impl();
end;
$function$;
revoke all on function public.get_my_quiz_availability() from public,anon;
grant execute on function public.get_my_quiz_availability() to authenticated;

create or replace function public.start_my_quiz(p_difficulty text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare v_learning text;v_translation text;
begin
  select learning_language,translation_language into v_learning,v_translation
    from public.user_preferences where user_id=auth.uid();
  if v_learning='zh' then return private.start_my_chinese_quiz_impl(p_difficulty,'zh',v_translation); end if;
  return private.start_my_quiz_impl(p_difficulty);
end;
$function$;
revoke all on function public.start_my_quiz(text) from public,anon;
grant execute on function public.start_my_quiz(text) to authenticated;

create or replace function public.start_my_quiz(
 p_difficulty text,p_learning_language text,p_translation_language text
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare v_learning text;v_translation text;
begin
  select learning_language,translation_language into v_learning,v_translation
    from public.user_preferences where user_id=auth.uid();
  v_learning:=coalesce(p_learning_language,v_learning);
  v_translation:=coalesce(p_translation_language,v_translation);
  if v_learning='zh' then
    return private.start_my_chinese_quiz_impl(p_difficulty,'zh',v_translation);
  end if;
  return private.start_my_quiz_impl(p_difficulty,v_learning,v_translation);
end;
$function$;
revoke all on function public.start_my_quiz(text,text,text) from public,anon;
grant execute on function public.start_my_quiz(text,text,text) to authenticated;

commit;
