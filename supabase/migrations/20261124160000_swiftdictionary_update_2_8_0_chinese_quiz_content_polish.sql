-- U2.8.0 Chinese Quiz content polish. Preserve the previous approved revisions.
create temporary table _u28_chinese_quiz_polish_updates (
 question_id text primary key,prompt_learning text,prompt_pinyin text,
 set_prompt_pinyin boolean not null default false,prompt_translation text,
 explanation_learning text,explanation_translation text
);
insert into _u28_chinese_quiz_polish_updates
 (question_id,prompt_learning,prompt_pinyin,set_prompt_pinyin,prompt_translation,explanation_learning,explanation_translation)
values
('zh-en-i-grammar-particles-04','哪句话表示门一直处于打开状态？','nǎ jù huà biǎo shì mén yì zhí chǔ yú dǎ kāi zhuàng tài?',true,'Which sentence shows that a door remains open?',null,null),
('zh-en-i-grammar-particles-06','哪句话能把话题转回对方，并邀请对方分享自己的情况？','nǎ jù huà néng bǎ huà tí zhuǎn huí duì fāng, bìng yāo qǐng duì fāng fēn xiǎng zì jǐ de qíng kuàng?',true,'Which sentence turns the topic back to the other person and invites them to share about themselves?',null,null),
('zh-en-i-grammar-particles-07','哪句话正确使用结构助词“得”来补充说明动作的程度？','nǎ jù huà zhèng què shǐ yòng jié gòu zhù cí “de” lái bǔ chōng shuō míng dòng zuò de chéng dù?',true,'Which sentence uses the structural particle 得 correctly to describe the degree of an action?',null,null),
('zh-en-b-questions-negation-06','哪句话是在询问对方是不是学生？','nǎ jù huà shì zài xún wèn duì fāng shì bú shì xué shēng?',true,'Which sentence asks whether the other person is a student?',null,null),
('zh-en-b-pinyin-foundations-05',null,null,true,null,null,null),
('zh-en-b-pinyin-foundations-06',null,null,true,null,null,null),
('zh-en-b-places-getting-around-04','哪句话询问地铁站的位置？','nǎ jù huà xún wèn dì tiě zhàn de wèi zhì?',true,'Which sentence asks where the subway station is?',null,null),
('zh-en-i-measure-words-03','哪一个量词最适合与“水”搭配，表示常见的饮用份量？','nǎ yí gè liàng cí zuì shì hé yǔ “shuǐ” dā pèi, biǎo shì cháng jiàn de yǐn yòng fèn liàng?',true,'Which measure word is commonly used for a serving of water?',null,null),
('zh-en-a-complex-sentences-07',null,null,false,'Which 把 sentence clearly says that the homework has been fully completed?',null,null),
('zh-en-extra-01',null,null,false,'Which particle indicates that someone has had a particular experience?',null,null),
('zh-en-extra-09',null,null,false,'Which adjective describes someone who works carefully and pays attention to detail?',null,null),
('zh-en-extra-10',null,null,false,'Which verb means to make previously non-public information public?',null,null),
('zh-en-b-pinyin-translation-01','Which Chinese character means “horse”?',null,false,null,'“马”表示马匹，读作 mǎ，使用第三声。','马 means “horse” and is pronounced mǎ with the third tone.'),
('zh-en-b-pronouns-basic-sentences-04',null,null,false,'Which sentence says that the speaker is a student?',null,null),
('zh-en-a-connectors-06','下面哪句话最自然地表达前后两种情况形成转折？','xià miàn nǎ jù huà zuì zì rán de biǎo dá qián hòu liǎng zhǒng qíng kuàng xíng chéng zhuǎn zhé?',true,'Which sentence most naturally expresses a contrast between two situations?',null,null),
('zh-en-a-natural-expression-literature-06',null,'nǎ jù gǔ yǔ chū zì “xún zǐ · quàn xué”, qiáng diào zhú bù jī lěi de zhòng yào xìng?',true,null,null,null),
('zh-en-i-comparisons-01','哪种句型用于比较两个对象在同一性质上的程度差异？','nǎ zhǒng jù xíng yòng yú bǐ jiào liǎng gè duì xiàng zài tóng yī xìng zhì shàng de chéng dù chā yì?',true,'Which sentence pattern compares the degree of the same quality between two subjects?',null,null),
('zh-en-i-comparisons-06','哪种句型表示A的某种性质程度低于B？','nǎ zhǒng jù xíng biǎo shì A de mǒu zhǒng xìng zhì chéng dù dī yú B?',true,'Which sentence pattern indicates that A has a lower degree of a quality than B?',null,null),
('zh-en-i-sentence-expansion-05','哪句话表达让步关系，并说明说话者即使很累仍继续学习？','nǎ jù huà biǎo dá ràng bù guān xì, bìng shuō míng shuō huà zhě jí shǐ hěn lèi réng jì xù xué xí?',true,'Which sentence expresses concession and says the speaker keeps studying despite being tired?',null,null),
('zh-en-extra-05','要表达“成功必须以努力为前提”，通常使用哪种关联词结构？','yào biǎo dá “chéng gōng bì xū yǐ nǔ lì wéi qián tí”, tōng cháng shǐ yòng nǎ zhǒng guān lián cí jié gòu?',true,'Which paired structure expresses that success depends on effort as a necessary condition?',null,null),
('zh-en-extra-06','要表达“条件如何变化，结果始终相同”，通常使用哪种关联词结构？','yào biǎo dá “tiáo jiàn rú hé biàn huà, jié guǒ shǐ zhōng xiāng tóng”, tōng cháng shǐ yòng nǎ zhǒng guān lián cí jié gòu?',true,'Which paired structure expresses that the result stays the same regardless of changing conditions?',null,null),
('zh-en-extra-13','要表达“明天下雨时，说话者会取消原定计划”，通常使用哪种关联词结构？','yào biǎo dá “míng tiān xià yǔ shí, shuō huà zhě huì qǔ xiāo yuán dìng jì huà”, tōng cháng shǐ yòng nǎ zhǒng guān lián cí jié gòu?',true,'Which paired structure expresses a condition and the action that follows if it is met?',null,null),
('zh-en-extra-14','要表达“他很累，但最后还是完成了工作”这种让步关系，通常使用哪种关联词结构？','yào biǎo dá “tā hěn lèi, dàn zuì hòu hái shì wán chéng le gōng zuò” zhè zhǒng ràng bù guān xì, tōng cháng shǐ yòng nǎ zhǒng guān lián cí jié gòu?',true,'Which paired structure expresses a concession, such as someone completing a task despite being tired?',null,null);
create temporary table _u28_chinese_quiz_polish_current as
select q.*,u.prompt_learning as next_prompt_learning,u.prompt_pinyin as next_prompt_pinyin,
 u.set_prompt_pinyin,u.prompt_translation as next_prompt_translation,
 u.explanation_learning as next_explanation_learning,u.explanation_translation as next_explanation_translation
