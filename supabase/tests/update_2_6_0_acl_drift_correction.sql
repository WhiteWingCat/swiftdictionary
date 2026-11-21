-- Update 2.6.0 ACL drift-correction regression assertions.
-- Run after all migrations on a disposable Supabase/PostgreSQL 17 database.
-- This test reads ACL metadata only; it does not inspect learner rows.

DO $test$
DECLARE
  daily_sessions oid := 'public.daily_activity_sessions'::regclass;
  plan_limits oid := 'public.learning_plan_limits'::regclass;
  practice_sequence text;
  practice_sequence_oid oid;
  seq_name text;
BEGIN
  -- Anonymous visitors must have no direct access to account-owned sessions.
  IF has_table_privilege('anon', daily_sessions, 'SELECT')
     OR has_table_privilege('anon', daily_sessions, 'INSERT')
     OR has_table_privilege('anon', daily_sessions, 'UPDATE')
     OR has_table_privilege('anon', daily_sessions, 'DELETE')
     OR has_table_privilege('anon', daily_sessions, 'TRUNCATE')
     OR has_table_privilege('anon', daily_sessions, 'REFERENCES')
     OR has_table_privilege('anon', daily_sessions, 'TRIGGER')
     OR has_table_privilege('anon', daily_sessions, 'MAINTAIN') THEN
    RAISE EXCEPTION 'anon has unexpected privileges on daily_activity_sessions';
  END IF;

  -- Authenticated sessions retain only the expected DML operations.
  IF NOT has_table_privilege('authenticated', daily_sessions, 'SELECT')
     OR NOT has_table_privilege('authenticated', daily_sessions, 'INSERT')
     OR NOT has_table_privilege('authenticated', daily_sessions, 'UPDATE')
     OR has_table_privilege('authenticated', daily_sessions, 'DELETE')
     OR has_table_privilege('authenticated', daily_sessions, 'TRUNCATE')
     OR has_table_privilege('authenticated', daily_sessions, 'REFERENCES')
     OR has_table_privilege('authenticated', daily_sessions, 'TRIGGER')
     OR has_table_privilege('authenticated', daily_sessions, 'MAINTAIN') THEN
    RAISE EXCEPTION 'authenticated daily_activity_sessions privileges are incorrect';
  END IF;

  IF has_table_privilege('anon', plan_limits, 'SELECT')
     OR has_table_privilege('anon', plan_limits, 'INSERT')
     OR has_table_privilege('anon', plan_limits, 'UPDATE')
     OR has_table_privilege('anon', plan_limits, 'DELETE') THEN
    RAISE EXCEPTION 'anon has unexpected privileges on learning_plan_limits';
  END IF;
  IF NOT has_table_privilege('authenticated', plan_limits, 'SELECT') THEN
    RAISE EXCEPTION 'authenticated SELECT on learning_plan_limits is missing';
  END IF;

  FOREACH seq_name IN ARRAY ARRAY[
    'public.learning_activity_log_id_seq',
    'public.lesson_progress_id_seq'
  ] LOOP
    IF has_sequence_privilege('anon', seq_name::regclass, 'USAGE')
       OR has_sequence_privilege('anon', seq_name::regclass, 'SELECT')
       OR has_sequence_privilege('anon', seq_name::regclass, 'UPDATE') THEN
      RAISE EXCEPTION 'anon has unexpected privileges on %', seq_name;
    END IF;
  END LOOP;

  practice_sequence := pg_get_serial_sequence(
    'public.lesson_practice_results',
    'id'
  );
  IF practice_sequence IS NULL THEN
    RAISE EXCEPTION 'Could not resolve lesson_practice_results.id sequence';
  END IF;
  practice_sequence_oid := practice_sequence::regclass;

  IF has_sequence_privilege('anon', practice_sequence_oid, 'USAGE')
     OR has_sequence_privilege('anon', practice_sequence_oid, 'SELECT')
     OR has_sequence_privilege('anon', practice_sequence_oid, 'UPDATE') THEN
    RAISE EXCEPTION 'anon has unexpected privileges on owned sequence %',
      practice_sequence;
  END IF;
END;
$test$;


-- Verify default function privileges remain least-privilege in public while
-- preserving extension-schema compatibility after the global PUBLIC revoke.
CREATE FUNCTION public.__swift_2_6_public_default_probe()
RETURNS integer LANGUAGE sql AS $$ SELECT 1 $$;
CREATE FUNCTION extensions.__swift_2_6_extension_default_probe()
RETURNS integer LANGUAGE sql AS $$ SELECT 1 $$;

DO $test$
BEGIN
  IF has_function_privilege(
    'anon', 'public.__swift_2_6_public_default_probe()', 'EXECUTE'
  ) OR has_function_privilege(
    'authenticated', 'public.__swift_2_6_public_default_probe()', 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'New public function unexpectedly inherits client EXECUTE';
  END IF;

  IF NOT has_function_privilege(
    'anon', 'extensions.__swift_2_6_extension_default_probe()', 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'New extensions function lost its pre-existing PUBLIC EXECUTE default';
  END IF;
END;
$test$;

DROP FUNCTION public.__swift_2_6_public_default_probe();
DROP FUNCTION extensions.__swift_2_6_extension_default_probe();
