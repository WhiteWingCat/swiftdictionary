-- Preserve immutable Quiz question revisions while keeping prior session references valid.
-- Copy the Chinese question rows changed by the preceding quality migration
-- into a new revision. Historical sessions retain their original references.
begin;
create temporary table u28_quiz_revision_targets on commit drop as
select q.*
from private.quiz_question_bank q
where q.learning_language_code='zh'
  and q.status='approved'
  and q.updated_at=(
    select max(updated_at) from private.quiz_question_bank
    where learning_language_code='zh' and status='approved'
  );

update private.quiz_question_bank q
set status='retired',approved_at=null
from u28_quiz_revision_targets t
where q.question_id=t.question_id and q.revision=t.revision;

insert into private.quiz_question_bank (
  question_id,revision,learning_language_code,translation_language_code,
  source_lesson_id,topic_id,difficulty,prompt_learning,prompt_translation,
  options,correct_option_id,explanation_learning,explanation_translation,
  status,approved_at,created_at,updated_at,question_type,answer_language_code,
  learning_objective_id,prompt_pinyin,explanation_pinyin
)
select
  t.question_id,t.revision+1,t.learning_language_code,t.translation_language_code,
  t.source_lesson_id,t.topic_id,t.difficulty,t.prompt_learning,t.prompt_translation,
  t.options,t.correct_option_id,t.explanation_learning,t.explanation_translation,
  'approved',pg_catalog.now(),pg_catalog.now(),pg_catalog.now(),t.question_type,
  t.answer_language_code,t.learning_objective_id,t.prompt_pinyin,t.explanation_pinyin
from u28_quiz_revision_targets t
on conflict(question_id,revision) do nothing;
commit;