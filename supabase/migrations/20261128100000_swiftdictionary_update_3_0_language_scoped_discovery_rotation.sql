-- SwiftDictionary U3.0 — make Daily Discovery rotation order language-scoped.
-- The original U2.3 index enforced one global rotation_order across every
-- language. That prevented Malay from using the same ordered 1..N rotation
-- as English. Keep uniqueness within each language instead.
begin;

drop index if exists private.learning_content_catalog_discovery_order_idx;

create unique index learning_content_catalog_discovery_order_idx
  on private.learning_content_catalog(language_code, rotation_order)
  where activity_type = 'daily_discovery' and is_active;

do $assert$
begin
  if not exists (
    select 1 from pg_catalog.pg_indexes
    where schemaname='private'
      and indexname='learning_content_catalog_discovery_order_idx'
      and indexdef ilike '%(language_code, rotation_order)%'
  ) then
    raise exception 'Daily Discovery rotation order must be unique per language';
  end if;
end;
$assert$;

commit;
