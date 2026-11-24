-- Read-only regression checks for the U2.8.0 Chinese Quiz content polish.
-- Staging keeps its owner-approved bank approved; CI keeps the same source bank draft.
do $$
declare
  question_count integer;
  polished_count integer;
  leak_count integer;
  invalid_option_count integer;
  status_kinds integer;
begin
  with latest as (
    select distinct on(question_id) *
    from private.quiz_question_bank
    where learning_language_code='zh' and translation_language_code='en'
    order by question_id,revision desc
  )
  select count(*) into question_count
  from latest where status in ('approved','draft');
  if question_count<>145 then
    raise exception 'Expected 145 current Chinese Quiz questions, found %',question_count;
  end if;

  with latest as (
    select distinct on(question_id) *
    from private.quiz_question_bank
    where learning_language_code='zh' and translation_language_code='en'
    order by question_id,revision desc
  )
  select count(distinct status) into status_kinds
  from latest where status in ('approved','draft');
  if status_kinds<>1 then
    raise exception 'Chinese Quiz content must retain one consistent release status (draft or approved)';
  end if;

  with latest as (
    select distinct on(question_id) *
    from private.quiz_question_bank
    where learning_language_code='zh' and translation_language_code='en'
    order by question_id,revision desc
  )
  select count(*) into polished_count
  from latest
  where status in ('approved','draft')
    and question_id in (
      'zh-en-i-grammar-particles-04','zh-en-i-grammar-particles-06',
      'zh-en-i-grammar-particles-07','zh-en-b-questions-negation-06',
      'zh-en-b-pinyin-foundations-05','zh-en-b-pinyin-foundations-06',
      'zh-en-b-places-getting-around-04','zh-en-i-measure-words-03',
      'zh-en-a-complex-sentences-07','zh-en-extra-01','zh-en-extra-09',
      'zh-en-extra-10','zh-en-b-pinyin-translation-01',
      'zh-en-b-pronouns-basic-sentences-04','zh-en-a-connectors-06',
      'zh-en-a-natural-expression-literature-06','zh-en-i-comparisons-01',
      'zh-en-i-comparisons-06','zh-en-i-sentence-expansion-05',
      'zh-en-extra-05','zh-en-extra-06','zh-en-extra-13','zh-en-extra-14'
    );
  if polished_count<>23 then
    raise exception 'Expected 23 active polished questions, found %',polished_count;
  end if;

  with latest as (
    select distinct on(question_id) *
    from private.quiz_question_bank
    where learning_language_code='zh' and translation_language_code='en'
    order by question_id,revision desc
  )
  select count(*) into invalid_option_count
  from latest q
  where q.status in ('approved','draft')
    and (
      jsonb_array_length(q.options)<>4
      or (select count(*) from jsonb_array_elements(q.options) o
          where o.value->>'id'=q.correct_option_id)<>1
      or (select count(distinct o.value->>'id')
          from jsonb_array_elements(q.options) o)<>4
    );
  if invalid_option_count<>0 then
    raise exception 'Found % questions with invalid option sets or answer keys',invalid_option_count;
  end if;

  with latest as (
    select distinct on(question_id) *
    from private.quiz_question_bank
    where learning_language_code='zh' and translation_language_code='en'
    order by question_id,revision desc
  ), correct as (
    select q.*,
      (select o.value from jsonb_array_elements(q.options) o(value)
       where o.value->>'id'=q.correct_option_id limit 1) as answer
    from latest q
    where q.status in ('approved','draft') and q.question_type='knowledge'
  ), normalized as (
    select *,
      regexp_replace(lower(coalesce(prompt_learning,'')),'[[:space:][:punct:]]','','g') as prompt_zh,
      regexp_replace(lower(coalesce(prompt_translation,'')),'[[:space:][:punct:]]','','g') as prompt_en,
      regexp_replace(lower(coalesce(prompt_pinyin,'')),'[[:space:][:punct:]]','','g') as prompt_py,
      regexp_replace(lower(coalesce(answer->>'learning_text','')),'[[:space:][:punct:]]','','g') as answer_zh,
      regexp_replace(lower(coalesce(answer->>'translation_text','')),'[[:space:][:punct:]]','','g') as answer_en,
      regexp_replace(lower(coalesce(answer->>'pinyin','')),'[[:space:][:punct:]]','','g') as answer_py
    from correct
  )
  select count(*) into leak_count
  from normalized
  where
    (answer_zh ~ '[一-龥]' and length(answer_zh)>=2 and strpos(prompt_zh,answer_zh)>0)
    or (length(answer_en)>=4 and strpos(prompt_en,answer_en)>0)
    or (length(answer_py)>=4 and prompt_py<>'' and strpos(prompt_py,answer_py)>0)
    or (
      answer_zh ~ '^[a-züǖǘǚǜāáǎàēéěèīíǐìōóǒòūúǔùńň ]+$'
      and length(answer_zh)>=4 and prompt_py<>'' and strpos(prompt_py,answer_zh)>0
    );
  if leak_count<>0 then
    raise exception 'Found % direct-answer or Pinyin-guide leaks in Chinese knowledge questions',leak_count;
  end if;

  if exists (
    select 1
    from (
      select distinct on(question_id) *
      from private.quiz_question_bank
      where learning_language_code='zh' and translation_language_code='en'
      order by question_id,revision desc
    ) latest
    where status in ('approved','draft')
      and question_id in ('zh-en-b-pinyin-foundations-05','zh-en-b-pinyin-foundations-06')
      and coalesce(btrim(prompt_pinyin),'')<>''
  ) then
    raise exception 'Pinyin foundation prompts must not expose their Pinyin answers';
  end if;

  if exists (
    select 1
    from (
      select distinct on(question_id) *
      from private.quiz_question_bank
      where learning_language_code='zh' and translation_language_code='en'
      order by question_id,revision desc
    ) latest
    where status in ('approved','draft')
      and question_id='zh-en-i-grammar-particles-06'
      and prompt_pinyin ilike '%nǐ ne%'
  ) then
    raise exception 'Topic-return Pinyin answer leaked into its prompt guide';
  end if;
end
$$;
