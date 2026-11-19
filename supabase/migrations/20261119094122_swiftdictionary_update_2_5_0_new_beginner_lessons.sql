-- SwiftDictionary Update 2.5.0 — publish the two new Beginner lessons.
-- The permanent lesson content and Simplified Chinese copy live in the frontend;
-- this server-only catalogue allowlist enables authenticated progress tracking.
begin;
insert into private.learning_content_catalog
  (activity_type,content_id,rotation_order,topic_id,difficulty,language_code,is_active)
values
  ('permanent_lesson','b-greetings-polite-expressions',null,'everyday-vocabulary','beginner','en',true),
  ('permanent_lesson','b-places-getting-around',null,'everyday-vocabulary','beginner','en',true)
on conflict (activity_type,content_id,language_code) do update
set rotation_order=excluded.rotation_order,
    topic_id=excluded.topic_id,
    difficulty=excluded.difficulty,
    is_active=excluded.is_active,
    updated_at=pg_catalog.now();
commit;
