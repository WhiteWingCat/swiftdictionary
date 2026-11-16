-- SwiftDictionary Update 2.4.0 — original Beginner Quiz question bank (20 items).
-- Questions and Simplified Chinese translations are original SwiftDictionary content.
-- English and Chinese translation variants share the same learning question but have
-- distinct IDs because the bank stores one translation language per approved revision.
begin;
with seed(question_id,source_lesson_id,topic_id,difficulty,prompt_learning,prompt_zh,a_learning,a_zh,b_learning,b_zh,c_learning,c_zh,d_learning,d_zh,correct_option_id,explanation_learning,explanation_zh) as (
 values
('b-sentence-01','b-sentence','sentence-basics','beginner','Choose the sentence with the usual subject–verb–object order.','选择符合常见主语—动词—宾语语序的句子。','The children planted flowers.,孩子们种了花。','Planted the children flowers.,种了孩子们花。','Flowers the children planted.,花孩子们种了。','The flowers children planted.,这些花孩子们种。','a','A clear statement usually places the subject before the verb and the object after it.','清晰的陈述句通常先写主语，再写动词，最后写宾语。','undefined','undefined','undefined','undefined'),
('b-sentence-02','b-sentence','sentence-basics','beginner','Which words are the subject in “The young artist painted a mural”?','在“The young artist painted a mural”中，哪些词是主语？','The young artist,年轻的艺术家','painted,画了','a mural,一幅壁画','painted a mural,画了一幅壁画','a','The subject identifies who performs the action: “The young artist.”','主语指出动作的执行者，即“The young artist”。','undefined','undefined','undefined','undefined'),
('b-sentence-03','b-sentence','sentence-basics','beginner','Which sentence is complete?','哪个句子是完整的？','Because the bus was late.,因为公交车晚点了。','The bus arrived late.,公交车晚点到了。','When the rain stopped.,当雨停的时候。','After the long journey.,长途旅行之后。','b','“The bus arrived late” has a subject and a finite verb and expresses a complete thought.','“The bus arrived late”包含主语和限定动词，并表达了完整的意思。','undefined','undefined','undefined','undefined'),
('b-sentence-04','b-sentence','sentence-basics','beginner','In “Mina opened the window,” what is the object?','在“Mina opened the window”中，宾语是什么？','Mina,Mina','opened,打开了','the window,窗户','the,这个','c','The object receives the action. Mina opened what? The window.','宾语是动作的承受者。Mina打开了什么？窗户。','undefined','undefined','undefined','undefined'),
('b-present-01','b-present','verb-tenses','beginner','Which sentence describes a regular habit?','哪个句子描述经常性的习惯？','I am eating lunch right now.,我现在正在吃午饭。','I eat lunch at noon every day.,我每天中午吃午饭。','I ate lunch yesterday.,我昨天吃了午饭。','I will eat lunch later.,我稍后会吃午饭。','b','The present simple commonly describes routines and repeated actions.','一般现在时常用于描述日常习惯和重复发生的动作。','undefined','undefined','undefined','undefined'),
('b-present-02','b-present','verb-tenses','beginner','Choose the correct form: “She ___ to work by train.”','选择正确形式：“She ___ to work by train.”','travel,travel','travelling,travelling','travels,travels','travelled,travelled','c','With he, she or it in the present simple, most verbs take -s or -es.','一般现在时中，主语是he、she或it时，大多数动词要加-s或-es。','undefined','undefined','undefined','undefined'),
('b-present-03','b-present','verb-tenses','beginner','Which question is correct in the present simple?','哪个一般现在时疑问句是正确的？','Does he works here?,Does he works here?','Do he work here?,Do he work here?','Does he work here?,Does he work here?','Is he work here?,Is he work here?','c','After does, use the base form of the main verb: work, not works.','does后面要使用主要动词原形：work，而不是works。','undefined','undefined','undefined','undefined'),
('b-present-04','b-present','verb-tenses','beginner','Complete the negative sentence: “They ___ like spicy food.”','完成否定句：“They ___ like spicy food.”','doesn''t,doesn''t','don''t,don''t','isn''t,isn''t','aren''t,aren''t','b','Use do not (don''t) with I, you, we and they in present-simple negatives.','一般现在时否定句中，I、you、we和they搭配do not（don''t）。','undefined','undefined','undefined','undefined'),
('b-articles-01','b-articles','nouns-and-articles','beginner','Choose the correct article: “She adopted ___ cat.”','选择正确的冠词：“She adopted ___ cat.”','a,一只','an,一只','the,那只','no article,不需要冠词','a','Use a before a singular countable noun beginning with a consonant sound when it is not yet specific.','当单数可数名词以辅音音素开头且尚未特指时，使用a。','undefined','undefined','undefined','undefined'),
('b-articles-02','b-articles','nouns-and-articles','beginner','Choose the correct article: “He ate ___ orange.”','选择正确的冠词：“He ate ___ orange.”','a,一只','an,一只','the,那只','no article,不需要冠词','b','Use an before a singular countable noun beginning with a vowel sound.','单数可数名词以元音音素开头时，前面通常使用an。','undefined','undefined','undefined','undefined'),
('b-articles-03','b-articles','nouns-and-articles','beginner','You have already mentioned a book. Which phrase refers to that same book?','你已经提到一本书。哪个短语指的是同一本书？','a book,一本书','books,书籍','the book,那本书','book,书','c','Use the when the listener can identify the specific book from the context.','当听者可以根据上下文确定是哪一本书时，使用the。','undefined','undefined','undefined','undefined'),
('b-articles-04','b-articles','nouns-and-articles','beginner','Choose the natural sentence.','选择自然、正确的句子。','I enjoy the music.,我喜欢音乐。','I enjoy music.,我喜欢音乐。','I enjoy a music.,我喜欢一首音乐。','I enjoy musics.,我喜欢许多音乐。','b','Music is generally uncountable when referring to music as an activity or general concept, so no article is needed here.','music泛指音乐这一概念时通常是不可数名词，因此这里不需要冠词。','undefined','undefined','undefined','undefined'),
('b-count-01','b-countable-nouns','nouns-and-quantity','beginner','Which noun is countable?','哪个名词是可数名词？','advice,建议','furniture,家具','apple,苹果','information,信息','c','An apple can be counted as one apple, two apples and so on.','apple可以计数，例如one apple、two apples。','undefined','undefined','undefined','undefined'),
('b-count-02','b-countable-nouns','nouns-and-quantity','beginner','Choose the correct word: “How ___ books do you have?”','选择正确的词：“How ___ books do you have?”','much,多少','many,多少','little,少量','any,任何','b','Use many with plural countable nouns such as books.','many用于复数可数名词，例如books。','undefined','undefined','undefined','undefined'),
('b-count-03','b-countable-nouns','nouns-and-quantity','beginner','Choose the correct phrase.','选择正确的短语。','two advices,两个建议','two pieces of advice,两条建议','two advice,两个建议','two informations,两条信息','b','Advice is uncountable. To count it, say “two pieces of advice.”','advice是不可数名词。要表达数量，可以说“two pieces of advice”。','undefined','undefined','undefined','undefined'),
('b-count-04','b-countable-nouns','nouns-and-quantity','beginner','Which sentence uses “fewer” correctly?','哪个句子正确使用了“fewer”？','We have fewer time today.,我们今天时间更少。','There are fewer chairs in this room.,这个房间里的椅子更少。','She needs fewer water.,她需要更少的水。','I drank fewer milk.,我喝了更少的牛奶。','b','Use fewer with plural countable nouns such as chairs; use less with uncountable nouns.','fewer用于复数可数名词，例如chairs；less用于不可数名词。','undefined','undefined','undefined','undefined'),
('b-verb-01','b-verb-combinations','everyday-vocabulary','beginner','Choose the correct verb pattern: “I hope ___ you soon.”','选择正确的动词结构：“I hope ___ you soon.”','see,see','seeing,seeing','saw,saw','to seeing,to seeing','a','Hope is followed by a to-infinitive: hope to see.','hope后面接带to的不定式：hope to see。','undefined','undefined','undefined','undefined'),
('b-verb-02','b-verb-combinations','everyday-vocabulary','beginner','Choose the correct sentence.','选择正确的句子。','She enjoys to read.,She enjoys to read.','She enjoys reading.,She enjoys reading.','She enjoy reading.,She enjoy reading.','She enjoying read.,She enjoying read.','b','Enjoy is followed by a gerund (-ing form): enjoys reading.','enjoy后面接动名词（-ing形式）：enjoys reading。','undefined','undefined','undefined','undefined'),
('b-verb-03','b-verb-combinations','everyday-vocabulary','beginner','Which phrase is correct for completing a task or duty?','哪个短语表示完成一项任务或职责？','make homework,make homework','do homework,do homework','take homework,take homework','have homework,have homework','b','The usual collocation is “do homework.”','常见搭配是“do homework”。','undefined','undefined','undefined','undefined'),
('b-verb-04','b-verb-combinations','everyday-vocabulary','beginner','Choose the natural expression for a sport or activity: “They ___ swimming on Saturdays.”','选择描述运动或活动的自然表达：“They ___ swimming on Saturdays.”','go,go','make,make','do to,do to','take,take','a','Use go + -ing for many recreational activities, such as go swimming or go cycling.','许多休闲活动使用go + -ing结构，例如go swimming或go cycling。','undefined','undefined','undefined','undefined')
),
variants as (
 select question_id||'-zh' as question_id,source_lesson_id,topic_id,difficulty,'zh'::text as translation_language_code,
        prompt_learning,prompt_zh as prompt_translation,
        jsonb_build_array(
          jsonb_build_object('id','a','learning_text',a_learning,'translation_text',a_zh),
          jsonb_build_object('id','b','learning_text',b_learning,'translation_text',b_zh),
          jsonb_build_object('id','c','learning_text',c_learning,'translation_text',c_zh),
          jsonb_build_object('id','d','learning_text',d_learning,'translation_text',d_zh)
        ) as options,correct_option_id,explanation_learning,explanation_zh as explanation_translation
 from seed
 union all
 select question_id||'-en',source_lesson_id,topic_id,difficulty,'en',
        prompt_learning,prompt_learning,
        jsonb_build_array(
          jsonb_build_object('id','a','learning_text',a_learning,'translation_text',a_learning),
          jsonb_build_object('id','b','learning_text',b_learning,'translation_text',b_learning),
          jsonb_build_object('id','c','learning_text',c_learning,'translation_text',c_learning),
          jsonb_build_object('id','d','learning_text',d_learning,'translation_text',d_learning)
        ),correct_option_id,explanation_learning,explanation_learning
 from seed
)
insert into private.quiz_question_bank
(question_id,revision,learning_language_code,translation_language_code,source_lesson_id,topic_id,difficulty,prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,status,approved_at)
select question_id,1,'en',translation_language_code,source_lesson_id,topic_id,difficulty,prompt_learning,prompt_translation,options,correct_option_id,explanation_learning,explanation_translation,'approved',pg_catalog.now()
from variants
on conflict (question_id,revision) do nothing;
commit;
