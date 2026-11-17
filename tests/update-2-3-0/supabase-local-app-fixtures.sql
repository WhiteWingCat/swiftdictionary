-- Synthetic legacy-state fixtures for disposable CI only.
-- NEVER run this file against any hosted Supabase project.
-- Split from supabase-local-app-baseline.sql so the staging bootstrap itself
-- contains no test identities or learner history.

insert into auth.users(id) values
  ('11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222222'),
  ('33333333-3333-4333-8333-333333333333'),
  ('44444444-4444-4444-8444-444444444444');

insert into public.user_preferences(user_id, timezone)
values
  ('11111111-1111-4111-8111-111111111111', 'Asia/Kuala_Lumpur'),
  ('22222222-2222-4222-8222-222222222222', 'Asia/Kuala_Lumpur'),
  ('33333333-3333-4333-8333-333333333333', 'UTC'),
  ('44444444-4444-4444-8444-444444444444', 'UTC');

insert into public.user_entitlements(user_id, plan_code, status)
values
  ('11111111-1111-4111-8111-111111111111', 'free', 'active'),
  ('22222222-2222-4222-8222-222222222222', 'free', 'active'),
  ('33333333-3333-4333-8333-333333333333', 'free', 'active'),
  ('44444444-4444-4444-8444-444444444444', 'premium', 'active');

-- Historical rows deliberately reproduce the pre-migration one-start-log-per-lesson model.
-- Sorted lesson IDs keep timestamp tie-breaking deterministic for the backfill.
do $$
declare
  i integer;
  v_status text;
begin
  for i in 1..6 loop
    v_status := case when i <= 4 then 'completed' else 'in_progress' end;
    insert into public.lesson_progress(user_id, difficulty, lesson_id, status, completed_at)
    values (
      '11111111-1111-4111-8111-111111111111',
      'beginner',
      'legacy-' || lpad(i::text, 2, '0'),
      v_status,
      case when v_status = 'completed' then now() else null end
    );
  end loop;

  for i in 1..6 loop
    insert into public.lesson_progress(user_id, difficulty, lesson_id, status)
    values (
      '22222222-2222-4222-8222-222222222222',
      'beginner',
      'exempt-' || lpad(i::text, 2, '0'),
      'in_progress'
    );
  end loop;
end;
$$;
