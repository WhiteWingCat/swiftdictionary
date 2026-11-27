-- SwiftDictionary Update 3.0 — secure Malay Quiz runtime.
-- Additive only: reuses the existing private session, answer snapshot, scoring,
-- allowance and no-repeat ledger. Malay content remains unavailable until
-- approved question-bank records are imported through the normal release gate.

begin;

c-- Existing Quiz language checks were limited to English and Chinese. Extend only
-- these language-code checks to include Malay; question-type equality checks
-- still require a knowledge answer to use its learning language.
alter table private.quiz_question_bank drop constraint if exists quiz_question_bank_answer_language_code_check;
alter table private.quiz_question_bank add constraint quiz_question_bank_answer_language_code_check
 check (answer_language_code = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table private.quiz_question_bank validate constraint quiz_question_bank_answer_language_code_check;

alter table private.quiz_session_questions drop constraint if exists quiz_session_questions_answer_language_code_snapshot_check;
alter table private.quiz_session_questions add constraint quiz_session_questions_answer_language_code_snapshot_check
 check (answer_language_code_snapshot = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table private.quiz_session_questions validate constraint quiz_session_questions_answer_language_code_snapshot_check;

alter table private.quiz_session_questions drop constraint if exists quiz_session_questions_learning_language_code_snapshot_check;
alter table private.quiz_session_questions add constraint quiz_session_questions_learning_language_code_snapshot_check
 check (learning_language_code_snapshot = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table private.quiz_session_questions validate constraint quiz_session_questions_learning_language_code_snapshot_check;

reate or replace function private.get_my_malay_quiz_availability_impl()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_ctx jsonb := private.quiz_request_context();
  v_user uuid := auth.uid();
  v_timezone text := v_ctx->>'timezone';
  v_day date := (v_ctx->>'local_date')::date;
  v_learning text;
  v_requested_translation text;
  v_bank_translation text;
  v_active uuid;
  v_b integer := 0; v_i integer := 0; v_a integer := 0;
  v_rb integer := 0; v_ri integer := 0; v_ra integer := 0;
  v_tb integer := 0; v_ti integer := 0; v_ta integer := 0;
  v_min_b boolean; v_min_i boolean; v_min_a boolean;
  v_target_b boolean; v_target_i boolean; v_target_a boolean;
  v_fresh_b boolean; v_fresh_i boolean; v_fresh_a boolean;
  v_can_start boolean;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  select p.learning_language,p.translation_language
    into v_learning,v_requested_translation
  from public.user_preferences p
  where p.user_id=v_user;

  if v_learning is distinct from 'ms' then
    raise exception 'Malay Quiz availability requested for a non-Malay course'
      using errcode='22023';
  end if;

  if v_requested_translation not in ('en','zh','ms') then
    raise exception 'Unsupported Malay Quiz translation preference'
      using errcode='22023';
  end if;

  -- Malay as its own display language means no secondary translation is shown.
  -- The private bank uses an English support snapshot in that case; the client
  -- still renders Malay-only text while the selected translation is "ms".
  v_bank_translation := case when v_requested_translation='ms'
    then 'en' else v_requested_translation end;

  select s.id into v_active
  from private.quiz_sessions s
  where s.user_id=v_user and s.status='in_progress';

  select
    count(*) filter(where q.difficulty='beginner')::integer,
    count(*) filter(where q.difficulty='intermediate')::integer,
    count(*) filter(where q.difficulty='advanced')::integer,
    count(distinct q.topic_id) filter(where q.difficulty='beginner')::integer,
    count(distinct q.topic_id) filter(where q.difficulty='intermediate')::integer,
    count(distinct q.topic_id) filter(where q.difficulty='advanced')::integer
  into v_b,v_i,v_a,v_tb,v_ti,v_ta
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active
   and c.topic_id=q.topic_id
  where q.status='approved'
    and q.learning_language_code='ms'
    and q.translation_language_code=v_bank_translation
    and q.question_type='knowledge'
    and q.answer_language_code='ms'
    and q.learning_objective_id is not null;

  select
    count(*) filter(where q.difficulty='beginner')::integer,
    count(*) filter(where q.difficulty='intermediate')::integer,
    count(*) filter(where q.difficulty='advanced')::integer
  into v_rb,v_ri,v_ra
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active
   and c.topic_id=q.topic_id
  where q.status='approved'
    and q.learning_language_code='ms'
    and q.translation_language_code=v_bank_translation
    and q.question_type='knowledge'
    and q.answer_language_code='ms'
    and q.learning_objective_id is not null
    and not exists(
      select 1 from private.quiz_daily_question_reservations r
      where r.user_id=v_user and r.local_date=v_day
        and r.question_id=q.question_id
    );

  v_min_b := v_b>=30 and v_tb>=3;
  v_min_i := v_i>=24 and v_ti>=3 and v_b>=16 and v_tb>=3;
  v_min_a := v_a>=32 and v_ta>=3 and v_i>=8 and v_ti>=3 and v_b>=8 and v_tb>=3;

  v_target_b := v_b>=36 and v_tb>=3;
  v_target_i := v_i>=36 and v_ti>=3 and v_b>=24 and v_tb>=3;
  v_target_a := v_a>=48 and v_ta>=3 and v_i>=12 and v_ti>=3 and v_b>=12 and v_tb>=3;

  v_fresh_b := v_rb>=10 and v_tb>=3;
  v_fresh_i := v_ri>=12 and v_rb>=3 and v_ti>=3 and v_tb>=3;
  v_fresh_a := v_ra>=12 and v_ri>=6 and v_rb>=2
    and v_ta>=3 and v_ti>=3 and v_tb>=3;

  v_can_start := coalesce((v_ctx->>'plan_enabled')::boolean,false)
    and coalesce((v_ctx->>'remaining_count')::integer,0)>0
    and v_active is null;

  return pg_catalog.jsonb_build_object(
    'timezone',v_timezone,
    'local_date',v_day,
    'plan_code',v_ctx->>'plan_code',
    'learning_language_code',v_learning,
    'translation_language_code',v_requested_translation,
    'question_bank_translation_language_code',v_bank_translation,
    'allowance',pg_catalog.jsonb_build_object(
      'daily_limit',(v_ctx->>'daily_limit')::integer,
      'used_count',(v_ctx->>'used_count')::integer,
      'remaining_count',(v_ctx->>'remaining_count')::integer
    ),
    'active_session_id',v_active,
    'difficulties',pg_catalog.jsonb_build_array(
      pg_catalog.jsonb_build_object(
        'difficulty','beginner','question_count',10,
        'bank_minimum_met',v_min_b,'bank_target_met',v_target_b,
        'bank_counts',pg_catalog.jsonb_build_object('beginner',v_b),
        'remaining_counts',pg_catalog.jsonb_build_object('beginner',v_rb),
        'available',v_min_b and v_fresh_b and v_can_start,
        'reason',case
          when v_active is not null then 'active_session_exists'
          when not coalesce((v_ctx->>'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when coalesce((v_ctx->>'remaining_count')::integer,0)<1 then 'allowance_exhausted'
          when v_b+v_i+v_a=0 then 'learning_course_not_supported'
          when not v_min_b then 'question_bank_below_minimum'
          when not v_fresh_b then 'fresh_questions_unavailable_today'
          else null end
      ),
      pg_catalog.jsonb_build_object(
        'difficulty','intermediate','question_count',15,
        'bank_minimum_met',v_min_i,'bank_target_met',v_target_i,
        'bank_counts',pg_catalog.jsonb_build_object('beginner',v_b,'intermediate',v_i),
        'remaining_counts',pg_catalog.jsonb_build_object('beginner',v_rb,'intermediate',v_ri),
        'available',v_min_i and v_fresh_i and v_can_start,
        'reason',case
          when v_active is not null then 'active_session_exists'
          when not coalesce((v_ctx->>'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when coalesce((v_ctx->>'remaining_count')::integer,0)<1 then 'allowance_exhausted'
          when v_b+v_i+v_a=0 then 'learning_course_not_supported'
          when not v_min_i then 'question_bank_below_minimum'
          when not v_fresh_i then 'fresh_questions_unavailable_today'
          else null end
      ),
      pg_catalog.jsonb_build_object(
        'difficulty','advanced','question_count',20,
        'bank_minimum_met',v_min_a,'bank_target_met',v_target_a,
        'bank_counts',pg_catalog.jsonb_build_object('beginner',v_b,'intermediate',v_i,'advanced',v_a),
        'remaining_counts',pg_catalog.jsonb_build_object('beginner',v_rb,'intermediate',v_ri,'advanced',v_ra),
        'available',v_min_a and v_fresh_a and v_can_start,
        'reason',case
          when v_active is not null then 'active_session_exists'
          when not coalesce((v_ctx->>'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when coalesce((v_ctx->>'remaining_count')::integer,0)<1 then 'allowance_exhausted'
          when v_b+v_i+v_a=0 then 'learning_course_not_supported'
          when not v_min_a then 'question_bank_below_minimum'
          when not v_fresh_a then 'fresh_questions_unavailable_today'
          else null end
      )
    )
  );
end;
$function$;

revoke all on function private.get_my_malay_quiz_availability_impl()
  from public,anon,authenticated;
grant execute on function private.get_my_malay_quiz_availability_impl()
  to authenticated;

create or replace function private.start_my_malay_quiz_impl(
  p_difficulty text,
  p_learning_language text,
  p_translation_language text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_ctx jsonb;
  v_user uuid := auth.uid();
  v_timezone text;
  v_day date;
  v_learning text;
  v_requested_translation text;
  v_bank_translation text;
  v_active uuid;
  v_question_count integer;
  v_b integer:=0; v_i integer:=0; v_a integer:=0;
  v_rb integer:=0; v_ri integer:=0; v_ra integer:=0;
  v_tb integer:=0; v_ti integer:=0; v_ta integer:=0;
  v_min_b boolean; v_min_i boolean; v_min_a boolean;
  v_topic_counts jsonb := '{}'::jsonb;
  v_selected_ids text[] := '{}'::text[];
  v_selected_revisions integer[] := '{}'::integer[];
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
  v_selected_b integer:=0; v_selected_i integer:=0; v_selected_a integer:=0;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;
  if p_difficulty is null or p_difficulty not in ('beginner','intermediate','advanced') then
    raise exception 'Invalid Quiz difficulty' using errcode='22023';
  end if;
  if p_learning_language is not null and p_learning_language<>'ms' then
    raise exception 'Malay Quiz requires the Malay learning course' using errcode='22023';
  end if;
  if p_translation_language is not null and p_translation_language not in ('en','zh','ms') then
    raise exception 'Invalid Malay Quiz translation language' using errcode='22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
  v_ctx := private.quiz_request_context();
  v_timezone := v_ctx->>'timezone';
  v_day := (v_ctx->>'local_date')::date;

  select p.learning_language,p.translation_language
    into v_learning,v_requested_translation
  from public.user_preferences p
  where p.user_id=v_user;

  if v_learning is distinct from 'ms' then
    raise exception 'Malay Quiz requires the saved Malay learning course'
      using errcode='42501',detail='learning_course_not_supported';
  end if;
  if p_translation_language is not null then
    v_requested_translation:=p_translation_language;
  end if;
  if v_requested_translation not in ('en','zh','ms') then
    raise exception 'Unsupported Malay Quiz translation language'
      using errcode='22023';
  end if;
  v_bank_translation := case when v_requested_translation='ms'
    then 'en' else v_requested_translation end;

  select s.id into v_active
  from private.quiz_sessions s
  where s.user_id=v_user and s.status='in_progress';
  if v_active is not null then
    return pg_catalog.jsonb_build_object(
      'status','active_session_exists',
      'session',private.quiz_session_payload(v_active,false)
    );
  end if;

  if not coalesce((v_ctx->>'plan_enabled')::boolean,false) then
    raise exception 'Quiz is currently unavailable for this plan'
      using errcode='42501',detail='plan_not_enabled';
  end if;
  if coalesce((v_ctx->>'remaining_count')::integer,0)<1 then
    raise exception 'Daily Quiz completion allowance exhausted'
      using errcode='P0001',
      detail=pg_catalog.jsonb_build_object(
        'activity_type','quiz',
        'daily_limit',(v_ctx->>'daily_limit')::integer,
        'used',(v_ctx->>'used_count')::integer,
        'timezone',v_timezone
      )::text;
  end if;

  select
    count(*) filter(where q.difficulty='beginner')::integer,
    count(*) filter(where q.difficulty='intermediate')::integer,
    count(*) filter(where q.difficulty='advanced')::integer,
    count(distinct q.topic_id) filter(where q.difficulty='beginner')::integer,
    count(distinct q.topic_id) filter(where q.difficulty='intermediate')::integer,
    count(distinct q.topic_id) filter(where q.difficulty='advanced')::integer
  into v_b,v_i,v_a,v_tb,v_ti,v_ta
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active
   and c.topic_id=q.topic_id
  where q.status='approved'
    and q.learning_language_code='ms'
    and q.translation_language_code=v_bank_translation
    and q.question_type='knowledge'
    and q.answer_language_code='ms'
    and q.learning_objective_id is not null;

  if coalesce(v_b,0)+coalesce(v_i,0)+coalesce(v_a,0)=0 then
    raise exception 'Malay Quiz curriculum is not approved for release'
      using errcode='42501',detail='learning_course_not_supported';
  end if;

  select
    count(*) filter(where q.difficulty='beginner')::integer,
    count(*) filter(where q.difficulty='intermediate')::integer,
    count(*) filter(where q.difficulty='advanced')::integer
  into v_rb,v_ri,v_ra
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active
   and c.topic_id=q.topic_id
  where q.status='approved'
    and q.learning_language_code='ms'
    and q.translation_language_code=v_bank_translation
    and q.question_type='knowledge'
    and q.answer_language_code='ms'
    and q.learning_objective_id is not null
    and not exists(
      select 1 from private.quiz_daily_question_reservations r
      where r.user_id=v_user and r.local_date=v_day
        and r.question_id=q.question_id
    );

  v_min_b := v_b>=30 and v_tb>=3;
  v_min_i := v_i>=24 and v_ti>=3 and v_b>=16 and v_tb>=3;
  v_min_a := v_a>=32 and v_ta>=3 and v_i>=8 and v_ti>=3 and v_b>=8 and v_tb>=3;

  if (p_difficulty='beginner' and (not v_min_b or v_rb<10))
     or (p_difficulty='intermediate' and (not v_min_i or v_ri<12 or v_rb<3))
     or (p_difficulty='advanced' and
         (not v_min_a or v_ra<12 or v_ri<6 or v_rb<2
          or v_ta<3 or v_ti<3 or v_tb<3)) then
    raise exception 'Malay Quiz bank is below the release minimum or fresh questions are unavailable'
      using errcode='P0001',detail='question_bank_below_minimum_or_fresh_questions_unavailable';
  end if;

  if p_difficulty='beginner' then
    v_question_count:=10;
  elsif p_difficulty='intermediate' then
    v_question_count:=15;
  else
    v_question_count:=20;
  end if;
  v_topic_cap:=pg_catalog.ceil(v_question_count*0.40)::integer;

  if p_difficulty='beginner' then
    v_source:='beginner';v_needed:=10;v_added:=0;
    for v_q in
      select * from (
        select distinct on(q.question_id) q.*
        from private.quiz_question_bank q
        join private.learning_content_catalog c
          on c.activity_type='permanent_lesson'
         and c.content_id=q.source_lesson_id
         and c.language_code=q.learning_language_code
         and c.is_active and c.topic_id=q.topic_id
        where q.status='approved'
          and q.learning_language_code='ms'
          and q.translation_language_code=v_bank_translation
          and q.answer_language_code='ms'
          and q.question_type='knowledge'
          and q.difficulty=v_source
          and q.learning_objective_id is not null
          and not exists(
            select 1 from private.quiz_daily_question_reservations r
            where r.user_id=v_user and r.local_date=v_day
              and r.question_id=q.question_id
          )
        order by q.question_id,q.revision desc
      ) approved_questions
      order by pg_catalog.random()
    loop
      v_topic_count:=coalesce((v_topic_counts->>v_q.topic_id)::integer,0);
      if v_topic_count<v_topic_cap then
        v_selected_ids:=array_append(v_selected_ids,v_q.question_id);
        v_selected_revisions:=array_append(v_selected_revisions,v_q.revision);
        v_topic_counts:=pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
          pg_catalog.to_jsonb(v_topic_count+1),true);
        v_added:=v_added+1;
        exit when v_added=v_needed;
      end if;
    end loop;
    if v_added<>v_needed then
      raise exception 'Fresh Malay Beginner questions unavailable'
        using errcode='P0001',detail='fresh_questions_unavailable_today';
    end if;
  elsif p_difficulty='intermediate' then
    for v_group in
      select * from (values('intermediate',12),('beginner',3)) as t(source,needed)
    loop
      v_source:=v_group.source;v_needed:=v_group.needed;v_added:=0;
      for v_q in
        select * from (
          select distinct on(q.question_id) q.*
          from private.quiz_question_bank q
          join private.learning_content_catalog c
            on c.activity_type='permanent_lesson'
           and c.content_id=q.source_lesson_id
           and c.language_code=q.learning_language_code
           and c.is_active and c.topic_id=q.topic_id
          where q.status='approved'
            and q.learning_language_code='ms'
            and q.translation_language_code=v_bank_translation
            and q.answer_language_code='ms'
            and q.question_type='knowledge'
            and q.difficulty=v_source
            and q.learning_objective_id is not null
            and not exists(
              select 1 from private.quiz_daily_question_reservations r
              where r.user_id=v_user and r.local_date=v_day
                and r.question_id=q.question_id
            )
          order by q.question_id,q.revision desc
        ) approved_questions
        order by pg_catalog.random()
      loop
        v_topic_count:=coalesce((v_topic_counts->>v_q.topic_id)::integer,0);
        if v_topic_count<v_topic_cap then
          v_selected_ids:=array_append(v_selected_ids,v_q.question_id);
          v_selected_revisions:=array_append(v_selected_revisions,v_q.revision);
          v_topic_counts:=pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
            pg_catalog.to_jsonb(v_topic_count+1),true);
          v_added:=v_added+1;
          exit when v_added=v_needed;
        end if;
      end loop;
      if v_added<v_needed then
        raise exception 'Fresh Malay Intermediate questions unavailable'
          using errcode='P0001',detail='fresh_questions_unavailable_today';
      end if;
    end loop;
  else
    for v_group in
      select * from (values('advanced',12),('intermediate',6),('beginner',2)) as t(source,needed)
    loop
      v_source:=v_group.source;v_needed:=v_group.needed;v_added:=0;
      for v_q in
        select * from (
          select distinct on(q.question_id) q.*
          from private.quiz_question_bank q
          join private.learning_content_catalog c
            on c.activity_type='permanent_lesson'
           and c.content_id=q.source_lesson_id
           and c.language_code=q.learning_language_code
           and c.is_active and c.topic_id=q.topic_id
          where q.status='approved'
            and q.learning_language_code='ms'
            and q.translation_language_code=v_bank_translation
            and q.answer_language_code='ms'
            and q.question_type='knowledge'
            and q.difficulty=v_source
            and q.learning_objective_id is not null
            and not exists(
              select 1 from private.quiz_daily_question_reservations r
              where r.user_id=v_user and r.local_date=v_day
                and r.question_id=q.question_id
            )
          order by q.question_id,q.revision desc
        ) approved_questions
        order by pg_catalog.random()
      loop
        v_topic_count:=coalesce((v_topic_counts->>v_q.topic_id)::integer,0);
        if v_topic_count<v_topic_cap then
          v_selected_ids:=array_append(v_selected_ids,v_q.question_id);
          v_selected_revisions:=array_append(v_selected_revisions,v_q.revision);
          v_topic_counts:=pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
            pg_catalog.to_jsonb(v_topic_count+1),true);
          v_added:=v_added+1;
          exit when v_added=v_needed;
        end if;
      end loop;
      if v_added<v_needed then
        raise exception 'Fresh Malay Advanced questions unavailable'
          using errcode='P0001',detail='fresh_questions_unavailable_today';
      end if;
    end loop;
  end if;

  if pg_catalog.cardinality(v_selected_ids)<>v_question_count
     or (select pg_catalog.count(*) from pg_catalog.jsonb_object_keys(v_topic_counts))<3 then
    raise exception 'Malay Quiz selection did not meet its topic-diversity target'
      using errcode='P0001',detail='topic_diversity_not_met';
  end if;

  select
    pg_catalog.array_agg(shuffled.question_id order by shuffled.position),
    pg_catalog.array_agg(shuffled.revision order by shuffled.position)
  into v_selected_ids,v_selected_revisions
  from (
    select selected.question_id,selected.revision,
      pg_catalog.row_number() over(order by pg_catalog.random()) as position
    from unnest(v_selected_ids,v_selected_revisions)
      as selected(question_id,revision)
  ) shuffled;

  select
    count(*) filter(where q.difficulty='beginner')::integer,
    count(*) filter(where q.difficulty='intermediate')::integer,
    count(*) filter(where q.difficulty='advanced')::integer
  into v_selected_b,v_selected_i,v_selected_a
  from unnest(v_selected_ids,v_selected_revisions)
    as selected(question_id,revision)
  join private.quiz_question_bank q
    on q.question_id=selected.question_id and q.revision=selected.revision;

  v_composition:=pg_catalog.jsonb_build_object(
    'beginner',v_selected_b,'intermediate',v_selected_i,'advanced',v_selected_a
  );

  insert into private.quiz_sessions(
    user_id,difficulty,learning_language_code,translation_language_code,
    question_count,source_composition,local_date,timezone
  )
  values(
    v_user,p_difficulty,'ms',v_bank_translation,
    v_question_count,v_composition,v_day,v_timezone
  )
  returning id into v_session;

  for v_position in 1..v_question_count loop
    select * into v_q
    from private.quiz_question_bank q
    where q.question_id=v_selected_ids[v_position]
      and q.revision=v_selected_revisions[v_position];

    select pg_catalog.array_agg(o.value->>'id' order by pg_catalog.random())
      into v_order
    from pg_catalog.jsonb_array_elements(v_q.options) as o(value);

    insert into private.quiz_session_questions(
      session_id,user_id,local_date,question_id,question_revision,position,option_order,
      prompt_learning_snapshot,prompt_translation_snapshot,prompt_pinyin_snapshot,
      options_snapshot,correct_option_id_snapshot,explanation_learning_snapshot,
      explanation_translation_snapshot,explanation_pinyin_snapshot,
      source_lesson_id,topic_id,source_difficulty,question_type_snapshot,
      answer_language_code_snapshot,learning_language_code_snapshot,learning_objective_id_snapshot
    )
    values(
      v_session,v_user,v_day,v_q.question_id,v_q.revision,v_position,v_order,
      v_q.prompt_learning,v_q.prompt_translation,v_q.prompt_pinyin,
      v_q.options,v_q.correct_option_id,v_q.explanation_learning,
      v_q.explanation_translation,v_q.explanation_pinyin,
      v_q.source_lesson_id,v_q.topic_id,v_q.difficulty,v_q.question_type,
      v_q.answer_language_code,'ms',v_q.learning_objective_id
    );
  end loop;

  insert into private.quiz_daily_question_reservations(user_id,local_date,question_id)
  select v_user,v_day,x
  from unnest(v_selected_ids) as x
  on conflict(user_id,local_date,question_id) do nothing;

  return private.quiz_session_payload(v_session,false);
end;
$function$;

revoke all on function private.start_my_malay_quiz_impl(text,text,text)
  from public,anon,authenticated;
grant execute on function private.start_my_malay_quiz_impl(text,text,text)
  to authenticated;

create or replace function public.get_my_quiz_availability()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare v_learning text;
begin
  select p.learning_language into v_learning
  from public.user_preferences p
  where p.user_id=auth.uid();

  if v_learning='zh' then
    return private.get_my_chinese_quiz_availability_impl();
  elsif v_learning='ms' then
    return private.get_my_malay_quiz_availability_impl();
  end if;
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
  select p.learning_language,p.translation_language
    into v_learning,v_translation
  from public.user_preferences p
  where p.user_id=auth.uid();

  if v_learning='zh' then
    return private.start_my_chinese_quiz_impl(p_difficulty,'zh',v_translation);
  elsif v_learning='ms' then
    return private.start_my_malay_quiz_impl(p_difficulty,'ms',v_translation);
  end if;
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
  select p.learning_language,p.translation_language
    into v_learning,v_translation
  from public.user_preferences p
  where p.user_id=auth.uid();

  if p_learning_language is not null and p_learning_language is distinct from v_learning then
    raise exception 'Requested Quiz course does not match the saved learning course'
      using errcode='42501',detail='learning_course_preference_mismatch';
  end if;
  v_translation:=coalesce(p_translation_language,v_translation);

  if v_learning='zh' then
    return private.start_my_chinese_quiz_impl(p_difficulty,'zh',v_translation);
  elsif v_learning='ms' then
    return private.start_my_malay_quiz_impl(p_difficulty,'ms',v_translation);
  end if;
  return private.start_my_quiz_impl(p_difficulty,v_learning,v_translation);
end;
$function$;
revoke all on function public.start_my_quiz(text,text,text) from public,anon;
grant execute on function public.start_my_quiz(text,text,text) to authenticated;

commit;
