-- Update 2.4.1: use the available Simplified Chinese content pack for the
-- question snapshot regardless of the learner's display translation preference.
-- The preference controls whether Chinese-translation question types are selected.
begin;
create or replace function private.get_my_quiz_availability_impl()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_ctx jsonb := private.quiz_request_context();
  v_user uuid := (v_ctx ->> 'user_id')::uuid;
  v_timezone text := v_ctx ->> 'timezone';
  v_day date := (v_ctx ->> 'local_date')::date;
  v_translation text;
  v_learning text;
  v_active uuid;
  v_b integer := 0;
  v_i integer := 0;
  v_a integer := 0;
  v_rb integer := 0;
  v_ri integer := 0;
  v_ra integer := 0;
  v_beginner_topics integer := 0;
  v_intermediate_topics integer := 0;
  v_advanced_topics integer := 0;
  v_def_b integer := 0; v_def_i integer := 0; v_def_a integer := 0;
  v_zh_b integer := 0; v_zh_i integer := 0; v_zh_a integer := 0;
  v_unseen_def integer := 0; v_unseen_zh integer := 0;
  v_beginner_min boolean;
  v_intermediate_min boolean;
  v_advanced_min boolean;
  v_beginner_target boolean;
  v_intermediate_target boolean;
  v_advanced_target boolean;
  v_beginner_fresh boolean;
  v_intermediate_fresh boolean;
  v_advanced_fresh boolean;
  v_can_start boolean;
