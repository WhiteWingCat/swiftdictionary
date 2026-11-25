-- SwiftDictionary U2.9.0 — enable owner-scoped Favorite Collections Realtime changes.
-- RLS remains the authorization boundary; publication membership only enables change delivery.
begin;
alter publication supabase_realtime add table public.favorite_collections;
alter publication supabase_realtime add table public.favorite_collection_items;
commit;
