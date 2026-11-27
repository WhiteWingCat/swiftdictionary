
-- SwiftDictionary U3.0 Phase 3 — staging-only Malay language enablement.
-- Target project: ivatvkfrtifgfheeaelj (SwiftDictionary Indie Staging).
-- Safe to apply only to the dedicated staging project; do not run in production.

insert into public.languages (code, is_active)
values ('ms', true)
on conflict (code) do update set is_active = excluded.is_active;

alter table public.lesson_progress
  drop constraint if exists lesson_progress_learning_language_check;
alter table public.lesson_progress
  add constraint lesson_progress_learning_language_check
  check (learning_language = any (array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table public.lesson_progress
  validate constraint lesson_progress_learning_language_check;

alter table public.lesson_practice_results
  drop constraint if exists lesson_practice_results_learning_language_check;
alter table public.lesson_practice_results
  add constraint lesson_practice_results_learning_language_check
  check (learning_language = any (array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table public.lesson_practice_results
  validate constraint lesson_practice_results_learning_language_check;

alter table private.lesson_practice_attempts
  drop constraint if exists lesson_practice_attempts_learning_language_check;
alter table private.lesson_practice_attempts
  add constraint lesson_practice_attempts_learning_language_check
  check (learning_language = any (array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table private.lesson_practice_attempts
  validate constraint lesson_practice_attempts_learning_language_check;

alter table private.learning_content_catalog
  drop constraint if exists learning_content_catalog_language_code_check;
alter table private.learning_content_catalog
  add constraint learning_content_catalog_language_code_check
  check (language_code = any (array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table private.learning_content_catalog
  validate constraint learning_content_catalog_language_code_check;

alter table public.saved_words
  drop constraint if exists saved_words_course_check;
alter table public.saved_words
  add constraint saved_words_course_check
  check (course = any (array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table public.saved_words
  validate constraint saved_words_course_check;

-- Rebuild only the explicit en/zh allowlists from the currently deployed
-- function definitions. This preserves the rest of each function body,
-- security mode, search_path, owner, grants, locking and replay semantics.
do $migration$
declare
  v_definition text;
  v_old text;
  v_new text;
begin
  v_definition := pg_catalog.pg_get_functiondef(
    'private.guard_lesson_progress_insert()'::regprocedure
  );
  v_old := 'new.learning_language not in (''en'',''zh'')';
  v_new := 'not exists (select 1 from public.languages l where l.code = new.learning_language and l.is_active)';
  if pg_catalog.position(v_old in v_definition) = 0 then
    raise exception 'Expected language allowlist not found in guard_lesson_progress_insert';
  end if;
  execute pg_catalog.replace(v_definition, v_old, v_new);

  v_definition := pg_catalog.pg_get_functiondef(
    'public.complete_permanent_lesson_for_language(text,text,text,text,integer,integer)'::regprocedure
  );
  v_old := 'p_learning_language not in (''en'',''zh'')';
  v_new := 'not exists (select 1 from public.languages l where l.code = p_learning_language and l.is_active)';
  if pg_catalog.position(v_old in v_definition) = 0 then
    raise exception 'Expected language allowlist not found in complete_permanent_lesson_for_language';
  end if;
  execute pg_catalog.replace(v_definition, v_old, v_new);

  v_definition := pg_catalog.pg_get_functiondef(
    'private.record_completed_lesson_practice_result_for_language_impl(text,text,text,text,integer,integer)'::regprocedure
  );
  v_old := 'p_learning_language not in (''en'',''zh'')';
  v_new := 'not exists (select 1 from public.languages l where l.code = p_learning_language and l.is_active)';
  if pg_catalog.position(v_old in v_definition) = 0 then
    raise exception 'Expected language allowlist not found in record_completed_lesson_practice_result_for_language_impl';
  end if;
  execute pg_catalog.replace(v_definition, v_old, v_new);
end
$migration$;
