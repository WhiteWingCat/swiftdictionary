-- Update 2.6.0 least-privilege migration regression tests.
-- Run against a disposable local Supabase/Postgres database after applying all
-- existing migrations and the 2.6.0 migration. All probes roll back.

BEGIN;

DO $test$
DECLARE
  t oid := 'public.daily_activity_sessions'::regclass;
  f_daily oid := 'public.guard_daily_activity_session_update()'::regprocedure;
  f_lesson oid := 'public.guard_lesson_progress_update()'::regprocedure;
BEGIN
  IF has_table_privilege('anon',t,'SELECT')
     OR has_table_privilege('anon',t,'INSERT')
     OR has_table_privilege('anon',t,'UPDATE')
     OR has_table_privilege('anon',t,'DELETE') THEN
    RAISE EXCEPTION 'anon unexpectedly has privileges on daily_activity_sessions';
  END IF;
  IF NOT has_table_privilege('authenticated',t,'SELECT')
     OR NOT has_table_privilege('authenticated',t,'INSERT')
     OR NOT has_table_privilege('authenticated',t,'UPDATE')
     OR has_table_privilege('authenticated',t,'DELETE') THEN
    RAISE EXCEPTION 'authenticated daily_activity_sessions grants are incorrect';
  END IF;
  IF has_function_privilege('anon',f_daily,'EXECUTE')
     OR has_function_privilege('authenticated',f_daily,'EXECUTE')
     OR has_function_privilege('anon',f_lesson,'EXECUTE')
     OR has_function_privilege('authenticated',f_lesson,'EXECUTE') THEN
    RAISE EXCEPTION 'Trigger-only guard functions are directly executable by API roles';
  END IF;
END;
$test$;

-- Prove new postgres-owned public objects do not inherit API-role CRUD/execute.
CREATE TABLE public.__swift_2_6_privilege_probe (id bigserial PRIMARY KEY, note text);
CREATE FUNCTION public.__swift_2_6_privilege_probe_fn()
RETURNS integer LANGUAGE sql AS $$ SELECT 1 $$;

DO $test$
DECLARE
  t oid := 'public.__swift_2_6_privilege_probe'::regclass;
  s oid := 'public.__swift_2_6_privilege_probe_id_seq'::regclass;
  f oid := 'public.__swift_2_6_privilege_probe_fn()'::regprocedure;
BEGIN
  IF has_table_privilege('anon',t,'SELECT') OR has_table_privilege('anon',t,'INSERT')
     OR has_table_privilege('anon',t,'UPDATE') OR has_table_privilege('anon',t,'DELETE')
     OR has_table_privilege('authenticated',t,'SELECT') OR has_table_privilege('authenticated',t,'INSERT')
     OR has_table_privilege('authenticated',t,'UPDATE') OR has_table_privilege('authenticated',t,'DELETE') THEN
    RAISE EXCEPTION 'New public table inherited API CRUD privileges';
  END IF;
  IF has_sequence_privilege('anon',s,'USAGE') OR has_sequence_privilege('anon',s,'SELECT')
     OR has_sequence_privilege('authenticated',s,'USAGE') OR has_sequence_privilege('authenticated',s,'SELECT') THEN
    RAISE EXCEPTION 'New public sequence inherited API USAGE/SELECT privileges';
  END IF;
  IF has_function_privilege('anon',f,'EXECUTE')
     OR has_function_privilege('authenticated',f,'EXECUTE') THEN
    RAISE EXCEPTION 'New public function inherited API EXECUTE privileges';
  END IF;
END;
$test$;

-- Trigger functions must still run when an authenticated update fires them,
-- even though clients cannot call the functions directly as RPCs.
CREATE TEMP TABLE daily_guard_test (
  user_id uuid, activity_type text, language_code text, content_id text,
  topic_id text, difficulty text, source text, local_date date, timezone text,
  started_at timestamptz, created_at timestamptz, updated_at timestamptz,
  status text, completed_at timestamptz, correct_count integer, question_count integer
);
INSERT INTO daily_guard_test VALUES
('00000000-0000-4000-8000-000000000001','daily_topic','en','test',null,null,'daily',
 current_date,'UTC',now(),now(),now(),'in_progress',null,null,null);
CREATE TRIGGER daily_guard_test_trigger BEFORE UPDATE ON daily_guard_test
FOR EACH ROW EXECUTE FUNCTION public.guard_daily_activity_session_update();
GRANT UPDATE ON daily_guard_test TO authenticated;

CREATE TEMP TABLE lesson_guard_test (
  user_id uuid, difficulty text, lesson_id text, started_at timestamptz,
  status text, completed_at timestamptz, updated_at timestamptz
);
INSERT INTO lesson_guard_test VALUES
('00000000-0000-4000-8000-000000000001','beginner','test',now(),'in_progress',null,now());
CREATE TRIGGER lesson_guard_test_trigger BEFORE UPDATE ON lesson_guard_test
FOR EACH ROW EXECUTE FUNCTION public.guard_lesson_progress_update();
GRANT UPDATE ON lesson_guard_test TO authenticated;

SET LOCAL ROLE authenticated;
DO $test$
BEGIN
  BEGIN
    UPDATE pg_temp.daily_guard_test SET status='completed';
    RAISE EXCEPTION 'Daily guard did not reject an untrusted completion';
  EXCEPTION WHEN SQLSTATE '42501' THEN
    IF SQLERRM <> 'Use complete_daily_activity_session to save completion' THEN RAISE; END IF;
  END;
  BEGIN
    UPDATE pg_temp.lesson_guard_test SET status='completed', completed_at=now();
    RAISE EXCEPTION 'Lesson guard did not reject an untrusted completion';
  EXCEPTION WHEN SQLSTATE '42501' THEN
    IF SQLERRM <> 'Use complete_permanent_lesson to save lesson completion' THEN RAISE; END IF;
  END;
END;
$test$;

ROLLBACK;
