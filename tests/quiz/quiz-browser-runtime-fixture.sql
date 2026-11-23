-- Disposable-only approved synthetic content for authenticated Quiz browser tests.
-- This fixture must only run against the local Supabase stack in CI.
\set ON_ERROR_STOP on

insert into private.learning_content_catalog(
  activity_type, content_id, topic_id, difficulty, language_code, is_active
)
select
  'permanent_lesson',
  d.prefix || '-runtime-lesson-' || n,
  'quiz-runtime-topic-' || d.prefix || '-' || n,
  d.difficulty,
  'en',
  true
from (values ('b','beginner'),('i','intermediate'),('a','advanced')) d(prefix,difficulty)
cross join generate_series(1,20) n
on conflict (activity_type,content_id,language_code)
do update set
  topic_id=excluded.topic_id,
  difficulty=excluded.difficulty,
  is_active=true;

insert into private.quiz_question_bank(
  question_id, revision, learning_language_code, translation_language_code,
  source_lesson_id, topic_id, difficulty, learning_objective_id, prompt_learning, prompt_translation,
  options, correct_option_id, explanation_learning, explanation_translation, status
)
select
  d.prefix || '-runtime-' || lpad(n::text,3,'0'),
  1,
  'en',
  'zh',
  d.prefix || '-runtime-lesson-' || (((n-1)%20)+1),
  'quiz-runtime-topic-' || d.prefix || '-' || (((n-1)%20)+1),
  d.difficulty,
  'runtime-objective-' || d.prefix,
  'Runtime test question ' || d.difficulty || ' ' || n || ': choose the correct answer.',
  '运行测试题' || n || '：请选择正确答案。',
  jsonb_build_array(
    jsonb_build_object('id','a','learning_text','Correct answer','translation_text','正确答案'),
    jsonb_build_object('id','b','learning_text','Incorrect option one','translation_text','错误选项一'),
    jsonb_build_object('id','c','learning_text','Incorrect option two','translation_text','错误选项二'),
    jsonb_build_object('id','d','learning_text','Incorrect option three','translation_text','错误选项三')
  ),
  'a',
  'This is synthetic test content; option A is the correct answer.',
  '这是合成测试内容；选项 A 是正确答案。',
  'approved'
from (
  select 'b' as prefix, 'beginner' as difficulty, n from generate_series(1,60) n
  union all
  select 'i', 'intermediate', n from generate_series(1,60) n
  union all
  select 'a', 'advanced', n from generate_series(1,60) n
) d;

-- Separate English-translation fixture rows exercise the session-snapshot
-- fallback when a learner changes their preference to Chinese mid-session.
insert into private.quiz_question_bank(
  question_id, revision, learning_language_code, translation_language_code,
  source_lesson_id, topic_id, difficulty, learning_objective_id, prompt_learning, prompt_translation,
  options, correct_option_id, explanation_learning, explanation_translation, status
)
select
  'b-runtime-en-' || lpad(n::text,3,'0'),
  1,
  'en',
  'en',
  'b-runtime-lesson-' || (((n-1)%20)+1),
  'quiz-runtime-topic-b-' || (((n-1)%20)+1),
  'beginner',
  'runtime-objective-b',
  'English snapshot test question ' || n || ': choose the correct answer.',
  'English snapshot test question ' || n || ': choose the correct answer.',
  jsonb_build_array(
    jsonb_build_object('id','a','learning_text','Correct answer','translation_text','Correct answer'),
    jsonb_build_object('id','b','learning_text','Incorrect option one','translation_text','Incorrect option one'),
    jsonb_build_object('id','c','learning_text','Incorrect option two','translation_text','Incorrect option two'),
    jsonb_build_object('id','d','learning_text','Incorrect option three','translation_text','Incorrect option three')
  ),
  'a',
  'This synthetic English-only snapshot has no Chinese translation.',
  'This synthetic English-only snapshot has no Chinese translation.',
  'approved'
from generate_series(1,30) n;


-- Type-specific synthetic questions for the authenticated runtime tests.
insert into private.quiz_question_bank(
  question_id,revision,learning_language_code,translation_language_code,
  source_lesson_id,topic_id,difficulty,question_type,answer_language_code,learning_objective_id,
  prompt_learning,prompt_translation,options,correct_option_id,
  explanation_learning,explanation_translation,status
)
select
  d.prefix||'-runtime-def-'||d.lang||'-'||n,1,'en',d.lang,
  d.prefix||'-runtime-lesson-'||(((n-1)%20)+1),'quiz-runtime-topic-'||d.prefix||'-'||(((n-1)%20)+1),
  d.difficulty,'word_definition','en','runtime-objective-'||d.prefix,
  'Definition runtime question '||n||' for '||d.lang,
  case when d.lang='zh' then '定义运行测试题'||n||'：请选择正确释义。'
       else 'Definition runtime question '||n||' for '||d.lang end,
  jsonb_build_array(
    jsonb_build_object('id','a','learning_text','Correct meaning','translation_text','正确含义'),
    jsonb_build_object('id','b','learning_text','Wrong meaning one','translation_text','错误含义一'),
    jsonb_build_object('id','c','learning_text','Wrong meaning two','translation_text','错误含义二'),
    jsonb_build_object('id','d','learning_text','Wrong meaning three','translation_text','错误含义三')
  ),
  'a','Option A is the intended definition.','选项 A 是正确释义。','approved'
