\set ON_ERROR_STOP on
do $assert_malay_quiz_drafts$
declare
 v_total integer;
 v_en integer;
 v_zh integer;
 v_bad integer;
begin
 select count(*) into v_total
 from private.quiz_question_bank
 where question_id like 'quiz-ms-%';
 select count(*) into v_en
 from private.quiz_question_bank
 where question_id like 'quiz-ms-en-%';
 select count(*) into v_zh
 from private.quiz_question_bank
 where question_id like 'quiz-ms-zh-%';
 select count(*) into v_bad
 from private.quiz_question_bank
 where question_id like 'quiz-ms-%'
   and (status<>'draft' or approved_at is not null
     or learning_language_code<>'ms' or answer_language_code<>'ms'
     or question_type<>'knowledge');
 if v_total<>96 or v_en<>48 or v_zh<>48 or v_bad<>0 then
   raise exception 'Malay Quiz draft import expected 96 total (48 per pair), all draft. Got total %, en %, zh %, invalid %',v_total,v_en,v_zh,v_bad;
 end if;
 if exists(
   select 1 from private.quiz_question_bank
   where question_id like 'quiz-ms-%'
   group by translation_language_code,difficulty
   having count(*)<>16
 ) then
   raise exception 'Malay Quiz draft import must contain 16 questions per difficulty and support language';
 end if;
end;
$assert_malay_quiz_drafts$;
