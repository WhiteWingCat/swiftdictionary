-- Ensure the approved Chinese Quiz bank has no prompt Pinyin that reveals the correct answer.
begin;
update private.quiz_question_bank q
set prompt_pinyin=null,updated_at=pg_catalog.now()
where q.learning_language_code='zh'
  and q.status='approved'
  and nullif(btrim(q.prompt_pinyin),'') is not null
  and exists (
    select 1
    from pg_catalog.jsonb_array_elements(q.options) as option_row(value)
    where option_row.value->>'id'=q.correct_option_id
      and nullif(btrim(option_row.value->>'pinyin'),'') is not null
      and pg_catalog.strpos(
        pg_catalog.lower(q.prompt_pinyin),
        pg_catalog.lower(option_row.value->>'pinyin')
      )>0
  );
commit;