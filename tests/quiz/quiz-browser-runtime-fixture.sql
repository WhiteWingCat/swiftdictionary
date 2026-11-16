-- Disposable-only approved synthetic content for authenticated Quiz browser tests.
-- This fixture must only run against the local Supabase stack in CI.
\set ON_ERROR_STOP on

insert into public.user_preferences(user_id, learning_language, translation_language, timezone)
values
  (:'free_user_id'::uuid, 'en', 'zh', 'Asia/Kuala_Lumpur'),
  (:'premium_user_id'::uuid, 'en', 'zh', 'Asia/Kuala_Lumpur')
on conflict (user_id) do update set
  learning_language=excluded.learning_language,
  translation_language=excluded.translation_language,
  timezone=excluded.timezone;

insert into public.user_entitlements(user_id, plan_code, status)
values
  (:'free_user_id'::uuid, 'free', 'active'),
  (:'premium_user_id'::uuid, 'premium', 'active')
on conflict (user_id) do update set
  plan_code=excluded.plan_code,
  status='active',
  valid_from=null,
  valid_until=null;

update public.learning_plan_limits
set daily_limit=1, is_enabled=true
where plan_code='free' and activity_type='quiz';

update public.learning_plan_limits
set daily_limit=3, is_enabled=true
where plan_code='premium' and activity_type='quiz';

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
cross join generate_series(1,5) n
on conflict (activity_type,content_id,language_code)
do update set
  topic_id=excluded.topic_id,
  difficulty=excluded.difficulty,
  is_active=true;

insert into private.quiz_question_bank(
  question_id, revision, learning_language_code, translation_language_code,
  source_lesson_id, topic_id, difficulty, prompt_learning, prompt_translation,
  options, correct_option_id, explanation_learning, explanation_translation, status
)
select
  d.prefix || '-runtime-' || lpad(n::text,3,'0'),
  1,
  'en',
  'zh',
  d.prefix || '-runtime-lesson-' || (((n-1)%5)+1),
  'quiz-runtime-topic-' || (((n-1)%5)+1),
  d.difficulty,
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
  select 'b' as prefix, 'beginner' as difficulty, n from generate_series(1,30) n
  union all
  select 'i', 'intermediate', n from generate_series(1,36) n
  union all
  select 'a', 'advanced', n from generate_series(1,48) n
) d;
