\set ON_ERROR_STOP on
do $assert_malay_quiz_release$
declare
 v_total integer;
 v_en integer;
 v_zh integer;
 v_invalid integer;
begin
 select count(*) into v_total from private.quiz_question_bank where question_id like 'quiz-ms-%';
 select count(*) into v_en from private.quiz_question_bank where question_id like 'quiz-ms-en-%';
 select count(*) into v_zh from private.quiz_question_bank where question_id like 'quiz-ms-zh-%';
 select count(*) into v_invalid
 from private.quiz_question_bank q
 where q.question_id like 'quiz-ms-%'
   and (q.status<>'approved' or q.approved_at is null
     or q.learning_language_code<>'ms' or q.answer_language_code<>'ms'
     or q.question_type<>'knowledge' or q.learning_objective_id is null
     or jsonb_array_length(q.options)<>4
     or q.prompt_learning ~* '^(choose|which|what|where|how|why|select|complete|in the phrase|in the sentence|you arrive|someone says|you are|the claim|two websites|original:)');
 if v_total<>240 or v_en<>120 or v_zh<>120 or v_invalid<>0 then
   raise exception 'Malay Quiz staging release expected 240 approved records (120 per pair), all valid. Got total %, en %, zh %, invalid %',v_total,v_en,v_zh,v_invalid;
 end if;
 if exists(
   select 1 from private.quiz_question_bank
   where question_id like 'quiz-ms-%'
   group by translation_language_code,difficulty
   having count(*)<>case when difficulty='advanced' then 48 else 36 end
 ) then
   raise exception 'Malay Quiz staging release must contain 36 Beginner, 36 Intermediate and 48 Advanced questions per support language';
 end if;
 if exists(
   select 1 from private.quiz_question_bank q
   left join private.learning_content_catalog c
     on c.activity_type='permanent_lesson'
    and c.content_id=q.source_lesson_id
    and c.topic_id=q.topic_id
    and c.difficulty=q.difficulty
    and c.language_code='ms'
    and c.is_active
   where q.question_id like 'quiz-ms-%' and c.content_id is null
 ) then raise exception 'Malay Quiz release contains a question without an exact active lesson catalogue mapping'; end if;
 if exists(
   select 1
   from private.quiz_question_bank en
   join private.quiz_question_bank zh
     on zh.question_id=replace(en.question_id,'quiz-ms-en-','quiz-ms-zh-')
    and zh.revision=en.revision
   where en.question_id like 'quiz-ms-en-%'
     and (en.prompt_learning<>zh.prompt_learning
       or en.explanation_learning<>zh.explanation_learning
       or en.correct_option_id<>zh.correct_option_id
       or (select jsonb_agg(x->>'learning_text' order by ordinality) from jsonb_array_elements(en.options) with ordinality as e(x,ordinality))
        <> (select jsonb_agg(x->>'learning_text' order by ordinality) from jsonb_array_elements(zh.options) with ordinality as e(x,ordinality)))
 ) then raise exception 'Malay learning text or answer keys differ between support-language packs'; end if;
end;
$assert_malay_quiz_release$;
