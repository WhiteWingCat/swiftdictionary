-- Preserve Quiz question history while removing answer-revealing Pinyin guides
-- from both draft and approved Chinese Quiz content.
begin;

create temporary table _u28_chinese_quiz_pinyin_safety_current
on commit drop as
with latest as (
 select distinct on(question_id) q.*
 from private.quiz_question_bank q
 where q.learning_language_code='zh'
   and q.translation_language_code='en'
 order by q.question_id,q.revision desc
)
select q.*
from latest q
where q.status in ('approved','draft')
  and nullif(btrim(q.prompt_pinyin),'') is not null
  and exists (
    select 1
    from jsonb_array_elements(q.options) as option_row(value)
    where option_row.value->>'id'=q.correct_option_id
      and (
        (
          length(regexp_replace(lower(coalesce(option_row.value->>'pinyin','')),
            '[[:space:][:punct:]]','','g'))>=4
          and strpos(
            regexp_replace(lower(coalesce(q.prompt_pinyin,'')),
              '[[:space:][:punct:]]','','g'),
            regexp_replace(lower(coalesce(option_row.value->>'pinyin','')),
              '[[:space:][:punct:]]','','g')
          )>0
        )
        or (
          regexp_replace(lower(coalesce(option_row.value->>'learning_text','')),
            '[[:space:][:punct:]]','','g')
            ~ '^[a-züǖǘǚǜāáǎàēéěèīíǐìōóǒòūúǔùńň ]+$'
          and length(regexp_replace(lower(coalesce(option_row.value->>'learning_text','')),
            '[[:space:][:punct:]]','','g'))>=4
          and strpos(
            regexp_replace(lower(coalesce(q.prompt_pinyin,'')),
              '[[:space:][:punct:]]','','g'),
            regexp_replace(lower(coalesce(option_row.value->>'learning_text','')),
              '[[:space:][:punct:]]','','g')
          )>0
        )
      )
  );

do $$
declare v_count integer;
begin
 select count(*) into v_count from _u28_chinese_quiz_pinyin_safety_current;
 raise notice 'Removing answer-revealing Pinyin guides from % current Chinese Quiz revisions',v_count;
end $$;

update private.quiz_question_bank q
set status='retired',approved_at=null,updated_at=now()
from _u28_chinese_quiz_pinyin_safety_current c
where q.question_id=c.question_id
  and q.revision=c.revision
  and q.status in ('approved','draft');

insert into private.quiz_question_bank (
 question_id,revision,learning_language_code,translation_language_code,
 source_lesson_id,topic_id,difficulty,prompt_learning,prompt_translation,
 options,correct_option_id,explanation_learning,explanation_translation,
 status,approved_at,question_type,answer_language_code,learning_objective_id,
 prompt_pinyin,explanation_pinyin
)
select
 c.question_id,c.revision+1,c.learning_language_code,c.translation_language_code,
 c.source_lesson_id,c.topic_id,c.difficulty,c.prompt_learning,c.prompt_translation,
 c.options,c.correct_option_id,c.explanation_learning,c.explanation_translation,
 c.status,case when c.status='approved' then now() else null end,
 c.question_type,c.answer_language_code,c.learning_objective_id,
 null,c.explanation_pinyin
from _u28_chinese_quiz_pinyin_safety_current c;

commit;
