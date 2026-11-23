-- Remove answer text from English translations of Chinese Quiz prompts.
-- Keep every affected question immutable by promoting a new revision.
begin;
create temporary table u28_translation_prompt_targets on commit drop as
select * from private.quiz_question_bank
where question_id in ('zh-en-a-complex-sentences-05','zh-en-a-connectors-02','zh-en-a-connectors-03','zh-en-a-connectors-04','zh-en-a-nuanced-vocabulary-05','zh-en-b-common-actions-01','zh-en-b-common-actions-02','zh-en-b-common-actions-03','zh-en-b-common-actions-04','zh-en-b-greetings-introductions-01','zh-en-b-greetings-introductions-02','zh-en-b-greetings-introductions-05','zh-en-b-greetings-introductions-06','zh-en-b-greetings-introductions-07','zh-en-b-numbers-dates-time-01','zh-en-b-numbers-dates-time-02','zh-en-b-numbers-dates-time-03','zh-en-b-numbers-dates-time-04','zh-en-b-numbers-dates-time-06','zh-en-b-places-getting-around-01','zh-en-b-places-getting-around-02','zh-en-b-places-getting-around-03','zh-en-b-places-getting-around-04','zh-en-b-places-getting-around-05','zh-en-b-places-getting-around-06','zh-en-b-pronouns-basic-sentences-04','zh-en-b-pronouns-basic-sentences-06','zh-en-b-questions-negation-02','zh-en-b-questions-negation-03','zh-en-b-questions-negation-05','zh-en-b-questions-negation-06','zh-en-extra-02','zh-en-extra-03','zh-en-extra-04','zh-en-extra-08','zh-en-i-comparisons-01','zh-en-i-comparisons-02','zh-en-i-comparisons-05','zh-en-i-comparisons-06','zh-en-i-comparisons-07','zh-en-i-grammar-particles-02','zh-en-i-grammar-particles-03','zh-en-i-grammar-particles-06','zh-en-i-measure-words-02','zh-en-i-measure-words-06','zh-en-i-sentence-expansion-05','zh-en-i-time-expressions-02','zh-en-i-time-expressions-03','zh-en-i-time-expressions-04','zh-en-i-time-expressions-05','zh-en-i-time-expressions-06','zh-en-i-time-expressions-07')
  and learning_language_code='zh' and status='approved';