from private.quiz_question_bank q join _u28_chinese_quiz_polish_updates u using(question_id)
where q.status='approved' and q.learning_language_code='zh' and q.translation_language_code='en';
do $$
declare expected_count integer := 23;
begin
 if (select count(*) from _u28_chinese_quiz_polish_updates)<>expected_count then raise exception 'Chinese Quiz polish manifest count mismatch'; end if;
 if (select count(*) from _u28_chinese_quiz_polish_current)<>expected_count then raise exception 'Expected one current approved row for each Chinese Quiz polish update'; end if;
 if exists(select 1 from _u28_chinese_quiz_polish_current c where c.revision<>(select max(x.revision) from private.quiz_question_bank x where x.question_id=c.question_id)) then raise exception 'An approved Chinese Quiz row is not the latest revision'; end if;
 if exists(select 1 from _u28_chinese_quiz_polish_current c join private.quiz_question_bank n on n.question_id=c.question_id and n.revision=c.revision+1) then raise exception 'A Chinese Quiz polish revision already exists'; end if;
end $$;
update private.quiz_question_bank q set status='retired',approved_at=null,updated_at=now()
from _u28_chinese_quiz_polish_current c where q.question_id=c.question_id and q.revision=c.revision and q.status='approved';
insert into private.quiz_question_bank (
 question_id,revision,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 status,approved_at,question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
)
select c.question_id,c.revision+1,c.learning_language_code,c.translation_language_code,c.source_lesson_id,c.topic_id,c.difficulty,
 coalesce(c.next_prompt_learning,c.prompt_learning),coalesce(c.next_prompt_translation,c.prompt_translation),
 c.options,c.correct_option_id,coalesce(c.next_explanation_learning,c.explanation_learning),
 coalesce(c.next_explanation_translation,c.explanation_translation),'approved',now(),c.question_type,
 c.answer_language_code,c.learning_objective_id,
 case when c.set_prompt_pinyin then c.next_prompt_pinyin else c.prompt_pinyin end,c.explanation_pinyin
from _u28_chinese_quiz_polish_current c;
do $$
declare expected_count integer := 23; active_count integer;
begin
 select count(*) into active_count from private.quiz_question_bank q
 join _u28_chinese_quiz_polish_updates u using(question_id)
 where q.status='approved' and q.revision=(select max(x.revision) from private.quiz_question_bank x where x.question_id=q.question_id);
 if active_count<>expected_count then raise exception 'Chinese Quiz polish did not create the expected active revisions'; end if;
end $$;
drop table _u28_chinese_quiz_polish_current;
drop table _u28_chinese_quiz_polish_updates;
