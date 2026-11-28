-- SwiftDictionary U3.0 — validate the seeded Malay catalogue metadata baseline.
-- Detailed topic/application metadata alignment is applied by the later 20261127190000 migration.
begin;
do $assert$
declare
  v_total integer;
  v_discovery integer;
  v_discovery_active integer;
  v_topics_apps integer;
  v_lessons integer;
begin
  select count(*) into v_total from private.learning_content_catalog where language_code='ms';
  select count(*) into v_discovery from private.learning_content_catalog
    where language_code='ms' and activity_type='daily_discovery';
  select count(*) into v_discovery_active from private.learning_content_catalog
    where language_code='ms' and activity_type='daily_discovery' and is_active;
  select count(*) into v_topics_apps from private.learning_content_catalog
    where language_code='ms' and activity_type in ('daily_topic','daily_application')
      and is_active and topic_id is not null and difficulty is not null;
  select count(*) into v_lessons from private.learning_content_catalog
    where language_code='ms' and activity_type='permanent_lesson' and is_active;
  if v_total<>340 or v_discovery<>148 or v_discovery_active<>93
     or v_topics_apps<>120 or v_lessons<>72 then
    raise exception 'Malay catalogue metadata baseline mismatch: total %, discovery %/% active, topic/application %, lessons %',
      v_total,v_discovery,v_discovery_active,v_topics_apps,v_lessons;
  end if;
end;
$assert$;
commit;
