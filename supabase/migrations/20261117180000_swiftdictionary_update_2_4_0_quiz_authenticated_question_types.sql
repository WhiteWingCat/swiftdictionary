-- SwiftDictionary Update 2.4.0 — authenticated Quiz question-type support.
-- Additive feature-branch migration. Drafts remain drafts; no production target.
begin;

alter table private.quiz_question_bank
  add column if not exists question_type text not null default 'knowledge'
    check (question_type in ('knowledge','word_definition','chinese_translation')),
  add column if not exists answer_language_code text not null default 'en'
    check (answer_language_code in ('en','zh')),
  add column if not exists learning_objective_id text;

alter table private.quiz_question_bank
  add constraint quiz_question_bank_answer_language_by_type_check
  check (
    (question_type='chinese_translation' and answer_language_code='zh')
    or (question_type in ('knowledge','word_definition') and answer_language_code='en')
  );

create index if not exists quiz_question_bank_type_eligibility_idx
  on private.quiz_question_bank
    (learning_language_code,translation_language_code,question_type,answer_language_code,difficulty)
  where status='approved';

alter table private.quiz_session_questions
  add column if not exists question_type_snapshot text not null default 'knowledge'
    check (question_type_snapshot in ('knowledge','word_definition','chinese_translation')),
  add column if not exists answer_language_code_snapshot text not null default 'en'
    check (answer_language_code_snapshot in ('en','zh')),
  add column if not exists learning_objective_id_snapshot text;

alter table private.quiz_session_questions
  add constraint quiz_session_question_type_language_check
  check (
    (question_type_snapshot='chinese_translation' and answer_language_code_snapshot='zh')
    or (question_type_snapshot in ('knowledge','word_definition') and answer_language_code_snapshot='en')
  );

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
     or new.question_type_snapshot is distinct from old.question_type_snapshot
     or new.answer_language_code_snapshot is distinct from old.answer_language_code_snapshot
     or new.learning_objective_id_snapshot is distinct from old.learning_objective_id_snapshot
     or new.option_order is distinct from old.option_order
     or new.prompt_learning_snapshot is distinct from old.prompt_learning_snapshot
     or new.prompt_translation_snapshot is distinct from old.prompt_translation_snapshot
     or new.options_snapshot is distinct from old.options_snapshot
     or new.correct_option_id_snapshot is distinct from old.correct_option_id_snapshot
     or new.explanation_learning_snapshot is distinct from old.explanation_learning_snapshot
     or new.explanation_translation_snapshot is distinct from old.explanation_translation_snapshot then
    raise exception 'Quiz question identity and snapshots are immutable'
      using errcode = '42501';
  end if;

  -- The authenticated answer-saving RPC may change a selection until the
  -- session is submitted. Direct table writes remain blocked by privileges.

  if new.selected_option_id is not null
     and not (new.selected_option_id = any(new.option_order)) then
    raise exception 'Selected option does not belong to this Quiz question'
      using errcode = '23514';
  end if;

  return new;
end;
$function$;

drop trigger if exists guard_quiz_session_question_update on private.quiz_session_questions;
create trigger guard_quiz_session_question_update
before update on private.quiz_session_questions
for each row execute function private.guard_quiz_session_question_update();

create or replace function private.quiz_session_payload(
  p_session_id uuid,
  p_include_review boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_session private.quiz_sessions%rowtype;
  v_payload jsonb;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into v_session
  from private.quiz_sessions s
  where s.id = p_session_id and s.user_id = v_user;

  if not found then
    raise exception 'Quiz session not found' using errcode = 'P0002';
  end if;

  if p_include_review and v_session.status <> 'completed' then
    raise exception 'Only completed Quizzes can be reviewed' using errcode = '42501';
  end if;

  select
    pg_catalog.jsonb_build_object(
      'session_id', v_session.id,
      'difficulty', v_session.difficulty,
      'status', v_session.status,
      'question_count', v_session.question_count,
      'current_position', v_session.current_position,
      'learning_language_code', v_session.learning_language_code,
      'translation_language_code', v_session.translation_language_code,
      'source_composition', v_session.source_composition,
      'started_at', v_session.started_at,
      'completed_at', v_session.completed_at,
      'correct_count', case when v_session.status = 'completed' then v_session.correct_count else null end,
      'percentage', case when v_session.status = 'completed' then v_session.percentage else null end,
      'questions', coalesce(
        pg_catalog.jsonb_agg(
          pg_catalog.jsonb_build_object(
            'question_id', q.question_id,
            'source_lesson_id', q.source_lesson_id,
            'topic_id', q.topic_id,
            'source_difficulty', q.source_difficulty,
            'question_type', q.question_type_snapshot,
            'answer_language_code', q.answer_language_code_snapshot,
            'learning_objective_id', q.learning_objective_id_snapshot,
            'position', q.position,
            'prompt_learning', q.prompt_learning_snapshot,
            'prompt_translation', q.prompt_translation_snapshot,
            'options', (
              select pg_catalog.jsonb_agg(
                pg_catalog.jsonb_build_object(
                  'id', o.value ->> 'id',
                  'learning_text', o.value ->> 'learning_text',
                  'translation_text', o.value ->> 'translation_text'
                )
                order by pg_catalog.array_position(q.option_order, o.value ->> 'id')
              )
              from pg_catalog.jsonb_array_elements(q.options_snapshot) as o(value)
            ),
            'selected_option_id', q.selected_option_id
          ) ||
          case when p_include_review then
            pg_catalog.jsonb_build_object(
              'correct_option_id', q.correct_option_id_snapshot,
              'is_correct', q.selected_option_id = q.correct_option_id_snapshot,
              'explanation_learning', q.explanation_learning_snapshot,
              'explanation_translation', q.explanation_translation_snapshot
            )
          else '{}'::jsonb end
          order by q.position
        ),
        '[]'::jsonb
      )
    )
  into v_payload
  from private.quiz_session_questions q
  where q.session_id = v_session.id and q.user_id = v_user;

  return v_payload;
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
    and q.translation_language_code=v_translation;

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
    and q.translation_language_code=v_translation
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
        and q.translation_language_code=v_translation
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
      and q.translation_language_code=v_translation
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
        and q.translation_language_code=v_translation
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
          and q.translation_language_code=v_translation
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

commit;