begin
  select p.learning_language,p.translation_language
    into v_learning,v_translation
  from public.user_preferences p where p.user_id = v_user;

  select s.id into v_active
  from private.quiz_sessions s
  where s.user_id = v_user and s.status = 'in_progress';

  select
    count(*) filter (where q.difficulty = 'beginner' and q.question_type='knowledge')::integer,
    count(*) filter (where q.difficulty = 'intermediate' and q.question_type='knowledge')::integer,
    count(*) filter (where q.difficulty = 'advanced' and q.question_type='knowledge')::integer
  into v_b, v_i, v_a
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type = 'permanent_lesson'
   and c.content_id = q.source_lesson_id
   and c.language_code = q.learning_language_code
   and c.is_active
   and c.topic_id = q.topic_id
  where q.status = 'approved'
    and q.learning_language_code = 'en'
    and v_learning = 'en'
    and q.translation_language_code = 'zh'
    and q.learning_objective_id is not null;

  select
    count(*) filter (where q.question_type='word_definition' and q.difficulty='beginner')::integer,
    count(*) filter (where q.question_type='word_definition' and q.difficulty='intermediate')::integer,
    count(*) filter (where q.question_type='word_definition' and q.difficulty='advanced')::integer,
    count(*) filter (where q.question_type='chinese_translation' and q.difficulty='beginner')::integer,
    count(*) filter (where q.question_type='chinese_translation' and q.difficulty='intermediate')::integer,
    count(*) filter (where q.question_type='chinese_translation' and q.difficulty='advanced')::integer
  into v_def_b,v_def_i,v_def_a,v_zh_b,v_zh_i,v_zh_a
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active and c.topic_id=q.topic_id
  where q.status='approved'
    and q.learning_language_code='en'
    and v_learning='en'
    and q.translation_language_code = 'zh'
    and q.learning_objective_id is not null;

  select count(*) filter (where q.question_type='word_definition')::integer,
         count(*) filter (where q.question_type='chinese_translation' and q.answer_language_code='zh')::integer
  into v_unseen_def,v_unseen_zh
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active and c.topic_id=q.topic_id
  where q.status='approved'
    and q.learning_language_code='en'
    and v_learning='en'
    and q.translation_language_code = 'zh'
    and q.learning_objective_id is not null
    and not exists (
      select 1 from private.quiz_daily_question_reservations issued
      where issued.user_id=v_user and issued.local_date=v_day
        and issued.question_id=q.question_id
    );

  select
    count(*) filter (where q.difficulty = 'beginner')::integer,
    count(*) filter (where q.difficulty = 'intermediate')::integer,
    count(*) filter (where q.difficulty = 'advanced')::integer,
    count(distinct q.topic_id) filter (where q.difficulty = 'beginner')::integer,
    count(distinct q.topic_id) filter (where q.difficulty in ('beginner','intermediate'))::integer,
    count(distinct q.topic_id)::integer
  into v_rb, v_ri, v_ra, v_beginner_topics, v_intermediate_topics, v_advanced_topics
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type = 'permanent_lesson'
   and c.content_id = q.source_lesson_id
   and c.language_code = q.learning_language_code
   and c.is_active
   and c.topic_id = q.topic_id
  where q.status = 'approved'
    and q.learning_language_code = 'en'
    and v_learning = 'en'
    and q.translation_language_code = 'zh'
    and q.question_type='knowledge'
    and q.learning_objective_id is not null
    and not exists (
      select 1 from private.quiz_daily_question_reservations issued
      where issued.user_id = v_user
        and issued.local_date = v_day
        and issued.question_id = q.question_id
    );

  v_beginner_min := v_learning='en' and v_b>=20 and v_def_b>=2
    and (v_translation<>'zh' or v_zh_b>=14);
  v_intermediate_min := v_learning='en' and v_i>=24 and v_b>=16
    and v_def_b+v_def_i>=2
    and (v_translation<>'zh' or v_zh_b+v_zh_i>=14);
  v_advanced_min := v_learning='en' and v_a>=32 and v_i>=8 and v_b>=8
    and v_def_b+v_def_i+v_def_a>=2
    and (v_translation<>'zh' or v_zh_b+v_zh_i+v_zh_a>=14);
  v_beginner_target := v_learning='en' and v_b>=30 and v_def_b>=3
    and (v_translation<>'zh' or v_zh_b>=21);
  v_intermediate_target := v_learning='en' and v_i>=36 and v_b>=24
    and v_def_b+v_def_i>=3
    and (v_translation<>'zh' or v_zh_b+v_zh_i>=21);
  v_advanced_target := v_learning='en' and v_a>=48 and v_i>=12 and v_b>=12
    and v_def_b+v_def_i+v_def_a>=3
    and (v_translation<>'zh' or v_zh_b+v_zh_i+v_zh_a>=21);

  v_beginner_fresh := v_rb >= 10 and v_beginner_topics >= 3 and v_unseen_def>=1 and (v_translation<>'zh' or v_unseen_zh>=7);
  v_intermediate_fresh := v_intermediate_topics >= 3 and v_unseen_def>=1 and (v_translation<>'zh' or v_unseen_zh>=1) and (
       (v_ri >= 12 and v_rb >= 3)
    or (v_ri >= 8 and v_rb >= 7)
    or (v_ri >= 7 and v_rb >= 8)
  );
  v_advanced_fresh := v_advanced_topics >= 3 and v_ri >= 4 and v_unseen_def>=1 and (v_translation<>'zh' or v_unseen_zh>=1) and (
       (v_ra >= 16)
    or (v_ra >= 15 and v_rb >= 1)
    or (v_ra >= 14 and v_rb >= 2)
    or (v_ra >= 13 and v_rb >= 3)
    or (v_ra >= 12 and v_rb >= 4)
  );

  v_can_start := coalesce((v_ctx ->> 'plan_enabled')::boolean,false)
                 and (v_ctx ->> 'remaining_count')::integer > 0
                 and v_active is null;

  return pg_catalog.jsonb_build_object(
    'timezone', v_timezone,
    'local_date', v_day,
    'plan_code', v_ctx ->> 'plan_code',
    'allowance', pg_catalog.jsonb_build_object(
      'daily_limit', (v_ctx ->> 'daily_limit')::integer,
      'used_count', (v_ctx ->> 'used_count')::integer,
      'remaining_count', (v_ctx ->> 'remaining_count')::integer
    ),
    'active_session_id', v_active,
    'difficulties', pg_catalog.jsonb_build_array(
      pg_catalog.jsonb_build_object(
        'difficulty', 'beginner',
        'question_count', 10,
        'bank_minimum_met', v_beginner_min,
        'bank_target_met', v_beginner_target,
        'bank_counts', pg_catalog.jsonb_build_object('beginner',v_b,'word_definition',v_def_b,'chinese_translation',v_zh_b),
        'remaining_counts', pg_catalog.jsonb_build_object('beginner',v_rb),
        'available', v_beginner_min and v_beginner_fresh and v_can_start,
        'reason', case
          when v_active is not null then 'active_session_exists'
          when v_learning is distinct from 'en' then 'learning_course_not_supported'
          when not coalesce((v_ctx ->> 'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when (v_ctx ->> 'remaining_count')::integer < 1 then 'allowance_exhausted'
          when not v_beginner_min then 'question_bank_below_minimum'
          when not v_beginner_fresh then 'fresh_questions_unavailable_today'
          else null end
      ),
      pg_catalog.jsonb_build_object(
        'difficulty', 'intermediate',
        'question_count', 15,
        'bank_minimum_met', v_intermediate_min,
        'bank_target_met', v_intermediate_target,
        'bank_counts', pg_catalog.jsonb_build_object('beginner',v_b,'intermediate',v_i,'word_definition',v_def_b+v_def_i,'chinese_translation',v_zh_b+v_zh_i),
        'remaining_counts', pg_catalog.jsonb_build_object('beginner',v_rb,'intermediate',v_ri),
        'available', v_intermediate_min and v_intermediate_fresh and v_can_start,
        'reason', case
          when v_active is not null then 'active_session_exists'
          when v_learning is distinct from 'en' then 'learning_course_not_supported'
          when not coalesce((v_ctx ->> 'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when (v_ctx ->> 'remaining_count')::integer < 1 then 'allowance_exhausted'
          when not v_intermediate_min then 'question_bank_below_minimum'
          when not v_intermediate_fresh then 'fresh_questions_unavailable_today'
          else null end
      ),
      pg_catalog.jsonb_build_object(
        'difficulty', 'advanced',
        'question_count', 20,
        'bank_minimum_met', v_advanced_min,
        'bank_target_met', v_advanced_target,
        'bank_counts', pg_catalog.jsonb_build_object('beginner',v_b,'intermediate',v_i,'advanced',v_a,'word_definition',v_def_b+v_def_i+v_def_a,'chinese_translation',v_zh_b+v_zh_i+v_zh_a),
        'remaining_counts', pg_catalog.jsonb_build_object('beginner',v_rb,'intermediate',v_ri,'advanced',v_ra),
        'available', v_advanced_min and v_advanced_fresh and v_can_start,
        'reason', case
          when v_active is not null then 'active_session_exists'
          when v_learning is distinct from 'en' then 'learning_course_not_supported'
          when not coalesce((v_ctx ->> 'plan_enabled')::boolean,false) then 'plan_not_enabled'
          when (v_ctx ->> 'remaining_count')::integer < 1 then 'allowance_exhausted'
          when not v_advanced_min then 'question_bank_below_minimum'
          when not v_advanced_fresh then 'fresh_questions_unavailable_today'
          else null end
      )
    )
  );
end;
$function$;


create or replace function private.start_my_quiz_impl(p_difficulty text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_ctx jsonb;
  v_user uuid;
  v_timezone text;
  v_day date;
  v_translation text;
  v_learning text;
  v_active uuid;
  v_question_count integer;
  v_b integer := 0;
  v_i integer := 0;
  v_a integer := 0;
  v_unseen_b integer := 0;
  v_unseen_i integer := 0;
  v_unseen_a integer := 0;
  v_comp jsonb;
  v_topic_counts jsonb := '{}'::jsonb;
  v_selected_ids text[] := '{}'::text[];
  v_selected_revisions integer[] := '{}'::integer[];
  v_source_selected jsonb := '{}'::jsonb;
  v_translation_needed integer := 0;
  v_translation_added integer := 0;
  v_topic_cap integer;
  v_added integer;
  v_needed integer;
  v_source text;
  v_q record;
  v_topic_count integer;
  v_topic_total integer;
  v_session uuid;
begin
  v_user := auth.uid();
  if v_user is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_difficulty is null or p_difficulty not in ('beginner','intermediate','advanced') then
    raise exception 'Invalid Quiz difficulty' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text, 0));
  v_ctx := private.quiz_request_context();
  v_timezone := v_ctx ->> 'timezone';
  v_day := (v_ctx ->> 'local_date')::date;

  select p.learning_language,p.translation_language
    into v_learning,v_translation
  from public.user_preferences p where p.user_id = v_user;

  if v_learning is distinct from 'en' then
    raise exception 'Quiz currently supports the English learning course only'
      using errcode='42501', detail='learning_course_not_supported';
  end if;

  select s.id into v_active
  from private.quiz_sessions s
  where s.user_id = v_user and s.status = 'in_progress';

  if v_active is not null then
    return pg_catalog.jsonb_build_object(
      'status','active_session_exists',
      'session',private.quiz_session_payload(v_active,false)
    );
  end if;

  if not coalesce((v_ctx ->> 'plan_enabled')::boolean,false) then
    raise exception 'Quiz is currently unavailable for this plan'
      using errcode='42501',detail='plan_not_enabled';
  end if;

  if (v_ctx ->> 'remaining_count')::integer < 1 then
    raise exception 'Daily Quiz completion allowance exhausted'
      using errcode = 'P0001',
            detail = pg_catalog.jsonb_build_object(
              'activity_type','quiz',
              'daily_limit',(v_ctx ->> 'daily_limit')::integer,
              'used',(v_ctx ->> 'used_count')::integer,
              'timezone',v_timezone
            )::text;
  end if;

  select
    count(*) filter (where q.difficulty = 'beginner')::integer,
    count(*) filter (where q.difficulty = 'intermediate')::integer,
    count(*) filter (where q.difficulty = 'advanced')::integer
  into v_b,v_i,v_a
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active
   and c.topic_id = q.topic_id
  where q.status='approved'
    and q.learning_language_code='en'
    and q.translation_language_code = 'zh';

  select
    count(*) filter (where q.difficulty='beginner')::integer,
    count(*) filter (where q.difficulty='intermediate')::integer,
    count(*) filter (where q.difficulty='advanced')::integer
  into v_unseen_b,v_unseen_i,v_unseen_a
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active
   and c.topic_id = q.topic_id
  where q.status='approved'
    and q.learning_language_code='en'
    and q.translation_language_code = 'zh'
    and not exists (
      select 1 from private.quiz_daily_question_reservations issued
      where issued.user_id=v_user and issued.local_date=v_day
        and issued.question_id=q.question_id
    );

  if p_difficulty='beginner' then
    v_question_count := 10;
    if v_b < 20 then
      raise exception 'Beginner Quiz question bank is below the two-session minimum'
        using errcode='P0001', detail='question_bank_below_minimum';
    end if;
    if v_unseen_b < 10 then
      raise exception 'Not enough unseen Beginner questions remain for a complete Quiz'
        using errcode='P0001',detail='fresh_questions_unavailable_today';
    end if;
    v_comp := '{"beginner":10}'::jsonb;
  elsif p_difficulty='intermediate' then
    v_question_count := 15;
    if v_i < 24 or v_b < 16 then
      raise exception 'Intermediate Quiz question bank is below the two-session minimum'
        using errcode='P0001', detail='question_bank_below_minimum';
    end if;
    select choice.composition into v_comp
    from (
      values
        ('{"beginner":3,"intermediate":12}'::jsonb,v_unseen_i>=12 and v_unseen_b>=3),
        ('{"beginner":7,"intermediate":8}'::jsonb,v_unseen_i>=8 and v_unseen_b>=7),
        ('{"beginner":8,"intermediate":7}'::jsonb,v_unseen_i>=7 and v_unseen_b>=8)
    ) as choice(composition,is_feasible)
    where choice.is_feasible
    order by pg_catalog.random()
    limit 1;
    if v_comp is null then
      raise exception 'Not enough unseen questions remain for an approved Intermediate composition'
        using errcode='P0001',detail='fresh_questions_unavailable_today';
    end if;
  else
    v_question_count := 20;
    if v_a < 32 or v_i < 8 or v_b < 8 then
      raise exception 'Advanced Quiz question bank is below the two-session minimum'
        using errcode='P0001', detail='question_bank_below_minimum';
    end if;
    select pg_catalog.jsonb_build_object(
      'beginner',choices.beginner_count,
      'intermediate',4,
      'advanced',16-choices.beginner_count
    ) into v_comp
    from pg_catalog.generate_series(0,4) as choices(beginner_count)
    where v_unseen_b>=choices.beginner_count
      and v_unseen_i>=4
      and v_unseen_a>=16-choices.beginner_count
    order by pg_catalog.random()
    limit 1;
    if v_comp is null then
      raise exception 'Not enough unseen questions remain for an approved Advanced composition'
        using errcode='P0001',detail='fresh_questions_unavailable_today';
    end if;
  end if;

  -- Count currently unseen inventory for the exact selected composition.
  for v_source in select unnest(array['beginner','intermediate','advanced'])
  loop
    v_needed := coalesce((v_comp ->> v_source)::integer,0);
    if v_needed > 0 then
      select count(*)::integer into v_added
      from private.quiz_question_bank q
      join private.learning_content_catalog c
        on c.activity_type='permanent_lesson'
       and c.content_id=q.source_lesson_id
       and c.language_code=q.learning_language_code
       and c.is_active
   and c.topic_id = q.topic_id
      where q.status='approved'
        and q.learning_language_code='en'
        and q.translation_language_code = 'zh'
        and q.difficulty=v_source
        and not exists (
          select 1 from private.quiz_daily_question_reservations issued
          where issued.user_id=v_user and issued.local_date=v_day
            and issued.question_id=q.question_id
        );
      if v_added < v_needed then
        raise exception 'Not enough unseen questions remain for a complete Quiz today'
          using errcode='P0001', detail='fresh_questions_unavailable_today';
      end if;
    end if;
  end loop;

  v_topic_cap := floor(v_question_count*0.40)::integer;
  -- Keep the Chinese integration count stable for this account, local day and
  -- selected difficulty. English translation preference uses no Chinese items.
  if v_translation = 'zh' then
    v_translation_needed := 1 + pg_catalog.mod(
      (pg_catalog.hashtextextended(
        v_user::text || '|' || v_day::text || '|' || p_difficulty, 0
      ) & 9223372036854775807),
      7
    )::integer;
  end if;

  -- Every authenticated session includes exactly one lesson-aligned definition.
  for v_q in
    select q.question_id,q.revision,q.topic_id,q.difficulty
    from private.quiz_question_bank q
    join private.learning_content_catalog c
      on c.activity_type='permanent_lesson'
     and c.content_id=q.source_lesson_id
     and c.language_code=q.learning_language_code
     and c.is_active and c.topic_id=q.topic_id
    where q.status='approved'
      and q.learning_language_code='en'
      and q.translation_language_code = 'zh'
      and q.question_type='word_definition'
      and q.learning_objective_id is not null
      and coalesce((v_comp ->> q.difficulty)::integer,0) >
          coalesce((v_source_selected ->> q.difficulty)::integer,0)
      and not exists (
        select 1 from private.quiz_daily_question_reservations issued
        where issued.user_id=v_user and issued.local_date=v_day
          and issued.question_id=q.question_id
      )
    order by pg_catalog.random()
  loop
    v_topic_count := coalesce((v_topic_counts ->> v_q.topic_id)::integer,0);
    if v_topic_count < v_topic_cap then
      v_selected_ids := pg_catalog.array_append(v_selected_ids,v_q.question_id);
      v_selected_revisions := pg_catalog.array_append(v_selected_revisions,v_q.revision);
      v_topic_counts := pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
        pg_catalog.to_jsonb(v_topic_count+1),true);
      v_source_selected := pg_catalog.jsonb_set(v_source_selected,array[v_q.difficulty],
        pg_catalog.to_jsonb(coalesce((v_source_selected ->> v_q.difficulty)::integer,0)+1),true);
      exit;
    end if;
  end loop;
  if coalesce(pg_catalog.cardinality(v_selected_ids),0) <> 1 then
    raise exception 'No eligible lesson-aligned word-definition question is available'
      using errcode='P0001',detail='question_type_inventory_unavailable';
  end if;

  -- Chinese-translation questions are included only for English learning with
  -- Simplified Chinese selected. They replace knowledge slots; session length
  -- and source-difficulty composition remain unchanged.
  if v_translation_needed > 0 then
    for v_q in
      select q.question_id,q.revision,q.topic_id,q.difficulty
      from private.quiz_question_bank q
      join private.learning_content_catalog c
        on c.activity_type='permanent_lesson'
       and c.content_id=q.source_lesson_id
       and c.language_code=q.learning_language_code
       and c.is_active and c.topic_id=q.topic_id
      where q.status='approved'
        and q.learning_language_code='en'
        and q.translation_language_code = 'zh'
        and q.question_type='chinese_translation'
        and q.learning_objective_id is not null
        and q.answer_language_code='zh'
        and coalesce((v_comp ->> q.difficulty)::integer,0) >
            coalesce((v_source_selected ->> q.difficulty)::integer,0)
        and not exists (
          select 1 from private.quiz_daily_question_reservations issued
          where issued.user_id=v_user and issued.local_date=v_day
            and issued.question_id=q.question_id
        )
      order by pg_catalog.random()
    loop
      v_topic_count := coalesce((v_topic_counts ->> v_q.topic_id)::integer,0);
      if v_topic_count < v_topic_cap then
        v_selected_ids := pg_catalog.array_append(v_selected_ids,v_q.question_id);
        v_selected_revisions := pg_catalog.array_append(v_selected_revisions,v_q.revision);
        v_topic_counts := pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
          pg_catalog.to_jsonb(v_topic_count+1),true);
        v_source_selected := pg_catalog.jsonb_set(v_source_selected,array[v_q.difficulty],
          pg_catalog.to_jsonb(coalesce((v_source_selected ->> v_q.difficulty)::integer,0)+1),true);
        v_translation_added := v_translation_added+1;
        exit when v_translation_added >= v_translation_needed;
      end if;
    end loop;
    if v_translation_added <> v_translation_needed then
      raise exception 'Not enough eligible unseen Chinese-translation questions remain'
        using errcode='P0001',detail='question_type_inventory_unavailable';
    end if;
  end if;

  -- Fill every remaining source-difficulty slot with knowledge questions.
  for v_source in select unnest(array['beginner','intermediate','advanced'])
  loop
    v_needed := coalesce((v_comp ->> v_source)::integer,0)
      - coalesce((v_source_selected ->> v_source)::integer,0);
    v_added := 0;
    if v_needed > 0 then
      for v_q in
        select q.question_id,q.revision,q.topic_id,q.difficulty
        from private.quiz_question_bank q
        join private.learning_content_catalog c
          on c.activity_type='permanent_lesson'
         and c.content_id=q.source_lesson_id
         and c.language_code=q.learning_language_code
         and c.is_active and c.topic_id=q.topic_id
        where q.status='approved'
          and q.learning_language_code='en'
          and q.translation_language_code = 'zh'
          and q.difficulty=v_source
          and q.question_type='knowledge'
          and q.learning_objective_id is not null
          and not exists (
            select 1 from private.quiz_daily_question_reservations issued
            where issued.user_id=v_user and issued.local_date=v_day
              and issued.question_id=q.question_id
          )
        order by pg_catalog.random()
      loop
        v_topic_count := coalesce((v_topic_counts ->> v_q.topic_id)::integer,0);
        if v_topic_count < v_topic_cap then
          v_selected_ids := pg_catalog.array_append(v_selected_ids,v_q.question_id);
          v_selected_revisions := pg_catalog.array_append(v_selected_revisions,v_q.revision);
          v_topic_counts := pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
            pg_catalog.to_jsonb(v_topic_count+1),true);
          v_source_selected := pg_catalog.jsonb_set(v_source_selected,array[v_q.difficulty],
            pg_catalog.to_jsonb(coalesce((v_source_selected ->> v_q.difficulty)::integer,0)+1),true);
          v_added := v_added+1;
          exit when v_added >= v_needed;
        end if;
      end loop;
      if v_added < v_needed then
        raise exception 'Question pool cannot satisfy source composition and topic diversity'
          using errcode='P0001',detail='topic_coverage_unavailable';
      end if;
    end if;
  end loop;

  select coalesce(pg_catalog.sum((value #>> '{}')::integer),0)::integer,
         pg_catalog.count(*)::integer
  into v_topic_total,v_topic_count
  from pg_catalog.jsonb_each(v_topic_counts);

  if v_topic_total <> v_question_count or v_topic_count < 3 then
    raise exception 'Quiz requires at least three distinct topics'
      using errcode='P0001', detail='topic_coverage_unavailable';
  end if;

  insert into private.quiz_sessions(
    user_id,difficulty,learning_language_code,translation_language_code,
    question_count,source_composition,local_date,timezone,status
  ) values (
    v_user,p_difficulty,'en',v_translation,v_question_count,v_comp,v_day,v_timezone,'in_progress'
  ) returning id into v_session;

  insert into private.quiz_daily_question_reservations(user_id,local_date,question_id)
  select v_user,v_day,picked.question_id
  from pg_catalog.unnest(v_selected_ids) as picked(question_id);

  with selected as (
    select q.*,
      pg_catalog.row_number() over(order by pg_catalog.random())::integer as new_position,
      array(
        select o.value ->> 'id'
        from pg_catalog.jsonb_array_elements(q.options) as o(value)
        order by pg_catalog.random()
      ) as shuffled_options
    from pg_catalog.generate_subscripts(v_selected_ids,1) as picked(idx)
    join private.quiz_question_bank q
      on q.question_id=v_selected_ids[picked.idx]
     and q.revision=v_selected_revisions[picked.idx]
  )
  insert into private.quiz_session_questions(
    session_id,user_id,local_date,question_id,question_revision,position,
    source_lesson_id,topic_id,source_difficulty,question_type_snapshot,answer_language_code_snapshot,learning_objective_id_snapshot,option_order,
    prompt_learning_snapshot,prompt_translation_snapshot,
    options_snapshot,correct_option_id_snapshot,
    explanation_learning_snapshot,explanation_translation_snapshot
  )
  select
    v_session,v_user,v_day,s.question_id,s.revision,s.new_position,
    s.source_lesson_id,s.topic_id,s.difficulty,s.question_type,s.answer_language_code,s.learning_objective_id,s.shuffled_options,
    s.prompt_learning,s.prompt_translation,s.options,
    s.correct_option_id,s.explanation_learning,s.explanation_translation
  from selected s;

  return private.quiz_session_payload(v_session,false);
end;
$function$;


create or replace function private.start_my_quiz_impl(p_difficulty text, p_learning_language text, p_translation_language text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_ctx jsonb;
  v_user uuid;
  v_timezone text;
  v_day date;
  v_translation text;
  v_learning text;
  v_active uuid;
  v_question_count integer;
  v_b integer := 0;
  v_i integer := 0;
  v_a integer := 0;
  v_unseen_b integer := 0;
  v_unseen_i integer := 0;
  v_unseen_a integer := 0;
  v_comp jsonb;
  v_topic_counts jsonb := '{}'::jsonb;
  v_selected_ids text[] := '{}'::text[];
  v_selected_revisions integer[] := '{}'::integer[];
  v_source_selected jsonb := '{}'::jsonb;
  v_translation_needed integer := 0;
  v_translation_added integer := 0;
  v_topic_cap integer;
  v_added integer;
  v_needed integer;
  v_source text;
  v_q record;
  v_topic_count integer;
  v_topic_total integer;
  v_session uuid;
begin
  v_user := auth.uid();
  if v_user is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_difficulty is null or p_difficulty not in ('beginner','intermediate','advanced') then
    raise exception 'Invalid Quiz difficulty' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text, 0));
  v_ctx := private.quiz_request_context();
  v_timezone := v_ctx ->> 'timezone';
  v_day := (v_ctx ->> 'local_date')::date;

  if p_learning_language is not null and p_learning_language not in ('en','zh') then
    raise exception 'Invalid Quiz learning language' using errcode='22023';
  end if;
  if p_translation_language is not null and p_translation_language not in ('en','zh') then
    raise exception 'Invalid Quiz translation language' using errcode='22023';
  end if;

  select coalesce(p_learning_language,p.learning_language),
         coalesce(p_translation_language,p.translation_language)
    into v_learning,v_translation
  from public.user_preferences p where p.user_id = v_user;

  if v_learning is distinct from 'en' then
    raise exception 'Quiz currently supports the English learning course only'
      using errcode='42501', detail='learning_course_not_supported';
  end if;

  select s.id into v_active
  from private.quiz_sessions s
  where s.user_id = v_user and s.status = 'in_progress';

  if v_active is not null then
    return pg_catalog.jsonb_build_object(
      'status','active_session_exists',
      'session',private.quiz_session_payload(v_active,false)
    );
  end if;

  if not coalesce((v_ctx ->> 'plan_enabled')::boolean,false) then
    raise exception 'Quiz is currently unavailable for this plan'
      using errcode='42501',detail='plan_not_enabled';
  end if;

  if (v_ctx ->> 'remaining_count')::integer < 1 then
    raise exception 'Daily Quiz completion allowance exhausted'
      using errcode = 'P0001',
            detail = pg_catalog.jsonb_build_object(
              'activity_type','quiz',
              'daily_limit',(v_ctx ->> 'daily_limit')::integer,
              'used',(v_ctx ->> 'used_count')::integer,
              'timezone',v_timezone
            )::text;
  end if;

  select
    count(*) filter (where q.difficulty = 'beginner')::integer,
    count(*) filter (where q.difficulty = 'intermediate')::integer,
    count(*) filter (where q.difficulty = 'advanced')::integer
  into v_b,v_i,v_a
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active
   and c.topic_id = q.topic_id
  where q.status='approved'
    and q.learning_language_code='en'
    and q.translation_language_code = 'zh';

  select
    count(*) filter (where q.difficulty='beginner')::integer,
    count(*) filter (where q.difficulty='intermediate')::integer,
    count(*) filter (where q.difficulty='advanced')::integer
  into v_unseen_b,v_unseen_i,v_unseen_a
  from private.quiz_question_bank q
  join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.is_active
   and c.topic_id = q.topic_id
  where q.status='approved'
    and q.learning_language_code='en'
    and q.translation_language_code = 'zh'
    and not exists (
      select 1 from private.quiz_daily_question_reservations issued
      where issued.user_id=v_user and issued.local_date=v_day
        and issued.question_id=q.question_id
    );

  if p_difficulty='beginner' then
    v_question_count := 10;
    if v_b < 20 then
      raise exception 'Beginner Quiz question bank is below the two-session minimum'
        using errcode='P0001', detail='question_bank_below_minimum';
    end if;
    if v_unseen_b < 10 then
      raise exception 'Not enough unseen Beginner questions remain for a complete Quiz'
        using errcode='P0001',detail='fresh_questions_unavailable_today';
    end if;
    v_comp := '{"beginner":10}'::jsonb;
  elsif p_difficulty='intermediate' then
    v_question_count := 15;
    if v_i < 24 or v_b < 16 then
      raise exception 'Intermediate Quiz question bank is below the two-session minimum'
        using errcode='P0001', detail='question_bank_below_minimum';
    end if;
    select choice.composition into v_comp
    from (
      values
        ('{"beginner":3,"intermediate":12}'::jsonb,v_unseen_i>=12 and v_unseen_b>=3),
        ('{"beginner":7,"intermediate":8}'::jsonb,v_unseen_i>=8 and v_unseen_b>=7),
        ('{"beginner":8,"intermediate":7}'::jsonb,v_unseen_i>=7 and v_unseen_b>=8)
    ) as choice(composition,is_feasible)
    where choice.is_feasible
    order by pg_catalog.random()
    limit 1;
    if v_comp is null then
      raise exception 'Not enough unseen questions remain for an approved Intermediate composition'
        using errcode='P0001',detail='fresh_questions_unavailable_today';
    end if;
  else
    v_question_count := 20;
    if v_a < 32 or v_i < 8 or v_b < 8 then
      raise exception 'Advanced Quiz question bank is below the two-session minimum'
        using errcode='P0001', detail='question_bank_below_minimum';
    end if;
    select pg_catalog.jsonb_build_object(
      'beginner',choices.beginner_count,
      'intermediate',4,
      'advanced',16-choices.beginner_count
    ) into v_comp
    from pg_catalog.generate_series(0,4) as choices(beginner_count)
    where v_unseen_b>=choices.beginner_count
      and v_unseen_i>=4
      and v_unseen_a>=16-choices.beginner_count
    order by pg_catalog.random()
    limit 1;
    if v_comp is null then
      raise exception 'Not enough unseen questions remain for an approved Advanced composition'
        using errcode='P0001',detail='fresh_questions_unavailable_today';
    end if;
  end if;

  -- Count currently unseen inventory for the exact selected composition.
  for v_source in select unnest(array['beginner','intermediate','advanced'])
  loop
    v_needed := coalesce((v_comp ->> v_source)::integer,0);
    if v_needed > 0 then
      select count(*)::integer into v_added
      from private.quiz_question_bank q
      join private.learning_content_catalog c
        on c.activity_type='permanent_lesson'
       and c.content_id=q.source_lesson_id
       and c.language_code=q.learning_language_code
       and c.is_active
   and c.topic_id = q.topic_id
      where q.status='approved'
        and q.learning_language_code='en'
        and q.translation_language_code = 'zh'
        and q.difficulty=v_source
        and not exists (
          select 1 from private.quiz_daily_question_reservations issued
          where issued.user_id=v_user and issued.local_date=v_day
            and issued.question_id=q.question_id
        );
      if v_added < v_needed then
        raise exception 'Not enough unseen questions remain for a complete Quiz today'
          using errcode='P0001', detail='fresh_questions_unavailable_today';
      end if;
    end if;
  end loop;

  v_topic_cap := floor(v_question_count*0.40)::integer;
  -- Keep the Chinese integration count stable for this account, local day and
  -- selected difficulty. English translation preference uses no Chinese items.
  if v_translation = 'zh' then
    v_translation_needed := 1 + pg_catalog.mod(
      (pg_catalog.hashtextextended(
        v_user::text || '|' || v_day::text || '|' || p_difficulty, 0
      ) & 9223372036854775807),
      7
    )::integer;
  end if;

  -- Every authenticated session includes exactly one lesson-aligned definition.
  for v_q in
    select q.question_id,q.revision,q.topic_id,q.difficulty
    from private.quiz_question_bank q
    join private.learning_content_catalog c
      on c.activity_type='permanent_lesson'
     and c.content_id=q.source_lesson_id
     and c.language_code=q.learning_language_code
     and c.is_active and c.topic_id=q.topic_id
    where q.status='approved'
      and q.learning_language_code='en'
      and q.translation_language_code = 'zh'
      and q.question_type='word_definition'
      and q.learning_objective_id is not null
      and coalesce((v_comp ->> q.difficulty)::integer,0) >
          coalesce((v_source_selected ->> q.difficulty)::integer,0)
      and not exists (
        select 1 from private.quiz_daily_question_reservations issued
        where issued.user_id=v_user and issued.local_date=v_day
          and issued.question_id=q.question_id
      )
    order by pg_catalog.random()
  loop
    v_topic_count := coalesce((v_topic_counts ->> v_q.topic_id)::integer,0);
    if v_topic_count < v_topic_cap then
      v_selected_ids := pg_catalog.array_append(v_selected_ids,v_q.question_id);
      v_selected_revisions := pg_catalog.array_append(v_selected_revisions,v_q.revision);
      v_topic_counts := pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
        pg_catalog.to_jsonb(v_topic_count+1),true);
      v_source_selected := pg_catalog.jsonb_set(v_source_selected,array[v_q.difficulty],
        pg_catalog.to_jsonb(coalesce((v_source_selected ->> v_q.difficulty)::integer,0)+1),true);
      exit;
    end if;
  end loop;
  if coalesce(pg_catalog.cardinality(v_selected_ids),0) <> 1 then
    raise exception 'No eligible lesson-aligned word-definition question is available'
      using errcode='P0001',detail='question_type_inventory_unavailable';
  end if;

  -- Chinese-translation questions are included only for English learning with
  -- Simplified Chinese selected. They replace knowledge slots; session length
  -- and source-difficulty composition remain unchanged.
  if v_translation_needed > 0 then
    for v_q in
      select q.question_id,q.revision,q.topic_id,q.difficulty
      from private.quiz_question_bank q
      join private.learning_content_catalog c
        on c.activity_type='permanent_lesson'
       and c.content_id=q.source_lesson_id
       and c.language_code=q.learning_language_code
       and c.is_active and c.topic_id=q.topic_id
      where q.status='approved'
        and q.learning_language_code='en'
        and q.translation_language_code = 'zh'
        and q.question_type='chinese_translation'
        and q.learning_objective_id is not null
        and q.answer_language_code='zh'
        and coalesce((v_comp ->> q.difficulty)::integer,0) >
            coalesce((v_source_selected ->> q.difficulty)::integer,0)
        and not exists (
          select 1 from private.quiz_daily_question_reservations issued
          where issued.user_id=v_user and issued.local_date=v_day
            and issued.question_id=q.question_id
        )
      order by pg_catalog.random()
    loop
      v_topic_count := coalesce((v_topic_counts ->> v_q.topic_id)::integer,0);
      if v_topic_count < v_topic_cap then
        v_selected_ids := pg_catalog.array_append(v_selected_ids,v_q.question_id);
        v_selected_revisions := pg_catalog.array_append(v_selected_revisions,v_q.revision);
        v_topic_counts := pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
          pg_catalog.to_jsonb(v_topic_count+1),true);
        v_source_selected := pg_catalog.jsonb_set(v_source_selected,array[v_q.difficulty],
          pg_catalog.to_jsonb(coalesce((v_source_selected ->> v_q.difficulty)::integer,0)+1),true);
        v_translation_added := v_translation_added+1;
        exit when v_translation_added >= v_translation_needed;
      end if;
    end loop;
    if v_translation_added <> v_translation_needed then
      raise exception 'Not enough eligible unseen Chinese-translation questions remain'
        using errcode='P0001',detail='question_type_inventory_unavailable';
    end if;
  end if;

  -- Fill every remaining source-difficulty slot with knowledge questions.
  for v_source in select unnest(array['beginner','intermediate','advanced'])
  loop
    v_needed := coalesce((v_comp ->> v_source)::integer,0)
      - coalesce((v_source_selected ->> v_source)::integer,0);
    v_added := 0;
    if v_needed > 0 then
      for v_q in
        select q.question_id,q.revision,q.topic_id,q.difficulty
        from private.quiz_question_bank q
        join private.learning_content_catalog c
          on c.activity_type='permanent_lesson'
         and c.content_id=q.source_lesson_id
         and c.language_code=q.learning_language_code
         and c.is_active and c.topic_id=q.topic_id
        where q.status='approved'
          and q.learning_language_code='en'
          and q.translation_language_code = 'zh'
          and q.difficulty=v_source
          and q.question_type='knowledge'
          and q.learning_objective_id is not null
          and not exists (
            select 1 from private.quiz_daily_question_reservations issued
            where issued.user_id=v_user and issued.local_date=v_day
              and issued.question_id=q.question_id
          )
        order by pg_catalog.random()
      loop
        v_topic_count := coalesce((v_topic_counts ->> v_q.topic_id)::integer,0);
        if v_topic_count < v_topic_cap then
          v_selected_ids := pg_catalog.array_append(v_selected_ids,v_q.question_id);
          v_selected_revisions := pg_catalog.array_append(v_selected_revisions,v_q.revision);
          v_topic_counts := pg_catalog.jsonb_set(v_topic_counts,array[v_q.topic_id],
            pg_catalog.to_jsonb(v_topic_count+1),true);
          v_source_selected := pg_catalog.jsonb_set(v_source_selected,array[v_q.difficulty],
            pg_catalog.to_jsonb(coalesce((v_source_selected ->> v_q.difficulty)::integer,0)+1),true);
          v_added := v_added+1;
          exit when v_added >= v_needed;
        end if;
      end loop;
      if v_added < v_needed then
        raise exception 'Question pool cannot satisfy source composition and topic diversity'
          using errcode='P0001',detail='topic_coverage_unavailable';
      end if;
    end if;
  end loop;

  select coalesce(pg_catalog.sum((value #>> '{}')::integer),0)::integer,
         pg_catalog.count(*)::integer
  into v_topic_total,v_topic_count
  from pg_catalog.jsonb_each(v_topic_counts);

  if v_topic_total <> v_question_count or v_topic_count < 3 then
    raise exception 'Quiz requires at least three distinct topics'
      using errcode='P0001', detail='topic_coverage_unavailable';
  end if;

  insert into private.quiz_sessions(
    user_id,difficulty,learning_language_code,translation_language_code,
    question_count,source_composition,local_date,timezone,status
  ) values (
    v_user,p_difficulty,'en',v_translation,v_question_count,v_comp,v_day,v_timezone,'in_progress'
  ) returning id into v_session;

  insert into private.quiz_daily_question_reservations(user_id,local_date,question_id)
  select v_user,v_day,picked.question_id
  from pg_catalog.unnest(v_selected_ids) as picked(question_id);

  with selected as (
    select q.*,
      pg_catalog.row_number() over(order by pg_catalog.random())::integer as new_position,
      array(
        select o.value ->> 'id'
        from pg_catalog.jsonb_array_elements(q.options) as o(value)
        order by pg_catalog.random()
      ) as shuffled_options
    from pg_catalog.generate_subscripts(v_selected_ids,1) as picked(idx)
    join private.quiz_question_bank q
      on q.question_id=v_selected_ids[picked.idx]
     and q.revision=v_selected_revisions[picked.idx]
  )
  insert into private.quiz_session_questions(
    session_id,user_id,local_date,question_id,question_revision,position,
    source_lesson_id,topic_id,source_difficulty,question_type_snapshot,answer_language_code_snapshot,learning_objective_id_snapshot,option_order,
    prompt_learning_snapshot,prompt_translation_snapshot,
    options_snapshot,correct_option_id_snapshot,
    explanation_learning_snapshot,explanation_translation_snapshot
  )
  select
    v_session,v_user,v_day,s.question_id,s.revision,s.new_position,
    s.source_lesson_id,s.topic_id,s.difficulty,s.question_type,s.answer_language_code,s.learning_objective_id,s.shuffled_options,
    s.prompt_learning,s.prompt_translation,s.options,
    s.correct_option_id,s.explanation_learning,s.explanation_translation
  from selected s;

  return private.quiz_session_payload(v_session,false);
end;
$function$;


-- The browser sends its current selectors explicitly. This avoids blocking a
-- Quiz start on an asynchronous preference upsert and keeps the session
-- snapshot aligned with the language pair the learner selected.
create or replace function public.start_my_quiz(
  p_difficulty text,
  p_learning_language text,
  p_translation_language text
)
returns jsonb
language sql
set search_path = ''
as $function$
  select private.start_my_quiz_impl(
    p_difficulty,p_learning_language,p_translation_language
  );
$function$;

grant execute on function private.start_my_quiz_impl(text,text,text) to authenticated;
revoke all on function private.start_my_quiz_impl(text,text,text) from public,anon;
grant execute on function public.start_my_quiz(text,text,text) to authenticated;
revoke all on function public.start_my_quiz(text,text,text) from public,anon;


notify pgrst, 'reload schema';

commit;
