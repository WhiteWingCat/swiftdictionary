\set ON_ERROR_STOP on
begin;

do $catalog$
declare
  v_count integer;
  v_expected record;
begin
  select count(*) into v_count
  from private.learning_content_catalog
  where activity_type='permanent_lesson'
    and language_code='en'
    and is_active;
  if v_count <> 20 then
    raise exception 'Expected 20 active English permanent lessons, found %', v_count;
  end if;

  for v_expected in
    select * from (values
      ('b-greetings-polite-expressions','everyday-vocabulary','beginner'),
      ('b-places-getting-around','everyday-vocabulary','beginner'),
      ('b-question-forms-negatives','sentence-basics','beginner'),
      ('i-passive-voice','verb-tenses','intermediate'),
      ('a-reported-speech','advanced-grammar','advanced')
    ) as expected(content_id,topic_id,difficulty)
  loop
    if not exists (
      select 1 from private.learning_content_catalog c
      where c.activity_type='permanent_lesson'
        and c.content_id=v_expected.content_id
        and c.topic_id=v_expected.topic_id
        and c.difficulty=v_expected.difficulty
        and c.language_code='en'
        and c.is_active
    ) then
      raise exception 'Missing or mismatched English lesson catalogue row: %', v_expected.content_id;
    end if;
  end loop;
end;
$catalog$;

set local role authenticated;
select pg_catalog.set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);

do $auth$
begin
  if not private.is_approved_learning_content('permanent_lesson','b-greetings-polite-expressions','everyday-vocabulary','beginner','en','daily')
     or not private.is_approved_learning_content('permanent_lesson','b-places-getting-around','everyday-vocabulary','beginner','en','daily')
     or not private.is_approved_learning_content('permanent_lesson','b-question-forms-negatives','sentence-basics','beginner','en','daily')
     or not private.is_approved_learning_content('permanent_lesson','i-passive-voice','verb-tenses','intermediate','en','daily')
     or not private.is_approved_learning_content('permanent_lesson','a-reported-speech','advanced-grammar','advanced','en','daily') then
    raise exception 'One or more expanded English lessons are not accepted by the server allowlist';
  end if;

  if private.is_approved_learning_content('permanent_lesson','i-passive-voice','advanced-grammar','intermediate','en','daily') then
    raise exception 'Lesson allowlist accepted an incorrect topic mapping';
  end if;
end;
$auth$;

rollback;
