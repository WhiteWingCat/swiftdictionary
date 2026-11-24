-- U2.8.0: let an authenticated learner dismiss one weak-memory review item.
-- This removes only the review-queue row; game sessions and mastery statistics remain intact.

create or replace function private.dismiss_my_flashcard_review_item_impl(
  p_card_key text,
  p_mode text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_removed integer := 0;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_card_key is null
     or p_card_key <> pg_catalog.btrim(p_card_key)
     or pg_catalog.char_length(p_card_key) < 6
     or pg_catalog.char_length(p_card_key) > 180 then
    raise exception 'Invalid flashcard key' using errcode = '22023';
  end if;

  if p_mode is null
     or p_mode not in ('word','definition','translation','mixed','sentence') then
    raise exception 'Invalid Flash Recall mode' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user_id::text, 0));

  delete from private.flashcard_review_items
  where user_id = v_user_id
    and card_key = p_card_key
    and mode = p_mode;

  get diagnostics v_removed = row_count;

  return pg_catalog.jsonb_build_object('dismissed',v_removed > 0,'removed_count',v_removed);
end;
$function$;

revoke all on function private.dismiss_my_flashcard_review_item_impl(text,text)
  from public, anon, authenticated, service_role;
grant execute on function private.dismiss_my_flashcard_review_item_impl(text,text)
  to authenticated;

create or replace function public.dismiss_my_flashcard_review_item(p_card_key text,p_mode text)
returns jsonb
language sql
security invoker
set search_path = ''
as $function$
  select private.dismiss_my_flashcard_review_item_impl(p_card_key,p_mode);
$function$;

revoke all on function public.dismiss_my_flashcard_review_item(text,text)
  from public, anon, service_role;
grant execute on function public.dismiss_my_flashcard_review_item(text,text)
  to authenticated;
