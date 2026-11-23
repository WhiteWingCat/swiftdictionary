-- Resolve Supabase auth_rls_initplan warnings without changing row ownership.
begin;
drop policy if exists "Users can read their own learning page introduction preferences" on public.learning_page_introduction_preferences;
drop policy if exists "Users can create their own learning page introduction preferenc" on public.learning_page_introduction_preferences;
drop policy if exists "Users can update their own learning page introduction preferenc" on public.learning_page_introduction_preferences;
drop policy if exists "Users can delete their own learning page introduction preferenc" on public.learning_page_introduction_preferences;
create policy "Users can read their own learning page introduction preferences"
on public.learning_page_introduction_preferences for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Users can create their own learning page introduction preferenc"
on public.learning_page_introduction_preferences for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "Users can update their own learning page introduction preferenc"
on public.learning_page_introduction_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "Users can delete their own learning page introduction preferenc"
on public.learning_page_introduction_preferences for delete to authenticated
using ((select auth.uid()) = user_id);
commit;