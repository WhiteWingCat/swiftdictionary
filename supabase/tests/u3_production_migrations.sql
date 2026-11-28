-- SwiftDictionary U3.0 production migration verification.
-- Run after the complete U3.0 production migration sequence.
do $assert$
declare
  v_count integer;
  v_en integer;
  v_zh integer;
begin
  if not exists(select 1 from public.languages where code='ms' and is_active) then
    raise exception 'Malay language is not active';
  end if;

  select count(*) into v_count from private.learning_content_catalog where language_code='ms';
  if v_count<>340 then raise exception 'Expected 340 Malay catalogue rows, found %',v_count; end if;

  select count(*) into v_count from private.learning_content_catalog
    where language_code='ms' and activity_type='daily_discovery' and is_active;
  if v_count<>93 then raise exception 'Expected 93 active Malay Discovery rows, found %',v_count; end if;

  select count(*) into v_count from private.learning_content_catalog
    where language_code='ms' and activity_type='daily_topic' and is_active;
  if v_count<>60 then raise exception 'Expected 60 active Malay Topic rows, found %',v_count; end if;

  select count(*) into v_count from private.learning_content_catalog
    where language_code='ms' and activity_type='daily_application' and is_active;
  if v_count<>60 then raise exception 'Expected 60 active Malay Application rows, found %',v_count; end if;

  select count(*) into v_count from private.learning_content_catalog
    where language_code='ms' and activity_type='permanent_lesson' and is_active;
  if v_count<>72 then raise exception 'Expected 72 active Malay permanent lessons, found %',v_count; end if;

  select count(*) into v_count from private.quiz_question_bank
    where learning_language_code='ms' and status='approved';
  select count(*) into v_en from private.quiz_question_bank
    where learning_language_code='ms' and status='approved' and translation_language_code='en';
  select count(*) into v_zh from private.quiz_question_bank
    where learning_language_code='ms' and status='approved' and translation_language_code='zh';
  if v_count<>240 or v_en<>120 or v_zh<>120 then
    raise exception 'Expected 240 approved Malay Quiz questions (120 per support language); got total %, en %, zh %',
      v_count,v_en,v_zh;
  end if;

  if not exists(
    select 1 from pg_constraint
    where conrelid='public.learning_page_introduction_preferences'::regclass
      and conname='learning_page_introduction_preferences_page_key_check'
      and pg_get_constraintdef(oid) like '%release:%'
  ) then raise exception 'Release-note preference constraint is missing'; end if;

  if not ('release:3.0.0' ~ '^release:[0-9]+\.[0-9]+\.[0-9]+$') then
    raise exception 'Release-note version pattern rejected release:3.0.0';
  end if;
end;
$assert$;
