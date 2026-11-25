-- SwiftDictionary U2.9.0 — publish the expanded English permanent lesson allowlist.
-- Includes two lessons already present in the browser catalogue but missing from
-- the server allowlist, plus three new curriculum-led additions.
begin;

insert into private.learning_content_catalog
  (activity_type,content_id,topic_id,difficulty,language_code,is_active)
values
  ('permanent_lesson','b-greetings-polite-expressions','everyday-vocabulary','beginner','en',true),
  ('permanent_lesson','b-places-getting-around','everyday-vocabulary','beginner','en',true),
  ('permanent_lesson','b-question-forms-negatives','sentence-basics','beginner','en',true),
  ('permanent_lesson','i-passive-voice','verb-tenses','intermediate','en',true),
  ('permanent_lesson','a-reported-speech','advanced-grammar','advanced','en',true)
on conflict (activity_type,content_id,language_code) do update
set topic_id=excluded.topic_id,
    difficulty=excluded.difficulty,
    is_active=excluded.is_active,
    updated_at=pg_catalog.now();

comment on table private.learning_content_catalog is
  'Server-only allowlist of stable SwiftDictionary learning content IDs and topic mappings. No answer-level data is stored.';

commit;