from (values
  ('b','beginner','zh'),('i','intermediate','zh'),('a','advanced','zh'),
  ('b','beginner','en'),('i','intermediate','en'),('a','advanced','en')
) d(prefix,difficulty,lang)
cross join generate_series(1,3) n;

insert into private.quiz_question_bank(
  question_id,revision,learning_language_code,translation_language_code,
  source_lesson_id,topic_id,difficulty,question_type,answer_language_code,learning_objective_id,
  prompt_learning,prompt_translation,options,correct_option_id,
  explanation_learning,explanation_translation,status
)
select
  d.prefix||'-runtime-zh-'||n,1,'en','zh',
  d.prefix||'-runtime-lesson-'||(((n-1)%20)+1),'quiz-runtime-topic-'||d.prefix||'-'||(((n-1)%20)+1),
  d.difficulty,'chinese_translation','zh','runtime-objective-'||d.prefix,
  'Choose the most accurate Simplified Chinese translation for runtime item '||n||'.',
  '请选择运行测试题'||n||'最准确的简体中文翻译。',
  jsonb_build_array(
    jsonb_build_object('id','a','learning_text','Correct gloss','translation_text','正确翻译'),
    jsonb_build_object('id','b','learning_text','Wrong gloss one','translation_text','错误翻译一'),
    jsonb_build_object('id','c','learning_text','Wrong gloss two','translation_text','错误翻译二'),
    jsonb_build_object('id','d','learning_text','Wrong gloss three','translation_text','错误翻译三')
  ),
  'a','Option A is the intended Chinese translation.','选项 A 是准确的中文翻译。','approved'
from (values ('b','beginner'),('i','intermediate'),('a','advanced')) d(prefix,difficulty)
cross join generate_series(1,21) n;


-- Fail early if the synthetic bank does not satisfy the authenticated runtime
-- RPC's minimum pool and distinct-topic requirements for every difficulty.
do $runtime_fixture_assert$
declare v record;
begin
  for v in
    select d.difficulty,
           count(q.question_id)::integer as question_count,
           count(distinct q.topic_id)::integer as topic_count,
           count(*) filter (where c.content_id is null)::integer as bad_catalogue_links
    from (values ('beginner'),('intermediate'),('advanced')) d(difficulty)
    left join private.quiz_question_bank q
      on q.difficulty=d.difficulty
     and q.learning_language_code='en'
     and q.translation_language_code='zh'
     and q.status='approved'
     and q.question_id like case d.difficulty
       when 'beginner' then 'b-runtime-%'
       when 'intermediate' then 'i-runtime-%'
       else 'a-runtime-%' end
    left join private.learning_content_catalog c
      on c.activity_type='permanent_lesson'
     and c.content_id=q.source_lesson_id
     and c.topic_id=q.topic_id
     and c.language_code=q.learning_language_code
     and c.is_active
    group by d.difficulty
  loop
    if v.question_count < 20 or v.topic_count < 3 or v.bad_catalogue_links > 0 then
      raise exception 'Runtime fixture invalid for %: questions %, topics %, bad catalogue links %',
        v.difficulty,v.question_count,v.topic_count,v.bad_catalogue_links;
    end if;
  end loop;

-- Chinese-learning synthetic bank for U2.8.0 browser coverage. These rows
-- exist only in the disposable local Supabase CI database.
insert into private.learning_content_catalog(
  activity_type,content_id,topic_id,difficulty,language_code,is_active
)
select 'permanent_lesson',
       'zh-'||d.prefix||'-runtime-lesson-'||n,
       'quiz-runtime-topic-zh-'||d.prefix||'-'||n,
       d.difficulty,'zh',true
from (values ('b','beginner'),('i','intermediate'),('a','advanced')) d(prefix,difficulty)
cross join generate_series(1,3) n
on conflict(activity_type,content_id,language_code)
do update set topic_id=excluded.topic_id,difficulty=excluded.difficulty,is_active=true;

