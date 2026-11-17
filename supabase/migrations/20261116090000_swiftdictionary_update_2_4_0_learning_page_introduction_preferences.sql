-- Update 2.4.0: account-scoped learning page introduction dismissals.
-- Draft migration only. Apply to a disposable/staging database after review;
-- do not apply to production as part of this implementation step.

create table if not exists public.learning_page_introduction_preferences (
  user_id uuid not null references auth.users(id) on delete cascade,
  page_key text not null check (page_key in ('lessons', 'quiz', 'flashcards')),
  dismissed_at timestamptz not null default now(),
  primary key (user_id, page_key)
);

alter table public.learning_page_introduction_preferences enable row level security;

revoke all on table public.learning_page_introduction_preferences from public, anon;
revoke all on table public.learning_page_introduction_preferences from authenticated;
grant select, insert, update, delete on table public.learning_page_introduction_preferences to authenticated;
grant select, insert, update, delete on table public.learning_page_introduction_preferences to service_role;

drop policy if exists "Users can read their own learning page introduction preferences" on public.learning_page_introduction_preferences;
create policy "Users can read their own learning page introduction preferences"
  on public.learning_page_introduction_preferences
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own learning page introduction preferences" on public.learning_page_introduction_preferences;
create policy "Users can create their own learning page introduction preferences"
  on public.learning_page_introduction_preferences
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own learning page introduction preferences" on public.learning_page_introduction_preferences;
create policy "Users can update their own learning page introduction preferences"
  on public.learning_page_introduction_preferences
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own learning page introduction preferences" on public.learning_page_introduction_preferences;
create policy "Users can delete their own learning page introduction preferences"
  on public.learning_page_introduction_preferences
  for delete to authenticated
  using (auth.uid() = user_id);
