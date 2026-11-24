-- Improve Chinese Quiz distractors that were visibly ungrammatical or implausible.
-- Promote new immutable revisions so completed Quiz sessions remain unchanged.
begin;
create temporary table u28_distractor_targets on commit drop as
select * from private.quiz_question_bank
where question_id in (
 'zh-en-extra-03',
 'zh-en-i-grammar-particles-04',
 'zh-en-i-grammar-particles-07',
 'zh-en-i-measure-words-02',
 'zh-en-i-measure-words-06'
) and learning_language_code='zh' and status='approved';

update u28_distractor_targets
set prompt_learning=case question_id
 when 'zh-en-i-grammar-particles-07' then '标准书面表达中，下面哪句话用“得”正确补充说明一个人跑得很快？'
 when 'zh-en-i-measure-words-02' then '日常表达中，表示两本独立的普通书籍时，哪种量词搭配最自然？'
 when 'zh-en-i-measure-words-06' then '不指定职业、身份或关系时，表示一位普通个体的中性数量短语是什么？'
 else prompt_learning
end,
options=case question_id
 when 'zh-en-extra-03' then pg_catalog.jsonb_build_array(
  pg_catalog.jsonb_build_object('id','o1','learning_text','请把这封信寄出去。','translation_text','Please send this letter out.','pinyin','qǐng bǎ zhè fēng xìn jì chū qù'),
  pg_catalog.jsonb_build_object('id','o2','learning_text','请把这封信放在桌上。','translation_text','Please put this letter on the table.','pinyin','qǐng bǎ zhè fēng xìn fàng zài zhuō shàng'),
  pg_catalog.jsonb_build_object('id','o3','learning_text','请把这封信写完。','translation_text','Please finish writing this letter.','pinyin','qǐng bǎ zhè fēng xìn xiě wán'),
  pg_catalog.jsonb_build_object('id','o4','learning_text','请把这封信拿回来。','translation_text','Please bring this letter back.','pinyin','qǐng bǎ zhè fēng xìn ná huí lái')
 )
 when 'zh-en-i-grammar-particles-04' then pg_catalog.jsonb_build_array(
  pg_catalog.jsonb_build_object('id','o1','learning_text','门开着','translation_text','The door is open.','pinyin','mén kāi zhe'),
  pg_catalog.jsonb_build_object('id','o2','learning_text','门开了','translation_text','The door opened.','pinyin','mén kāi le'),
  pg_catalog.jsonb_build_object('id','o3','learning_text','门正在开','translation_text','The door is opening.','pinyin','mén zhèng zài kāi'),
  pg_catalog.jsonb_build_object('id','o4','learning_text','门开过','translation_text','The door has been opened before.','pinyin','mén kāi guo')
 )
 when 'zh-en-i-grammar-particles-07' then pg_catalog.jsonb_build_array(
  pg_catalog.jsonb_build_object('id','o1','learning_text','他跑得很快','translation_text','He runs very fast.','pinyin','tā pǎo de hěn kuài'),
  pg_catalog.jsonb_build_object('id','o2','learning_text','他得跑很快','translation_text','He has to run fast.','pinyin','tā děi pǎo hěn kuài'),
  pg_catalog.jsonb_build_object('id','o3','learning_text','他跑的很快','translation_text','He runs very fast, using the informal non-standard spelling of the complement particle.','pinyin','tā pǎo de hěn kuài'),
  pg_catalog.jsonb_build_object('id','o4','learning_text','他跑得很慢','translation_text','He runs very slowly.','pinyin','tā pǎo de hěn màn')
 )
 when 'zh-en-i-measure-words-02' then pg_catalog.jsonb_build_array(
  pg_catalog.jsonb_build_object('id','o1','learning_text','两本书','translation_text','Two books.','pinyin','liǎng běn shū'),
  pg_catalog.jsonb_build_object('id','o2','learning_text','两个书','translation_text','Two books, using the general classifier rather than the usual book classifier.','pinyin','liǎng ge shū'),
  pg_catalog.jsonb_build_object('id','o3','learning_text','两套书','translation_text','Two sets of books.','pinyin','liǎng tào shū'),
  pg_catalog.jsonb_build_object('id','o4','learning_text','两页书','translation_text','Two pages of a book.','pinyin','liǎng yè shū')
 )
 when 'zh-en-i-measure-words-06' then pg_catalog.jsonb_build_array(
  pg_catalog.jsonb_build_object('id','o1','learning_text','一个人','translation_text','One person.','pinyin','yí ge rén'),
  pg_catalog.jsonb_build_object('id','o2','learning_text','一位同事','translation_text','One colleague.','pinyin','yí wèi tóng shì'),
  pg_catalog.jsonb_build_object('id','o3','learning_text','一名学生','translation_text','One student.','pinyin','yì míng xué shēng'),
  pg_catalog.jsonb_build_object('id','o4','learning_text','一户人家','translation_text','One household.','pinyin','yí hù rén jiā')
 )
 else options
end;

update private.quiz_question_bank q
set status='retired',approved_at=null
from u28_distractor_targets t
where q.question_id=t.question_id and q.revision=t.revision;

insert into private.quiz_question_bank (
 question_id,revision,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 status,approved_at,created_at,updated_at,question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
)
select question_id,revision+1,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 'approved',pg_catalog.now(),pg_catalog.now(),pg_catalog.now(),question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
from u28_distractor_targets;
commit;