-- Simulate the Tokyo production identity-sequence name in disposable CI.
-- The identity dependency follows the sequence OID across a rename.
ALTER SEQUENCE public.lesson_practice_results_id_seq
  RENAME TO lesson_practice_results_id_seq1;
