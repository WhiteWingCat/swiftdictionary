-- SwiftDictionary Update 2.6.0 — staging ACL follow-up draft.
-- Generated from the 20 November 2026 read-only staging audit.
-- This is NOT a numbered Supabase migration. Generate the permanent migration
-- with `supabase migration new update_2_6_0_remove_residual_api_privileges`
-- before applying it to any hosted project.
--
-- Scope is deliberately narrow:
--   * Remove non-Data-API table privileges left on eight legacy public tables.
--   * Remove anonymous UPDATE (setval) on the three remaining public sequences.
-- Preserve existing SELECT/DML grants and RLS policies, including public
-- SELECT on languages and learning_plan_limits.

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
