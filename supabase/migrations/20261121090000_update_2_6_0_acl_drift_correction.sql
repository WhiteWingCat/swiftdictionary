-- SwiftDictionary Update 2.6.0 — production/staging ACL drift correction.
-- Safe to apply after migrations 20261119112433 and 20261120023718.
-- Resolves known legacy differences between Tokyo production and Singapore
-- staging without renaming or dropping any sequence.
--
-- This migration changes grants only. It does not read or modify learner rows.

-- Account-owned Daily Learning sessions: anon has no direct table access;
-- authenticated retains owner-scoped INSERT/SELECT/UPDATE, but no direct
-- DELETE or table-maintenance/DDL-style privileges.
REVOKE ALL PRIVILEGES ON TABLE public.daily_activity_sessions FROM anon;
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
  ON TABLE public.daily_activity_sessions
  FROM authenticated;

-- Plan-limit configuration is authenticated-only, not anonymously readable.
REVOKE ALL PRIVILEGES ON TABLE public.learning_plan_limits FROM anon;

-- These two identity sequences have stable names in both environments.
REVOKE ALL PRIVILEGES ON SEQUENCE
  public.learning_activity_log_id_seq,
  public.lesson_progress_id_seq
  FROM anon;

-- The practice-results identity sequence has a different name in the two
-- environments. Resolve the actual sequence owned by the id column rather
-- than assuming its name. Fail closed if the relationship is missing.
DO $migration$
DECLARE
  owned_sequence text;
BEGIN
  owned_sequence := pg_get_serial_sequence(
    'public.lesson_practice_results',
    'id'
  );

  IF owned_sequence IS NULL THEN
    RAISE EXCEPTION
      'Could not resolve sequence owned by public.lesson_practice_results.id';
  END IF;

  EXECUTE format(
    'REVOKE ALL PRIVILEGES ON SEQUENCE %s FROM anon',
    owned_sequence::regclass
  );
END;
$migration$;