update u28_translation_prompt_targets q
set prompt_translation=v.prompt_translation
from (values
('zh-en-a-complex-sentences-05','Which sentence uses a passive construction to describe a younger sibling taking the speaker''s phone?'),
('zh-en-a-connectors-02','Which connector introduces a contrast with the point just made?'),
('zh-en-a-connectors-03','Which connector introduces an additional supporting point?'),
('zh-en-a-connectors-04','Which expression is commonly used to briefly sum up the main idea?'),
('zh-en-a-nuanced-vocabulary-05','Which expression tells a reader that a book is appropriate for someone beginning the subject?'),
('zh-en-b-common-actions-01','Which verb describes taking food into your mouth during a meal?'),
('zh-en-b-common-actions-02','Which verb describes taking water or another beverage into your mouth?'),
('zh-en-b-common-actions-03','Which verb describes moving from your current place to another location?'),
('zh-en-b-common-actions-04','Which sentence describes the speaker drinking water?'),
('zh-en-b-greetings-introductions-01','Which greeting is commonly used when meeting someone in the morning?'),
('zh-en-b-greetings-introductions-02','Which expression shows gratitude after receiving help or a gift?'),
('zh-en-b-greetings-introductions-05','Which expression is commonly used when parting or ending a conversation?'),
('zh-en-b-greetings-introductions-06','Which sentence introduces the speaker using the name Li Ming?'),
('zh-en-b-greetings-introductions-07','Which phrase expresses pleasure at meeting someone for the first time?'),
('zh-en-b-numbers-dates-time-01','Which character represents the whole number immediately after six?'),
('zh-en-b-numbers-dates-time-02','Which word refers to the current calendar day?'),
('zh-en-b-numbers-dates-time-03','What is the name of the first weekday after Sunday?'),
('zh-en-b-numbers-dates-time-04','Which character represents one of the twelve divisions of a year in a date?'),
('zh-en-b-numbers-dates-time-06','Which word refers to the day after today?'),
('zh-en-b-places-getting-around-01','Which place is where students attend classes, read and complete assignments?'),
('zh-en-b-places-getting-around-02','Where do people usually go for diagnosis and treatment when ill or injured?'),
('zh-en-b-places-getting-around-03','At what place do passengers wait for trains or public transport?'),
('zh-en-b-places-getting-around-04','Which sentence asks about the location of an underground rail stop?'),
('zh-en-b-places-getting-around-05','On a map, which direction is opposite the right-hand side?'),
('zh-en-b-places-getting-around-06','On a map, which direction is opposite the left-hand side?'),
('zh-en-b-pronouns-basic-sentences-04','Which sentence states that the speaker has the role of a student?'),
('zh-en-b-pronouns-basic-sentences-06','Which sentence identifies a nearby book as belonging to the speaker?'),
('zh-en-b-questions-negation-02','Which interrogative pronoun is used to ask about an object, information or a situation?'),
('zh-en-b-questions-negation-03','Which interrogative pronoun is used to ask about a person''s identity?'),
('zh-en-b-questions-negation-05','Which expression states that a person or place lacks something?'),
('zh-en-b-questions-negation-06','Which sentence asks whether the listener has the role of a student?'),
('zh-en-extra-02','Which sentence describes a speaker''s regular morning exercise routine?'),
('zh-en-extra-03','Which sentence uses a disposal construction to make a request about mailing a piece of correspondence?'),
('zh-en-extra-04','Which sentence uses a passive construction to describe a bicycle being taken by someone?'),
('zh-en-extra-08','Which proverb encourages people to adapt their behaviour to the customs of a place they visit?'),
('zh-en-i-comparisons-01','Which comparison pattern expresses that A has a greater degree of a quality than B?'),
('zh-en-i-comparisons-02','Which sentence compares the speaker''s height with another person''s and places the speaker higher?'),
('zh-en-i-comparisons-05','Which sentence compares today''s temperature with yesterday''s and indicates a lower value?'),
('zh-en-i-comparisons-06','Which comparison pattern expresses that A has a lower degree of a quality than B?'),
('zh-en-i-comparisons-07','Which adverb indicates an increase in degree relative to a previous comparison?'),
('zh-en-i-grammar-particles-02','Which sentence reports that the speaker viewed a film on the previous day?'),
('zh-en-i-grammar-particles-03','Which particle can follow a verb to indicate that the action has been experienced before?'),
('zh-en-i-grammar-particles-06','Which sentence invites the listener to share their corresponding information?'),
('zh-en-i-measure-words-02','Which quantity phrase combines the number two with the measure word used for books?'),
('zh-en-i-measure-words-06','Which quantity phrase combines the number one with the measure word used for people?'),
('zh-en-i-sentence-expansion-05','Which sentence contrasts someone''s tiredness with their decision to continue studying?'),
('zh-en-i-time-expressions-02','Which time expression refers to something happening on each day?'),
('zh-en-i-time-expressions-03','Which adverb indicates that an event has occurred before the present moment?'),
('zh-en-i-time-expressions-04','Which expression indicates that something has not happened up to now?'),
('zh-en-i-time-expressions-05','Which sentence describes a daily morning routine at a specific clock time?'),
('zh-en-i-time-expressions-06','Which part of the day falls after lunchtime and before evening?'),
('zh-en-i-time-expressions-07','Which sentence states that the speaker''s evening meal remains uneaten up to now?')
) as v(question_id,prompt_translation)
where q.question_id=v.question_id;

update u28_translation_prompt_targets q
set prompt_learning=v.prompt_learning
from (values
('zh-en-b-places-getting-around-04','哪个句子询问地下铁车站的位置？'),
('zh-en-b-questions-negation-06','哪个句子询问对方是否具有学生这一身份？'),
('zh-en-extra-02','哪句话描述说话者每天早晨进行的运动习惯？'),
('zh-en-extra-04','哪句话使用被动句式，说明一辆自行车被他人拿走？'),
('zh-en-i-grammar-particles-06','哪个句子把话题交还给对方，邀请对方分享自己的情况？')
) as v(question_id,prompt_learning)
where q.question_id=v.question_id;

update private.quiz_question_bank q
set status='retired',approved_at=null
from u28_translation_prompt_targets t
where q.question_id=t.question_id and q.revision=t.revision;

insert into private.quiz_question_bank (
 question_id,revision,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 status,approved_at,created_at,updated_at,question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
)
select question_id,revision+1,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,
 prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,
 'approved',pg_catalog.now(),pg_catalog.now(),pg_catalog.now(),question_type,answer_language_code,learning_objective_id,prompt_pinyin,explanation_pinyin
from u28_translation_prompt_targets;
commit;