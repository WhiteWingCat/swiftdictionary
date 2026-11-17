-- Local-only fixture for validating the draft Quiz content importer.
-- It mirrors the stable English permanent-lesson mappings in production.

insert into private.learning_content_catalog(
  activity_type,content_id,topic_id,difficulty,language_code,is_active
) values
 ('permanent_lesson','b-verb-combinations','everyday-vocabulary','beginner','en',true),
 ('permanent_lesson','b-articles','nouns-and-articles','beginner','en',true),
 ('permanent_lesson','b-countable-nouns','nouns-and-quantity','beginner','en',true),
 ('permanent_lesson','b-sentence','sentence-basics','beginner','en',true),
 ('permanent_lesson','b-present','verb-tenses','beginner','en',true),
 ('permanent_lesson','i-collocations','collocations','intermediate','en',true),
 ('permanent_lesson','i-conditionals','conditional-sentences','intermediate','en',true),
 ('permanent_lesson','i-phrasal','phrasal-verbs','intermediate','en',true),
 ('permanent_lesson','i-perfect','verb-tenses','intermediate','en',true),
 ('permanent_lesson','i-word-families','word-formation','intermediate','en',true),
 ('permanent_lesson','a-hedging','academic-professional-english','advanced','en',true),
 ('permanent_lesson','a-inversion','advanced-grammar','advanced','en',true),
 ('permanent_lesson','a-mixed-conditionals','advanced-grammar','advanced','en',true),
 ('permanent_lesson','a-idioms','idioms-fixed-expressions','advanced','en',true),
 ('permanent_lesson','a-near-synonyms','precise-vocabulary','advanced','en',true)
on conflict (activity_type,content_id,language_code)
do update set topic_id=excluded.topic_id,difficulty=excluded.difficulty,is_active=excluded.is_active;

do $assert_catalog$
begin
  if (select count(*) from private.learning_content_catalog
      where activity_type='permanent_lesson'
        and content_id in (
          'b-verb-combinations','b-articles','b-countable-nouns','b-sentence','b-present',
          'i-collocations','i-conditionals','i-phrasal','i-perfect','i-word-families',
          'a-hedging','a-inversion','a-mixed-conditionals','a-idioms','a-near-synonyms'
        )
        and is_active) <> 15 then
    raise exception 'Quiz content source lesson fixtures are incomplete';
  end if;
end;
$assert_catalog$;
