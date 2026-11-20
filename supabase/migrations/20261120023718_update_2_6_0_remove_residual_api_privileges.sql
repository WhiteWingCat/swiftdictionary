-- SwiftDictionary Update 2.6.0 — remove residual API-role privileges.
-- Initial filename generated with Supabase CLI v2.81.3 in disposable CI;
-- version synchronized to the hosted staging migration history.
-- Reviewed against the live Singapore staging ACL and validated in CI.
--
-- Scope:
--   * Remove non-Data-API table privileges left on eight legacy public tables.
--   * Remove anonymous UPDATE (setval) on the three remaining public sequences.
--
-- Preserve anon/authenticated SELECT on languages and authenticated-only
-- SELECT on learning_plan_limits. Existing normal DML grants and RLS policies
-- are intentionally unchanged.

REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
  ON TABLE
    public.languages,
    public.learning_activity_log,
    public.learning_plan_limits,
    public.lesson_practice_results,
    public.lesson_progress,
    public.profiles,
    public.user_entitlements,
    public.user_preferences
  FROM anon, authenticated;

REVOKE UPDATE ON SEQUENCE
  public.learning_activity_log_id_seq,
  public.lesson_practice_results_id_seq,
  public.lesson_progress_id_seq
  FROM anon;
