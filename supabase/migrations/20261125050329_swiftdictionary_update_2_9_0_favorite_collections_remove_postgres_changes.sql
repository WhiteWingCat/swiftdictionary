-- Favorite Collections now use private account-scoped Broadcast topics.
-- Remove the tables from Postgres Changes because DELETE events cannot be
-- filtered and DELETE RLS is not enforced by Supabase Realtime.
alter publication supabase_realtime drop table public.favorite_collections;
alter publication supabase_realtime drop table public.favorite_collection_items;
