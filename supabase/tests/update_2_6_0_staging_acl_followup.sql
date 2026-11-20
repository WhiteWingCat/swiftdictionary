-- Update 2.6.0 staging ACL follow-up regression tests.
-- Run after the initial least-privilege migration and the follow-up ACL draft.
-- These assertions inspect grants only; no user rows are read or modified.

DO $test$
DECLARE
  table_name text;
  table_oid oid;
  sequence_name text;
  sequence_oid oid;
  api_role text;
  table_names text[] := ARRAY[
    'languages',
    'learning_activity_log',
    'learning_plan_limits',
    'lesson_practice_results',
    'lesson_progress',
    'profiles',
    'user_entitlements',
    'user_preferences'
  ];
  sequence_names text[] := ARRAY[
    'learning_activity_log_id_seq',
    'lesson_practice_results_id_seq',
    'lesson_progress_id_seq'
  ];
  privilege_name text;
BEGIN
  FOREACH table_name IN ARRAY table_names LOOP
    table_oid := format('public.%I', table_name)::regclass;
    FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      FOREACH privilege_name IN ARRAY ARRAY['TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN'] LOOP
        IF has_table_privilege(api_role, table_oid, privilege_name) THEN
          RAISE EXCEPTION '% still has % on public.%', api_role, privilege_name, table_name;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;

  FOREACH sequence_name IN ARRAY sequence_names LOOP
    sequence_oid := format('public.%I', sequence_name)::regclass;
    IF has_sequence_privilege('anon', sequence_oid, 'UPDATE') THEN
      RAISE EXCEPTION 'anon still has UPDATE (setval) on public.%', sequence_name;
    END IF;
  END LOOP;

  -- The cleanup must not remove the intended public configuration reads.
  IF NOT has_table_privilege('anon', 'public.languages', 'SELECT') THEN
    RAISE EXCEPTION 'anon SELECT on public.languages was unintentionally removed';
  END IF;
  IF NOT has_table_privilege('authenticated', 'public.learning_plan_limits', 'SELECT') THEN
    RAISE EXCEPTION 'authenticated SELECT on public.learning_plan_limits was unintentionally removed';
  END IF;
  IF has_table_privilege('anon', 'public.learning_plan_limits', 'SELECT') THEN
    RAISE EXCEPTION 'anon unexpectedly has SELECT on public.learning_plan_limits';
  END IF;
END;
$test$;
