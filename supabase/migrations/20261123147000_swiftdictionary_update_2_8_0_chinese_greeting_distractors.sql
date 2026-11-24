-- Replace three unrelated greeting distractors with natural, same-category alternatives.
begin;
create temporary table u28_greeting_target on commit drop as
select * from private.quiz_question_bank
where question_id='zh-en-b-greetings-introductions-03'
  and learning_language_code='zh' and status='approved';
update u28_greeting_target
set options=pg_catalog.jsonb_build_array(
 pg_catalog.jsonb_build_object('id','o1','learning_text','请问','translation_text','May I ask?','pinyin','qǐng wèn'),
 pg_catalog.jsonb_build_object('id','o2','learning_text','请说','translation_text','Please go ahead; speak.','pinyin','qǐng shuō'),
 pg_catalog.jsonb_build_object('id','o3','learning_text','请进','translation_text','Please come in.','pinyin','qǐng jìn'),
 pg_catalog.jsonb_build_object('id','o4','learning_text','请坐','translation_text','Please take a seat.','pinyin','qǐng zuò')
);
update private.quiz_question_bank q set status='retired',approved_at=null
from u28_greeting_target t where q.question_id=t.question_id and q.revision=t.revision;
insert into private.quiz_question_bank (
 question_id,revision,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 status,approved_at,created_at,updated_at,question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
)
select question_id,revision+1,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 'approved',pg_catalog.now(),pg_catalog.now(),pg_catalog.now(),question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
from u28_greeting_target;
commit;