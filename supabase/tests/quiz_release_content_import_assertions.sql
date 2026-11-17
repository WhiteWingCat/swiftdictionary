-- Reusable assertion for the owner-authorized 199-question production release.
do $quiz_release_assertions$
declare
  v_total integer;
  v_approved integer;
  v_knowledge integer;
  v_definitions integer;
  v_translations integer;
  v_beginner integer;
  v_intermediate integer;
  v_advanced integer;
  v_bad_mappings integer;
  v_bad_objectives integer;
  v_bad_options integer;
  v_bad_languages integer;
  v_lesson_count integer;
begin
  select count(*)::integer,
         count(*) filter (where status='approved' and approved_at is not null)::integer,
         count(*) filter (where question_type='knowledge')::integer,
         count(*) filter (where question_type='word_definition')::integer,
         count(*) filter (where question_type='chinese_translation')::integer,
         count(*) filter (where difficulty='beginner')::integer,
         count(*) filter (where difficulty='intermediate')::integer,
         count(*) filter (where difficulty='advanced')::integer,
         count(*) filter (where learning_objective_id is null)::integer
    into v_total,v_approved,v_knowledge,v_definitions,v_translations,
         v_beginner,v_intermediate,v_advanced,v_bad_objectives
  from private.quiz_question_bank
  where learning_language_code='en' and translation_language_code='zh'
    and question_id like 'quiz-%';

  select count(*) into v_bad_mappings
  from private.quiz_question_bank q
  left join private.learning_content_catalog c
    on c.activity_type='permanent_lesson'
   and c.content_id=q.source_lesson_id
   and c.language_code=q.learning_language_code
   and c.topic_id=q.topic_id
   and c.difficulty=q.difficulty
   and c.is_active
  where q.question_id like 'quiz-%' and c.content_id is null;

  select count(*) into v_bad_options
  from private.quiz_question_bank q
  where q.question_id like 'quiz-%'
    and (
      jsonb_typeof(q.options)<>'array'
      or jsonb_array_length(q.options)<>4
      or not exists (
        select 1 from jsonb_array_elements(q.options) o
        where o->>'id'=q.correct_option_id
      )
    );

  select count(*) into v_bad_languages
  from private.quiz_question_bank q
  where q.question_id like 'quiz-%'
    and not (
      (q.question_type='chinese_translation' and q.answer_language_code='zh')
      or (q.question_type in ('knowledge','word_definition') and q.answer_language_code='en')
    );

  select count(distinct source_lesson_id)::integer into v_lesson_count
  from private.quiz_question_bank where question_id like 'quiz-%';

  if v_total<>199 or v_approved<>199 then
    raise exception 'Expected 199 approved release questions; found total %, approved %',v_total,v_approved;
  end if;
  if v_knowledge<>114 or v_definitions<>15 or v_translations<>70 then
    raise exception 'Expected typed release counts 114/15/70; found %/%/%',v_knowledge,v_definitions,v_translations;
  end if;
  if v_beginner<>56 or v_intermediate<>62 or v_advanced<>81 then
    raise exception 'Expected difficulty counts 56/62/81; found %/%/%',v_beginner,v_intermediate,v_advanced;
  end if;
  if v_bad_mappings<>0 or v_bad_objectives<>0 or v_bad_options<>0 or v_bad_languages<>0 then
    raise exception 'Release content integrity failed: mappings %, objectives %, options %, answer languages %',
      v_bad_mappings,v_bad_objectives,v_bad_options,v_bad_languages;
  end if;
  if v_lesson_count<>15 then
    raise exception 'Expected questions mapped across all 15 permanent lessons; found %',v_lesson_count;
  end if;
  raise notice 'Quiz release content verified: 199 approved rows (114 knowledge, 15 definitions, 70 Chinese translations); difficulty 56/62/81; 15 mapped lessons.';
end;
$quiz_release_assertions$;
