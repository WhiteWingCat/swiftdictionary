-- Disposable-only approved synthetic content for authenticated Quiz browser tests.
-- This fixture must only run against the local Supabase stack in CI.
\set ON_ERROR_STOP on

insert into private.learning_content_catalog(
  activity_type, content_id, topic_id, difficulty, language_code, is_active
)
select
  'permanent_lesson',
  d.prefix || '-runtime-lesson-' || n,
  'quiz-runtime-topic-' || n,
  d.difficulty,
  'en',
  true
from (values ('b','beginner'),('i','intermediate'),('a','advanced')) d(prefix,difficulty)
cross join generate_series(1,10) n
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
  d.prefix || '-runtime-lesson-' || (((n-1)%10)+1),
  'quiz-runtime-topic-' || (((n-1)%10)+1),
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
  'b-runtime-lesson-' || (((n-1)%10)+1),
  'quiz-runtime-topic-' || (((n-1)%10)+1),
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
  d.prefix||'-runtime-lesson-'||(((n-1)%10)+1),'quiz-runtime-topic-'||(((n-1)%10)+1),
  d.difficulty,'word_definition','en','runtime-objective-'||d.prefix,
  'Definition runtime question '||n||' for '||d.lang,
  'Definition runtime question '||n||' for '||d.lang,
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
  d.prefix||'-runtime-lesson-'||(((n-1)%10)+1),'quiz-runtime-topic-'||(((n-1)%10)+1),
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
