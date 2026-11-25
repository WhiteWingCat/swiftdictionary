do $draft_import$
declare
  v_beginner integer;
  v_intermediate integer;
  v_advanced integer;
  v_approved integer;
  v_bad_mappings integer;
  v_bad_options integer;
  v_definitions integer;
  v_translations integer;
  v_knowledge integer;
  v_bad_objectives integer;
  v_phase6 integer;
  v_bad_phase6 integer;
begin
  select count(*) filter (where question_id like 'quiz-beginner-%')::integer,
         count(*) filter (where question_id like 'quiz-intermediate-%')::integer,
         count(*) filter (where question_id like 'quiz-advanced-%')::integer
  into v_beginner,v_intermediate,v_advanced
  from private.quiz_question_bank
  where (question_id like 'quiz-beginner-%'
      or question_id like 'quiz-intermediate-%'
      or question_id like 'quiz-advanced-%')
    and learning_language_code='en'
    and translation_language_code='zh';

  select count(*) filter (where question_type='knowledge')::integer,
         count(*) filter (where question_type='word_definition')::integer,
         count(*) filter (where question_type='chinese_translation')::integer,
         count(*) filter (where learning_objective_id is null)::integer
  into v_knowledge,v_definitions,v_translations,v_bad_objectives
  from private.quiz_question_bank
  where question_id like 'quiz-beginner-%' or question_id like 'quiz-intermediate-%' or question_id like 'quiz-advanced-%';

  select count(*) into v_approved
  from private.quiz_question_bank
  where (question_id like 'quiz-beginner-%' or question_id like 'quiz-intermediate-%' or question_id like 'quiz-advanced-%')
    and status <> 'draft';

  select count(*) into v_bad_mappings
  from private.quiz_question_bank q
  left join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.topic_id=q.topic_id
   and c.difficulty=q.difficulty
   and c.is_active
  where (q.question_id like 'quiz-beginner-%' or q.question_id like 'quiz-intermediate-%' or q.question_id like 'quiz-advanced-%')
    and c.content_id is null;

  select count(*) into v_bad_options
  from private.quiz_question_bank q
  where (q.question_id like 'quiz-beginner-%' or q.question_id like 'quiz-intermediate-%' or q.question_id like 'quiz-advanced-%')
    and (
      jsonb_array_length(q.options)<>4
      or not exists (
        select 1 from jsonb_array_elements(q.options) o
        where o->>'id'=q.correct_option_id
      )
    );

  if v_knowledge<>114 or v_definitions<>15 or v_translations<>70 then
    raise exception 'Expected all 199 typed drafts (114 knowledge, 15 definitions, 70 Chinese translations); got %, %, %',v_knowledge,v_definitions,v_translations;
  end if;
  if v_bad_objectives<>0 then
    raise exception 'Draft import has % questions without learning-objective links',v_bad_objectives;
  end if;
  if v_beginner<>56 then
    raise exception 'Expected 56 Beginner draft questions; found %',v_beginner;
  end if;
  if v_intermediate<>62 then
    raise exception 'Expected 62 Intermediate draft questions; found %',v_intermediate;
  end if;
  if v_advanced<>81 then
    raise exception 'Expected 81 Advanced draft questions; found %',v_advanced;
  end if;
  if v_approved<>0 then
    raise exception 'Draft content importer unexpectedly approved % questions',v_approved;
  end if;
  if v_bad_mappings<>0 then
    raise exception 'Draft content has % invalid source lesson/topic/difficulty mappings',v_bad_mappings;
  end if;
  if v_bad_options<>0 then
    raise exception 'Draft content has % invalid four-option records',v_bad_options;
  end if;

  select count(*)::integer into v_phase6
  from private.quiz_question_bank
  where question_id like 'quiz-p6-%'
    and learning_language_code='en'
    and translation_language_code='zh'
    and status='draft';

  select count(*)::integer into v_bad_phase6
  from private.quiz_question_bank q
  left join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.topic_id=q.topic_id
   and c.difficulty=q.difficulty
   and c.is_active
  where q.question_id like 'quiz-p6-%'
    and (c.content_id is null or q.learning_objective_id is null
      or q.status<>'draft' or jsonb_typeof(q.options)<>'array'
      or jsonb_array_length(q.options)<>4
      or not exists(select 1 from jsonb_array_elements(q.options) o where o->>'id'=q.correct_option_id));

  if v_phase6<>15 or v_bad_phase6<>0 then
    raise exception 'Phase 6 draft import expected 15 lesson-linked draft questions with four options; found %, invalid %',v_phase6,v_bad_phase6;
  end if;

  if (select count(distinct topic_id) from private.quiz_question_bank
      where question_id like 'quiz-beginner-%')<>5 then
    raise exception 'Beginner batch should cover five source topics';
  end if;
  if exists (
    select 1 from private.quiz_question_bank
    where question_id like 'quiz-beginner-%' and question_type='knowledge'
    group by topic_id having count(*)<>6
  ) then
    raise exception 'Beginner batch should contain six questions per source topic';
  end if;
  if (select count(distinct topic_id) from private.quiz_question_bank
      where question_id like 'quiz-intermediate-%')<>5 then
    raise exception 'Intermediate batch should cover five source topics';
  end if;
  if exists (
    select 1 from private.quiz_question_bank
    where question_id like 'quiz-intermediate-%' and question_type='knowledge'
    group by topic_id having count(*) not in (7,8)
  ) then
    raise exception 'Intermediate batch should distribute seven or eight questions per source topic';
  end if;
  if (select count(distinct topic_id) from private.quiz_question_bank
      where question_id like 'quiz-advanced-%')<>4 then
    raise exception 'Advanced batch should cover four source topics';
  end if;
  if exists (
    select 1 from private.quiz_question_bank
    where question_id like 'quiz-advanced-%' and question_type='knowledge'
    group by topic_id having count(*) not in (9,10,20)
  ) then
    raise exception 'Advanced batch topic distribution is unexpected';
  end if;
  raise notice 'Quiz draft content import passed: 199 baseline questions plus 15 Phase 6 draft additions (all draft), 14 source-topic groups, 0 approved';
end;
$draft_import$;
