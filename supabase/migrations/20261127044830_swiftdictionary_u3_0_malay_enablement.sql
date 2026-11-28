-- SwiftDictionary U3.0 — register Malaysian Standard Malay and enable lesson/catalogue language scope.
-- Additive language enablement; existing English and Chinese progress is untouched.
begin;

insert into public.languages(code,name,native_name,is_active)
values ('ms','Bahasa Melayu','Bahasa Melayu',true)
on conflict (code) do update
set name=excluded.name,native_name=excluded.native_name,is_active=true;

alter table public.lesson_progress
  drop constraint if exists lesson_progress_learning_language_check;
alter table public.lesson_progress
  add constraint lesson_progress_learning_language_check
  check (learning_language = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table public.lesson_progress
  validate constraint lesson_progress_learning_language_check;

alter table public.lesson_practice_results
  drop constraint if exists lesson_practice_results_learning_language_check;
alter table public.lesson_practice_results
  add constraint lesson_practice_results_learning_language_check
  check (learning_language = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table public.lesson_practice_results
  validate constraint lesson_practice_results_learning_language_check;

alter table private.learning_content_catalog
  drop constraint if exists learning_content_catalog_language_code_check;
alter table private.learning_content_catalog
  add constraint learning_content_catalog_language_code_check
  check (language_code = any(array['en'::text,'zh'::text,'ms'::text])) not valid;
alter table private.learning_content_catalog
  validate constraint learning_content_catalog_language_code_check;

commit;
