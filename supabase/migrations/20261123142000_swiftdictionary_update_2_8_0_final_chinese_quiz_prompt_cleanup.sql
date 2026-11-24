-- Refine three remaining Chinese prompts that literally included the answer character.
-- Publish as a new immutable question revision and preserve prior session references.
begin;
create temporary table u28_prompt_targets on commit drop as
select * from private.quiz_question_bank
where question_id in ('zh-en-b-questions-negation-02','zh-en-i-comparisons-03','zh-en-i-grammar-particles-03')
  and learning_language_code='zh' and status='approved';
update u28_prompt_targets set
 prompt_learning=case question_id
  when 'zh-en-b-questions-negation-02' then '当你想询问某件事物或信息时，通常会使用哪个疑问代词？'
  when 'zh-en-i-comparisons-03' then '在多个对象中指出程度排名第一的一项时，常用哪个字？'
  when 'zh-en-i-grammar-particles-03' then '哪个助词放在动词后，可以表达亲身经历？'
 end,
 prompt_pinyin=null;
update private.quiz_question_bank q set status='retired',approved_at=null
from u28_prompt_targets t where q.question_id=t.question_id and q.revision=t.revision;
insert into private.quiz_question_bank (
 question_id,revision,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 status,approved_at,created_at,updated_at,question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
)
select question_id,revision+1,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 'approved',pg_catalog.now(),pg_catalog.now(),pg_catalog.now(),question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
from u28_prompt_targets;
commit;