with numbered as (
 select gs,
   case when gs<=30 then 'beginner' when gs<=66 then 'intermediate' else 'advanced' end as difficulty,
   case when gs<=30 then 'b' when gs<=66 then 'i' else 'a' end as prefix,
   ((gs-1)%3)+1 as topic_number
 from generate_series(1,114) gs
)
insert into private.quiz_question_bank(
 question_id,revision,learning_language_code,translation_language_code,
 source_lesson_id,topic_id,difficulty,question_type,answer_language_code,
 learning_objective_id,prompt_learning,prompt_translation,prompt_pinyin,options,
 correct_option_id,explanation_learning,explanation_translation,explanation_pinyin,status,approved_at
)
select
 'zh-'||prefix||'-runtime-'||lpad(gs::text,3,'0'),1,'zh','en',
 'zh-'||prefix||'-runtime-lesson-'||topic_number,
 'quiz-runtime-topic-zh-'||prefix||'-'||topic_number,difficulty,'knowledge','zh',
 'zh-runtime-objective-'||prefix,
 '哪个汉字表示“好”？','Which Chinese character means “good”?','nǎ gè hàn zì biǎo shì hǎo?',
 jsonb_build_array(
  jsonb_build_object('id','o1','learning_text','好','translation_text','good','pinyin','hǎo'),
  jsonb_build_object('id','o2','learning_text','大','translation_text','big','pinyin','dà'),
  jsonb_build_object('id','o3','learning_text','小','translation_text','small','pinyin','xiǎo'),
  jsonb_build_object('id','o4','learning_text','人','translation_text','person','pinyin','rén')
 ),
 'o1','“好”表示良好、不错或令人满意。','好 means good, well or satisfactory.',
 '“hǎo” biǎo shì liáng hǎo, bú cuò huò lìng rén mǎn yì.','approved',now()
from numbered
on conflict(question_id,revision) do nothing;

with numbered as (
 select gs,
   case when gs<=21 then 'beginner' when gs<=42 then 'intermediate' else 'advanced' end as difficulty,
   case when gs<=21 then 'b' when gs<=42 then 'i' else 'a' end as prefix,
   ((gs-1)%3)+1 as topic_number
 from generate_series(1,63) gs
)
insert into private.quiz_question_bank(
 question_id,revision,learning_language_code,translation_language_code,
 source_lesson_id,topic_id,difficulty,question_type,answer_language_code,
 learning_objective_id,prompt_learning,prompt_translation,prompt_pinyin,options,
 correct_option_id,explanation_learning,explanation_translation,explanation_pinyin,status,approved_at
)
select
 'zh-'||prefix||'-runtime-en-'||lpad(gs::text,3,'0'),1,'zh','en',
 'zh-'||prefix||'-runtime-lesson-'||topic_number,
 'quiz-runtime-topic-zh-'||prefix||'-'||topic_number,difficulty,'chinese_translation','zh',
 'zh-runtime-objective-'||prefix,
 'Translate “good morning” into Simplified Chinese (runtime item '||gs||').',
 'Choose the most natural Simplified Chinese equivalent.','',
 jsonb_build_array(
  jsonb_build_object('id','o1','learning_text','good morning','translation_text','早上好','pinyin','zǎo shang hǎo'),
  jsonb_build_object('id','o2','learning_text','thank you','translation_text','谢谢','pinyin','xiè xie'),
  jsonb_build_object('id','o3','learning_text','goodbye','translation_text','再见','pinyin','zài jiàn'),
  jsonb_build_object('id','o4','learning_text','you are welcome','translation_text','不客气','pinyin','bú kè qi')
 ),
 'o1','“早上好”是早晨见面时常用的问候语。','早上好 is a common morning greeting.',
 '“zǎo shang hǎo” shì zǎo chén jiàn miàn shí cháng yòng de wèn hòu yǔ.','approved',now()
from numbered
on conflict(question_id,revision) do nothing;

do $chinese_runtime_fixture_assert$
declare v record;
begin
  for v in
    select d.difficulty,
      count(q.question_id) filter(where q.question_type='knowledge')::integer as knowledge_count,
      count(distinct q.topic_id) filter(where q.question_type='knowledge')::integer as knowledge_topics,
      count(q.question_id) filter(where q.question_type='chinese_translation')::integer as translation_count
    from (values ('beginner'),('intermediate'),('advanced')) d(difficulty)
    left join private.quiz_question_bank q
      on q.difficulty=d.difficulty
     and q.learning_language_code='zh'
     and q.translation_language_code='en'
     and q.status='approved'
     and q.question_id like case d.difficulty
       when 'beginner' then 'zh-b-runtime-%'
       when 'intermediate' then 'zh-i-runtime-%'
       else 'zh-a-runtime-%' end
    group by d.difficulty
  loop
    if v.knowledge_count < case v.difficulty when 'beginner' then 30 when 'intermediate' then 36 else 48 end
       or v.knowledge_topics < 3 or v.translation_count < 21 then
      raise exception 'Chinese runtime fixture invalid for %: knowledge %, topics %, translations %',
        v.difficulty,v.knowledge_count,v.knowledge_topics,v.translation_count;
    end if;
  end loop;
end;
$chinese_runtime_fixture_assert$;

end;
$runtime_fixture_assert$;
