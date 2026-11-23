-- Correct the final English translation prompt that repeated the answer gloss.
begin;
create temporary table u28_last_prompt on commit drop as
select * from private.quiz_question_bank
where question_id='zh-en-i-grammar-particles-03' and learning_language_code='zh' and status='approved';
update u28_last_prompt
set prompt_translation='Which particle follows a verb to show that the speaker has done the action at least once in the past?';
update private.quiz_question_bank q set status='retired',approved_at=null
from u28_last_prompt t where q.question_id=t.question_id and q.revision=t.revision;
insert into private.quiz_question_bank (
 question_id,revision,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 status,approved_at,created_at,updated_at,question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
)
select question_id,revision+1,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 'approved',pg_catalog.now(),pg_catalog.now(),pg_catalog.now(),question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
from u28_last_prompt;
commit;