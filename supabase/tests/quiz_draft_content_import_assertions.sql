do $draft_import$
declare
  v_total integer;
  v_approved integer;
  v_bad_mappings integer;
  v_bad_options integer;
begin
  select count(*) into v_total
  from private.quiz_question_bank
  where question_id like 'quiz-beginner-%'
    and learning_language_code='en'
    and translation_language_code='zh';

  select count(*) into v_approved
  from private.quiz_question_bank
  where question_id like 'quiz-beginner-%'
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
  where q.question_id like 'quiz-beginner-%'
    and c.content_id is null;

  select count(*) into v_bad_options
  from private.quiz_question_bank q
  where q.question_id like 'quiz-beginner-%'
    and (
      jsonb_array_length(q.options)<>4
      or not exists (
        select 1 from jsonb_array_elements(q.options) o
        where o->>'id'=q.correct_option_id
      )
    );

  if v_total<>30 then
    raise exception 'Expected 30 imported draft questions; found %',v_total;
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
  if (select count(distinct topic_id) from private.quiz_question_bank
      where question_id like 'quiz-beginner-%')<>5 then
    raise exception 'Beginner batch should cover five source topics';
  end if;
  if exists (
    select 1 from private.quiz_question_bank
    where question_id like 'quiz-beginner-%'
    group by topic_id having count(*)<>6
  ) then
    raise exception 'Beginner batch should contain six questions per source topic';
  end if;
  raise notice 'Quiz draft content import passed: 30 rows, 5 topics, 0 approved';
end;
$draft_import$;
