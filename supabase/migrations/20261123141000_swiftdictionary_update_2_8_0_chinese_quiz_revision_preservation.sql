-- Preserve immutable Quiz question revisions while keeping prior session references valid.
-- The preceding U2.8.0 quality migration edits approved Chinese question content.
-- Copy those rows into a new revision and retire the old versions; historical
-- quiz_session_questions continue to reference their original revision.
begin;
with latest as (
  select max(updated_at) as changed_at
  from private.quiz_question_bank
  where learning_language_code='zh' and status='approved'
), targets as (
  select q.*
  from private.quiz_question_bank q, latest l
  where q.learning_language_code='zh'
    and q.status='approved'
    and q.updated_at=l.changed_at
)
insert into private.quiz_question_bank (
  question_id,revision,learning_language_code,translation_language_code,
  source_lesson_id,topic_id,difficulty,prompt_learning,prompt_translation,
  options,correct_option_id,explanation_learning,explanation_translation,
  status,approved_at,created_at,updated_at,question_type,answer_language_code,
  learning_objective_id,prompt_pinyin,explanation_pinyin
)
select
  q.question_id,q.revision+1,q.learning_language_code,q.translation_language_code,
  q.source_lesson_id,q.topic_id,q.difficulty,q.prompt_learning,q.prompt_translation,
  q.options,q.correct_option_id,q.explanation_learning,q.explanation_translation,
  'approved',pg_catalog.now(),pg_catalog.now(),pg_catalog.now(),q.question_type,
  q.answer_language_code,q.learning_objective_id,q.prompt_pinyin,q.explanation_pinyin
from targets q
on conflict(question_id,revision) do nothing;

with latest as (
  select max(updated_at) as changed_at
  from private.quiz_question_bank
  where learning_language_code='zh' and status='approved'
)
update private.quiz_question_bank q
set status='retired',approved_at=null
from latest l
where q.learning_language_code='zh'
  and q.status='approved'
  and q.updated_at=l.changed_at
  and exists(select 1 from private.quiz_question_bank newer
    where newer.question_id=q.question_id and newer.revision=q.revision+1
      and newer.status='approved');

commit;