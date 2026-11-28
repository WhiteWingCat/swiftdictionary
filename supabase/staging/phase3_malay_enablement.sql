
-- SwiftDictionary U3.0 Phase 3 Malay support. Dedicated staging project only.
insert into public.languages(code,is_active) values('ms',true)
on conflict(code) do update set is_active=excluded.is_active;

alter table public.lesson_progress drop constraint if exists lesson_progress_learning_language_check;
alter table public.lesson_progress add constraint lesson_progress_learning_language_check
 check(learning_language = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table public.lesson_progress validate constraint lesson_progress_learning_language_check;

alter table public.lesson_practice_results drop constraint if exists lesson_practice_results_learning_language_check;
alter table public.lesson_practice_results add constraint lesson_practice_results_learning_language_check
 check(learning_language = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table public.lesson_practice_results validate constraint lesson_practice_results_learning_language_check;

alter table private.lesson_practice_attempts drop constraint if exists lesson_practice_attempts_learning_language_check;
alter table private.lesson_practice_attempts add constraint lesson_practice_attempts_learning_language_check
 check(learning_language = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table private.lesson_practice_attempts validate constraint lesson_practice_attempts_learning_language_check;

alter table private.learning_content_catalog drop constraint if exists learning_content_catalog_language_code_check;
alter table private.learning_content_catalog add constraint learning_content_catalog_language_code_check
 check(language_code = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table private.learning_content_catalog validate constraint learning_content_catalog_language_code_check;

alter table public.saved_words drop constraint if exists saved_words_course_check;
alter table public.saved_words add constraint saved_words_course_check
 check(course = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table public.saved_words validate constraint saved_words_course_check;

create or replace function private.guard_lesson_progress_insert()
returns trigger language plpgsql security definer set search_path to ''
as $function$
begin
  if auth.uid() is null or auth.uid() <> new.user_id then
    raise exception 'Authentication required for own lesson progress' using errcode = '42501';
  end if;
  if new.learning_language is null
     or not exists (select 1 from public.languages l where l.code=new.learning_language and l.is_active)
     or not private.is_approved_learning_content('permanent_lesson',new.lesson_id,null,new.difficulty,new.learning_language,'daily') then
    raise exception 'Lesson is not part of the approved learning catalogue for this course' using errcode = '22023';
  end if;
  return new;
end;
$function$;

create or replace function public.complete_permanent_lesson_for_language(
 p_learning_language text,p_difficulty text,p_lesson_id text,p_topic_id text,p_correct_count integer,p_question_count integer
)
returns public.lesson_progress language plpgsql set search_path to ''
as $function$
declare
 v_user uuid := auth.uid();
 v_progress public.lesson_progress%rowtype;
begin
 if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if p_learning_language is null
    or not exists(select 1 from public.languages l where l.code=p_learning_language and l.is_active)
    or p_difficulty is null or p_difficulty not in ('beginner','intermediate','advanced')
    or p_lesson_id is null or p_lesson_id<>pg_catalog.btrim(p_lesson_id)
    or pg_catalog.char_length(p_lesson_id)<1 or pg_catalog.char_length(p_lesson_id)>120
    or p_topic_id is null or p_topic_id<>pg_catalog.btrim(p_topic_id)
    or pg_catalog.char_length(p_topic_id)<1 or pg_catalog.char_length(p_topic_id)>120
    or p_correct_count is null or p_question_count is null
    or p_question_count<=0 or p_correct_count<0 or p_correct_count>p_question_count then
   raise exception 'Invalid lesson identity, course or aggregate practice result' using errcode='22023';
 end if;
 if not private.is_approved_learning_content('permanent_lesson',p_lesson_id,p_topic_id,p_difficulty,p_learning_language,'daily') then
   raise exception 'Lesson identity, topic or course is not part of the approved learning catalogue' using errcode='22023';
 end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
 select * into v_progress from public.lesson_progress
 where user_id=v_user and learning_language=p_learning_language and difficulty=p_difficulty and lesson_id=p_lesson_id for update;
 if not found then raise exception 'Start this lesson before completing it' using errcode='P0002'; end if;
 if v_progress.status='completed' then return v_progress; end if;
 perform pg_catalog.set_config('swiftdictionary.lesson_topic_id',p_topic_id,true);
 perform pg_catalog.set_config('swiftdictionary.lesson_correct_count',p_correct_count::text,true);
 perform pg_catalog.set_config('swiftdictionary.lesson_question_count',p_question_count::text,true);
 perform pg_catalog.set_config('swiftdictionary.lesson_completion_rpc','on',true);
 update public.lesson_progress set status='completed',completed_at=pg_catalog.now()
 where id=v_progress.id and status='in_progress' returning * into v_progress;
 if not found then raise exception 'Lesson completion could not be saved' using errcode='40001'; end if;
 perform pg_catalog.set_config('swiftdictionary.lesson_completion_rpc','off',true);
 perform pg_catalog.set_config('swiftdictionary.lesson_topic_id','',true);
 perform pg_catalog.set_config('swiftdictionary.lesson_correct_count','',true);
 perform pg_catalog.set_config('swiftdictionary.lesson_question_count','',true);
 return v_progress;
end;
$function$;

create or replace function private.record_completed_lesson_practice_result_for_language_impl(
 p_learning_language text,p_difficulty text,p_lesson_id text,p_topic_id text,p_correct_count integer,p_question_count integer
)
returns boolean language plpgsql security definer set search_path to ''
as $function$
declare
 v_user uuid:=auth.uid();
 v_progress_id bigint;
 v_inserted_id bigint;
begin
 if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if p_learning_language is null
    or not exists(select 1 from public.languages l where l.code=p_learning_language and l.is_active)
    or p_difficulty is null or p_difficulty not in ('beginner','intermediate','advanced')
    or p_lesson_id is null or p_lesson_id<>pg_catalog.btrim(p_lesson_id)
    or pg_catalog.char_length(p_lesson_id)<1 or pg_catalog.char_length(p_lesson_id)>120
    or p_topic_id is null or p_topic_id<>pg_catalog.btrim(p_topic_id)
    or pg_catalog.char_length(p_topic_id)<1 or pg_catalog.char_length(p_topic_id)>120
    or p_correct_count is null or p_question_count is null
    or p_question_count<=0 or p_correct_count<0 or p_correct_count>p_question_count then
   raise exception 'Invalid lesson identity, course or aggregate practice result' using errcode='22023';
 end if;
 if not private.is_approved_learning_content('permanent_lesson',p_lesson_id,p_topic_id,p_difficulty,p_learning_language,'daily') then
   raise exception 'Lesson identity, topic or course is not part of the approved learning catalogue' using errcode='22023';
 end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
 select id into v_progress_id from public.lesson_progress
 where user_id=v_user and learning_language=p_learning_language and difficulty=p_difficulty
   and lesson_id=p_lesson_id and status='completed';
 if not found then raise exception 'Only a completed lesson can receive a replay practice summary' using errcode='P0002'; end if;
 insert into public.lesson_practice_results(user_id,learning_language,difficulty,lesson_id,topic_id,correct_count,question_count)
 values(v_user,p_learning_language,p_difficulty,p_lesson_id,p_topic_id,p_correct_count,p_question_count)
 on conflict(user_id,learning_language,difficulty,lesson_id) do nothing returning id into v_inserted_id;
 return v_inserted_id is not null;
end;
$function$;
